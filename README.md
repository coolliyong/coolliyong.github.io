## JavaScript 基础和面试手写题

- call/bind 的模拟实现

```
//call 在指定context 的环境下执行函数
Function.prototype.newCall = function (context, ...args) {
    context.fn = this; // 通过this获取call的函数
    context.fn(...args);
    delete context.fn;
}
// bind:修改 函数的执行环境 并返回新的函数
Function.prototype.newBind = function (context) {
    var fn = this;
    function newThis(...args) {
    context.fn = fn;
    return context.fn(...args);
    }
    return newThis;
}
```

- 节流/去抖动

* this、IIFE

```
var number = 2;
var obj = {
    number: 4,
    fn1: (function () {
        // 立即执行函数中的this指向window，因为立即执行函数是window调用的
        // var number = undefined;
        this.number *= 2; // this.number = window.number 、2 *= 2 = 4
        number = number * 3;  // undefined *= 3 NaN
        var number = 3;  //number = 3
        return function () {
            this.number *= 2;
            number *= 3;
            console.log(number);
        }
    })(),
    db2: function () {
        this.number *= 2
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

> 总结:`this`几种情况  
> 1.在 DOM 事件下调用 this = DOM;  
> 2.在对象后面跟个. (obj.fn this = obj;)
> (obj.hello.fn this = obj.hello)  
> 3.全局作用下 this = window  
> 4.函数作用下 this = 当前作用域  
> 5.构造函数中 this. = 构造函数返回的实例  
> 6.自执行函数/定时器 this = window

## React Hooks 学习

#### 动机、解决了什么问题

1. `State Hook` 简单来说 组件分为三种、无状态组建可以通过`function` 编写、但是有了 hooks ，可以很轻易的写出带状态的组件
2. `Effect Hook` 可以让你在函数组件中执行一些具有`effect`（副作用）的操作;每次`render`之后都会执行`effect`相当于`DidMonut` 和 `DidUpdate`,如果需要对指定的参数进行监听,可以在`useEffect`的 参数2 传入一个 `state`, but 、传入监听参数、也会只当类似`Didmount`的事件

- useState

```
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

```
import React, { useState,useEffect } from 'react'

const EffectCom = prop =>{
    const [title,setTitle] = useState('defaultTitle');

    // 在`DidMount` 和 `DidUpdate` 之后都会执行，如果需要对指定的参数进行监听,可以在`useEffect`的 参数2 传入一个 `state`, but 、传入监听参数、也会只当类似`Didmount`的事件
    useEffect(eff=>{
        console.log(eff)
        document.title = title
    },title)

    console.log(title)
    return (<div>
        <span>Effect Hook</span>
        <article>
            <p>title:{title}</p>
        </article>
    </div>)
}

export default EffectCom
```