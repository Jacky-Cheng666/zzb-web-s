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