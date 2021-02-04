<template>
  <div class="home">
    <div class="top">
      <div class="nav">
        <div class="left">
          <div class="logo">
            <router-link to="/"><img src="../../assets/imgs/logo.png" class="logo-img" alt=""/></router-link>
          </div>
          <div v-if="isJoinCompany" class="user-company" style="font-size: 18px; margin-right: 120px">
            <span class="user-company-name">深圳市智造帮科技有限公司</span>
          </div>
          <div v-else>
            <span @click="handleJoinCompany" style="cursor: pointer" class="user-company-link">还未加入公司，前去注册</span>
          </div>
        </div>
        <div class="right" v-if="userName">
          <span class="userInfoName" style="margin-right: 20px" :underline="false">{{ userName }}</span>
          <span @click="handleLogOut" style="margin-right: 20px; cursor: pointer" class="logout-btn" :underline="false">登出</span>
        </div>
        <div v-else>
          <span @click="goToLogin" style="margin-right: 20px; cursor: pointer" class="logout-btn" :underline="false">登出</span>
        </div>
      </div>
    </div>
    <div class="content-wrap">
      <div class="ad-wrap">
        <el-carousel :interval="5000" trigger="click" >
          <el-carousel-item v-for="item in 4" :key="item">
            <img style="width:1440px;height:340px" src="../../assets/imgs/banner.png" alt="">
          </el-carousel-item>
        </el-carousel>
      </div>

      <div class="hot-link">
        <el-card class="box-card" style="width:320px">
            <div slot="header" class="clearfix">
                <span>我的任务</span>
                <i style="float: right" class="el-icon-plus"></i>
            </div>
            <div v-for="o in 4" :key="o" class="text item">
                {{'列表内容 ' + o }}
            </div>
        </el-card>

        <el-card class="box-card" style="width:200px">
            <div slot="header" class="clearfix">
                <span>销售管理</span>
                <svg-icon style="float: right" iconClass="nail"></svg-icon>
            </div>
            <el-link @click="toDetailPage(item)" style="margin-bottom:6px;display:block" type="primary" :underline="false" v-for="(item,index) in saleManage" :key="index">{{item.title}}</el-link>
        </el-card>

        <el-card class="box-card" style="width:200px">
            <div slot="header" class="clearfix">
                <span>采购管理</span>
                <svg-icon style="float: right" iconClass="nail"></svg-icon>
            </div>
            <el-link @click="toDetailPage(item)" style="margin-bottom:6px;display:block" type="primary" :underline="false" v-for="(item,index) in purchaseManage" :key="index">{{item.title}}</el-link>
        </el-card>

        <el-card class="box-card" style="width:200px">
            <div slot="header" class="clearfix">
                <span>生产管理</span>
                <svg-icon style="float: right" iconClass="nail"></svg-icon>
            </div>
            <el-link @click="toDetailPage(item)" style="margin-bottom:6px;display:block" type="primary" :underline="false" v-for="(item,index) in manufactureManage" :key="index">{{item.title}}</el-link>
        </el-card>

        <el-card class="box-card" style="width:200px">
            <div slot="header" class="clearfix">
                <span>财务管理</span>
                <svg-icon style="float: right" iconClass="nail"></svg-icon>
            </div>
            <el-link @click="toDetailPage(item)" style="margin-bottom:6px;display:block" type="primary" :underline="false" v-for="(item,index) in financeManage" :key="index">{{item.title}}</el-link>
        </el-card>

        <el-card class="box-card" style="width:200px">
            <div slot="header" class="clearfix">
                <span>企业管理</span>
                <svg-icon style="float: right" iconClass="nail"></svg-icon>
            </div>
            <el-link @click="toDetailPage(item)" style="margin-bottom:6px;display:block" type="primary" :underline="false" v-for="(item,index) in companyManage" :key="index">{{item.title}}</el-link>
        </el-card>
      </div>

      <el-card class="box-card dsasbord-content">
        <div slot="header" class="clearfix">
            <span>公司看板</span>
        </div>
      </el-card>

      <div class="bottom">深圳市智造帮科技有限公司提供技术支持</div>
    </div>
    
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      isJoinCompany: true,
      userName: "陈先生",
      saleManage:[
          {title: '新建销单', url:'/saleManage/createSaleOrder'},
          {title: '协同接单', url:''},
          {title: '我要发货', url:'/saleManage/deliveryManage'},
          {title: '销售记录', url:'/saleManage/saleRecords'},
          {title: '客户管理', url:''},
          {title: '产品管理', url:''},
      ],
      purchaseManage:[
          {title: '我的请购', url:'/purchaseManage/myRequestList'},
          {title: '我要询价', url:''},
          {title: '新建订单', url:'/purchaseManage/createPurchaseOrder'},
          {title: '我要收货', url:'/purchaseManage/receiveManage'},
          {title: '采购记录', url:''},
          {title: '供应商管理', url:''},
      ],
      manufactureManage: [
        {title: '生产看板', url:''},
        {title: '工单管理', url:''},
        {title: '团队管理', url:''},
      ],
      financeManage: [
        {title: '报销中心', url:''},
        {title: '付款管理', url:''},
        {title: '收款管理', url:''},
        {title: '付款统计', url:''},
        {title: '收款统计', url:''},
      ],
      companyManage: [
        {title: '通讯录', url:''},
        {title: '流程管理', url:''},
        {title: '库存管理', url:''},
        {title: '品类管理', url:''},
        {title: '基本信息', url:''},
      ]
    };
  },
  methods: {
    handleLogOut() {},
    toDetailPage(item){
      if(item.url){
        this.$router.push(item.url)
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.home {
  .top {
    width: 100%;
    height: 56px;
    background-color: #303f56;
    margin-bottom: 24px;
    .nav {
      width: 1440px;
      height: 100%;
      margin: 0 auto;
      display: flex;
      align-items: center;
      color: #ffffff;
      font-size: 14px;
      justify-content: space-between;
      .left {
        display: flex;
        align-items: center;
        .logo {
          margin-right: 45px;
        }
      }
    }
  }
  .content-wrap {
    width: 1440px;
    margin: 0 auto;
    .ad-wrap {
      width: 100%;
      height: 300px;
      margin-bottom: 24px;
    }
  }
  .hot-link{
      display: flex;
      justify-content: space-between;
      margin-bottom: 24px;
  }
  .dsasbord-content{
      height: 300px;
      margin-bottom: 24px;
  }
  .bottom{
      text-align: center;
      font-size: 14px;
  }
}
</style>