<template>
  <div class="app-container approveTicket" v-loading="loading" element-loading-text="加载中...">
    <fieldset class="field">
      <div class="order_basic_info">
        <div class="title mb12">深圳市智造帮科技有限公司-请购单</div>
        <div class="mb12 f14">
          <span class="mr20">部门：智造中心</span>
          <span class="mr20">需求人：辛芷蕾</span>
          <span class="mr20">用途：维修物料</span>
          <span class="mr20">需求日期：2021-12-12</span>
          <span>账本：默认账本</span>
        </div>
        <div class="mb12 f14">
          <span class="mr20">项目：SWSCFL2021</span>
          <span class="mr20">变更原因：新增物料</span>
        </div>
        <div class="mb12 f14">
          <span class="mr20">请购单号：PR210129113843</span>
          <span class="mr20">请购人：陈道明</span>
          <span class="mr20">请购时间：2021-01-06 09:23:37</span>
        </div>
        
        <el-tag v-if="orderInfo.payment_over" class="tag" type="success">已收迄</el-tag>
        <el-tag v-else-if="!orderInfo.payment_over" class="tag" type="info">未收迄</el-tag>
        <el-tag v-else class="tag" type="info">无效</el-tag>
      </div>
    </fieldset>
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item>
        <el-input v-model="queryParams.searchInputValue" placeholder="输入关键字" clearable size="small" style="width: 180px" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>

      <el-form-item style="float:right;margin-right:0">
        <span class="table_tip">订单说明：{{ orderInfo.order_describe ? orderInfo.order_describe : '无' }}</span>
      </el-form-item>
    </el-form>

        
    <el-table class="mb8" ref="multipleTable" :height="screen_height-470" :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column align="center" label="名称" prop="element_name" width="200" />
      <el-table-column align="center" label="型号" prop="spec_code" width="320" />
      <el-table-column align="center" label="品牌" prop="brand" width="120" />
      <el-table-column align="center" label="代码" prop="element_code" width="120" />
      <el-table-column align="center" label="单位" prop="unit" width="80" />
      <el-table-column align="center" label="数量" prop="num" width="100" />
      <el-table-column align="center" label="备注" prop="remark"/>
    </el-table>
      

    <pagination :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="handleCurrentChange">
      <div>
        <el-button type="danger" size="mini">
            <svg-icon @click="handleReturnOrder" disabled icon-class="returnOrder" class-name="btn_icon_svg"></svg-icon>&nbsp;退回
        </el-button>
        <el-button type="success" icon="el-icon-check" size="mini">通过</el-button>
        <el-button type="primary" icon="el-icon-refresh" size="mini">转审批</el-button>
      </div>
    </pagination>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: "approveTicket",
  data() {
    return {
        showSearch: true,
        queryParams: {
          searchInputValue: '',
          pageNum: 1,
          pageSize: 100,
          filterList: []
        },
        total: 1000,
        loading: false,
        tableData: [],
        //
        orderNo: '',
        orderName: '',
        orderInfo: {},
        booksTypeOptions: [],
        financialBookName: '',
        totalNum: 0,
        noTaxTotalPrice: 0,
        includeTaxTotalPrice: 0,
        onlyTaxTotalPrice: 0,
        isSynergy: 0,
        is_pre_attach: 0,
        orderTime: '',
        deliveryTime: '',
        onSaleShow: '',
    };
  },
  computed:{
      ...mapGetters(['screen_height', 'token'])
  },
  created(){
    // this.handleRefresh()
  },
  methods:{
  
    handleSelectionChange(){

    },
    handleCurrentChange(){

    },
   
   
    filterTableData(){
      let tempList = [];
      this.allRows.forEach(item => {
        tempList.push(item)
      })

      this.queryParams.filterList = tempList
    },
    handleQuery(){
    
    },
   
    cancelSelect() {
      if (this.$refs.multipleTable) {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleReturnOrder(){

    },
    resetQuery(){}
  }
};
</script>

<style lang="scss">
.approveTicket {
    .table_tip {
        font-size: 14px;
        color: #515a6e;
    }
}
</style>