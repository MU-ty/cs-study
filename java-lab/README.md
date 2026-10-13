# Java 深度学习实验室

网址：https://MU-ty.github.io/cs-study/java-lab/

30 章中文核心课程，六阶段各 5 章；28 类交互图解/实验、3 张 SVG 原理配图、30 个可下载单文件核心示例与 30 道自测、30 道编程/边界练习（提示与参考分开折叠）。核心基线 Java 17，Java 21 虚拟线程明确标为拓展，不使用 preview 功能。

## 课程

1. 语言基础：JDK/JVM、基本类型、表达式、循环、数组。
2. 对象与设计：方法/递归栈、值传递、String、构造、封装/static/final。
3. 类型与异常：继承/动态分派、接口、泛型/擦除、异常、record/枚举/相等契约。
4. 集合与函数式：结构选型、ArrayList/LinkedList、Set/Comparator、HashMap、Lambda/Stream。
5. I/O 与并发：文件/编码、日期/金额、线程/中断、同步/内存模型、线程池/并发容器。
6. 运行时与工程：JVM/GC、JDBC/事务/DAO、测试/Maven、成绩管理器、复习与后端路线。

每章先完整核心代码与预期输出，再讲规则、边界、图解和自测。`examples/<chapter>/Main.java` 可下载并以 `java Main.java` 运行，也可以复制到主站 Java 编译器。外部在线运行依赖 OneCompiler 服务，其版本/资源限制以服务界面为准。

## 示例和模型的真实边界

- 30 个独立核心示例全部用 OpenJDK 17 实际运行核对 stdout。JDBC 章的独立入口仅输出环境要求，实际 JDBC 查询/事务是另列的集成片段，需驱动和 MySQL；未宣称已对真实数据库集成验收。
- Java 21 虚拟线程片段不属于 Java 17 核心样例验收。
- 成绩管理器最小核心实现参数校验、ID 去重、最高分和平均分。新增 `project/GradeManager.java` 是完整单线程命令行项目，支持增查改删、同分排序、UTF-8 TSV 保存与整体导入，导入失败不改变原数据；JDBC/Web/Redis 扩展仍为后续练习目标。
- 每章补充一题编程或边界推导练习，提供输入案例、可选提示、参考片段与限制说明；参考答案不是任意代码执行沙箱。
- 19 类逐步图解追踪编译、调用栈、引用、字符串、对象、多态、异常、线程竞争、GC、JDBC 等；9 类参数实验包含窄化转换、循环、数组、ArrayList 插入、排序、HashMap、Stream、线程池和成绩管理。
- HashMap 模型使用 Java String 的 UTF-16 hashCode 及常见 spread 公式；4→8 的容量变化是教学配置，不模拟所有 JDK 内部实现或树化。
- Stream 按阶段展示快照便于阅读；不声称真实 Stream 会把每个阶段完整物化。线程池是有界手动调度模型，不是真实并发运行。
- 页面不执行任意 Java，也不连接数据库。实验数据仅当前页面内存；学习进度、笔记、答案与主题保存在当前浏览器，可导出 JSON。

## 部署

原生 HTML/CSS/JS，无外部前端依赖或 CDN。沿用 `MU-ty/cs-study` 的 GitHub Pages workflow，main 推送后自动更新。Hash 路由与相对资源路径适配 Pages 项目子路径。提供手机目录、深浅主题、键盘焦点和打印样式。

## 验证

```sh
node --test java-lab/test.cjs
python java-lab/project/verify_project.py
python java-lab/verify_examples.py
node --check java-lab/app.js
node --check java-lab/labs.js
```

10 组边界/内容测试：窄化、有符号哈希/UTF-16、碰撞/扩容、输入验证、Stream 非破坏性、线程池背压/关闭、学生不变量、课程/实验/下载文件完整性及全部章节练习覆盖。

完整 CLI 项目另有 6 组 Java 17 黑盒测试，覆盖增查改删与同分顺序、非法操作不变性、中文文件回读、损坏/重复文件导入不变性、保存失败和表头错误、空册/空文件替换。测试在临时目录运行，不改用户文件。

另在临时 linkedom 环境检查全部 30 章渲染、28 类实验、自测、示例入口、笔记/进度恢复、全部动态控件的边界、搜索/主题/手机菜单逻辑。检查 SVG XML、HTML 片段和本地资源路径。当前环境未进行真实浏览器视觉截图验收，DOM 逻辑检查不能替代它。

参考官方 Dev.java、Java 17 API/JLS/JVMS 和 JDBC 官方教程，每章提供链接。核对日期：2026-10-13。
