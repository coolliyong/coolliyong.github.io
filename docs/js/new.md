## `new` 内部干了啥，模拟实现`new`

```javascript
function Person(name, age) {
  this.name = name
  this.age = age
  this.say = function() {
    console.log(`name:${name},age:${age}`)
  }
}

const p1 = new Person('test1', 1)
// console.log(p1.__proto__);

//p1 的 隐士原型指向 Person.prototype
//p1 的constructor === Person.prototype.constructor

const p2 = newFn(Person, 'test2', 2)

//实现
function newFn(Constructor, ...args) {
  const obj = Object()
  // 修改隐士原型
  obj.__proto__ = Constructor.prototype
  // 构造函数 call 实例（新对象） 这样，原本实例化传入的值就挂入 实例（新对象）上了
  Constructor.call(obj, ...args)
  return obj
}

// 在看一个例子
function ArrExample() {
  return []
}
let a = new ArrExample()
// console.log(a); // [] ??说好的实例呢
/**
 *  new 有一个特性 ，如果构造函数返回的是基本类型，就自动处理成返回实例 ，
 *  如果不是，就不返回实例
 *  所以咱们的实现也要改一改
 */

function Person2(name, age) {
  this.name = name
  this.age = age
  return {
    name: '就不返回实例',
    age: 0.1,
  }
}

function newFn2(Constructor, ...args) {
  const obj = new Object()
  obj.__proto__ = Constructor.prototype
  const result = Constructor.call(obj, ...args)
  return result ? result : obj
}

const p3 = newFn2(Person2, 'test3', 3)
// console.log(p3);
// console.log(Object.getPrototypeOf(p3));
// p3 {name: "就不返回实例", age: 0.1} 完美

// 记录两个api：
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf
```

- `Object.getPrototypeOf(Person);` // 返回出对象 ****proto****
- `Object.setPrototypeOf(Person, Person2);` //设置对象的原型

---
