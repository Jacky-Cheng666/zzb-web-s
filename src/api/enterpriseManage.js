import request from '@/utils/request'
// 基本信息
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

// 物料管理
export function get_supplier_list(data) {
    return request({
        url: '/corp/company/get_supplier_list',
        method: 'post',
        data
    })
}

export function get_element_stock_controls(data) {
    return request({
        url: '/corp/company/get_element_stock_controls',
        method: 'post',
        data
    })
}
export function delete_element_stock_controls(data) {
    return request({
        url: '/corp/company/delete_element_stock_controls',
        method: 'post',
        data
    })
}
export function set_element_stock_controls(data) {
    return request({
        url: '/corp/company/set_element_stock_controls',
        method: 'post',
        data
    })
}
export function get_encode_rule(data) {
    return request({
        url: '/corp/company/get_encode_rule',
        method: 'post',
        data
    })
}

export function get_content_elements(data) {
    return request({
        url: '/corp/company/get_content_elements',
        method: 'post',
        data
    })
}

export function get_element_list(data) {
    return request({
        url: '/corp/company/get_element_list',
        method: 'post',
        data
    })
}

export function get_all_workpiece_list(data) {
    return request({
        url: '/corp/company/get_all_workpiece_list',
        method: 'post',
        data
    })
}

export function search_elements(data) {
    return request({
        url: '/corp/company/search_elements',
        method: 'post',
        data
    })
}

export function check_element_exists(data) {
    return request({
        url: '/corp/company/check_element_exists',
        method: 'post',
        data
    })
}

export function is_elements_repeat(data) {
    return request({
        url: '/corp/company/is_elements_repeat',
        method: 'post',
        data
    })
}

export function get_department_list(data) {
    return request({
        url: '/corp/company/get_department_list',
        method: 'post',
        data
    })
}

export function get_staff_list(data) {
    return request({
        url: '/corp/company/get_staff_list',
        method: 'post',
        data
    })
}

export function get_job_list(data) {
    return request({
        url: '/corp/company/get_job_list',
        method: 'post',
        data
    })
}

export function get_auth_list(data) {
    return request({
        url: '/corp/company/get_auth_list',
        method: 'post',
        data
    })
}
export function delete_job(data) {
    return request({
        url: '/corp/company/delete_job',
        method: 'post',
        data
    })
}

export function rename_department(data) {
    return request({
        url: '/corp/company/rename_department',
        method: 'post',
        data
    })
}

export function add_department(data) {
    return request({
        url: '/corp/company/add_department',
        method: 'post',
        data
    })
}

export function delete_department(data) {
    return request({
        url: '/corp/company/delete_department',
        method: 'post',
        data
    })
}

export function set_department_head(data) {
    return request({
        url: '/corp/company/set_department_head',
        method: 'post',
        data
    })
}

export function transfer_admin_role(data) {
    return request({
        url: '/corp/company/transfer_admin_role',
        method: 'post',
        data
    })
}

export function add_staff(data) {
    return request({
        url: '/corp/company/add_staff',
        method: 'post',
        data
    })
}

export function delete_staff(data) {
    return request({
        url: '/corp/company/delete_staff',
        method: 'post',
        data
    })
}
export function edit_encode_rule(data) {
    return request({
        url: '/corp/company/edit_encode_rule',
        method: 'post',
        data
    })
}

export function add_elements(data) {
    return request({
        url: '/corp/company/add_elements',
        method: 'post',
        data
    })
}

export function delete_elements(data) {
    return request({
        url: '/corp/company/delete_elements',
        method: 'post',
        data
    })
}
export function get_all_element(data) {
    return request({
        url: '/corp/company/get_all_element',
        method: 'post',
        data
    })
}

export function delete_all_element(data) {
    return request({
        url: '/corp/company/delete_all_element',
        method: 'post',
        data
    })
}

export function get_default_workflow_template(data) {
    return request({
        url: '/corp/workflow/get_default_workflow_template',
        method: 'post',
        data
    })
}

export function get_workflow_template(data) {
    return request({
        url: '/corp/workflow/get_workflow_template',
        method: 'post',
        data
    })
}

export function get_ai_assist_config(data) {
    return request({
        url: '/corp/company/get_ai_assist_config',
        method: 'post',
        data
    })
}

export function edit_workflow_template(data) {
    return request({
        url: '/corp/workflow/edit_workflow_template',
        method: 'post',
        data
    })
}

export function delete_workflow_template(data) {
    return request({
        url: '/corp/workflow/delete_workflow_template',
        method: 'post',
        data
    })
}

export function set_ai_assist_config(data) {
    return request({
        url: '/corp/company/set_ai_assist_config',
        method: 'post',
        data
    })
}

