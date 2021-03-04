<template>
  <div class="app-container categoryManage">
    <header class="header">
      <div class="titleEdit">品类管理</div>
      <div>
        <span style="font-size: 13px;color:#999999;margin-top: 6px;margin-right: 20px;font-weight: bold;">提交后才能保存并生效</span>
        <el-button type="primary" size="mini" @click="submitRule()">提交</el-button>
        <el-button type="danger" size="mini" @click="clearAll()">清空</el-button>
      </div>
    </header>

    <div>
      <div style="line-height: 48px;background-color:#f5f5f5;">
        <span style="margin-left: 20px;line-height: 36px;">
          <span class="titleCaption">第一级、</span>

          <el-select  style="width: 180px;" v-model="encode_name[0]" @change="handleChangeRule(0)" filterable  size="mini" placeholder="请输入或者选择">
              <el-option
                v-for="(item,index) in encode_rule_ui[0]"
                :key="index"
                :label="item.code + '.' + item.name"
                :value="item.name">
              </el-option>
          </el-select>
          <el-button style="margin-left: 10px;" type="danger" size="mini" @click="delRule(0)">删除品类</el-button>

          <el-input size='mini' style="width: 200px;margin-left: 60px;" v-model="new_name[0]" auto-complete="off" placeholder="新名称"></el-input>
          <el-input size='mini' style="width: 80px;margin-left: 10px;" v-model="new_code[0]" maxlength="2" auto-complete="off" placeholder="新代码"></el-input>
          <el-button style="margin-left: 10px;" type="success" size="mini" @click="addRule(0)">新增品类</el-button>
        </span>
      </div>

      <el-row style="line-height: 25px;padding-left: 20px;box-sizing: border-box;font-size: 13px;background: #fff">
        <el-col v-for="(item,index) in encode_rule[0]" :key="index" :span="6">
          <span>{{item.code}}.{{item.name}}</span>
        </el-col>
      </el-row>
    </div>

    <div v-show="encode_rule_ui[0] && 0 < encode_rule_ui[0].length">
      <div style="line-height: 48px;background-color:#f5f5f5;">
        <span style="margin-left: 20px;line-height: 36px;">
          <span class="titleCaption">第二级、</span>

          <el-select  style="width: 180px;" v-model="encode_name[1]" @change="handleChangeRule(1)" filterable  size="mini" placeholder="请输入或者选择">
              <el-option
                v-for="(item,index) in encode_rule_ui[1]"
                :key="index"
                :label="item.code + '.' + item.name"
                :value="item.name">
              </el-option>
          </el-select>

          <el-button style="margin-left: 10px;" type="danger" size="mini" @click="delRule(1)">删除品类</el-button>
          <el-input size='mini' style="width: 200px;margin-left: 60px;" v-model="new_name[1]" auto-complete="off" placeholder="新名称"></el-input>
          <el-input size='mini' style="width: 80px;margin-left: 10px;" v-model="new_code[1]" maxlength="2" auto-complete="off" placeholder="新代码"></el-input>
          <el-button style="margin-left: 10px;" type="success" size="mini" @click="addRule(1)">新增品类</el-button>
        </span>
      </div>

      <el-row style="line-height: 25px;padding-left: 20px;box-sizing: border-box;font-size: 13px;background: #fff">
        <el-checkbox-group v-model="encode_rule_ui[1]" @change="changeSubIndex(1)">
          <el-col v-for="(item,index) in encode_rule[1]" :key="index" :span="6">
            <el-checkbox :label="item" >{{item.code}}.{{item.name}}</el-checkbox>
            </el-col>
        </el-checkbox-group>
      </el-row>
    </div>

    <div v-show="encode_rule_ui[1] && 0 < encode_rule_ui[1].length">
      <div style="line-height: 48px;background-color:#f5f5f5;">
        <span style="margin-left: 20px;line-height: 36px;">
          <span class="titleCaption">第三级、</span>
        
          <el-select  style="width: 180px;" v-model="encode_name[2]" filterable  size="mini" placeholder="请输入或者选择">
              <el-option
                v-for="(item,index) in encode_rule_ui[2]"
                :key="index"
                :label="item.code + '.' + item.name"
                :value="item.name">
              </el-option>
          </el-select>

          <el-button style="margin-left: 10px;" type="danger" size="mini" @click="delRule(2)">删除品类</el-button>
          <el-input size='mini' style="width: 200px;margin-left: 60px;" v-model="new_name[2]" auto-complete="off" placeholder="新名称"></el-input>
          <el-input size='mini' style="width: 80px;margin-left: 10px;" v-model="new_code[2]" maxlength="3" auto-complete="off" placeholder="新代码"></el-input>
          <el-button style="margin-left: 10px;" type="success" size="mini" @click="addRule(2)">新增品类</el-button>
        </span>
      </div>

      <el-row style="line-height: 25px;padding-left: 20px;box-sizing: border-box;font-size: 13px;background: #fff">
        <el-checkbox-group v-model="encode_rule_ui[2]" @change="changeSubIndex(2)">
          <el-col v-for="(item,index) in encode_rule[2]" :key="index" :span="6">
            <el-checkbox :label="item" >{{item.code}}.{{item.name}}</el-checkbox>
            </el-col>
        </el-checkbox-group>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'categoryManage',
  data() {
    return {
      encode_rule: [[{"name":"原材料","code":"01","sub_index":["结构件","机械标准件","振动盘","测试仪","紧固件","功能组件","LED系列","控制软件","刀具","电动工具","五金类辅助材料","工具类用品","其它类办公用品"]},{"name":"半成品","code":"02","sub_index":["功能组件","紧固件一","结构件一"]},{"name":"成品","code":"03","sub_index":["LED系列","IC 系列","说明书","控制软件","功能组件一"]},{"name":"工具","code":"04","sub_index":["刀具","手工工具","电动工具","焊接工具","工具盒","车间用具","检验工具","其它类工具"]},{"name":"设备","code":"05","sub_index":["办公设备","生产设备","检验设备","研发设备","运输设备","其它设备"]},{"name":"生产辅助材料","code":"06","sub_index":["电子类辅助材料","五金类辅助材料","化工类辅助材料","板材类辅助材料","纸张类辅助材料","其它类辅助材料"]},{"name":"办公用品","code":"07","sub_index":["纸本类用品","笔墨类用品","工具类用品","其它类办公用品"]},{"name":"其它用品","code":"08","sub_index":["劳保用品","清洁用品/粘合剂","紧固件一"]},{"code":"09","name":"开发用品"}],[{"name":"结构件","code":"01","sub_index":["测试机","编带机","测试打标编带机","换盘机","其他机型","测试机钣金件","编带机钣金件","测试打标编带机钣金件","换盘机钣金件","其他机型钣金件","治具类（改机类）","动力类","控制器类","传感器及附件类","运动控制类","工业相机类","低压电器类","电缆端子类","其他（注塑类、玻璃类和陶瓷类）"]},{"name":"机械标准件","code":"02","sub_index":["传动件","轴承类","气动元件","弹簧类","加工件","连接件","塑料类","其他"]},{"name":"电器标准件","code":"03","sub_index":["动力类","控制器类","传感器及附件类","运动控制类","工业相机类","低压电器类","电缆端子类","其他"]},{"name":"振动盘","code":"04","sub_index":["大兴振动盘","久田振动盘","产台振动盘","晶展新振动盘","其他"]},{"name":"测试仪","code":"05","sub_index":["索拉测试仪","欧泰克测试仪","赐丰测试仪","侧立思测试仪","橙光测试仪","蔚蓝测试仪","其他"]},{"name":"紧固件","code":"06","sub_index":["螺钉、螺栓","螺母、弹簧垫圈、平垫圈","销、键"]},{"name":"功能组件","code":"07","sub_index":["测试机系列","编带机系列","测试打标编带机系列","换盘机系列","其他机型系列","其它组件"]},{"name":"LED系列","code":"08","sub_index":["测试机LJ6000系列","测试机LJ6020系列","编带机LJ9000系列","测试机LJ6050系列","测试机LJ6030系列","换盘机系列","红外产品系列","其它机型系列","其他"]},{"name":"IC 系列","code":"09","sub_index":["测试打标编带机LJ8000 系列","测试分选机LJ8024 系列","其他"]},{"name":"说明书","code":"10","sub_index":["测试机系列说明书","编带机系列说明书","测试打标编带机系列说明书","其他"]},{"name":"控制软件","code":"11","sub_index":["测试机系列","编带机系列","测试打标编带机系列","其他"]},{"name":"刀具","code":"12"},{"name":"手工工具","code":"13"},{"name":"电动工具","code":"14"},{"name":"焊接工具","code":"15"},{"name":"工具盒","code":"16"},{"name":"车间用具","code":"17"},{"name":"检验工具","code":"18"},{"name":"其它类工具","code":"19"},{"name":"办公设备","code":"20"},{"name":"生产设备","code":"21"},{"name":"检验设备","code":"22"},{"name":"研发设备","code":"23"},{"name":"运输设备","code":"24"},{"name":"其它设备","code":"25"},{"name":"电子类辅助材料","code":"26"},{"name":"五金类辅助材料","code":"27"},{"name":"化工类辅助材料","code":"28"},{"name":"板材类辅助材料","code":"29"},{"name":"纸张类辅助材料","code":"30"},{"name":"其它类辅助材料","code":"31"},{"name":"纸本类用品","code":"32"},{"name":"笔墨类用品","code":"33"},{"name":"工具类用品","code":"34"},{"name":"其它类办公用品","code":"35"},{"name":"劳保用品","code":"36"},{"name":"清洁用品/粘合剂","code":"37"}],[{"name":"测试机","code":"001"},{"name":"编带机","code":"002"},{"name":"测试打标编带机","code":"003"},{"name":"换盘机","code":"004"},{"name":"其他机型","code":"005"},{"name":"测试机钣金件","code":"006"},{"name":"编带机钣金件","code":"007"},{"name":"测试打标编带机钣金件","code":"008"},{"name":"换盘机钣金件","code":"009"},{"name":"其他机型钣金件","code":"010"},{"name":"治具类（改机类）","code":"011"},{"name":"传动件","code":"012"},{"name":"轴承类","code":"013"},{"name":"气动元件","code":"014"},{"name":"弹簧类","code":"015"},{"name":"加工件","code":"016"},{"name":"连接件","code":"017"},{"name":"塑料类","code":"018"},{"name":"动力类","code":"019"},{"name":"控制器类","code":"020"},{"name":"传感器及附件类","code":"021"},{"name":"运动控制类","code":"022"},{"name":"工业相机类","code":"023"},{"name":"低压电器类","code":"024"},{"name":"电缆端子类","code":"025"},{"name":"大兴振动盘","code":"026"},{"name":"久田振动盘","code":"027"},{"name":"产台振动盘","code":"028"},{"name":"晶展新振动盘","code":"029"},{"name":"索拉测试仪","code":"030"},{"name":"欧泰克测试仪","code":"031"},{"name":"赐丰测试仪","code":"032"},{"name":"侧立思测试仪","code":"033"},{"name":"橙光测试仪","code":"034"},{"name":"蔚蓝测试仪","code":"035"},{"name":"螺钉、螺栓","code":"036"},{"name":"螺母、弹簧垫圈、平垫圈","code":"037"},{"name":"销、键","code":"038"},{"name":"测试机系列","code":"039"},{"name":"编带机系列","code":"040"},{"name":"测试打标编带机系列","code":"041"},{"name":"换盘机系列","code":"042"},{"name":"其他机型系列","code":"043"},{"name":"其它组件","code":"044"},{"name":"测试机LJ6000系列","code":"045"},{"name":"测试机LJ6020系列","code":"046"},{"name":"编带机LJ9000系列","code":"047"},{"name":"测试机LJ6050系列","code":"048"},{"name":"测试机LJ6030系列","code":"049"},{"name":"红外产品系列","code":"050"},{"name":"其它机型系列","code":"051"},{"name":"测试打标编带机LJ8000 系列","code":"052"},{"name":"测试分选机LJ8024 系列","code":"053"},{"name":"测试机系列说明书","code":"054"},{"name":"编带机系列说明书","code":"055"},{"name":"测试打标编带机系列说明书","code":"056"},{"name":"其他（注塑类、玻璃类和陶瓷类）","code":"057"}]],
      encode_rule_ui: [[{"name":"原材料","code":"01","sub_index":["结构件","机械标准件","振动盘","测试仪","紧固件","功能组件","LED系列","控制软件","刀具","电动工具","五金类辅助材料","工具类用品","其它类办公用品"]},{"name":"半成品","code":"02","sub_index":["功能组件","紧固件一","结构件一"]},{"name":"成品","code":"03","sub_index":["LED系列","IC 系列","说明书","控制软件","功能组件一"]},{"name":"工具","code":"04","sub_index":["刀具","手工工具","电动工具","焊接工具","工具盒","车间用具","检验工具","其它类工具"]},{"name":"设备","code":"05","sub_index":["办公设备","生产设备","检验设备","研发设备","运输设备","其它设备"]},{"name":"生产辅助材料","code":"06","sub_index":["电子类辅助材料","五金类辅助材料","化工类辅助材料","板材类辅助材料","纸张类辅助材料","其它类辅助材料"]},{"name":"办公用品","code":"07","sub_index":["纸本类用品","笔墨类用品","工具类用品","其它类办公用品"]},{"name":"其它用品","code":"08","sub_index":["劳保用品","清洁用品/粘合剂","紧固件一"]},{"code":"09","name":"开发用品"}],[{"name":"结构件","code":"01","sub_index":["测试机","编带机","测试打标编带机","换盘机","其他机型","测试机钣金件","编带机钣金件","测试打标编带机钣金件","换盘机钣金件","其他机型钣金件","治具类（改机类）","动力类","控制器类","传感器及附件类","运动控制类","工业相机类","低压电器类","电缆端子类","其他（注塑类、玻璃类和陶瓷类）"]},{"name":"机械标准件","code":"02","sub_index":["传动件","轴承类","气动元件","弹簧类","加工件","连接件","塑料类","其他"]},{"name":"振动盘","code":"04","sub_index":["大兴振动盘","久田振动盘","产台振动盘","晶展新振动盘","其他"]},{"name":"测试仪","code":"05","sub_index":["索拉测试仪","欧泰克测试仪","赐丰测试仪","侧立思测试仪","橙光测试仪","蔚蓝测试仪","其他"]},{"name":"紧固件","code":"06","sub_index":["螺钉、螺栓","螺母、弹簧垫圈、平垫圈","销、键"]},{"name":"功能组件","code":"07","sub_index":["测试机系列","编带机系列","测试打标编带机系列","换盘机系列","其他机型系列","其它组件"]},{"name":"LED系列","code":"08","sub_index":["测试机LJ6000系列","测试机LJ6020系列","编带机LJ9000系列","测试机LJ6050系列","测试机LJ6030系列","换盘机系列","红外产品系列","其它机型系列","其他"]},{"name":"控制软件","code":"11","sub_index":["测试机系列","编带机系列","测试打标编带机系列","其他"]},{"name":"刀具","code":"12"},{"name":"电动工具","code":"14"},{"name":"五金类辅助材料","code":"27"},{"name":"工具类用品","code":"34"},{"name":"其它类办公用品","code":"35"}],[{"name":"测试机","code":"001"},{"name":"编带机","code":"002"},{"name":"测试打标编带机","code":"003"},{"name":"换盘机","code":"004"},{"name":"其他机型","code":"005"},{"name":"测试机钣金件","code":"006"},{"name":"编带机钣金件","code":"007"},{"name":"测试打标编带机钣金件","code":"008"},{"name":"换盘机钣金件","code":"009"},{"name":"其他机型钣金件","code":"010"},{"name":"治具类（改机类）","code":"011"},{"name":"动力类","code":"019"},{"name":"控制器类","code":"020"},{"name":"传感器及附件类","code":"021"},{"name":"运动控制类","code":"022"},{"name":"工业相机类","code":"023"},{"name":"低压电器类","code":"024"},{"name":"电缆端子类","code":"025"},{"name":"其他（注塑类、玻璃类和陶瓷类）","code":"057"}]],
      encode_name: ["原材料","结构件","测试机"],
      new_name: ['', '', ''],
      new_code: ['', '', ''],
    }
  },
  methods: {
    clearAll(){},
    submitRule(){}
  },
}
</script>

<style lang="scss">
.categoryManage {
  background-color: #f6f6f6;
  .header {
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .titleEdit {
      color: #333333;
      font-size: 16px;
      font-weight: bold;
      margin-top: 20px;
      margin-bottom: 30px;
      border-left: 4px solid #00a0e9;
      padding-left: 24px;
    }
  }
}
</style>