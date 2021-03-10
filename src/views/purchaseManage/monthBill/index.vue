<template>
  <div class="app-container monthBill">
      <fieldset class="field">
          <div class="order_basic_info">
              <div class="title mb12">深圳市智造帮科技有限公司-对账单</div>
              <div class="mb12 f14">
                  <span class="mr20">订单类型：销售</span>
                  <span class="mr20">结款方式：销售</span>
                  <span class="mr20">发票税率：销售</span>
                  <span>账本：销售</span>
              </div>
              <div class="company_name mb12 f14">供应商名称：深圳市阿里云科技有限公司</div>
              <div class="mb12 f14">
                  <span class="mr20">周期：2021年02月</span>
                  <span class="mr20">对账日：2021-02-26</span>
                  <span class="mr20">未税金额：123456789</span>
                  <span class="mr20">税额：1654131</span>
                  <span class="mr20">税价合计：1654131</span>
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
              <span class="table_tip mr20">对账人：张若军</span>
              <span class="table_tip">对账时间：2020-01-12</span>
          </el-form-item>
      </el-form>


      <el-table class="mb8" :height="screen_height-470" v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="50" />
        <el-table-column align="center" label="名称" prop="element_name" />
        <el-table-column align="center" label="型号" prop="spec_code" width="300" />
        <el-table-column align="center" label="品牌" prop="brand" width="100" />
        <el-table-column align="center" label="单位" prop="unit" width="60" />
        <el-table-column align="center" label="入库数量" prop="inbound_num" width="80" />
        <el-table-column align="center" label="未税单价" prop="" width="120" />
        <el-table-column align="center" label="税率" prop="tax_name" width="60" />
        <el-table-column align="center" label="税价合计" prop="total_money_with_tax" width="120" />
        <el-table-column align="center" label="订单号" prop="order_name" width="140" />
        <el-table-column align="center" label="入库单号" prop="order_name" width="140" />
      </el-table>

      <pagination :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="handleCurrentChange">
        <div>
            <el-button type="success" icon="el-icon-check" size="mini">代理对账</el-button>
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
  name: "monthBill",
  data() {
    return {
        showSearch: true,
        queryParams: {
            pageNum: 1,
            pageSize: 100
        },
        total: 0,
        getPayDemandList(){},
        loading: false,
        tableData: [],
        handleQuery(){},
        resetQuery(){},
        handleSelectionChange(){},
        handleCurrentChange(){}
    };
  },
  computed: {
    ...mapGetters(['screen_height'])
  }
};
</script>

<style lang="scss" scoped>
.monthBill {
    .table_tip {
        font-size: 14px;
        color: #515a6e;
    }
}
</style>