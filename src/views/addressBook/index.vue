<template>
  <div class="app-container addressBook">
    <div class="sideNav">
      <el-menu active-text-color="#303133" background-color="#FFFEFE" unique-opened :default-active="activeIndex" @select="clickSelect" @open="handleOpen" @close="handleClose">
        <el-submenu index="first">
          <template slot="title">
            <img style="margin-right: 10px" src="@/assets/imgs/organization.png" alt=""/>
            <span>组织架构</span>
          </template>
          <el-menu-item :class="{ activeColor: department_name === item.name }" v-for="item in department_list" :key="item.id" :index="item.name">{{ item.name }}({{ item.staff_list.length }})</el-menu-item>
          <div style="margin-top: 10px; margin-bottom: 20px" align="center">
            <el-button icon="el-icon-minus" type="danger" plain size="mini" @click="delDepartment(department_name)">删除部门</el-button>
          </div>
        </el-submenu>
        <el-submenu index="second">
          <template slot="title">
            <img style="margin-right: 10px" src="@/assets/imgs/role.png" alt=""/>
            <span>角色</span>
          </template>
          <el-menu-item :class="{ activeColor: job_id === item.job_id }" v-for="item in job_list" :key="item.job_id" :index="'' + item.job_id">{{ item.job_name }}</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <div class="mainContent">
      <div class="contentWrap" v-show="label_type=='first'">
        <el-input size='mini' style="width: 120px;" v-model="depart_form.new_department_name" auto-complete="off" placeholder="新部门名"></el-input>
        <el-button style="margin-left: -2px;" type="primary" size="mini" @click="renameDepartment()">修改部门名称</el-button>
        <div style="float: right;margin-right: 0px;">
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="toStaffEdit(true)" >添加成员</el-button>
          <el-button style="margin-left: 10px;" icon="el-icon-plus" type="primary" size="mini" @click="addDepart()">新增部门</el-button>
          <el-button size="mini" icon="el-icon-sort" type="warning" @click="transferAdmin" style="background-color: #6299DB;border-color:#6299DB" >转让管理员</el-button>
          <el-button size="mini" icon="el-icon-user" @click="setDepartmentDirector" type="warning" style="background-color: #2ED0C2;border-color:#2ED0C2">设为部门主管</el-button>
        </div>

        <div class="table_container">
          <el-table ref="multipleTable" :data="rows" stripe :height="500" @selection-change="changeFun" style="width: 100%">
            <el-table-column align="center" type="selection" width="55" />
            <el-table-column align="center" label="姓名" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="scope.row.is_admin&&scope.row.isDirector" style="width: 80%;height: 100%;cursor: pointer;display:inline-block;" @click="toStaffEdit(false,scope.row)">{{scope.row.name}}（管理员)（主管）</div>
                <div v-else-if="scope.row.is_admin" style="width: 80%;height: 100%;cursor: pointer;display:inline-block;" @click="toStaffEdit(false,scope.row)">{{scope.row.name}}（管理员）</div>
                <div v-else-if="scope.row.isDirector" style="width: 80%;height: 100%;cursor: pointer;display:inline-block;" @click="toStaffEdit(false,scope.row)">{{scope.row.name}}（主管）</div>
                <div v-else style="width: 80%;height: 100%;cursor: pointer;display:inline-block;" @click="toStaffEdit(false,scope.row)">{{scope.row.name}}</div>
              </template>
            </el-table-column>

            <el-table-column align="center" prop="job_name" label="岗位" show-overflow-tooltip />
            <el-table-column align="center" prop="employee_id" label="工号" show-overflow-tooltip />
            <el-table-column align="center" prop="phone" label="手机号码" show-overflow-tooltip/>
            <el-table-column align="center" label="账户状态" show-overflow-tooltip />
            <el-table-column align="center" label="操作" width="120">
              <template slot-scope="scope" >
                <el-button size="mini" type="text" icon="el-icon-edit">编辑</el-button>
                <el-button size="mini" type="text" icon="el-icon-delete" class="text-danger">删除</el-button>              
              </template>
            </el-table-column>
          </el-table>
          
          <div style="text-align: center;margin-top: 5px;">
            <el-row >
              <el-col :span="24" style="margin-top: 6px;background: #ffffff">
               <el-pagination prev-text="上一页" next-text	="下一页"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="[10, 30, 50, 100,200]"
                  :page-size="pageSize"
                  layout="prev, pager, next, sizes, total, jumper"
                  :total="count"
                ></el-pagination>
              </el-col>

            </el-row>
          </div>
        </div>
      </div>
      <div class="contentWrap" v-show="label_type=='second'">
        <div class="titleEdit">{{txt_title}}</div>

        <div style="line-height: 43px;margin-bottom:20px;">
          <el-input size='mini' style="width: 160px;margin-left: 20px;" v-model="new_job_name" auto-complete="off" placeholder="新角色名"></el-input>
          <el-button style="margin-left: -2px;" type="primary" size="mini" @click="submitJob()">提交</el-button>
          <div style="float: right;margin-right: 10px;">
            <el-button v-show="!add_model" type="danger" icon="el-icon-minus" size="mini" @click="deleteJob()">删除角色</el-button>
            <el-button v-show="!add_model" type="primary" icon="el-icon-plus" size="mini" @click="addJob(true)">新增角色</el-button>
            <el-button v-show="add_model" size="mini" @click="addJob(false)">取消</el-button>
          </div>
        </div>

        <el-row style="line-height: 25px;padding-left: 0px;box-sizing: border-box;font-size: 13px;">
          <el-checkbox-group v-model="checkList">
            <el-col v-for="(item, index) in auth_list" :key="index" :span="(item.id < 100)?24:6">
              <span class="titleCaption" v-show="item.id < 100">{{auth_title_list[item.id]}}</span>
              <el-checkbox style="padding-left:25px" :label="item.id" v-show="100 <= item.id"> {{item.name}}</el-checkbox>
            </el-col>
          </el-checkbox-group>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "addressBook",
  data() {
    return {
      activeIndex: "",
      department_name: "",
      job_id: "",
      depart_form: {},
      label_type: "first",
      currentPage: 1,
      pageSize: 10,
      count: 100,
      rows: [1,1,1,1,1,1,1],
      department_list: [
        {
          name: "管理层",
          staff_list: [
            {
              staff_id: 410,
              name: "何丽丽",
              phone: "15994747589",
              employee_id: "123456",
            },
            {
              staff_id: 411,
              name: "客户",
              phone: "15889985372",
              employee_id: "46541",
            },
            {
              staff_id: 412,
              name: "加宽了",
              phone: "15889372548",
              employee_id: "10052",
            },
            {
              staff_id: 414,
              name: "科技",
              phone: "16484564246",
              employee_id: "1065456",
            },
            {
              staff_id: 415,
              name: "卡机是",
              phone: "15498456452",
              employee_id: "1230121",
            },
            {
              staff_id: 416,
              name: "速度来",
              phone: "15884548554",
              employee_id: "123456",
            },
            {
              staff_id: 535,
              name: "小丽",
              phone: "16800001999",
            },
            {
              staff_id: 871,
              name: "天天",
              phone: "16912345678",
              employee_id: "008",
            },
            {
              staff_id: 878,
              name: "大厦",
              phone: "16810001018",
              employee_id: "N001",
            },
            {
              staff_id: 880,
              name: "大致",
              phone: "16712345678",
              employee_id: "0002",
            },
            {
              staff_id: 881,
              name: "XX",
              phone: "16987654321",
              employee_id: "156",
            },
            {
              staff_id: 882,
              name: "ss",
              phone: "16887654321",
              employee_id: "158",
            },
            {
              staff_id: 883,
              name: "14701234567",
              phone: "14701234567",
              employee_id: "0589",
            },
            {
              staff_id: 884,
              name: "16801234567",
              phone: "16801234567",
              employee_id: "1360",
            },
            {
              staff_id: 904,
              name: "李木子",
              phone: "16800001020",
              employee_id: "1000",
            },
            {
              staff_id: 905,
              name: "木子王",
              phone: "16800001021",
              employee_id: "1001",
            },
            {
              staff_id: 492,
              name: "智造帮",
              phone: "13528749597",
            },
            {
              staff_id: 429,
              name: "王二小",
              phone: "18681459471",
            },
            {
              staff_id: 496,
              name: "赵渝",
              phone: "13823130348",
            },
            {
              staff_id: 948,
              name: "大张",
              phone: "16810123456",
            },
          ],
          id: 1,
          head_staff_id: 414,
        },
        {
          name: "采购部",
          staff_list: [
            {
              staff_id: 267,
              name: "张学友",
              phone: "13412345678",
              employee_id: "zzb0004",
            },
            {
              staff_id: 138,
              name: "标品采购员",
              phone: "13212345678",
              employee_id: "zzb0007",
            },
            {
              staff_id: 396,
              name: "黎明",
              phone: "13612345678",
              employee_id: "zzb0006",
            },
            {
              staff_id: 536,
              name: "Tony",
              phone: "16800001998",
              employee_id: "101",
            },
            {
              staff_id: 1,
              name: "刘浩1",
              phone: "13480949851",
            },
            {
              staff_id: 907,
              name: "王小今",
              phone: "16800001022",
              employee_id: "1002",
            },
            {
              staff_id: 944,
              name: "赵二",
              phone: "13598765432",
              employee_id: "01",
            },
          ],
          id: 2,
          head_staff_id: 907,
        },
        {
          name: "销售中心",
          staff_list: [
            {
              staff_id: 403,
              name: "新员工2",
              phone: "16809098888",
              employee_id: "00099",
            },
            {
              staff_id: 908,
              name: "大猫",
              phone: "16800001023",
              employee_id: "1003",
            },
          ],
          id: 3,
        },
        {
          name: "研发中心",
          staff_list: [
            {
              staff_id: 949,
              name: "研发人员1",
              phone: "18594212900",
            },
            {
              staff_id: 950,
              name: "李工",
              phone: "13728464703",
            },
            {
              staff_id: 951,
              name: "翟工",
              phone: "13723498050",
            },
          ],
          id: 4,
        },
        {
          name: "生产部",
          staff_list: [
            {
              staff_id: 409,
              name: "人",
              phone: "13454545654",
              employee_id: "999",
            },
          ],
          id: 5,
        },
        {
          name: "仓储中心",
          staff_list: [
            {
              staff_id: 913,
              name: "飞飞",
              phone: "16800001024",
              employee_id: "1011",
            },
            {
              staff_id: 916,
              name: "张杰",
              phone: "13148890676",
            },
            {
              staff_id: 917,
              name: "王忠清",
              phone: "13510982775",
            },
            {
              staff_id: 198,
              name: "罗雄刚",
              phone: "18576722484",
            },
            {
              staff_id: 140,
              name: "秦朗",
              phone: "18590923309",
            },
            {
              staff_id: 912,
              name: "程卫明",
              phone: "15272419009",
            },
            {
              staff_id: 929,
              name: "刘宇",
              phone: "15112424802",
            },
          ],
          id: 6,
        },
        {
          name: "项目中心",
          staff_list: [],
          id: 7,
        },
        {
          name: "财务部",
          staff_list: [],
          id: 8,
        },
        {
          name: "项目管理中心",
          staff_list: [],
          id: 9,
        },
        {
          name: "GH",
          id: 1595207281443,
          staff_list: [],
        },
        {
          name: "ZY",
          id: 1595401180906,
          staff_list: [
            {
              staff_id: 478,
              name: "廖芳芳",
              phone: "15057900325",
            },
            {
              staff_id: 445,
              name: "樊玲玲",
              phone: "13632861170",
            },
            {
              staff_id: 156,
              name: "李雪梅",
              phone: "17512059636",
            },
            {
              staff_id: 915,
              name: "李芬芬",
              phone: "13510817125",
            },
            {
              staff_id: 932,
              name: "刘保春",
              phone: "13530308971",
            },
            {
              staff_id: 335,
              name: "徐呈娟",
              phone: "13430528921",
            },
            {
              staff_id: 931,
              name: "熊媛媛",
              phone: "13720332945",
            },
            {
              staff_id: 333,
              name: "黄怡静",
              phone: "15889664501",
            },
            {
              staff_id: 925,
              name: "梁瑾熙",
              phone: "18878156012",
            },
          ],
          head_staff_id: 445,
        },
        {
          name: "SW",
          id: 1595408831679,
          staff_list: [],
        },
        {
          name: "培训部",
          id: 1605785337522,
          staff_list: [],
        },
      ],
      job_list: [
        {
          job_id: 10001,
          job_name: "采购经理",
          auth_list: [
            101,
            103,
            105,
            200,
            202,
            204,
            205,
            209,
            300,
            301,
            305,
            304,
            306,
            303,
            307,
            308,
            310,
            302,
            309,
            312,
            316,
            313,
            311,
            314,
            315,
            206,
            207,
            211,
            210,
            201,
            203,
            107,
            104,
            500,
          ],
        },
        {
          job_id: 10002,
          job_name: "采购工程师",
          auth_list: [
            300,
            307,
            302,
            303,
            101,
            103,
            105,
            107,
            200,
            204,
            201,
            209,
            205,
            202,
            206,
            210,
            211,
            207,
            203,
            309,
            301,
            306,
            311,
            310,
            312,
            313,
            314,
            315,
            316,
          ],
        },
        {
          job_id: 10003,
          job_name: "采购助理",
          auth_list: [300, 301, 302, 303, 306, 307],
        },
        {
          job_id: 10006,
          job_name: "销售经理",
          auth_list: [102, 400, 401, 402, 403, 404, 405],
        },
        {
          job_id: 10007,
          job_name: "销售工程师",
          auth_list: [400, 401, 403, 404, 405],
        },
        {
          job_id: 10008,
          job_name: "销售助理",
          auth_list: [401, 403, 404, 405],
        },
        {
          job_id: 10011,
          job_name: "研发经理",
          auth_list: [
            312,
            103,
            104,
            102,
            200,
            204,
            208,
            209,
            205,
            201,
            202,
            206,
            210,
            211,
            207,
            203,
          ],
        },
        {
          job_id: 10012,
          job_name: "研发工程师",
          auth_list: [],
        },
        {
          job_id: 10013,
          job_name: "研发助理",
          auth_list: [],
        },
        {
          job_id: 10016,
          job_name: "生产经理",
          auth_list: [],
        },
        {
          job_id: 10017,
          job_name: "生产操作员",
          auth_list: [],
        },
        {
          job_id: 10022,
          job_name: "工艺工程师",
          auth_list: [208, 308, 107],
        },
        {
          job_id: 10026,
          job_name: "仓库管理员",
          auth_list: [
            500,
            501,
            502,
            503,
            504,
            508,
            509,
            505,
            510,
            506,
            507,
            202,
            205,
            210,
            312,
          ],
        },
        {
          job_id: 10031,
          job_name: "财务经理",
          auth_list: [503, 504, 505, 506, 507, 600, 601, 602, 603],
        },
        {
          job_id: 10032,
          job_name: "客人",
          auth_list: [210],
        },
        {
          job_id: 11000,
          job_name: "公司高管",
          auth_list: [
            100,
            101,
            102,
            103,
            105,
            200,
            201,
            202,
            203,
            204,
            205,
            206,
            207,
            208,
            209,
            300,
            301,
            302,
            303,
            304,
            305,
            306,
            307,
            400,
            401,
            402,
            403,
            404,
            405,
            500,
            502,
            503,
            504,
            505,
            506,
            507,
            600,
            601,
            602,
            603,
            107,
            313,
            604,
            608,
            605,
            606,
            607,
            315,
            104,
            314,
            210,
            309,
            316,
            211,
            407,
            406,
            510,
            509,
            508,
            310,
            311,
            308,
            312,
            501,
          ],
        },
        {
          job_name: "总财务部",
          auth_list: [
            100,
            104,
            200,
            204,
            208,
            300,
            304,
            400,
            404,
            500,
            504,
            600,
            601,
            505,
            501,
            405,
            401,
            305,
            301,
            209,
            205,
            201,
            105,
            101,
            102,
            202,
            206,
            302,
            306,
            402,
            502,
            506,
            602,
            603,
            507,
            503,
            403,
            307,
            303,
            207,
            203,
            103,
          ],
          job_id: 8,
        },
        {
          job_name: "总参谋部",
          auth_list: [],
          job_id: 9,
        },
        {
          job_name: "ABC",
          auth_list: [100, 104],
          job_id: 10,
        },
        {
          job_name: "客户测试角色",
          auth_list: [
            105,
            101,
            104,
            107,
            103,
            200,
            204,
            208,
            201,
            205,
            209,
            202,
            206,
            210,
            203,
            207,
            211,
            300,
            304,
            309,
            312,
            316,
            301,
            305,
            310,
            313,
            302,
            307,
            311,
            314,
            303,
            308,
            306,
            315,
            400,
            404,
            408,
            401,
            405,
            402,
            406,
            403,
            407,
            500,
            504,
            508,
            501,
            505,
            509,
            502,
            506,
            510,
            503,
            507,
            600,
            604,
            608,
            601,
            605,
            602,
            606,
            603,
            607,
            102,
          ],
          job_id: 12,
        },
        {
          job_name: "品质检测员",
          auth_list: [502, 501, 509],
          job_id: 14,
        },
        {
          job_name: "PMC",
          auth_list: [210, 207, 206, 205, 209],
          job_id: 15,
        },
      ],
      txt_title: "设置角色",
      new_job_name: "",
      checkList: [101,103,105,200,202,204,205,300,100,301,305,304,306,303,307,402,405,401,400,404,403,503,507,506,502,505,504,500,601,602,603,308,501,302,209,108,104,107,109,110,102,201,206,210,211,207,203,213,212,208,508,512,513,509,510,514,511,310],
      add_model: false,
      auth_title_list: ['企业管理权限', '项目管理权限', '采购管理权限', '销售管理权限', '仓库管理权限', '财务管理权限', '报表查看权限'],
      auth_list: [{"id":0,"name":"全部权限"},{"id":100,"name":"修改企业信息"},{"id":101,"name":"管理供应商"},{"id":102,"name":"管理采购商"},{"id":103,"name":"管理品类、品牌"},{"id":108,"name":"添加物料"},{"id":109,"name":"修改物料"},{"id":110,"name":"删除物料"},{"id":105,"name":"设备管理"},{"id":104,"name":"设置加工价格","need_check_conflicts":true},{"id":107,"name":"查看加工价格","need_check_conflicts":true},{"id":1,"name":"全部权限"},{"id":200,"name":"审批请购单"},{"id":201,"name":"上传图纸"},{"id":202,"name":"转为库存"},{"id":203,"name":"删除需求"},{"id":204,"name":"再次购买"},{"id":205,"name":"分类跟踪"},{"id":206,"name":"产出管理"},{"id":207,"name":"产品管理"},{"id":208,"name":"工艺设置"},{"id":209,"name":"导出项目清单"},{"id":210,"name":"项目管理"},{"id":211,"name":"变更审批"},{"id":212,"name":"查看实时成本"},{"id":213,"name":"项目结案"},{"id":2,"name":"全部权限"},{"id":300,"name":"管理购物车"},{"id":301,"name":"管理安全库存"},{"id":302,"name":"询价比价","need_check_conflicts":true},{"id":303,"name":"发布订单","need_check_conflicts":true},{"id":304,"name":"审核订单"},{"id":305,"name":"审批订单"},{"id":307,"name":"导出订单"},{"id":308,"name":"工艺评估","need_check_conflicts":true},{"id":309,"name":"查看成交履历"},{"id":310,"name":"显示供应商"},{"id":311,"name":"查看退单","need_check_conflicts":true},{"id":306,"name":"管理退单","need_check_conflicts":true},{"id":312,"name":"自主发货","need_check_conflicts":true},{"id":313,"name":"请购管理"},{"id":314,"name":"询价比价"},{"id":315,"name":"订单管理"},{"id":316,"name":"查看归档订单"},{"id":317,"name":"直接入库"},{"id":3,"name":"全部权限"},{"id":400,"name":"管理报价"},{"id":401,"name":"订单管理"},{"id":402,"name":"批准订单"},{"id":403,"name":"管理退单"},{"id":404,"name":"管理发货"},{"id":405,"name":"管理退货"},{"id":406,"name":"报价管理"},{"id":407,"name":"订单管理"},{"id":408,"name":"特采管理"},{"id":409,"name":"直接发货"},{"id":4,"name":"全部权限"},{"id":500,"name":"管理收货"},{"id":501,"name":"品质检测"},{"id":502,"name":"退货管理"},{"id":503,"name":"导出流水"},{"id":504,"name":"导出库存"},{"id":505,"name":"导入库存"},{"id":506,"name":"管理盘点"},{"id":507,"name":"管理报废"},{"id":508,"name":"出库管理"},{"id":509,"name":"入库管理"},{"id":510,"name":"查找库存"},{"id":511,"name":"新建出库"},{"id":512,"name":"导出入库记录"},{"id":513,"name":"导出出库记录"},{"id":514,"name":"新建入库"},{"id":5,"name":"全部权限"},{"id":600,"name":"查看报表"},{"id":601,"name":"对账单"},{"id":602,"name":"下载报表"},{"id":603,"name":"设置对账配置"},{"id":604,"name":"付款管理"},{"id":605,"name":"收款管理"},{"id":606,"name":"应付对账"},{"id":607,"name":"应收对账"},{"id":608,"name":"报销管理"},{"id":609,"name":"一键付款"},{"id":610,"name":"一键收款"},{"id":6,"name":"全部权限"},{"id":700,"name":"付款统计表"},{"id":701,"name":"收款统计表"},{"id":702,"name":"收支报表"},{"id":703,"name":"出入库报表"},{"id":704,"name":"进销存报表"},{"id":705,"name":"采购统计表"},{"id":706,"name":"供应商考评表"},{"id":707,"name":"销售统计表"},{"id":708,"name":"客户考评表"}]
    };
  },
  methods: {
    handleOpen(key){
      this.label_type = key;
    },
    clickSelect(index,indexPath){
      console.log(index);
      if(this.label_type==='first'){
        this.department_name = index;
      }else if(this.label_type==='second'){
        this.job_id = parseInt(index);
      }
      
    },
    handleClose(){},
    delDepartment(){},
    renameDepartment(){},
    toStaffEdit(){},
    addDepart(){},
    transferAdmin(){},
    setDepartmentDirector(){},
    changeFun(){},
    handleSizeChange(){},
    handleCurrentChange(){},
    submitJob(){},
    deleteJob(){},
    addJob(){}
  },
};
</script>

<style lang="scss">
.addressBook {
  background-color: #f6f6f6;
  display: flex;
  .sideNav {
    flex: 1;
  }
  .mainContent {
    margin-left: 10px;
    flex: 7;
    background-color: #fff;
    padding: 10px;
    .contentWrap{
      width: 100%;
      .table_container {
        width: 100%;
        margin-top: 10px;
      }
      .titleEdit {
        color: #333333;
        font-size: 16px;
        font-weight: bold;
        margin-top: 20px;
        margin-bottom: 30px;
        border-left: 4px solid #00a0e9;
        padding-left: 24px;
      }
      .titleCaption {
        display: block;
        color: #333333;
        font-size: 13px;
        font-weight: bold;
        background-color: #f5f5f5;
        padding-left: 24px;
        height: 31px;
      }
    }
  }
  .activeColor{
    background:#E5E5E5 !important
  }
  .el-submenu__title {
    background-color: #00A0E9 !important;
    color: #ffffff;
    &:first-child {
      border-bottom: 1px solid #fff;
    }
  }
      
}
</style>