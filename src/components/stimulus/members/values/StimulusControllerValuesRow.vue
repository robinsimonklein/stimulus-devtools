<template>
  <div class="flex w-full items-center py-0">
    <ValueTree :name="value.name" :model-value="value.currentValue" @update:model-value="onValueUpdate">
      <template #more>
        <table class="w-full">
          <tr>
            <td>Type</td>
            <td><ValueType :type="value.type" /></td>
          </tr>
          <tr v-if="value.defaultValue">
            <td>Default</td>
            <template v-if="value.type === 'object' || value.type === 'array'">
              <Popover v-if="value.defaultValue">
                <PopoverTrigger>
                  <button class="inline-flex items-center capitalize italic text-muted-foreground">
                    <span>{{ value.type }}</span>
                    <ChevronRight class="h-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent>
                  <CodeBlock :code="JSON.stringify(value.defaultValue, null, 2)" language="javascript" />
                </PopoverContent>
              </Popover>
            </template>
            <template v-else>
              <CodeInline :code="JSON.stringify(value.defaultValue)" language="javascript" />
            </template>
          </tr>
        </table>
        <hr class="my-2" />
        <table class="w-full">
          <tr>
            <td><CodeInline :code="value.htmlAttribute" language="css" /></td>
            <td><CopyButton :text="value.htmlAttribute" /></td>
          </tr>
          <tr>
            <td><CodeInline :code="value.jsSingular" language="javascript" /></td>
            <td><CopyButton :text="value.jsSingular" /></td>
          </tr>
          <tr>
            <td><CodeInline :code="value.jsPlural" language="javascript" /></td>
            <td><CopyButton :text="value.jsPlural" /></td>
          </tr>
          <tr>
            <td><CodeInline :code="value.jsExistential" language="javascript" /></td>
            <td><CopyButton :text="value.jsExistential" /></td>
          </tr>
        </table>
      </template>
    </ValueTree>
  </div>
</template>

<script lang="ts" setup>
import { ParsedStimulusControllerInstance, StimulusControllerValue } from '@/types/stimulus.ts';
import ValueTree from '@/components/core/value-tree/ValueTree.vue';
import CopyButton from '@/components/core/CopyButton.vue';
import ValueType from '@/components/core/ValueType.vue';
import CodeInline from '@/components/core/code/CodeInline.vue';
import { Action } from '@/enum';
import { useBridge } from '@/composables/useBridge.ts';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import CodeBlock from '@/components/core/CodeBlock.vue';
import { ChevronRight } from 'lucide-vue-next';

const { executeAction } = useBridge();

const props = defineProps<{
  value: StimulusControllerValue;
  instance: ParsedStimulusControllerInstance;
}>();

const onValueUpdate = (newValue: any) => {
  executeAction(Action.UpdateValue, {
    value: newValue,
    key: props.value.name + 'Value',
    identifier: props.instance.identifier,
    uidSelector: props.instance.uidSelector,
  });
};
</script>
