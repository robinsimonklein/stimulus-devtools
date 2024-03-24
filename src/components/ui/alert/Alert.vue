<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { type AlertVariants, alertVariants } from '.';
import { cn } from '@/lib/utils';

const props = defineProps<{
  // eslint-disable-next-line vue/no-reserved-props
  class?: HTMLAttributes['class'];
  variant?: AlertVariants['variant'];
}>();
</script>

<template>
  <div :class="cn(alertVariants({ variant }), props.class)" role="alert">
    <slot />
  </div>
</template>
