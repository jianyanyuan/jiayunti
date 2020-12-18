<!--
 * @Author: zfd
 * @Date: 2020-10-11 19:55:23
 * @LastEditTime: 2020-12-18 10:10:47
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
            <el-upload action="#" class="form-card" :on-remove="function(file,fileList){return handleUploadRemove(file,fileList,index)}" :on-change="function(file,fileList){return handleUploadChange(file,fileList,index)}" drag :auto-upload="false">
              <div>将文件拖到此处，或点击添加</div>
              <div>单个文件大小不超过20MB，可上传图片或PDF</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="处理回复:" prop="reply">
            <el-input v-model="item.reply" type="textarea" autosize />
          </el-form-item>
          <el-form-item label="处理结果:" prop="result">
            <el-select v-model="item.result">
              <el-option v-for="result in auditOptions" :key="result.val" :value="result.key" :label="result.val" />
            </el-select>
          </el-form-item>
          <el-row type="flex" justify="center" style="margin:50px 0">
            <el-button type="primary">保 存</el-button>
            <el-button>返 回</el-button>
          </el-row>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <el-dialog center title="图片详情" :visible.sync="imgVisible" :close-on-click-modal="false" class="dialog-center">
      <img :src="detailImgUrl" alt="授权委托书">
    </el-dialog>
    <el-dialog title="pdf预览" center :visible.sync="pdfVisible" :close-on-click-modal="false" class="dialog-center">
      <!-- 加载全部页面的PDF是一个for循环,不能指定用来打印的ref -->
      <div ref="printContent">
        <Pdf v-for="i in pdfPages" :key="i" :src="pdfURL" :page="i" />
      </div>
      <span slot="footer">
        <el-button @click="printPDF" type="success">打印</el-button>
        <!-- <el-button type="primary" @click="printImg">转图片打印</el-button> -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import mixin from '@/components/UploadList/mixin'
import { checkUpload } from '@/utils'

export default {
  name: 'ConstructionFault',
  mixins: [mixin],
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
      attachments: [
        { name: '附件', url: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg', uid: '附件' }
      ],
      construction:
        [
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
      replies: [],// 整改回复
      deleteList: [], // 待删除附件
      projectId:null,
      status:null,
      urls: [
        'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
        'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg'
      ]
    }
  },
  computed: {
    ...mapState('common', ['handleStatus', 'handleTag', 'auditOptions'])
  },
  created() {
    const { id, status } = this.$route.params
    //11 施工中
    if (!isNaN(+id) && status == 11) {
      this.projectId = id
      this.status = status
    }
  },
  methods: {

    submitFeedback() { },
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    // 限制了添加文件的逻辑，不支持多个文件选择
    handleUploadChange(file, fileList, index) {
      const valid = checkUpload(file.raw)
      if (valid && file.status === 'ready') {
        const formData = new FormData()
        formData.append('file', file.raw)
        this.replies[index].attachments.push(
          {
            uid: file.uid,
            file: formData
          }
        )
      } else {
        fileList.pop()
      }
    },
    // 删除文件
    handleUploadRemove(file, fileList, index) {
      if (file.url === undefined) {
        // 未上传 --> 取消上传
        const cancelIdx = this.replies[index].attachments.findIndex(f => f.uid === file.uid)
        this.replies[index].attachments.splice(cancelIdx, 1)
      } else {
        // 已上传的 --> 待删除
        this.deleteList.push(
          {
            projectId: this.id,
            uid: file.uid,
            name: file.name,
            url: file.url
          }
        )
      }
    },

  },
  // 获得工程Id
  beforeRouteEnter(to, from, next) {
    const { id, status } = to.params
    // 11 施工中
    if (isNaN(+id) || status != 11) {
      // 没有id则返回跳转
      next('/redirect' + from.fullPath)
    } else {
      next(vm => {
        vm.fromPath = from.fullPath
      })
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

