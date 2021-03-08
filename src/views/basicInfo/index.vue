<template>
  <div class="app-container basicInfo">
    <div class="bookInfo">
      <div class="header">
        <div class="left">
          <span class="tipWord">账本信息</span>
          <el-input v-model="financialBookName" style="width:120px" size="mini" placeholder="输入账本名称"></el-input>
          <el-button @click="saveFinancialBook" size="mini" type="primary">保存账本名称</el-button>
        </div>
        <el-select style="width:102px;margin-right:10px" size="mini" @change="switchFinancialBook" v-model="CurrentFinancialBook" placeholder="请选择">
          <el-option v-for="item in bookList" :key="item.financial_book_no" :label="item.financial_book_name" :value="item.financial_book_no" />
        </el-select>
      </div>
      <div class="info">
        <div class="title">
          <div style="color: #333;font-weight: bold">基本信息</div>
          <el-button @click="saveBasicInfo" size="mini" type="success" style="height:29px">
            <svg-icon icon-class="save" class-name="btn_icon_svg" />&nbsp;保存
          </el-button>
        </div>
        <div class="content">
          <el-row style="margin-bottom:15px">
            <el-col :span="10">
              <el-input size="mini" v-model="currentBookInfo.company_full_name" disabled style="width:680px" placeholder="公司名称"/>
            </el-col>
            <el-col :offset="4" :span="10">
              <el-input size="mini" v-model="currentBookInfo.company_name" style="width:680px;margin-left:12px" placeholder="公司简称"></el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-input size="mini" v-model="currentBookInfo.address" style="width:680px" placeholder="注册地址"></el-input>
            </el-col>
            <el-col :offset="4" :span="10">
              <el-input size="mini" v-model="currentBookInfo.tax_identification" style="width:680px;margin-left:12px" placeholder="纳税识别码"></el-input>
            </el-col>
          </el-row>
        </div>
        <div class="line"></div>
      </div>
      <div class="bankAccount">
        <div class="title">
          <div style="color: #333;font-weight: bold">资金账户</div>
          <div>
            <el-button @click="showNewAccount" size="mini" type="primary" icon="el-icon-plus">新增</el-button>
          </div>
        </div>
        <div class="content">
          <el-table border stripe :data="currentBookInfo.bank_account_list" style="width: 100%;font-size:12px">
            <el-table-column align="center" prop="type" label="类型" width="100"></el-table-column>
            <el-table-column align="center" prop="bank_name" label="银行" width="350"></el-table-column>
            <el-table-column align="center" prop="account_name" label="账户名"></el-table-column>
            <el-table-column align="center" prop="account_id" label="账号" width="180"></el-table-column>
            <el-table-column align="center" prop="use_type" label="用途" width="60">
              <template slot-scope="scope">{{bankUseType[scope.row.use_type]}}</template>
            </el-table-column>
            <el-table-column align="center" prop label="操作" width="120">
              <template slot-scope="scope">
                <el-button @click="editAccount(scope.row)" size="mini" type="text" icon="el-icon-edit">编辑</el-button>
                <el-button @click="deleteAccount(scope.row)" size="mini" type="text" icon="el-icon-delete" class="text-danger">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="setTax">
      <div class="left">
          <div class="tipWord">发票税率</div>
          <el-radio-group v-model="currentTax">
            <el-radio
              v-for="(item, index) in tax_list"
              :key="index"
              :label="item.tax_name"
            >{{item.tax_name}}</el-radio>
          </el-radio-group>
        </div>
        <div class="right">
          <el-button @click="save_tax" size="mini" type="success" style="height:29px">
            <svg-icon icon-class="save" class-name="btn_icon_svg" />&nbsp;保存税率
          </el-button>
        </div>
    </div>
    <div class="receiveAddress">
      <div class="title">
        <div style="color: #333;font-weight: bold">收货地址</div>
        <div>
          <el-button size="mini" type="primary" icon="el-icon-plus">新增</el-button>
          <el-button size="mini" type="success" style="height:29px">
            <svg-icon icon-class="save" class-name="btn_icon_svg" />&nbsp;保存
          </el-button>
        </div>
      </div>
      <el-row v-for="(item,index) in receive_info_list" :key="index" type="flex" style="margin-bottom: 10px;padding: 0 20px" :gutter="10">
        <el-col style="flex: 1;">
          <el-input size="mini" v-model="item.receive_addr" auto-complete="off" placeholder="收货地址" />
        </el-col>
        <el-col style="width:380px;margin-right:-4px">
          <el-input size="mini" style="width: 80px" v-model="item.receiver_name" auto-complete="off" placeholder="收货人" />
          <el-input size="mini" style="width:120px;margin-left:10px" v-model="item.receiver_phone" maxlength="11" auto-complete="off" placeholder="收货人手机" />
          <span style="margin-left: 20px;font-size: 13px;" v-show="item.default">默认地址</span>
          <el-button style="margin-left: 10px;" type="primary" size="mini" @click="defaultAddr(index)" v-show="!item.default">设为默认</el-button>
          <el-button type="danger" size="mini" plain @click="deleteAddr(index)" v-show="!item.default">删除</el-button>
        </el-col>
      </el-row>
      <div class="content">
      </div>
    </div>

    <!-- 新增账户对话框 -->
    <el-dialog @close="dialogClose" width="520px" center title="资金账户" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item>
          <el-select size="small" style="width:150px" v-model="form.type" placeholder="选择类型">
            <el-option label="银行账户" value="银行账户"></el-option>
            <el-option label="现金" value="现金"></el-option>
            <el-option label="企业支付宝" value="企业支付宝"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div style="display:flex">
            <el-input size="small" style="margin-right:20px" v-model="form.bank_name" autocomplete="off" placeholder="开户行" />
            <el-select size="small" v-model="form.use_type" placeholder="选择用途" style="width:180px">
              <el-option v-for="(item, index) in bank_use_type_list" :key="index" :label="item.name" :value="item.type" />
            </el-select>
          </div>
        </el-form-item>
        <el-form-item>
          <div style="display:flex">
            <el-input size="small" style="margin-right:20px" v-model="form.account_id" autocomplete="off" placeholder="账号" @blur="verifyAccount" :disabled="isEdit"/>
            <el-input size="small" type="number" style="width:180px" v-model.number="form.money" autocomplete="off" placeholder="余额"/>
          </div>
        </el-form-item>
        <el-form-item>
          <el-input size="small" placeholder="账户名" v-model="form.account_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="mini" @click="addNewBank" type="primary">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { get_company_basic_info, set_financial_book_name, set_company_basic_info, add_bank_account,
set_bank_account, remove_bank_account, set_company_tax } from '@/api/enterpriseManage.js'
import { mapGetters } from 'vuex'
import { deepClone } from '@/utils/index.js'
export default {
  name: "basicInfo",
  data() {
    return {
      currentBookInfo: {
        bank_account_list: [{},{}]
      },
      currentTax: "",
      receive_info_list: [],
      financial_book_list: [],
      bookList: [],
      CurrentFinancialBook: "",
      temp: "",
      financialBookName: "",
      dialogFormVisible: false,
      form: {},
      bank_use_type_list: [],
      isEdit: false,
      bankUseType: [],
    };
  },
  computed: {
    ...mapGetters(['token','tax_list'])
  },
  created() {
    this.getCompanyBasicInfo();
  },
  methods: {
    defaultAddr(){},
    deleteAddr(){},
    async getCompanyBasicInfo(){
      let result = await get_company_basic_info({
        access_token: this.token
      })
      // console.log('result', result);
      if(result.code===0){
        this.financial_book_list = result.financial_book_list;
        this.financial_book_list.forEach((item) => {
          if (!item.address) {
            this.$set(item, "address", "");
          }
          if (!item.company_full_name) {
            this.$set(item, "company_full_name", "");
          }
          if (!item.company_name) {
            this.$set(item, "company_name", "");
          }
          if (!item.tax_identification) {
            this.$set(item, "tax_identification", "");
          }
        });
        this.bookList = this.financial_book_list.map((item) => {
          return {
            financial_book_no: item.financial_book_no,
            financial_book_name: item.financial_book_name,
          };
        });
        this.CurrentFinancialBook = this.temp ? this.temp: this.bookList[0].financial_book_no;
        this.switchFinancialBook();
        this.currentTax = result.tax_name;
        this.bank_use_type_list = result.bank_use_type_list;
        let obj = {};
        this.bank_use_type_list.forEach((item) => {
          obj[item.type] = item.name;
        });
        this.bankUseType = obj;
        this.receive_info_list = result.receive_info_list;
      }
    },
    switchFinancialBook(){
      this.financial_book_list.some((item) => {
        if (item.financial_book_no == this.CurrentFinancialBook) {
          this.currentBookInfo = item;
          return true;
        }
      });
    },
    async saveFinancialBook(){
      if (this.financialBookName.trim().length == 0) {
        this.$message({
          type: "warning",
          message: "账本名称不能为空",
        });
        return;
      }
      let result = await set_financial_book_name({
        access_token: this.token,
        financial_book_no: this.CurrentFinancialBook,
        financial_book_name: this.financialBookName.trim(),
      })
      if(result.code===0){
        this.financialBookName = "";
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success'
        });
        this.financialBookName = "";
        this.getCompanyBasicInfo();
      }
    },
    async saveBasicInfo() {
      if (this.currentBookInfo.company_name.trim().length == 0) {
        this.$message({
          type: "error",
          message: "请输入公司简称",
        });
        return;
      }
      let result = await set_company_basic_info({
        access_token: this.token,
        financial_book_no: this.CurrentFinancialBook,
        company: {
          name: this.currentBookInfo.company_full_name.trim(),
          company_name: this.currentBookInfo.company_name.trim(),
          address: this.currentBookInfo.address.trim(),
          tax_identification: this.currentBookInfo.tax_identification.trim(),
        },
      });
      if(result.code===0){
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success'
        });
        this.getCompanyBasicInfo();
      }
    },
     // 验证账号
    verifyAccount() {
      if (this.form.account_id.length > 24) {
        this.$message.error("银行卡号位数不能超过24");
        this.form.account_id = "";
      }
    },
    dialogClose(){
      this.form = {};
    },
    editAccount(row){
      this.isEdit = true;
      this.form = deepClone(row);
      this.dialogFormVisible = true;
    },
    async addNewBank(){
      if (!this.isEdit) {
        // 如果是新增
        if (!this.form.type) {
          this.$message.error("请选择类型");
          return;
        }
        if (!this.form.bank_name) {
          this.$message.error("开户行不能为空");
          return;
        }
        if (!this.form.use_type) {
          this.$message.error("请选择用途");
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
        let result = await add_bank_account({
          access_token: this.token,
          bank_account: this.form,
          financial_book_no: this.CurrentFinancialBook,
        })
        if(result.code===0){
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success'
          });
          this.dialogFormVisible = false;
          this.temp = this.CurrentFinancialBook;
          this.getCompanyBasicInfo();
        }
      } else {
        // 编辑
        let result = await set_bank_account({
          access_token: this.token,
          financial_book_no: this.CurrentFinancialBook,
          bank_account: this.form,
        })
        if(result.code===0){
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success'
          });
          this.dialogFormVisible = false;
          this.temp = this.CurrentFinancialBook;
          this.getCompanyBasicInfo();
        }
      }
    },
    showNewAccount() {
      this.isEdit = false;
      this.dialogFormVisible = true;
    },
    deleteAccount(row){
      this.$confirm("确认删除该银行账号, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await remove_bank_account({
            access_token: this.token,
            bank_account_id: row.account_id,
            financial_book_no: this.CurrentFinancialBook,
          });
          if(result.code===0){
            this.temp = this.CurrentFinancialBook;
            this.getCompanyBasicInfo();
          }
        })
        .catch(() => {});
    },
    async save_tax() {
      let result = await set_company_tax({
        access_token: this.token,
        tax_name: this.currentTax
      })
      if(result.code===0){
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success'
        });
        this.getCompanyBasicInfo();
      }
    },
  },
};
</script>

<style lang='scss'>
.basicInfo {
  .bookInfo {
    border: 1px solid #e5e5e5;
    margin-bottom: 25px;
    .header {
      height: 50px;
      background-color: #f8f8f8;
      display: flex;
      justify-content: space-between;
      padding: 0 10px;
      padding-top: 10px;
      margin-bottom: 10px;
    }
    .info{
      .line{
        width: 100%;
        height: 1px;
        background: #E5E5E5;
        margin: 0 auto;
        margin-bottom: 15px;
        }
    }
    .title{
      font-size: 14px;
      height: 24px;
      padding: 0 20px;
      border-left: 4px solid #00a0e9;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 15px;
    }
    .content{
      padding: 0 20px;
      margin-bottom: 24px;
    }
  }
  .setTax {
    height: 52px;
    border: 1px solid #e5e5e5;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 25px;
    .left {
      display: flex;
      align-items: center;
    }
    .right{
      margin-right: 10px;
    }
  }
  .receiveAddress {
    border: 1px solid #e5e5e5;
    padding: 20px 0;
    .title {
      font-size: 14px;
      height: 24px;
      padding: 0 20px;
      border-left: 4px solid #00a0e9;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }
  }
  .tipWord{
    font-size: 16px;
    margin-right: 60px;
  }
}
</style>