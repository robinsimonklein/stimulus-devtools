<template>
  <div>
    <div class="group inline-flex items-center" :class="{ 'cursor-pointer': hasChildren }">
      <div class="inline-flex items-center" :class="{ 'cursor-pointer': hasChildren }" @click="toggle">
        <span
          class="inline-block w-[16px] h-[16px] mr-1"
          :style="{
            marginLeft: `${level * 16}px`,
          }"
        >
          <ChevronRight
            v-if="['array', 'object'].includes(type)"
            class="w-full h-full"
            :class="{ 'rotate-90': showChildren }"
          />
        </span>
        <span class="text-sm font-mono select-none">
          <span class="text-indigo-600 dark:text-indigo-400">{{ name }}</span>
          <span class="text-muted-foreground ml-0.5">:</span>
        </span>
        <div class="ml-1">
          <span v-if="type === 'string'" class="text-purple-600 dark:text-purple-400 font-mono">
            "{{ modelValue }}"
          </span>
          <span v-else-if="type === 'number'" class="text-blue-600 dark:text-blue-400 font-mono">{{ modelValue }}</span>
          <span v-else-if="type === 'boolean'" class="text-green-600 dark:text-green-400 font-mono">
            {{ modelValue }}
          </span>
          <span v-else-if="['undefined', 'null'].includes(type)" class="text-orange-600 dark:text-orange-400 font-mono">
            {{ modelValue.toString() }}
          </span>
          <span v-else-if="type === 'array'" type="button" class="text-muted-foreground select-none">
            Array ({{ modelValue.length }})
          </span>
          <span v-else-if="type === 'object'" type="button" class="text-muted-foreground select-none"> Object </span>
        </div>
      </div>

      <div class="inline-flex items-center gap-x-0.5 ml-1">
        <Popover v-if="$slots.more">
          <PopoverTrigger>
            <Button class="opacity-0 group-hover:opacity-100" variant="ghost" size="icon-sm">
              <EllipsisVertical class="w-3.5 h-3.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <slot name="more" />
          </PopoverContent>
        </Popover>
      </div>
    </div>
    <div v-if="showChildren">
      <template v-if="type === 'object'">
        <ValueTree
          v-for="[key, value] in Object.entries(modelValue)"
          :key="key"
          :name="key"
          :model-value="value"
          :level="level + 1"
        />
      </template>
      <template v-else-if="type === 'array'">
        <ValueTree
          v-for="(value, index) in modelValue"
          :key="index"
          :name="index"
          :model-value="value"
          :level="level + 1"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { ChevronRight, EllipsisVertical } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

withDefaults(
  defineProps<{
    name: string;
    level?: number;
    definedType?: string; // TODO(idea): Show warning if model value type is not the same as defined type
  }>(),
  {
    level: 0,
    definedType: undefined,
  },
);

const modelValue = defineModel<any>();

const showChildren = ref(false);

const type = computed(() => {
  if (typeof modelValue.value === 'number') return 'number';
  if (typeof modelValue.value === 'boolean') return 'boolean';
  if (typeof modelValue.value === 'object') return Array.isArray(modelValue.value) ? 'array' : 'object';
  if (modelValue.value === null) return 'null';
  if (modelValue.value === undefined) return 'undefined';
  return 'string';
});

const hasChildren = computed(() => ['object', 'array'].includes(type.value));

const toggle = () => {
  if (!hasChildren.value) return;
  showChildren.value = !showChildren.value;
};
</script>
