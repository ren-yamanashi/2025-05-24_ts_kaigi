<script setup lang="ts">
import { defineProps, ref } from "vue";

const props = defineProps({
  title: { type: String, required: true },
});

const title = ref(props.title);
</script>

<template>
  <div class="ma-auto w-auto text-center justify-center items-center flex flex-col">
    <p class="justify-start items-center flex items-center text-2xl">
      <slot />
      {{ title }}
    </p>
  </div>
</template>