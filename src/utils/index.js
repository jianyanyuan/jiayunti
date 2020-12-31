
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

/**
 * 图片上传之前判断
 * 文件格式为图片,pdf
 * 大小不大于 20M
 * @param {*} file 源文件file.raw
 */
export function checkUpload(file) {
  if (!file.size) {
    this.$message.error('上传为空！')
    return false
  }
  const typeAllowed = /\bpdf|\bimage/i.test(file.type)
  const isBig = file.size <= 1024 * 1024 * 20 // 单个文件最大20M
  if (!typeAllowed) {
    this.$message.error('只能上传图片或pdf！')
    return false
  }
  if (!isBig) {
    this.$message.error('图片大小不能超过20MB！')
    return false
  }
  return true
}

/**
 * utf-8编码的16进制形式
 * @param {*} text
 */
export function encodeUtf8Hex(text) {
  const code = encodeURIComponent(text)
  const bytes = []
  for (var i = 0; i < code.length; i++) {
    const c = code.charAt(i)
    if (c === '%') {
      const hex = code.charAt(i + 1) + code.charAt(i + 2)
      bytes.push(hex)
      i += 2
    } else bytes.push(c.charCodeAt(0).toString(16))
  }
  return bytes
}

export function decodeUtf8Hex(bytes) {
  var encoded = ''
  for (var i = 0; i < bytes.length; i++) {
    encoded += '%' + bytes[i]
  }
  return decodeURIComponent(encoded)
}

/**
 * utf-8编码
 * @param {*} text
 */
export function encodeUtf8(text) {
  const code = encodeURIComponent(text)
  const bytes = []
  for (var i = 0; i < code.length; i++) {
    const c = code.charAt(i)
    if (c === '%') {
      const hex = code.charAt(i + 1) + code.charAt(i + 2)
      const hexVal = parseInt(hex, 16)
      bytes.push(hexVal)
      i += 2
    } else bytes.push(c.charCodeAt(0))
  }
  return bytes
}

export function decodeUtf8(bytes) {
  var encoded = ''
  for (var i = 0; i < bytes.length; i++) {
    encoded += '%' + bytes[i].toString(16)
  }
  return decodeURIComponent(encoded)
}
