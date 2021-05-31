<template>
  <div class="setPriceRuleMask">
    <el-dialog title="设置价格规则" :visible.sync="dialogFormVisible">
      <el-form :model="price_form" label-position="left" ref="price_form">
        <el-form-item>
            <el-row>
                <el-col :span="12">产品名称：{{price_form.element_info.product_name}}</el-col>
                <el-col :span="12">规格型号：{{price_form.element_info.spec_code}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="12">材质/品牌：{{price_form.element_info.brand}}</el-col>
                <el-col :span="12">单位：{{price_form.element_info.unit}}</el-col>
            </el-row>
        </el-form-item>
        <el-form-item>
           <el-form-item>
               <el-checkbox v-model="price_form.pricing.auto_offer">启用智能报价</el-checkbox>
               <span style="margin-left:30px">不开启智能报价，系统把询价信息转入协同报价，待人工报价</span>
           </el-form-item>
           <el-form-item>
                   <el-col :span="5">
                       <el-form-item label="产品面价:" label-width="82px" prop="pricing.basic.base_price" :rules="{ required: true, message: '请输入产品面价', trigger: 'blur' }">
                            <el-input @change="salePriceChange" clearable size="mini" placeholder="输入数字" type="number" v-model="price_form.pricing.basic.base_price"></el-input>
                       </el-form-item>
                   </el-col>
                   <el-col :span="6" style="margin-left:20px">
                       <el-form-item label="最低成交价:" label-width="96px" prop="pricing.basic.lowest_price" :rules="{ required: true, message: '请输入最低成交价', trigger: 'blur' }">
                            <el-input @change="lowestPriceChange" clearable size="mini" placeholder="输入数字" type="number" v-model="price_form.pricing.basic.lowest_price"></el-input>
                       </el-form-item>
                   </el-col>
                   <el-col :span="5" :offset="1">
                       <el-row style="display:flex">
                           <el-form-item>
                                <el-select style="width:77px" size="mini" placeholder="选择" v-model="price_form.pricing.basic.offer_with_tax">
                                    <el-option label="未税" :value="false"></el-option>
                                    <el-option label="含税" :value="true"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-select @change="taxChange" style="width:77px;margin-left:10px" size="mini" placeholder="税率" v-model="price_form.pricing.basic.tax_value">
                                    <el-option v-for="item in tax_list" :key="item.value" :label="item.tax_name" :value="item.tax_value"></el-option>
                                </el-select>
                            </el-form-item>
                       </el-row>
                   </el-col>
                   <el-col :span="6">
                       <el-form-item label="截至日期:" label-width="90px">
                            <el-date-picker value-format="timestamp" style="width:100%" size="mini" type="date" placeholder="选择日期" v-model="price_form.pricing.basic.expire_date"></el-date-picker>
                       </el-form-item>
                   </el-col>
           </el-form-item>
           <el-form-item label="有效区间:" label-width="82px" required>
               <el-col :span="24" style="display:flex">
                    <el-form-item prop="pricing.basic.num_range[0]" :rules="{ required: true, message: '输入最小数量', trigger: 'blur' }">
                        <el-input @change="validRangeMinInput" clearable style="width:100px" size="mini" placeholder="最小数量" v-model="price_form.pricing.basic.num_range[0]"></el-input>
                    </el-form-item>
                    <span style="margin:0 14px">至</span>
                    <el-form-item prop="pricing.basic.num_range[1]" :rules="{ required: true, message: '输入最大数量', trigger: 'blur' }">
                        <el-input @change="validRangeMaxInput" clearable style="width:100px" size="mini" placeholder="最大数量" v-model="price_form.pricing.basic.num_range[1]"></el-input>
                    </el-form-item>
                    <span style="margin-left:30px">不在有效区间的询价需求，自动转入协同报价，待人工报价</span>
               </el-col>
           </el-form-item>
           <el-form-item label="标准交期:" label-width="82px" prop="pricing.basic.deliver_days" :rules="{ required: true, message: '输入标准交期', trigger: 'blur' }">
               <el-input style="width:100px" size="mini" placeholder="日历天数" v-model.number="price_form.pricing.basic.deliver_days"></el-input>
               <span clearable style="margin-left:30px">指接单日开始至发货日的日历天数（包括接单日和发货日，当天发货即为一天）</span>
           </el-form-item>
        </el-form-item>
        <el-form-item>
        
            <el-checkbox v-model="price_form.pricing.step_offer">启用数量阶梯价格</el-checkbox>
            <span style="margin-left:30px">不开启数量阶梯价格，系统使用产品面价自动报价</span>
            <el-link @click="addNewSteps" type="primary" style="float:right" :underline="false">新增阶梯</el-link>

            <el-table height="234" border :header-cell-style="{backgroundColor: '#F7F7F7', color: '#5B6B73!important',height: '32px!important'}" stripe :data="price_form.pricing.step_list" style="width: 100%">
            <el-table-column label="最小数量" width="147">
                <template slot-scope="scope">
                    <el-input @change="minInputChange($event,scope.row)" size="mini" type="number" placeholder="输入数字" v-model="scope.row.num_range[0]"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="最大数量" width="147">
                <template slot-scope="scope">
                    <el-input @change="maxInputChange($event,scope.row)" size="mini" type="number" placeholder="输入数字" v-model="scope.row.num_range[1]"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="折扣（%）" width="147">
                <template slot-scope="scope">
                    <el-input @change="handleDiscountInput($event,scope.row)" size="mini" type="number" placeholder="输入百分比" v-model="scope.row.on_sale_percent"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="未税单价" width="100">
                <template slot-scope="scope">{{price_form.pricing.basic.offer_with_tax ? price_form.pricing.basic.base_price/(1+price_form.pricing.basic.tax_value) * scope.row.on_sale: price_form.pricing.basic.base_price * scope.row.on_sale| handleFixFloat2}}</template>
            </el-table-column>
            <el-table-column label="含税单价" width="100">
                <template slot-scope="scope">{{price_form.pricing.basic.offer_with_tax ? price_form.pricing.basic.base_price * scope.row.on_sale : price_form.pricing.basic.base_price * scope.row.on_sale*(1+price_form.pricing.basic.tax_value) | handleFixFloat2}}</template>
            </el-table-column>
            <el-table-column label="标准交期" width="100">
                 <template slot-scope="scope">
                    <el-input size="mini" type="number" placeholder="输入数字" v-model.number="scope.row.deliver_days"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-link @click="deleteStep(scope.$index)" :underline="false" type="text" style="color:#E34348">删除</el-link>
                </template>
            </el-table-column>
        </el-table>
           
        </el-form-item>
        <!-- <el-form-item>
            <el-row>
                <el-checkbox v-model="form.autoSetPrice">启用客户级别阶梯价格</el-checkbox>
                <span style="margin-left:30px">不开启客户级别阶梯价格，系统使用其它规格处理报价</span>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item style="width:200px" label="客户级别:" label-width="80px">
                        <el-select size="mini" placeholder="请选择" v-model="value">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item style="width:600px">
                        <el-input style="width:80px" size="mini" placeholder="折扣" v-model="value"></el-input>
                        <span style="margin-left:30px">在面价或者数量阶梯价格的基础上，按照客户级别再打折</span>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="sureSetPrice">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import common from "@/utils/common.js"
export default {
    name:"setPriceRuleMask",
    props:{
        value: {
            default: function () {
                return {
                element_info:{
                    product_name:"",
                    spec_code: "",
                    brand: "",
                    unit: ""
                },
                pricing:{
                    auto_offer: true,
                    basic: {
                        base_price: "",
                        lowest_price: "",
                        offer_with_tax: false,
                        tax_value: 0,
                        expire_date: new Date().getTime(),
                        num_range: [],
                        deliver_days: ""
                    },
                    step_offer: true,
                    step_list: [
                        
                    ]
                }        
            }
      },
    },
    },
    data() {
        return {
            dialogFormVisible: false,
            price_form: this.value,
            tax_list: [],
            tax_name: "普票"
        }
    },
    watch: {
        price_form: {
            deep: true, //深度监听设置为 true
            handler: function (newV, oldV) {
                // console.log("watch中：", newV);
                this.$emit("input", newV);
                
            },
        }
    },
    filters:{
        handleFixFloat2(val){
            return Math.round(val * 100) / 100;
        }
    },
    methods: {
        addNewSteps(){
            this.price_form.pricing.step_list.push({num_range:[],on_sale_percent:100,on_sale:1,deliver_days:""})
        },
        deleteStep(index){
            this.price_form.pricing.step_list.splice(index,1)
        },
        getTaxList(){
            let tax_list = JSON.parse(window.localStorage.getItem("saleBasicInfo")).tax_type_define_list;
            this.tax_list = tax_list;
        },
        sureSetPrice(){
            this.$refs.price_form.validate((valid=>{
                if(valid){
                    this.$emit("submitSetPrice", this.tax_name)        
                }else{
                    console.log('error submit!!');
                    return false;
                }
            }))
            
        },
        taxChange(val){
            // console.log('val', val);
            this.tax_list.some(item=>{
                if(item.tax_value===val){
                    this.tax_name = item.tax_name;
                }
            })
        },
        salePriceChange(val){
            val = common.fixFloat2(val)
            if(val<0){
                this.price_form.pricing.basic.base_price = 0;
            }else{
                this.price_form.pricing.basic.base_price = val;
            }
        },
        lowestPriceChange(val){
            val = common.fixFloat2(val)
            if(val<0){
                this.price_form.pricing.basic.lowest_price = 0;
            }else{
                this.price_form.pricing.basic.lowest_price = val;
            }
        },
        validRangeMinInput(val){
            val = common.fixFloat3(val)
            let secondValue = this.price_form.pricing.basic.num_range[1];
            if(val<0){
                this.$set(this.price_form.pricing.basic.num_range, 0 ,0)
            }else if(val>secondValue){
                this.$set(this.price_form.pricing.basic.num_range, 0 ,secondValue)
            }
            else{
                this.$set(this.price_form.pricing.basic.num_range, 0 ,val)
            }
        },
        validRangeMaxInput(val){
            val = common.fixFloat3(val)
            let firstValue = this.price_form.pricing.basic.num_range[0];
            if(val<0){
                this.$set(this.price_form.pricing.basic.num_range, 1 ,0)
            }else if(val<firstValue){
                this.$set(this.price_form.pricing.basic.num_range, 1 ,firstValue)
            }
            else{
                this.$set(this.price_form.pricing.basic.num_range, 1 ,val)
            }
        },
        minInputChange(val,row){
            val = common.fixFloat3(val)
            let maxValue = row.num_range[1];
            if(val<0){
                this.$set(row.num_range, 0 ,0)
            }else if(val>maxValue){
                this.$set(row.num_range, 0 ,maxValue)
            }else{
                this.$set(row.num_range, 0 ,val)
            }
        },
        maxInputChange(val, row){
            val = common.fixFloat3(val)
            let minValue = row.num_range[0];
            if(val<0){
                this.$set(row.num_range, 1 ,0)
            }else if(val<minValue){
                this.$set(row.num_range, 1 ,minValue)
            }else{
                this.$set(row.num_range, 1 ,val)
            }
        },
        handleDiscountInput(val,row){
            // console.log('val', val);
             val = common.fixFloat2(val)
             if(val<=0){
                 row.on_sale_percent = 100;
             }else if(val>100){
                 row.on_sale_percent = 100;
             }else {
                 row.on_sale_percent = val;
             }
             row.on_sale = row.on_sale_percent/100
        }
    },
    created() {
        this.getTaxList();
    },
};
</script>

<style lang="scss">
.setPriceRuleMask{
    .el-dialog__body{
        padding: 0 20px
    }
    .el-dialog__header{
        text-align: center
    }
    .el-table{
        min-height: 0;
        max-height: 234px;
        overflow: auto;
    }
        
    .el-form-item .el-form-item{
        margin-bottom: 6px
    }
        
    .el-form-item__label {
        padding: 0 12px 0 0;
    }
}
    
</style>