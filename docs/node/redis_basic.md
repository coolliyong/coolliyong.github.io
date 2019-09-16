## 数据类型

- 字符串 String
- 列表 List Redis 列表只是字符串列表
- 哈希 Hashes
- 集合 Set
- 有序集合 Sorted Set

* 字符串操作

```sh
> set str "test String 1"
OK
> get str
"test String 1"
```

- 哈希 hashes 类似 PHP 数组 ["hello"=>123]

```sh
> HMSET myhash name "redis hash" age 20   //设置哈希 myhash name ="redis hash" age = 20
OK
> HMGET myhash name  age              //获取哈希 myhash name age (获取哈希指定所有key)
"redis hash"
20

> HGETALL myhash   //获取哈希 myhash 所有键和值
"name"
"redis hash"


```

- 列表 Redis 列表只是字符串列表

```sh
> LPUSH lis1 123 223 // 添加 123 223 333 到 list1 列表
(integer) 3

> LLEN list1    //获取 list1 列表
(integer) 3

> LRANGE list1 0 1 //获取 list1 0~3 个元素
"123"
"223"
"333"

> LINDEX list1 1 //获取list1 第一个字符串
"223"

> RPOP list1  // 删除并获取最后一个元素
"333"

> LPOP list1  // 删除并获取第一个元素
"123"

```

- 集合 Set 唯一字符串的无序集合

```sh
> SADD myset "set1" "set2" "set3"  // 添加"set1" "set2" "set3" 到myset
"set1"
> SCARD myset  //获取集合的成员数
(integer) 3
> SPOP myset // 随机删除并返回一个成员

```

# node-redis

```javascript
// yarn add redus

var redis = require('redis'),
  client = redis.createClient(6379, 'localhost')

client.on('error', function(err) {
  console.log('Error ' + err)
})

client.on('error', function(err) {
  console.log('Error ' + err)
})

client.set('hello', 'This is a value')

console.log(new Date().getTime())
client.LINDEX('list1', 1, function(err, v) {
  console.log(new Date().getTime())
  console.log('redis get hello err,v', err, v)
})

client.quit()
```

## 字符串操作

- set 设置存储在给定键中的值 OK set('key', 'value')
- get 获取存储在给定键中的值 value/null get('key')
- del 删除存储在给定键中的值(任意类型) 1/0 del('key')
- incrby 将键存储的值加上整数 increment incrby('key', increment)
- decrby 将键存储的值减去整数 increment decrby('key', increment)
- incrbyfloat 将键存储的值加上浮点数 increment incrbyfloat('key', increment)
- append 将值 value 追加到给定键当前存储值的末尾 append('key', 'new-value')
- getrange 获取指定键的 index 范围内的所有字符组成的子串 getrange('key', 'start-index', 'end-index')
- setrange 将指定键值从指定偏移量开始的子串设为指定值 setrange('key', 'offset', 'new-string')

## 列表操作

- rpush 将给定值推入列表的右端
- lrange 获取列表在给定范围上的所有值 array lrange('key', 0, -1) (返回所有值)
- lindex 获取列表在给定位置上的单个元素 lindex('key', 1)
- lpop 从列表左端弹出一个值，并返回被弹出的值 lpop('key')
- rpop 从列表右端弹出一个值，并返回被弹出的值 rpop('key')
- ltrim 将列表按指定的 index 范围裁减 ltrim('key', 'start', 'end')

## 哈希操作

- hset 在散列里面关联起给定的键值对 1(新增)/0(更新) hset('hash-key', 'sub-key', 'value') (不支持数组、字符串)
- hget 获取指定散列键的值 hget('hash-key', 'sub-key')
- hgetall 获取散列包含的键值对 json hgetall('hash-key')
- hdel 如果给定键存在于散列里面，则移除这个键 hdel('hash-key', 'sub-key')
- hmset 为散列里面的一个或多个键设置值 OK hmset('hash-key', obj)
- hmget 从散列里面获取一个或多个键的值 array hmget('hash-key', array)
- hlen 返回散列包含的键值对数量 hlen('hash-key')
- hexists 检查给定键是否在散列中 1/0 hexists('hash-key', 'sub-key')
- hkeys 获取散列包含的所有键 array hkeys('hash-key')
- hvals 获取散列包含的所有值 array hvals('hash-key')
- hincrby 将存储的键值以指定增量增加 返回增长后的值 hincrby('hash-key', 'sub-key', increment) (注：假如当前 value 不为为字符串，则会无输出，程序停止在此处)

## Set 集合

- sadd 将给定元素添加到集合 插入元素数量
- smembers 返回集合中包含的所有元素 array(无序) smembers('key')
- sismenber 检查给定的元素是否存在于集合中 1/0 sismenber('key', 'value')
- srem 如果给定的元素在集合中，则移除此元素 1/0 srem('key', 'value')
- scad 返回集合包含的元素的数量 sacd('key')
- spop 随机地移除集合中的一个元素，并返回此元素 spop('key')
- smove 集合元素的迁移 smove('source-key'dest-key', 'item')
- sdiff 返回那些存在于第一个集合，但不存在于其他集合的元素(差集) sdiff('key1', 'key2'[, 'key3', ...])
- sdiffstore 将 sdiff 操作的结果存储到指定的键中 sdiffstore('dest-key', 'key1', 'key2' [,'key3...])
- sinter 返回那些同事存在于所有集合中的元素(交集) sinter('key1', 'key2'[, 'key3', ...])
- sinterstore 将 sinter 操作的结果存储到指定的键中 sinterstore('dest-key', 'key1', 'key2' [,'key3...])
- sunion 返回那些至少存在于一个集合中的元素(并集) sunion('key1', 'key2'[, 'key3', ...])
- sunionstore 将 sunion 操作的结果存储到指定的键中 sunionstore('dest-key', 'key1', 'key2' [,'key3...])

## 有序集合

- zadd 将一个带有给定分支的成员添加到有序集合中 zadd('zset-key', score, 'key') (score 为 int)
- zrange 根据元素在有序排列中的位置，从中取出元素
- zrangebyscore 获取有序集合在给定分值范围内的所有元素
- zrem 如果给定成员存在于有序集合，则移除
- zcard 获取一个有序集合中的成员数量 有序集的元素个数 zcard('key')
