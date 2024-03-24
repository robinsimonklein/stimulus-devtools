<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue';
import { AccordionContent, type AccordionContentProps } from 'radix-vue';
import { cn } from '@/lib/utils';

// eslint-disable-next-line vue/no-reserved-props
const props = defineProps<AccordionContentProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <AccordionContent
    v-bind="delegatedProps"
    class="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
  >
    <div :class="cn('py-0', props.class)">
      <slot />
    </div>
  </AccordionContent>
</template>
