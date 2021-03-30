<template>
  <div class="app-container customerAskPrice">
    <el-form class="mb10" :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item>
        <el-input v-model="queryParams.inputValue" placeholder="输入关键字" clearable size="small" style="width: 180px" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryParams.selectStatus" size="small" style="width: 160px">
          <el-option label="全部询价单" value="all"></el-option>
          <el-option label="账本1" value="notVoice"></el-option>
          <el-option label="账本4" value="invoiced"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryParams.selectStatus" size="small" style="width: 240px">
          <el-option label="全部客户" value="all"></el-option>
          <el-option label="账本1" value="notVoice"></el-option>
          <el-option label="账本4" value="invoiced"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryParams.selectStatus" size="small" style="width: 120px">
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

    <el-row class="mb8">
      <svg-icon iconClass="tip" class="mr5" style="font-size:18px;" />
      <span class="f14 table_tip">点击“询价单号”可以查看询价单详情。</span>
      <el-radio-group style="float:right;margin-top:8px" v-model="queryParams.invoiceStatus">
        <el-radio :label="0">全部</el-radio>
        <el-radio :label="1">未报价</el-radio>
        <el-radio :label="2">已报价</el-radio>
      </el-radio-group>
    </el-row>


    <el-table class="mb8" :height="screen_height-350" v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column align="center" label="询价单号" prop="order_name" width="140">
          <template slot-scope="scope">
              <router-link :to="'/saleManage/customerAskPrice/AskPriceOrder/'+scope.row.order_name">
                <el-link :underline="false" type="primary">{{scope.row.order_name}}</el-link>
              </router-link>
          </template>
      </el-table-column>
      <el-table-column align="center" label="客户名称" prop="guest_spec_code" />
      <el-table-column align="center" label="询价时间" prop="brand" width="160" />
      <el-table-column align="center" label="截至时间" prop="unit" width="160" />
      <el-table-column align="center" label="类型" prop="type" width="80" />
      <el-table-column align="center" label="结款" prop="period" width="80" />
      <el-table-column align="center" label="销售人" prop="saler" width="80" />
      <el-table-column align="center" label="报价时间" prop="" width="160" />
      <el-table-column align="center" label="操作" width="60">
        <template>
          <el-button class="text-danger" icon="el-icon-delete" size="mini" type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="handleCurrentChange">
      <el-button style="margin-right: 10px" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
      <router-link to="/saleManage/customerAskPrice/batCreateOrder">
        <el-button type="primary" icon="el-icon-plus" size="mini">批量新建</el-button>
      </router-link>
      <router-link to="/saleManage/customerAskPrice/newAskPrice">
        <el-button style="margin:0 10px"  type="primary" icon="el-icon-plus" size="mini">新建</el-button>
      </router-link>
      <el-tooltip class="item" effect="dark" content="刷新" placement="top">
          <el-button size="mini" circle icon="el-icon-refresh"/>
      </el-tooltip>
    </pagination>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'customerAskPrice',
  data() {
    return {
      queryParams: {
        inputValue: "",
        invoiceStatus: 0,
        selectStatus: "all",
        pageNum: 1,
        pageSize: 100,
      },
      loading: false,
      tableData: [{order_name: "PO11234455",guest_spec_code:"Model 3"}],
      total: 0,
      allRows: [],
      value2:[],
    }
  },
  computed: {
    ...mapGetters(['screen_height'])
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
.customerAskPrice{
  .table_tip{
    font-size: 14px;
    color: #515a6e;
  }
  .connect-icon{
    // font-size: 16px;
    // color: red;
  }
}
</style>