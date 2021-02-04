<template>
  <div class="app-container AskPriceOrder">
      <fieldset class="field">
          <legend>订单信息：</legend>
          <div class="order_basic_info">
              <div class="title mb12">深圳市智造帮科技有限公司-询价单</div>
              <div class="mb12 f14">
                  <span class="mr20">订单类型：销售</span>
                  <span class="mr20">结款方式：预付</span>
                  <span class="mr20">发票税率：普票</span>
                  <span>账本：默认账本</span>
              </div>
              <div class="mb12 f14">
                  <span class="mr20">客户名称：深圳市阿里云科技有限公司</span>
              </div>
              <div class="mb12 f14">
                 <span class="mr20">询价单号：EO210129113843</span>
                 <span class="mr20">销售人：陈道明</span>
                 <span class="mr20">询价时间：2021-01-06 09:23:37</span>
                 <span class="mr20">截至时间：2021-01-06 09:23:37</span>
              </div>
              <el-tag class="tag" type="success">待审批</el-tag>
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
      </el-form>

      <el-row :gutter="10" class="mb8">
        <el-col :span="12">
            <span class="f14 table_tip">询价单说明：这是一个xxxxxxx</span>
        </el-col>

        <right-toolbar :showSearch.sync="showSearch" @queryTable="getPayDemandList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="50" />
        <el-table-column align="center" label="客户物料名称" prop="guest_element_name" width="300" />
        <el-table-column align="center" label="客户物料型号" prop="guest_spec_code" width="300" />
        <el-table-column align="center" label="品牌" prop="brand" width="100" />
        <el-table-column align="center" label="单位" prop="unit" width="60" />
        <el-table-column align="center" label="数量" prop="num" width="100" />
        <el-table-column align="center" label="未税报价" prop="" width="130" />
        <el-table-column align="center" label="含税报价" prop="" width="130" />
        <el-table-column align="center" label="最近未税报价" prop="" width="130" />
        <el-table-column align="center" label="最近未税成交" prop="" width="130" />
        <el-table-column align="center" label="操作">
            <template>
                <el-button style="color:#E34348" size="mini" icon="el-icon-circle-close" type="text">不报</el-button>
            </template>
        </el-table-column>
      </el-table>

      <pagination :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="handleCurrentChange">
        <div>
            <el-switch style="margin-right:10px" v-model="value1" active-text="报未税价" inactive-text="报含税价"></el-switch>
            <el-button type="info" icon="el-icon-upload2" size="mini">导入</el-button>
            <el-button type="info" icon="el-icon-download" size="mini">导出</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">不报价</el-button>
            <el-button type="success" icon="el-icon-check" size="mini">已报价</el-button>
        </div>
    </pagination>
  </div>
</template>

<script>
export default {
  name: "AskPriceOrder",
  data() {
    return {
        showSearch: true,
        queryParams: {},
        value1: true,
        total: 0,
        loading: false,
        tableData: [{guest_element_name:"特斯拉汽车Model3"}],
        
    };
  },
  methods: {
      getPayDemandList(){},
      handleQuery(){},
      resetQuery(){},
      handleSelectionChange(){},
      handleCurrentChange(){}
  },
};
</script>

<style>
</style>