<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps<{
  // eslint-disable-next-line vue/no-reserved-props
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <h5 :class="cn('mb-1 text-base font-medium leading-none tracking-tight', props.class)">
    <slot />
  </h5>
</template>
