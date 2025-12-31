<template>
  <div
    class="controller-definition relative flex w-full items-center gap-1.5 border-b border-dashed border-neutral-200/75 px-3 py-2 dark:border-neutral-700"
    :class="{ 'is-selected': isSelected }"
  >
    <div class="flex min-w-0 items-center gap-1.5 overflow-hidden">
      <span v-if="label.length > 1" class="truncate opacity-60" :title="definition.identifier">
        <template v-for="(part, index) in label.slice(0, -1)" :key="index">
          <span :class="{ 'line-through': definition.hasUnregisteredInstance }">{{ part }}</span> /
        </template>
      </span>

      <button
        class="shrink-0 text-left font-semibold before:absolute before:inset-0 before:content-[''] hover:underline"
        :class="{ underline: isSelected, 'line-through': definition.hasUnregisteredInstance }"
        :title="definition.identifier"
        @click="selectControllerDefinition(definition.identifier)"
      >
        {{ label[label.length - 1] }}
      </button>

      <Tooltip v-if="definition.hasUnregisteredInstance">
        <template #trigger>
          <div class="relative z-10 shrink-0">
            <LucideTriangleAlert class="size-3 text-orange-600 dark:text-orange-300" />
          </div>
        </template>
        <template #default>
          <p>Not registered</p>
        </template>
      </Tooltip>
      <p
        v-if="definition.instances.length > 1"
        class="shrink-0 rounded bg-neutral-200 px-1 text-sm text-black dark:bg-neutral-700 dark:text-white"
      >
        x{{ definition.instances.length }}
      </p>
      <Tooltip v-if="definition.hasLazyInstance">
        <template #trigger>
          <div class="relative z-10 shrink-0">
            <LucideZap class="size-3 text-purple-500 dark:text-purple-400" />
          </div>
        </template>
        <template #default>
          <p>Lazy-loaded</p>
        </template>
      </Tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useState } from '@/composables/useState';
import { ControllerDefinition } from '@/types/core';
import { LucideZap, LucideTriangleAlert } from 'lucide-vue-next';
import Tooltip from '@/components/ui/Tooltip.vue';

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
  @apply bg-neutral-50 dark:bg-neutral-700/30;
}

.controller-definition.is-selected {
  @apply bg-neutral-100 dark:bg-neutral-700/70;
}
</style>
