<template>
  <div class="app-container purchaserManage">
    <el-form class="mb10" :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item>
        <el-input v-model="queryParams.inputValue" placeholder="输入关键字" clearable size="small" style="width: 180px" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table class="mb8"  stripe :height="screen_height-350" v-loading="loading" element-loading-text="加载中..." :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column align="center" label="采购商全称" prop="purchaser_full_name">
        <template slot-scope="scope" >
          <img style="float: left;margin-left: 10px;width: 20px;height: 20px;" src="@/assets/imgs/company_icon.png" alt="" v-show="scope.row.is_synergy">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="采购商简称" prop="purchase_name" width="200" />
      <el-table-column align="center" label="编号" prop="code_name" width="120" />
      <el-table-column align="center" label="联系人" prop="contact" width="120" />
      <el-table-column align="center" label="联系人手机" prop="phone" width="150" />
      <el-table-column align="center" label="合作关系" width="120">
        <template slot-scope="scope" >
          <el-button v-show="scope.row.apply_id" type="text" @click="supplierAgree(scope.row)" >接受合作</el-button>
          <span v-show="!scope.row.apply_id">合作中</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope" >
          <el-button size="mini" type="text" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" class="text-danger">删除</el-button>              
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="handleCurrentChange">
      <div>
        <el-button type="primary" icon="el-icon-plus" size="mini">添加非协同采购商</el-button>
        <el-tooltip class="item" effect="dark" content="刷新" placement="top">
            <el-button @click="handleRefresh" size="mini" circle icon="el-icon-refresh"/>
        </el-tooltip>
      </div>
    </pagination>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { get_purchaser_list, supplier_add_agree } from '@/api/saleManage'
export default {
  name: "purchaserManage",
  data() {
    return {
      queryParams: {
        inputValue: "",
        pageNum: 1,
        pageSize: 50
      },
      loading: false,
      tableData: [],
      total: 0,
      allRows: []
    }
  },
  computed: {
    ...mapGetters(['screen_height','token'])
  },
  created() {
    this.getPurchaserList();
  },
  methods: {
    async getPurchaserList(){
      this.loading = true;
      let result = await get_purchaser_list({
        access_token: this.token
      })
      if(result.code===0){
        this.loading = false;
        this.allRows = result.purchaser_list;
        this.handleQuery();
      }
    },
    handleQuery(){
      let temp = [];
      this.allRows.forEach(item=>{
        if(!this.$FilterFun(this.queryParams.inputValue,item))return
        temp.push(item)
      })
      this.total = temp.length;
      this.paginationRows = temp;
      this.queryParams.pageNum = 1;
      this.tableData = this.paginationRows.slice(0, this.queryParams.pageSize);
    },
    resetQuery(){},
    handleSelectionChange(){},
    supplierAgree(row){
      this.$confirm('确定接受合作？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        supplier_add_agree({
          access_token: this.token,
          ...row
        }).then(result => {
          if (result.code == 0) {
            this.$notify({
              type: 'success',
              title: '成功',
              message:"操作成功"
            });
            this.getPurchaserList()
          }
        })
      }).catch(() => {});
    },
    handleCurrentChange(){},
    handleRefresh(){
      this.getPurchaserList();
    }
  },

}
</script>

<style>

</style>