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

          <input type="file" @change="OnFileChanged(this)" ref="imFile" style="display: none"
           accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
          <el-button icon="el-icon-upload2" size="mini" type="info" @click="uploadFile">批量导入</el-button>

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
            <el-button @click="deleteElements(scope.row)" size="mini" type="text" icon="el-icon-delete" class="text-danger">删除</el-button>    
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
search_elements, add_elements,is_elements_repeat,delete_elements, get_all_element, delete_all_element} from '@/api/enterpriseManage.js'
import { getToken,setToken,removeToken } from '@/utils/auth'
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
      multipleSelection: [],
      imFile: "", // 导入文件el
      rABS: false, // 导入文件el
      propMap: {
        spec_code: '型号',
        element_name: '名称',
        unit: '单位',
        brand: '品牌',
      }
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
      setToken('encode_code', this.encode_code)
      this.$store.commit('zzb/SET_ENCODE_CODE', this.encode_code)
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
    },
    uploadFile(){
      this.imFile = this.$refs.imFile
      this.imFile.click();
    },
    OnFileChanged() {
      let _this=this
      var files = this.imFile.files;
      var file = new FileReader();
      file.readAsArrayBuffer(files[0]);
      file.onload = function (e) {
        try {
          var fileContent = e.target.result;
          var wb =XLSX.read(_this.fixdata(fileContent), { type: 'binary' });
          var items =XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
          _this.ReadElementList(items)
          _this.$refs.imFile.value = ""
        }
        catch (error) {
          console.log(error);
          return;
        }
      }
    },
    fixdata(data) {
      var o = "";
      var l = 0;
      var w = 10240;
      for (; l < data.byteLength / w; ++l) {
        o += String.fromCharCode.apply(
          null,
          new Uint8Array(data.slice(l * w, l * w + w))
        );
      }
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
      return o;
    },
    ReadElementList(elemsRaw) {
      let match_result = null
      this.matchAllForSpecialCharater(elemsRaw, function(result){
        match_result = result
      })
      if(match_result && match_result.code === 1){
        this.$message({
          showClose: true,
          duration: 0,
          message: match_result.error_message,
          type: 'warning'
        })

        return
      }

      let elementList = [];

      let contentNameErrorList = [];
      let workpieceErrorList = [];
      let maxDisplayError = 10;

      for (let i in elemsRaw) {
        elemsRaw[i]['物料代码'] = elemsRaw[i]['物料代码'] ? elemsRaw[i]['物料代码'].trim() : elemsRaw[i]['物料代码']
        elemsRaw[i]['物料名称'] = elemsRaw[i]['物料名称'] ? elemsRaw[i]['物料名称'].trim() : elemsRaw[i]['物料名称']
        elemsRaw[i]['材质/品牌'] = elemsRaw[i]['材质/品牌'] ? elemsRaw[i]['材质/品牌'].trim() : elemsRaw[i]['材质/品牌']
        elemsRaw[i]['规格型号'] = elemsRaw[i]['规格型号'] ? elemsRaw[i]['规格型号'].trim() : elemsRaw[i]['规格型号']
        elemsRaw[i]['版本'] = elemsRaw[i]['版本'] ? elemsRaw[i]['版本'].trim() : elemsRaw[i]['版本']

        elemsRaw[i]['单位'] = elemsRaw[i]['单位'] ? elemsRaw[i]['单位'].trim() : elemsRaw[i]['单位']
        elemsRaw[i]['最小包装'] = elemsRaw[i]['最小包装'] ? elemsRaw[i]['最小包装'].trim() : elemsRaw[i]['最小包装']
        elemsRaw[i]['供应商分类'] = elemsRaw[i]['供应商分类'] ? elemsRaw[i]['供应商分类'].trim() : elemsRaw[i]['供应商分类']
        elemsRaw[i]['品类最末级'] = elemsRaw[i]['品类最末级'] ? elemsRaw[i]['品类最末级'].trim() : elemsRaw[i]['品类最末级']

        let workpiece_id, content_code, content_name
        let index = Number(i) + 2
        /*if (!elemsRaw[i]['物料代码']) {
          this.$message({
            type: 'warning',
            message: "第 " + index + " 行 物料代码 为空"
          });
          return
        }*/
        let tmpElementCode = elemsRaw[i]['物料代码']
        if(tmpElementCode && tmpElementCode.toString().trim().length > 24){
          this.$message({
            showClose: true,
            type: 'warning',
            message: "第"+ index + "行的 物料代码 过长，请检查"
          });
          return
        }

        if (!elemsRaw[i]['物料名称']) {
          this.$message({
            type: 'warning',
            showClose: true,
            duration: 0,
            message: "第 " + index + " 行 物料名称 为空。请确所有的 物料名称 都不为空！"
          });
          return
        }

        let tmpElementName = elemsRaw[i]['物料名称']
        if (tmpElementName.toString().trim().length > 32) {
          this.$message({
            showClose: true,
            type: 'warning',
            message: "第"+ index +"行的 物料名称 过长，请检查"
          });
          return
        }


        if (!elemsRaw[i]['材质/品牌']) {
          this.$message({
            type: 'warning',
            showClose: true,
            duration: 0,
            message: "第 " + index + " 行 材质/品牌 为空。请确保所有的 材质/品牌 都不为空！"
          });
          return
        }

        let tmpBrand = elemsRaw[i]['材质/品牌']
        if(tmpBrand && tmpBrand.toString().trim().length > 32){
          this.$message({
            showClose: true,
            type: 'warning',
            message: "第"+(index+1)+"行的 品牌 过长，请检查"
          });
          return
        }

        if (!elemsRaw[i]['规格型号']) {
          this.$message({
            type: 'warning',
            showClose: true,
            duration: 0,
            message: "第 " + index + " 行 规格型号 为空。请确保所有的 规格型号 都不为空！"
          });
          return
        }

        let tmpSpecCode = elemsRaw[i]['规格型号']
        let tmpVersion = elemsRaw[i]['版本']
        let tmpStr = tmpSpecCode + tmpVersion
        if(tmpSpecCode && tmpStr.trim().length > 64){
          this.$message({
            showClose: true,
            type: 'warning',
            message: "第"+ index + "行的 规格型号 过长，请检查"
          });
          return
        }
        /*if (!elemsRaw[i]['版本']) {
          this.$message({
            type: 'warning',
            message: "第 " + index + " 行 版本 为空"
          });
          return
        }*/
        if (!elemsRaw[i]['单位']) {
          this.$message({
            type: 'warning',
            showClose: true,
            duration: 0,
            message: "第 " + index + " 行 单位 为空。请确保所有的 单位 都不为空！"
          });
          return
        }

        let tmpUnit = elemsRaw[i]['单位']
        if(tmpUnit && tmpUnit.toString().trim().length > 12){
          this.$message({
            showClose: true,
            type: 'warning',
            message: "第"+(index+1)+"行的 单位 过长，请检查"
          });
          return
        }

        let tmpRemark = elemsRaw[i]['备注'] ? elemsRaw[i]['备注'] : ''
        if(tmpRemark && tmpRemark.toString().trim().length > 1024){
          this.$message({
            showClose: true,
            type: 'warning',
            message: "第"+(index+1)+"行的 备注 过长，请检查"
          });
          return
        }
        
        if (!elemsRaw[i]['最小包装']) {
          this.$message({
            type: 'warning',
            showClose: true,
            duration: 0,
            message: "第 " + index + " 行 最小包装 为空。请确保所有的 最小包装 都不为空！"
          });
          return
        }

        
        if (elemsRaw[i]['供应商分类']) {
          //console.log(JSON.stringify(this.workpiece_list))
          this.workpiece_list.forEach(item => {
            if (item.name == elemsRaw[i]['供应商分类']) {
              workpiece_id = item.id
            }
          });

          if (!workpiece_id) {
            if (maxDisplayError > workpieceErrorList.length) {
              workpieceErrorList.push({ pos: index });
            }
            else if (maxDisplayError === workpieceErrorList.length) {
              workpieceErrorList.push({ pos: "……" });
            }
          }
        }

        if (elemsRaw[i]['品类最末级']) {
          let rule_name = elemsRaw[i]['品类最末级']
          let first = this.encode_rule[0]
          let second = this.encode_rule[1]
          let third = this.encode_rule[2]

          let third_name, second_name
          content_name = ''
          content_code = ''

          if (third && 0 < third.length) {
            third.forEach(item => {
              if (item.name == rule_name) {
                content_name = rule_name
                content_code = item.code

                third_name = item.name
              }
            })
          }

          if (second && 0 < second.length) {
            second.forEach(item => {
              if (item.sub_index && 0 < item.sub_index.length) {
                item.sub_index.forEach(son => {
                  if (son == third_name) {
                    content_code = item.code + content_code

                    second_name = item.name
                  }
                })
              } else {
                if (!third_name && item.name == rule_name) {
                  content_name = rule_name
                  content_code = item.code + '000'

                  second_name = item.name
                }
              }
            })
          }

          if (first && 0 < first.length) {
            first.forEach(item => {
              if (item.sub_index && 0 < item.sub_index.length) {
                item.sub_index.forEach(son => {
                  if (son == second_name) {
                    content_code = item.code + content_code
                  }
                })
              } else {
                if (!second_name && item.name == rule_name) {
                  content_name = rule_name
                  content_code = item.code + '00000'
                }
              }
            })
          }

          if (!content_code) {
            if (maxDisplayError > contentNameErrorList.length) {
              contentNameErrorList.push({
                pos: index,
                content_name: rule_name
              });
            }
            else if (maxDisplayError === contentNameErrorList.length){
              contentNameErrorList.push({
                pos: "……",
                content_name: "……"
              });
            }
          }
        }

        var element = {
          element_code: elemsRaw[i]['物料代码'],
          element_name: elemsRaw[i]['物料名称'],
          brand: elemsRaw[i]['材质/品牌'],
          spec_code: elemsRaw[i]['规格型号'] + (elemsRaw[i]['版本'] ? elemsRaw[i]['版本'] : ''),
          version: elemsRaw[i]['版本'] ? elemsRaw[i]['版本'] : '',
          unit: elemsRaw[i]['单位'],
          min_pack_num: elemsRaw[i]['最小包装'],
          workpiece_id: workpiece_id,
          content_code: content_code,
          content_name: content_name,
          major: elemsRaw[i]['关键物料'] ? 1 : 0,
          remark: elemsRaw[i]['备注'] ? elemsRaw[i]['备注'].substring(0, 2000) : '',
        };

        elementList.push(element);
      }

      if (workpieceErrorList.length || contentNameErrorList.length) {
        let errMessage = "";
        let errIndex = 1;
        if (workpieceErrorList.length) {
          errMessage = errMessage + "<h2>" + errIndex + "：下列 供应商分类 和系统不匹配，请使用系统的</h2>";
          errMessage = errMessage + "<lo>"
          workpieceErrorList.forEach(function (item, index, array) {
            errMessage = errMessage + "<li>"
            errMessage = errMessage + "第 " + item.pos + " 行"
            errMessage = errMessage + "</li>"
          });
          errMessage = errMessage + "</lo>"

          errIndex += 1;
        }

        if (contentNameErrorList.length) {
          errMessage = errMessage + "<h2>" + errIndex + "：下列 品类 和系统不匹配，请使用最末级品类名称</h2>";
          errMessage = errMessage + "<lo>"
          contentNameErrorList.forEach(function (item, index, array) {
            errMessage = errMessage + "<li>"
            errMessage = errMessage + "第 " + item.pos + " 行的“" + item.content_name + "”"
            errMessage = errMessage + "</li>"
          });
          errMessage = errMessage + "</lo>"
        }

        this.$message({
          type: 'warning',
          showClose: true,
          duration: 0,
          message: errMessage,
          dangerouslyUseHTMLString: true
        });

        return
      }

      if(elementList.length>0){
        this.importOnhandElements(elementList)
      }else {
        this.$message({
          type: 'warning',
          message: "文件不匹配或者没有任何物料数据！"
        });
      }

    },

    checkRepeat(elementList, callback) {
      if (0 == elementList.length) {
        return;
      }

      var specCodeList = [];

      for (var i = 0; i < elementList.length; i++) {
        specCodeList.push(elementList[i].spec_code)
      }

      is_elements_repeat({
        access_token: this.token,
        spec_code_list: specCodeList
      }).then(response => {

          var repeatSpecCodeList = response.repeat_spec_code_list;
          callback(repeatSpecCodeList)
        })
    },

    importOnhandElements(elementList){
      this.$confirm('确定导入物料清单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.checkRepeat(elementList, repeatSpecCodeList => {
          if (repeatSpecCodeList) {
            add_elements({
              access_token: this.token,
              element_list: elementList
            }).then(response => {
                if (response.code == 0) {
                  if (repeatSpecCodeList.length) {
                    var tipMsg = "已加入到系统中的下列规格型号和系统中的重复，请您检查添加的物料是否异常！这些物料的规格型号为：";

                    tipMsg += '“';
                    for (var i = 0; i < repeatSpecCodeList.length; i++) {
                      if (0 != i) {
                        tipMsg += '，';
                      }
                      tipMsg += repeatSpecCodeList[i];
                    }
                    tipMsg += '”';

                    this.$alert(tipMsg, '', {
                      confirmButtonText: '确定',
                      callback: action => {
                        this.$emit('refreshData')
                      }
                    });
                  }
                  else {
                    this.$notify({
                      type: 'success',
                      title: '成功',
                      message: "批量添加物料成功"
                    });
                    this.getContentElements();
                  }
                }
              })
          }
        })
      }).catch(() => {

      });
    },
    matchSpecialCharacter(str) {
      return false
      if(str.length <= 0){
        return false
      }
      let rules = /[!#$&*\/]/im

      if (rules.test(str)) {
        return true
      } else{
        return false
      }
    },
    //全匹配检测特殊字符
    matchAllForSpecialCharater(elementList, callback) {
      if(elementList.length <= 0){
        callback({
          code: 0
        })
        return
      }
      
      let errorList = []
      let errorMessage = []
      let blankErrorList = []
      let blankErrorMessage = []

      elementList.forEach((list, index) => {
        if(list.length <= 0){
          callback({
            code: 0
          })
          return
        }
      
        for(var o in list){
          if (list.hasOwnProperty(o)) {
            if(list[o] && this.matchSpecialCharacter(list[o])){
              errorList.push({
                row: index,
                prop: o,
                val: list[o]
              })
            } 
            // else if(typeof list[o] == 'string' && list[o].indexOf(' ') >= 0) {
            //   blankErrorList.push({
            //     row: index,
            //     prop: o,
            //     val: list[o]
            //   })
            // }
          }
        }
      })
      
      blankErrorList.forEach(item => {
        blankErrorMessage.push('第' + (item.row + 1) + '行-' + item.prop + '(' + item.val + ')')
      })

      errorList.forEach(item => {
        errorMessage.push('第' +(item.row + 1) + '行-' + item.prop + '(' + item.val + ')')
      })

      if(blankErrorMessage.length > 0){
        callback({
          code: 1,
          error_message: '以下内容包含空格: ' + blankErrorMessage + '，请检查！！！'
        })
        return
      }
      
      if(errorMessage.length <= 0){
        callback({
          code: 0
        })
      } else{
        callback({
          code: 1,
          error_message: '以下内容包含特殊字符: ' + errorMessage + '，请检查！！！'
        })
      }
    },
    deleteElements(element) {
      if (!element && this.multipleSelection.length == 0) {
        this.$message({
          type: "warning",
          message: "请至少选择一项物料"
        });
        return;
      }

      let arr = [],
        list = [];
      if (element) {
        if (element.element_code) {
          arr.push(element.element_code);
        } else {
          list.push({
            element_name: element.element_name,
            brand: element.brand,
            spec_code:
              element.spec_code + (element.version ? element.version : "")
          });
        }
      } else {
        this.multipleSelection.forEach(item => {
          if (item.element_code) {
            arr.push(item.element_code);
          } else {
            list.push({
              element_name: item.element_name,
              brand: item.brand,
              spec_code: item.spec_code + (item.version ? item.version : "")
            });
          }
        });
      }

      let msg = element ? "确定删除该物料？" : "确定删除这一批物料？";
      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delete_elements({
            access_token: this.token,
            element_code_list: arr,
            element_list: list
          }).then(result => {
            if (result.code == 0) {
              this.$notify({
                type: "success",
                title: '成功',
                message: "删除成功"
              });
              this.getContentElements();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    downloadAll() {
      this.$confirm("确定导出全部物料清单？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        get_all_element({
          access_token: this.token
        }).then(result => {
            if (result.code == 0) {
              result.element_list.forEach(item => {
                if (item.version) {
                  item.spec_code = item.spec_code.slice(
                    0,
                    item.spec_code.length - item.version.length
                  );
                }

                item.content_name = item.workpiece_name;
                delete item.workpiece_name;
              });

              this.downloadTemp(result.element_list);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消导出"
          });
        });
    },
    downloadTemp(list) {
      if (list) {
        this.handExportOrder(list, "物料清单");
      } else {
        this.handExportOrder([], "物料清单模板");
      }
    },
    handExportOrder(elements, name) {
      let _this = this;
      let filterVal = [
        "element_code",
        "element_name",
        "brand",
        "spec_code",
        "version",
        "unit",
        "min_pack_num",
        "workpiece_name",
        "content_name"
      ];
      let tHeader = [
        "物料代码",
        "物料名称",
        "材质/品牌",
        "规格型号",
        "版本",
        "单位",
        "最小包装",
        "供应商分类",
        "品类最末级"
      ];

      if (!elements || 0 == elements.length) {
        filterVal = [
          "element_code",
          "element_name",
          "brand",
          "spec_code",
          "version",
          "unit",
          "min_pack_num",
          "workpiece_name",
          "content_name"
        ];
        tHeader = [
          "物料代码",
          "物料名称",
          "材质/品牌",
          "规格型号",
          "版本",
          "单位",
          "最小包装",
          "供应商分类",
          "品类最末级"
        ];
      } else {
        elements.forEach(item => {
          this.workpiece_list.forEach(node => {
            if (node.id == item.workpiece_id) {
              item.workpiece_name = node.name;
            }
          });
        });
      }

      let data = _this.formatJson(filterVal, elements);
      data.unshift(tHeader);

      this.exportOrder(data, name);
    },
    exportOrder(data, orderName) {
      let _this = this;
      var tmpdata = []; //用来保存转换好的json
      data
        .map((row, i) =>
          row.map((v, j) =>
            Object.assign(
              {},
              {
                v: v ? v : undefined,
                position: String.fromCharCode(65 + j) + (i + 1)
              }
            )
          )
        )
        .reduce((prev, next) => prev.concat(next))
        .forEach(
          (v, i) =>
            (tmpdata[v.position] = {
              v: v.v
            })
        );

      var outputPos = Object.keys(tmpdata); //设置区域,比如表格从A1到D10
      var wb = {
        SheetNames: ["sheet1"], //保存的表标题
        Sheets: {
          sheet1: Object.assign(
            {},
            tmpdata, //内容
            {
              "!ref": outputPos[0] + ":" + outputPos[outputPos.length - 1] //设置填充区域
            }
          )
        }
      };

      //        const wb = {SheetNames: ['Sheet1'],Sheets: {}, Props: {}};
      //        wb.Sheets['Sheet1'] = XLSX.utils.json_to_sheet(data); //通过json_to_sheet转成单页(Sheet)数据
      _this.saveAs(
        new Blob(
          [
            _this.s2ab(
              XLSX.write(wb, {
                bookType: "xlsx",
                bookSST: false,
                type: "binary"
              })
            )
          ],
          {
            type: ""
          }
        ),
        orderName + ".xlsx"
      );
    },
    saveAs(obj, fileName) {
      let tmpa = document.createElement("a");
      tmpa.download = fileName;
      tmpa.href = URL.createObjectURL(obj);
      tmpa.click();
      setTimeout(function() {
        URL.revokeObjectURL(obj);
      }, 100);
    },
    s2ab(s) {
      if (typeof ArrayBuffer !== "undefined") {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
        return buf;
      } else {
        var buf = new Array(s.length);
        for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xff;
        return buf;
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    deleteAllElements() {
      this.$confirm("确定要清空物料库？请谨慎操作", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delete_all_element({
            access_token: this.token
          }).then(result => {
              if (result.code == 0) {
                this.$notify({
                  type: "success",
                  title: '成功',
                  message: "清空成功"
                });
                this.getContentElements();
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
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