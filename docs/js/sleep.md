## `Javascript` 模拟实现 `Sleep` 函数

这是一个伪命题，无法挂起 JS 进程，在 sleep 之后再继续，应该是写一个 sleep 的异步，通过异步实现

- 回调函数版本

```js
//回调函数实现
const sleepCb = (wait, cb) => setTimeout(cb, wait)
sleepCb(5500, () => {
  console.log('cb')
})
```

- `Promise`

```js
const sleep = wait => new Promise(resolve => setTimeout(resolve, wait))
sleep(1500).then(res => {
  // sleep 之后干的事
  console.log('sleep')
})
```

- `Generator` 基于 `promise`

```js
function* sleep2(wait) {
  yield new Promise(resolve => setTimeout(resolve, wait))
}
sleep2(2500)
  .next()
  .value.then(() => {
    // sleep 之后干的事
    console.log('sleep2')
  })
```

- `async/await` 基于 `promise`

```js
async function sleep3(wait) {
  await new Promise(resolve => {
    setTimeout(resolve, wait)
  })
}
sleep3(3500).then(() => {
  console.log('sleep3')
})
```
