<template>
  <div class="app-container toBeApprove">
    <el-form class="mb10" :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item prop="inputValue">
        <el-input v-model="queryParams.inputValue" placeholder="输入关键字" clearable size="small" style="width: 180px" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item prop="selectStatus">
        <el-select style="width: 100px;" size="small"  v-model="queryParams.selectStatus" @change="ApproveStatusChange" placeholder="请选择">
          <el-option label="所有审批" :value="0" />
          <el-option label="已审批" :value="1" />
          <el-option label="未审批" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row class="mb8">
      <svg-icon iconClass="tip" class="mr5" style="font-size:18px;display:inline-block"></svg-icon>
      <span class="table_tip">点击“审批事项”可以查看待审批的详情。</span>
    </el-row>

    
    <el-table class="mb8" :height="screen_height-350" v-loading="loading" :data="tableData">
      <el-table-column align="center" label="审批标题" prop="title" width="100" />
      <el-table-column align="center" label="审批事项" prop="caption" width="200">
        <template slot-scope="scope">
          <router-link :to="{ path: '/approveCenter/prmApprove', query: {attachment_url:scope.row.attachment_url} }">
            <el-link :underline="false" type="primary">{{scope.row.caption}}</el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column align="center" label="审批备注" prop="remark" />
      <el-table-column align="center" label="已转给" prop="" width="80" />
      <el-table-column align="center" label="申请人" prop="creater_name" width="80" />
      <el-table-column align="center" label="部门" prop="department" width="100" />
      <el-table-column align="center" label="公司" prop="company" width="140" />
      <el-table-column align="center" label="发起时间" prop="create_time" width="160" />
      <el-table-column align="center" label="操作" width="120">
        <template>
          <el-button size="mini" type="text" icon="el-icon-check">同意</el-button>
          <el-button size="mini" type="text" icon="el-icon-close" style="color: #E34348">拒绝</el-button>
        </template>
      </el-table-column>
      
    </el-table>

    <pagination :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="handleCurrentChange">
      <el-tooltip class="item" effect="dark" content="刷新" placement="top">
          <el-button size="mini" @click="handleRefresh" circle icon="el-icon-refresh"/>
      </el-tooltip>
    </pagination>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'toBeApprove',
  data() {
    return {
      queryParams: {
        inputValue: "",
        selectStatus: 0,
        pageNum: 1,
        pageSize: 100,
      },
      loading: false,
      tableData: [
        {"task_id":"60a4f681f574fd3528d48ac7","type":10,"title":"订单审批","caption":"销售单PO210519192859","remark":"采购商：非协同测试 ","creater_id":1,"creater_name":"刘浩1","create_time":1621423745253,"department":"采购部","company":"测试专用","expire_time":17389423745221,"all_access":false,"attachment_url":{"host":"192.168.1.47","port":4531,"router":"/notify/send_notify","param":{"cmd":90520,"order_no":"60a4f67bb7c5ae07b420982a","company_no":"5bd18fb6de00d364475316b5"}},"feedback_url":{"host":"192.168.1.47","port":4531,"router":"/notify/send_notify","param":{"cmd":90522,"order_no":"60a4f67bb7c5ae07b420982a","company_no":"5bd18fb6de00d364475316b5"}},"approve_type":401,"approve_name":"销售审批","resource_no":"60a4f67bb7c5ae07b420982a","is_active":true,"owner_list":[1,878,904,403,884,900],"is_main_approver":true,"can_approve":true}
      ],
      total: 0,
      allRows: [],
      rows: [],
      booksTypeOptions: [],
      ordersTypeOptions: [
        {
          value: 0,
          label: '全部'
        }, 
        {
          value: 1,
          label: '未核价'
        }, 
        {
          value: 2,
          label: '无单号'
        }
      ],
      multipleSelection: []
    }
  },
  computed: {
    ...mapGetters(['screen_height', 'token', 'financial_book_list'])
  },
  created(){
  },
  methods: {
    handleQuery(){
      
    },
  
    resetQuery(){
      this.$refs.queryForm.resetFields();
      this.handleQuery()
    },
    handleCurrentChange(){

    },
    ApproveStatusChange(val){
      // this.selectStatus = val
      // this.isTableChange = true
    },
    handleRefresh(){
      
    }
  },

}
</script>

<style lang="scss" scoped>
.toBeApprove{
  .table_tip{
    font-size: 14px;
    color: #515a6e;
  }
}
</style>