# 排序算法

## 冒泡排序（线性查找）

冒泡排序就是重复“从序列右边开始比较相邻两个数字的大小，再根据结果交换两个数字
的位置”这一操作的算法。在这个过程中，数字会像泡泡一样，慢慢从右往左“浮”到序列的
顶端，所以这个算法才被称为“冒泡排序”。

```js
function lineSort(list) {
  for (let i = 0; i < list.length; i++) {
    for (let j = i; j < list.length - 1; j++) {
      if (list[j] > list[j + 1]) {
        list[j] = list[j + 1] + list[j]
        list[j + 1] = list[j] - list[j + 1]
        list[j] = list[j] - list[j + 1]
      }
    }
  }
}
```

### 过程

比如: 3 1 5 2 4

1.  第一次遍历结果 13245
2.  第二次遍历结果 12345

### 弊端

已经出来了，尽管只需要遍历 10 次就可以，但是还是要遍历更多次

## 选择排序 （线性查找最小值）

选择排序就是重复“从待排序的数据中寻找最小值，将其与序列最左边的数字进行交换”
这一操作的算法。在序列中寻找最小值时使用的是线性查找。

```js
function selectSory(list) {
  // 记录最小值
  let minIdx
  for (let i = 0; i < list.length; i++) {
    minIdx = i
    for (let j = i; j < list.length; j++) {
      // 计算出最小值
      if (list[j] < list[minIdx]) minIdx = j
    }
    if (i !== minIdx) {
      list[i] = list[minIdx] + list[i]
      list[minIdx] = list[i] - list[minIdx]
      list[i] = list[i] - list[minIdx]
    }
  }
}
```

### 过程

1. 找出最小值，换到第一个位置上
2. 找出最小值，换到第二个位置上
   ...

### 弊端

查找次数过多，和冒泡排序差不多

## 堆排序

## 快速排序

采用分治法 大于的去右边，小于的去左边

```js
function quickSort(arr = []) {
  if (arr.length <= 1) {
    return arr
  }
  const [left, right] = [[], []]
  const flag = arr.shift()

  for (let i = 0; i < arr.length; i++) {
    // 小于flag在左边
    if (arr[i] < flag) {
      left.push(arr[i])
    } else {
      // 大于等于在右边
      right.push(arr[i])
    }
  }
  // 递归再合并
  return [...quickSort(left), flag, ...quickSort(right)]
}
```

以上是容易理解的版本，但是空间复杂度不够，可以采用原地交换的方式

### 原理：

1. 取出一个中间数，设置一个左右指针
2. 从左边找出一个大于中间数的值，再从右边找到一个小于中间值的数，左右交换
3. 递归以上步骤，缩小排序范围，直接两个指针碰撞

```js
function quickSort2(arr = [], low = 0, height = arr.length - 1) {
  if (low === height) return arr

  let left = low
  let right = height
  const pivot = arr[Math.floor((left + right) / 2)]
  while (left < right) {
    // 从左往右找到比中间值大的
    while (arr[left] < pivot) {
      left += 1
    }
    // 从右往左找到比中间值小的
    while (arr[right] > pivot) {
      right -= 1
    }
    // 找到两个可以调换的调换一下
    ;[arr[left], arr[right]] = [arr[right], arr[left]]
  }
  quickSort2(arr, low, left)
  quickSort2(arr, low + 1, height)
}
```
