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
          {{ cssClass.name }} ({{ cssClass.classNames.length }})
        </span>
      </button>
      <Popover>
        <PopoverTrigger>
          <Button class="ml-1.5" variant="ghost" size="icon-sm"><EllipsisVertical class="h-3.5 w-3.5" /></Button>
        </PopoverTrigger>
        <PopoverContent align="center" side="right">
          <table class="w-full">
            <tr>
              <td><CodeInline :code="cssClass.htmlAttribute" language="css" /></td>
              <td><CopyButton :text="cssClass.htmlAttribute" /></td>
            </tr>
            <tr>
              <td><CodeInline :code="cssClass.jsSingular" language="javascript" /></td>
              <td><CopyButton :text="cssClass.jsSingular" /></td>
            </tr>
            <tr>
              <td><CodeInline :code="cssClass.jsPlural" language="javascript" /></td>
              <td><CopyButton :text="cssClass.jsPlural" /></td>
            </tr>
            <tr>
              <td><CodeInline :code="cssClass.jsExistential" language="javascript" /></td>
              <td><CopyButton :text="cssClass.jsExistential" /></td>
            </tr>
          </table>
        </PopoverContent>
      </Popover>
    </div>
    <Tree v-if="expanded" :items="classNames" unique-key="name">
      <template #item="{ item }">
        <CodeInline class="text-xs" :code="`.${item.name}`" language="css" />
      </template>
      <template #item-actions="{ item }">
        <TreeAction @click.stop="copy(item.name)">
          <Check v-if="copied" />
          <Copy v-else />
        </TreeAction>
      </template>
    </Tree>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { StimulusControllerClass } from '@/types/stimulus.ts';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import CopyButton from '@/components/core/CopyButton.vue';
import { ChevronRight, EllipsisVertical, Copy, Check } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import Tree from '@/components/core/tree/Tree.vue';
import CodeInline from '@/components/core/code/CodeInline.vue';
import TreeAction from '@/components/core/tree/TreeAction.vue';
import { useCopyButton } from '@/composables/useCopyButton.ts';

const { copied, copy } = useCopyButton();

const props = defineProps<{
  cssClass: StimulusControllerClass;
}>();

const expanded = ref(false);

const toggle = () => {
  if (!props.cssClass.classNames.length) return;
  expanded.value = !expanded.value;
};

const canExpand = computed(() => !!props.cssClass.classNames.length);

const classNames = props.cssClass.classNames.map(name => ({ name }));
</script>
