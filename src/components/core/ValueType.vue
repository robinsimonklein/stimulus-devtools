<template>
  <div class="group inline-flex items-center">
    <component :is="typeData.icon" :class="['mr-1', 'w-3', 'h-3', typeData.color]" />
    <span class="underline-offset-2" :class="{ 'group-hover:underline': clickable }">{{ typeData.label }}</span>
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
    color: 'text-code-purple',
  },
  number: {
    label: 'Number',
    icon: Hash,
    color: 'text-code-orange',
  },
  boolean: {
    label: 'Boolean',
    icon: ToggleRight,
    color: 'text-code-green',
  },
  object: {
    label: 'Object',
    icon: Braces,
    color: 'text-code-red',
  },
  array: {
    label: 'Array',
    icon: Brackets,
    color: 'text-code-red',
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
