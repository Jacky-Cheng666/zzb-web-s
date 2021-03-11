const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.name,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  screen_height: state => state.app.screenHeight,
  companies: state => state.user.profile?state.user.profile.companies: [],
  login_company_no: state => state.user.company_no,
  tax_list: state => state.zzb.tax_list,
  encode_rule_list: state => state.zzb.encode_rule_list,
  workpiece_list: state => state.zzb.workpiece_list,
  job_list: state => state.zzb.job_list,
  department_list: state => state.zzb.department_list,
  is_admin: state => state.user.is_admin,

}
export default getters
