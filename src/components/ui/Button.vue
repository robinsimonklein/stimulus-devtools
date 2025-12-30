<template>
  <button type="button" :class="button({ variant: variant, square: square })">
    <slot name="icon" class="size-4" />
  </button>
</template>

<script setup lang="ts">
import { tv } from 'tailwind-variants/lite';

withDefaults(
  defineProps<{
    variant?: 'soft' | 'ghost';
    square?: boolean;
  }>(),
  {
    variant: 'ghost',
    square: false,
  },
);

const button = tv({
  base: 'flex items-center justify-center text-center gap-1 rounded h-6',
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
