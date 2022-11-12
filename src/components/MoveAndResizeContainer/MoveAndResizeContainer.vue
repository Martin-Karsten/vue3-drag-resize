<script setup lang="ts">
import {
  computed,
  type ComputedRef,
  ref,
  type Ref,
  onMounted,
  onBeforeUnmount,
} from "vue";
import type {
  PositionStyle,
  SizeStyle,
  Dimensions,
  MousePosition,
  LeftAndTop,
} from "@/typings/MoveAndResizeContainer";
import { SelectorPositions } from "@/enums/enumMap";

const props = withDefaults(
  defineProps<{
    parentWidth: number;
    parentHeight: number;
    minWidth?: number;
    minHeight?: number;
    hasBorder?: boolean;
    borderColor?: string;
  }>(),
  {
    minWidth: 0,
    minHeight: 0,
    hasBorder: true,
    borderColor: `black`,
  }
);

const selectedDragSelector: Ref<string> = ref(``);
const isDragSelectorPressed: Ref<boolean> = ref(false);
const isBodyPressed: Ref<boolean> = ref(false);

const getInitialDimensions: { (): Dimensions } = () => {
  return {
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  };
};

const dimensionsBeforeMove: Ref<Dimensions> = ref(getInitialDimensions());
const dimensions: Ref<Dimensions> = ref(getInitialDimensions());
const limits: Ref<Dimensions> = ref(getInitialDimensions());

const currentMousePosition: Ref<MousePosition> = ref({
  pointerX: 0,
  pointerY: 0,
});

const width: ComputedRef<number> = computed(
  () => props.parentWidth - dimensions.value.left - dimensions.value.right
);
const height: ComputedRef<number> = computed(
  () => props.parentHeight - dimensions.value.top - dimensions.value.bottom
);
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

onMounted(() => {
  dimensions.value.right =
    props.parentWidth - width.value - dimensions.value.left;
  dimensions.value.bottom =
    props.parentHeight - height.value - dimensions.value.top;

  document
    .getElementById(`moveAndResizeContainer`)!
    .addEventListener(`mousedown`, (event: MouseEvent) => {
      isBodyPressed.value = true;

      calcResizeLimits();

      saveDimensionsBeforeMove({
        pointerX: event.pageX,
        pointerY: event.pageY,
      });
    });
  for (const selector of Object.values(SelectorPositions)) {
    document
      .getElementById(selector)!
      .addEventListener(`mousedown`, (event: MouseEvent) => {
        event?.stopPropagation();
        event?.preventDefault();
        selectedDragSelector.value = selector;
        isDragSelectorPressed.value = true;

        calcResizeLimits();

        saveDimensionsBeforeMove({
          pointerX: event.pageX,
          pointerY: event.pageY,
        });
      });
  }

  addEvents();
});

const saveDimensionsBeforeMove: { (mousePosition: MousePosition): void } = ({
  pointerX,
  pointerY,
}) => {
  currentMousePosition.value.pointerX = pointerX;
  currentMousePosition.value.pointerY = pointerY;

  dimensionsBeforeMove.value.left = dimensions.value.left;
  dimensionsBeforeMove.value.right = dimensions.value.right;
  dimensionsBeforeMove.value.top = dimensions.value.top;
  dimensionsBeforeMove.value.bottom = dimensions.value.bottom;
};

const calcResizeLimits: { (): void } = () => {
  limits.value = {
    left: Math.max(dimensions.value.left + width.value - props.minWidth, 0),
    right: Math.max(dimensions.value.right + width.value - props.minWidth, 0),
    top: Math.max(dimensions.value.top + width.value - props.minHeight, 0),
    bottom: Math.max(
      dimensions.value.bottom + width.value - props.minHeight,
      0
    ),
  };
};
const move: { (event: MouseEvent): void } = (event: MouseEvent) => {
  event.stopPropagation();
  const delta: LeftAndTop = {
    left: currentMousePosition.value.pointerX - event.pageX,
    top: currentMousePosition.value.pointerY - event.pageY,
  };
  if (isDragSelectorPressed.value) {
    drag(delta);
  } else if (isBodyPressed.value) {
    moveBody(delta);
  }
};
const moveBody: { (delta: LeftAndTop): void } = (delta) => {
  positionCorrectionByLimit(getMovedValues(delta));
};
const getMovedValues: { (delta: LeftAndTop): Dimensions } = (delta) => {
  return {
    top: dimensionsBeforeMove.value.top - delta.top,
    bottom: dimensionsBeforeMove.value.bottom + delta.top,
    left: dimensionsBeforeMove.value.left - delta.left,
    right: dimensionsBeforeMove.value.right + delta.left,
  };
};
const drag: { (delta: LeftAndTop): void } = (delta) => {
  positionCorrectionByLimit(getResizedValues(delta));
};
const positionCorrectionByLimit: { (newDimension: Dimensions): void } = (
  newDimension
) => {
  dimensions.value.left = getSideCorrectionsByLimit(
    limits.value.left,
    newDimension.left
  );
  dimensions.value.right = getSideCorrectionsByLimit(
    limits.value.right,
    newDimension.right
  );
  dimensions.value.top = getSideCorrectionsByLimit(
    limits.value.top,
    newDimension.top
  );
  dimensions.value.bottom = getSideCorrectionsByLimit(
    limits.value.bottom,
    newDimension.bottom
  );
};
const getSideCorrectionsByLimit: {
  (limit: number, currentLimit: number): number;
} = (limit, currentLimit) => {
  if (limit && currentLimit < 0) {
    return 0;
  } else if (limit < currentLimit) {
    return limit;
  }

  return currentLimit;
};
const getResizedValues: {
  (delta: LeftAndTop): Dimensions;
} = (delta) => {
  const newDimension: Dimensions = {
    top: dimensionsBeforeMove.value.top,
    bottom: dimensionsBeforeMove.value.bottom,
    left: dimensionsBeforeMove.value.left,
    right: dimensionsBeforeMove.value.right,
  };

  if (selectedDragSelector.value.includes(`bottom`)) {
    newDimension.bottom = dimensionsBeforeMove.value.bottom + delta.top;
  }
  if (selectedDragSelector.value.includes(`top`)) {
    newDimension.top = dimensionsBeforeMove.value.top - delta.top;
  }
  if (selectedDragSelector.value.includes(`right`)) {
    newDimension.right = dimensionsBeforeMove.value.right + delta.left;
  }
  if (selectedDragSelector.value.includes(`left`)) {
    newDimension.left = dimensionsBeforeMove.value.left - delta.left;
  }

  return newDimension;
};
const deselect: { (): void } = (): void => {
  isDragSelectorPressed.value = false;
  isBodyPressed.value = false;
};

const addEvents: { (): void } = () => {
  EVENT_MAP.forEach((callback, eventName) =>
    document.documentElement.addEventListener(eventName, callback)
  );
};
const removeEvents: { (): void } = () => {
  EVENT_MAP.forEach((callback, eventName) =>
    document.documentElement.addEventListener(eventName, callback)
  );
};

const EVENT_MAP: Readonly<Map<string, any>> = new Map([
  [`mousemove`, move],
  [`mouseup`, deselect],
  [`mouseleave`, deselect],
]);

onBeforeUnmount(() => {
  removeEvents();
});
</script>

<template>
  <div
    class="moveAndResizeContainer"
    id="moveAndResizeContainer"
    :style="[
      { ...positionStyle },
      { ...sizeStyle },
      { borderColor: props.hasBorder ? props.borderColor : `transparent` },
      { border: `1px solid` },
    ]"
  >
    <slot />

    <div
      v-for="selector in SelectorPositions"
      :key="selector"
      :id="selector"
      :class="`selector__${selector}`"
      class="selector"
    ></div>
  </div>
</template>

<style scoped lang="scss">
.moveAndResizeContainer {
  height: 100px;
  position: absolute;
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
