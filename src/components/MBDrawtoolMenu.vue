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
  margin-right: 40px;
}
#menu {
  padding: 20px 50px;
  border: 2px solid;
  border-radius: 14px;
  background-color: rgb(94, 185, 221);

  display: flex;
  flex-direction: row;
  align-items: center;
}
.button {
  display: block;
  cursor: pointer;
  padding: 20px 30px;
  margin-right: 20px;

  &:last-child {
    margin-right: 0;
  }

  /* deco */
  border: 2px solid;
  border-radius: 50px;

  /* text */
  text-align: center;
  font-size: 0.6em;
  letter-spacing: 0.2em;
  font-weight: 600;

  background-color: rgb(255, 189, 45);

  &:hover {
    background-color: rgba(255, 189, 45, 0.6);
    transition: 0.3s;
  }
}
</style>
