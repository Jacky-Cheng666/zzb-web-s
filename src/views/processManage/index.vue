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
    <div class="mainContent"></div>
  </div>
</template>

<script>
export default {
  name: "processManage",
  data() {
    return {
      activeIndex: '',
      defaultWorkFlowList: [{"id":101,"name":"变更审批","form":[],"work_point_list":[{"type":0,"name":"提交变更","all_staff":true,"department_list":[],"staff_list":[],"job_list":[],"timeChecked":false},{"type":1,"name":"变更审批","worker":1,"staff_list":[],"job_list":[],"all_approve":0,"duration":0,"skip":false,"timeChecked":false}]},{"id":201,"name":"请购审批","form":[{"type":1,"name":"预估金额","enable":true}],"work_point_list":[{"type":0,"name":"提交请购","all_staff":true,"department_list":[],"staff_list":[],"job_list":[],"timeChecked":false},{"type":9,"condition_list":[{"condition":[{"index":0,"operator":1,"value":[1000]}],"work_point_list":[{"type":4,"name":"请购审批","all_staff":true,"worker":1,"staff_list":[],"job_list":[],"all_approve":0,"duration":0,"skip":false}]},{"condition":[{"index":0,"operator":4,"value":[1000]}],"work_point_list":[{"type":1,"name":"请购审批","worker":0,"staff_list":[],"job_list":[],"all_approve":0,"duration":0,"skip":false}]}],"timeChecked":false},{"type":1,"name":"财务审核","worker":1,"staff_list":[],"job_list":[],"all_approve":0,"duration":0,"skip":false,"timeChecked":false}]},{"id":301,"name":"采购审批","form":[],"work_point_list":[{"type":0,"name":"发布订单","all_staff":true,"department_list":[],"staff_list":[],"job_list":[],"timeChecked":false},{"type":1,"name":"订单审核","worker":1,"staff_list":[],"job_list":[],"all_approve":0,"duration":0,"skip":false,"timeChecked":false},{"type":1,"name":"订单审批","worker":1,"staff_list":[],"job_list":[],"all_approve":0,"duration":0,"skip":false,"timeChecked":false}]},{"id":401,"name":"销售审批","form":[],"work_point_list":[{"type":0,"name":"发布订单","all_staff":true,"department_list":[],"staff_list":[],"job_list":[],"timeChecked":false},{"type":1,"name":"订单审核","worker":1,"staff_list":[],"job_list":[],"all_approve":0,"duration":0,"skip":false,"timeChecked":false},{"type":1,"name":"订单审批","worker":1,"staff_list":[],"job_list":[],"all_approve":0,"duration":0,"skip":false,"timeChecked":false}]},{"id":501,"name":"付款审批","form":[],"work_point_list":[{"type":0,"name":"新建付款计划","all_staff":true,"department_list":[],"staff_list":[],"job_list":[],"timeChecked":false},{"type":1,"name":"付款审批","worker":1,"staff_list":[],"job_list":[],"all_approve":0,"duration":0,"skip":false,"timeChecked":false}]},{"id":601,"name":"报销审批","form":[],"work_point_list":[{"type":0,"name":"报销申请","all_staff":true,"department_list":[],"staff_list":[],"job_list":[],"timeChecked":false},{"type":1,"name":"部门审核","worker":0,"staff_list":[],"job_list":[],"all_approve":0,"duration":0,"skip":false,"timeChecked":false},{"type":1,"name":"财务审批","worker":1,"staff_list":[],"job_list":[],"all_approve":0,"duration":0,"skip":false,"timeChecked":false}]}],
      toolsList: [{"name":"项目助理","value":"ptm"},{"name":"销售助理","value":"som"},{"name":"采购助理","value":"scm"},{"name":"仓库助理","value":"wms"},{"name":"财务助理","value":"finance"}]
    };
  },
  methods: {
    clickSelect(){},
    handleOpen(){}
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