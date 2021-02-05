<template>
  <div class="app-container synergyOfferPrice">
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
      <svg-icon iconClass="tip" class="mr5" style="font-size:18px;display:inline-block"></svg-icon>
      <span class="table_tip">点击“客户物料型号”可以查看图纸。</span>

      <right-toolbar :showSearch.sync="showSearch" @queryTable="getPayDemandList"></right-toolbar>
    </el-row>


    <el-table height="700" v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column align="center" label="客户物料名称" prop="guest_element_name" width="300"/>
      <el-table-column align="center" label="客户物料型号" prop="guest_spec_code" width="340" />
      <el-table-column align="center" label="品牌" prop="brand" width="140" />
      <el-table-column align="center" label="单位" prop="unit" width="80" />
      <el-table-column align="center" label="数量" prop="num" width="100" />
      <el-table-column align="center" label="未税报价" prop="price" width="120" />
      <el-table-column align="center" label="含税报价" prop="" width="120" />
      <el-table-column align="center" label="最近未税报价" prop="" width="120" />
      <el-table-column align="center" label="最近未税成交" prop="" width="120" />
      <el-table-column align="center" label="操作">
        <template>
          <el-button size="mini" type="text"><svg-icon icon-class="connect" class-name="connect-icon"></svg-icon>&nbsp;关联</el-button>
          <el-button size="mini" type="text"><svg-icon icon-class="return"></svg-icon>&nbsp;退回</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="handleCurrentChange">
      <div>
        <el-select v-model="queryParams.tax_name" size="mini" style="width: 80px;margin-right:10px">
          <el-option label="普票" value="all"></el-option>
          <el-option label="1%" value="notVoice"></el-option>
          <el-option label="6%" value="invoiced"></el-option>
        </el-select>
        
        <el-switch style="margin-right:10px" v-model="value1" active-text="报未税价" inactive-text="报含税价"></el-switch>  
        
        <el-button type="success" icon="el-icon-check" size="mini">报价</el-button>
        <el-button type="success" icon="el-icon-folder-add" size="mini">保存</el-button>
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
  name: 'synergyOfferPrice',
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
      tableData: [{guest_element_name: "特斯拉汽车",guest_spec_code:"Model 3 高配版 红色"}],
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
      checked: false,
      value1: true
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
.synergyOfferPrice{
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