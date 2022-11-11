<script setup lang="ts">
import { computed, type ComputedRef, ref, type Ref } from "vue";
import type {
  PositionStyle,
  SizeStyle,
  Dimensions,
} from "../../typings/ResizeContainer";

const props = withDefaults(
  defineProps<{
    hasBorder?: boolean;
    borderColor?: string;
  }>(),
  {
    hasBorder: true,
    borderColor: `black`,
  }
);

const dimensionsBeforeMove: Ref<Dimensions> = ref({
  left: 100,
  top: 100,
  bottom: 0,
  right: 0,
});

const dimensions: Ref<Dimensions> = ref({
  left: 0,
  top: 0,
  bottom: 0,
  right: 0,
});

const pointerX: Ref<number> = ref(0);
const pointerY: Ref<number> = ref(0);

const width: ComputedRef<number> = computed(() => 500);
const height: ComputedRef<number> = computed(() => 500);
const sizeStyle: ComputedRef<SizeStyle> = computed(() => {
  return {
    width: `${width.value}px`,
    height: `${height.value}px`,
  };
});
const positionStyle: ComputedRef<PositionStyle> = computed(() => {
  return {
    top: `${dimensions.value.top}px`,
    left: `${dimensions.value.left}px`,
  };
});
</script>

<template>
  <div
    class="resizeContainer"
    :style="[
      { ...positionStyle },
      { ...sizeStyle },
      { borderColor: props.hasBorder ? props.borderColor : `transparent` },
      { border: `1px solid` },
    ]"
  >
    <slot />

    <div class="selector selector__top-left"></div>
    <div class="selector selector__top-right"></div>
    <div class="selector selector__bottom-left"></div>
    <div class="selector selector__bottom-right"></div>
  </div>
</template>

<style scoped lang="scss">
.resizeContainer {
  height: 100px;
  left: 500px;
  position: absolute;
  top: 500px;
  width: 100px;
  border: 1px solid;
}

.selectors {
  position: relative;
  width: 100%;
}

.selector {
  background-color: white;
  border: 1.5px solid black;
  cursor: nwse-resize;
  height: 10px;
  position: absolute;
  width: 10px;

  &__top-left {
    cursor: nwse-resize;
    left: -4px;
    top: -4px;
  }

  &__top-right {
    cursor: nesw-resize;
    right: -4px;
    top: -4px;
  }

  &__bottom-left {
    cursor: nesw-resize;
    bottom: -4px;
    left: -4px;
  }

  &__bottom-right {
    cursor: nwse-resize;
    bottom: -4px;
    right: -4px;
  }
}
</style>
