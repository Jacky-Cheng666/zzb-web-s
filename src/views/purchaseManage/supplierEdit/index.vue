<template>
  <div class="app-container supplierEdit">
    <div class="titleEdit">{{!isEdit?"添加供应商":"修改供应商"}}</div>
    <div style="line-height: 22px;margin-left: 80px;">
      <span style="display: inline-block;line-height: 22px;vertical-align: middle;">
        <el-switch style="width:28px" v-model="is_synergy" active-color="#00a0e9" inactive-color="#e3e3e3" @change="changeCheck" />
      </span>
      <span style="line-height:22px;vertical-align: middle;margin-left: 10px;font-weight: bold;font-size: 14px;color: #333333;">协同供应商</span>
      <div style="margin-left: 40px;margin-bottom: 10px;">
        <span style="font-size: 12px;font-weight: bold;color: #999999;">非协同供应商是不需要对方注册智造帮账号协同办公的一类供应商</span>
      </div>
    </div>
    <el-form v-show="is_synergy" :model="ruleFormAdd" :rules="rulesAdd" ref="ruleFormAdd" label-width="120px">
      <el-form-item>
        <el-select size="mini" v-model="match_name" clearable filterable remote style="width: 360px;margin-bottom: 10px;" placeholder="搜索供应商名称" :remote-method="remoteMethod" @change="handleIconClick" :loading="loading">
          <el-option v-for="item in supplier_list" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <div style="line-height: 3px;margin-bottom: 20px;">
          <span style="font-size: 12px;font-weight: bold;color: #999999;">若供应商未加入智造帮，请邀请供应商注册智造帮企业账号</span>
        </div>
      </el-form-item>

      <div v-show="isCheckCompany">
        <el-form-item label="公司全称">
          <span class="infoListMsg">{{ruleFormAdd.name}}</span>
        </el-form-item>
        <el-form-item label="公司简称">
          <span class="infoListMsg">{{ruleFormAdd.nick_name}}</span>
        </el-form-item>
        <el-form-item label="成立时间">
          <span class="infoListMsg">{{ruleFormAdd.register_date}}</span>
        </el-form-item>
        <el-form-item label="公司负责人">
          <span class="infoListMsg">{{ruleFormAdd.legal_person}}</span>
        </el-form-item>
        <el-form-item label="负责人电话">
          <span class="infoListMsg">{{ruleFormAdd.legal_person_phone}}</span>
        </el-form-item>
        <el-form-item label="公司地址">
          <span class="infoListMsg">{{ruleFormAdd.address}}</span>
        </el-form-item>
  
        <el-form-item label="联系人" prop="contact" :rules="{required: true, message: '联系人为必填项', }">
          <el-select size="mini" v-model="ruleFormAdd.contact" style="width: 360px;" @change="getContactPhone" placeholder="请选择">
            <el-option v-for="item in staff_list" :key="item.name" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="联系人电话">
          <span class="infoListMsg">{{ruleFormAdd.phone}}</span>
        </el-form-item>
        
        <el-form-item style="margin-bottom: 12px" label="评级" prop="star" :rules="{required: true, message: '评级为必选项', trigger: 'blur'}">
          <el-select size="mini" v-model="ruleFormAdd.star"
            style="width: 360px;" clearable placeholder="请选择评级">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-bottom: 12px" label="发票类型" prop="tax_name" :rules="{required: true, message: '发票类型为必选项',trigger:'blur'}">
          <el-row>
            <el-col :span="4" v-for="(item,key) in tax_list" :key="key">
              <el-radio v-model="ruleFormAdd.tax_name" :label="item.tax_name">{{item.tax_name}}</el-radio>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item style="margin-bottom:16px" label="结款周期" prop="pay_delay" :rules="{required: true, message: '结款周期为必填项', trigger: 'blur'}">
          <el-input size="mini" type="number" style="width: 360px;" v-model.number="ruleFormAdd.pay_delay" auto-complete="off" placeholder="结款周期" />&nbsp;&nbsp; 天
        </el-form-item>

        <el-form-item style="margin-bottom:12px" label="收款账户" prop="bank_account_list">
          <div class="table-region">
            <el-table stripe :data="ruleFormAdd.bank_account_list" border style="width: 950px">
              <el-table-column align="center" prop="bank_name" label="开户行名称" width="180"></el-table-column>
              <el-table-column align="center" prop="account_name" label="账户名称" ></el-table-column>
              <el-table-column align="center" prop="account_id" label="银行账号" width="180"></el-table-column>
              <el-table-column align="center" label="操作" width="80">
                <template slot-scope="scope">
                  <el-button @click="editAccount(scope.row,scope.$index)" size="mini" type="primary">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>

        <el-form-item style="margin-bottom:12px" label="分类" prop="workpieces" :rules="{required: true, message: '分类为必选项',trigger:'blur'}">
          <el-checkbox-group @change="workpiecesChange" :min="1" v-model="ruleFormAdd.workpieces" style="max-height: 200px;overflow: auto;width: 790px;">
            <el-row style="width: 750px;">
              <el-col style="overflow: hidden;height: 30px;" v-for="(item ,index) in workpiece_list" :key="index" :span="3">
                <el-checkbox :label="item.id">{{item.name}}</el-checkbox>&nbsp;
              </el-col>
            </el-row>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item style="margin-bottom:12px" label="品牌" v-show="ruleFormAdd.business_type==0||ruleFormAdd.business_type==3" prop="brands"
          :rules="{required: (ruleFormAdd.business_type==0||ruleFormAdd.business_type==3)&&brandMinValue===1, message: '品牌为必选项',trigger:'blur'}">
          <el-checkbox-group :min="brandMinValue" v-model="ruleFormAdd.brands" style="max-height: 300px;overflow: auto;">
            <el-row style="width: 750px;">
              <el-col style="overflow: hidden;height: 30px;" v-for="(item ,index) in all_brand_list" :key="index" :span="4">
                <el-checkbox :label="item">{{item}}</el-checkbox>&nbsp;
              </el-col>
            </el-row>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item>
          <router-link to="/purchaseManage/supplierManage">
            <el-button size="mini">取 消</el-button>
          </router-link>
          <el-button style="margin-left: 20px;" type="primary" size="mini" @click="submitForm('ruleFormAdd',true)">保 存</el-button>
        </el-form-item>
      </div>
      <div v-show="!isCheckCompany">
        <el-form-item>
          <router-link to="/purchaseManage/supplierManage">
            <el-button size="mini">取 消</el-button>
          </router-link>
        </el-form-item>
      </div>
    </el-form>


    <el-dialog @close="dialogClose" width="500px" center title="银行账户" :visible.sync="dialogFormVisible" :modal-append-to-body="false">
      <el-form :model="form">
        <el-form-item>
          <el-select size="small" style="width:150px" v-model="form.type" placeholder="选择类型" disabled>
            <el-option label="银行账户" value="银行账户"/>
            <el-option label="现金" value="现金" />
            <el-option label="企业支付宝" value="企业支付宝" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <div style="display:flex">
            <el-input size="small" v-model="form.bank_name" autocomplete="off" placeholder="开户行" />
          </div>
        </el-form-item>
        <el-form-item>
          <div style="display:flex">
            <el-input size="small" v-model="form.account_id" autocomplete="off" placeholder="账号" @blur="verifyAccount" />
          </div>
        </el-form-item>
        <el-form-item>
          <el-input size="small" placeholder="账户名" v-model="form.account_name" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="mini" @click="saveBank" type="primary">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { search_supplier, get_supplier_info, apply_for_add_supplier } from '@/api/purchaseManage'
import { mapGetters } from 'vuex'
export default {
  name: "supplierEdit",
  data() {
    var rackNoCheck = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(""));
      } else {
        callback();
      }
    };
    var validateBankAccount = (rule, value, callback) => {
      console.log('value',value)
      let valueIndex = value[0]?value[0]:{}
      if (!valueIndex.access) {
        callback(new Error('收款账户信息不能为空'));
      } else {
        console.log('我执行了');
        callback();
      }
    };
    return {
      is_synergy: false,
      match_name: "",
      loading: true,
      supplier_list: [],
      isCheckCompany: false,
      dialogFormVisible: false,
      form: {},
      ruleFormAdd: {
        pay_delay: "",
        business_type: 3, //0标品 1非标品
        tax_name: 0,
        supplier_code: "",
        register_date: "",
        name: "",
        nick_name: "",
        legal_person: "",
        address: "",
        legal_person_phone: "",
        contact: "",
        phone: "",
        bank_account_list: [
          {
            access: false,
            type: "银行账户",
            bank_name: "",
            account_name: "",
            account_id: "",
          },
        ],
        workpieces: [],
        brands: [],
        star: "",
      },
      rulesAdd: {
        name: [{ validator: rackNoCheck }],
        bank_account_list: [{ validator: validateBankAccount, required: true, message: '收款账户为必填项'}]
      },
      options: [
        {
          value: "A",
          label: "A级 战略级",
        },
        {
          value: "B",
          label: "B级 优选级",
        },
        {
          value: "C",
          label: "C级 考察级",
        },
        {
          value: "D",
          label: "D级 淘汰级",
        },
      ],
      brandMinValue: 1,
      staff_list: [],
      bankIndex: 0
    };
  },
  computed: {
    ...mapGetters(['token','tax_list','workpiece_list','all_brand_list']),
    isEdit(){
      return this.$route.meta.isEdit
    }
  },
  methods: {
    changeCheck() {},
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        search_supplier({
          access_token: this.token,
          match_name: query,
        }).then((result) => {
          if (result.code == 0) {
            this.loading = false;
            let arr = [];
            result.supplier_list.forEach((item) => {
              arr.push({ value: item.company_no, label: item.name });
            });

            this.supplier_list = arr;
          } else {
            this.supplier_list = [];
            this.match_name = "";
          }
        });
      } else {
        this.supplier_list = [];
        this.match_name = "";
      }
    },
    async handleIconClick(){
      // this.staff_list = [];
      let result = await get_supplier_info({
        access_token: this.token,
        supplier_code: this.match_name,
      })
      if(result.code===0){
        this.isCheckCompany = true;
        this.ruleFormAdd.name = result.supplier_info.name;
        this.ruleFormAdd.business_type = result.supplier_info.business_type;
        this.ruleFormAdd.legal_person = result.supplier_info.legal_person_name;
        this.ruleFormAdd.legal_person_phone = result.supplier_info.legal_person_phone;
        this.ruleFormAdd.nick_name = result.supplier_info.nick_name;
        this.ruleFormAdd.supplier_code = result.supplier_info.company_no;
        this.ruleFormAdd.register_date = result.supplier_info.register_date;
        this.ruleFormAdd.address = result.supplier_info.address;
        this.staff_list = result.supplier_info.staff_list || [];
        this.ruleFormAdd.contact = result.supplier_info.contact || "";
        this.ruleFormAdd.phone = result.supplier_info.phone || "";
        this.getContactPhone();
        this.ruleFormAdd.star = result.supplier_info.star? result.supplier_info.star: "";
        this.ruleFormAdd.tax_name = result.supplier_info.tax_name || "";
        this.ruleFormAdd.pay_delay = result.supplier_info.pay_delay || "";
        result.supplier_info.bank_account_list&&result.supplier_info.bank_account_list.forEach(item=>{
          if(item.bank_name&&item.account_name&&item.account_id){
            this.$set(item,'access',true)
          }else{
            this.$set(item,'access',false)
          }
        })
        this.ruleFormAdd.bank_account_list =result.supplier_info.bank_account_list && result.supplier_info.bank_account_list.length!=0 && result.supplier_info.bank_account_list.slice(0,1) || [
          {
            type: "银行账户",
            bank_name: "",
            account_name: "",
            account_id: "",
          },
        ];
        this.ruleFormAdd.workpieces = result.supplier_info.workpieces || [];
        this.ruleFormAdd.brands = result.supplier_info.brands ? result.supplier_info.brands: [];
      }
    },
    getContactPhone() {
      this.staff_list.forEach((item) => {
        if (item.name == this.ruleFormAdd.contact) {
          this.ruleFormAdd.phone = item.phone;
        }
      });
    },
    editAccount(row, index) {
      this.form = this.$DeepClone(row);
      this.bankIndex = index;
      this.dialogFormVisible = true;
    },
    workpiecesChange(){},
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.handleDiaSureAdd();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async handleDiaSureAdd(){
      let forData = this.ruleFormAdd;
      forData.bank_account_list.forEach(item=>{
        delete item.access;
      })
      let arr = [];
      forData.workpieces.forEach((item) => {
        arr.push(Number(item));
      });
      forData.workpieces = arr;
      for (var o in forData) {
        if (typeof forData[o] == "string") {
          forData[o] = forData[o].trim();
        }
      }
      forData.tax_type = forData.tax_name;
      let result = await apply_for_add_supplier({
        access_token: this.token,
        supplier: forData
      })
      if(result.code===0){
        this.$notify({
          type: 'success',
          title: '成功',
          message: '添加成功'
        })
        this.isCheckCompany = false;
        this.match_name = "";
      }
    },
    verifyAccount() {
      if (this.form.account_id.length > 24) {
        this.$message.error("银行卡号位数不能超过24");
        this.form.account_id = "";
      }
    },
    saveBank(){
      if (!this.form.bank_name) {
        this.$message.error("开户行不能为空");
        return;
      }
      if (!this.form.account_id) {
        this.$message.error("账号不能为空");
        return;
      }
      if (!this.form.account_name) {
        this.$message.error("账户名不能为空");
        return;
      }
      this.$set( this.form, 'access', true );
      if(!this.isEdit){
        // 新增供应商
        if(this.is_synergy){
          this.$set(this.ruleFormAdd.bank_account_list, this.bankIndex, this.form);
          this.$refs.ruleFormAdd.validateField('bank_account_list')
        }else {
          this.$set(this.ruleFormAddNo.bank_account_list, this.bankIndex, this.form);
          this.$refs.ruleFormAddNo.validateField('bank_account_list')
        }
      }else{
        console.log('编辑供应商');
      }
      this.dialogFormVisible = false;
    },
    dialogClose() {
      this.form = {};
    },
  }
};
</script>

<style lang="scss">
.supplierEdit {
  .titleEdit {
    color: #333333;
    font-size: 16px;
    font-weight: bold;
    margin-top: 20px;
    margin-bottom: 30px;
    border-left: 4px solid #00a0e9;
    padding-left: 24px;
  }
  .infoListMsg {
    color: #333333;
    font-weight: bold;
  }
 
}
</style>
