<template>
  <div class="addressDialog">
    <div class="address-tooltip" v-show="openAddress">
      <div class="tooltip-title">收货人地址</div>
      <div class="tooltip-top">
        <el-input
          style="width: 150px;"
          placeholder="收件人"
          v-model="addressForm.receiver"
          clearable
        ></el-input>
        <el-input
          style="width: 240px;"
          placeholder="收件人手机号码"
          v-model="addressForm.receiver_phone"
          clearable
        ></el-input>
      </div>
      <div class="tooltip-middle">
        <el-input
          style="width: 100%;"
          placeholder="收件地址"
          v-model="addressForm.receiver_address"
          clearable
        ></el-input>
      </div>
      <div class="tooltip-bottom">
        <div class="tooltip-bottom-left"></div>
        <div class="tooltip-bottom-right">
          <el-button size="mini" @click="openAddress = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="submitAddress">保 存</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { setPlanOrderReceiveInfo } from '@/api/saleManage'

import { mapGetters } from 'vuex'

export default {
  name: 'addressDialog',
  props:{
    value:{
      deep: true,
      handler: function(){
        return []
      }
    }
  },
  computed:{
    ...mapGetters(['token'])
  },
  data() {
    return {
      openAddress: false,
      addressForm:{
        receiver: '',
        receiver_phone: '',
        receiver_address: ''
      },
      receiveIsOk: false
    }
  },
  methods: {
    submitAddress(){
      // if(this.addressForm.receiver && this.addressForm.receiver_phone && this.addressForm.receiver_address && this.addressForm.receiver.trim() && this.addressForm.receiver_phone.trim() && this.addressForm.receiver_address.trim()){
      //   this.receiveIsOk = true
      // }
      // if(this.receiveIsOk){
      //   if( !(/^1[3456789]\d{9}$/.test(this.addressForm.receiver_phone)) ){
      //     this.$message({
      //       showClose: true,
      //       message: '请输入正确的手机号码！',
      //       type: 'warning'
      //     })
      //     return false
      //   }
      //   if(this.addressForm.receiver.trim().length > 16){
      //     this.$message({
      //       showClose: true,
      //       message: '输入的收件人名称过长！',
      //       type: 'warning'
      //     })
      //     return false
      //   }
      //   if(this.addressForm.receiver_address.trim().length > 128){
      //     this.$message({
      //       showClose: true,
      //       message: '输入的收件地址过长！',
      //       type: 'warning'
      //     })
      //     return false
      //   }

      //   this.$confirm('确定要提交吗?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     searchElements({
      //       access_token: this.token,
      //       order_no: this.tmpOrderKey,
      //       receiver: this.addressForm.receiver.trim(),
      //       receiver_phone: this.addressForm.receiver_phone.trim(),
      //       receiver_address: this.addressForm.receiver_address.trim()
      //     }).then(response => {
      //       if (response.code == 0){
      //         this.$message({
      //           showClose: true,
      //           message: '提交成功',
      //           type: 'success'
      //         })
      //       }
      //     })
      //   })
      // } else{
      //   this.$message({
      //    showClose: true,
      //    message: '请填写完整的收件人信息',
      //    type: 'warning'
      //  })
      // }

      this.$emit("input", this.addressForm)
      this.openAddress = false;
    }
  },
}
</script>

<style scoped lang="stylus">
@import '~@/styles/mixin.styl'

.address-tooltip
  address-tooltip-edit()
</style>