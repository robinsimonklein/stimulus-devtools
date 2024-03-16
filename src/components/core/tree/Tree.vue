<template>
  <ul>
    <TreeItem
      v-for="(item, index) in items"
      :key="item[uniqueKey]"
      :last="index === items.length - 1"
      @mouseenter="$emit('itemMouseEnter', item)"
      @mouseleave="$emit('itemMouseLeave', item)"
    >
      <div class="mr-2">
        <slot name="item" :item="item" />
      </div>
      <div class="ml-auto inline-flex items-center gap-x-1.5">
        <slot name="item-actions" :item="item" />
      </div>
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

defineEmits(['itemMouseEnter', 'itemMouseLeave']);
</script>
