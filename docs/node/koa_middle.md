# KOA 中间件机制和实现

一直觉得`koa`中间件很复杂，可能用`AST抽象语法树`来做的方法分割，看了一下源码发现，这中间件机制也太巧妙了,用的`next`来做分割，`await next()` 调用下一个中间件

## 先上一段代码

```js
class Middle {
  constructor() {
    this.middleList = []
  }
  add(fn) {
    this.middleList.push(fn)
  }

  compose() {
    const self = this
    return function(ctx, next) {
      return dispatch(0)

      function dispatch(i) {
        const fn = i <= self.middleList.length ? self.middleList[i] : next
        // 如果数组越界，就调用next,如果没有next 就 返会成功
        if (!fn) return Promise.resolve()
        // 异步完成 (对应 async (ctx)=> ...) 这个异步方法
        // 递归调用中间件的下一个方法
        return Promise.resolve(fn(ctx, dispatch.bind(ctx, i + 1)))
      }
    }
  }
}
let middle = new Middle()
middle.add(async (ctx, next) => {
  console.log(1)
  await next()
  console.log('1,end')
})

middle.add(async (ctx, next) => {
  console.log(2)
  await next()
  console.log('2,end')
})
const ctx = {}
middle.compose()(ctx)
```
## 过程剖析
- app.use

`use`对应我这里的`add`方法,中间件添加到`list`中

先执行`compose`返会一个方法，方法接收`(ctx,next)` 在调用执行第一个中间件方法，并递归调用中间件


!['koa中间件'](/imgs/koa_middle.jpg)


## 总结就是三点：

1. 递归执行中间件方法
2. next = 调用下一个方法
3.  事件模型依照栈中的调用链依次结束
