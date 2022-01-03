<script setup lang="ts"></script>
<template>
  <div id="wrap">
    <div id="header">
      <h1>heu matsumoto</h1>
      <p>frontend engineer / graphic designer / illustrator</p>
      <div class="sns"></div>
    </div>
    <div class="project">
      <img src="" />
      <div class="project_desc">
        <div class="project_desc_title">MetaballDrawTool</div>
        <div class="project_desc_text">
          <p>
            メタボールをくっつけて好きなかたちにできる。
            ドラッグアンドドロップだけのお絵描きツール。
            メタボールの線を描写するアルゴリズムは、Mr. Daniel
            ShiffmanのMarching Square実装方法を参考に作成。
          </p>
        </div>
        <div class="project_desc_useSkill"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
#header {
  height: 100vh;
}
.project {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 80px 50px;

  width: 1099px;
  margin: auto;

  background: #fcfcfc;
  border: 3px solid #000000;
  box-sizing: border-box;
  /* card */

  box-shadow: 0px 0px 20px 1px rgba(0, 0, 0, 0.05);
  border-radius: 5px;

  > img {
    width: 400px;
  }

  &_desc {
    position: static;
    width: 400px;

    flex: none;
    order: 1;
    flex-grow: 0;
    margin: 0 auto;
    &_text {
      //   position: absolute;
      width: 400px;
      > p {
        font-family: Noto Sans JP;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 25px;
        /* or 179% */

        color: #000000;
      }
    }
  }
}
</style>
