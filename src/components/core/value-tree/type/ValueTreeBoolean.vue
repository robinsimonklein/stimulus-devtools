<template>
  <ValueTreeWrapper :name :level @delete="$emit('delete')">
    <template #value>
      <span class="text-code-green inline-block min-w-[43px] font-mono">
        {{ modelValue.toString() }}
      </span>
    </template>
    <template #actions>
      <!-- Edit -->
      <Button size="icon-sm" variant="ghost" @click="modelValue = !modelValue">
        <SquareCheck v-if="modelValue" class="h-3.5 w-3.5" />
        <Square v-else class="h-3.5 w-3.5" />
      </Button>
    </template>
    <template v-if="$slots.more" #more>
      <slot name="more" />
    </template>
  </ValueTreeWrapper>
</template>

<script setup lang="ts">
import ValueTreeWrapper from '@/components/core/value-tree/ValueTreeWrapper.vue';
import { Button } from '@/components/ui/button';
import { Square, SquareCheck } from 'lucide-vue-next';

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
