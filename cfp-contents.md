# TypeScript の型システムを活用した ESLint カスタムルールの開発入門 ~固有ドメインにおけるコーディング規約を開発する~

- 自己紹介
- 全体像の説明
- eslint とは
  - コーディング規約を適用
  - カスタムルールを作成可能
    - AST に繋げる
- AST とは
  - AST の理解を踏まえて、eslint のカスタムルールを作成
- eslint カスタムルールの開発
  - シナリオベースで開発の流れを解説
- 型情報を活用したカスタム Lint ルールの開発
  - 社内独自のルールなど、ドメインの抽象度が低く、より具体的(≒ 汎用性の低い)なルールを作る際には、型情報を活用した Lint ルールを作りたい
  - シナリオベースで開発の流れを解説

## 全体像の説明

- 話すこと

  - eslint とは何か
  - ast とは何か
  - eslint や typescript-eslint を使用したコーディング規約の開発手法

- 離さないこと
  - どういうコーディング規約が良いか

## eslint とは

- JavaScript / TypeScript などのコードを解析し、単純な構文エラーやコーディング規約に違反するコードを検出するツール
- eslint によってコーディング規約を自動化させることで、リポジトリ内のコードの書き方をメンバー間で統一させることができる
  - e.g. `if`文は必ず`{}`で囲うようにする(BlockStatement にする)
- CI などで eslint のコマンドを実行すれば、レビュー前に不適切なコードを発見でき、レビューコストの削減につながる
- ただ、`eslint`や`typescript-eslint`で提供されていないが、コーディング規約として適用したいルールはある
  - そのための、eslint カスタムルール

## eslint カスタムルールとは

- カスタムルールを利用することで、eslint にフックを追加できる(これは eslint が AST を走査する際に呼び出される)
- eslint がルール作成のためのモジュール(型情報)を提供してくれているので、それに沿ってルールを記述することでカスタムルールを作成することができる

  - つまり eslint が定義するインターフェースに沿ってルールを書けば動くので、(インターフェースさえ守っていれば)ルール作成自体に`eslint`モジュールは不要
  - 参照: https://eslint.org/docs/latest/extend/custom-rules

- AST を受け取って、それに沿って条件分岐などを駆使しながら、該当のコーディング規約を適用する
  - (eslint から提供される interface を参照しながら解説)

## AST とは

- AST(Abstract Syntax Tree)はコードをパースした抽象構文木のこと。 JavaScript の場合は JavaScript オブジェクト(JSON)として表現される。
- ESLint では、espree という parser でソースコードを解析(parse)して、AST を生成している
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

## 型情報を活用したカスタム Lint ルールの開発

- 社内独自のコーディング規約など、ドメインの抽象度が低く、より具体的(≒ 汎用性の低い)なルールを作る際には、型情報を活用したいケースがある
- eslint のみを使用した場合、TypeScript コードは対応されていない
  - `espree`は TS の parser ではなく、JS の parser のため、TS のコードは parse できない
- TypeScript コードを対象とする ESLint のカスタムルールを作成する場合は、`typescript-eslint`を使用するのが良い

### 仕組み

- typescript-eslint では、[@typescript-eslint/typescript-estree](https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/typescript-estree) で TypeScript の AST を生成し、[@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/parser) で ESLint が TypeScript のソースコードを lint できるようにしている

> A parser that produces an ESTree-compatible AST for TypeScript code.

引用: https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/typescript-estree

> An ESLint parser which leverages TypeScript ESTree to allow for ESLint to lint TypeScript source code.

引用: https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/parser

### 実装 - No.1: TypeScript コードのルールを書く

- `typescript-eslint`からルール作成のためのメソッドが提供されるので、そのメソッドの中でルールを実装していく
- `interface`のプロパティには必ず`readonly`の付与を強制するルールを作る
  - 自動でコードが修正されるようにする(自動で`readonly`がつくようにする)
    - 開発の流れ(自分の場合を紹介)
      - テストを書く
      - テストケースに書いたコードの AST の内容を見る
      - AST を見ながら、どのパターンを違反対象にしたいか確認し、コードを実装する
      - テストを走らせ、成功することを確認する

### 実装 - No.2: 型情報を使用したルールを書く

- AST Node から型情報を取り出し、型情報を使用したルールを書く
  - 特定のクラスを必ず継承するようにする
    - 自前のエラークラスを定義する際には、必ず`Error`クラスを継承するようにする
  - 特定のクラスを継承している場合に、〇〇のようなコードを防ぐ
    - `Construct`を継承しているクラスの第二引数(Construct ID)は必ず PascalCase にする

#### 仕組み

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

  この辺りは [notion](https://www.notion.so/matesedu/ESLint-1468abc8fbd38053892dc54766d0bb2e) を参考に

- 実際のコード
  https://github.com/ren-yamanashi/eslint-cdk-plugin/blob/main/src/pascal-case-construct-id.mts
