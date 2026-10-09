# 计网实验室

按 [TSR0705/COMPUTER-NETWORKING-NOTES](https://github.com/TSR0705/COMPUTER-NETWORKING-NOTES) 的 18 章主题编写的中文可视化导学。

每章提供交互实验、4 张中文知识卡、原创自测与解析，以及对应原始笔记和原章节知识目录的入口。它是导学与实验，不是原文全文翻译。

## 使用

在线入口：[计网实验室](https://MU-ty.github.io/cs-study/network-lab/)。章节可用 `#chapter-15` 等锚点直达。

也可直接打开 `index.html`；所有学习功能无需服务器、登录或外部依赖。自动播放默认慢速，支持暂停、上一步、下一步和重置。浏览器本地保存章节完成标记；清除浏览器数据后标记会丢失。

## 18 章实验

| 章 | 主题 | 可视化实验 |
|---|---|---|
| 1 | 网络概述 | 消息、协议、介质与接收方 |
| 2 | 网络类型 | PAN → LAN → CAN → MAN → WAN 范围导览 |
| 3 | 网络拓扑 | 切换星形、网状、环形、总线、树形及故障 |
| 4 | 分层模型 | 五层封装与解封装 |
| 5 | 物理层 | 调整长度、带宽和距离计算时延 |
| 6 | 交换 | 报文存储转发与分组流水对比 |
| 7 | 链路层 | 简化以太网帧字段逐步查看 |
| 8 | MAC | CSMA/CD 与 CSMA/CA 过程 |
| 9 | 检错与流控 | CRC 模 2 除法和单比特翻转检错 |
| 10 | IP 寻址 | CIDR 网络、广播与主机范围计算 |
| 11 | 网络设备 | 交换机学习、泛洪与单播 |
| 12 | 网络层 | ARP 下一跳寻址、DHCP DORA |
| 13 | 路由算法 | Dijkstra 距离与前驱逐步变化 |
| 14 | IPv6 | 展开与规范压缩 |
| 15 | 传输层 | TCP 握手 / 挥手状态与序号 |
| 16 | 应用层 | 无缓存 DNS 递归 / 迭代解析 |
| 17 | 安全 | TLS 1.3 常见证书握手 |
| 18 | 实践 | DNS / TCP 端口 / TLS 故障定位 |

## 开发与验证

无构建步骤。可在仓库根目录运行 `python -m http.server 8000`，访问 `http://localhost:8000/network-lab/`。

算法边界测试：`node --test network-lab/engine.test.js`。

- `lessons.js`：独立编写的中文内容、自测及来源目录。
- `engine.js`：CRC、CIDR、IPv6 和 Dijkstra 算法。
- `app.js`：章节路由、实验交互、播放控制与本地进度。
- `style.css`：桌面与手机布局。

所有实验都使用教学模型，不会捕获真实流量或执行网络命令。每个实验注明省略条件。CRC 实验使用教学多项式，不等同于完整 Ethernet CRC-32 实现。IPv6 输入仅支持纯十六进制地址，不支持 IPv4 嵌入式尾部和区域标识。

## 来源与核对

章节结构参考原仓库版本 `f1749d8cc4df1bb7d0df7ae162250c1e0df477d4`。原仓库未声明许可证；本目录不复制完整讲义正文，中文解释、题目和代码独立编写，并提供原章节链接。

关键协议与边界参考：

- [RFC 9293 §3.5：TCP 建立连接](https://www.rfc-editor.org/rfc/rfc9293.html#section-3.5)
- [RFC 8446：TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446.html)
- [RFC 3021：IPv4 /31 点到点地址](https://www.rfc-editor.org/rfc/rfc3021.html)
- [RFC 5952：IPv6 文本规范表示](https://www.rfc-editor.org/rfc/rfc5952.html)

与原笔记中的简化措辞相比，本项目明确了全双工以太网不使用 CSMA/CD、VLAN 能划分广播域、链路层不普遍保证可靠性、HTTP/3 使用 QUIC，以及 TLS 1.3 常见握手的密钥协商与认证区别。
