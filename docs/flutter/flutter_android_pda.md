# Flutter对接Android PDA（手持终端）设备硬件
![设备打印](E:\test\coolliyong.github.io\imgs\flutter_android_device\flutter_print.jpg)

## 背景
公司需要开发一个项目，需要使用实现手持设备拍照、提交订单、打印缴款单，刚开始考虑使用h5，上面说h5性能太差了，可以使用`React Native` 或者 `Flutter`,
我想了一下决定使用`Flutter`，面相未来。
这篇文章主要是记录踩过的坑。

## APP搭建
先使用命令创建APP，这里我指定了android的语言为java，因为kotlin不太会
```shell
flutter create --project-name coolliyong_app --android-language java
```

目录结构如下：

| android      | Android 程序代码目录 |
|--------------|----------------|
| build        | 构建目录（不用管       |
| ios          | ios 程序代码目录     |
| lib          | 主要程序编写目录       |
| linux        | linux 程序代码目录   |
| macos        | macos 程序代码目录   |
| test         | test 代码目录      |
| web          | web 程序代码目录     |
| windows      | windows 程序代码目录 |
| pubspec.yaml | 依赖，静态资源配置文件    |


搭建的过程并不顺利，必须要爬梯子.... 页面开发完成后，准备看看设备提供的*PirntSDK对接文档*,

## 封装`Android` 相关代码

1. 在android/app/ 下新建libs 目录，把打印SDK放进去。
2. 在android/app/build.gradle 目录下添加SDK的配置
```java
dependencies {
    implementation(name: 'printer-release', ext: 'aar')
}
```
3. 根据对接文档，在android/app/src/main/AndroidManifest.xml 中配置权限.
4. 封装打印类
```Java
// 这里根据文档来写打印，我这里是封装了一个打印类
class PrintMethodChannel implements PrintUtil.PrinterBinderListener{
    // channel 通道，用来和flutter 通信的通道名
    private static final String METHOD_CHANNEL = "flutter/android";
    // channel 通道，用来和flutter 通信的通道
    private MethodChannel methodChannel;
    
    
     /**
     * 初始化打印插件
     *
     * @param flutterEngine 传入flutter 引擎
     */
    public void init(@NonNull FlutterEngine flutterEngine) {
        // 初始化通道
        methodChannel = new MethodChannel(flutterEngine.getDartExecutor().getBinaryMessenger(), METHOD_CHANNEL);
        // 接受fltuter端传递过来的方法，并做出响应逻辑处理
        methodChannel.setMethodCallHandler((call, result) -> {
            
            // 打印文本方法
            if (call.method.equals("printText")) {
                int offset = call.argument("offset");
                int fontSize = call.argument("fontSize");
                boolean isBold = call.argument("isBold");
                boolean isUnderLine = call.argument("isUnderLine");
                String content = call.argument("content");
                // 打印文本
                printUtil.printText(offset, fontSize, isBold, isUnderLine, content);
            }

            // 打印白线
            if (call.method.equals("printLine")) {
                int line = call.argument("line");
                printUtil.printLine(line);
            }

            // 打印二维码
            if (call.method.equals("printQR")) {
                String content = call.argument("content");
                int offset = call.argument("offset");
                int height = call.argument("height");
                printUtil.printQR(offset, height, content);
            }
            
            // 前面的打印只是进入打印队列，这里开始，才会正式打印。
            if (call.method.equals("start")) {
                printUtil.start();
            }
        });
    }
    
    
}
```
带这里，基本的打印就封装完成了，一些错误监听之类的代码就没有放出来了，根据不同SDK，有不同的API，这里主要演示flutter 对接原生android
5. 重点：在android 中监听flutter调过来的方法。
```java
public class MainActivity extends FlutterActivity {
    PrintMethodChannel printMethodChannel = new PrintMethodChannel();
    @Override
    public void configureFlutterEngine(@NonNull FlutterEngine flutterEngine) {
        super.configureFlutterEngine(flutterEngine);
        // 初始化插件,把flutter 引擎的 实例传过去
        printMethodChannel.init(flutterEngine);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // 增加监听
        printMethodChannel.initListen(this);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        // 移除监听
        printMethodChannel.removeListen();
    }
}
```

到这里，android 部分的代码就写完了。



6. 接下来写flutter代码，在flutter中调用java代码。

```dart
class PrintUtil {
  static final MethodChannel methodChannel = MethodChannel('flutter/android');

  late Function errorCallBack;

  static printText(
      int offset, int fontSize, bool isBold, bool isUnderLine, String content) {
    methodChannel.invokeMethod("printText", {
      'offset': offset,
      'fontSize': fontSize,
      'isBold': isBold,
      'isUnderLine': isUnderLine,
      'content': content
    });
  }

  static init() {
    methodChannel.setMethodCallHandler(
      (MethodCall call) async {
        if (call.method == "printCallback") {
          int state = call.arguments;
          printResultCheck(state);
        }
      },
    );
  }

  static printResultCheck(int state) {
    if (IErrorCodeConfig.ERROR_NO_ERROR == state) {
      //打印成功
      BotToast.showText(text: "打印完成");
      return;
    }

    String errorMsg = "";
    if (IErrorCodeConfig.ERROR_PRINT_NOPAPER == state) {
      errorMsg = "打印缺纸";
    }
    // .....
    }

  }

  static printLine(int line) {
    methodChannel.invokeMethod("printLine", {'line': line});
  }

  static start() {
    methodChannel.invokeMethod("start");
  }

  static void printQR(int offset, int height, String content) {
    methodChannel.invokeMethod(
        "printQR", {'offset': offset, 'height': height, 'content': content});
  }

  static void printBase64(int offset, String base64) {
    methodChannel
        .invokeMethod("printBase64", {'offset': offset, 'base64': base64});
  }

  static void printBarcode(int offset, int height, String content,
      int barcodeType, int hriPosition) {
    methodChannel.invokeMethod("printBarcode", {
      'offset': offset,
      'height': height,
      'content': content,
      'barcodeType': barcodeType,
      'hriPosition': hriPosition
    });
  }
}
```

7. 写到这里，基本都已经结束了，剩下的就是调试了，可以用过静态方法调用打印，去调试。


#### 踩过的坑：
    1. dart 和java 的数据结构不一样，这里必须要多看文档去写，不然容易报错报打心累。  
    2. flutter 如果每次修改了android的代码，要在android 项目里执行下 gradle async 同步  
    3. 如果出现一些奇怪的错误，看看是不是提示的依赖，提示的依赖，就需要先删除依赖，然后执行gradle 命令
        然后再来运行flutter项目（它会自动下载flutter依赖)  
    4. flutter 更新的很快，有些你上网查到的东西不一定能用，需要结果官网文档一起使用。

## 最后感慨：  
1. flutter 在页面布局上很快，也很容易上手，但是遇到一些复杂的布局，还是要查文档，毕竟和H5、RN 不是一个东西。
  
2. flutter 如果需要考虑到热更新、工程化之类的东西，也是一个比较复杂的学科。尤其是在集成三方库（地图）时，这里
我先使用baidu的flutter地图，调试了很久，发现效果不如意，看了一下高德地图的flutter插件，最后选择使用高德调试，虽然它也有一段时间没更新，但是demo改改还是跑得起来。
3. 这里说明：如果需要用到了原生能力，尽量还是具备原生能力，否则很难蹚过这个坑。
