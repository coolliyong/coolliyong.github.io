# Node + MQ 限流小计

前言：**我觉得并发（*小规模的并发*）没有想的那么可怕，核心在于并发量控制（限流让服务端压力不暴涨、横向拓展集群让每一个服务压力减少）。可能是我的demo场景太low所以觉得简单，如果架构/业务复杂，就不是这么一点问题了，但我属实没讨论架构，我只讨论技术手段限流**  

## 需求

总听到各种大神，动不动就是高性能，高可用，高并发，微服务，中台，架构，性能调优，我当场我就不服了，您懂`curd`吗？你知道`curd仔`的快乐吗 *[狗头保命o(*￣︶￣*)o]*


于是我就想爽一把，体验一把并发的乐趣，于是我想做一个简单秒杀场景来自我安慰一把，虽然我抢购手气实在一般。

1. 客户端生成`UUID`(好歹也假设是一个用户)发出请求到 nginx
2. nginx 转到到node上
3. node投放消息到队列   
4. mq推送到node上，开始消费（rabbitmq 的队列监听我已经在程序启动的时候就开启了，这里如果有问题可以看我代码）
    1. 获取redis库存数量，如果小于1直接结束
    2. 开启事务，扣减redis库存、redis中添加一个购买记录,执行事务
    3. 发送`mq`回执(这里我并不相信我的程序完全不会挂，所以我觉得回执很有必要)
5. 在请求`/result`接口来查看结果，接口会判断 库存是否被消费完投放处结果


## 程序成本：  
    1. Node egg.js （4进程 *2）用Egg.js启动了两套程序（同样的），egg.js采用了`多进程`，默认根据CPU数，我的是`双核四线程`，所以启动的是4个进程
    2. redis (本机，一个单点)  
    3. rabbitmq（部署在1C1U的腾讯云上，一个单点）  

## 为什么采用egg
为什么采用egg？因为它真的是一个开箱即用的东西，如果用koa或者express，我还要配置日志，这些，我研究的重点是并发而非框架  
    

## 开始压测  

设置库存 10个

![count](/imgs/skecill/count.jpg)



我使用的`jmater`压测  



参数  

- 线程350 (翻译是中文是线程，可是不准确)
- 总发出时间 20s （调成0容易崩，我是I3我骄傲了吗，哈哈哈）
- 循环10次
- 共计3500 个请求 200S 依次发出


​    !['jmater参数'](/imgs/skecill/req.jpg)
## 测压过程

前期一切顺利

![count_result_1](/imgs/skecill/count_result_1.jpg)

![count_result_2](/imgs/skecill/count_result_2.jpg)

![count_result_3](/imgs/skecill/count_result_3.jpg)

这里没有预期的-1 -2之类的的，buylist也没有想象中的超出设置的库存问题，再等等试试看。

当我开始暗自开心并准备给自己削个苹果的时候，事情突然发生了转机！！！！ 出现的莫名的红色文字，心里突的戈登一下，内心：*我写的程序怎么可能有bug，不对我什么时候写过没有bug的程序，还是赶紧看看吧！“

!['请求错误'](/imgs/skecill/result_00.jpg)



当我看到错误率指数上升的时候，我心里一点也不慌，甚至还想吃几粒六味地黄丸..

我康康日志，都是哪些个不听话的bug在我测试的时候当出头鸟

!['错误日志'](/imgs/skecill/error_log.png)



WFT?懵逼三联，上一下MQ网页管理平台看看，哦吼，上不去了，上百度搜搜？

![baidu](/imgs/skecill/baidu.jpg)

怎么肥实？，百度100%丢包。

。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。此时无语



若干时间后测试完毕

![result_11](/imgs/skecill/result_11.jpg)

![result_22](/imgs/skecill/result_22.jpg)

异常率 79% ，这不是个可用的服务[捂脸..]，不过我测试几次结果都是前期测试结果正常，大概在100多个请求之后就开始网络堵塞。导致无法进一步测试，有兴趣的小伙伴可以找到要代码在自己的机器上试试。

> 善良提示一句：不要在随意进行压力测试，要是服务没挂，还好说，如果服务挂了，那就是DOS攻击，就算是本公司的服务，也不要随便做。如果要做的时候提前上报，相关人员在都在的情况下测试，挂了随时恢复。



## 性能消耗

I3-8100 + DDR4 16G

虽然我是I3，但是我丝毫不慌，程序启动前，我的磁盘IO波动有点大，这是我硬盘的问题，毕竟大晚上的，硬盘几个T的女神躁动不安也是正常的
1. 程序开始前 `~ 23%`
2. 程序压测中 `35 ~ 53%` 最大`53%`,持续不到`2`秒就下去了
3. 程序压测后 `~ 23%` 



## 最后：  

测试结果不算很成功，受到不可抗力因素，导致结果出现了预期外的结果。

但是呢，前期的消费结果是预期内的，没有超标

   

## 关键代码

```javascript
  /**
   * 监听消息
   *
   * @memberof SeckillServices
   */
  async listenMsg() {
    console.log('listenMsg')
    const { app, ctx } = this
    const [err0, connection] = await new Promise(resolve => {
      amqp.connect('amqp://xxx.xx.31.73:5672', (err, con) =>
        resolve([err, con])
      )
    })
    if (err0) {
      console.error(err0)
      console.error('cmq 连接失败')
      // app.throw()
      ctx.throw(500, 'mq 连接失败')
    }
    const [err1, channel] = await new Promise(resolve =>
      connection.createChannel((err, chan) => resolve([err, chan]))
    )

    if (err1) {
      console.error('channel 创建失败')
      ctx.throw(500, 'mq 连接失败')
    }
    channel.assertQueue(queue, {
      durable: false
    })
    // 关闭自动回执
    const opt = {
      noAck: false
    }
    // 每次消费一个消息
    channel.prefetch(1)

    // 消费消息
    const consumeMmsg = async msg => {
      const msgText = msg.content.toString()
      ctx.logger.info(`[c--> 接收到消息:${msgText}`)
      // 先取出来redis 库存数量
      // 如果大于 1
      // 1. 库存 -- 且创建一条消费记录
      // 2. 发送消息到redis
      const count = await app.redis.get('count')
      if (count < 1) {
        console.log(msgText, '库存已经爆了', count)
        ctx.logger.error(' 库存已经爆了 uid:' + msgText + ' count:' + count)
        channel.ack(msg) // 消费消息成功
        return false
      }
      // 开启redis事务
      const multi = this.app.redis.multi()
      ctx.logger.info(
        `${msgText}消费成功，当前时间:${new Date().toLocaleString()} ,消费的的库存是:${count}`
      )
      multi.rpush(
        'buslist',
        `${msgText}消费成功，当前时间:${new Date().toLocaleString()} ,消费的的库存是:${count}`
      )
      multi.decr('count')
      const [err, success] = await new Promise(resolve => {
        multi.exec((err, success) => resolve([err, success]))
      })
      if (err) {
        ctx.logger.error(msgText + ' redis事物失败 ' + err.message)
        console.log(msgText + ' redis事物失败 ' + err.message)
      }
      ctx.logger.info('一条龙消费完成')
      channel.ack(msg) // 消费消息成功
      return true
    }
    channel.consume(queue, consumeMmsg, opt)
  }

  /**
   * 发送消息到队列
   *
   * @param {*} [param={}]
   * @returns
   * @memberof SeckillServices
   */
  async enQueue(param = {}) {
    const { ctx } = this
    const { uid } = param
    /**
     * 1.连接mq
     * 2.创建通道
     * 3.声明队列
     * 4.创建消息
     * 5.发送消息
     */
    const [err0, connection] = await new Promise(resolve => {
      amqp.connect('amqp://xxx.xx.31.73:5672', (err, con) =>
        resolve([err, con])
      )
    })
    if (err0) {
      console.error(err0)
      ctx.throw(500, 'mq 连接失败')
    }
    const [err1, channel] = await new Promise(resolve =>
      connection.createChannel((err, chan) => resolve([err, chan]))
    )

    if (err1) {
      ctx.throw(500, 'channel 连接失败')
    }
    channel.assertQueue(queue, {
      // 非持久化
      durable: false
    })
    channel.sendToQueue(queue, Buffer.from(uid))
    console.log('消息发送成功:' + ' time:' + Date.now())
    return true
  }

```

[github](https://github.com/coolliyong/coolliyong.github.io)
