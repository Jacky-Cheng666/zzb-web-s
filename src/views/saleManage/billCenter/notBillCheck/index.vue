<template>
  <div class="app-container notBillCheck">
    <el-form class="mb10" :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item>
        <el-input v-model="queryParams.inputValue" placeholder="输入关键字" clearable size="small" style="width: 180px" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-date-picker size="small" v-model="queryParams.time_range" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" />
      </el-form-item>
      <el-form-item>
        <el-select placeholder="请选择付款方" v-model="queryParams.invoiceStatus" size="small" style="width: 240px">
          <el-option label="全部" value="all"></el-option>
          <el-option label="未对账" value="notSubmit"></el-option>
          <el-option label="已对账" value="toBeApprove"></el-option>
          <el-option label="已归档" value="toBeApprove"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryParams.selectStatus" size="small" style="width: 100px">
          <el-option :label="item.financial_book_name" :value="item.financial_book_no" v-for="item in financial_book_list" :key="item.financial_book_no" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="12">
        <svg-icon iconClass="tip" class="mr5" style="font-size:18px;"></svg-icon>
        <span class="f14 table_tip">点击“销售单号”可以查看销售订单，点击“出库单号”可以查看出库单。</span>
      </el-col>
      <el-col :span="12" style="text-align:right">
        <span class="f14 table_tip mr20">总金额：2938.00</span>
        <span class="f14 table_tip mr20">总税额：2938.00</span>
        <span class="f14 table_tip">税价合计：2938.00</span>
      </el-col>
    </el-row>

    <el-table class="mb8" :height="screen_height-350" v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column align="center" label="销售单号" prop="order_name" width="140" />
      <el-table-column align="center" label="名称" prop="element_name" />
      <el-table-column align="center" label="型号" prop="spec_code" width="220" />
      <el-table-column align="center" label="品牌" prop="brand" width="100" />
      <el-table-column align="center" label="单位" prop="unit" width="60" />
      <el-table-column align="center" label="数量" prop="" width="80" />
      <el-table-column align="center" label="出库单号" prop="" width="140" />
      <el-table-column align="center" label="未税价格" prop="" width="120" />
      <el-table-column align="center" label="税金" prop="" width="120" />
      <el-table-column align="center" label="税价合计" prop="" width="140" />
    </el-table>

    <pagination :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="handleCurrentChange">
      <span class="f14 table_tip mr20">选中总金额：123456789.00</span>
      <span class="f14 table_tip mr20">选中税价合计：456789.00</span>
      <el-checkbox style="margin-right: 20px;" v-model="isAllChoose" label="所有页全选" ></el-checkbox>
      <el-button type="primary" icon="" size="mini">发起对账</el-button>
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
  name: "notBillCheck",
  data() {
    return {
      queryParams:{
        searchInputValue: '',
        pageNum: 1,
        pageSize: 20,
        selectStatus: 0
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

<style lang="scss">
</style>