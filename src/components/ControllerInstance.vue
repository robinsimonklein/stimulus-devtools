<template>
  <div class="group flex items-center gap-2 px-3 py-1 hover:bg-gray-50 dark:hover:bg-neutral-700/50">
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
    <div class="ml-auto flex items-center gap-1">
      <Tooltip>
        <template #trigger>
          <button
            type="button"
            class="invisible opacity-70 group-hover:visible hover:opacity-100"
            @click="inspectElement"
          >
            <Icon icon="lucide:square-dashed-mouse-pointer" class="size-4" />
          </button>
        </template>
        <template #default>
          <p>Show in inspector</p>
        </template>
      </Tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ControllerInstance } from '@/types/core';
import { useMessaging } from '@/composables/useMessaging';
import { Message } from '@/core/message';
import { Icon } from '@iconify/vue';
import Tooltip from '@/components/ui/Tooltip.vue';

const { postMessage } = useMessaging();

const props = defineProps<{
  instance: ControllerInstance;
}>();

const selectorString = computed(() => {
  let s = `${props.instance.selector.tag}`;
  if (props.instance.selector.id) s += `#${props.instance.selector.id}`;
  props.instance.selector.classes.forEach(cls => (s += `.${cls}`));
  return s;
});

const inspectElement = () => {
  postMessage(new Message('INSPECT_ELEMENT', { uid: props.instance.uid }));
};
</script>
