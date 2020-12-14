<!--
 * @Author: 张飞达
 * @Date: 2020-10-12 09:38:42
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-11 16:51:11
 * @Description:申请列表
-->

<template>
  <div class="app-container">
    <el-button type="primary" size="medium" style="margin-bottom:20px" :loading="openLoading" @click="openAddModal">新增申请</el-button>

    <el-card>
      <el-table v-loading="listLoading" row-key="$index" style="width:100%" :data="list" :default-sort="{prop: 'addTime', order: 'descending'}" fit highlight-current-row @row-dblclick="flowView">
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="编号" prop="projectName" />
        <el-table-column label="提交时间" align="center" prop="addTime" sortable min-width="145px">
          <template slot-scope="{row}">
            <i class="el-icon-time" />
            <span>{{ new Date(row.addTime) | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最新处理时间" align="center" prop="updateTime" sortable min-width="145px">
          <template v-if="scope.row.updateTime" slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ new Date(scope.row.updateTime) | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="statusId" sortable>
          <template slot-scope="scope">
            <el-tag :type="scope.row.statusId | keyToVal(applyTag)">{{ scope.row.statusId | keyToVal(applyStatus) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200px">
          <template slot-scope="scope">
            <el-row type="flex" justify="space-around">
              <el-button v-if="scope.row.statusId === 0" size="mini" type="warning" plain @click="$router.push({name:'ResidentApply',params:{id:scope.row.id,status:scope.row.statusId}})">提交材料</el-button>
              <el-tag v-if="scope.row.statusId === 1 && !scope.row.auditTime" size="medium" type="warning" effect="light">社区受理中</el-tag>

              <el-button v-if="scope.row.statusId === 3" size="mini" type="primary" plain @click="$router.push({name:'ResidentApplyNotice',params:{id:scope.row.id,status:scope.row.statusId}})">提交材料</el-button>

              <el-button v-if="scope.row.statusId === 3" size="mini" type="warning" plain @click="$router.push({name:'ResidentAssentsDetail',params:{}})">异议反馈</el-button>

              <el-tag v-if="scope.row.statusId === 4" size="medium" type="warning" effect="light">管道踏勘中</el-tag>

              <el-button v-if="scope.row.statusId === 2 || scope.row.statusId === 5" size="mini" type="success" plain @click="$router.push({name:'ResidentDesignDetail',params:{}})">查看设计</el-button>
              <el-button v-if="scope.row.statusId === 7" size="mini" type="warning" plain @click="$router.push({name:'ResidentOffer',params:{}})">选择报价</el-button>
              <el-tag v-if="scope.row.statusId === 10" size="medium" type="success" effect="light">申请已通过</el-tag>
              <el-tag v-if="scope.row.statusId === 13" size="medium" type="danger" effect="light">已驳回</el-tag>
              <el-tag v-if="scope.row.statusId === 14" size="medium" type="info" effect="light">已撤销</el-tag>
              <el-button v-if="scope.row.statusId === 11" size="mini" type="warning" plain @click="$router.push({name:'ResidentFaultView',params:{}})">违规查看</el-button>
              <!-- <el-button v-if="scope.row.statusId === 12" size="mini" type="warning" plain @click="$router.push({path:'/construction/complete',query:{applyId:row.Id}})">竣工验收</el-button> -->
              <el-button v-if="scope.row.statusId === 12" size="mini" type="warning" @click="subsidyVisible = true">补贴查看</el-button>
              <el-tag v-if="[1,6,8,9].includes(scope.row.statusId) && scope.row.auditTime" size="medium" type="success">审核已通过</el-tag>

              <el-button v-if="[0,5].includes(scope.row.statusId) && scope.row.auditTime" size="mini" plain type="warning" @click="$router.push({name:'ResidentAuditDetail',params:{}})">审核结果</el-button>

              <!-- <el-button v-if="scope.row.statusId === 1 && scope.row.dissent" size="mini" type="success" @click="dissentView"> 查看反馈</el-button> -->
              <!-- <el-button v-if="scope.row.statusId === 10" size="mini" type="danger" @click="viewAudit(scope.row)">审核意见</el-button> -->
              <!-- <el-button v-if="scope.row.statusId !== 0" size="mini" type="primary" @click="flowView">查看流程</el-button> -->
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="撤销申请" align="center">
          <template slot-scope="scope">
            <el-popconfirm v-if="scope.row.statusId !== 13 && scope.row.statusId !== 14" title="确认撤销申请吗？" @onConfirm="cancelApply(scope.row)">
              <el-button slot="reference" size="mini" type="text" style="letter-spacing:1em">撤销</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- <p class="contract-tip">审核单位：<span>XXX街道办</span> 审核人员：<span>XXX</span> 联系电话：<span>0512XXXX</span> 工作时间：周一至周五 9:00-11:00 14:00-17:00</p> -->

    <!-- 新增申请 -->
    <el-dialog v-el-drag-dialog title="新增申请" :visible.sync="model.visible" :close-on-click-modal="false" width="600px" top="10vh" @close="resetFrom('form')">
      <el-form ref="form" v-loading="formLoading" :model="model.form" :rules="model.rules" label-width="120px">
        <el-form-item label="申请人" prop="applicantName">
          <el-input v-model="model.form.applicantName" auto-complete="off" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-row>
            <el-col :span="12">
              <el-cascader v-model="model.form.address.county" :options="countyOptions" :props="countyProps" style="display:block" disabled />
            </el-col>
            <el-col :span="2" style="text-align:center"><label for="address-detail"> — </label></el-col>
            <el-col :span="10">
              <el-cascader v-model="model.form.address.community" :options="communityOptions" :props="communityProps" style="display:block" disabled />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="电话" prop="phoneNumber">
          <el-input v-model="model.form.phoneNumber" auto-complete="off" />
        </el-form-item>
        <el-form-item label="加装电梯地址" prop="location">
          <div> <input v-model="model.form.location[0]" type="text" name="cell" autocomplete="off"> 小区</div>
          <div> <input v-model="model.form.location[1]" type="text" name="building" autocomplete="off"> 幢</div>
          <div> <input v-model="model.form.location[2]" type="text" name="unit" autocomplete="off"> 单元</div>
        </el-form-item>
        <el-form-item label="设计单位" prop="designId">
          <el-select v-model="model.form.designId" filterable >
            <el-option v-for="item in designOptions" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备" prop="typeAndDevice">
          <el-cascader v-model="model.form.typeAndDevice" :options="deviceOptions">
            <template slot-scope="{ node, data }">
              <span>{{ data.label }}</span>
              <span v-if="node.isLeaf">kg</span>
            </template>
          </el-cascader>
        </el-form-item>
        <!-- 单元下业主 -->
        <el-form-item v-for="(room, index) in model.form.rooms" :key="room.key" :label="'房间编号' + (index+1)" :prop="'rooms.' + index + '.val'" :rules="{required: true, message: '房间编号不能为空', trigger: 'blur'}">
          <el-input v-model="room.val" placeholder="400" auto-complete="off">
            <template slot="append">
              <el-button :icon="index == 0 ? 'el-icon-plus' : 'el-icon-minus'" @click="handleRoom(index)" />
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <div style="text-align:center">
        <el-button @click="model.visible = false">取 消</el-button>
        <el-button type="primary" @click="postApply">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 补贴查看 -->
    <el-dialog v-el-drag-dialog title="补贴查看" center :visible.sync="subsidyVisible" :close-on-click-modal="false" class="uploadModal">
      <el-form :model="subsidy" label-position="top">
        <el-form-item label="补助金额（元）:">
          {{ subsidy.money | numberFormat }}
        </el-form-item>
        <el-form-item label="证明材料:" prop="attachment">
          <a v-for="file in fileList" :key="file.name" class="file-display">
            <i class="el-icon-document" />
            {{ file.name }}
            <i class="el-icon-download" style="float:right" />
          </a>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 查看流程 -->
    <el-dialog v-el-drag-dialog title="申请流程" center :visible.sync="flowVisible" :close-on-click-modal="false" min-width="1000px">
      <flow />
    </el-dialog>
  </div>
</template>

<script>
import index from './index'
export default {
  ...index
}
</script>
<style scoped lang="scss">
.dialog-container {
  min-width: 700px;
}
input {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  height: 25px;
  padding: 0 15px;
}

// .contract-tip {
//   padding: 0 10px;
//   color: #686d76;
//   line-height: 30px;
//   span {
//     margin-right: 20px;
//   }
// }
.file-display {
  display: block;
  text-align: left;
  padding: 5px;
  margin: 10px;
  border-radius: 5px;
  // background-color: chartreuse;
}
.file-display:hover {
  color: #409eff;
  background-color: #ebebeb;
}
</style>
