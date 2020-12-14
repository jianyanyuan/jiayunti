<!--
 * @Author: zfd
 * @Date: 2020-12-09 08:43:23
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-14 09:20:12
 * @Description: 审核意见
-->
<template>
  <div class="app-container" v-loading="pageLoading">
    <el-page-header content="审核历史" @back="$router.go(-1)" />

    <el-timeline class="audit-timeline">
      <el-timeline-item v-for="(item, index) in list" :key="index" :timestamp="new Date(item.auditTime) | parseTime('{y}-{m}-{d} {h}:{i}')" placement="top">
        <el-card>
          <p>
            <span class="audit-tip">审核意见：</span>
            {{ item.reviewOpinion }}
            <span class="audit-tip audit-tip-r">审核结果：</span>
            <el-tag :type="item.reviewResult | keyToVal(handleTag)">{{ item.reviewResult | keyToVal(auditOptions) }}</el-tag>
          </p>
          <p>
            <span class="audit-tip">附件：</span>

            <upload-list :files="item.files" list-type="picture-card" :disabled="true" :handle-preview="detailFile" />
          </p>
        </el-card>
      </el-timeline-item>
    </el-timeline>

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
import Community from '@/api/community'
import { mapState } from 'vuex'
import { notEmptyArray } from '@/utils'
export default {
  name: 'AuditDetail',
  mixins: [mixn],
  data() {
    return {
      pageLoading: false,
      list: [],
      applyId: null
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
  created() {
    const { id } = this.$route.params
    // 1社区第一次受理 3社区第二次受理
    // const valid = status == 1 || status == 3

    if (!isNaN(+id) ) {
      this.applyId = id
      this.getDetail() // 获取详情
    }
  },
  methods: {
    async getDetail() {
      this.pageLoading = true
      await Community.checkSingle(this.applyId).then(res => {
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
    const { id } = to.params
    // 1社区第一次受理 3社区第二次受理
    // const valid = status == 1 || status == 3
    if (isNaN(+id)) {
      // 没有id则返回跳转
      next('/redirect' + from.fullPath)
    } else {
      next()
    }
  }
}
</script>
<style lang="scss" scoped>
.audit-timeline {
  margin-top: 30px;
  &::v-deep .el-card {
    width: 800px;
  }
  .audit-tip {
    font-size: 18px;
    color: #7d8a9c;
  }
  .audit-tip-r {
    margin-left: 20px;
  }
}
</style>