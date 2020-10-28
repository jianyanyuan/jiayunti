/*
 * @Author: 张飞达
 * @Date: 2020-10-28 08:35:18
 * @LastEditors: 张飞达
 * @LastEditTime: 2020-10-28 08:37:50
 * @Description:简单的函数防抖
 */
export default function(fun, delay) {
  let timer = null
  const debounced = function() {
    const ctx = this
    const args = arguments
    if (timer) clearTimeout(timer)
    timer = setTimeout(function() {
      fun.apply(ctx, args)
    }, delay)
  }
  return debounced
}
