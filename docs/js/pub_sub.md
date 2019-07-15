## 发布订阅

期望的数据类型
{
  event: [fn1, fn2],
}

```js 
class EventEmitter {
  constructor() {
    this.subs = {}
  }

  /**
   *
   * 注册事件
   * @param {*} event
   * @param {*} cb
   * @memberof EventEmitter
   */
  on(event, cb) {
    // 注册订阅 事件 和增加回调方法
    ;(this.subs[event] || (this.subs[event] = [])).push(cb)
  }

  /**
   *
   * 发布事件
   * @param {*} event
   * @param {*} args
   * @memberof EventEmitter
   */
  trigger(event, ...args) {
    // 执行 事件中回调方法内的所有 函数
    this.subs[event] && this.subs[event].forEach(cb => cb(...args))
  }

  /**
   *
   * 执行一次
   * @param {*} event
   * @param {*} onceCb
   * @memberof EventEmitter
   */
  once(event, onceCb) {
    const cb = (...args) => {
      onceCb(...args)
      // 执行完移除
      this.off(event, onceCb)
    }
    this.on(event, cb)
  }

  /**
   *
   * 移除注册事件
   * @param {*} event
   * @param {*} offCb
   * @memberof EventEmitter
   */
  off(event, offCb) {
    if (this.subs[event]) {
      let index = this.subs[event].findIndex(cb => cb === offCb)
      this.subs[event].splice(index, 1)
      if (!this.subs[event].length) delete this.subs[event]
    }
  }
}

let en1 = new EventEmitter()

en1.on('t', () => {
  console.log('t')
})

en1.trigger('t')
```