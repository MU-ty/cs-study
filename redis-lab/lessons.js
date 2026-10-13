const LESSONS = [
  {
    "id": "overview",
    "group": "01 起步与选型",
    "title": "Redis 在系统中的位置",
    "level": "必学",
    "minutes": 12,
    "summary": "先理解它解决什么问题，再学命令。",
    "body": "<h2>从一次商品查询开始</h2><p>数据库负责可靠保存商品；Redis 保存高频访问数据的副本。请求先读缓存，未命中再读数据库并回填。缓存减少数据库压力，但引入过期、失效和一致性问题。Redis 也可以承担计数器、排行榜、会话及消息流，不能把它只理解成一个 Map。</p><h2>Redis 与 MySQL 各自擅长什么</h2><div class=\"table-scroll\"><table><thead><tr><th>维度</th><th>Redis</th><th>MySQL</th></tr></thead><tbody><tr><td>模型</td><td>键与数据结构，按 key 寻址</td><td>关系表、SQL、约束、索引</td></tr><tr><td>读写路径</td><td>主要操作内存，支持持久化</td><td>缓冲池 + 磁盘与事务日志</td></tr><tr><td>关系查询</td><td>通常由应用组织</td><td>JOIN、聚合、事务</td></tr><tr><td>选择</td><td>低延迟缓存与数据结构操作</td><td>业务事实、复杂关系与事务</td></tr></tbody></table></div><h2>理解“快”的前提</h2><p>内存访问、合适的数据结构、事件驱动网络处理共同贡献性能。大 key、长 Lua 脚本、全库扫描仍会阻塞其他请求。常见命令执行主要由主线程串行处理，后台线程/进程参与 I/O、删除和持久化；“Redis 完全单线程”并不准确。</p><aside class=\"note\">本课程核心实验以 Redis 7.2 的经典命令为基线；Redis 8 的新增数据类型作为拓展阅读，避免把新版功能误当成所有环境都有。学习时间是建议阅读时间，不含动手实验。</aside>",
    "question": [
      "商品缓存丢失后，理想系统应该怎样？",
      "从数据库重建缓存",
      "商品永久丢失",
      "把 Redis 当唯一备份"
    ],
    "answer": 0,
    "explain": "缓存应能从业务事实重建。高命中率不能替代数据库的数据安全。",
    "lab": "cache",
    "source": "https://redis.io/docs/latest/develop/data-types/"
  },
  {
    "id": "setup",
    "group": "01 起步与选型",
    "title": "安装、连接与第一个实验",
    "level": "必学",
    "minutes": 15,
    "summary": "在本机启动一个可重复的 Redis 实验环境。",
    "body": "<h2>先跑起来：Docker 本地实验</h2><pre><code>docker run -d --name redis-learn \\\n  -p 127.0.0.1:6379:6379 \\\n  -v redis-learn-data:/data \\\n  redis:7.2 redis-server --appendonly yes\ndocker exec -it redis-learn redis-cli\nPING\nSET greeting &quot;hello redis&quot;\nGET greeting\nINFO server</code></pre><p>端口绑定 127.0.0.1，只供本机连接。命名卷保存 /data；停止和再次启动容器不会自动清空该卷。PING 返回 PONG，SET 返回 OK，GET 返回字符串。生产环境要固定补丁版本或镜像摘要，并设置 ACL、网络隔离与备份。</p><h2>命令的三部分</h2><pre><code>SET user:42:name &quot;Mu&quot; EX 60\n# 命令  key           value  选项\nTTL user:42:name\nTYPE user:42:name\nDEL user:42:name</code></pre><p>key 区分大小写，冒号只是命名习惯，不会创建目录。命令通常不区分大小写。每条连接有状态：当前数据库、事务、订阅等；连接池借还时要避免遗留状态。</p><h2>观察与清理</h2><pre><code>docker logs redis-learn\ndocker stop redis-learn\ndocker start redis-learn</code></pre><aside class=\"note\">浏览器练习区是命令子集模拟器，不是真实 Redis；持久化、事务、网络和并发实验需在本地实例执行。</aside>",
    "question": [
      "SET 成功通常返回什么？",
      "OK",
      "PONG",
      "nil"
    ],
    "answer": 0,
    "explain": "PING 的结果才是 PONG。GET 查询不存在的 key 返回 nil。",
    "lab": "terminal",
    "source": "https://redis.io/docs/latest/commands/"
  },
  {
    "id": "keys",
    "group": "01 起步与选型",
    "title": "Key、TTL 与命名规范",
    "level": "必学",
    "minutes": 15,
    "summary": "把生命周期设计好，比多记几个命令更重要。",
    "body": "<h2>先代码，再读状态</h2><pre><code>SET session:42 token EX 120\nTTL session:42\nEXPIRE session:42 30\nPERSIST session:42\nTTL session:42\nDEL session:42\nTTL session:42</code></pre><p>TTL 返回剩余秒数，-1 表示 key 存在但没有过期时间，-2 表示 key 不存在。PTTL 用毫秒。EXPIRE 在 key 上设置期限；PERSIST 移除期限。一般 SET 覆盖已有 key 会清除旧 TTL，除非使用 KEEPTTL 等选项。</p><h2>命名与容量</h2><p>采用业务:实体:id，例如 shop:product:42。明确 value 类型、序列化方式、TTL、估算数量和大小。多租户 key 必须含租户标识，避免混读。不要把用户输入直接拼成管理命令。</p><h2>批量查找的边界</h2><pre><code>SCAN 0 MATCH shop:product:* COUNT 100\nUNLINK shop:product:42</code></pre><p>KEYS * 会遍历全库并阻塞，线上优先 SCAN。SCAN 是游标迭代，COUNT 是提示值，不保证每批恰好 100 条；可能重复返回，迭代期间变化的 key 也没有快照保证。UNLINK 将释放大 value 的工作移到后台，仍应控制批量删除速率。</p>",
    "question": [
      "TTL 返回 -1 表示？",
      "key 不存在",
      "key 存在且无过期时间",
      "已经过期一秒"
    ],
    "answer": 1,
    "explain": "不存在是 -2；无过期时间是 -1。",
    "lab": "ttl",
    "source": "https://redis.io/docs/latest/commands/"
  },
  {
    "id": "string",
    "group": "02 数据结构",
    "title": "String：缓存与原子计数",
    "level": "必学",
    "minutes": 18,
    "summary": "String 是字节序列，既可保存文本，也可用于计数。",
    "body": "<h2>常用命令</h2><pre><code>SET page:views 0\nINCR page:views\nINCRBY page:views 10\nMSET user:42:name Mu user:42:city Guilin\nMGET user:42:name user:42:city\nSET lock:job abc NX PX 10000</code></pre><p>INCR 是 Redis 端的一条原子命令，避免 GET→客户端加一→SET 的丢失更新。已有 value 必须是可解析的整数，且不能越过有符号 64 位整数范围。SET NX 只在 key 不存在时写入，XX 则只在存在时写入。</p><h2>计数器为什么不用 GET + SET</h2><p>A、B 同时读到 10，各自写 11，结果少算一次。INCR 把读取、加一和写入合成服务器内的一个操作。若计数后再 EXPIRE，中间崩溃可能留下永不过期的 key；需要 Lua 或其他原子方案把两步结合。</p><h2>底层：逻辑类型和编码不是一回事</h2><p>String 逻辑上是字节串，内部可能采用整数编码、短字符串编码或动态字符串。SDS 保存长度、容量信息，读取长度无需扫描到空字符；二进制安全不等于自动理解 JSON。OBJECT ENCODING 可观察当前内部编码，但不要依赖它作为业务协议。</p>",
    "question": [
      "两个客户端 GET 后分别 SET(n+1)，能保证不丢计数吗？",
      "能",
      "不能",
      "只要 Redis 单线程就能"
    ],
    "answer": 1,
    "explain": "单命令串行不代表多条客户端命令组成的操作自动原子。",
    "lab": "terminal",
    "source": "https://redis.io/docs/latest/develop/data-types/"
  },
  {
    "id": "hash",
    "group": "02 数据结构",
    "title": "Hash：对象与局部更新",
    "level": "必学",
    "minutes": 15,
    "summary": "把一条记录拆成 field-value，按字段读写。",
    "body": "<h2>用户资料实验</h2><pre><code>HSET user:42 name Mu age 20 city Guilin\nHGET user:42 name\nHMGET user:42 name city\nHINCRBY user:42 age 1\nHGETALL user:42\nHDEL user:42 city</code></pre><p>外层 key 是 user:42，内层 field 是 name、age、city。HSET 返回新增字段数，覆盖字段不计入新增数。Hash 的 value 仍是字节序列，不是嵌套对象。</p><h2>Hash 还是 JSON String</h2><div class=\"table-scroll\"><table><thead><tr><th>需求</th><th>选择</th><th>原因</th></tr></thead><tbody><tr><td>整份文档读写</td><td>String + JSON</td><td>序列化简单，但局部修改需要整份重写</td></tr><tr><td>独立字段访问、增量计数</td><td>Hash</td><td>HGET/HSET/HINCRBY 可局部操作</td></tr><tr><td>嵌套 JSON 路径操作</td><td>相应 JSON 能力</td><td>需先确认 Redis 版本/扩展支持</td></tr></tbody></table></div><p>Redis 7.2 中 EXPIRE 对整个 Hash key 生效，不能拿它当字段 TTL。新版本存在字段过期能力，采用前先验证部署版本。小 Hash 可能使用紧凑编码，增长后转换为哈希表；阈值受配置和版本影响。HGETALL 的成本与字段数相关，大对象应分页 HSCAN。</p>",
    "question": [
      "Redis 7.2 中 EXPIRE user:42 影响什么？",
      "整个 Hash",
      "只有 name",
      "所有 user 前缀"
    ],
    "answer": 0,
    "explain": "EXPIRE 管理 key 的期限，不按前缀或 Hash 字段工作。",
    "lab": "types",
    "source": "https://redis.io/docs/latest/develop/data-types/"
  },
  {
    "id": "list",
    "group": "02 数据结构",
    "title": "List：顺序、栈与队列",
    "level": "必学",
    "minutes": 15,
    "summary": "方向决定消费顺序，可靠性需要另行设计。",
    "body": "<h2>两个方向</h2><pre><code>RPUSH jobs job-A job-B job-C\nLRANGE jobs 0 -1\nLPOP jobs\n# A 先进入、先出来：FIFO\nLPUSH stack A B C\nLPOP stack\n# 同侧进出：LIFO</code></pre><p>List 允许重复，按插入顺序保存字符串。LRANGE 的结束下标包含在结果中，-1 指最后一个元素。端点插入/弹出高效，但中间索引和范围扫描受长度影响。Redis 7.2 常见内部实现是 quicklist，节点保存紧凑的 listpack。</p><h2>消费失败怎么办</h2><pre><code>BLMOVE jobs processing LEFT RIGHT 0\n# 处理成功后\nLREM processing 1 job-A</code></pre><p>BLMOVE 原子移动到 processing，避免弹出后消费者崩溃导致任务直接丢失。还需超时回收、唯一任务 ID、重试上限和幂等处理。它不是完整消息系统；更完善的消费组机制见 Stream。阻塞等待的是客户端，不是让整个 Redis 服务器停住。</p>",
    "question": [
      "RPUSH 入队配 LPOP 消费，是什么顺序？",
      "先进先出",
      "后进先出",
      "随机"
    ],
    "answer": 0,
    "explain": "从右插入，从左取走，较早进入的元素先被消费。",
    "lab": "types",
    "source": "https://redis.io/docs/latest/develop/data-types/"
  },
  {
    "id": "set",
    "group": "02 数据结构",
    "title": "Set：去重与关系运算",
    "level": "必学",
    "minutes": 12,
    "summary": "集合没有业务顺序，适合会员、关注和标签关系。",
    "body": "<h2>从共同关注开始</h2><pre><code>SADD follows:42 alice bob bob\nSADD follows:43 bob carol\nSCARD follows:42\nSISMEMBER follows:42 alice\nSINTER follows:42 follows:43\nSUNION follows:42 follows:43\nSDIFF follows:42 follows:43</code></pre><p>重复 bob 不会新增成员。SINTER 取交集，SUNION 取并集，SDIFF 的参数顺序影响结果。SMEMBERS 不保证顺序，不能用它做按时间排序的关注列表。单个成员操作通常高效，但集合运算要遍历成员，跨大量大集合可能很贵。</p><h2>底层和取舍</h2><p>小整数集合可能采用紧凑整数表示，其他情况可能使用哈希表；具体编码随版本变化。Set 保存精确成员，可回答“谁访问过”；HyperLogLog 只估计数量，不支持取回成员。Redis Cluster 中多 key 集合运算一般要求 key 在同槽。</p>",
    "question": [
      "想精确判断用户是否点赞，应选择？",
      "Set",
      "HyperLogLog",
      "只保留总点赞数"
    ],
    "answer": 0,
    "explain": "Set 保留每个唯一成员，可用 SISMEMBER 检查。",
    "lab": "types",
    "source": "https://redis.io/docs/latest/develop/data-types/"
  },
  {
    "id": "zset",
    "group": "02 数据结构",
    "title": "Sorted Set：排行榜与范围查询",
    "level": "必学",
    "minutes": 20,
    "summary": "唯一 member 加数值 score，排名和分数分开理解。",
    "body": "<h2>积分榜</h2><pre><code>ZADD leaderboard 90 Alice 75 Bob 90 Carol\nZINCRBY leaderboard 10 Bob\nZRANGE leaderboard 0 2 REV WITHSCORES\nZRANK leaderboard Alice\nZRANGE leaderboard 80 100 BYSCORE WITHSCORES</code></pre><p>member 唯一，重复 ZADD 会更新分数。默认按 score 升序，相同分数按 member 字节字典序；REV 反转顺序。排名从 0 开始。按排名查询和按分数查询是两种不同需求。</p><h2>为什么用跳表 + 字典</h2><p>较大的 ZSet 常用字典快速定位 member，跳表维护有序索引。跳表高层让查找跨过多个节点，低层保留完整顺序，支持有序范围遍历。小 ZSet 可用 listpack 节约空间；不是所有 ZSet 都立即分配跳表。插入/排名通常 O(log N)，范围输出还需加 O(M)。</p><h2>延迟任务的限制</h2><p>将执行时间作为 score，用分数范围找已到期任务。但“查询后删除”有竞争，需原子领取；时间来源、重试和任务幂等也要处理。Sorted Set 只是调度索引，不负责自动投递。</p><figure class=\"diagram\"><img src=\"images/skiplist.svg\" alt=\"跳表索引示意：高层跳过节点，底层保持完整顺序。\" loading=\"lazy\"><figcaption>跳表索引示意：高层跳过节点，底层保持完整顺序。</figcaption></figure>",
    "question": [
      "ZRANK 返回 0 表示？",
      "升序第一名",
      "key 不存在",
      "分数是零"
    ],
    "answer": 0,
    "explain": "排名与分数是两个值，ZRANK 升序排名从 0 开始。",
    "lab": "ranking",
    "source": "https://redis.io/docs/latest/develop/data-types/"
  },
  {
    "id": "special",
    "group": "02 数据结构",
    "title": "Bitmap、HyperLogLog 与 GEO",
    "level": "选学",
    "minutes": 18,
    "summary": "根据精确度、索引范围和空间选结构。",
    "body": "<h2>Bitmap：签到</h2><pre><code>SETBIT checkin:42:202610 0 1\nSETBIT checkin:42:202610 12 1\nGETBIT checkin:42:202610 12\nBITCOUNT checkin:42:202610</code></pre><p>Bitmap 是 String 上的位操作。用月份内日期作为 offset，单个用户一个月只需少量字节。若用稀疏巨大的用户 ID 直接作 offset，会扩展底层字符串并浪费空间。BITCOUNT 统计 1 的位数，不是读取用户列表。</p><h2>HyperLogLog：UV 估计</h2><pre><code>PFADD uv:20261013 u1 u2 u2 u3\nPFCOUNT uv:20261013</code></pre><p>用于去重基数估计，标准误差约 0.81%，单个结构典型上限约 12 KB，不保存可枚举成员。“新增一个不同用户”不保证 PFCOUNT 每次恰好加一。小样本看到精确结果也不能证明大规模无误差。</p><h2>GEO：附近位置</h2><pre><code>GEOADD places 110.29 25.27 Guilin\nGEOADD places 110.30 25.28 Campus\nGEOSEARCH places FROMMEMBER Guilin BYRADIUS 5 km WITHDIST</code></pre><p>经度写在纬度前。GEO 基于有序集合编码空间信息，适合附近点查询；不等于完整 GIS。坐标系混用会产生距离偏差，需统一坐标体系。</p>",
    "question": [
      "HyperLogLog 能否列出全部访问者？",
      "可以",
      "不可以",
      "PFCOUNT 可以"
    ],
    "answer": 1,
    "explain": "它保留估计基数所需的摘要，并非完整成员。",
    "lab": "bitmap",
    "source": "https://redis.io/docs/latest/develop/data-types/"
  },
  {
    "id": "stream",
    "group": "02 数据结构",
    "title": "Stream 与 Pub/Sub：消息可靠性",
    "level": "进阶",
    "minutes": 25,
    "summary": "消息保存、投递和确认是不同的环节。",
    "body": "<h2>先代码：消费组</h2><pre><code>XADD orders * orderId 42 status created\nXGROUP CREATE orders workers 0 MKSTREAM\nXREADGROUP GROUP workers consumer-1 COUNT 1 STREAMS orders &gt;\nXPENDING orders workers\nXACK orders workers &lt;返回的消息ID&gt;</code></pre><p>XADD 创建消息，ID 通常形如 毫秒时间-序号。创建组从 0 开始可消费历史；用 $ 则从建组时末尾开始。> 读取尚未投递给该组的新消息；已投递未确认的消息进入 PEL。XACK 仅移除待确认记录，不自动删除流中的消息。</p><h2>崩溃与重复</h2><p>消费者处理完成却在 XACK 前崩溃，重投可能导致重复业务。用 XAUTOCLAIM 回收闲置 Pending 消息；以 orderId 建唯一约束或幂等记录。一般按至少一次处理设计。配置 XTRIM 等控制容量，但裁剪与 Pending 要协调，避免记录还在而消息内容已删除。</p><h2>为什么不是 Pub/Sub</h2><div class=\"table-scroll\"><table><thead><tr><th>模式</th><th>离线消息</th><th>确认/重投</th><th>适用</th></tr></thead><tbody><tr><td>Pub/Sub</td><td>无持久消息历史</td><td>没有消费确认</td><td>允许丢失的即时广播</td></tr><tr><td>Stream + Group</td><td>有流记录，受裁剪与持久化影响</td><td>PEL、XACK、回收</td><td>任务消费、事件处理</td></tr></tbody></table></div><aside class=\"note\">消息进入内存不等于已经安全落盘。可靠性还依赖 AOF/RDB、复制、备份和业务幂等。</aside>",
    "question": [
      "XACK 的作用是？",
      "从 PEL 中确认消息",
      "立刻从流删除消息",
      "保证业务永不重复"
    ],
    "answer": 0,
    "explain": "确认和删除是不同操作，业务仍需幂等。",
    "lab": "stream",
    "source": "https://redis.io/docs/latest/develop/data-types/streams/"
  },
  {
    "id": "internals",
    "group": "03 执行与原理",
    "title": "事件循环、编码与渐进式 rehash",
    "level": "进阶",
    "minutes": 25,
    "summary": "把计网、数据结构和操作系统串起来。",
    "body": "<h2>一次命令的数据路径</h2><p>客户端把命令编码为 RESP，通过 TCP 写入；服务器发现 socket 可读，读入缓冲并解析命令；查 key、执行对应数据结构操作，写回响应。事件循环同时管理许多连接，不为每个请求都创建一个工作线程。客户端网络等待、主线程执行、后台 I/O 是不同阶段。</p><h2>字典扩容为何分步</h2><p>哈希表扩容需要迁移旧桶。渐进式 rehash 将迁移工作分散到多次操作和周期任务，缓解一次迁移大量数据的停顿；迁移期间旧表、新表并存，查找需考虑两者。均摊成本较低并不代表完全没有延迟尖峰。</p><h2>内存比 value 本身大</h2><p>key 字符串、对象头、字典条目、指针、过期索引、分配器碎片都占空间。紧凑编码以部分访问效率换更少内存，达到阈值后转换。使用 MEMORY USAGE key、INFO memory 观察，不用 value 字节数直接推断服务器容量。</p><pre><code>OBJECT ENCODING user:42\nMEMORY USAGE user:42\nINFO memory\nINFO stats</code></pre><h2>为什么 O(N) 会拖慢别人</h2><p>一个长命令占着命令执行线程，其他就绪连接也要等待。网络 I/O 多线程不会把一个巨大 SMEMBERS 或 Lua 自动变成并行命令。批量操作要限制单批大小；返回体积同样影响网络和客户端内存。</p>",
    "question": [
      "开启网络 I/O 多线程就能避免大 Lua 阻塞吗？",
      "能",
      "不能",
      "只要 CPU 多核就能"
    ],
    "answer": 1,
    "explain": "命令执行与网络 I/O 是不同阶段，长脚本仍阻塞其他命令。",
    "lab": "rehash",
    "source": "https://redis.io/docs/latest/commands/"
  },
  {
    "id": "expiry",
    "group": "03 执行与原理",
    "title": "过期删除与内存淘汰",
    "level": "必学",
    "minutes": 20,
    "summary": "时间到期和内存不足，是两条独立的删除路径。",
    "body": "<h2>过期不等于精确计时回调</h2><p>读取 key 时可发现已过期并惰性删除；后台周期性主动检查部分过期 key。TTL 到期后逻辑上不可继续当有效数据，物理内存释放时间可能稍晚。不要用过期事件做必须准点、不能丢失的定时任务。</p><h2>maxmemory 下的选择</h2><div class=\"table-scroll\"><table><thead><tr><th>策略</th><th>候选集</th><th>行为</th></tr></thead><tbody><tr><td>noeviction</td><td>无</td><td>可能增加内存的写入报错</td></tr><tr><td>allkeys-lru</td><td>所有 key</td><td>近似淘汰最久未使用项</td></tr><tr><td>allkeys-lfu</td><td>所有 key</td><td>近似淘汰低频访问项</td></tr><tr><td>volatile-lru / volatile-lfu</td><td>有 TTL 的 key</td><td>没有候选时可能无法释放</td></tr><tr><td>volatile-ttl</td><td>有 TTL 的 key</td><td>倾向淘汰更早到期项</td></tr><tr><td>allkeys-random / volatile-random</td><td>全部 / TTL key</td><td>随机淘汰</td></tr></tbody></table></div><p>LRU 看最近一次使用，LFU 看频率并带衰减。Redis 的算法采用采样等近似机制，不维护一个绝对精确的全局访问排序。若缓存和不能丢的数据混用，allkeys 策略会让后者也面临淘汰；最好按业务隔离。</p><pre><code>CONFIG GET maxmemory\nCONFIG GET maxmemory-policy\nINFO stats\n# 关注 evicted_keys、expired_keys\nINFO memory</code></pre><aside class=\"note\">maxmemory 不是进程 RSS 的硬上限。复制/AOF 缓冲、碎片、fork 写时复制等都需要额外余量。</aside>",
    "question": [
      "给 key 设置 TTL 就不会被提前淘汰吗？",
      "会保证",
      "不会保证",
      "只保证 Hash"
    ],
    "answer": 1,
    "explain": "在允许淘汰它的策略下，内存压力可能在 TTL 到期前删除 key。",
    "lab": "eviction",
    "source": "https://redis.io/docs/latest/develop/reference/eviction/"
  },
  {
    "id": "persistence",
    "group": "03 执行与原理",
    "title": "RDB、AOF 与写时复制",
    "level": "必学",
    "minutes": 30,
    "summary": "分清写入成功、复制成功和持久化成功。",
    "body": "<h2>RDB：某个时刻的数据镜像</h2><p>BGSAVE 通常 fork 子进程生成快照。父进程继续服务，操作系统用写时复制让子进程看到 fork 时的数据视图；后续改写页面会带来额外内存开销。fork 本身也可能造成停顿。恢复能回到快照时刻，后续未保存的数据可能丢失。SAVE 则同步执行并阻塞，不宜随意线上调用。</p><h2>AOF：写操作的恢复记录</h2><p>appendonly yes 启用 AOF。appendfsync always 更频繁同步磁盘；everysec 通常约每秒同步，异常崩溃存在最近写入丢失窗口；no 交给系统刷新，窗口更不确定。收到 OK 不应自动理解为已落盘。Redis 7 引入多部分 AOF：base、incremental 文件和 manifest 配合恢复。</p><h2>重写不等于备份</h2><p>AOF rewrite 从当前数据生成较小恢复表示，去掉无用历史操作；后台生成并配合后续增量切换。它不是简单删除旧文件或只截断日志。RDB + AOF 同时启用时，正常启动优先采用 AOF 恢复，因为通常更完整。仍要保留独立备份并演练恢复。</p><pre><code>appendonly yes\nappendfsync everysec\nsave 900 1\nsave 300 10\n# redis.conf 示例；按业务 RPO/RTO 调整\n# redis-cli 中观察\nINFO persistence\nBGSAVE</code></pre><h2>把 MySQL 知识迁移过来</h2><p>MySQL 的 redo/undo 为事务与恢复服务，Redis 的 RDB/AOF 是另一套持久化机制。不能把 AOF 当成 Undo Log，也不能因此推断 Redis 支持事务回滚。先规定允许丢失多久数据（RPO），再规定恢复多久（RTO），用故障演练验证。</p><figure class=\"diagram\"><img src=\"images/cow.svg\" alt=\"写时复制示意：共享快照视图，父进程改写会增加物理页面。\" loading=\"lazy\"><figcaption>写时复制示意：共享快照视图，父进程改写会增加物理页面。</figcaption></figure>",
    "question": [
      "AOF everysec 下 SET 返回 OK，是否保证已落盘？",
      "保证",
      "不保证",
      "只要有副本就保证"
    ],
    "answer": 1,
    "explain": "回复、复制和 fsync 是不同环节，具体耐久性依赖配置与故障时序。",
    "lab": "persistence",
    "source": "https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/"
  },
  {
    "id": "transactions",
    "group": "03 执行与原理",
    "title": "事务、WATCH 与 Pipeline",
    "level": "必学",
    "minutes": 25,
    "summary": "隔离执行、乐观检查和减少 RTT，不是同一种能力。",
    "body": "<h2>先代码：执行期出错</h2><pre><code>SET a text\nMULTI\nINCR a\nSET b ok\nEXEC\nGET b</code></pre><p>MULTI 后命令排队，EXEC 时连续执行，中间不穿插其他客户端命令。INCR a 类型/值不适配会报错，但后面的 SET b 仍会执行；没有自动回滚。排队阶段的语法等错误通常使整个事务在 EXEC 时放弃，与执行期错误必须区分。</p><h2>WATCH：提交前发现竞争</h2><pre><code>WATCH balance:42\nGET balance:42\nMULTI\nSET balance:42 90\nEXEC</code></pre><p>从 WATCH 到 EXEC 期间，被观察的 key 若改变，EXEC 返回空结果，客户端要重新读取并重试。读后必须在应用侧检查余额等业务条件。WATCH 是乐观锁检查，不会阻塞另一个客户端写 key。重试必须有上限和退避，连接需保持同一条。</p><h2>Pipeline：网络批处理</h2><p>不等待每条响应就发送多条命令，减少往返和系统调用。Pipeline 不自动提供事务隔离或原子性；读取结果决定后续写入时，通常需 Lua 或乐观事务。批次过大会堆积响应并占内存。</p><div class=\"table-scroll\"><table><thead><tr><th>机制</th><th>解决问题</th><th>不保证</th></tr></thead><tbody><tr><td>MULTI/EXEC</td><td>命令组不被其他命令插入</td><td>失败回滚</td></tr><tr><td>WATCH</td><td>检测 key 被并发修改</td><td>自动业务重试</td></tr><tr><td>Pipeline</td><td>减少 RTT 和网络调用</td><td>整组原子性</td></tr></tbody></table></div>",
    "question": [
      "事务执行中一条 INCR 失败，后续 SET 会怎样？",
      "通常仍执行",
      "全部自动回滚",
      "等待手工 commit"
    ],
    "answer": 0,
    "explain": "Redis 没有 MySQL 式执行错误自动回滚。",
    "lab": "pipeline",
    "source": "https://redis.io/docs/latest/develop/using-commands/transactions/"
  },
  {
    "id": "lua",
    "group": "03 执行与原理",
    "title": "Lua：读、判断、写的原子操作",
    "level": "进阶",
    "minutes": 25,
    "summary": "把需要一起完成的决策放到服务器，但控制执行时间。",
    "body": "<h2>限量库存脚本</h2><pre><code>local stock = tonumber(redis.call(&#x27;GET&#x27;, KEYS[1]) or &#x27;0&#x27;)\nlocal amount = tonumber(ARGV[1])\nif not amount or amount &lt;= 0 or amount ~= math.floor(amount) then\n  return redis.error_reply(&#x27;invalid amount&#x27;)\nend\nif stock &lt; amount then return -1 end\nreturn redis.call(&#x27;DECRBY&#x27;, KEYS[1], amount)</code></pre><p>KEYS[1] 是库存 key，ARGV[1] 是扣减数量。脚本先检查数量合法，再判断库存，然后扣减；执行期间不穿插其他客户端命令。缺少库存按 0 处理。这只保护 Redis 内这一段逻辑，不能让订单数据库写入也自动成为同一事务。</p><pre><code>SET stock:42 10\nredis-cli --eval stock.lua stock:42 , 2</code></pre><h2>调用与限制</h2><p>EVAL 直接执行脚本，SCRIPT LOAD + EVALSHA 可减少重复传输；遇到 NOSCRIPT 应重新加载。所有访问 key 通过 KEYS 参数显式传入；Cluster 中所需 key 通常必须同槽。脚本出错不自动撤销已经完成的写入，应先验证参数再修改状态。Lua 应短小、确定，避免无界循环和大范围扫描。Redis Functions 可管理服务端逻辑，但要另行考虑版本和部署。</p>",
    "question": [
      "Lua 对 Redis 操作原子，就意味着数据库订单也自动原子吗？",
      "是",
      "否",
      "只要同一台机器就是"
    ],
    "answer": 1,
    "explain": "跨 Redis 与数据库仍要设计一致性和补偿。",
    "lab": "stock",
    "source": "https://redis.io/docs/latest/develop/programmability/eval-intro/"
  },
  {
    "id": "cache",
    "group": "04 缓存与业务",
    "title": "Cache Aside 与一致性竞态",
    "level": "必学",
    "minutes": 30,
    "summary": "先明确数据的事实来源，再决定更新顺序。",
    "body": "<h2>查询流程</h2><pre><code>value = redis.get(key)\nif value != null:\n    return deserialize(value)\nvalue = database.query(id)\nredis.set(key, serialize(value), ttl)\nreturn value</code></pre><p>正常命中只读 Redis；miss 时查数据库并回填。要区分缓存 miss、Redis 连接失败、数据反序列化失败和数据库查无记录。缓存错误可以按预算降级到数据库，但大量降级可能压垮数据库，需要限流和熔断。</p><h2>更新：数据库提交后删除缓存</h2><p>直接更新数据库再更新缓存，会在并发更新时产生写入顺序错乱。常见 Cache Aside 方案是先提交数据库再删除缓存，并为删除失败设计重试/可靠失效事件。不能在数据库事务尚未提交时就先删缓存，否则读者可能回填旧数据。</p><h2>仍然存在旧值回填窗口</h2><p>读者 A miss 后读到旧值；写者 B 提交新值并删缓存；A 随后把旧值写回。这说明“先改库后删缓存”也不是强一致保证。短 TTL 限制旧值寿命，版本校验、按 key 串行、可靠事件失效可缩小窗口；需要强一致的关键读可直接读业务数据库。延迟双删依赖时间假设，不能作为通用证明。</p><h2>工程化落地</h2><p>定义可接受的不一致时长，缓存只保留必要字段；记录命中率、删除失败、回源延迟。TTL 加随机扰动，缓存事件有重试、幂等和告警。把失效事件与数据库变更可靠关联，可使用事务 Outbox 或 CDC，不能假设两次独立网络调用都一定成功。</p>",
    "question": [
      "数据库更新成功但删缓存失败，正确处理是？",
      "可靠重试并监控",
      "忽略且认为强一致",
      "回滚所有已提交事务"
    ],
    "answer": 0,
    "explain": "删除缓存是可重试操作，需要可靠的重试路径与过期兜底。",
    "lab": "race",
    "source": "https://redis.io/docs/latest/commands/"
  },
  {
    "id": "failures",
    "group": "04 缓存与业务",
    "title": "穿透、击穿与雪崩",
    "level": "必学",
    "minutes": 25,
    "summary": "先辨认请求形状，再选对应保护方式。",
    "body": "<h2>三类故障</h2><div class=\"table-scroll\"><table><thead><tr><th>故障</th><th>触发</th><th>保护</th></tr></thead><tbody><tr><td>穿透</td><td>大量访问不存在的数据</td><td>参数校验、短 TTL 空值、Bloom filter</td></tr><tr><td>击穿</td><td>单个热点 key 失效，大量并发回源</td><td>请求合并/互斥重建、逻辑过期</td></tr><tr><td>雪崩</td><td>大批 key 同时过期或缓存服务失效</td><td>随机 TTL、多级缓存、限流熔断、容量预案</td></tr></tbody></table></div><p>空值缓存需区分“没有缓存”和“已缓存不存在”；否则每次仍回源。空值 TTL 要较短，数据新建后及时失效。Bloom filter 阴性表示一定未加入，阳性只是可能存在；业务集合维护不正确会造成真实数据被挡住。基础 Bitmap 不是现成 Bloom filter。</p><h2>热点重建的两种取舍</h2><p>互斥重建：一个请求查库，其余等待或重试；锁需期限、重试上限和异常释放。逻辑过期：物理 key 留存，value 内记录新鲜度；过期时返回旧值并异步重建。后者降低等待但允许旧数据，价格/余额等敏感场景必须按业务要求选择。</p><h2>缓存服务整体不可用</h2><p>Redis 故障不是再加一个锁就能解决。按数据库承载能力设置并发/速率限制，减少非关键字段，返回可接受的降级数据。读本地缓存时也要考虑实例间版本与失效；恢复后避免大量同时重建。</p>",
    "question": [
      "大量不同的无效商品 ID 反复查库，属于？",
      "穿透",
      "击穿",
      "单个热点失效"
    ],
    "answer": 0,
    "explain": "不存在的数据造成穿透；一个热点失效导致击穿。",
    "lab": "stampede",
    "source": "https://redis.io/docs/latest/commands/"
  },
  {
    "id": "lock",
    "group": "04 缓存与业务",
    "title": "分布式锁：所有权与超时",
    "level": "进阶",
    "minutes": 30,
    "summary": "锁不是一句 SET NX，尤其不能忽略过期后的旧持有者。",
    "body": "<h2>最小单实例锁</h2><pre><code>SET lock:order:42 unique-token NX PX 10000</code></pre><p>成功代表当前获得锁；nil 代表未获得。随机且唯一的 token 表示所有权，NX 和期限放进同一条命令，避免 SETNX 成功后在 EXPIRE 前崩溃。失败应有限退避，不要忙等。</p><h2>安全释放</h2><pre><code>if redis.call(&#x27;GET&#x27;, KEYS[1]) == ARGV[1] then\n  return redis.call(&#x27;DEL&#x27;, KEYS[1])\nelse\n  return 0\nend</code></pre><p>比较 token 和删除必须原子进行。不能直接 DEL，否则 A 的锁过期后 B 获锁，A 结束时会误删 B 的锁。续租也应检查所有权，并用受控的周期与截止时间。</p><h2>更难的问题：A 已经失去锁却继续写</h2><p>A 暂停超过租约时间；B 获锁并完成操作；A 恢复仍向数据库或外部资源写入。仅比较 token 释放锁解决不了这个问题。可用单调递增 fencing token，由资源端拒绝较旧 token；或用数据库约束、版本 CAS、幂等机制实现业务安全。自动续租无法消除进程暂停与网络分区。</p><h2>复制与故障切换</h2><p>单实例锁依赖该实例可用性。异步复制下主节点刚授锁就宕机，尚未复制的锁可能丢失，新主再次授锁。Redlock 是另一种多节点算法，安全性依赖其时间/故障假设；不能笼统承诺所有部署强一致。关键业务先写安全条件，再选锁实现。</p>",
    "question": [
      "旧持有者完成时直接 DEL 的危险是？",
      "可能删掉新持有者的锁",
      "会把所有 key 删除",
      "Redis 不支持 DEL"
    ],
    "answer": 0,
    "explain": "唯一 token + 原子比较删除保护当前所有权，但不阻止旧持有者继续业务写入。",
    "lab": "lock",
    "source": "https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/"
  },
  {
    "id": "rate",
    "group": "04 缓存与业务",
    "title": "限流、幂等与秒杀边界",
    "level": "进阶",
    "minutes": 25,
    "summary": "原子脚本解决局部竞争，业务闭环解决最终正确性。",
    "body": "<h2>固定窗口计数</h2><pre><code>local n = redis.call(&#x27;INCR&#x27;, KEYS[1])\nif n == 1 then redis.call(&#x27;PEXPIRE&#x27;, KEYS[1], ARGV[1]) end\nif n &gt; tonumber(ARGV[2]) then return 0 end\nreturn 1</code></pre><p>KEYS[1] 应包含用户与窗口编号；ARGV[1] 是存活毫秒，ARGV[2] 是上限，调用方先验证正整数参数。脚本把首次计数与设置过期放在一起。窗口边界可能出现短时间双倍突发；滑动窗口更平滑但更费存储，令牌桶允许受控突发。</p><h2>幂等不只是 SET NX</h2><p>请求 ID + NX 可以标记任务状态，但“先标记后崩溃”可能使业务永远没有执行。“先执行后标记”又可能重复。建立处理中/已完成状态、结果保存和失败恢复，并在最终数据库用唯一约束兜底。幂等 key 的 TTL 应覆盖重试周期。</p><h2>秒杀的数据通路</h2><p>入口限流 → 校验资格 → Redis 原子检查/预扣 → 可靠事件 → 数据库订单与库存落地 → 对账与补偿。每一步都明确失败后如何恢复：消息发送失败、重复消费、库存预扣后订单失败。不能把内存库存扣减成功等同于最终订单成立。</p>",
    "question": [
      "固定窗口限流主要的边界问题是？",
      "窗口交界可能集中突发",
      "无法设置 TTL",
      "INCR 不是原子命令"
    ],
    "answer": 0,
    "explain": "前一窗口末尾和后一窗口开头可各通过一批请求。",
    "lab": "stock",
    "source": "https://redis.io/docs/latest/develop/programmability/eval-intro/"
  },
  {
    "id": "replication",
    "group": "05 分布式与高可用",
    "title": "主从复制：全量与部分同步",
    "level": "必学",
    "minutes": 25,
    "summary": "副本提高可用性，但默认不是同步提交。",
    "body": "<h2>首次同步与追赶</h2><p>副本通过 PSYNC 与主节点协商，无法增量同步时做全量同步：主节点生成/传输快照，副本加载，再应用快照期间产生的后续写入。主节点服务与快照传输可并行，但 fork、网络和副本加载仍有成本。</p><h2>断线后为什么不总要重传全库</h2><p>主节点保留复制 backlog 环形缓冲；副本带复制 ID 和 offset 请求恢复。若复制历史可衔接且所需增量仍在 backlog，做部分同步；否则全量同步。增加 backlog 能覆盖更长断连，但不代替持久化。</p><pre><code>REPLICAOF 127.0.0.1 6379\nINFO replication\nWAIT 1 1000</code></pre><p>REPLICAOF 在另一台实验实例上执行，不在主节点自身上执行。WAIT 等待此前写入被指定数量副本确认，返回实际确认数，超时也需检查结果。WAIT 不能把系统变成强一致数据库，复制确认不等于副本完成持久化。</p><h2>读写分离的代价</h2><p>写主读从可能读到旧值，尤其刚写完马上读。需要 read-your-writes 的请求可以暂时读主，仍要理解故障切换风险。无持久化主节点重启为空后可能把副本也同步为空，需谨慎设置自动重启和恢复顺序。</p>",
    "question": [
      "副本断线后一定全量同步吗？",
      "不一定，可能部分同步",
      "一定",
      "不会同步"
    ],
    "answer": 0,
    "explain": "取决于复制 ID、offset 与 backlog 是否仍能覆盖缺失数据。",
    "lab": "replication",
    "source": "https://redis.io/docs/latest/operate/oss_and_stack/management/replication/"
  },
  {
    "id": "sentinel",
    "group": "05 分布式与高可用",
    "title": "Sentinel：监控与故障转移",
    "level": "必学",
    "minutes": 25,
    "summary": "哨兵选新主，客户端也要能发现新主。",
    "body": "<h2>三个职责</h2><p>Sentinel 监控主从、通知变化并在条件满足时选举故障转移负责人，提升副本为新主并重配置其余副本。它不承担数据分片，也不代理每次命令流量。客户端需使用 Sentinel 感知连接方式，而不是一直连接旧主 IP。</p><h2>quorum 与多数票</h2><p>一个哨兵判定不可达为主观下线；达到配置 quorum 的哨兵意见形成客观下线。但启动故障转移仍需获得多数 Sentinel 的授权选举。quorum 不是唯一条件。常见部署使用至少 3 个哨兵并分散到不同故障域。</p><pre><code>port 26379\nsentinel monitor mymaster 127.0.0.1 6379 2\nsentinel down-after-milliseconds mymaster 5000\nsentinel failover-timeout mymaster 60000</code></pre><p>上面只是单个哨兵实验配置片段，不是完整生产拓扑。网络分区时，旧主可能暂时继续接受写入，而新主也开始服务；要配合客户端发现、min-replicas-to-write 等设置和业务幂等，仍不能保证零丢失。</p><h2>如何验收高可用</h2><p>在隔离测试环境停止主节点，观察判定、选举、新主可写、客户端重连与数据差异。记录切换耗时和丢失窗口，不能只看到“有副本”就宣称高可用。</p>",
    "question": [
      "Sentinel 是否把 key 自动分散到多台主节点？",
      "否",
      "是",
      "quorum 为 2 时是"
    ],
    "answer": 0,
    "explain": "Sentinel 负责主从高可用，Cluster 才承担哈希槽分片。",
    "lab": "sentinel",
    "source": "https://redis.io/docs/latest/operate/oss_and_stack/management/sentinel/"
  },
  {
    "id": "cluster",
    "group": "05 分布式与高可用",
    "title": "Cluster：哈希槽、重定向与迁移",
    "level": "必学",
    "minutes": 30,
    "summary": "记住 16384 只是开始，理解槽与客户端才会用。",
    "body": "<h2>key 到节点的映射</h2><p>槽号 = CRC16(key) mod 16384。槽分配给主节点，一个节点管理一组槽，副本复制对应主的数据。Cluster 通常至少使用 3 主并为每主配置副本。客户端必须支持 Cluster，维护槽到节点的映射。</p><h2>Hash tag：让关联 key 同槽</h2><pre><code>SET order:{42}:status paid\nSET order:{42}:amount 99\nCLUSTER KEYSLOT order:{42}:status\nCLUSTER KEYSLOT order:{42}:amount</code></pre><p>使用第一个有效的非空花括号片段作为哈希输入，这两个 key 都对 42 哈希。多 key 命令、事务和脚本常要求同槽，否则 CROSSSLOT。不要把所有业务都放进一个 tag，否则会形成单分片热点。</p><h2>MOVED 与 ASK</h2><div class=\"table-scroll\"><table><thead><tr><th>返回</th><th>含义</th><th>客户端处理</th></tr></thead><tbody><tr><td>MOVED</td><td>槽的稳定归属已改变</td><td>更新映射并重试</td></tr><tr><td>ASK</td><td>迁移中本次临时去另一节点</td><td>向目标发送 ASKING 后重试，不当成永久映射</td></tr><tr><td>CROSSSLOT</td><td>操作涉及不同槽</td><td>重新设计 key 或拆分操作</td></tr></tbody></table></div><h2>扩容不是只启动一个节点</h2><p>需加入集群并迁移槽/数据，控制迁移负载。Cluster 不支持常规 SELECT 多逻辑数据库，使用 DB 0。集群总内存充足不代表某个热点分片不会 OOM。异步复制与分区也存在已确认写入丢失窗口，不能因为分片就把一致性问题消除。</p>",
    "question": [
      "order:{42}:a 与 order:{42}:b 的槽号？",
      "相同",
      "必然不同",
      "由 value 决定"
    ],
    "answer": 0,
    "explain": "有效 hash tag 42 是二者的哈希输入。",
    "lab": "cluster",
    "source": "https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/"
  },
  {
    "id": "java",
    "group": "06 工程与实战",
    "title": "Java / Spring Boot 接入",
    "level": "必学",
    "minutes": 25,
    "summary": "连接、序列化与超时是工程中的常见坑。",
    "body": "<h2>Spring Boot 最小依赖与配置</h2><pre><code>&lt;dependency&gt;\n  &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;\n  &lt;artifactId&gt;spring-boot-starter-data-redis&lt;/artifactId&gt;\n&lt;/dependency&gt;\n&lt;!-- 使用项目现有 Spring Boot BOM 管理版本 --&gt;</code></pre><pre><code>spring:\n  data:\n    redis:\n      host: 127.0.0.1\n      port: 6379\n      connect-timeout: 2s\n      timeout: 1s</code></pre><p>示例按 Spring Boot 3.x 的配置前缀组织，旧版本可能不同。Starter 默认通常使用 Lettuce。认证信息从环境或秘密管理注入；不要写进 Git。线上连接需要按拓扑配置 Sentinel/Cluster，不能只抄单机 host。</p><h2>先用字符串模板看清数据</h2><pre><code>import java.time.Duration;\nimport org.springframework.data.redis.core.StringRedisTemplate;\nimport org.springframework.stereotype.Service;\n\n@Service\npublic class VisitService {\n    private final StringRedisTemplate redis;\n    public VisitService(StringRedisTemplate redis) {\n        this.redis = redis;\n    }\n    public String cacheName(long id, String name) {\n        String key = &quot;user:&quot; + id + &quot;:name&quot;;\n        redis.opsForValue().set(key, name, Duration.ofMinutes(10));\n        return redis.opsForValue().get(key);\n    }\n    public Long visit(long pageId) {\n        return redis.opsForValue().increment(&quot;page:&quot; + pageId + &quot;:views&quot;);\n    }\n}</code></pre><p>构造注入便于测试；带 Duration 的 set 在一次命令中设置值与期限。StringRedisTemplate 使用字符串序列化，redis-cli 中可直接核对。计数器方法没有 TTL，若需要日统计，应在 key 中加日期并原子设置生命周期。</p><h2>序列化、异常与线程</h2><p>对象缓存需明确 JSON 结构与版本，不混用不同序列化器；设置超时、有限重试、指标。非幂等 INCR 超时后重试可能重复计数，因为服务器可能已经执行。不要把 Redis 故障当缓存 miss 悄悄吞掉。Lettuce 连接可支持并发使用，但事务等状态操作需要按客户端约定管理专用连接。</p><figure class=\"diagram\"><img src=\"images/java-path.svg\" alt=\"Java 调用链：缓存与数据库访问由业务层协调。\" loading=\"lazy\"><figcaption>Java 调用链：缓存与数据库访问由业务层协调。</figcaption></figure><p><a href=\"https://docs.spring.io/spring-boot/3.5/reference/data/nosql.html#data.nosql.redis\" target=\"_blank\" rel=\"noopener\">Spring Boot 3.5 官方 Redis 配置与自动装配文档 ↗</a></p>",
    "question": [
      "INCR 超时后无限重试是否安全？",
      "不安全，可能重复执行",
      "安全，超时表示没有执行",
      "只有 String 才安全"
    ],
    "answer": 0,
    "explain": "响应丢失不代表服务端未执行，非幂等操作需额外设计。",
    "lab": null,
    "source": "https://redis.io/docs/latest/develop/clients/lettuce/"
  },
  {
    "id": "ops",
    "group": "06 工程与实战",
    "title": "性能诊断、容量与安全",
    "level": "必学",
    "minutes": 25,
    "summary": "用指标找到瓶颈，而不是靠猜测改配置。",
    "body": "<h2>一份最小诊断清单</h2><pre><code>INFO memory\nINFO stats\nINFO clients\nINFO persistence\nINFO replication\nSLOWLOG GET 10\nLATENCY DOCTOR\nSCAN 0 COUNT 100\nMEMORY USAGE some:key</code></pre><p>SLOWLOG 主要记录命令执行时间，不含网络往返和等待客户端消费响应的时间。LATENCY DOCTOR 依赖启用延迟监控并收集数据。命中率 = hits / (hits + misses)，需取监控窗口内增量，不只看重启以来累计值。低命中率、高 evicted_keys、大返回值要分别定位。</p><h2>Big key 与 Hot key</h2><p>Big key 指体积或成员数太大，影响传输、删除和阻塞；Hot key 指访问集中，压满单分片。前者拆分数据、分页访问和异步删除；后者用本地缓存、请求合并、合理副本读或业务分散，同时管理一致性。提高内存并不总能解决热点 CPU 瓶颈。</p><h2>安全默认值</h2><p>不公开裸端口；用防火墙/私网隔离，ACL 最小权限与 TLS。protected-mode 不是完整安全边界。应用账户限制 key 范围和命令类别，管理命令单独授权。日志不要输出 token、密码或完整敏感 value，备份也需要保护。</p><h2>容量规划</h2><p>测平均 key 大小与增长速度，考虑对象开销、碎片、AOF/复制缓冲和写时复制峰值；为最坏副本重同步保留网络和内存余量。定期恢复备份到隔离实例，验证数据、配置和恢复耗时。MONITOR 开销大且可能暴露数据，线上谨慎短时使用。</p>",
    "question": [
      "SLOWLOG 没有慢命令，就能证明请求端到端很快吗？",
      "不能",
      "能",
      "开启 AOF 就能"
    ],
    "answer": 0,
    "explain": "客户端排队、网络、连接池等待等不在命令执行耗时范围内。",
    "lab": null,
    "source": "https://redis.io/docs/latest/operate/oss_and_stack/management/security/"
  },
  {
    "id": "project",
    "group": "06 工程与实战",
    "title": "综合项目：商品服务与排行榜",
    "level": "实战",
    "minutes": 60,
    "summary": "让缓存、计数、排名、限流和一致性形成一个闭环。",
    "body": "<h2>目标和输入输出</h2><p>输入：商品 ID、查询请求、用户 ID、下单请求 ID。输出：商品详情、访问榜、限流结果与可重试的订单状态。MySQL 保存商品和订单事实，Redis 保存详情缓存、访问统计、排行榜和短期限流状态。先用本地 Redis 7.2 + MySQL 实现单机版，再演练故障。</p><div class=\"table-scroll\"><table><thead><tr><th>功能</th><th>key / 结构</th><th>必须验证的边界</th></tr></thead><tbody><tr><td>详情缓存</td><td>product:42 / String JSON</td><td>不存在、过期、Redis 不可用</td></tr><tr><td>商品更新</td><td>数据库事务 + 失效事件</td><td>提交后删除失败、旧值回填</td></tr><tr><td>访问榜</td><td>product:rank / ZSet</td><td>同分、重复上报、热门商品</td></tr><tr><td>限流</td><td>rate:{user}:window / String</td><td>窗口边界、脚本参数、超时</td></tr><tr><td>订单</td><td>数据库请求 ID 唯一约束</td><td>重复请求、网络重试、补偿</td></tr></tbody></table></div><h2>实现顺序</h2><p>① 建数据库模型和无缓存接口，测响应与查询次数。② 接 Cache Aside 和短 TTL 空值，观察命中率。③ 数据库提交后删缓存，并建立可重试失效队列。④ 用 ZINCRBY 生成热门榜，明确是否允许重复统计。⑤ 加 Lua 限流，验证窗口突发。⑥ 用唯一请求 ID 防重复下单，记录处理中与完成结果。⑦ 做 Redis 停机、热点过期、删除失败和消费者重启演练。</p><h2>验收，不编造性能提升</h2><p>固定数据量与并发，分别测试冷缓存、热缓存、故障降级，记录 P50/P95/P99、数据库 QPS、Redis 内存与错误率。预先规定数据库最大允许回源并发、旧数据最长寿命、幂等要求。性能对比必须注明机器、数据和配置。</p><h2>练习与参考方案</h2><details><summary>练习 A：空值缓存与新建商品</summary><p>先查询不存在的 42 并缓存空值，再新增商品 42。如何让它尽快可见？</p><details><summary>查看参考思路</summary><p>新建事务提交后失效 product:42；空值 TTL 较短；删失败进入可靠重试。说明仍允许的窗口，而非宣称绝对强一致。</p></details></details><details><summary>练习 B：处理重复订单消息</summary><p>消费消息后数据库已提交，但消费者在确认前崩溃。</p><details><summary>查看参考思路</summary><p>重投后用请求 ID 的唯一约束/幂等记录读取已完成结果，再确认消息；不重复扣库存。</p></details></details><details><summary>练习 C：热点 key 同时失效</summary><p>设计合并回源和限流，说明失败和超时后如何恢复。</p><details><summary>查看参考思路</summary><p>同 key 只允许一个重建者，其他请求有限等待或返回允许的旧值；锁比较 token 释放；整体回源受数据库预算限制，重建失败有退避与告警。</p></details></details>",
    "question": [
      "项目验收最有价值的结果是？",
      "固定条件下的性能与故障实验记录",
      "只展示页面截图",
      "说所有一致性问题已解决"
    ],
    "answer": 0,
    "explain": "可复现的测试与故障边界，比未经验证的提升百分比更可信。",
    "lab": "cache",
    "source": "https://redis.io/docs/latest/commands/"
  },
  {
    "id": "review",
    "group": "06 工程与实战",
    "title": "复习地图与面试推导",
    "level": "复习",
    "minutes": 25,
    "summary": "从“背结论”升级到“解释失败时序”。",
    "body": "<h2>六组必须能独立解释的问题</h2><div class=\"table-scroll\"><table><thead><tr><th>主题</th><th>自问</th><th>掌握标志</th></tr></thead><tbody><tr><td>数据结构</td><td>Hash 与 JSON 缓存怎么选？</td><td>能按访问模式、TTL 与序列化解释</td></tr><tr><td>执行</td><td>单命令原子为何不能保护 GET + SET？</td><td>能画出两个客户端的交错</td></tr><tr><td>恢复</td><td>OK、WAIT、fsync 有什么区别？</td><td>分别解释执行、复制、耐久性</td></tr><tr><td>缓存</td><td>先改库再删缓存仍可能旧值回填吗？</td><td>能写出 A/B 的完整时序</td></tr><tr><td>高可用</td><td>quorum 等于故障转移授权吗？</td><td>区分下线判定与多数票</td></tr><tr><td>分片</td><td>为什么多 key 脚本 CROSSSLOT？</td><td>能设计合适 hash tag 并说明热点风险</td></tr></tbody></table></div><h2>三层复习</h2><p>第一遍：01–10 章，手动执行命令并预测返回值。第二遍：11–22 章，重点观察原子性、丢失窗口与并发时序。第三遍：23–26 章，完成 Java 接入与综合项目，保存真实测试记录。掌握一个主题的标志是能说明输入、状态变化、失败条件和恢复办法。</p><h2>拓展：新版数据与搜索</h2><p>Redis 新版本提供更多数据类型与搜索能力，例如 JSON、概率结构、时间序列、向量相关能力。先确认目标发行版与版本支持，再研究索引、查询、容量、更新一致性与召回质量。经典 Redis 缓存学习与完整搜索/RAG 系统的工程要求不同，不以“能存向量”代替检索评估。</p><h2>继续查阅</h2><p>每章底部均有官方资料链接。命令的参数、复杂度与引入版本以部署对应版本文档为准。课程内容核对日期：2026-10-13。</p>",
    "question": [
      "判断 Redis 方案是否正确，最关键的是？",
      "只背命令",
      "说明正常与故障时的状态和恢复",
      "只看平均 QPS"
    ],
    "answer": 1,
    "explain": "从时序、故障与边界推导，比脱离场景背答案更可靠。",
    "lab": null,
    "source": "https://redis.io/docs/latest/develop/data-types/"
  }
];
