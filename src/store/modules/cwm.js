import store from '@/store/index.js'
import { get_tax_list } from '@/api/enterpriseManage'
const state = {
    tax_list: []
}

const mutations = {
    SET_TAX_LIST: (state, tax_list) => {
        state.tax_list = tax_list
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