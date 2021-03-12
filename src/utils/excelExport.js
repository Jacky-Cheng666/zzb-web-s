var path = require('path');
var fs = require('fs');
const ExcelJS = require('exceljs');

const basic = {
	digitUppercase: function (value) {
		const fraction = ['角', '分'];
		const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
		const unit = [
			['元', '万', '亿'],
			['', '拾', '佰', '仟'],
		];
		let num = Math.abs(value);
		let s = '';
		fraction.forEach((item, index) => {
			s += (digit[Math.floor(num * 10 * (10 ** index)) % 10] + item).replace(/零./, '');
		});
		s = s || '整';
		num = Math.floor(num);
		for (let i = 0; i < unit[0].length && num > 0; i += 1) {
			let p = '';
			for (let j = 0; j < unit[1].length && num > 0; j += 1) {
				p = digit[num % 10] + unit[1][j] + p;
				num = Math.floor(num / 10);
			}
			s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
		}

		return s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
	},
	fixFloat2: function (val) {
		return Math.round(val * 100) / 100;
	},
	fixFloat6: function (val) {
		return Math.round(val * 1000000) / 1000000;
	}
}

const defaultStyle = {
  fontStyle: { size: 10 },
  lineHeight: 15,
  alignment: {
    vertical: 'middle',
    horizontal: 'left'
  },
  border: {
    top: 'thin',
    left: 'thin',
    bottom: 'thin',
    right: 'thin',
  },
}

const indexForm = [
  "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"
]

var excelExport = {
	exportOrderSheet: async function (orderInfo, sheetName, data, rules, fileName, callback) {
		var workbook = new ExcelJS.Workbook();
		var worksheet = workbook.addWorksheet(sheetName);

    let tmpList = []
    rules.columns.forEach(item => {
      tmpList.push(item)
    })
    worksheet.columns = tmpList;

    let tableColumnsLength = worksheet.columns.length
    let startRow = rules.topStyles.length + 2
    let currentRow = data.length + startRow;
    let inscribeStartRow = rules.bottomStyles? (rules.bottomStyles.length + currentRow + 1) : (currentRow + 1);
    //表格上面几行
    excelExport.setSheetTopRows(worksheet, orderInfo, rules, tableColumnsLength)
    //表格
    excelExport.setSheetTableRows(worksheet, orderInfo, rules, data, startRow)
    //表格下方合计
    excelExport.setSheetBottomRows(worksheet, orderInfo, rules, currentRow)
    //落款
    excelExport.setSheetInscribeRows(worksheet, orderInfo, rules, inscribeStartRow)

    let buffer = await workbook.xlsx.writeBuffer();
		let obj = new Blob([excelExport.s2ab(buffer)], {
			type: ""
    })
		excelExport.saveAs(obj, fileName)
	},
	writeOrderSheetToFile: function (orderInfo, rules, fileName, sheetName) {
    let elementList = []
    let tableHeaderList = []
    rules.columns.forEach(item => {
      tableHeaderList.push(item.header)
    })
    elementList.push(tableHeaderList)

		for (let i = 0; i < orderInfo.element_list.length; i++) {
      let element = [i + 1]
      rules.columns.forEach(item => {
        if(item.key !== 'id'){
          element.push(orderInfo.element_list[i][item.key])
        }
      })

			elementList.push(element);
    }
		excelExport.exportOrderSheet(orderInfo, sheetName, elementList, rules, fileName, function (filePath) {
			//导出为格式化的excel
		});
  },
  setSheetTopRows: function(worksheet, orderInfo, rules, columns){
    if(!rules.topStyles){
      return
    }
    if(columns > 1){
      rules.topStyles.forEach((row, index) => {
        if(row){
          //合并单元格
          let currentRowIndex = ''
          let startPosition = ''
          let endtPosition = ''
          let startAndEndPosition = ''
          if(row.index){
            currentRowIndex = row.index.toString()
            startPosition = indexForm[0] + currentRowIndex
            endtPosition = indexForm[columns - 1] + currentRowIndex
            startAndEndPosition = startPosition + ":" + endtPosition
            worksheet.mergeCells(startAndEndPosition);
          }

          //设置每一行样式
          let topRowsBorderTop = ''
          let topRowsBorderLeft = ''
          let topRowsBorderBottom = ''
          let topRowsBorderRight = ''
          let topRowsAlignmentVertical = ''
          let topRowsAlignmentHorizontal = ''
          let topRowsFontStyle = null
          let topRowsHeight = ''
          if(row.border && row.border.top){
            topRowsBorderTop = row.border.top
          }
          if(row.border && row.border.left){
            topRowsBorderLeft = row.border.left
          }
          if(row.border && row.border.bottom){
            topRowsBorderBottom = row.border.bottom
          }
          if(row.border && row.border.right){
            topRowsBorderRight = row.border.right
          }
          if(row.alignment && row.alignment.vertical){
            topRowsAlignmentVertical = row.alignment.vertical
          }
          if(row.alignment && row.alignment.horizontal){
            topRowsAlignmentHorizontal = row.alignment.horizontal
          }
          if(row.font){
            topRowsFontStyle = row.font
          }
          if(row.height){
            topRowsHeight = row.height
          }

          topRowsBorderTop = topRowsBorderTop?topRowsBorderTop:defaultStyle.border.top
          topRowsBorderLeft = topRowsBorderLeft?topRowsBorderLeft:defaultStyle.border.left
          topRowsBorderBottom = topRowsBorderBottom?topRowsBorderBottom:defaultStyle.border.bottom
          topRowsBorderRight = topRowsBorderRight?topRowsBorderRight:defaultStyle.border.right
          topRowsAlignmentVertical = topRowsAlignmentVertical?topRowsAlignmentVertical:defaultStyle.alignment.vertical
          topRowsAlignmentHorizontal = topRowsAlignmentHorizontal?topRowsAlignmentHorizontal:defaultStyle.alignment.horizontal
          topRowsFontStyle = topRowsFontStyle?topRowsFontStyle:defaultStyle.fontStyle
          topRowsHeight = topRowsHeight?topRowsHeight:defaultStyle.lineHeight

          worksheet.getCell(startPosition).alignment = {
            vertical: topRowsAlignmentVertical,
            horizontal: topRowsAlignmentHorizontal
          }
          worksheet.getRow(row.index).font = row.font?row.font:defaultStyle.fontStyle
          worksheet.getRow(row.index).height = row.height?row.height:defaultStyle.lineHeight
          //设置每一行内容
          if(row.content){
            let rowContent = ''
            row.content.forEach(item => {
              let keyContent = item.key?item.key:''
              let valueContent = orderInfo[item.valueName]?orderInfo[item.valueName]:''
              rowContent += keyContent + valueContent + '  '
            })
            worksheet.getCell(startPosition).value = rowContent
          }
        }
      })
    } else if(columns === 1){
      if(rules.topStyles && rules.topStyles[0]){
        let row = rules.topStyles[0]
        worksheet.getCell('A1').alignment = {
          vertical: row.vertical?row.vertical:defaultStyle.alignment.vertical,
          horizontal: row.horizontal?row.horizontal:defaultStyle.alignment.horizontal
        }
        worksheet.getRow(1).font = row.font?row.font:defaultStyle.fontStyle
        worksheet.getRow(1).height = row.height?row.height:defaultStyle.lineHeight
        if(row.content){
          let rowContent = ''
          row.content.forEach(item => {
            rowContent += item.key + item.valueName + '  '
          })
          worksheet.getCell('A1').value = rowContent
        }
      }
    }
  },
  setSheetTableRows(worksheet, orderInfo, rules, data, startRow){
    //表格样式
    let tableCellBorderTop = ''
    let tableCellBorderLeft = ''
    let tableCellBorderBottom = ''
    let tableCellBorderRight = ''
    let tableCellAlignmentVertical = ''
    let tableCellAlignmentHorizontal = ''
    let tableCellFontStyle = null
    let tableHeaderHeight = ''
    let tableCellHeight = ''
    if(rules.tableStyle && rules.tableStyle.cell && rules.tableStyle.cell.border && rules.tableStyle.cell.border.top){
      tableCellBorderTop = rules.tableStyle.cell.border.top
    }
    if(rules.tableStyle && rules.tableStyle.cell && rules.tableStyle.cell.border && rules.tableStyle.cell.border.left){
      tableCellBorderLeft = rules.tableStyle.cell.border.left
    }
    if(rules.tableStyle && rules.tableStyle.cell && rules.tableStyle.cell.border && rules.tableStyle.cell.border.bottom){
      tableCellBorderBottom = rules.tableStyle.cell.border.bottom
    }
    if(rules.tableStyle && rules.tableStyle.cell && rules.tableStyle.cell.border && rules.tableStyle.cell.border.right){
      tableCellBorderRight = rules.tableStyle.cell.border.right
    }
    if(rules.tableStyle && rules.tableStyle.cell && rules.tableStyle.cell.alignment && rules.tableStyle.cell.alignment.vertical){
      tableCellAlignmentVertical = rules.tableStyle.cell.alignment.vertical
    }
    if(rules.tableStyle && rules.tableStyle.cell && rules.tableStyle.cell.alignment && rules.tableStyle.cell.alignment.horizontal){
      tableCellAlignmentHorizontal = rules.tableStyle.cell.alignment.horizontal
    }
    if(rules.tableStyle && rules.tableStyle.font){
      tableCellFontStyle = rules.tableStyle.font
    }
    if(rules.tableStyle && rules.tableStyle.headerHeight){
      tableHeaderHeight = rules.tableStyle.headerHeight
    }
    if(rules.tableStyle && rules.tableStyle.cell && rules.tableStyle.cell.height){
      tableCellHeight = rules.tableStyle.cell.height
    }

    tableCellBorderTop = tableCellBorderTop?tableCellBorderTop:defaultStyle.border.top
    tableCellBorderLeft = tableCellBorderLeft?tableCellBorderLeft:defaultStyle.border.left
    tableCellBorderBottom = tableCellBorderBottom?tableCellBorderBottom:defaultStyle.border.bottom
    tableCellBorderRight = tableCellBorderRight?tableCellBorderRight:defaultStyle.border.right
    tableCellAlignmentVertical = tableCellAlignmentVertical?tableCellAlignmentVertical:defaultStyle.alignment.vertical
    tableCellAlignmentHorizontal = tableCellAlignmentHorizontal?tableCellAlignmentHorizontal:defaultStyle.alignment.horizontal
    tableCellFontStyle = tableCellFontStyle?tableCellFontStyle:defaultStyle.fontStyle
    tableHeaderHeight = tableHeaderHeight?tableHeaderHeight:defaultStyle.lineHeight
    tableCellHeight = tableCellHeight?tableCellHeight:defaultStyle.lineHeight

    let tableCellBorder = {
      top: { style: tableCellBorderTop },
      left: { style: tableCellBorderLeft },
      bottom: { style: tableCellBorderBottom },
      right: { style: tableCellBorderRight }
    }
    let tableCellAlignment = {
      vertical: tableCellAlignmentVertical,
      horizontal: tableCellAlignmentHorizontal
    }
    //表格内容
    for (let row = 0; row < data.length; row++) {
      worksheet.getRow(row + startRow).font = tableCellFontStyle
      if(row === 0){
        worksheet.getRow(row + startRow).height = tableHeaderHeight
      } else{
        worksheet.getRow(row + startRow).height = tableCellHeight
      }
			data[row].forEach(function (value, index) {
        let cell = worksheet.getCell(row + startRow, index + 1);
				cell.border = tableCellBorder
				cell.alignment = tableCellAlignment
				cell.value = value;
			});
		}
  },
  setSheetBottomRows(worksheet, orderInfo, rules, currentRow){
    if(!rules.bottomStyles){
      return
    }
    rules.bottomStyles.forEach(row => {
      let startIndex = 1
      let endIndex = 1

      let bottomRowsBorderTop = ''
      let bottomRowsBorderLeft = ''
      let bottomRowsBorderBottom = ''
      let bottomRowsBorderRight = ''
      let bottomRowsAlignmentVertical = ''
      let bottomRowsAlignmentHorizontal = ''
      let bottomRowsFontStyle = null
      let bottomRowsHeight = ''

      if(row.border && row.border.top){
        bottomRowsBorderTop = row.border.top
      }
      if(row.border && row.border.left){
        bottomRowsBorderLeft = row.border.left
      }
      if(row.border && row.border.bottom){
        bottomRowsBorderBottom = row.border.bottom
      }
      if(row.border && row.border.right){
        bottomRowsBorderRight = row.border.right
      }
      if(row.alignment && row.alignment.vertical){
        bottomRowsAlignmentVertical = row.alignment.vertical
      }
      if(row.alignment && row.alignment.horizontal){
        bottomRowsAlignmentHorizontal = row.alignment.horizontal
      }
      if(row.font){
        bottomRowsFontStyle = row.font
      }
      if(row.height){
        bottomRowsHeight = row.height
      }

      bottomRowsBorderTop = bottomRowsBorderTop?bottomRowsBorderTop:defaultStyle.border.top
      bottomRowsBorderLeft = bottomRowsBorderLeft?bottomRowsBorderLeft:defaultStyle.border.left
      bottomRowsBorderBottom = bottomRowsBorderBottom?bottomRowsBorderBottom:defaultStyle.border.bottom
      bottomRowsBorderRight = bottomRowsBorderRight?bottomRowsBorderRight:defaultStyle.border.right
      bottomRowsAlignmentVertical = bottomRowsAlignmentVertical?bottomRowsAlignmentVertical:defaultStyle.alignment.vertical
      bottomRowsAlignmentHorizontal = bottomRowsAlignmentHorizontal?bottomRowsAlignmentHorizontal:defaultStyle.alignment.horizontal
      bottomRowsFontStyle = bottomRowsFontStyle?bottomRowsFontStyle:defaultStyle.fontStyle
      bottomRowsHeight = bottomRowsHeight?bottomRowsHeight:defaultStyle.lineHeight

      let bottomRowsBorder = {
        top: { style: bottomRowsBorderTop },
        left: { style: bottomRowsBorderLeft },
        bottom: { style: bottomRowsBorderBottom },
        right: { style: bottomRowsBorderRight }
      }
      let bottomRowsAlignment = {
        vertical: bottomRowsAlignmentVertical,
        horizontal: bottomRowsAlignmentHorizontal
      }
      
      row.content.forEach(item => {
        let itemContentKey = item.key?item.key:''
        let itemContentValueName = (orderInfo[item.valueName] || orderInfo[item.valueName] === 0)?orderInfo[item.valueName]:''
        let itemContent = itemContentKey? (itemContentKey + ":" + itemContentValueName) : ''
        endIndex = startIndex + item.columns - 1
        worksheet.mergeCells(currentRow, startIndex, currentRow, endIndex)
        worksheet.getRow(currentRow).height = bottomRowsHeight
        worksheet.getRow(currentRow).font = bottomRowsFontStyle
        worksheet.getCell(currentRow, startIndex).border = bottomRowsBorder
        worksheet.getCell(currentRow, startIndex).alignment = bottomRowsAlignment
        worksheet.getCell(currentRow, startIndex).value = itemContent

        startIndex += item.columns
      })

      currentRow ++
    })
  },
  setSheetInscribeRows(worksheet, orderInfo, rules, inscribeStartRow){
    if(!rules.inscribeStyles){
      return
    }
    rules.inscribeStyles.forEach(row => {
      let startIndex = 1
      let endIndex = 1

      let inscribeRowsBorderTop = ''
      let inscribeRowsBorderLeft = ''
      let inscribeRowsBorderBottom = ''
      let inscribeRowsBorderRight = ''
      let inscribeRowsAlignmentVertical = ''
      let inscribeRowsAlignmentHorizontal = ''
      let inscribeRowsFontStyle = null
      let inscribeRowsHeight = ''

      if(row.border && row.border.top){
        inscribeRowsBorderTop = row.border.top
      }
      if(row.border && row.border.left){
        inscribeRowsBorderLeft = row.border.left
      }
      if(row.border && row.border.bottom){
        inscribeRowsBorderBottom = row.border.bottom
      }
      if(row.border && row.border.right){
        inscribeRowsBorderRight = row.border.right
      }
      if(row.alignment && row.alignment.vertical){
        inscribeRowsAlignmentVertical = row.alignment.vertical
      }
      if(row.alignment && row.alignment.horizontal){
        inscribeRowsAlignmentHorizontal = row.alignment.horizontal
      }
      if(row.font){
        inscribeRowsFontStyle = row.font
      }
      if(row.height){
        inscribeRowsHeight = row.height
      }

      inscribeRowsBorderTop = inscribeRowsBorderTop?inscribeRowsBorderTop:defaultStyle.border.top
      inscribeRowsBorderLeft = inscribeRowsBorderLeft?inscribeRowsBorderLeft:defaultStyle.border.left
      inscribeRowsBorderBottom = inscribeRowsBorderBottom?inscribeRowsBorderBottom:defaultStyle.border.bottom
      inscribeRowsBorderRight = inscribeRowsBorderRight?inscribeRowsBorderRight:defaultStyle.border.right
      inscribeRowsAlignmentVertical = inscribeRowsAlignmentVertical?inscribeRowsAlignmentVertical:defaultStyle.alignment.vertical
      inscribeRowsAlignmentHorizontal = inscribeRowsAlignmentHorizontal?inscribeRowsAlignmentHorizontal:defaultStyle.alignment.horizontal
      inscribeRowsFontStyle = inscribeRowsFontStyle?inscribeRowsFontStyle:defaultStyle.fontStyle
      inscribeRowsHeight = inscribeRowsHeight?inscribeRowsHeight:defaultStyle.lineHeight

      let inscribeRowsBorder = {
        top: { style: inscribeRowsBorderTop },
        left: { style: inscribeRowsBorderLeft },
        bottom: { style: inscribeRowsBorderBottom },
        right: { style: inscribeRowsBorderRight }
      }
      let inscribeRowsAlignment = {
        vertical: inscribeRowsAlignmentVertical,
        horizontal: inscribeRowsAlignmentHorizontal
      }
      
      row.content.forEach(item => {
        let itemContentKey = item.key?item.key:''
        let itemContentValueName = orderInfo[item.valueName]?orderInfo[item.valueName]:''
        let itemContent = itemContentKey? (itemContentKey + ":" + itemContentValueName) : ''
        endIndex = startIndex + item.columns - 1
        worksheet.mergeCells(inscribeStartRow, startIndex, inscribeStartRow, endIndex)
        worksheet.getRow(inscribeStartRow).height = inscribeRowsHeight
        worksheet.getRow(inscribeStartRow).font = inscribeRowsFontStyle
        worksheet.getCell(inscribeStartRow, startIndex).border = inscribeRowsBorder
        worksheet.getCell(inscribeStartRow, startIndex).alignment = inscribeRowsAlignment
        worksheet.getCell(inscribeStartRow, startIndex).value = itemContent

        startIndex += item.columns
      })

      inscribeStartRow ++
    })
  },
	s2ab: function (s) {
		if (typeof ArrayBuffer !== 'undefined') {
			var buf = s.buffer;
			// console.log(s)
			// console.log(buf)
			// var view = s;
			// for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
			return buf;
		} else {
			var buf = new Array(s.length);
			for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
			return buf;
		}
	},
	saveAs: function (obj, fileName) {
		let tmpa = document.createElement("a");
		tmpa.download = fileName;
		tmpa.href = URL.createObjectURL(obj);
		tmpa.click();
		setTimeout(function () {
			URL.revokeObjectURL(obj);
		}, 100);
	}
};



module.exports = excelExport;