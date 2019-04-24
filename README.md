# JavaScript 基础和面试手写题

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

## 节流/防抖

- 节流： 当 N 秒内不断触发的时候，节约控制，在一定时间内 js 方法只跑一次。比如人的眨眼睛，就是一定时间内眨一次。这是函数节流最形象的解释。
- 防抖：当 N 秒内事件不断的触发、如果不断的执行，那么对性能/用户体验会有影响，这时我们希望的是 N 秒内用户不断的触发后，仅在最后一次触发。

```javascript
//防抖：在一定时间内只执行一次，当用户触发一次触发后执行
function debounce(fun, delay) {
  return function(args) {
    //返回一个新的方法、接受参数
    let that = this; // 存住当前this ，因为在setTimeout是在window环境
    const _args = args;
    clearTimeout(fun.id); //触发方法的时候清除 当前 的定时器、达到防止重复触发的功能
    fun.id = setTimeout(function() {
      fun.call(that, _args);
    }, delay);
  };
}

//节流：当用户不断的触发时，仅在N秒内执行一次，多余的屏蔽掉
function throttle(fun, wait) {
  var context,
    prevEventTime = 0; //记录需要执行的上下文，上次执行时间
  return function(...args) {
    context = this;
    // 记录第一次执行的时间，如果当前时间 - 第一次执行的时间 >间隔 则执行，否则跳过
    var now = +new Date();
    if (now - prevEventTime > wait) {
      fun.call(context, args);
      prevEventTime = now;
    }
  };
}
```

---

## this 指向

```javascript
var number = 2;
var obj = {
  number: 4,
  fn1: (function() {
    // 立即执行函数中的this指向window，因为立即执行函数是window调用的
    // var number = undefined;
    this.number *= 2; // this.number = window.number 、2 *= 2 = 4
    number = number * 3; // undefined *= 3 NaN
    var number = 3; //number = 3
    return function() {
      this.number *= 2;
      number *= 3;
      console.log(number);
    };
  })(),
  db2: function() {
    this.number *= 2;
  }
};
var fn1 = obj.fn1;
console.log(number);
fn1();
/**
function fn1(){
    var number = 3
    this.number *= 2 ; this.number = window.number = 4*2 = 8;
    number *= 3  ; 3*3 = 9
    console.log(9) ;
}
*/
```

> ### 总结:`this`几种情况
>
> 1.在 DOM 事件下调用 this = DOM;  
> 2.在对象后面跟个. (obj.fn this = obj;)
> (obj.hello.fn this = obj.hello)  
> 3.全局作用下 this = window  
> 4.函数作用下 this = 当前作用域  
> 5.构造函数中 this. = 构造函数返回的实例  
> 6.自执行函数/定时器 this = window

---

## `Javascript` 模拟实现 `Sleep` 函数

这是一个伪命题，无法挂起 JS 进程，在 sleep 之后再继续，应该是写一个 sleep 的异步，通过异步实现

- 回调函数版本

```js
//回调函数实现
const sleepCb = (wait, cb) => setTimeout(cb, wait);
sleepCb(5500, () => {
  console.log("cb");
});
```

- `Promise`

```js
const sleep = wait => new Promise(resolve => setTimeout(resolve, wait));
sleep(1500).then(res => {
  // sleep 之后干的事
  console.log("sleep");
});
```

- `Generator` 基于 `promise`

```js
function* sleep2(wait) {
  yield new Promise(resolve => setTimeout(resolve, wait));
}
sleep2(2500)
  .next()
  .value.then(() => {
    // sleep 之后干的事
    console.log("sleep2");
  });
```

- `async/await` 基于 `promise`

```js
async function sleep3(wait) {
  await new Promise(resolve => {
    setTimeout(resolve, wait);
  });
}
sleep3(3500).then(() => {
  console.log("sleep3");
});
```

## 箭头函数与普通函数`function`的区别是什么？构造函数`function`可以使用 `new` 生成实例，那么箭头函数可以吗？为什么？

1. 函数体内的 this 对象，就是定义时所在的对象，而不是使用时所在的对象。
2. 不可以使用 arguments 对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。
3. 不可以使用 yield 命令，因此箭头函数不能用作 Generator 函数。
4. 不可以使用 new 命令，因为：

   - 没有自己的 this，无法调用 call，apply。
   - 没有 prototype 属性 ，而 new 命令在执行时需要将构造函数的 prototype 赋值给新的对象的 proto

5. 箭头函数带来的好处

- 没有箭头函数的时候，函数闭包 var that = this 的事没少干，有了箭头函数，就不需要这么写了。
- IIFE 的时候，当前 this 指向的是全局对象，产生的作用域也是全局，但是箭头函数就不会啦。

---

## `new` 内部干了啥，模拟实现`new`

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.say = function() {
    console.log(`name:${name},age:${age}`);
  };
}

const p1 = new Person("test1", 1);
// console.log(p1.__proto__);

//p1 的 隐士原型指向 Person.prototype
//p1 的constructor === Person.prototype.constructor

const p2 = newFn(Person, "test2", 2);

//实现
function newFn(Constructor, ...args) {
  const obj = Object();
  // 修改隐士原型
  obj.__proto__ = Constructor.prototype;
  // 构造函数 call 实例（新对象） 这样，原本实例化传入的值就挂入 实例（新对象）上了
  Constructor.call(obj, ...args);
  return obj;
}

// 在看一个例子
function ArrExample() {
  return [];
}
let a = new ArrExample();
// console.log(a); // [] ??说好的实例呢
/**
 *  new 有一个特性 ，如果构造函数返回的是基本类型，就自动处理成返回实例 ，
 *  如果不是，就不返回实例
 *  所以咱们的实现也要改一改
 */

function Person2(name, age) {
  this.name = name;
  this.age = age;
  return {
    name: "就不返回实例",
    age: 0.1
  };
}

function newFn2(Constructor, ...args) {
  const obj = new Object();
  obj.__proto__ = Constructor.prototype;
  const result = Constructor.call(obj, ...args);
  return result ? result : obj;
}

const p3 = newFn2(Person2, "test3", 3);
// console.log(p3);
// console.log(Object.getPrototypeOf(p3));
// p3 {name: "就不返回实例", age: 0.1} 完美

// 记录两个api：
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf
```

- `Object.getPrototypeOf(Person);` // 返回出对象 **__proto__**
- `Object.setPrototypeOf(Person, Person2);` //设置对象的原型


---

## React Hooks 学习

#### 动机、解决了什么问题

1. `State Hook` 简单来说 组件分为三种、无状态组建可以通过`function` 编写、但是有了 hooks ，可以很轻易的写出带状态的组件
2. `Effect Hook` 可以让你在函数组件中执行一些具有`effect`（副作用）的操作;每次`render`之后都会执行`effect`相当于`DidMonut` 和 `DidUpdate`,如果需要对指定的参数进行监听,可以在`useEffect`的 参数 2 传入一个 `state`, but 、传入监听参数、也会只当类似`Didmount`的事件

- useState

```js
import React, { useState } from "react";

const Counter = props => {
  const [count, setCount] = useState(0); // count 状态变量 setCount set函数 useState(0);//使用hooks状态
  // 0 count 默认值
  const [num, setNum] = useState(0);

  return (
    <div>
      <article>
        {/* 不能使用count + 1 ，会报错count 是只读 */}
        <button onClick={() => setCount(count - 1)}>--</button>
        <span>count:{count}</span>
        <button onClick={() => setCount(count + 1)}>++</button>
      </article>
    </div>
  );
};
```

- useEffect

```js
import React, { useState, useEffect } from "react";

const EffectCom = prop => {
  const [title, setTitle] = useState("defaultTitle");

  // 在`DidMount` 和 `DidUpdate` 之后都会执行，如果需要对指定的参数进行监听,可以在`useEffect`的 参数2 传入一个 `state`, but 、传入监听参数、也会只当类似`Didmount`的事件
  useEffect(eff => {
    console.log(eff);
    document.title = title;
  }, title);

  console.log(title);
  return (
    <div>
      <span>Effect Hook</span>
      <article>
        <p>title:{title}</p>
      </article>
    </div>
  );
};

export default EffectCom;
```
