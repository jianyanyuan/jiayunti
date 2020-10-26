<!--
 * @Author: zfd
 * @Date: 2020-10-26 13:33:24
 * @LastEditors: zfd
 * @LastEditTime: 2020-10-26 16:50:42
 * @Description:
-->
<template>
  <div>
    <el-form :model="construction" :rules="rule" label-width="120px" class="handle-form">
      <el-form-item label="申请编号:">
        <el-input v-model="construction.code" disabled />
      </el-form-item>
      <el-form-item label="施工单位:">
        <el-input v-model="construction.org" disabled />
      </el-form-item>
      <el-form-item label="联系人:">
        <el-input v-model="construction.phone" disabled />
      </el-form-item>
      <el-form-item label="违规时间:">
        <el-input v-model="construction.time" disabled />
      </el-form-item>
      <el-form-item label="违规描述:">
        <el-input v-model="construction.desc" disabled />
      </el-form-item>
      <el-form-item label="违规照片:">
        <div class="image-container">
          <span class="image-inner">
            <img src="https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg" alt="违规照片">
            <span class="icon-container">
              <svg-icon icon-class="eye" />
            </span>

          </span>
        </div>
      </el-form-item>
      <el-form-item label="违规回复:">
        <el-input v-model="construction.feedback" disabled />
      </el-form-item>
      <el-form-item label="回复照片:">
        <el-input v-model="construction.feedbackPic" disabled />
      </el-form-item>
      <el-form-item label="处理说明:" prop="descResult">
        <el-input v-model="construction.descResult" type="textarea" autosize />
      </el-form-item>
      <el-form-item label="处理结果:" prop="result">
        <el-select v-model="construction.result">
          <el-option v-for="item in resultOptions" :key="item.val" :value="item.key" :label="item.val" />
        </el-select>
      </el-form-item>
      <el-row type="flex" justify="center" style="margin-top:50px">
        <el-button type="primary">保 存</el-button>
        <el-button>返 回</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'HandleFault',
  data() {
    return {
      construction: {
        org: '中一建',
        code: '马家浜1号楼',
        phone: '110',
        time: '2020-01-01 10:00',
        desc: '违规操作',
        descPic: [{ name: '违规图片1', url: '' }],
        feedback: '接受批评',
        feedbackPic: [{ name: '回复照片1', url: '' }],
        descResult: '',
        result: 0
      },
      resultOptions: [
        { key: 0, val: '通过' },
        { key: -1, val: '不通过' }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
.handle-form {
  width: 520px;
  margin: 50px auto 0;
}
.image-container {
  width: 150px;
  height: 150px;
  padding: 8px;
  border: 1px solid #434343;
  border-radius: 2px;
  .image-inner {
    display: inline-block;
    height: 100%;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      object-fit: fill;
    }
    .icon-container {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>>

