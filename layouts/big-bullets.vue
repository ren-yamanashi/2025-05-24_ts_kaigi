<script setup>
  import { defineProps } from 'vue';
import defProps from '../utils/props';
  
  const props = defineProps({
    heading: String,
    ...defProps,
  })
</script>
<template>
  <div class="slidev-layout default big-bullet">
    <h1 v-if="props.heading">{{ props.heading }}</h1>
    <div class="flex items-center justify-center h-full -m-16">
      <div>
        <slot/>
      </div>
    </div>
  </div>
</template>

<style>
.big-bullet li {
  font-size: 20px !important;
  margin-bottom: 15px !important;
  margin-top: 15px !important;
}
</style>
<style lang="postcss">
.big-bullet ul {
  @apply !list-disc text-vprimary;
  font-size: 30px !important;
}
.big-bullet li::marker {
  @apply inline-block text-vpurple;
}
</style>