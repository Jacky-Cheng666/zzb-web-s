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
                <!-- <i style="float: right" class="el-icon-paperclip"></i> -->
                <svg-icon style="float: right" iconClass="nail"></svg-icon>
            </div>
            <el-link @click="toDetailPage(item)" style="margin-bottom:4px;display:block" type="primary" :underline="false" v-for="(item,index) in salesManage" :key="index">{{item.title}}</el-link>
        </el-card>

        <el-card class="box-card" style="width:200px">
            <div slot="header" class="clearfix">
                <span>采购管理</span>
                <!-- <i style="float: right" class="el-icon-paperclip"></i> -->
                <svg-icon style="float: right" iconClass="nail"></svg-icon>
            </div>
            <div v-for="o in 4" :key="o" class="text item">
                {{'我要请购 ' + o }}
            </div>
        </el-card>

        <el-card class="box-card" style="width:200px">
            <div slot="header" class="clearfix">
                <span>生产管理</span>
                <!-- <i style="float: right" class="el-icon-paperclip"></i> -->
                <svg-icon style="float: right" iconClass="nail"></svg-icon>
            </div>
            <div v-for="o in 4" :key="o" class="text item">
                {{'生产看板 ' + o }}
            </div>
        </el-card>

        <el-card class="box-card" style="width:200px">
            <div slot="header" class="clearfix">
                <span>财务管理</span>
                <!-- <i style="float: right" class="el-icon-paperclip"></i> -->
                <svg-icon style="float: right" iconClass="nail"></svg-icon>
            </div>
            <div v-for="o in 4" :key="o" class="text item">
                {{'报销中心 ' + o }}
            </div>
        </el-card>

        <el-card class="box-card" style="width:200px">
            <div slot="header" class="clearfix">
                <span>企业管理</span>
                <!-- <i style="float: right" class="el-icon-paperclip"></i> -->
                <svg-icon style="float: right" iconClass="nail"></svg-icon>
            </div>
            <div v-for="o in 4" :key="o" class="text item">
                {{'通讯录 ' + o }}
            </div>
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
      salesManage:[
          {title: '新建销单', url:'/salesManage/createSaleOrder'},
          {title: '协同接单', url:'/salesManage/createSaleOrder'},
          {title: '我要发货', url:'/salesManage/createSaleOrder'},
          {title: '销售记录', url:'/salesManage/createSaleOrder'},
          {title: '客户管理', url:'/salesManage/createSaleOrder'},
          {title: '产品管理', url:'/salesManage/createSaleOrder'},
      ]
    };
  },
  methods: {
    handleLogOut() {},
    toDetailPage(item){
        this.$router.push('/saleManage')
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