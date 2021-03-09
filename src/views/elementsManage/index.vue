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

        <span v-show="0==check_type && encode_rule_ui[2] && 0 < encode_rule_ui[2].length" style="display:inline-block;margin-left: 10px;line-height: 36px;vertical-align: middle;">
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
      <el-table v-loading="loading" element-loading-text="加载中..." ref="multipleTable" :data="rows" stripe :height="screen_height-400" @selection-change="changeFun" style="width: 100%" @sort-change="changeSort">
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
import dtime from "time-formater";
import { mapGetters } from 'vuex'
import { get_supplier_list, get_encode_rule, get_content_elements, get_element_list, get_all_workpiece_list, 
search_elements } from '@/api/enterpriseManage.js'
export default {
  name: 'elementsManage',
  data() {
    return {
      workpiece_id: '',
      workpiece_list: [],
      check_type: 0,
      encode_rule: [],
      encode_code: [],
      encode_rule_ui: [],
      encode_rule_list: [],
      element_code: "",
      unusable: false,
      major: false,
      rows: [],
      count: 0,
      currentPage: 1,
      pageSize: 50,
      supplier_list: [],
      loading: false,
      multipleSelection: []
    }
  },
  created() {
    this.getSupplier();
    if (0 == this.check_type) {
      this.getEncodeRule(true);
      this.getWorkpieces(false);
    } else {
      this.getEncodeRule(false);
      this.getWorkpieces(true);
    }
  },
  computed: {
    ...mapGetters(['screen_height','token'])
  },
  methods: {
    async getSupplier(){
      let result = await get_supplier_list({
        access_token: this.token
      })
      // console.log('result',result);
      if(result.code===0){
        this.supplier_list = result.supplier_list;
      }
    },
    async getEncodeRule(refresh){
      let result = await get_encode_rule({
        access_token: this.token
      })
      if(result.code===0){
        this.encode_rule = result.encode_rule;
        this.transRuleData();

        if (refresh) {
              this.handleChangeRule(0);
            }
      }else{
        this.encode_rule = [];
            this.encode_code = [];
      }
    },
    transRuleData() {
      if (!this.encode_rule || this.encode_rule.length <= 0) {
        return;
      }

      let list0 = [],
        list1 = [];
      let first = this.encode_rule[0];
      let second = this.encode_rule[1];
      let third = this.encode_rule[2];

      if (second) {
        second.forEach(item_1 => {
          let newNode = {
            code: item_1.code,
            name: item_1.name
          };

          if (
            item_1.sub_index &&
            item_1.sub_index.length > 0 &&
            third &&
            third.length > 0
          ) {
            newNode.sub_list = [];

            item_1.sub_index.forEach(item_2 => {
              third.forEach(son => {
                if (son.name == item_2) {
                  newNode.sub_list.push({
                    code: son.code,
                    name: son.name,
                    sub_list: son.sub_list
                  });
                }
              });
            });
          }

          list1.push(newNode);
        });
      }

      if (first) {
        first.forEach(item_1 => {
          let newNode = {
            code: item_1.code,
            name: item_1.name
          };

          if (
            item_1.sub_index &&
            item_1.sub_index.length > 0 &&
            list1 &&
            list1.length > 0
          ) {
            newNode.sub_list = [];

            item_1.sub_index.forEach(item_2 => {
              list1.forEach(son => {
                if (son.name == item_2) {
                  newNode.sub_list.push({
                    code: son.code,
                    name: son.name,
                    sub_list: son.sub_list
                  });
                }
              });
            });
          }

          list0.push(newNode);
        });
      }

      this.encode_rule_list = list0;
    },
    async getWorkpieces(refresh){
      let result = await get_all_workpiece_list({
        access_token: this.token
      })
      if (result.code == 0) {
        this.workpiece_list = result.workpiece_list;
        if (this.workpiece_list.length > 0) {
          this.workpiece_id = this.workpiece_list[0].id;
          if (refresh) {
            this.getWorkpieceElements();
          }
        }
      }

    },
    async getWorkpieceElements() {
      this.unusable = false;
      this.loading = true;
      let result = await get_element_list({
        access_token: this.token,
        workpiece_id: this.workpiece_id
      })
      if (result.code == 0) {
        this.loading = false;
        this.elementList = [];
        this.allRows = result.element_list ? result.element_list : [];
        this.allRows.forEach(item => {
          if (item.version) {
            item.spec_code = item.spec_code.slice(
              0,
              item.spec_code.length - item.version.length
            );
          }

          item.content_name = item.workpiece_name;
          delete item.workpiece_name;

          this.elementList.push(item);
        });
        this.currentPage = 1;
        this.handleClick();
      }
    },
    handleChangeRule(level) {
      if (!this.encode_rule || this.encode_rule.length <= 0) {
        return;
      }
      //console.log(JSON.stringify(this.encode_rule))

      let second = this.encode_rule[1];
      let third = this.encode_rule[2];

      if (level <= 0 && this.encode_code.length <= 0) {
        this.encode_code = [];
        this.encode_rule_ui = [];
        this.encode_rule_ui[0] = this.encode_rule[0];
        this.encode_code[0] = this.encode_rule_ui[0][0].code;
      }
      //console.log(JSON.stringify(this.encode_rule_ui))
      if (
        level <= 0 &&
        this.encode_rule_ui[0] &&
        0 < this.encode_rule_ui[0].length
      ) {
        this.encode_rule_ui[1] = [];

        this.encode_rule_ui[0].forEach(item => {
          if (item.code == this.encode_code[0]) {
            if (item.sub_index && 0 < item.sub_index.length && second) {
              item.sub_index.forEach(son => {
                second.forEach(node => {
                  if (node.name == son) {
                    this.encode_rule_ui[1].push(node);
                  }
                });
              });
            }
          }
        });

        if (0 < this.encode_rule_ui[1].length) {
          this.encode_rule_ui[1].unshift({ code: "", name: "全部" });
        }

        this.encode_code[1] = "";
      }

      if (
        level <= 1 &&
        this.encode_rule_ui[1] &&
        0 < this.encode_rule_ui[1].length
      ) {
        this.encode_rule_ui[2] = [];

        this.encode_rule_ui[1].forEach(item => {
          if (item.code == this.encode_code[1]) {
            if (item.sub_index && 0 < item.sub_index.length && third) {
              item.sub_index.forEach(son => {
                third.forEach(node => {
                  if (node.name == son) {
                    this.encode_rule_ui[2].push(node);
                  }
                });
              });
            }
          }
        });

        if (0 < this.encode_rule_ui[2].length) {
          this.encode_rule_ui[2].unshift({ code: "", name: "全部" });
        }

        this.encode_code[2] = "";
      }
      //console.log(JSON.stringify(this.encode_code))

      let name_list = [];
      this.encode_code.forEach((code, index) => {
        if (
          this.encode_rule_ui[index] &&
          0 < this.encode_rule_ui[index].length
        ) {
          if (!code) {
            this.encode_rule_ui[index].forEach(item => {
              if (item.code && !item.sub_index) {
                name_list.push(item.name);
              }

              if (item.sub_index) {
                item.sub_index.forEach(son => {
                  name_list.push(son);
                });
              }
            });
          } else {
            this.encode_rule_ui[index].forEach(item => {
              if (item.code == code && !item.sub_index) {
                name_list.push(item.name);
              }
            });
          }
        }
      });

      this.content_name_list = name_list;
      this.getContentElements();
    },
    async getContentElements() {
      this.unusable = false;
      this.loading = true;
      let result = await get_content_elements({
        access_token: this.token,
        content_name_list: this.content_name_list
      })
      if(result.code===0){
        this.loading = false;
        this.elementList = [];
        this.allRows = result.element_list ? result.element_list : [];
        this.allRows.forEach(item => {
          if (item.version) {
            item.spec_code = item.spec_code.slice(
              0,
              item.spec_code.length - item.version.length
            );
          }

          item.content_name = item.workpiece_name;
          if (item.create_time) {
            item.create_time = dtime(item.create_time * 1000).format(
              "YYYY-MM-DD"
            );
          }

          delete item.workpiece_name;

          this.elementList.push(item);
        });
        this.currentPage = 1;
        this.handleClick();
      }
    },
    handleClick() {
      this.count = this.allRows.length;
      this.rows = this.allRows.slice(
        this.pageSize * (this.currentPage - 1),
        this.pageSize * this.currentPage
      );
    },
    changeCheckType(){
      if (1 == this.check_type) {
        this.getWorkpieceElements();
      } else {
        this.getContentElements();
      }
    },
    async searchElement() {
      this.loading = true;
      let result = await search_elements({
        access_token: this.token,
        element_code: this.element_code,
        unusable: this.unusable,
        major: this.major
      })
      if(result.code===0){
        this.loading = false;
        this.elementList = [];
        this.allRows = result.element_list ? result.element_list : [];
        this.allRows.forEach(item => {
          if (item.version) {
            item.spec_code = item.spec_code.slice(
              0,
              item.spec_code.length - item.version.length
            );
          }

          item.content_name = item.workpiece_name;
          if (item.create_time) {
            item.create_time = dtime(item.create_time * 1000).format(
              "YYYY-MM-DD"
            );
          }
          delete item.workpiece_name;

          this.elementList.push(item);
        });
        this.currentPage = 1;
        this.handleClick();
      }

      // axios
      //   .post(process.env.API_HOST + "company/search_elements", {
      //     access_token: this.access_token,
      //     element_code: this.element_code,
      //     unusable: this.unusable,
      //     major: this.major
      //   })
      //   .then(response => {
      //     let result = response.data;
      //     if (result.code == 0) {
      //       this.elementList = [];
      //       this.allRows = result.element_list ? result.element_list : [];
      //       this.allRows.forEach(item => {
      //         if (item.version) {
      //           item.spec_code = item.spec_code.slice(
      //             0,
      //             item.spec_code.length - item.version.length
      //           );
      //         }

      //         item.content_name = item.workpiece_name;
      //         if (item.create_time) {
      //           item.create_time = dtime(item.create_time * 1000).format(
      //             "YYYY-MM-DD"
      //           );
      //         }
      //         delete item.workpiece_name;

      //         this.elementList.push(item);
      //       });
      //       this.currentPage = 1;
      //       this.handleClick();
      //     }
      //   });
    },
    unusableClick(){
      this.major = false;
      if (!this.unusable) {
        if (1 == this.check_type) {
          this.getWorkpieceElements();
        } else {
          this.getContentElements();
        }
      } else {
        this.searchElement();
      }
    },
    majorClick(){
      this.unusable = false;
      if (!this.major) {
        if (1 == this.check_type) {
          this.getWorkpieceElements();
        } else {
          this.getContentElements();
        }
      } else {
        this.searchElement();
      }
    },
    toElementsEdit(row){
      console.log('row', row);
      this.$router.push('/enterpriseManage/inventoryManage/elementsEdit/' + row.element_code)
    },
    exportTemplate(){
      window.location.href = process.env.VUE_APP_BASEURL + "/template/物料清单模板.xlsx";
    },
    changeFun(val){
      this.multipleSelection = val;
    },
    changeSort(sortEvent) {
      if (0 === this.allRows.length) {
        return;
      }

      var localeCompare = this.localeCompare;

      if ("ascending" === sortEvent.order) {
        if ("element_code" === sortEvent.prop) {
          this.allRows.sort(function(itemA, itemB) {
            let ret = localeCompare(itemA.element_code, itemB.element_code);
            if (2 == ret) {
              ret = itemA.element_code.localeCompare(itemB.element_code);
            }
            return ret;
          });
        }

        if ("element_name" === sortEvent.prop) {
          this.allRows.sort(function(itemA, itemB) {
            let ret = localeCompare(itemA.element_name, itemB.element_name);
            if (2 == ret) {
              ret = itemA.element_name.localeCompare(itemB.element_name);
            }
            return ret;
          });
        }

        if ("brand" === sortEvent.prop) {
          this.allRows.sort(function(itemA, itemB) {
            let ret = localeCompare(itemA.brand, itemB.brand);
            if (2 == ret) {
              ret = itemA.brand.localeCompare(itemB.brand);
            }
            return ret;
          });
        }

        if ("spec_code" === sortEvent.prop) {
          this.allRows.sort(function(itemA, itemB) {
            let ret = localeCompare(itemA.spec_code, itemB.spec_code);
            if (2 == ret) {
              ret = itemA.spec_code.localeCompare(itemB.spec_code);
            }
            return ret;
          });
        }

        if ("content_name" === sortEvent.prop) {
          this.allRows.sort(function(itemA, itemB) {
            let ret = localeCompare(itemA.content_name, itemB.content_name);
            if (2 == ret) {
              ret = itemA.content_name.localeCompare(itemB.content_name);
            }
            return ret;
          });
        }
      } else if ("descending" === sortEvent.order) {
        if ("element_code" === sortEvent.prop) {
          this.allRows.sort(function(itemA, itemB) {
            let ret = localeCompare(itemB.element_code, itemA.element_code);
            if (2 == ret) {
              ret = itemB.element_code.localeCompare(itemA.element_code);
            }
            return ret;
          });
        }

        if ("element_name" === sortEvent.prop) {
          this.allRows.sort(function(itemA, itemB) {
            let ret = localeCompare(itemB.element_name, itemA.element_name);
            if (2 == ret) {
              ret = itemB.element_name.localeCompare(itemA.element_name);
            }
            return ret;
          });
        }

        if ("brand" === sortEvent.prop) {
          this.allRows.sort(function(itemA, itemB) {
            let ret = localeCompare(itemB.brand, itemA.brand);
            if (2 == ret) {
              ret = itemB.brand.localeCompare(itemA.brand);
            }
            return ret;
          });
        }

        if ("spec_code" === sortEvent.prop) {
          this.allRows.sort(function(itemA, itemB) {
            let ret = localeCompare(itemB.spec_code, itemA.spec_code);
            if (2 == ret) {
              ret = itemB.spec_code.localeCompare(itemA.spec_code);
            }
            return ret;
          });
        }

        if ("content_name" === sortEvent.prop) {
          this.allRows.sort(function(itemA, itemB) {
            let ret = localeCompare(itemB.content_name, itemA.content_name);
            if (2 == ret) {
              ret = itemB.content_name.localeCompare(itemA.content_name);
            }
            return ret;
          });
        }
      } else {
        this.allRows = [];
        for (var i = 0; i < this.elementList.length; i++) {
          this.allRows.push(this.elementList[i]);
        }
      }

      this.currentPage = 1;
      this.handleClick();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.rows = this.allRows.slice(
        this.pageSize * (this.currentPage - 1),
        this.pageSize * this.currentPage
      );
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.rows = this.allRows.slice(
        this.pageSize * (this.currentPage - 1),
        this.pageSize * this.currentPage
      );
    },
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