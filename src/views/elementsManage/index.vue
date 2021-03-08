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
import { get_supplier_list } from '@/api/enterpriseManage.js'
export default {
  name: 'elementsManage',
  data() {
    return {
      workpiece_id: '',
      workpiece_list: [],
      check_type: 0,
      encode_code: [],
      encode_rule_ui: [],
      element_code: "",
      unusable: false,
      major: false,
      rows: [],
      count: 0,
      currentPage: 1,
      pageSize: 50,
      supplier_list: []
    }
  },
  created() {
    this.getSupplier();
  },
  computed: {
    ...mapGetters(['screen_height','token'])
  },
  methods: {
    async getSupplier(){
      let result = await get_supplier_list({
        access_token: this.token
      })
      console.log('result',result);
      if(result.code===0){
        this.supplier_list = result.supplier_list;
      }
    },
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
      this.$router.push('/enterpriseManage/inventoryManage/setSafeStock')
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