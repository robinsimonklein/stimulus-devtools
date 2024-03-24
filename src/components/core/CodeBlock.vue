<template>
  <div class="group">
    <ScrollArea class="relative">
      <CopyButton class="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100" :text="code" />
      <div class="whitespace-pre p-4 font-mono text-sm" v-html="highlightedCode" />
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  </div>
</template>

<script setup lang="ts">
import { toRef } from 'vue';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import CopyButton from '@/components/core/CopyButton.vue';
import { useCodeHighlighter } from '@/composables/useCodeHighlighter.ts';

const { codeToHtml } = useCodeHighlighter();

const props = defineProps<{
  code: string;
  language: 'javascript' | 'css';
}>();

const highlightedCode = codeToHtml(toRef(props.code), toRef(props.language));
</script>

<style>
.shiki {
  background-color: transparent !important;
}
</style>
