function formatNumber(n) {
  n = n.toString();
  return n[1] ? n : '0' + n;
}

const fns = {
  //搜索过滤
  handleSearchInfo(that,page,value,tableData){
    let _this = that
    let arr = []

    if (value == "") {
      arr = tableData
    } else {
      arr = tableData.filter(item => {
        let result = false
        function searchTable(obj){
          if(obj == null || typeof obj == "boolean"){
            return 
          } else if(typeof obj !== 'object'){ //item不是object
            //直接匹配
            if (String(obj).toUpperCase().indexOf(value.toUpperCase()) != -1) { //匹配成功
              result = true
              return
            }
          } else{ //item是object
            for(let key in obj){
              if(obj.hasOwnProperty(key)){
                //匹配key对应的value
                searchTable(obj[key])
              }
            }
          }
        }
        searchTable(item)
        return result
      })
    }

    _this.rows = arr
    _this.queryParams.currentPage = page
    _this.queryParams.count = arr.length
    _this.tableData = arr.slice(_this.queryParams.pageSize * (_this.queryParams.currentPage - 1), _this.queryParams.pageSize * _this.queryParams.currentPage)
  },
  //过滤函数
  handleFilter(item){
    let result = false
    function searchTable(obj){
      if(typeof obj !== 'object'){ //item不是object
        //直接匹配
        if (String(obj).indexOf(value) != -1) { //匹配成功
          result = true
          return
        }
      } else if(obj == null || typeof obj == "boolean"){
        return 
      } else{ //item是object
        for(let key in obj){
          if(obj.hasOwnProperty(key)){
            //匹配key对应的value
            searchTable(obj[key])
          }
        }
      }
    }
    searchTable(item)
    return result
  },
  //备注
  getRemark(remark, tipLength) {
    if (!remark) {
      return ""
    }
    let maxTipLength = 15;
    if (tipLength) {
      maxTipLength = tipLength;
    }

    if (maxTipLength < remark.length) {
      let remarkTemp = remark.slice(0, maxTipLength) + "...";
      return remarkTemp;
    }
    else {
      return remark;
    }
  },
  //分页
  handleSizeChange(that,val) {  //每页多少条
    let _this = that
    _this.pageSize=val
    _this.tableData = _this.rows.slice(_this.pageSize * (_this.currentPage - 1), _this.pageSize * _this.currentPage)
  },
  handleCurrentChange(that,val) {  //当前多少页
    let _this = that
    _this.currentPage = val;
    _this.tableData = _this.rows.slice(_this.pageSize * (_this.currentPage - 1), _this.pageSize * _this.currentPage)
  },
  showTotal(that) {
    let _this = that
    _this.count=_this.rows.length
    _this.tableData = _this.rows.slice(_this.pageSize * (_this.currentPage - 1), _this.pageSize * _this.currentPage)
  },
  //物料tooltip
  showMaterialTooltip(row){
    let guestElementCode = row.element_info.guest_element_code || "无"
    let elementCode = row.element_info.element_code || "无"
    let specCode = row.element_info.spec_code || "无"
    let brand = row.element_info.brand || "无"
    let unit = row.element_info.unit || "无"
    let buyTypeName = row.buy_info.buy_type_name || "无"

    let tmp = "客户物料代码：" + guestElementCode + "，我方代码：" + elementCode + "，规格型号："+ specCode + "，材质/品牌：" + brand + "，单位："+ unit + "，购买类型：" + buyTypeName
    return tmp
  },
  //取两位小数
  fixFloat2(val) {
    return Math.round(val * 100) / 100;
  },
  fixFloat3(val) {
    return Math.round(val * 1000) / 1000;
  },
  fixFloat4(val) {
    return Math.round(val * 10000) / 10000;
  },
  fixFloat6(val) {
    return Math.round(val * 1000000) / 1000000;
  },
  //时间格式转化
  getFormatDate(time) {
    var date = time || new Date();
    var seperator = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var nowDate = date.getDate();
    var nowHour = date.getHours();;
    var nowMin = date.getMinutes();
    var nowSec = date.getSeconds();
    if(month >=1 && month <=9) {
      month = "0" + month;
    }
    if(nowDate >=0 && nowDate <=9) {
      nowDate = "0" + nowDate;
    }
    if(nowHour >=0 && nowHour <=9) {
      nowHour = "0" + nowHour;
    }
    if(nowMin >=0 && nowMin <=9) {
      nowMin = "0" + nowMin;
    }
    if(nowSec >=0 && nowSec <=9) {
      nowSec = "0" + nowSec;
    }
    var newDate = year + seperator + month + seperator + nowDate + " " + nowHour + ":" + nowMin + ":" + nowSec;
    return newDate;
  },
  getFormatDateShort(time) {
    var date = time || new Date();
    var seperator = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var nowDate = date.getDate();
    if(month >=1 && month <=9) {
      month = "0" + month;
    }
    if(nowDate >=0 && nowDate <=9) {
      nowDate = "0" + nowDate;
    }
    
    var newDate = year + seperator + month + seperator + nowDate;
    return newDate;
  },
  formatDateToStr: function(date) {
    var year = date.getFullYear() % 100;
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();

    return [year, month, day, hour, minute, second].map(formatNumber).join('');
  },
  handleSort(that, sortOrder, propArr, propType){
    let _this = that
    if(sortOrder === 'descending'){
      _this.rows.sort((a, b) => {
        if(propType === "number"){
          if(propArr.length === 1){
            let m = a[propArr[0]]?a[propArr[0]]:0
            let n = b[propArr[0]]?b[propArr[0]]:0
            return m - n
          } else if(propArr.length === 2){
            let m = a[propArr[0]][propArr[1]]?a[propArr[0]][propArr[1]]:0
            let n = b[propArr[0]][propArr[1]]?b[propArr[0]][propArr[1]]:0
            return m - n
          }
        } else if(propType === "string"){
          if(propArr.length === 1){
            if(a[propArr[0]]){
              return a[propArr[0]].localeCompare(b[propArr[0]])
            }
          } else if(propArr.length === 2){
            if(a[propArr[0]]){
              return a[propArr[0]][propArr[1]].localeCompare(b[propArr[0]][propArr[1]])
            }
          }
        }
      })
    } else if(sortOrder === 'ascending'){
      _this.rows.sort((a, b) => {
        if(propType === "number"){
          if(propArr.length === 1){
            let m = a[propArr[0]]?a[propArr[0]]:0
            let n = b[propArr[0]]?b[propArr[0]]:0
            return n - m
          } else if(propArr.length === 2){
            let m = a[propArr[0]][propArr[1]]?a[propArr[0]][propArr[1]]:0
            let n = b[propArr[0]][propArr[1]]?b[propArr[0]][propArr[1]]:0
            return n - m
          }
        } else if(propType === "string"){
          if(propArr.length === 1){
            if(b[propArr[0]]){
              return b[propArr[0]].localeCompare(a[propArr[0]])
            }
          } else if(propArr.length === 2){
            if(b[propArr[0]][propArr[1]]){
              return b[propArr[0]][propArr[1]].localeCompare(a[propArr[0]][propArr[1]])
            }
          }
        }
      })
    }
  },
  matchSpecialCharacter(str) {
    return false
    if(str.length <= 0){
      return false
    }
    let rules = /[!#$&*\/]/im
    // if(isDateAccess && isBrandAccess){
    //   rules = /[!$&*()']/im
    // } else if(isDateAccess && !isBrandAccess){
    //   rules = /[!#$&*()']/im
    // } else if(!isDateAccess && isBrandAccess){
    //   rules = /[!$&*()\/']/im
    // } else {
    //   rules = /[!#$&*()\/']/im
    // }

    if (rules.test(str)) {
      return true
    } else{
      return false
    }
  },
  //全匹配检测特殊字符
  matchAllForSpecialCharater(list, callback) {
    if(list.length <= 0){
      callback({
        code: 0
      })
      return
    }

    let errorList = []
    let errorMessage = []

    list.forEach((row, index) => {
      if(row.length <= 0){
        return false
      }
      row.forEach((ele, num) => {
        if(fns.matchSpecialCharacter(ele)){
          errorList.push({
            row: index,
            column: num,
            content: ele
          })
        }
      })
    })

    errorList.forEach(item => {
      let rowIndex = item.row + 1
      let columnIndex = item.column + 1
      let contentIndex = item.content
      errorMessage.push('第' + rowIndex + '行-第' + columnIndex + '列(' + contentIndex + ')')
    })
    
    if(errorMessage.length <= 0){
      callback({
        code: 0
      })
    } else{
      callback({
        code: 1,
        error_message: '以下内容包含特殊字符: ' + errorMessage + '，请检查！！！'
      })
    }
  }
}

export default fns