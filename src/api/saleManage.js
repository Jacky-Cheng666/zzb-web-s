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

export function getAttachOrder(data) {
  return request({
    url: '/som/attachOrder/get_attach_order',
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

export function exportSingleAttachOrder(data) {
  return request({
    url: '/som/attachOrder/export_single_attach_order',
    method: 'post',
    data
  })
}

export function setPlanOrderReceiveInfo(data) {
  return request({
    url: '/som/planOrder/set_plan_order_receiver_info',
    method: 'post',
    data
  })
}

export function get_product_list(data) {
  return request({
    url: '/som/product/get_product_list',
    method: 'post',
    data
  })
}

export function delete_product_spec(data) {
  return request({
    url: '/som/product/delete_product_spec',
    method: 'post',
    data
  })
}

export function delete_product(data) {
  return request({
    url: '/som/product/delete_product',
    method: 'post',
    data
  })
}

export function get_type_list(data) {
  return request({
    url: '/som/product/get_type_list',
    method: 'post',
    data
  })
}

export function add_product(data) {
  return request({
    url: '/som/product/add_product',
    method: 'post',
    data
  })
}
// 客户管理
export function get_purchaser_list(data) {
  return request({
    url: '/corp/company/get_purchaser_list',
    method: 'post',
    data
  })
}

export function supplier_add_agree(data) {
  return request({
    url: '/corp/company/supplier_add_agree',
    method: 'post',
    data
  })
}

export function delete_purchaser(data) {
  return request({
    url: '/corp/company/delete_purchaser',
    method: 'post',
    data
  })
}
