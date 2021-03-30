<template>
  <div class="app-container synergyOfferPrice">
    <el-form class="mb10" :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
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

    <el-row class="mb8">
      <svg-icon iconClass="tip" class="mr5" style="font-size:18px;display:inline-block"></svg-icon>
      <span class="table_tip">点击“客户物料型号”可以查看图纸。</span>

      <el-radio-group style="float:right;margin-top:8px;" v-model="queryParams.value">
        <el-radio label="0">全部</el-radio>
        <el-radio label="1">未报价</el-radio>
        <el-radio label="2">已报价</el-radio>
      </el-radio-group>

      <el-radio-group style="float:right;margin-top:8px;margin-right:20px" v-model="queryParams.value">
        <el-radio label="1">未税价</el-radio>
        <el-radio label="2">含税价</el-radio>
      </el-radio-group>
    </el-row>


    <el-table class="mb8" :height="screen_height - 350" v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column align="center" label="客户物料名称" prop="guest_element_name" />
      <el-table-column align="center" label="客户物料型号" prop="guest_spec_code" width="340" />
      <el-table-column align="center" label="品牌" prop="brand" width="140" />
      <el-table-column align="center" label="单位" prop="unit" width="80" />
      <el-table-column align="center" label="数量" prop="num" width="100" />
      <el-table-column align="center" label="未税报价" prop="price" width="120" />
      <el-table-column align="center" label="含税报价" prop="" width="120" />
      <el-table-column align="center" label="最近未税报价" prop="" width="120" />
      <el-table-column align="center" label="最近未税成交" prop="" width="120" />
      <el-table-column align="center" label="操作" width="120">
        <template>
          <el-button size="mini" type="text"><svg-icon icon-class="connect" class-name="btn_icon_svg"></svg-icon>&nbsp;关联</el-button>
          <el-button size="mini" type="text"><svg-icon icon-class="return" class-name="btn_icon_svg"></svg-icon>&nbsp;退回</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="handleCurrentChange">
      <div>
        <el-select placeholder="税率" v-model="queryParams.tax_name" size="mini" style="width: 80px;margin-right:10px">
          <el-option label="普票" value="all"></el-option>
          <el-option label="1%" value="notVoice"></el-option>
          <el-option label="6%" value="invoiced"></el-option>
        </el-select>
        
        <el-button type="success" icon="el-icon-check" size="mini">报价</el-button>
        <el-button type="success" size="mini">
          <svg-icon icon-class="save" class-name="btn_icon_svg" />&nbsp;保存
        </el-button>
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
  name: 'synergyOfferPrice',
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
.synergyOfferPrice{
  .table_tip{
    font-size: 14px;
    color: #515a6e;
  }
}
</style>