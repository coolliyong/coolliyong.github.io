## 节流/防抖

- 节流： 当 N 秒内不断触发的时候，节约控制，在一定时间内 js 方法只跑一次。比如人的眨眼睛，就是一定时间内眨一次。这是函数节流最形象的解释。
- 防抖：当 N 秒内事件不断的触发、如果不断的执行，那么对性能/用户体验会有影响，这时我们希望的是 N 秒内用户不断的触发后，仅在最后一次触发。

```javascript
//防抖：在一定时间内只执行一次，当用户触发一次触发后执行
function debounce(fn, delay) {
  // 存下来当前this
  const ctx = this;
  let tfn = null;
  return (...arg) => {
    clearTimeout(tfn);
    tfn = setTimeout(() => {
      fn.call(ctx, ...arg);
    }, delay);
  };
}

//节流：当用户不断的触发时，仅在N秒内执行一次，多余的屏蔽掉
function throttle(fun, wait) {
  var context,
    prevEventTime = 0; //记录需要执行的上下文，上次执行时间
  return function (...args) {
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
