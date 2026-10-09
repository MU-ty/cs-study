# C++ / Java 在线编译器

独立入口 `/compiler/`，使用 OneCompiler 官方 iframe 嵌入编辑器，支持 C++ 和 Java 的代码编译与运行、STDIN 和结果显示。GitHub Pages 只托管页面，代码与输入由第三方 OneCompiler 处理，不是本站自托管编译后端。

两种语言各有独立 iframe，首次切换到 Java 时才加载，不因语言切换销毁窗口。页面刷新或退出后不保证恢复代码，请自行保存。编辑器支持独立窗口 fallback，不假定 iframe load 事件意味着编译服务健康。

附六个示例：每种语言 Hello World、标准输入两数之和、数组求和。示例可复制或在用户确认后通过官方 `populateCode` 事件替换编辑器文件。postMessage 只发送到 `https://onecompiler.com`，不使用通配目标源。STDIN 需手动输入，示例加载不会自动触发运行。

依赖网络与第三方可用性。版本、资源与额度以服务界面为准。不要提交密码、API Key 或私有业务代码。未在本站保存代码或引入执行凭证。

官方文档：https://onecompiler.com/apis/embed-editor

语法、页面交互模拟和本地样例结果可以验证，但不能替代在线服务的真实运行验收。
