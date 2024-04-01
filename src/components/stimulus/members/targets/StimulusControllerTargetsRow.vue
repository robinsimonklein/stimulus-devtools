<template>
  <div class="mt-1 first:mt-0">
    <div class="flex items-center">
      <button
        type="button"
        class="group inline-flex items-center"
        :class="{ 'opacity-50': !canExpand, ' cursor-pointer': canExpand }"
        @click="toggle"
      >
        <span class="mr-1" :class="{ 'rotate-90': canExpand && expanded }">
          <ChevronRight class="h-4 w-4" />
        </span>
        <span class="underline-offset-2" :class="{ 'group-hover:underline': canExpand }">
          {{ target.name }} ({{ target.elements.length }})
        </span>
      </button>
      <Popover>
        <PopoverTrigger>
          <Button class="ml-1.5" variant="ghost" size="icon-sm"><EllipsisVertical class="h-3.5 w-3.5" /></Button>
        </PopoverTrigger>
        <PopoverContent align="center" side="right">
          <table class="w-full">
            <tr>
              <td><CodeInline :code="target.htmlAttribute" language="css" /></td>
              <td><CopyButton :text="target.htmlAttribute" /></td>
            </tr>
            <tr>
              <td><CodeInline :code="target.jsSingular" language="javascript" /></td>
              <td><CopyButton :text="target.jsSingular" /></td>
            </tr>
            <tr>
              <td><CodeInline :code="target.jsPlural" language="javascript" /></td>
              <td><CopyButton :text="target.jsPlural" /></td>
            </tr>
            <tr>
              <td><CodeInline :code="target.jsExistential" language="javascript" /></td>
              <td><CopyButton :text="target.jsExistential" /></td>
            </tr>
          </table>
        </PopoverContent>
      </Popover>
    </div>
    <Tree
      v-if="expanded"
      :items="target.elements"
      unique-key="uid"
      @item-mouse-enter="handleItemMouseEnter"
      @item-mouse-leave="handleItemMouseLeave"
    >
      <template #item="{ item }">
        <CodeInline class="cursor-default text-xs" :code="item.elementSelector" language="css" />
      </template>
      <template #item-actions="{ item }">
        <TreeAction @click.stop="inspectElement(item.uidSelector)">
          <SquareDashedMousePointer />
        </TreeAction>
      </template>
    </Tree>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { StimulusControllerTarget, StimulusControllerTargetElement } from '@/types/stimulus.ts';
import { Button } from '@/components/ui/button';
import CopyButton from '@/components/core/CopyButton.vue';
import Tree from '@/components/core/tree/Tree.vue';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronRight, EllipsisVertical, SquareDashedMousePointer } from 'lucide-vue-next';
import { inspectElement } from '@/utils';
import { executeAction } from '@/utils/bridge.ts';
import CodeInline from '@/components/core/code/CodeInline.vue';
import TreeAction from '@/components/core/tree/TreeAction.vue';

const props = defineProps<{
  target: StimulusControllerTarget;
}>();

const expanded = ref(false);

const canExpand = computed(() => !!props.target.elements.length);

const toggle = () => {
  if (!props.target.elements.length) return;
  expanded.value = !expanded.value;
};

const handleItemMouseEnter = (element: StimulusControllerTargetElement) => {
  executeAction('highlightElement', { selector: element.uidSelector, title: props.target.name });
};

const handleItemMouseLeave = () => {
  executeAction('stopHighlightElement');
};
</script>
