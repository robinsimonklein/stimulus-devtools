<template>
  <span class="stimulus-devtools-code stimulus-devtools-code--inline inline font-mono" v-html="highlightedCode" />
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue';
import { useCodeHighlighter } from '@/composables/useCodeHighlighter.ts';

const { codeToHtml } = useCodeHighlighter();

const props = defineProps<{
  code: string;
  language: 'javascript' | 'css';
}>();

const formattedCode = computed(() => props.code?.trim() || '');

const highlightedCode = codeToHtml(formattedCode, toRef(props.language));
</script>

<style>
.shiki {
  background-color: transparent !important;
}

.stimulus-devtools-code--inline pre {
  display: inline;
}
</style>
