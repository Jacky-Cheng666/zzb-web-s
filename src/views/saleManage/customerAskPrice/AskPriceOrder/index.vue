<template>
  <div class="app-container AskPriceOrder">
      <fieldset class="field">
          <div class="order_basic_info">
              <div class="title mb12">深圳市智造帮科技有限公司-询价单</div>
              <div class="mb12 f14">
                  <span class="mr20">订单类型：销售</span>
                  <span class="mr20">结款方式：预付</span>
                  <span class="mr20">发票税率：普票</span>
                  <span>账本：默认账本</span>
              </div>
              <div class="mb12 f14">
                  <span class="mr20">客户名称：深圳市阿里云科技有限公司</span>
              </div>
              <div class="mb12 f14">
                 <span class="mr20">询价单号：EO210129113843</span>
                 <span class="mr20">销售人：陈道明</span>
                 <span class="mr20">询价时间：2021-01-06 09:23:37</span>
                 <span class="mr20">截至时间：2021-01-06 09:23:37</span>
              </div>
              <el-tag class="tag" type="success">待审批</el-tag>
          </div>
      </fieldset>
      <el-form v-show="showSearch" :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item>
              <el-input v-model="queryParams.inputValue" placeholder="输入关键字" clearable size="small" style="width: 180px" @keyup.enter.native="handleQuery"/>
          </el-form-item>
          <el-form-item>
            <el-select v-model="queryParams.invoiceStatus" size="small" style="width: 102px">
                <el-option label="未税价" value="notSubmit"></el-option>
                <el-option label="含税价" value="toBeApprove"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
          <el-form-item style="float:right">
              <span class="f14 table_tip">询价单说明：这是一个xxxxxxx</span>
          </el-form-item>
      </el-form>


      <el-table class="mb8" :height="screen_height-450" v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="50" />
        <el-table-column align="center" label="客户物料名称" prop="guest_element_name" width="200" />
        <el-table-column align="center" label="客户物料型号" prop="guest_spec_code" width="240" />
        <el-table-column align="center" label="品牌" prop="brand" width="100" />
        <el-table-column align="center" label="单位" prop="unit" width="60" />
        <el-table-column align="center" label="数量" prop="num" width="80" />
        <el-table-column align="center" label="需求日期" prop="" width="100" />
        <el-table-column align="center" label="交货日期" prop="" width="100" />
        <el-table-column align="center" label="我方报价" prop="" width="100" />
        <el-table-column align="center" label="最近报价" prop="" width="100" />
        <el-table-column align="center" label="最近成交" prop="" width="100" />
        <el-table-column align="center" label="金额" prop="" width="100" />
        <el-table-column align="center" label="税金" prop="" width="100" />
        <el-table-column align="center" label="税价合计" prop="" width="100" />
        <el-table-column fixed="right" align="center" label="操作">
            <template>
                <el-button size="mini" type="text"><svg-icon icon-class="connect" class-name="btn_icon_svg"></svg-icon>&nbsp;关联</el-button>
            </template>
        </el-table-column>
      </el-table>

      <pagination :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="handleCurrentChange">
        <div>
            <el-button type="primary" icon="el-icon-refresh" size="mini">转订单</el-button>
            <el-button @click="handleImport" type="info" icon="el-icon-upload2" size="mini">上传图纸</el-button>
            <el-button type="info" icon="el-icon-download" size="mini">导出</el-button>
            <el-button type="danger" icon="el-icon-close" size="mini">不报价</el-button>
            <el-button type="success" size="mini">
                <svg-icon icon-class="save" class-name="btn_icon_svg"></svg-icon>&nbsp;保存</el-button>
        </div>
    </pagination>

    <upload-file ref="uploadFile"></upload-file>
  </div>
</template>

<script>
import uploadFile from '@/components/UploadFile/index'
import { mapGetters } from 'vuex'
export default {
  name: "AskPriceOrder",
  components:{uploadFile},
  data() {
    return {
        showSearch: true,
        queryParams: {},
        total: 0,
        loading: false,
        tableData: [{guest_element_name:"特斯拉汽车Model3"}],
        
    };
  },
  computed: {
    ...mapGetters(['screen_height'])
  },
  methods: {
      getPayDemandList(){},
      handleQuery(){},
      resetQuery(){},
      handleSelectionChange(){},
      handleCurrentChange(){},
      handleImport(){
          this.$refs.uploadFile.upload.open = true;
      }
  },
};
</script>

<style lang="scss" scoped>
.AskPriceOrder {
    .table_tip{
        font-size: 14px;
        color: #515a6e;
  }
}
</style>