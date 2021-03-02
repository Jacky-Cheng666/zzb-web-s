<template>
  <div class="app-container processManage">
    <div class="sideNav">
      <el-menu active-text-color="#303133" background-color="#FFFEFE" unique-opened :default-active="activeIndex" @select="clickSelect" @open="handleOpen">
          <el-submenu index="first">
            <template slot="title">
              <img style="margin-right: 10px" src="@/assets/imgs/process.png" alt="">
              <span>流程</span>
            </template>
            <el-menu-item :class="{'activeColor': radio===item.id}" v-for="item in defaultWorkFlowList" :key="item.id" :index="''+item.id">{{item.name}}</el-menu-item>
          </el-submenu>
          <el-submenu index="second">
            <template slot="title">
              <img style="margin-right: 10px" src="@/assets/imgs/assistance.png" alt="">
              <span>智能助理</span>
            </template>
            <el-menu-item :class="{'activeColor': assistantRadio===item.value}" v-for="item in toolsList" :key="item.value" :index="item.value">{{item.name}}</el-menu-item>
          </el-submenu>
      </el-menu>
    </div>
    <div class="mainContent">
      <template v-if="type==='first'">
      <!-- 启用工作流展示页面 -->
        <div v-if="showWorkflow" class="contentWrap">
          <el-button @click="startWorkFlow" type="primary" size="mini">启用流程</el-button>
        </div>
        <!-- 详细数据展示页面 -->
        <div v-show="currentWorkFlow" class="contentWrap">
          <div style="display:flex;justify-content:space-between">
            <div class="menuName">{{currentWorkFlow.name}}</div>
            <div>
              <el-button size="mini" icon="el-icon-refresh">重置</el-button>
              <el-button size="mini" type="success">
                <svg-icon icon-class="save" class-name="btn_icon_svg"></svg-icon>&nbsp;保存
              </el-button>
              <el-button size="mini" type="danger" icon="el-icon-close">关闭</el-button>
            </div>
          </div>
          <div style="height:1px;background-color:#BBBBBB;width:100%"></div>
          <div class="item">
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0, 0, 800, 960" width="800" height="960" font-size="12px" id="flowCanvas" ref="canvas"/>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="contentWrap">
          <div style="display:flex;justify-content:space-between">
            <div class="menuName">{{changeName}}</div>
            <div>
              <el-button icon="el-icon-refresh" size="mini">重置</el-button>
              <el-button icon="el-icon-check" type="success" size="mini">保存</el-button>
            </div>
          </div>
          <div style="height:1px;background-color:#BBBBBB;width:100%"></div>
          <!-- 数据详情部分 -->
          <div class="item">
            <div v-if="itemIndex==='ptm'">
              <el-checkbox label="要求上传图纸" v-model="current_ai_assist.ptm.require_drawing"></el-checkbox>
              <div class="checkBoxWord">需要加工的物料在申请采买时或者生产时，要求已经上传了相关图纸。</div>
              <el-checkbox label="自动转采买" v-model="current_ai_assist.ptm.auto_buy"></el-checkbox>
              <div class="checkBoxWord">变更审批通过后，所有物料自动转采买。多工序物料按照工序进度自动转采买（一对一外协有效）</div>
              <el-checkbox label="自动申请出库" v-model="current_ai_assist.ptm.auto_outbound_demand"></el-checkbox>
              <div class="checkBoxWord">在具备条件时，自动按照“子项目”申请出库，补充物料也自动更新进出库需求单中。</div>
              <el-checkbox label="自动变更审批" v-model="current_ai_assist.ptm.auto_approve_modify"></el-checkbox>
              <div class="checkBoxWord">如果有足够库存，自动审批通过。</div>
              <el-checkbox label="要求指定供应商分类" v-model="current_ai_assist.ptm.require_workpiece_id"></el-checkbox>
              <div class="checkBoxWord">项目中导入新物料时，要求物料有供应商分类才在物料库中自动添加新物料。</div>
              <div style="font-size:14px;color: #606266;margin-top:20px;margin-bottom:10px">自动归档项目</div>
              <div style="display:flex;align-items:center">
                <el-slider class="slider" v-model="current_ai_assist.ptm.expire_time_day" :min='1' :max="30" :step='1' />
                <span style="font-size:12px;color: #333333;margin-left:20px">拖动小球设置天数</span>
              </div>
              <div class="checkBoxWord">没有对项目操作超过【 {{current_ai_assist.ptm.expire_time_day}} 】天，系统会尝试归档项目。</div>
            </div>
            <div v-if="itemIndex==='som'">
              <el-checkbox label="自动转请购" v-model="current_ai_assist.som.auto_buy"></el-checkbox>
              <div class="checkBoxWord">订单一经审批通过，自动转请购流程。适用于不需要转生产、转项目，只是简单贸易模式的企业。</div>
              <el-checkbox label="自动加入产品价格库" v-model="current_ai_assist.som.save_product_price"></el-checkbox>
              <div class="checkBoxWord">标件产品，如果在询盘中心报过价，自动加入产品价格库。</div>
              <el-checkbox label="自动审批订单" v-model="current_ai_assist.som.auto_approve_order"></el-checkbox>
              <div class="checkBoxWord">答复了价格和交期的订单，客户在审批后，无需企业再作销售审批。</div>
            </div>
            <div v-if="itemIndex==='scm'">
              <el-checkbox label="要求上传图纸" v-model="current_ai_assist.scm.require_drawing"></el-checkbox>
              <div class="checkBoxWord">需要加工的物料在请购时，要求已经上传了相关图纸。</div>
              <el-checkbox label="自动转采买" v-model="current_ai_assist.scm.auto_buy"></el-checkbox>
              <div class="checkBoxWord">请购单审批通过后，多工序物料按照工序进度自动转采买（一对一外协有效）。</div>
              <el-checkbox :disabled="disAutoReceive" label="自动领料" v-model="current_ai_assist.scm.auto_outbound_demand"></el-checkbox>
              <div class="checkBoxWord">请购单中的物料库存充足时，自动往仓库发送出库需求单（领料）。</div>
              <el-checkbox @change="autoDeliver" label="自动出库" v-model="current_ai_assist.scm.auto_outbound"></el-checkbox>
              <div class="checkBoxWord">请购单中的物料入库后，系统定时自动出库，领料人不用去仓库领料。</div>
              <el-checkbox label="自动按照需求类型分单" v-model="current_ai_assist.scm.auto_order"></el-checkbox>
              <div class="checkBoxWord">对进入采买阶段的物料需求，按照其需求类型自动归入分单中，等待采购人员处理。</div>
              <el-checkbox label="非协同订单代理发货" v-model="current_ai_assist.scm.auto_agent_deliver"></el-checkbox>
              <div class="checkBoxWord">在非协同订单的交货日期，自动往仓库发布出库需求单（代理发货）。</div>
            </div>
            <div style="margin-top:15px" v-if="itemIndex==='wms'">
              <span>免检预设：</span>
              <el-radio-group v-model="current_ai_assist.wms.qualify_mode">
                <el-radio :label="0">免检</el-radio>
                <el-radio :label="1">抽检（只检加工件）</el-radio>
                <el-radio :label="2">全检</el-radio>
              </el-radio-group>
            </div>
            <div style="margin-top:15px" v-if="itemIndex==='finance'">
              <span>设置对账日期：</span>
              <el-select
                size="mini"
                v-model="current_ai_assist.finance.check_date"
                placeholder="请选择对账日期"
              >
                <el-option label="每月25日对账" :value="25"></el-option>
                <el-option label="每月26日对账" :value="26"></el-option>
                <el-option label="每月27日对账" :value="27"></el-option>
                <el-option label="每月28日对账" :value="28"></el-option>
                <el-option label="自然月对账" :value="0"></el-option>
              </el-select>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
const WORK_POINT_CREATE = 0; //发起
const WORK_POINT_APPROVE = 1; //审批
const WORK_POINT_ACCESS = 2; //执行
const WORK_POINT_COPY = 3; //抄送
const WORK_POINT_AUTO_FORWARD = 4; //自动执行当前步骤
const WORK_POINT_CONDITION = 9; //条件分支

const FORM_PARAM_STAFF = 0; //工作人员
const FORM_PARAM_NUMBER = 1; //数字
const FORM_PARAM_STRING = 2; //字符串
const FORM_PARAM_DATE = 3; //日期
const FORM_PARAM_CHECKBOX = 4; //多选框
const FORM_PARAM_RADIO = 5; //单选框

const PARAM_OPERATOR_LT = 0; //小于
const PARAM_OPERATOR_LTE = 1; //小于等于
const PARAM_OPERATOR_E = 2; //等于
const PARAM_OPERATOR_MTE = 3; //大于等于
const PARAM_OPERATOR_MT = 4; //大于
const PARAM_OPERATOR_IN = 5; //介于两个数字之间
const PARAM_OPERATOR_AND = 6; //包含所有（与）
const PARAM_OPERATOR_OR = 7; //包含任意（或）

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 960;
const ITEM_WIDTH = 200;
const ITEM_HEIGHT = 120;
const RECT_WIDTH = 180;
const RECT_HEIGHT = 60;
const RECT_HEADER_HEIGHT = 24;
const RECT_BODY_HEIGHT = 36;
const FONT_SIZE = 8;


export default {
  name: "processManage",
  data() {
    return {
      itemIndex: "ptm",
      staff_list_all: [{"staff_id":410,"name":"何丽丽","phone":"15994747589","employee_id":"123456"},{"staff_id":411,"name":"客户","phone":"15889985372","employee_id":"46541"},{"staff_id":412,"name":"加宽了","phone":"15889372548","employee_id":"10052"},{"staff_id":414,"name":"科技","phone":"16484564246","employee_id":"1065456"},{"staff_id":415,"name":"卡机是","phone":"15498456452","employee_id":"1230121"},{"staff_id":416,"name":"速度来","phone":"15884548554","employee_id":"123456"},{"staff_id":535,"name":"小丽","phone":"16800001999"},{"staff_id":871,"name":"天天","phone":"16912345678","employee_id":"008"},{"staff_id":878,"name":"大厦","phone":"16810001018","employee_id":"N001"},{"staff_id":880,"name":"大致","phone":"16712345678","employee_id":"0002"},{"staff_id":881,"name":"XX","phone":"16987654321","employee_id":"156"},{"staff_id":882,"name":"ss","phone":"16887654321","employee_id":"158"},{"staff_id":883,"name":"14701234567","phone":"14701234567","employee_id":"0589"},{"staff_id":884,"name":"16801234567","phone":"16801234567","employee_id":"1360"},{"staff_id":267,"name":"张学友","phone":"13412345678","employee_id":"zzb0004"},{"staff_id":138,"name":"标品采购员","phone":"13212345678","employee_id":"zzb0007"},{"staff_id":396,"name":"黎明","phone":"13612345678","employee_id":"zzb0006"},{"staff_id":536,"name":"Tony","phone":"16800001998","employee_id":"101"},{"staff_id":403,"name":"新员工2","phone":"16809098888","employee_id":"00099"},{"staff_id":900,"name":"阶级","phone":"15272419008"},{"staff_id":409,"name":"人","phone":"13454545654","employee_id":"999"},{"staff_id":936,"name":"陈卫明","phone":"15272419009"},{"staff_id":1,"name":"刘浩1","phone":"13480949851"}],
      job_list_all: [{"job_id":10001,"job_name":"采购经理","auth_list":[101,103,105,200,202,204,205,300,100,301,305,304,306,303,307,402,405,401,400,404,403,503,507,506,502,505,504,500,601,602,603,308,501,302,209,108,104,107,109,110,102,201,206,210,211,207,203,213,212,208,508,512,513,509,510,514,511,310]},{"job_id":10002,"job_name":"采购工程师","auth_list":[300,304,307,302,303,514,500,504,508,509,505,501,502,506,510,511,507,503,110,109,108,107,104,101,200,204,208,209,205,201,202,206,210,211,207,203,212,407,401,409,317]},{"job_id":10003,"job_name":"采购助理","auth_list":[300,301,302,303,306,307]},{"job_id":10006,"job_name":"销售经理","auth_list":[102,400,401,402,403,404,405]},{"job_id":10007,"job_name":"销售工程师","auth_list":[400,401,403,404,405]},{"job_id":10008,"job_name":"销售助理","auth_list":[401,403,404,405]},{"job_id":10011,"job_name":"研发经理","auth_list":[312]},{"job_id":10012,"job_name":"研发工程师","auth_list":[]},{"job_id":10013,"job_name":"研发助理","auth_list":[]},{"job_id":10016,"job_name":"生产经理","auth_list":[]},{"job_id":10017,"job_name":"生产操作员","auth_list":[]},{"job_id":10022,"job_name":"工艺工程师","auth_list":[208]},{"job_id":10026,"job_name":"仓库管理员","auth_list":[500,501,502,503,504,510,508]},{"job_id":10031,"job_name":"财务经理","auth_list":[503,504,505,506,507,600,601,602,603]},{"job_id":10032,"job_name":"客人","auth_list":[]},{"job_id":11000,"job_name":"公司高管","auth_list":[100,101,102,103,105,200,201,202,203,204,205,206,207,208,209,300,301,302,303,304,305,306,307,400,401,402,403,404,405,500,501,502,503,504,505,506,507,600,601,602,603,107]},{"job_name":"总财务部","auth_list":[100,104,200,204,208,300,304,400,404,500,504,600,601,505,501,405,401,305,301,205,201,105,101,102,202,206,302,306,402,502,506,602,603,503,403,307,303,207,203,103,109,108,209,210,510,511],"job_id":8},{"job_name":"总参谋部","auth_list":[],"job_id":9},{"job_name":"ABC","auth_list":[100,104],"job_id":10}],
      department_list_all: [{"name":"管理层部","staff_list":[{"staff_id":410,"name":"何丽丽","phone":"15994747589","employee_id":"123456"},{"staff_id":411,"name":"客户","phone":"15889985372","employee_id":"46541"},{"staff_id":412,"name":"加宽了","phone":"15889372548","employee_id":"10052"},{"staff_id":414,"name":"科技","phone":"16484564246","employee_id":"1065456"},{"staff_id":415,"name":"卡机是","phone":"15498456452","employee_id":"1230121"},{"staff_id":416,"name":"速度来","phone":"15884548554","employee_id":"123456"},{"staff_id":535,"name":"小丽","phone":"16800001999"},{"staff_id":871,"name":"天天","phone":"16912345678","employee_id":"008"},{"staff_id":878,"name":"大厦","phone":"16810001018","employee_id":"N001"},{"staff_id":880,"name":"大致","phone":"16712345678","employee_id":"0002"},{"staff_id":881,"name":"XX","phone":"16987654321","employee_id":"156"},{"staff_id":882,"name":"ss","phone":"16887654321","employee_id":"158"},{"staff_id":883,"name":"14701234567","phone":"14701234567","employee_id":"0589"},{"staff_id":884,"name":"16801234567","phone":"16801234567","employee_id":"1360"}],"id":1,"head_staff_id":880},{"name":"采购部","staff_list":[{"staff_id":267,"name":"张学友","phone":"13412345678","employee_id":"zzb0004"},{"staff_id":138,"name":"标品采购员","phone":"13212345678","employee_id":"zzb0007"},{"staff_id":396,"name":"黎明","phone":"13612345678","employee_id":"zzb0006"},{"staff_id":536,"name":"Tony","phone":"16800001998","employee_id":"101"}],"id":2,"head_staff_id":267},{"name":"销售中心","staff_list":[{"staff_id":403,"name":"新员工2","phone":"16809098888","employee_id":"00099"},{"staff_id":900,"name":"阶级","phone":"15272419008"}],"id":3,"head_staff_id":403},{"name":"研发中心","staff_list":[],"id":4},{"name":"生产部","staff_list":[{"staff_id":409,"name":"人","phone":"13454545654","employee_id":"999"}],"id":5,"head_staff_id":409},{"name":"仓储中心","staff_list":[{"staff_id":936,"name":"陈卫明","phone":"15272419009"},{"staff_id":1,"name":"刘浩1","phone":"13480949851"}],"id":6,"head_staff_id":936},{"name":"项目中心","staff_list":[],"id":7},{"name":"财务部","staff_list":[],"id":8},{"name":"项目管理中心","staff_list":[],"id":9}],
      activeIndex: '',
      defaultWorkFlowList: [{"id":101,"name":"变更审批","form":[],"work_point_list":[{"type":0,"name":"提交变更","all_staff":true,"department_list":[],"staff_list":[],"job_list":[],"timeChecked":false},{"type":1,"name":"变更审批","worker":1,"staff_list":[],"job_list":[],"all_approve":0,"duration":0,"skip":false,"timeChecked":false}]},{"id":201,"name":"请购审批","form":[{"type":1,"name":"预估金额","enable":true}],"work_point_list":[{"type":0,"name":"提交请购","all_staff":true,"department_list":[],"staff_list":[],"job_list":[],"timeChecked":false},{"type":9,"condition_list":[{"condition":[{"index":0,"operator":1,"value":[1000]}],"work_point_list":[{"type":4,"name":"请购审批","all_staff":true,"worker":1,"staff_list":[],"job_list":[],"all_approve":0,"duration":0,"skip":false}]},{"condition":[{"index":0,"operator":4,"value":[1000]}],"work_point_list":[{"type":1,"name":"请购审批","worker":0,"staff_list":[],"job_list":[],"all_approve":0,"duration":0,"skip":false}]}],"timeChecked":false},{"type":1,"name":"财务审核","worker":1,"staff_list":[],"job_list":[],"all_approve":0,"duration":0,"skip":false,"timeChecked":false}]},{"id":301,"name":"采购审批","form":[],"work_point_list":[{"type":0,"name":"发布订单","all_staff":true,"department_list":[],"staff_list":[],"job_list":[],"timeChecked":false},{"type":1,"name":"订单审核","worker":1,"staff_list":[],"job_list":[],"all_approve":0,"duration":0,"skip":false,"timeChecked":false},{"type":1,"name":"订单审批","worker":1,"staff_list":[],"job_list":[],"all_approve":0,"duration":0,"skip":false,"timeChecked":false}]},{"id":401,"name":"销售审批","form":[],"work_point_list":[{"type":0,"name":"发布订单","all_staff":true,"department_list":[],"staff_list":[],"job_list":[],"timeChecked":false},{"type":1,"name":"订单审核","worker":1,"staff_list":[],"job_list":[],"all_approve":0,"duration":0,"skip":false,"timeChecked":false},{"type":1,"name":"订单审批","worker":1,"staff_list":[],"job_list":[],"all_approve":0,"duration":0,"skip":false,"timeChecked":false}]},{"id":501,"name":"付款审批","form":[],"work_point_list":[{"type":0,"name":"新建付款计划","all_staff":true,"department_list":[],"staff_list":[],"job_list":[],"timeChecked":false},{"type":1,"name":"付款审批","worker":1,"staff_list":[],"job_list":[],"all_approve":0,"duration":0,"skip":false,"timeChecked":false}]},{"id":601,"name":"报销审批","form":[],"work_point_list":[{"type":0,"name":"报销申请","all_staff":true,"department_list":[],"staff_list":[],"job_list":[],"timeChecked":false},{"type":1,"name":"部门审核","worker":0,"staff_list":[],"job_list":[],"all_approve":0,"duration":0,"skip":false,"timeChecked":false},{"type":1,"name":"财务审批","worker":1,"staff_list":[],"job_list":[],"all_approve":0,"duration":0,"skip":false,"timeChecked":false}]}],
      toolsList: [{"name":"项目助理","value":"ptm"},{"name":"销售助理","value":"som"},{"name":"采购助理","value":"scm"},{"name":"仓库助理","value":"wms"},{"name":"财务助理","value":"finance"}],
      radio: '',
      assistantRadio: "ptm",
      type: 'first',
      showWorkflow: false,
      currentWorkFlow: {"id":101,"name":"变更审批","form":[],"work_point_list":[{"type":0,"name":"提交变更","all_staff":true,"department_list":[],"staff_list":[],"job_list":[],"timeChecked":false,"id":"id310-30"},{"type":1,"name":"变更审批","worker":1,"staff_list":[410,411],"job_list":[],"all_approve":0,"duration":0,"skip":false,"id":"id310-150"}]},
      toolsList: [
        {
          name: "项目助理",
          value: "ptm",
        },
        {
          name: "销售助理",
          value: "som",
        },
        {
          name: "采购助理",
          value: "scm",
        },
        {
          name: "仓库助理",
          value: "wms",
        },
        {
          name: "财务助理",
          value: "finance",
        },
      ],
      current_ai_assist: {"scm":{"require_drawing":true,"auto_buy":true,"auto_outbound_demand":true,"auto_outbound":true,"auto_order":true},"som":{"auto_inbound":false,"auto_buy":false,"auto_deliver":false,"save_product_price":false,"auto_approve_order":true},"ptm":{"require_drawing":true,"auto_buy":false,"auto_outbound_demand":true,"auto_approve_modify":true,"require_workpiece_id":false,"expire_time_day":18},"wms":{"qualify_mode":0},"finance":{"check_date":0}}
    };
  },
  computed: {
    changeName() {
      if (this.assistantRadio === "finance") {
        return "财务助理";
      } else if (this.assistantRadio === "ptm") {
        return "项目助理";
      } else if (this.assistantRadio === "scm") {
        return "采购助理";
      } else if (this.assistantRadio === "som") {
        return "销售助理";
      } else if (this.assistantRadio === "wms") {
        return "仓库助理";
      }
    },
  },
  mounted() {
    this.drawWorkFlow(this.currentWorkFlow);
  },
  created() {
    
  },
  methods: {
    clickSelect(){},
    handleOpen(key){
      this.type = key;
    },
    startWorkFlow(){},
    drawWorkFlow(workFlow) {
      if (!workFlow)return;
      
      //获取画布并清空画布
      let ctx = this.$refs.canvas;
      while (0 < ctx.childNodes.length) {
        ctx.removeChild(ctx.childNodes[0]);
      }

      //跟进图形大小重置画布大小
      let size = this.getSize(workFlow.work_point_list);
      size.width = CANVAS_WIDTH < size.width ? size.width : CANVAS_WIDTH;
      size.height = CANVAS_HEIGHT < size.height ? size.height : CANVAS_HEIGHT;

      let height = (CANVAS_WIDTH * size.height) / size.width;
      ctx.setAttribute("viewBox", "0, 0, " + size.width + ", " + size.height);
      ctx.setAttribute("height", height);

      let y = this.drawWorkPoint(ctx,0,0,size.width,workFlow.work_point_list,workFlow.form);
      this.drawText(ctx,"流程结束",size.width / 2,y + FONT_SIZE * 2,"#808080","middle");
    },
    drawWorkPoint(ctx, x, y, width, workPointList, form) {
      if (!workPointList || 0 == workPointList.length) {
        return y;
      }

      workPointList.forEach((point) => {
        if (!point) {
          return;
        }

        if (WORK_POINT_CONDITION !== point.type) {
          let xx = x + (width - ITEM_WIDTH) / 2;

          this.drawPoint(ctx, xx, y, point);

          y += ITEM_HEIGHT;
        } else {
          let ww = ITEM_WIDTH * point.condition_list.length,
            xpos = x + (width - ww) / 2;
          let xx = xpos, ypos = 0, xend = xx, cx = 0;

          point.condition_list.forEach((condition, i) => {
            if (!condition) {
              return;
            }

            let w = this.getWidth(condition);
            let xxx = xx + (w - ITEM_WIDTH) / 2, yy = 0;

            this.drawCondition(ctx, xxx, y, condition, i + 1, form);

            if (condition.work_point_list && 0 < condition.work_point_list.length) {
              yy = this.drawWorkPoint(ctx, xx, y + ITEM_HEIGHT, w, condition.work_point_list, form);
            } else {
              yy = y + ITEM_HEIGHT;
            }

            xx += w;
            xend = xx - w / 2;
            cx += w;
            ypos = yy < ypos ? ypos : yy;
          });

          //补线
          xx = xpos;
          point.condition_list.forEach((condition) => {
            if (!condition) {
              return;
            }

            let w = this.getWidth(condition);
            let h = this.getHeight(condition);
            let xxx = xx + (w - ITEM_WIDTH) / 2;

            if (y + h < ypos) {
              this.drawLine(ctx, xxx + ITEM_WIDTH / 2, y + h, xxx + ITEM_WIDTH / 2, ypos, "#808080");
            }

            xx += w;
          });

          xx = xend - cx / 2;
          //顶横线
          this.drawLine(ctx, xx, y, xend, y, "#808080");
          //底横线
          this.drawLine(ctx, xx, ypos, xend, ypos, "#808080");

          ypos += RECT_HEIGHT / 2;
          //尾线
          this.drawLine( ctx, xpos + cx / 2, ypos - RECT_HEIGHT / 2, xpos + cx / 2, ypos, "#808080");

          y = ypos;
        }
      });

      return y;
    },
    drawLine(ctx, x1, y1, x2, y2, color) {
      let node = document.createElementNS("http://www.w3.org/2000/svg", "line");
      node.setAttribute("x1", x1);
      node.setAttribute("y1", y1);
      node.setAttribute("x2", x2);
      node.setAttribute("y2", y2);
      node.setAttribute("style", "stroke:" + color + ";" + "stroke-width:1;");

      ctx.appendChild(node);
    },
    drawRect(ctx, x, y, cx, cy, color, fill) {
      let node = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      node.setAttribute("x", x);
      node.setAttribute("y", y);
      node.setAttribute("width", cx);
      node.setAttribute("height", cy);

      if (fill) {
        node.setAttribute(
          "style",
          "fill:" + color + ";" + "stroke:" + color + ";" + "stroke-width:1;"
        );
      } else {
        node.setAttribute(
          "style",
          "fill:white" + ";" + "stroke:" + color + ";" + "stroke-width:1;"
        );
      }

      let id = "id" + x + "-" + y;
      node.setAttribute("id", id);
      node.addEventListener("click", this.onPoint);

      ctx.appendChild(node);

      return id;
    },
    drawText(ctx, text, x, y, color, align) {
      let node = document.createElementNS("http://www.w3.org/2000/svg", "text");
      node.setAttribute("x", x);
      node.setAttribute("y", y);
      node.setAttribute("fill", color);
      node.setAttribute("text-anchor", align);

      text = text.slice(0, 15);
      let textNode = document.createTextNode(text);
      node.appendChild(textNode);

      ctx.appendChild(node);
    },
    drawPoint(ctx, x, y, point) {
      x += (ITEM_WIDTH - RECT_WIDTH) / 2;

      if (WORK_POINT_CREATE === point.type) {
        point.id = this.drawRect(ctx, x, y + RECT_HEIGHT / 2, RECT_WIDTH, RECT_HEIGHT, "#00A0E9");
        this.drawRect( ctx, x, y + RECT_HEIGHT / 2, RECT_WIDTH, RECT_HEADER_HEIGHT, "#00A0E9", true);

        this.drawText(ctx, "发起：" + point.name, x + RECT_WIDTH / 2, y + RECT_HEIGHT / 2 + (RECT_HEADER_HEIGHT - FONT_SIZE), "#FFFFFF", "middle");
        this.drawText(ctx, this.getCaptionForPoint(point), x + 8, y + RECT_HEIGHT / 2 + RECT_HEADER_HEIGHT + (RECT_BODY_HEIGHT - FONT_SIZE) / 2, "#000000", "left");

        this.drawLine(ctx, x + RECT_WIDTH / 2, y + RECT_HEIGHT + RECT_HEIGHT / 2, x + RECT_WIDTH / 2, y + RECT_HEIGHT + RECT_HEIGHT, "#808080");
      } else if (WORK_POINT_APPROVE === point.type) {
        this.drawLine(ctx, x + RECT_WIDTH / 2, y, x + RECT_WIDTH / 2, y + RECT_HEIGHT / 2, "#808080");

        point.id = this.drawRect(ctx, x, y + RECT_HEIGHT / 2, RECT_WIDTH, RECT_HEIGHT, "#F08734");
        this.drawRect(ctx, x, y + RECT_HEIGHT / 2, RECT_WIDTH, RECT_HEADER_HEIGHT, "#F08734", true);

        this.drawText(ctx, "审批：" + point.name, x + RECT_WIDTH / 2, y + RECT_HEIGHT / 2 + (RECT_HEADER_HEIGHT - FONT_SIZE), "#FFFFFF", "middle");
        this.drawText(ctx, this.getCaptionForPoint(point), x + 8, y + RECT_HEIGHT / 2 + RECT_HEADER_HEIGHT + (RECT_BODY_HEIGHT - FONT_SIZE) / 2, "#000000", "left");

        this.drawLine(ctx, x + RECT_WIDTH / 2, y + RECT_HEIGHT + RECT_HEIGHT / 2, x + RECT_WIDTH / 2, y + RECT_HEIGHT + RECT_HEIGHT, "#808080");
      } else if (WORK_POINT_ACCESS === point.type) {
        this.drawLine( ctx, x + RECT_WIDTH / 2, y, x + RECT_WIDTH / 2, y + RECT_HEIGHT / 2, "#808080");

        point.id = this.drawRect(ctx, x, y + RECT_HEIGHT / 2, RECT_WIDTH, RECT_HEIGHT, "#16B90B");
        this.drawRect(ctx, x, y + RECT_HEIGHT / 2, RECT_WIDTH, RECT_HEADER_HEIGHT, "#16B90B", true);

        this.drawText(ctx, "办理：" + point.name, x + RECT_WIDTH / 2, y + RECT_HEIGHT / 2 + (RECT_HEADER_HEIGHT - FONT_SIZE), "#FFFFFF", "middle");
        this.drawText(ctx, this.getCaptionForPoint(point), x + 8, y + RECT_HEIGHT / 2 + RECT_HEADER_HEIGHT + (RECT_BODY_HEIGHT - FONT_SIZE) / 2, "#000000", "left");

        this.drawLine(ctx, x + RECT_WIDTH / 2, y + RECT_HEIGHT + RECT_HEIGHT / 2, x + RECT_WIDTH / 2, y + RECT_HEIGHT + RECT_HEIGHT, "#808080");
      } else {
        this.drawLine(ctx, x + RECT_WIDTH / 2, y, x + RECT_WIDTH / 2, y + RECT_HEIGHT + RECT_HEIGHT,"#808080");
      }
    },
    getCaptionForPoint(point) {
      if (point) {
        if (WORK_POINT_CREATE === point.type) {
          if (point.all_staff) {
            return "所有人";
          } else {
            if (point.department_list && 0 < point.department_list.length) {
              let names = [];
              this.department_list_all.forEach((depart) => {
                for (let i in point.department_list) {
                  let id = point.department_list[i];
                  if (id === depart.id) {
                    names.push(depart.name);
                  }
                }
              });
              return names.join(",");
            } else if (point.job_list && 0 < point.job_list.length) {
              let jobs = [];
              this.job_list_all.forEach((job) => {
                for (let i in point.job_list) {
                  let id = point.job_list[i];
                  if (id === job.id) {
                    jobs.push(job.name);
                  }
                }
              });
              return jobs.join(",");
            } else if (point.staff_list && 0 < point.staff_list.length) {
              let names = [];
              this.staff_list_all.forEach((staff) => {
                for (let i in point.staff_list) {
                  let id = point.staff_list[i];
                  if (id === staff.staff_id) {
                    names.push(staff.name);
                  }
                }
              });
              return names.join(",");
            } else {
              return "无指定人员";
            }
          }
        } else {
          if (point.skip) {
            return "跳过此节点";
          } else {
            if (1 === point.worker) {
              if (point.staff_list && 0 < point.staff_list.length) {
                let names = [];
                this.staff_list_all.forEach((staff) => {
                  for (let i in point.staff_list) {
                    let id = point.staff_list[i];
                    if (id === staff.staff_id) {
                      names.push(staff.name);
                    }
                  }
                });
                return names.join(",");
              } else {
                return "无指定人员";
              }
            } else if (2 === point.worker) {
              if (point.job_list && 0 < point.job_list.length) {
                let jobs = [];
                this.job_list_all.forEach((job) => {
                  for (let i in point.job_list) {
                    let id = point.job_list[i];
                    if (id === job.job_id) {
                      jobs.push(job.job_name);
                    }
                  }
                });
                return jobs.join(",");
              } else {
                return "无指定人员";
              }
            } else {
              return "直接主管";
            }
          }
        }
      } else {
        return "无效节点";
      }
    },
    getSize(workPointList) {
      if (!workPointList || 0 == workPointList.length) {
        return {
          width: 0,
          height: 0,
        };
      }

      let w = ITEM_WIDTH,
        h = 0;
      workPointList.forEach((point) => {
        if (!point) {
          return;
        }

        if (WORK_POINT_CONDITION === point.type) {
          let ww = 0,
            hh = 0;

          point.condition_list.forEach((condition) => {
            if (!condition) {
              return;
            }

            if (
              condition.work_point_list &&
              0 < condition.work_point_list.length
            ) {
              let size = this.getSize(condition.work_point_list);

              ww += size.width;
              hh = size.height < hh ? hh : size.height;
              hh += ITEM_HEIGHT / 2;
            } else {
              ww += ITEM_WIDTH;
            }
          });

          hh += ITEM_HEIGHT;
          w = ww < w ? w : ww;
          h += hh;
        } else {
          h += ITEM_HEIGHT;
        }
      });

      return {
        width: w,
        height: h,
      };
    },
  },
};
</script>

<style lang="scss">
.processManage {
  background-color: #f6f6f6;
  display: flex;
  .sideNav {
    width: 170px;
  }
  .mainContent {
    margin-left: 10px;
    flex: 1;
    background-color: #fff;
    padding: 10px;
    .contentWrap {
      padding: 10px;
      background-color: white;
      border-radius: 5px;
      padding-bottom: 50px;
      .menuName {
        font-size: 16px;
        font-weight: 700;
        margin-bottom: 20px;
        border-left: 4px solid #00A0E9;
        padding-left: 10px
      }
      .item {
        padding-left: 10px;
        // text-align: center;

        .el-checkbox {
          display: block;
          line-height: 50px;
        }

        .checkBoxWord {
          height: 10px;
          font-size: 12px;
          padding-left: 25px;
          margin-bottom: 10px;
        }
        .slider{
          margin-left: 30px;
          width: 20%
        }
      }
    }
  }
  .activeColor{
    background:#E5E5E5 !important
  }
  .el-submenu__title {
    background-color: #00A0E9 !important;
    color: #ffffff;
    width: 170px;
    &:first-child {
      border-bottom: 1px solid #fff;
    }
  }
  .el-submenu .el-menu-item {
    min-width: 170px!important;
  }
}
</style>