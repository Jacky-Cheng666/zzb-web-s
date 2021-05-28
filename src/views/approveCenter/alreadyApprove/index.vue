<template>
  <div class="app-container alreadyApprove">
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
      <el-form-item prop="valueTime">
        <el-date-picker size="small" v-model="queryParams.valueTime" type="daterange" align="right" value-format = "yyyy-MM-dd" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" />
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
      <el-table-column align="center" label="审批标题" prop="" width="100" />
      <el-table-column align="center" label="审批事项" prop="" width="200" />
      <el-table-column align="center" label="审批备注" prop="remark" />
      <el-table-column align="center" label="已转给" prop="" width="80" />
      <el-table-column align="center" label="申请人" prop="" width="80" />
      <el-table-column align="center" label="部门" prop="" width="100" />
      <el-table-column align="center" label="公司" prop="" width="140" />
      <el-table-column align="center" label="发起时间" prop="" width="160" />
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
  name: 'alreadyApprove',
  data() {
    return {
      queryParams: {
        inputValue: "",
        selectStatus: 0,
        pageNum: 1,
        pageSize: 100,
        valueTime:[],
      },
      loading: false,
      tableData: [{}],
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
      multipleSelection: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
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
.alreadyApprove{
  .table_tip{
    font-size: 14px;
    color: #515a6e;
  }
}
</style>