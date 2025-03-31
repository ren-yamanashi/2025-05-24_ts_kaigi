---
layout: center
---

<style>
.slidev-code {
  font-size: 1.25rem !important;
  line-height: 30px !important;
  width: 75vw;
  height: 400px;
}
</style>

* ESLint から提供されるインターフェースに沿ってルールを書く

<div v-click>

* AST を使用してソースコードを解析

</div>

````md magic-move
```ts{*}
import { Rule } from "eslint";

export const noImportPrivate: Rule.RuleModule = {
  meta: {
    // ルールのメタデータを記述
  },
  create(context) {
    // ルールを記述
  },
};
```

```ts{8-10}
import { Rule } from "eslint";

export const noImportPrivate: Rule.RuleModule = {
  meta: {
    // ルールのメタデータを記述
  },
  create(context) {
    VariableDeclarator(node) {
      console.log(node) // AST に対する操作      
    }
  },
};
```
````
