<!--
 * @Author: zfd
 * @Date: 2020-10-27 09:15:53
 * @LastEditors: zfd
 * @LastEditTime: 2020-10-27 13:33:21
 * @Description:
-->
<template>
  <div class="image-container">
    <span class="image-inner">
      <img :src="url" alt="附件照片">
      <span class="icon-container" @click="showPic">
        <i class="el-icon-view icon-center" />
      </span>
    </span>
  </div>
</template>

<script>
export default {
  name: 'ImageCard',
  props: {
    url: {
      type: String,
      default: ''
    }
  },
  methods: {
    showPic() {
      this.$emit('show', this.url)
    }
  }
}
</script>

<style lang="scss" scoped>
.image-container {
  width: 150px;
  height: 150px;
  max-height: 150px;
  // padding: 2px;
  border: 1px solid #c0ccda;
  border-radius: 2px;
  position: relative;

  .image-inner {
    display: inline-block;
    height: 100%;

    img {
      width: 100%;
      height: 100%;
      object-fit: fill;
    }
    .icon-container {
      // visibility: hidden;
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      text-align: center;
      vertical-align: middle;
      color: #fff;
      font-size: 20px;
      cursor: pointer;
      .icon-center {
        visibility: hidden;
        line-height: 150px;
      }
      // top: 50%;
      // left: 50%;
      // transform: translate(-50%, -50%);
      &:hover {
        background-color: rgba(0, 0, 0, 0.5);
        transition: opacity 0.3s;
        .icon-center {
          visibility: visible;
        }
        // opacity: 0;
        // color: #fff;
      }
    }
  }
}
</style>
