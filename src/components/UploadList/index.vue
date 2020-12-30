<!--
 * @Author: zfd
 * @Date: 2020-12-07 10:57:23
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-30 09:20:18
 * @Description: 
-->
<template>
  <div>
    <transition-group tag="ul" :class="[
      'el-upload-list',
      'el-upload-list--' + listType,
      { 'is-disabled': disabled }
    ]" name="el-list">
      <li v-for="file in files" :class="['el-upload-list__item', 'is-' + file.status, focusing ? 'focusing' : '']" :key="file.uid" tabindex="0" @keydown.delete="!disabled && $emit('remove', file)" @focus="focusing = true" @blur="focusing = false" @click="focusing = false">
        <slot :file="file">
          <img class="el-upload-list__item-thumbnail" v-if="file.status !== 'uploading' && ['picture-card', 'picture'].indexOf(listType) > -1" :src="handleURL(file)" alt="">

          <a class="el-upload-list__item-name" @click="handleClick(file)">
            <i class="el-icon-document"></i>{{file.name}}
          </a>
          <label class="el-upload-list__item-status-label">
            <i :class="{
            'el-icon-upload-success': true,
            'el-icon-circle-check': listType === 'text',
            'el-icon-check': ['picture-card', 'picture'].indexOf(listType) > -1
          }"></i>
          </label>
          <i class="el-icon-close" v-if="!disabled" @click="$emit('remove', file)"></i>
          <i class="el-icon-close-tip" v-if="!disabled">{{ t('el.upload.deleteTip') }}</i>
          <!--因为close按钮只在li:focus的时候 display, li blur后就不存在了，所以键盘导航时永远无法 focus到 close按钮上-->
          <span class="el-upload-list__item-actions" v-if="listType === 'picture-card'">
            <span class="el-upload-list__item-preview" v-if="listType === 'picture-card'" @click="handleClick(file)">
              <i class="el-icon-zoom-in"></i>
            </span>
            <span v-if="!disabled" class="el-upload-list__item-delete" @click="$emit('remove', file)">
              <i class="el-icon-delete"></i>
            </span>
          </span>
        </slot>
      </li>
    </transition-group>
    <el-dialog center title="图片详情" :visible.sync="imgVisible" class="dialog-center-public">
      <img :src="detailImgUrl" alt="意见咨询表">
    </el-dialog>

    <el-dialog center :visible.sync="pdfVisible" class="dialog-center-public">
      <!-- 加载全部页面的PDF是一个for循环,不能指定用来打印的ref -->
      <div ref="printContent">
        <Pdf v-for="i in pdfPages" :key="i" :src="pdfURL" :page="i" />
      </div>
      <span slot="title">
        <el-button @click="printPDF('printContent')" type="success" style="float:left">打印</el-button>
        <span class="pdf-title">PDF预览</span>
      </span>
    </el-dialog>
  </div>

</template>
<script>
import Pdf from 'vue-pdf'
import html2canvas from 'html2canvas'
import printJS from 'print-js'
export default {

  name: 'UploadList',
  data() {
    return {
      focusing: false,
      pdfImgURL: require('@/assets/images/pdf.jpg'),
      errorURL: require('@/assets/images/error.jpg'),
      loadingURL: require('@/assets/images/loading.gif'),
      // 修改后重新保存
      pdfURL: '',
      pdfVisible: false,
      pdfPages: undefined, // pdf内容
      imgVisible: false,
      detailImgUrl: '',
    };
  },
  components: {
    Pdf
  },
  props: {
    files: {
      type: Array,
      default() {
        return [];
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    handlePreview: Function,
    listType: String
  },
  methods: {
    handleClick(file) {
      this.detailFile(file);
    },
    handleURL(file) {
      const isPdf = /\bpdf/i.test(file.name) || /\bpdf$/i.test(file.url)
      return isPdf ? this.pdfImgURL : file.url
    },
    // 展示文件
    detailFile(file) {
      const isPdf = /\bpdf/i.test(file.name) || /\bpdf$/i.test(file.url)
      if (isPdf) {
        // 展示pdf
        this.pdfURL = Pdf.createLoadingTask(file.url)
        this.pdfURL.promise.then(pdf => {
          this.pdfPages = pdf.numPages
          this.pdfVisible = true
        }).catch(() => {
          this.$message.error('pdf预览失败')
        })
      } else {
        this.detailImgUrl = file.url
        this.imgVisible = true
      }
    },
    // 打印pdf
    printPDF(refName) {
      html2canvas(this.$refs[refName], {
        backgroundColor: null,
        useCORS: true,
        windowHeight: 0
      }).then((canvas) => {
        const url = canvas.toDataURL()
        printJS({
          printable: url,
          type: 'image',
          documentTitle: this.printName
        })
        // console.log(url)
      })
    }
    // handleError($event,file) {
    //   console.log($event)
    //   file.url = this.errorURL
    // },
    // handleLoading(file) {
    //   file.url = this.loadingURL
    // }
  }
};
</script>
<style lang="scss" scoped>
.el-upload-list__item,
.el-upload-list__item-actions {
  outline: none;
}
.pdf-title {
  font-size: 20px;
  line-height: 40px;
}
</style>
