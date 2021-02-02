<template>
  <div class="app-container receiveManage">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item label="关键字">
        <el-input
          v-model="queryParams.inputValue"
          placeholder="输入关键字"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="选择账本">
        <el-select v-model="queryParams.selectStatus" size="small" style="width: 102px">
          <el-option label="默认账本" value="all"></el-option>
          <el-option label="账本1" value="notVoice"></el-option>
          <el-option label="账本4" value="invoiced"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8 mt20">
      <el-col :span="12">
       <svg-icon iconClass="tip" class="mr5" style="font-size:18px;"></svg-icon>
       <span class="f14">点击“订单号”可以进入订单页。</span>
      </el-col>
      
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getPayDemandList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column align="center" label="订单号" prop="order_name" width="140">
        <template slot-scope="scope">
          <router-link :to="'/purchaseManage/purchaseOrder/'+scope.row.order_name">
            <el-link :underline="false" type="primary">{{scope.row.order_name}}</el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column align="center" label="供应商名称" prop="receive_side_name" width="240" />
      <el-table-column align="center" label="销售人" prop="saler" width="80" />
      <el-table-column align="center" label="协议交期" width="100"></el-table-column>
      <el-table-column align="center" label="收货地址" prop="total_money_with_tax"/>
      <el-table-column align="center" label="收货人" prop="receiver" width="80" />
      <el-table-column align="center" label="采购人" prop="purchaser" width="80" />
      <el-table-column align="center" label="下单日期" width="100"></el-table-column>
    </el-table>

    <pagination
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="handleCurrentChange"
    />

    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :custom-style="myBackToTopStyle" :visibility-height="300" :back-position="0" transition-name="fade" />
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: "receiveManage",
  data() {
    return {
      myBackToTopStyle: {
        right: '50px',
        bottom: '70px',
        width: '40px',
        height: '40px',
        'border-radius': '4px',
        'line-height': '45px', // Please keep consistent with height to center vertically
        background: '#e7eaf1'//  The background color of the button
      },
      queryParams:{
        inputValue: '',
        selectStatus: 'all'
      },
      showSearch: true,
      loading: false,
      tableData: [{order_name:"PO210115171738"},{order_name:"PO222222222"},{order_name:"PO33333333"}],
      total: 0,
      allRows: [],
    };
  },
  methods: {
    handleQuery(){},
    resetQuery(){},
    handleSelectionChange(){},
    getPayDemandList(){},
    handleCurrentChange(){}
  },
};
</script>

<style lang="scss" scoped>
</style>