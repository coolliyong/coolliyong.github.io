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
---