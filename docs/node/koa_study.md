# koa 学习

## 中间件

```js
module.exports = async (ctx, next) => {
  console.log(`method:${ctx.method} host:${ctx.header.host} url: ${ctx.url}`)
  await next()
}

// 使用中间件
app.use(loggerAsync)
```

## `koa-router`

- `koa-router`

```js
// router.js
const Router = require('koa-router')
const home = new Router()

home.get('/', async ctx => (ctx.body = `home get!`))
home.put('/', async ctx => (ctx.body = `home put!`))
home.post('/', async ctx => (ctx.body = `home post!`))

// datail 路由
const datail = new Router()

datail.get('/', async ctx => (ctx.body = `datail get!`))

module.exports = {
  home,
  datail,
}

// app.js
// 实例化 router 然后use 之前的router
const router = new Router()

router.use('/', home.routes(), home.allowedMethods())
router.use('/datail', datail.routes(), home.allowedMethods())

app.use(router.routes())
```

## 获取`get`/`post`请求参数

- `koa-bodyparser`

```js
// querystring 查询对象 序列化后
// query 查询对象
const {querystring, query} = ctx

// 获取POST参数
var bodyParser = require('koa-bodyparser')

app.use(bodyParser())

app.use(async ctx => {
  ctx.body = ctx.request.body
})
```

## `koa-static` 静态资源

- koa-static

```js
const static = require('koa-static')
app.use(static(path.join(__dirname, './static/')))
```

## `cookie`处理

```js
// setcookie
ctx.cookies.set('token', 'hello world', {
  domain: 'localhost', // 写cookie所在的域名
  path: '/index', // 写cookie所在的路径
  maxAge: 10 * 60 * 1000, // cookie有效时长
  expires: new Date('2019-7-12'), // cookie失效时间
  httpOnly: false, // 是否只用于http请求中获取
  overwrite: false, // 是否允许重写
})
ctx.body = ctx.cookies.get('token')
```

## `VIEW`处理

- `koa-views`
- `ejs`

```js
const viewsMiddle = require('koa-views')

// views 模板 ejs
app.use(
  viewsMiddle(path.join(__dirname, './view'), {
    exension: 'ejs',
  })
)

 let content = '123'
  await ctx.render('index.ejs', {
    content,
  })
```

## 图片上传


## mysql

- mysql

```js
const mysql = require('mysql')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'koa_blog',
})

module.exports = async ctx => {
  const result = await new Promise((resolve, reject) => {
    connection.query('SELECT * FROM user', (err, result, fields) => {
      if (err) throw err
      resolve(result)
    })
  })
  const text = result.map(v=>`id:${v.id},name:${v.name}`)
  ctx.body = text
}

```