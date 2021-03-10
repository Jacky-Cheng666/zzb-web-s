<template>
  <div class="addressDialog">
    <el-dialog center title="收货人地址" :visible.sync="openAddress" width="960px" append-to-body>
      <!-- <div class="tooltip-title">收货人地址</div> -->
      <div class="tooltip-top">
        <el-input
          style="width: 150px;"
          placeholder="收件人"
          v-model="submitAddress.receiver"
          clearable
        ></el-input>
        <el-input
          style="width: 240px;"
          placeholder="收件人手机号码"
          v-model="submitAddress.receiver_phone"
          clearable
        ></el-input>
      </div>
      <div class="tooltip-middle">
        <el-input
          style="width: 100%;"
          placeholder="收件地址"
          v-model="submitAddress.receiver_address"
          clearable
        ></el-input>
      </div>
      <div class="tooltip-bottom">
        <div class="tooltip-bottom-left"></div>
        <div class="tooltip-bottom-right">
          <el-button size="mini" @click="openAddress = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="submitAddress">提 交</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
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
  data() {
    return {
      openAddress: false,
      addressForm:{
        receiver: '',
        receiver_phone: '',
        receiver_address: ''
      }
    }
  },
  methods: {
    submitAddress(){
      this.$emit("input",this.addressForm)
      this.openAddress = false;
    }
  },
}
</script>

<style lang="scss">
</style>