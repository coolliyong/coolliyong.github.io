# 函数科里化

- 一个 js 预先处理的思想；利用函数执行时可以形成一个不销毁的作用域的原理，把需要预先处理的内容都存储到这个不销毁的作用域中，并且返回一个小函数，以后我们执行的都是这个小函数，小函数中把之前预先存储的值进行相关操作处理。
- 通常也成为部分求值，给函数分步传递参数，逐步缩小函数的适用范围，逐步求解的过程。
- 预处理
- 延迟计算
- 可以传递需要的参数，等到何时想要结果，再一并计算
- 参数复用
- 有些参数相同，只需要传递一遍即可，不需要每次都传，太繁琐。例如 bind
- 动态创建函数。这可以是在部分计算出结果后，在此基础上动态生成新的函数，处理后面的业务，这样省略了重复计算。或者可以通过将要传入调用函数的参数子集，部分应用到函数中，从而动态创造出一个新函数，这个新函数保存了重复传入的参数（以后不必每次都传）。例如，浏览器添加事件的辅助方法。

```js
// test("chen", 45, 789, 284.2, 178) ==> test2("chen")(45)(789)(284.2)(178)()
// (name, id, num, score, height)
//柯里化
function test(name) {
  return id => {
    return num => {
      return score => {
        return height => {
          console.log(
            `name:${name},id:${id},num:${num},score:${score},height:${height}`
          )
        }
      }
    }
  }
}
//柯里化 调用
test('柯里化')(1)(999)('local')(180)

//柯里化封装
function currying(fn) {
  let args = []
  return function() {
    //生成新的方法
    if (fn.arguments === 0) {
      //没有参数时执行
      fn.call(this, args)
    } else {
      //修改数组的push 绑定到args 上面，参数传入call arguments 的 数组
      Array.prototype.push.call(args, [].splice().call(arguments))
      // 返回argument.callee
      return arguments.callee
    }
  }
}
```
