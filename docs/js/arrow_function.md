## 箭头函数与普通函数`function`的区别是什么？构造函数`function`可以使用 `new` 生成实例，那么箭头函数可以吗？为什么？

1. 函数体内的 this 对象，就是定义时所在的对象，而不是使用时所在的对象。
2. 不可以使用 arguments 对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。
3. 不可以使用 yield 命令，因此箭头函数不能用作 Generator 函数。
4. 不可以使用 new 命令，因为：

   - 没有自己的 this，无法调用 call，apply。
   - 没有 prototype 属性 ，而 new 命令在执行时需要将构造函数的 prototype 赋值给新的对象的 proto

5. 没有箭头函数的时候，函数闭包 var that = this 的事没少干，有了箭头函数，就不需要这么写了。
