<template>
  <div class="app-container myRequestList">
    <el-form class="mb10" :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item>
        <el-input v-model="queryParams.inputValue" placeholder="输入关键字" clearable size="small" style="width: 180px" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="选择账本">
        <el-select v-model="queryParams.selectStatus" size="small" style="width: 100px">
          <el-option label="默认账本" value="all"></el-option>
          <el-option label="账本1" value="notVoice"></el-option>
          <el-option label="账本4" value="invoiced"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryParams.invoiceStatus" size="small" style="width: 100px">
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
      <el-col :span="12">
        <svg-icon iconClass="tip" class="mr5" style="font-size:18px;display:inline-block"></svg-icon>
        <span class="table_tip">点击“请购单号”可以查看请购单详情。</span>
      </el-col>
    </el-row>
    <el-table class="mb8" :height="screen_height-350" v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column align="center" label="请购单号" prop="request_name" width="140">
        <template slot-scope="scope">
          <router-link :to="'/purchaseManage/RequestOrderManage/requestOrder/'+scope.row.request_name">
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

    <pagination :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="handleCurrentChange">
      <div>
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
  name: 'myRequestList',
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
.myRequestList{
  .table_tip{
    font-size: 14px;
    color: #515a6e;
  }
}
</style>