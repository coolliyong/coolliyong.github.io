# 这几段代码助你理解Vue3响应式


## 依赖收集，简单版

```
let price = 5
let num = 2
let total = 0

// 依赖
const DepSet = new Set()

// 响应式函数的副作用
let effect = () => {
  total = price * num
}

// 追踪代码
const track = () => {
  DepSet.add(effect)
}
// 触发器
const trigger = () => {
  DepSet.forEach(effect => effect())
}

// 首次触发
track()
trigger()

console.log(total)

num = 5

// 修改后再次触发
track()
trigger()

console.log(total)
```

## 响应式依赖收集，多个依赖版

```
// 多对多监听，一个数据，有多个监听对象

const DepMap = new Map()

// 用来存依赖的，依赖为一个set，可能有多个
// DepMap.set('key',DepSet)

// 响应式追踪
function track(key) {
  let DepSet = DepMap.get(key)
  if (!DepSet) {
    DepSet = new Set()
    DepMap.set(key, DepSet)
  }
  DepSet.add(effect)
}

// 触发器
function trigger(key) {
  const DepSet = DepMap.get(key)
  if (DepSet) {
    DepSet.forEach(effect => effect())
  }
}

const product = {
  price: 10,
  num: 2,
}

let total = 0

let effect = () => (total = product.price * product.num)

// 手动设置 需要跟踪响应式的字段

track('num')
// 手动第一次计算执行副作用
effect()

console.log(total)

// 更新num
product.num = 5
// 跟新了响应式数，手动执行副作用
trigger('num')

console.log(total)
```


## 响应式依赖收集，多个响应式收集



```
// 对象跟踪

const targetMap = new WeakMap()

function track(target, key) {
  // 从对象中获取target
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    // 如果还未初始化，则初始化
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  // 从depsMap 中获取 depsSet ，响应式依赖
  let depsSet = depsMap.get(key)
  if (!depsSet) {
    // 如果depsMap 中的 key ，还没有响应式依赖，则添加
    depsSet = new Set()
    // 把depSet 添加到DepsMap 中
    depsMap.set(key, depsSet)
  }

  // 添加effect 到 depsSet 中
  depsSet.add(effect)
}

// 触发器
function trigger(target, key) {
  // 从targetMap 中获取 deps Map
  const depsMap = targetMap.get(target)
  // 如果不存在DepsMap，则中断触发
  if (!depsMap) return

  const depsSet = depsMap.get(key)

  depsSet.forEach(effect => effect())
}

const product = {
  price: 10,
  num: 3,
}

let total = 0

function effect() {
  total = product.num * product.price
}

track(product, 'num')
effect()

console.log(total)

product.num = 5
trigger(product, 'num')

console.log(total)
```

## 结合proxy，自动触发trigger

```
// 结合之前的track 和trigger
// 结合proxy 和reflect Api

// 先搭建一个响应式
function reactive(target) {
  const handler = {
    get(target, key, receiver) {
      // 当读取的时候去设置一下
      track(target, key)
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      Reflect.set(target, key, value, receiver)
      // 当设置的时候触发一下
      trigger(target, key)
    },
  }
  return new Proxy(target, handler)
}

const targetMap = new WeakMap()

function track(target, key) {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let depsSet = depsMap.get(key)

  if (!depsSet) {
    depsSet = new Set()
    depsMap.set(key, depsSet)
  }
  // 目前还是手动添加一下effect
  depsSet.add(effect)
}

function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  const depsSet = depsMap.get(key)
  if (depsSet) {
    depsSet.forEach(effect => effect())
  }
}

const product = {
  price: 10,
  num: 2,
}
let total = 0

// 把product 响应式一下
const proxyProduct = reactive(product)

function effect() {
  total = proxyProduct.price * proxyProduct.num
}

// 首次人肉执行
effect()

console.log(total)

proxyProduct.num = 5

console.log(total)

proxyProduct.price = 20

console.log(total)
```



## activeEffect

```
// 之前都是手动执行effect

// 当前指针的effect
let activeEffect = null
let targetMap = new WeakMap()

function effect(eff) {
  activeEffect = eff
  activeEffect()
  activeEffect = null
}

function reactive(orogin) {
  return new Proxy(orogin, {
    get(target, key, reveice) {
      // 谁来读取它，谁就是它的依赖，vnode也可以
      track(target, key)
      return Reflect.get(target, key, reveice)
    },
    set(target, key, value, reveice) {
      Reflect.set(target, key, value, reveice)
      trigger(target, key)
    },
  })
}

function track(target, key) {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let depsSet = depsMap.get(key)
  if (!depsSet) {
    depsSet = new Set()
    depsMap.set(key, depsSet)
  }
  // 如果存在副作用，则添加到依赖下
  if (activeEffect) {
    depsSet.add(activeEffect)
  }
}

function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  const depsSet = depsMap.get(key)
  if (depsSet) {
    depsSet.forEach(effect => {
      effect()
    })
  }
}

const product = {
  price: 10,
  num: 2,
}
let total = 0

const proxyProduct = reactive(product)

effect(() => {
  total = proxyProduct.num * proxyProduct.price
})

console.log(total) // 2* 10 = 20

proxyProduct.price = 50
console.log(total) // 2 * 50 = 100

proxyProduct.num = 1
console.log(total) // 1 * 50 = 50
```