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
