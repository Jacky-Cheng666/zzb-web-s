
/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        time = parseInt(time)
      } else {
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

export function deepClone(target) {
  // 定义一个变量
  let result
  // 如果当前需要深拷贝的是一个对象的话
  if (typeof target === 'object') {
  // 如果是一个数组的话
      if (Array.isArray(target)) {
          result = [] // 将result赋值为一个数组，并且执行遍历
          for (let i in target) {
              // 递归克隆数组中的每一项
              result.push(deepClone(target[i]))
          }
          // 判断如果当前的值是null的话；直接赋值为null
      } else if (target === null) {
          result = null
          // 判断如果当前的值是一个RegExp对象的话，直接赋值
      } else if (target.constructor === RegExp) {
          result = target
      } else {
          // 否则是普通对象，直接for in循环，递归赋值对象的所有值
          result = {}
          for (let i in target) {
              result[i] = deepClone(target[i])
          }
      }
      // 如果不是对象的话，就是基本数据类型，那么直接赋值
  } else {
      result = target
  }
  // 返回最终结果
  return result
}

/**
 * @param {number|strint} value
 * @param {object} item
 * @returns {boolean}
 */
export function filterFun(value ,item){
  for (let k in item) {
    if (typeof item[k] == "string" || typeof item[k] == "number") {
        if (item[k].toString().toLowerCase().includes(value.toLowerCase())) {
            return true;
        }
    } else if (typeof item[k] == "object") {
        if (filterFun(value, item[k])) {
            return true;
        }
    }
  }
  return false;
}

export function localeCompare(itemA, itemB) {
  if (itemA && itemB) {
    return 2;
  }

  if (!itemA && !itemB) {
    return 0;
  }

  if (!itemA) {
    return -1;
  }

  if (!itemB) {
    return 1;
  }
}