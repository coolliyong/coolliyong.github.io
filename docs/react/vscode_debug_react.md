## 使用VScode debug React项目

需要安装最新版本的`VS Code`和`VS Code Chrome Debugger Extension`  

然后将下面的块添加到您的`launch.json`文件中，并将其放在`.vscode`应用程序根目录下的文件夹中。


```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Chrome",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/src",
      "sourceMapPathOverrides": {
        "webpack:///src/*": "${webRoot}/*"
      }
    }
  ]
}
```
然后先`npm start`启动项目，在使用`vscode debug`