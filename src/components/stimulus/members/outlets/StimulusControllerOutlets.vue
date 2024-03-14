<template>
  <div class="px-3 py-1">
    <ul>
      <StimulusControllerOutletsRow v-for="outlet in outlets" :key="outlet.name" :outlet="outlet" />
    </ul>
  </div>
</template>

<script setup lang="ts">
import { toRef } from 'vue';
import { ParsedStimulusControllerInstance } from '@/types/stimulus.ts';
import { useControllerInstanceOutlets } from '@/composables/stimulus/useControllerInstanceOutlets.ts';
import StimulusControllerOutletsRow from '@/components/stimulus/members/outlets/StimulusControllerOutletsRow.vue';

const props = defineProps<{
  instance: ParsedStimulusControllerInstance;
}>();

const { outlets } = useControllerInstanceOutlets(toRef(props, 'instance'));
</script>
