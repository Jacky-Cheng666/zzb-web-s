<template>
  <div class="app-container purchaseOrder">
      <fieldset class="field">
          <legend>订单信息：</legend>
          <div class="order_basic_info">
              <div class="title mb12">深圳市智造帮科技有限公司-采购订单</div>
              <div class="mb12 f14">
                  <span class="mr20">订单类型：销售</span>
                  <span class="mr20">结款方式：销售</span>
                  <span class="mr20">发票税率：销售</span>
                  <span>账本：销售</span>
              </div>
              <div class="company_name mb12 f14">供应商名称：深圳市阿里云科技有限公司</div>
              <div class="mb12 f14">
                  <span class="mr20">订单号：PO210115171738</span>
                  <span class="mr20">采购人：张若军</span>
                  <span class="mr20">下单时间：2021-01-06 09:12:00</span>
                  <span class="mr20">协议交货日期：2021-01-06</span>
              </div>
              <div class="f14">
                  <span>付款计划：</span>
                  <el-tooltip placement="top" content="点击查看付款计划">
                      <svg-icon iconClass="eye-open" style="font-size:16px;color:#3894FF;cursor:pointer"></svg-icon>
                  </el-tooltip>
                  <span class="ml20">收货地址：</span>
                  <el-tooltip placement="top" content="点击查看收货地址">
                      <svg-icon iconClass="receiving_address" style="font-size:18px;color:#3894FF;cursor:pointer"></svg-icon>
                  </el-tooltip>
              </div>
              <el-tag class="tag" type="success">已收迄</el-tag>
          </div>
      </fieldset>
      <el-form v-show="showSearch" :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item>
              <el-input v-model="queryParams.inputValue" placeholder="输入关键字" clearable size="small" style="width: 180px" @keyup.enter.native="handleQuery"/>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>

          <el-form-item style="float:right">
                <span class="table_tip">订单说明：这是一个订单样板原型</span>
          </el-form-item>
      </el-form>


      <el-table class="mb8" height="490" v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="50" />
        <el-table-column align="center" label="名称" prop="element_name" width="200" />
        <el-table-column align="center" label="型号" prop="spec_code" width="300" />
        <el-table-column align="center" label="品牌" prop="brand" width="100" />
        <el-table-column align="center" label="单位" prop="unit" width="60" />
        <el-table-column align="center" label="成交数量" prop="num" width="80" />
        <el-table-column align="center" label="已收数量" prop="num" width="80" />
        <el-table-column align="center" label="待收数量" prop="num" width="100" />
        <el-table-column align="center" label="备注" prop="remark" />
      </el-table>

      <pagination :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="handleCurrentChange">
        <div>
            <!-- <el-button type="primary" size="mini">
                <svg-icon icon-class="receive" class-name="btn_icon_svg"/>&nbsp;收货
            </el-button>
            <el-button type="warning" icon="el-icon-printer" size="mini">打印发货单</el-button>
            <el-button type="warning" icon="el-icon-printer" size="mini">打印物料卡</el-button> -->
            <el-button type="danger" size="mini">
                <svg-icon icon-class="returnOrder" class-name="btn_icon_svg"></svg-icon>&nbsp;退单
            </el-button>
            <el-button type="info" icon="el-icon-download" size="mini">导出</el-button>
            <el-tooltip class="item" effect="dark" content="刷新" placement="top">
                <el-button size="mini" circle icon="el-icon-refresh"/>
            </el-tooltip>
        </div>
    </pagination>
  </div>
</template>

<script>
export default {
  name: "purchaseOrder",
  data() {
    return {
        showSearch: true,
        queryParams: {
            pageNum: 1,
            pageSize: 100
        },
        getPayDemandList(){},
        loading: false,
        tableData: [],
        handleQuery(){},
        resetQuery(){},
        handleSelectionChange(){},
        handleCurrentChange(){}
    };
  },
};
</script>

<style lang="scss" scoped>
.purchaseOrder {
    .table_tip {
        font-size: 14px;
        color: #515a6e;
    }
}
</style>