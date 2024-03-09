<template>
  <div>
    <h1>Stimulus DevTools</h1>
    <ul>
      <li>stimulusDetected: {{ stimulusDetected }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useStimulusDetector } from '../composables/useStimulusDetector.ts';

const { stimulusDetected, checkIfHasStimulus } = useStimulusDetector();

onBeforeMount(() => {
  checkIfHasStimulus(true);
});
</script>
