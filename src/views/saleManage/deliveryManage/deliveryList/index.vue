<template>
  <div class="app-container deliveryList">
    <el-form class="mb10" :model="queryParams" ref="queryForm" :inline="true">
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

    <el-row class="mb8">
      <svg-icon iconClass="tip" class="mr5" style="font-size:18px;"></svg-icon>
      <span class="f14 table_tip">点击“订单号”可以进入订单页。</span>
      <el-radio-group style="float:right;margin-top:8px" v-model="queryParams.value">
        <el-radio :label="0">全部</el-radio>
        <el-radio :label="1">无退货</el-radio>
        <el-radio :label="2">有退货</el-radio>
      </el-radio-group>
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
      <el-table-column align="center" label="客户订单号" prop="purchase_name" width="180" />
      <el-table-column align="center" label="客户名称" prop="purchase_name" />
      <el-table-column align="center" label="收货地址" prop="receive_addr" width="120" />
      <el-table-column align="center" label="收货人" prop="receiver_name" width="80" />
      <el-table-column align="center" label="销售人" prop="saler" width="80" />
      <el-table-column align="center" label="协议交期" width="200"></el-table-column>
      <el-table-column align="center" label="状态" width="60"></el-table-column>
    </el-table>

    <pagination :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="handleCurrentChange">
      <el-button type="warning" icon="el-icon-printer" size="mini">批量打印</el-button>
      <el-tooltip class="item" effect="dark" content="刷新" placement="top">
          <el-button size="mini" circle icon="el-icon-refresh"/>
      </el-tooltip>
      
    </pagination>

  </div>
</template>

<script>
import { getAllDeliveryRecords } from '@/api/saleManage'
import { mapGetters } from 'vuex'
import common from '@/utils/common'

export default {
  name: "deliveryList",
  data() {
    return {
      queryParams:{
        searchInputValue: '',
        pageNum: 1,
        pageSize: 20,
        value: 0
      },
      loading: false,
      tableData: [{order_name:"PO210115171738"},{order_name:"PO222222222"},{order_name:"PO33333333"}],
      // tableData: [],
      total: 0,
      allRows: [],
      multipleSelection: [],
      booksTypeOptions: [],
      isAllChoose: false
    };
  },
  computed: {
    ...mapGetters(['screen_height', 'token'])
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