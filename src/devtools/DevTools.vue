<template>
  <div class="fixed inset-0 bg-background text-foreground" :class="{ dark: preferredColor === 'dark' }">
    <StimulusControllers v-if="stimulusDetected" />
    <div v-else-if="isLoading" class="absolute inset-0 flex items-center justify-center">
      <span>Loading...</span>
    </div>
    <StimulusUnavailable v-else />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { usePreferredColorScheme } from '@vueuse/core';
import { useStimulusDetector } from '@/composables/useStimulusDetector.ts';
import StimulusUnavailable from '@/components/stimulus/StimulusUnavailable.vue';
import StimulusControllers from '@/components/stimulus/StimulusControllers.vue';

const { isLoading, stimulusDetected, checkIfHasStimulus } = useStimulusDetector();

const preferredColor = usePreferredColorScheme();

onBeforeMount(() => {
  checkIfHasStimulus(true);
});
</script>
