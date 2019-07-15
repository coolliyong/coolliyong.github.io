# 值传递和引用传递

```js
function changeAgeAndReference(person) {
  //arguments[0]:var person = [0x001]; person = personObj1的内存地址
  person.age = 25 //修改[0x001]的值
  person = {
    // arguments[0] 开辟了一个堆内存空间 [0x002]
    name: 'John',
    age: 50,
  }
  person.age = 100 //[0x002] 指向的堆地址的值发生改变
  return person //return [0x002]
}
var personObj1 = {
  //开辟了一个内存空间 [0x001]
  name: 'Alex',
  age: 30,
}
var personObj2 = changeAgeAndReference(personObj1)
console.log(personObj1) // -> {alex,25} [0x001]
console.log(personObj2) // -> {john,100} [0x002]
```
