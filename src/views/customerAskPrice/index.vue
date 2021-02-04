<template>
  <div class="app-container customerAskPrice">
    <el-form class="mb20" :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item label="关键字">
        <el-input v-model="queryParams.inputValue" placeholder="输入关键字" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="未命名">
        <el-select v-model="queryParams.selectStatus" size="small" style="width: 160px">
          <el-option label="全部询价单" value="all"></el-option>
          <el-option label="账本1" value="notVoice"></el-option>
          <el-option label="账本4" value="invoiced"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客户">
        <el-select v-model="queryParams.selectStatus" size="small" style="width: 240px">
          <el-option label="全部客户" value="all"></el-option>
          <el-option label="账本1" value="notVoice"></el-option>
          <el-option label="账本4" value="invoiced"></el-option>
        </el-select>
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
          <el-option label="未报价" value="notSubmit"></el-option>
          <el-option label="已报价" value="toBeApprove"></el-option>
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
       <span class="f14 table_tip">点击“询价单号”可以查看询价单详情。</span>
      </el-col>

      <right-toolbar :showSearch.sync="showSearch" @queryTable="getPayDemandList"></right-toolbar>
    </el-row>


    <el-table height="660" v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column align="center" label="询价单号" prop="order_name" width="140">
          <template slot-scope="scope">
              <router-link :to="'/saleManage/synergyOrderManage/AskPriceOrder/'+scope.row.order_name">
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
      <el-table-column align="center" label="操作" width="80">
        <template>
          <el-button size="mini" type="text"><svg-icon icon-class="return"></svg-icon>&nbsp;退回</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="handleCurrentChange">
        <div>
            <el-button type="danger" icon="el-icon-circle-close" size="mini">不报价</el-button>
            <el-button type="success" icon="el-icon-circle-check" size="mini">已报价</el-button>
        </div>
    </pagination>


    <!-- you can add element-ui's tooltip -->
    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :custom-style="myBackToTopStyle" :visibility-height="300" :back-position="0" transition-name="fade" />
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'customerAskPrice',
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
      tableData: [{order_name: "PO11234455",guest_spec_code:"Model 3 高配版 红色"}],
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