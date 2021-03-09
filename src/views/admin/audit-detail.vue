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
    <div v-loading="pageLoading" class="intro-container">
      <template v-if="detail">
        <header>
          <h1>
            {{ detail.companyName }}
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
    <el-form ref="form" label-width="120px" :model="form" :rules="rule">
      <el-form-item label="审核意见:" prop="reviewOpinions">
        <el-input v-model="form.reviewOpinions" type="textarea" :rows="4" />
      </el-form-item>
      <el-form-item label="审核结果:" prop="reviewResults">
        <el-select v-model="form.reviewResults" :disabled="conflict === true">
          <el-option v-for="item in auditOptions" :key="item.val" :value="item.key" :label="item.val" />
        </el-select>
      </el-form-item>
      <el-form-item class="audit-operation">
        <el-button type="success" size="medium" icon="el-icon-upload2" @click="handlePost">提 交</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>
<script>
import Common from '@/api/common'
export default {
  name: 'IntroView',
  data() {
    return {
      pageLoading: false,
      detail: null,
      id: null
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
  methods: {
    getDetail() {
      this.pageLoading = true
      Common.getArticle()
        .then(res => {
          if (res) {
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
    getDetailById() {
      this.pageLoading = true
      Common.getArticleById()
        .then(res => {
          if (res) {
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
    clickEdit() {
      const reg = /\/(.*)\//
      const prefix = this.$route.fullPath.match(reg)[1]
      const path = `/${prefix}/intro_edit`
      const type = this.detail ? 0 : 1 // 0修改 1保存
      this.$router.push({ path, query: { type }})
    },
    handlePost() {}
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
