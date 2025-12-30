<template>
  <TooltipRoot>
    <TooltipTrigger as-child>
      <slot name="trigger" />
    </TooltipTrigger>
    <TooltipPortal>
      <TooltipContent
        class="rounded-md border border-gray-200 bg-white px-1.5 py-1 text-sm text-neutral-900 shadow-md dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
        :side-offset="4"
      >
        <slot />
      </TooltipContent>
    </TooltipPortal>
  </TooltipRoot>
</template>

<script setup lang="ts">
import { TooltipContent, TooltipPortal, TooltipRoot, TooltipTrigger } from 'reka-ui';
</script>
