# React 源码阅读笔记1

### `JSX`转换

- `babel`

```javascript
const el = <div id="testDom">test Dom</div>

// transform JSX

react.createElement("div", { id: "testDom" }, "testDom");

const list = (<ul className="ul" style={{width:"20px"}}>
  <li>1</li>
  <li>2</li>
  <li>3</li>
</ul>)

// transform JSX
react.createElement(
    'ul',
    {className:"ul",style:{width:"20px"}},
    react.createElement('li',null,'1'),
    react.createElement('li',null,'2'),
    react.createElement('li',null,'3'),
)
```

### 更新器

```javascript
// 其实没看懂
const ReactNoopUpdateQueue = {
  //是否挂载
  isMounted: function(publicInstance) {
    return false;
  },

  // 加入队列强制更新
  enqueueForceUpdate: function(publicInstance, callback, callerName) {
    warnNoop(publicInstance, 'forceUpdate');
  },

  // 加入队列替换状态
  enqueueReplaceState: function(
    publicInstance,
    completeState,
    callback,
    callerName,
  ) {
    warnNoop(publicInstance, 'replaceState');
  },

  //加入队列设置状态
  enqueueSetState: function(
    publicInstance,
    partialState,
    callback,
    callerName,
  ) {
    warnNoop(publicInstance, 'setState');
  },
};

export default ReactNoopUpdateQueue;
```


### React.CreateElement

```javascript
```
传入三个参数
- type
- config
- children
 `type`是`reactelement`的类型，如果是原生标签就是小写开头，如果是`React Component`就是大写开头的变量  

 `config` 指的是 `attr|props` 属性，比如`className`、排除`ref|key`  

 `children` 值得就是子元素了，`babel`会把`jsx`转换出来
 函数中判断了如果有多个子元素就 生成`children`数组

 最后返回调用 
 ```javascript

//传入 type 类型 config 也就是 元素上的所有attr/props children 指的是子元素
export function createElement(type, config, children) {
  let propName;

  const props = {};

  let key = null;
  let ref = null;
  let self = null;
  let source = null;


  if (config != null) {
    // 赋值ref
    if (hasValidRef(config)) {
      ref = config.ref;
    }
    // 赋值ref
    if (hasValidKey(config)) {
      key = '' + config.key;
    }
    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // 把 JSX 解析出的config 给到 props
    for (propName in config) {
      if (
        hasOwnProperty.call(config, propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName)
      ) {
        props[propName] = config[propName];
      }
    }
  }

  // 遍历 children childrend 不是数组，是多个参数 然后赋值到props.children
  const childrenLength = arguments.length - 2; // 去掉args type 和 config
  // 如果 是一个子元素 直接赋值 
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    // 如果有多个子元素，则创建一个长度 = length 的数组
    const childArray = Array(childrenLength);
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    // 开发环境 冻结 子元素 列表
    if (__DEV__) {
      if (Object.freeze) {
        Object.freeze(childArray);
      }
    }
    props.children = childArray;
  }

  // 解析默认属性
  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }
  if (__DEV__) {
    if (key || ref) {
      const displayName =
        typeof type === 'function'
          ? type.displayName || type.name || 'Unknown'
          : type;
      if (key) {
        defineKeyPropWarningGetter(props, displayName);
      }
      if (ref) {
        defineRefPropWarningGetter(props, displayName);
      }
    }
  }
  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props,
  );
}

/**
 *  Factory方法创建一个新的React元素。 这不再遵循类模式，因此不要使用new来调用它。 
 * 此外，没有instanceof检查将起作用。 
 * 而是针对Symbol.for（'react.element'）测试$$ typeof字段以进行检查
 * 如果有什么东西是React元素。
 */
const ReactElement = (type, key, ref, self, source, owner, props)=>{
  const element = {
    // 此标记允许我们将其唯一标识为React元素
    $$typeof: REACT_ELEMENT_TYPE,

    // 属于元素的内置属性
    type: type,
    key: key,
    ref: ref,
    props: props,

    // 记录负责创建此元素的组件。
    _owner: owner,
  };
  return element;
};
 ```


### React.ReactChildren

子元素相关,常用的 `React.Children.map`、`React.Children.forEach`、`React.Children.only`

```javascript
export {
  forEachChildren as forEach,
  mapChildren as map,
  countChildren as count,
  onlyChild as only,
  toArray,
};
// 先上最简单的
function onlyChild(children) {
  // 如果是 React Element 元素，否则报警 告
  invariant(
    isValidElement(children),
    'React.Children.only expected to receive a single React element child.',
  );
  return children;
}

function mapChildren(children, func, context) {
  if (children == null) {
    return children;
  }
  const result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, func, context);
  return result;
}



```

[代码仓库](https://github.com/coolliyong/react)
