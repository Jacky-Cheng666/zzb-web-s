<template>
  <div class="app-container productLibrary">
    <el-form class="mb10" :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item prop="inputValue">
        <el-input v-model="queryParams.inputValue" placeholder="输入关键字" clearable size="small" style="width: 180px" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item prop="selectStatus">
        <el-select disabled v-model="queryParams.selectStatus" size="small" style="width: 100px">
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
            <span style="color: #ccc; cursor: test;margin-right:20px">上传图片</span>
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
          <el-button @click="responsePrice(scope.row)" size="mini" icon="el-icon-money" type="text">报价</el-button>
          <el-button @click="deleteSpec(scope.row)" size="mini" icon="el-icon-delete" type="text" class="text-danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="handleCurrentChange">
      <div>
        <el-button @click="addNewProduct" type="primary" icon="el-icon-plus" size="mini">新增产品</el-button>
        <el-tooltip class="item" effect="dark" content="刷新" placement="top">
            <el-button @click="getProductList" size="mini" circle icon="el-icon-refresh"/>
        </el-tooltip>
      </div>
    </pagination>

    <el-dialog width="492px" center title="型号信息" :visible.sync="addModelVisible">
      <el-form :model="form" ref="form">
        <el-form-item class="mb20" prop="spec_code" :rules="[{ required: true, message: '请输入规格型号', trigger: 'blur' }]">
          <el-input size="small" clearable v-model="form.spec_code" autocomplete="off" placeholder="规格型号" />
        </el-form-item>
        <div style="text-align:left;margin-bottom:10px">属性列表：</div>
        <el-table :header-cell-style="{backgroundColor: '#F7F7F7', color: '#5B6B73!important',height: '32px!important'}" stripe border :data="form.attribute_list" style="width: 100%">
            <el-table-column prop="name" label="属性名称" width="180"></el-table-column>
            <el-table-column prop="options" label="属性选项" width="260">
                <template slot-scope="scope">
                    <el-select size="mini" v-model="scope.row.value" placeholder="请选择">
                      <el-option v-for="item in scope.row.options" :key="item" :label="item" :value="item" />
                    </el-select>
                </template>
            </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:right">
        <el-button size="mini" @click="addModelVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="sureAddSpecCode">确 定</el-button>
      </div>
    </el-dialog>

    <addProductMask v-model="addForm" @submitAddProductMask="submitAddProductMask" ref="addProductMask" />
    <setPriceRuleMask @submitSetPrice="submitSetPrice" v-model="price_form" ref="setPriceRuleMask" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { get_product_list, delete_product_spec, delete_product,add_product,edit_product,add_product_spec,edit_product_spec,set_pricing } from '@/api/saleManage'
import addProductMask from './components/addProductMask'
import setPriceRuleMask from './components/setPriceRuleMask'
import common from "@/utils/common.js"
export default {
  name: 'productLibrary',
  components: {addProductMask,setPriceRuleMask},
  data() {
    return {
      queryParams: {
        inputValue: "",
        pageNum: 1,
        pageSize: 100,
        selectStatus: ""
      },
      loading: false,
      tableData: [],
      total: 0,
      allRows: [],
      paginationRows: [],
      currentSpecRow: {},
      addForm: {
        product_name: "",
        brand: "",
        unit: "",
        product_id: [],
        property_list: []
      },
      isEditProduct: false,
      isEditSpec: false,
      currentRow: {},
      addModelVisible: false,
      form:{
        attribute_list: []
      },
      price_form: {
        element_info:{
          product_name:"",
          spec_code: "",
          brand: "",
          unit: ""
        },
        pricing:{
          auto_offer: false,
          basic: {
              base_price: "",
              lowest_price: "",
              offer_with_tax: false,
              tax_value: 0,
              expire_date: new Date().getTime(),
              num_range: [],
              deliver_days: ""
          },
          step_offer: false,
          step_list: []
        }  
      }
    }
  },
  computed: {
    ...mapGetters(['screen_height','token','financial_book_list','product_type_list'])
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
    deleteProduct(row){
      this.$confirm('确认删除 “'+ row.product_name +'” , 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delete_product({
            access_token: this.token,
            product_id: row.product_id
          }).then(result=>{
              if(result.code===0){
                this.$notify({
                  type: 'success',
                  title: '成功',
                  message: '操作成功'
                })
                this.getProductList();
              }
            })
        }).catch(()=>{})
    },
    addNewProduct(){
      this.isEditProduct = false;
      this.addForm.product_id = [];
      this.addForm.product_name = "";
      this.addForm.unit = "";
      this.addForm.brand = "";
      this.addForm.property_list = [];
      this.$refs.addProductMask.dialogFormVisible = true;
    },
    getItem(data, id) {
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        if (item.id === id) {
          return item;
        } else if (item.items && item.items.length > 0) {
          let result = this.getItem(item.items, id);
          if (result) {
            return result;
          }
        }
      }
      return null;
    },
    async submitAddProductMask(){
      let product_type_id = this.addForm.product_id[this.addForm.product_id.length-1];
      let product_type_name = this.getItem(this.product_type_list, product_type_id).name;
      let flag = this.addForm.property_list.some(item=>!item.name||!item.options);
      if(flag) {
       return this.$message({type:'warning',message:'属性名称或属性选项不能为空'})
      }
      if(!this.isEditProduct){
        let result = await add_product({
          access_token: this.token,
          product_type_id,
          product_type_name,
          product_name: this.addForm.product_name,
          brand: this.addForm.brand,
          unit: this.addForm.unit,
          property_list: this.addForm.property_list
        })
        if(result.code===0){
          this.$notify({
            type: 'success',
            title: '成功',
            message: '新增成功'
          })
          this.$refs.addProductMask.dialogFormVisible = false;
          this.getProductList();
        }
      }else{
        let result = await edit_product({
          access_token: this.token,
          product_id: this.currentRow.product_id,
          product_type_id,
          product_type_name,
          product_name: this.addForm.product_name,
          brand: this.addForm.brand,
          unit: this.addForm.unit,
          property_list: this.addForm.property_list
        })
        if(result.code===0){
          this.$notify({
            type: 'success',
            title: '成功',
            message: '操作成功'
          })
          this.$refs.addProductMask.dialogFormVisible = false;
          this.getProductList();
        }
      }
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
    resetQuery(){
      this.$refs.queryForm.resetFields();
      this.handleQuery();
    },
    getPayDemandList(){},
    handleCurrentChange({page:currentPage,limit: pageSize}){
      this.tableData = this.paginationRows.slice(
        pageSize * (currentPage - 1),
        pageSize * currentPage
      );
    },
    viewSalesOrder(row){
      this.$router.push('/saleManage/saleOrder'+row.order_name)
    },
    addNewSpecCode(row){
      this.isEditSpec = false;
      this.currentRow = this.$DeepClone(row)
      let arr = this.$DeepClone(row.property_list)
      
      arr.forEach(item=>{
        let options = item.options.split(",")
        item.options = options
      })
      this.form.attribute_list = JSON.parse(JSON.stringify(arr))
      this.addModelVisible = true;
    },
    sureAddSpecCode(){
      this.$refs.form.validate((valid)=>{
        if(valid){
          let property_list = this.form.attribute_list.map(item=>{
              return {
                name: item.name,
                value: item.value
              }
            })
          if(!this.isEditSpec){
            add_product_spec({
              access_token: this.token,
              product_id: this.currentRow.product_id,
              spec_code: this.form.spec_code.trim(),
              property_list
            }).then(result=>{
              if(result.code===0){
                this.$notify({
                  type: 'success',
                  title: '成功',
                  message:"操作成功",
                })
                this.addModelVisible = false;
                this.getProductList();
              }
            })
          }else{
            edit_product_spec({
              access_token: this.token,
              product_id: this.currentSpecRow.product_id,
              spec_id: this.currentSpecRow.spec_id,
              spec_code: this.form.spec_code.trim(),
              property_list
            }).then(result=>{
              if(result.code===0){
                this.$notify({
                  type: 'success',
                  title: '成功',
                  message:"操作成功",
                })
                this.addModelVisible = false;
                this.getProductList();
              }
            })
          }
          
        }else{
          console.log('error submit!');
          return false;
        }
      })
    },
    editProduct(row){
      let product_type_id = row.product_type_id;
      let second_id = product_type_id - product_type_id%100
      let first_id = product_type_id - product_type_id%1000
      let product_id = [first_id, second_id, product_type_id]
      this.addForm.product_id = product_id;
      this.addForm.product_name = row.product_name;
      this.addForm.unit = row.unit;
      this.addForm.brand = row.brand;
      this.addForm.property_list = JSON.parse(JSON.stringify(row.property_list));
      this.addForm.valueWorkPiece = row.workpiece_id;
      this.currentRow = JSON.parse(JSON.stringify(row));
      this.$refs.addProductMask.dialogFormVisible = true;
      this.isEditProduct = true;
    },
    editSpec(row){
      this.currentSpecRow = this.$DeepClone(row)
      this.isEditSpec = true;
      this.$set(this.form,"spec_code",row.spec_code)
      row.property_list.forEach(item=>{
        row.product_property_list.forEach(it=>{
          if(it.name===item.name){
            item.options = it.options.split(",");
          }
        })
      })
      this.form.attribute_list = this.$DeepClone(row.property_list);
      this.addModelVisible = true;
    },
    responsePrice(row){
      this.currentRow = this.$DeepClone(row);
      this.price_form.element_info.product_name = this.currentRow.product_name;
      this.price_form.element_info.spec_code = this.currentRow.spec_code;
      this.price_form.element_info.brand = this.currentRow.brand;
      this.price_form.element_info.unit = this.currentRow.unit;

      let obj =  this.price_form.pricing;
      if(row.pricing){
        let newObj = this.$DeepClone(row.pricing)
        newObj.step_list.forEach(item=>{
          this.$set(item,'on_sale_percent',common.fixFloat2(item.on_sale*100))
        })
        for (const k in obj) {
          obj[k] = newObj[k]
        }
      }else{
        this.price_form.pricing.auto_offer = false;
        this.price_form.pricing.step_offer = false;
        this.price_form.pricing.step_list = [];
        this.price_form.pricing.basic.base_price = "";
        this.price_form.pricing.basic.deliver_days = "";
        this.price_form.pricing.basic.lowest_price = "";
        this.price_form.pricing.basic.num_range = [];
        this.price_form.pricing.basic.offer_with_tax = false;
        this.price_form.pricing.basic.tax_name = "普票";
        this.price_form.pricing.basic.tax_value = 0;
      }
      this.$refs.setPriceRuleMask.dialogFormVisible = true;
    },
    submitSetPrice(val){
      this.price_form.pricing.basic.base_price = parseFloat(this.price_form.pricing.basic.base_price);
      this.price_form.pricing.basic.lowest_price = parseFloat(this.price_form.pricing.basic.lowest_price);
      let row_index = 0;
      let flag = this.price_form.pricing.step_list.some((item,index)=>{                           
        delete item.on_sale_percent
        if(!item.deliver_days || item.num_range.length<2){
          row_index = index;
          return true;
        }
      })
      if(flag){
        return this.$message({
            showClose: true,
            message: `第${row_index+1}行 最小数量 或 最大数量 或 标准交期为空`,
            type: 'warning'
        })
      }
      set_pricing({
        access_token: this.token,
        product_id: this.currentRow.product_id,
        spec_id: this.currentRow.spec_id,
        pricing: {
          auto_offer: this.price_form.pricing.auto_offer,
          basic: {
            ...this.price_form.pricing.basic,
            tax_name: val
          },
          step_offer: this.price_form.pricing.step_offer,
          step_list: this.price_form.pricing.step_list
        }
      }).then(result=>{
        if(result.code===0){
          this.$notify({
            message: '操作成功',
            title: '成功',
            type: 'success'
          })
          this.$refs.setPriceRuleMask.dialogFormVisible = false;
          this.getProductList();
        }
      })
    },
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