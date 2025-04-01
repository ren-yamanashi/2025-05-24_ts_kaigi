<template>

  <div v-click="2">
    <slot name="mermaid" />
  </div>
  <div v-click="3" class="_bullet">
    <ul>
      <li>
        字句解析: ソースコード(文字)を予約語, 変数名, 記号などのある程度の意味の塊(トークン)に分解する
      </li>
    </ul>
  </div>
  <div v-click="[4]">
    <slot name="code" />
  </div>
</template>

<style scoped>

.slidev-vclick-hidden {
  display: none;
}


</style>