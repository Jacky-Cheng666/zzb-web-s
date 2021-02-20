import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

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
    redirect: '/home',
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
        redirect: '/saleManage/deliveryManage/deliveryList',
        meta: { title: '发货管理',icon: 'el-icon-s-operation' },
        children: [
          {
            path: 'deliveryList',
            name: 'deliveryList',
            component: () => import('@/views/deliveryList/index'),
            meta: { title: '发货',icon: 'deliver' }
          },
          {
            path: 'deliveryRecords',
            name: 'deliveryRecords',
            component: () => import('@/views/deliveryRecords/index'),
            meta: { title: '发货记录',icon: 'el-icon-tickets' }
          },
          {
            path: 'cusReturnRecords',
            name: 'cusReturnRecords',
            component: () => import('@/views/cusReturnRecords/index'),
            meta: { title: '退货记录',icon: 'el-icon-tickets' }
          },
          {
            path: 'deSaleOrder/:order_name',
            name: 'deSaleOrder',
            component: () => import('@/views/deSaleOrder/index'),
            meta: { title: '销售订单',icon: '', },
            hidden: true
          },
          {
            path: 'deliveryOrder/:deliver_name',
            name: 'deliveryOrder',
            component: () => import('@/views/deliveryOrder/index'),
            meta: { title: '发货单',icon: '', activeMenu: '/saleManage/deliveryManage/deliveryRecords' },
            hidden: true
          },
          {
            path: 'cusReturnOrder/:deliver_name',
            name: 'cusReturnOrder',
            component: () => import('@/views/cusReturnOrder/index'),
            meta: { title: '退货单',icon: '', activeMenu: '/saleManage/deliveryManage/cusReturnRecords' },
            hidden: true
          },
        ]
      },
      {
        path: 'productManage',
        name: 'productManage',
        component: () => import('@/views/productManage/index'),
        redirect: '/saleManage/productManage/productLibrary',
        meta: { title: '产品管理',icon: 'el-icon-s-operation' },
        alwaysShow: true,
        children: [
          {
            path: 'productLibrary',
            name: 'productLibrary',
            component: () => import('@/views/productLibrary/index'),
            meta: { title: '产品库',icon: 'el-icon-goods' }
          },
        ]
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
        path: 'purchaseRecords',
        name: 'purchaseRecords',
        component: () => import('@/views/purchaseRecords/index'),
        meta: { title: '采购记录',icon: 'el-icon-tickets' }
      },
      {
        path: 'receiveManage',
        name: 'receiveManage',
        component: () => import('@/views/receiveManage/index'),
        redirect: '/purchaseManage/receiveManage/receiveList',
        meta: { title: '收货管理',icon: 'el-icon-s-operation' },
        alwaysShow: true,
        children: [
          {
            path: 'receiveList',
            name: 'receiveList',
            component: () => import('@/views/receiveList/index'),
            meta: { title: '收货',icon: 'receiveIcon' }
          },
          {
            path: 'rePurchaseOrder/:order_name',
            name: 'rePurchaseOrder',
            component: () => import('@/views/rePurchaseOrder/index'),
            hidden: true,
            meta: { title: '采购订单',activeMenu: '/purchaseManage/receiveManage/receiveList'}
          },
        ]
      },
      {
        path: 'purchaseOrder/:order_name',
        name: 'purchaseOrder',
        component: () => import('@/views/purchaseOrder/index'),
        meta: { title: '采购订单',icon: 'el-icon-takeaway-box',activeMenu: '/purchaseManage/purchaseRecords' },
        hidden: true
      },
      
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]
export const asyncRoutes = []
const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
