# Redis 深度学习实验室

访问：https://MU-ty.github.io/cs-study/redis-lab/

中文原创导学，26 章、6 阶段、18 类交互图解/实验、3 张精确 SVG 原理配图、26 道章节自测。以 Redis 7.2 经典命令为实验基线，明确新版功能与可用性差异。首页入口接入 CS Study 主站。

## 内容组织

1. 起步：系统定位、本机安装、key 与 TTL。
2. 数据结构：String、Hash、List、Set、ZSet、Bitmap/HLL/GEO、Stream。
3. 原理：事件循环、编码与 rehash、过期与淘汰、RDB/AOF、事务/WATCH/Pipeline、Lua。
4. 业务：Cache Aside 一致性竞态、穿透/击穿/雪崩、锁所有权、限流/幂等/秒杀边界。
5. 分布式：主从全量/部分同步、Sentinel 判定与选举、Cluster 哈希槽与迁移。
6. 工程：Java/Spring Boot 接入、容量/性能/安全、商品服务与排行榜综合任务、复习推导。

主线知识优先，选学和进阶标注；每章含核心讲解、代码或比较、失败边界、自测解析与官方文档。综合项目提供需求、实现顺序、故障验收及练习参考思路，并非已实现的完整 Java/MySQL 后端。

## 交互与数据边界

- 缓存路径、旧值回填、锁超时、持久化窗口、Stream Pending、rehash、复制、Sentinel 等支持逐步切换和回看。
- CRC16/XMODEM + UTF-8 计算真实 Cluster 槽号，遵循首个有效非空 hash tag 规则。节点槽区间为教学配置。
- 排行榜、Bitmap、淘汰直觉、库存分支、RTT/Pipeline 计算可调整参数；性能计算是假设模型，不是实测。
- 命令模拟器支持 24 个 Redis 基础命令子集，以及 HELP/RESET 模拟器命令。不实现完整协议/选项、网络、并发、事务或持久化。
- 支持：PING、SET、GET、DEL、EXISTS、TYPE、TTL、EXPIRE、PERSIST、INCR、INCRBY、HSET、HGET、HGETALL、LPUSH、RPUSH、LPOP、LRANGE、SADD、SMEMBERS、SCARD、SISMEMBER、ZADD、ZRANGE。
- SET 支持 NX/XX、EX/PX、KEEPTTL；ZRANGE 仅按排名，支持 REV/WITHSCORES。未实现参数明确报错。
- 模拟时钟只通过“推进 10 秒”改变。模拟数据不跨页面保存。真实实验需运行本机 Redis。
- 学习进度、答案、笔记及主题只存当前浏览器 localStorage，可导出 JSON；无登录或跨设备同步。

## 开发与部署

原生 HTML/CSS/JS，无 CDN、无运行依赖、无需构建。沿用仓库现有 GitHub Pages Jekyll workflow，推送 main 后自动发布。Hash 路由避免 Pages 子路径刷新 404；资源采用相对路径。CSS 包含手机目录、深浅主题、键盘焦点与打印样式。

文件：`lessons.js` 内容、`app.js` 导航/状态、`labs.js` 交互、`engine.js` 命令子集和 CRC16、`images/` 原理图。

验证：

```sh
node --test redis-lab/test.cjs
node --check redis-lab/app.js
node --check redis-lab/labs.js
```

12 组测试覆盖 TTL、NX/XX、错误不修改状态、64 位整数和溢出、类型错误、数据结构边界、CRC16 标准向量/UTF-8/hash tag 以及课程实验引用完整性。另用临时 linkedom 环境验证全部章节生成、题目反馈、笔记/进度、所有实验初始化、关键操作、搜索和主题/手机菜单逻辑。DOM 检查不能代替真实浏览器视觉验收；本次环境未进行浏览器截图验收。

参考：每章链接 Redis 官方文档；Java 接入另链接 Spring Boot 3.5 官方文档。内容核对日期 2026-10-13。
