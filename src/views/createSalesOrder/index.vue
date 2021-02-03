<template>
  <div class="app-container createSalesOrder">
    <fieldset class="field" v-show="showSearch">
      <legend>销售订单信息：</legend>
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item label="客户">
          <el-select placeholder="选择客户" v-model="queryParams.pay_period" size="small" style="width: 310px">
            <el-option label="全部" value="全部"></el-option>
            <el-option label="预付" value="预付"></el-option>
            <el-option label="到付" value="到付"></el-option>
            <el-option label="月结" value="月结"></el-option>
            <el-option label="自建" value="自建"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" label-width="50px">
          <el-select v-model="queryParams.type" size="small" style="width: 102px">
            <el-option label="销售" value="销售"></el-option>
            <el-option label="借用" value="借用"></el-option>
            <el-option label="租赁" value="租赁"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结款方式" label-width="80px">
          <el-select v-model="queryParams.pay_period" size="small" style="width: 102px">
            <el-option label="全部" value="全部"></el-option>
            <el-option label="预付" value="预付"></el-option>
            <el-option label="到付" value="到付"></el-option>
            <el-option label="月结" value="月结"></el-option>
            <el-option label="自建" value="自建"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="税率" label-width="50px">
          <el-select v-model="queryParams.tax_name" size="small" style="width: 100px">
            <el-option label="普票" value="all"></el-option>
            <el-option label="1%" value="notVoice"></el-option>
            <el-option label="6%" value="invoiced"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择账本" label-width="80px">
          <el-select v-model="queryParams.finance_book_no" size="small" style="width: 102px">
            <el-option label="默认账本" value="all"></el-option>
            <el-option label="账本1" value="notVoice"></el-option>
            <el-option label="账本4" value="invoiced"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单号" label-width="70px">
          <el-input v-model="queryParams.inputValue" placeholder="输入客户订单号" clearable size="small" style="width: 200px"/>
        </el-form-item>
        <el-form-item label="订单说明">
          <el-input v-model="queryParams.remark" placeholder="输入订单说明" clearable size="small" style="width: 500px"/>
        </el-form-item>
        <el-form-item label="不开票" label-width="70px">
          <!-- <el-checkbox size="small" border v-model="queryParams.invoice">不开票</el-checkbox> -->
          <el-switch v-model="queryParams.invoice"></el-switch>
        </el-form-item>
        <el-form-item label="已付迄" label-width="70px">
          <!-- <el-checkbox size="small" border v-model="queryParams.payed">已付迄</el-checkbox> -->
          <el-switch v-model="queryParams.payed"></el-switch>
        </el-form-item>
        <el-form-item label="协议交货日期" label-width="100px">
          <el-date-picker :clearable="false" style="width:140px" size="small" v-model="queryParams.deliver_time" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="预计发货日期" label-width="100px">
          <el-date-picker :clearable="false" style="width:140px" size="small" v-model="queryParams.deliver_time" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="付款计划" label-width="80px">
          <el-badge :value="plan_list.length" class="item" type="primary">
            <el-button @click="editPlan" type="primary" size="mini">编辑</el-button>
          </el-badge>
        </el-form-item>
        <el-form-item label="收货地址" label-width="80px">
          <el-badge :value="1" class="item" type="primary">
            <el-button type="primary" size="mini">编辑</el-button>
          </el-badge>
        </el-form-item>
      </el-form>
    </fieldset>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="info" icon="el-icon-back" size="mini">取消</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button @click="batchAddClick" type="primary" icon="el-icon-plus" size="mini">批量新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button @click="addElement" type="primary" icon="el-icon-plus" size="mini">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" icon="el-icon-upload2" size="mini">导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" icon="el-icon-folder-add" size="mini">暂存</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" icon="el-icon-check" size="mini">提交</el-button>
      </el-col>
      <el-tooltip style="float:right;margin-right:6px" effect="dark" :content="showSearch ? '隐藏表单' : '显示表单'" placement="top">
        <el-button size="mini" circle icon="el-icon-view" @click="toggleSearch()" />
      </el-tooltip>
    </el-row>

    <el-table v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column align="center" label="名称" prop="element_name" width="180" />
      <el-table-column align="center" label="型号" prop="spec_code" width="240" />
      <el-table-column align="center" label="品牌" prop="brand" width="100" />
      <el-table-column align="center" label="单位" prop="unit" width="60" />
      <el-table-column align="center" label="数量" prop="num" width="80" />
      <el-table-column align="center" label="未税价格" prop="total_money" width="100" />
      <el-table-column align="center" label="税金" prop="tax_amount" width="100" ></el-table-column>
      <el-table-column align="center" label="税价合计" prop="total_money_with_tax" width="100" />
      <el-table-column align="center" label="物料代码" prop="total_money_with_tax" width="100" />
      <el-table-column align="center" label="客户物料名称" prop="total_money_with_tax" width="100" />
      <el-table-column align="center" label="客户物料型号" prop="total_money_with_tax" width="100" />
      <el-table-column align="center" label="客户物料代码" prop="total_money_with_tax" width="100" />
      <el-table-column align="center" label="客户项目号" prop="total_money_with_tax" width="100" />
      <el-table-column align="center" label="备注" prop="remark" width="200" />
      <el-table-column fixed="right" align="center" label="操作" width="70">
        <template>
          <el-button @click="editElement" size="mini" type="text" icon="el-icon-edit">修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList"/>

    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :custom-style="myBackToTopStyle" :visibility-height="300" :back-position="0" transition-name="fade" />
    </el-tooltip>

    <pay-plan v-model="plan_list" ref="payPlan"></pay-plan>

    <element-info myElementTitleName="我方产品信息" titleName="产品信息" ref="elementInfo">
      <template slot="content-wrap">
        <el-form-item label="客户物料信息：" label-width="110px">
          <el-form-item label="名称" prop="guest_element_name">
              <el-input v-model="elementInfoForm.guest_element_name" placeholder="输入名称" clearable size="small" style="width: 260px"/>
          </el-form-item>
          <el-form-item label="代码" prop="guest_element_code">
              <el-input v-model="elementInfoForm.guest_element_code" placeholder="输入代码" clearable size="small"/>
          </el-form-item>
          <el-form-item label="型号" prop="spec_code">
              <el-input v-model="elementInfoForm.guest_spec_code" placeholder="输入型号" clearable size="small" style="width: 260px"/>
          </el-form-item>
          <el-form-item label="项目" prop="guest_task_code">
              <el-input v-model="elementInfoForm.guest_task_code" placeholder="输入项目" clearable size="small"/>
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <div>交易信息：</div>
          <el-form-item label="数量" prop="trade_num" style="margin-right:126px">
              <el-input v-model="elementInfoForm.trade_num" placeholder="输入数字" clearable size="small" style="width: 100px"/>
          </el-form-item>
          <el-form-item>
              <el-form-item label="未税价" label-width="70px">
                  <el-switch v-model="elementInfoForm.noTax"></el-switch>
              </el-form-item>
              <el-form-item label="价格">
                  <el-input v-model="elementInfoForm.price" placeholder="输入数字" clearable size="small" style="width: 120px;"/>
              </el-form-item>
          </el-form-item>
        </el-form-item>
      </template>
    </element-info>

    <battch-add ref="battchAdd"></battch-add>
  </div>
</template>

<script>
import payPlan from './components/payPlanDialog'
import elementInfo from '../../components/elementInfo'
const battchAdd = ()=>import('./components/batchAdd')
export default {
  name: 'createSalesOrder',
  components:{payPlan,elementInfo,battchAdd},
  data() {
    return {
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
        pay_period: '',
        tax_name: 'all',
        finance_book_no: 'all',
        inputValue: '',
        remark: '',
        invoice: true,
        payed: false,
        deliver_time: new Date(),
        pageNum: 1,
        pageSize: 20
      },
      showSearch: true,
      loading: false,
      tableData: [{element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
        {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
        {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
        {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
        {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
        {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
        {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
        {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
        {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
        {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
        {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
        {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
        {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
        {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
        {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
        {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
        {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
        {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
        {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
        {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
        {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
        {element_name:'特斯拉汽车',spec_code:'Model3 高级版 磨砂黑',brand:'特斯拉',unit: '个',num:999,total_money:9999,remark:'我是一条备注'},
      ],
      total: 0,
      plan_list:[{pay_time:new Date(),pay_money:"",percent:"",remark:"",payed:false}],
      elementInfoForm:{}
    }
  },
  methods: {
    handleSelectionChange(){},
    toggleSearch(){
      this.showSearch = !this.showSearch
    },
    getList(){},
    editPlan(){
      this.$refs.payPlan.openPlan = true;
    },
    addElement(){
      this.$refs.elementInfo.openElementInfo = true;
    },
    editElement(){
      this.$refs.elementInfo.openElementInfo = true;
    },
    batchAddClick(){
      this.$refs.battchAdd.openBatchAdd = true;
    }
  },
}
</script>

<style lang="scss">
.createSalesOrder{
 position: relative;
}
</style>