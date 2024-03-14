<template>
  <li>
    <div class="group flex items-center">
      <div class="inline-block w-[28px] h-[24px] relative mr-0.5">
        <span
          v-if="last"
          class="absolute top-0 left-[8px] -ml-[0.5px] w-[1px] h-[12px] bg-neutral-400 dark:bg-neutral-600"
        />
        <span
          v-else
          class="absolute top-0 left-[8px] -ml-[0.5px] w-[1px] h-[24px] bg-neutral-400 dark:bg-neutral-600"
        />
        <span class="absolute left-[8px] top-1/2 w-[20px] h-[1px] -mt-[0.5px] bg-neutral-400 dark:bg-neutral-600" />
      </div>
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
