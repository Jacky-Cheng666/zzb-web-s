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