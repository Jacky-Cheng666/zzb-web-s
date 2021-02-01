import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    // component: Layout,
    redirect: '/home',
    // children: [{
    //   path: 'dashboard',
    //   name: 'Dashboard',
    //   component: () => import('@/views/dashboard/index'),
    //   meta: { title: 'Dashboard', icon: 'dashboard' }
    // }]
  },

  {
    path: '/home',
    component: () => import('@/views/home/index'),
    hidden: true
  },

  {
    path: '/saleManage',
    component: Layout,
    meta: { title: '销售管理',icon: 'el-icon-goods' },
    redirect: '/saleManage/createSalesOrder',
    children: [
      {
        path: 'createSalesOrder',
        name: 'createSalesOrder',
        component: () => import('@/views/createSalesOrder/index'),
        meta: { title: '新建销单',icon: 'el-icon-document-add' }
      },
      {
        path: 'saleRecords',
        name: 'saleRecords',
        component: () => import('@/views/saleRecords/index'),
        meta: { title: '销售记录',icon: 'el-icon-tickets' }
      },
      {
        path: 'deliveryManage',
        name: 'deliveryManage',
        component: () => import('@/views/deliveryManage/index'),
        meta: { title: '发货管理',icon: 'el-icon-takeaway-box' }
      }
    ]
  },
  {
    path: '/purchaseManage',
    component: Layout,
    meta: { title: '采购管理', icon: 'el-icon-shopping-cart-2' },
    redirect: '/purchaseManage/initiateRequest',
    children: [
      {
        path: 'initiateRequest',
        name: 'initiateRequest',
        component: () => import('@/views/initiateRequest/index'),
        meta: { title: '我要请购',icon: 'el-icon-document-add' }
      },
      {
        path: 'createPurchaseOrder',
        name: 'createPurchaseOrder',
        component: () => import('@/views/createPurchaseOrder/index'),
        meta: { title: '新建订单',icon: 'el-icon-document-add' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]
export const asyncRoutes = []
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
