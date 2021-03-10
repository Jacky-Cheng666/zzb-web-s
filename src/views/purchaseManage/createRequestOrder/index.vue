<template>
  <div class="app-container createRequestOrder">
    <fieldset class="field" v-show="showSearch">
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item>
          <el-input v-model="queryParams.remark" placeholder="输入请购说明" clearable size="small" style="width: 438px"/>
        </el-form-item>
        <el-form-item label="需求人" label-width="60px">
          <el-select placeholder="请选择" v-model="queryParams.pay_period" size="small" style="width: 100px">
            <el-option label="全部" value="全部"></el-option>
            <el-option label="预付" value="预付"></el-option>
            <el-option label="到付" value="到付"></el-option>
            <el-option label="月结" value="月结"></el-option>
            <el-option label="自建" value="自建"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用途" label-width="40px">
          <el-select placeholder="请选择" v-model="queryParams.type" size="small" style="width: 120px">
            <el-option label="销售" value="销售"></el-option>
            <el-option label="借用" value="借用"></el-option>
            <el-option label="租赁" value="租赁"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker :clearable="false" style="width:140px" size="small" v-model="queryParams.deliver_time" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select v-model="queryParams.finance_book_no" size="small" style="width: 102px">
            <el-option label="默认账本" value="all"></el-option>
            <el-option label="账本1" value="notVoice"></el-option>
            <el-option label="账本4" value="invoiced"></el-option>
          </el-select>
        </el-form-item>
        <br>
        <el-form-item label="项目请购" label-width="70px">
          <el-switch v-model="queryParams.fromProject"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryParams.remark" placeholder="输入项目号" clearable size="small" style="width:240px"/>
        </el-form-item>
        <el-form-item label="项目变更" label-width="70px">
          <el-switch v-model="queryParams.fromProject"></el-switch>
        </el-form-item>
        <el-form-item label="变更原因" label-width="80px">
          <el-select v-model="queryParams.pay_period" size="small" style="width: 140px">
            <el-option label="全部" value="全部"></el-option>
            <el-option label="预付" value="预付"></el-option>
            <el-option label="到付" value="到付"></el-option>
            <el-option label="月结" value="月结"></el-option>
            <el-option label="自建" value="自建"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </fieldset>

    <el-table class="mb8" :height="screen_height-370" v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column align="center" label="名称" prop="element_name" width="200" />
      <el-table-column align="center" label="型号" prop="spec_code" width="280" />
      <el-table-column align="center" label="品牌" prop="brand" width="100" />
      <el-table-column align="center" label="单位" prop="unit" width="60" />
      <el-table-column align="center" label="数量" prop="num" width="80" />
      <el-table-column align="center" label="代码" prop="element_code" width="140" />
      <el-table-column align="center" label="备注" prop="remark"/>
      <el-table-column fixed="right" align="center" label="操作" width="70">
        <template>
          <el-button @click="editElement" size="mini" type="text" icon="el-icon-edit">修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList">
      <div>  
        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        <el-button @click="batchAddClick" type="primary" icon="el-icon-plus" size="mini">批量新增</el-button>
        <el-button @click="addElement" type="primary" icon="el-icon-plus" size="mini">新增</el-button>
        <el-button @click="handleImport" type="info" icon="el-icon-upload2" size="mini">导入</el-button>
        <el-button type="success" icon="el-icon-folder-add" size="mini">暂存</el-button>
        <el-button type="success" icon="el-icon-check" size="mini">提交</el-button>
      </div>
    </pagination>

    <element-info myElementTitleName="物料信息" ref="elementInfo">
      <template slot="content-wrap">
        <el-form-item style="width:590px">
          <div>需求信息：</div>
          <el-form-item label="数量" prop="trade_num" style="margin-right:96px">
              <el-input v-model="elementInfoForm.trade_num" placeholder="输入数字" clearable size="small" style="width: 100px"/>
          </el-form-item>
          <el-form-item>
              <el-form-item label="未税价" label-width="70px">
                  <el-switch v-model="elementInfoForm.noTax"></el-switch>
              </el-form-item>
              <el-form-item label="预测价格" label-width="84px">
                  <el-input v-model="elementInfoForm.price" placeholder="输入数字" clearable size="small" style="width: 120px;"/>
              </el-form-item>
          </el-form-item>
        </el-form-item>
      </template>
    </element-info>

    <batch-add ref="batchAdd"></batch-add>

    <upload-file ref="uploadFile"></upload-file>
  </div>
</template>

<script>
import elementInfo from '../../../components/elementInfo'
import batchAdd from './components/batchAdd'
import uploadFile from '@/components/UploadFile'
import { mapGetters } from 'vuex'
export default {
  name: "createRequestOrder",
  components: {elementInfo,batchAdd,uploadFile},
  data() {
    return {
      showSearch: true,
      queryParams: {
        fromProject: true,
        pageNum: 1,
        pageSize: 20
      },
      total: 0,
      tableData: [],
      loading: false,
      elementInfoForm: {}
    }
  },
  computed: {
    ...mapGetters(['screen_height'])
  },
  methods: {
    getList(){},
    addElement(){
      this.$refs.elementInfo.openElementInfo = true;
    },
    batchAddClick(){
      this.$refs.batchAdd.openBatchAdd = true;
    },
    toggleSearch(){
      this.showSearch = !this.showSearch
    },
    handleSelectionChange(){},
    editElement(){},
    handleImport(){
      this.$refs.uploadFile.upload.open = true;
    }
  },
}
</script>

<style lang="scss">

</style>