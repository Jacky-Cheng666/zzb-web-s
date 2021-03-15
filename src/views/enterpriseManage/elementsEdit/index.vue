<template>
  <div class="app-container elementsEdit">
    <div>
      <div class="titleEdit">{{isEdit?'编辑物料':'添加物料'}}</div>
      <el-form :model="ruleFormAdd" ref="ruleFormAdd" label-width="120px">
        <el-form-item v-if="isEdit">
          <el-checkbox v-model="ruleFormAdd.disable">禁用</el-checkbox>
        </el-form-item>
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

        <el-form-item v-show="!unusable" label="代码" prop="element_code" :rules="{required: false, message: '代码为必填项',}">
          <el-input size='mini' style="width: 400px;" :readonly="true" v-model="ruleFormAdd.element_code" auto-complete="off" placeholder="物料代码"></el-input>
        </el-form-item>

        <el-form-item  v-show="unusable" label="代码" prop="element_code" :rules="{ required: !checked, message: '代码为必填项' }">
          <div>
            <el-checkbox v-model="checked">系统生成</el-checkbox>
            <span style="font-size: 12px;color: #999999;margin-left: 10px;font-weight: bold;">
              物料代码不能相同，建议使用系统生成
            </span>
          </div>
          <div v-show="!checked">
            <el-input size="mini" style="width: 400px" :disabled="checked" v-model="ruleFormAdd.element_code" auto-complete="off" placeholder="物料代码" />
            <div style="display: inline-block;width: 150px;line-height: 26px;vertical-align: middle;">
              <i style="margin-left: 10px; color: #2cd03e;font-size:16px" class="el-icon-success" v-show="isNickNameOk === true"></i>
              <i style="margin-left: 10px; color: red;font-size:16px" class="el-icon-error" v-show="isNickNameOk === false"></i>
              <el-button style="float: right" type="primary" size="mini" :disabled="checked" @click="checkOk(ruleFormAdd.element_code, false)">检查相同项</el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="品类" prop="content_code" :rules="{ required: true, message: '品类为必选项' }">
          <encodeRule :formData="ruleFormAdd" v-model="encode_code_list" />
        </el-form-item>
        <el-form-item label="供应商分类" prop="workpiece_id" :rules="{ required: true, message: '供应商分类为必选项' }">
          <el-select size="mini" style="width: 400px" v-model.number="ruleFormAdd.workpiece_id" placeholder="供应商分类">
            <el-option v-for="item in workpiece_list" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键物料" prop="major">
          <el-checkbox v-model="ruleFormAdd.major" @change="boxChange(ruleFormAdd)" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" style="width: 400px" v-model="ruleFormAdd.remark" placeholder="请输入备注" maxlength="1000" :show-word-limit="true" :autosize="{ minRows: 2, maxRows: 7 }" />
        </el-form-item>
        <el-form-item></el-form-item>
        <el-form-item>
          <router-link to="/enterpriseManage/inventoryManage/elementsManage">
            <el-button size="mini" @click="goToElementsManage">取 消</el-button>
          </router-link>
          <el-button style="margin-left: 20px" type="primary" size="mini" @click="submitForm('ruleFormAdd')">保 存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { check_element_exists, is_elements_repeat, add_elements, get_element, edit_element} from '@/api/enterpriseManage'
import { mapGetters } from 'vuex'
import encodeRule from '@/components/encodeRule'
export default {
  name: "elementsEdit",
  components: {encodeRule},
  data() {
    return {
        select_props: {
          value: 'code',
          label: 'name',
          children: 'sub_list'
        },
        encode_code_list: [],
        ruleFormAdd: {
          disable: "",
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
        isNameOk: "",
        isNickNameOk: "",
        unusable: true,
    };
  },
  computed: {
    ...mapGetters(['token','encode_rule_list','workpiece_list','encode_rule','encode_code']),
    isEdit(){
        return this.$route.meta.isEdit
    }
  },
  created() {
    if(this.isEdit){
      this.getElement();
    }
  },
  methods: {
      async getElement(){
        const element_code = this.$route && this.$route.params.element_code
        let result = await get_element({
          access_token: this.token,
          element_code
        })
        // console.log('result', result);
        if(result.code===0){
          for(var i in  this.ruleFormAdd) {
            this.ruleFormAdd[i] = result.elementInfo[i]
          }

          this.ruleFormAdd.disable = this.ruleFormAdd.disable ? true : false;
          this.ruleFormAdd.major = this.ruleFormAdd.major ? true : false;

          this.encode_code_list = this.getCententCodes(result.elementInfo.workpiece_name)
          if (0 == this.encode_code_list.length) {
            this.encode_code.forEach((code, index) => {
              if (code) {
                this.encode_code_list[index] = code
              }
            })
          }

        this.handleChangerRule(this.ruleFormAdd)
        this.ruleFormAdd.workpiece_id = this.ruleFormAdd.workpiece_id? this.ruleFormAdd.workpiece_id-0 : 1000
        this.unusable = this.ruleFormAdd.element_code?false:true
        }
      },
      getCententCodes(content_name) {
        if (!content_name) {
          return []
        }

        let rule_name = content_name
        let first = this.encode_rule[0]
        let second = this.encode_rule[1]
        let third = this.encode_rule[2]

        let third_name, second_name, content_codes = []

        if (third && 0 < third.length) {
          third.forEach(item => {
            if (item.name == rule_name) {
              content_codes[2] = item.code
              third_name = item.name
            }
          })
        }

        if (second && 0 < second.length) {
          second.forEach(item => {
            if (item.sub_index && 0 < item.sub_index.length) {
              item.sub_index.forEach(son => {
                if (son == third_name) {
                  content_codes[1] = item.code
                  second_name = item.name
                }
              })
            } else {
              if (!third_name && item.name == rule_name) {
                content_codes[1] = item.code
                second_name = item.name
              }
            }
          })
        }

        if (first && 0 < first.length) {
          first.forEach(item => {
            if (item.sub_index && 0 < item.sub_index.length) {
              item.sub_index.forEach(son => {
                if (son == second_name) {
                  content_codes[0] = item.code
                }
              })
            } else {
              if (!second_name && item.name == rule_name) {
                content_codes[0] = item.code
              }
            }
          })
        }

        return content_codes
      },
      boxChange(){},
      goToElementsManage(){},
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.handleDiaSureAdd(formName)
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
      handleChangerRule(ruleForm) {
        let codes = []
        ruleForm.content_code = ""
        this.encode_code_list.forEach((item, index)=>{
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

        if (this.encode_code_list.length <= 1) {
          ruleForm.content_code += '00000'
        } else if (this.encode_code_list.length <= 2) {
          ruleForm.content_code += '000'
        }
      },
      handleDiaSureAdd(formName){
        if (!this.isEdit) {
          let match_result = null
          this.matchAllForSpecialCharater(this.ruleFormAdd, function(result){
            match_result = result
          })
          if(match_result && match_result.code === 1){
            this.$message({
              showClose: true,
              duration: 0,
              message: match_result.error_message,
              type: 'warning'
            })

            return
          }
          
          for(var o in this.ruleFormAdd){
            if(typeof this.ruleFormAdd[o] == 'string'){
              this.ruleFormAdd[o] = this.ruleFormAdd[o].trim();
            }
          }
          if (!this.ruleFormAdd.content_name) {
            this.$message({
              type: 'warning',
              message: '必须指定物料品类！'
            });
            return
          }
          this.ruleFormAdd.spec_code = this.ruleFormAdd.spec_code + (this.ruleFormAdd.version?String(this.ruleFormAdd.version):'')

        } else {
          let match_result = null
          this.matchAllForSpecialCharater(this.ruleFormAdd, function(result){
            match_result = result
          })
          if(match_result && match_result.code === 1){
            this.$message({
              showClose: true,
              duration: 0,
              message: match_result.error_message,
              type: 'warning'
            })

            return
          }

          for(var o in this.ruleFormAdd){
            if(typeof this.ruleFormAdd[o] == 'string'){
              this.ruleFormAdd[o] = this.ruleFormAdd[o].trim();
            }
          }
          if (!this.ruleFormAdd.content_name) {
            this.$message({
              type: 'warning',
              message: '必须指定物料品类！'
            });
            return
          }
          this.ruleFormAdd.spec_code = this.ruleFormAdd.spec_code + (this.ruleFormAdd.version?String(this.ruleFormAdd.version):'')
        }

        let checkElementList = [this.ruleFormAdd];
        this.checkRepeat(checkElementList, async (repeatSpecCodeList) => {
          // let url = formName == "ruleFormAdd" ? "add_elements" : this.unusable ? "perfect_element" : "edit_element"
          let forData = !this.isEdit ? { element_list: [this.ruleFormAdd] } : this.ruleFormAdd
          if (forData.major) {
            forData.major = 1;
          }
          else {
            forData.major = 0;
          }
          
          let result = !this.isEdit ? await add_elements({ access_token: this.token, ...forData }): await edit_element({ access_token: this.token, ...forData})

          if (result.code == 0) {
              if (repeatSpecCodeList.length && formName == "ruleFormAdd") {
                var tipMsg = formName == "ruleFormAdd" ? "添加的规格型号为:“" : "修改的规格型号为:“";
                tipMsg += repeatSpecCodeList[0]
                tipMsg += "”的物料和系统中的一些物料的规格型号重复，请您检查该物料是否异常！"

                this.$alert(tipMsg, '', {
                  confirmButtonText: '确定',
                  callback: action => {
                    if(this.isEdit) return
                    let contentCode = this[formName].content_code
                    let workpeceId = this[formName].workpiece_id
                    this.$refs[formName].resetFields();
                    this[formName].content_code = contentCode
                    this[formName].workpiece_id = workpeceId

                  }
                });
              }
              else {
                this.$notify({
                  type: 'success',
                  title: '成功',
                  message: '操作成功!'
                });
                if(this.isEdit){
                  this.getElement();
                }else{
                  let contentCode = this[formName].content_code
                  let workpeceId = this[formName].workpiece_id
                  this.$refs[formName].resetFields();
                  this[formName].content_code = contentCode
                  this[formName].workpiece_id = workpeceId
                }
              }
            }
        });
      },
      matchAllForSpecialCharater(list, callback) {
        if(list.length <= 0){
          callback({
            code: 0
          })
          return
        }

        let errorList = []
        let errorMessage = []
        let blankErrorList = []
        let blankErrorMessage = []
        for(var o in list){
          if (list.hasOwnProperty(o)) {
            if(list[o] && this.matchSpecialCharacter(list[o])){
              errorList.push({
                prop: o,
                val: list[o]
              })
            } 
            // else if(typeof list[o] == 'string' && list[o].indexOf(' ') >= 0) {
            //   blankErrorList.push({
            //     prop: o,
            //     val: list[o]
            //   })
            // }
          }
        }
        blankErrorList.forEach(item => {
          blankErrorMessage.push(this.propMap[item.prop] + '(' + item.val + ')')
        })

        errorList.forEach(item => {
          errorMessage.push(this.propMap[item.prop] + '(' + item.val + ')')
        })

        if(blankErrorMessage.length > 0){
          callback({
            code: 1,
            error_message: '以下内容包含空格: ' + blankErrorMessage + '，请检查！！！'
          })
          return
        }
        
        if(errorMessage.length <= 0){
          callback({
            code: 0
          })
        } else{
          callback({
            code: 1,
            error_message: '以下内容包含特殊字符: ' + errorMessage + '，请检查！！！'
          })
        }
      },
      matchSpecialCharacter(str) {
        return false
        if(str.length <= 0){
          return false
        }
        let rules = /[!#$&*\/]/im

        if (rules.test(str)) {
          return true
        } else{
          return false
        }
      },
      async checkRepeat(elementList, callback) {
        if (0 == elementList.length) {
          return;
        }

        var specCodeList = [];

        for (var i = 0; i < elementList.length; i++) {
          specCodeList.push(elementList[i].spec_code)
        }

        let result = await is_elements_repeat({
          access_token: this.token,
          spec_code_list: specCodeList
        });
        if(result.code===0){
          var repeatSpecCodeList = result.repeat_spec_code_list;
          callback(repeatSpecCodeList);
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