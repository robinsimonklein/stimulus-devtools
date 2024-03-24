<template>
  <li class="group flex items-center">
    <div class="relative inline-block h-[24px] w-[28px] shrink-0">
      <span
        v-if="last"
        class="absolute left-[8px] top-0 -ml-[0.5px] h-[12px] w-[1px] bg-neutral-400 dark:bg-neutral-600"
      />
      <span v-else class="absolute left-[8px] top-0 -ml-[0.5px] h-full w-[1px] bg-neutral-400 dark:bg-neutral-600" />
      <span class="absolute left-[7px] top-1/2 -mt-[0.5px] h-[1px] w-[21px] bg-neutral-400 dark:bg-neutral-600" />
    </div>
    <div class="flex h-[24px] flex-1 items-center rounded px-1.5 hover:bg-neutral-100 hover:dark:bg-neutral-800">
      <slot />
    </div>
  </li>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    last?: boolean;
  }>(),
  {
    last: false,
  },
);
</script>
