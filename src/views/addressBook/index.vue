<template>
  <div class="app-container addressBook">
    <div class="sideNav">
      <el-menu active-text-color="#303133" background-color="#FFFEFE" unique-opened :default-active="activeIndex" @select="clickSelect" @open="handleOpen" @close="handleClose">
        <el-submenu index="first">
          <template slot="title">
            <img style="margin-right: 10px" src="@/assets/imgs/organization.png" alt=""/>
            <span>组织架构</span>
          </template>
          <el-menu-item :class="{ activeColor: department_name === item.name }" v-for="item in department_list" :key="item.id" :index="item.name">{{ item.name }}({{ item.staff_list.length }})</el-menu-item>
          <div style="margin-top: 10px; margin-bottom: 20px" align="center">
            <el-button icon="el-icon-minus" type="danger" plain size="mini" @click="delDepartment(department_name)">删除部门</el-button>
          </div>
        </el-submenu>
        <el-submenu index="second">
          <template slot="title">
            <img style="margin-right: 10px" src="@/assets/imgs/role.png" alt=""/>
            <span>角色</span>
          </template>
          <el-menu-item :class="{ activeColor: job_id === item.job_id }" v-for="item in job_list" :key="item.job_id" :index="'' + item.job_id">{{ item.job_name }}</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <div class="mainContent">
      <div class="contentWrap" v-show="label_type=='first'">
        <el-input size='mini' style="width: 120px;" v-model="new_department_name" auto-complete="off" placeholder="新部门名"></el-input>
        <el-button style="margin-left: -2px;" type="primary" size="mini" @click="renameDepartment()">修改部门名称</el-button>
        <div style="float: right;margin-right: 0px;">
          <router-link to="/enterpriseManage/addStaff">
            <el-button size="mini" type="primary" icon="el-icon-plus">添加成员</el-button>
          </router-link>
          <el-button style="margin-left: 10px;" icon="el-icon-plus" type="primary" size="mini" @click="addDepart()">新增部门</el-button>
          <el-button size="mini" icon="el-icon-sort" type="warning" @click="transferAdmin" style="background-color: #6299DB;border-color:#6299DB" >转让管理员</el-button>
          <el-button size="mini" icon="el-icon-user" @click="setDepartmentDirector" type="warning" style="background-color: #2ED0C2;border-color:#2ED0C2">设为部门主管</el-button>
        </div>

        <div class="table_container">
          <el-table v-loading="loading" element-loading-text="加载中..." ref="multipleTable" :data="rows" stripe :height="500" @selection-change="changeFun" style="width: 100%">
            <el-table-column align="center" type="selection" width="55" />
            <el-table-column align="center" label="姓名" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="scope.row.is_admin&&scope.row.isDirector" style="width: 80%;height: 100%;cursor: pointer;display:inline-block;" @click="toStaffEdit(false,scope.row)">{{scope.row.name}}（管理员)（主管）</div>
                <div v-else-if="scope.row.is_admin" style="width: 80%;height: 100%;cursor: pointer;display:inline-block;" @click="toStaffEdit(false,scope.row)">{{scope.row.name}}（管理员）</div>
                <div v-else-if="scope.row.isDirector" style="width: 80%;height: 100%;cursor: pointer;display:inline-block;" @click="toStaffEdit(false,scope.row)">{{scope.row.name}}（主管）</div>
                <div v-else style="width: 80%;height: 100%;cursor: pointer;display:inline-block;" @click="toStaffEdit(false,scope.row)">{{scope.row.name}}</div>
              </template>
            </el-table-column>

            <el-table-column align="center" prop="job_name" label="岗位" show-overflow-tooltip />
            <el-table-column align="center" prop="employee_id" label="工号" show-overflow-tooltip />
            <el-table-column align="center" prop="phone" label="手机号码" show-overflow-tooltip/>
            <el-table-column align="center" label="账户状态" show-overflow-tooltip />
            <el-table-column align="center" label="操作" width="120">
              <template slot-scope="scope" >
                <el-button @click="toStaffEdit(scope.row)" size="mini" type="text" icon="el-icon-edit">编辑</el-button>
                <el-button size="mini" type="text" icon="el-icon-delete" class="text-danger">删除</el-button>              
              </template>
            </el-table-column>
          </el-table>
          
          <div style="text-align: center;margin-top: 5px;">
            <el-row >
              <el-col :span="24" style="margin-top: 6px;background: #ffffff">
               <el-pagination prev-text="上一页" next-text	="下一页"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="[10, 30, 50, 100,200]"
                  :page-size="pageSize"
                  layout="prev, pager, next, sizes, total, jumper"
                  :total="count"
                ></el-pagination>
              </el-col>

            </el-row>
          </div>
        </div>
      </div>
      <div class="contentWrap" v-show="label_type=='second'">
        <div class="titleEdit">{{txt_title}}</div>

        <div style="line-height: 43px;margin-bottom:20px;">
          <el-input size='mini' style="width: 160px;margin-left: 20px;" v-model="new_job_name" auto-complete="off" placeholder="新角色名"></el-input>
          <el-button style="margin-left: -2px;" type="primary" size="mini" @click="submitJob()">提交</el-button>
          <div style="float: right;margin-right: 10px;">
            <el-button v-show="!add_model" type="danger" icon="el-icon-minus" size="mini" @click="deleteJob()">删除角色</el-button>
            <el-button v-show="!add_model" type="primary" icon="el-icon-plus" size="mini" @click="addJob(true)">新增角色</el-button>
            <el-button v-show="add_model" size="mini" @click="addJob(false)">取消</el-button>
          </div>
        </div>

        <el-row v-loading="loading" element-loading-text="加载中..." style="line-height: 25px;padding-left: 0px;box-sizing: border-box;font-size: 13px;">
          <el-checkbox-group v-model="checkList">
            <el-col v-for="(item, index) in auth_list" :key="index" :span="(item.id < 100)?24:6">
              <span class="titleCaption" v-show="item.id < 100">{{auth_title_list[item.id]}}</span>
              <el-checkbox style="padding-left:25px" :label="item.id" v-show="100 <= item.id"> {{item.name}}</el-checkbox>
            </el-col>
          </el-checkbox-group>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { get_department_list, get_staff_list, get_job_list, get_auth_list, delete_job} from '@/api/enterpriseManage'
import { mapGetters } from 'vuex'
import axios from "axios"
export default {
  name: "addressBook",
  data() {
    return {
      new_department_name: "",
      staffEdit: false,
      activeIndex: "",
      department_name: "",
      job_id: 0,
      label_type: "first",
      currentPage: 1,
      pageSize: 10,
      count: 100,
      rows: [],
      department_list: [],
      job_list: [],
      txt_title: "设置角色",
      new_job_name: "",
      checkList: [],
      add_model: false,
      auth_title_list: ['企业管理权限', '项目管理权限', '采购管理权限', '销售管理权限', '仓库管理权限', '财务管理权限', '报表查看权限'],
      auth_list: [],
      loading: false
    };
  },
  computed:{
    ...mapGetters(['token'])
  },
  created() {
    this.getDepartmentList()
    this.getAuthList()
    this.getJobList()
  },
  methods: {
    async getDepartmentList(){
      let result = await get_department_list({
        access_token: this.token
      });
      if(result.code===0){
        this.department_list = result.department_list
        this.activeIndex = this.department_list[0].name.toString();
        if(this.department_list.length>0){
          this.department_name=this.department_list[0].name
          this.refreshData()
        }
      }
    },
    async getJobList(){
      let result = await get_job_list({
        access_token: this.token
      })
      if(result.code===0){

        this.job_list = result.job_list
        if(this.job_list.length > 0){
          this.job_id = this.job_list[0].job_id
          this.refreshJobData()
        } else {
          this.addJob(true)
        }
      }
    },
    async getAuthList(){
      let result = await get_auth_list({
        access_token: this.token
      })
      if(result.code===0){
        this.auth_list = []
        let list = result.auth_list
        list.forEach(node => {
          if (0 == node.id%100) {
            this.auth_list.push({
              id: node.id/100 - 1,
              name: '全部权限'
            })
          }

          this.auth_list.push({
            ...node
          })
        })
      }
    },
    async refreshData(){
      this.loading = true;
      let result = await get_staff_list({
        access_token: this.token,
        department_name:this.department_name
      })
      if(result.code===0){
        this.loading = false;
        this.new_department_name = this.department_name;

        this.allRows=result.staff_list?result.staff_list:[]
        this.allRows.sort((a, b) => {
          return a.name.localeCompare(b.name, 'zh');
        });
        let head_staff_id="";
        this.department_list.forEach(item=>{
          if(item.name===this.department_name){
            head_staff_id=item.head_staff_id?item.head_staff_id:"";
          }
        })
        // console.log(head_staff_id);
        this.allRows.forEach(item=>{
          this.job_list.forEach(item1=>{
            if(item.job==item1.job_id){
              item.job_name=item1.job_name
            }
          })
          if(item.staff_id===head_staff_id){
            this.$set(item,'isDirector',true)
          }
        })
        this.currentPage = 1
        this.handleClick()
      }

    },
    refreshJobData() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false
        this.new_job_name = ''
        this.checkList = []
        this.job_list.forEach(item=>{
          if(this.job_id == item.job_id){
            this.new_job_name = item.job_name
            this.checkList = item.auth_list
          }
        })
      }, 300);
    },
    handleClick() {
      this.count=this.allRows.length
      this.rows = this.allRows.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage)
    },
    handleOpen(key){
      this.label_type = key;
    },
    clickSelect(index,indexPath){
      // console.log(index);
      if(this.label_type==='first'){
        this.department_name = index;
        this.refreshData();
      }else if(this.label_type==='second'){
        this.job_id = parseInt(index);
        this.refreshJobData();
      }
      
    },
    handleClose(){},
    delDepartment(){},
    renameDepartment(){},
    addDepart(){},
    transferAdmin(){},
    setDepartmentDirector(){},
    changeFun(){},
    handleSizeChange(val) {  
      this.pageSize=val
      this.rows = this.allRows.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage)
    },
    handleCurrentChange(val) { 
      this.currentPage = val;
      this.rows = this.allRows.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage)
    },
    submitJob() {
      if(!this.new_job_name) {
        this.$message({
          type: 'warning',
          message: '请输入角色名称'
        });
        return
      }

      let has_num = 0, job_name = ''
      if (this.add_model) {
        this.job_list.forEach(item=>{
          if(this.new_job_name == item.job_name){
            has_num ++
            return
          }
        })
      } else {
        this.job_list.forEach(item=>{
          if (this.job_id == item.job_id) {
            job_name = item.job_name
          }

          if(this.job_id != item.job_id && this.new_job_name == item.job_name){
            has_num ++
            return
          }
        })
      }
      
      if (0 < has_num) {
        this.$message({
          type: 'warning',
          message: '角色：' + this.new_job_name + ' 已存在，请重新输入'
        });
        return
      }
      

      /*if(!this.checkList || 0 == this.checkList.length) {
        this.$message({
          type: 'warning',
          message: '请至少选择一项权限'
        });
        return
      }*/

      let url = this.add_model ? '/corp/company/add_job' : '/corp/company/edit_job'
      let text_msg = this.add_model ? '确定新增角色：' + this.new_job_name + '？' : '确定修改角色：' + job_name + ' 为：' + this.new_job_name + '？'
      let req_msg = this.add_model ? {access_token:this.token,job_list:[{job_name:this.new_job_name, auth_list:this.checkList}]} : 
                    {access_token:this.token,job:{job_id:this.job_id,job_name:this.new_job_name,auth_list:this.checkList}}

      this.$confirm(text_msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.post(process.env.VUE_APP_BASEURL + url, req_msg)
          .then(response => {
            let result = response.data
            if (result.code == 0) {
              this.$notify({
                type: 'success',
                title: '成功',
                message:"操作成功"
              })

              this.getJobList()
            }
          })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    deleteJob() {
      let list = [], job_name = ''
      this.job_list.forEach(item=>{
        if(this.job_id == item.job_id){
          list.push(item.job_name)
          job_name = item.job_name
        }
      })

      if(0 == list.length) {
        this.$message({
          type: 'warning',
          message: '请选择一个角色'
        });
      }

      this.$confirm('确定删除角色:' + job_name + '？，请谨慎操作！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let result = await delete_job({
          access_token: this.token,
          job_name_list:list
        })
        if(result.code===0){
          this.$notify({
            type: 'success',
            title: '成功',
            message:"操作成功"
          })

          this.getJobList()
        }

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    addJob(add) {
      if (!add && this.job_list.length <= 0) {
        return
      }
      
      this.add_model = add
      this.txt_title = this.add_model ? '新增角色' : '设置角色'

      if (this.add_model) {
        this.new_job_name = ''
        this.checkList = []
      } else {
        this.refreshJobData()
      }
    },
    toStaffEdit(row){
      this.$router.push('/enterpriseManage/staffEdit/'+row.staff_id)
    }
  },
};
</script>

<style lang="scss">
.addressBook {
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
    .contentWrap{
      width: 100%;
      .table_container {
        width: 100%;
        margin-top: 10px;
      }
      .titleEdit {
        color: #333333;
        font-size: 16px;
        font-weight: bold;
        margin-top: 20px;
        margin-bottom: 30px;
        border-left: 4px solid #00a0e9;
        padding-left: 24px;
      }
      .titleCaption {
        display: block;
        color: #333333;
        font-size: 13px;
        font-weight: bold;
        background-color: #f5f5f5;
        padding-left: 24px;
        height: 31px;
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