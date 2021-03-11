<template>
  <div class="processSetting">
    <!-- 右侧抽屉 -->
    <el-drawer title="我是标题" :visible.sync="drawer" :with-header="false">
      <div
        :class="{initiateColor:processType===0,approveColor:processType===1,conditionColor:processType===2}"
        class="header"
      >
        <div class="left">
          <div
            :class="{initiateColorTip:processType===0,approveColorTip:processType===1,conditionColorTip:processType===2}"
            class="tipBox"
          >{{operationType}}</div>
          <span
            style="font-size:14px;font-weight:bold"
          >{{currentProcessSetting.name?currentProcessSetting.name:'条件'}}</span>
        </div>
        <div class="right">
          <el-checkbox v-if="processType==0" v-model="currentProcessSetting.all_staff">所有人</el-checkbox>
          <!-- <el-checkbox v-if="processType==1" v-model="currentProcessSetting.skip">跳过</el-checkbox> -->
        </div>
      </div>
      <!-- 发起 -->
      <div v-if="0 === processType" class="content">
        <div class="item">
          <div class="title">
            <span style="font-size:14px;">
              <span style="font-weight:bold;margin-right:20px;">部门</span>
              <span>部门所属人员都能操作</span>
            </span>
            <el-button
              :disabled="currentProcessSetting.all_staff"
              @click="addDepartment"
              type="text"
            >添加</el-button>
          </div>
          <div class="item-detail">
            <el-tag
              @close="closeTab(tagIndex,'department')"
              style="margin-right:20px;margin-bottom:10px"
              v-for="(tag,tagIndex) in currentProcessSetting.department_list"
              :key="tag"
              closable
            >{{handleDepartmentDisplay[tag]}}</el-tag>
          </div>
        </div>
        <div class="item">
          <div class="title">
            <span style="font-size:14px;">
              <span style="font-weight:bold;margin-right:20px">岗位</span>
              <span>岗位所属人员都能操作</span>
            </span>
            <el-button :disabled="currentProcessSetting.all_staff" @click="addJob" type="text">添加</el-button>
          </div>
          <div class="item-detail">
            <el-tag
              @close="closeTab(tagIndex,'job')"
              style="margin-right:20px;margin-bottom:10px"
              v-for="(tag,tagIndex) in currentProcessSetting.job_list"
              :key="tag"
              closable
            >{{handleJobListDisplay[tag]}}</el-tag>
          </div>
        </div>
        <div class="item">
          <div class="title">
            <span style="font-size:14px;">
              <span style="font-weight:bold;margin-right:20px">人员</span>
              <span>指定成员，最多10人</span>
            </span>
            <el-button :disabled="currentProcessSetting.all_staff" @click="addStaff" type="text">添加</el-button>
          </div>
          <div class="item-detail">
            <el-tag
              @close="closeTab(tagIndex,'staff')"
              style="margin-right:20px;margin-bottom:10px"
              v-for="(tag,tagIndex) in currentProcessSetting.staff_list"
              :key="tag"
              closable
            >{{allStaffList[tag]}}</el-tag>
          </div>
        </div>
      </div>
      <!-- 审批 -->
      <div v-else-if="1 === processType" class="content">
        <div class="item">
          <div class="title">
            <span style="font-size:14px;">
              <span style="font-weight:bold;">选择审批人</span>
            </span>
          </div>
          <div class="item-detail">
            <el-radio-group v-model="currentProcessSetting.worker">
              <el-radio :label="0">直接主管</el-radio>
              <el-radio :label="1">指定成员</el-radio>
              <!-- <el-radio :label="2">指定岗位</el-radio> -->
            </el-radio-group>
          </div>
        </div>
        <!-- 根据选择的审批人动态变化 -->
        <div class="item" v-if="currentProcessSetting.worker==1">
          <!-- 指定成员 -->
          <div class="title">
            <span style="font-size:14px;">
              <span style="font-weight:bold;">指定成员，最多10人</span>
            </span>
            <el-button @click="addStaff" type="text">添加</el-button>
          </div>
          <div class="item-detail">
            <el-tag
              @close="closeTab(tagIndex,'staff')"
              style="margin-right:20px;margin-bottom:10px"
              v-for="(tag,tagIndex) in currentProcessSetting.staff_list"
              :key="tag"
              closable
            >{{allStaffList[tag]}}</el-tag>
          </div>
        </div>
        <!-- 指定岗位
        <div class="item" v-else-if="currentProcessSetting.worker==2">
          <div class="title">
            <span style="font-size:14px;">
              <span style="font-weight:bold;">指定岗位</span>
            </span>
            <el-button @click="addJob" type="text">添加</el-button>
          </div>
          <div class="item-detail">
            <el-tag
              @close="closeTab(tagIndex,'job')"
              style="margin-right:20px;margin-bottom:10px"
              v-for="(tag,tagIndex) in currentProcessSetting.job_list"
              :key="tag"
              closable
            >{{handleJobListDisplay[tag]}}</el-tag>
          </div>
        </div>-->
        <div class="item" v-else>
          <!-- 直接主管 -->
          <div class="title">
            <span style="font-size:14px;">
              <span style="font-weight:bold;">直接主管</span>
            </span>
          </div>
          <div style="font-size:14px" class="item-detail">若没有找到直接主管，则为发起人自己审批</div>
        </div>
        <div class="item">
          <div class="title">
            <span style="font-size:14px;">
              <span style="font-weight:bold;">审批方式</span>
            </span>
          </div>
          <div class="item-detail">
            <el-radio-group v-model="currentProcessSetting.all_approve">
              <el-radio :label="1">会签，所有人都必须签署</el-radio>
              <el-radio :label="0">或签，只要一人签署即可</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="item">
          <div class="title">
            <div
              style="width:100%;font-size:14px;display:flex;align-items:center;justify-content:space-between"
            >
              <div style="font-weight:bold;">时间</div>
              <el-input
                type="number"
                style="width:87px"
                size="mini"
                v-model.number="currentProcessSetting.duration"
                placeholder="时间"
                :disabled="currentProcessSetting.disabled"
              ></el-input>
              <span>小时以内要处理完成</span>
              <el-checkbox @change="timeChange" v-model="currentProcessSetting.timeChecked">不限定时间期限</el-checkbox>
            </div>
          </div>
        </div>
      </div>
      <!-- 办理 -->
      <div v-else-if="2 === processType" class="content">
        <div class="item">
          <div class="title">
            <span style="font-size:14px;">
              <span style="font-weight:bold;">选择审批人</span>
            </span>
          </div>
          <div class="item-detail">
            <el-radio-group v-model="currentProcessSetting.worker">
              <el-radio :label="0">直接主管</el-radio>
              <el-radio :label="1">指定成员</el-radio>
              <!-- <el-radio :label="2">指定岗位</el-radio> -->
            </el-radio-group>
          </div>
        </div>
        <div class="item" v-if="currentProcessSetting.worker==1">
          <!-- 指定成员 -->
          <div class="title">
            <span style="font-size:14px;">
              <span style="font-weight:bold;">指定成员，最多10人</span>
            </span>
            <el-button @click="addStaff" type="text">添加</el-button>
          </div>
          <div class="item-detail">
            <el-tag
              @close="closeTab(tagIndex,'staff')"
              style="margin-right:20px"
              v-for="(tag,tagIndex) in currentProcessSetting.staff_list"
              :key="tag"
              closable
            >{{allStaffList[tag]}}</el-tag>
          </div>
        </div>
        <!-- 指定岗位 -->
        <!-- <div class="item" v-else-if="currentProcessSetting.worker==2">
          <div class="title">
            <span style="font-size:14px;">
              <span style="font-weight:bold;">指定岗位</span>
            </span>
            <el-button @click="addJob" type="text">添加</el-button>
          </div>
          <div class="item-detail">
            <el-tag
              @close="closeTab(tagIndex,'job')"
              style="margin-right:20px;margin-bottom:10px"
              v-for="(tag,tagIndex) in currentProcessSetting.job_list"
              :key="tag"
              closable
            >{{handleJobListDisplay[tag]}}</el-tag>
          </div>
        </div>-->
        <div class="item" v-else>
          <!-- 直接主管 -->
          <div class="title">
            <span style="font-size:14px;">
              <span style="font-weight:bold;">直接主管</span>
            </span>
          </div>
          <div style="font-size:14px" class="item-detail">若没有找到直接主管，则为发起人自己办理</div>
        </div>
        <div class="item">
          <div class="title">
            <div
              style="width:100%;font-size:14px;display:flex;align-items:center;justify-content:space-between"
            >
              <div style="font-weight:bold;">时间</div>
              <el-input
                style="width:87px"
                size="mini"
                v-model.number="currentProcessSetting.duration"
                placeholder="时间"
                type="number"
                :disabled="currentProcessSetting.disabled"
              ></el-input>
              <span>小时以内要处理完成</span>
              <el-checkbox @change="timeChange" v-model="currentProcessSetting.timeChecked">不限定时间期限</el-checkbox>
            </div>
          </div>
        </div>
      </div>
      <!-- 条件 -->
      <div v-else class="content">
        <div class="item">
          <div class="approve" v-for="(item, index) in currentProcessSetting" :key="index">
            <el-checkbox
              v-model="currentEditWorkflowTemplate.form[item.index].enable"
            >{{currentEditWorkflowTemplate.form[item.index].name}}</el-checkbox>
            <div>
              <!-- 根据类型来动态显示不同组件 -->
              <!-- 0:工作人员  1：数字 2：字符串 3：日期 4：多选框 5：单选框 -->
              <template v-if="0===currentEditWorkflowTemplate.form[item.index].type">
                <el-select
                  size="mini"
                  style="width:102px;margin-right:10px"
                  v-model="value"
                  placeholder="请选择"
                >
                  <el-option label="小于" :value="0"></el-option>
                  <el-option label="小于等于" :value="1"></el-option>
                  <el-option label="等于" :value="2"></el-option>
                  <el-option label="大于等于" :value="3"></el-option>
                  <el-option label="大于" :value="4"></el-option>
                  <el-option label="介于之间" :value="5"></el-option>
                  <el-option label="包含所有" :value="6"></el-option>
                  <el-option label="包含任意" :value="7"></el-option>
                </el-select>
                <el-select
                  size="mini"
                  style="width:204px;margin-right:10px"
                  v-model="value"
                  placeholder="从发起人中选"
                >
                  <el-option
                    v-for="item in selectedAllStaffList"
                    :key="item.staff_id"
                    :label="item.name"
                    :value="item.staff_id"
                  ></el-option>
                </el-select>
              </template>
              <template v-if="1===currentEditWorkflowTemplate.form[item.index].type">
                <el-select
                  size="mini"
                  style="width:102px;margin-right:10px"
                  v-model="item.operator"
                  placeholder="请选择"
                >
                  <el-option label="小于" :value="0"></el-option>
                  <el-option label="小于等于" :value="1"></el-option>
                  <el-option label="等于" :value="2"></el-option>
                  <el-option label="大于等于" :value="3"></el-option>
                  <el-option label="大于" :value="4"></el-option>
                  <el-option label="介于之间" :value="5"></el-option>
                  <el-option label="包含所有" :value="6"></el-option>
                  <el-option label="包含任意" :value="7"></el-option>
                </el-select>
                <el-input
                  style="width:100px;margin-right:10px"
                  size="mini"
                  type="number"
                  v-model.number="item.value[0]"
                  placeholder="请输入数字"
                ></el-input>
                <el-input
                  v-if="5===item.operator"
                  style="width:100px;margin-right:10px"
                  size="mini"
                  type="number"
                  v-model.number="item.value[1]"
                  placeholder="请输入数字"
                ></el-input>
              </template>
              <template v-if="3===currentEditWorkflowTemplate.form[item.index].type">
                <el-date-picker
                  style="width:120px"
                  size="mini"
                  v-model="value"
                  type="date"
                  placeholder="选择日期"
                ></el-date-picker>
              </template>
              <template v-if="4===currentEditWorkflowTemplate.form[item.index].type">
                <el-checkbox-group v-model="checkList">
                  <el-checkbox label="复选框 A"></el-checkbox>
                  <el-checkbox label="复选框 B"></el-checkbox>
                  <el-checkbox label="复选框 C"></el-checkbox>
                </el-checkbox-group>
              </template>
              <template v-if="5===currentEditWorkflowTemplate.form[item.index].type">
                <el-radio-group v-model="radio">
                  <el-radio :label="3">备选项</el-radio>
                  <el-radio :label="6">备选项</el-radio>
                  <el-radio :label="9">备选项</el-radio>
                </el-radio-group>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <el-button @click="drawer=false" type="primary" size="small">取消</el-button>
        <el-button @click="saveToTemplate" type="primary" size="small">确定</el-button>
      </div>
    </el-drawer>
    <!-- 添加部门 -->
    <el-dialog center width="500px" destroy-on-close title="添加部门" :visible.sync="dialogDeparment">
      <el-checkbox-group v-model="selectedDepartment">
        <el-checkbox
          v-for="(item, index) in department_list"
          :key="index"
          :label="item.id"
        >{{item.name}}</el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer" style="text-align:right">
        <el-button size="mini" @click="dialogDeparment = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirmDepartment">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加岗位 -->
    <el-dialog center width="500px" destroy-on-close title="添加岗位" :visible.sync="dialogJobList">
      <el-checkbox-group v-model="selectedJob">
        <template v-for="(item, index) in job_list">
          <el-checkbox :key="index" :label="item.job_id">{{item.job_name}}</el-checkbox>
        </template>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer" style="text-align:right">
        <el-button size="mini" @click="dialogJobList = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirmJob">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加人员组件 -->
    <addStaff @addStaffList="addStaffList" :departments="department_list" ref="addStaff"></addStaff>
  </div>
</template>

<script>
import addStaff from "./addStaff";
import { mapGetters } from 'vuex'
import axios from "axios";
export default {
  name: "processSetting",
  components: {
    addStaff,
  },
  props: {
    processType: {
      default: "",
    },
    point: {
      default: "",
    },
    workflowTemplate: {
      default: "",
    },
    all_job_list: {
      default: "",
    },
    all_staff_list: {
      default: "",
    },
    // all_department_list: {
    //   default: "",
    // },
  },
  data() {
    return {
      drawer: false,
      checked: false,
      currentProcessSetting: JSON.parse(JSON.stringify(this.point)),
      currentPoint: {},
      checked: true,
      value: "",
      options: [],
      input: "",
      selectedApprover: "",
      approveMode: "",
      dialogDeparment: false,
      dialogJobList: false,
      selectedDepartment: [],
      selectedJob: [],
      // 公司所有员工列表
      allStaffList: [],
      departments: [],
      currentEditWorkflowTemplate: this.workflowTemplate,
      handleDepartmentDisplay: {},
      handleJobListDisplay: {},
      selectedAllStaffList: [],
      checkList: [],
      radio: "",
    };
  },
  watch: {
    point(val) {
      this.currentProcessSetting = JSON.parse(JSON.stringify(val));
      this.currentPoint = val;
    },
    workflowTemplate(val) {
      this.currentEditWorkflowTemplate = val;
    },
    // all_department_list(val) {
    //   this.department_list = val;

    //   this.handleDepartmentDisplay = {};
    //   this.selectedAllStaffList = [];
    //   this.department_list.forEach((item) => {
    //     this.handleDepartmentDisplay[item.id] = item.name;
    //     this.selectedAllStaffList.push(...item.staff_list);
    //   });
    // },
    // all_staff_list(val) {
    //   this.allStaffList = {};
    //   val.forEach((staff) => {
    //     this.allStaffList[staff.staff_id] = staff.name;
    //   });
    // },
    // all_job_list(val) {
    //   this.job_list = val;

    //   this.handleJobListDisplay = {};
    //   this.job_list.forEach((item) => {
    //     this.handleJobListDisplay[item.job_id] = item.job_name;
    //   });
    // },
  },
  created() {
    this.handleDepartmentDisplay = {};
    this.selectedAllStaffList = [];
    this.department_list.forEach((item) => {
      this.handleDepartmentDisplay[item.id] = item.name;
      this.selectedAllStaffList.push(...item.staff_list);
    });

    this.handleJobListDisplay = {};
    this.job_list.forEach((item) => {
      this.handleJobListDisplay[item.job_id] = item.job_name;
    });

    this.allStaffList = {};
    this.all_staff_list.forEach((staff) => {
      this.allStaffList[staff.staff_id] = staff.name;
    });
  },
  computed: {
    ...mapGetters(['department_list','job_list']),
    operationType() {
      if (this.processType === 0) {
        return "发起";
      } else if (this.processType === 1) {
        return "审批";
      } else if (this.processType === 2) {
        return "办理";
      } else {
        return "审批";
      }
    },
  },
  methods: {
    addDepartment() {
      this.dialogDeparment = true;
      this.selectedDepartment = this.currentProcessSetting.department_list;
    },
    // 添加人员
    addStaff() {
      this.$refs.addStaff.dialogFormVisible = true;
      this.$refs.addStaff.addStaffListArr = this.currentProcessSetting.staff_list;
    },
    // 添加岗位
    addJob() {
      this.dialogJobList = true;
      this.selectedJob = this.currentProcessSetting.job_list;
    },
    // 添加部门人员至工作流中
    confirmDepartment() {
      this.currentProcessSetting.department_list = this.selectedDepartment;
      this.dialogDeparment = false;
    },
    confirmJob() {
      this.dialogJobList = false;
      this.currentProcessSetting.job_list = this.selectedJob;
    },
    addStaffList(data) {
      // 添加人员
      this.currentProcessSetting.staff_list = data;
    },
    // 关闭tag页签
    closeTab(tag, val) {
      if (val === "department") {
        this.currentProcessSetting.department_list.splice(tag, 1);
      }
      if (val === "job") {
        this.currentProcessSetting.job_list.splice(tag, 1);
      }
      if (val === "staff") {
        this.currentProcessSetting.staff_list.splice(tag, 1);
      }
    },
    // 保存数据到模板
    saveToTemplate() {
      delete this.currentPoint.timeChecked;
      delete this.currentPoint.disabled;
      for (let i in this.currentPoint) {
        if (i != "timeChecked") {
          this.currentPoint[i] = this.currentProcessSetting[i];
        }
        // 每次选择审批人只能选择一种情况，当选择其中一种情况时候，其他情况的数据都要清空掉。
        if (
          this.currentProcessSetting.worker === 0 &&
          (i === "job_list" || i === "staff_list")
        ) {
          this.currentPoint[i] = [];
        } else if (
          this.currentProcessSetting.worker === 1 &&
          i === "job_list"
        ) {
          this.currentPoint[i] = [];
        } else if (
          this.currentProcessSetting.worker === 2 &&
          i === "staff_list"
        ) {
          this.currentPoint[i] = [];
        }
      }

      this.drawer = false;
      this.$parent.refreshDraw();
    },
    // 限制输入框输入
    limitInput(o, item) {
      let value = o.target.value;
      let min = 1;
      if (parseInt(value) < min) {
        o.target.value = 1;
        item.value[0] = 1;
      }
    },
    timeChange(val) {
      if (val) {
        this.currentProcessSetting.duration = 0;
        this.currentProcessSetting.disabled = true;
      } else {
        this.currentProcessSetting.disabled = false;
      }
    },
  },
};
</script>

<style lang="scss">
.processSetting {
  position: relative;

  .header {
    width: 100%;
    height: 42px;
    padding: 6px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 5px;
    margin-bottom: 10px;
    border: 1px solid #16B90B;

    .left {
      display: flex;
      align-items: center;

      .tipBox {
        width: 58px;
        height: 32px;
        text-align: center;
        line-height: 32px;
        color: #16B90B;
        font-size: 12px;
        margin-right: 20px;
        border-radius: 5px;
        border: 1px solid #16B90B;
      }

      .initiateColorTip {
        color: #3893e6;
        border: 1px solid #3893e6;
      }

      .conditionColorTip {
        color: #16B90B;
        border: 1px solid #16B90B;
      }

      .approveColorTip {
        color: #F08734;
        border: 1px solid #F08734;
      }
    }
  }

  .initiateColor {
    border: 1px solid #3893e6;
  }

  .conditionColor {
    border: 1px solid #16B90B;
  }

  .approveColor {
    border: 1px solid #F08734;
  }

  .content {
    .item {
      .title {
        height: 42px;
        background-color: #ECEFF4;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 14px;
        padding-right: 8px;
      }

      .item-detail {
        padding: 20px 23px;
      }

      .approve {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 24px;
      }
    }
  }

  .footer {
    padding-right: 16px;
    right: 0px;
    position: absolute;
    bottom: 10px;
  }

  .el-checkbox-group {
    padding-left: 20px;
    padding-top: 20px;

    .el-checkbox {
      margin-bottom: 10px;
    }
  }
}
</style>