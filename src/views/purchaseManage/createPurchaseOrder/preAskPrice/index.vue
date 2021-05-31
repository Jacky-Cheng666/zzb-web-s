<template>
  <div class="app-container preAskPrice">
    <el-form class="mb10" :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item prop="inputValue">
        <el-input v-model="queryParams.inputValue" placeholder="输入关键字" clearable size="small" style="width: 180px" @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item prop="invoiceStatus">
        <el-select v-model="queryParams.invoiceStatus" size="small" style="width: 100px">
          <el-option label="全部" value="all"></el-option>
          <el-option label="未提交" value="notSubmit"></el-option>
          <el-option label="待审批" value="toBeApprove"></el-option>
          <el-option label="已退回" value="alreadyReturn"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="invoiceStatus">
        <el-select v-model="queryParams.invoiceStatus" size="small" style="width: 160px">
          <el-option label="全部" value="all"></el-option>
          <el-option label="未提交" value="notSubmit"></el-option>
          <el-option label="待审批" value="toBeApprove"></el-option>
          <el-option label="已退回" value="alreadyReturn"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="invoiceStatus">
        <el-select v-model="queryParams.invoiceStatus" size="small" style="width: 100px">
          <el-option label="全部" value="all"></el-option>
          <el-option label="未提交" value="notSubmit"></el-option>
          <el-option label="待审批" value="toBeApprove"></el-option>
          <el-option label="已退回" value="alreadyReturn"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="selectStatus">
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
    </el-form>

    <el-table class="mb8" :height="screen_height-350" v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column align="center" label="代码" prop="element_code" width="180" />
      <el-table-column sortable="custom" align="center" label="名称" prop="element_name" width="180" />
      <el-table-column sortable="custom" align="center" label="型号" prop="spec_code" width="240" />
      <el-table-column sortable="custom" align="center" label="品牌" prop="brand" width="100" />
      <el-table-column align="center" label="单位" prop="unit" width="60" />
      <el-table-column align="center" label="数量" prop="num" width="80" />
      <el-table-column sortable="custom" align="center" label="需求日期" prop="" width="100"></el-table-column>
      <el-table-column sortable="custom" align="center" label="项目" prop="task_code" width="160" />
      <el-table-column align="center" label="未税目标单价" prop="" width="100" />
      <el-table-column align="center" label="最近成交价" prop="" width="120" />
      <el-table-column sortable="custom" align="center" label="需求人" prop="" width="100" />
      <el-table-column align="center" label="备注" prop="remark" />
    </el-table>

    <pagination :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="handleCurrentChange">
      <div>
        <el-button size="mini" icon="el-icon-plus" type="primary">发布订单</el-button>
        <el-button size="mini" icon="el-icon-question" type="primary">询价</el-button>
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
  name: 'preAskPrice',
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
      loading: false,
      tableData: [],
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
.preAskPrice{
  .table_tip{
    font-size: 14px;
    color: #515a6e;
  }
}
</style>