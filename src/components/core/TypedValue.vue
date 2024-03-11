<template>
  <div>
    <Popover v-if="typeof modelValue === 'object'">
      <PopoverTrigger>
        <button class="group flex items-center py-1">
          <template v-if="JSON.stringify(modelValue)[0] === '['">
            <ValueType type="array" clickable />
          </template>
          <template v-else>
            <ValueType type="object" clickable />
          </template>
        </button>
      </PopoverTrigger>
      <PopoverContent class="p-0">
        <CodeBlock :code="JSON.stringify(modelValue, null, 2)" language="javascript" :bordered="false" />
      </PopoverContent>
    </Popover>

    <div v-else-if="typeof modelValue === 'boolean'" class="leading-none">
      <Checkbox :checked="modelValue" />
    </div>
    <input
      v-else
      class="w-full text-foreground border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 rounded px-1.5 py-1"
      :type="typeof modelValue === 'number' ? 'number' : 'text'"
      :value="modelValue"
      readonly
    />
  </div>
</template>

<script setup lang="ts">
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Braces, Brackets } from 'lucide-vue-next';
import CodeBlock from '@/components/core/CodeBlock.vue';
import ValueType from '@/components/core/ValueType.vue';

const modelValue = defineModel<string | number | boolean | object | unknown[]>();
</script>
