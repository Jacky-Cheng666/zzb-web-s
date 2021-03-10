import store from '@/store/index.js'
import { get_tax_list } from '@/api/enterpriseManage'
import { getSaleBasicInfo } from '@/api/saleManage'
import { getToken,setToken,removeToken } from '@/utils/auth'
const state = {
    tax_list: [],
    encode_rule_list: getToken('encode_rule_list'),
    workpiece_list: getToken('profile')?getToken('profile').config.workpieces:"",
    saleBasicInfo: {}
}

const mutations = {
    SET_TAX_LIST: (state, tax_list) => {
        state.tax_list = tax_list
    },
    SET_PINGLEI: (state, encode_rule_list) => {
        state.encode_rule_list = encode_rule_list
    },
    setSaleBasicInfo(state, result){
        state.saleBasicInfo = result.sale_basic_info
        localStorage.setItem('saleBasicInfo',JSON.stringify(result.sale_basic_info))
    }
}

const actions = {
    async getTaxList({ commit }) {
        let res = await get_tax_list({ access_token: store.getters.token })
        if (res.code === 0) {
            commit('SET_TAX_LIST', res.tax_list)
        }
    },

    async getSaleBasicInfo({ commit }) {
        let res = await getSaleBasicInfo({ access_token: store.getters.token })
        if (res.code === 0) {
            commit('setSaleBasicInfo', res)
        }
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}