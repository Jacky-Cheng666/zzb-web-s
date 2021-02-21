<template>
  <div class="app-container deliveryRecords">
    <el-form class="mb10" :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item>
        <el-input v-model="queryParams.inputValue" placeholder="输入关键字" clearable size="small" style="width: 180px" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-date-picker size="small" v-model="queryParams.time_range" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"></el-date-picker>
      </el-form-item>
      <el-form-item label="账本">
        <el-select v-model="queryParams.selectStatus" size="small" style="width: 100px">
          <el-option label="默认账本" value="all"></el-option>
          <el-option label="账本1" value="notVoice"></el-option>
          <el-option label="账本4" value="invoiced"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryParams.invoiceStatus" size="small" style="width: 100px">
          <el-option label="全部" value="all"></el-option>
          <el-option label="未收货" value="notVoice"></el-option>
          <el-option label="已收货" value="invoiced"></el-option>
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
        <span class="f14 table_tip">点击“发货单号”可以进入发货单页，点击“订单号”可以进入订单页。</span>
      </el-col>
    </el-row>

    <el-table class="mb8" height="490" v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column sortable align="center" label="发货单号" prop="deliver_name" width="140">
        <template slot-scope="scope">
          <router-link :to="'/saleManage/deliveryManage/deliveryOrder/'+scope.row.deliver_name">
            <el-link :underline="false" type="primary">{{scope.row.deliver_name}}</el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" label="订单号" prop="order_name" width="140">
        <template slot-scope="scope">
          <router-link :to="'/saleManage/deliveryManage/deSaleOrder/'+scope.row.order_name">
            <el-link :underline="false" type="primary">{{scope.row.order_name}}</el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column align="center" label="客户订单号" prop="receive_side_name" width="180" />
      <el-table-column sortable align="center" label="客户名称" prop="purchase_name" />
      <el-table-column sortable align="center" label="销售人" prop="saler" width="100" />
      <el-table-column sortable align="center" label="协议交期" prop="receiver" width="100" />
      <el-table-column sortable align="center" label="发货人" prop="consiger_name" width="100" />
      <el-table-column sortable align="center" label="发货时间" width="160"></el-table-column>
      <el-table-column sortable align="center" label="收货状态" width="100"></el-table-column>
    </el-table>

    <pagination :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="handleCurrentChange">
      <div>
        <el-tooltip class="item" effect="dark" content="刷新" placement="top">
            <el-button size="mini" circle icon="el-icon-refresh"/>
        </el-tooltip>
      </div>
    </pagination>

    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :custom-style="myBackToTopStyle" :visibility-height="300" :back-position="0" transition-name="fade" />
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: "deliveryRecords",
  data() {
    return {
      myBackToTopStyle: {
        right: '50px',
        bottom: '70px',
        width: '40px',
        height: '40px',
        'border-radius': '4px',
        'line-height': '45px', // Please keep consistent with height to center vertically
        background: '#e7eaf1'//  The background color of the button
      },
      queryParams:{
        inputValue: '',
        selectStatus: 'all',
        time_range: [],
        invoiceStatus: "all"
      },
      showSearch: true,
      loading: false,
      tableData: [{order_name:"PO210115171738",deliver_name:"DR210205160812"},{order_name:"PO222222222",deliver_name:"DR2222222"},{order_name:"PO33333333",deliver_name:"DR333333333"}],
      total: 0,
      allRows: [],
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
  methods: {
    handleQuery(){},
    resetQuery(){},
    handleSelectionChange(){},
    getPayDemandList(){},
    handleCurrentChange(){}
  },
};
</script>

<style lang="scss" scoped>
</style>