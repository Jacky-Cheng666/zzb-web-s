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
    meta: { title: '销售管理',icon: 'el-icon-sold-out' },
    redirect: '/saleManage/createSaleOrder',
    children: [
      {
        path: 'createSaleOrder',
        name: 'createSaleOrder',
        component: () => import('@/views/createSaleOrder/index'),
        meta: { title: '新建销单',icon: 'el-icon-document-add' }
      },
      {
        path: 'synergyOrderManage',
        name: 'synergyOrderManage',
        component: () => import('@/views/synergyOrderManage/index'),
        redirect: '/saleManage/synergyOrderManage/intentionOrder',
        alwaysShow: true,
        meta: { title: '协同接单',icon: 'el-icon-connection' },
        children: [
          {
            path: 'intentionOrder',
            name: 'intentionOrder',
            component: () => import('@/views/intentionOrder/index'),
            meta: { title: '意向订单',icon: 'el-icon-tickets' }
          },
          {
            path: 'synergyOfferPrice',
            name: 'synergyOfferPrice',
            component: () => import('@/views/synergyOfferPrice/index'),
            meta: { title: '协同报价',icon: 'el-icon-money' }
          },
          {
            path: 'customerAskPrice',
            name: 'customerAskPrice',
            component: () => import('@/views/customerAskPrice/index'),
            meta: { title: '客户询价',icon: 'el-icon-price-tag' }
          },
          {
            path: 'AskPriceOrder/:order_name',
            name: 'AskPriceOrder',
            component: () => import('@/views/AskPriceOrder/index'),
            meta: { title: '询价单',icon: 'el-icon-price-tag',activeMenu: '/saleManage/synergyOrderManage/customerAskPrice' },
            hidden: true,
          },
        ]
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
        meta: { title: '发货管理',icon: 'el-icon-s-operation' }
      },
      {
        path: 'saleOrder/:order_name',
        name: 'saleOrder',
        component: () => import('@/views/saleOrder/index'),
        meta: { title: '销售订单',icon: 'el-icon-takeaway-box',activeMenu: '/saleManage/saleRecords' },
        hidden: true
      }
    ]
  },
  {
    path: '/purchaseManage',
    component: Layout,
    meta: { title: '采购管理', icon: 'el-icon-shopping-cart-2' },
    redirect: '/purchaseManage/requestOrderManage',
    children: [
      {
        path: 'requestOrderManage',
        name: 'requestOrderManage',
        component: () => import('@/views/requestOrderManage/index'),
        redirect: '/purchaseManage/requestOrderManage/createRequestOrder',
        meta: { title: '我要请购',icon: 'el-icon-collection' },
        children: [
          {
            path: 'createRequestOrder',
            name: 'createRequestOrder',
            component: () => import('@/views/createRequestOrder/index'),
            meta: { title: '新建请购',icon: 'el-icon-document-add' }
          },
          {
            path: 'myRequestList',
            name: 'myRequestList',
            component: () => import('@/views/myRequestList/index'),
            meta: { title: '我的请购',icon: 'el-icon-tickets' }
          },
          {
            path: 'reqListFollow',
            name: 'reqListFollow',
            component: () => import('@/views/reqListFollow/index'),
            meta: { title: '请购跟进',icon: 'el-icon-document-copy' }
          },
          {
            path: 'requestOrder/:order_name',
            name: 'requestOrder',
            component: () => import('@/views/requestOrder/index'),
            meta: { title: '请购单',icon: 'el-icon-takeaway-box',activeMenu: '/purchaseManage/requestOrderManage/myRequestList' },
            hidden: true
          }
        ]
      },
      {
        path: 'createPurchaseOrder',
        name: 'createPurchaseOrder',
        component: () => import('@/views/createPurchaseOrder/index'),
        meta: { title: '新建订单',icon: 'el-icon-document-add' }
      },
      {
        path: 'receiveManage',
        name: 'receiveManage',
        component: () => import('@/views/receiveManage/index'),
        meta: { title: '收货管理',icon: 'el-icon-s-operation' }
      },
      {
        path: 'purchaseOrder/:order_name',
        name: 'purchaseOrder',
        component: () => import('@/views/purchaseOrder/index'),
        meta: { title: '采购订单',icon: 'el-icon-takeaway-box',activeMenu: '/purchaseManage/receiveManage' },
        hidden: true
      },
      
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
