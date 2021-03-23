import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'
import EmptyLayout from '@/layout/empty'
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
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

  
]
export const asyncRoutes = [
  {
    path: '/saleManage',
    component: Layout,
    meta: { title: '销售管理',icon: 'el-icon-sold-out' },
    redirect: '/saleManage/createSaleOrder',
    children: [
      {
        path: 'createSaleOrder',
        name: 'createSaleOrder',
        component: () => import('@/views/saleManage/createSaleOrder/index'),
        meta: { title: '新建销单',icon: 'el-icon-document-add' }
      },
      {
        path: 'synergyOrderManage',
        name: 'synergyOrderManage',
        component: EmptyLayout,
        redirect: '/saleManage/synergyOrderManage/intentionOrder',
        alwaysShow: true,
        meta: { title: '协同接单',icon: 'el-icon-connection' },
        children: [
          {
            path: 'intentionOrder',
            name: 'intentionOrder',
            component: () => import('@/views/saleManage/intentionOrder/index'),
            meta: { title: '意向订单',icon: 'el-icon-tickets' }
          },
          {
            path: 'synergyOfferPrice',
            name: 'synergyOfferPrice',
            component: () => import('@/views/saleManage/synergyOfferPrice/index'),
            meta: { title: '协同报价',icon: 'el-icon-money' }
          },
          {
            path: 'customerAskPrice',
            name: 'customerAskPrice',
            component: () => import('@/views/saleManage/customerAskPrice/index'),
            meta: { title: '客户询价',icon: 'el-icon-price-tag' }
          },
          {
            path: 'AskPriceOrder/:order_name',
            name: 'AskPriceOrder',
            component: () => import('@/views/saleManage/AskPriceOrder/index'),
            meta: { title: '询价单',icon: 'el-icon-price-tag',activeMenu: '/saleManage/synergyOrderManage/customerAskPrice' },
            hidden: true,
          },
        ]
      },
      {
        path: 'saleRecords',
        name: 'saleRecords',
        component: () => import('@/views/saleManage/saleRecords/index'),
        meta: { title: '销售记录',icon: 'el-icon-tickets' }
      },
      {
        path: 'deliveryManage',
        name: 'deliveryManage',
        component: EmptyLayout,
        redirect: '/saleManage/deliveryManage/deliveryList',
        meta: { title: '发货管理',icon: 'el-icon-s-operation' },
        children: [
          {
            path: 'deliveryList',
            name: 'deliveryList',
            component: () => import('@/views/saleManage/deliveryList/index'),
            meta: { title: '发货',icon: 'deliver' }
          },
          {
            path: 'deliveryRecords',
            name: 'deliveryRecords',
            component: () => import('@/views/saleManage/deliveryRecords/index'),
            meta: { title: '发货记录',icon: 'el-icon-tickets' }
          },
          {
            path: 'cusReturnRecords',
            name: 'cusReturnRecords',
            component: () => import('@/views/saleManage/cusReturnRecords/index'),
            meta: { title: '退货记录',icon: 'el-icon-tickets' }
          },
          {
            path: 'deSaleOrder/:order_name',
            name: 'deSaleOrder',
            component: () => import('@/views/saleManage/deSaleOrder/index'),
            meta: { title: '销售订单',icon: '', },
            hidden: true
          },
          {
            path: 'deliveryOrder/:deliver_name',
            name: 'deliveryOrder',
            component: () => import('@/views/saleManage/deliveryOrder/index'),
            meta: { title: '发货单',icon: '', activeMenu: '/saleManage/deliveryManage/deliveryRecords' },
            hidden: true
          },
          {
            path: 'cusReturnOrder/:deliver_name',
            name: 'cusReturnOrder',
            component: () => import('@/views/saleManage/cusReturnOrder/index'),
            meta: { title: '退货单',icon: '', activeMenu: '/saleManage/deliveryManage/cusReturnRecords' },
            hidden: true
          },
        ]
      },
      {
        path: 'productManage',
        name: 'productManage',
        component: EmptyLayout,
        redirect: '/saleManage/productManage/productLibrary',
        meta: { title: '产品管理',icon: 'el-icon-s-operation' },
        alwaysShow: true,
        children: [
          {
            path: 'productLibrary',
            name: 'productLibrary',
            component: () => import('@/views/saleManage/productLibrary/index'),
            meta: { title: '产品库',icon: 'el-icon-goods' }
          },
        ]
      },
      {
        path: 'saleOrder/:order_name/:order_no',
        name: 'saleOrder',
        component: () => import('@/views/saleManage/saleOrder/index'),
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
        component: EmptyLayout,
        redirect: '/purchaseManage/requestOrderManage/createRequestOrder',
        meta: { title: '我要请购',icon: 'el-icon-collection' },
        children: [
          {
            path: 'createRequestOrder',
            name: 'createRequestOrder',
            component: () => import('@/views/purchaseManage/createRequestOrder/index'),
            meta: { title: '新建请购',icon: 'el-icon-document-add' }
          },
          {
            path: 'myRequestList',
            name: 'myRequestList',
            component: () => import('@/views/purchaseManage/myRequestList/index'),
            meta: { title: '我的请购',icon: 'el-icon-tickets' }
          },
          {
            path: 'reqListFollow',
            name: 'reqListFollow',
            component: () => import('@/views/purchaseManage/reqListFollow/index'),
            meta: { title: '请购跟进',icon: 'el-icon-document-copy' }
          },
          {
            path: 'requestOrder/:order_name',
            name: 'requestOrder',
            component: () => import('@/views/purchaseManage/requestOrder/index'),
            meta: { title: '请购单',icon: 'el-icon-takeaway-box',activeMenu: '/purchaseManage/requestOrderManage/myRequestList' },
            hidden: true
          }
        ]
      },
      {
        path: 'createPurchaseOrder',
        name: 'createPurchaseOrder',
        component: () => import('@/views/purchaseManage/createPurchaseOrder/index'),
        meta: { title: '新建订单',icon: 'el-icon-document-add' }
      },
      {
        path: 'purchaseRecords',
        name: 'purchaseRecords',
        component: () => import('@/views/purchaseManage/purchaseRecords/index'),
        meta: { title: '采购记录',icon: 'el-icon-tickets' }
      },
      {
        path: 'monthBillCheck',
        name: 'monthBillCheck',
        component: () => import('@/views/purchaseManage/monthBillCheck/index'),
        meta: { title: '月结对账',icon: 'el-icon-document' }
      },
      {
        path: 'monthBill/:order_no',
        name: 'monthBill',
        component: () => import('@/views/purchaseManage/monthBill/index'),
        meta: { title: '对账单' ,activeMenu: '/purchaseManage/monthBillCheck' },
        hidden: true
      },
      {
        path: 'receiveManage',
        name: 'receiveManage',
        component: EmptyLayout,
        redirect: '/purchaseManage/receiveManage/receiveList',
        meta: { title: '收货管理',icon: 'el-icon-s-operation' },
        alwaysShow: true,
        children: [
          {
            path: 'receiveList',
            name: 'receiveList',
            component: () => import('@/views/purchaseManage/receiveList/index'),
            meta: { title: '收货',icon: 'receiveIcon' }
          },
          {
            path: 'rePurchaseOrder/:order_name',
            name: 'rePurchaseOrder',
            component: () => import('@/views/purchaseManage/rePurchaseOrder/index'),
            hidden: true,
            meta: { title: '采购订单',activeMenu: '/purchaseManage/receiveManage/receiveList'}
          },
          {
            path: 'receiveRecords',
            name: 'receiveRecords',
            component: () => import('@/views/purchaseManage/receiveRecords/index'),
            meta: { title: '收货记录',icon: 'el-icon-tickets' }
          },
          {
            path: 'reDeliveryOrder/:order_name',
            name: 'reDeliveryOrder',
            component: () => import('@/views/purchaseManage/reDeliveryOrder/index'),
            meta: { title: '发货单',activeMenu: '/purchaseManage/receiveManage/receiveRecords' },
            hidden: true
          },
          {
            path: 'reReturnRecords',
            name: 'reReturnRecords',
            component: () => import('@/views/purchaseManage/reReturnRecords/index'),
            meta: { title: '退货记录',icon: 'el-icon-tickets' }
          },
          {
            path: 'reReturnOrder/:order_name',
            name: 'reReturnOrder',
            component: () => import('@/views/purchaseManage/reReturnOrder/index'),
            meta: { title: '退货单',activeMenu: '/purchaseManage/receiveManage/reReturnRecords' },
            hidden: true
          },
        ]
      },
      {
        path: 'supplierManage',
        name: 'supplierManage',
        component: () => import('@/views/purchaseManage/supplierManage/index'),
        meta: { title: '供应商管理',icon: 'suppliers',noCache: true}
      },
      {
        path: 'supplierCategorySet',
        name: 'supplierCategorySet',
        component: () => import('@/views/purchaseManage/supplierCategorySet/index'),
        meta: { title: '分类管理'},
        hidden: true
      },
      {
        path: 'supplierAdd',
        name: 'supplierAdd',
        component: () => import('@/views/purchaseManage/supplierEdit/index'),
        meta: { title: '添加供应商', activeMenu: '/purchaseManage/supplierManage'},
        hidden: true
      },
      {
        path: 'supplierEdit',
        name: 'supplierEdit',
        component: () => import('@/views/purchaseManage/supplierEdit/index'),
        meta: { title: '修改供应商', activeMenu: '/purchaseManage/supplierManage', isEdit: true, noCache: true},
        hidden: true
      },
      {
        path: 'purchaseOrder/:order_name',
        name: 'purchaseOrder',
        component: () => import('@/views/purchaseManage/purchaseOrder/index'),
        meta: { title: '采购订单',icon: 'el-icon-takeaway-box',activeMenu: '/purchaseManage/purchaseRecords' },
        hidden: true
      },
      
    ]
  },
  {
    path: '/enterpriseManage',
    component: Layout,
    meta: { title: '企业管理',icon: 'el-icon-office-building' },
    redirect: '/enterpriseManage/basicInfo',
    alwaysShow: true,
    children: [
      {
        path: 'addressBook',
        name: 'addressBook',
        component: () => import('@/views/enterpriseManage/addressBook/index'),
        meta: { title: '通讯录',icon: 'el-icon-notebook-2', noCache: true}
      },
      {
        path: 'processManage',
        name: 'processManage',
        component: () => import('@/views/enterpriseManage/processManage/index'),
        meta: { title: '流程管理',icon: 'el-icon-refresh',noCache:true }
      },
      {
        path: 'inventoryManage',
        name: 'inventoryManage',
        component: EmptyLayout,
        meta: { title: '库存管理',icon: 'el-icon-house' },
        redirect: '/enterpriseManage/inventoryManage/safeStock',
        alwaysShow: true,
        children: [
          {
            path: 'elementsManage',
            name: 'elementsManage',
            component: () => import('@/views/enterpriseManage/elementsManage/index'),
            meta: { title: '物料管理',icon: 'el-icon-coin' },
          },
          {
            path: 'safeStock',
            name: 'safeStock',
            component: () => import('@/views/enterpriseManage/safeStock/index'),
            meta: { title: '安全库存',icon: 'el-icon-lock' },
          },
          {
            path: 'setSafeStock',
            name: 'safeStock',
            component: () => import('@/views/enterpriseManage/safeStock/index'),
            meta: { title: '设置安全库存',isChecked:true },
            hidden: true
          },
          {
            path: 'addElements',
            name: 'elementsEdit',
            component: () => import('@/views/enterpriseManage/elementsEdit/index'),
            meta: { title: '添加物料', activeMenu: '/enterpriseManage/inventoryManage/elementsManage'},
            hidden: true
          },
          {
            path: 'elementsEdit',
            name: 'elementsEdit',
            component: () => import('@/views/enterpriseManage/elementsEdit/index'),
            meta: { title: '编辑物料', activeMenu: '/enterpriseManage/inventoryManage/elementsManage', isEdit: true},
            hidden: true
          }
        ]
      },
      {
        path: 'categoryManage',
        name: 'categoryManage',
        component: () => import('@/views/enterpriseManage/categoryManage/index'),
        meta: { title: '品类管理',icon: 'el-icon-set-up',noCache: true }
      },
      {
        path: 'basicInfo',
        name: 'basicInfo',
        component: () => import('@/views/enterpriseManage/basicInfo/index'),
        meta: { title: '基本信息',icon: 'el-icon-info', noCache: true}
      },
      {
        path: 'addStaff',
        name: 'staffEdit',
        component: () => import('@/views/enterpriseManage/staffEdit/index'),
        meta: { title: '添加成员', activeMenu: '/enterpriseManage/addressBook'},
        hidden: true
      },
      {
        path: 'staffEdit/:staff_id(\\d+)',
        name: 'staffEdit',
        component: () => import('@/views/enterpriseManage/staffEdit/index'),
        meta: { title: '编辑成员', activeMenu: '/enterpriseManage/addressBook', noCache: true, isEdit: true},
        hidden: true
      },
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]
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
