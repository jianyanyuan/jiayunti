<!--
 * @Author: zfd
 * @Date: 2020-10-28 13:47:36
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 11:29:07
 * @Description:
-->
<template>
  <div class="app-container">
    <el-button type="success" size="medium" @click="handleCompany">新增企业单位</el-button>
    <el-button type="success" size="medium" @click="handleGovernment">新增审核单位</el-button>

    <el-card class="gap-both-public upload-card-public">
      <div slot="header">
        <span>标准表格上传</span>
      </div>
      <el-upload ref="fileUpload" :file-list="fileList" action="#" :on-remove="handleUploadRemove" :on-preview="handleDownLoad" :on-change="handleUploadChange" drag :auto-upload="false">
        <div>将文件拖到此处，或点击添加</div>
        <p>单个文件大小不超过20MB</p>

      </el-upload>
    </el-card>
    <!-- 新增单位 -->
    <el-dialog v-el-drag-dialog :title="model.title" :visible.sync="model.visible" :close-on-click-modal="false" width="600px" top="10vh">
      <el-form ref="form" v-loading="formLoading" :model="model.form" :rules="model.rules" label-width="120px">
        <el-form-item label="单位名称" prop="name">
          <el-input v-model="model.form.name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="电话" prop="phoneNumber">
          <el-input v-model="model.form.phoneNumber" auto-complete="off" />
        </el-form-item>
        <el-form-item label="单位类型" prop="type">
          <el-select v-model="model.form.type" filterable>
            <el-option v-for="item in orgTypes" :key="item.key" :value="item.key" :label="item.val" />
          </el-select>

        </el-form-item>
        <el-form-item label="地址" prop="address">
          <!-- 企业单位地址手输 -->
          <el-input v-if="model.title === '新增企业单位'" v-model="model.form.address" auto-complete="off" />
          <!-- 社区---选到社区 -->
          <template v-else>
            <template v-if="model.form.type === 'ROLE_COMMUNITY'">
              <el-cascader v-model="address.county" :options="countyOptions" @change="changeAddress" @focus="focusAddress" />
              <label v-if="communityShow" for="address-detail" class="regist-address-d"> — </label>
              <el-cascader v-if="communityShow" v-model="address.community" :options="communityOptions" :props="communityProps" />
            </template>
            <!-- 街道---选到街道 -->
            <el-cascader v-else-if="model.form.type === 'ROLE_STREET'" v-model="street" :options="streetOptions" />
            <!-- 区级---选到区级 -->
            <el-cascader v-else v-model="model.form.address" :options="countyOptions" />

          </template>
        </el-form-item>
        <el-form-item label="是否有效" prop="isValid">
          <el-select v-model="model.form.isValid" filterable>
            <el-option v-for="item in isOrNo" :key="item.key" :value="item.key" :label="item.val" />
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align:center">
        <el-button @click="model.visible = false">取 消</el-button>
        <el-button type="primary" @click="handlePost">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
import { notEmptyArray } from '@/utils'
import { mapGetters, mapState } from 'vuex'

import File from '@/api/file'
export default {
  name: 'AdminResources',
  data() {
    return {
      model: {
        title: '新增企业单位',
        form: {},
        visible: false
      },
      street: [],
      formLoading: false,
      fileList: [],
      companyTypes: [
        { key: 'ROLE_DESIGNER', val: '设计院' },
        { key: 'ROLE_PRINCIPAL', val: '委托单位' },

        { key: 'ROLE_CONSTRUCTION', val: '施工单位' },
        { key: 'ROLE_DEVICE', val: '电梯单位' },
        { key: 'ROLE_SUPERVISION', val: '监理单位' }

      ],
      govmentTypes: [
        { key: 'ROLE_COMMUNITY', val: '社区' },
        { key: 'ROLE_STREET', val: '街道' },

        { key: 'ROLE_DRAWING_AUDIT', val: '图审' },
        { key: 'ROLE_INCREASE_LIFT', val: '增梯办' },
        { key: 'ROLE_CAPITAL_RULE', val: '资规局' },
        { key: 'ROLE_MARKET_SUPERVISOR', val: '市场监督局' },
        { key: 'ROLE_HOUSE_CONSTRUCTION', val: '住建局' },
        { key: 'ROLE_URBAN_MANAGEMENT', val: '城管局' }

      ],
      address: { county: [], community: [] },

      communityOptions: [],
      communityShow: false,
      communityProps: {
        value: 'id',
        label: 'name',
        children: 'communities'
      }
    }
  },
  computed: {
    ...mapState('common', ['isOrNo']),
    ...mapGetters('common', ['countyOptions', 'districtOptions']),
    // 城市--区级--街道  级联
    streetOptions() {
      const cities = this.$store.state.common.address
      if (!notEmptyArray(cities)) {
        return ''
      }
      const data = []
      // 区街道社区
      try {
        // 只做苏州一个市的
        // 迭代性能更好
        for (const city of cities) {
          const cityObj = { value: city.id, label: city.name, children: [] }

          for (const area of city.areas) {
            const areaObj = { value: area.id, label: area.name, children: [] }
            cityObj.children.push(areaObj)
            for (const street of area.streets) {
              const streetObj = { value: street.id, label: street.name, children: null }
              areaObj.children.push(streetObj)
            }
          }
          data.push(cityObj)
        }

        return data
      } catch (err) {
        console.log(err)
        // )
        // console.log('地址')
        return []
      }
    },
    orgTypes() {
      if (this.model.title === '新增企业单位') {
        return this.companyTypes
      }
      return this.govmentTypes
    }

  },
  created() {

  },
  methods: {
    handleCompany() {
      this.model.title = '新增企业单位'
      this.model.form = {
        name: '',
        phoneNumber: '',
        type: '',
        address: '',
        isValid: true
      }
      this.model.visible = true
    },
    handleGovernment() {
      this.model.title = '新增审核单位'
      this.model.form = {
        name: '',
        phoneNumber: '',
        type: 'ROLE_COMMUNITY',
        address: [],
        isValid: true
      }
      this.model.visible = true
    },
    // 获取标准表格
    getUpload(row) {
      File.get({ typeName: 'admin-files' })
        .then(res => {
          if (notEmptyArray(res.content)) {
            for (const i of res.content) {
              const file = {
                uid: i.id,
                name: i.filename,
                url: i.path
              }
              this.fileList.push(file)
            }
          }
        })
        .finally(() => {
        })
    },
    // 下载后预览
    handleDownLoad(file) {
      var xhr = new XMLHttpRequest()
      xhr.open('GET', file.url, true)
      xhr.responseType = 'blob' // 返回类型blob
      xhr.onload = function() {
        if (this.status === 200) {
          var blob = this.response// 获取返回值
          var a = document.createElement('a')
          a.download = file.filename
          a.href = window.URL.createObjectURL(blob)
          a.click()
        }
      }
      // 发送ajax请求
      xhr.send()
    },
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    // 限制了添加文件的逻辑，不支持多个文件选择
    async handleUploadChange(file, fileList) {
      const valid = file.raw.size <= 1024 * 1024 * 20 // 单个文件最大20M
      if (valid) {
        const formData = new FormData()
        formData.append('file', file.raw)
        await File.upload(formData, { projectId: this.uploadId, typeName: 'apply-contract' })
          .then(res => {
            file.url = res.fileAddress
            file.status = 'success'
            file.uid = res.fileTypeId
          })
          .catch(() => {
            // 上传失败
            this.$message.error('上传失败')
          })
      } else {
        this.$message.warning('文件大小不能超过20M')
        fileList.pop()
      }
    },
    // 删除文件
    handleUploadRemove(file, fileList) {
      File.remove(file.uid)
        .catch(() => {
          this.$message.error('删除失败')
        })
    },
    changeAddress(newValue) {
      this.communityOptions = this.$store.getters['common/communityOptions'](newValue)
      this.communityShow = true
    },
    focusAddress() {
      this.communityShow = false
    },
    handlePost() {}
  }

}
</script>
<style lang="scss" scoped>

</style>
