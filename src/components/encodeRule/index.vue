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
      this.$emit("input", val);
    },
  },
};
</script>

<style>
</style>