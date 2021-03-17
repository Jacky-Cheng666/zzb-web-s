<template>
  <div class="app-container productLibrary">
    <el-form class="mb10" :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item>
        <el-input v-model="queryParams.inputValue" placeholder="输入关键字" clearable size="small" style="width: 180px" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryParams.selectStatus" size="small" style="width: 100px">
          <el-option :label="item.financial_book_name" :value="item.financial_book_no" v-for="(item,index) in financial_book_list" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" type="text">产品首页</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <svg-icon iconClass="tip" class="mr5" style="font-size:18px;display:inline-block"></svg-icon>
      <span class="table_tip">点击“规格型号”可以。</span>
    </el-row>

    
    <el-table class="mb8" stripe row-key="spec_id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" :height="screen_height-350" v-loading="loading" element-loading-text="加载中..." :data="tableData">
      <el-table-column align="center" label="名称" prop="product_name" width="180" />
      <el-table-column align="center" label="规格型号" prop="spec_code" width="240">
        <template slot-scope="scope">
          <span v-if="!scope.row.disabled">{{scope.row.spec_list.length}}个型号</span>
          <span v-else>{{scope.row.spec_code}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="品牌" prop="brand" width="100" />
      <el-table-column align="center" label="单位" prop="unit" width="60" />
      <el-table-column align="center" label="属性">
        <template slot-scope="scope">
          <div v-if="!scope.row.disabled" style="display: flex; flex-direction: row; align-items: center; justify-content: center;">
            <span @click="editProduct(scope.row)" style="color: #3893E6; cursor: pointer;margin-right:20px">编辑产品</span>
            <span style="color: #3893E6; cursor: pointer;margin-right:20px">上传图片</span>
            <span @click="addNewSpecCode(scope.row)" style="color: #3893E6; cursor: pointer;margin-right:20px">新增型号</span>
            <span @click="deleteProduct(scope.row)" style="color: #E34348; cursor: pointer;">删除产品</span>
          </div>
          <div v-else>
              <span style="margin-right:48px" v-for="item in scope.row.property_list" :key="item.spec_id">{{item.name}}：{{item.value}}</span>
              <i @click="editSpec(scope.row)" style="float:right;margin-right:8px;font-size:16px;color:#3894FF;cursor:pointer" class="el-icon-edit"></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope" v-if="scope.row.disabled"> 
          <el-button size="mini" icon="el-icon-money" type="text">报价</el-button>
          <el-button @click="deleteSpec(scope.row)" size="mini" icon="el-icon-delete" type="text" class="text-danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="handleCurrentChange">
      <div>
        <el-button type="primary" icon="el-icon-plus" size="mini">新增产品</el-button>
        <el-tooltip class="item" effect="dark" content="刷新" placement="top">
            <el-button @click="getProductList" size="mini" circle icon="el-icon-refresh"/>
        </el-tooltip>
      </div>
    </pagination>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { get_product_list, delete_product_spec } from '@/api/saleManage'
export default {
  name: 'productLibrary',
  data() {
    return {
      queryParams: {
        inputValue: "",
        pageNum: 1,
        pageSize: 100,
      },
      loading: false,
      tableData: [],
      total: 0,
      allRows: [],
      paginationRows: [],
      currentSpecRow: {}
    }
  },
  computed: {
    ...mapGetters(['screen_height','token','financial_book_list'])
  },
  created() {
    this.getProductList()
  },
  methods: {
    async getProductList(){
      this.loading = true;
      let result = await get_product_list({
        access_token: this.token
      })
      if(result.code===0){
        this.loading = false;
        let tmpList = result.product_list
        tmpList.forEach(item=>{
          item.spec_id = item.product_id;
          item.spec_list.forEach(it=>{
            it.disabled = true;
            it.product_name = item.product_name;
            it.brand = item.brand;
            it.unit = item.unit;
            it.product_id = item.product_id;
            it.product_property_list = item.property_list;
          })
          item.children = item.spec_list;
        })
        this.allRows = tmpList;
        this.handleQuery();
      }
    },
    deleteSpec(row){
      this.currentSpecRow = this.$DeepClone(row)
      this.$confirm('确定删除 “'+ row.spec_code +'” , 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let result = await delete_product_spec({
          access_token: this.token,
          product_id: this.currentSpecRow.product_id,
          spec_id: this.currentSpecRow.spec_id
        })
        if(result.code===0){
          this.$notify({
            type: 'success',
            title: '成功',
            message: '操作成功'
          })
          this.getProductList();
        }
      }).catch(()=>{})
    },
    handleQuery(){
      let temp = [];
      this.allRows.forEach(item=>{
        // if ( this.queryParams.status == "未设置" && item.min_storage != 0 && item.max_storage != 0)return;
        // if ( this.queryParams.status == "已设置" && (item.min_storage == 0 || item.max_storage == 0))return;
        if(!this.$FilterFun(this.queryParams.inputValue,item))return
        temp.push(item)
      })
      this.total = temp.length;
      this.paginationRows = temp;
      this.queryParams.pageNum = 1;
      this.tableData = this.paginationRows.slice(0, this.queryParams.pageSize);
    },
    resetQuery(){},
    getPayDemandList(){},
    handleCurrentChange(){},
    viewSalesOrder(row){
      this.$router.push('/saleManage/saleOrder'+row.order_name)
    }
  },

}
</script>

<style lang="scss" scoped>
.productLibrary{
  .table_tip{
    font-size: 14px;
    color: #515a6e;
  }
}
</style>