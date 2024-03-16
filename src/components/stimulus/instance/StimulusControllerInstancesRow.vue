<template>
  <div
    class="relative inline-flex items-center min-w-full px-3 py-0.5 group cursor-pointer hover:bg-accent/60 z-0"
    :class="{ 'is-selected !bg-accent': selected }"
    @click.prevent="$emit('select')"
    @mouseenter="executeAction('highlightElement', { selector: instance.uidSelector, title: instance.identifier })"
    @mouseleave="executeAction('stopHighlightElement')"
  >
    <span v-show="selected" class="absolute left-0 inset-y-0 w-[1px] bg-primary" />
    <div class="opacity-70 group-hover:opacity-100 group-[.is-selected]:opacity-100 mr-2">
      <div class="inline-flex items-center">
        <CodeInline class="text-sm truncate" :code="instance.elementSelector" language="css" />
        <button
          class="ml-3 opacity-0 group-hover:opacity-100"
          type="button"
          @click.stop="inspectElement(instance.uidSelector)"
        >
          <SquareDashedMousePointer class="w-4 h-4 opacity-70 hover:opacity-100" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ParsedStimulusControllerInstance } from '@/types/stimulus.ts';
import { inspectElement } from '@/utils';
import { SquareDashedMousePointer } from 'lucide-vue-next';
import { executeAction } from '@/utils/contentScript.ts';
import CodeInline from '@/components/core/code/CodeInline.vue';

defineProps<{
  instance: ParsedStimulusControllerInstance;
  selected?: boolean;
}>();

defineEmits(['select']);
</script>
