<template>
  <div class="addProductMask">
    <el-dialog width="900px" center title="产品信息" :visible.sync="dialogFormVisible">
      <el-form ref="ruleForm" :model="form" :rules="rules">
        <el-form-item prop="product_id">
          <!-- <el-cascader style="width:100%" v-model="form.product_id" :options="product_type_list" :props="{ expandTrigger: 'hover',value: 'id', label: 'name',children: 'items'}" @change="handleChange"></el-cascader> -->
          <productType v-model="form.product_id" />
        </el-form-item>
        <el-form-item>
          <el-form-item>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item prop="product_name">
                  <el-input size="small" clearable v-model="form.product_name" autocomplete="off" placeholder="名称"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="brand">
                  <el-input size="small" clearable v-model="form.brand" autocomplete="off" placeholder="品牌"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="unit">
                  <el-input size="small" clearable v-model="form.unit" autocomplete="off" placeholder="单位" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <div style="text-align: left; margin-top: 10px">属性列表：</div>
          <el-table :header-cell-style="{ backgroundColor: '#F7F7F7', color: '#5B6B73!important', height: '32px!important',}" stripe border :data="form.property_list" style="width: 100%">
            <el-table-column prop="attribute" label="属性名称" width="180">
              <template slot-scope="scope">
                <el-input type="text" class="table_input" v-model="scope.row.name" placeholder="输入属性"/>
              </template>
            </el-table-column>
            <el-table-column prop="option" label="属性选项(多个选项使用英文,分开)" width="580">
              <template slot-scope="scope">
                <el-input @change="limitInput(scope.row)" type="textarea" :rows="2" placeholder="多行输入" v-model="scope.row.options" />
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <i @click="deleteAttribute(scope.$index)" style="font-size: 20px; color: #e34348; cursor: pointer" class="el-icon-delete"/>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-row>
          <el-col style="margin-right: 10px; margin-left: 6px" :span="2">
            <el-button icon="el-icon-setting" size="mini" @click="addAttribute" type="primary">增加属性</el-button>
          </el-col>
          <el-col :offset="18" :span="3.5">
            <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
            <el-button size="mini" type="primary" @click="submitForm">确 定</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import productType from "@/components/productType";
export default {
  name: "addProductMask",
  components: { productType },
  props: {
    value: {
      default: function () {
        return {
          product_name: "",
          brand: "",
          unit: "",
          product_id: [],
          property_list: [],
        };
      },
    },
  },
  watch: {
    form: {
      deep: true,
      handler: function (newV, oldV) {
        this.$emit("input", newV);
      },
    },
  },
  data() {
    return {
      dialogFormVisible: false,
      form: this.value,
      product_type_list: [],
      rules: {
        product_id: [
          { required: true, message: "选择产品类型", trigger: "change" },
        ],
        product_name: [
          { required: true, message: "名称不能为空", trigger: "blur" },
        ],
        brand: [{ required: true, message: "品牌不能为空", trigger: "blur" }],
        unit: [{ required: true, message: "单位不能为空", trigger: "blur" }],
      },
      product_type_name: "",
    };
  },
  created() {
    // this.getTypeList();
  },
  methods: {
    // getTypeList(){
    //     axios.post('/product/get_type_list', {
    //         access_token: this.access_token
    //     }).then(response=>{
    //         let result = response.data
    //         if(result.code===0){
    //             this.product_type_list = result.product_type_list
    //             this.$store.commit("setProductTypeList",JSON.parse(JSON.stringify(this.product_type_list)))
    //         }
    //     })
    // },
    addAttribute() {
      this.form.property_list.push({
        name: "",
        options: "",
      });
    },
    deleteAttribute(index) {
      this.form.property_list.splice(index, 1);
    },
    // handleChange(value) {
    //     let product_type_id = value[value.length-1];
    //     let obj = this.getItem(this.product_type_list, product_type_id);
    //     this.product_type_name = obj.name;
    // },
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$emit("submitAddProductMask");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
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
    limitInput(row) {
      let str = row.options.replace(/，/g, ",").trim();
      let arr = str.split(",").filter((item) => item && item.trim());
      str = arr.join(",");
      this.$set(row, "options", str);
    },
  },
};
</script>

<style lang="scss">
.addProductMask {
  .el-form-item {
    margin-bottom: 12px;
  }
}
// /deep/.el-table--enable-row-hover .el-table__body tr:hover>td
//     background-color: transparent!important;
// .el-table
//     min-height 0
</style>