<template>
  <div class="flex items-center py-1 w-full">
    <div class="flex-1 mr-2 overflow-hidden">
      <Popover>
        <PopoverTrigger>
          <span class="truncate max-w-full hover:underline underline-offset-2">{{ value.name }}</span>
        </PopoverTrigger>
        <PopoverContent align="center" side="right">
          <table class="w-full">
            <tr>
              <td>Type</td>
              <td><ValueType :type="value.type" /></td>
            </tr>
            <tr v-if="value.defaultValue">
              <td>Default</td>
              <td><TypedValue :model-value="value.defaultValue" /></td>
            </tr>
          </table>
          <hr class="my-2 opacity-20" />
          <table class="w-full">
            <tr>
              <td><CodeBlock :code="value.htmlAttribute" language="html" inline /></td>
              <td><CopyButton :text="value.htmlAttribute" /></td>
            </tr>
            <tr>
              <td><CodeBlock :code="value.jsSingular" language="javascript" inline /></td>
              <td><CopyButton :text="value.jsSingular" /></td>
            </tr>
            <tr>
              <td><CodeBlock :code="value.jsPlural" language="javascript" inline /></td>
              <td><CopyButton :text="value.jsPlural" /></td>
            </tr>
            <tr>
              <td><CodeBlock :code="value.jsExistential" language="javascript" inline /></td>
              <td><CopyButton :text="value.jsExistential" /></td>
            </tr>
          </table>
        </PopoverContent>
      </Popover>
    </div>
    <div class="w-[230px] shrink-0 ml-auto">
      <TypedValue class="w-full" :model-value="value.currentValue" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { StimulusControllerValue } from '@/types/stimulus.ts';
import TypedValue from '@/components/core/TypedValue.vue';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import CopyButton from '@/components/core/CopyButton.vue';
import CodeBlock from '@/components/core/CodeBlock.vue';
import ValueType from '@/components/core/ValueType.vue';

defineProps<{
  value: StimulusControllerValue;
}>();
</script>
