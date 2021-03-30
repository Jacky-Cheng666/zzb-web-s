<template>
  <div class="app-container overView">
    <el-form class="mb10" :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item>
        <el-input v-model="queryParams.inputValue" placeholder="输入关键字" clearable size="small" style="width: 180px" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-date-picker size="small" v-model="queryParams.time_range" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryParams.selectStatus" size="small" style="width: 100px">
          <el-option :label="item.financial_book_name" :value="item.financial_book_no" v-for="item in financial_book_list" :key="item.financial_book_no" />
        </el-select>
      </el-form-item>
      <!-- <el-form-item>
        <el-select v-model="queryParams.invoiceStatus" size="small" style="width: 102px">
          <el-option label="全部" value="all"></el-option>
          <el-option label="未对账" value="notSubmit"></el-option>
          <el-option label="已对账" value="toBeApprove"></el-option>
          <el-option label="已归档" value="toBeApprove"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row class="mb8">
      <svg-icon iconClass="tip" class="mr5" style="font-size:18px;"></svg-icon>
      <span class="f14 table_tip">点击“客户名称”可以查看该客户所有未开票的清单，点击“附件”可以查看对账单详情。</span>
      <el-radio-group style="float:right;margin-top:8px" v-model="queryParams.value">
        <el-radio :label="0">全部</el-radio>
        <el-radio :label="1">未对账</el-radio>
        <el-radio :label="2">已对账</el-radio>
        <el-radio :label="3">已归档</el-radio>
      </el-radio-group>
    </el-row>

    <el-table class="mb8" :height="screen_height-350" v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column align="center" label="客户名称" prop="purchase_name" />
      <el-table-column align="center" label="对账周期" prop="" width="100" />
      <el-table-column align="center" label="对账日" prop="" width="120" />
      <el-table-column align="center" label="结款方式" prop="" width="100" />
      <el-table-column align="center" label="金额" prop="" width="100" />
      <el-table-column align="center" label="税金" prop="" width="100" />
      <el-table-column align="center" label="税价合计" prop="" width="120" />
      <el-table-column align="center" label="对账人" prop="" width="80" />
      <el-table-column align="center" label="对账时间" width="160"></el-table-column>
      <el-table-column align="center" label="附件" width="60"></el-table-column>
    </el-table>

    <pagination :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="handleCurrentChange">
      <el-button type="info" icon="el-icon-download" size="mini">导出</el-button>
      <el-tooltip class="item" effect="dark" content="刷新" placement="top">
          <el-button size="mini" circle icon="el-icon-refresh"/>
      </el-tooltip>
      
    </pagination>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: "overView",
  data() {
    return {
      queryParams:{
        searchInputValue: '',
        pageNum: 1,
        pageSize: 20,
        selectStatus: 0,
        value: 0
      },
      showSearch: true,
      loading: false,
      tableData: [],
      total: 0,
      allRows: [],
      multipleSelection: [],
      booksTypeOptions: [],
      isAllChoose: false,
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
    };
  },
  computed: {
    ...mapGetters(['screen_height', 'token','financial_book_list'])
  },
  methods: {
    handleQuery(){},
    resetQuery(){
      this.queryParams.searchInputValue = ''
      this.handleQuery()
    },
    handleSelectionChange(val){
      this.multipleSelection = val
    },
    getPayDemandList(){},
    handleCurrentChange(){}
  },
};
</script>

<style lang="scss" scoped>
</style>