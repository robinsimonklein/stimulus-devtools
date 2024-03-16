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
          {{ cssClass.name }} ({{ cssClass.classNames.length }})
        </span>
      </button>
      <Popover>
        <PopoverTrigger>
          <Button class="ml-1.5" variant="ghost" size="icon-sm"><EllipsisVertical class="w-3.5 h-3.5" /></Button>
        </PopoverTrigger>
        <PopoverContent align="center" side="right">
          <table class="w-full">
            <tr>
              <td><CodeBlock :code="cssClass.htmlAttribute" language="html" inline /></td>
              <td><CopyButton :text="cssClass.htmlAttribute" /></td>
            </tr>
            <tr>
              <td><CodeBlock :code="cssClass.jsSingular" language="javascript" inline /></td>
              <td><CopyButton :text="cssClass.jsSingular" /></td>
            </tr>
            <tr>
              <td><CodeBlock :code="cssClass.jsPlural" language="javascript" inline /></td>
              <td><CopyButton :text="cssClass.jsPlural" /></td>
            </tr>
            <tr>
              <td><CodeBlock :code="cssClass.jsExistential" language="javascript" inline /></td>
              <td><CopyButton :text="cssClass.jsExistential" /></td>
            </tr>
          </table>
        </PopoverContent>
      </Popover>
    </div>
    <Tree v-if="expanded" :items="cssClass.classNames" unique-key="uid">
      <template #default="{ item }">
        <button
          type="button"
          class="rounded px-1.5 py-[2px] cursor-pointer hover:bg-neutral-100 hover:dark:bg-neutral-800"
        >
          <CodeBlock class="text-xs" :code="`.${item}`" language="css" inline />
        </button>
      </template>
    </Tree>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { StimulusControllerClass } from '@/types/stimulus.ts';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import CopyButton from '@/components/core/CopyButton.vue';
import { ChevronRight, EllipsisVertical } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import CodeBlock from '@/components/core/CodeBlock.vue';
import Tree from '@/components/core/tree/Tree.vue';

const props = defineProps<{
  cssClass: StimulusControllerClass;
}>();

const expanded = ref(false);

const toggle = () => {
  if (!props.cssClass.classNames.length) return;
  expanded.value = !expanded.value;
};

const canExpand = computed(() => !!props.cssClass.classNames.length);
</script>
