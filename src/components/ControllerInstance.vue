<template>
  <div class="px-3 py-1.5">
    <p
      class="overflow-hidden font-mono text-nowrap text-ellipsis text-neutral-600 dark:text-neutral-400"
      :title="selectorString"
    >
      <span class="text-blue-600 dark:text-blue-400">{{ instance.selector.tag }}</span>
      <span v-if="instance.selector.id" class="text-green-600 dark:text-green-400">#{{ instance.selector.id }}</span>
      <span v-for="cls in instance.selector.classes" :key="cls" class="text-purple-600 dark:text-purple-400"
        >.{{ cls }}</span
      >
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ControllerInstance } from '@/types/core';

const props = defineProps<{
  instance: ControllerInstance;
}>();

const selectorString = computed(() => {
  let s = `${props.instance.selector.tag}`;
  if (props.instance.selector.id) s += `#${props.instance.selector.id}`;
  props.instance.selector.classes.forEach(cls => (s += `.${cls}`));
  return s;
});
</script>
