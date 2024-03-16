<template>
  <li class="group flex items-center">
    <div class="inline-block w-[28px] h-[24px] relative shrink-0">
      <span
        v-if="last"
        class="absolute top-0 left-[8px] -ml-[0.5px] w-[1px] h-[12px] bg-neutral-400 dark:bg-neutral-600"
      />
      <span v-else class="absolute top-0 left-[8px] -ml-[0.5px] w-[1px] h-full bg-neutral-400 dark:bg-neutral-600" />
      <span class="absolute left-[7px] top-1/2 w-[21px] h-[1px] -mt-[0.5px] bg-neutral-400 dark:bg-neutral-600" />
    </div>
    <div class="flex-1 flex items-center h-[24px] px-1.5 rounded hover:bg-neutral-100 hover:dark:bg-neutral-800">
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
