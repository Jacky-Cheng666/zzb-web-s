<template>
  <div class="app-container saleRecords">
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
      <el-form-item label="付款状态">
        <el-select v-model="queryParams.pay_period" size="small" style="width: 102px">
          <el-option label="全部" value="全部"></el-option>
          <el-option label="预付" value="预付"></el-option>
          <el-option label="到付" value="到付"></el-option>
          <el-option label="月结" value="月结"></el-option>
          <el-option label="自建" value="自建"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="退单状态">
        <el-select v-model="queryParams.invoiceStatus" size="small" style="width: 102px">
          <el-option label="全部" value="all"></el-option>
          <el-option label="未开票" value="notVoice"></el-option>
          <el-option label="已开票" value="invoiced"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日期范围">
        <el-date-picker size="small" v-model="value2" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"></el-date-picker>
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
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-circle-check" size="mini">所有页全选</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" icon="el-icon-download" size="mini">批量下载附件</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" icon="el-icon-download" size="mini">导出</el-button>
      </el-col>
      
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getPayDemandList"></right-toolbar>
    </el-row>
    <div class="table_tip">
      <div>
        <!-- <i class="el-icon-chat-line-square" style="color:#3894FF;font-size:16px"></i> -->
        <svg-icon iconClass="tip" class="mr5" style="font-size:18px;"></svg-icon>
        点击“订单号”可以查看订单详情，点击“附件”可以打印订单。
      </div>
      <div>
        <span class="mr10">
          <svg-icon style="color:#3894FF;font-size:16px;margin-right:4px" icon-class="pdf" />订单正常
        </span>
        <span class="mr10">
          <svg-icon style="color:#E34348;font-size:16px;margin-right:4px" icon-class="pdf" />部分退单
        </span>
        <span>
          <svg-icon style="color:#2A292F;font-size:16px;margin-right:4px" icon-class="pdf" />全部退单或无效
        </span>
      </div>
    </div>
    <el-table v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column align="center" label="订单号" prop="order_name" width="160">
        <template slot-scope="scope">
          <router-link :to="'/saleManage/saleOrder/'+scope.row.order_name">
            <el-link :underline="false" type="primary">{{scope.row.order_name}}</el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column align="center" label="客户名称" prop="purchase_name" />
      <el-table-column align="center" label="客户订单号" prop="receive_side_name" />
      <el-table-column align="center" label="总金额" prop="total_money_with_tax" width="120" />
      <el-table-column align="center" label="收款" prop="" width="120" />
      <el-table-column align="center" label="销售人" prop="saler" width="100" />
      <el-table-column align="center" label="下单时间" width="200"></el-table-column>
      <el-table-column align="center" label="附件" width="60">
        <template>
          <svg-icon style="color:#3894FF;font-size:16px;cursor:pointer" icon-class="pdf" />
        </template>
      </el-table-column>
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
  name: 'saleRecords',
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
      tableData: [{order_name:"PO210115171738"},{order_name:"PO222222222"},{order_name:"PO33333333"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},],
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
.saleRecords{
  
}
</style>