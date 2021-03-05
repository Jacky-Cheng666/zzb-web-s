const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.name,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  screen_height: state => state.app.screenHeight,
  companies: state => state.user.profile.companies,
  login_company_no: state => state.user.company_no
}
export default getters
