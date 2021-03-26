<template>
  <div class="app-container intentionOrder">
    <fieldset class="field">
      <div class="order_basic_info">
        <div class="title mb12">深圳市智造帮科技有限公司-意向订单</div>
        <div class="mb12 f14">
          <span class="mr20">订单类型：销售</span>
          <span class="mr20">结款方式：预付</span>
          <span class="mr20">发票税率：6%</span>
          <span>账本：默认账本</span>
        </div>
        <div class="company_name mb12 f14">客户名称：深圳市卓誉科技有限公司</div>
        <div class="mb12 f14">
          <span class="mr20">订单号：PO12345678910</span>
          <span class="mr20">销售人：张若军</span>
          <span class="mr20">下单时间：2021-03-26 21:00:11</span>
          <span class="mr20">需求日期：2021-01-06</span>
        </div>
        <div class="f14">
          <span>结款计划：</span>
          <el-tooltip placement="top" content="点击查看付款计划">
            <svg-icon iconClass="eye-open" style="font-size:16px;color:#3894FF;cursor:pointer"></svg-icon>
          </el-tooltip>
          <span class="ml20">收货地址：</span>
          <el-tooltip placement="top" content="点击查看收货地址">
            <svg-icon iconClass="receiving_address" style="font-size:18px;color:#3894FF;cursor:pointer"></svg-icon>
          </el-tooltip>
        </div>
        <el-tag class="tag" type="success">已收迄</el-tag>
        <el-tag class="tag" type="info">未收迄</el-tag>
        <el-tag class="tag" type="info">无效</el-tag>
      </div>
    </fieldset>
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item>
          <el-input v-model="queryParams.searchInputValue" placeholder="输入关键字" clearable size="small" style="width: 180px" @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item>
          <el-select style="width: 120px;" size="small" @change="changeOrderType" v-model="queryParams.valueOrderType" placeholder="请选择">
            <el-option v-for="item in selectOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>

        <el-form-item style="float:right;margin-right:0">
          <span class="table_tip">订单说明：这是一个订单说明</span>
        </el-form-item>
      </el-form>

        
      <el-table class="mb8" ref="multipleTable" :height="screen_height-470" v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="50" />
        <el-table-column align="center" label="名称" prop="" width="180" />
        <el-table-column align="center" label="型号" prop="" width="240" />
        <el-table-column align="center" label="品牌" prop="" width="100" />
        <el-table-column align="center" label="单位" prop="" width="60" />
        <el-table-column align="center" label="数量" prop="" width="80" />
        <el-table-column align="center" label="需求日期" prop="" width="100" />
        <el-table-column align="center" label="交货日期" prop="" width="100" />
        <el-table-column align="center" label="客户议价" prop="" width="100" />
        <el-table-column align="center" label="我方报价" prop="" width="100" />
        <el-table-column align="center" label="备注" prop="remark" />
      </el-table>
      

      <pagination :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="handleCurrentChange">
        <div>
          <el-button type="danger" size="mini">
              <svg-icon @click="handleReturnOrder" disabled icon-class="returnOrder" class-name="btn_icon_svg"></svg-icon>&nbsp;退单
          </el-button>
          <el-button type="primary" icon="el-icon-check" size="mini">答复</el-button>
          <el-tooltip class="item" @click="handleRefresh" effect="dark" content="刷新" placement="top">
              <el-button size="mini" circle icon="el-icon-refresh"/>
          </el-tooltip>
        </div>
    </pagination>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: "intentionOrder",
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
        selectOptions: [
          {
            value: 0,
            label: '未税价'
          }, 
          {
            value: 1,
            label: '含税价'
          }
        ],
    };
  },
  computed:{
      ...mapGetters(['screen_height', 'token'])
  },
  created(){
  },
  methods:{
    changeOrderType(){},
    handleSelectionChange(){

    },
    handleCurrentChange(){

    },
    handleQuery(){
    },
    handleReturnOrder(){},
    handleRefresh(){},
    resetQuery(){}
  }
};
</script>

<style lang="scss">
.intentionOrder {
    .table_tip {
        font-size: 14px;
        color: #515a6e;
    }
}
</style>