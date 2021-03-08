<template>
  <div class="app-container safeStock">

    <el-form class="mb10" :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item>
        <el-input v-model="queryParams.inputValue" placeholder="输入关键字" clearable size="small" style="width: 180px" @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item>
        <el-select @change="isSetChange" v-model="queryParams.invoiceStatus" size="small" style="width: 100px">
          <el-option key="全部" label="全部" value="全部"></el-option>
          <el-option key="未设置" label="未设置" value="未设置"></el-option>
          <el-option key="已设置" label="已设置" value="已设置"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table class="mb8" v-loading="loading" element-loading-text="加载中..." ref="multipleTable" :data="tableData" stripe :height="screen_height-340" @selection-change="changeFun" style="width: 100%" :default-sort="{prop:'element_code', order: 'ascending'}">
      <el-table-column align="center" type="selection" width="50" fixed />
      <el-table-column align="center" prop="element_code" label="物料代码" show-overflow-tooltip width="120px" sortable />
      <el-table-column align="center" prop="element_name" label="名称" show-overflow-tooltip width="360px" sortable />
      <el-table-column align="center" prop="spec_code" label="图号/规格型号" show-overflow-tooltip  sortable />
      <el-table-column align="center" prop="brand" label="材质/品牌" show-overflow-tooltip width="140px" sortable />
      <el-table-column align="center" prop="unit" label="单位" width="80px" show-overflow-tooltip />
      <el-table-column align="center" prop="min_pack_num" label="最小包装" width="80px" show-overflow-tooltip />
      <el-table-column align="center" prop="min_storage" label="库存下限" width="140px" show-overflow-tooltip>
        <template slot-scope="scope">
          <input @change="limitMinStorage($event,scope.row)" type="number" class="table_input" v-model.number="scope.row.min_storage"/>
          <i class="el-icon-edit"></i>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="max_storage" label="库存上限" width="140px" show-overflow-tooltip>
        <template slot-scope="scope">
          <input @change="limitMaxStorage($event,scope.row)" type="number" class="table_input" v-model.number="scope.row.max_storage"/>
          <i class="el-icon-edit"></i>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="handleCurrentChange">
      <span class="downloadSty" @click="exportTemplate">
        <img style="vertical-align:middle;margin-top:-4px;margin-right:4px" src="@/assets/imgs/download.png" alt="">
        <span style="font-size: 14px;color:#333333;">下载模板</span>
      </span>

      <span class="downloadSty" @click="uploadFile">
        <img style="vertical-align:middle;margin-top:-4px;margin-right:4px" src="@/assets/imgs/import.png" alt="">
        <span style="font-size: 14px;color:#333333;">批量导入</span>
      </span>
      <el-button style="margin-left:5px" icon="el-icon-delete" size="mini" @click="deleteSafeElements" type="danger">删除</el-button>
      <el-button icon="el-icon-check" size="mini" @click="submit" type="success">提交</el-button>
      <!-- <el-button icon="el-icon-back" size="mini" @click="goToElementsManage">退出</el-button> -->
    </pagination>
  </div>
</template>

<script>
import { get_element_stock_controls } from '@/api/enterpriseManage.js'
import { filterFun } from '@/utils'
import { mapGetters } from 'vuex'
export default {
  name: "safeStock",
  data() {
    return {
      loading: false,
      queryParams: {
        pageNum: 1,
        pageSize: 100,
      },
      total: 0,
      inputValue: "",
      status: "全部",
      tableData: [],
      allRows: [],
      paginationRows: []
    };
  },
  computed: {
    ...mapGetters(['screen_height','token']),
    isChecked(){
        return this.$route.meta.isChecked
    }
  },
  created() {
    this.getElementSafeStockList();
  },
  methods: {
    async getElementSafeStockList(){
      this.loading = true;
      let result = await get_element_stock_controls({
        access_token: this.token
      })
      if(result.code===0){
        this.loading = false;
        if(!this.isChecked){
          this.allRows = result.element_list;
          this.paginationRows = this.allRows;
          this.total = this.paginationRows.length;
          this.tableData = this.allRows.slice(0, this.queryParams.pageSize);
        }
      }
    },
    searchSafeStorage() {},
    exportTemplate(){},
    downloadTemp(){},
    uploadFile(){},
    OnFileChanged(){},
    isSetChange(){},
    changeFun(){},
    limitMinStorage(){},
    handleSizeChange(){},
    handleCurrentChange({page:currentPage,limit: pageSize}){
      this.tableData = this.paginationRows.slice(
        pageSize * (currentPage - 1),
        pageSize * currentPage
      );
    },
    deleteSafeElements(){},
    submit(){},
    goToElementsManage(){},
    handleQuery(){
      let temp = [];
      this.allRows.forEach(item=>{
        if(!filterFun(this.queryParams.inputValue,item))return
        temp.push(item)
      })
      this.total = temp.length;
      this.paginationRows = temp;
      this.queryParams.pageNum = 1;
      this.tableData = this.paginationRows.slice(0, this.queryParams.pageSize);
    },
    resetQuery(){}
  },
};
</script>

<style lang="scss">
.safeStock {
  .table_input {
    width: 80% !important;
  }
  .footer {
    text-align: center;
    margin-top: 5px;
  }
  .downloadSty {
    margin: 0 5px;
  }
}
</style>