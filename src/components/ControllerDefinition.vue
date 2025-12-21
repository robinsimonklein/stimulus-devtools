<template>
  <div
    class="controller-definition relative flex items-center gap-1.5 border-b border-neutral-200 px-3 py-2 dark:border-neutral-700"
    :class="{ 'is-selected': isSelected }"
  >
    <p class="flex items-center gap-1 text-sm">
      <template v-for="(labelPart, index) in label" :key="index">
        <span v-if="index > 0" class="text-neutral-500 dark:text-neutral-400">/</span>
        <button
          v-if="index === label.length - 1"
          class="cursor-pointer font-bold before:absolute before:inset-0 before:content-[''] hover:underline"
          :class="{ underline: isSelected }"
          @click="selectControllerDefinition(definition.identifier)"
        >
          {{ labelPart }}
        </button>
        <span v-else class="text-neutral-500 dark:text-neutral-400">{{ labelPart }}</span>
      </template>
    </p>
    <p v-if="definition.instances.length > 1" class="rounded bg-neutral-200 px-1 text-xs dark:bg-neutral-700">
      x{{ definition.instances.length }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useState } from '@/composables/useState';
import { ControllerDefinition } from '@/types/core';

const { selectedControllerDefinition, selectControllerDefinition } = useState();

const props = defineProps<{
  definition: ControllerDefinition;
}>();

const label = computed(() => props.definition.identifier.split('--'));

const isSelected = computed(() => props.definition.identifier === selectedControllerDefinition.value?.identifier);
</script>

<style scoped>
@reference '@/entrypoints/devtools-panel/style.css';

.controller-definition:not(.is-selected):has(button:hover) {
  @apply bg-neutral-100 dark:bg-neutral-700/30;
}

.controller-definition.is-selected {
  @apply bg-neutral-200/70 dark:bg-neutral-700/70;
}
</style>
