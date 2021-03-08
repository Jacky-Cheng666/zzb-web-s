import request from '@/utils/request'

export function get_company_basic_info(data) {
    return request({
        url: '/corp/company/get_company_basic_info',
        method: 'post',
        data
    })
}

export function get_tax_list(data) {
    return request({
        url: '/corp/company/get_tax_list',
        method: 'post',
        data
    })
}
export function set_financial_book_name(data) {
    return request({
        url: '/corp/company/set_financial_book_name',
        method: 'post',
        data
    })
}

export function set_company_basic_info(data) {
    return request({
        url: '/corp/company/set_company_basic_info',
        method: 'post',
        data
    })
}

export function add_bank_account(data) {
    return request({
        url: '/corp/company/add_bank_account',
        method: 'post',
        data
    })
}

export function set_bank_account(data) {
    return request({
        url: '/corp/company/set_bank_account',
        method: 'post',
        data
    })
}

export function remove_bank_account(data) {
    return request({
        url: '/corp/company/remove_bank_account',
        method: 'post',
        data
    })
}
export function set_company_tax(data) {
    return request({
        url: '/corp/company/set_company_tax',
        method: 'post',
        data
    })
}
export function set_receive_info_list(data) {
    return request({
        url: '/corp/company/set_receive_info_list',
        method: 'post',
        data
    })
}