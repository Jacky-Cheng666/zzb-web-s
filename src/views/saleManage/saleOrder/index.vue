<template>
  <div class="app-container saleOrder">
    <fieldset class="field">
      <div class="order_basic_info">
        <div class="title mb12">深圳市智造帮科技有限公司-销售订单</div>
        <div class="mb12 f14">
          <span class="mr20">订单类型：{{ orderInfo.order_type }}</span>
          <span class="mr20">结款方式：{{ orderInfo.pay_period_name }}</span>
          <span class="mr20">发票税率：{{ orderInfo.tax_name }}</span>
          <span>账本：{{ financialBookName }}</span>
        </div>
        <div class="company_name mb12 f14">客户名称：{{ orderInfo.purchase_full_name }}</div>
        <div class="mb12 f14">
          <span class="mr20">订单号：{{ orderInfo.order_name }}</span>
          <span class="mr20">销售人：{{ orderInfo.seller }}</span>
          <span class="mr20">下单时间：{{ orderTime }}</span>
          <span class="mr20">协议交货日期：{{ deliveryTime }}</span>
        </div>
        <div class="f14">
          <span>结款计划：</span>
          <el-tooltip placement="top" content="点击查看结款计划">
            <svg-icon iconClass="eye-open" style="font-size:16px;color:#3894FF;cursor:pointer"></svg-icon>
          </el-tooltip>
          <span class="ml20">收货地址：</span>
          <el-tooltip placement="top" content="点击查看收货地址">
            <svg-icon iconClass="receiving_address" style="font-size:18px;color:#3894FF;cursor:pointer"></svg-icon>
          </el-tooltip>
        </div>
        <el-tag v-if="orderInfo.payment_over" class="tag" type="success">已收迄</el-tag>
        <el-tag v-else-if="!orderInfo.payment_over" class="tag" type="info">未收迄</el-tag>
        <el-tag v-else class="tag" type="info">无效</el-tag>
      </div>
    </fieldset>
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item>
          <el-input v-model="queryParams.searchInputValue" placeholder="输入关键字" clearable size="small" style="width: 180px" @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <!-- <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button> -->
        </el-form-item>

        <el-form-item style="float:right;margin-right:0">
          <span class="mr20 table_tip">客户订单号：{{ orderInfo.guest_order_name ? orderInfo.guest_order_name : '无' }}</span>
          <span class="table_tip">订单说明：{{ orderInfo.order_describe ? orderInfo.order_describe : '无' }}</span>
        </el-form-item>
      </el-form>

        
      <el-table class="mb8" ref="multipleTable" :height="screen_height-470" v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="50" />
        <el-table-column align="center" label="名称" prop="element_info.element_name" width="180" />
        <el-table-column align="center" label="型号" prop="element_info.spec_code" width="240" />
        <el-table-column align="center" label="品牌" prop="element_info.brand" width="100" />
        <el-table-column align="center" label="单位" prop="element_info.unit" width="60" />
        <el-table-column align="center" label="下单数量" prop="buy_info.num" width="80" />
        <el-table-column align="center" label="退单数量" prop="trade_info.reject_num" width="80" />
        <el-table-column
          label="成交数量" v-if="!is_pre_attach"
          width="80">
          <template slot-scope="scope">
            <span v-if="is_pre_attach"> 0 </span>
            <span v-else>{{ scope.row.buy_info.num -  scope.row.trade_info.reject_num}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="is_pre_attach"
          prop="buy_info.buy_price"
          label="未税价格"
          width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.buy_info.buy_price }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="税金" prop="trade_info.total_tax" width="100" ></el-table-column>
        <el-table-column align="center" label="税价合计" prop="trade_info.total_tax_price" width="100" />
        <el-table-column align="center" label="物料代码" prop="element_info.element_code" width="100" />
        <el-table-column align="center" label="客户物料名称" prop="element_info.guest_element_name" width="100" />
        <el-table-column align="center" label="客户物料型号" prop="element_info.guest_spec_code" width="100" />
        <el-table-column align="center" label="客户物料代码" prop="element_info.guest_element_no" width="100" />
        <el-table-column align="center" label="客户项目号" prop="element_info.guest_task_code" width="100" />
        <el-table-column align="center" label="备注" prop="remark" width="200" />
      </el-table>
      

      <pagination :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="handleCurrentChange">
        <div>
          <el-button type="danger" size="mini">
              <svg-icon @click="handleReturnOrder" disabled icon-class="returnOrder" class-name="btn_icon_svg"></svg-icon>&nbsp;退单
          </el-button>
          <el-button type="info" @click="handleExportOrder" icon="el-icon-download" size="mini">导出</el-button>
          <el-tooltip class="item" @click="handleRefresh" effect="dark" content="刷新" placement="top">
              <el-button size="mini" circle icon="el-icon-refresh"/>
          </el-tooltip>
        </div>
    </pagination>
  </div>
</template>

<script>
import { getAttachOrder } from '@/api/saleManage'

import { mapGetters } from 'vuex'

import common from '@/utils/common'

import excelExport from "@/utils/excelExport.js"
import exportRules from "@/utils/exportRules.js"

export default {
  name: "saleOrder",
  data() {
    return {
        showSearch: true,
        queryParams: {
          searchInputValue: '',
          pageNum: 1,
          pageSize: 100,
          filterList: []
        },
        total: 1000,
        loading: false,
        tableData: [],
        //
        orderNo: '',
        orderName: '',
        orderInfo: {},
        booksTypeOptions: [],
        financialBookName: '',
        totalNum: 0,
        noTaxTotalPrice: 0,
        includeTaxTotalPrice: 0,
        onlyTaxTotalPrice: 0,
        isSynergy: 0,
        is_pre_attach: 0,
        orderTime: '',
        deliveryTime: '',
        onSaleShow: '',
    };
  },
  computed:{
      ...mapGetters(['screen_height', 'token'])
  },
  created(){
    this.userInfo = JSON.parse(localStorage.getItem('profile'))
    this.userName = this.userInfo.name
    
    this.orderName = this.$route.params.order_name
    this.orderNo = this.$route.params.order_no

    this.setSaleBasicInfo()
    
    this.handleRefresh()
  },
  methods:{
      getTime(time){
      if(time){
        return common.getFormatDate(new Date(time))
      }
      else{
        return ''
      }
    },
    getTimeShort(time){
      if(time){
        return common.getFormatDateShort(new Date(time))
      }
      else{
        return ''
      }
    },
    handleSelectionChange(){

    },
    handleCurrentChange(){

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
    },
    handleRefresh(){
      getAttachOrder({
        access_token: this.token,
        order_no: this.orderNo
      }).then(response => {
        if (response.code == 0){
          this.orderInfo = response
          this.totalNum = 0; //总数量
          this.noTaxTotalPrice = this.orderInfo.total_price; //整单未税合计
          this.includeTaxTotalPrice = this.orderInfo.total_pay; //整单税价合计
          this.onlyTaxTotalPrice = this.orderInfo.total_tax; //整单税金合计
        
          this.isSynergy = this.orderInfo.is_synergy
          this.is_pre_attach = this.orderInfo.is_pre_attach ? this.orderInfo.is_pre_attach : false

          this.deliveryTime = this.getTimeShort(this.orderInfo.answer_delivery_time) || "无"
          this.orderTime = this.getTime(this.orderInfo.order_time) || "无"

          this.checkTime = this.getTime(this.orderInfo.buy_check_time) || "无"
          this.approveTime = this.getTime(this.orderInfo.buy_approve_time) || "无"
          this.saleApproveTime = this.getTime(this.orderInfo.sale_approve_time) || '无'

          for(let i = 0; i < this.booksTypeOptions.length; i ++){
            let bookOptionIndex = this.booksTypeOptions[i]
            if(bookOptionIndex.value === this.orderInfo.financial_book_no){
              this.financialBookName = bookOptionIndex.label

              break
            }
          }

          let onSale = ''
          onSale = (this.orderInfo.on_sale === 0 || this.orderInfo.on_sale) ? this.orderInfo.on_sale : 1
          this.onSaleShow = onSale * 100

          let tmpList = this.orderInfo.element_list;
          tmpList.forEach(item => {
            // this.$set(item.element_info, 'guest_spec_code', item.element_info.guest_spec_code?item.element_info.guest_spec_code:item.element_info.spec_code)
            let tradeNum = item.buy_info.num - item.trade_info.reject_num
            this.totalNum += tradeNum;
            item.no_tax_single_price = item.trade_info.total_price
            item.include_tax_single_price = item.trade_info.total_tax_price
            item.only_tax_single_price = item.trade_info.total_tax

            item.remark = item.remark || ''
            item.buy_info.price_list = item.buy_info.price_list || []
            item.buy_info.price_list = item.buy_info.price_list.filter(ele => {
              return ele.price
            })
            item.buy_info.price_list.sort(function(a, b){
              return a.price - b.price
            })
          });

          this.allRows = tmpList

          this.handleQuery()
        }
      })
    },
    //导出Excel
    handleExportOrder() {
      let rules = exportRules.archiveOrder

      let orderInfo = JSON.parse(JSON.stringify(this.orderInfo))
      orderInfo.order_export_type = '销售订单'
      orderInfo.order_date = this.getTimeShort(orderInfo.order_time)
      orderInfo.pay_currency = '人民币'
      orderInfo.inscribe_left = ''
      orderInfo.inscribe_right = ''
      orderInfo.inscribe_purchaser = orderInfo.buyer + '   ' + this.orderTime
      orderInfo.inscribe_seller = orderInfo.seller + '   ' + this.orderTime
      orderInfo.inscribe_checker_left = orderInfo.buy_check_person + '   ' + this.checkTime
      orderInfo.inscribe_checker_right = '无'
      orderInfo.inscribe_approve_left = orderInfo.buy_approve_person + '   ' + this.approveTime
      let inscribe_approve_right_man = orderInfo.sale_approve_person
      let inscribe_approve_right_time = orderInfo.saleApproveTime
      orderInfo.inscribe_approve_right = inscribe_approve_right_man + '   ' + inscribe_approve_right_time

      orderInfo.element_list.forEach(item => {
        item.task_code = item.buy_info.task_code
        item.element_code = item.element_info.element_code
        item.element_name = item.element_info.element_name
        item.spec_code = item.element_info.spec_code
        item.brand = item.element_info.brand
        item.unit = item.element_info.unit
        item.num = item.buy_info.num - item.trade_info.reject_num
        item.price = item.trade_info.price
        item.tax_price = item.trade_info.tax_price
        item.delivery_time = item.trade_info.agreed_delivery_time
      })
      orderInfo.count_num = this.totalNum
      orderInfo.on_sale_percent = this.onSaleShow + '%'
      orderInfo.no_tax_total_price = this.noTaxTotalPrice
      orderInfo.only_tax_total_price = this.onlyTaxTotalPrice
      orderInfo.include_tax_total_price = this.includeTaxTotalPrice

		  let fileName = orderInfo.order_export_type + "-" + orderInfo.purchase_full_name + '-' + orderInfo.order_name + '.xlsx';
      excelExport.writeOrderSheetToFile(orderInfo, rules, fileName, orderInfo.order_export_type);
    },
    filterTableData(){
      let tempList = [];
      this.allRows.forEach(item => {
        tempList.push(item)
      })

      this.queryParams.filterList = tempList
    },
    handleQuery(){
      this.filterTableData()
      this.localSearchInfo()
    },
    localSearchInfo(){
      this.cancelSelect()
      let that = this
      common.handleSearchInfo(that, 1, this.queryParams.searchInputValue, this.queryParams.filterList)
    },
    cancelSelect() {
      if (this.$refs.multipleTable) {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleReturnOrder(){

    },
  }
};
</script>

<style lang="scss">
.saleOrder {
    .table_tip {
        font-size: 14px;
        color: #515a6e;
    }
}
</style>