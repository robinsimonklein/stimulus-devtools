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
          <ChevronRight class="w-4 h-4" />
        </span>
        <span class="underline-offset-2" :class="{ 'group-hover:underline': canExpand }">
          {{ target.name }} ({{ target.elements.length }})
        </span>
      </button>
      <Popover>
        <PopoverTrigger>
          <Button class="ml-1.5" variant="ghost" size="icon-sm"><EllipsisVertical class="w-3.5 h-3.5" /></Button>
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
    <Tree v-if="expanded" :items="target.elements" unique-key="uid">
      <template #default="{ item }">
        <button
          type="button"
          class="rounded px-1.5 py-[2px] cursor-pointer hover:bg-neutral-100 hover:dark:bg-neutral-800"
          @click="inspect(item)"
          @mouseenter="executeAction('highlightElement', { selector: item.uidSelector, title: target.name })"
          @mouseleave="executeAction('stopHighlightElement')"
        >
          <CodeInline class="text-xs" :code="item.elementSelector" language="css" />
        </button>
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
import { ChevronRight, EllipsisVertical } from 'lucide-vue-next';
import { inspectElement } from '@/utils';
import { executeAction } from '@/utils/contentScript.ts';
import CodeInline from '@/components/core/code/CodeInline.vue';

const props = defineProps<{
  target: StimulusControllerTarget;
}>();

const expanded = ref(false);

const canExpand = computed(() => !!props.target.elements.length);

const toggle = () => {
  if (!props.target.elements.length) return;
  expanded.value = !expanded.value;
};

const inspect = (element: StimulusControllerTargetElement) => {
  inspectElement(element.uidSelector);
};
</script>
