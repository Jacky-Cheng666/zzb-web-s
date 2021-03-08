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
            <el-button size="mini" type="primary" icon="el-icon-plus">新增</el-button>
          </div>
        </div>
        <div class="content">
          <el-table border stripe :data="currentBookInfo.bank_account_list" style="width: 100%">
            <el-table-column align="center" prop="type" label="类型" width="100"></el-table-column>
            <el-table-column align="center" prop="bank_name" label="银行" width="350"></el-table-column>
            <el-table-column align="center" prop="account_name" label="账户名"></el-table-column>
            <el-table-column align="center" prop="account_id" label="账号" width="180"></el-table-column>
            <el-table-column align="center" prop="use_type" label="用途" width="60">
              <template slot-scope="scope"></template>
            </el-table-column>
            <el-table-column align="center" prop label="操作" width="120">
              <template slot-scope="scope">
                <el-button size="mini" type="text" icon="el-icon-edit">编辑</el-button>
                <el-button size="mini" type="text" icon="el-icon-delete" class="text-danger">删除</el-button>
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
          <el-button size="mini" type="success" style="height:29px">
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
  </div>
</template>

<script>
import { get_company_basic_info, set_financial_book_name, set_company_basic_info} from '@/api/enterpriseManage.js'
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
      financialBookName: ""
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