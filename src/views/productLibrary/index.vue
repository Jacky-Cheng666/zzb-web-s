<template>
  <div class="app-container intentionOrder">
    <el-form class="mb10" :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item>
        <el-input v-model="queryParams.inputValue" placeholder="输入关键字" clearable size="small" style="width: 180px" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryParams.selectStatus" size="small" style="width: 100px">
          <el-option label="默认账本" value="all"></el-option>
          <el-option label="账本1" value="notVoice"></el-option>
          <el-option label="账本4" value="invoiced"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" type="text">产品首页</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <svg-icon iconClass="tip" class="mr5" style="font-size:18px;display:inline-block"></svg-icon>
      <span class="table_tip">点击“规格型号”可以。</span>
    </el-row>

    
    <el-table class="mb8" :height="screen_height-350" v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column align="center" label="名称" prop="element_name" width="180" />
      <el-table-column align="center" label="规格型号" prop="spec_code" width="240" />
      <el-table-column align="center" label="品牌" prop="brand" width="100" />
      <el-table-column align="center" label="单位" prop="unit" width="60" />
      <el-table-column align="center" label="属性" />
      <el-table-column align="center" label="操作" width="120">
        <template>
          <el-button size="mini" icon="el-icon-money" type="text">报价</el-button>
          <el-button size="mini" icon="el-icon-delete" type="text" style="color:#F56C6C">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="handleCurrentChange">
      <div>
        <el-button type="primary" icon="el-icon-plus" size="mini">新增产品</el-button>
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
  name: 'intentionOrder',
  data() {
    return {
      queryParams: {
        inputValue: "",
        pay_period: "全部",
        invoiceStatus: "all",
        selectStatus: "all",
        pageNum: 1,
        pageSize: 100,
      },
      showSearch: true,
      loading: false,
      tableData: [{request_name: "IO144415422"}],
      total: 0,
      allRows: [],
      value2:[],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      checked: false
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
    viewSalesOrder(row){
      this.$router.push('/saleManage/saleOrder'+row.order_name)
    }
  },

}
</script>

<style lang="scss" scoped>
.intentionOrder{
  .table_tip{
    font-size: 14px;
    color: #515a6e;
  }
}
</style>