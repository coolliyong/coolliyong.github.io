- sequelize star:18.2k

> https://github.com/demopark/sequelize-docs-Zh-CN

## 安装

```
yarn add sequelize mysql mysql2 -s
```

## 连接

```javascript
  const sequelize = new Sequelize("test_orm", "root", "root", {
    host: "localhost",
    port: "3306",
    dialect: "mysql"
  });
```

## 定义模型

- 手动定义

```javascript
 const Author = sequelize.define(
    "author",
    {
      // id: Sequelize.INTEGER(15),
      age: Sequelize.STRING(11),
      name: Sequelize.STRING(20)
    },
    {
      tableName: "author"
    }
  );
```

- 根据`MySQL`库自动生成

```javascript
 npm i -g sequelize-auto

sequelize-auto -d database -u user -x pwd -h host -p port
```

```javascript
sequelize-auto -d test_orm -u root -x root -p 3306 -h localhost
// 自动生成到命令行文件夹下 /models/

```

## `MySQL`表关系定义

```JavaScript
// 一对一

//每一篇 文章根据 author_id 对应一个作者

// 作者关联到文章  通过作者查文章
Author.hasOne(Article, { foreignKey: 'author_id' })
// 文章关联到文章 ，通过文章查作者
Article.belongsTo(Author, { foreignKey: 'author_id' })


// 一对多
// 每一个作者有多个文章
  Author.hasMany(Article, { foreignKey: "author_id" });
// 多对多
```

## 查询

- `find` - 搜索数据库中的一个特定元素

```javascript
// 搜索已知的ids
Project.findById(123).then(project => {
  // project 将是 Project的一个实例，并具有在表中存为 id 123 条目的内容。
  // 如果没有定义这样的条目，你将获得null
})


// 搜索属性
Project.findOne({ where: {title: 'aProject'} }).then(project => {
  // project 将是 Projects 表中 title 为 'aProject'  的第一个条目 || null
})
// 查找一条
Project.findOne({
  where: {title: 'aProject'},
  attributes: ['id', ['name', 'title']]
}).then(project => {
  // project 将是 Projects 表中 title 为 'aProject'  的第一个条目 || null
  // project.title 将包含 project 的 name
})


// findAll - 搜索数据库中的多个元素
Author.findAll()
    .then(result => {
      console.log(result);
      // res.send("查询成功");
      res.type("json");
      res.json(result);
    })
    .catch(err => {
      res.status(500).end(`查询出错::${err.message}`);
    });

// 连表查询
Article.findAll({
    // where:{id:12},
    include: [Author]
  })
    .then(result => {
      res.type("json");
      res.json({ status: "ok", result });
    }) //删除成功的回调
    .catch(err => {
      res.json({ message: err.message });
    });
```

## 更新

```javascript
// values  options
  Author.update(
    {
      name: "update_fdsafsdafdasfdsa"
    },
    {
      where: { id } //where是指定查询条件
    }
  )
    .then(result => {
      res.type("json");
      res.json({ status: "ok" });
    })
    .catch(err => {
      res.json({ message: "更新错误" });
    });

```

## 插入

```javascript
//插入一条
  Author.create({ name: "name_add", age: 20 })
    .then(result => {
      console.log(result);
      res.json({ status: "ok" });
    })
    .catch(e => {
      res.json({ status: "error", message: e.message });
    }); //异常捕获

// 批量插入
//itemsList:Array[Object]
 Article.bulkCreate(itemsList)
        .then(result => {
          res.json({ message: "插入成功",result:itemsList });
        })
        .catch(err => {
          res.status(500).json({ message: "插入失败", errMsg: err.message });
        });
```

## 删除
```javascript
 Author.destroy({
    where: { id } //where是指定查询条件
  })
    .then(result => {
      res.type("json");
      res.json({ status: "ok" });
    }) //删除成功的回调
    .catch(err => {
      res.json({ message: "删除错误" });
    });
```