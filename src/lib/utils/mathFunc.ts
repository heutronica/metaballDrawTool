// This function calculates the distance from (x1, y1) to (x2, y2).
export function calcDistance(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
