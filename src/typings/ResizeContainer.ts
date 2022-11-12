interface PositionStyle {
  top: string;
  left: string;
}

interface SizeStyle {
  width: string;
  height: string;
}

interface Dimensions {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

interface MousePosition {
  pointerX: number;
  pointerY: number;
}

export type { PositionStyle, SizeStyle, Dimensions, MousePosition };
