var exportRules = {
  offerOrder: {
    //表格的表头
    columns: [
      { header: '序号', key: 'id', width: 6 },
      { header: '物料代码', key: 'element_code', width: 15 },
      { header: '物料名称', key: 'element_name', width: 16 },
      { header: '规格型号', key: 'spec_code', width: 16 },
      { header: '品牌', key: 'brand', width: 9 },
      { header: '单位', key: 'unit', width: 5 },
      { header: '数量', key: 'num', width: 6 },
      { header: '未税单价', key: 'price', width: 9 },
      { header: '税价合计', key: 'include_tax_single_price', width: 9 },
      { header: '交货日期', key: 'delivery_time', width: 10 }
    ],
    //订单上面几行的基础信息
    topStyles: [
      {
        index: 1,
        font: { size: 16, bold: true},
        height: 24,
        border: {
          'top': 'thin',
          'left': 'thin',
          'bottom': 'thin',
          'right': 'thin',
        },
        alignment: {
          'vertical': 'middle',
          'horizontal': 'center'
        },
        content: [
          {
            key: '',
            valueName: 'order_export_type'
          },
          {
            key: '',
            valueName: 'supplier_full_name'
          }
        ]
      },
      {
        index: 2,
        alignment: {
          'horizontal': 'center'
        },
        content: [
          {
            key: '销售人：',
            valueName: 'seller'
          },
          {
            key: '电话：',
            valueName: 'seller_phone'
          },
          {
            key: '报价单号：',
            valueName: 'order_name'
          }
        ]
      },
      {
        index: 3,
        alignment: {
          'horizontal': 'center'
        },
        content: [
          {
            key: '收货地址：',
            valueName: 'receiver_address'
          },
          {
            key: '客户：',
            valueName: 'purchase_full_name'
          }
        ]
      },
      {
        index: 4,
        alignment: {
          'horizontal': 'center'
        },
        content: [
          {
            key: '采购人：',
            valueName: 'buyer'
          },
          {
            key: '电话：',
            valueName: 'buyer_phone'
          }
        ]
      },
      {
        index: 5,
        alignment: {
          'horizontal': 'center'
        },
        content: [
          {
            key: '制单日期：',
            valueName: 'order_date'
          },
          {
            key: '结算方式：',
            valueName: 'pay_period_name'
          },
          {
            key: '结算币种：',
            valueName: 'pay_currency'
          }
        ]
      }
    ],
    //表格样式
    tableStyle: {
      font: { size: 10 },
      headerHeight: 15,
      cell: {
        height: 12,
        border: {
          top: 'thin',
          left: 'thin',
          bottom: 'thin',
          right: 'thin',
        },
        alignment: {
          vertical: 'middle',
          horizontal: 'left'
        }
      }
    },
    //订单下面几行的信息
    bottomStyles: [
      {
        index: 1,
        font: { size: 11 },
        height: 17,
        border: {
          top: 'thin',
          left: 'thin',
          bottom: 'thin',
          right: 'thin',
        },
        alignment: {
          vertical: 'middle',
          horizontal: 'left'
        },
        content: [
          {
            key: '数量合计',
            valueName: 'count_num',
            columns: 3
          },
          {
            key: '折扣',
            valueName: 'on_sale_percent',
            columns: 2
          },
          {
            key: '税率',
            valueName: 'tax_name',
            columns: 5
          }
        ]
      },
      {
        index: 2,
        font: { size: 11 },
        height: 17,
        content: [
          {
            key: '折后未税金额',
            valueName: 'no_tax_total_price',
            columns: 3
          },
          {
            key: '税金',
            valueName: 'only_tax_total_price',
            columns: 2
          },
          {
            key: '税价合计',
            valueName: 'include_tax_total_price',
            columns: 5
          }
        ]
      }
    ]
  },
  archiveOrder: {
    columns: [
      { header: '序号', key: 'id', width: 6 },
      { header: '项目', key: 'task_code', width: 12 },
      { header: '物料代码', key: 'element_code', width: 15 },
      { header: '物料名称', key: 'element_name', width: 16 },
      { header: '规格型号', key: 'spec_code', width: 16 },
      { header: '品牌', key: 'brand', width: 9 },
      { header: '单位', key: 'unit', width: 5 },
      { header: '成交数量', key: 'num', width: 6 },
      { header: '未税单价', key: 'price', width: 9 },
      { header: '税价合计', key: 'include_tax_single_price', width: 9 },
      { header: '交货日期', key: 'delivery_time', width: 10 },
      { header: '备注', key: 'remark', width: 20 },
    ],
    topStyles: [
      {
        index: 1,
        font: { size: 16, bold: true},
        height: 24,
        alignment: {
          'horizontal': 'center'
        },
        content: [
          {
            key: '',
            valueName: 'order_export_type'
          },
          {
            key: '',
            valueName: 'purchase_full_name'
          }
        ]
      },
      {
        index: 2,
        alignment: {
          'horizontal': 'center'
        },
        content: [
          {
            key: '收货人：',
            valueName: 'receiver'
          },
          {
            key: '手机号码：',
            valueName: 'receiver_phone'
          },
          {
            key: '订单编号：',
            valueName: 'order_name'
          }
        ]
      },
      {
        index: 3,
        alignment: {
          'horizontal': 'center'
        },
        content: [
          {
            key: '收货地址：',
            valueName: 'receiver_address'
          },
          {
            key: '下单日期：',
            valueName: 'order_date'
          }
        ]
      },
      {
        index: 4,
        alignment: {
          'horizontal': 'center'
        },
        content: [
          {
            key: '供应商：',
            valueName: 'supplier_full_name'
          },
          {
            key: '结算方式：',
            valueName: 'pay_period_name'
          }
        ]
      },
      {
        index: 5,
        alignment: {
          'horizontal': 'center'
        },
        content: [
          {
            key: '联系人：',
            valueName: 'seller'
          },
          {
            key: '手机号码：',
            valueName: 'seller_phone'
          },
          {
            key: '结算币种：',
            valueName: 'pay_currency'
          }
        ]
      }
    ],
    tableStyle: {
      cell: {
        height: 12
      }
    },
    bottomStyles: [
      {
        index: 1,
        font: { size: 11 },
        height: 17,
        content: [
          {
            key: '数量合计',
            valueName: 'count_num',
            columns: 3
          },
          {
            key: '折扣',
            valueName: 'on_sale_percent',
            columns: 3
          },
          {
            key: '税率',
            valueName: 'tax_name',
            columns: 6
          }
        ]
      },
      {
        index: 2,
        font: { size: 11 },
        height: 17,
        content: [
          {
            key: '折后未税金额',
            valueName: 'no_tax_total_price',
            columns: 3
          },
          {
            key: '税金',
            valueName: 'only_tax_total_price',
            columns: 3
          },
          {
            key: '税价合计',
            valueName: 'include_tax_total_price',
            columns: 6
          }
        ]
      }
    ],
    inscribeStyles: [
      {
        index: 1,
        height: 15,
        border: {
          top: 'none',
          left: "none",
          bottom: "none",
          right: "none"
        },
        content: [
          {
            key: '甲方',
            valueName: 'inscribe_left',
            columns: 6
          },
          {
            key: '乙方',
            valueName: 'inscribe_right',
            columns: 6
          }
        ]
      },
      {
        index: 2,
        height: 15,
        border: {
          top: 'none',
          left: "none",
          bottom: "none",
          right: "none"
        },
        content: [
          {
            key: '采购人',
            valueName: 'inscribe_purchaser',
            columns: 6
          },
          {
            key: '销售人',
            valueName: 'inscribe_seller',
            columns: 6
          }
        ]
      },
      {
        index: 3,
        height: 15,
        border: {
          top: 'none',
          left: "none",
          bottom: "none",
          right: "none"
        },
        content: [
          {
            key: '审核人',
            valueName: 'inscribe_checker_left',
            columns: 6
          },
          {
            key: '审核人',
            valueName: 'inscribe_checker_right',
            columns: 6
          }
        ]
      },
      {
        index: 4,
        height: 15,
        border: {
          top: 'none',
          left: "none",
          bottom: "none",
          right: "none"
        },
        content: [
          {
            key: '审批人',
            valueName: 'inscribe_approve_left',
            columns: 6
          },
          {
            key: '审批人',
            valueName: 'inscribe_approve_right',
            columns: 6
          }
        ]
      }
    ]
  }
}

module.exports = exportRules