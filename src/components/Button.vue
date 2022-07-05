<script lang="ts">
export default{
  name:'button',
  props: {
    btnStyle: {
      type: String,
      default:''
    }
  }
}
</script>

<template>
    <button :class="btnStyle" v-bind="$attrs" v-on="$listeners" class="button"><slot /></button>
</template>

<style lang="scss" scoped>
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

.reset {
  background-color: rgb(192, 62, 53);
  &:hover {
    background-color: rgba(192, 62, 53, 0.6);
    transition: 0.3s;
  }
}
</style>
