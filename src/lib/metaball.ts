import {calcDistance} from './utils/mathFunc';

export class Metaball {
  x: number;
  y: number;
  size: number;
  cellScale: number;

  constructor(x: number, y: number, size: number, cellScale: number) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.cellScale = cellScale;
  }

  getPosX(): number {
    return this.x;
  }
  getPosY(): number {
    return this.y;
  }
  getSize(): number {
    return this.size;
  }

  /** Check if mouse cursor is over the metaball. */
  getOnMouse(e: MouseEvent): boolean {
    const blobToMouse: number =
      Math.round(
          calcDistance(
              this.x,
              this.y,
              e.clientX / this.cellScale,
              e.clientY / this.cellScale,
          ) * 100,
      ) / 100;

    if (Math.round(this.size * 100) / 100 > blobToMouse) {
      return true;
    }
    return false;
  }

  /** Update metaball coordinates
  @param {number} x 更新したいX座標値
  @param {number} y 更新したいY座標値
  @return {null} null
  */
  move(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
