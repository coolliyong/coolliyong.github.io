# js async 和调用栈

```js
async function async1() {
console.log('async1 start')
await async2()
console.log('async1 end')
}

        async function async2() {
            console.log('async2')
        }

        console.log('script start');

        setTimeout(function () {
            console.log('setTimeout')
        }, 0)

        async1();

        new Promise(function (resolve) {
                console.log('promise1')
                resolve();
            })
            .then(function () {
                console.log('promise2')
            })

        console.log('script end')


        /**
         * 首先调用同步队列
         * console.log('script start')
         * async1()
         * console.log('async1 start')
         * async2()
         * console.log('async2 end')
         * 跳出async1 的 await 柱塞 让主线程从全局的 29行继续往下走
         * new Promise 输出
         * console.log('promise1')
         * resolve() 之后 再次跳出阻塞 回到39 行
         * console.log('script end')
         * 然后再回到异步地队列 执行promise.then()
         * console.log('promise2')
         * 然后再走到同步
         * console.log('async1 end')
         * 最后主线程空闲、调用setTimeout 即使 他是 0
         *  console.log('setTimeout')
         *
         *
         * 结果:::
         * script start
         * async1 start
         * async2
         * promise1
         * script end
         * promise2
         * async1 end
         * setTimeout
         *
         */

```
