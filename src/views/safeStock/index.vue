<template>
  <div class="app-container safeStock">

    <el-form class="mb10" :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item prop="inputValue">
        <el-input v-model="queryParams.inputValue" placeholder="输入关键字" clearable size="small" style="width: 180px" @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item prop="status">
        <el-select v-model="queryParams.status" size="small" style="width: 100px">
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

    <el-table class="mb8" v-loading="loading" element-loading-text="加载中..." ref="multipleTable" :data="tableData" stripe :height="screen_height-340" @selection-change="handleSelectionChange" style="width: 100%" :default-sort="{prop:'element_code', order: 'ascending'}">
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
      <input type="file" @change="OnFileChanged(this)" ref="imFile" style="display: none" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
      <el-button style="margin-left:5px" icon="el-icon-delete" size="mini" @click="deleteSafeElements" type="danger">删除</el-button>
      <el-button icon="el-icon-check" size="mini" @click="submit" type="success">提交</el-button>
      <!-- <el-button icon="el-icon-back" size="mini" @click="goToElementsManage">退出</el-button> -->
    </pagination>
  </div>
</template>

<script>
import { get_element_stock_controls, delete_element_stock_controls, set_element_stock_controls} from '@/api/enterpriseManage.js'
import { mapGetters } from 'vuex'
export default {
  name: "safeStock",
  data() {
    return {
      loading: false,
      queryParams: {
        pageNum: 1,
        pageSize: 100,
        status: "全部",
        inputValue: "",
      },
      total: 0,
      tableData: [],
      allRows: [],
      paginationRows: [],
      multipleSelection: [],
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
          // this.paginationRows = this.allRows;
          // this.total = this.paginationRows.length;
          // this.queryParams.pageNum = 1;
          // this.tableData = this.allRows.slice(0, this.queryParams.pageSize);
          this.handleQuery();
        }
      }
    },
    searchSafeStorage() {},
    exportTemplate(){
      window.location.href = process.env.VUE_APP_BASEURL + "/template/安全库存模板.xlsx";
    },
    downloadTemp(){},
    uploadFile(){
      this.imFile = this.$refs.imFile;
      this.imFile.click();
    },
    OnFileChanged() {
      let _this = this;
      var files = this.imFile.files;
      var file = new FileReader();
      file.readAsArrayBuffer(files[0]);
      file.onload = function(e) {
        try {
          var fileContent = e.target.result;
          var wb = XLSX.read(_this.fixdata(fileContent), { type: "binary" });
          var items = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
          _this.ReadElementList(items);
          _this.$refs.imFile.value = "";
        } catch (error) {
          console.log(error);
          return;
        }
      };
    },
    fixdata(data) {
      // 文件流转BinaryString
      var o = "";
      var l = 0;
      var w = 10240;
      for (; l < data.byteLength / w; ++l) {
        o += String.fromCharCode.apply(
          null,
          new Uint8Array(data.slice(l * w, l * w + w))
        );
      }
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
      return o;
    },
    ReadElementList(elemsRaw) {
      let elementSafeStorage = [];

      for (let i in elemsRaw) {
        elemsRaw[i]["物料代码"] = elemsRaw[i]["物料代码"]
          ? elemsRaw[i]["物料代码"].trim()
          : elemsRaw[i]["物料代码"];
        elemsRaw[i]["名称"] = elemsRaw[i]["名称"]
          ? elemsRaw[i]["名称"].trim()
          : elemsRaw[i]["名称"];
        elemsRaw[i]["图号/规格型号"] = elemsRaw[i]["图号/规格型号"]
          ? elemsRaw[i]["图号/规格型号"].trim()
          : elemsRaw[i]["图号/规格型号"];
        elemsRaw[i]["材质/品牌"] = elemsRaw[i]["材质/品牌"]
          ? elemsRaw[i]["材质/品牌"].trim()
          : elemsRaw[i]["材质/品牌"];

        elemsRaw[i]["单位"] = elemsRaw[i]["单位"]
          ? elemsRaw[i]["单位"].trim()
          : elemsRaw[i]["单位"];
        elemsRaw[i]["最小包装"] = elemsRaw[i]["最小包装"]
          ? elemsRaw[i]["最小包装"].trim()
          : elemsRaw[i]["最小包装"];
        elemsRaw[i]["库存下限"] = elemsRaw[i]["库存下限"]
          ? elemsRaw[i]["库存下限"].trim()
          : elemsRaw[i]["库存下限"];
        elemsRaw[i]["库存上限"] = elemsRaw[i]["库存上限"]
          ? elemsRaw[i]["库存上限"].trim()
          : elemsRaw[i]["库存上限"];

        let index = Number(i) + 2;

        if (!elemsRaw[i]["名称"]) {
          this.$message({
            type: "warning",
            showClose: true,
            duration: 0,
            message:
              "第 " +
              index +
              " 行 物料名称 为空。请确所有的 物料名称 都不为空！"
          });
          return;
        }

        if (!elemsRaw[i]["材质/品牌"]) {
          this.$message({
            type: "warning",
            showClose: true,
            duration: 0,
            message:
              "第 " +
              index +
              " 行 材质/品牌 为空。请确保所有的 材质/品牌 都不为空！"
          });
          return;
        }

        if (!elemsRaw[i]["图号/规格型号"]) {
          this.$message({
            type: "warning",
            showClose: true,
            duration: 0,
            message:
              "第 " +
              index +
              " 行 规格型号 为空。请确保所有的 规格型号 都不为空！"
          });
          return;
        }

        if (!elemsRaw[i]["单位"]) {
          this.$message({
            type: "warning",
            showClose: true,
            duration: 0,
            message:
              "第 " + index + " 行 单位 为空。请确保所有的 单位 都不为空！"
          });
          return;
        }

        if (!elemsRaw[i]["最小包装"]) {
          this.$message({
            type: "warning",
            showClose: true,
            duration: 0,
            message:
              "第 " +
              index +
              " 行 最小包装 为空。请确保所有的 最小包装 都不为空！"
          });
          return;
        }
        if (!elemsRaw[i]["库存下限"]) {
          this.$message({
            type: "warning",
            showClose: true,
            duration: 0,
            message:
              "第 " +
              index +
              " 行 库存下限 为空。请确保所有的 库存下限 都不为空！"
          });
          return;
        }
        if (!elemsRaw[i]["库存上限"]) {
          this.$message({
            type: "warning",
            showClose: true,
            duration: 0,
            message:
              "第 " +
              index +
              " 行 库存上限 为空。请确保所有的 库存上限 都不为空！"
          });
          return;
        }

        var element = {
          element_code: elemsRaw[i]["物料代码"],
          element_name: elemsRaw[i]["名称"],
          brand: elemsRaw[i]["材质/品牌"],
          spec_code: elemsRaw[i]["图号/规格型号"],
          unit: elemsRaw[i]["单位"],
          min_pack_num: elemsRaw[i]["最小包装"],
          min_storage: elemsRaw[i]["库存下限"],
          max_storage: elemsRaw[i]["库存上限"]
        };

        elementSafeStorage.push(element);
      }

      if (elementSafeStorage.length > 0) {
        this.allRows.push(...elementSafeStorage);
        this.total = this.allRows.length;
        this.tableData = this.allRows.slice(0,this.queryParams.pageSiz);
      } else {
        this.$message({
          type: "warning",
          message: "文件不匹配或者没有任何物料数据！"
        });
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    limitMinStorage(){},
    handleSizeChange(){},
    handleCurrentChange({page:currentPage,limit: pageSize}){
      this.tableData = this.paginationRows.slice(
        pageSize * (currentPage - 1),
        pageSize * currentPage
      );
    },
    deleteSafeElements(){
      if (this.multipleSelection.length == 0) {
        this.$message({
          type: "warning",
          message: "请至少选择一项物料"
        });
        return;
      }
      let element_code_list = this.multipleSelection.map(item => {
        return item.element_code;
      });
      if(!this.isChecked){
        this.$confirm("是否删除安全设置, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(async()=>{
          let result = await delete_element_stock_controls({
            access_token: this.token,
            element_code_list
          })
          if(result.code===0){
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success'
            })
            this.getElementSafeStockList();
          }
        }).catch(()=>{})
      }
    },
    async submit(){
      if (this.multipleSelection.length == 0) {
        this.$message({
          type: "warning",
          message: "请至少选择一项物料"
        });
        return;
      }
      let element_list = this.multipleSelection;
      let result = await set_element_stock_controls({
        access_token: this.token,
        element_list
      })
      if(result.code===0){
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success'
        })
        if (!this.isChecked) {
            this.getElementSafeStockList();
          }
      }
    },
    goToElementsManage(){},
    handleQuery(){
      let temp = [];
      this.allRows.forEach(item=>{
        if ( this.queryParams.status == "未设置" && item.min_storage != 0 && item.max_storage != 0)return;
        if ( this.queryParams.status == "已设置" && (item.min_storage == 0 || item.max_storage == 0))return;
        if(!this.$FilterFun(this.queryParams.inputValue,item))return
        temp.push(item)
      })
      this.total = temp.length;
      this.paginationRows = temp;
      this.queryParams.pageNum = 1;
      this.tableData = this.paginationRows.slice(0, this.queryParams.pageSize);
    },
    resetQuery(){
      this.$refs.queryForm.resetFields();
      this.handleQuery();
    }
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