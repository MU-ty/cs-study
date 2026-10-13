const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const node=(title,value,cls='')=>`<div class="node ${cls}"><strong>${esc(title)}</strong>${esc(value)}</div>`;
const nodes=(...x)=>`<div class="nodes">${x.join('<span class="flow-arrow" aria-hidden="true">→</span>')}</div>`;
const LABS={
cache:{title:'图解 · 缓存查询路径',description:'分别观察第一次回源与第二次命中。框内是每一步的真实示意状态。',steps:[
['客户端请求商品 42，缓存当前为空。',nodes(node('客户端','GET /products/42','focus'),node('Redis','空'),node('MySQL','price = 99'))],
['GET product:42 返回 nil；应用准备回源。',nodes(node('客户端','cache miss'),node('Redis','nil','focus'),node('MySQL','price = 99'))],
['应用读取数据库得到 99。Redis 不会替你自动查询 MySQL。',nodes(node('应用','查数据库'),node('Redis','空'),node('MySQL','返回 99','focus'))],
['应用将 99 写入缓存并设置 TTL，然后返回数据。',nodes(node('应用','返回 99'),node('Redis','99，TTL 60s','good'),node('MySQL','price = 99'))],
['第二次查询命中缓存，数据库无需再执行本次查询。',nodes(node('客户端','第二次查询'),node('Redis','返回 99','focus'),node('MySQL','本次不查询'))]]},
race:{title:'竞态 · 旧值是怎样回填的',description:'即使写者“先改库再删缓存”，读者的回填也可能晚于删除。',steps:[
['初始数据库为 v1，缓存为空。',nodes(node('读者 A','等待查询'),node('缓存','空'),node('数据库','v1'))],
['A 缓存 miss 后读取数据库 v1，但尚未回填。',nodes(node('读者 A','手中持有 v1','focus'),node('缓存','空'),node('数据库','v1'))],
['B 将数据库更新为 v2 并提交。',nodes(node('读者 A','仍持有 v1'),node('写者 B','提交 v2','focus'),node('数据库','v2'))],
['B 删除缓存，此时缓存本来就为空。',nodes(node('读者 A','仍持有 v1'),node('缓存','DEL 后为空','focus'),node('数据库','v2'))],
['A 才回填 v1，缓存重新变旧。TTL/版本校验/串行化等用于约束这个窗口。',nodes(node('读者 A','SET v1'),node('缓存','v1，旧数据','bad'),node('数据库','v2','good'))]]},
lock:{title:'竞态 · 锁过期与误删',description:'对比直接 DEL 和检查 token 的原子释放；租约不阻止旧持有者继续业务。',steps:[
['A 获取锁，token=A，期限 10 秒。',nodes(node('A','持锁工作','focus'),node('锁','token A / TTL 10'),node('B','未获锁'))],
['A 长暂停；时间超过期限，Redis 中锁已经过期。',nodes(node('A','暂停中'),node('锁','不存在','bad'),node('B','准备抢锁'))],
['B 获得新锁，token=B。A 对锁的所有权已经失效。',nodes(node('A','已失去所有权'),node('锁','token B / TTL 10','good'),node('B','持锁工作','focus'))],
['A 恢复，若直接 DEL 就误删 B 的锁。',nodes(node('A','直接 DEL','bad'),node('锁','被误删','bad'),node('B','仍在工作'))],
['重新看安全分支：A 用 Lua 比较 token，发现当前为 B，返回 0 并保留锁。',nodes(node('A','比较 A ≠ B'),node('锁','token B 保留','good'),node('B','仍持有锁'))],
['但 A 若继续写外部资源，仍有危险；需资源端 fencing/CAS/幂等。',nodes(node('A','旧请求'),node('资源端','拒绝旧版本','focus'),node('B','新版本已提交','good'))]]},
persistence:{title:'图解 · 写入与恢复窗口',description:'简化示意：最后快照在 t=0，AOF 在 t=1 完成同步；t=1.6 崩溃。',steps:[
['t=0：保存 RDB，数据为 count=0。',nodes(node('内存','0'),node('RDB','0','good'),node('AOF 已同步','0'))],
['t=0.3：INCR 返回 1，操作进入 AOF 写路径，但尚未完成本次 fsync。',nodes(node('内存','1','focus'),node('RDB','0'),node('AOF 已同步','0'))],
['t=1：示例中 fsync 完成，AOF 安全记录到 count=1。',nodes(node('内存','1'),node('RDB','0'),node('AOF 已同步','1','good'))],
['t=1.4：INCR 返回 2，下一次 fsync 尚未完成。',nodes(node('内存','2','focus'),node('RDB','0'),node('AOF 已同步','1'))],
['t=1.6：机器异常断电。示例假定未同步内容丢失。',nodes(node('内存','丢失','bad'),node('RDB','恢复 0'),node('AOF','恢复 1','good'))],
['RDB/AOF 配置决定恢复窗口；复制不是独立备份。正常启用两者时优先从 AOF 恢复。',nodes(node('RPO','可丢失时间'),node('RTO','恢复时长'),node('备份','隔离恢复验证','focus'))]]},
replication:{title:'图解 · 全量与部分同步',description:'观察副本 offset 和 backlog，不把复制确认等同于磁盘确认。',steps:[
['副本首次连接，缺少可衔接的复制历史，需要全量同步。',nodes(node('主节点','offset 100'),node('backlog','80–100'),node('副本','无历史','focus'))],
['生成/传输快照，副本加载；期间写入继续形成增量。',nodes(node('主节点','快照基点 100'),node('传输','RDB + 增量','focus'),node('副本','加载'))],
['副本追赶到 offset 120。正常写入默认异步发送给副本。',nodes(node('主节点','offset 120'),node('backlog','100–120'),node('副本','offset 120','good'))],
['副本断线，主节点推进到 140；副本仍是 120。',nodes(node('主节点','offset 140'),node('backlog','110–140'),node('副本','offset 120','bad'))],
['历史 ID 相容，缺失的 121–140 仍在 backlog，部分同步即可。',nodes(node('主节点','offset 140'),node('增量传输','121–140','focus'),node('副本','追赶到 140'))],
['若断连太久，backlog 已变成 200–230，就无法提供 121 之后的全部增量，需要全量同步。',nodes(node('主节点','offset 230'),node('backlog','200–230'),node('副本','需全量同步','bad'))]]},
sentinel:{title:'图解 · 哨兵判定和选举',description:'示例为 3 个哨兵、quorum=2；三个哨兵本身也需分散故障域。',steps:[
['正常时主 M 提供写服务，副本 R 追赶。',nodes(node('主 M','可写','good'),node('副本 R','复制中'),node('S1 / S2 / S3','监控'))],
['S1 无法联系 M，仅是 S1 的主观下线判断。',nodes(node('主 M','暂不可达'),node('副本 R','待命'),node('S1','主观下线','focus'))],
['S2 也判定 M 下线，达到 quorum=2，形成客观下线。',nodes(node('S1 + S2','同意下线','focus'),node('主 M','客观下线'),node('S3','参加选举'))],
['一个哨兵获得多数授权，负责本轮故障转移；quorum 和授权是两个条件。',nodes(node('3 哨兵','至少 2 票'),node('负责人','获得多数','focus'),node('副本 R','被选中'))],
['R 提升为新主，其余副本重配置，客户端发现并连接新主。',nodes(node('客户端','发现新主'),node('新主 R','接收写入','good'),node('旧 M','恢复后需重配置'))]]},
stream:{title:'图解 · 投递、崩溃与确认',description:'消费组跟踪 Pending；最终业务仍要保证幂等。',steps:[
['生产者 XADD；流保存消息 1、2、3。',nodes(node('Stream','[1, 2, 3]','focus'),node('PEL','空'),node('消费者 A','待命'))],
['XREADGROUP > 将消息 1 交给 A，消息 1 进入 PEL。',nodes(node('Stream','[1, 2, 3]'),node('PEL','1 → A','focus'),node('消费者 A','处理 1'))],
['A 完成数据库业务，但在 XACK 前崩溃。',nodes(node('数据库','1 已完成','good'),node('PEL','1 → A'),node('消费者 A','崩溃','bad'))],
['B 用 XAUTOCLAIM 接管长时间闲置消息 1；可能重复处理。',nodes(node('数据库','检查请求 ID'),node('PEL','1 → B','focus'),node('消费者 B','识别已完成'))],
['B 幂等处理后 XACK，PEL 清空；流中消息 1 并未因此删除。',nodes(node('Stream','[1, 2, 3]'),node('PEL','空','good'),node('消费者 B','确认 1'))]]},
rehash:{title:'图解 · 渐进式 rehash',description:'为便于阅读用 4 个桶演示，实际哈希/桶大小由内部实现决定。',steps:[
['扩容前只有旧表。',nodes(node('旧表 4 桶','A / B / C / D','focus'),node('新表','未分配'))],
['分配更大新表，两张表同时存在。',nodes(node('旧表','A / B / C / D'),node('新表 8 桶','空','focus'))],
['迁移一部分桶，新增记录进入新表；查找需兼顾两表。',nodes(node('旧表','— / B / C / D'),node('新表','A / E','focus'))],
['继续分批迁移，不把全部工作集中在一次操作。',nodes(node('旧表','— / — / C / D'),node('新表','A / B / E','focus'))],
['迁移完成，旧表释放。渐进不是完全无停顿。',nodes(node('旧表','释放'),node('新表','A / B / C / D / E','good'))]]},
stampede:{title:'图解 · 热点重建与请求合并',description:'四个同时访问同一热点的请求。这里比较的是示意回源数量。',steps:[
['热点缓存刚过期，A/B/C/D 四个请求同时 miss。',nodes(node('请求','A B C D'),node('缓存','过期','bad'),node('数据库','待查询'))],
['无保护：四个请求各自查库，流量规模越大越危险。',nodes(node('请求','4 个独立回源','bad'),node('数据库','4 次查询','bad'))],
['改用请求合并：A 成为重建者，其余有限等待或按允许规则读旧值。',nodes(node('A','重建者','focus'),node('B / C / D','等待或旧值'),node('数据库','1 次查询','good'))],
['A 回填后其他请求读缓存；失败路径仍要有限重试/降级。',nodes(node('请求','读取结果'),node('缓存','新值','good'),node('数据库','回源受预算限制'))]]}
};
function frame(title,description,inner){return `<section class="lab"><div class="lab-head"><h2>${title}</h2><span>INTERACTIVE LAB</span></div><p class="lab-description">${description}</p>${inner}</section>`;}
function initLab(id,host){
 if(LABS[id]){const lab=LABS[id];let i=0;host.innerHTML=frame(lab.title,lab.description,'<div class="scene"></div><p class="step-description" aria-live="polite"></p><div class="steps"></div><div class="lab-controls"><button data-prev>← 上一步</button><button data-next class="primary">下一步 →</button><button data-restart>从头看</button></div>');
 const draw=()=>{host.querySelector('.scene').innerHTML=lab.steps[i][1];host.querySelector('.step-description').textContent=`${i+1}/${lab.steps.length} · ${lab.steps[i][0]}`;host.querySelector('[data-prev]').disabled=i===0;host.querySelector('[data-next]').disabled=i===lab.steps.length-1;host.querySelector('.steps').innerHTML=lab.steps.map((_,j)=>`<button class="step-dot ${i===j?'selected':''}" aria-label="第 ${j+1} 步" aria-pressed="${i===j}" data-step="${j}">${j+1}</button>`).join('');host.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>{i=Number(b.dataset.step);draw();});};
 host.querySelector('[data-prev]').onclick=()=>{i=Math.max(0,i-1);draw();};host.querySelector('[data-next]').onclick=()=>{i=Math.min(lab.steps.length-1,i+1);draw();};host.querySelector('[data-restart]').onclick=()=>{i=0;draw();};draw();return;
 }
 if(id==='terminal'||id==='ttl'||id==='types'){terminalLab(host,id);return;}
 if(id==='cluster'){host.innerHTML=frame('实验 · key 如何落到哈希槽','输入真实 key，通过 CRC16/XMODEM 计算槽号；支持 UTF-8 与 hash tag。节点区间是教学用配置。','<div class="lab-controls"><label>Key <input data-key value="order:{42}:status"></label><button data-example>对比同 tag 的 key</button></div><div class="scene"></div>');const input=host.querySelector('[data-key]');const draw=()=>{const k=input.value,s=keySlot(k),n=s<5461?1:s<10923?2:3;host.querySelector('.scene').innerHTML=nodes(node('Key',k),node('槽号',s,'focus'),node('主节点',`M${n}`,'good'))+'<p class="state-line">M1: 0–5460 · M2: 5461–10922 · M3: 10923–16383<br>另一个 key order:{42}:amount → 槽 '+keySlot('order:{42}:amount')+'</p>';};input.oninput=draw;host.querySelector('[data-example]').onclick=()=>{input.value=input.value.endsWith('status')?'order:{42}:amount':'order:{42}:status';draw();};draw();return;}
 if(id==='ranking'){let scores={Alice:90,Bob:75,Carol:90};host.innerHTML=frame('实验 · 更新积分并观察排名','显示降序榜：同分时也按 member 字节序反向排列。排名从 0 开始。','<div class="lab-controls"><label>成员 <select data-member><option>Alice</option><option>Bob</option><option>Carol</option></select></label><button data-plus>积分 +10</button><button data-reset>重置</button></div><div class="scene"></div>');const draw=()=>{host.querySelector('.scene').innerHTML=Object.entries(scores).sort((a,b)=>b[1]-a[1]||byteCompare(b[0],a[0])).map(([m,s],i)=>`<div class="rank-row"><span>#${i}</span><b>${m}</b><div class="rank-bar" style="width:${Math.max(4,s/Math.max(...Object.values(scores))*100)}%"></div><span>${s}</span></div>`).join('');};host.querySelector('[data-plus]').onclick=()=>{scores[host.querySelector('select').value]+=10;draw();};host.querySelector('[data-reset]').onclick=()=>{scores={Alice:90,Bob:75,Carol:90};draw();};draw();return;}
 if(id==='bitmap'){let bits=Array(16).fill(0);host.innerHTML=frame('实验 · Bitmap 签到','点击 offset 0–15 切换 bit，观察 BITCOUNT。这只是一个 16 位示意，不是完整字符串存储。','<div class="scene"><div class="bits"></div><p class="state-line" aria-live="polite"></p></div>');const draw=()=>{host.querySelector('.bits').innerHTML=bits.map((v,i)=>`<button class="bit ${v?'on':''}" data-bit="${i}" aria-label="offset ${i}，值 ${v}" aria-pressed="${!!v}"><small>${i}</small><br>${v}</button>`).join('');host.querySelector('.state-line').textContent=`BITCOUNT = ${bits.reduce((a,b)=>a+b,0)} · 16 bits = 2 bytes（不含对象开销）`;host.querySelectorAll('[data-bit]').forEach(b=>b.onclick=()=>{bits[Number(b.dataset.bit)]^=1;draw();});};draw();return;}
 if(id==='pipeline'){host.innerHTML=frame('实验 · 网络 RTT 的成本','理想化单连接串行模型，忽略带宽、排队与回复大小。Pipeline 不保证原子性。','<div class="lab-controls"><label>命令数 <input data-n type="number" value="100" min="1" max="10000"></label><label>RTT (ms) <input data-rtt type="number" value="5" min="0" max="1000"></label></div><div class="scene"></div>');const draw=()=>{const n=Number(host.querySelector('[data-n]').value),r=Number(host.querySelector('[data-rtt]').value);if(!Number.isFinite(n)||!Number.isInteger(n)||n<1||n>10000||!Number.isFinite(r)||r<0||r>1000){host.querySelector('.scene').textContent='请输入 1–10000 的整数命令数与 0–1000 ms RTT。';return;}const process=n*.02;host.querySelector('.scene').innerHTML=nodes(node('逐条请求',`${(n*r+process).toFixed(2)} ms`),node('一批 Pipeline',`${(r+process).toFixed(2)} ms`,'good'))+'<p class="state-line">公式：逐条 N × RTT + N × 0.02；一批 RTT + N × 0.02<br>0.02 ms/命令为假设值；这不是实测 benchmark。</p>';};host.querySelectorAll('input').forEach(x=>x.oninput=draw);draw();return;}
 if(id==='eviction'){let order=['A','B','C'],hits={A:8,B:2,C:1};host.innerHTML=frame('实验 · LRU 与 LFU 的直觉','三格缓存。此处用精确排序建立直觉；真实 Redis 是近似采样且 LFU 有衰减。','<div class="lab-controls"><label>策略 <select data-policy><option>LRU</option><option>LFU</option></select></label><button data-access="A">访问 A</button><button data-access="B">访问 B</button><button data-access="C">访问 C</button><button data-insert>插入 D</button><button data-reset>重置</button></div><div class="scene"></div><p class="step-description" aria-live="polite"></p>');const draw=()=>{host.querySelector('.scene').innerHTML=nodes(...order.map((k,i)=>node(k,`位置 ${i} / 次数 ${hits[k]}`)))+'<p class="state-line">从左到右：最久未访问 → 最近访问；容量=3</p>';};host.querySelectorAll('[data-access]').forEach(b=>b.onclick=()=>{const k=b.dataset.access;if(!order.includes(k)){host.querySelector('.step-description').textContent=k+' 已被淘汰，先重置实验。';return;}hits[k]++;order=order.filter(x=>x!==k).concat(k);host.querySelector('.step-description').textContent=`访问 ${k}，更新最近位置与频次。`;draw();});host.querySelector('[data-insert]').onclick=()=>{if(order.includes('D'))return;const policy=host.querySelector('select').value;const victim=policy==='LRU'?order[0]:order.reduce((a,b)=>hits[a]<=hits[b]?a:b);order=order.filter(x=>x!==victim).concat('D');hits.D=1;host.querySelector('.step-description').textContent=`${policy} 淘汰 ${victim}，插入 D。`;draw();};host.querySelector('[data-reset]').onclick=()=>{order=['A','B','C'];hits={A:8,B:2,C:1};host.querySelector('.step-description').textContent='初始最近位置与频次已恢复。';draw();};draw();return;}
 if(id==='stock'){let stock=5;host.innerHTML=frame('实验 · 先验证，再扣减','顺序演示库存脚本的分支；浏览器不模拟并发或数据库订单事务。','<div class="lab-controls"><label>数量 <input type="number" min="1" max="100" value="2"></label><button data-buy class="primary">执行库存脚本</button><button data-reset>重置库存</button></div><div class="scene"></div><p class="step-description" aria-live="polite"></p>');const draw=()=>{host.querySelector('.scene').innerHTML=nodes(node('库存',stock,stock?'good':'bad'),node('分支','参数检查 → 库存检查 → DECRBY'));};host.querySelector('[data-buy]').onclick=()=>{const n=Number(host.querySelector('input').value);let msg;if(!Number.isSafeInteger(n)||n<=0)msg='invalid amount：数量需为正整数，库存不变。';else if(stock<n)msg='返回 -1：库存不足，库存不变。';else{stock-=n;msg='扣减成功，返回剩余库存 '+stock+'；订单数据库还需另行落地。';}host.querySelector('.step-description').textContent=msg;draw();};host.querySelector('[data-reset]').onclick=()=>{stock=5;host.querySelector('.step-description').textContent='库存重置为 5。';draw();};draw();return;}
 host.innerHTML='';
}
function terminalLab(host,id){const sim=new RedisSim();const history=[];let hi=0;
 const presets={string:['SET views 0','INCR views','GET views'],hash:['HSET user:42 name Mu age 20','HGETALL user:42'],list:['RPUSH jobs A B C','LPOP jobs','LRANGE jobs 0 -1'],set:['SADD likes:42 u1 u2 u2','SMEMBERS likes:42'],zset:['ZADD rank 90 Alice 75 Bob 90 Carol','ZRANGE rank 0 -1 REV WITHSCORES'],ttl:['SET session:42 token EX 20','TTL session:42']};
 host.innerHTML=frame(id==='ttl'?'实验 · 生命周期与模拟时钟':id==='types'?'实验 · 命令与数据结构':'命令工作台 · 浏览器模拟器','支持 24 个常用命令的基础子集；不连接服务器。SET/LRANGE/ZRANGE 支持范围以 HELP 为准，完整参数请用本地 redis-cli。',`<div class="lab-controls"><label>示例 <select data-preset>${Object.keys(presets).map(x=>`<option ${id==='ttl'&&x==='ttl'?'selected':''}>${x}</option>`).join('')}</select></label><button data-load>运行示例</button><button data-time>推进 10 秒</button><button data-reset>清空模拟数据</button></div><div class="terminal-output" role="log" aria-live="polite" aria-label="模拟命令输出"></div><form class="terminal-input"><input autocomplete="off" spellcheck="false" aria-label="Redis 模拟命令" placeholder='SET greeting "hello redis" EX 60'><button type="submit">执行 ↵</button></form><div class="key-grid" aria-label="内存数据视图"></div>`);
 const out=host.querySelector('.terminal-output'),input=host.querySelector('.terminal-input input');out.textContent='Redis LAB · 仅内存命令子集\n输入 HELP 查看命令；时间仅通过按钮推进。\n';
 const draw=()=>{sim.expire();host.querySelector('.key-grid').innerHTML=[...sim.data].map(([k,x])=>{let value=x.value instanceof Map?JSON.stringify([...x.value]):x.value instanceof Set?JSON.stringify([...x.value]):JSON.stringify(x.value);return `<div class="key-card"><code>${esc(k)}</code>${esc(x.type)} · ${esc(value)}<br>TTL ${x.until===null?'无':Math.round((x.until-sim.time)/1000)+'s'}</div>`;}).join('')||'<span class="empty">当前没有 key。</span>';};
 const run=cmd=>{out.textContent+='\nredis> '+cmd+'\n'+sim.run(cmd)+'\n';if(out.textContent.length>20000)out.textContent=out.textContent.slice(-15000);out.scrollTop=out.scrollHeight;draw();};
 host.querySelector('form').onsubmit=e=>{e.preventDefault();const cmd=input.value.trim();if(!cmd)return;history.push(cmd);hi=history.length;run(cmd);input.value='';};input.onkeydown=e=>{if(e.key==='ArrowUp'){e.preventDefault();hi=Math.max(0,hi-1);input.value=history[hi]||'';}if(e.key==='ArrowDown'){e.preventDefault();hi=Math.min(history.length,hi+1);input.value=history[hi]||'';}};
 host.querySelector('[data-load]').onclick=()=>presets[host.querySelector('select').value].forEach(run);host.querySelector('[data-time]').onclick=()=>{sim.advance(10);out.textContent+=`\n[模拟时间 t=${sim.time/1000}s]\n`;draw();};host.querySelector('[data-reset]').onclick=()=>run('RESET');draw();
}
