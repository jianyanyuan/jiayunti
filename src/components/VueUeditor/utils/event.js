/*
 * @Author: 张飞达
 * @Date: 2020-10-28 08:35:25
 * @LastEditors: 张飞达
 * @LastEditTime: 2020-10-28 08:40:35
 * @Description:简单的事件订阅发布的实现
 */
function LoadEvent() {
  this.listeners = {}
  this.on = function(eventName, callback) {
    if (this.listeners[eventName] === undefined) {
      this.listeners[eventName] = []
    }
    this.listeners[eventName].push(callback)
  }
  this.emit = function(eventName) {
    this.listeners[eventName] && this.listeners[eventName].forEach(callback => callback())
  }
}
export default LoadEvent
