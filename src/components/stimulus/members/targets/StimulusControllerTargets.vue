<template>
  <div class="px-3 py-1">
    <template v-if="targets?.length">
      <StimulusControllerTargetsRow v-for="target in targets" :key="target.name" :target="target" />
    </template>

    <template v-else>
      <p class="text-muted-foreground text-sm">No target.</p>
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
