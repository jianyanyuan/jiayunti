<!--
 * @Author: zfd
 * @Date: 2020-10-19 14:51:05
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 13:27:40
 * @Description: 公示内容/公示报告查看
-->
<template>
  <div v-loading="pageLoading" class="app-container">
    <el-row type="flex" justify="space-between" align="middle" style="padding:18px 20px">
      <span>公示材料</span>
    </el-row>
    <el-card class="upload-card" style="margin-bottom:30px">
      <div slot="header">
        <span>公示内容</span>
      </div>
      <upload-list :files="contentList" list-type="picture-card" :disabled="true" />

    </el-card>
    <el-card class="upload-card" style="margin-bottom:30px">
      <div slot="header">
        <span>公示报告</span>
      </div>
      <upload-list :files="reportList" list-type="picture-card" :disabled="true" />

    </el-card>
  </div>
</template>

<script>
import File from '@/api/file'
import { notEmptyArray } from '@/utils'
// import { deepClone } from '@/utils'
export default {
  name: 'ApplyNoticeRead',
  data() {
    return {
      // formLoading: false,
      pageLoading: false,
      contentList: [], // 公示内容
      reportList: [], // 公示报告
      dirName: ['notice-content', 'notice-report'],
      id: null, // 工程id
      status: null // 工程阶段标识位
    }
  },

  computed: {
  },
  watch: {

  },
  created() {
    const { id, status } = this.$route.params
    // 3第二次提交材料
    if (!isNaN(+id) && +status === 3) {
      this.id = id
      this.status = status
    }
  },
  methods: {
    // 获取已上传的公示材料
    detailApply() {
      this.pageLoading = true
      this.contentList = []
      this.reportList = []
      this.dirName.forEach(async(v, i) => {
        await File.get({ projectId: this.id, typeName: v })
          .then(res => {
            if (notEmptyArray(res.content)) {
              const arr = i === 0 ? 'contentList' : 'reportList'
              for (const i of res.content) {
                this[arr].push({
                  uid: i.id,
                  name: i.filename,
                  url: i.path
                })
              }
            }
          })
          .catch(() => {
            this.$message.error('信息获取失败')
          })
      })
      this.pageLoading = false
    }
  },
  // 获得工程Id
  beforeRouteEnter(to, from, next) {
    const { id, status } = to.params
    // 3第二次提交材料
    const illegal = isNaN(+id) || +status !== 3

    if (illegal) {
      next('/redirect' + from.fullPath)
    }
    next()
  }
}
</script>

<style scoped lang="scss">
.upload-card ::v-deep .el-card__body {
  text-align: center;
  margin-bottom: 30px;
}
.enclosure-tips {
  color: #14274e;
  text-align: left;
  li {
    list-style: decimal;
  }
}
.upload-card ::v-deep .el-upload-dragger {
  width: 400px;
  padding: 40px 5px;
  border: 2px solid #e5e5e5;
  color: #777;
  -webkit-transition: background-color 0.2s linear;
  transition: background-color 0.2s linear;
}
.image-container {
  height: 200px;
  margin-bottom: 20px;
  img {
    width: auto;
    height: auto;

    max-width: 100%;
    max-height: 100%;
  }
}
</style>
