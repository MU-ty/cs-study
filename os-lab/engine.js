(function(root){'use strict';
const integer=(value,min,max,name)=>{if(!/^-?\d+$/.test(String(value))||Number(value)<min||Number(value)>max)throw Error(`${name}必须是 ${min}–${max} 的整数。`);return Number(value);};
function sequence(text,min,max){const parts=text.split(',').map(x=>x.trim());if(!text.trim()||parts.length>20)throw Error('请输入 1–20 个逗号分隔的整数。');return parts.map(x=>integer(x,min,max,'序列元素'));}
function run(id,input,mode,param){const frames=[];const add=(message,items=[],extra={})=>frames.push({message,items:items.map(x=>({...x})),...JSON.parse(JSON.stringify(extra))});
if(id==='schedule'){
 const parts=input.split(',').map(x=>x.trim());if(!input.trim()||parts.length>6)throw Error('请输入 1–6 个进程，格式：到达时刻:运行时间。');
 const jobs=parts.map((s,i)=>{const p=s.split(':');if(p.length!==2)throw Error('格式应为 0:5,1:3,2:1。');const arrival=integer(p[0],0,20,'到达时刻'),burst=integer(p[1],1,10,'运行时间');return {name:'P'+(i+1),arrival,burst,remaining:burst,finish:null,first:null};});
 const quantum=integer(param,1,10,'时间片');let time=0,timeline=[],q=[],arrived=new Set();
 const enqueue=()=>jobs.map((j,i)=>({j,i})).filter(({j,i})=>j.arrival<=time&&!arrived.has(i)).sort((a,b)=>a.j.arrival-b.j.arrival||a.i-b.i).forEach(({i})=>{q.push(i);arrived.add(i);});
 const snap=message=>add(message,jobs.map((j,i)=>({label:j.name,value:`剩余 ${j.remaining}`,kind:j.remaining===0?'done':q.includes(i)?'ready':'',detail:`到达 ${j.arrival} · CPU ${j.burst}`})),{timeline,time,queue:q.map(i=>jobs[i].name)});
 snap('单 CPU、仅 CPU burst 模型；无 I/O、无上下文切换开销。');enqueue();
 while(jobs.some(j=>j.remaining)){
  if(!q.length){const next=Math.min(...jobs.filter((_,i)=>!arrived.has(i)).map(j=>j.arrival));timeline.push({name:'空闲',start:time,end:next});time=next;enqueue();snap(`CPU 空闲到 ${time}，新进程到达。`);continue;}
  if(mode==='sjf')q.sort((a,b)=>jobs[a].burst-jobs[b].burst||jobs[a].arrival-jobs[b].arrival||a-b);
  let i=q.shift(),j=jobs[i],start=time;if(j.first===null)j.first=time;const duration=mode==='rr'?Math.min(quantum,j.remaining):j.remaining;
  time+=duration;j.remaining-=duration;timeline.push({name:j.name,start,end:time});enqueue();if(j.remaining===0)j.finish=time;else q.push(i);
  snap(`${j.name} 执行 [${start}, ${time})；${j.remaining===0?'完成':`时间片结束，剩余 ${j.remaining}，回到队尾`}。同一边界时刻到达者先入队。`);
 }
 const metrics=jobs.map(j=>({name:j.name,arrival:j.arrival,burst:j.burst,finish:j.finish,turnaround:j.finish-j.arrival,waiting:j.finish-j.arrival-j.burst,response:j.first-j.arrival}));
 add('全部完成：周转=完成−到达；等待=周转−CPU时间；响应=首次运行−到达。',[],{timeline,time,metrics});
}else if(id==='process'){
 const names=['新建','就绪','运行','阻塞','终止'];const snap=(state,message)=>add(message,names.map(label=>({label,value:label===state?'当前状态':'',kind:label===state?'hot':''})),{path:mode==='io'?['新建','就绪','运行','阻塞','就绪','运行','终止']:['新建','就绪','运行','就绪','运行','终止']});
 snap('新建','创建进程，建立 PCB。');snap('就绪','资源准备好，进入就绪队列，等待 CPU。');snap('运行','调度器分派 CPU：就绪 → 运行。');if(mode==='io'){snap('阻塞','发出阻塞式 I/O，等待设备事件；CPU 可调度其他进程。');snap('就绪','I/O 完成后进入就绪，不会自动直接回到运行。');}else snap('就绪','时间片到或被抢占：运行 → 就绪，而不是阻塞。');snap('运行','再次获得 CPU。');snap('终止','任务结束，回收资源。');
}else if(id==='buffer'){
 const capacity=integer(param,1,6,'缓冲区容量');const ops=input.toUpperCase().split(',').map(x=>x.trim());if(!input.trim()||ops.length>20||ops.some(x=>!['P','C'].includes(x)))throw Error('请输入最多 20 个 P/C 操作，P=生产，C=消费。');let buffer=[],next=1,blockedP=false,blockedC=false;
 const snap=message=>add(message,Array.from({length:capacity},(_,i)=>({label:'槽 '+i,value:buffer[i]===undefined?'空':buffer[i],kind:buffer[i]===undefined?'':'ready'})),{semaphores:{empty:capacity-buffer.length,full:buffer.length,mutex:1},blocked:{producer:blockedP,consumer:blockedC}});
 snap('初始：empty=容量，full=0，mutex=1。每次显示一个原子化的完整生产/消费操作。');
 for(const op of ops){if(op==='P'){if(blockedP){snap('生产者已在等待：不能再次发起操作；先让消费者取走元素。');continue;}if(buffer.length===capacity){blockedP=true;snap('P(empty) 不能通过：生产者等待。尚未获取 mutex，因此不会持锁等待空槽。');}else{buffer.push(next++);snap('P(empty) → P(mutex) → 放入 → V(mutex) → V(full)。');if(blockedC){buffer.shift();blockedC=false;snap('唤醒先前等待的消费者：完成它的消费操作。');}}}else{if(blockedC){snap('消费者已在等待：不能再次发起操作；先让生产者加入元素。');continue;}if(!buffer.length){blockedC=true;snap('P(full) 不能通过：消费者等待。尚未获取 mutex。');}else{buffer.shift();snap('P(full) → P(mutex) → 取出 → V(mutex) → V(empty)。');if(blockedP){buffer.push(next++);blockedP=false;snap('唤醒先前等待的生产者：完成它的生产操作。');}}}}
}else if(id==='deadlock'){
 const snap=(message,owners,waiting,cycle=false)=>add(message,[{label:'资源 A',value:owners[0]||'空闲',kind:owners[0]?'ready':''},{label:'资源 B',value:owners[1]||'空闲',kind:owners[1]?'ready':''}],{waiting,cycle});
 snap('两个进程、两种单实例、不可抢占的互斥资源。',[null,null],[]);snap('P1 获取 A。',['P1',null],[]);
 if(mode==='cycle'){snap('P2 获取 B。',['P1','P2'],[]);snap('P1 请求 B，但 B 被 P2 占用。',['P1','P2'],['P1 → P2']);snap('P2 请求 A：P1 等 P2，P2 等 P1，形成死锁。',['P1','P2'],['P1 → P2','P2 → P1'],true);}
 else{snap('统一规定先 A 后 B。P2 请求 A，暂时等待且不持有 B。',['P1',null],['P2 → P1']);snap('P1 获取 B，执行任务。',['P1','P1'],['P2 → P1']);snap('P1 释放 A、B；P2 被唤醒。',[null,null],[]);snap('P2 按 A→B 获取两个资源，继续执行。',['P2','P2'],[]);snap('P2 完成并释放资源。',[null,null],[]);}
}else if(id==='paging'){
 const refs=sequence(input,0,99),count=integer(param,1,6,'页框数');let memory=[],age=[],lastUse=new Map(),faults=0,hits=0;
 const snap=(message,hot=-1)=>add(message,Array.from({length:count},(_,i)=>({label:'页框 '+i,value:memory[i]??'空',kind:i===hot?'hot':''})),{faults,hits,order:mode==='fifo'?age.map(i=>memory[i]):[...memory].sort((a,b)=>lastUse.get(a)-lastUse.get(b))});
 snap('页框为空，开始访问页面；只演示置换，忽略脏页写回与 TLB。');refs.forEach((page,t)=>{let i=memory.indexOf(page);if(i>=0){hits++;lastUse.set(page,t);snap(`访问 ${page}：命中。${mode==='fifo'?'FIFO 入内存顺序不因命中改变。':'更新最近使用时刻。'}`,i);}else{faults++;if(memory.length<count){i=memory.length;memory.push(page);age.push(i);}else{i=mode==='fifo'?age.shift():memory.reduce((best,v,k)=>lastUse.get(v)<lastUse.get(memory[best])?k:best,0);let old=memory[i];memory[i]=page;if(mode==='fifo')age.push(i);lastUse.delete(old);}lastUse.set(page,t);snap(`访问 ${page}：缺页，将它装入页框 ${i}。`,i);}});
 snap(`访问完成：缺页 ${faults} 次，命中 ${hits} 次，缺页率 ${(faults/refs.length*100).toFixed(1)}%。`);
}else if(id==='address'){
 const address=integer(input,0,65535,'虚拟地址'),pageSize=integer(param,16,4096,'页大小');if((pageSize&(pageSize-1))!==0)throw Error('页大小必须是 2 的幂。');const page=Math.floor(address/pageSize),offset=address%pageSize,table=[2,5,null,1];
 add(`虚拟地址 ${address}，页大小 ${pageSize} 字节。`,[{label:'虚拟地址',value:address},{label:'页大小',value:pageSize}]);add(`页号=${address} ÷ ${pageSize} 向下取整=${page}；页内偏移=${offset}。`,[{label:'虚拟页号',value:page,kind:'hot'},{label:'偏移',value:offset}],{table});
 if(page>=table.length)add('页号超出该进程的四页虚拟地址空间：非法地址，不是可以装入的合法缺页。',[],{table,result:'invalid'});else if(table[page]===null)add('虚拟页 2 合法但不在内存：触发缺页，OS 装入后再重试。这里不自动模拟装入。',[],{table,result:'fault'});else add(`页表得到页框 ${table[page]}：物理地址=${table[page]}×${pageSize}+${offset}=${table[page]*pageSize+offset}。`,[{label:'物理页框',value:table[page],kind:'ready'},{label:'物理地址',value:table[page]*pageSize+offset}],{table,result:table[page]*pageSize+offset});
}else if(id==='disk'){
 let pending=sequence(input,0,199),head=integer(param,0,199,'磁头初始位置'),total=0,path=[head];const snap=message=>add(message,pending.map((v,i)=>({label:'请求 '+i,value:v})),{head,total,path});snap('教学机械磁盘，磁道 0–199；所有请求在起始时刻已到达。');
 if(mode==='look')pending=[...pending.filter(x=>x>=head).sort((a,b)=>a-b),...pending.filter(x=>x<head).sort((a,b)=>b-a)];
 while(pending.length){let i=0;if(mode==='sstf')pending.forEach((v,k)=>{if(Math.abs(v-head)<Math.abs(pending[i]-head))i=k;});const next=pending.splice(i,1)[0],distance=Math.abs(next-head);head=next;total+=distance;path.push(head);snap(`服务磁道 ${head}，移动 ${distance}，累计 ${total}。`);}snap('所有请求完成。LOOK 只走到最后一个请求，不强制走到磁盘端点。');
}else if(id==='file'){
 const logical=integer(input,0,7,'逻辑块号');const physical=mode==='contiguous'?[20,21,22,23]:[20,7,31,12];add('教学文件固定包含 4 个块；展示文件逻辑块到磁盘物理块的映射。',physical.map((v,i)=>({label:'逻辑块 '+i,value:'磁盘块 '+v})),{mode});if(logical>=4)add('逻辑块号超过文件长度：不能读取。',[],{result:'invalid',mode});else{if(mode==='indexed')add('先读取索引块：索引表保存每个逻辑块对应的磁盘块号。',physical.map((v,i)=>({label:'索引项 '+i,value:v,kind:i===logical?'hot':''})),{mode});add(mode==='contiguous'?`起始块 20 + 逻辑块 ${logical} = 物理块 ${20+logical}。`:`索引表第 ${logical} 项 → 物理块 ${physical[logical]}。`,[{label:'读取磁盘块',value:physical[logical],kind:'ready'}],{mode,result:physical[logical]});}
}else throw Error('未知实验');return frames;
}
const api={run,sequence};if(typeof module!=='undefined')module.exports=api;else root.OSEngine=api;
})(typeof globalThis!=='undefined'?globalThis:this);
