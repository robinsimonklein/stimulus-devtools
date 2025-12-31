<template>
  <button type="button" :class="button({ variant: variant, square: square })">
    <Icon v-if="icon" :icon="icon" class="size-3" />
  </button>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { tv } from 'tailwind-variants/lite';

withDefaults(
  defineProps<{
    icon?: string;
    variant?: 'soft' | 'ghost';
    square?: boolean;
  }>(),
  {
    icon: undefined,
    variant: 'ghost',
    square: false,
  },
);

const button = tv({
  base: 'flex h-6 items-center justify-center gap-1 rounded text-center',
  variants: {
    variant: {
      soft: 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700/50 dark:hover:bg-neutral-700',
      ghost: 'hover:bg-neutral-200 dark:hover:bg-neutral-700',
    },
    square: {
      true: 'aspect-square',
    },
  },
});
</script>
