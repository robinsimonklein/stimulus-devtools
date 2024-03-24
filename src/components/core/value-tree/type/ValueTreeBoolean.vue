<template>
  <ValueTreeWrapper :name :level @delete="$emit('delete')">
    <template #value>
      <span class="inline-block min-w-[43px] text-green-600 dark:text-green-400 font-mono">
        {{ modelValue.toString() }}
      </span>
    </template>
    <template #actions>
      <!-- Edit -->
      <Checkbox v-model:checked="modelValue" />
    </template>
    <template v-if="$slots.more" #more>
      <slot name="more" />
    </template>
  </ValueTreeWrapper>
</template>

<script setup lang="ts">
import ValueTreeWrapper from '@/components/core/value-tree/ValueTreeWrapper.vue';
import { Checkbox } from '@/components/ui/checkbox';

withDefaults(
  defineProps<{
    name: string;
    level?: number;
  }>(),
  {
    level: 0,
  },
);

const modelValue = defineModel<boolean>({ required: true });

defineEmits(['delete']);
</script>
