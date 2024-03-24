<template>
  <button type="button" class="opacity-0 group-hover:opacity-100">
    <slot />
  </button>
</template>

<style scoped>
:slotted(svg) {
  @apply h-4 w-4 opacity-60 hover:opacity-100;
}
</style>
