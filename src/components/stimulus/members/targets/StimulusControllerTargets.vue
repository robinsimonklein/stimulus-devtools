<template>
  <div class="overflow-y-auto px-3 py-2">
    <template v-if="targets?.length">
      <StimulusControllerTargetsRow v-for="target in targets" :key="target.name" :target="target" />
    </template>

    <template v-else>
      <p class="text-sm text-muted-foreground">No target.</p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { toRef } from 'vue';
import { useControllerInstanceTargets } from '@/composables/stimulus/useControllerInstanceTargets.ts';
import { ParsedStimulusControllerInstance } from '@/types/stimulus.ts';
import StimulusControllerTargetsRow from '@/components/stimulus/members/targets/StimulusControllerTargetsRow.vue';

const props = defineProps<{
  instance: ParsedStimulusControllerInstance;
}>();

const { targets } = useControllerInstanceTargets(toRef(props, 'instance'));
</script>
