<template>
  <div class="fixed inset-0 bg-background text-foreground" :class="{ dark: preferredColor === 'dark' }">
    <StimulusControllers v-if="stimulusDetected" />
    <StimulusUnavailable v-else />
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { usePreferredColorScheme } from '@vueuse/core';
import { useStimulusDetector } from '@/composables/useStimulusDetector.ts';
import StimulusUnavailable from '@/components/stimulus/StimulusUnavailable.vue';
import StimulusControllers from '@/components/stimulus/StimulusControllers.vue';

const { stimulusDetected } = useStimulusDetector();

const preferredColor = usePreferredColorScheme();

watch(
  preferredColor,
  value => {
    document.body.classList.toggle('dark', value === 'dark');
  },
  {
    immediate: true,
  },
);
</script>
