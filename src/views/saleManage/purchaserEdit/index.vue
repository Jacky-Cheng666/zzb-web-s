<template>
  <div class="app-container purchaserEdit" v-loading="loading" element-loading-text="加载中...">
    <div class="titleEdit">
      {{ !isEdit ? "添加非协同采购商": is_synergy ? "修改协同采购商" : "修改非协同采购商" }}
    </div>
    <el-form v-show="is_synergy" :model="ruleFormSynergy" ref="ruleFormSynergy" label-width="120px">
      <el-form-item label="公司全称">
        <span class="infoListMsg">{{ ruleFormSynergy.name }}</span>
      </el-form-item>
      <el-form-item label="公司简称">
        <span class="infoListMsg">{{ ruleFormSynergy.nick_name }}</span>
      </el-form-item>
      <el-form-item label="成立时间">
        <span class="infoListMsg">{{ ruleFormSynergy.register_date }}</span>
      </el-form-item>
      <el-form-item label="公司负责人">
        <span class="infoListMsg">{{ ruleFormSynergy.legal_person }}</span>
      </el-form-item>
      <el-form-item label="负责人电话">
        <span class="infoListMsg">{{ruleFormSynergy.legal_person_phone}}</span>
      </el-form-item>
      <el-form-item label="公司地址">
        <span class="infoListMsg">{{ ruleFormSynergy.address }}</span>
      </el-form-item>
      <el-form-item label="联系人" prop="contact" :rules="{ required: true, message: '联系人为必选项', trigger: 'blur' }">
        <el-select class="infoListMsg" size="mini" v-model="ruleFormSynergy.contact" style="width: 360px;" @change="getContactPhoneSet" placeholder="请选择">
          <el-option v-for="item in ruleFormSynergy.staff_list" :key="item.name" :label="item.name" :value="item.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="联系人电话">
        <span class="infoListMsg">{{ ruleFormSynergy.phone }}</span>
      </el-form-item>

      <el-form-item></el-form-item>
      <el-form-item>
        <router-link to="/saleManage/purchaserManage">
        <el-button size="mini">取 消</el-button>
        </router-link>
        <el-button :loading="btnLoading" style="margin-left: 20px;" type="primary" size="mini" @click="submitForm('ruleFormSynergy')">保 存</el-button>
      </el-form-item>
    </el-form>

    <el-form v-show="!is_synergy" :model="ruleFormSet" :rules="rulesSet" ref="ruleFormSet" label-width="120px" style="width: 650px;">
      <el-form-item label="公司全称" prop="name" :rules="{ required: true, message: '公司全称为必填项' }">
        <el-input :readonly="false" size="mini" style="width: 360px;" v-model="ruleFormSet.name" auto-complete="off" placeholder="公司全称" />
        <div style="display: inline-block;width: 150px;line-height:26px;vertical-align: middle;">
          <i style="margin-left: 10px;color: #2CD03E;font-size:16px" class="el-icon-success" v-show="isNameOk === true" />
          <i style="margin-left: 10px;color: red;font-size:16px" class="el-icon-error" v-show="isNameOk === false" />
          <el-button style="float: right;" type="primary" size="mini" @click="checkOk(ruleFormSet.name, true)">检查相同项</el-button>
        </div>
      </el-form-item>
      <el-form-item label="公司简称" prop="purchase_name" :rules="{ required: true, message: '公司简称为必填项' }">
        <el-input size="mini" style="width: 360px;" v-model="ruleFormSet.purchase_name" auto-complete="off" placeholder="公司简称" />
        <div style="display: inline-block;width: 150px;line-height: 26px;vertical-align: middle;">
          <i style="margin-left: 10px;color: #2CD03E;font-size:16px" class="el-icon-success" v-show="isNickNameOk === true" />
          <i style="margin-left: 10px;color: red;font-size:16px" class="el-icon-error" v-show="isNickNameOk === false" />
          <el-button style="float: right;" type="primary" size="mini" @click="checkOk(ruleFormSet.purchase_name, false)">检查相同项</el-button>
        </div>
      </el-form-item>
      <el-form-item label="联系人" prop="contact" :rules="{ required: true, message: '联系人为必填项' }">
        <el-input size="mini" style="width: 360px;" v-model="ruleFormSet.contact" auto-complete="off" placeholder="姓名" />
      </el-form-item>
      <el-form-item label="联系人电话" prop="phone" required>
        <el-input size="mini" style="width: 360px;" v-model="ruleFormSet.phone" auto-complete="off" placeholder="固话格式：XXXX-XXXX" />
      </el-form-item>
      <el-form-item label="收货地址" prop="receive_addr" :rules="{ required: true, message: '收货地址为必填项' }">
        <el-input size="mini" style="width: 360px;" v-model="ruleFormSet.receive_addr" auto-complete="off" placeholder="收货地址" />
      </el-form-item>
      <el-form-item label="收货人" prop="receiver_name" :rules="{ required: true, message: '收货人为必填项' }">
        <el-input size="mini" style="width: 360px;" v-model="ruleFormSet.receiver_name" auto-complete="off" placeholder="姓名" />
      </el-form-item>
      <el-form-item label="收货人电话" prop="receiver_phone" required>
        <el-input size="mini" style="width: 360px;" v-model="ruleFormSet.receiver_phone" auto-complete="off" placeholder="固话格式：XXXX-XXXX" />
      </el-form-item>
      <el-form-item label="对账日期" prop="check_date" :rules="{required: true, message: '对账日期为必填项', trigger: 'change' }">
        <el-select size="mini" v-model="ruleFormSet.check_date" placeholder="请选择对账日期">
          <el-option label="每月25日对账" :value="25"></el-option>
          <el-option label="每月26日对账" :value="26"></el-option>
          <el-option label="每月27日对账" :value="27"></el-option>
          <el-option label="每月28日对账" :value="28"></el-option>
          <el-option label="自然月对账" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <router-link to="/saleManage/purchaserManage">
          <el-button size="mini">取 消</el-button>
        </router-link>
        <el-button :loading="btnLoading" style="margin-left: 20px;" type="primary" size="mini" @click="submitForm('ruleFormSet')">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { get_purchaser_info, edit_purchaser, edit_no_synergy_purchaser, check_purchase_name } from '@/api/saleManage'
export default {
  name: "purchaserEdit",
  data() {
    var contact_phoneCheck = (rule, value, callback) => {
      var exe = /^1[3456789]{1}\d{9}$/
      var exe2 = /^[0][1-9]{2,3}-[0-9]{5,10}$/
      if (value === '') {
        callback(new Error('电话号码不能为空'));
      } else if (!exe.exec(value) && !exe2.exec(value)) {
        callback(new Error('请正确输入电话号码'));
      } else {
        callback();
      }
    };
    return {
      is_synergy: false,
      isNameOk:"",
      isNickNameOk:"",
      ruleFormSynergy: {
        company_no: "",
        name: "",
        legal_person_name: "",
        legal_person_phone: "",
        register_date: "",
        nick_name: "",
        business_type: 1,
        address: "",
        staff_list: [],
        contact: "",
        phone: "",
        legal_person: ""
      },
      ruleFormSet: {
        name: "",
        purchase_name: "",
        contact: "",
        phone: "",
        purchase_code: "",
        receive_addr: "",
        receiver_name: "",
        receiver_phone: "",
        check_date: ""
      },
      rulesSet: {
        'phone': [
          {validator: contact_phoneCheck, trigger: 'blur'}
        ],
        'receiver_phone': [
          {validator: contact_phoneCheck, trigger: 'blur'}
        ],
      },
      loading: false,
      btnLoading: false
    };
  },
  computed: {
    ...mapGetters(["token"]),
    isEdit() {
      return this.$route.meta.isEdit;
    }
  },
  created() {
    if(this.isEdit){
      this.getPurchaserInfo();
    }
  },
  methods: {
    async getPurchaserInfo(){
      const { purchase_code } = this.$route.params
      this.loading = true;
      let result = await get_purchaser_info({
        access_token: this.token,
        purchase_code
      })
      console.log('result', result);
      if(result.code===0){
        this.loading = false;
        let purchaser_info = result.purchaser_info;
        this.is_synergy = purchaser_info.is_synergy;

        if(!this.is_synergy){
          for (const key in this.ruleFormSet) {
            this.ruleFormSet[key] = this.$DeepClone(purchaser_info[key])
          }
        }else{
          for (const key in this.ruleFormSynergy) {
            this.ruleFormSynergy[key] = this.$DeepClone(purchaser_info[key])
          }
        }
      }
    },
    getContactPhoneSet(){
      this.ruleFormSynergy.staff_list.forEach(item => {
        if (item.name == this.ruleFormSynergy.contact) {
          this.ruleFormSynergy.phone = item.phone
        }
      })
    },
    checkOk(name,key){
      if(!name){
        this.$message({
          type: 'warning',
          message: '请输入公司名字!'
        });
        return
      }
      check_purchase_name({
        access_token: this.token,
        name,
        is_fullname:key
      }).then(result => {
          if (result.code == 0) {
            key?this.isNameOk = true:this.isNickNameOk = true
          } else {
            key?this.isNameOk = false:this.isNickNameOk = false
          }
        })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.handleDiaSureAdd(formName)
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    async handleDiaSureAdd(formName){
      let purchaser = this.$DeepClone(this.is_synergy ? this.ruleFormSynergy : this.ruleFormSet);
      let result;
      this.btnLoading = true;
      if(this.is_synergy){
        purchaser.purchase_code = purchaser.company_no;
        delete purchaser.company_no;
        result = await edit_purchaser({access_token: this.token, purchaser})
      }else {
        result = await edit_no_synergy_purchaser({access_token: this.token,purchaser})
      }
      if(result.code===0){
        this.btnLoading = false;
        this.$notify({
          type: 'success',
          title: '成功',
          message: '操作成功'
        })
        this.getPurchaserInfo();
      }else{
        this.btnLoading = false;
      }
      

    }
    
  }
};
</script>

<style lang="scss">
.purchaserEdit {
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
  .infoListMsg{
    color: #333333 ;margin-left: 25px;font-weight: bold;
  }
        
}
</style>
