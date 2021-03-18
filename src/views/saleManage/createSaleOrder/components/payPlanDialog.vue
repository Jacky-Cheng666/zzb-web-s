<template>
  <div class="payPlanDialog">
    <el-dialog center title="付款计划" :visible.sync="openPlan" width="960px" append-to-body>
      <el-table 
        :data="payPlanData" 
        class="pay-plan-table" 
        height='520px'
        style="width: 100%; min-height: 520px;"
        :show-header='false'
      >
        <el-table-column 
          property="pay_time" 
          label="付款日期" 
          width="220">
          <template slot-scope="scope">
            <div class="block">
              <span style="margin-left: 10px; margin-right: 10px;">付款日期</span>
              <el-date-picker
                style="width: 115px"
                v-model="scope.row.pay_time"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                :clearable=false
                :picker-options="startDatePicker">
              </el-date-picker>
            </div>
          </template>
        </el-table-column>
        <el-table-column 
          property="pay_money" 
          label="金额" 
          width="160">
          <template slot-scope="scope">
            <div class="block" style="display: flex;">
              <span style="margin-left: 10px; margin-right: 10px;">金额</span>
              <el-input style="display: inline-block; width: 100px;" size="mini" @mousewheel.native.prevent type="number" placeholder="输入数字" @change="payNumChange($event,scope.row)" v-model="scope.row.pay_money"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column 
          property="pay_percent" 
          label="占比" 
          width="160">
          <template slot-scope="scope">
            <div class="block" style="display: flex;">
              <span style="margin-left: 10px; margin-right: 10px;">占比</span>
              <el-input style="width: 60px;" size="mini" @mousewheel.native.prevent type="number" placeholder="百分比" @change="payPercentChange($event,scope.row)" v-model="scope.row.pay_percent"></el-input>
              <span style="margin-left: 10px; margin-right: 10px;">%</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column 
          property="remark" 
          label="说明">
          <template slot-scope="scope">
            <div class="block">
              <el-input size="mini" placeholder="请输入说明" v-model="scope.row.remark"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column 
          property="pay_over" 
          label="已付"
          width="60">
          <template slot-scope="scope">
            <div class="block">
              <el-checkbox v-model="scope.row.pay_over">已付</el-checkbox>
            </div>
          </template>
        </el-table-column>
        <el-table-column 
          property="delete_btn" 
          label="删除"
          width="50">
          <template slot-scope="scope">
            <i v-if="scope.row.isLastRow" style="font-size: 20px; color: red; cursor: pointer; margin-right: 5px;" @click="handleDeleteLastRow(scope.row)" class="el-icon-delete"></i>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-row style="display:flex;align-items:center">
          <el-col :span="18" style="display:flex;justify-content:start;align-items:center">
            <span class="f14">分为</span>
            <el-select v-model="valuePayPlan" size="small" style="width: 70px;margin:0 10px">
              <el-option
                v-for="item in payPlanOptions"
                :key="item.label"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <span class="f14 mr20">期</span>
            <el-button @click="handleDoPayPlan" class="mr20" type="text">执行付款</el-button>
            <span class="f14 mr20">未作计划金额：{{ getOutPlanMoney() }}</span>
            <span class="f14">总金额：{{ getOrderTotalPay() }}</span>
          </el-col>
          <el-col :span="6">
            <el-button size="mini" @click="handleCancelPayPlan">取 消</el-button>
            <el-button size="mini" type="primary" @click="handleSubmitPayPlan">提 交</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import common from '@/utils/common'

export default {
  name: 'payPlanDialog',
  props:{
    value:{
      deep: true,
      handler: function(){
        return []
      }
    },
    receivedTotalPrice: 0
  },
  data() {
    return {
      openPlan: false,
      startDatePicker: this.beginDate(),
      planForm:{
        
      },
      payPlanOptions: [
        {
          label: '1',
          value: 1
        },
        {
          label: '2',
          value: 2
        },
        {
          label: '3',
          value: 3
        },
        {
          label: '4',
          value: 4
        },
        {
          label: '5',
          value: 5
        },
        {
          label: '6',
          value: 6
        },
        {
          label: '7',
          value: 7
        },
        {
          label: '8',
          value: 8
        },
        {
          label: '9',
          value: 9
        },
        {
          label: '10',
          value: 10
        },
        {
          label: '11',
          value: 11
        },
        {
          label: '12',
          value: 12
        },
      ],
      valuePayPlan: 1,
      payPlanList: [],
      payPlanData: [],
      inPayPlanMoney: 0,
    }
  },
  methods: {
    addPayPlan(){
      return;
      this.planForm.plan_list.push({pay_time:new Date(),pay_money:"",percent:"",remark:"",payed:false})
    },
    deletePlan(index){
      // console.log('index',index);
      this.planForm.plan_list.splice(index,1)
    },
    // submitPayPlan(){
    //   this.$emit("input",this.planForm.plan_list)
    //   this.openPlan = false
    // },
    //
    beginDate(){
      return {
        disabledDate(time){
          return (time.getTime() + 3600 * 1000 * 24) < Date.now()//开始时间不选时，结束时间最大值小于等于当天
        }
      }
    },
    getCurTime() {
        let now = new Date()
        let cur_time = now.getTime()
        return cur_time
    },
    startPlan(){
      this.resetPayPlanData()
      this.refreshPayPlanDat()
      this.openPlan = true;
    },
    resetPayPlanData(){
      this.valuePayPlan = (this.payPlanList && this.payPlanList.length > 0) ? this.payPlanList.length:1
      this.countInPlanPrice()
    },
    countInPlanPrice(){
      let tempPrice = 0
      if(this.payPlanData.length > 0){
        this.payPlanData.forEach(item => {
          if(item.pay_money){
            tempPrice += item.pay_money
          }
        })
      }

      this.inPayPlanMoney = common.fixFloat2(tempPrice)
    },
    refreshPayPlanDat(){
      if(this.payPlanData.length > 0){
        this.payPlanData.forEach((item, index) => {
          item.sort_index = index
          if(index !== this.payPlanData.length - 1){
            item.isLastRow = false
          } else{
            item.isLastRow = true
          }
        })
      }
    },
    handleDoPayPlan(){
      //执行付款计划
      let len = this.payPlanData.length

      if(this.valuePayPlan < len){
        this.$message({
          showClose: true,
          message: '选择的分期数小于当前付款计划期数，请检查！',
          type: 'warning'
        })

        return
      }

      if(this.valuePayPlan > len){
        this.handleAddPlanRow(this.valuePayPlan - len)

        this.refreshPayPlanDat()
        this.countInPlanPrice()
      }
    },
    handleDeleteLastRow(row){
      this.payPlanData.splice(row.sort_index, 1)

      this.refreshPayPlanDat()
      this.countInPlanPrice()
    },
    testNumIsFull(row){
      let allPlanMoney = 0
      let allPlanPercent = 0
      this.payPlanData.forEach(item => {
        if(item.sort_index !== row.sort_index  && item.pay_money){
          allPlanMoney += item.pay_money
          allPlanPercent += item.pay_percent
        }
      })
      let restMoney = common.fixFloat2(this.orderInfo.total_pay - allPlanMoney)
      let restPercent = 100 - allPlanPercent

      let result = {
        rest_money: restMoney,
        rest_percent: restPercent
      }
      return result
    },
    payNumChange(e,row){
      let restObj = this.testNumIsFull(row)
      if(e <= 0){
        row.pay_money  = 0
        row.pay_percent  = 0
      } else if(e >= restObj.rest_money){
        row.pay_money = restObj.rest_money
        row.pay_percent = restObj.rest_percent
      } else{
        row.pay_money  = common.fixFloat2(e)
        row.pay_percent = Math.round((row.pay_money / this.receivedTotalPrice) * 100)
      }

      this.countInPlanPrice()
    },
    payPercentChange(e,row){
      let restObj = this.testNumIsFull(row)
      if(e <= 0){
        row.pay_percent  = 0
        row.pay_money = 0
      } else if(e >= restObj.rest_percent) {
        row.pay_percent  = restObj.rest_percent
        row.pay_money = restObj.rest_money
      } else{
        row.pay_percent  = Math.round(e)
        row.pay_money = common.fixFloat2((this.receivedTotalPrice * row.pay_percent)/100)
      }

      this.countInPlanPrice()
    },
    handleAddPlanRow(n){
      let totalPrice = this.receivedTotalPrice
      
      let preTotalPercent = 0
      let preTotalPrice = 0
      this.payPlanData.forEach(item => {
        preTotalPercent += item.pay_percent
        preTotalPrice += item.pay_money
      })
      // console.log('preTotalPercent',preTotalPercent)
      // console.log('preTotalPrice',preTotalPrice)
      
      let restTotalPercent = 100 - preTotalPercent
      let averagePercent = Math.floor(restTotalPercent / n)
      let lastOnePercent = restTotalPercent - (averagePercent * (n - 1))

      let restTotalPrice = totalPrice - preTotalPrice
      let averagePrice = common.fixFloat2((averagePercent * restTotalPrice)/100)
      let lastOnePrice = common.fixFloat2(restTotalPrice - (averagePrice * (n - 1)))
      
      // console.log('restTotalPercent',restTotalPercent)
      // console.log('restTotalPrice',restTotalPrice)

      // console.log('averagePercent',averagePercent)
      // console.log('lastOnePercent',lastOnePercent)
      // console.log('averagePrice',averagePrice)
      // console.log('lastOnePrice',lastOnePrice)

      for(let i = 0; i < n; i ++){
        if(i === n -1){
          this.payPlanData.push(
            {
              pay_money: lastOnePrice,
              pay_percent: lastOnePercent,
              pay_time: '',
              remark: '',
              pay_over: false
            }
          )
        } else{
          this.payPlanData.push(
            {
              pay_money: averagePrice,
              pay_percent: averagePercent,
              pay_time: '',
              remark: '',
              pay_over: false
            }
          )
        }
      }
    },
    handleCancelPayPlan(){
      if(this.payPlanData.length <= 0){
        this.openPlan = false

        return false
      }

      this.$confirm('现在取消将丢失所有未提交的数据,确定要继续吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //清空列表
        this.resetPayPlanData()
        //关闭弹出层
        this.openPlan = false
      })
    },
    handleSubmitPayPlan(){
      if(this.payPlanData.length <= 0){
        this.resetPayPlanData()
        this.openPlan = false

        return
      }

      let payment_amount = 0
      let payment_over = false

      if(this.payPlanData.length > 0){
        let data  = this.payPlanData
        for(let key in data){
          let row = data[key]
          let m = Number(key) + 1
          if (!row.pay_time) {
            this.$message({
              showClose: true,
              type: 'warning',
              message: '第' + m + '行的付款日期 未选择，请检查！'
            })

            return
          }

          if (row.pay_money === 0 || !row.pay_money) {
            this.$message({
              showClose: true,
              type: 'warning',
              message: '第' + m + '行的金额应 大于 0，请检查！'
            })

            return
          }

          if (!row.pay_percent || row.pay_percent === 0) {
            this.$message({
              showClose: true,
              type: 'warning',
              message: '第' + m + '行的占比应 大于 0，请检查！'
            })

            return
          }

          if(!row.remark || (row.remark && row.remark.trim().length <= 0)){
            this.$message({
              showClose: true,
              type: 'warning',
              message: '第' + m + '行的说明 未填写，请检查！'
            })

            return
          }
        }


        //检查百分比总和、金额总和
        let profile = JSON.parse(localStorage.getItem('profile'))
        let allPayOver = true
        let allTotalPercent = 0
        let allTotalPrice = 0
        let allPayOverPrice = 0
        
        this.payPlanData.forEach(item => {
          allTotalPercent += item.pay_percent
          allTotalPrice += item.pay_money

          if(item.pay_over){
            item.receiver = profile.name
            item.receiver_id = profile.id
            item.receive_time = this.getCurTime()
            allPayOverPrice += item.pay_money
          } else{
            allPayOver = false
          }
        })

        allTotalPrice = common.fixFloat2(allTotalPrice)

        if(allTotalPercent !== 100){
          this.$message({
            showClose: true,
            type: 'warning',
            message: '付款计划总百分比不是100%，请检查！'
          });

          return
        }

        if(allTotalPrice !== this.receivedTotalPrice){
          console.log('allTotalPrice',allTotalPrice)
          console.log('this.receivedTotalPrice',this.receivedTotalPrice)
          this.$message({
            showClose: true,
            type: 'warning',
            message: '付款计划总金额和订单总金额不一致，请检查！'
          });

          return
        }
        
        if(allPayOver){
          payment_over = true
        }
        payment_amount = common.fixFloat2(allPayOverPrice)
      }

      let tempData = this.payPlanData.sort((a, b) => {
        return a.pay_time.localeCompare(b.pay_time)
      })

      let rlt = {
        pay_plan: tempData,
        payment_amount: payment_amount,
        payment_over: payment_over
      }

      this.$emit("sendPlanResult", rlt)

      this.openPlan = false
      
      // this.$confirm('确定要提交吗?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   axios.post('/planOrder/set_som_pay_plan', {
      //     access_token: this.access_token,
      //     order_no: this.tmpOrderKey,
      //     pay_plan: tempData,
      //     payment_amount: payment_amount,
      //     payment_over: payment_over
      //   })
      //   .then(response => {
      //     let result = response.data
      //     if (result.code == 0){
      //       this.$message({
      //         showClose: true,
      //         message: '提交成功',
      //         type: 'success'
      //       })

      //       this.ifPayPlanTooltip = false
      //       this.handleRefresh()
      //     }
      //   })
      // })
    },
    // getTotalPay(){
    //   let tmpTotalPrice = 0
    //   this.allRows.forEach(item => {
    //     let itemPrice = item.sale_info.sale_price || 0
    //     let itemNum = item.buy_info.num || 0
    //     tmpTotalPrice += common.fixFloat2(parseFloat(itemPrice) * (1 + this.valueTax.value) * parseFloat(itemNum))
    //   })
    //   let result = common.fixFloat2(tmpTotalPrice * this.onSale)
    //   this.totalPay = result
    //   return result
    // },
    getOrderTotalPay(){
      return this.receivedTotalPrice
    },
    getOutPlanMoney(){
      return common.fixFloat2(this.receivedTotalPrice - this.inPayPlanMoney)
    },
  },
}
</script>

<style lang="scss">
</style>