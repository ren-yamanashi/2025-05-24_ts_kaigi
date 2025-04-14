# TypeScript の型システムを活用した ESLint カスタムルールの開発入門 ~固有ドメインにおけるコーディング規約を開発する~

## 全体像の説明

### 話すこと

- eslint とは何か
- ast とは何か
- eslint や typescript-eslint を使用したコーディング規約の開発手法

### 話さないこと

- どういうコーディング規約が良いか
- 他の linter(e.g. `biome`)との比較

### 全体の流れ

1. eslint / ast の簡単な概要
2. eslint を使用したカスタムルールの開発手法について
3. typescript-eslint を使用したカスタムルールの開発手法について

## eslint とは

- JavaScript / TypeScript などのコードを解析し、単純な構文エラーやコーディング規約に違反するコード(=特定のスタイル・ガイドラインに準拠していないコード)を検出するツール(Linter)
- eslint によってコーディング規約を自動化させることで、少ない負担でリポジトリ内のコードの書き方を統一させることができる
  - e.g. `if`文は必ず`{}`で囲うようにする(BlockStatement にする)
- CI などで eslint のコマンドを実行すれば、レビュー前に不適切なコードを発見でき、レビューコストの削減につながる

### eslint カスタムルールとは

- ただ、`eslint`や`typescript-eslint`で提供されていないが、コーディング規約として適用したいルールはある
- このように、提供されるルールがユースケースををカバーしていない場合に、カスタムルールを作成する
  - ドメイン(問題領域)が具体的になるほど、そこで必要なコーディング規約は適用されていないだろう
    - JS/TS といった抽象度ではなく、特定の OSS(AWS CDK など)や自社内プロジェクトなど、ドメインが具体的になるほど、提供されるルールはユースケースを満たさないだろう
- カスタムルールを利用することで、eslint にフックを追加できる(これは eslint が AST を走査する際に呼び出される)
- eslint がルール作成のためのモジュール(型情報)を提供してくれているので、それに沿ってルールを記述することでカスタムルールを作成することができる

  - つまり eslint が定義するインターフェースに沿ってルールを書けば動くので、(インターフェースさえ守っていれば)ルール作成自体に`eslint`モジュールは不要
  - 参照: https://eslint.org/docs/latest/extend/custom-rules

- カスタムルールの実装とは簡単に言うと、AST を使用してソースコードを解析するというもの。
  - AST 自体は eslint から提供されるので、自前でパースしたいすることは基本的にせず、受け取った AST を元に、要件に沿って条件分岐などを駆使しながら、該当のコーディング規約を適用する
  - (memo: eslint から提供される interface を参照しながら解説する)

## AST とは

- AST(Abstract Syntax Tree)はコードをパースした抽象構文木のこと。 JavaScript の場合は JavaScript オブジェクト(JSON)として表現される。

  - ソースコードを内部表現に変換する過程は、主に「字句解析」と「構文解析」
    - 字句解析: ソースコード(文字)を予約語や変数名・記号などのある程度の意味の塊(トークン)に分解する
      - e.g. `let count = 10;` というコードがあった場合、これを `let` (キーワード), `count` (変数名), `=` (代入演算子), `10` (数値リテラル), `;` (文の終わりを示す記号) のように、単語や記号ごとに区切っていくイメージ
    - 構文解析: 字句解析で得られたトークンの並び方を見て、プログラムの文法ルールに従って、全体の構造を解析する
      - `let count = 10;` であれば、「`let` というキーワードで `count` という名前の変数を宣言し、それに `=` を使って `10` という値を代入している」といった、トークン同士の関係性や意味を解釈する

- なぜ「抽象」構文木なのか

  - ソースコードには、書いた人によって微妙な違いが出ることがある(e.g. スペースの数が違ったり、括弧の使い方が少し違ったり)
    - このような違いがあっても、プログラムとしての意味は同じ、ということがある
    - AST は、そういった表面的な表現の違い（具象的な情報）を吸収し、コードの「本質的な意味」や「構造」だけを抽出して表現する。だから「抽象」構文木と呼ばれる。
    - これにより、見た目が少し違っても意味が同じコードであれば、似たような AST で表現されるため、ツール（例えば ESLint）がコードを分析しやすくなる。

- AST の利点

  - AST はコードの意味的な構造を表しているので、ESLint のようなツールは、この AST を調べることで、「変数名の付け方がルール違反だ」とか「この書き方は推奨されていない」といったことを判断できる
  - AST には、元のコードのどの部分に対応するかの位置情報なども含まれているので、「何行目のこの部分が問題です」と具体的に指摘することも可能

- eslint では、`espree` という parser でソースコードを解析(parse)して、AST を生成している
  - カスタムルールの開発者目線では、基本的に parser を意識することはない(parse された AST を意識するため)
- ast explorer を使用して、実際に`const one = 1`というコードの AST を見てみる
  - https://ast-explorer.dev/
  - `one`という変数名を使うな。という場合にどのようなカスタムルールになるのかのコードの紹介

## eslint カスタムルールの開発

- 簡単なカスタムルールを実際に作ってみる
  - 目的: カスタムルールの開発の流れをざっくり知ること
- `one`という変数名を使うな。という場合にどのようなカスタムルールになるのかのコードの紹介
  - 開発の流れ(自分の場合を紹介)
    - テストを書く
    - テストケースに書いたコードの AST の内容を見る
    - AST を見ながら、どのパターンを違反対象にしたいか確認し、コードを実装する
    - テストを走らせ、成功することを確認する
  - (memo: TDD 本を読んで、TDD に沿った内容にする)
    - (特に、テストケースは一つづつ書いたほうが良いのかといったところ)

## 型情報を活用したカスタム Lint ルールの開発

### なぜ、typescript-eslint が必要か

- eslint のみを使用した場合、TypeScript コードは対応されていない
  - `espree`は TS の parser ではなく、JS の parser のため、TS のコードは parse できない
- TypeScript コードを対象とする ESLint のカスタムルールを作成する場合は、`typescript-eslint`を使用するのが良い
  - `typescript-eslint`は`@typescript-eslint/parser`という parser を使用して、TypeScript コードを parse している
- typescript-eslint では、[@typescript-eslint/typescript-estree](https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/typescript-estree) で TypeScript の AST を生成し、[@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/parser) で ESLint が TypeScript のソースコードを lint できるようにしている

> A parser that produces an ESTree-compatible AST for TypeScript code.

引用: https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/typescript-estree

> An ESLint parser which leverages TypeScript ESTree to allow for ESLint to lint TypeScript source code.

引用: https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/parser

<!-- ### 実装 - No.1: TypeScript コードのルールを書く

- `typescript-eslint`からルール作成のためのメソッドが提供されるので、そのメソッドの中でルールを実装していく
- `interface`のプロパティには必ず`readonly`の付与を強制するルールを作る
  - 自動でコードが修正されるようにする(自動で`readonly`がつくようにする)
    - 開発の流れ(自分の場合を紹介)
      - テストを書く
      - テストケースに書いたコードの AST の内容を見る
      - AST を見ながら、どのパターンを違反対象にしたいか確認し、コードを実装する
      - テストを走らせ、成功することを確認する

### 実装 - No.2: 型情報を使用したルールを書く(より高度な Lint ルールの開発) -->

### 型情報を使用したカスタムルールの例

- AST Node から型情報を取り出し、型情報を使用したルールを書く
  - ルールの内容
    - 特定のクラスを必ず継承するようにする
      - 自前のエラークラスを定義する際には、必ず`Error`クラスを継承するようにする
    - 特定のクラスを継承している場合に、〇〇のようなコードを防ぐ
      - `Construct`を継承しているクラスの第二引数(Construct ID)は必ず PascalCase にする

### 仕組み

<!-- TODO: pascal-case-construct-id を`examples` に実装する -->

- typescript には、[`getTypeAtLocation`](https://github.com/microsoft/TypeScript/blob/v5.8.2/src/compiler/types.ts#L5160)という関数がある

  - これは、`Node`を受け取ると`Type`を返す関数
    - 親の型情報は`Type`interface の`getBaseType`関数で取得可能
  - つまりこの`getTypeAtLocation`関数を呼び出せれば、型情報(Type)を扱えるようになる

    - `getTypeAtLocation`は、typescript の[`TypeChecker`](https://github.com/microsoft/TypeScript/blob/v5.8.2/src/compiler/types.ts#L5051)(interface)に含まれているので、`typescript-eslint`を通じて、`TypeChecker`を呼び出す
    - 実際のコードは以下

    ```ts
    const parserServices = ESLintUtils.getParserServices(context); // ここまでtypescript-eslint
    const typeChecker = parserServices.program.getTypeChecker(); // ここからtypescript
    const type = typeChecker.getTypeAtLocation(node);
    ```

  - (memo: この辺りは [notion](https://www.notion.so/matesedu/ESLint-1468abc8fbd38053892dc54766d0bb2e) を参考に)
