<template>
  <div>
    <div class="group inline-flex items-center" :class="{ 'cursor-pointer': hasChildren }">
      <div class="inline-flex items-center" @click="toggle">
        <span
          class="inline-block w-[16px] h-[16px] shrink-0 mr-1"
          :style="{
            marginLeft: `${level * 16}px`,
          }"
        >
          <ChevronRight v-if="hasChildren" class="w-full h-full" :class="{ 'rotate-90': showChildren }" />
        </span>

        <span class="text-sm font-mono select-none">
          <span class="text-indigo-600 dark:text-indigo-400">{{ name }}</span>
          <span class="text-muted-foreground ml-0.5">:</span>
        </span>

        <div class="ml-1">
          <slot name="value" />
        </div>

        <!-- Actions -->
        <div
          v-if="$slots.actions"
          class="inline-flex items-center gap-x-1 ml-2"
          :class="{ 'opacity-0 group-hover:opacity-100': !keepActionsVisible }"
        >
          <!-- Actions -->
          <slot name="actions" />

          <!-- More -->
          <Popover v-if="$slots.more">
            <PopoverTrigger>
              <Button variant="ghost" size="icon-sm">
                <EllipsisVertical class="w-3.5 h-3.5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <slot name="more" />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
    <div v-if="showChildren">
      <slot name="children" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ChevronRight, EllipsisVertical } from 'lucide-vue-next';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

const props = withDefaults(
  defineProps<{
    name: string;
    level?: number;
    hasChildren?: boolean;
    keepActionsVisible?: boolean;
  }>(),
  {
    level: 0,
    hasChildren: false,
    keepActionsVisible: false,
  },
);

const showChildren = ref(false);

const toggle = () => {
  if (!props.hasChildren) return;
  showChildren.value = !showChildren.value;
};
</script>
