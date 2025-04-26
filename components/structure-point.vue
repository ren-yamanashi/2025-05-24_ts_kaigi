<script setup lang="ts">
import { defineProps, ref } from "vue";

const props = defineProps({
	number: { type: [Number, String], required: true },
	title: { type: String, required: true },
	disabled: { type: Boolean, default: false },
});

const number = ref(props.number);
const title = ref(props.title);
</script>

<template>
	<div class="flex items-center gap-2 my-4" :class="{ 'opacity-50': disabled }">
		<div class="circle bg-vpurple text-white">
			<div class="circle-txt">{{ number }}</div>
		</div>
		<div>
			<span class="ma-0 pa-0 text-vpurple font-bold text-xl">{{ title }}</span>
			<br />
			<span><slot /></span>
		</div>
	</div>
</template>