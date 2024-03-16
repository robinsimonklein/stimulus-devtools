<template>
  <div class="px-3 py-1">
    <template v-if="outlets?.length">
      <StimulusControllerOutletsRow v-for="outlet in outlets" :key="outlet.name" :outlet="outlet" />
    </template>

    <template v-else>
      <p class="text-muted-foreground text-sm">No outlet.</p>
    </template>
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
