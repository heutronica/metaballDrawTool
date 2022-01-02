import * as mathFunc from "./mathFunc";
/** generate vactor */
class vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  public getPosX(): number {
    return this.x;
  }
  public getPosY(): number {
    return this.y;
  }
}

export class Blob {
  x: number;
  y: number;
  size: number;
  resolution: number;
  guideSize: number;

  constructor(x: number, y: number, size: number, resolution: number) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.guideSize = size / 2;
    this.resolution = resolution;
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
  getGuideSize(): number {
    return this.guideSize;
  }

  /** Check if mouse cursor is over the metaball. */
  getOnMouse(e: MouseEvent): string {
    let blobToMouse: number =
      Math.round(
        mathFunc.dist(
          this.x,
          this.y,
          e.clientX / this.resolution,
          e.clientY / this.resolution
        ) * 100
      ) / 100;
    if (Math.round(this.guideSize * 100) / 100 > blobToMouse) {
      return "move";
    } else if (Math.round(this.size * 100) / 100 > blobToMouse) {
      return "guide";
    }
    return "nothing";
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

/** Calculating drawCanvas's isoField */
export function isoField(
  fieldArray: number[][],
  cols: number,
  rows: number,
  blobs: Blob[]
) {
  for (let i = 0; i < cols - 1; i++) {
    for (let j = 0; j < rows - 1; j++) {
      let sum: number = 0;

      for (let k = 0; k < blobs.length; k++) {
        let d: number = mathFunc.dist(
          i,
          j,
          blobs[k].getPosX(),
          blobs[k].getPosY()
        );
        sum += blobs[k].getSize() / d;
      }

      if (sum * 100 < 70) {
        fieldArray[i][j] = 0;
      } else {
        fieldArray[i][j] = 1;
      }
    }
  }
}

/** marchingSquare */
export function marchingSquares(
  fieldArray: number[][],
  trgCor: number,
  trgRow: number,
  resolution: number,
  stroke: CanvasRenderingContext2D
) {
  const x = trgCor * resolution;
  const y = trgRow * resolution;

  const a = new vector(x + resolution * 0.5, y); // TOP
  const b = new vector(x + resolution, y + resolution * 0.5); // RIGHT
  const c = new vector(x + resolution * 0.5, y + resolution); // LEFT
  const d = new vector(x, y + resolution * 0.5); // BOTTOM

  let state = getState(
    fieldArray[trgCor][trgRow],
    fieldArray[trgCor + 1][trgRow],
    fieldArray[trgCor + 1][trgRow + 1],
    fieldArray[trgCor][trgRow + 1]
  );

  function getState(a: number, b: number, c: number, d: number) {
    return a * 8 + b * 4 + c * 2 + d * 1;
  }

  switch (state) {
    case 1:
      stroke.moveTo(c.getPosX(), c.getPosY());
      stroke.lineTo(d.getPosX(), d.getPosY());
      // console.log('case1!')
      break;
    case 2:
      stroke.moveTo(b.getPosX(), b.getPosY());
      stroke.lineTo(c.getPosX(), c.getPosY());
      // console.log('case2!')
      break;
    case 3:
      stroke.moveTo(b.getPosX(), b.getPosY());
      stroke.lineTo(d.getPosX(), d.getPosY());
      // console.log('case3!')
      break;
    case 4:
      stroke.moveTo(a.getPosX(), a.getPosY());
      stroke.lineTo(b.getPosX(), b.getPosY());
      // console.log('case4!')
      break;
    case 5:
      stroke.moveTo(a.getPosX(), a.getPosY());
      stroke.lineTo(d.getPosX(), d.getPosY());
      stroke.moveTo(b.getPosX(), b.getPosY());
      stroke.lineTo(c.getPosX(), c.getPosY());
      // console.log('case5!')
      break;
    case 6:
      stroke.moveTo(a.getPosX(), a.getPosY());
      stroke.lineTo(c.getPosX(), c.getPosY());
      // console.log('case6!')
      break;
    case 7:
      stroke.moveTo(a.getPosX(), a.getPosY());
      stroke.lineTo(d.getPosX(), d.getPosY());
      // console.log('case7!')
      break;
    case 8:
      stroke.moveTo(a.getPosX(), a.getPosY());
      stroke.lineTo(d.getPosX(), d.getPosY());
      // console.log('case8!')
      break;
    case 9:
      stroke.moveTo(a.getPosX(), a.getPosY());
      stroke.lineTo(c.getPosX(), c.getPosY());
      // console.log('case9!')
      break;
    case 10:
      stroke.moveTo(a.getPosX(), a.getPosY());
      stroke.lineTo(b.getPosX(), b.getPosY());
      stroke.moveTo(c.getPosX(), c.getPosY());
      stroke.lineTo(d.getPosX(), d.getPosY());
      // console.log('case10!')
      // style(c, d)
      break;
    case 11:
      stroke.moveTo(a.getPosX(), a.getPosY());
      stroke.lineTo(b.getPosX(), b.getPosY());
      // console.log('case11!')
      break;
    case 12:
      stroke.moveTo(b.getPosX(), b.getPosY());
      stroke.lineTo(d.getPosX(), d.getPosY());
      // console.log('case12!')
      break;
    case 13:
      stroke.moveTo(b.getPosX(), b.getPosY());
      stroke.lineTo(c.getPosX(), c.getPosY());
      // console.log('case13!')
      break;
    case 14:
      stroke.moveTo(c.getPosX(), c.getPosY());
      stroke.lineTo(d.getPosX(), d.getPosY());
      // console.log('case14!')
      break;
  }
}
