<template>
  <div class="app-container safeStock">
    <!-- <div class="header" style="display:none">
      <div class="left">
        <span class="topCtrlTile">安全库存</span>
        <el-input style="width: 180px; margin-left: 10px" placeholder="输入任意内容搜索" suffix-icon="el-icon-search" size="mini" v-model="inputValue" @input="searchSafeStorage" />
      </div>
      <div class="right">
        <span class="downloadSty" @click="exportTemplate">
          <img style="vertical-align:middle;margin-top:-4px;margin-right:4px" src="@/assets/imgs/download.png" alt="">
          <span style="font-size: 14px;color:#333333;">下载模板</span>
        </span>

        <span class="downloadSty" @click="uploadFile">
          <img style="vertical-align:middle;margin-top:-4px;margin-right:4px" src="@/assets/imgs/import.png" alt="">
          <span style="font-size: 14px;color:#333333;">批量导入</span>
        </span>

        <input type="file" @change="OnFileChanged(this)" ref="imFile" style="display: none" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
        <el-select style="width: 136px;margin-right:10px" v-model="status" filterable size="mini" placeholder @change="isSetChange">
          <el-option key="全部" label="全部" value="全部"></el-option>
          <el-option key="未设置" label="未设置" value="未设置"></el-option>
          <el-option key="已设置" label="已设置" value="已设置"></el-option>
        </el-select>
      </div>
    </div> -->

    <el-form class="mb10" :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item>
        <el-input v-model="queryParams.inputValue" placeholder="输入关键字" clearable size="small" style="width: 180px" @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item>
        <el-select @change="isSetChange" v-model="queryParams.invoiceStatus" size="small" style="width: 100px">
          <el-option key="全部" label="全部" value="全部"></el-option>
          <el-option key="未设置" label="未设置" value="未设置"></el-option>
          <el-option key="已设置" label="已设置" value="已设置"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table class="mb8" v-loading="loading" ref="multipleTable" :data="rows" stripe :height="screen_height-340" @selection-change="changeFun" style="width: 100%" :default-sort="{prop:'element_code', order: 'ascending'}">
      <el-table-column align="center" type="selection" width="50" fixed />
      <el-table-column align="center" prop="element_code" label="物料代码" show-overflow-tooltip width="120px" sortable />
      <el-table-column align="center" prop="element_name" label="名称" show-overflow-tooltip width="360px" sortable />
      <el-table-column align="center" prop="spec_code" label="图号/规格型号" show-overflow-tooltip  sortable />
      <el-table-column align="center" prop="brand" label="材质/品牌" show-overflow-tooltip width="140px" sortable />
      <el-table-column align="center" prop="unit" label="单位" width="80px" show-overflow-tooltip />
      <el-table-column align="center" prop="min_pack_num" label="最小包装" width="80px" show-overflow-tooltip />
      <el-table-column align="center" prop="min_storage" label="库存下限" width="140px" show-overflow-tooltip>
        <template slot-scope="scope">
          <input @change="limitMinStorage($event,scope.row)" type="number" class="table_input" v-model.number="scope.row.min_storage"/>
          <i class="el-icon-edit"></i>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="max_storage" label="库存上限" width="140px" show-overflow-tooltip>
        <template slot-scope="scope">
          <input @change="limitMaxStorage($event,scope.row)" type="number" class="table_input" v-model.number="scope.row.max_storage"/>
          <i class="el-icon-edit"></i>
        </template>
      </el-table-column>
    </el-table>

    <!-- <div class="footer">
      <el-row>
        <el-col :span="18" style="margin-top: 6px;">
          <el-pagination
            style="margin-left:220px"
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

        <el-col :span="6">
          <div style="margin-top: 6px;float:right;">
            <span class="downloadSty" @click="exportTemplate">
              <img style="vertical-align:middle;margin-top:-4px;margin-right:4px" src="@/assets/imgs/download.png" alt="">
              <span style="font-size: 14px;color:#333333;">下载模板</span>
            </span>

            <span class="downloadSty" @click="uploadFile">
              <img style="vertical-align:middle;margin-top:-4px;margin-right:4px" src="@/assets/imgs/import.png" alt="">
              <span style="font-size: 14px;color:#333333;">批量导入</span>
            </span>
            <el-button style="margin-left:5px" icon="el-icon-delete" size="mini" @click="deleteSafeElements" type="danger">删除</el-button>
            <el-button icon="el-icon-check" size="mini" @click="submit" type="success">提交</el-button>
            <el-button icon="el-icon-back" size="mini" @click="goToElementsManage">退出</el-button>
          </div>
        </el-col>
      </el-row>
    </div> -->

    <pagination :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="handleCurrentChange">
      <span class="downloadSty" @click="exportTemplate">
        <img style="vertical-align:middle;margin-top:-4px;margin-right:4px" src="@/assets/imgs/download.png" alt="">
        <span style="font-size: 14px;color:#333333;">下载模板</span>
      </span>

      <span class="downloadSty" @click="uploadFile">
        <img style="vertical-align:middle;margin-top:-4px;margin-right:4px" src="@/assets/imgs/import.png" alt="">
        <span style="font-size: 14px;color:#333333;">批量导入</span>
      </span>
      <el-button style="margin-left:5px" icon="el-icon-delete" size="mini" @click="deleteSafeElements" type="danger">删除</el-button>
      <el-button icon="el-icon-check" size="mini" @click="submit" type="success">提交</el-button>
      <!-- <el-button icon="el-icon-back" size="mini" @click="goToElementsManage">退出</el-button> -->
    </pagination>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: "safeStock",
  data() {
    return {
      loading: false,
      queryParams: {
        pageNum: 1,
        pageSize: 100,
      },
      total: 120,
      inputValue: "",
      status: "全部",
      currentPage: 1,
      pageSize: 10,
      count: 100,
      rows: [{"company_no":"5bd18fb6de00d364475316b5","brand":"NSK","element_code":"0002-5002","element_name":"传动3","spec_code":"CD0002","drawing_code":"","unit":"件","workpiece_id":992,"workpiece_name":"劳保办公","min_pack_num":1,"min_storage":2,"max_storage":4},{"brand":"无","element_code":"111100272","element_name":"振动盘镶件","spec_code":"260301B","drawing_code":"260301B","unit":"件","workpiece_id":1005,"workpiece_name":"治具类（改机类）","min_pack_num":1,"version":"B","remark":null,"disable":0,"create_time":null,"min_storage":0,"max_storage":10},{"brand":"无","element_code":"111100273","element_name":"振动盘镶件","spec_code":"260301C","drawing_code":"260301C","unit":"件","workpiece_id":1005,"workpiece_name":"治具类（改机类）","min_pack_num":1,"version":"C","remark":null,"disable":0,"create_time":null,"min_storage":0,"max_storage":11},{"brand":"无","element_code":"111100274","element_name":"振动盘镶件","spec_code":"260301D","drawing_code":"260301D","unit":"件","workpiece_id":1005,"workpiece_name":"治具类（改机类）","min_pack_num":1,"version":"D","remark":null,"disable":0,"create_time":null,"min_storage":0,"max_storage":12},{"brand":"无","element_code":"111100261","element_name":"垫片","spec_code":"260302A","drawing_code":"260302A","unit":"件","workpiece_id":1005,"workpiece_name":"治具类（改机类）","min_pack_num":1,"version":"A","remark":null,"disable":0,"create_time":null,"min_storage":0,"max_storage":13},{"brand":"无","element_code":"111100262","element_name":"垫片","spec_code":"260302B","drawing_code":"260302B","unit":"件","workpiece_id":1005,"workpiece_name":"治具类（改机类）","min_pack_num":1,"version":"B","remark":null,"disable":0,"create_time":null,"min_storage":0,"max_storage":14},{"brand":"无","element_code":"111100421","element_name":"振动盘垫片","spec_code":"260401A","drawing_code":"260401A","unit":"件","workpiece_id":1005,"workpiece_name":"治具类（改机类）","min_pack_num":1,"version":"A","remark":null,"disable":0,"create_time":null,"min_storage":7000,"max_storage":7000},{"brand":"SUS304","element_code":"111100491","element_name":"吹倒吹气块","spec_code":"26040601A","drawing_code":"26040601A","unit":"件","workpiece_id":1005,"workpiece_name":"治具类（改机类）","min_pack_num":1,"version":"A","remark":null,"disable":0,"create_time":null,"min_storage":7000,"max_storage":7000},{"brand":"SUS304","element_code":"111100492","element_name":"吹倒吹气块","spec_code":"26040601B","drawing_code":"26040601B","unit":"件","workpiece_id":1005,"workpiece_name":"治具类（改机类）","min_pack_num":1,"version":"B","remark":null,"disable":0,"create_time":null,"min_storage":0,"max_storage":17},{"brand":"A6061","element_code":"111100501","element_name":"吹倒垫片0.4mm","spec_code":"26040602A","drawing_code":"26040602A","unit":"件","workpiece_id":1005,"workpiece_name":"治具类（改机类）","min_pack_num":1,"version":"A","remark":null,"disable":0,"create_time":null,"min_storage":0,"max_storage":18},{"brand":"SUS304 T=0.1mm","element_code":"111100511","element_name":"吹立垫片0.1mm","spec_code":"26040603A","drawing_code":"26040603A","unit":"件","workpiece_id":1005,"workpiece_name":"治具类（改机类）","min_pack_num":1,"version":"A","remark":null,"disable":0,"create_time":null,"min_storage":0,"max_storage":19},{"brand":"SUS304 T=0.1mm","element_code":"111100521","element_name":"引脚筛选垫片0.1mm","spec_code":"26040604A","drawing_code":"26040604A","unit":"件","workpiece_id":1005,"workpiece_name":"治具类（改机类）","min_pack_num":1,"version":"A","remark":null,"disable":0,"create_time":null,"min_storage":0,"max_storage":20},{"brand":"发生大阿发送到发","element_code":"010100200008","element_name":"发送到发af","spec_code":"发送到发","drawing_code":"","unit":"梵蒂冈","workpiece_id":1000,"workpiece_name":"编带机","min_pack_num":"12","version":"","remark":null,"disable":0,"create_time":null,"min_storage":12,"max_storage":12},{"brand":"算法的发达的","element_code":"010100100003","element_name":"阿发送到发","spec_code":"水电费B","drawing_code":"","unit":"个","workpiece_id":1000,"workpiece_name":"测试机","min_pack_num":1,"version":"B","remark":null,"disable":0,"create_time":null,"min_storage":3,"max_storage":44}]
    };
  },
  computed: {
    ...mapGetters(['screen_height'])
  },
  methods: {
    searchSafeStorage() {},
    exportTemplate(){},
    downloadTemp(){},
    uploadFile(){},
    OnFileChanged(){},
    isSetChange(){},
    changeFun(){},
    limitMinStorage(){},
    handleSizeChange(){},
    handleCurrentChange(){},
    deleteSafeElements(){},
    submit(){},
    goToElementsManage(){},
    handleQuery(){},
    resetQuery(){}
  },
};
</script>

<style lang="scss">
.safeStock {
  // .header {
  //   height: 38px;
  //   border: 1px solid #e5e5e5;
  //   background-color: #fff;
  //   margin-bottom: 10px;
  //   display: flex;
  //   justify-content: space-between;
  //   .right {
  //     line-height: 36px;
  //   }
  //   .topCtrlTile {
  //     height: 36px;
  //     display: inline-block;
  //     line-height: 38px;
  //     width: 88px;
  //     text-align: center;
  //     font-size: 12px;
  //     background: rgba(227, 227, 227, 1);
  //     border-right: 1px solid #ccc;
  //   }
    
  // }
  .table_input {
    width: 80% !important;
  }
  .footer {
    text-align: center;
    margin-top: 5px;
  }
  .downloadSty {
    margin: 0 5px;
  }
}
</style>