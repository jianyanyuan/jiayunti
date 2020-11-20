/*
 * @Author: zfd
 * @Date: 2020-10-20 08:23:03
 * @LastEditors: zfd
 * @LastEditTime: 2020-11-16 08:13:34
 * @Description: 适用于element ui form rule validator
 */

/**
 * 用户名校验
 * 字母开头，3-17位数字和英文符号组合
 * @param {规则} rule
 * @param {带校验值} value
 * @param {回调函数} callback
 */
export function validateUsername(rule, value, callback) {
  if (!value) {
    // 非 '' undefined null
    callback(new Error('请输入用户名'))
  } else {
    const reg = /^[^0-9][a-zA-z0-9_.@~!?\u4e00-\u9fa5]{2,16}$/
    if (!reg.test(value)) {
      callback(new Error('用户名需字母开头，3-17位数字和英文符号组合'))
    } else {
      callback()
    }
  }
}

/**
 * 密码校验
 * 6-17位数字和英文符号组合
 * @param {规则} rule
 * @param {带校验值} value
 * @param {回调函数} callback
 */
export function validatePassword(rule, value, callback) {
  if (!value) {
    // 非 '' undefined null
    callback(new Error('请输入密码'))
  } else {
    const reg = /^[a-zA-z0-9_.@~!?]{6,17}$/
    if (!reg.test(value)) {
      callback(new Error('密码需为6-17位数字和英文符号组合'))
    } else {
      callback()
    }
  }
}

/**
 * 确认密码校验
 * @param {规则} rule
 * @param {带校验值} value
 * @param {回调函数} callback
 */
export function validateConfirmPassword(rule, value, callback) {
  if (!rule || !value) {
    callback(new Error('请输入密码'))
  }
  if (value !== rule) {
    callback(new Error('两次密码不一致'))
  }
  const reg = /^[a-zA-Z0-9_.@~!?]{6,17}$/
  if ((!reg.test(value))) {
    callback(new Error('密码需为6-17为字母、数字及英文符合组合'))
  } else {
    callback()
  }
}

/**
 * 移动手机号校验
 * @param {规则} rule
 * @param {带校验值} value
 * @param {回调函数} callback
 */
export function validatePhone(rule, value, callback) {
  const reg = /^1[3456789]\d{9}$/
  if (!value) {
    callback(new Error('请输入手机号'))
  } else {
    if ((!reg.test(value))) {
      callback(new Error('请输入正确的手机号'))
    } else {
      callback()
    }
  }
}

/**
 * 纯数字验证码校验
 * @param {规则} rule
 * @param {带校验值} value
 * @param {回调函数} callback
 */
export function validateNumberCode(rule, value, callback) {
  if (typeof rule.length !== 'number') {
    callback()
  }
  if (isNaN(+value) || String(value).length !== rule.length) {
    callback(new Error(`验证码应为${rule.length}位纯数字`))
  } else {
    callback()
  }
}

/**
 * 姓名校验
 * 包括少数名族
 * @param {规则} rule
 * @param {带校验值} value
 * @param {回调函数} callback
 */
export function validateTrueName(rule, value, callback) {
  const reg = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/

  if (!value) {
    callback(new Error('请输入姓名'))
  } else {
    if ((!reg.test(value))) {
      callback(new Error('姓名格式有误'))
    } else {
      callback()
    }
  }
}

/**
 * 身份证号码校验
 * @param {规则} rule
 * @param {带校验值} value
 * @param {回调函数} callback
 */
export function validateIdCard(rule, value, callback) {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  if (!value) {
    callback(new Error('请输入身份证号码'))
  } else {
    if ((!reg.test(value))) {
      callback(new Error('请输入正确的身份证号码'))
    } else {
      callback()
    }
  }
}
