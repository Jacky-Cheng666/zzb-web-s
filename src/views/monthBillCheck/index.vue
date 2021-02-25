<template>
  <div class="app-container monthBillCheck">
    <el-form class="mb10" :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item>
        <el-input v-model="queryParams.inputValue" placeholder="输入关键字" clearable size="small" style="width: 180px" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-date-picker size="small" v-model="value2" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"></el-date-picker>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryParams.pay_period" size="small" style="width: 100px">
          <el-option label="全部" value="全部"></el-option>
          <el-option label="未对账" value="未对账"></el-option>
          <el-option label="已对账" value="已对账"></el-option>
          <el-option label="已归档" value="已归档"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryParams.selectStatus" size="small" style="width: 100px">
          <el-option label="默认账本" value="all"></el-option>
          <el-option label="账本1" value="notVoice"></el-option>
          <el-option label="账本4" value="invoiced"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="2" class="mb8">
      <el-col :span="12">
       <svg-icon iconClass="tip" class="mr5" style="font-size:18px;"></svg-icon>
       <span class="f14 table_tip">点击“附件”可以查看对账单详情。</span>
      </el-col>
      
      
    </el-row>
    
    <el-table class="mb8" :height="screen_height-350" v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column sortable align="center" label="供应商" prop="supplier_full_name"/>
      <el-table-column align="center" label="对账周期" prop="purchase_name" width="120" />
      <el-table-column align="center" label="结款方式" prop="pay_mode" width="120" />
      <el-table-column align="center" label="未税金额" prop="total_money_with_tax" width="120" />
      <el-table-column align="center" label="税额" prop="" width="120" />
      <el-table-column align="center" label="税价合计" prop="total_money_with_tax" width="140" />
      <el-table-column sortable align="center" label="对账人" prop="saler" width="100" />
      <el-table-column sortable align="center" label="对账时间" width="200"></el-table-column>
      <el-table-column align="center" label="附件" width="60">
        <template slot-scope="scope">
          <router-link :to="'/purchaseManage/monthBill/'+scope.row.order_name">
            <svg-icon style="color:#3894FF;font-size:16px;cursor:pointer" icon-class="pdf" />
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="handleCurrentChange">
      <div>
        <el-button type="primary" icon="el-icon-circle-check" size="mini">所有页全选</el-button>
        <el-button type="info" icon="el-icon-download" size="mini">批量下载附件</el-button>
        <el-button type="info" icon="el-icon-download" size="mini">导出</el-button>
        <el-tooltip class="item" effect="dark" content="刷新" placement="top">
            <el-button size="mini" circle icon="el-icon-refresh"/>
        </el-tooltip>
      </div>
    </pagination>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'monthBillCheck',
  data() {
    return {
      queryParams: {
        inputValue: "",
        pay_period: "全部",
        invoiceStatus: "all",
        selectStatus: "all",
        pageNum: 1,
        pageSize: 100,
      },
      showSearch: true,
      loading: false,
      tableData: [{order_name:"PO210115171738"},{order_name:"PO222222222"},{order_name:"PO33333333"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},],
      total: 0,
      allRows: [],
      value2:[],
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
      checked: false
    }
  },
  computed: {
    ...mapGetters(['screen_height'])
  },
  methods: {
    handleQuery(){},
    resetQuery(){},
    getPayDemandList(){},
    handleSelectionChange(){},
    handleCurrentChange(){},
    viewSalesOrder(row){
      this.$router.push('/saleManage/saleOrder'+row.order_name)
    }
  },

}
</script>

<style lang="scss" scoped>
.monthBillCheck{
  .table_tip{
    font-size: 14px;
    color: #515a6e;
  }
}
</style>