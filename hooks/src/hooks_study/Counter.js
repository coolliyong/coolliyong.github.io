import React, { useState } from "react";

const Counter = props => {
  const [count, setCount] = useState(0);
  const [num, setNum] = useState(100);

  return (
    <div>
      <span>useState</span>
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
