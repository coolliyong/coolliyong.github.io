# js Promise 简易实现

promise 特点

- 通过接受一个方法来决定成功或者失败
- 有一个`then`队列和`catch`队列
- 可以链式调用

### 未实现

- ~~Promise.all~~
- ~~Promise.race~~
- ~~Promise.finally~~

### 代码

```js
const _status = ['pendding', 'resolve', 'reject']

// 简易实现 promise

class MyPromise {
  constructor(fun) {
    // 状态
    this.status = _status[0]
    // 当前promise 的返回值
    this.value = null
    // then 执行队列
    this.next = []
    // catch 执行队列
    this.fail = []
    // 直接执行promise 执行的方法，返回参数 resolve,reject
    try {
      fun.call(this, this.resolve.bind(this), this.reject.bind(this))
    } catch (error) {
      // 如果执行失败 直接 执行失败
      this.status = _status[2]
      console.log('promise执行出错')
      this.value = error
    }
  }
  // resolve 并不执行 只是赋值
  resolve(...arg) {
    this.status = _status[1]
    if (arg.length <= 1) {
      this.value = arg[0]
    } else {
      this.value = arg
    }
    // 当状态 resolve 的时候 执行then 队列
    this._runSuccess()
    return this
  }
  // 执行 catch 队列
  _runFail() {
    this.fail.forEach(fn => {
      let val = fn.call(this, this.value)
      this.value = val
    })
    return this
  }
  // 执行 then 队列
  _runSuccess() {
    this.next.forEach(fn => {
      try {
        let val = fn.call(this, this.value)
        this.value = val
      } catch (error) {
        this.status = _status[2]
        this.value = error
        this._runFail()
      }
    })
  }
  // reject 接受 参数且执行 catch 队列
  reject(...arg) {
    this.status = _status[2]
    if (arg.length <= 1) {
      this.value = arg[0]
    } else {
      this.value = arg
    }
    this._runFail()
  }
  //
  then(fun) {
    this.next.push(fun.bind(this))
    return this
  }
  catch(fun) {
    this.fail.push(fun.bind(this))
    return this
  }
}
```

### 调用

```js
new MyPromise((resolve, reject) => {
  setTimeout(() => {
    console.log('resolve')
    resolve('1')
    // reject('1')
  }, 1000)
})
  .then(res => {
    console.log('then res1')
    console.log(res)
    return 2
  })
  .then(res => {
    console.log('then res2')
    console.log(res)
  })
  .catch(err => {
    console.log('catch', err)
  })
```

### 调用执行结果

```
then res1
1
then res2
2
```
