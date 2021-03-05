import request from '@/utils/request'

export function get_image_check_code_info(data) {
  return request({
    url: '/home/user/get_image_check_code_info',
    method: 'post',
    data
  })
}

export function login_get_code(data) {
  return request({
    url: '/home/user/login_get_code',
    method: 'post',
    data
  })
}

export function login(data) {
  return request({
    url: '/home/user/login_with_code',
    method: 'post',
    data
  })
}

export function switch_company(data) {
  return request({
    url: '/corp/users/switch_company',
    method: 'post',
    data
  })
}

export function logout(data) {
  return request({
    url: '/home/user/logout',
    method: 'post',
    data
  })
}
