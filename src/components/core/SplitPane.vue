<template>
  <div ref="container" :class="parentClass">
    <div class="relative" :style="paneAStyle">
      <slot name="a" />
    </div>
    <span
      ref="separator"
      :class="[
        'relative',
        'bg-neutral-200',
        'dark:bg-neutral-800',
        'z-10',
        // Before
        'before:block',
        'before:absolute',
        'before:bg-neutral-300 before:dark:bg-neutral-700',
        'before:opacity-0 hover:before:opacity-100',
        isResizing && 'before:opacity-100',
        orientation === 'horizontal'
          ? 'before:bottom-0 before:left-1/2 before:top-0 before:ml-[-1.5px]'
          : 'before:left-0 before:right-0 before:top-1/2 before:mt-[-1.5px]',
        orientation === 'horizontal' ? 'before:h-full before:w-[3px]' : 'before:h-[3px] before:w-full',
        // After
        'after:block',
        'after:absolute',
        orientation === 'horizontal'
          ? 'after:bottom-0 after:left-1/2 after:top-0 after:ml-[-3px]'
          : 'after:left-0 after:right-0 after:top-1/2 after:mt-[-3px]',
        orientation === 'horizontal' ? 'after:h-full after:w-[6px]' : 'after:h-[6px] after:w-full',
      ]"
      :style="{
        width: orientation === 'horizontal' ? '1px' : '100%',
        height: orientation === 'horizontal' ? '100%' : '1px',
        cursor,
      }"
    />
    <div class="relative" :style="paneBStyle"><slot name="b" /></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue';

const props = withDefaults(
  defineProps<{
    orientation?: 'horizontal' | 'vertical';
    min?: number;
    max?: number;
    separatorSize?: number;
  }>(),
  {
    orientation: 'horizontal',
    min: 0.1,
    max: 0.9,
    separatorSize: 1,
  },
);

const container = ref<HTMLElement | null>(null);
const separator = ref<HTMLSpanElement | null>(null);

const isResizing = ref(false);

const size = defineModel<number>('size', { default: 0.5 });

const startSize = ref(size.value);
const startX = ref(0);
const startY = ref(0);

const parentClass = computed(() => {
  const c = ['flex'];
  if (props.orientation === 'vertical') {
    c.push('flex-col');
  }
  return c;
});

const paneAStyle = computed(() => {
  if (props.orientation === 'horizontal') {
    return {
      width: `calc(${size.value * 100}% - ${props.separatorSize / 2}px)`,
      minWidth: `${props.min * 100}%`,
      maxWidth: `${props.max * 100}%`,
    };
  } else {
    return {
      height: `calc(${size.value * 100}% - ${props.separatorSize / 2}px)`,
      minHeight: `${props.min * 100}%`,
      maxHeight: `${props.max * 100}%`,
    };
  }
});

const paneBStyle = computed(() => {
  if (props.orientation === 'horizontal') {
    return {
      width: `calc(${(1 - size.value) * 100}% - ${props.separatorSize / 2}px)`,
    };
  } else {
    return {
      height: `calc(${(1 - size.value) * 100}% - ${props.separatorSize / 2}px)`,
    };
  }
});

const cursor = computed(() => {
  return props.orientation === 'horizontal' ? 'ew-resize' : 'ns-resize';
});

function resize(e: PointerEvent) {
  if (!separator.value || !container.value) return;

  const calculateSize = () => {
    if (props.orientation === 'horizontal') {
      return Math.min(
        Math.max(startSize.value + (e.clientX - startX.value) / container.value!.clientWidth, props.min),
        props.max,
      );
    } else {
      return Math.min(
        Math.max(startSize.value + (e.clientY - startY.value) / container.value!.clientHeight, props.min),
        props.max,
      );
    }
  };

  size.value = calculateSize();
}

function stopResize() {
  window.removeEventListener('pointermove', resize);
  isResizing.value = false;
}

watchEffect(() => {
  if (isResizing.value) {
    document.body.style.setProperty('pointer-events', 'none', 'important');
    document.documentElement.style.setProperty('cursor', cursor.value, 'important');
  } else {
    document.body.style.removeProperty('pointer-events');
    document.documentElement.style.removeProperty('cursor');
  }
});

onMounted(() => {
  if (!separator.value || !container.value) return;

  separator.value.addEventListener('pointerdown', e => {
    e.preventDefault();
    isResizing.value = true;
    startSize.value = size.value;
    startX.value = e.clientX;
    startY.value = e.clientY;
    window.addEventListener('pointermove', resize);
    window.addEventListener('pointerup', stopResize);
  });
});

onUnmounted(() => {
  window.removeEventListener('pointermove', resize);
  window.removeEventListener('pointerup', stopResize);
});
</script>
