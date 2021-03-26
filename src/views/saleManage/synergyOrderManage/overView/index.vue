<template>
  <div class="app-container intentionOrder">
    <el-form class="mb10" :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item>
        <el-input v-model="queryParams.searchInputValue" placeholder="输入关键字" clearable size="small" style="width: 180px" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-select style="width: 100px;" size="small"  v-model="queryParams.valueBookType" @change="changeBookType" placeholder="请选择">
          <el-option
            v-for="item in booksTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select style="width: 120px;" size="small" @change="changeOrderType" v-model="queryParams.valueOrderType" placeholder="请选择">
          <el-option
            v-for="item in ordersTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <svg-icon iconClass="tip" class="mr5" style="font-size:18px;display:inline-block"></svg-icon>
      <span class="table_tip">点击“订单号”可以查看意向订单详情。</span>
    </el-row>

    
    <el-table class="mb8" :height="screen_height-350" v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column align="center" label="订单号" prop="request_name" width="140">
        <template slot-scope="scope">
          <router-link to="/saleManage/synergyOrderManage/intentionOrder">
            <el-link :underline="false" type="primary">{{scope.row.order_name}}</el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column align="center" label="客户" prop="purchase_full_name" width="240" />
      <el-table-column align="center" label="客户订单号" prop="guest_order_name" width="180" />
      <el-table-column align="center" label="销售人" prop="seller" width="80" />
      <el-table-column align="center" label="类型" prop="order_use_name" width="60" />
      <el-table-column align="center" label="结款" prop="pay_period_name" width="60" />
      <el-table-column align="center" label="金额" prop="total_price" width="100" />
      <el-table-column align="center" label="交期" prop="" width="100"></el-table-column>
      <el-table-column align="center" label="备注" prop="remark" />
    </el-table>

    <pagination :total="total" :page.sync="queryParams.currentPage" :limit.sync="queryParams.pageSize" @pagination="handleCurrentChange">
      <el-tooltip class="item" effect="dark" content="刷新" placement="top">
          <el-button size="mini" @click="handleRefresh" circle icon="el-icon-refresh"/>
      </el-tooltip>
    </pagination>
  </div>
</template>

<script>
import { getAllIntentionOrder } from '@/api/saleManage'

import { mapGetters } from 'vuex'

import common from '@/utils/common'

export default {
  name: 'intentionOrder',
  data() {
    return {
      queryParams: {
        searchInputValue: "",
        valueBookType: 0,
        valueOrderType: 0,
        count: 0,
        currentPage: 1,
        pageSize: 100,
        filterList: []
      },
      showSearch: true,
      loading: false,
      // tableData: [{request_name: "IO144415422"}],
      tableData: [],
      total: 0,
      allRows: [],
      rows: [],
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
      //
      booksTypeOptions: [],
      ordersTypeOptions: [
        {
          value: 0,
          label: '全部订单'
        }, 
        {
          value: 1,
          label: '未答复'
        }, 
        {
          value: 2,
          label: '已答复'
        }, 
        {
          value: 3,
          label: '已退回'
        }
      ],
      multipleSelection: []
    }
  },
  computed: {
    ...mapGetters(['screen_height', 'token'])
  },
  created(){
    this.userInfo = JSON.parse(localStorage.getItem('profile'))
    this.userName = this.userInfo.name

    this.setSaleBasicInfo()

    this.handleRefresh()
  },
  methods: {
    filterTableData(){
      let tempList = [];
      this.allRows.forEach(item => {
        if(this.queryParams.valueBookType === item.financial_book_no){
          tempList.push(item)
        }
      })
      
      let list = []
      if (0 < this.valueOrderType) {
        tempList.forEach(item => {
          if (1 === this.valueOrderType && (!item.answer_price_person || !item.answer_delivery_person)) {
            list.push(item);
          }

          if (2 === this.valueOrderType && (item.answer_price_person || item.answer_delivery_person)) {
            list.push(item);
          }
          
          if (3 === this.valueOrderType && item.is_reject) {
            list.push(item);
          }
        });
      } else {
        list = tempList;
      }

      this.queryParams.filterList = list
    },
    handleQuery(){
      this.filterTableData()
      this.localSearchInfo()
    },
    localSearchInfo(){
      let that = this
      common.handleSearchInfo(that, 1, this.queryParams.searchInputValue, this.queryParams.filterList)
    },
    resetQuery(){
      this.queryParams.searchInputValue = ''
      this.queryParams.valueBookType = 0
      this.queryParams.valueOrderType = 0
      this.handleQuery()
    },
    handleSelectionChange(val){
      this.multipleSelection = val
    },
    handleCurrentChange(){

    },
    viewSalesOrder(row){
      this.$router.push('/saleManage/saleOrder'+row.order_name)
    },
    //
    //账本
    changeBookType(val){
      // this.valueBookType = val
      // this.isTableChange = true
    },
    //筛选订单类型
    changeOrderType(val){
      // this.valueOrderType = val
      // this.changeRefresh()
    },
    handleRefresh(){
      getAllIntentionOrder({
        access_token: this.token,
        filter: '全部'
      }).then(response => {
        if (response.code == 0){
          // this.valueOrderType = 0
          this.searchInputValue = ''

          this.allRows = response.order_list
          this.handleQuery()
        }
      })
    },
    setSaleBasicInfo(){
      let tmpInfo = JSON.parse(localStorage.getItem("saleBasicInfo"))
      let userInfo = JSON.parse(localStorage.getItem('org'))

      //账本
      let tmpBookTypeList = tmpInfo.financial_book_list
      tmpBookTypeList.forEach(item => {
        this.booksTypeOptions.push(
          {
            value: item.financial_book_no,
            label: item.financial_book_name
          }
        )
      })
      if(this.booksTypeOptions.length){
        this.queryParams.valueBookType = this.booksTypeOptions[0].value
      }
    },
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