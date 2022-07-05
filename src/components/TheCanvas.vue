<script setup lang="ts">
import Menu from './TheMenu.vue'

import { calcDistance } from '../lib/utils/mathFunc'
import { calcContourLine } from '../lib/calcContourLine'
import { calcIsoField } from '../lib/calcIsoField'
import { Metaball } from '../lib/metaball'
import { ref, onMounted } from 'vue'

type MetaballCoordinate = {
  posX: number
  posY: number
}

type MouseStatus = {
  event: null | 'drag'
  place: 'outside' | 'field' | 'core'
}

let mouseStatus: MouseStatus = {
  event: null,
  place: 'outside',
}

// CAUTION !! Smaller number calculate TOO HEAVY.
// if cellScale = 1, that 1920 x 1080 = 2,073,600 ...
// Calculation is done 2,073,600 times !
const cellScale = 5

// ------------------//
//-- CANVAS SETUP --//
// -----------------//

let canvasWidth: number = document.documentElement.clientWidth
let canvasHeight: number = document.documentElement.clientHeight

let canvasCols = Math.round(canvasWidth / cellScale)
let canvasRows = Math.round(canvasHeight / cellScale)

const _drawCanvas = ref<InstanceType<typeof HTMLCanvasElement>>()
const _guideCanvas = ref<InstanceType<typeof HTMLCanvasElement>>()

let drawCanvas = {
  field: Array.from(new Array(canvasCols), () =>
    new Array(canvasRows).fill(false)
  ),
  canvas: _drawCanvas.value?.getContext('2d') as CanvasRenderingContext2D,
}

let guideViewCanvas = {
  canvas: _guideCanvas.value?.getContext('2d') as CanvasRenderingContext2D,
}

// initialize //

onMounted(() => {
  drawCanvas.canvas = _drawCanvas.value?.getContext(
    '2d'
  ) as CanvasRenderingContext2D
  guideViewCanvas.canvas = _guideCanvas.value?.getContext(
    '2d'
  ) as CanvasRenderingContext2D

  guideViewCanvas.canvas.fillStyle = 'rgba(5,248,219,0.8)'

  drawCanvas.canvas.strokeStyle = 'hsl(0, 0%, 0%)'
  drawCanvas.canvas.lineWidth = 3
})

let metaball: Metaball[] = new Array()

let metaballCoordinate: MetaballCoordinate = {
  posX: 0,
  posY: 0,
}

let metaballIndex = 0

// ----------------------//
//-- GENERATE METABALL --//
// ---------------------//

/**  When mouse pressed down, find Center coordinates of the metaball */
/** Draw the metaball's outline on the target canvas.*/

let nowCreateMetaball = false

const startCreateMetaball = function (e: MouseEvent) {
  metaballCoordinate.posX = Math.round(e.pageX / cellScale)
  metaballCoordinate.posY = Math.round(e.pageY / cellScale)
  nowCreateMetaball = true
}

/**  When mouse release, generate metaball */
const createMetaball = function (e: MouseEvent) {
  if (nowCreateMetaball === true) {
    drawCanvas.canvas.clearRect(0, 0, canvasWidth, canvasHeight)

    let metaballSize: number =
      Math.round(
        calcDistance(
          metaballCoordinate.posX,
          metaballCoordinate.posY,
          e.pageX / cellScale,
          e.pageY / cellScale
        ) * 10
      ) / 10

    if (metaballSize > 50) {
      metaballSize = 50
    } else if (metaballSize < 1) {
      metaballSize = 1
    }

    metaball.push(
      new Metaball(
        metaballCoordinate.posX,
        metaballCoordinate.posY,
        metaballSize,
        cellScale
      )
    )

    calcIsoField(drawCanvas.field, canvasCols, canvasRows, metaball)
    drawOutline()
    nowCreateMetaball = false
  }

  mouseStatus.event = null
}

// ------------------------------//
//------- CHANGE METABALL -------//
// ------------------------------//
const move = function (e: MouseEvent) {
  let judgeOnIsoField: boolean =
    drawCanvas.field[Math.round(e.clientX / cellScale)][
      Math.round(e.clientY / cellScale)
    ]

  if (mouseStatus.event === 'drag') {
    moveMetaball(e)
  }

  if (judgeOnIsoField === false) {
    mouseStatus.place = 'outside'
    guideViewCanvas.canvas.clearRect(0, 0, canvasWidth, canvasHeight)
  } else {
    mouseStatus.place = 'field'
    for (let i = 0; i < metaball.length; i++) {
      if (metaball[i].getOnMouse(e) === true) {
        metaballIndex = i
        mouseStatus.place = 'core'
        guideViewCanvas.canvas.clearRect(0, 0, canvasWidth, canvasHeight)
        showGuide()
      }
    }
  }
}

const click = function (e: MouseEvent) {
  if (mouseStatus.place === 'core') {
    mouseStatus.event = 'drag'
  } else if (mouseStatus.place === 'outside') {
    mouseStatus.event = 'drag'
    startCreateMetaball(e)
  }
}

const moveMetaball = function (e: MouseEvent) {
  if (mouseStatus.event === 'drag' && nowCreateMetaball === false) {
    metaball[metaballIndex].move(e.pageX / cellScale, e.pageY / cellScale)
    setTimeout(function () {
      calcIsoField(drawCanvas.field, canvasCols, canvasRows, metaball)
      drawCanvas.canvas.clearRect(0, 0, canvasWidth, canvasHeight)
      drawOutline()
    }, 100)
  }
}

const resizeMetaball = function (e: WheelEvent) {
  if (mouseStatus.place === 'core') {
    let i = metaballIndex

    metaball[i].size -= e.deltaY / 200
    if (metaball[i].size < 1) {
      metaball[i].size = 1
    } else if (metaball[i].size > 50) {
      metaball[i].size = 50
    }
    calcIsoField(drawCanvas.field, canvasCols, canvasRows, metaball)
    drawCanvas.canvas.clearRect(0, 0, canvasWidth, canvasHeight)
    guideViewCanvas.canvas.clearRect(0, 0, canvasWidth, canvasHeight)
    drawOutline()
    showGuide()
  }
}

//

const drawOutline = function () {
  for (let i = 0; i < canvasCols - 1; i++) {
    for (let j = 0; j < canvasRows - 1; j++) {
      drawCanvas.canvas.beginPath()
      calcContourLine(drawCanvas.field, i, j, cellScale, drawCanvas.canvas)
      drawCanvas.canvas.stroke()
    }
  }
}

const showGuide = function () {
  let i = metaballIndex

  guideViewCanvas.canvas.beginPath()
  guideViewCanvas.canvas.arc(
    metaball[i].getPosX() * cellScale,
    metaball[i].getPosY() * cellScale,
    metaball[i].getSize() * cellScale,
    0,
    360
  )
  guideViewCanvas.canvas.closePath()
  guideViewCanvas.canvas.fill()
}

// -------------------//
//-- DRAWTOOL MENU --//
// ------------------//

/** resetCanvas button */
const resetCanvas = function () {
  drawCanvas.canvas.clearRect(0, 0, canvasWidth, canvasHeight)
  drawCanvas.field = Array.from(new Array(canvasCols), () =>
    new Array(canvasRows).fill(false)
  )
  metaball = new Array()
}

/** downloadImage button */
const dlImage = function () {
  const downloadLink: HTMLAnchorElement = document.createElement('a')
  let today: Date = new Date()
  if (_drawCanvas.value != undefined) {
    downloadLink.href = _drawCanvas.value.toDataURL()
    downloadLink.download = `metaball_${today.getFullYear()}${
      today.getMonth() + 1
    }${today.getDate()}.png`
    downloadLink.click()
  }
}
</script>

<template>
  <div id="wrap">
    <canvas
      :width="canvasWidth"
      :height="canvasHeight"
      @mousedown="click"
      @mouseup="createMetaball"
      @mousemove="move"
      @wheel="resizeMetaball"
      ref="_drawCanvas"
      id="canvas"
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
