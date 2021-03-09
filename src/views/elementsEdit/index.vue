<template>
  <div class="app-container elementsEdit">
    <div>
      <div class="titleEdit">{{isEdit?'编辑物料':'添加物料'}}</div>
      <el-form :model="ruleFormAdd" ref="ruleFormAdd" label-width="120px">
        <el-form-item label="型号" prop="spec_code" :rules="{required: true, message: '规格型号为必填项', trigger: 'blur',}">
          <el-input size="mini" style="width: 320px" v-model="ruleFormAdd.spec_code" auto-complete="off" placeholder="规格型号" />
          <el-input size="mini" style="margin-left: 10px; width: 70px" v-model="ruleFormAdd.version" auto-complete="off" placeholder="版本" />
          <div style="display: inline-block;width: 150px;line-height: 26px;vertical-align: middle;">
            <i style="margin-left: 10px; color: #2cd03e;font-size:16px" class="el-icon-success" v-show="isNameOk === true"></i>
            <i style="margin-left: 10px; color: red;font-size:16px" class="el-icon-error" v-show="isNameOk === false"></i>
            <el-button style="float: right" type="primary" size="mini" @click="checkOk(ruleFormAdd.spec_code, ruleFormAdd.version, true, ruleFormAdd.brand, ruleFormAdd.element_name)">检查相同项</el-button>
          </div>
        </el-form-item>
        <div style="overflow: hidden; margin-bottom: 10px; margin-top: 16px">
          <span style="font-size: 12px;color: #999999;float: left;margin-left: 120px;font-weight: bold;">如果规格型号、品牌、名字三项和其它物料完全相同，则不能添加成功</span>
        </div>
        <el-form-item label="品牌" prop="brand" :rules="{required: true, message: '品牌为必填项', trigger: 'blur'}">
          <el-input size='mini' style="width: 400px;" v-model="ruleFormAdd.brand" auto-complete="off" placeholder="品牌名称"></el-input>
        </el-form-item>

        <el-form-item label="名称" prop="element_name" :rules="{ required: true, message: '名称为必填项', trigger: 'blur' }">
          <el-input size="mini" style="width: 400px" v-model="ruleFormAdd.element_name" auto-complete="off" placeholder="物料名称" />
        </el-form-item>
        <el-form-item label="单位" prop="unit" :rules="{ required: true, message: '单位为必填项', trigger: 'blur' }">
          <el-input size="mini" style="width: 400px" v-model="ruleFormAdd.unit" auto-complete="off" placeholder="物料计量单位" />
        </el-form-item>
        <el-form-item label="最小包装" prop="min_pack_num" :rules="{required: true, message: '最小包装为必填项', trigger: 'blur'}">
          <el-input size="mini" type="number" style="width: 400px" v-model="ruleFormAdd.min_pack_num" auto-complete="off" placeholder="最小包装，即最小购买数量"/>
        </el-form-item>
        <el-form-item label="代码" prop="element_code" :rules="{ required: !checked, message: '代码为必填项' }">
          <div>
            <el-checkbox v-model="checked">系统生成</el-checkbox>
            <span style="font-size: 12px;color: #999999;margin-left: 10px;font-weight: bold;">
              物料代码不能相同，建议使用系统生成
            </span>
          </div>
          <div v-show="!checked">
            <el-input size="mini" style="width: 400px" :disabled="checked" v-model="ruleFormAdd.element_code" auto-complete="off" placeholder="物料代码" />
            <div style="display: inline-block;width: 150px;line-height: 26px;vertical-align: middle;">
              <i style="margin-left: 10px; color: #2cd03e" class="iconfont icon-ShapeCopy" v-show="isNickNameOk === true"></i>
              <i style="margin-left: 10px; color: red" class="iconfont icon-cuowu" v-show="isNickNameOk === false"></i>
              <el-button style="float: right" type="primary" size="mini" :disabled="checked" @click="checkOk(ruleFormAdd.element_code, false)">检查相同项</el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="品类" prop="content_code" :rules="{ required: true, message: '品类为必选项' }">
          <el-cascader
            filterable
            style="width: 400px"
            size="mini"
            placeholder="请选择物料品类"
            @change="handleChangerRule(ruleFormAdd)"
            :props="select_props"
            :options="encode_rule_list"
            v-model="encode_code_list"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="供应商分类" prop="workpiece_id" :rules="{ required: true, message: '供应商分类为必选项' }">
          <el-select size="mini" style="width: 400px" v-model.number="ruleFormAdd.workpiece_id" placeholder="供应商分类">
            <el-option v-for="item in workpiece_list" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键物料" prop="major">
          <el-checkbox v-model="ruleFormAdd.major" @change="boxChange(ruleFormSet)" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" style="width: 400px" v-model="ruleFormAdd.remark" placeholder="请输入备注" maxlength="1000" :show-word-limit="true" :autosize="{ minRows: 2, maxRows: 7 }" />
        </el-form-item>
        <el-form-item></el-form-item>
        <el-form-item>
          <router-link to="/enterpriseManage/inventoryManage/elementsManage">
            <el-button size="mini" @click="goToElementsManage">取 消</el-button>
          </router-link>
          <el-button style="margin-left: 20px" type="primary" size="mini" @click="submitForm('ruleFormAdd', true)">保 存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { check_element_exists } from '@/api/enterpriseManage'
import { mapGetters } from 'vuex'
export default {
  name: "elementsEdit",
  data() {
    return {
        select_props: {
          value: 'code',
          label: 'name',
          children: 'sub_list'
        },
        encode_code_list: [],
        encode_rule_list: [],
        ruleFormAdd: {
          "spec_code": "",
          "version": "",
          "brand": "",
          "element_name": "",
          "unit": "",
          "min_pack_num": "",
          "element_code": "",
          "workpiece_id": "",
          "content_code": "",
          "content_name": "",
          "remark": "",
          "major":""
        },
        checked: true,
        workpiece_list: [],
        isNameOk: "",
        isNickNameOk: ""
    };
  },
  computed: {
    ...mapGetters(['token']),
    isEdit(){
        return this.$route.meta.isEdit
    }
  },
  methods: {
      boxChange(){},
      goToElementsManage(){},
      submitForm(formName, key) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('恭喜，输入通过')
            this.handleDiaSureAdd(formName,key)
          } else {
            this.$message({
              type: 'warning',
              message: '请检查所有输入和选项是否完整!'
            });
            return false;
          }
        });
      },
      async checkOk(name,version,key,brand,element_name){
        //true 型号
        if(!name){
          this.$message({
            type: 'warning',
            message: '请输入检查内容！'
          });
          return
        }

        if (key && (!brand || !element_name)) {
          this.$message({
            type: 'warning',
            message: '检查规格型号，需要指定品牌以及名称！'
          });
          return
        }

        let keywords = name + (version?version:'')
        let forData=key?{spec_code:keywords,brand:brand,element_name:element_name}:{element_code:name}
        let result = await check_element_exists({
          access_token: this.token,
          ...forData
        })
        if(result.code===0) {
          key?this.isNameOk = true:this.isNickNameOk = true
        }else {
          key?this.isNameOk = false:this.isNickNameOk = false
        }
      },
  }
};
</script>

<style lang="scss">
.elementsEdit {
    .titleEdit {
        color: #333333;
        font-size: 16px;
        font-weight: bold;
        margin-top: 20px;
        margin-bottom: 30px;
        border-left: 4px solid #00a0e9;
        padding-left: 24px;
    }
    .el-form-item {
        margin-bottom: 12px;
    }
}
</style>