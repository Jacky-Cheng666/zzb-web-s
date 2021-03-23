import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import store from '../index'

const getDefaultState = () => {
  return {
    token: getToken('zzb_web_s_token'),
    name: getToken('profile')?getToken('profile').name:'',
    roles: [],
    profile: getToken('profile'),
    org: getToken('org'),
    company_no: getToken('company_no'),
    is_admin: getToken('is_admin'),
    userInfo: getToken('userInfo')
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PROFILE: (state, profile) => {
    state.profile = profile
  },
  SET_ORG: (state,org) => {
    state.org = org;
  },
  SET_COMPANY_NO: (state,company_no) => {
    state.company_no = company_no;
  },
  SET_IS_ADMIN: (state,is_admin) => {
    state.is_admin = is_admin;
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo;
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login({ ...userInfo }).then(response => {
        // console.log('登录',response);
        if(response.code===0){
          commit('SET_TOKEN', response.access_token)
          commit('SET_NAME', response.profile.name)
          commit('SET_PROFILE', response.profile)
          commit('SET_ORG', response.org)
          commit('SET_COMPANY_NO', response.company_no)
          commit('SET_IS_ADMIN', response.is_admin)
          commit('SET_USER_INFO', response)

          setToken('zzb_web_s_token',response.access_token)
          setToken('profile', response.profile)
          setToken('org', response.org)
          setToken('company_no', response.company_no)
          setToken('is_admin',response.is_admin)
          setToken('userInfo', response)
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      let data = {
        name: state.name,
        roles: ["admin"]
      }
      const { roles, name } = data
      commit('SET_ROLES', roles)
      commit('SET_NAME', name)
      resolve(data)
    })
  },

  // user logout
  logout({ commit, state,dispatch }) {
    return new Promise((resolve, reject) => {
      logout({access_token: state.token}).then((res) => {
        if(res.code===0){
          dispatch('resetToken')
          resetRouter()
          commit('RESET_STATE')
          dispatch('tagsView/delAllViews', null, { root: true })
        }
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      window.localStorage.clear()
      commit('RESET_STATE')
      store.commit('zzb/RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

