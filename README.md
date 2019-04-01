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


- this、IIFE
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
> 1.在DOM事件下调用 this = DOM;    
> 2.在对象后面跟个. (obj.fn  this = obj;)
   (obj.hello.fn  this = obj.hello)  
> 3.全局作用下 this = window  
> 4.函数作用下 this = 当前作用域  
> 5.构造函数中 this. = 构造函数返回的实例  
> 6.自执行函数/定时器 this = window  
