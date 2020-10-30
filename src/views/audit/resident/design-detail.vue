<!--
 * @Author: zfd
 * @Date: 2020-10-30 14:33:26
 * @LastEditors: zfd
 * @LastEditTime: 2020-10-30 15:13:34
 * @Description: 居民查看设计图
-->
<template>
  <div class="app-container">
    <el-page-header content="设计图" @back="$router.go(-1)" />

    <el-form label-width="120px" class="center-form">
      <el-form-item label="单位：">
        {{ design.org }}
      </el-form-item>
      <el-form-item label="电话：">
        {{ design.phone }}
      </el-form-item>
      <el-form-item label="地址：">
        {{ design.address }}
      </el-form-item>
      <el-form-item label="附件：">
        <upload-list :files="design.attachments" list-type="picture-card" :disabled="true" :handle-preview="detailImg" />
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
      design: {
        org: '建研院',
        phone: '15988800323',
        address: '滨河路',
        attachments: [
          { name: '附件', url: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg', uid: '附件' }
        ]
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
