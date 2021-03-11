<template>
  <div class="addStaff">
    <el-dialog center title="添加人员" :visible.sync="dialogFormVisible">
      <div class="searchBar">
        <el-input
          clearable
          v-model="inputValue"
          @change="searchStaffName"
          class="search"
          size="mini"
          placeholder="输入姓名搜索"
        ></el-input>
        <el-button style="width:110px" @click="searchStaffName" size="mini" type="primary">搜索</el-button>
      </div>
      <div class="content">
        <div class="department">部门</div>
        <el-tabs v-model="activeName" tab-position="left">
          <el-tab-pane name="1" label="全部">
            <el-checkbox-group :max="10" v-model="addStaffListArr">
              <el-checkbox
                style="margin-bottom:10px"
                v-for="(staff, index) in filterAllStaffList"
                :key="index"
                :label="staff.staff_id"
              >{{staff.name}}</el-checkbox>
            </el-checkbox-group>
          </el-tab-pane>
          <el-tab-pane
            :name="`${index+2}`"
            :label="item.name"
            v-for="(item, index) in filterDepartments"
            :key="index"
          >
            <el-checkbox-group :max="10" v-model="addStaffListArr">
              <el-checkbox
                style="margin-bottom:10px"
                v-for="(staff, index) in item.staff_list"
                :key="index"
                :label="staff.staff_id"
              >{{staff.name}}</el-checkbox>
            </el-checkbox-group>
          </el-tab-pane>
        </el-tabs>
      </div>

      <div style="text-align:center" slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "addStaff",
  props: {
    departments: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      dialogFormVisible: false,
      addStaffListArr: [],
      activeName: "1",
      allStaffList: [],
      inputValue: "",
      filterAllStaffList: [],
      filterDepartments: [],
      isSearch: false,
    };
  },
  methods: {
    save() {
      this.dialogFormVisible = false;
      this.$emit("addStaffList", this.addStaffListArr);
    },
    handleAllStaffList() {
      this.departments.forEach((item) => {
        this.allStaffList.push(...item.staff_list);
      });
      this.filterAllStaffList = JSON.parse(JSON.stringify(this.allStaffList));
      this.filterDepartments = JSON.parse(JSON.stringify(this.departments));
    },
    // 搜索姓名
    searchStaffName() {
      if (this.activeName === "1") {
        this.filterAllStaffList = this.allStaffList.filter((item) => {
          return item.name.includes(this.inputValue.trim());
        });
      } else {
        this.filterDepartments[
          this.activeName - 2
        ].staff_list = this.departments[this.activeName - 2].staff_list.filter(
          (item) => {
            return item.name.includes(this.inputValue.trim());
          }
        );
      }
    },
  },
  created() {
    this.handleAllStaffList();
  },
  watch: {
    departments() {
      this.handleAllStaffList();
    },
  },
};
</script>

<style  lang="scss">
.addStaff {
  .el-dialog {
    width: 800px !important;
  }

  .searchBar {
    .search {
      width: 173px;
      margin-right: -4px;
      margin-bottom: 20px;
    }
  }

  .content {
    .department {
      font-size: 16px;
      font-weight: 700;
      margin-left: 18px;
      margin-bottom: 10px;
    }

    .el-tabs--left .el-tabs__item.is-left {
      text-align: left;
    }
  }
}
</style>