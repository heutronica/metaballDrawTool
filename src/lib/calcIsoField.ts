/** Calculating drawCanvas's isoField */
import {calcDistance} from './utils/mathFunc';
import {Metaball} from './metaball';

export function calcIsoField(
    fieldArray: boolean[][],
    cols: number,
    rows: number,
    metaball: Metaball[],
) {
  for (let i = 0; i < cols - 1; i++) {
    for (let j = 0; j < rows - 1; j++) {
      let sum: number = 0;

      for (let k = 0; k < metaball.length; k++) {
        const d: number = calcDistance(
            i,
            j,
            metaball[k].getPosX(),
            metaball[k].getPosY(),
        );
        sum += metaball[k].getSize() / d;
      }

      if (sum * 100 < 70) {
        fieldArray[i][j] = false;
      } else {
        fieldArray[i][j] = true;
      }
    }
  }
}
