<!--
 * @Author: zfd
 * @Date: 2020-10-19 14:51:05
 * @LastEditors: zfd
 * @LastEditTime: 2021-01-04 09:24:30
 * @Description: 公示/公告审核
-->
<template>
  <div v-loading="pageLoading" class="app-container">
    <el-card class="upload-card" style="margin-bottom:30px">
      <div slot="header">
        <span>公示内容</span>
      </div>
      <upload-list :files="contentList" list-type="picture-card" :disabled="true" />

    </el-card>
    <el-card class="upload-card" style="margin-bottom:30px">
      <div slot="header">
        <span>公示公告</span>
      </div>
      <upload-list :files="reportList" list-type="picture-card" :disabled="true" />
    </el-card>
    <Audit v-if="conflict !== null" :id="projectId" :status="status" :conflict="conflict" />
  </div>
</template>

<script>
import File from '@/api/file'
import { notEmptyArray } from '@/utils'
// import { deepClone } from '@/utils'
import Community from '@/api/community'
import Audit from '@/components/street/Audit'
export default {
  name: 'ApplyNotice',
  components: {
    Audit
  },
  data() {
    return {
      // 修改后重新保存
      hasChanged: false,
      // formLoading: false,
      pageLoading: false,
      contentList: [], // 公示内容
      reportList: [], // 公示报告
      uploadList: [], // 上传用
      dirName: ['notice-content', 'notice-report'],
      projectId: null, // 工程id
      status: null, // 工程阶段标识位
      conflict: null // 异议冲突
    }
  },

  computed: {
  },
  watch: {

  },
  created() {
    const { id, status } = this.$route.params
    // 3第二次提交材料
    if (!isNaN(+id) && +status === 4) {
      this.projectId = id
      this.status = status
      this.detailApply()
      this.getObjection()
    }
  },
  methods: {
    // 获取已上传的意见征询表
    detailApply() {
      this.pageLoading = true
      this.contentList = []
      this.reportList = []
      this.uploadList = []
      this.dirName.forEach(async(v, i) => {
        await File.get({ projectId: this.projectId, typeName: v })
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
    },
    getObjection() {
      Community.listObjection(this.projectId)
        .then(res => {
          if (Array.isArray(res)) {
            const idx = res.findIndex(v => +v.result === 1)
            if (idx !== -1) {
              this.conflict = true
            } else {
              this.conflict = false
            }
          }
        })
        .catch(() => {
          this.$message.error('信息获取失败')
        })
    }

  },
  // 获得工程Id
  beforeRouteEnter(to, from, next) {
    const { id, status } = to.params
    // 3第二次提交材料
    const illegal = isNaN(+id) || +status !== 4

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
