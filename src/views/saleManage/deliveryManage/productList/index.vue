<template>
  <div class="app-container productList">
    <el-form class="mb10" :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item>
        <el-input v-model="queryParams.inputValue" placeholder="输入关键字" clearable size="small" style="width: 180px" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryParams.selectBookNo" size="small" style="width: 100px">
          <el-option :label="item.financial_book_name" :value="item.financial_book_no" v-for="item in financial_book_list" :key="item.financial_book_no" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row class="mb8">
      <svg-icon iconClass="tip" class="mr5" style="font-size:18px;"></svg-icon>
      <span class="f14 table_tip">点击“客户名称”可以查看该客户的未发清单。点击“订单号”可以查看订单详情并发货。</span>
      <el-radio-group style="float:right;margin-top:8px" v-model="queryParams.value">
        <el-radio :label="0">全部</el-radio>
        <el-radio :label="1">无退货</el-radio>
        <el-radio :label="2">有退货</el-radio>
      </el-radio-group>
    </el-row>

    <el-table class="mb8" :height="screen_height-350" v-loading="loading" :data="tableData">
      <el-table-column align="center" label="客户名称" prop="purchase_name" width="120">
        <template slot-scope="scope">
          <router-link to="/saleManage/deliveryManage/notDeliveryList">
            <el-link :underline="false" type="primary">{{scope.row.purchase_name}}</el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单号" prop="order_name" width="160" />
      <el-table-column align="center" label="名称" prop="element_name" />
      <el-table-column align="center" label="型号" prop="spec_code" width="240" />
      <el-table-column align="center" label="品牌" prop="brand" width="100" />
      <el-table-column align="center" label="单位" prop="unit" width="60" />
      <el-table-column align="center" label="成交数量" width="80" />
      <el-table-column align="center" label="已发数量" width="80" />
      <el-table-column align="center" label="可发数量" width="80" />
      <el-table-column align="center" label="备注" prop="remark" width="260" />
    </el-table>

    <pagination :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="handleCurrentChange">
      <el-tooltip class="item" effect="dark" content="刷新" placement="top">
          <el-button size="mini" circle icon="el-icon-refresh"/>
      </el-tooltip>
      
    </pagination>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: "productList",
  data() {
    return {
      queryParams:{
        searchInputValue: '',
        pageNum: 1,
        pageSize: 20,
        value: 0,
        selectBookNo: 0
      },
      loading: false,
      tableData: [{purchase_name:"海木星",order_name:"PO210115171738"},{purchase_name:"天狼星",order_name:"PO222222222"},{purchase_name:"雷诺",order_name:"PO33333333"}],
      total: 0,
      allRows: [],
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
    getPayDemandList(){},
    handleCurrentChange(){}
  },
};
</script>

<style lang="scss" scoped>
</style>