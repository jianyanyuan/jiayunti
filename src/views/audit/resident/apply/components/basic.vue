<!--
 * @Author: zfd
 * @Date: 2020-10-19 14:51:05
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-29 14:57:07
 * @Description: 居民申请基本资料
-->
<template>
  <div>
    <el-card style="margin-bottom:30px">
      <div slot="header">
        <el-row type="flex" justify="space-between" align="middle">
          <span>基本资料</span>
          <el-button v-if="!hasChanged" type="primary" style="float:right" @click="hasChanged = true">修改</el-button>
          <el-button v-else type="primary" style="float:right" @click="updateApply">保存</el-button>
        </el-row>
      </div>
      <el-form ref="form" class="basic-form" v-loading="formLoading" :model="form" :rules="rules" label-width="120px" :disabled="!hasChanged">
        <el-form-item label="申请人" prop="applicantName">
          <el-input v-model="form.applicantName" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-row>
            <el-col :span="12">
              <el-cascader v-model="form.address.county" :options="countyOptions" :props="countyProps" style="display:block" disabled />
            </el-col>
            <el-col :span="2" style="text-align:center"> <label for="address-detail"> — </label>
            </el-col>
            <el-col :span="10">
              <el-cascader v-model="form.address.community" :options="communityOptions" :props="communityProps" style="display:block" disabled />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="电话" prop="phoneNumber">
          <el-input v-model="form.phoneNumber" />
        </el-form-item>
        <el-form-item label="加装电梯地址" prop="location">
          <div> <input v-model="form.location[0]" class="basic-address-input" type="text" name="cell" autocomplete="off" :disabled="!hasChanged">小区</div>
          <div> <input v-model="form.location[1]" class="basic-address-input" type="text" name="building" autocomplete="off" :disabled="!hasChanged"> 幢</div>
          <div> <input v-model="form.location[2]" class="basic-address-input" type="text" name="unit" autocomplete="off" :disabled="!hasChanged"> 单元</div>

        </el-form-item>
        <el-form-item label="设计单位" prop="designId">
          <el-select v-model="form.designId" filterable>
            <el-option v-for="item in designOptions" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备" prop="typeAndDevice">
          <el-cascader v-model="form.typeAndDevice" :options="deviceOptions">
            <template slot-scope="{ node, data }">
              <span>{{ data.label }}</span>
              <span v-if="node.isLeaf">kg</span>
            </template>
          </el-cascader>
        </el-form-item>
        <el-form-item v-for="(room, index) in form.rooms" :key="room.key" :label="`房间编号${(index+1)}`" :prop="'rooms.' + index + '.val'" :rules="{required: true, message: '房间编号不能为空', trigger: 'blur'}">
          <el-input v-model="room.val" placeholder="400">
            <template slot="append">
              <el-button :icon="index == 0 ? 'el-icon-plus' : 'el-icon-minus'" @click="handleRoom(index)" />
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <div style="text-align:center" v-if="!hasChanged">
      <el-button type="success" icon="el-icon-arrow-right" @click.native.prevent="nextProcess(1)">下一步</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { deepClone, notEmptyArray } from '@/utils'
import { validatePhone, validateTrueName } from '@/utils/element-validator'
import { detailApi, updateApi } from '@/api/projects'

const defaultForm = {
  applicantName: '',
  location: [],
  address: { county: [], community: [] }, //
  phoneNumber: '',
  rooms: [{ key: Date.now(), val: '' }],
  designId: '',
  typeAndDevice: [] // []
}
export default {
  name: 'ApplyBasic',
  props: {
    id: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      // 修改后重新保存
      hasChanged: false,
      formLoading: false,
      form: deepClone(defaultForm),
      rules: {
        applicantName: [{ required: true, validator: validateTrueName, trigger: 'blur' }],
        address: [{ required: true, message: '请选择地址' }],
        phoneNumber: [{ required: true, validator: validatePhone, trigger: 'blur' }],
        location: [{ required: true, message: '请输入地址' }]
      },
      communityOptions: [],
      countyProps: {
        value: 'id',
        label: 'name',
        children: 'areas'
      },
      communityProps: {
        value: 'id',
        label: 'name',
        children: 'communities'
      }
    }
  },
  computed: {
    ...mapGetters('common', ['countyOptions', 'deviceOptions', 'designOptions'])
  },
  watch: {

  },
  created() {
    const addressAsync = this.$store.dispatch('common/getAddress')
    const deviceAsync = this.$store.dispatch('common/getDevice')
    const designAsync = this.$store.dispatch('common/getDesign')

    Promise.all([addressAsync, deviceAsync, designAsync]).then(() => {
      this.form.address.county = this.$store.getters['address']?.slice(0, 2)
      this.communityOptions = this.$store.getters['common/communityOptions'](this.form.address.county)
      this.form.address.community = this.$store.getters['address'].slice(2)
      // this.form.phoneNumber = this.$store.getters['phone'] ?? ''
    }).catch((err) => {
      this.$message.error('信息获取失败')
    })
  },
  activated() {
    // 组件激活
    this.detailApply()
  },
  methods: {
    handleRoom(index) {
      if (index === 0) {
        this.form.rooms.push({ key: Date.now(), val: '' })
      } else {
        this.form.rooms.splice(index, 1)
      }
    },
    nextProcess(arrow) {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('nextProcess', arrow)
        } else {
          this.$message.error('请补全信息')
        }
      })
    },
    // 修改申请
    updateApply() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const { location, rooms } = this.form
          if (notEmptyArray(location) && location.length === 3) {
            this.form.location = location.map(v => v.replace(/[<>&"']/gi, ' ').trim()) // 防止xss攻击
          } else {
            this.$message.error('请填写加装电梯地址')
            return
          }
          if (notEmptyArray(rooms)) {
            this.form.rooms = Array.from(new Set(rooms.map(v => v.val.replace(/[<>&"']/gi, ' ').trim()))) // 过滤 + 去重
          } else {
            this.$message.error('请填写单位下业主房间编号')
            return
          }
          // this.form.address = address.community.concat(address.county)
          this.formLoading = true
          updateApi(this.id, this.form).then(res => {
            if (res.id == this.id) {
              this.detailApply()
              // this.$message.success('修改成功')
            } else {
              this.$message.error('修改失败')
              this.formLoading = false
            }
          }).catch(err => {
            console.log(err)
            this.formLoading = false
            this.$message.error('修改失败')
          })
        } else {
          this.$message.error('信息错误')
        }
      })
    },
    // 获取申请基本资料
    detailApply() {
      this.formLoading = true
      detailApi(this.id).then(res => {
        // Object.assign(this.form, res)
        const { applicantName, phoneNumber, designId, deviceId, deviceTypeId, rooms, residentialQuarters, building, unit } = res
        this.form.applicantName = applicantName
        this.form.designId = designId
        this.form.phoneNumber = phoneNumber
        this.form.typeAndDevice = [deviceId, deviceTypeId]
        this.form.location = [residentialQuarters, building, unit]
        if (notEmptyArray(rooms)) {
          this.form.rooms = rooms.map(v => ({ key: v, val: v }))
        }else {
          this.form.rooms = [{ key: Date.now(), val: '' }]
        }
        this.hasChanged = false
        this.formLoading = false

      }).catch(err => {
        console.log(err)
        this.formLoading = false
        this.$message.error('信息获取失败')
      })
    }
  }

}
</script>

<style scoped lang="scss">
// el-input__icon el-icon-arrow-down
// .show-form ::v-deep .el-cascader,
// .show-form ::v-deep .el-input__suffix-inner{
//      pointer-events: none;
//     cursor: default;
//     opacity: 0.8;
// }
.basic-form {
  width: 600px;
}
.basic-address-input {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  height: 25px;
  padding: 0 15px;
}
// .show-form ::v-deep {
//   .el-cascader,
//   .el-input__suffix-inner {
//     pointer-events: none;
//     cursor: default;
//     opacity: 0.8;
//   }
// }
</style>
