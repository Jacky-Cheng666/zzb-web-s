<template>
  <div class="batchAdd">
    <el-dialog center title="查找产品" :visible.sync="openBatchAdd" width="960px" append-to-body>
        <el-form class="mb10" ref="batch_add-form" :model="queryParams" label-width="60px" :inline="true">
            <el-form-item label="关键字">
              <el-input v-model="queryParams.searchInputValue" placeholder="输入产品信息搜索产品库" clearable size="small" style="width: 240px"/>
            </el-form-item>
            <el-form-item>
              <el-cascader filterable size="small" style="width: 420px;" placeholder="请选择物料品类" @change="handleChangerRule(queryParams)"
                        :props="queryParams.select_props" :options="encode_rule_list" v-model="queryParams.encode_code_list" clearable>
              </el-cascader>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>
        <div class="table-content">
            <el-table height="600" v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
                <el-table-column align="center" type="selection" width="50" />
                <el-table-column align="center" label="名称" prop="element_info.element_name" width="200" />
                <el-table-column align="center" label="产品代码" prop="element_info.element_code" width="200" />
                <el-table-column align="center" label="型号" prop="element_info.spec_code" />
                <el-table-column align="center" label="品牌" prop="element_info.brand" width="140" />
                <el-table-column align="center" label="单位" prop="element_info.unit" width="80" />
                <el-table-column align="center" label="最小包装" prop="element_info.min_pack_num" width="80" />
                <el-table-column align="center" label="最低购买" prop="element_info.min_buy_num" width="80" />
            </el-table>
        </div>
        <div slot="footer" class="dialog-footer">
             <el-button size="mini" @click="openBatchAdd = false">取 消</el-button>
             <el-button size="mini" type="primary" @click="handleAddMaterial">确 定</el-button>
          </div>
    </el-dialog>
  </div>
</template>

<script>
import { searchElements } from '@/api/saleManage'

import { mapGetters } from 'vuex'

export default {
  name: "batchAdd",
  data() {
    return {
      openBatchAdd: false,
      queryParams: {
        searchInputValue: '',
        encode_code_list: [],
        select_props: {
          value: 'code',
          label: 'name',
          children: 'sub_list'
        },
        multipleSelection: []
      },
      tableData: [],
      allRows: [],
      rows: [],
      loading:false
    };
  },
  computed:{
    ...mapGetters(['encode_rule_list', 'token'])
  },
  created(){
    this.userInfo = JSON.parse(localStorage.getItem('profile'))
    this.userName = this.userInfo.name
    // this.setCodeRuleList()
  },
  methods: {
    handleQuery(){
      searchElements({
        access_token: this.token,
        element_code: this.queryParams.searchInputValue
      }).then(response => {
        if (response.code == 0){
          let tmpList = response.element_list //接受的数据
          if(tmpList.length > 0){
            tmpList.forEach(item => {
              this.tableData.push(
                {
                  element_info:item,
                  remark: '',
                  buy_info: {
                    offer_price: '',
                    buy_price: '',
                    buy_type_name: '',
                    deadline: '',
                    num: ''
                  },
                  sale_info: {
                    delivery_time: '',
                    sale_price: '',
                    tax_price: ''
                  },
                  trade_info: {},
                  element_no: ''
                }
              )
            })
            // this.rows = this.allRows
            // this.cancelSelect()
          } else {
            this.$message({
              showClose: true,
              type: 'warning',
              message: '未搜索到物料'
            })

            // this.allRows = []
            // this.rows = this.allRows
            // this.showTotal()
          }
        }
      })
    },
    resetQuery(){
      this.queryParams.searchInputValue = ''
      this.queryParams.encode_code_list = []
      this.tableData = []
    },
    handleChange(){},
    handleSelectionChange(val){
      this.queryParams.multipleSelection = val
    },
    //
    handleChangerRule(ruleForm) {
      let codes = []
      ruleForm.content_code = ""
      this.queryParams.encode_code_list.forEach((item, index)=>{
        ruleForm.content_code += item
        codes[index] = item
      })

      let first, second
      ruleForm.content_name = ""
      codes.forEach((code, index) => {
        if (0 == index) {
          this.encode_rule_list.forEach((item, i1) => {
            if (item.code == code) {
              first = i1
              ruleForm.content_name = item.name
            }
          })
        }

        if (1 == index) {
          this.encode_rule_list[first].sub_list.forEach((item, i2) => {
            if (item.code == code) {
              second = i2
              ruleForm.content_name = item.name
            }
          })
        }

        if (2 == index) {
          this.encode_rule_list[first].sub_list[second].sub_list.forEach((item) => {
            if (item.code == code) {
              ruleForm.content_name = item.name
            }
          })
        }
      })

      if (this.queryParams.encode_code_list.length <= 1) {
        ruleForm.content_code += '00000'
      } else if (this.queryParams.encode_code_list.length <= 2) {
        ruleForm.content_code += '000'
      }
    },
    handleAddMaterial(){
      if(this.queryParams.multipleSelection.length > 0){
        this.$emit('addMaterial', this.queryParams.multipleSelection)
      }

      this.openBatchAdd = false
    },
  },
};
</script>

<style lang="scss">
.batchAdd{
   .table-content{
       overflow: auto;
   }
}
</style>