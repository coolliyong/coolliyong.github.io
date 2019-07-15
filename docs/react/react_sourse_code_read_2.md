# ReactDOM

```js
const ReactDOM: Object = {
  createPortal,

  findDOMNode(componentOrElement: Element | ?React$Component<any, any>,){},

  hydrate(element: React$Node, container: DOMContainer, callback: ?Function) {},

  // render 渲染
  // element 元素 container 根节点  callback 回调函数
  render(element: React$Element<any> , container: DOMContainer,callback: ?Function) {
    // 返回一个函数
    return legacyRenderSubtreeIntoContainer(
      null,
      element,
      container,
      false,
      callback,
    );
  },

  unstable_renderSubtreeIntoContainer(
    parentComponent: React$Component<any, any>,
    element: React$Element<any>,
    containerNode: DOMContainer,
    callback: ?Function,
  ) {
    return legacyRenderSubtreeIntoContainer(
      parentComponent,
      element,
      containerNode,
      false,
      callback,
    );
  },

  unmountComponentAtNode(container: DOMContainer) { },

  // Temporary alias since we already shipped React 16 RC with it.
  // TODO: remove in React 17.
  unstable_createPortal(...args) {},
};
```

### ReactDOM.render
`reactDOM`传入一个 `element` ReactElement , `container` DOM根节点 , `callback` 渲染后回调函数
 // 返回一个函数
return legacyRenderSubtreeIntoContainer(
    null,
    element,
    container,
    false,
    callback,
);


### legacyRenderSubtreeIntoContainer 直译:渲染子树给容器
```js
function legacyRenderSubtreeIntoContainer(
    // 父组件
  parentComponent: ?React$Component<any, any>,
    // 子元素
  children: ReactNodeList,
  // 根节点
  container: DOMContainer,
  // 
  forceHydrate: boolean,
  // 回调函数
  callback: ?Function,
) {
  // TODO 没有`any`类型，Flow说“不能访问任何属性
  // 交叉类型的成员
  let root: Root = (container._reactRootContainer: any);
  if (!root) {
    // 初始安装
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
      container,
      forceHydrate,
    );
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function() {
        const instance = getPublicRootInstance(root._internalRoot);
        originalCallback.call(instance);
      };
    }
    // Initial mount should not be batched.
    unbatchedUpdates(() => {
      if (parentComponent != null) {
        root.legacy_renderSubtreeIntoContainer(
          parentComponent,
          children,
          callback,
        );
      } else {
        root.render(children, callback);
      }
    });
  } else {
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function() {
        const instance = getPublicRootInstance(root._internalRoot);
        originalCallback.call(instance);
      };
    }
    // Update
    if (parentComponent != null) {
      root.legacy_renderSubtreeIntoContainer(
        parentComponent,
        children,
        callback,
      );
    } else {
      root.render(children, callback);
    }
  }
  return getPublicRootInstance(root._internalRoot);
}
```

[代码仓库](https://github.com/coolliyong/react)