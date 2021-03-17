<template>
  <div class="element_info">
      <el-dialog center :title="titleName" :visible.sync="openElementInfo" width="646px" append-to-body>
          <el-form ref="element_info" :model="elementInfoForm" label-width="50px" :inline="true">
              <el-form-item>
                  <div>{{myElementTitleName}}：</div>
                  <el-form-item label="名称" prop="element_name">
                      <el-input v-model="elementInfoForm.element_info.element_name" placeholder="输入名称" clearable size="small" style="width: 260px"/>
                  </el-form-item>
                  <el-form-item label="代码" prop="element_code">
                      <el-input v-model="elementInfoForm.element_info.element_code" placeholder="输入代码" clearable size="small"/>
                  </el-form-item>
                  <el-form-item label="型号" prop="spec_code">
                      <el-input v-model="elementInfoForm.element_info.spec_code" placeholder="输入型号" clearable size="small" style="width: 260px"/>
                  </el-form-item>
                  <el-form-item label="品牌" prop="element_code">
                      <el-input v-model="elementInfoForm.element_info.brand" placeholder="输入品牌" clearable size="small"/>
                  </el-form-item>
                  <el-form-item label="单位" prop="unit">
                      <el-input style="width:80px" v-model="elementInfoForm.element_info.unit" placeholder="单位" clearable size="small"/>
                  </el-form-item>
                  <el-form-item label="最小包装" prop="min_package" label-width="70px">
                      <el-input style="width:100px" v-model="elementInfoForm.element_info.min_pack_num" placeholder="最小包装" clearable size="small"/>
                  </el-form-item>
                  <el-form-item label="最少购买" prop="min_purchase" label-width="80px">
                      <el-input style="width:170px" v-model="elementInfoForm.element_info.min_purchase" placeholder="最少购买" clearable size="small"/>
                  </el-form-item>
                  <el-form-item label="品类" prop="work_piece_id">
                      <encodeRule :formData="elementInfoForm" v-model="encode_code_list" />
                      <!-- <el-cascader filterable style="width: 100%;" placeholder="请选择物料品类" @change="handleChangerRule(elementInfoForm)"
                        :props="select_props" :options="encode_rule_list" v-model="encode_code_list" clearable>
                      </el-cascader> -->
                      <!-- <el-select placeholder="选择品类" v-model="elementInfoForm.element_info.work_piece_id" size="small" style="width:520px">
                        <el-option label="全部" value="全部"></el-option>
                        <el-option label="预付" value="预付"></el-option>
                        <el-option label="到付" value="到付"></el-option>
                        <el-option label="月结" value="月结"></el-option>
                        <el-option label="自建" value="自建"></el-option>
                      </el-select> -->
                  </el-form-item>
                  <slot name="my_element_sub"></slot>
              </el-form-item>

              <slot name="content-wrap"></slot>
              
              <el-form-item>
                  <div class="myElementTitleName">备注：</div>
                  <el-form-item prop="remark">
                      <el-input v-model="elementInfoForm.remark" placeholder="输入备注说明" clearable size="small" style="width: 570px"/>
                  </el-form-item>
              </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
             <el-button size="mini" @click="openElementInfo = false">取 消</el-button>
             <el-button size="mini" type="primary" @click="handleEditMaterial">确 定</el-button>
          </div>
      </el-dialog>
  </div>
</template>

<script>
// import { check_element_exists, is_elements_repeat, add_elements} from '@/api/enterpriseManage'

import { mapGetters } from 'vuex'

import encodeRule from '@/components/encodeRule'

export default {
    name: "element_info",
    props:{
        titleName: {
            default: "物料信息"
        },
        myElementTitleName: {
            default: "我方物料信息"
        },
        elementInfoForm: {
            
        }
    },
    components: {
        encodeRule
    },
    data() {
        return {
            openElementInfo: false,
            encode_code_list: []
            // elementInfoForm: {
            //     element_info: {},
            //     buy_info: {},
            //     sale_info: {},
            //     trade_info: {},
            //     element_name: "",
            //     element_code: "",
            //     spec_code: "",
            //     brand: "",
            //     unit: "",
            //     min_package: "",
            //     min_purchase: "",
            //     work_piece_id: "",
            //     trade_num: "",
            //     noTax: "",
            //     price: "",
            //     remark: ""
            // }
        }
    },
    created() {
        // console.log('公共组件');
        // this.resetElementInfoForm()
    },
    methods: {
        handleChangerRule(ruleForm) {
            
        },
        handleEditMaterial(){
            this.openElementInfo = false
            this.$emit('editSingleMaterial')
        },
        // resetElementInfoForm(){
        //     console.log(1)
        //     this.elementInfoForm.isHasTax = this.elementInfoForm.isHasTax ? true : false
        // }
    }
}
</script>

<style>

</style>