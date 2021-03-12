import store from '@/store/index.js'
import { get_tax_list } from '@/api/enterpriseManage'
import { getSaleBasicInfo } from '@/api/saleManage'
import { getToken,setToken,removeToken } from '@/utils/auth'
const state = {
    tax_list: [],
    encode_rule_list: '',
    workpiece_list: getToken('profile')?getToken('profile').config.workpieces:"",
    saleBasicInfo: {},
    workpiece_list: getToken('profile')?getToken('profile').config.workpieces:"",
    department_list: getToken('department_list'),
    job_list: getToken('job_list'),
    encode_code: getToken('encode_code')
}

const mutations = {
    SET_TAX_LIST: (state, tax_list) => {
        state.tax_list = tax_list
    },
    setSaleBasicInfo(state, result){
        state.saleBasicInfo = result.sale_basic_info
        localStorage.setItem('saleBasicInfo',JSON.stringify(result.sale_basic_info))

        let tmpEncodeRuleList = result.sale_basic_info.element_code_encode_info
        let encode_rule = []
        let encode_rule_list = []
        tmpEncodeRuleList.forEach(item => {
            encode_rule.push(item)
        })

        if(encode_rule.length >= 0){
            let list0 = [],
                list1 = [];
            let first = encode_rule[0];
            let second = encode_rule[1];
            let third = encode_rule[2];

            if (second) {
                second.forEach(item_1 => {
                let newNode = {
                    code: item_1.code,
                    name: item_1.name
                };

                if (
                    item_1.sub_index &&
                    item_1.sub_index.length > 0 &&
                    third &&
                    third.length > 0
                ) {
                    newNode.sub_list = [];

                    item_1.sub_index.forEach(item_2 => {
                    third.forEach(son => {
                        if (son.name == item_2) {
                        newNode.sub_list.push({
                            code: son.code,
                            name: son.name,
                            sub_list: son.sub_list
                        });
                        }
                    });
                    });
                }

                list1.push(newNode);
                });
            }

            if (first) {
                first.forEach(item_1 => {
                let newNode = {
                    code: item_1.code,
                    name: item_1.name
                };

                if (
                    item_1.sub_index &&
                    item_1.sub_index.length > 0 &&
                    list1 &&
                    list1.length > 0
                ) {
                    newNode.sub_list = [];

                    item_1.sub_index.forEach(item_2 => {
                    list1.forEach(son => {
                        if (son.name == item_2) {
                        newNode.sub_list.push({
                            code: son.code,
                            name: son.name,
                            sub_list: son.sub_list
                        });
                        }
                    });
                    });
                }

                list0.push(newNode);
                });
            }

            encode_rule_list = list0

            state.encode_rule_list = encode_rule_list
        }
    },
    SET_DEPARTMENT_LIST: (state, department_list) => {
        state.department_list = department_list
    },
    SET_JOB_LIST: (state, job_list) => {
        state.job_list = job_list;
    },
    SET_ENCODE_CODE: (state, encode_code) => {
        state.encode_code = encode_code
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