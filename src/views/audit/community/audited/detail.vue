<!--
 * @Author: zfd
 * @Date: 2020-12-09 08:43:23
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-10 16:59:30
 * @Description: 审核意见
-->
<template>
  <div class="app-container" v-loading="pageLoading">
    <el-page-header content="审核历史" @back="$router.go(-1)" />
    <el-collapse class="audit-collapse">
      <el-collapse-item v-for="(item, index) in list" :key="index">
        <template slot="title">
          <span class="audit-c-title">
            {{ new Date(item.auditTime) | parseTime('{y}-{m}-{d} {h}:{i}') }}
          </span>
        </template>
        <el-form label-width="120px" class="center-form">
          <el-form-item label="审核意见：">
            {{ item.reviewOpinion }}
          </el-form-item>
          <el-form-item label="审核结果：">
            <el-tag :type="item.reviewResult | keyToVal(handleTag)">{{ item.reviewResult | keyToVal(auditOptions) }}</el-tag>
          </el-form-item>
          <el-form-item label="附件：">
            <upload-list :files="item.files" list-type="picture-card" :disabled="true" :handle-preview="detailFile" />
          </el-form-item>

        </el-form>
      </el-collapse-item>
    </el-collapse>

    <el-dialog center title="图片详情" :visible.sync="imgVisible" :close-on-click-modal="false" class="dialog-center">
      <img :src="detailImgUrl" alt="意见咨询表">
    </el-dialog>

    <el-dialog title="pdf预览" center :visible.sync="pdfVisible" :close-on-click-modal="false" class="dialog-center">
      <!-- 加载全部页面的PDF是一个for循环,不能指定用来打印的ref -->
      <div ref="printContent">
        <Pdf v-for="i in pdfPages" :key="i" :src="pdfURL" :page="i" />
      </div>
      <span slot="footer">
        <el-button @click="printPDF('printContent')" type="success">打印</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixn from '@/components/UploadList/mixin'
import Project from '@/api/projects'
import { mapState } from 'vuex'
import { notEmptyArray } from '@/utils'
export default {
  name: 'AuditDetail',
  mixins: [mixn],
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
      },
      pageLoading: false,
      list: [],
      applyId: null,
      status: null

    }
  },
  computed: {
    ...mapState('common', ['handleTag', 'auditOptions'])
  },
  watch: {
    // $route(to,from,next) {
    //   console.log(to)
    //   console.log(from)
    //   console.log(next)
    //   console.log(this)
    // }
  },
  methods: {
    async getDetail() {
      this.pageLoading = true
      await Project.checkSingle(this.applyId).then(res => {
        if (notEmptyArray(res)) {
          res.forEach(element => {
            element.files = new Array({ uid: Date.now(), url: element.path })
            this.list.push(element)
          });
        }
      }).catch(() => {
        this.$message.error('数据获取失败')
      })
      this.pageLoading = false
    }
  },
  // 获得工程Id
  beforeRouteEnter(to, from, next) {
    const { id, status } = to.params
    const valid = typeof +id === 'number' && typeof +status === 'number'

    if (valid) {
      next(vm => {
        vm.applyId = id
        vm.status = status
        vm.getDetail() // 获取详情
      })
    } else {
      // 没有id则返回跳转
      next(from.fullPath)
    }
  }
}
</script>
<style lang="scss" scoped>
.audit-collapse {
  margin-top: 30px;
  .audit-c-title {
    font-size: 18px;
    line-height: 30px;
  }
}
</style>