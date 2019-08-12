# VUE页面切换时候 回到顶部

## 产生问题
 如果不加回到顶部，在每次页面切换的时候会产生一小段的时候 header 看不到，在页面加载之后才下来

## 初试解决办法
Vue-Router内置了一个滚动行为`scrollBehavior`，我试了试，并没有解决我的问题，看了一下它的调用顺序，大概是在我 页面进去后，`created`之后再调用的，所以这里并不满足我的需求，我使用`afterEach`最终解决了我的问题


## 最终解决办法:
在路由钩子，在路由加载之后立马window.scrollTo(0,0)
```js

router.afterEach((to, from) => {
  window.scrollTo(0, 0)
})
```