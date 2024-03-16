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
          {{ outlet.name }} ({{ outlet.references.length }})
        </span>
      </button>
      <Popover>
        <PopoverTrigger>
          <Button class="ml-1.5" variant="ghost" size="icon-sm"><EllipsisVertical class="w-3.5 h-3.5" /></Button>
        </PopoverTrigger>
        <PopoverContent align="center" side="right">
          <table class="w-full">
            <tr>
              <td>Selector</td>
              <td><CodeInline :code="outlet.selector" language="css" /></td>
            </tr>
          </table>
          <hr class="my-2 opacity-20" />
          <table class="w-full">
            <tr>
              <td><CodeInline :code="outlet.htmlAttribute" language="css" /></td>
              <td><CopyButton :text="outlet.htmlAttribute" /></td>
            </tr>
            <tr>
              <td><CodeInline :code="outlet.jsSingular" language="javascript" /></td>
              <td><CopyButton :text="outlet.jsSingular" /></td>
            </tr>
            <tr>
              <td><CodeInline :code="outlet.jsPlural" language="javascript" /></td>
              <td><CopyButton :text="outlet.jsPlural" /></td>
            </tr>
            <tr>
              <td><CodeInline :code="outlet.jsExistential" language="javascript" /></td>
              <td><CopyButton :text="outlet.jsExistential" /></td>
            </tr>
            <tr>
              <td><CodeInline :code="outlet.jsElementSingular" language="javascript" /></td>
              <td><CopyButton :text="outlet.jsElementSingular" /></td>
            </tr>
            <tr>
              <td><CodeInline :code="outlet.jsElementPlural" language="javascript" /></td>
              <td><CopyButton :text="outlet.jsElementPlural" /></td>
            </tr>
          </table>
        </PopoverContent>
      </Popover>
    </div>
    <Tree v-if="expanded" :items="outlet.references" unique-key="uid">
      <template #default="{ item }">
        <button
          type="button"
          class="rounded px-1.5 py-[2px] cursor-pointer hover:bg-neutral-100 hover:dark:bg-neutral-800"
          @click="inspect(item)"
          @mouseenter="executeAction('highlightElement', { selector: item.uidSelector, title: outlet.name })"
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
import { ChevronRight, EllipsisVertical } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { StimulusControllerOutlet, StimulusControllerTargetElement } from '@/types/stimulus.ts';
import { inspectElement } from '@/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import CopyButton from '@/components/core/CopyButton.vue';
import Tree from '@/components/core/tree/Tree.vue';
import { executeAction } from '@/utils/contentScript.ts';
import CodeInline from '@/components/core/code/CodeInline.vue';

const props = defineProps<{
  outlet: StimulusControllerOutlet;
}>();

const expanded = ref(false);

const toggle = () => {
  if (!props.outlet.references.length) return;
  expanded.value = !expanded.value;
};

const canExpand = computed(() => !!props.outlet.references.length);

const inspect = (element: StimulusControllerTargetElement) => {
  inspectElement(element.uidSelector);
};
</script>
