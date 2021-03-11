<template>
  <div class="login-container">
    <span style="position:absolute;left: 239px;top:-54px">
      <img src="../../assets/imgs/smallo.png" style="height: 109px;" alt="">
    </span>
    <div class="loginCenterWrap">
      <div class="loginCenter">
        <div class="loginContent">
          <span style="position:absolute;left: 454px;top:-50px;">
            <img src="../../assets/imgs/graybo.png" style="height: 46px;" alt="">
          </span>
          <span style="position:absolute;right: 500px;top: -25px;">
            <img src="../../assets/imgs/grays.png" style="height: 27px;" alt="">
          </span>
          <span style="position:absolute;right: -10px;top: -50px;">
            <img src="../../assets/imgs/bigo.png" style="height: 165px;" alt="">
          </span>
          <el-row>
            <el-col :span="12"><img src="../../assets/imgs/bigBg.png" style="height: 663px;" alt=""></el-col>
            <el-col :span="12">
              <div class="loginmsg">
                <div><img src="../../assets/imgs/login-logo.png" style="height: 65px;margin-top:82px;" alt="logo"></div>
                <div style="padding-top: 50px;">
                  <div class="loginInfoInner" style="width: 320px;margin: 0 auto;">
                    <div style="color:#333333;font-size: 20px;font-weight: bold;text-align: left;">欢迎登录</div>
                    <div style="margin-top: 30px;">
                      <el-input @input="onChangePhone" size="small" placeholder="请输入手机号码" v-model="phone" />
                    </div>
                    <div style="text-align: left;line-height: 48px;margin-top: 20px;overflow: hidden;">
                      <span style="display: inline-block;">
                        <el-input style="width: 143px;" size="small" placeholder="请输入图形验证码" v-model="image_code" />
                      </span>
                      <span class="svgCode" @click="getImagecode" style="float: right;cursor: pointer;" v-html="codeImage"></span>
                    </div>
                    <div style="text-align: left;line-height: 36px;margin-top: 3px;">
                      <span style="display: inline-block;">
                        <el-input style="width: 178px;" size="small" placeholder="请输入验证码" v-model="verify_code" />
                      </span>
                      <el-button v-show="!isNUm" style="float: right;" size="medium" type="primary" :disabled="disabledTime" @click="getCode">{{time}}</el-button>
                      <el-button v-show="isNUm" style="float: right;background-color: #eeeeee !important;border-color: #eeeeee !important;color:#757575 !important; " size="medium" type="primary" :disabled="disabledTime" @click="getCode">{{time}}</el-button>
                    </div>
                    <el-button style="width: 100%;margin-top: 35px;" size="medium" type="primary" @click="submit">登 录</el-button>
                    <div style="font-size: 12px;color: #333333;text-align: left;margin-top: 30px;">
                      <span @click="handleJoinCompany" style="float: right;cursor: pointer;">还没有账号？<span style="color:#00A0E9;">免费注册</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div @click="herfBlank" style="text-align: center;color: gray;font-size: 14px;position:fixed;left: 50%; transform: translateX(-50%) ;bottom:10px;width: 100%;cursor: pointer;">@2019 智造帮 粤ICP备17086927号-3</div>
    </div>
  </div>
</template>

<script>
import axios from "axios"
// import Bus from "./common/bus.js"
// import common from "./common/common.js"
import { get_image_check_code_info, login, login_get_code } from '@/api/user.js'
import { setToken } from '@/utils/auth.js'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

export default {
    name: "Login",
    data(){
      var contact_phoneCheck = (rule, value, callback) => {
        var exe = /^1[3456789]{1}\d{9}$/
        if (value === '') {
          callback(new Error('手机号不能为空'))
        } else if (!exe.exec(value)) {
          callback(new Error('请正确输入手机号'))
        } else {
          callback()
        }
      }
      return {
        code_id: "",
        image_code: "",
        codeImage: '',
        access_token:"",
        currentTime: 61,
        time: '获取验证码', //倒计时
        disabledTime: true, //倒计时
        phone: "",
        verify_code: "",
        interval: "",
        checkPhone: false,
        isNUm: false,
        redirect: undefined,
        otherQuery: {}
      }
    },
    // beforeRouteEnter(to,from,next){
    //   //判断url是否带参数
    //   let url = window.location.href
    //   let query = url.split('?')[1]
    //   let rlt = ''
    //   if(query){
    //     //带参数
    //     rlt = query.split('=')[1].split('#')[0]
    //     //执行注销
    //     if(rlt === 'logout'){
    //       axios.post('/user/logout',{
    //         access_token: this.$store.state.access_token
    //       })
    //       window.localStorage.clear()
    //       next()
    //     } else{
    //       next()
    //     }
    //   } else {
    //     //不带参数
    //     next()
    //   }
    // },
    created(){
      this.getImagecode()
    },
    methods: {
      async getImagecode(){
        let res = await get_image_check_code_info({})
        if (res.code == 0) {
          this.code_id = res.message.codeID
          this.codeImage = res.message.codeImage
        }
      },
      herfBlank(){
        window.open("http://www.beian.miit.gov.cn/state/outPortal/loginPortal.action")
      },
      hasNum(){
        let p = /[0-9]/
        this.isNUm = p.test(this.time)
      },
      onChangePhone(){
        let phnum = /^1[3456789]{1}\d{9}$/

        if (!phnum.exec(this.phone)) {
          this.checkPhone = false
          this.disabledTime = true
          clearInterval(this.interval)
          this.interval = null
          this.currentTime = 61
          this.time = "发送验证码"
        } else {
          this.checkPhone = true
          this.disabledTime = false
        }
      },
      async getCode(){
        if (!this.image_code) {
          this.$message({
            showClose: true,
            type: 'warning',
            message: '请输入图形验证码!'
          })
          return
        }
        let _this = this
        // 手机验证码
        let res = await login_get_code({
          phone: this.phone,
          terminal_id: this.phone,
          code_id: this.code_id,
          image_code: this.image_code,
        });
        if(res.code===0){
          this.disabledTime = true
          this.interval = setInterval(() => {
            this.currentTime--;
            this.time = this.currentTime + '秒'
            if (this.currentTime <= 0) {
              clearInterval(_this.interval)
              this.time = '重新发送'
              this.currentTime = 61
              this.disabledTime = false
            }
          }, 1000)
        }
      },
      async submit(){
        if (!this.checkPhone) {
          this.$message({
            showClose: true,
            type: 'warning',
            message: '请正确输入手机号!'
          })
          return
        } else if (!this.verify_code) {
          this.$message({
            showClose: true,
            type: 'warning',
            message: '请输入验证码!'
          })
          return
        }
        //登录请求
        this.$store.dispatch('user/login', {
          phone: this.phone,
          terminal_id: this.phone,
          verify_code: this.verify_code
        }).then((result)=>{
          if(result.code===0){
            this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
          }
        })
      },
      loginBtn(e){
        let _this = this
        let keyNum = e.keyCode;       //获取被按下的键值
        //判断如果用户按下了回车键（keycody=13）
        if (keyNum == 13) {
          this.getImagecode()
          _this.submit('formCustom')
        }

      },
      handleJoinCompany(){
        let tmp = corpUrl + '?linkLogin=true'
        window.location.href = (tmp)
      },
      getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
    },
    components: {},
    mounted(){
      let _this = this
      document.addEventListener("keydown", _this.loginBtn)
    },
    destroyed(){
      let _this = this
      document.removeEventListener('keydown', _this.loginBtn)
    },
    watch: {
      time(){
        this.hasNum()
      },
      $route: {
        handler: function(route) {
          const query = route.query
          if (query) {
            this.redirect = query.redirect
            this.otherQuery = this.getOtherQuery(query)
          }
        },
        immediate: true
      }
    }
}
</script>

<style lang="scss">
$bg:#fff;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  position: relative;
  .loginCenterWrap{
      width: 100%;
      position: absolute;
      height: 660px;
      left: 0;
      top: 100px;
      right: 0;
      margin: auto;
      .loginCenter{
        text-align: center;
        .loginContent{
          position: relative;
          height: 660px;
          display: inline-block;
          .loginmsg{
            height: 601px;
            width: 500px;
            background-color: white;
            margin-top: 28px;
            box-shadow: 0px 3px 32px 0px rgba(43, 95, 236, 0.25);
            border-radius: 0px 8px 8px 0px;
            text-align: center;
            .el-button--medium{
              width: 110px;
              height: 36px;
              border-radius: 8px;
              span {
                font-size: 14px !important;
              }
            }
            .loginInfoInner{
              .el-input--small{
                font-size: 14px;
                input{
                  border-bottom: 1px solid #999999 !important;
                  border-radius: 0;
                  line-height: 36px;
                  &:focus{
                    border-bottom: 1px solid #00A0E9 !important;
                    border-radius: 0;
                  }
                }
                .el-input__inner{
                  border: none;
                  padding: 0;
                }
              }
            }
          }
        }
      }
  }
  
}
</style>
