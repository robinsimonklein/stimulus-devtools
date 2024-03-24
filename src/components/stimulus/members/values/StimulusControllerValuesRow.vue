<template>
  <div class="flex items-center py-0.5 w-full">
    <ValueTree :name="value.name" :model-value="value.currentValue" @update:model-value="onValueUpdate">
      <template #definition>
        <table class="w-full">
          <tr>
            <td>Type</td>
            <td><ValueType :type="value.type" /></td>
          </tr>
          <tr v-if="value.defaultValue">
            <td>Default</td>
            <td>{{ value.defaultValue }}</td>
          </tr>
        </table>
      </template>
      <template #more>
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
import { executeAction } from '@/utils/contentScript.ts';

const props = defineProps<{
  value: StimulusControllerValue;
  instance: ParsedStimulusControllerInstance;
}>();

const onValueUpdate = (newValue: any) => {
  executeAction('updateValue', {
    value: newValue,
    key: props.value.name + 'Value',
    identifier: props.instance.identifier,
    uidSelector: props.instance.uidSelector,
  });
};
</script>
