<!--
 * @Author: zfd
 * @Date: 2020-10-30 14:33:26
 * @LastEditors: zfd
 * @LastEditTime: 2020-10-30 15:05:09
 * @Description: 审核意见
-->
<template>
  <div class="app-container">
    <el-page-header content="审核结果" @back="$router.go(-1)" />

    <el-form label-width="120px" class="center-form">
      <el-form-item label="审核人：">
        {{ audit.name }}
      </el-form-item>
      <el-form-item label="单位：">
        {{ audit.org }}
      </el-form-item>
      <el-form-item label="电话：">
        {{ audit.phone }}
      </el-form-item>
      <el-form-item label="审核意见：">
        {{ audit.remarks }}
      </el-form-item>
      <el-form-item label="附件：">
        <upload-list :files="audit.attachments" list-type="picture-card" :disabled="true" :handle-preview="detailImg" />
      </el-form-item>
      <el-form-item label="审核结果：">
        {{ audit.result }}
      </el-form-item>
    </el-form>
    <el-dialog center title="图片详情" :visible.sync="imgVisible" :close-on-click-modal="false">
      <img :src="detailImgUrl" alt="审核图片">
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'AuditDetail',
  data() {
    return {
      imgVisible: false,
      audit: {
        name: '大萨达',
        org: '社区111',
        phone: '15988800323',
        remarks: '大萨达萨达撒多撒大所',
        attachments: [
          { name: '附件', url: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg', uid: '附件' }
        ],
        result: '通过'
      }

    }
  },
  methods: {
    detailImg(file) {
      this.detailImgUrl = file.url
      this.imgVisible = true
    }
  }
}
</script>
