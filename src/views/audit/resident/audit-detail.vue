<!--
 * @Author: zfd
 * @Date: 2020-10-30 14:33:26
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-22 09:29:14
 * @Description: 审核意见
-->
<template>
  <div class="app-container">
    <el-page-header content="审核意见" @back="$router.go(-1)" />

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
    <el-dialog center title="图片详情" :visible.sync="imgVisible" :close-on-click-modal="false" class="dialog-center">
      <img :src="detailImgUrl" alt="授权委托书">
    </el-dialog>
    <el-dialog title="pdf预览" center :visible.sync="pdfVisible" :close-on-click-modal="false" class="dialog-center">
      <!-- 加载全部页面的PDF是一个for循环,不能指定用来打印的ref -->
      <div ref="printContent">
        <Pdf v-for="i in pdfPages" :key="i" :src="pdfURL" :page="i" />
      </div>
      <span slot="footer">
        <el-button @click="printPDF" type="success">打印</el-button>
        <!-- <el-button type="primary" @click="printImg">转图片打印</el-button> -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixin from '@/components/UploadList/mixin'
export default {
  name: 'AuditDetail',
  mixins:[mixin],
  data() {
    return {
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
