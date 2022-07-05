// This is Marching square algorithm.
// https://en.wikipedia.org/wiki/Marching_squares

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

export function calcContourLine(
    fieldArray: number[][],
    targetCor: number,
    targetRow: number,
    resolution: number,
    stroke: CanvasRenderingContext2D,
) {
  const x = targetCor * resolution;
  const y = targetRow * resolution;

  const a = new vector(x + resolution * 0.5, y); // TOP
  const b = new vector(x + resolution, y + resolution * 0.5); // RIGHT
  const c = new vector(x + resolution * 0.5, y + resolution); // LEFT
  const d = new vector(x, y + resolution * 0.5); // BOTTOM

  const state = getState(
      fieldArray[targetCor][targetRow],
      fieldArray[targetCor + 1][targetRow],
      fieldArray[targetCor + 1][targetRow + 1],
      fieldArray[targetCor][targetRow + 1],
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
