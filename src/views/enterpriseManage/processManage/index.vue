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
              <el-button @click="resetCurrentWorkFlow" size="mini" icon="el-icon-refresh">重置</el-button>
              <el-button @click="saveWorkFlow" size="mini" type="success">
                <svg-icon icon-class="save" class-name="btn_icon_svg" />&nbsp;保存
              </el-button>
              <el-button @click="disableWorkFlow" size="mini" type="danger" icon="el-icon-close">关闭</el-button>
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
              <el-button type="success" size="mini">
                <svg-icon icon-class="save" class-name="btn_icon_svg" />&nbsp;保存
              </el-button>
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
import { get_default_workflow_template, get_workflow_template, get_ai_assist_config, edit_workflow_template,
delete_workflow_template } from '@/api/enterpriseManage'
import { mapGetters } from 'vuex'
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
      staff_list_all: [],
      job_list_all: [],
      department_list_all: [],
      activeIndex: '',
      defaultWorkFlowList: [],
      toolsList: [],
      radio: '',
      assistantRadio: "ptm",
      type: 'first',
      showWorkflow: false,
      currentWorkFlow: {},
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
      current_ai_assist: {}
    };
  },
  computed: {
    ...mapGetters(['token','department_list','job_list']),
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
  created() {
    this.getDefaultWorkflow(this.getCompayWorkflow);
    this.getDepartMentList();
    this.getAllJobList();
    this.getAIconfig();
  },
  methods: {
    getDefaultWorkflow(callback) {
      get_default_workflow_template({
        access_token: this.token
      }).then((result) => {
        if (result.code == 0) {
          this.defaultWorkFlowList = result.default_workflow_template_list;
          this.activeIndex = this.defaultWorkFlowList[0].id.toString();
          this.defaultWorkFlowList.forEach((item) => {
            item.work_point_list.forEach((it) => {
              it.timeChecked = false;
            });
          });
          callback();
        }
      });
    },
    getCompayWorkflow() {
      get_workflow_template({
        access_token: this.token
      }).then((result) => {
        if (result.code == 0) {
          this.companyWorkList = result.workflow_template_list;
          this.radio = this.defaultWorkFlowList[0].id;
          this.changeTheme(this.radio);
        }
      });
    },
    changeTheme(val) {
      if (this.isInclude(val)) {
        this.showWorkflow = false;
        this.currentWorkFlow = this.companyWorkList.filter((item) => {
          return item.id == val;
        })[0];
      } else {
        this.currentWorkFlow = "";
        this.showWorkflow = true;
      }

      this.drawWorkFlow(this.currentWorkFlow);
    },
    isInclude(val) {
      let flag = false;
      for (let i = 0; i < this.companyWorkList.length; i++) {
        if (val == this.companyWorkList[i].id) {
          flag = true;
        }
      }
      return flag;
    },
    clickSelect(index,indexPath){
      if(this.type==='first'){
        this.radio = parseInt(index);
        this.changeTheme(this.radio);
      }else if(this.type==='second'){
        this.assistantRadio = index;
        this.changeToolItem(this.assistantRadio);
      } 
    },
    handleOpen(key){
      this.type = key;
    },
    getDepartMentList(){
      this.staff_list_all = [];
      this.department_list_all = this.department_list;
      this.department_list_all.forEach((item) => {
        this.staff_list_all.push(...item.staff_list);
      });
    },
    getAllJobList(){
      this.job_list_all = this.job_list;
    },
    async getAIconfig() {
      let result = await get_ai_assist_config({
        access_token: this.token
      })
      if (result.code === 0) {
        this.ai_assist_template = result.ai_assist;
        if(!this.ai_assist_template.ptm.expire_time_day) this.ai_assist_template.ptm.expire_time_day=30  
        this.current_ai_assist = this.$DeepClone(this.ai_assist_template)
        if(this.current_ai_assist.scm.auto_outbound){
          this.disAutoReceive = true;
        }else{
          this.disAutoReceive = false;
        }
      }
    },
    startWorkFlow() {
      this.showWorkflow = false;
      // 深拷贝
      let temp = JSON.stringify(
        this.defaultWorkFlowList.filter((item) => {
          return item.id == this.radio;
        })[0]
      );
      this.currentWorkFlow = JSON.parse(temp);
      this.companyWorkList.push(this.currentWorkFlow);

      this.drawWorkFlow(this.currentWorkFlow);
    },
    saveWorkFlow() {
      let temp = JSON.parse(JSON.stringify(this.currentWorkFlow));
      this.clearID(temp.work_point_list);
      
      edit_workflow_template({
        access_token: this.token,
        workflow_template: temp,
      }).then((result) => {
        if (result.code == 0) {
          this.$notify({
            type: 'success',
            title: '成功',
            message: '保存流程成功'
          })
        }
      });
    },
    disableWorkFlow() {
       this.$confirm('确定关闭“ ' + this.currentWorkFlow.name + ' ”流程, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delete_workflow_template({
            access_token: this.token,
            workflow_id: this.currentWorkFlow.id,
          }).then((result) => {
            if (result.code == 0) {
              this.$notify({
                type: 'success',
                title: '成功',
                message: '关闭成功'
              })
              this.getDefaultWorkflow(this.getCompayWorkflow);
            }
          });
        }).catch(()=>{})
      
    },
    resetCurrentWorkFlow() {
      this.defaultWorkFlowList.some((item) => {
        if (this.currentWorkFlow.id == item.id) {
          this.currentWorkFlow = JSON.parse(JSON.stringify(item));
          this.drawWorkFlow(this.currentWorkFlow);
          return true;
        }
      });
    },
    clearID(workPointList) {
      workPointList.forEach((point) => {
        if (WORK_POINT_CONDITION === point.type) {
          point.condition_list.forEach((node) => {
            delete node.condition.id;

            this.clearID(node.work_point_list);
          });
        } else {
          delete point.id;
        }
      });
    },

    getCaptionForCondition(condition, form) {
      if (!condition || 0 == condition.length || !form) {
        return "无效条件表达";
      }

      let ret = "";

      condition.forEach((node) => {
        ret = ret ? ret + " 及 " : "";

        if (PARAM_OPERATOR_LT === node.operator) {
          ret += form[node.index].name + "小于" + node.value[0];
        } else if (PARAM_OPERATOR_LTE === node.operator) {
          ret += form[node.index].name + "小于等于" + node.value[0];
        } else if (PARAM_OPERATOR_E === node.operator) {
          ret += form[node.index].name + "等于" + node.value[0];
        } else if (PARAM_OPERATOR_MTE === node.operator) {
          ret += form[node.index].name + "大于等于" + node.value[0];
        } else if (PARAM_OPERATOR_MT === node.operator) {
          ret += form[node.index].name + "大于" + node.value[0];
        } else if (PARAM_OPERATOR_IN === node.operator) {
          ret +=
            form[node.index].name +
            "介于 （" +
            node.value[0] +
            ", " +
            node.value[1] +
            "）之间";
        } else if (PARAM_OPERATOR_AND === node.operator) {
          ret += form[node.index].name + "包含" + node.value;
        } else {
          ret += form[node.index].name + "包含任意" + node.value;
        }
      });

      return ret;
    },
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
    drawCondition(ctx, x, y, condition, i, form) {
      x += (ITEM_WIDTH - RECT_WIDTH) / 2;

      this.drawLine(
        ctx,
        x + RECT_WIDTH / 2,
        y,
        x + RECT_WIDTH / 2,
        y + RECT_HEIGHT / 2,
        "#808080"
      );

      condition.condition.id = this.drawRect(
        ctx,
        x,
        y + RECT_HEIGHT / 2,
        RECT_WIDTH,
        RECT_HEIGHT,
        "#16B90B"
      );
      this.drawRect(
        ctx,
        x,
        y + RECT_HEIGHT / 2,
        RECT_WIDTH,
        RECT_HEADER_HEIGHT,
        "#16B90B",
        true
      );

      this.drawText(
        ctx,
        "条件" + i,
        x + RECT_WIDTH / 2,
        y + RECT_HEIGHT / 2 + (RECT_HEADER_HEIGHT - FONT_SIZE),
        "#FFFFFF",
        "middle"
      );
      this.drawText(
        ctx,
        this.getCaptionForCondition(condition.condition, form),
        x + 8,
        y +
          RECT_HEIGHT / 2 +
          RECT_HEADER_HEIGHT +
          (RECT_BODY_HEIGHT - FONT_SIZE) / 2,
        "#000000",
        "left"
      );

      this.drawLine(
        ctx,
        x + RECT_WIDTH / 2,
        y + RECT_HEIGHT / 2 + RECT_HEIGHT,
        x + RECT_WIDTH / 2,
        y + RECT_HEIGHT + RECT_HEIGHT,
        "#808080"
      );
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
    getWidth(condition) {
      if (!condition) {
        return 0;
      }

      if (condition.work_point_list && 0 < condition.work_point_list.length) {
        let w = 0;
        condition.work_point_list.forEach((point) => {
          if (!point) {
            return;
          }

          let ww = 0;
          if (WORK_POINT_CONDITION === point.type) {
            point.condition_list.forEach((node) => {
              ww += this.getWidth(node);
            });
          } else {
            ww = ITEM_WIDTH;
          }

          w = ww < w ? w : ww;
        });

        return w;
      } else {
        return ITEM_WIDTH;
      }
    },
    getHeight(condition) {
      if (!condition) {
        return 0;
      }

      if (condition.work_point_list && 0 < condition.work_point_list.length) {
        let h = ITEM_HEIGHT;
        condition.work_point_list.forEach((point) => {
          if (!point) {
            return;
          }

          let hh = 0;
          if (WORK_POINT_CONDITION === point.type) {
            point.condition_list.forEach((node) => {
              let hhh = this.getHeight(node);
              hh = hhh < hh ? hh : hhh;
            });

            hh += RECT_HEIGHT / 2;
          } else {
            hh += ITEM_HEIGHT;
          }

          h += hh;
        });

        return h;
      } else {
        return ITEM_HEIGHT;
      }
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