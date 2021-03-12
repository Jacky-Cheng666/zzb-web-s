<template>
  <el-cascader
    filterable
    style="width: 400px"
    size="mini"
    placeholder="请选择物料品类"
    @change="handleChangerRule"
    :props="{ value: 'code', label: 'name', children: 'sub_list' }"
    :options="encode_rule_list"
    v-model="encode_code_list"
    clearable
  ></el-cascader>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "encodeRule",
  props: {
    value: {
      type: Array,
      default: function () {
        return [];
      },
    },
    formData: {
      type: Object,
      default: function () {
        return {};
      },
    }
  },
  data() {
    return {
      encode_code_list: this.value,
    };
  },
  computed: {
    ...mapGetters(["encode_rule_list"]),
  },
  watch: {
    value: {
      deep: true,
      handler: function (newV, oldV) {
        this.encode_code_list = this.$DeepClone(newV);
      },
    },
  },
  methods: {
    handleChangerRule(val) {
      this.encode_code_list = val
      this.handleChangeFormData(this.formData)
      this.$emit("input", val);
    },
    handleChangeFormData(ruleForm) {
        let codes = []
        ruleForm.content_code = ""
        this.encode_code_list.forEach((item, index)=>{
          ruleForm.content_code += item
          codes[index] = item
        })

        let first, second
        ruleForm.content_name = ""
        codes.forEach((code, index) => {
          if (0 == index) {
            this.encode_rule_list.forEach((item, i1) => {
              if (item.code == code) {
                first = i1
                ruleForm.content_name = item.name
              }
            })
          }

          if (1 == index) {
            this.encode_rule_list[first].sub_list.forEach((item, i2) => {
              if (item.code == code) {
                second = i2
                ruleForm.content_name = item.name
              }
            })
          }

          if (2 == index) {
            this.encode_rule_list[first].sub_list[second].sub_list.forEach((item) => {
              if (item.code == code) {
                ruleForm.content_name = item.name
              }
            })
          }
        })

        if (this.encode_code_list.length <= 1) {
          ruleForm.content_code += '00000'
        } else if (this.encode_code_list.length <= 2) {
          ruleForm.content_code += '000'
        }
      },
  },
};
</script>

<style>
</style>