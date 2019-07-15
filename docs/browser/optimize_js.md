# 优化 JavaScript 执行

> 原文：[优化 JavaScript 执行](https://developers.google.com/web/fundamentals/performance/rendering/optimize-javascript-execution)  
> 作者: Paul Lewis

JavaScript 经常会触发视觉变化。有时是直接通过样式操作，有时是会产生视觉变化的计算，例如搜索数据或将其排序。时机不当或长时间运行的 JavaScript 可能是导致性能问题的常见原因。您应当设法尽可能减少其影响。

JavaScript 性能分析可以说是一门艺术，因为您编写的 JavaScript 代码与实际执行的代码完全不像。现代浏览器使用 JIT 编译器和各种各样的优化和技巧来尝试为您实现尽可能快的执行，这极大地改变了代码的动态。

尽管如此，您肯定还是可以做一些事情来帮助您的应用很好地执行 JavaScript。

- 对于动画效果的实现，避免使用 `setTimeout` 或 `setInterval`，请使用 `requestAnimationFrame`。
- 将长时间运行的 `JavaScript` 从`主线程`移到 `Web Worker`。
- 使用`微任务`来执行对多个帧的 DOM 更改。
- 使用 `Chrome DevTools` 的 `Timeline` 和 `JavaScript` 分析器来评估 `JavaScript` 的影响。

## 使用 `requestAnimationFrame` 来实现视觉变化

当屏幕正在发生视觉变化时，您希望在适合浏览器的时间执行您的工作，也就是正好在帧的开头。保证 `JavaScript` 在帧开始时运行的唯一方式是使用 `requestAnimationFrame`

```js
/**
 * If run as a requestAnimationFrame callback, this
 * will be run at the start of the frame.
 */
function updateScreen(time) {
  // Make visual updates here.
}

requestAnimationFrame(updateScreen)
```

框架或示例可能使用 `setTimeout` 或 `setInterval` 来执行动画之类的视觉变化，但这种做法的问题是，回调将在帧中的某个时点运行，可能刚好在末尾，而这可能经常会使我们丢失帧，导致卡顿。

![requestAnimationFrame](/imgs/settimeout.jpg)

## 降低复杂性或使用 Web Worker

JavaScript 在浏览器的主线程上运行，恰好与样式计算、布局以及许多情况下的绘制一起运行。如果 JavaScript 运行时间过长，就会阻塞这些其他工作，可能导致帧丢失。

因此，您要妥善处理 JavaScript 何时运行以及运行多久。例如，如果在滚动之类的动画中，最好是想办法使 JavaScript 保持在 **3-4** 毫秒的范围内。超过此范围，就可能要占用太多时间。如果在空闲期间，则可以不必那么斤斤计较所占的时间。

在许多情况下，可以将纯计算工作移到 `Web Worker`，例如，如果它不需要 DOM 访问权限。数据操作或遍历（例如排序或搜索）往往很适合这种模型，加载和模型生成也是如此。

```js
var dataSortWorker = new Worker('sort-worker.js')
dataSortWorker.postMesssage(dataToSort)

// The main thread is now free to continue working on other things...

dataSortWorker.addEventListener('message', function(evt) {
  var sortedData = evt.data
  // Update data on screen...
})
```

并非所有工作都适合此模型：Web Worker 没有 DOM 访问权限。如果您的工作必须在主线程上执行，请考虑一种批量方法，将大型任务分割为微任务，每个微任务所占时间不超过几毫秒，并且在每帧的 `requestAnimationFrame` 处理程序内运行。

```js
var taskList = breakBigTaskIntoMicroTasks(monsterTaskList)
requestAnimationFrame(processTaskList)

function processTaskList(taskStartTime) {
  var taskFinishTime

  do {
    // Assume the next task is pushed onto a stack.
    var nextTask = taskList.pop()

    // Process nextTask.
    processTask(nextTask)

    // Go again if there’s enough time to do the next task.
    taskFinishTime = window.performance.now()
  } while (taskFinishTime - taskStartTime < 3)

  if (taskList.length > 0) requestAnimationFrame(processTaskList)
}
```

此方法会产生 UX 和 UI 后果，您将需要使用进度或活动指示器来确保用户知道任务正在被处理。在任何情况下，此方法都不会占用应用的主线程，从而有助于主线程始终对用户交互作出快速响应。


## 了解 JavaScript 的“帧税”

在评估一个框架、库或您自己的代码时，务必逐帧评估运行 JavaScript 代码的开销。当执行性能关键的动画工作（例如变换或滚动）时，这点尤其重要。

测量 JavaScript 开销和性能情况的最佳方法是使用 Chrome DevTools。通常，您将获得如下的简单记录：

![low-js-detail](/imgs/low-js-detail.jpg)

如果发现有长时间运行的 JavaScript，则可以在 DevTools 用户界面的顶部启用 JavaScript 分析器：

![js-profiler-toggle](/imgs/js-profiler-toggle.jpg)

以这种方式分析 JavaScript 会产生开销，因此一定只在想要更深入了解 JavaScript 运行时特性时才启用它。启用此复选框后，现在可以执行相同的操作，您将获得有关 JavaScript 中调用了哪些函数的更多信息：

![high-js-detail](/imgs/high-js-detail.jpg)

有了这些信息之后，您可以评估 JavaScript 对应用性能的影响，并开始找出和修正函数运行时间过长的热点。如前所述，应当设法移除长时间运行的 JavaScript，或者若不能移除，则将其移到 Web Worker 中，腾出主线程继续执行其他任务。


## 避免微优化 JavaScript

知道浏览器执行一个函数版本比另一个函数要快 100 倍可能会很酷，比如请求元素的offsetTop比计算getBoundingClientRect()要快，但是，您在每帧调用这类函数的次数几乎总是很少，因此，把重点放在 JavaScript 性能的这个方面通常是白费劲。您一般只能节省零点几毫秒的时间。

如果您开发的是游戏或计算开销很大的应用，则可能属于本指南的例外情况，因为您一般会将大量计算放入单个帧，在这种情况下各种方法都很有用。

简而言之，慎用微优化，因为它们通常不会映射到您正在构建的应用类型。