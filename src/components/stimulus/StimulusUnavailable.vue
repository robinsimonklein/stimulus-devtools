<template>
  <div class="absolute inset-0 flex flex-col items-center justify-center px-4">
    <div class="inline-flex items-center">
      <StimulusDevToolsLogo class="w-[320px] max-w-full" />
    </div>
    <div class="mt-14 text-center">
      <p class="text-muted-foreground">Stimulus is not detected on this page.</p>
      <p class="text-muted-foreground">
        Add your application to <span class="font-mono text-code-purple">window.Stimulus</span> to enable devtools.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import StimulusDevToolsLogo from '@/components/StimulusDevToolsLogo.vue';
</script>
