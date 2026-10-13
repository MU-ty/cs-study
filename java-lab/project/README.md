# Java 17 成绩管理命令行项目

无需第三方库、数据库或构建工具。下载 `GradeManager.java`，使用完整 JDK 17+：

```sh
java GradeManager.java
```

也可以 `javac GradeManager.java` 后 `java GradeManager`。在线编译器若要求 `Main` 类，可把公开类名和 `GradeManager::print` 方法引用改成 `Main`；文件导入导出更适合在本机运行。

## 输入一轮实验

```text
add 1 85 穆天宇
add 2 92 Li Ming
list
get 1
update 1 95
top
avg
save grades.tsv
delete 1
load grades.tsv
list
quit
```

`add` 顺序为 ID、分数、姓名。姓名可以含空格，不支持 tab/换行。ID 为正 long，分数 0..100；最高分同分时按 ID 升序（与前面的最小核心示例“同分大 ID 优先”不同，此项目明确选用小 ID 优先）。`list` 也是成绩降序、ID 升序。

支持新增、查找、改分、删除、排序、最高分、平均分与 UTF-8 TSV 存取。空册 list/top/avg 显示 EMPTY。失败命令输出 ERROR 原因并可继续输入，不伪装成功；参数/重复 ID/损坏文件验证失败不改变现有成绩册。

## 数据通路

`main` 读整行 → `execute` 分派命令 → `Student` 检查不变量 → `GradeBook` 操作 Map → 排序/聚合/文件输出。

保存按 ID 排序，写同目录临时文件，完成关闭后尽量原子替换目标；若文件系统不支持原子移动则退回普通替换。这减少半写文件的可见性，不承诺断电后 fsync 耐久性。保存会覆盖指定的目标文件，父目录必须存在。

加载先逐行解析到候选 Map，校验表头、字段、分数、重复 ID 和最多 10000 条记录，全部成功才替换当前成绩册。它是“整体替换”语义，不是合并。UTF-8 文件首行固定 `id<TAB>name<TAB>score`，不使用逗号转义，也不是通用 CSV 解析器。

这是单线程、单进程教学项目，没有权限系统、并发更新、数据库事务或多用户文件锁。先验证这些边界，再按课程路线扩为 JDBC 或 Web 服务。
