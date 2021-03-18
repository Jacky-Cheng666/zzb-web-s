<template>
  <el-cascader
    style="width: 100%"
    size="small"
    v-model="product_id"
    :options="product_type_list"
    :props="{ expandTrigger: 'hover', value: 'id', label: 'name', children: 'items'}"
    @change="handleChange" />
</template>

<script>
import { mapGetters } from "vuex";
import { get_type_list } from "@/api/saleManage";
export default {
  name: "productType",
  computed: {
    ...mapGetters(["token"]),
  },
  data() {
    return {
      product_id: "",
      product_type_list: [],
    };
  },
  created() {
    this.getTypeList();
  },
  methods: {
    async getTypeList() {
      let result = await get_type_list({
        access_token: this.token,
      });
      if (result.code === 0) {
        this.product_type_list = result.product_type_list;
        this.$store.commit('zzb/SET_PRODUCT_TYPE_LIST', this.product_type_list)
      }
    },
    handleChange() {
      this.$emit("input", this.product_id);
    },
  },
};
</script>

<style>
</style>