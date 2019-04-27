# React 源码学习

## `babel`转`JSX`

- `babel`

```javascript
<div id="testDom">test Dom</div>

// transform JSX

react.createElement("div", { id: "testDom" }, "testDom");

<ul className="ul" style={{width:"20px"}}>
  <li>1</li>
  <li>2</li>
  <li>3</li>
</ul>

// transform JSX
react.createElement(
    'ul',
    {className:"ul",style:{width:"20px"}},
    react.createElement('li',null,'1'),
    react.createElement('li',null,'2'),
    react.createElement('li',null,'3'),
)

```
