<template>
  <div class="group inline-flex items-center">
    <component :is="typeData.icon" :class="['mr-1', 'w-3.5', 'h-3.5', typeData.color]" />
    <span class="text-sm underline-offset-2" :class="{ 'group-hover:underline': clickable }">{{ typeData.label }}</span>
  </div>
</template>

<script setup lang="ts">
import { Component, computed } from 'vue';
import { CaseSensitive, Hash, ToggleRight, Braces, Brackets } from 'lucide-vue-next';

type ValueType = 'string' | 'number' | 'boolean' | 'object' | 'array';

const valueTypes: Record<ValueType, { label: string; icon: Component; color: string }> = {
  string: {
    label: 'String',
    icon: CaseSensitive,
    color: 'text-orange-700 dark:text-orange-500',
  },
  number: {
    label: 'Number',
    icon: Hash,
    color: 'text-blue-700 dark:text-blue-500',
  },
  boolean: {
    label: 'Boolean',
    icon: ToggleRight,
    color: 'text-green-700 dark:text-green-500',
  },
  object: {
    label: 'Object',
    icon: Braces,
    color: 'text-purple-700 dark:text-purple-500',
  },
  array: {
    label: 'Array',
    icon: Brackets,
    color: 'text-cyan-700 dark:text-cyan-500',
  },
};

const props = withDefaults(
  defineProps<{
    type: ValueType;
    clickable?: boolean;
  }>(),
  {
    clickable: false,
  },
);

const typeData = computed(() => {
  return valueTypes[props.type];
});
</script>
