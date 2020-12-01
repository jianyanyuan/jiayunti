
/**
 * 检测类型
 * 返回string
 * @param {any} value
 */
export function checkType(value) {
  return Object.prototype.toString.call(value).slice(8, -1)
}

/**
 * 检测空数组
 * 返回boolean
 * 空数组则返回true
 * @param {array} value
 */
export function notEmptyArray(value) {
  if (Array.isArray(value) && value.length > 0) {
    return true
  }
  return false
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

/**
 * 深克隆
 * @param {*} obj
 */
export function deepClone(obj) {
  if (obj === null) return null
  if (obj instanceof Function) return new Function(obj)
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new RegExp(obj)
  if (typeof obj !== 'object') return obj
  const result = new obj.constructor()
  const keys = Object.keys(obj)
  for (const k in obj) {
    if (keys.includes(k)) {
      result[k] = deepClone(obj[k])
    }
  }
  return result
}

/**
 * 防抖函数
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result
  const later = function() {
    // 距上一次触发时间间隔
    const last = +new Date() - timestamp
    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为 immediate === true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }
  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }
    return result
  }
}
