<template>
  <div
    class="group relative z-0 inline-flex min-w-full cursor-pointer items-center px-3 py-0.5 hover:bg-accent/60"
    :class="{ 'is-selected !bg-accent': selected }"
    @click.prevent="$emit('select')"
    @mouseenter="executeAction('highlightElement', { selector: instance.uidSelector, title: instance.identifier })"
    @mouseleave="executeAction('stopHighlightElement')"
  >
    <span v-show="selected" class="absolute inset-y-0 left-0 w-[1px] bg-primary" />
    <div class="flex w-full items-center opacity-70 group-hover:opacity-100 group-[.is-selected]:opacity-100">
      <div class="mr-2">
        <CodeInline class="truncate text-sm" :code="instance.elementSelector" language="css" />
      </div>
      <button
        class="ml-auto opacity-0 group-hover:opacity-100"
        type="button"
        @click.stop="inspectElement(instance.uidSelector)"
      >
        <SquareDashedMousePointer class="h-4 w-4 opacity-60 hover:opacity-100" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ParsedStimulusControllerInstance } from '@/types/stimulus.ts';
import { inspectElement } from '@/utils';
import { SquareDashedMousePointer } from 'lucide-vue-next';
import { executeAction } from '@/utils/bridge.ts';
import CodeInline from '@/components/core/code/CodeInline.vue';

defineProps<{
  instance: ParsedStimulusControllerInstance;
  selected?: boolean;
}>();

defineEmits(['select']);
</script>
