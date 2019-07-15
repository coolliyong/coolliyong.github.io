# 递归

```js
function foo(i) {
  if (i < 0) return
  console.log('begin:' + i)
  arguments.callee(i - 1)
  console.log('end:' + i)
}
foo(3)
/**
 * foo var i =3
 * 3<0 console.log('begin:'3);
 * foo(i-1 =2)
 * 2<0 console.log('begin:'2);
 * foo(i-1 =1)
 * 2<0 console.log('begin:'1);
 * foo(i-1 =1)
 * 1<0 console.log('begin:'0);
 *  由于暂存区积攒了三次，所以最后进去 end
 *  console.log('end:'3);
 *  console.log('end:'2);
 *  console.log('end:'1);
 *  console.log('end:'0);
 */
```
