<template>
  <div class="app-container basicInfo">
    <div class="bookInfo">
      <div class="header">
        <div class="left">
          <span class="tipWord">账本信息</span>
          <el-input style="width:120px" size="mini" placeholder="输入账本名称"></el-input>
          <el-button size="mini" type="primary">保存账本名称</el-button>
        </div>
        <el-select style="width:102px" size="mini" v-model="value" placeholder="请选择">
          <el-option label="默认账本" value="001"></el-option>
        </el-select>
      </div>
      <div class="info">
        <div class="title">
          <div style="color: #333;font-weight: bold">基本信息</div>
          <el-button size="mini" type="primary" style="margin-right:-14px">保存</el-button>
        </div>
        <div class="content">
          <el-row style="margin-bottom:15px">
            <el-col :span="10">
              <el-input size="mini" disabled style="width:680px" placeholder="公司名称"/>
            </el-col>
            <el-col :offset="4" :span="10">
              <el-input size="mini" style="width:680px;margin-left:20px" placeholder="公司简称"></el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-input size="mini" style="width:680px" placeholder="注册地址"></el-input>
            </el-col>
            <el-col :offset="4" :span="10">
              <el-input size="mini" style="width:680px;margin-left:20px" placeholder="纳税识别码"></el-input>
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
            <el-button size="mini" type="success" icon="el-icon-folder">保存</el-button>
          </div>
        </div>
        <div class="content">
          <el-table stripe :data="currentBookInfo.bank_account_list" style="width: 100%">
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
                <el-button size="mini" type="text" icon="el-icon-delete" style="color:#F56C6C">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="setTax">
      
    </div>
    <div class="receiveAddress"></div>
  </div>
</template>

<script>
export default {
  name: "basicInfo",
  data() {
    return {
      value: "001",
      currentBookInfo: {
        bank_account_list: [{},{}]
      }
    };
  },
};
</script>

<style lang='scss'>
.basicInfo {
  .bookInfo {
    border: 1px solid #e5e5e5;
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
      padding: 0 24px;
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
  .tipWord{
    font-size: 16px;
    margin-right: 60px;
    // color: #333;
  }
}
</style>