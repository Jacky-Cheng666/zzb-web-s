<template>
  <div class="app-container elementsManage">
    <div class="header">
      <div class="middle">
        <span class="topCtrlTile">分类</span>
        <span v-show="1==check_type" style="display:inline-block;margin-left: 16px;line-height: 36px;vertical-align: middle;">
          <el-select style="width: 180px;" v-model="workpiece_id" @change="getWorkpieceElements()" filterable size="mini" placeholder="请输入或者选择">
            <el-option v-for="item in workpiece_list" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </span>

        <span v-show="0==check_type" style="display:inline-block;margin-left: 16px;line-height: 36px;vertical-align: middle;">
          <el-select style="width: 180px;" v-model="encode_code[0]" @change="handleChangeRule(0)" filterable size="mini" placeholder="请输入或者选择">
            <el-option v-for="item in encode_rule_ui[0]" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </span>

        <span v-show="0==check_type && encode_rule_ui[1] && 0 < encode_rule_ui[1].length" style="display:inline-block;margin-left: 10px;line-height: 36px;vertical-align: middle;">
          <el-select style="width: 180px;" v-model="encode_code[1]" @change="handleChangeRule(1)" filterable size="mini" placeholder="请输入或者选择">
            <el-option v-for="item in encode_rule_ui[1]" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </span>

        <span v-show="0==check_type && encode_rule_ui[2] && 0 < encode_rule_ui[2].length" style="display:inline-block;margin-left: 10px;line-height: 36px;vertical-align: top;">
          <el-select style="width: 180px;" v-model="encode_code[2]" @change="handleChangeRule(2)" filterable size="mini" placeholder="请输入或者选择">
            <el-option v-for="item in encode_rule_ui[2]" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </span>

        <span style="float: right; margin-right: 22px;">
          <el-radio-group v-model="check_type" @change="changeCheckType()">
            <el-radio :label="0">品类</el-radio>
            <el-radio :label="1">供应商分类</el-radio>
          </el-radio-group>
        </span>

      </div>
      <div class="bottom">
        <span class="topCtrlTile">操作</span>
        <div class="operationMenu">
          <el-input style="width: 226px;margin-right:15px" placeholder="输入代码、名称、规格或品牌" suffix-icon="el-icon-search" size="mini" v-model="element_code" @change="searchElement()" />
          <el-checkbox v-model="unusable" @change="unusableClick">无效物料</el-checkbox>
          <el-checkbox v-model="major" @change="majorClick">关键物料</el-checkbox>
          
          <router-link to="/enterpriseManage/inventoryManage/addElements">
            <el-button icon="el-icon-plus" size="mini" style="background-color: #2ED0C2;border-color:#2ED0C2;" type="success">添加物料</el-button>
          </router-link>
    
          <span class="downloadSty" @click="exportTemplate">
            <!-- <svg-icon icon-class="download2" style="margin-top:-4px"></svg-icon> -->
            <img style="vertical-align:middle;margin-top:-4px;margin-right:4px" src="@/assets/imgs/download.png" alt="">
            <span style="font-size: 14px;color:#333333;">下载模板</span>
          </span>
          <!-- <importBtn
          style="margin-left:0"
          :workpiece_list="workpiece_list"
          :encode_rule="encode_rule"
          @refreshData="refreshData(true)"
          ></importBtn> -->
          <el-button icon="el-icon-upload2" size="mini" type="info" @click="downloadTemp(allRows)">批量导入</el-button>

          <el-button icon="el-icon-download" size="mini" type="info" @click="downloadAll()">全部导出</el-button>
          <el-button icon="el-icon-download" size="mini" type="info" @click="downloadTemp(allRows)">批量导出</el-button>
          <el-button icon="el-icon-delete" size="mini" type="danger" @click="deleteElements()">批量删除</el-button>
          <el-button icon="el-icon-refresh" size="mini" type="danger" @click="deleteAllElements(false)">清空所有</el-button>
        </div> 
      </div>
    </div>
    <div class="table_container">
      <el-table ref="multipleTable" :data="rows" stripe :height="screen_height-400" @selection-change="changeFun" style="width: 100%" @sort-change="changeSort">
        <el-table-column align="center" type="selection" width="60" />
        <el-table-column align="center" prop="element_code" label="物料代码" show-overflow-tooltip width="140" sortable="custom">
          <template slot-scope="scope">
            <i style="float: left;margin-left: 10px;color: gray;" class="iconfont icon-guansuo" v-show="scope.row.disable"></i>
            {{scope.row.element_code}}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="element_name" label="物料名称" show-overflow-tooltip width="180" sortable="custom" />
        <el-table-column align="center" prop="brand" label="材质/品牌" show-overflow-tooltip width="140" sortable="custom" />
        <el-table-column align="center" prop="spec_code" label="图号/规格型号" show-overflow-tooltip width="180" sortable="custom" />
        <el-table-column align="center" prop="version" label="版本" show-overflow-tooltip width="50" />
        <el-table-column align="center" prop="unit" label="单位" width="80" show-overflow-tooltip />
        <el-table-column align="center" prop="min_pack_num" label="最小包装" width="80" show-overflow-tooltip />
        <el-table-column align="center" prop="content_name" label="品类" width="120" show-overflow-tooltip sortable="custom" />
        <el-table-column align="center" prop="create_time" label="创建时间" width="120" show-overflow-tooltip />
        <el-table-column align="center" prop="major" label="关键物料" width="80" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.major?"是":"否"}}</template>
        </el-table-column>
        <el-table-column align="center" prop="remark" label="备注" show-overflow-tooltip></el-table-column>

        <el-table-column align="center" label="操作" width="160px" fixed="right">
          <template slot-scope="scope">
            <el-button @click="toElementsEdit(scope.row)" size="mini" type="text" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" class="text-danger">删除</el-button>    
          </template>
        </el-table-column>
      </el-table>
      
      <div style="text-align: center;margin-top: 5px;background:#fff;padding-bottom:18px">
        <el-row>
          <el-col :span="22" style="margin-top: 6px;">
            <el-pagination
              prev-text="上一页"
              next-text	="下一页"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 30, 50, 100,200]"
              :page-size="pageSize"
              layout="prev, pager, next, sizes, total, jumper"
              :total="count"
            ></el-pagination>
          </el-col>

          <el-col :span="2">
            <div style="margin-top: 6px;float:right;">
              <el-button icon="el-icon-lock" size="mini" @click="setSafeStorage" type="primary">设置安全库存</el-button>
            </div>
          </el-col>
        </el-row>
      </div>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'elementsManage',
  data() {
    return {
      workpiece_id: '',
      workpiece_list: [{"id":1000,"name":"机电"},{"id":999,"name":"气动"},{"id":998,"name":"传动"},{"id":997,"name":"电控"},{"id":996,"name":"导轨丝杆"},{"id":995,"name":"仪器"},{"id":994,"name":"五金耗材"},{"id":993,"name":"液压"},{"id":992,"name":"劳保办公"},{"id":991,"name":"工具"},{"id":990,"name":"无形资产"},{"id":989,"name":"服务类"},{"id":988,"name":"电子元件"},{"id":987,"name":"低压电器"},{"id":986,"name":"电缆端子"},{"id":985,"name":"弹簧类"},{"id":984,"name":"紧固件"},{"id":1001,"name":"车件"},{"id":1002,"name":"钣金"},{"id":1003,"name":"大板"},{"id":1004,"name":"中板"},{"id":1005,"name":"小板"},{"id":1006,"name":"型材/机罩"},{"id":1007,"name":"机架"},{"id":1008,"name":"陶瓷"},{"id":1009,"name":"注塑"},{"id":1010,"name":"铸造"},{"id":1011,"name":"锻造"},{"id":1012,"name":"轴类磨削"},{"id":1013,"name":"齿轮"},{"id":1014,"name":"精密板件"},{"id":1017,"name":"有料机加工"},{"id":1999,"name":"其它"}],
      check_type: 0,
      encode_code: ["01","",""],
      encode_rule_ui: [[{"name":"原材料","code":"01","sub_index":["结构件","机械标准件","振动盘","测试仪","紧固件","功能组件","LED系列","控制软件","刀具","电动工具","五金类辅助材料","工具类用品","其它类办公用品"]},{"name":"半成品","code":"02","sub_index":["功能组件","紧固件一","结构件一"]},{"name":"成品","code":"03","sub_index":["LED系列","IC 系列","说明书","控制软件","功能组件一"]},{"name":"工具","code":"04","sub_index":["刀具","手工工具","电动工具","焊接工具","工具盒","车间用具","检验工具","其它类工具"]},{"name":"设备","code":"05","sub_index":["办公设备","生产设备","检验设备","研发设备","运输设备","其它设备"]},{"name":"生产辅助材料","code":"06","sub_index":["电子类辅助材料","五金类辅助材料","化工类辅助材料","板材类辅助材料","纸张类辅助材料","其它类辅助材料"]},{"name":"办公用品","code":"07","sub_index":["纸本类用品","笔墨类用品","工具类用品","其它类办公用品"]},{"name":"其它用品","code":"08","sub_index":["劳保用品","清洁用品/粘合剂","紧固件一"]},{"code":"09","name":"开发用品"}],[{"code":"","name":"全部"},{"name":"结构件","code":"01","sub_index":["测试机","编带机","测试打标编带机","换盘机","其他机型","测试机钣金件","编带机钣金件","测试打标编带机钣金件","换盘机钣金件","其他机型钣金件","治具类（改机类）","动力类","控制器类","传感器及附件类","运动控制类","工业相机类","低压电器类","电缆端子类","其他（注塑类、玻璃类和陶瓷类）"]},{"name":"机械标准件","code":"02","sub_index":["传动件","轴承类","气动元件","弹簧类","加工件","连接件","塑料类","其他"]},{"name":"振动盘","code":"04","sub_index":["大兴振动盘","久田振动盘","产台振动盘","晶展新振动盘","其他"]},{"name":"测试仪","code":"05","sub_index":["索拉测试仪","欧泰克测试仪","赐丰测试仪","侧立思测试仪","橙光测试仪","蔚蓝测试仪","其他"]},{"name":"紧固件","code":"06","sub_index":["螺钉、螺栓","螺母、弹簧垫圈、平垫圈","销、键"]},{"name":"功能组件","code":"07","sub_index":["测试机系列","编带机系列","测试打标编带机系列","换盘机系列","其他机型系列","其它组件"]},{"name":"LED系列","code":"08","sub_index":["测试机LJ6000系列","测试机LJ6020系列","编带机LJ9000系列","测试机LJ6050系列","测试机LJ6030系列","换盘机系列","红外产品系列","其它机型系列","其他"]},{"name":"控制软件","code":"11","sub_index":["测试机系列","编带机系列","测试打标编带机系列","其他"]},{"name":"刀具","code":"12"},{"name":"电动工具","code":"14"},{"name":"五金类辅助材料","code":"27"},{"name":"工具类用品","code":"34"},{"name":"其它类办公用品","code":"35"}],[]],
      element_code: "",
      unusable: false,
      major: false,
      rows: [{"brand":"算法的发达的","element_code":"010100100003","element_name":"阿发送到发","spec_code":"水电费","drawing_code":"","unit":"个","workpiece_id":1000,"min_pack_num":1,"version":"B","remark":"","disable":0,"create_time":1607508061,"major":0,"content_name":"测试机"},{"brand":"发生大阿发送到发","element_code":"010100200008","element_name":"发送到发af","spec_code":"发送到发","drawing_code":"","unit":"梵蒂冈","workpiece_id":1000,"min_pack_num":12,"version":"","remark":"","disable":0,"create_time":1607508061,"major":0,"content_name":"编带机"},{"brand":"HIWIN","element_code":"010100100005","element_name":"互换型滑块3","spec_code":"HGH35HAZ0C3","drawing_code":"","unit":"件","workpiece_id":1000,"min_pack_num":1,"version":"","remark":"","disable":0,"create_time":1607508061,"major":0,"content_name":"测试机"},{"brand":"logitech","element_code":"010100200009","element_name":"logitech-mouse-391","spec_code":"mouse-391","drawing_code":"","unit":"PCS","workpiece_id":1000,"min_pack_num":1,"version":"","remark":"","disable":0,"create_time":1607508061,"major":0,"content_name":"编带机"},{"brand":"不锈钢","element_code":"010100100006","element_name":"基座","spec_code":"SS-20145754","drawing_code":"","unit":"pcs","workpiece_id":1000,"min_pack_num":1,"version":"","remark":"","disable":0,"create_time":1607508061,"major":0,"content_name":"测试机"},{"brand":"亚克力","element_code":"010100100007","element_name":"机罩","spec_code":"SS-2015478","drawing_code":"","unit":"pcs","workpiece_id":1000,"min_pack_num":1,"version":"","remark":"","disable":0,"create_time":1607508061,"major":0,"content_name":"测试机"},{"brand":"Space","element_code":"010100200011","element_name":"外壳","spec_code":"Test-SpaceY","drawing_code":"","unit":"个","workpiece_id":1000,"min_pack_num":1,"version":"","remark":"","disable":0,"create_time":1607508061,"major":0,"content_name":"编带机"},{"brand":"智造帮","element_code":"010402800001","element_name":"测试物料导入A","spec_code":"ZZB-201908161422A","drawing_code":"","unit":"个","workpiece_id":1000,"min_pack_num":1,"version":"","remark":"","disable":0,"create_time":1607508061,"major":0,"content_name":"产台振动盘"},{"brand":"BANK","element_code":"010100101123","element_name":"BANK-T","spec_code":"F11-B00A-002","drawing_code":"","unit":"PCS","workpiece_id":1000,"min_pack_num":10,"version":"","remark":"","disable":0,"create_time":1607508061,"major":0,"content_name":"测试机"},{"brand":"BANK","element_code":"010402800002","element_name":"BANK-L","spec_code":"F11-B00A-002","drawing_code":"","unit":"PCS","workpiece_id":1000,"min_pack_num":10,"version":"","remark":"","disable":0,"create_time":1607508061,"major":0,"content_name":"产台振动盘"},{"brand":"logitech","element_code":"010100101124","element_name":"mouse","spec_code":"F11-B00A-002","drawing_code":"","unit":"pcs","workpiece_id":1000,"min_pack_num":1,"version":"","remark":"","disable":0,"create_time":1607508061,"major":0,"content_name":"测试机"},{"brand":"logitech","element_code":"010100200012","element_name":"mouse","spec_code":"F11-B00A-003","drawing_code":"","unit":"pcs","workpiece_id":1000,"min_pack_num":1,"version":"","remark":"","disable":0,"create_time":1607508061,"major":0,"content_name":"编带机"},{"brand":"logitech","element_code":"010100101125","element_name":"mouse-1","spec_code":"F11-B00A-003","drawing_code":"","unit":"pcs","workpiece_id":1000,"min_pack_num":1,"version":"","remark":"","disable":0,"create_time":1607508061,"major":0,"content_name":"测试机"},{"brand":"logitech","element_code":"010201300002","element_name":"mouse","spec_code":"F11-B00A-004","drawing_code":"","unit":"pcs","workpiece_id":1000,"min_pack_num":1,"version":"","remark":"","disable":0,"create_time":1607508061,"major":0,"content_name":"轴承类"},{"brand":"logitech","element_code":"010201300003","element_name":"mouse","spec_code":"F11-B00A-005","drawing_code":"","unit":"pcs","workpiece_id":1000,"min_pack_num":10,"version":"","remark":"","disable":0,"create_time":1607508061,"major":0,"content_name":"轴承类"},{"brand":"logitech","element_code":"010100101126","element_name":"mouse","spec_code":"F11-BX0A-001","drawing_code":"","unit":"pcs","workpiece_id":1000,"min_pack_num":10,"version":"","remark":"","disable":0,"create_time":1607508061,"major":0,"content_name":"测试机"},{"brand":"logitech","element_code":"010402700000","element_name":"mouse","spec_code":"F11-BX0A-002","drawing_code":"","unit":"pcs","workpiece_id":1000,"min_pack_num":12,"version":"","remark":"","disable":0}],
      count: 0,
      currentPage: 1,
      pageSize: 50,
    }
  },
  computed: {
    ...mapGetters(['screen_height'])
  },
  methods: {
    getWorkpieceElements(){},
    handleChangeRule(){},
    changeCheckType(){},
    searchElement(){},
    unusableClick(){},
    majorClick(){},
    toElementsEdit(row){
      console.log('row', row);
      this.$router.push('/enterpriseManage/inventoryManage/elementsEdit/' + row.element_code)
    },
    exportTemplate(){},
    changeFun(){},
    changeSort(){},
    handleSizeChange(){},
    handleCurrentChange(){},
    setSafeStorage(){
      this.$notify({
          title: '成功',
          message: '设置安全库操作成功',
          type: 'success'
        });
    }
  },
}
</script>

<style lang="scss">
.elementsManage {
  .header {
    height: 104px;
    border: 1px solid #e5e5e5;
    background-color: #f8f8f8;
    margin-bottom: 10px;
    .topCtrlTile {
      font-size: 15px;
      color: #333333;
      font-weight: bold;
    }
    .middle {
      height: 52px;
      border-bottom: 1px solid #e5e5e5;
      line-height: 52px;
      padding-left: 22px;
    }
    .bottom {
      display: flex;
      height: 52px;
      line-height: 52px;
      padding-left: 22px;
      display: flex;
      margin-bottom: 10px;
      .operationMenu {
        font-size: 12px;
        color: #333;
        margin-left: 16px;
        flex: 1;
        .downloadSty {
          margin: 0 15px;
          cursor: pointer;
        }
      }
    }
  }
  .el-button+.el-button {
    margin-left: 15px;
  }
  .el-checkbox {
    margin-right: 15px;
  }
}
</style>