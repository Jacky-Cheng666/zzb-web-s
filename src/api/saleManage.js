import request from '@/utils/request'

export function getSaleBasicInfo(data) {
  return request({
    url: '/scm/company/get_buy_basic_info',
    method: 'post',
    data
  })
}