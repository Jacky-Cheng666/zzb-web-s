<template>
  <div class="app-container reReturnOrder">
      <fieldset class="field">
          <div class="order_basic_info">
              <div class="title mb12">深圳市智造帮科技有限公司-退货单</div>
              <div class="mb12 f14">
                  <span class="mr20">退货单号：DR112233445633</span>
                  <span class="mr20">退货人：海棠朵朵</span>
                  <span class="mr20">手机：185944452144</span>
                  
              </div>
              <div class="mb12 f14">
                <span class="mr20">供应商名称：深圳市阿里云科技有限公司</span>
                
              </div>
              <div class="mb12 f14">
                  <span class="mr20">订单号：PO210115171738</span>
                  <span class="mr20">销售人：张若军</span>
                  <span class="mr20">退货时间：2021-01-06 09:12:00</span>
                  <span class="mr20">协议交货日期：2021-01-06</span>
              </div>
              <el-tag class="tag" type="success">已收迄</el-tag>
          </div>
      </fieldset>
      <el-form v-show="showSearch" :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="关键字">
              <el-input v-model="queryParams.inputValue" placeholder="输入关键字" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery"/>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>

          <el-form-item style="float:right;margin-right:0">
                <span class="table_tip">订单说明：这是一个订单样板原型</span>
          </el-form-item>
      </el-form>

      <el-table class="mb8" height="490" v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="50" />
        <el-table-column sortable align="center" label="名称" prop="element_name" width="200" />
        <el-table-column sortable align="center" label="型号" prop="spec_code" width="240" />
        <el-table-column sortable align="center" label="品牌" prop="brand" width="120" />
        <el-table-column align="center" label="单位" prop="unit" width="60" />
        <el-table-column align="center" label="成交数量" prop="num" width="100" />
        <el-table-column align="center" label="已发数量" prop="num" width="100" />
        <el-table-column align="center" label="退货数量" prop="num" width="100" />
        <el-table-column align="center" label="物料代码" prop="total_money_with_tax" width="100" />
        <el-table-column align="center" label="客户物料名称" prop="total_money_with_tax" width="100" />
        <el-table-column align="center" label="客户物料型号" prop="total_money_with_tax" width="100" />
        <el-table-column align="center" label="客户物料代码" prop="total_money_with_tax" width="100" />
        <el-table-column align="center" label="客户项目号" prop="total_money_with_tax" width="100" />
        <el-table-column align="center" label="备注" prop="remark" />
      </el-table>

      <pagination :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="handleCurrentChange">
        <div>
            <el-button type="warning" icon="el-icon-printer" size="mini">打印退货单</el-button>
            <el-button type="warning" icon="el-icon-printer" size="mini">打印物料卡</el-button>
            <el-button type="warning" size="mini">
                <svg-icon icon-class="reback" class-name="btn_icon_svg"></svg-icon>&nbsp;撤回退货
            </el-button>
            <el-tooltip class="item" effect="dark" content="刷新" placement="top">
                <el-button size="mini" circle icon="el-icon-refresh"/>
            </el-tooltip>
        </div>
    </pagination>
  </div>
</template>

<script>
export default {
  name: "reReturnOrder",
  data() {
    return {
        showSearch: true,
        queryParams: {
            pageNum: 1,
            pageSize: 100
        },
        total: 1000,
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

<style lang="scss">
.reReturnOrder {
    .table_tip {
        font-size: 14px;
        color: #515a6e;
    }
    .btn_icon_svg{
      width: 12px!important;
      height: 12px!important;
      margin-top: -4px!important;
    }
}
</style>