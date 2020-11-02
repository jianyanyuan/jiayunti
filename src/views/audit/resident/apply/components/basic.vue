<!--
 * @Author: zfd
 * @Date: 2020-10-19 14:51:05
 * @LastEditors: zfd
 * @LastEditTime: 2020-11-02 08:57:17
 * @Description: 居民申请基本资料
-->
<template>
  <div>
    <el-card style="margin-bottom:30px">
      <div slot="header">
        <el-row type="flex" justify="space-between" align="middle">
          <span>基本资料</span>
          <el-button v-if="!hasChanged" type="primary" style="float:right" @click="hasChanged = true">修改</el-button>
          <el-button v-else type="primary" style="float:right" @click="hasChanged = false">保存</el-button>
        </el-row>
      </div>
      <!-- 展示 -->
      <el-form v-if="!hasChanged" ref="form" v-loading="formLoading" :model="form" :rules="rules" label-width="120px" class="show-form">
        <el-form-item label="申请人">
          {{ form.name }}
        </el-form-item>
        <el-form-item label="地址">
          <el-cascader v-model="form.address" :options="addressOptions" />
          <label for="address-detail" class="label-detail"> — </label>
          <el-cascader v-model="plot" :options="plotOptions" />
        </el-form-item>
        <el-form-item label="电话">
          {{ form.phone }}
        </el-form-item>
        <el-form-item label="加装电梯地址">
          {{ form.elevatorAddress }}
        </el-form-item>
        <el-form-item label="设计单位">
          {{ form.designer }}
        </el-form-item>
        <el-form-item label="设备">
          {{ form.device }}
        </el-form-item>
        <el-form-item v-for="(room, index) in form.rooms" :key="room.key" :label="'房间编号' + (index+1)">
          {{ room.val }}
        </el-form-item>
        <div style="text-align:center">
          <el-button type="success" icon="el-icon-arrow-right" @click.native.prevent="nextProcess(1)">下一步</el-button>
        </div>
      </el-form>
      <!-- 修改保存 -->
      <el-form v-else ref="form" v-loading="formLoading" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="申请人" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-cascader v-model="form.address" :options="addressOptions" />
          <label for="address-detail" class="label-detail"> — </label>
          <el-cascader v-model="plot" :options="plotOptions" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="加装电梯地址" prop="elevatorAddress">
          <el-input v-model="form.elevatorAddress" placeholder="xxx小区xx幢xxx单元" />
        </el-form-item>
        <el-form-item label="设计单位" prop="designer">
          <el-select v-model="form.designer">
            <el-option v-for="item in designerOptions" :key="item.val" :label="item.val" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备" prop="device">
          <el-cascader v-model="form.device" :options="deviceOptions">
            <template slot-scope="{ node, data }">
              <span>{{ data.label }}</span>
              <span v-if="node.isLeaf">kg</span>
            </template></el-cascader>
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

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { deepClone } from '@/utils'
import { validatePhone, validateTrueName } from '@/utils/element-validator'
const defaultForm = {
  name: '张飞达',
  address: ['jiangsu', 'suzhou', 'gusu', 'canglang', 'shequ'],
  phone: '15988800323',
  elevatorAddress: 'xxx小区xxx幢xxx单元',
  rooms: ['401', '402', '403'],
  designer: '建研院',
  device: '高端电梯'
}
export default {
  name: 'Basic',
  data() {
    return {
      // 修改后重新保存
      hasChanged: false,
      formLoading: false,
      form: deepClone(defaultForm),
      designerOptions: [
        { key: 1, val: '建研院' },
        { key: 2, val: '设计' }
      ],
      deviceOptions: [
        {
          label: '设备1',
          value: '1',
          children: [
            {
              label: '600',
              value: '11'
            },
            {
              label: '500',
              value: '12'
            }
          ]
        },
        {
          label: '设备2',
          value: '2',
          children: [
            {
              label: '600',
              value: '22'
            }
          ]
        }
      ],
      rules: {
        name: [{ required: true, validator: validateTrueName, trigger: 'blur' }],
        address: [{ required: true, message: '地址不为空', trigger: 'blur' }],
        phone: [{ required: true, validator: validatePhone, trigger: 'blur' }],
        elevatorAddress: [{ required: true, message: '电梯地址不为空', trigger: 'blur' }],
        designer: [{ required: true, message: '设计单位不为空', trigger: 'blur' }],
        device: [{ required: true, message: '设备不为空', trigger: 'blur' }]
      },
      plot: []
    }
  },

  computed: {
    ...mapGetters('common', ['addressOptions', 'plotOptions'])
  },
  watch: {

  },
  created() {
    this.plot = this.form.address.slice(3)

    this.form.address = this.form.address.slice(0, 3)
    this.form.rooms = this.form.rooms.map(v => {
      return {
        key: v + '1',
        val: v
      }
    }
    )
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
      this.$emit('nextProcess', arrow)
    },
    postApply() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.plot.length === 0) {
            this.$message.error('请选择地址')
            return false
          }
          this.formLoading = true
          this.form.address = this.form.address.concat(this.plot)
          this.form.rooms = this.form.rooms.map(v => v.val)
          this.formLoading = false
          console.log(this.form)
        } else {
          this.$message.error('请补全信息')
        }
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
.show-form ::v-deep {
  .el-cascader,
  .el-input__suffix-inner {
    pointer-events: none;
    cursor: default;
    opacity: 0.8;
  }
}
</style>
