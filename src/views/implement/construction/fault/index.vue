<!--
 * @Author: zfd
 * @Date: 2020-10-11 19:55:23
 * @LastEditTime: 2020-10-27 13:37:47
 * @Description: 施工端违规处理
 * @FilePath: \vue-admin-template\src\views\collapse\index.vue
-->
<template>
  <div class="app-container">
    <div class="basic-container">
      <el-card style="margin-bottom:30px">
        <div slot="header">
          <span>基本信息</span>
        </div>
        <el-form label-width="120px" class="show-form">
          <el-form-item label="姓名:">
            {{ basic.name }}
          </el-form-item>
          <el-form-item label="详细地址:">
            <el-cascader v-model="basic.address" :options="addressOptions" />
            <label for="address-detail" class="label-detail"> — </label>
            <el-cascader v-model="plot" :options="plotOptions" />
          </el-form-item>
          <el-form-item label="电话:">
            {{ basic.phone }}
          </el-form-item>
          <el-form-item label="加装电梯地址:">
            {{ basic.liftAddress }}
          </el-form-item>
          <el-form-item label="设计单位:">
            {{ basic.company }}
          </el-form-item>
          <el-form-item label="设备:">
            {{ basic.spec }}
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <el-collapse>
      <el-collapse-item v-for="(item, index) in dissents" :key="index">
        <template slot="title">
          监管单位：{{ item.name }}
          <el-tag :type="item.status | keyToVal(handleTag)" style="margin-left:20px">{{ item.status | keyToVal(handleStatus) }}</el-tag>
        </template>
        <!-- <div>
          建议人：{{ item.name }}
          <el-tag :type="item.status | keyToVal(handleTag)">{{ item.status | keyToVal(handleStatus) }}</el-tag>
        </div> -->
        <el-form :model="construction" :rules="rule" label-width="120px" class="handle-form">
          <el-form-item label="申请编号:">
            <el-input v-model="construction.code" disabled />
          </el-form-item>
          <el-form-item label="施工单位:">
            <el-input v-model="construction.org" disabled />
          </el-form-item>
          <el-form-item label="联系人:">
            <el-input v-model="construction.phone" disabled />
          </el-form-item>
          <el-form-item label="违规时间:">
            <el-input v-model="construction.time" disabled />
          </el-form-item>
          <el-form-item label="违规描述:">
            <el-input v-model="construction.desc" disabled />
          </el-form-item>
          <el-form-item label="违规照片:">
            <image-card url="https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg" @show="showPic" />
          </el-form-item>
          <el-form-item label="违规回复:">
            <el-input v-model="construction.feedback" disabled />
          </el-form-item>
          <el-form-item label="回复照片:">
            <image-card url="https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg" @show="showPic" />
          </el-form-item>
          <el-form-item label="处理回复:" prop="descResult">
            <el-input v-model="construction.descResult" type="textarea" autosize />
          </el-form-item>
          <el-form-item label="处理结果:" prop="result">
            <el-select v-model="construction.result">
              <el-option v-for="result in resultOptions" :key="result.val" :value="result.key" :label="result.val" />
            </el-select>
          </el-form-item>
          <el-row type="flex" justify="center" style="margin:50px 0">
            <el-button type="primary">保 存</el-button>
            <el-button>返 回</el-button>
          </el-row>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <el-dialog :visible.sync="picShow" class="dialog-image">
      <img src="https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { keyToVal } from '@/utils'
import ImageCard from '@/components/Imagecard'
export default {
  name: 'Fault',
  components: {
    ImageCard
  },
  filters: {
    keyToVal
  },
  data() {
    return {
      picShow: false,
      basic: {
        name: '李先生',
        address: '苏州高新区',
        phone: '15988800323',
        liftAddress: '小区1楼',
        company: '苏州建研院',
        spec: '高端电梯'
      },
      rule: {

      },
      resultOptions: [
        { key: 0, val: '通过' },
        { key: -1, val: '不通过' }
      ],
      construction: {
        org: '中一建',
        code: '马家浜1号楼',
        phone: '110',
        time: '2020-01-01 10:00',
        desc: '违规操作',
        descPic: [{ name: '违规图片1', url: '' }],
        feedback: '接受批评',
        feedbackPic: [{ name: '回复照片1', url: '' }],
        descResult: '',
        result: 0
      },
      urls: [
        'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
        'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg'
      ],
      dissents: [
        {
          name: '李先生',
          time: '2020-10-12 09:00',
          phone: '15988800123',
          address: '苏州高新区',
          detail: '设计方案不合理',
          status: 0,
          result: ''
        },
        {
          name: '张先生',
          time: '2020-10-13 08:00',
          phone: '15988800456',
          address: '苏州高新区',
          detail: '设计方案不合理',
          feedback: '你的需求已知晓，将之后联系',
          status: 1
        }
      ]
    }
  },
  computed: {
    ...mapState('common', ['handleStatus', 'handleTag'])
  },
  methods: {
    showPic() {
      this.picShow = true
    },
    submitFeedback() { },
    removeDissent(index) {
      if (index > 0) {
        this.model.dissents.splice(index, 1)
      }
    },
    addDissent() {
      this.model.dissents.push(
        {
          name: '',
          time: '',
          phone: '',
          address: '',
          detail: ''
        })
    },
    handleUploadRemove(file, fileList) {
    },
    // handleUploadChange(file, fileList) {
    //   console.log(file)
    //   console.log(fileList)
    //   debugger
    // },
    nextProcess(arrow) {
      this.$emit('nextProcess', arrow)
    },
    // 上传文件发生改变时
    handleUploadChange(file, fileList, index) {
      if (fileList.length > 0) {
        this.model[index] = fileList.map(f => f.raw)
      }
    },
    // 图片上传之前判断
    uploadBefore(file) {
      const isImage = file.type.indexOf('image') !== -1
      const isBig = file.size <= 1024 * 1024 * 10
      if (!file) {
        this.$message.error('上传为空！')
        return false
      }
      if (!isImage) {
        this.$message.error('只能上传图片！')
        return false
      }
      if (!isBig) {
        this.$message.error('图片大小不能超过10MB！')
        return false
      }
      return true
    }
  }
}
</script>

<style scoped lang="scss">
.basic-container ::v-deep .el-card__header:nth-child(1) {
  background: #409eff;
  color: #fff;
}
.head {
  height: 30px;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 100%;
  margin-bottom: 30px;
}
.dialog-image {
  text-align: center;
  img {
    width: 100%;
  }
}
</style>

