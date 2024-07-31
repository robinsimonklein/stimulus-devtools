<template>
  <div>
    <div class="group inline-flex items-center" :class="{ 'cursor-pointer': hasChildren }">
      <div class="inline-flex shrink-0 items-center">
        <div class="inline-flex shrink-0 items-center" @click="toggle">
          <span
            class="mr-1 inline-block h-[16px] w-[16px] shrink-0"
            :style="{
              marginLeft: `${level * 16}px`,
            }"
          >
            <ChevronRight v-if="hasChildren" class="h-full w-full" :class="{ 'rotate-90': showChildren }" />
          </span>

          <span class="font-mono text-sm">
            <span class="text-code-navy">{{ name }}</span>
            <span class="ml-0.5 text-muted-foreground">:</span>
          </span>

          <div class="ml-1 shrink-0">
            <slot name="value" />
          </div>
        </div>

        <!-- Actions -->
        <div
          class="ml-2 inline-flex shrink-0 items-center gap-x-1"
          :class="{ 'opacity-0 group-hover:opacity-100': !keepActionsVisible }"
        >
          <!-- Actions -->
          <slot name="actions" />

          <!-- Delete -->
          <Button v-if="level > 0" size="icon-sm" variant="ghost" @click="$emit('delete')">
            <Trash2 class="h-3.5 w-3.5" />
          </Button>

          <!-- More -->
          <Popover v-if="$slots.more">
            <PopoverTrigger>
              <Button variant="ghost" size="icon-sm">
                <EllipsisVertical class="h-3.5 w-3.5" />
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
import { ChevronRight, EllipsisVertical, Trash2 } from 'lucide-vue-next';
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

const showChildren = defineModel<boolean>('showChildren', { default: false });

defineEmits(['delete']);

const toggle = () => {
  if (!props.hasChildren) return;
  showChildren.value = !showChildren.value;
};
</script>
