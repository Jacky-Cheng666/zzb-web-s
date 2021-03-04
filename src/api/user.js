import request from '@/utils/request'

export function get_image_check_code_info(data) {
  return request({
    url: '/user/get_image_check_code_info',
    method: 'post',
    data
  })
}

export function login_get_code(data) {
  return request({
    url: '/user/login_get_code',
    method: 'post',
    data
  })
}

export function login(data) {
  return request({
    url: '/user/register_with_code',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout(data) {
  return request({
    url: '/user/logout',
    method: 'post',
    data
  })
}
