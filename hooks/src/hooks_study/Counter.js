import React, { useState,memo } from "react";

const Counter = props => {
  const [count, setCount] = useState(0);
  const [num, setNum] = useState(100);

  return (
    <div>
      <span>useState</span>
      <Child name={'child render test'}></Child>
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


//哪怕 并没有更新 也会触发子组件重新渲染 所以需要 memo 来缓存
const Child = memo(props=>{
  console.log('child Render');
  const [state,setState] = useState(1)
  return (<div>{props.name}{state}</div>)
})