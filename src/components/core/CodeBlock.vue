<template>
  <template v-if="inline">
    <span class="inline font-mono">
      <code ref="element" :class="`language-${language}`">{{ code.trim() }}</code>
    </span>
  </template>
  <template v-else>
    <div class="group">
      <ScrollArea
        class="relative"
        :class="{ 'border border-neutral-200 dark:border-neutral-800 rounded-md': bordered }"
      >
        <CopyButton class="absolute top-2 right-2 transition-opacity opacity-0 group-hover:opacity-100" :text="code" />
        <div class="whitespace-pre p-4 text-sm font-mono">
          <code ref="element" :class="`language-${language}`">{{ code.trim() }}</code>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  </template>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import hljs from 'highlight.js/lib/core';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import CopyButton from '@/components/core/CopyButton.vue';

const element = ref(null);

withDefaults(
  defineProps<{
    code: string;
    language?: 'javascript' | 'css' | 'html';
    inline?: boolean;
    bordered?: boolean;
  }>(),
  {
    language: 'javascript',
    inline: false,
    bordered: true,
  },
);

onMounted(() => {
  if (element.value) {
    hljs.highlightElement(element.value);
  }
});
</script>
