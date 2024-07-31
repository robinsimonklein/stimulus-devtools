<template>
  <Button size="icon-sm" variant="ghost" @click.prevent.stop="copy(text)">
    <Check v-if="copied" class="h-3.5 w-3.5" />
    <Copy v-else class="h-3.5 w-3.5" />
  </Button>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-vue-next';
import { useCopyButton } from '@/composables/useCopyButton.ts';

defineProps<{
  text: string;
}>();

const { copied, copy } = useCopyButton();
</script>
