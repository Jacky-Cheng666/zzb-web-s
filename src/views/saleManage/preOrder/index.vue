<template>
  <div class="app-container preOrder">
    <el-form class="mb10" :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item>
        <el-input v-model="queryParams.searchInputValue" placeholder="输入关键字" clearable size="small" style="width: 180px" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-select style="width: 100px;" size="small"  v-model="queryParams.valueBookType" @change="changeBookType" placeholder="请选择">
          <el-option v-for="item in financial_book_list" :key="item.financial_book_no" :label="item.financial_book_name" :value="item.financial_book_no" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row class="mb8">
      <svg-icon iconClass="tip" class="mr5" style="font-size:18px;display:inline-block"></svg-icon>
      <span class="table_tip">点击“订单号”可以查看预备订单详情。</span>
      <el-radio-group style="float:right;margin-top:8px" v-model="queryParams.valueOrderType">
        <el-radio :label="item.value" v-for="item in ordersTypeOptions" :key="item.value">{{item.label}}</el-radio>
      </el-radio-group>
    </el-row>

    
    <el-table class="mb8" :height="screen_height-350" v-loading="loading" :data="tableData">
      <el-table-column align="center" label="订单号" prop="request_name" width="180">
      </el-table-column>
      <el-table-column align="center" label="客户" prop="purchase_full_name" width="360" />
      <el-table-column align="center" label="销售人" prop="seller" width="80" />
      <el-table-column align="center" label="类型" prop="order_use_name" width="80" />
      <el-table-column align="center" label="结款" prop="pay_period_name" width="80" />
      <el-table-column align="center" label="金额" prop="total_price" width="100" />
      <el-table-column align="center" label="交期" prop="" width="100"></el-table-column>
      <el-table-column align="center" label="备注" prop="remark" />
    </el-table>

    <pagination :total="total" :page.sync="queryParams.currentPage" :limit.sync="queryParams.pageSize" @pagination="handleCurrentChange">
      <el-tooltip class="item" effect="dark" content="刷新" placement="top">
          <el-button size="mini" @click="handleRefresh" circle icon="el-icon-refresh"/>
      </el-tooltip>
    </pagination>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'preOrder',
  data() {
    return {
      queryParams: {
        searchInputValue: "",
        valueBookType: 0,
        valueOrderType: 0,
        count: 0,
        currentPage: 1,
        pageSize: 100,
        filterList: []
      },
      loading: false,
      tableData: [],
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
    
      this.handleQuery()
    },
    handleCurrentChange(){

    },
    //账本
    changeBookType(val){
      // this.valueBookType = val
      // this.isTableChange = true
    },
    //筛选订单类型
    changeOrderType(val){
      // this.valueOrderType = val
      // this.changeRefresh()
    },
    handleRefresh(){
      
    }
  },

}
</script>

<style lang="scss" scoped>
.preOrder{
  .table_tip{
    font-size: 14px;
    color: #515a6e;
  }
}
</style>