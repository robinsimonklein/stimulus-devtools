<template>
  <li class="mt-1 first:mt-0">
    <div class="flex items-center">
      <button type="button" class="group inline-flex items-center cursor-pointer" @click="expanded = !expanded">
        <span class="mr-1" :class="{ 'rotate-90': expanded }"><ChevronRight class="w-4 h-4" /></span>
        <span class="group-hover:underline underline-offset-2">{{ target.name }} ({{ target.elements.length }})</span>
      </button>
      <Popover>
        <PopoverTrigger>
          <Button class="ml-1.5" variant="ghost" size="icon-sm"><EllipsisVertical class="w-3.5 h-3.5" /></Button>
        </PopoverTrigger>
        <PopoverContent align="center" side="right">
          <table class="w-full">
            <tr>
              <td><CodeBlock :code="target.htmlAttribute" language="html" inline /></td>
              <td><CopyButton :text="target.htmlAttribute" /></td>
            </tr>
            <tr>
              <td><CodeBlock :code="target.jsSingular" language="javascript" inline /></td>
              <td><CopyButton :text="target.jsSingular" /></td>
            </tr>
            <tr>
              <td><CodeBlock :code="target.jsPlural" language="javascript" inline /></td>
              <td><CopyButton :text="target.jsPlural" /></td>
            </tr>
            <tr>
              <td><CodeBlock :code="target.jsExistential" language="javascript" inline /></td>
              <td><CopyButton :text="target.jsExistential" /></td>
            </tr>
          </table>
        </PopoverContent>
      </Popover>
    </div>
    <ul v-if="expanded">
      <li v-for="(element, index) in target.elements" :key="element.uid">
        <div class="group flex items-center">
          <div class="inline-block w-[28px] h-[24px] relative mr-0.5">
            <span
              v-if="index < target.elements.length - 1"
              class="absolute top-0 left-[8px] -ml-[0.5px] w-[1px] h-[24px] bg-neutral-400 dark:bg-neutral-600"
            />
            <span
              v-else
              class="absolute top-0 left-[8px] -ml-[0.5px] w-[1px] h-[12px] bg-neutral-400 dark:bg-neutral-600"
            />
            <span class="absolute left-[8px] top-1/2 w-[20px] h-[1px] -mt-[0.5px] bg-neutral-400 dark:bg-neutral-600" />
          </div>
          <!-- TODO: inspect on click -->
          <button type="button" class="rounded px-1.5 cursor-pointer hover:bg-neutral-100 hover:dark:bg-neutral-800">
            <CodeBlock class="text-xs" :code="element.elementSelector" language="css" inline />
          </button>
        </div>
      </li>
    </ul>
  </li>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CodeBlock from '@/components/core/CodeBlock.vue';
import { StimulusControllerTarget } from '@/types/stimulus.ts';
import { Button } from '@/components/ui/button';
import { ChevronRight, EllipsisVertical } from 'lucide-vue-next';
import CopyButton from '@/components/core/CopyButton.vue';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

defineProps<{
  target: StimulusControllerTarget;
}>();

const expanded = ref(true);
</script>
