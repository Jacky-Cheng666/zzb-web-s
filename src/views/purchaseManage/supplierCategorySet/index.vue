<template>
  <div class="app-container supplierCategorySet" style="height:640px;">
      <div class="titleEdit">供应商分类设置</div>
      <div style="margin-bottom: 20px;">
        <span style="font-size: 13px;color:#999999;margin-left: 20px;font-weight: bold;">
          请选择贵司需要的供应商分类，此项配置对全公司所有部门有效</span>

        <span style="float:right;">
          <el-button type="text" size="mini" @click="getAll()">全选</el-button>
          <el-button style="margin-right: 100px;" type="text" size="mini" @click="getNone()">全不选</el-button>
        </span>
      </div>

      <el-row style="line-height: 25px;padding-left: 20px;box-sizing: border-box;font-size: 13px;">
        <el-checkbox-group :min="1" v-model="workpieces">
          <el-col v-for="(item,index) in def_workpiece_list" :key="index" :span="(item.id === 0)?24:6">
            <span class="titleCaption" v-show="item.id === 0">{{item.name}}</span>
            <el-checkbox :label="item.id" v-show="item.id !== 0"> {{item.name}}</el-checkbox>
            </el-col>
        </el-checkbox-group>
      </el-row>

      <div style="margin-top: 20px;">
      <router-link to="/purchaseManage/supplierManage"><el-button style="margin-left: 20px;" size="mini">取 消</el-button></router-link>
      <el-button style="margin-left: 20px;" type="primary" size="mini" @click="submitForm">保 存</el-button>
      </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { set_workpiece_list } from '@/api/purchaseManage'
export default {
  name: "supplierCategorySet",
  data() {
    return {
        workpieces: [],
        def_workpiece_list: []
    };
  },
  computed: {
      ...mapGetters(['workpiece_define_list','workpiece_list','token'])
  },
  watch: {
    workpiece_define_list: {
        deep: true,
        immediate: true,
        handler(newV,oldV){
            this.getWorkpieceList()
        }
    }
  },
  methods:{
      getWorkpieceList(){
        let list1 = [{id: 0, name: '标品贸易'}], list2 = [{id: 0, name: '加工制造'}]
        this.workpiece_define_list.forEach(node => {
            if (node.id <= 1000) {
            list1.push(node)
            } else {
            list2.push(node)
            }
        })
        this.def_workpiece_list = list1.concat(list2)
        this.workpiece_list.map(item=>item.id).forEach((item,index)=>{
            this.$set(this.workpieces,index,item)
        })
       },
      submitForm(){
        let list = []
        this.def_workpiece_list.forEach(node => {
          this.workpieces.forEach(id => {
            if (id == node.id) {
              list.push(node)
            }
          })
        })

        if (0 == list.length) {
          this.$message({
             type: 'warning',
             message:"请至少选择一项分类"
           });
          return
        }

        set_workpiece_list({ access_token: this.token, workpiece_list: list}).then(result => {
            if (result.code == 0) {
              this.$message({
                type: 'success',
                message: '设置成功!'
              });

              this.$store.dispatch('zzb/getAllWorkPieceList')
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      getAll(){
        this.workpieces = []
        this.def_workpiece_list.forEach(node => {
          if(0 !== node.id) {
            this.workpieces.push(node.id)
          }
        })
      },
      getNone(){
        this.workpieces = []
      },
    }
};
</script>

<style lang="scss">
.supplierCategorySet {
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
        color: #333333;
        font-size: 13px;
        font-weight: bold;
    }
      
}
</style>
