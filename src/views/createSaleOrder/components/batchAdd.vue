<template>
  <div class="batchAdd">
    <el-dialog center title="查找产品" :visible.sync="openBatchAdd" width="960px" append-to-body>
        <el-form class="mb10" ref="batch_add-form" :model="queryParams" label-width="60px" :inline="true">
            <el-form-item label="关键字">
              <el-input v-model="queryParams.pay_money" placeholder="输入产品信息搜索产品库" clearable size="small" style="width: 240px"/>
            </el-form-item>
            <el-form-item>
                <el-cascader size="small" style="width:420px" v-model="queryParams.product_id" :options="product_type_list" :props="{ expandTrigger: 'hover',value: 'id', label: 'name',children: 'items'}" @change="handleChange"></el-cascader>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>
        <div class="table-content">
            <el-table height="600" v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
                <el-table-column align="center" type="selection" width="50" />
                <el-table-column align="center" label="名称" prop="element_name" width="200" />
                <el-table-column align="center" label="产品代码" prop="element_code" width="200" />
                <el-table-column align="center" label="型号" prop="spec_code" />
                <el-table-column align="center" label="品牌" prop="brand" width="140" />
                <el-table-column align="center" label="单位" prop="unit" width="80" />
                <el-table-column align="center" label="最小包装" prop="min-package" width="80" />
                <el-table-column align="center" label="最低购买" prop="total_money" width="80" />
            </el-table>
        </div>
        <div slot="footer" class="dialog-footer">
             <el-button size="mini" @click="openBatchAdd = false">取 消</el-button>
             <el-button size="mini" type="primary" @click="openBatchAdd = false">确 定</el-button>
          </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "batchAdd",
  data() {
    return {
      openBatchAdd: false,
      queryParams: {
          product_id: ""
      },
      tableData: [],
      loading:false,
      product_type_list: [{"id":100000,"name":"直线运动零件","items":[{"id":100100,"name":"单轴驱动器/单轴机器人","items":[{"id":100101,"name":"单轴驱动器"},{"id":100102,"name":"单轴机器人"},{"id":100101,"name":"多轴机器人"},{"id":100102,"name":"直线电机模组"}]},{"id":100200,"name":"直线导轨","items":[{"id":100201,"name":"直线导轨组件"}]},{"id":100300,"name":"滚珠丝杠","items":[{"id":100301,"name":"滚珠丝杠"}]},{"id":100400,"name":"支座组件","items":[{"id":100401,"name":"支座组件"}]},{"id":100500,"name":"梯形丝杠","items":[{"id":100501,"name":"梯形丝杠"},{"id":100601,"name":"梯形丝杠用螺帽"}]}]},{"id":200000,"name":"旋转/传动/传送零件","items":[{"id":200100,"name":"输送机","items":[{"id":200101,"name":"输送机"}]},{"id":200200,"name":"轴承及配件","items":[{"id":200201,"name":"滚珠轴承"},{"id":200202,"name":"滚针轴承"},{"id":200203,"name":"带树脂轴承"},{"id":200204,"name":"外螺纹型轴承"},{"id":200205,"name":"塑胶轴承"}]}]}]
    };
  },
  methods: {
      handleQuery(){},
      resetQuery(){},
      handleChange(){},
      handleSelectionChange(){}
  },
};
</script>

<style lang="scss">
.batchAdd{
   .table-content{
       overflow: auto;
   }
}
</style>