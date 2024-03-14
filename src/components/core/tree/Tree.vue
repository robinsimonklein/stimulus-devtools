<template>
  <ul>
    <TreeItem v-for="(item, index) in items" :key="item[uniqueKey]" :last="index === items.length - 1">
      <slot :item="item" />
    </TreeItem>
    <!-- TODO: "Show more" button when too many items -->
  </ul>
</template>
<script setup lang="ts">
import TreeItem from '@/components/core/tree/TreeItem.vue';

defineProps<{
  items: Record<string, any>[];
  uniqueKey: string;
}>();
</script>
