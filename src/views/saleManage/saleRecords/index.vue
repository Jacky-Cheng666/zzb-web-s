<template>
  <div class="app-container saleRecords">
    <el-form class="mb10" :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item>
        <el-input v-model="queryParams.searchInputValue" placeholder="输入关键字" clearable size="small" style="width: 180px" @keyup.enter.native="handleRefresh"/>
      </el-form-item>
      <el-form-item label="付款状态">
        <el-select style="width:100px;" size="small" @change="changePayStatus" v-model="queryParams.valuePayStatus" placeholder="请选择">
          <el-option
            v-for="item in payStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="退单状态">
        <el-select style="width: 100px;" size="small" @change="changeRejectType" v-model="queryParams.valueRejectType" placeholder="请选择">
          <el-option
            v-for="item in rejectTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker 
          size="small" 
          v-model="valueTime" 
          type="daterange" 
          align="right" 
          value-format = "yyyy-MM-dd"
          unlink-panels 
          range-separator="至" 
          start-placeholder="开始日期" 
          end-placeholder="结束日期" 
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-select style="width: 100px;" size="small" @change="changeBookType" v-model="queryParams.valueBookType" placeholder="请选择">
          <el-option
            v-for="item in booksTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleRefresh">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="2" class="mb8">
      <el-col :span="12">
       <svg-icon iconClass="tip" class="mr5" style="font-size:18px;"></svg-icon>
       <span class="f14 table_tip">点击“订单号”可以查看订单详情，点击“附件”可以打印订单。</span>
      </el-col>
      <el-col :span="12" style="text-align:right">
        <span class="table_tip">图示：</span>
        <span class="mr10 table_tip">
          <svg-icon style="color:#3894FF;font-size:16px;margin-right:4px" icon-class="pdf" />订单正常
        </span>
        <span class="mr10 table_tip">
          <svg-icon style="color:#E34348;font-size:16px;margin-right:4px" icon-class="pdf" />部分退单
        </span>
        <span class="table_tip">
          <svg-icon style="color:#101010;font-size:16px;margin-right:4px" icon-class="pdf" />全部退单或无效
        </span>
      </el-col>
      
    </el-row>
    
    <el-table class="mb8" ref="multipleTable" :row-key="getRowKeys" :height="screen_height-350" v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="50" :reserve-selection="true" :selectable="checkCanSelect"/>
      <el-table-column align="center" label="订单号" prop="order_name" width="160">
        <template slot-scope="scope">
          <router-link :to="{path: '/saleManage/saleOrder/'+ scope.row.order_name + '/' + scope.row.order_no}">
            <el-link :underline="false" type="primary">{{scope.row.order_name}}</el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column align="center" label="客户名称" prop="purchase_name" />
      <el-table-column align="center" label="客户订单号" prop="guest_order_name" />
      <el-table-column align="center" label="总金额" prop="total_price" width="120" />
      <el-table-column align="center" label="收款" prop="" width="120" />
      <el-table-column align="center" label="销售人" prop="seller" width="100" />
      <el-table-column align="center" label="下单时间" prop="" width="200"></el-table-column>
      <el-table-column align="center" label="附件" width="60">
        <template slot-scope="scope">
          <svg-icon v-if="scope.row.is_pre_attach || scope.row.is_rejected === 2" @click="downloadSingleAttachOrder(scope.row)" style="color: #101010; font-size:16px; cursor:pointer" icon-class="pdf" />
          <svg-icon v-else-if="scope.row.is_rejected === 1 || scope.row.is_rejected" @click="downloadSingleAttachOrder(scope.row)" style="color: #E34348; font-size:16px; cursor:pointer" icon-class="pdf" />
          <svg-icon v-else @click="downloadSingleAttachOrder(scope.row)" style="color: #409eff; font-size:16px; cursor:pointer" icon-class="pdf" />
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="handleCurrentChange">
      <div>
        <!-- <el-button type="primary" icon="el-icon-circle-check" size="mini">所有页全选</el-button> -->
        <el-checkbox style="margin-right: 20px;" v-model="isAllChoose" label="所有页全选" ></el-checkbox>
        <el-button type="primary" @click="handleExportPdf" icon="el-icon-download" size="mini">批量下载附件</el-button>
        <el-button type="primary" @click="handleExportExcel" icon="el-icon-download" size="mini">导出</el-button>
        <el-tooltip class="item" effect="dark" content="刷新" placement="top">
            <el-button @click="handleRefresh" size="mini" circle icon="el-icon-refresh"/>
        </el-tooltip>
      </div>
    </pagination>

  </div>
</template>

<script>
import { getAttachOrderList, exportAttachOrders, exportSingleAttachOrder } from '@/api/saleManage'

import { mapGetters } from 'vuex'

import common from '@/utils/common'

import ExcelJS from "exceljs"

export default {
  name: 'saleRecords',
  data() {
    return {
      queryParams: {
        valuePayStatus: 0,
        searchInputValue: "",
        valueRejectType: -1,
        valueBookType: 0,
        pageNum: 1,
        pageSize: 100,
        filterList: [],
      },
      showSearch: true,
      loading: false,
      // tableData: [{order_name:"PO210115171738"},{order_name:"PO222222222"},{order_name:"PO33333333"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},{order_name:"PO210115171738"},],
      tableData: [],
      total: 0,
      allRows: [],
      valueTime:[],
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
      payStatusOptions: [
        {
          value: 0,
          label: '全部'
        }, 
        {
          value: 1,
          label: '已收讫'
        },
        {
          value: 2,
          label: '未收讫'
        },
        {
          value: 3,
          label: '无效'
        }
      ],
      rejectTypeOptions: [
        {
          label: '全部',
          value: -1
        },
        {
          label: '全退单',
          value: 2
        },
        {
          label: '有退单',
          value: 1
        },
        {
          label: '无退单',
          value: 0
        }
      ],
      booksTypeOptions: [],
      multipleSelection: [],
      isAllChoose: false
    }
  },
  watch: {
    isAllChoose: {
      handler () {
        if (this.isAllChoose) {
          this.rows.forEach(row => {
            if (row) {
              if(this.$refs.multipleTable){
                this.$refs.multipleTable.toggleRowSelection(row, true)
              }
            }
          })
        } else{
          if(this.$refs.multipleTable){
            this.$refs.multipleTable.clearSelection()
          }
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters(['screen_height', 'token'])
  },
  created(){
    this.userInfo = JSON.parse(localStorage.getItem('profile'))
    this.userName = this.userInfo.name

    this.setTime()
    this.setSaleBasicInfo()
    this.handleRefresh()
  },
  methods: {
    getRowKeys(row) {
      return row.index;
    },
    checkCanSelect(row, index) {
      return !this.isAllChoose
    },
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
    setTime(){
      let nowTime = new Date()
      let startTime = this.getTime(new Date(new Date(nowTime.getTime() - 3600 * 1000 * 24 * 30).toLocaleDateString()).getTime())
      let endTime = this.getTime(new Date(nowTime.toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
      this.valueTime = [startTime,endTime]
    },
    filterTableData(){
      let tempList = [];
      this.allRows.forEach(item => {
        if(this.queryParams.valueBookType === item.financial_book_no){
          tempList.push(item)
        }
      })
      
      if (0 < this.queryParams.valuePayStatus) {
        let list = []
        tempList.forEach(item => {
          if (1 === this.queryParams.valuePayStatus && !item.payment_over && !item.is_pre_attach) {
            list.push(item)
          }

          if (2 === this.queryParams.valuePayStatus && item.payment_over && !item.is_pre_attach) {
            list.push(item)
          }

          if (3 === this.queryParams.valuePayStatus && item.is_pre_attach) {
            list.push(item)
          }
        })

        tempList = list
      }
      
      if (0 <= this.queryParams.valueRejectType) {
        let list = []
        tempList.forEach(item => {
          if (2 === this.queryParams.valueRejectType && item.is_rejected === this.queryParams.valueRejectType) {
            list.push(item)
          }

          if (1 === this.queryParams.valueRejectType && (item.is_rejected > 0 || item.is_rejected)) {
            list.push(item)
          }

          if (0 === this.queryParams.valueRejectType && !item.is_rejected) {
            list.push(item)
          }
        })

        tempList = list
      }

      // if (0 <= this.valueSolveType) {
      //   let list = []
      //   tempList.forEach(item => {
      //     if (1 === this.valueSolveType && item.is_solved) {
      //       list.push(item)
      //     }

      //     if (0 === this.valueSolveType && !item.is_solved) {
      //       list.push(item)
      //     }
      //   })

      //   tempList = list
      // }

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
    resetQuery(){
      this.queryParams.searchInputValue = ''
      this.queryParams.valuePayStatus = 0
      this.queryParams.valueRejectType = -1
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
    changePayStatus(val) {
      // this.valuePay = val
      // this.changeRefresh()
    },
    changeRejectType(val){
      // this.valueRejectType = val
      // this.changeRefresh()
    },
    changeBookType(val){
      // this.valueBookType = val
      // this.changeRefresh()
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
    checkChooseAccess(){
      if(this.multipleSelection.length <= 0){
        this.$message({
          showClose: true,
          message: '请至少选择一个订单！',
          type: 'warning'
        })

        return false
      } else{
        return true
      }
    },
    getState(bl){
      if(bl){
        return '已处理'
      } else{
        return '未处理'
      }
    },
    handleRefresh(){
      getAttachOrderList({
        access_token: this.token,
        start_date: this.valueTime[0],
        end_date: this.valueTime[1],
        is_return: false
      }).then(response => {
        if (response.code == 0){
          // this.valueOrderType = 0
          this.queryParams.searchInputValue = ''
          this.queryParams.valuePayStatus = 0

          this.isAllChoose = false

          this.allRows = response.order_list
          this.allRows.forEach((item, index) => {
            item.index = index
          })
          this.handleQuery()
        }
      })
    },
    downloadSingleAttachOrder(row){
      if(row.is_pre_attach){
        this.$message({
          showClose: true,
          type: 'warning',
          message: '预备订单直接归档的属于无效订单，无法查看PDF!'
        });

        return
      }

      if(!row.is_synergy){
        this.$alert('非协同订单暂无PDF文件！', '提示', {
          confirmButtonText: '确定'
        });

        return
      }

      exportSingleAttachOrder({
        access_token: this.token,
        order_name: row.order_name,
        order_no: row.order_no,
        supplier_code: row.supplier_code,
        supplier_name: row.supplier_name,
        supplier_full_name: row.supplier_full_name,
        purchase_code: row.purchase_code,
        purchase_name: row.purchase_name,
        purchase_full_name: row.purchase_full_name
      }).then(response => {
        if (response.code == 0){
          window.open(response.file_name)
        }
      })
    },
    handleExportPdf(){
      if(this.multipleSelection.length <= 0){
        this.$message({
          showClose: true,
          message: '请至少选择一个订单！',
          type: 'warning'
        })

        return
      }

      this.$confirm('确定要批量下载吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let tmp_order_list = []
        this.multipleSelection.forEach(item => {
          tmp_order_list.push({
            order_no: item.order_no, 
            order_name: item.order_name,
            purchase_code: item.purchase_code, 
            purchase_name: item.purchase_name,
          })
        })
        
        exportAttachOrders({
          access_token: this.token,
          order_list: tmp_order_list,
          start_date: this.getTimeShort(this.valueTime[0]),
          end_date: this.getTimeShort(this.valueTime[1])
        }).then(response => {
          if (response.code == 0){
            // let host = window.location.protocol+"//"+window.location.host
            // let host = 'https://192.168.1.150:4530'
            // let host = 'https://debug.zhizaoband.com:4530'

            let host = window.location.protocol+ "//" + response.host + ":" + response.port

            let url = host + "/" + response.file_url
            console.log(url)
            window.open(url)
          }
        })
      })
    },
    handleExportExcel(){
      if(this.checkChooseAccess()){
        let list = this.multipleSelection
        this.writeToFile(list)
      }
    },
    writeToFile(arrList) {
      var elementList = [
        [
          "客户",
          "订单号",
          "总金额",
          "销售人",
          "采购人",
          "采购人手机",
          "审核人",
          "审核时间",
          "审批人",
          "审批时间",
          "我方审批人",
          "我方审批时间",
          "状态"
        ],
      ]
      let totalPrice = 0
      arrList.forEach((item, index) => {
        let element = [
          item.purchase_name,
          item.order_name,
          item.total_price,
          item.seller,
          item.buyer,
          item.buyer_phone,
          item.buy_check_person,
          this.getTime(item.buy_check_time),
          item.buy_approve_person,
          this.getTime(item.buy_approve_time),
          item.sale_approve_person,
          this.getTime(item.sale_approve_time),
          this.getState(item.is_solved)
        ]
        elementList.push(element)

        let price = item.total_price?item.total_price:0
        totalPrice += price
      })

      elementList.push([
        "合计",
        "",
        totalPrice,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
      ])
      let org = JSON.parse(localStorage.getItem('org'))
      let fileName = "归档总表-" + org.company_name + ".xlsx"
      //导出为格式化的excel
      this.exportToExcelFile(elementList, fileName, "归档总表")
    },
    async exportToExcelFile(data, fileName, sheetName) {
      let workbook = new ExcelJS.Workbook()
      let worksheet = workbook.addWorksheet(sheetName)
      worksheet.columns = [
        { header: "客户", key: "purchase_name", width: 20 },
        { header: "订单号", key: "order_name", width: 20 },
        { header: "总金额", key: "total_price", width: 14 },
        { header: "销售人", key: "seller", width: 10 },
        { header: "采购人", key: "buyer", width: 10 },
        { header: "采购人手机", key: "buyer_phone", width: 12 },
        { header: "审核人", key: "buy_check_person", width: 10 },
        { header: "审核时间", key: "buy_check_time", width: 20 },
        { header: "审批人", key: "buy_approve_person", width: 10 },
        { header: "审批时间", key: "buy_approve_time", width: 20 },
        { header: "我方审批人", key: "sale_approve_person", width: 10 },
        { header: "我方审批时间", key: "sale_approve_time", width: 20 },
        { header: "状态", key: "is_solved", width: 8 }
      ]
      for (let i = 0; i < data.length; i++) {
        data[i].forEach((item, index) => {
          let cell = worksheet.getCell(i + 1, index + 1) //获取每一行的每个单元格。
          cell.value = item
          if(i + 1 === data.length){
            cell.font = { size: 12, color: { argb: 'ffff0000'}}
          }
        })
      }

      let buffer = await workbook.xlsx.writeBuffer()
      let obj = new Blob([this.s2ab(buffer)], {
        type: "",
      })
      this.saveAs(obj, fileName)
    },
    s2ab(s) {
      if (typeof ArrayBuffer !== "undefined") {
        var buf = s.buffer
        return buf
      } else {
        var buf = new Array(s.length)
        for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xff
        return buf
      }
    },
    saveAs(obj, fileName) {
      let tmpa = document.createElement("a")
      tmpa.download = fileName
      tmpa.href = URL.createObjectURL(obj)
      tmpa.click()
      setTimeout(function () {
        URL.revokeObjectURL(obj);
      }, 100);
    }
  }
}
</script>

<style lang="scss" scoped>
.saleRecords{
  .table_tip{
    font-size: 14px;
    color: #515a6e;
  }
}
</style>