<template>
  <div class="app-container requestOrder">
      <fieldset class="field">
          <legend>订单信息：</legend>
          <div class="order_basic_info">
              <div class="title mb12">深圳市智造帮科技有限公司-请购单</div>
              <div class="mb12 f14">
                  <span class="mr20">部门：信息技术部</span>
                  <span class="mr20">需求人：辛芷蕾</span>
                  <span class="mr20">用途：维修物料</span>
                  <span class="mr20">需求日期：2021-01-06</span>
                  <span>账本：销售</span>
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
              <div class="f14">
                 <span class="mr20">请购说明：这是一个请购单样板原型</span>
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

      <el-row :gutter="10" class="mb8 mt20">
        <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </el-col>
        <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
        </el-col>
        <el-col :span="1.5">
            <el-button type="success" icon="el-icon-check" size="mini">提交</el-button>
        </el-col>
        <el-col :span="1.5">
            <el-button type="warning" size="mini">
                <svg-icon icon-class="reback"></svg-icon>&nbsp;撤回
            </el-button>
        </el-col>

        <right-toolbar :showSearch.sync="showSearch" @queryTable="getPayDemandList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="50" />
        <el-table-column align="center" label="名称" prop="element_name" width="200" />
        <el-table-column align="center" label="型号" prop="spec_code" width="320" />
        <el-table-column align="center" label="品牌" prop="brand" width="120" />
        <el-table-column align="center" label="代码" prop="element_code" width="120" />
        <el-table-column align="center" label="单位" prop="unit" width="80" />
        <el-table-column align="center" label="数量" prop="num" width="100" />
        <el-table-column align="center" label="备注" prop="remark" />
      </el-table>
  </div>
</template>

<script>
export default {
  name: "requestOrder",
  data() {
    return {
        showSearch: true,
        queryParams: {},
        getPayDemandList(){},
        loading: false,
        tableData: [],
        handleQuery(){},
        resetQuery(){},
        handleSelectionChange(){}
    };
  },
};
</script>

<style>
</style>