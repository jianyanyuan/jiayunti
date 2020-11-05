<!--
 * @Author: zfd
 * @Date: 2020-11-02 14:20:42
 * @LastEditors: zfd
 * @LastEditTime: 2020-11-02 14:28:49
 * @Description:
-->
<!--
 * @Author: zfd
 * @Date: 2020-10-11 19:55:23
 * @LastEditTime: 2020-11-02 13:53:39
 * @Description: 施工端违规处理
 * @FilePath: \vue-admin-template\src\views\collapse\index.vue
-->
<template>
  <div class="app-container">
    <div class="basic-container">
      <el-card style="margin-bottom:30px">
        <div slot="header">
          <span>施工单位信息</span>
        </div>
        <el-form label-width="120px" class="show-form">
          <el-form-item label="施工单位：">
            {{ basic.name }}
          </el-form-item>
          <el-form-item label="地址：">
            {{ basic.address }}
          </el-form-item>
          <el-form-item label="电话：">
            {{ basic.phone }}
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <el-collapse>
      <el-collapse-item v-for="(item, index) in construction" :key="index">
        <template slot="title">
          监管单位：{{ item.org }}
          <el-tag :type="item.status | keyToVal(handleTag)" style="margin-left:20px">{{ item.status | keyToVal(handleStatus) }}</el-tag>
        </template>
        <!-- <div>
          建议人：{{ item.name }}
          <el-tag :type="item.status | keyToVal(handleTag)">{{ item.status | keyToVal(handleStatus) }}</el-tag>
        </div> -->
        <el-form :model="construction[index]" :rules="rule" label-width="120px" class="handle-form">
          <el-form-item label="申请编号:">
            <el-input v-model="item.code" disabled />
          </el-form-item>
          <el-form-item label="监管单位:">
            <el-input v-model="item.org" disabled />
          </el-form-item>
          <el-form-item label="联系电话:">
            <el-input v-model="item.phone" disabled />
          </el-form-item>
          <el-form-item label="违规时间:">
            <el-input v-model="item.time" disabled />
          </el-form-item>
          <el-form-item label="违规描述:">
            <el-input v-model="item.desc" disabled />
          </el-form-item>
          <el-form-item label="违规照片:">
            <upload-list :files="attachments" list-type="picture-card" :disabled="true" :handle-preview="detailImg" />

          </el-form-item>
          <el-form-item label="违规回复:">
            <el-input v-model="item.feedback" />
          </el-form-item>
          <el-form-item label="整改照片:">
            <upload-list :files="attachments" list-type="picture-card" :disabled="true" :handle-preview="detailImg" />

          </el-form-item>
          <el-form-item label="处理回复:" prop="descResult">
            <el-input v-model="item.descResult" type="textarea" autosize />
          </el-form-item>
          <el-form-item label="审核结果:" prop="result">
            <el-select v-model="item.result">
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
        address: 'dsadasdsad',
        phone: '15988800323'
      },
      attachments: [
        { name: '附件', url: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg', uid: '附件' }
      ],
      rule: {

      },
      resultOptions: [
        { key: 0, val: '通过' },
        { key: -1, val: '不通过' }
      ],
      construction: [
        {
          org: '中一建',
          code: '马家浜1号楼',
          phone: '110',
          time: '2020-01-01 10:00',
          desc: '违规操作',
          descPic: [{ name: '违规图片1', url: '' }],
          feedback: '接受批评',
          feedbackPic: [{ name: '回复照片1', url: '' }],
          descResult: '',
          result: 0,
          status: 0
        }
      ],
      urls: [
        'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
        'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg'
      ]
    }
  },
  computed: {
    ...mapState('common', ['handleStatus', 'handleTag'])
  },
  methods: {
    detailImg(file) {
      // this.detailImgUrl = file.url
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
.form-card ::v-deep .el-upload-dragger {
  width: 400px;
  padding: 40px 5px;
  border: 2px solid #e5e5e5;
  color: #777;
  -webkit-transition: background-color 0.2s linear;
  transition: background-color 0.2s linear;
}
</style>

