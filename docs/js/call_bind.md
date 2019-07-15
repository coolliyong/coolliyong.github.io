
## call/bind 的模拟实现

```javascript
//call 在指定context 的环境下执行函数
Function.prototype.newCall = function(context, ...args) {
  context.fn = this; // 通过this获取call的函数
  context.fn(...args);
  delete context.fn;
};
// bind:修改 函数的执行环境 并返回新的函数
Function.prototype.newBind = function(context) {
  var fn = this;
  function newThis(...args) {
    context.fn = fn;
    return context.fn(...args);
  }
  return newThis;
};
```

---
