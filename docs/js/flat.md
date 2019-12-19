# es5 实现数组扁平化

```js
/**
 * 数组扁平化
 * @param {Array} arr
 * @returns
 */
function flat(arr) {
  let result = []
  if (_isArray(arr)) {
    for (let i = 0; i < arr.length; i++) {
      const v = arr[i]
      if (_isArray(v)) {
        //递归扁平化数组
        arr[i] = flat(v)
        // 递归后 连接数组
        result = result.concat(arr[i])
      } else {
        result.push(v)
      }
    }
  }
  return result
}

function _isArray(arr) {
  return Array.isArray(arr) && arr.length
}

let z = [1, [2, [3, [4, 6, 7, 8]], 5]]
console.log(flat(z))
```
