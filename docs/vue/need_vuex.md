# 有了 Vue3 还要啥 Vuex,自定义 hooks 给你实现 简单的数据共享和状态管理



看到大家都在推荐`Pinia`，看完几篇文章以后，我在想“有了 vue3，可以使用自定义`hooks`以后还会用到 `Vuex` 吗?”。
![pinia](../../imgs/pinia.png)


来看下列代码
### 创建 /store/userStore.js

> 定义`store`的`state`，然后定义两个`action`，得到数据以后修改`store`中的`state`，封装成一个`useUserStore`

```javascript
import { reactive } from "vue";

const store = reactive({
  state: {
    name: "Eduardo",
    isAdmin: true,
  },
});

const logout = async () => {
  store.state.isAdmin = false;
  store.state.name = "";
  console.log(store.state);
};

const login = async (user) => {
  store.state.isAdmin = true;
  store.state.name = user;
  console.log(store.state);
};

export const useUserStore = () => ({
  store,
  logout,
  login,
});
```

### 使用 userStore

```html
<script setup>
import { useUserStore } from "./store/user";
const { store: userStore, login, logout } = useUserStore();

console.log("userStore", userStore);
const testStore = toRefs(userStore.state);
console.log("testStore", testStore);

const toggleLogin = async () => {
  console.log("toggleLogin", userStore);
  if (userStore.state.isAdmin) {
    await logout();
  } else {
    await login("ed", "ed");
  }
  console.log("userStore", userStore);
  console.log("testStore", testStore);
};
</script>

<template>
  <div>
    <p>是否登录：{{ testStore.isAdmin }}</p>
    <p>name：{{ testStore.name }}</p>
    <hr />
    <button @click="toggleLogin">切换登录</button>
  </div>
</template>
```

有了这样一个 userUserStore 以后，封装在里面的数据`name`,`isAdmin`一旦发生改变，试图则会刷新，已经初步达到了 Vuex 的效果，并且可以在多个 vue 组件中引入，以达到通过和全局共享数据的效果。

那么看完这个示例，简单的全局数据传递，你还会选择使用 Vuex 吗
