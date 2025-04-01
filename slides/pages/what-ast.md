---
layout: default
---

<style>
.mermaid {
  font-size: 1.5rem !important;
}
</style>

<section-title title="AST とは？" />

<div class="_bullet">

* コードをパースした抽象構文木(Abstract Syntax Tree)

</div>

<div v-click>

```mermaid
flowchart LR

字句解析 --トークン--> 構文解析 --> AST
```

</div>
