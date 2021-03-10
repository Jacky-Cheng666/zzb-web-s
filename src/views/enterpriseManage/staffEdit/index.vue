<template>
  <div class="app-container staffEdit" v-loading="loading" element-loading-text="添加中...">
    <div class="titleEdit">添加成员</div>
    <el-form :model="ruleFormAdd" ref="ruleFormAdd" :rules="rulesAdd" label-width="120px">
      <el-form-item label="姓名" prop="staff.name" :rules="{ required: true, message: '姓名为必填项', trigger: 'blur' }">
        <el-input size="mini" style="width: 340px" v-model="ruleFormAdd.staff.name" auto-complete="off" placeholder="姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="staff.phone">
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
        <div style="margin-left:250px;margin-top:20px">
            <router-link to="/enterpriseManage/addressBook">
                <el-button size="mini">取 消</el-button>
            </router-link>
          <el-button style="margin-left: 20px" type="primary" size="mini" @click="submitForm('ruleFormAdd')">保 存</el-button>
          <!-- <el-button style="margin-left: 20px" type="primary" size="mini" @click="submitForm('ruleFormAdd', false)">保存并继续添加</el-button> -->
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { add_staff } from '@/api/enterpriseManage'
import { mapGetters } from 'vuex'
export default {
  name: "staffEdit",
  data() {
    var contact_phoneCheck = (rule, value, callback) => {
      var exe = /^1[3456789]{1}\d{9}$/
      if (value === '') {
        callback(new Error('手机号不能为空'));
      } else if (!exe.exec(value)) {
        callback(new Error('请正确输入手机号'));
      } else {
        callback();
      }
    };
    return {
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
      rulesAdd: {
        'staff.phone': [
          {validator: contact_phoneCheck,}
        ],
      },
      workpieces: [],
      checked: true,
      loading: false
    };
  },
  computed: {
    ...mapGetters(['token','workpiece_list','job_list','department_list']),
    isEdit(){
      return this.$route.meta.isEdit
    }
  },
  created() {
    if(!this.isEdit){
      this.workpiece_list.forEach(node => {
        this.workpieces.push(node.id)
      })
      this.$set(this.ruleFormAdd.staff.config,'workpieces',this.workpiece_list)
    }else{
      console.log('编辑成员');
    }
  },
  methods: {
    isGetAll(){},
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.handleDiaSureAdd(formName)
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    async handleDiaSureAdd(formName,key){
      this.loading = true;
      let forData = this.ruleFormAdd

      forData.staff.config.workpieces = []
      this.workpiece_list.forEach(node => {
        this.workpieces.forEach(id => {
          if (id == node.id) {
            forData.staff.config.workpieces.push(node)
          }
        })
      })

      let result = await add_staff({
        access_token: this.token,
        ...forData
      });
      if(result.code===0){
        this.loading = false;
        this.$notify({
          type: 'success',
          title: '成功',
          message: '操作成功!'
        });
        this.resetForm(formName)
      }else{
        this.loading = false;
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
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
}
</style>