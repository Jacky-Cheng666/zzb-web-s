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

export function searchElements(data) {
  return request({
    url: '/som/company/search_elements',
    method: 'post',
    data
  })
}

export function createPlanOrder(data) {
  return request({
    url: '/som/planOrder/create_plan_order',
    method: 'post',
    data
  })
}

export function getAttachOrderList(data) {
  return request({
    url: '/som/attachOrder/get_attach_order_list',
    method: 'post',
    data
  })
}

export function exportAttachOrders(data) {
  return request({
    url: '/som/attachOrder/export_attach_orders',
    method: 'post',
    data
  })
}
