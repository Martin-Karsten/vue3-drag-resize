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

type LeftAndTop = Pick<Dimensions, `left` | `top`>;

export type { PositionStyle, SizeStyle, Dimensions, MousePosition, LeftAndTop };
