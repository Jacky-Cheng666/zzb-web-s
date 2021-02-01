<template>
  <div class="payPlanDialog">
    <el-dialog center title="付款计划" :visible.sync="openPlan" width="960px" append-to-body>
      <el-form class="play_content" ref="plan-form" :model="planForm" label-width="44px" :inline="true">
        <el-row v-for="(item,index) in planForm.plan_list" :key="index">
          <el-col class="plan_content" :span="24">
            <el-form-item label="付款日期" label-width="68px">
              <el-date-picker :clearable="false" style="width:140px" size="small" v-model="item.pay_time" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="金额">
              <el-input v-model="item.pay_money" placeholder="输入数字" clearable size="small" style="width: 100px"/>
            </el-form-item>
            <el-form-item label="占比">
              <el-input v-model="item.percent" placeholder="数字" size="small" style="width: 60px"/> %
            </el-form-item>
            <el-form-item>
              <el-input v-model="item.remark" placeholder="请输入说明" clearable size="small" style="width: 240px"/> %
            </el-form-item>
            <el-form-item label="已付">
              <el-switch v-model="item.payed"></el-switch>
            </el-form-item>
            <el-form-item>
              <i v-if="index===planForm.plan_list.length-1&&index!=0" style="font-size:18px;vertical-align:baseline;color:#E34348;cursor:pointer" class="el-icon-delete-solid" @click="deletePlan(index)"></i>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-row style="display:flex;align-items:center">
          <el-col :span="18" style="display:flex;justify-content:start;align-items:center">
            <span class="f14">分为</span>
            <el-select v-model="planForm.period" size="small" style="width: 70px;margin:0 10px">
              <el-option v-for="(item,index) in planForm.period_list" :key="index" :label="item" :value="item"></el-option>
            </el-select>
            <span class="f14 mr20">期</span>
            <el-button @click="addPayPlan" class="mr20" type="text">执行付款</el-button>
            <span class="f14 mr20">未作计划金额：2000000.00</span>
            <span class="f14">总金额：200000。00</span>
          </el-col>
          <el-col :span="6">
            <el-button size="mini" @click="openPlan = false">取 消</el-button>
            <el-button size="mini" type="primary" @click="submitPayPlan">提 交</el-button>
          </el-col>
        </el-row>
        
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'payPlanDialog',
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
      openPlan: false,
      planForm:{
        plan_list:this.value,
        period_list: [1,2,3,4,5,6,7,8,9,10,11,12],
        period: 1
      }
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
    submitPayPlan(){
      this.$emit("input",this.planForm.plan_list)
      this.openPlan = false;
    }
  },
}
</script>

<style lang="scss">
</style>