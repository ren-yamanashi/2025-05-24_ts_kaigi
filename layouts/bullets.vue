<script setup>
import { defineProps } from 'vue';
import defProps from '../utils/props';
  
  const props = defineProps({
    heading: String,
    ...defProps,
  })
</script>
<template>
  <div class="slidev-layout bullet">
    <h1 v-if="props.heading">{{ props.heading }}</h1>
    <div class="flex items-center justify-center h-full -m-12">
      <div class="text-2xl">
        <slot/>
      </div>
    </div>
  </div>
</template>

<style>
.bullet li {
  font-size: 21.5px !important;
  margin-bottom: 10px !important;
  margin-top: 10px !important;
}
</style>
<style lang="postcss">
.bullet ul {
  @apply !list-disc text-vprimary;
  font-size: 30px !important;
}
.bullet li::marker {
  @apply inline-block text-vpurple;
}
</style>