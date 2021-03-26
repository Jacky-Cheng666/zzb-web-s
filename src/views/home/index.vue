<template>
  <div class="home">
    <div class="top">
      <div class="nav">
        <div class="left">
          <div class="logo">
            <router-link to="/"><img src="../../assets/imgs/logo.png" class="logo-img" alt=""/></router-link>
          </div>
          <div v-if="isJoinCompany" class="user-company" style="font-size: 18px; margin-right: 120px">
            <el-select v-if="companies && companies.length>1" style="font-size: 18px;color: white;margin-left: 0px;width: 240px;" v-model="company_no" @change="changeCompany" placeholder="请输入或者选择">
              <el-option v-for="item in companies" :key="item.company_no" :label="item.name" :value="item.company_no" />
            </el-select>

            <span v-else class="user-company-name">{{company_name}}</span>
          </div>
          <div v-else>
            <span @click="handleJoinCompany" style="cursor: pointer" class="user-company-link">还未加入公司，前去注册</span>
          </div>
        </div>
        <div class="right" v-if="name">
          <span class="userInfoName" style="margin-right: 20px" :underline="false">{{ name }}</span>
          <span @click="handleLogOut" style="margin-right: 20px; cursor: pointer" class="logout-btn" :underline="false">登出</span>
        </div>
        <div v-else>
          <span @click="handleLogOut" style="margin-right: 20px; cursor: pointer" class="logout-btn" :underline="false">登出</span>
        </div>
      </div>
    </div>
    <div class="content-wrap">
      <div class="ad-wrap">
        <el-carousel :interval="5000" trigger="click" >
          <el-carousel-item v-for="item in 4" :key="item">
            <img style="width:100%;height:300px" src="../../assets/imgs/banner.png" alt="">
          </el-carousel-item>
        </el-carousel>
      </div>

      <div class="hot-link">
        <el-card class="box-card" style="width:300px">
            <div slot="header" class="clearfix">
                <span>我的任务</span>
                <i style="float: right" class="el-icon-plus"></i>
            </div>
            <div v-for="o in 4" :key="o" class="text item">
                {{'列表内容 ' + o }}
            </div>
        </el-card>

        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>销售管理</span>
                <svg-icon style="float: right" iconClass="nail"></svg-icon>
            </div>
            <el-link :disabled="!item.url" @click="toDetailPage(item)" class="el-link" :class="{'mr0':index%2!=0}" type="primary" :underline="false" v-for="(item,index) in saleManage" :key="index">{{item.title}}</el-link>
        </el-card>

        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>采购管理</span>
                <svg-icon style="float: right" iconClass="nail"></svg-icon>
            </div>
            <el-link :disabled="!item.url" @click="toDetailPage(item)" class="el-link" :class="{'mr0':index%2!=0}" type="primary" :underline="false" v-for="(item,index) in purchaseManage" :key="index">{{item.title}}</el-link>
        </el-card>

        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>生产管理</span>
                <svg-icon style="float: right" iconClass="nail"></svg-icon>
            </div>
            <el-link :disabled="!item.url" @click="toDetailPage(item)" style="margin-bottom:12px;display:block" type="primary" :underline="false" v-for="(item,index) in manufactureManage" :key="index">{{item.title}}</el-link>
        </el-card>

        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>财务管理</span>
                <svg-icon style="float: right" iconClass="nail"></svg-icon>
            </div>
            <el-link :disabled="!item.url" @click="toDetailPage(item)" class="el-link" :class="{'mr0':index%2!=0}" type="primary" :underline="false" v-for="(item,index) in financeManage" :key="index">{{item.title}}</el-link>
        </el-card>

        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>企业管理</span>
                <svg-icon style="float: right" iconClass="nail"></svg-icon>
            </div>
            <el-link :disabled="!item.url" @click="toDetailPage(item)" style="margin-bottom:12px;display:block" type="primary" :underline="false" v-for="(item,index) in companyManage" :key="index">{{item.title}}</el-link>
        </el-card>
      </div>

      <el-card class="dsasbord-content">
        <div slot="header" class="clearfix">
            <span>公司看板</span>
        </div>
      </el-card>

      <div class="bottom">深圳市智造帮科技有限公司提供技术支持</div>
    </div>
    
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { switch_company } from '@/api/user.js'
import { getToken,setToken } from '@/utils/auth'
export default {
  name: "home",
  data() {
    return {
      isJoinCompany: true,
      company_no: '',
      saleManage:[
          {title: '新建销单', url:'/saleManage/createSaleOrder'},
          {title: '预备订单', url:''},
          {title: '协同报价', url:'/saleManage/synergyOfferPrice'},
          {title: '客户询价', url:''},
          {title: '协同接单', url:'/saleManage/synergyOrderManage/overView'},
          {title: '订单跟进', url:''},
          {title: '我要发货', url:'/saleManage/deliveryManage'},
          {title: '销售记录', url:'/saleManage/saleRecords'},
          {title: '产品管理', url:'/saleManage/productManage'},
          {title: '客户管理', url:'/saleManage/purchaserManage'},
          {title: '销售统计', url:''},
          {title: '对账中心', url:''},
      ],
      purchaseManage:[
          {title: '我的请购', url:'/purchaseManage/RequestOrderManage'},
          {title: '请购审批', url:''},
          {title: '我要发单', url:''},
          {title: '订单审批', url:''},
          {title: '新建订单', url:'/purchaseManage/createPurchaseOrder'},
          {title: '订单跟进', url:''},
          {title: '我要收货', url:'/purchaseManage/receiveManage'},
          {title: '采购记录', url:'/purchaseManage/purchaseRecords'},
          {title: '成交履历', url:''},
          {title: '供应商管理', url:'/purchaseManage/supplierManage'},
          {title: '采购统计', url:''},
          {title: '对账中心', url:''},
      ],
      manufactureManage: [
        {title: '生产看板', url:''},
        {title: '工单管理', url:''},
        {title: '工单跟进', url:''},
        {title: '团队管理', url:''},
        {title: '设备管理', url:''},
      ],
      financeManage: [
        {title: '报销中心', url:''},
        {title: '报销审批', url:''},
        {title: '付款管理', url:''},
        {title: '收票管理', url:''},
        {title: '收款管理', url:''},
        {title: '开票管理', url:''},
        {title: '付款统计', url:''},
        {title: '收款统计', url:''},
      ],
      companyManage: [
        {title: '通讯录', url:'/enterpriseManage/addressBook'},
        {title: '流程管理', url:'/enterpriseManage/processManage'},
        {title: '库存管理', url:'/enterpriseManage/inventoryManage'},
        {title: '品类管理', url:'/enterpriseManage/categoryManage'},
        {title: '基本信息', url:'/enterpriseManage/basicInfo'},
      ]
    };
  },
  created() {
    this.company_no = this.login_company_no
  },
  computed: {
    ...mapGetters(['name','companies','login_company_no','token']),
    company_name(){
      return this.$store.state.user.org?this.$store.state.user.org.name:""
    }
  },
  methods: {
    toDetailPage(item){
      if(item.url){
        this.$router.push(item.url)
      }
    },
    handleLogOut() {
      this.$confirm('确定登出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async()=>{
        await this.$store.dispatch('user/logout')
        this.$router.replace(`/login`)
      }).catch(()=>{})
      
    },
    changeCompany(){
      this.$confirm('确定切换公司主体？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async ()=>{
        let result = await switch_company({
          access_token: this.token,
          company_no: this.company_no
        })
        if(result.code===0){
          let profile = getToken('profile')
          profile.department_id = result.profile.department_id
          profile.department_name = result.profile.department_name
          profile.job = result.profile.job
          setToken('profile',profile)
          setToken('company_no',result.company_no)
          this.$store.commit('user/SET_COMPANY_NO',result.company_no)
          this.$message.success("公司主体切换成功!")
        }
      }).catch(()=>{})
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
      width: 80%;
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
    width: 80%;
    margin: 0 auto;
    .ad-wrap {
      width: 100%;
      height: 300px;
      margin-bottom: 24px;
    }
  }
  .box-card {
    width: 200px;
  }
  .hot-link{
      display: flex;
      justify-content: space-between;
      margin-bottom: 24px;
  }
  .dsasbord-content{
      height: 300px;
      margin-bottom: 10px;
  }
  .bottom{
      text-align: center;
      font-size: 14px;
  }
  .mr0{
    margin-right: 0 !important;
  }
  .el-link {
    margin-bottom:12px;
    margin-right:20px
  }
}
</style>