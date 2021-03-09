import store from '@/store/index.js'
import { get_tax_list } from '@/api/enterpriseManage'
import { getToken,setToken,removeToken } from '@/utils/auth'
const state = {
    tax_list: [],
    encode_rule_list: getToken('encode_rule_list'),
    workpiece_list: getToken('profile')?getToken('profile').config.workpieces:""
}

const mutations = {
    SET_TAX_LIST: (state, tax_list) => {
        state.tax_list = tax_list
    },
    SET_PINGLEI: (state, encode_rule_list) => {
        state.encode_rule_list = encode_rule_list
    }
}

const actions = {
    async getTaxList({ commit }) {
        let res = await get_tax_list({ access_token: store.getters.token })
        if (res.code === 0) {
            commit('SET_TAX_LIST', res.tax_list)
        }
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}