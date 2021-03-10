<template>
  <div class="app-container categoryManage" v-loading="loading" element-loading-text="加载中...">
    <header class="header">
      <div class="titleEdit">品类管理</div>
      <div>
        <span style="font-size: 13px;color:#999999;margin-top: 6px;margin-right: 20px;font-weight: bold;">提交后才能保存并生效</span>
        <el-button type="primary" size="mini" @click="submitRule()">提交</el-button>
        <el-button type="danger" size="mini" @click="clearAll()">清空</el-button>
      </div>
    </header>

    <div>
      <div style="line-height: 48px;background-color:#f5f5f5;">
        <span style="margin-left: 20px;line-height: 36px;">
          <span class="titleCaption">第一级、</span>

          <el-select  style="width: 180px;" v-model="encode_name[0]" @change="handleChangeRule(0)" filterable  size="mini" placeholder="请输入或者选择">
              <el-option
                v-for="(item,index) in encode_rule_ui[0]"
                :key="index"
                :label="item.code + '.' + item.name"
                :value="item.name">
              </el-option>
          </el-select>
          <el-button style="margin-left: 10px;" type="danger" size="mini" @click="delRule(0)">删除品类</el-button>

          <el-input size='mini' style="width: 200px;margin-left: 60px;" v-model="new_name[0]" auto-complete="off" placeholder="新名称"></el-input>
          <el-input size='mini' style="width: 80px;margin-left: 10px;" v-model="new_code[0]" maxlength="2" auto-complete="off" placeholder="新代码"></el-input>
          <el-button style="margin-left: 10px;" type="success" size="mini" @click="addRule(0)">新增品类</el-button>
        </span>
      </div>

      <el-row style="line-height: 25px;padding-left: 20px;box-sizing: border-box;font-size: 13px;background: #fff">
        <el-col v-for="(item,index) in encode_rule[0]" :key="index" :span="6">
          <span>{{item.code}}.{{item.name}}</span>
        </el-col>
      </el-row>
    </div>

    <div v-show="encode_rule_ui[0] && 0 < encode_rule_ui[0].length">
      <div style="line-height: 48px;background-color:#f5f5f5;">
        <span style="margin-left: 20px;line-height: 36px;">
          <span class="titleCaption">第二级、</span>

          <el-select  style="width: 180px;" v-model="encode_name[1]" @change="handleChangeRule(1)" filterable  size="mini" placeholder="请输入或者选择">
              <el-option
                v-for="(item,index) in encode_rule_ui[1]"
                :key="index"
                :label="item.code + '.' + item.name"
                :value="item.name">
              </el-option>
          </el-select>

          <el-button style="margin-left: 10px;" type="danger" size="mini" @click="delRule(1)">删除品类</el-button>
          <el-input size='mini' style="width: 200px;margin-left: 60px;" v-model="new_name[1]" auto-complete="off" placeholder="新名称"></el-input>
          <el-input size='mini' style="width: 80px;margin-left: 10px;" v-model="new_code[1]" maxlength="2" auto-complete="off" placeholder="新代码"></el-input>
          <el-button style="margin-left: 10px;" type="success" size="mini" @click="addRule(1)">新增品类</el-button>
        </span>
      </div>

      <el-row style="line-height: 25px;padding-left: 20px;box-sizing: border-box;font-size: 13px;background: #fff">
        <el-checkbox-group v-model="encode_rule_ui[1]" @change="changeSubIndex(1)">
          <el-col v-for="(item,index) in encode_rule[1]" :key="index" :span="6">
            <el-checkbox :label="item" >{{item.code}}.{{item.name}}</el-checkbox>
            </el-col>
        </el-checkbox-group>
      </el-row>
    </div>

    <div v-show="encode_rule_ui[1] && 0 < encode_rule_ui[1].length">
      <div style="line-height: 48px;background-color:#f5f5f5;">
        <span style="margin-left: 20px;line-height: 36px;">
          <span class="titleCaption">第三级、</span>
        
          <el-select  style="width: 180px;" v-model="encode_name[2]" filterable  size="mini" placeholder="请输入或者选择">
              <el-option
                v-for="(item,index) in encode_rule_ui[2]"
                :key="index"
                :label="item.code + '.' + item.name"
                :value="item.name">
              </el-option>
          </el-select>

          <el-button style="margin-left: 10px;" type="danger" size="mini" @click="delRule(2)">删除品类</el-button>
          <el-input size='mini' style="width: 200px;margin-left: 60px;" v-model="new_name[2]" auto-complete="off" placeholder="新名称"></el-input>
          <el-input size='mini' style="width: 80px;margin-left: 10px;" v-model="new_code[2]" maxlength="3" auto-complete="off" placeholder="新代码"></el-input>
          <el-button style="margin-left: 10px;" type="success" size="mini" @click="addRule(2)">新增品类</el-button>
        </span>
      </div>

      <el-row style="line-height: 25px;padding-left: 20px;box-sizing: border-box;font-size: 13px;background: #fff">
        <el-checkbox-group v-model="encode_rule_ui[2]" @change="changeSubIndex(2)">
          <el-col v-for="(item,index) in encode_rule[2]" :key="index" :span="6">
            <el-checkbox :label="item" >{{item.code}}.{{item.name}}</el-checkbox>
            </el-col>
        </el-checkbox-group>
      </el-row>
    </div>
  </div>
</template>

<script>
import { get_encode_rule, edit_encode_rule } from '@/api/enterpriseManage'
import { mapGetters } from 'vuex'
export default {
  name: 'categoryManage',
  data() {
    return {
      encode_rule: [[],[],[]],
      encode_rule_ui: [],
      encode_name: [],
      new_name: ['', '', ''],
      new_code: ['', '', ''],
      loading: false
    }
  },
  created() {
    this.getRuleList()
  },
  computed: {
    ...mapGetters(['token'])
  },
  methods: {
    async getRuleList(){
      this.loading = true;
      let result = await get_encode_rule({
        access_token: this.token
      })
      if(result.code===0){
        this.loading = false;
        this.encode_rule = result.encode_rule
        this.handleChangeRule(0)
      }else{
        this.loading = false;
        this.encode_rule = []
        this.encode_name = []
      }
    },
    handleChangeRule(level){
      if (!this.encode_rule || this.encode_rule.length <= 0) {
        this.encode_name = []
        this.encode_rule_ui = []
        return
      }
      //console.log(JSON.stringify(this.encode_rule))

      let first = this.encode_rule[0]
      let second = this.encode_rule[1]
      let third = this.encode_rule[2]

      if(first) {
        first.sort((a, b) => {
          return a.code.localeCompare(b.code);
        });
      }
      if(second) {
        second.sort((a, b) => {
          return a.code.localeCompare(b.code);
        });
      }
      if(third) {
        third.sort((a, b) => {
          return a.code.localeCompare(b.code);
        });
      }

      if (level <= 0 && this.encode_name.length <= 0) {
        this.encode_name = []
        this.encode_rule_ui = []
        this.encode_rule_ui[0] = this.encode_rule[0]
        this.encode_name[0] = this.encode_rule_ui[0][0].name
      }
      //console.log(JSON.stringify(this.encode_rule_ui))

      if (level <= 0 && this.encode_rule_ui[0] && 0 < this.encode_rule_ui[0].length) {
        this.encode_rule_ui[1] = []

        this.encode_rule_ui[0].forEach((item) => {
          if (item.name == this.encode_name[0]) {
            if (item.sub_index && 0 < item.sub_index.length && second) {
              item.sub_index.forEach((son) => {
                second.forEach((node) => {
                  if (node.name == son) {
                    this.encode_rule_ui[1].push(node)
                  }
                })
              })
            }
          }
        })

        if (0 < this.encode_rule_ui[1].length) {
          this.encode_name[1] = this.encode_rule_ui[1][0].name
        } else {
          this.encode_name[1] = ''
        }
      }

      if (level <= 1 && this.encode_rule_ui[1] && 0 < this.encode_rule_ui[1].length) {
        this.encode_rule_ui[2] = []

        this.encode_rule_ui[1].forEach((item) => {
          if (item.name == this.encode_name[1]) {
            if (item.sub_index && 0 < item.sub_index.length && third) {
              item.sub_index.forEach((son) => {
                third.forEach((node) => {
                  if (node.name == son) {
                    this.encode_rule_ui[2].push(node)
                  }
                })
              })
            }
          }
        })

        if (0 < this.encode_rule_ui[2].length) {
          this.encode_name[2] = this.encode_rule_ui[2][0].name
        } else {
          this.encode_name[2] = ''
        }
      }
      //console.log(JSON.stringify(this.encode_name))
    },
    delRule(level) {
      if (this.encode_name[level]) {
        let old_name = ''
        for (let i in this.encode_rule[level]) {
          if (this.encode_rule[level][i].name == this.encode_name[level]) {
            if (this.encode_rule[level][i].sub_index && 0 < this.encode_rule[level][i].sub_index.length) {
              this.$message({
                type: 'warning',
                message: '不能删除包含子类的品类'
              })
              return
            }

            old_name = this.encode_rule[level][i].name
            this.encode_rule[level].splice(i, 1)
            if (0 == this.encode_rule[level].length) {
              this.encode_rule.splice(level, 1)
            }
          }
        }

        if (0 < level) {
          let index = level - 1
          this.encode_rule[index].forEach(node => {
            if (this.encode_name[index] == node.name && node.sub_index) {
              for (let i in node.sub_index) {
                if (node.sub_index[i] == old_name) {
                  node.sub_index.splice(i, 1)
                  if (0 == node.sub_index.length) {
                    delete node.sub_index
                  }
                  return
                }
              }
            }
          })
        }

        if (0 == level) {
          this.encode_name = []
          this.handleChangeRule(0)
        } else if (1 == level) {
          this.handleChangeRule(0)
        } else {
          this.handleChangeRule(1)
        }

        this.$notify({
          type: 'success',
          title: '成功',
          message: '删除成功'
        })
      } else {
        this.$message({
          type: 'warning',
          message: '请选择一个品类'
        });
      }
    },
    addRule(level) {
      if (0 < level) {
        let index = level - 1
        if (!this.encode_name[index]) {
          this.$message({
            type: 'warning',
            message: '请选择一个上一级品类'
          });
          return
        }
      }

      if (!this.hasRule(level)) {
        let result = this.checkRule(level)
        if (result) {
          this.$message({
            type: 'warning',
            message: result
          });
          return
        } else {
          result = this.checkRuleCodeInLevel(level)
          if (result) {
            this.$message({
              type: 'warning',
              message: result
            });
            return
          } 
        }

        if (!this.encode_rule[level]) {
          this.encode_rule[level] = []
        }

        this.encode_rule[level].push({
          code : this.new_code[level],
          name : this.new_name[level]
        })
      }

      if (0 < level) {
        let index = level - 1
        this.encode_rule[index].forEach(node => {
          if (this.encode_name[index] == node.name) {
            if (node.sub_index) {
              let has = false
              node.sub_index.forEach(name => {
                if (name == this.new_name[level]) {
                  has = true
                }
              })

              if (!has) {
                node.sub_index.push(this.new_name[level])
              }
            } else {
              node.sub_index = [this.new_name[level]]
            }
          }
        })
      }

      if (0 == level) {
        this.encode_name = []
        this.handleChangeRule(0)
      } else if (1 == level) {
        this.handleChangeRule(0)
      } else {
        this.handleChangeRule(1)
      }

      this.$message({
        type: 'success',
        message: '添加成功或者已经存在相同品类'
      })
    },
    hasRule(level) {
      for (let i in this.encode_rule[level]) {
        if (this.encode_rule[level][i].name == this.new_name[level]) {
          return true
        }
      }

      return false
    },
    checkRule(level) {
      if (!this.new_name[level] || !this.new_code[level]) {
        return '请输入品类名称或者代码'
      }

      for (let i in this.encode_rule[level]) {
        if (0 == level && this.encode_rule[level][i].code == this.new_code[level]) {
          return '代码重复，请重新输入'
        }

        if (this.encode_rule[level][i].name == this.new_name[level]) {
          return '名称重复，请重新输入'
        }
      }

      return
    },
    checkRuleCodeInLevel(level) {
      for (let i in this.encode_rule_ui[level]) {
        if (this.encode_rule_ui[level][i].code == this.new_code[level]) {
          return '同一品类分级中有相同代码，请重新输入'
        }
      }

      return
    },
    clearAll() {
      if (!this.encode_rule || this.encode_rule.length <= 0) {
        this.$message({
          type: 'warning',
          message: '品类数据已经为空'
        });
        return
      }

      this.$confirm('确定清空品类数据？请谨慎操作', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.encode_rule = []
          this.handleChangeRule(0)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
    },
    changeSubIndex(level) {
      let code_list = [], has_same = false
      this.encode_rule_ui[level].forEach(node => {
        if(code_list[node.code]) {
          has_same = true
        } else {
          code_list[node.code] = 1
        }
      })

      if (has_same) {
        this.encode_rule_ui[level].pop()
        this.$message({
          type: 'warning',
          message: '同一级中品类代码不可重复'
        });
        return
      }

      if (0 < level) {
        this.encode_rule_ui[level].sort((a, b) => {
          return a.code.localeCompare(b.code);
        });

        let index = level - 1
        this.encode_rule[index].forEach(node => {
          if (this.encode_name[index] == node.name) {
            node.sub_index = []
            this.encode_rule_ui[level].forEach(item => {
              node.sub_index.push(item.name)
            })

            if (0 == node.sub_index.length) {
              delete node.sub_index
            }
          }
        })
      }
    },
    submitRule() {
      if (!this.encode_rule || this.encode_rule.length <= 0) {
        this.$message({
          type: 'warning',
          message: '请至少设置一级品类'
        });
        return
      }

      this.$confirm('确定修改品类规则？请谨慎操作', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let result = await edit_encode_rule({
            access_token:this.token,
            encode_rule:this.encode_rule
          });
          if(result.code===0){
            this.$notify({
              type: 'success',
              title: '成功',
              message: '操作成功'
            })
            this.getRuleList();
          }

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
    },
  },
}
</script>

<style lang="scss">
.categoryManage {
  background-color: #f6f6f6;
  .header {
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .titleEdit {
      color: #333333;
      font-size: 16px;
      font-weight: bold;
      margin-top: 20px;
      margin-bottom: 30px;
      border-left: 4px solid #00a0e9;
      padding-left: 24px;
    }
  }
}
</style>