<template>
  <div
    class="relative inline-flex items-center min-w-full px-3 py-0.5 group cursor-pointer hover:bg-accent/60 z-0"
    :class="{ 'is-selected !bg-accent': selected }"
    @click.prevent="$emit('select')"
  >
    <span v-show="selected" class="absolute left-0 inset-y-0 w-[1px] bg-primary" />
    <div class="opacity-70 group-hover:opacity-100 group-[.is-selected]:opacity-100 mr-2">
      <CodeBlock class="text-sm truncate" :code="instance.elementSelector" language="css" inline />
    </div>
  </div>
</template>

<script setup lang="ts">
import CodeBlock from '@/components/core/CodeBlock.vue';
import { ParsedStimulusControllerInstance } from '@/types/stimulus.ts';

defineProps<{
  instance: ParsedStimulusControllerInstance;
  selected?: boolean;
}>();

defineEmits(['select']);
</script>
