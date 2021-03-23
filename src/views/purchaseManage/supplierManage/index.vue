<template>
  <div class="app-container supplierManage">
    <div class="sideNav">
      <el-menu active-text-color="#303133" background-color="#FFFEFE" unique-opened :default-active="activeIndex" @select="clickSelect" @open="handleOpen">
        <el-submenu index="second">
          <template slot="title">
            <img style="margin-right: 10px" src="@/assets/imgs/trade.png" alt="" />
            <span>产品贸易</span>
          </template>
          <el-menu-item :class="{ activeColor: activeName === item.id }" v-for="item in workpiece_list1" :key="item.id" :index="'' + item.id">{{ item.name }}</el-menu-item>
        </el-submenu>
        <el-submenu index="first">
          <template slot="title">
            <img style="margin-right: 10px" src="@/assets/imgs/group.png" alt="" />
            <span>加工智造</span>
          </template>
          <el-menu-item :class="{ activeColor: activeName === item.id }" v-for="item in workpiece_list2" :key="item.id" :index="'' + item.id">{{ item.name }}</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <div class="mainContent">
        <div class="contentWrap">
            <el-input style="width: 173px" placeholder="输入供应商名称搜索" size="mini" v-model="search_info" @change="handleQuery" />
            <el-button size="mini" @click="handleQuery" style="margin-left: -5px; width: 110px" type="primary">搜索</el-button>
            <div style="float: right;">
                <span class="downloadSty" @click="exportTemplate">
                    <img style="vertical-align:middle;margin-top:-4px;margin-right:4px" src="@/assets/imgs/download.png" alt="">
                    <span style="font-size: 14px;color:#333333;">下载模板</span>
                </span>
                <input type="file" @change="OnFileChanged(this)" ref="imFile" style="display: none" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
                <el-button icon="el-icon-upload2" type="info" size="mini" @click="uploadFile">导入供应商</el-button>
                <router-link to="/purchaseManage/supplierAdd">
                    <el-button style="margin:0 10px" icon="el-icon-plus" type="primary" size="mini">添加供应商</el-button>
                </router-link>
                <router-link to="/purchaseManage/supplierCategorySet">
                    <el-button icon="el-icon-setting" type="primary" size="mini">分类管理</el-button>
                </router-link>
            </div>

            <div class="table_container">
                <el-table v-loading="loading" element-loading-text="加载中..." ref="multipleTable" :data="rows" stripe :height="500" @selection-change="changeFun" style="width: 100%">
                    <el-table-column align="center" type="selection" width="55" />
                    <el-table-column align="center" label="供应商全称" show-overflow-tooltip>
                        <template slot-scope="scope" >
                            <img style="float: left;margin-left: 10px;width: 20px;height: 20px;" src="@/assets/imgs/company_icon.png" alt="" v-show="scope.row.is_synergy">{{scope.row.name}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="供应商简称" prop="supplier_name" show-overflow-tooltip width="130"/>
                    <el-table-column align="center" label="编号" prop="code_name" show-overflow-tooltip  width="130"/>
                    <el-table-column align="center" prop="contact" label="联系人" show-overflow-tooltip  width="130"/>
                    <el-table-column align="center" prop="phone" label="联系人手机" show-overflow-tooltip width="130"/>
                    <el-table-column align="center" prop="star" label="评级" show-overflow-tooltip width="130">
                        <template slot-scope="scope" >{{scope.row.star=='A'?"A级 战略级":scope.row.star=='B'?"B级 优选级":scope.row.star=='C'?"C级 考察级":scope.row.star=='D'?"D级 淘汰级":""}}</template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="120">
                        <template slot-scope="scope" >
                        <el-button @click="toSupplierEdit(scope.row)" size="mini" type="text" icon="el-icon-edit">编辑</el-button>
                        <el-button @click="deleteMachine(scope.row.supplier_code)" size="mini" type="text" icon="el-icon-delete" class="text-danger">删除</el-button>              
                        </template>
                    </el-table-column>
                </el-table>

                <div style="text-align: center;margin-top: 5px;">
                    <el-row >
                        <el-col :span="22" style="margin-top: 6px;background: #ffffff">
                            <el-pagination prev-text="上一页" next-text	="下一页" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 30, 50, 100,200]" :page-size="pageSize" layout="prev, pager, next, sizes, total, jumper" :total="total"/>
                        </el-col>
                        <el-col :span="2" style="margin-top: 6px;">
                            <div style="float:right;">
                            <el-button type="info" icon="el-icon-download" size="mini" @click="exportSupplierList">导出供应商清单
                            </el-button>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
      
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { get_supplier_list, add_multi_suppliers, delete_supplier } from '@/api/purchaseManage'
export default {
  name: "supplierManage",
  data() {
    return {
      loading: false,
      activeIndex: "",
      workpiece_list1: [],
      workpiece_list2: [],
      search_info: "",
      rows: [],
      allRows: [],
      paginationRows: [],
      total: 0,
      currentPage: 1,
      pageSize: 50,
      type: 'second',
      activeName: 1000,
      imFile: ''
    };
  },
  created() {
      this.getSupplierList()
  },
  computed:{
      ...mapGetters(['workpiece_list','token']),
  },
  watch: {
      workpiece_list: {
          deep: true,
          immediate: true,
          handler(newV,oldV){
              this.initializeGroup();
          }
      }
  },
  methods: {
    async getSupplierList(){
        this.loading = true;
        let result = await get_supplier_list({
            access_token: this.token
        })
        if(result.code===0){
            this.loading = false;
            this.allRows = result.supplier_list;
            this.handleQuery();
        }
    },
    handleQuery(){
      let temp = [];
      this.allRows.forEach(item=>{
        if(!this.$FilterFun(this.search_info,item))return
        if(!item.workpieces.includes(this.activeName))return
        temp.push(item)
      })
      this.total = temp.length;
      this.paginationRows = temp;
      this.currentPage = 1;
      this.rows = this.paginationRows.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage);
    },
    initializeGroup() {
        this.workpiece_list1 = []
        this.workpiece_list2 = []
        if(this.type=="second"){  
            this.workpiece_list.forEach(node => {
            if (node.id <= 1000) {
                this.workpiece_list1.push(node)
                }
            })
        }else{           
            this.workpiece_list.forEach(node => {
            if (1000 < node.id) {
                this.workpiece_list2.push(node)
                }
            })
        }

        if(this.workpiece_list1.length>0 || this.workpiece_list2.length>0){
            let id1 = this.workpiece_list1[0] && this.workpiece_list1[0].id;
            let id2 = this.workpiece_list2[0] && this.workpiece_list2[0].id
            this.activeName = id1 || id2
        }else {
            this.activeName = ""
        }
        this.activeIndex = this.activeName + "";
        this.search_info = ''
    },
    
    clickSelect(index) {
        this.activeName = +index;
        this.loading = true;
        setTimeout(() => {
            this.loading = false;
            this.handleQuery();    
        }, 500);
        
    },
    handleOpen(index) {
        this.type = index;
        this.initializeGroup();
        this.handleQuery();
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
    // 文件流转BinaryString
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
    let temp_list = [];
    
    for (let i in elemsRaw) {
        elemsRaw[i]['供应商全称'] = elemsRaw[i]['供应商全称'] ? elemsRaw[i]['供应商全称'].trim() : elemsRaw[i]['供应商全称']
        elemsRaw[i]['供应商简称'] = elemsRaw[i]['供应商简称'] ? elemsRaw[i]['供应商简称'].trim() : elemsRaw[i]['供应商简称']
        elemsRaw[i]['联系人'] = elemsRaw[i]['联系人'] ? elemsRaw[i]['联系人'].trim() : elemsRaw[i]['联系人']
        elemsRaw[i]['联系人手机号'] = elemsRaw[i]['联系人手机号'] ? elemsRaw[i]['联系人手机号'].trim() : elemsRaw[i]['联系人手机号']
        elemsRaw[i]['评级'] = elemsRaw[i]['评级'] ? elemsRaw[i]['评级'].trim() : elemsRaw[i]['评级']
        elemsRaw[i]['发票类型'] = elemsRaw[i]['发票类型'] ? elemsRaw[i]['发票类型'].trim() : elemsRaw[i]['发票类型']
        elemsRaw[i]['结款周期'] = elemsRaw[i]['结款周期'] ? elemsRaw[i]['结款周期'].trim() : elemsRaw[i]['结款周期']
        elemsRaw[i]['开户银行'] = elemsRaw[i]['开户银行'] ? elemsRaw[i]['开户银行'].trim() : elemsRaw[i]['开户银行']
        elemsRaw[i]['银行账户名'] = elemsRaw[i]['银行账户名'] ? elemsRaw[i]['银行账户名'].trim() : elemsRaw[i]['银行账户名']
        elemsRaw[i]['银行账号'] = elemsRaw[i]['银行账号'] ? elemsRaw[i]['银行账号'].trim() : elemsRaw[i]['银行账号']
        
        let index = Number(i) + 2
        
        if (!elemsRaw[i]['供应商全称']) {
        this.$message({
            type: 'warning',
            showClose: true,
            duration: 0,
            message: "第 " + index + " 行 供应商全称 为空。请确所有的 供应商全称 都不为空！"
        });
        return
        }

        let tmpElementCode = elemsRaw[i]['供应商全称']
        if(tmpElementCode && tmpElementCode.toString().trim().length > 24){
        this.$message({
            showClose: true,
            type: 'warning',
            message: "第"+ index + "行的 供应商全称 过长，请检查"
        });
        return
        }

        let tmpElementName = elemsRaw[i]['供应商简称']
        if (tmpElementName.toString().trim().length > 8) {
        this.$message({
            showClose: true,
            type: 'warning',
            message: "第"+ index +"行的 供应商简称 过长，请检查"
        });
        return
        }

        if (!elemsRaw[i]['发票类型']) {
        this.$message({
            type: 'warning',
            showClose: true,
            duration: 0,
            message: "第 " + index + " 行 发票类型 为空。请确保所有的 发票类型 都不为空！"
        });
        return
        }


        if (!elemsRaw[i]['开户银行']) {
        this.$message({
            type: 'warning',
            showClose: true,
            duration: 0,
            message: "第 " + index + " 行 开户银行 为空。请确保所有的 开户银行 都不为空！"
        });
        return
        }

        if (!elemsRaw[i]['结款周期']) {
        this.$message({
            type: 'warning',
            showClose: true,
            duration: 0,
            message: "第 " + index + " 行 结款周期 为空。请确保所有的 结款周期 都不为空！"
        });
        return
        }

        if (!elemsRaw[i]['联系人']) {
        this.$message({
            type: 'warning',
            showClose: true,
            duration: 0,
            message: "第 " + index + " 行 联系人 为空。请确保所有的 联系人 都不为空！"
        });
        return
        }

        if (!elemsRaw[i]['联系人手机号']) {
        this.$message({
            type: 'warning',
            showClose: true,
            duration: 0,
            message: "第 " + index + " 行 联系人手机号 为空。请确保所有的 联系人手机号 都不为空！"
        });
        return
        }

        if (!elemsRaw[i]['评级']) {
        this.$message({
            type: 'warning',
            showClose: true,
            duration: 0,
            message: "第 " + index + " 行 评级 为空。请确保所有的 评级 都不为空！"
        });
        return
        }


        if (!elemsRaw[i]['银行账号']) {
        this.$message({
            type: 'warning',
            showClose: true,
            duration: 0,
            message: "第 " + index + " 行 银行账号 为空。请确保所有的 银行账号 都不为空！"
        });
        return
        }

        if (!elemsRaw[i]['银行账户名']) {
        this.$message({
            type: 'warning',
            showClose: true,
            duration: 0,
            message: "第 " + index + " 行 银行账户名 为空。请确保所有的 银行账户名 都不为空！"
        });
        return
        }

        elemsRaw[i]['结款周期'] = parseInt(elemsRaw[i]['结款周期'])

        var element = {
        name: elemsRaw[i]['供应商全称'],
        nick_name: elemsRaw[i]['供应商简称'],
        contact: elemsRaw[i]['联系人'],
        phone: elemsRaw[i]['联系人手机号'],
        star: elemsRaw[i]['评级'],
        tax_name: elemsRaw[i]['发票类型'],
        pay_delay: elemsRaw[i]['结款周期'],
        bank_account_list: [{
            type: '银行账户',
            bank_name: elemsRaw[i]['开户银行'],
            account_name: elemsRaw[i]['银行账户名'],
            account_id: elemsRaw[i]['银行账号']
        }]
        };

        temp_list.push(element);
    }

    if (temp_list.length > 0) {
        this.importOnhandElements(temp_list)
    } else {
        this.$message({
        type: 'warning',
        message: "文件不匹配或者没有任何数据！"
        });
    }
    },

    importOnhandElements(temp_list){
    this.$confirm('确定导入？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        add_multi_suppliers({
            access_token: this.token,
            supplier_list: temp_list
        }).then(result => {
            if (result.code == 0) {
            this.$notify({
                type: 'success',
                title: '成功',
                message: "操作成功"
            });
            this.type = 'first';
            this.initializeGroup();
            this.activeName = this.workpiece_list2[this.workpiece_list2.length-1].id;
            this.getSupplierList()
            }
        })
    }).catch(() => {

    });
    },
    deleteMachine(machine_code){
        this.$confirm('确定删除该供应商？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            delete_supplier({
                access_token:this.token,
                supplier_code:machine_code,
            })
            .then(result => {
                if (result.code == 0) {
                    this.$notify({
                        type: 'success',
                        title: '操作成功',
                        message:"删除成功"
                    });
                    this.getSupplierList();
                }
            })

        }).catch(() => {
            this.$message({
            type: 'info',
            message: '已取消删除'
            });
        });
    },
    changeFun(){},
    handleSizeChange(val) {
        this.pageSize=val
        this.rows = this.paginationRows.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage);
    },
    handleCurrentChange(val) {  //当前多少页
        this.currentPage = val;
        this.rows = this.paginationRows.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage);
    },
    exportTemplate(){
        window.location.href = process.env.VUE_APP_BASEURL + "/template/供应商导入模板.xlsx";
    },
    exportSupplierList(){
        var WorkpieceMap = {}
        this.workpiece_list.forEach(function(workpiece){
            WorkpieceMap[workpiece.id] = workpiece.name;
            })

        const tHeader = ['供应商名称', '简称', '供应商编号', '是否协同', '联系人', '联系人手机','地址', '评级', '营业类型', '工件品类', '代理品牌','账期', '发票类型']
        let data = [];
        for(var i in this.allRows){
            var supplier = this.allRows[i]
            var workpieceNames = []
            for(var i in supplier.workpieces){
            workpieceNames[i] = WorkpieceMap[supplier.workpieces[i]];
            }
            var rowItem = [
            supplier.name,
            supplier.supplier_name,
            supplier.code_name,
            supplier.is_synergy ? '是': '否',
            supplier.contact,
            supplier.phone,
            supplier.address,
            supplier.star,
            supplier.business_type==3?'产品贸易,加工制造':(supplier.business_type==0?'产品贸易':'加工制造'),
            workpieceNames.join(','),
            supplier.brands ? supplier.brands.join(','):"",
            supplier.pay_delay + '天',
            supplier.tax_name
            ]
            data.push(rowItem)
        }
        data.unshift(tHeader)

        var tmpdata = [];//用来保存转换好的json
        data.map((row, i) => row.map((v, j) => Object.assign({}, {
            v: (v ? v : undefined),
            position: (String.fromCharCode(65 + j)) + (i + 1)
        }))).reduce((prev, next) => prev.concat(next)).forEach((v, i) => tmpdata[v.position] = {
            v: v.v
        });

        var outputPos = Object.keys(tmpdata); //设置区域,比如表格从A1到D10
        var wb = {
            SheetNames: ['sheet1'], //保存的表标题
            Sheets: {
            'sheet1': Object.assign({},
                tmpdata, //内容
                {
                '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] //设置填充区域
                })
            }
        }
        this.saveAs(new Blob([this.s2ab(XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: false,
        type: 'binary'
        }))], {
            type: ""
        }), '供应商清单.xlsx');
    },
    saveAs(obj, fileName) {
        let tmpa = document.createElement("a");
        tmpa.download = fileName;
        tmpa.href = URL.createObjectURL(obj);
        tmpa.click();
        setTimeout(function () {
          URL.revokeObjectURL(obj);
        }, 100);
    },
    s2ab(s) {
        if (typeof ArrayBuffer !== 'undefined') {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        } else {
            var buf = new Array(s.length);
            for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }
    },
    toSupplierEdit(row){
        if(row.supplier_code){
            this.$router.push('/purchaseManage/supplierEdit?supplier_code='+ row.supplier_code+'&synergy='+ row.is_synergy)
        }
        
    }
  },
};
</script>

<style lang="scss">
.supplierManage {
  background-color: #f6f6f6;
  display: flex;
  .sideNav {
    width: 170px;
  }
  .mainContent {
    margin-left: 10px;
    flex: 1;
    background-color: #fff;
    padding: 10px;
    width: 100%;
    .contentWrap{
      width: 100%;
      .table_container {
        width: 100%;
        margin-top: 10px;
      }
    }
  }
  .activeColor {
    background: #e5e5e5 !important;
  }
  .el-submenu__title {
    background-color: #00a0e9 !important;
    color: #ffffff;
    width: 170px;
    &:first-child {
      border-bottom: 1px solid #fff;
    }
  }
  .el-submenu .el-menu-item {
    min-width: 170px !important;
  }
}
</style>