# 深入理解 AI Agent · 网页学习模块

来源：穆天宇（mty）《深入理解 AI Agent》，课件日期 2026-09-21，共 110 页。用户授权将课件改编为网站学习模块，原文件未修改、未公开上传。

12 单元按“概念与代码 → 交互轨迹 → 自测”组织，包含 36 段概念导读、12 个代码/结构示例、12 道解释性自测、章节搜索与本地学习标记。所有演示是本地确定性教学模拟，不调用真实模型、不执行代码、不接触凭证。

## 内容映射

| 网页单元 | 来源页 | 处理方式 |
|---|---|---|
| Agent 与 Harness | 3–27 | 课件主线重写 |
| ReAct 与工具调用 | 5–12、31–33、105 | 工具章封面，其余已有内容，新增代码与错误示例 |
| 上下文与缓存 | 28–47 | 修正缓存失效的绝对化表达 |
| 提示词、Skills、安全 | 27、48–54 | 区分产品实现与通用机制 |
| 状态、压缩、隔离 | 55–65 | 增加确定性计数示例 |
| 长期记忆 | 66–80 | 研究方向不宣称已实现 |
| RAG 索引 | 81–88、101–104 | 新增合成政策示例 |
| 混合检索与指标 | 83–91 | 实现 RRF 与二元指标，非真实召回器 |
| 知识组织与治理 | 93–104 | 概念示意，非 GraphRAG/RAPTOR 实现 |
| 评估、后训练、自进化 | 106–108 | 原课件只有封面，明确补充 |
| 多模态 | 92、109 | 部分课件，部分补充 |
| 多 Agent | 65、110 | 隔离来自课件，协作补充 |

未迁移全部原图、没有原始逐页播放或 PPT 下载。各单元展示来源页码，便于与原课件对照。暂未将未经核验的产品型号、性能/费用数字、绝对化厂商能力和研究论文成果作为事实结论。

## 技术边界

- 缓存方块是教学符号，不是真实 token、缓存块、费用或 TTFT。
- RRF 按 `1/(k+rank)` 融合预设候选，k 仅供教学调整。重排为预设排序。
- 单查询给 reciprocal rank；多查询平均才是 MRR。nDCG 使用二元相关性。
- 退款、记忆、权限、协作与成功率均为合成示例，无外部副作用。
- 通用伪代码不等于可直接运行的某个 SDK API。
- 样式复用 `os-lab/style.css` 与数据结构模块，保持网站一致性。

## 核对与延伸来源

- https://www.anthropic.com/engineering/building-effective-agents
- https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- https://huggingface.co/docs/transformers/v5.0.0/cache_explanation
- https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
- https://www.anthropic.com/engineering/contextual-retrieval

运行 `node --test agent-lab/engine.test.js`。算法测试与 DOM 状态模拟不替代真实浏览器视觉验收。所有页面纯静态，无构建依赖。
