'use strict';
// Pure algorithms shared by the UI and the meaningful boundary tests.
(function(root){
function divide(bits,polynomial){
 if(!/^[01]{1,64}$/.test(bits)||!/^1[01]{0,15}1$/.test(polynomial))throw Error('数据须为 1–64 位二进制；生成多项式须为 2–17 位，首尾都为 1。');
 const a=bits.split('').map(Number),g=polynomial.split('').map(Number),steps=[];
 for(let i=0;i<=a.length-g.length;i++){if(a[i]){const before=a.join('');for(let j=0;j<g.length;j++)a[i+j]^=g[j];steps.push({i,before,after:a.join('')});}}
 return {remainder:a.slice(-(g.length-1)).join('').padStart(g.length-1,'0'),steps};
}
function crc(data,g){if(!/^[01]{1,40}$/.test(data))throw Error('请输入 1–40 位二进制数据。');if(!/^1[01]{0,15}1$/.test(g))throw Error('生成多项式须为 2–17 位二进制，首尾都为 1。');const r=divide(data+'0'.repeat(g.length-1),g);return {...r,codeword:data+r.remainder};}
function subnet(ip,prefix){
 const p=Number(prefix),parts=ip.split('.');if(parts.length!==4||parts.some(x=>!/^\d{1,3}$/.test(x)||Number(x)>255)||!Number.isInteger(p)||p<0||p>32)throw Error('请输入合法 IPv4 地址和 0–32 的前缀。');
 const value=parts.reduce((n,x)=>n*256+Number(x),0),size=2**(32-p),network=Math.floor(value/size)*size,last=network+size-1;
 const format=n=>[24,16,8,0].map(b=>Math.floor(n/2**b)%256).join('.');
 return {prefix:p,network:format(network),last:format(last),mask:format(2**32-size),hosts:p===32?1:p===31?2:size-2,first:format(p>=31?network:network+1),end:format(p>=31?last:last-1),binary:value.toString(2).padStart(32,'0')};
}
function ipv6(text){
 if(!/^[0-9a-f:]+$/i.test(text)||text.split('::').length>2)throw Error('请输入仅含十六进制组的 IPv6 地址；最多一个 ::。');
 let groups;
 if(text.includes('::')){const [l,r]=text.split('::').map(x=>x?x.split(':'):[]);if(l.length+r.length>=8)throw Error(':: 必须省略至少一组零。');groups=[...l,...Array(8-l.length-r.length).fill('0'),...r];}else groups=text.split(':');
 if(groups.length!==8||groups.some(g=>!/^[0-9a-f]{1,4}$/i.test(g)))throw Error('展开后必须是 8 组，每组 1–4 个十六进制数字。');
 groups=groups.map(x=>parseInt(x,16).toString(16));let best=-1,len=0;
 for(let i=0;i<8;){if(groups[i]!=='0'){i++;continue;}let j=i;while(j<8&&groups[j]==='0')j++;if(j-i>len&&j-i>=2){best=i;len=j-i;}i=j;}
 const compressed=best<0?groups.join(':'):groups.slice(0,best).join(':')+'::'+groups.slice(best+len).join(':');
 return {groups,expanded:groups.map(g=>g.padStart(4,'0')).join(':'),compressed,best,len};
}
const EDGES=[[0,1,4],[0,2,1],[2,1,2],[2,3,5],[1,3,1]];
function dijkstra(edges=EDGES,n=4,source=0){const dist=Array(n).fill(Infinity),prev=Array(n).fill(null),visited=Array(n).fill(false),states=[];dist[source]=0;states.push({dist:[...dist],prev:[...prev],visited:[...visited],node:null,text:'初始化：A=0，其余节点为 ∞。'});for(let k=0;k<n;k++){let u=-1;for(let i=0;i<n;i++)if(!visited[i]&&(u<0||dist[i]<dist[u]))u=i;if(u<0||!Number.isFinite(dist[u]))break;visited[u]=true;const updates=[];for(const [a,b,w]of edges){const v=a===u?b:b===u?a:-1;if(v>=0&&!visited[v]&&dist[u]+w<dist[v]){dist[v]=dist[u]+w;prev[v]=u;updates.push(`${String.fromCharCode(65+v)}=${dist[v]}`);}}states.push({dist:[...dist],prev:[...prev],visited:[...visited],node:u,text:`确定 ${String.fromCharCode(65+u)}，距离 ${dist[u]}。${updates.length?'更新：'+updates.join('，'):'没有更短的路径。'}`});}return states;}
const api={divide,crc,subnet,ipv6,dijkstra,EDGES};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.NetEngine=api;
})(typeof globalThis!=='undefined'?globalThis:this);
