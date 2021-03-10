<template>
  <div class="app-container staffEdit">
    <div class="titleEdit">添加成员</div>
    <el-form :model="ruleFormAdd" ref="ruleFormAdd" label-width="120px">
      <el-form-item label="姓名" prop="staff.name" :rules="{ required: true, message: '姓名为必填项', trigger: 'blur' }">
        <el-input size="mini" style="width: 340px" v-model="ruleFormAdd.staff.name" auto-complete="off" placeholder="姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="staff.phone" required>
        <el-row>
          <el-col :span="24">
            <el-input size="mini" style="width: 340px" v-model="ruleFormAdd.staff.phone" auto-complete="off" placeholder="手机号码" />
            <span style="font-size: 12px;color: #999999;margin-left: 10px;font-weight: bold;">若该手机号码未注册个人账号，请邀请成员注册智造帮个人账号</span>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="工号" prop="staff.employee_id">
        <el-input size="mini" style="width: 340px" v-model="ruleFormAdd.staff.employee_id" auto-complete="off" placeholder="工号" />
      </el-form-item>
      <el-form-item label="部门" prop="department_name" :rules="{ required: true, message: '部门为必选项', trigger: 'blur' }">
        <el-select size="mini" style="width: 340px" v-model="ruleFormAdd.department_name" placeholder="请选择">
          <el-option v-for="item in department_list" :key="item.name" :label="item.name" :value="item.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="岗位" prop="staff.job" :rules="{ required: true, message: '岗位为必选项' }">
        <el-select size="mini" style="width: 340px" v-model="ruleFormAdd.staff.job" placeholder="请选择">
          <el-option v-for="item in job_list" :key="item.job_id" :label="item.job_name" :value="item.job_id" />
        </el-select>
      </el-form-item>

      <el-form-item label="供应商分类" prop="staff.config.workpieces">
        <el-checkbox @change="isGetAll" v-model="checked">全选</el-checkbox>

        <el-checkbox-group :min="1" v-model="workpieces" style="max-height: 200px; overflow: auto; width: 790px">
          <el-row style="width: 750px">
            <el-col style="overflow: hidden; height: 30px" v-for="(item, index) in workpiece_list" :key="index" :span="4">
              <el-checkbox :label="item.id"> {{ item.name }}</el-checkbox>
            </el-col>
          </el-row>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item>
        <div style="text-align: center; margin-right: 120px">
            <router-link to="/enterpriseManage/addressBook">
                <el-button size="mini">取 消</el-button>
            </router-link>
          <el-button style="margin-left: 20px" type="primary" size="mini" @click="submitForm('ruleFormAdd', true)">保 存</el-button>
          <!-- <el-button style="margin-left: 20px" type="primary" size="mini" @click="submitForm('ruleFormAdd', false)">保存并继续添加</el-button> -->
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "staffEdit",
  data() {
    return {
      rulesAdd: [],
      ruleFormAdd: {
        department_name: "",
        staff: {
          phone: "",
          name: "",
          job: "",
          employee_id: "",
          config: {
            workpieces: [],
          },
        },
      },
      workpieces: [],
      checked: true,
      department_list: [],
      job_list: [],
      workpiece_list: [{"id":1000,"name":"机电"},{"id":999,"name":"气动"},{"id":998,"name":"传动"},{"id":997,"name":"电控"},{"id":996,"name":"导轨丝杆"},{"id":995,"name":"仪器"},{"id":994,"name":"五金耗材"},{"id":993,"name":"液压"},{"id":992,"name":"劳保办公"},{"id":991,"name":"工具"},{"id":990,"name":"无形资产"},{"id":989,"name":"服务类"},{"id":988,"name":"电子元件"},{"id":987,"name":"低压电器"},{"id":986,"name":"电缆端子"},{"id":985,"name":"弹簧类"},{"id":984,"name":"紧固件"},{"id":1001,"name":"车件"},{"id":1002,"name":"钣金"},{"id":1003,"name":"大板"},{"id":1004,"name":"中板"},{"id":1005,"name":"小板"},{"id":1006,"name":"型材/机罩"},{"id":1007,"name":"机架"},{"id":1008,"name":"陶瓷"},{"id":1009,"name":"注塑"},{"id":1010,"name":"铸造"},{"id":1011,"name":"锻造"},{"id":1012,"name":"轴类磨削"},{"id":1013,"name":"齿轮"},{"id":1014,"name":"精密板件"},{"id":1017,"name":"有料机加工"},{"id":1999,"name":"其它"}]
    };
  },
  methods: {
      isGetAll(){}
  }
};
</script>

<style lang="scss">
.staffEdit {
//   background-color: #f6f6f6;
  .titleEdit {
    color: #333333;
    font-size: 16px;
    font-weight: bold;
    margin-top: 20px;
    margin-bottom: 30px;
    border-left: 4px solid #00a0e9;
    padding-left: 24px;
  }
  .el-form-item {
      margin-bottom: 12px;
  }
}
</style>