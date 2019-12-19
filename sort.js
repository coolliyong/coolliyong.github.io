/*
 * @Author: liyonglong
 * @Date: 2019-12-19 10:50:41
 * @Last Modified by: liyonglong
 * @Last Modified time: 2019-12-19 17:56:39
 */

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

// 排序
// lineSort([2, 1, 3, 9, 5, 5, 2, 4, 7, 1, 23, 96, 9, 44, 12, 5, 7])

// function selectSory(list) {
//   // 记录最小值
//   let minIdx
//   for (let i = 0; i < list.length; i++) {
//     minIdx = i
//     for (let j = i; j < list.length; j++) {
//       // 如果当前小于 需要比对的值 且 小于最小值
//       if (list[j] < list[minIdx]) {
//         minIdx = j
//       }
//     }
//     if (i !== minIdx) {
//       list[i] = list[minIdx] + list[i]
//       list[minIdx] = list[i] - list[minIdx]
//       list[i] = list[i] - list[minIdx]
//     }
//   }
//   console.log(list)
// }
// // selectSory([2, 1, 3, 9, 5])
// selectSory([1, 4, 9, 7, 6, 5, 2, 0, 9, 1, 2, 9, 0])

/**
 *  堆
 *
 */
class Heap {
  constructor() {
    this.heapData = null
  }

  createId() {
    return Math.random() + Date.now()
  }

  /**
   * 顶点
   * 每一个顶点下有两个节点
   * @param {*} leftC
   * @param {*} rightC
   * @memberof Heap
   */
  node(val) {
    const self = this
    const _node = {
      // id
      _id: self.createId(),
      // 节点数据
      val,
      // 左儿子
      leftC: null,
      // 右儿子
      rightC: null
    }
    this.inseryNode(_node)
  }

  /**
   * 查找顶点，如果没有传入顶点则查找 子顶点
   *
   * @param {*} node
   * @memberof Heap
   */
  selectNode(node) {}

  /**
   * 插入顶点
   *
   * @param {*} node
   * @memberof Heap
   */
  inseryNode(node) {
    if (this.heapData) {
      // 如果顶点不为空，查找为空的、挂在到合适的顶点下
      const _node = this.selectNode()
      // 如果左顶点没有，则挂载到右边
      if(_node.leftC){
        _node.rightC = node
      }
    } else {
      // 如果顶点为空
      this.heapData = node
    }
  }
}

const h = new Heap()

// 创建顶点
h.node(123)
h.node(234)
console.log(h.heapData)
