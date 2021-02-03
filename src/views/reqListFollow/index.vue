<template>
  <div class="app-container reqListFollow">
    <el-form class="mb20" :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item label="关键字">
        <el-input v-model="queryParams.inputValue" placeholder="输入关键字" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="选择账本">
        <el-select v-model="queryParams.selectStatus" size="small" style="width: 102px">
          <el-option label="默认账本" value="all"></el-option>
          <el-option label="账本1" value="notVoice"></el-option>
          <el-option label="账本4" value="invoiced"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryParams.invoiceStatus" size="small" style="width: 102px">
          <el-option label="全部" value="all"></el-option>
          <el-option label="未提交" value="notSubmit"></el-option>
          <el-option label="待审批" value="toBeApprove"></el-option>
          <el-option label="已退回" value="alreadyReturn"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <svg-icon iconClass="tip" class="mr5" style="font-size:18px;display:inline-block"></svg-icon>
      <span class="table_tip">点击“请购单号”可以查看请购单详情。</span>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getPayDemandList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column align="center" label="请购单号" prop="request_name" width="140">
        <template slot-scope="scope">
          <router-link :to="'/purchaseManage/requestOrder/'+scope.row.request_name">
            <el-link :underline="false" type="primary">{{scope.row.request_name}}</el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column align="center" label="需求人" prop="demander" width="80" />
      <el-table-column align="center" label="请购人" prop="requester" width="80" />
      <el-table-column align="center" label="部门" prop="department" width="120" />
      <el-table-column align="center" label="项目" prop="task_code" width="160" />
      <el-table-column align="center" label="请购时间" prop="request_time" width="160"></el-table-column>
      <el-table-column align="center" label="状态" prop="status" width="80" />
      <el-table-column align="center" label="用途" prop="use_type" width="120" />
      <el-table-column align="center" label="备注" prop="remark" />
    </el-table>

    <pagination
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="handleCurrentChange"
    />

    <!-- you can add element-ui's tooltip -->
    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :custom-style="myBackToTopStyle" :visibility-height="300" :back-position="0" transition-name="fade" />
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'reqListFollow',
  data() {
    return {
      myBackToTopStyle: {
        right: '70px',
        bottom: '70px',
        width: '40px',
        height: '40px',
        'border-radius': '4px',
        'line-height': '45px', // Please keep consistent with height to center vertically
        background: '#e7eaf1'//  The background color of the button
      },
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
      tableData: [{request_name: "RQ144415422"}],
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
.reqListFollow{
  .table_tip{
    font-size: 14px;
    color: #515a6e;
  }
}
</style>