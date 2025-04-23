<script setup>
  import { defineProps } from 'vue';
import defProps from '../utils/props';
  
  const props = defineProps({
    heading: String,
    ...defProps,
  })
</script>
<template>
  <div class="slidev-layout default center items-center justify-center flex flex-col">
    <h1 v-if="props.heading">{{ props.heading }}</h1>
    <div class="flex items-center justify-center h-full -m-12">
      <div>
        <slot/>
      </div>
    </div>
  </div>
</template>