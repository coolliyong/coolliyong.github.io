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

- 节流/防抖
> 节流： 当N秒内不断触发的时候，节约控制，在一定时间内js方法只跑一次。比如人的眨眼睛，就是一定时间内眨一次。这是函数节流最形象的解释。
> 防抖：当N秒内事件不断的触发、如果不断的执行，那么对性能/用户体验会有影响，这时我们希望的是N秒内用户不断的触发后，仅在最后一次触发。

```
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
function throttle(fun,wait){
var context,prevEventTime = 0; //记录需要执行的上下文，上次执行时间
    return function(...args){
        context = this;
        // 记录第一次执行的时间，如果当前时间 - 第一次执行的时间 >间隔 则执行，否则跳过
        var now = +new Date();
        if(now - prevEventTime > wait){
        fun.call(context,args);
        prevEventTime = now;
        }
    }
}


- this 指向
```
var number = 2;
var obj = {
    number: 4,
    fn1: (function () {
        this.number *= 2;
        number = number * 2;
        var number = 3;
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
var fn1 = obj.fn1; //window.fn1 = return obj.fn1
console.log(number); // window.number =2
fn1(); // window.fn1();
/**
    * this.number *= 2;  this => window  : window.number[2] *=2 = 4
    * var number = 3; //变量提升
    * number = number * 2;  number 没在this 下 所以是 fn的number 3*2 = 6;
    * 
    * 33 alert(number) window.number 4
    * 
    * return fn  
    *  this.number *=2  this.number[4]
    *  number *= 3  => 6*3 18
    *  alert(18)
    */


// obj.fn1();
// alert(window.number);
// alert(obj.number);
```

