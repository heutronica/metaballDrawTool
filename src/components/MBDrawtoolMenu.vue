<script setup lang="ts">
interface Emits {
  (e: "resetCanvas", value: boolean): void;
  (e: "dlImage", value: boolean): void;
}
const emit = defineEmits<Emits>();
const resetClick = () => {
  emit("resetCanvas", true);
};
const dlClick = () => {
  emit("dlImage", true);
};
</script>

<template>
  <div id="menu">
    <h2>MATABALL<br />DRAW TOOL</h2>
    <div @click="resetClick" id="resetButton" class="button">RESET</div>
    <div @click="dlClick" id="dlButton" class="button">DOWNLOAD</div>
  </div>
</template>

<style lang="scss" scoped>
h2 {
  margin-bottom: 30px;
}
#menu {
  padding: 40px 20px;
  border: 2px solid;
  border-radius: 20px;
}
.button {
  display: block;
  cursor: pointer;
  padding: 10px 30px;
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }

  /* deco */
  border: 2px solid;
  border-radius: 20px;

  /* text */
  text-align: center;
  font-size: 0.7em;
  letter-spacing: 0.2em;
  font-weight: 600;

  &:hover {
    background-color: rgb(223, 223, 223);
    transition: 0.3s;
    transform: scale(1.015);
  }
}
</style>
