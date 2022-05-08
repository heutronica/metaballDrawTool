<script setup lang="ts">
import * as mathFunc from "./MBDrawtoolFunc/mathFunc";
import * as blobFunc from "./MBDrawtoolFunc/MBDrawtoolFunc";
import Menu from "./MBDrawtoolMenu.vue";
import { ref, onMounted } from "vue";

// --------------//
//-- TYPE ROOM --//
// --------------//

interface BlobCanvasStatus {
  field: number[][];
  strokeWeight: number;
  strokeColor: string;
  canvas: CanvasRenderingContext2D;
}

interface GuideCanvasStatus {
  strokeColor: string;
  canvas: CanvasRenderingContext2D;
}

interface BlobsStatus {
  posX: number;
  posY: number;
  judge: boolean;
}

interface MousePointJudge {
  isoField: boolean;
  metaballCore: any;
  whichMetaball: number;
}

const blobResolution: number = 5;
let judgeStatus: string = "mouseIsNutral";
let canvasCols: number;
let canvasRows: number;

// ------------------//
//-- CANVAS SETUP --//
// -----------------//

let canvasWidth: number = document.documentElement.clientWidth;
let canvasHeight: number = document.documentElement.clientHeight;

const _drawCanvas = ref<InstanceType<typeof HTMLCanvasElement>>();
const _guideCanvas = ref<InstanceType<typeof HTMLCanvasElement>>();

let drawBlob: BlobCanvasStatus = {
  field: [],
  strokeWeight: 3,
  strokeColor: "hsl(0, 0%, 0%)",
  canvas: _drawCanvas.value?.getContext("2d") as CanvasRenderingContext2D,
};

let guideBlob: GuideCanvasStatus = {
  strokeColor: "rgba(5,248,219,0.8)",
  canvas: _guideCanvas.value?.getContext("2d") as CanvasRenderingContext2D,
};

onMounted(() => {
  drawBlob.canvas = _drawCanvas.value?.getContext(
    "2d"
  ) as CanvasRenderingContext2D;
  guideBlob.canvas = _guideCanvas.value?.getContext(
    "2d"
  ) as CanvasRenderingContext2D;

  guideBlob.canvas.fillStyle = guideBlob.strokeColor;
  drawBlob.canvas.strokeStyle = drawBlob.strokeColor;
  drawBlob.canvas.lineWidth = drawBlob.strokeWeight;
});

// --------------------//
//-- METABALL SETUP --//
// -------------------//

canvasCols = Math.round(canvasWidth / blobResolution);
canvasRows = Math.round(canvasHeight / blobResolution);

drawBlob.field = Array.from(new Array(canvasCols), () =>
  new Array(canvasRows).fill(0)
);

let blobs: blobFunc.Blob[] = new Array();

let blobsStatus: BlobsStatus = {
  posX: 0,
  posY: 0,
  judge: false,
};

let mousePointJudge: MousePointJudge = {
  isoField: true,
  metaballCore: ref<boolean>(false),
  whichMetaball: 0,
};

// ----------------------//
//-- GENERATE METABALL --//
// ---------------------//

/**  When mouse pressed down, find Center coordinates of the metaball */
/** Draw the metaball's outline on the target canvas.*/
const drawOutline = function (targetBlobs: BlobCanvasStatus) {
  for (let i = 0; i < canvasCols - 1; i++) {
    for (let j = 0; j < canvasRows - 1; j++) {
      targetBlobs.canvas.beginPath();
      blobFunc.marchingSquares(
        targetBlobs.field,
        i,
        j,
        blobResolution,
        targetBlobs.canvas
      );
      targetBlobs.canvas.stroke();
    }
  }
};

const startBlob = function (e: MouseEvent) {
  if (judgeStatus === "mouseIsNutral") {
    blobsStatus.posX = Math.round(e.pageX / blobResolution);
    blobsStatus.posY = Math.round(e.pageY / blobResolution);
    mousePointJudge.metaballCore.value = false;
    blobsStatus.judge = true;
  }
};

/**  When mouse release, generate metaball */
const createBlob = function (e: MouseEvent) {
  if (blobsStatus.judge === true) {
    drawBlob.canvas.clearRect(0, 0, canvasWidth, canvasHeight);
    let blobsize: number =
      Math.round(
        mathFunc.dist(
          blobsStatus.posX,
          blobsStatus.posY,
          e.pageX / blobResolution,
          e.pageY / blobResolution
        ) * 10
      ) / 10;

    if (blobsize > 50) {
      blobsize = 50;
    } else if (blobsize < 1) {
      blobsize = 1;
    }

    blobs.push(
      new blobFunc.Blob(
        blobsStatus.posX,
        blobsStatus.posY,
        blobsize,
        blobResolution
      )
    );

    blobFunc.isoField(drawBlob.field, canvasCols, canvasRows, blobs);
    drawOutline(drawBlob);
    blobsStatus.judge = false;
  }
};

// ------------------------------//
//------- CHANGE METABALL -------//
// ------------------------------//

/** Drag to update the center coordinates of metaball */
let temp_judge: boolean = false;

const move = function (e: MouseEvent) {
  guideBlob.canvas.clearRect(0, 0, canvasWidth, canvasHeight);
  judge(e);
  if (mousePointJudge.isoField === true && e.buttons === 0) {
    showGuide();
  } else if (
    (mousePointJudge.metaballCore.value === true && e.buttons === 1) ||
    temp_judge === true
  ) {
    temp_judge = true;
    showGuide();
    moveBlob(e);
  }
};

const judge = function (e: MouseEvent) {
  let nowPoint: number =
    drawBlob.field[Math.round(e.clientX / blobResolution)][
      Math.round(e.clientY / blobResolution)
    ];

  if (nowPoint === 1 && e.buttons === 0) {
    mousePointJudge.isoField = true;
    for (let i = 0; i < blobs.length; i++) {
      if (blobs[i].getOnMouse(e) === "move") {
        mousePointJudge.whichMetaball = i;
        mousePointJudge.metaballCore.value = true;
        judgeStatus = "mouseOnMetaballCore";
      }
    }
  } else if (nowPoint === 0 && e.buttons === 1) {
    mousePointJudge.isoField = false;
    mousePointJudge.metaballCore.value = false;
    judgeStatus = "mouseNotClickOnMetaball";
  } else if (nowPoint === 0 && e.buttons === 1 && temp_judge === true) {
    // mousePointJudge.isoField = false;
    mousePointJudge.metaballCore.value = true;
    judgeStatus = "nowMove!";
  } else if (e.buttons === 0 && temp_judge === true) {
    temp_judge = false;
    judgeStatus = "nowMove!";
  } else if (nowPoint === 0 && e.buttons === 0) {
    mousePointJudge.isoField = false;
    mousePointJudge.metaballCore.value = false;
    judgeStatus = "mouseIsNutral";
  }
};

const showGuide = function () {
  guideBlob.canvas.beginPath();
  guideBlob.canvas.arc(
    blobs[mousePointJudge.whichMetaball].getPosX() * blobResolution,
    blobs[mousePointJudge.whichMetaball].getPosY() * blobResolution,
    blobs[mousePointJudge.whichMetaball].getSize() * blobResolution,
    0,
    360
  );
  guideBlob.canvas.closePath();
  guideBlob.canvas.fill();
};

const moveBlob = function (e: MouseEvent) {
  blobs[mousePointJudge.whichMetaball].move(
    e.pageX / blobResolution,
    e.pageY / blobResolution
  );
  setTimeout(function () {
    blobFunc.isoField(drawBlob.field, canvasCols, canvasRows, blobs);
    drawBlob.canvas.clearRect(0, 0, canvasWidth, canvasHeight);
    drawOutline(drawBlob);
  }, 100);
  // }
};

const resizeBlob = function (e: WheelEvent) {
  if (mousePointJudge.metaballCore.value === true) {
    blobs[mousePointJudge.whichMetaball].size -= e.deltaY / 200;
    if (blobs[mousePointJudge.whichMetaball].size < 1) {
      blobs[mousePointJudge.whichMetaball].size = 1;
    } else if (blobs[mousePointJudge.whichMetaball].size > 50) {
      blobs[mousePointJudge.whichMetaball].size = 50;
    }
    blobFunc.isoField(drawBlob.field, canvasCols, canvasRows, blobs);
    drawBlob.canvas.clearRect(0, 0, canvasWidth, canvasHeight);
    guideBlob.canvas.clearRect(0, 0, canvasWidth, canvasHeight);
    drawOutline(drawBlob);
    showGuide();
  }
};

// -------------------//
//-- DRAWTOOL MENU --//
// ------------------//

/** resetCanvas button */
const resetCanvas = function () {
  drawBlob.canvas.clearRect(0, 0, canvasWidth, canvasHeight);
  drawBlob.field = Array.from(new Array(canvasCols), () =>
    new Array(canvasRows).fill(0)
  );
  blobs = new Array();
};

/** downloadImage button */
const dlImage = function () {
  const downloadLink: HTMLAnchorElement = document.createElement("a");
  let today: Date = new Date();
  if (_drawCanvas.value != undefined) {
    downloadLink.href = _drawCanvas.value.toDataURL();
    downloadLink.download = `metaball_${today.getFullYear()}${
      today.getMonth() + 1
    }${today.getDate()}.png`;
    downloadLink.click();
  }
};
</script>

<template>
  <div id="wrap">
    <canvas
      :width="canvasWidth"
      :height="canvasHeight"
      @mousedown="startBlob"
      @mouseup="createBlob"
      @mousemove="move"
      @wheel="resizeBlob"
      ref="_drawCanvas"
      id="canvas"
      :class="{ pointer: mousePointJudge.metaballCore.value }"
    ></canvas>
    <canvas
      :width="canvasWidth"
      :height="canvasHeight"
      ref="_guideCanvas"
      id="guideCanvas"
    ></canvas>
    <Menu id="menu" @resetCanvas="resetCanvas" @dlImage="dlImage" />
  </div>
</template>

<style scoped>
#wrap {
  position: relative;
  height: 100vh;
}
#canvas {
  position: absolute;
  right: 0;
  bottom: 100;
  z-index: 1;
}
#guideCanvas {
  position: absolute;
  right: 0;
  bottom: 100;
  z-index: 0;
}
#menu {
  position: absolute;
  z-index: 2;
  right: 50%;
  bottom: 20px;
  transform: translateX(50%);
}
.pointer {
  cursor: pointer;
}
</style>
