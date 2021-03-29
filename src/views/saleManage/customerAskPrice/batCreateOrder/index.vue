<template>
  <div class="app-container batCreateOrder">
    <el-form class="mb10" :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item>
        <el-input v-model="queryParams.inputValue" placeholder="输入关键字" clearable size="small" style="width: 180px" @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item>
        <el-select v-model="queryParams.financial_book_no" size="small" style="width: 120px">
          <el-option :label="item.financial_book_name" :value="item.financial_book_no" v-for="item in financial_book_list" :key="item.financial_book_no" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="12">
       <svg-icon iconClass="tip" class="mr5" style="font-size:18px;"></svg-icon>
       <span class="f14 table_tip">若没有匹配上客户，请选择“客户名称”。只支持智造帮模板导入！</span>
      </el-col>

    </el-row>


    <el-table class="mb8" :height="screen_height-350" v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column align="center" label="客户名称" prop="purchaser_name" width="300"/>
      <el-table-column align="center" label="税率" prop="tax_name" width="100" />
      <el-table-column align="center" label="结算方式" prop="" width="100" />
      <el-table-column align="center" label="截至时间" prop="" width="200" />
      <el-table-column align="center" label="本地文件" prop="" />
      
      <el-table-column fixed="right" align="center" label="操作" width="120">
        <template>
          <el-button icon="el-icon-files" size="mini" type="text">选择</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="handleCurrentChange">
        
      <el-button type="info" icon="el-icon-download" size="mini">下载模板</el-button>
      <el-button type="info" icon="el-icon-upload2" size="mini">批量导入</el-button>
      <el-button type="success" icon="el-icon-check" size="mini">提交</el-button>
    </pagination>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'batCreateOrder',
  data() {
    return {
      queryParams: {
        inputValue: "",
        pay_period: "全部",
        invoiceStatus: "all",
        selectStatus: 4,
        pageNum: 1,
        pageSize: 100,
        financial_book_no: 0
      },
      showSearch: true,
      loading: false,
      tableData: [{order_name: "PO11234455",guest_spec_code:"Model 3"}],
      total: 0,
      allRows: [],
      timeOptions:[
        {label:"4小时有效",value:4},{label:"6小时有效",value:6},{label:"8小时有效",value:8},{label:"12小时有效",value: 12},{label:"24小时有效",value:24},{label:"48小时有效",value:48},{label:"72小时有效",value:72}
      ]
    }
  },
  computed: {
    ...mapGetters(['screen_height','token','tax_list','financial_book_list'])
  },
  methods: {
    handleQuery(){},
    resetQuery(){},
    getPayDemandList(){},
    handleSelectionChange(){},
    handleCurrentChange(){},
  },

}
</script>

<style lang="scss" scoped>
.batCreateOrder{
  .table_tip{
    font-size: 14px;
    color: #515a6e;
  }
}
</style>