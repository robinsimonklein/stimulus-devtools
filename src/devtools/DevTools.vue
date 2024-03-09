<template>
  <div class="fixed inset-0 bg-background text-foreground" :class="{ dark: preferredColor === 'dark' }">
    <StimulusControllers v-if="stimulusDetected" />
    <StimulusUnavailable v-else />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { usePreferredColorScheme } from '@vueuse/core';
import { useStimulusDetector } from '@/composables/useStimulusDetector.ts';
import StimulusUnavailable from '@/components/stimulus/StimulusUnavailable.vue';
import StimulusControllers from '@/components/stimulus/StimulusControllers.vue';

const { stimulusDetected, checkIfHasStimulus } = useStimulusDetector();

const preferredColor = usePreferredColorScheme();

onBeforeMount(() => {
  checkIfHasStimulus(true);
});
</script>
