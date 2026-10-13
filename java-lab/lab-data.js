const TIMELINES = {
  "compile": {
    "title": "图解 · 从源文件到执行",
    "description": "这是工具链示意，点击下一步追踪输入和产物。",
    "steps": [
      {
        "text": "将代码保存为 Main.java，公开类名与文件名一致。",
        "nodes": [
          [
            "源码",
            "Main.java",
            "focus"
          ],
          [
            "编译器",
            "javac",
            ""
          ],
          [
            "运行时",
            "JVM",
            ""
          ]
        ]
      },
      {
        "text": "javac 检查语法和类型，错误会在编译期阻止生成有效结果。",
        "nodes": [
          [
            "源码",
            "Main.java",
            ""
          ],
          [
            "javac",
            "类型 / 语法检查",
            "focus"
          ],
          [
            "产物",
            "Main.class",
            ""
          ]
        ]
      },
      {
        "text": "java Main 启动 JVM，定位并加载 Main 类及相关类。",
        "nodes": [
          [
            "字节码",
            "Main.class",
            ""
          ],
          [
            "类加载",
            "定位 / 验证",
            "focus"
          ],
          [
            "JVM",
            "运行环境",
            ""
          ]
        ]
      },
      {
        "text": "执行 main，println 输出 Hello, Java!。解释执行与 JIT 优化是运行时实现路径。",
        "nodes": [
          [
            "main",
            "开始执行",
            "focus"
          ],
          [
            "标准输出",
            "Hello, Java!",
            "good"
          ],
          [
            "进程",
            "结束",
            ""
          ]
        ]
      }
    ]
  },
  "shortcircuit": {
    "title": "图解 · && 的短路求值",
    "description": "s 为 null；在安全路径中右侧根本不被调用。",
    "steps": [
      {
        "text": "准备计算 s != null && s.length() > 0。",
        "nodes": [
          [
            "s",
            "null",
            ""
          ],
          [
            "左侧",
            "待求值",
            ""
          ],
          [
            "右侧",
            "待求值",
            ""
          ]
        ]
      },
      {
        "text": "左侧得到 false；&& 的规则允许立刻确定整个结果。",
        "nodes": [
          [
            "左侧",
            "false",
            "focus"
          ],
          [
            "&&",
            "短路",
            ""
          ],
          [
            "右侧",
            "不执行",
            "good"
          ]
        ]
      },
      {
        "text": "整个表达式 false，没有调用 null.length()。",
        "nodes": [
          [
            "表达式",
            "false",
            "good"
          ],
          [
            "结果",
            "没有异常",
            ""
          ]
        ]
      },
      {
        "text": "若换成 boolean &，即使左侧 false 仍计算右侧，会因 null 调用产生 NPE。",
        "nodes": [
          [
            "左侧",
            "false",
            ""
          ],
          [
            "右侧",
            "null.length()",
            "bad"
          ],
          [
            "异常",
            "NullPointerException",
            "bad"
          ]
        ]
      }
    ]
  },
  "stack": {
    "title": "图解 · 递归栈帧与返回",
    "description": "示例 factorial(4)，每一层保留自己的 n。",
    "steps": [
      {
        "text": "进入 factorial(4)，等待 4 * factorial(3)。",
        "nodes": [
          [
            "栈底",
            "f(4), n=4",
            "focus"
          ]
        ]
      },
      {
        "text": "下一层 f(3)，上一层尚未返回。",
        "nodes": [
          [
            "栈底",
            "f(4) 等待",
            ""
          ],
          [
            "栈顶",
            "f(3), n=3",
            "focus"
          ]
        ]
      },
      {
        "text": "继续 f(2) 与 f(1)，到达基本条件。",
        "nodes": [
          [
            "f(4)",
            "等待",
            ""
          ],
          [
            "f(3)",
            "等待",
            ""
          ],
          [
            "f(2)",
            "等待",
            ""
          ],
          [
            "f(1)",
            "返回 1",
            "focus"
          ]
        ]
      },
      {
        "text": "弹出 f(1)，f(2) 得到 2*1=2。",
        "nodes": [
          [
            "f(4)",
            "等待",
            ""
          ],
          [
            "f(3)",
            "等待",
            ""
          ],
          [
            "f(2)",
            "返回 2",
            "focus"
          ]
        ]
      },
      {
        "text": "f(3) 得到 3*2=6，随后 f(4) 得到 4*6=24。",
        "nodes": [
          [
            "f(3)",
            "返回 6",
            ""
          ],
          [
            "f(4)",
            "返回 24",
            "good"
          ],
          [
            "main",
            "打印 24",
            ""
          ]
        ]
      }
    ]
  },
  "reference": {
    "title": "图解 · 值传递中的引用副本",
    "description": "变量和对象分开画；重赋值参数不等于改调用者。",
    "steps": [
      {
        "text": "调用前，main 的 a 指向数组 A=[1,2]。",
        "nodes": [
          [
            "main.a",
            "→ 数组 A",
            ""
          ],
          [
            "堆对象 A",
            "[1, 2]",
            "focus"
          ]
        ]
      },
      {
        "text": "调用 change 时复制引用值，p 和 a 都指向 A。",
        "nodes": [
          [
            "main.a",
            "→ A",
            ""
          ],
          [
            "change.p",
            "→ A",
            "focus"
          ],
          [
            "对象 A",
            "[1, 2]",
            ""
          ]
        ]
      },
      {
        "text": "p[0]=9 修改共享对象 A，a 也能观察到。",
        "nodes": [
          [
            "main.a",
            "→ A",
            ""
          ],
          [
            "change.p",
            "→ A",
            ""
          ],
          [
            "对象 A",
            "[9, 2]",
            "focus"
          ]
        ]
      },
      {
        "text": "p=new int[]{7,8}：只有参数 p 改指向新数组 B。",
        "nodes": [
          [
            "main.a",
            "→ A",
            ""
          ],
          [
            "change.p",
            "→ B",
            "focus"
          ],
          [
            "对象 A",
            "[9, 2]",
            ""
          ],
          [
            "对象 B",
            "[7, 8]",
            ""
          ]
        ]
      },
      {
        "text": "p[0]=6 改 B；方法结束后 main.a 仍读 A[0]=9。",
        "nodes": [
          [
            "main.a",
            "→ A",
            ""
          ],
          [
            "对象 A",
            "[9, 2]",
            "good"
          ],
          [
            "对象 B",
            "[6, 8]",
            ""
          ],
          [
            "输出",
            "9",
            "focus"
          ]
        ]
      }
    ]
  },
  "string": {
    "title": "图解 · 内容相同与对象身份",
    "description": "此例明确 new String，不依赖字符串池的偶然身份。",
    "steps": [
      {
        "text": "a 指向字面量对象，b 指向 new 创建的另一个对象。",
        "nodes": [
          [
            "a",
            "→ 对象 A",
            ""
          ],
          [
            "对象 A",
            "\"java\"",
            ""
          ],
          [
            "b",
            "→ 对象 B",
            ""
          ],
          [
            "对象 B",
            "\"java\"",
            ""
          ]
        ]
      },
      {
        "text": "a==b 比较身份：对象不同，返回 false。",
        "nodes": [
          [
            "A == B",
            "false",
            "focus"
          ],
          [
            "A 内容",
            "java",
            ""
          ],
          [
            "B 内容",
            "java",
            ""
          ]
        ]
      },
      {
        "text": "a.equals(b) 比较字符内容，返回 true。",
        "nodes": [
          [
            "A.equals(B)",
            "true",
            "good"
          ],
          [
            "内容",
            "java = java",
            ""
          ]
        ]
      },
      {
        "text": "a.toUpperCase() 返回结果对象 c，原对象 A 仍为 java。",
        "nodes": [
          [
            "a",
            "java",
            "good"
          ],
          [
            "c",
            "JAVA",
            "focus"
          ],
          [
            "原对象",
            "没有被修改",
            ""
          ]
        ]
      }
    ]
  },
  "objects": {
    "title": "图解 · 两个实例各自的状态",
    "description": "a 与 b 属于同一类，但持有两份实例字段。",
    "steps": [
      {
        "text": "类 Student 定义 name、score 和行为。",
        "nodes": [
          [
            "类 Student",
            "name / score / addScore",
            "focus"
          ]
        ]
      },
      {
        "text": "new Student(\"Mu\",80) 构造实例 A。",
        "nodes": [
          [
            "a",
            "→ A",
            ""
          ],
          [
            "对象 A",
            "Mu / 80",
            "focus"
          ]
        ]
      },
      {
        "text": "再构造实例 B，b 指向它而不是 A。",
        "nodes": [
          [
            "a → A",
            "Mu / 80",
            ""
          ],
          [
            "b → B",
            "Li / 90",
            "focus"
          ]
        ]
      },
      {
        "text": "a.addScore(5) 只更新 A 的实例状态。",
        "nodes": [
          [
            "a → A",
            "Mu / 85",
            "good"
          ],
          [
            "b → B",
            "Li / 90",
            "good"
          ]
        ]
      }
    ]
  },
  "final": {
    "title": "图解 · final 限制引用重赋值",
    "description": "final 是对变量的限制；对对象可变性需另行设计。",
    "steps": [
      {
        "text": "final List<Integer> list 指向一个可变 ArrayList。",
        "nodes": [
          [
            "final list",
            "→ 对象 L",
            "focus"
          ],
          [
            "对象 L",
            "[]",
            ""
          ]
        ]
      },
      {
        "text": "list.add(1) 修改对象内容，变量仍指向 L，所以允许。",
        "nodes": [
          [
            "final list",
            "→ 对象 L",
            ""
          ],
          [
            "对象 L",
            "[1]",
            "good"
          ]
        ]
      },
      {
        "text": "list=new ArrayList<>() 试图重赋值，编译失败。",
        "nodes": [
          [
            "final list",
            "不允许改指向",
            "bad"
          ],
          [
            "新对象",
            "不能赋给该变量",
            ""
          ]
        ]
      },
      {
        "text": "List.of(1) 创建不可修改列表，是另一层契约；元素本身也可能可变。",
        "nodes": [
          [
            "引用不可重赋",
            "final",
            ""
          ],
          [
            "列表不可修改",
            "List.of",
            ""
          ],
          [
            "深度不可变",
            "另行设计",
            "focus"
          ]
        ]
      }
    ]
  },
  "dispatch": {
    "title": "图解 · 重写方法与字段访问",
    "description": "Animal animal=new Dog()。方法和字段不能套用同一规则。",
    "steps": [
      {
        "text": "声明类型 Animal，实际对象 Dog。",
        "nodes": [
          [
            "变量 animal",
            "编译期 Animal",
            ""
          ],
          [
            "实际对象",
            "Dog",
            "focus"
          ]
        ]
      },
      {
        "text": "编译期确认 Animal 有 voice()，调用合法。",
        "nodes": [
          [
            "编译期检查",
            "Animal.voice 存在",
            "focus"
          ],
          [
            "实际对象",
            "Dog",
            ""
          ]
        ]
      },
      {
        "text": "运行时对可重写实例方法动态分派，调用 Dog.voice。",
        "nodes": [
          [
            "voice()",
            "Dog.voice",
            "focus"
          ],
          [
            "结果",
            "woof",
            "good"
          ]
        ]
      },
      {
        "text": "animal.label 字段按声明类型选择 Animal.label，结果 animal。",
        "nodes": [
          [
            "字段访问",
            "Animal.label",
            "focus"
          ],
          [
            "结果",
            "animal",
            "good"
          ]
        ]
      }
    ]
  },
  "interface": {
    "title": "图解 · 依赖契约和可替换实现",
    "description": "构造注入使业务依赖可见，替换实现不改业务方法。",
    "steps": [
      {
        "text": "NotifyService 只要求一个 MessageSender。",
        "nodes": [
          [
            "业务服务",
            "NotifyService",
            ""
          ],
          [
            "契约",
            "MessageSender",
            "focus"
          ]
        ]
      },
      {
        "text": "构造时传入 ConsoleSender 实现。",
        "nodes": [
          [
            "构造注入",
            "ConsoleSender",
            ""
          ],
          [
            "业务字段",
            "MessageSender 引用",
            "focus"
          ]
        ]
      },
      {
        "text": "notifyUser(\"hello\") 通过接口调用具体实现。",
        "nodes": [
          [
            "业务服务",
            "notifyUser",
            ""
          ],
          [
            "接口调用",
            "send(\"hello\")",
            ""
          ],
          [
            "实现",
            "ConsoleSender",
            "focus"
          ]
        ]
      },
      {
        "text": "测试时可传入记录消息的替身实现，验证业务调用；无需真实发邮件。",
        "nodes": [
          [
            "相同业务",
            "NotifyService",
            ""
          ],
          [
            "替换实现",
            "RecordingSender",
            "good"
          ]
        ]
      }
    ]
  },
  "generics": {
    "title": "图解 · 通配符的读写边界",
    "description": "List<Integer> 与 List<Number> 不是普通的协变继承关系。",
    "steps": [
      {
        "text": "List<Integer> 的契约：元素应为 Integer。",
        "nodes": [
          [
            "容器",
            "List<Integer>",
            "focus"
          ],
          [
            "元素",
            "1 / 2 / 3",
            ""
          ]
        ]
      },
      {
        "text": "若允许赋给 List<Number>，就可能写入 Double，破坏原契约，因此编译不允许。",
        "nodes": [
          [
            "假设别名",
            "List<Number>",
            ""
          ],
          [
            "写 Double",
            "破坏 Integer 列表",
            "bad"
          ]
        ]
      },
      {
        "text": "? extends Number 允许读取为 Number，但不知道具体子类，不能任意写 Integer。",
        "nodes": [
          [
            "extends",
            "读取 Number",
            "good"
          ],
          [
            "写入",
            "具体类型未知",
            "bad"
          ]
        ]
      },
      {
        "text": "? super Integer 可写 Integer，读取只能安全看作 Object。",
        "nodes": [
          [
            "super",
            "写 Integer",
            "good"
          ],
          [
            "读取",
            "Object",
            "focus"
          ]
        ]
      }
    ]
  },
  "exception": {
    "title": "图解 · 异常沿调用栈传播",
    "description": "parsePositive(\"-3\") 抛出异常，main 的 catch 接住，再执行 finally。",
    "steps": [
      {
        "text": "main 进入 try 并调用 parsePositive。",
        "nodes": [
          [
            "main",
            "try",
            ""
          ],
          [
            "调用",
            "parsePositive(\"-3\")",
            "focus"
          ]
        ]
      },
      {
        "text": "解析 n=-3，业务校验失败并 throw。",
        "nodes": [
          [
            "方法局部",
            "n=-3",
            ""
          ],
          [
            "throw",
            "IllegalArgumentException",
            "bad"
          ]
        ]
      },
      {
        "text": "正常返回被中断，寻找匹配处理器，main catch 捕获。",
        "nodes": [
          [
            "传播",
            "回到 main",
            ""
          ],
          [
            "catch",
            "匹配异常",
            "focus"
          ]
        ]
      },
      {
        "text": "catch 输出原因，然后 finally 输出 finished。进程被终止等情形另行考虑。",
        "nodes": [
          [
            "catch",
            "invalid: must be positive",
            ""
          ],
          [
            "finally",
            "finished",
            "good"
          ]
        ]
      }
    ]
  },
  "equality": {
    "title": "图解 · equals 与哈希集合",
    "description": "示例 record Student 根据组件定义相等。",
    "steps": [
      {
        "text": "a 与 b 是两个独立 Student 对象，但 id/name 相同。",
        "nodes": [
          [
            "a",
            "Student(42,Mu)",
            ""
          ],
          [
            "b",
            "Student(42,Mu)",
            ""
          ]
        ]
      },
      {
        "text": "record 的 equals 返回 true，因此 hashCode 也必须一致。",
        "nodes": [
          [
            "equals",
            "true",
            "good"
          ],
          [
            "hashCode",
            "相同",
            "focus"
          ]
        ]
      },
      {
        "text": "先 add(a)，集合保存一个元素。",
        "nodes": [
          [
            "HashSet",
            "size=1",
            "focus"
          ],
          [
            "元素",
            "a",
            ""
          ]
        ]
      },
      {
        "text": "再 add(b) 定位候选并比较 equals，判定已存在，不增加大小。",
        "nodes": [
          [
            "候选",
            "hash 相同",
            ""
          ],
          [
            "判定",
            "equals true",
            ""
          ],
          [
            "HashSet",
            "size=1",
            "good"
          ]
        ]
      }
    ]
  },
  "collection": {
    "title": "图解 · 集合的三种契约",
    "description": "同样两个 Mu，放在不同结构中结果不同。",
    "steps": [
      {
        "text": "List 接受重复并保留位置。",
        "nodes": [
          [
            "List",
            "[Mu, Mu]",
            "focus"
          ],
          [
            "size",
            "2",
            ""
          ]
        ]
      },
      {
        "text": "Set 按相等关系去重，不保证 HashSet 迭代顺序。",
        "nodes": [
          [
            "Set",
            "{Mu}",
            "focus"
          ],
          [
            "size",
            "1",
            ""
          ]
        ]
      },
      {
        "text": "Map 同 key 的新 put 替换 value，key 唯一。",
        "nodes": [
          [
            "Map",
            "Mu → 90",
            ""
          ],
          [
            "put",
            "Mu → 95",
            ""
          ],
          [
            "结果",
            "Mu → 95",
            "focus"
          ]
        ]
      },
      {
        "text": "Deque 两端操作：addLast A/B，removeFirst 得到 A，是 FIFO。",
        "nodes": [
          [
            "队列",
            "A → B",
            ""
          ],
          [
            "取出",
            "A",
            "good"
          ],
          [
            "剩余",
            "B",
            ""
          ]
        ]
      }
    ]
  },
  "io": {
    "title": "图解 · 编码与资源关闭",
    "description": "写入、读取使用相同 UTF-8；图中是路径示意，不是文件权限承诺。",
    "steps": [
      {
        "text": "程序持有字符串：你好 Java。",
        "nodes": [
          [
            "Java String",
            "字符内容",
            "focus"
          ],
          [
            "目标",
            "临时文件",
            ""
          ]
        ]
      },
      {
        "text": "UTF-8 编码将字符映射为字节并写入文件。",
        "nodes": [
          [
            "字符",
            "你好 Java",
            ""
          ],
          [
            "UTF-8",
            "编码",
            "focus"
          ],
          [
            "文件",
            "字节序列",
            ""
          ]
        ]
      },
      {
        "text": "读取字节，用同一编码解码为字符串。",
        "nodes": [
          [
            "文件",
            "字节序列",
            ""
          ],
          [
            "UTF-8",
            "解码",
            "focus"
          ],
          [
            "字符串",
            "你好 Java",
            "good"
          ]
        ]
      },
      {
        "text": "资源完成使用后关闭，示例 finally 删除自己创建的临时文件。大文件需流式处理。",
        "nodes": [
          [
            "资源",
            "关闭",
            ""
          ],
          [
            "临时文件",
            "清理",
            "good"
          ],
          [
            "异常",
            "保留与传播",
            ""
          ]
        ]
      }
    ]
  },
  "thread": {
    "title": "图解 · start 与 join",
    "description": "示例只有 worker 和 done 两行输出；join 建立结束等待关系。",
    "steps": [
      {
        "text": "new Thread 创建对象，状态 NEW；还没有运行任务。",
        "nodes": [
          [
            "main",
            "创建对象",
            ""
          ],
          [
            "worker",
            "NEW",
            "focus"
          ]
        ]
      },
      {
        "text": "start 启动新线程，main 与 worker 可并发推进。",
        "nodes": [
          [
            "main",
            "继续执行",
            ""
          ],
          [
            "worker",
            "RUNNABLE",
            "focus"
          ]
        ]
      },
      {
        "text": "main 调用 join 等待 worker 结束，worker 打印 worker。",
        "nodes": [
          [
            "main",
            "等待 join",
            ""
          ],
          [
            "worker",
            "打印 worker",
            "focus"
          ]
        ]
      },
      {
        "text": "worker 终止，join 返回；main 打印 done。",
        "nodes": [
          [
            "worker",
            "TERMINATED",
            ""
          ],
          [
            "main",
            "打印 done",
            "good"
          ]
        ]
      }
    ]
  },
  "race": {
    "title": "图解 · count++ 丢失更新",
    "description": "把读-改-写展开；此处是一个可能交错，不是真实随机调度。",
    "steps": [
      {
        "text": "初始 count=0，两个线程准备加一。",
        "nodes": [
          [
            "共享 count",
            "0",
            ""
          ],
          [
            "A",
            "准备",
            ""
          ],
          [
            "B",
            "准备",
            ""
          ]
        ]
      },
      {
        "text": "A 读取 0，B 也读取 0。",
        "nodes": [
          [
            "count",
            "0",
            ""
          ],
          [
            "A 局部",
            "read=0",
            "focus"
          ],
          [
            "B 局部",
            "read=0",
            "focus"
          ]
        ]
      },
      {
        "text": "A 计算 1 并写回，count=1。",
        "nodes": [
          [
            "count",
            "1",
            "focus"
          ],
          [
            "A",
            "写 1",
            ""
          ],
          [
            "B",
            "仍持有旧值 0",
            ""
          ]
        ]
      },
      {
        "text": "B 用旧值计算 1 并写回，两个更新只累加一次。volatile 不合并这三个阶段。",
        "nodes": [
          [
            "count",
            "1",
            "bad"
          ],
          [
            "预期",
            "2",
            ""
          ],
          [
            "问题",
            "丢失更新",
            "bad"
          ]
        ]
      },
      {
        "text": "改用共享同一锁的临界区，或 AtomicInteger.incrementAndGet，第二个更新得到 2。",
        "nodes": [
          [
            "原子步骤 A",
            "0 → 1",
            ""
          ],
          [
            "原子步骤 B",
            "1 → 2",
            ""
          ],
          [
            "count",
            "2",
            "good"
          ]
        ]
      }
    ]
  },
  "gc": {
    "title": "图解 · 可达性与对象回收",
    "description": "逻辑图仅用于可达性模型，不是 JVM 物理内存地址。",
    "steps": [
      {
        "text": "根引用持有 List，List 持有对象 A。",
        "nodes": [
          [
            "GC Root",
            "→ List",
            ""
          ],
          [
            "List",
            "→ A",
            ""
          ],
          [
            "对象 A",
            "可达",
            "good"
          ]
        ]
      },
      {
        "text": "List.clear() 断开 List 到 A 的引用。",
        "nodes": [
          [
            "GC Root",
            "→ List",
            ""
          ],
          [
            "List",
            "空",
            "focus"
          ],
          [
            "对象 A",
            "没有此路径",
            ""
          ]
        ]
      },
      {
        "text": "若 A 还有其他根路径，仍不能因 clear 就判定不可达。",
        "nodes": [
          [
            "另一个 Root",
            "→ A",
            "focus"
          ],
          [
            "对象 A",
            "仍可达",
            "good"
          ]
        ]
      },
      {
        "text": "所有根路径都消失后才可判断不可达；回收何时发生由 GC 决定。",
        "nodes": [
          [
            "GC Roots",
            "无路径",
            ""
          ],
          [
            "对象 A",
            "不可达",
            "focus"
          ],
          [
            "回收时间",
            "不保证立刻",
            ""
          ]
        ]
      },
      {
        "text": "不可达对象 B/C 即使互相引用，也可能一起回收。",
        "nodes": [
          [
            "Roots",
            "无路径",
            ""
          ],
          [
            "B ⇄ C",
            "互相引用",
            ""
          ],
          [
            "状态",
            "仍不可达",
            "good"
          ]
        ]
      }
    ]
  },
  "jdbc": {
    "title": "图解 · 一条 JDBC 事务调用链",
    "description": "此图不连接数据库；关键是两条 SQL 共享连接与事务边界。",
    "steps": [
      {
        "text": "Service 取得连接 c，setAutoCommit(false)。",
        "nodes": [
          [
            "Service",
            "开启业务流程",
            ""
          ],
          [
            "Connection c",
            "事务开始",
            "focus"
          ],
          [
            "数据库",
            "等待 SQL",
            ""
          ]
        ]
      },
      {
        "text": "DAO1 使用 c 的 PreparedStatement 绑定参数并更新。",
        "nodes": [
          [
            "DAO1",
            "同一个 c",
            ""
          ],
          [
            "SQL1",
            "参数绑定",
            "focus"
          ],
          [
            "数据库",
            "未提交变更",
            ""
          ]
        ]
      },
      {
        "text": "DAO2 继续使用 c，验证影响行数与业务条件。",
        "nodes": [
          [
            "DAO2",
            "同一个 c",
            ""
          ],
          [
            "SQL2",
            "执行 / 校验",
            "focus"
          ],
          [
            "数据库",
            "同一事务",
            ""
          ]
        ]
      },
      {
        "text": "全部满足则 commit；之后才触发缓存失效或可靠事件。",
        "nodes": [
          [
            "Connection c",
            "commit",
            "good"
          ],
          [
            "数据库",
            "已提交",
            ""
          ],
          [
            "Redis",
            "独立失效流程",
            ""
          ]
        ]
      },
      {
        "text": "失败分支 rollback，并保留异常；连接/语句/结果集按生命周期关闭。",
        "nodes": [
          [
            "失败",
            "异常传播",
            ""
          ],
          [
            "Connection c",
            "rollback",
            "focus"
          ],
          [
            "资源",
            "关闭",
            ""
          ]
        ]
      }
    ]
  },
  "debug": {
    "title": "实验 · 最大值为什么不能初始化为 0",
    "description": "用全负数组追踪两个实现；这是一条具体输入的执行轨迹。",
    "steps": [
      {
        "text": "输入 [-3,-1,-7]。错误版 answer=0，正确版 answer=-3。",
        "nodes": [
          [
            "输入",
            "[-3,-1,-7]",
            ""
          ],
          [
            "错误版",
            "0",
            "bad"
          ],
          [
            "正确版",
            "-3",
            "good"
          ]
        ]
      },
      {
        "text": "处理 -3：错误版 Math.max(0,-3)=0；正确版仍为 -3。",
        "nodes": [
          [
            "当前元素",
            "-3",
            ""
          ],
          [
            "错误版",
            "0",
            "bad"
          ],
          [
            "正确版",
            "-3",
            "focus"
          ]
        ]
      },
      {
        "text": "处理 -1：错误版仍为 0，正确版更新为 -1。",
        "nodes": [
          [
            "当前元素",
            "-1",
            ""
          ],
          [
            "错误版",
            "0",
            "bad"
          ],
          [
            "正确版",
            "-1",
            "good"
          ]
        ]
      },
      {
        "text": "处理 -7 后结束：错误版返回不存在的 0，正确版返回 -1。空数组应另行拒绝。",
        "nodes": [
          [
            "错误输出",
            "0",
            "bad"
          ],
          [
            "正确输出",
            "-1",
            "good"
          ],
          [
            "边界",
            "空 / null / 单元素",
            ""
          ]
        ]
      }
    ]
  }
};
