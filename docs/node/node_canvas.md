# node-canvas 生成营销图
### 需求
    使用`Node`在服务端生成一张营销推广图，图中有集团名称，公司信息，还有推广二维码

### 需求分析：
     我觉得这个东西怎么说都应该是客户端生成会比较好  
        1)服务端不关心适配而客户端关心  
        2)服务端不关心展示的过程，也不需要处理图片，更多是需要关心推广 二维码的数据是否正确
        3)在并发下也不会CPU飙升
        
    但是需求它不听啊。

### 开干

作为一个面向搜索引擎复制粘贴的开发人员，第一时间先上npm搜索一下

首先找到了`GM`，尝试了一番过后发现它适合图片处理，把多张图生成成一张添加文字等操作貌似不那么灵活，然后接着搜，然后找到了`jimp`，这个挺好用的，感觉`API`，但是和`gm`一样，感觉并不适合做这个，然后找到了`node-canvas`

确定好库之后继续开干
### 首次采坑
`npm install canvas` 下载不动了，果断查一下`nrm ls`，是淘宝没错了，然后google一下，没有找到想要的结果，求助了一下大佬`部门的架构师`，他告诉我是C++编译的时候需要下载东西，那个是国外的，只能换一个网络环境试试，于是机制的我用手机给电脑分享了一个热点，真的装上了，嗯开心，可以开始了，先上一个demo 试试

```javascript
const { createCanvas, loadImage, registerFont } = require('canvas')
// 加载字体,在docker node 镜像中 字体乱码，不知道什么问题，于是大佬帮我解决了这个问题，哈哈
registerFont(path.join(__dirname,'../../static/heiti.ttf'), { family: 'hei' })


 const bg = loadImage(path.join(__dirname, '../../static/', 'gold_bg.jpg'))
  const content = loadImage(path.join(__dirname, '../../static/', 'gold_content.png'))
 canvas = createCanvas(this.canvasSize.w, this.canvasSize.h)
 ctx = canvas.getContext('2d')
 
 // 获取画图宽高
const { width: canvasW, height: canvasH } = ctx.canvas

 // 绘制背景
ctx.drawImage(
  bg,
  0,
  0
)

// 绘制中间内容
ctx.drawImage(
  content,
  (canvasW - content.width) / 2,
  300
)

console.log(canvas.toDataURL()) // 打印出一串很大的base64


```
!['生成背景'](/imgs/canvas_bg.jpg)

在demo初步满足需求之后可以开始上业务了，先确定一下要用到具体哪些图片文字，要用到哪些size（别想歪,我说的输出和输出，我真的没开车..）

```
class MarketingImage {
  constructor() {
    this.canvasSize = {
      w: 1500,
      h: 2668
    }
    // 二维码
    this.qrcode = {
      w: 756,
      h: 756
    }
    //   图片配置
    this.imageObj = {
      // 金卡
      gold: {
        text: {
          colors: ['white'],
          font: ['70px Regular'],
          positionY: [475]
        },
        conMarginTop: 200,
        qrCodeborderBottom: 22,
        content: path.join(__dirname, '../../static/', 'gold_content.png'),
        bg: path.join(__dirname, '../../static/', 'gold_bg.jpg')
      },
      // 银卡
      silver: {
        text: {
          colors: ['white'],
          font: ['70px Regular'],
          positionY: [475]
        },
        conMarginTop: 200,
        qrCodeborderBottom: 22,
        content: path.join(__dirname, '../../static/', 'silver_content.png'),
        bg: path.join(__dirname, '../../static/', 'silver_bg.jpg')
      },
      // 集团商城
      groupMall: {
        text: {
          colors: ['white'],
          font: ['70px "hei"'],
          positionY: [490]
        },
        conMarginTop: 450,
        qrCodeborderBottom: 80,
        content: path.join(__dirname, '../../static/', 'groupmall_content.png'),
        bg: path.join(__dirname, '../../static/', 'groupmall_bg.jpg')
      },
      // 商城推广
      mall: {
        conMarginTop: 580 - 120,
        qrCodeborderBottom: 80,
        text: {
          colors: ['#573f1a', '#543F1E', '#BA7348'],
          font: ['65px Regular', '60px Regular', '60px Regular'],
          positionY: [623 - 120, 1230 - 120, 1400 - 120]
        },
        content: path.join(__dirname, '../../static/', 'mall_content.png'),
        bg: path.join(__dirname, '../../static/', 'mall_bg.jpg')
      },
      room: {
        conMarginTop: 0,
        qrCodeborderBottom: 563,
        text: {
          colors: ['#F4D0A5', '#543F1E', '#3E3D45'],
          font: ['70px Regular', '55px Regular', '55px Regular'],
          positionY: [395, 2130, 2280]
        },
        content: path.join(__dirname, '../../static/', 'room_content.png'),
        bg: '#D6BBA7'
      },
      // 注册
      registered: {
        text: {
          colors: ['white'],
          font: ['60px Regular'],
          positionY: [368]
        },
        conMarginTop: 285,
        qrCodeborderBottom: 0,
        content: path.join(
          __dirname,
          '../../static/',
          'registered_content.png'
        ),
        bg: path.join(__dirname, '../../static/', 'registered_bg.jpg')
      }
    }
  }
  
  }
```

以上是类的配置信息
text 是文字信息，因为有的图片需要绘制多次文字，所以是数组，这个地方的数据结构最后被修改成数组套对象
conMarginTop是图片距离绝对定位原点的上边距
... 等配置信息


### 方法实现
```javascript
const { createCanvas, loadImage, registerFont } = require('canvas')
const { get, trim, map } = require('lodash')
const path = require('path')

registerFont(path.join(__dirname, '../../static/heiti.ttf'), { family: 'hei' })

class MarketingImage {
  constructor() {
    const self = this

    // 输出图片的缩小比例
    this.scale = 2
    this.canvasSize = {
      w: 1500 / self.scale,
      h: 2668 / self.scale
    }

    // 二维码
    this.qrcode = {
      w: 725 / self.scale,
      h: 725 / self.scale
    }
    // 单行文字长度
    this.rowTxtLenth = 15
    // 字体通用行高
    this.lineHeihgt = 40
    // 最大文本个数
    this.txtMaxLenth = 28
    //   图片配置
    this.imageObj = {
      // 金卡
      gold: {
        text: {
          colors: ['white'],
          font: ['34px hei'],
          positionY: [460 / self.scale]
        },
        conMarginTop: 200 / self.scale,
        qrCodeborderBottom: 22 / self.scale,
        content: path.join(__dirname, '../../static/', 'gold_content.png'),
        bg: path.join(__dirname, '../../static/', 'gold_bg.jpg')
      },
      // 银卡
      silver: {
        text: {
          colors: ['white'],
          font: ['34px hei'],
          positionY: [463 / self.scale]
        },
        conMarginTop: 200 / self.scale,
        qrCodeborderBottom: 22 / self.scale,
        content: path.join(__dirname, '../../static/', 'silver_content.png'),
        bg: path.join(__dirname, '../../static/', 'silver_bg.jpg')
      },
      // 集团商城
      groupMall: {
        text: {
          colors: ['white'],
          font: ['34px "hei"'],
          positionY: [490 / self.scale]
        },
        conMarginTop: 450 / self.scale,
        qrCodeborderBottom: 80 / self.scale,
        content: path.join(__dirname, '../../static/', 'groupmall_content.png'),
        bg: path.join(__dirname, '../../static/', 'groupmall_bg.jpg')
      },
      // 商城推广
      mall: {
        conMarginTop: 460 / self.scale,
        qrCodeborderBottom: 75 / self.scale,
        text: {
          colors: ['#573f1a', '#543F1E', '#BA7348'],
          font: ['34px hei', '29px hei', '29px hei'],
          positionY: [500 / self.scale, 1080 / self.scale, 1260 / self.scale]
        },
        content: path.join(__dirname, '../../static/', 'mall_content.png'),
        bg: path.join(__dirname, '../../static/', 'mall_bg.jpg')
      },
      room: {
        conMarginTop: 0 / self.scale,
        qrCodeborderBottom: 710 / self.scale,
        text: {
          colors: ['#F4D0A5', '#543F1E', '#3E3D45'],
          font: ['34px hei', '29px hei', '29px hei'],
          positionY: [395 / self.scale, 1950 / self.scale, 2190 / self.scale]
        },
        content: path.join(__dirname, '../../static/', 'room_content.png'),
        bg: '#D6BBA7'
      },
      // 注册
      registered: {
        text: {
          colors: ['white'],
          font: ['34px hei'],
          positionY: [412 / self.scale]
        },
        conMarginTop: 330 / self.scale,
        qrCodeborderBottom: 20 / self.scale,
        content: path.join(
          __dirname,
          '../../static/',
          'registered_content.png'
        ),
        bg: path.join(__dirname, '../../static/', 'registered_bg.jpg')
      }
    }
  }

  /**
   * 生成混合或者内容区域
   *
   * @param {*} file
   * @param {*} qrcodeUrl
   * @param {*} [texts=[]]
   * @param {boolean} [crawBg=true]
   * @returns
   * @memberof MarketingImage
   */
  async createFullImage(file, qrcodeUrl, texts = [], crawBg = true) {
    const { imageObj, qrcode } = this

    if (!imageObj[file]) {
      throw new Error('不存在的文件属性')
    }

    if (!trim(qrcodeUrl)) {
      throw new Error('二维码链接为空')
    }
    const [bg, content, qr] = await Promise.all([
      // 如果没有背景就不加载背景
      logicString(imageObj[file].bg)
        ? loadImage(imageObj[file].bg)
        : imageObj[file].bg,
      loadImage(imageObj[file].content),
      loadImage(qrcodeUrl)
    ])
    const canvas = createCanvas(this.canvasSize.w, this.canvasSize.h)
    const ctx = canvas.getContext('2d')

    // 获取画图宽高
    const { width: canvasW, height: canvasH } = ctx.canvas

    const contentW = content.width / this.scale
    const contentH = content.height / this.scale

    // 绘制背景
    if (crawBg && imageObj[file].bg) {
      // 16进制背景色
      if (/#.{6}$/g.test(get(imageObj, [file, 'bg']))) {
        ctx.fillStyle = imageObj[file].bg
        ctx.fillRect(0, 0, canvasW, canvasH)
      } else {
        ctx.drawImage(bg, 0, 0, canvasW, canvasH)
      }
    }
    // 绘制中间内容
    ctx.drawImage(
      content,
      (canvasW - contentW) / 2,
      imageObj[file].conMarginTop,
      contentW,
      contentH
    )
    // 绘制二维码
    ctx.drawImage(
      qr,
      (canvasW - qrcode.w) / 2,
      imageObj[file].conMarginTop +
        contentH -
        qrcode.h -
        get(imageObj, [file, 'qrCodeborderBottom'], 0),
      qrcode.w,
      qrcode.h
    )

    // 文字的偏移点在中心点
    ctx.textAlign = 'center'

    // 循环绘制多个
    for (let i = 0; i < texts.length; i++) {
      // 文字属性
      ctx.font = imageObj[file].text.font[i]
      // 文字颜色
      ctx.fillStyle = imageObj[file].text.colors[i]
      // 绘制文字

      // 如果文字超过最大限制，则替换成 ...
      let _t = txtLengthHeadle(texts[i], this.txtMaxLenth)

      if (_t.length <= this.rowTxtLenth) {
        ctx.fillText(_t, canvasW / 2, imageObj[file].text.positionY[i])
      } else {
        //  tIndex 字数 line 行数
        for (
          let tIndex = 0, line = 0;
          tIndex < _t.length;
          tIndex += this.rowTxtLenth, line += 1
        ) {
          ctx.fillText(
            _t.slice(tIndex, tIndex + this.rowTxtLenth),
            canvasW / 2,
            imageObj[file].text.positionY[i] + line * this.lineHeihgt
          )
        }
      }
    }
    return canvas.toDataURL()
  }

  /**
   * 背景图
   *
   * @param {*} file
   * @returns
   */
  async backgroundImage(file) {
    const { imageObj, canvasSize } = this
    if (!imageObj[file]) {
      throw new Error('不存在的文件属性')
    }
    const bgUrl = get(imageObj, [file, 'bg'])
    if (!bgUrl) {
      throw new Error('没有背景')
    }
    let canvas = createCanvas(canvasSize.w, canvasSize.h)

    let ctx = canvas.getContext('2d')
    // 16进制颜色
    if (logicString(bgUrl)) {
      const bg = await loadImage(bgUrl)
      // 绘制背景
      ctx.drawImage(bg, 0, 0, canvasSize.w, canvasSize.h)
    } else {
      // 绘制背景颜色
      ctx.fillStyle = imageObj[file].bg
      ctx.fillRect(0, 0, canvasSize.w, canvasSize.h)
    }

    return canvas.toDataURL()
  }
}

//  判断是否为空或者是否颜色
function logicString(str) {
  if (!str) return null
  if (/#.{6}$/g.test(str)) return null
  return true
}

// 文字长度处理
function txtLengthHeadle(txt, txtMaxLenth) {
  let resultMsg = txt
  if (txt.length > txtMaxLenth) {
    resultMsg = txt.slice(0, txtMaxLenth - 4)
    resultMsg += '...」'
  }
  return resultMsg
}

module.exports = new MarketingImage()

```
### 最终效果

!['result'](/imgs/canvas_result.jpg)
其实二维码是可以放出来的，但是因为是测试环境，所以就不放了  

黑边是我截图截的

以上是代码实现，踩到的坑:  
第一个是安装问题,因为安装需要C++编译，所以很慢  
第二个就是字体了  
第三个就是速度，最后选择压缩大小，这块可以通过图片不使用base64，采用文件文件存储来实现也可以，但是本质上网络还是需要加载这么大的一个资源  

