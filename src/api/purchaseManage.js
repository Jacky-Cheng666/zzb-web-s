import request from '@/utils/request'

export function get_supplier_list(data) {
    return request({
        url: '/corp/company/get_supplier_list',
        method: 'post',
        data
    })
}

export function add_multi_suppliers(data) {
    return request({
        url: '/corp/company/add_multi_suppliers',
        method: 'post',
        data
    })
}

export function delete_supplier(data) {
    return request({
        url: '/corp/company/delete_supplier',
        method: 'post',
        data
    })
}

export function set_workpiece_list(data) {
    return request({
        url: '/corp/company/set_workpiece_list',
        method: 'post',
        data
    })
}

export function search_supplier(data) {
    return request({
        url: '/corp/company/search_supplier',
        method: 'post',
        data
    })
}

export function get_supplier_info(data) {
    return request({
        url: '/corp/company/get_supplier_info',
        method: 'post',
        data
    })
}

export function get_brand_list(data) {
    return request({
        url: '/corp/company/get_brand_list',
        method: 'post',
        data
    })
}

export function apply_for_add_supplier(data) {
    return request({
        url: '/corp/company/apply_for_add_supplier',
        method: 'post',
        data
    })
}

export function check_supplier_name(data) {
    return request({
        url: '/corp/company/check_supplier_name',
        method: 'post',
        data
    })
}