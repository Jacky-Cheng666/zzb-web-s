<template>
  <div class="app-container deliveryList">
    <el-form class="mb10" :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item>
        <el-input v-model="queryParams.inputValue" placeholder="输入关键字" clearable size="small" style="width: 180px" @keyup.enter.native="handleQuery"/>
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="6">
        <svg-icon iconClass="tip" class="mr5" style="font-size:18px;"></svg-icon>
        <span class="f14 table_tip">点击“订单号”可以进入订单页。</span>
      </el-col>
    </el-row>

    <el-table class="mb8" :height="screen_height-350" v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column align="center" label="订单号" prop="order_name" width="140">
        <template slot-scope="scope">
          <router-link :to="'/saleManage/deliveryManage/deSaleOrder/'+scope.row.order_name">
            <el-link :underline="false" type="primary">{{scope.row.order_name}}</el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column align="center" label="客户订单号" prop="receive_side_name" width="180" />
      <el-table-column align="center" label="客户名称" prop="purchase_name" />
      <el-table-column align="center" label="收货地址" prop="total_money_with_tax" width="120" />
      <el-table-column align="center" label="收货人" prop="receiver" width="80" />
      <el-table-column align="center" label="销售人" prop="saler" width="80" />
      <el-table-column align="center" label="协议交期" width="200"></el-table-column>
      <el-table-column align="center" label="附件" width="60"></el-table-column>
    </el-table>

    <pagination :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="handleCurrentChange">
      <div>
        <el-button type="primary" icon="el-icon-circle-check" size="mini">所有页全选</el-button>
        <el-button type="info" icon="el-icon-download" size="mini">批量下载附件</el-button>
        <el-button type="warning" icon="el-icon-printer" size="mini">批量打印</el-button>
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
  name: "deliveryList",
  data() {
    return {
      queryParams:{
        inputValue: '',
        selectStatus: 'all'
      },
      showSearch: true,
      loading: false,
      tableData: [{order_name:"PO210115171738"},{order_name:"PO222222222"},{order_name:"PO33333333"}],
      total: 0,
      allRows: [],
    };
  },
  computed: {
    ...mapGetters(['screen_height'])
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