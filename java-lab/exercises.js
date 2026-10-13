const EXERCISES = {
  "start": {
    "title": "从命令行参数读取名字",
    "prompt": "修改 main：有参数时向第一个名字问好；没有参数时使用 Java。不能直接无条件访问 args[0]。",
    "hint": "先判断 args.length。",
    "code": "String name = args.length == 0 ? \"Java\" : args[0];\nSystem.out.println(\"Hello, \" + name + \"!\");",
    "tests": [
      "java Main → Hello, Java!",
      "java Main Mu → Hello, Mu!"
    ],
    "explain": "参数数组可能为空；访问前先验证长度。"
  },
  "types": {
    "title": "修复乘法溢出",
    "prompt": "100000 × 100000 的结果应为 10000000000。为什么 long result=100000*100000 仍可能错？给出修复并说明更大输入的处理。",
    "hint": "结果赋值发生在表达式求值之后。",
    "code": "long result = 100000L * 100000;\nlong checked = Math.multiplyExact(100000L, 100000L);",
    "tests": [
      "100000 × 100000 → 10000000000",
      "Long.MAX_VALUE × 2 用 multiplyExact → ArithmeticException"
    ],
    "explain": "让操作数先进入 long 运算；需要拒绝溢出时用精确运算 API。"
  },
  "operators": {
    "title": "安全访问可空字符串",
    "prompt": "实现 boolean hasText(String s)：非 null 且至少包含一个非空白字符。用一个表达式完成，解释换成 & 的风险。",
    "hint": "String.isBlank 处理空白。",
    "code": "static boolean hasText(String s) {\n    return s != null && !s.isBlank();\n}",
    "tests": [
      "null → false",
      "\"\" / \"   \" → false",
      "\"Java\" → true"
    ],
    "explain": "&& 在 null 时跳过实例方法；boolean & 仍会调用右侧。"
  },
  "flow": {
    "title": "只累加偶数",
    "prompt": "实现 sumEven(int n)，计算 1..n 内所有偶数的和。n<0 要拒绝，返回 long，并明确大 n 的运行成本。",
    "hint": "可以每次递增 2，先用 long 作循环变量。",
    "code": "static long sumEven(int n) {\n    if (n < 0) throw new IllegalArgumentException(\"negative n\");\n    long sum = 0;\n    for (long i = 2; i <= n; i += 2) sum += i;\n    return sum;\n}",
    "tests": [
      "n=0 → 0",
      "n=1 → 0",
      "n=6 → 12",
      "n=-1 → 拒绝"
    ],
    "explain": "long 循环变量避免 int 最后加二溢出；O(n) 成本仍可能过高，可推导 k(k+1)，k=n/2。"
  },
  "arrays": {
    "title": "对象数组浅拷贝",
    "prompt": "有 Student[] a，令 b=a.clone()。修改 b[0].score 和执行 b[0]=new Student(...) 分别会影响 a 吗？写出两个实验。",
    "hint": "区分数组对象与元素对象。",
    "code": "Student[] b = a.clone();\nb[0].score = 90; // 假设可变 Student：共享元素受影响\nb[0] = new Student(); // 仅替换 b 中的引用位置",
    "tests": [
      "修改共享对象字段 → a[0] 可见",
      "替换 b[0] → a[0] 仍指向旧对象"
    ],
    "explain": "代码片段假设 Student 有可访问的 score 和无参构造；不是对所有 Student 类通用。深拷贝需按元素契约逐个复制。"
  },
  "methods": {
    "title": "迭代求最大公约数",
    "prompt": "写 gcd(int a,int b)，允许非负输入，拒绝负数，并说明 gcd(0,0) 的接口约定。",
    "hint": "欧几里得法：a,b 更新为 b,a%b。",
    "code": "static int gcd(int a, int b) {\n    if (a < 0 || b < 0) throw new IllegalArgumentException(\"negative input\");\n    while (b != 0) { int r = a % b; a = b; b = r; }\n    return a; // 此接口约定 gcd(0,0)=0\n}",
    "tests": [
      "48,18 → 6",
      "0,9 → 9",
      "0,0 → 按接口约定 0",
      "-1,2 → 拒绝"
    ],
    "explain": "算法可迭代，避免递归深度；数学定义和工程接口约定要明确区分。"
  },
  "references": {
    "title": "返回一个独立数组",
    "prompt": "写 doubled(int[] input)，返回每项乘二的新数组，不改变输入。拒绝 null，检查乘法溢出。",
    "hint": "先 clone，再修改新数组。",
    "code": "static int[] doubled(int[] input) {\n    java.util.Objects.requireNonNull(input);\n    int[] out = input.clone();\n    for (int i = 0; i < out.length; i++) out[i] = Math.multiplyExact(out[i], 2);\n    return out;\n}",
    "tests": [
      "[1,2] → [2,4]，输入仍 [1,2]",
      "[] → []",
      "Integer.MAX_VALUE → ArithmeticException"
    ],
    "explain": "基本类型数组 clone 后数据独立；溢出异常也不会修改输入数组。"
  },
  "strings": {
    "title": "按 Unicode 代码点反转",
    "prompt": "写 reverse(String s)，让 A😀B 反转成 B😀A，不能把表情的代理对拆开。说明代码点不等于完整人类感知字符。",
    "hint": "使用 codePoints() 而非单个 char。",
    "code": "static String reverse(String s) {\n    int[] points = s.codePoints().toArray();\n    StringBuilder out = new StringBuilder();\n    for (int i = points.length - 1; i >= 0; i--) out.appendCodePoint(points[i]);\n    return out.toString();\n}",
    "tests": [
      "\"A😀B\" → \"B😀A\"",
      "\"\" → \"\"",
      "null → 此实现抛 NPE，应按契约明确是否拒绝"
    ],
    "explain": "组合字符、旗帜等可能由多个代码点组成；此题只保证按代码点反转，不承诺按字素簇反转。"
  },
  "classes": {
    "title": "构造时就保证分数合法",
    "prompt": "给 Student 构造增加 name 非空白、score 0..100 校验。验证 new Student(\"Mu\",101) 不能得到非法对象。",
    "hint": "校验通过后再赋值字段。",
    "code": "Student(String name, int score) {\n    if (name == null || name.isBlank() || score < 0 || score > 100)\n        throw new IllegalArgumentException(\"invalid student\");\n    this.name = name;\n    this.score = score;\n}",
    "tests": [
      "score=0 / 100 → 接受",
      "score=-1 / 101 → 拒绝",
      "name=null / 空白 → 拒绝"
    ],
    "explain": "任何会修改状态的方法也要保持同一不变量；只在构造校验还不够。"
  },
  "encapsulation": {
    "title": "存款时保持余额不变量",
    "prompt": "为本章 Account 增加 deposit(int amount)，拒绝非正数、检测溢出，失败时余额不改变。",
    "hint": "先计算并验证新值，再赋字段。",
    "code": "void deposit(int amount) {\n    if (amount <= 0) throw new IllegalArgumentException(\"invalid amount\");\n    int next = Math.addExact(cents, amount);\n    cents = next;\n}",
    "tests": [
      "余额100，存30 → 130",
      "存0 / -1 → 拒绝且不变",
      "余额 Integer.MAX_VALUE，存1 → 溢出且不变"
    ],
    "explain": "把改变共享状态放到校验和精确计算成功之后。并发安全仍需另行设计。"
  },
  "inheritance": {
    "title": "重载还是重写",
    "prompt": "Animal 有 voice()，Dog 重写 voice() 并重载 voice(int times)。Animal x=new Dog() 后，x.voice(2) 能编译吗？如何保持合理契约？",
    "hint": "先看变量声明类型可见的方法集合。",
    "code": "Animal x = new Dog();\nx.voice(); // 动态分派\n// x.voice(2); // 若 Animal 未声明该签名，则编译失败",
    "tests": [
      "x.voice() → Dog 重写方法",
      "x.voice(2) → 按题设编译失败"
    ],
    "explain": "不能通过运行时对象存在某个方法来跳过编译期检查。若业务确实需要重复发声，可将该行为纳入共同接口。"
  },
  "interfaces": {
    "title": "用测试替身记录发送消息",
    "prompt": "实现 MessageSender 的记录版本，传给 NotifyService 后断言收到 hello，而不是直接测试 System.out。",
    "hint": "在替身对象中保存接收的数据。",
    "code": "static class RecordingSender implements MessageSender {\n    final java.util.List<String> messages = new java.util.ArrayList<>();\n    public void send(String text) { messages.add(text); }\n}\n// var sender = new RecordingSender();\n// new NotifyService(sender).notifyUser(\"hello\");",
    "tests": [
      "调用一次 → messages=[hello]",
      "不调用 → messages=[]"
    ],
    "explain": "观察业务契约，而非依赖具体日志输出。真实消息发送失败和重试需要额外场景。"
  },
  "generics": {
    "title": "把整数复制到上界容器",
    "prompt": "设计 copyIntegers，让源可读 Integer，目标可接收 Integer。为什么目标不能写成 List<Number> 才接受所有情况？",
    "hint": "生产者 extends，消费者 super。",
    "code": "static void copyIntegers(java.util.List<? extends Integer> source,\n                         java.util.List<? super Integer> target) {\n    for (Integer value : source) target.add(value);\n}",
    "tests": [
      "源 List<Integer>，目标 List<Number> → 合法",
      "目标 List<Object> → 合法",
      "目标 List<Double> → 不合法"
    ],
    "explain": "此例假定源目标不是同一可变容器，目标可修改；泛型边界不会自动解决迭代时结构修改。"
  },
  "exceptions": {
    "title": "保留原始错误原因",
    "prompt": "读取配置文件失败后抛业务异常，要保留 IOException 的 cause。为什么只抛 new RuntimeException(\"failed\") 不够？",
    "hint": "异常构造可传入 cause。",
    "code": "try {\n    // 读取文件\n} catch (java.io.IOException e) {\n    throw new IllegalStateException(\"config load failed\", e);\n}",
    "tests": [
      "文件不存在 → 业务异常可追踪 cause",
      "文件读取成功 → 正常处理"
    ],
    "explain": "这是上下文片段，try 中必须包含可能抛 IOException 的操作。保留原因便于定位；错误信息不要泄露密钥。"
  },
  "records": {
    "title": "让 record 的列表组件防御性复制",
    "prompt": "定义 Tags(List<String> values)，确保调用者之后修改原列表不会改变 record 内容。说明为什么这仍不代表任意复杂元素深度不可变。",
    "hint": "紧凑构造中对参数重新赋值。",
    "code": "record Tags(java.util.List<String> values) {\n    Tags { values = java.util.List.copyOf(values); }\n}",
    "tests": [
      "原列表 [a]，构造后原列表 add(b) → Tags 仍 [a]",
      "values 为 null 或含 null → List.copyOf 拒绝"
    ],
    "explain": "String 元素不可变，因此此例较简单；换成可变对象还需对元素复制或定义共享契约。"
  },
  "collections": {
    "title": "用 Deque 同时观察栈和队列",
    "prompt": "将 A、B、C addLast，再分别从两份独立 Deque removeFirst/removeLast，写出次序。",
    "hint": "两份容器必须独立，避免前一实验改变后一实验。",
    "code": "var queue = new java.util.ArrayDeque<>(java.util.List.of(\"A\", \"B\", \"C\"));\nvar stack = new java.util.ArrayDeque<>(queue);\nwhile (!queue.isEmpty()) System.out.print(queue.removeFirst());\nSystem.out.println();\nwhile (!stack.isEmpty()) System.out.print(stack.removeLast());",
    "tests": [
      "队列 → ABC",
      "栈 → CBA",
      "空容器 → 循环零次"
    ],
    "explain": "pollFirst 在空时返回 null，removeFirst 抛异常；ArrayDeque 不允许 null。"
  },
  "list": {
    "title": "不跳过连续待删除元素",
    "prompt": "删除 [2,4,1,6] 中全部偶数，解释从左向右 remove(index) 后直接 i++ 的问题。",
    "hint": "删除后后续元素左移；可用 removeIf。",
    "code": "var list = new java.util.ArrayList<>(java.util.List.of(2, 4, 1, 6));\nlist.removeIf(n -> n % 2 == 0);",
    "tests": [
      "[2,4,1,6] → [1]",
      "[] → []",
      "[2,4] → []"
    ],
    "explain": "增强 for 中不能任意结构删除。另一个方案是倒序按下标删除，但要明确 Integer remove 重载。"
  },
  "set": {
    "title": "同分学生全部保留",
    "prompt": "排行榜需分数降序、ID 升序，两个同分但不同 ID 的学生必须保留。给出 Comparator，并说明 TreeSet 只比较 score 会丢什么。",
    "hint": "用 thenComparingLong 区分同分。",
    "code": "record Row(long id, int score) {}\njava.util.Comparator<Row> order = java.util.Comparator\n    .comparingInt(Row::score).reversed()\n    .thenComparingLong(Row::id);",
    "tests": [
      "Row(2,90), Row(1,90) → ID 1 在前",
      "只比 score 的 TreeSet → 可能只保留同分中的一个"
    ],
    "explain": "比较器返回 0 时 TreeSet 视为同排序位置；完整排序键应符合业务身份需求。"
  },
  "map": {
    "title": "把按用户统计改成并发更新",
    "prompt": "多个线程统计同一用户，不能 get 再 put。给出 ConcurrentHashMap 的计数更新方式，并说明它没有保证所有业务流程一起原子。",
    "hint": "用单次容器原子方法。",
    "code": "var counts = new java.util.concurrent.ConcurrentHashMap<String, Integer>();\ncounts.merge(\"Mu\", 1, Integer::sum);",
    "tests": [
      "1000 次更新全部完成 → 该 key 为1000",
      "两个 key 的业务关联更新 → 仍需整体机制"
    ],
    "explain": "单 key merge 的契约不能替代跨 key 事务；大量计数可能溢出，按需要改用 Long 或专门计数器。"
  },
  "stream": {
    "title": "空列表的平均分",
    "prompt": "过滤及格分后计算平均，空列表与没有及格分时明确返回 OptionalDouble.empty，而不是假装平均分为 0。",
    "hint": "使用 mapToInt().average()。",
    "code": "static java.util.OptionalDouble passAverage(java.util.List<Integer> scores) {\n    return scores.stream().filter(s -> s >= 60).mapToInt(Integer::intValue).average();\n}",
    "tests": [
      "[50,80,100] → 90.0",
      "[10,20] → empty",
      "[] → empty"
    ],
    "explain": "输入列表含 null 会在比较/拆箱时异常；是否容忍 null 必须定义，不要静默忽略业务脏数据。"
  },
  "io": {
    "title": "文件导入失败不污染已有数据",
    "prompt": "现有成绩册中有 ID 1，新文件前两行合法、第三行分数 101。设计加载顺序，确保失败后原成绩册完全不变。",
    "hint": "先候选集合，再一次替换。",
    "code": "// 1. 逐行解析到 candidate，校验每一行与重复 ID\n// 2. 任何失败：抛异常，保留 live 不变\n// 3. 全部成功并关闭输入资源后：替换 live",
    "tests": [
      "第三行非法 → 原成绩册仍仅包含原数据",
      "完整合法文件 → 整体替换",
      "重复 ID → 拒绝整份导入"
    ],
    "explain": "完整可运行实现见下方成绩管理项目。候选结构解决教学单线程内存替换，不等同于跨进程事务。"
  },
  "time": {
    "title": "处理金额 scale 和舍入",
    "prompt": "税前 10.00，税率 0.075，税额按两位小数 HALF_UP。说明 BigDecimal(\"1.0\").equals(BigDecimal(\"1.00\")) 的结果。",
    "hint": "明确 scale 和 RoundingMode。",
    "code": "var tax = new java.math.BigDecimal(\"10.00\")\n    .multiply(new java.math.BigDecimal(\"0.075\"))\n    .setScale(2, java.math.RoundingMode.HALF_UP);",
    "tests": [
      "税额 → 0.75",
      "1.0 equals 1.00 → false",
      "1.0 compareTo 1.00 → 0"
    ],
    "explain": "金额精度与舍入是业务规则，不能让显示格式代替计算规则。"
  },
  "threads": {
    "title": "没有 join 的输出顺序",
    "prompt": "去掉 worker.join 后，worker 与 done 是否总按固定顺序打印？如何让程序在不 sleep 猜时间的情况下保证顺序？",
    "hint": "等待依赖，而不是猜调度耗时。",
    "code": "worker.start();\nworker.join();\nSystem.out.println(\"done\");",
    "tests": [
      "有 join → worker 的输出先于 done",
      "无 join → 不能依据源码排版保证这两行的顺序"
    ],
    "explain": "join 等待目标线程完成；处理 InterruptedException 时明确取消或传播，不无限吞掉中断。"
  },
  "sync": {
    "title": "修复两个字段的不变量",
    "prompt": "账户 balance 与 totalWithdrawn 必须一起更新。分别用两个 AtomicInteger 是否足够让读者总看到一致的组合？给出同步设计。",
    "hint": "多个字段的原子更新需要统一边界。",
    "code": "synchronized (lock) {\n    // 验证余额与参数\n    balance -= amount;\n    totalWithdrawn += amount;\n}\n// 读取组合快照时也使用同一个 lock",
    "tests": [
      "只保护每个字段 → 可能读到中间组合",
      "同锁更新和读取 → 可按约定获得一致快照"
    ],
    "explain": "读者也要遵循相同同步协议；验证、计算、提交状态都在正确边界中。"
  },
  "executor": {
    "title": "线程池满了怎么处理",
    "prompt": "2 个工作位、2 个队列位。提交第 5 个长任务后，按 AbortPolicy 应发生什么？为什么不能把任务丢弃后返回成功？",
    "hint": "拒绝策略是服务可用性的接口语义。",
    "code": "// ThreadPoolExecutor: core=2, max=2, queue capacity=2\n// 第 5 个同时待完成任务：RejectedExecutionException\n// 调用方返回明确失败/退避，或采用契约允许的降级",
    "tests": [
      "4 个未完成任务 → 占满工作位与队列",
      "第 5 个 → 拒绝",
      "释放1个运行位 → 可继续处理已排队任务"
    ],
    "explain": "实际调度时序会影响是否满；应测试受控阻塞任务，而不是靠偶然执行速度。"
  },
  "jvm": {
    "title": "识别“仍可达”的内存增长",
    "prompt": "static Map 缓存不断加入大对象，从未删除。GC 是否会回收这些 value？写出容量约束和观察指标。",
    "hint": "GC 不判断对象在业务上是否仍有价值。",
    "code": "// 保留上限、TTL、淘汰策略与监控\n// 使用成熟缓存实现；不要以 System.gc() 当修复\n// 观察 key数量、保留大小、分配速率、GC暂停",
    "tests": [
      "Map 仍持有对象 → 根路径可达",
      "去掉全部根路径 → 可被回收，非立即承诺"
    ],
    "explain": "淘汰策略和线程安全也要符合业务；堆外内存与线程栈不受 -Xmx 直接全部限制。"
  },
  "jdbc": {
    "title": "业务异常也要回滚",
    "prompt": "SQL1 已成功执行但还没提交，之后库存业务校验抛 IllegalStateException。只 catch(SQLException) 的代码覆盖到了吗？怎样改进？",
    "hint": "数据库异常与业务失败都属于事务失败路径。",
    "code": "try {\n    // 同连接执行SQL + 业务校验\n    connection.commit();\n} catch (java.sql.SQLException | RuntimeException e) {\n    try { connection.rollback(); }\n    catch (java.sql.SQLException rollbackError) { e.addSuppressed(rollbackError); }\n    throw e;\n}",
    "tests": [
      "SQL异常 → rollback",
      "业务运行时异常 → rollback",
      "全部成功 → commit"
    ],
    "explain": "这是需驱动/数据库的集成片段，不是独立可运行源码。实际项目可使用声明式事务，并核对回滚规则与异常传播。"
  },
  "testing": {
    "title": "用负例证明最大值函数",
    "prompt": "为 max 写正常、全负、单项、空、null 五类测试。为什么只测 [1,2,3] 无法发现 answer=0 的缺陷？",
    "hint": "测试应覆盖输入契约，不只覆盖循环。",
    "code": "// max([1,2,3]) == 3\n// max([-3,-1,-7]) == -1\n// max([5]) == 5\n// max([]) 和 max(null) 按契约抛 IllegalArgumentException",
    "tests": [
      "正数样例可能通过错误实现",
      "全负样例能暴露错误初始化"
    ],
    "explain": "异常类型也属于可验证契约；不要只断言“发生任意错误”。"
  },
  "project": {
    "title": "回滚式导入与同分规则",
    "prompt": "下载完整成绩管理器，保存两条中文记录后删一条，再加载恢复。随后修改文件加入重复 ID，验证导入失败后原内存数据没变。",
    "hint": "load 使用候选 Map；排序明确同分 ID 升序。",
    "code": "add 1 85 穆天宇\nadd 2 85 Li Ming\nsave grades.tsv\ndelete 1\nload grades.tsv\nlist",
    "tests": [
      "加载成功 → 恢复两条记录",
      "同分 → ID 1 在 ID 2 前",
      "文件含重复 ID → ERROR 且保留原状态"
    ],
    "explain": "本轮完整项目选同分小 ID 优先，与最小核心示例区分。命令不是 Java 代码，应输入到运行后的程序。"
  },
  "review": {
    "title": "跨章节解释一次请求",
    "prompt": "从输入 add 1 85 Mu 开始，解释输入解析、类型转换、Student 校验、Map 去重、排序、文件写入各自可能失败在哪里。",
    "hint": "逐个标出状态改变发生前后的边界。",
    "code": "输入 → 解析 → 参数验证 → 候选对象 → Map修改\n输出查询 → 排序 / 平均\n保存 → 临时文件 → 关闭 → 替换\n加载 → 候选Map全量校验 → 内存替换",
    "tests": [
      "非法数字 → 不进入有效状态修改",
      "重复 ID → 原值不被覆盖",
      "写文件失败 → 显式错误，不宣称保存成功"
    ],
    "explain": "把“正常路径能跑”升级为“能说明故障后的状态”，就是课程的验收目标。"
  }
};
