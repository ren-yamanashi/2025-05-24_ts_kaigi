<script>
import props from '../utils/props';
export default {
  props,
  setup() {
    
  },
}
</script>
<template>
  <div class="slidev-layout l-cover flex items-center justify-center">
    <div class="absolute w-full bg-white pt-12 pb-2 border-t-4 border-b-4 border-vpurple text-center">
      <slot />
    </div>
  </div>
  <div class="more-info-text-container">
    <p class="more-info-text text-vsecondary">
      2025/05/24
      <br />
      山梨 蓮
    </p>
  </div>
</template>

<style scoped lang="postcss">
::v-deep(h1) {
  @apply !text-5xl text-vprimary;
  font-size: 35px !important;
  font-weight: 600;
}

::v-deep(h2) {
  @apply !text-4xl text-vprimary;
  font-size: 30px !important;
  font-weight: 600;
}

::v-deep(p) {
  @apply text-3xl text-vsecondary;
}
</style>

<style scoped>
.l-cover {
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
}

.more-info-text-container {
  position: absolute;
  top: 400px;
  left: 55%;
  transform: translateX(-50%);
  width: 100%;
}

.more-info-text {
  width: 100%;
  text-align: left;
  margin-top: 3.175rem;
  font-size: 1.25rem;
  position: relative;
}
</style>