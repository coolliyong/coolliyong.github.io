# 简单查找和二分查找

## 简单查找

```js
/**
 * 线性查找
 *
 * @param {*} [list=[]]
 * @param {*} val
 * @returns
 */
function lineFind(list = [], val) {
  for (let i = 0; i < list.length; i++) {
    if (list[i] === val) {
      return i
    }
  }
  return -1
}
```

### 运行时间

T(n) = O(n)

### 优缺点：

1. 可以在有序无序下数组中查找
2. 时间为 O(N)

## 二分查找

- 假设要在电话簿中找一个名字以 K 打头的人，（现在谁还用电话簿！）可以从头开始翻页，直到进入以 K 打头的部分。但你很可能不这样做，而是从中间开始，因为你知道以 K 打头的名字在电话簿中间。
- 这是一个查找问题，在前述所有情况下，都可使用同一种算法来解决问题，这种算法就是二分查找。

!['对数'](/imgs/arithmetic/logarithm.jpg)

```js
/**
 * 二分查找
 *
 * @param {*} [list=[]]
 * @param {*} val
 */
function binarySort(list = [], val) {
  let left = 0
  let right = list.length - 1
  let mid
  while (left < right) {
    // 中间数 向上取整
    mid = Math.ceil((left + right) / 2)

    if (list[mid] === val) return mid

    if (list[mid] > val) {
      right -= 1
    } else {
      left += 1
    }
  }
  return -1
}
```

### 运行时间

- 使用它可节省多少时间呢？简单查找逐个地检查数字，如果列表包含 100 个数字，最多需要猜 100 次。如果列表包含 40 亿个数字，最
  多需要猜 40 亿次。换言之，最多需要猜测的次数与列表长度相同，这被称为`线性 时间（linear time）`。
- 二分查找则不同。如果列表包含 100 个元素，最多要猜 7 次；如果列表包含 40 亿个数字，最多
  需猜 32 次。厉害吧？二分查找的运行时间为对数时间（或 log 时间）。下表总结了我们发现的情况。
  !['二分查找运行时间'](/imgs/arithmetic/binaryt.jpg)

### 优缺点：

1. 只能在有序数组中查找
2. 时间为 O(logn)
