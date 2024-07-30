<template>
  <ValueTreeWrapper :name :level @delete="$emit('delete')">
    <template #value>
      <div class="inline-flex shrink-0 items-center">
        <div class="shrink-0 font-mono text-code-red">
          <span
            class="relative inline-block italic outline-0 after:pointer-events-none after:absolute after:inset-0 after:rounded-sm after:opacity-0 after:outline after:outline-2 after:outline-muted-foreground after:content-['']"
            spellcheck="false"
          >
            null
          </span>
        </div>
      </div>
    </template>
    <template v-if="$slots.more" #more>
      <slot name="more" />
    </template>
  </ValueTreeWrapper>
</template>

<script setup lang="ts">
import ValueTreeWrapper from '@/components/core/value-tree/ValueTreeWrapper.vue';

withDefaults(
  defineProps<{
    name: string;
    level?: number;
  }>(),
  {
    level: 0,
  },
);

defineEmits(['delete']);
</script>
