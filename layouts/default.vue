<script>
import props from "../utils/props";
export default {
  props,
  setup() {},
};
</script>
<template>
  <div class="slidev-layout default">
    <slot />
  </div>
</template>

<style lang="postcss">
.slidev-layout.default {
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  padding-left: 2.5rem;
  padding-right: 2.5rem;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}
</style>