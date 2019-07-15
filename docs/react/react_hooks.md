### 动机、解决了什么问题

1. `State Hook` 简单来说 组件分为三种、无状态组建可以通过`function` 编写、但是有了 hooks ，可以很轻易的写出带状态的组件
2. `Effect Hook` 可以让你在函数组件中执行一些具有`effect`（副作用）的操作;每次`render`之后都会执行`effect`相当于`DidMonut` 和 `DidUpdate`,如果需要对指定的参数进行监听,可以在`useEffect`的 参数 2 传入一个 `state`

**特别注意事项：hooks 是函数，所以 JS 函数有的闭包问题，hooks 中也会发生、所以需要合理规避闭包陷**

## useState

```javascript
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

## memo

```javascript
//哪怕 并没有更新 也会触发子组件重新渲染 所以需要 memo 来缓存
import React, { useState, memo } from "react";

const Counter = props => {
  const [count, setCount] = useState(0);
  const [num, setNum] = useState(100);

  return (
    <div>
      <span>useState</span>
      <Child name={"child render test"} />
      <article>
        {/* 不要写成count ++ 会报错 count is read-only */}
        <button onClick={() => setCount(count - 1)}>--</button>
        <span>count:{count}</span>
        <button onClick={() => setCount(count + 1)}>++</button>
      </article>

      <article>
        <button onClick={() => setNum(num - 1)}>--</button>
        <span>num:{num}</span>
        <button onClick={() => setNum(num + 1)}>++</button>
      </article>
    </div>
  );
};

export default Counter;

const Child = memo(props => {
  console.log("child Render");
  const [state, setState] = useState(1);
  return (
    <div>
      {props.name}
      {state}
    </div>
  );
});
```

## useEffect

```javascript
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

## useCallback

```javascript
// 在函数组件中 如果数据变化、会引起数据重新渲染、所以需要使用到 `useCallback` 来解决这种问题

import React, { useState, useEffect, useCallback } from "react";

const EffectCom = prop => {
  const [title, setTitle] = useState("defaultTitle");
  const [state, setState] = useState(1);
  useEffect(
    eff => {
      console.log("useEffect");
      document.title = title;
    },
    [state]
  );

  const changeTitle = () => {
    setState(state + 1);
    setTitle("changeTitle::" + state);
  };
  //每次都执行了，说明有闭包调用问题、每次hello函数都会被重新声明，这是有问题的，需要缓存起来，在特定的时候才需要更新
  console.log("hello");
  //   const hello = () => {
  //     console.log("hello");
  //   };

  // 有了这样一层、 hello 函数并不会在每次都重新声明来占用内存，而是在state 变化的时候才重新声明，可以节约内存
  const hello = useCallback(() => {
    console.log("hello");
  }, [state]);

  console.log(title);
  return (
    <div>
      <span>Effect Hook</span>
      <article>
        <p onClick={hello}>title:{title}</p>
        <button onClick={changeTitle}>changeTitle</button>
      </article>
    </div>
  );
};

export default EffectCom;
```
**如果错误、欢迎指出**


[示例代码地址](https://github.com/coolliyong/javascript_basic/tree/master/hooks)
