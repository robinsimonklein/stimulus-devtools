<template>
  <Button size="icon-sm" variant="ghost" @click.prevent="copyText">
    <CopyCheck v-if="copied" class="h-3.5 w-3.5" />
    <Copy v-else class="h-3.5 w-3.5" />
  </Button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Copy, CopyCheck } from 'lucide-vue-next';
import { useClipboard } from '@vueuse/core';

const props = defineProps<{
  text?: string;
}>();

const copied = ref(false);
const copiedTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

const { copy } = useClipboard();

const copyText = () => {
  if (props.text) copy(props.text);
  if (copiedTimeout.value) clearTimeout(copiedTimeout.value);

  copied.value = true;

  copiedTimeout.value = setTimeout(() => {
    copied.value = false;
  }, 1000);
};
</script>
