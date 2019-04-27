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