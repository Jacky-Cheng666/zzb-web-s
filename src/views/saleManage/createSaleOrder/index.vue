<template>
  <div class="app-container createSaleOrder">
    <fieldset class="field" v-show="showSearch">
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item>
          <el-select value-key="label" size="small" @change="businessChange" style="width: 310px;"  v-model="queryParams.valueBusiness" placeholder="选择客户" filterable>
            <el-option
              v-for="item in businessCompanyOptions"
              :key="item.label"
              :label="item.label"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select style="width: 100px" size="small" value-key="label" @change="OrderUseChange" v-model="queryParams.valueSaleType" placeholder="用途">
            <el-option
              v-for="item in salesTypeOptions"
              :key="item.label"
              :label="item.label"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select style="width: 100px" size="small" value-key="label" @change="payChange" v-model="queryParams.valuePay" placeholder="请选择">
            <el-option
              v-for="item in payTypeOptions"
              :key="item.label"
              :label="item.label"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select style="width: 100px" size="small" value-key="label" @change="taxChange" v-model="queryParams.valueTax" placeholder="请选择">
            <el-option
              v-for="item in taxTypeOptions"
              :key="item.label"
              :label="item.label"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select style="width: 120px;" size="small"  v-model="queryParams.valueBookType" @change="changeBookType" placeholder="请选择">
            <el-option
              v-for="item in booksTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <br/>
        <el-form-item>
          <el-input v-model="queryParams.inputOrderName" placeholder="输入客户订单号" clearable size="small" style="width: 200px"/>
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryParams.orderExplainText" placeholder="输入订单说明" clearable size="small" style="width: 561px"/>
        </el-form-item>
        <br>
        <el-form-item label="不开票" label-width="64px">
          <el-switch v-model="queryParams.isNeedInvoice"></el-switch>
        </el-form-item>
        <el-form-item label="已付迄" label-width="70px">
          <el-switch v-model="queryParams.isPayed"></el-switch>
        </el-form-item>
        <el-form-item label="协议交货日期" label-width="110px">
          <el-date-picker :clearable="false" value-format="yyyy-MM-dd" style="width:140px" size="small" v-model="queryParams.deadline" type="date" placeholder="选择日期" :picker-options="startDatePicker"></el-date-picker>
        </el-form-item>
        <el-form-item label="预计发货日期" label-width="110px">
          <el-date-picker :clearable="false" value-format="yyyy-MM-dd" style="width:140px" size="small" v-model="queryParams.deliver_time" type="date" placeholder="选择日期" :picker-options="startDatePicker"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-badge :value="payPlanList.length" class="item" type="primary">
            <el-button @click="editPayPlan" type="primary" size="mini">付款计划</el-button>
          </el-badge>
        </el-form-item>
        <el-form-item>
          <el-badge :value="1" class="item" type="primary">
            <el-button @click="editAddress" type="primary" size="mini">收货地址</el-button>
          </el-badge>
        </el-form-item>
      </el-form>
    </fieldset>

    <el-table class="mb8" :height="screen_height-410" v-loading="loading" ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column align="center" label="名称" prop="element_info.element_name" width="180" />
      <el-table-column align="center" label="型号" prop="element_info.spec_code" width="240" />
      <el-table-column align="center" label="品牌" prop="element_info.brand" width="100" />
      <el-table-column align="center" label="单位" prop="element_info.unit" width="60" />
      <el-table-column align="center" label="数量" prop="buy_info.num" width="80" />
      <el-table-column align="center" label="未税价格" prop="buy_info.buy_price" width="100" />
      <el-table-column align="center" label="税金" prop="tax_amount" width="100" ></el-table-column>
      <el-table-column align="center" label="税价合计" prop="total_money_with_tax" width="100" />
      <el-table-column align="center" label="物料代码" prop="element_info.element_code" width="100" />
      <el-table-column align="center" label="客户物料名称" prop="element_info.guest_element_name" width="100" />
      <el-table-column align="center" label="客户物料型号" prop="element_info.guest_spec_code" width="100" />
      <el-table-column align="center" label="客户物料代码" prop="element_info.guest_element_code" width="100" />
      <el-table-column align="center" label="客户项目号" prop="element_info.guest_task_code" width="100" />
      <el-table-column align="center" label="备注" prop="remark" width="200" />
      <el-table-column fixed="right" align="center" label="操作" width="70">
        <template slot-scope="scope">
          <el-button @click="editElement(scope.row)" size="mini" type="text" icon="el-icon-edit">修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList">
      <div>
        <input type="file" @change="OnFileChanged(this)" ref="imFile" style="display: none"
                 accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
        <el-button @click="uploadFile" type="info" icon="el-icon-upload2" size="mini">导入</el-button>
        <el-button @click="handExportOrder('销售订单导入模板', [{'guest_element_code':'', 'guest_element_name':'必填', 'guest_spec_code':'必填', 'brand':'必填', 'version':'' , 'unit':'必填', 'num':'必填', 'delivery_time':'必填', 'price':'两种价格必须且只能填一个', 'tax_price':'', 'remark':'', 'element_code':'', 'element_name':'必填', 'spec_code':'必填', 'workpiece_name': '必填'}])" type="primary" icon="el-icon-upload2" size="mini">下载模板</el-button>
        <el-button @click="handleRemoveMaterial" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        <el-button @click="batchAddClick" type="primary" icon="el-icon-plus" size="mini">批量新增</el-button>
        <el-button @click="addElement" disabled type="primary" icon="el-icon-plus" size="mini">新增</el-button>
        <el-button type="success" disabled icon="el-icon-folder-add" size="mini">暂存</el-button>
        <el-button @click="saveCreateOrder" type="success" icon="el-icon-check" size="mini">提交</el-button>
      </div>
    </pagination>

    <!-- <el-tooltip placement="top" content="返回顶部">
      <back-to-top :custom-style="myBackToTopStyle" :visibility-height="300" :back-position="0" transition-name="fade" />
    </el-tooltip> -->

    <pay-plan v-model="payPlanList" ref="payPlan"></pay-plan>
    <address-dialog v-model="addressList" ref="addressDialog"></address-dialog>

    <element-info :elementInfoForm="elementInfoForm" myElementTitleName="我方产品信息" titleName="产品信息" ref="elementInfo">
      <template slot="content-wrap">
        <el-form-item label="客户物料信息：" label-width="110px">
          <el-form-item label="名称" prop="guest_element_name">
              <el-input v-model="elementInfoForm.element_info.guest_element_name" placeholder="输入名称" clearable size="small" style="width: 260px"/>
          </el-form-item>
          <el-form-item label="代码" prop="guest_element_code">
              <el-input v-model="elementInfoForm.element_info.guest_element_code" placeholder="输入代码" clearable size="small"/>
          </el-form-item>
          <el-form-item label="型号" prop="spec_code">
              <el-input v-model="elementInfoForm.element_info.guest_spec_code" placeholder="输入型号" clearable size="small" style="width: 260px"/>
          </el-form-item>
          <el-form-item label="项目" prop="guest_task_code">
              <el-input v-model="elementInfoForm.element_info.guest_task_code" placeholder="输入项目" clearable size="small"/>
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <div>交易信息：</div>
          <el-form-item label="数量" prop="trade_num" style="margin-right:126px">
              <el-input v-model="elementInfoForm.buy_info.num" placeholder="输入数字" clearable size="small" style="width: 100px"/>
          </el-form-item>
          <el-form-item>
              <el-form-item label="未税价" label-width="70px">
                  <el-switch v-model="elementInfoForm.buy_info.isHasTax"></el-switch>
              </el-form-item>
              <el-form-item label="价格">
                  <el-input v-model="elementInfoForm.buy_info.buy_price" placeholder="输入数字" clearable size="small" style="width: 120px;"/>
              </el-form-item>
          </el-form-item>
        </el-form-item>
      </template>
    </element-info>

    <battch-add @addMaterial="handleAddMaterial" ref="battchAdd"></battch-add>

    <upload-file ref="uploadFile"></upload-file>
  </div>
</template>

<script>
import payPlan from './components/payPlanDialog'
import addressDialog from './components/addressDialog'
import elementInfo from '../../../components/elementInfo'
const battchAdd = ()=>import('./components/batchAdd')
import uploadFile from '@/components/UploadFile/index'

import { createPlanOrder } from '@/api/saleManage'
import { mapGetters } from 'vuex'
import common from '@/utils/common'

export default {
  name: 'createSaleOrder',
  components:{
    payPlan,
    addressDialog,
    elementInfo,
    battchAdd,
    uploadFile
  },
  props: {
    orderNum: {
      type: String,
      default: 'default'
    },
    orderKey: {
      type: String,
      default: 'default'
    }
  },
  data() {
    return {
      tmpOrderNum: this.orderNum,
      tmpOrderKey: this.orderKey,
      userInfo: "",
      userName: "",
      myBackToTopStyle: {
        right: '90px',
        bottom: '70px',
        width: '40px',
        height: '40px',
        'border-radius': '4px',
        'line-height': '45px', // Please keep consistent with height to center vertically
        background: '#e7eaf1'//  The background color of the button
      },
      queryParams:{
        inputOrderName: '',
        orderExplainText: '',
        isNeedInvoice: false,
        isPayed: false,
        deadline: '',
        deliver_time: '',
        pageNum: 1,
        pageSize: 20,
        //
        valueBusiness: {},
        valueSaleType: {},
        valueBookType: '',
        valueBuyType: {},
        valueTax: {},
        valuePay: {},
      },
      showSearch: true,
      loading: false,
      // tableData: [{element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
      //   {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
      //   {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
      //   {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
      //   {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
      //   {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
      //   {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
      //   {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
      //   {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
      //   {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
      //   {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
      //   {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
      //   {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
      //   {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
      //   {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
      //   {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
      //   {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
      //   {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
      //   {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
      //   {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
      //   {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
      //   {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
      // ],
      tableData: [],
      total: 0,
      payPlanList:[{pay_time:new Date(),pay_money:"",percent:"",remark:"",payed:false}],
      addressList: {
        receiver: '',
        receiver_phone: '',
        receiver_address: ''
      },
      elementInfoForm:{
        element_info: {},
        buy_info: {},
        sale_info: {},
        trade_info: {}
      },
      //
      workpiece_define_list: [],
      businessCompanyOptions: [],
      businessInfo: {},
      salesTypeOptions: [],
      booksTypeOptions: [],
      buyTypeOptions: [],
      taxTypeOptions: [],
      payTypeOptions: [],
      //
      startDatePicker: this.beginDate(),
      multipleSelection: []
    }
  },
  computed: {
    ...mapGetters(['screen_height', 'token'])
  },
  created(){
    this.userInfo = JSON.parse(localStorage.getItem('profile'))
    this.userName = this.userInfo.name
    //销售和采购信息初始化
    this.setSaleBasicInfo()
    //判断是否是新订单
    // this.isNewOrder()
    // if(this.isNew){ //新订单
    // } else{
    //   this.getPreOrderInfo()
    // }
    this.workpiece_define_list = JSON.parse(window.localStorage.getItem('saleBasicInfo')).workpiece_define_list || []
  },
  methods: {
    handleSelectionChange(val){
      this.multipleSelection = val
    },
    toggleSearch(){
      this.showSearch = !this.showSearch
    },
    getList(){},
    editPayPlan(){
      this.$refs.payPlan.openPlan = true;
    },
    editAddress(){
      this.$refs.addressDialog.openAddress = true;
    },
    addElement(){
      this.$refs.elementInfo.openElementInfo = true;
    },
    editElement(row){
      this.elementInfoForm = row
      this.$refs.elementInfo.openElementInfo = true;
    },
    batchAddClick(){
      this.$refs.battchAdd.openBatchAdd = true;
    },
    handleImport(){
      this.$refs.uploadFile.upload.open = true;
    },
    handleDownloadTemplate(){

    },
    //
    //日期选择起始时间限制
    beginDate(){
      let self = this
      return {
        disabledDate(time){
          return (time.getTime() + 3600 * 1000 * 24) < Date.now()//开始时间不选时，结束时间最大值小于等于当天
        }
      }
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
      //客户
      let tmpPurchaseList = tmpInfo.purchaser_list
      tmpPurchaseList.forEach(item => {
        if(!item.is_synergy){
          this.businessCompanyOptions.push(
            {
              value: item.purchase_code,
              label: item.purchase_name,
              info: item
            }
          )
        }
      })
      if(this.businessCompanyOptions.length){
        this.queryParams.valueBusiness = this.businessCompanyOptions[0]
        this.businessInfo = this.businessCompanyOptions[0].info
      }
      //购买类型
      let tmpBuyTypeList = tmpInfo.buy_type_define_list
      tmpBuyTypeList.forEach(item => {
        this.buyTypeOptions.push(
          {
            value: item.code,
            label: item.name
          }
        )
      })
      if(this.buyTypeOptions.length){
        this.queryParams.valueBuyType = this.buyTypeOptions[0]
      }
      //销售类型
      let tmpSaleTypeList = tmpInfo.order_use_define_list
      tmpSaleTypeList.forEach(item => {
        this.salesTypeOptions.push(
          {
            value: item.order_use_type,
            label: item.order_use_name
          }
        )
      })
      if(this.salesTypeOptions.length){
        this.queryParams.valueSaleType = this.salesTypeOptions[0]
      }
      //付款方式
      let tmpPayTypeList = tmpInfo.pay_period_define_list
      tmpPayTypeList.forEach(item => {
        this.payTypeOptions.push(
          {
            value: item.pay_period_value,
            label: item.pay_period_name
          }
        )
      })
      if(this.payTypeOptions.length){
        this.queryParams.valuePay = this.payTypeOptions[0]
      }
      //税率类型
      let tmpTaxTypeList = tmpInfo.tax_type_define_list
      tmpTaxTypeList.forEach(item => {
        this.taxTypeOptions.push(
          {
            value: item.tax_value,
            label: item.tax_name
          }
        )
      })
      if(this.taxTypeOptions.length){
         this.taxTypeOptions.forEach(item => {
          if (item.label === userInfo.tax_name) {
            this.queryParams.valueTax = item
          }
        })
      } else {
        this.queryParams.valueTax = {}
      }
    },
    //采购商
    businessChange(val){
      this.businessCompanyOptions.forEach(item => {
        if(item === val){
          this.businessInfo = item.info
          return 
        }
      })
    },
    //销售类型
    OrderUseChange(val){
      // console.log("OrderUseChange",val)
    },
    //付款方式
    payChange(val){
      // this.isTableChange = true
    },
    //税率
    taxChange(val){
      //table数据刷新
      // this.$set(this.tableData,)
      // this.isTableChange = true
    },
    //账本
    changeBookType(val){
      // this.valueBookType = val
      // this.isTableChange = true
    },
    //导入和下载模板
    uploadFile(){
      this.imFile = this.$refs.imFile
      this.imFile.click();
    },
    handExportOrder(file_name, elements){
      let _this = this
      const filterVal = ['guest_element_code', 'guest_element_name', 'guest_spec_code', 'brand', 'version' , 'unit', 'num', 'delivery_time', 'price' , 'tax_price' , 'remark', 'element_code', 'element_name', 'spec_code', 'workpiece_name'];
      const tHeader = ['对方物料代码', '对方物料名称', '对方规格型号', '品牌', '版本' , '单位', '需求数量', '需求日期', '客户未税议价' , '客户含税议价', '备注', '物料代码', '物料名称', '规格型号', '供应商分类']
      let data = _this.formatJson(filterVal, elements);
      data.unshift(tHeader)

      this.exportOrder(data, file_name)
    },
    exportOrder(data, orderName) {
      let _this = this
      var tmpdata = [];//用来保存转换好的json
      data.map((row, i) => row.map((v, j) => Object.assign({}, {
        v: (v ? v : undefined),
        position: (String.fromCharCode(65 + j)) + (i + 1)
      }))).reduce((prev, next) => prev.concat(next)).forEach((v, i) => tmpdata[v.position] = {
        v: v.v
      });

      var outputPos = Object.keys(tmpdata); //设置区域,比如表格从A1到D10
      var wb = {
        SheetNames: ['sheet1'], //保存的表标题
        Sheets: {
          'sheet1': Object.assign({},
            tmpdata, //内容
            {
              '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] //设置填充区域
            })
        }
      };

      //const wb = {SheetNames: ['Sheet1'],Sheets: {}, Props: {}};
      //wb.Sheets['Sheet1'] = XLSX.utils.json_to_sheet(data); //通过json_to_sheet转成单页(Sheet)数据
      _this.saveAs(new Blob([_this.s2ab(XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: false,
        type: 'binary'
      }))], {
        type: ""
      }), orderName + '.xlsx');
    },
    saveAs(obj, fileName) {
      let tmpa = document.createElement("a");
      tmpa.download = fileName;
      tmpa.href = URL.createObjectURL(obj);
      tmpa.click();
      setTimeout(function () {
        URL.revokeObjectURL(obj);
      }, 100);
    },
    s2ab(s) {
      if (typeof ArrayBuffer !== 'undefined') {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
      } else {
        var buf = new Array(s.length);
        for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
        return buf;
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    OnFileChanged() {
      //读取数据
      let _this=this
      var files = this.imFile.files;
      var file = new FileReader();
      file.readAsArrayBuffer(files[0]);
      file.onload = function (e) {
        try {
          var fileContent = e.target.result;
          var wb =XLSX.read(_this.fixdata(fileContent), { type: 'binary' });
          var items =XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 });
          let tmpArr = []
          tmpArr = items.filter((item,index) => {
            let result = item.every(ele => {
              return ele == 'undefined'
            })
            return !result
          })
          items = tmpArr
          //进行数据解析
          var merges = wb.Sheets[wb.SheetNames[0]]['!merges'];
          let result = _this.bom2list(items);
          if(result){
            if (result.code == 1) {
              _this.$refs.imFile.value = ""
              _this.allRows = []
              _this.rows = []
              _this.ElementList = []
              _this.$message({
                showClose: true,
                type: 'warning',
                message: result.errMsg
              });
            } else {
              _this.$refs.imFile.value = ""
            }
          } else{
            _this.$refs.imFile.value = ""
          }
          
        }
        catch (error) {
          console.log(error);
          return;
        }
      }
    },
    // 文件流转BinaryString
    fixdata(data) {
      var o = "";
      var l = 0;
      var w = 10240;
      for (; l < data.byteLength / w; ++l) {
        o += String.fromCharCode.apply(
          null,
          new Uint8Array(data.slice(l * w, l * w + w))
        );
      }
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
      return o;
    },
    bom2list(items) {
      let elements=[],header=["guest_element_code", "guest_element_name", "guest_spec_code", "brand", "version" , "unit", "num", ,"deliver_time", "price" , "tax_price" , "remark", "element_code", "element_name", "spec_code","workpiece_name"]
      if(items.length > 1){
        items.forEach((item,index)=>{
          for (let i=0; i<=12; i++) {
            if(typeof item[i] === 'number'){
              item[i] += ""
            }
            item[i] = item[i] ? item[i].trim() : item[i]
          }
          if(index>0&&item[1]&&item[2]&&item[3]&&item[5]&&item[6]&&item[7]&&item[12]&&item[13]&&item[14]){
            let tmpGuestElementCode = item[0]
            if(tmpGuestElementCode && common.matchSpecialCharacter(tmpGuestElementCode)){
              this.$message({
                showClose: true,
                type: 'warning',
                message: "第"+(index+1)+"行的 对方物料代码 包含特殊字符，请检查"
              });
              return
            }
            if(tmpGuestElementCode && tmpGuestElementCode.toString().trim().length > 24){
              this.$message({
                showClose: true,
                type: 'warning',
                message: "第"+(index+1)+"行的 对方物料代码 过长，请检查"
              });
              return
            }

            let tmpGuestElementName = item[1]
            if(tmpGuestElementName && common.matchSpecialCharacter(tmpGuestElementName)){
              this.$message({
                showClose: true,
                type: 'warning',
                message: "第"+(index+1)+"行的 对方物料名称 包含特殊字符，请检查"
              });
              return
            }
            if (tmpGuestElementName && tmpGuestElementName.toString().trim().length > 32) {
              this.$message({
                showClose: true,
                type: 'warning',
                message: "第"+(index+1)+"行的 对方物料名称 过长，请检查"
              });
              return
            }

            let tmpGuestSpecCode = item[2]?item[2].toString().trim():''
            let tmpVersion = item[4]?item[4].toString().trim():''
            let tmpStr = tmpGuestSpecCode + tmpVersion
            if(tmpGuestSpecCode && common.matchSpecialCharacter(tmpGuestSpecCode)){
              this.$message({
                showClose: true,
                type: 'warning',
                message: "第"+(index+1)+"行的 对方规格型号 包含特殊字符，请检查"
              });
              return
            }
            if(tmpVersion && common.matchSpecialCharacter(tmpVersion)){
              this.$message({
                showClose: true,
                type: 'warning',
                message: "第"+(index+1)+"行的 版本 包含特殊字符，请检查"
              });
              return
            }
            if(tmpGuestSpecCode && tmpStr.trim().length > 64){
              this.$message({
                showClose: true,
                type: 'warning',
                message: "第"+(index+1)+"行的 对方规格型号 过长，请检查"
              });
              return
            }

            let tmpBrand = item[3]
            if(tmpBrand && common.matchSpecialCharacter(tmpBrand)){
              this.$message({
                showClose: true,
                type: 'warning',
                message: "第"+(index+1)+"行的 品牌 包含特殊字符，请检查"
              });
              return
            }
            if(tmpBrand && tmpBrand.toString().trim().length > 32){
              this.$message({
                showClose: true,
                type: 'warning',
                message: "第"+(index+1)+"行的 品牌 过长，请检查"
              });
              return
            }
            let tmpUnit = item[5]
            if(tmpUnit && common.matchSpecialCharacter(tmpUnit)){
              this.$message({
                showClose: true,
                type: 'warning',
                message: "第"+(index+1)+"行的 单位 包含特殊字符，请检查"
              });
              return
            }
            if(tmpUnit && tmpUnit.toString().trim().length > 12){
              this.$message({
                showClose: true,
                type: 'warning',
                message: "第"+(index+1)+"行的 单位 过长，请检查"
              });
              return
            }

            let num = common.fixFloat3(Number(item[6]))
            if (!num || num <= 0) {
              this.$message({
                showClose: true,
                type: 'warning',
                message: "第"+(index+1)+"行的 数量 小于或等于零，请检查"
              });
              return
            }
            let delivery_time
            if (item[7]) {
              let time = new Date(item[7]);
              let year = time.getFullYear();
              let month = time.getMonth() + 1;
              let day = time.getDate();
              //判断是否为合法时间
              if (isNaN(time.getTime())) {
                this.$message({
                  showClose: true,
                  type: 'warning',
                  message: "第"+(index+1)+"行的日期格式错误~"
                });
                return
              }
              delivery_time = [year, month, day].map(function formatNumber(n) {
                n = n.toString();
                return n[1] ? n : '0' + n;
              }).join('-');
            } else {
              this.$message({
                showClose: true,
                type: 'warning',
                message: "第"+(index+1)+"行无交货日期，请检查"
              });
              return
            }

            let price = item[8]?common.fixFloat6(Number(item[8])):''
            let tax_price = item[9]?common.fixFloat4(Number(item[9])):''
            let buyPrice = 0
            let offerPrice = 0

            if((price || price === 0) && (tax_price || tax_price === 0)){
              this.$message({
                showClose: true,
                type: 'warning',
                message: "第"+(index+1)+"行的 未税价格 和 含税价格 只能填写一个,请检查"
              });
              return
            }

            if((!price && price !== 0) && (!tax_price && tax_price !== 0)){
              this.$message({
                showClose: true,
                type: 'warning',
                message: "第"+(index+1)+"行的 未税价格 和 含税价格 必须填写一个,请检查"
              });
              return
            }
            if(price || price === 0){
              buyPrice = price
              offerPrice = common.fixFloat4(price * (1 + parseFloat(this.queryParams.valueTax.value)))
            } else if(tax_price || tax_price === 0){
              buyPrice = common.fixFloat6(tax_price / (1 + parseFloat(this.queryParams.valueTax.value)))
              offerPrice = tax_price
            }
            let tmpRemark = item[9]
            if(tmpRemark && tmpRemark.toString().trim().length > 1024){
              this.$message({
                showClose: true,
                type: 'warning',
                message: "第"+(index+1)+"行的 备注 过长，请检查"
              });
              return
            }
            let tmpElementCode = item[10]
            if(tmpElementCode && common.matchSpecialCharacter(tmpElementCode)){
              this.$message({
                showClose: true,
                type: 'warning',
                message: "第"+(index+1)+"行的 物料代码 包含特殊字符，请检查"
              });
              return
            }
            if(tmpElementCode && tmpElementCode.toString().trim().length > 24){
              this.$message({
                showClose: true,
                type: 'warning',
                message: "第"+(index+1)+"行的 物料代码 过长，请检查"
              });
              return
            }
            let tmpElementName = item[12]
            if(tmpElementName && common.matchSpecialCharacter(tmpElementName)){
              this.$message({
                showClose: true,
                type: 'warning',
                message: "第"+(index+1)+"行的 物料名称 包含特殊字符，请检查"
              });
              return
            }
            if(tmpElementName && tmpElementName.toString().trim().length > 32){
              this.$message({
                showClose: true,
                type: 'warning',
                message: "第"+(index+1)+"行的 物料名称 过长，请检查"
              });
              return
            }

            let tmpSpecCode = item[13]
            if(tmpSpecCode && common.matchSpecialCharacter(tmpSpecCode)){
              this.$message({
                showClose: true,
                type: 'warning',
                message: "第"+(index+1)+"行的 规格型号 包含特殊字符，请检查"
              });
              return
            }
            let tmpSpecStr = tmpSpecCode ? (tmpSpecCode.toString().trim() + tmpVersion) : ''
            if(tmpSpecStr && tmpSpecStr.length > 64){
              this.$message({
                showClose: true,
                type: 'warning',
                message: "第"+(index+1)+"行的 规格型号 过长，请检查"
              });
              return
            }

            let tmpWorkPieceName = item[14]
            if(tmpWorkPieceName && common.matchSpecialCharacter(tmpWorkPieceName)){
              this.$message({
                showClose: true,
                type: 'warning',
                message: "第"+(index+1)+"行的 供应商分类 包含特殊字符，请检查"
              });
              return
            }
            if(tmpWorkPieceName && tmpWorkPieceName.toString().trim().length > 16){
              this.$message({
                showClose: true,
                type: 'warning',
                message: "第"+(index+1)+"行的 供应商分类 过长，请检查"
              });
              return
            }
            // 判断输入的供应商分类是否能匹配到
            let flag = this.workpiece_define_list.some(item=>{
              if(item.name===tmpWorkPieceName){
                return true;
              }
            })
            if(!flag){
              this.$message({
                type: 'warning',
                showClose: true,
                message: `EXCEL表格第${index+1}行未匹配到供应商分类，请重新输入`,
                duration: 5000
              })
              return;
            }
            elements.push({
              buy_info: {
                buy_price: buyPrice,
                offer_price: offerPrice,
                deadline:delivery_time,
                num:num
              },
              element_info:{
                guest_element_code:item[0]?item[0].toString().trim():'',
                guest_element_name:item[1]?item[1].toString().trim():'',
                guest_spec_code: tmpStr,

                brand:item[3]?item[3].toString().trim():'',
                version:item[4]?item[4].toString().trim():'',
                unit:item[5]?item[5].toString().trim():'个',

                element_code:item[11]?item[11].toString().trim():'',
                element_name:item[12]?item[12].toString().trim():'',
                spec_code: tmpSpecStr,
                workpiece_name: item[14]?item[14].toString().trim():'',
                workpiece_id: this.switchWorkpieceNameToID(item[14])
              },
              sale_info:{
                delivery_time:'',
                sale_price: ''
              },
              trade_info:{},
              element_no:'',
              remark:item[10]?item[10].toString().trim():''
            })
          }else if(index>0){
            this.$message({
              showClose: true,
              type: 'warning',
              message: "第"+(index+1)+"行数据有误，请检查"
            })
          }
        })
      }
      this.tableData = elements
      this.$refs.imFile.value = ""
      // this.allRows = elements
      // this.rows = elements
      // this.count = elements.length
      // this.ElementList = this.allRows.slice(0, this.pageSize)
      // this.$refs.imFile.value = ""
    },
    // 转换workpiece成workpiece_id
    switchWorkpieceNameToID(name){
      let workpiece_id = "";
      let flag = this.workpiece_define_list.some(item=>{
        if(item.name===name){
          workpiece_id = item.id;
          return true;
        }
      })
      return workpiece_id;
    },
    handleRemoveMaterial(){
      let len = this.multipleSelection.length
      if(len > 0){
        this.$confirm('确定要删除所选物料吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.multipleSelection.forEach(item => {
            let n = this.tableData.indexOf(item)
            if(n > -1){
              this.tableData.splice(n, 1)
            }
          })
        }).catch(() => {

        })
      } else{
        this.$message({
          showClose: true,
          type: 'warning',
          message: '请先选择物料'
        })
      }
    },
    handleAddMaterial(data){
      if(data.length > 0){
        data.forEach(item => {
          this.tableData.push(item)
        })
      }
    },
    //保存创建的订单
    saveCreateOrder(){
      if(this.tableData.length <= 0){
        this.$message({
          showClose: true,
          message: '请至少选择一种物料',
          type: 'warning'
        })

        return
      }

      //判断表格数据是否填写完毕
      let data = this.tableData
      for(let key in data){
        let row = data[key]
        let m = Number(key) + 1

        if (!row.element_info.guest_element_name) {
          this.$message({
            showClose: true,
            type: 'warning',
            message: '第' + m + '行的物料的 对方物料名称 为空！'
          });

          return
        }

        if (!row.element_info.guest_spec_code) {
          this.$message({
            showClose: true,
            type: 'warning',
            message: '第' + m + '行的物料的 对方图号/规格型号 为空！'
          });

          return
        }

        if ((!row.buy_info.buy_price && row.buy_info.buy_price !== 0) || !row.buy_info.num) {
          this.$message({
            showClose: true,
            type: 'warning',
            message: '第' + m + '行的物料：' + row.element_info.element_name + ' 的 需求数量 或者 客户未税议价 为空！'
          });

          return
        }

        if (row.element_info.guest_spec_code && row.element_info.guest_spec_code.trim().length > 64) {
          this.$message({
            showClose: true,
            type: 'warning',
            message: '第' + m + '行的物料的 对方图号/规格型号 过长！'
          });

          return
        }

        if (row.element_info.guest_element_name && row.element_info.guest_element_name.trim().length > 32) {
          this.$message({
            showClose: true,
            type: 'warning',
            message: '第' + m + '行的物料的 对方物料名称 过长！'
          });

          return
        }
        if (row.element_info.guest_element_code && row.element_info.guest_element_code.trim().length > 24) {
          this.$message({
            showClose: true,
            type: 'warning',
            message: '第' + m + '行的物料的 对方物料代码 过长！'
          });

          return
        }
      }

      if(!this.queryParams.deadline || !this.queryParams.deliver_time){
        this.$message({
          showClose: true,
          message: '协议交货日期 或者 预计发货日期 不能为空！',
          type: 'warning'
        })
        return false
      }

      if(this.queryParams.inputOrderName && this.queryParams.inputOrderName.trim().length > 32){
        this.$message({
          showClose: true,
          message: '输入的客户订单号过长！',
          type: 'warning'
        })
        return false
      }

      if(this.queryParams.orderExplainText && this.queryParams.orderExplainText.trim().length > 1024){
        this.$message({
          showClose: true,
          message: '输入的说明过长！',
          type: 'warning'
        })
        return false
      }

      this.$confirm('确定要保存新建订单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        let elementList = []
        let data = this.tableData
        for(let i = 0; i < data.length; i ++){
          let tmp = {...data[i]}
          // tmp.remark =  data[i].remark
          // tmp.element_info = data[i].element_info
          tmp.element_info.guest_element_code = tmp.element_info.guest_element_code?tmp.element_info.guest_element_code.trim():''
          tmp.element_info.guest_element_name = tmp.element_info.guest_element_name?tmp.element_info.guest_element_name.trim():''
          tmp.element_info.guest_spec_code = tmp.element_info.guest_spec_code?tmp.element_info.guest_spec_code.trim():''

          // tmp.buy_info = data[i].buy_info
          tmp.buy_info.buy_price = parseFloat(tmp.buy_info.buy_price)
          tmp.buy_info.num = parseFloat(tmp.buy_info.num)
          tmp.buy_info.buy_type_name = this.queryParams.valueBuyType.label
          tmp.buy_info.task_code = tmp.element_info.guest_task_code?tmp.element_info.guest_task_code.trim():''
          // tmp.sale_info = data[i].sale_info
          tmp.buy_info.deadline = this.queryParams.deadline
          tmp.sale_info.delivery_time = this.queryParams.delivery_time

          tmp.trade_info = tmp.trade_info || {}
          elementList.push(tmp)
        }
        // console.log(elementList)
        let obj = {
          access_token: this.token,
          purchase_code: this.businessInfo.purchase_code,
          purchase_name: this.businessInfo.purchase_name,
          purchase_full_name: this.businessInfo.purchase_full_name,
          buyer: this.businessInfo.contact,
          buyer_phone: this.businessInfo.phone,
          receiver_address: this.businessInfo.receive_addr,
          receiver: this.businessInfo.receiver_name,
          receiver_phone: this.businessInfo.receiver_phone,
          order_describe: this.queryParams.orderExplainText?this.queryParams.orderExplainText.trim():'',
          order_use_name: this.queryParams.valueSaleType.label,
          order_use_type: this.queryParams.valueSaleType.value,
          buy_type_name: this.queryParams.valueBuyType.label,
          buy_type_code: this.queryParams.valueBuyType.value,
          tax_name: this.queryParams.valueTax.label,
          tax_value: this.queryParams.valueTax.value,
          pay_period_name: this.queryParams.valuePay.label,
          pay_period_value: this.queryParams.valuePay.value,
          element_list: elementList,
          order_name: this.queryParams.inputOrderName?this.queryParams.inputOrderName.trim():'',
          task_code: '',
          financial_book_no: this.queryParams.valueBookType
        }

        createPlanOrder(obj).then(response => {
          if (response.code == 0){
            this.$notify({
              title: '成功',
              message: '订单保存成功',
              type: 'success'
            })

            this.tableData = []
          }
        })
      })
    }
  }
}
</script>

<style lang="scss">
.createSaleOrder{
 position: relative;
}
</style>