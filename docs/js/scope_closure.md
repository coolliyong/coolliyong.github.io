# 作用域和闭包

```js
var scope = 'global scope'

function checkscope() {
  var scope = 'local scope'

  function f() {
    return scope
  }
  // 静态编译 :记录当前 scope
  return f
}
console.log(checkscope()())
```
