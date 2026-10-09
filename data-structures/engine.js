/* Pure, deterministic teaching traces. Every frame owns a copy of its state. */
(function(root){
 'use strict';
 function parse(text){const parts=text.split(',').map(x=>x.trim());if(!text.trim())return [];if(parts.length>12||parts.some(x=>!/^[-+]?\d+$/.test(x)||Math.abs(Number(x))>99))throw Error('请输入最多 12 个 -99 到 99 的整数，用英文逗号分隔。');return parts.map(Number);}
 function trace(topic,values,op,target){
  if(!Array.isArray(values)||values.length>12||values.some(x=>!Number.isInteger(x)||Math.abs(x)>99)||!Number.isInteger(target)||Math.abs(target)>99)throw Error('数据与目标必须是 -99 到 99 的整数，最多 12 个。');
  let a=[...values],frames=[];const add=(message,hot=[],done=[],extra={})=>frames.push({values:[...a],message,hot:[...hot],done:[...done],...extra});
  add('初始状态：先观察数据的排列方式。');
  if(topic==='array'||topic==='list'){
   if(op==='insert'){const pos=Math.floor(a.length/2);if(a.length===12)throw Error('插入前请减少到 11 个元素以内。');if(topic==='array'){a.push(null);for(let i=a.length-1;i>pos;i--){a[i]=a[i-1];add(`把索引 ${i-1} 的元素右移到 ${i}。`,[i-1,i]);}a[pos]=target;add(`在索引 ${pos} 写入 ${target}。`,[pos]);}else{for(let i=0;i<pos;i++)add(`沿 next 指针寻找插入位置：当前第 ${i} 个结点。`,[i]);a.splice(pos,0,target);add(`找到前驱后连接新结点 ${target}；指针修改是 O(1)，寻找前驱仍是 O(n)。`,[pos]);}}
   else{let found=false;for(let i=0;i<a.length;i++){add(`比较 ${a[i]} 与目标 ${target}。`,[i]);if(a[i]===target){if(op==='delete'){a.splice(i,1);add(topic==='array'?'删除首次匹配项；其后元素左移填补空位。':'删除首次匹配结点，将前驱的 next 连接到后继。',[],[],{result:i});}else add(`首次找到目标，位置为 ${i}。`,[],[i],{result:i});found=true;break;}}if(!found)add('没有找到目标；结构保持不变。',[],[],{result:-1});}
  }else if(topic==='stack'||topic==='queue'){
   if(op==='insert'){if(a.length===12)throw Error('演示最多容纳 12 个元素。');a.push(target);add(topic==='stack'?`压栈 ${target}：只在栈顶添加。`:`入队 ${target}：添加到队尾。`,[a.length-1]);}else if(!a.length)add('结构为空，不能移除；这不是返回数值 0。');else{let value=topic==='stack'?a.pop():a.shift();add(`${topic==='stack'?'出栈':'出队'}元素 ${value}。`,[],[],{removed:value});}
  }else if(topic==='hash'){
   a=[];frames=[];let buckets=Array.from({length:7},()=>[]);const bucket=x=>((x%7)+7)%7;
   const snap=(message,hot)=>add(message,[],[],{buckets:buckets.map(b=>[...b]),bucket:hot});
   snap('七个空桶：先计算哈希，再定位链。',-1);
   for(const x of values){let b=bucket(x);if(!buckets[b].includes(x))buckets[b].push(x);snap(`h(${x}) = ${b}，放进桶 ${b}；冲突用链式存储。`,b);}
   let b=bucket(target);snap(`目标 ${target} 先定位桶 ${b}，再比较桶中的键。`,b);let idx=buckets[b].indexOf(target);if(op==='insert'){if(idx<0)buckets[b].push(target);snap(idx<0?'插入新键。':'键已存在；本实验按集合语义不重复插入。',b);}else if(op==='delete'){if(idx>=0)buckets[b].splice(idx,1);snap(idx>=0?'移除匹配键。':'没有这个键，桶不变。',b);}else snap(idx>=0?'找到目标键。':'目标键不存在。',b);
  }else if(topic==='tree'){
   a=[];frames=[];let nodes=[];function snap(message,hot=[],done=[]){add(message,hot,done,{nodes:nodes.map(n=>({...n}))});}
   for(const value of values){if(!nodes.length){nodes.push({value,left:null,right:null});continue;}let i=0;while(true){if(value===nodes[i].value)break;let key=value<nodes[i].value?'left':'right';if(nodes[i][key]===null){nodes[i][key]=nodes.length;nodes.push({value,left:null,right:null});break;}i=nodes[i][key];}}
   snap('按输入顺序建立二叉搜索树；重复值忽略。');
   if(op==='search'){let i=nodes.length?0:null;while(i!==null){snap(`目标 ${target} 与 ${nodes[i].value} 比较；小走左，大走右。`,[i]);if(target===nodes[i].value){snap('找到目标。',[],[i]);break;}i=nodes[i][target<nodes[i].value?'left':'right'];}if(i===null)snap('到达空指针：目标不存在。');}
   else{let order=[];function walk(i){if(i===null)return;walk(nodes[i].left);order.push(i);snap(`中序访问 ${nodes[i].value}：左子树 → 根 → 右子树。`,[i],order);walk(nodes[i].right);}if(nodes.length)walk(0);snap('中序遍历得到有序序列。',[],order);}
  }else if(topic==='heap'){
   const down=(start,end)=>{let p=start;while(2*p+1<end){let c=2*p+1;if(c+1<end&&a[c+1]>a[c])c++;add('选择较大的孩子，与父结点比较。',[p,c]);if(a[p]>=a[c])break;[a[p],a[c]]=[a[c],a[p]];add('交换并继续下沉，恢复大顶堆性质。',[p,c]);p=c;}};
   for(let i=Math.floor(a.length/2)-1;i>=0;i--)down(i,a.length);add('建堆完成：每个父结点不小于孩子，但整个数组不一定有序。');
   if(op==='insert'){if(a.length===12)throw Error('演示最多 12 个元素。');a.push(target);let i=a.length-1;add('新元素放到末尾，再上浮。',[i]);while(i>0){let p=Math.floor((i-1)/2);if(a[p]>=a[i])break;[a[p],a[i]]=[a[i],a[p]];add('孩子比父结点大，交换。',[i,p]);i=p;}}
   else if(a.length){const removed=a[0],last=a.pop();if(a.length){a[0]=last;add(`取出最大值 ${removed}，末尾元素替代根。`,[0]);down(0,a.length);}add(`移除完成，取出的最大值是 ${removed}。`,[],[],{removed});}else add('空堆，没有最大值可取。');
  }else if(topic==='graph'){
   a=[0,1,2,3,4,5];const edges=[[0,1],[0,2],[1,3],[2,3],[2,4],[4,5]],adj=a.map(()=>[]);for(const [u,v]of edges){adj[u].push(v);adj[v].push(u);}frames=[];let seen=new Set(),order=[];const snap=(message,hot=[],frontier=[])=>add(message,hot,order,{edges,frontier:[...frontier]});
   const start=((target%6)+6)%6;snap(`固定无向图；起点 ${start}。邻居按编号升序。`);
   if(op==='bfs'){let q=[start];seen.add(start);while(q.length){let u=q.shift();order.push(u);for(let v of adj[u])if(!seen.has(v)){seen.add(v);q.push(v);}snap(`访问 ${u}，未发现的邻居入队；在入队时标记，避免重复。`,[u],q);}}
   else{function dfs(u){seen.add(u);order.push(u);snap(`进入 ${u}，递归探索未访问的邻居。`,[u]);for(let v of adj[u])if(!seen.has(v))dfs(v);snap(`离开 ${u}，回溯到上一层。`,[u]);}dfs(start);}snap(`遍历完成：${order.join(' → ')}。`);
  }else if(topic==='sort'){
   let sorted=[];if(op==='bubble'){for(let end=a.length-1;end>0;end--){let swapped=false;for(let i=0;i<end;i++){add('比较相邻元素；左边较大才交换。',[i,i+1],sorted);if(a[i]>a[i+1]){[a[i],a[i+1]]=[a[i+1],a[i]];swapped=true;add('交换：较大元素向右冒泡。',[i,i+1],sorted);}}sorted.push(end);if(!swapped)break;}}
   else{for(let i=1;i<a.length;i++){let key=a[i],j=i-1;add(`取出待插入值 ${key}，左侧前缀已有序。`,[i],[],{held:key});while(j>=0&&a[j]>key){a[j+1]=a[j];add(`将 ${a[j]} 右移，为 ${key} 留出位置。`,[j,j+1],[],{held:key});j--;}a[j+1]=key;add(`把 ${key} 放进索引 ${j+1}。`,[j+1]);}}
   add('排序完成，结果为非递减序列。',[],a.map((_,i)=>i));
  }else if(topic==='search'){
   a.sort((x,y)=>x-y);add('二分必须使用有序数据：先排序作为准备（排序成本不属于查找的 O(log n)）。');let l=0,r=a.length-1,found=false;while(l<=r){let m=Math.floor((l+r)/2);add(`搜索区间 [${l}, ${r}]，中点 ${m}，比较 ${a[m]} 与 ${target}。`,[m],[],{range:[l,r]});if(a[m]===target){add(`找到一个匹配，排序后索引为 ${m}；不保证是第一个重复值。`,[],[m],{result:m});found=true;break;}if(a[m]<target)l=m+1;else r=m-1;}if(!found)add('搜索区间为空，目标不存在。',[],[],{result:-1,range:[l,r]});
  }else throw Error('未知实验');
  return frames;
 }
 const api={parse,trace};if(typeof module!=='undefined')module.exports=api;else root.DSEngine=api;
})(typeof globalThis!=='undefined'?globalThis:this);
