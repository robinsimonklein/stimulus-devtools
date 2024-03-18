<template>
  <div class="absolute inset-0 flex flex-col items-center justify-center px-2">
    <div class="inline-flex items-center">
      <StimulusLogo class="w-5 h-5 sm:w-8 sm:h-8" />
      <p class="text-xl sm:text-3xl font-bold ml-2">
        <span>Stimulus</span>
        <span class="ml-1" style="color: #d9c6a4">DevTools</span>
      </p>
    </div>
    <div class="mt-14 text-center">
      <p class="text-muted-foreground">Stimulus is not detected on this page.</p>
      <p class="text-muted-foreground">
        Add your application to <CodeInline code="window.Stimulus" language="javascript" /> to enable devtools.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import StimulusLogo from '@/components/StimulusLogo.vue';
import CodeInline from '@/components/core/code/CodeInline.vue';
</script>
