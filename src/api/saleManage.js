import request from '@/utils/request'

export function getSaleBasicInfo(data) {
  return request({
    url: '/som/orderCommon/get_sale_basic_info',
    method: 'post',
    data
  })
}

export function getAllIntentionOrder(data) {
  return request({
    url: '/som/orderCommon/get_all_order',
    method: 'post',
    data
  })
}