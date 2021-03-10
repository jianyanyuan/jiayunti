<!--
 * @Author: zfd
 * @Date: 2020-10-28 13:47:36
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 11:29:07
 * @Description:
-->
<template>
  <div class="app-container">
    <el-button v-if="id===null" type="warning" @click="clickEdit">修改</el-button>
    <el-card v-if="showAudit" style="margin:30px 0">
      <div slot="header">
        <span style="margin-right:20px">审核信息</span>
        <el-tag :type="detail.communityReview.reviewResults | keyToVal(handleTag)">{{ detail.communityReview.reviewResults | keyToVal(auditOptions) }}</el-tag>
      </div>
      <el-form label-position="left" class="expand-form-p">
        <el-form-item label="审核时间：">
          <span>{{ new Date(detail.communityReview.createdAt) | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </el-form-item>
        <el-form-item label="审核意见：">
          <span>{{ detail.communityReview.reviewOpinions }}</span>
        </el-form-item>
        <el-form-item label="审核结果：">
          <el-tag :type="detail.communityReview.reviewResults | keyToVal(handleTag)">{{ detail.communityReview.reviewResults | keyToVal(auditOptions) }}</el-tag>
        </el-form-item>
      </el-form>
    </el-card>
    <div v-loading="pageLoading" class="intro-container">
      <template v-if="detail">
        <header>
          <h1>
            {{ detail.companyName }}
            <el-tag v-if="detail.communityReview && detail.checked !== 0" :type="detail.communityReview.reviewResults | keyToVal(handleTag)">{{ detail.communityReview.reviewResults | keyToVal(auditOptions) }}</el-tag>
            <el-tag v-else type="warning">未审核</el-tag>
          </h1>
          <p v-if="detail.articleSource || detail.author">
            <span v-if="detail.articleSource">来源：{{ detail.articleSource }}</span>
            <span v-if="detail.author">作者：{{ detail.author }}</span>
          </p>
          <p>
            <span>地址：{{ detail.address }}</span>
            <span>联系方式：{{ detail.phone }}</span>
            <a v-if="detail.link" :href="detail.link" target="_blank">公司官网：{{ detail.link }}</a>
          </p>
        </header>
        <article v-html="detail.introduction" />
      </template>
      <template v-else>
        <div class="empty-content-public">暂无介绍</div>
      </template>
    </div>

  </div>

</template>
<script>
import Common from '@/api/common'
import { notEmptyArray } from '@/utils'
import { mapState } from 'vuex'
export default {
  name: 'IntroView',
  data() {
    return {
      pageLoading: false,
      detail: null,
      id: null,
      showAudit: false
    }
  },
  created() {
    const { id } = this.$route.query
    if (id) {
      this.id = id
      this.getDetailById()
    } else {
      this.getDetail()
    }
  },
  computed: {
    ...mapState('common', ['handleTag', 'auditOptions'])

  },
  methods: {
    // 单位用户自己查看
    getDetail() {
      this.pageLoading = true
      Common.getArticle()
        .then(res => {
          if (res) {
            if (notEmptyArray(res.communityReview)) {
              res.communityReview = res.communityReview.pop()
              if (res.communityReview.reviewResults === 1 && res.checked !== 0) {
                this.showAudit = true
              } else {
                this.showAudit = false
              }
            } else {
              res.communityReview = null
              this.showAudit = false
            }
            this.detail = res
          }
        })
        .catch(() => {
          this.$message.error('信息获取失败')
        })
        .finally(() => {
          this.pageLoading = false
        })
    },
    // 居民根据id查看
    getDetailById() {
      this.pageLoading = true
      Common.getArticleById()
        .then(res => {
          // 最新审核过 且审核通过
          if (res.checked !== 0 && notEmptyArray(res.communityReview) && res.communityReview.pop().reviewResults === 0) {
            this.detail = res
          } else {
            this.detail = null
          }
        })
        .catch(() => {
          this.$message.error('信息获取失败')
        })
        .finally(() => {
          this.pageLoading = false
        })
    },
    clickEdit() {
      const reg = /\/(.*)\//
      const prefix = this.$route.fullPath.match(reg)[1]
      const path = `/${prefix}/intro_edit`
      const type = this.detail ? 0 : 1 // 0修改 1保存
      this.$router.push({ path, query: { type }})
    }
  }
  // beforeRouteEnter(to, from, next) {
  //   // 1
  //   next((vm) => {
  //     // 3
  //     if (to.params.detail) {
  //       vm.detail = to.params.detail
  //     }
  //     // if (to.query.type === "today") {
  //     //   let today = new Date();
  //     //   vm.query.StartTime = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()} 00:00:00`;
  //     //   vm.query.EndTime = new Date();
  //     //   vm.getTickets();
  //     // }
  //   })
  // }
}
</script>
<style lang="scss" scoped>
.intro-container {
  width: 70%;
  margin: 0 auto;
  min-width: 900px;
  header {
    text-align: center;
  }
  p,
  span {
    margin-right: 20px;
    font-size: 14px;
    color: #808080;
  }
  a:hover {
    color: #3282b8;
  }
}
</style>
