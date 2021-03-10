<!--
 * @Author: zfd
 * @Date: 2020-10-28 13:47:36
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 11:29:07
 * @Description:
-->
<template>
  <div class="app-container">
    <el-page-header :content="title" style="margin-bottom:30px" @back="$router.go(-1)" />
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
    <el-form v-if="type === 'audit'" ref="form" label-width="120px" :model="form" :rules="rule">
      <el-form-item label="审核意见:" prop="reviewOpinions">
        <el-input v-model="form.reviewOpinions" type="textarea" :rows="4" />
      </el-form-item>
      <el-form-item label="审核结果:" prop="reviewResults">
        <el-select v-model="form.reviewResults">
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
import { checkApi } from '@/api/projects'
import { mapState } from 'vuex'

import { companyDetailApi } from '@/api/operations'
export default {
  name: 'IntroView',
  data() {
    return {
      pageLoading: false,
      detail: null,
      id: null,
      type: 'audit',
      title: '单位初审',
      form: {
        reviewOpinions: '通过',
        reviewResults: 0
      },
      rule: {
        reviewOpinions: [{ required: true, message: '请给出审核意见', trigger: 'blur' }],
        reviewResults: [{ required: true, message: '请给出审核结果', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState('common', ['auditOptions'])

  },
  created() {
    const { id, type } = this.$route.params
    if (id) {
      // 公司主体id
      this.id = id
      this.getDetailById()
    }
    if (type === 'audit') {
      this.title = '单位初审'
    } else {
      this.title = '单位简介'
    }
    this.type = type
  },
  methods: {
    getDetailById() {
      this.pageLoading = true
      companyDetailApi(this.id)
        .then(detail => {
          this.detail = detail
        })
        .catch(() => {
          this.$message.error('信息获取失败')
        })
        .finally(() => {
          this.pageLoading = false
        })
    },
    handlePost() {
      this.$refs.form.validate(async(valid, errors) => {
        if (valid) {
          this.pageLoading = true
          // 文章Id
          this.form.companyId = this.detail.id

          checkApi(this.form)
            .then(() => {
              this.$router.push({ name: 'AdminAudit' })
            })
            .catch(() => {
              this.$message.error('审核失败')
            })
            .finally(() => {
              this.pageLoading = false
            })
        } else {
          this.$message.warning('请补全信息')
        }
      })
    }
  },
  beforeRouteEnter(to, from, next) {
    const { id } = to.params
    if (isFinite(+id)) {
      next()
    } else {
      // 没有id则返回跳转
      next('/redirect' + from.fullPath)
    }
  }
}
</script>
<style lang="scss" scoped>
.intro-container {
  width: 70%;
  margin: 0 auto 30px;
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
