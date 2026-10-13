// Deterministic teaching models: never parse/evaluate arbitrary Java code.
function narrowSigned(value,bits){const x=BigInt(value),n=BigInt(bits),mod=1n<<n;let v=((x%mod)+mod)%mod;if(v>=(mod>>1n))v-=mod;return v.toString();}
function javaStringHash(text){let hash=0;for(let i=0;i<text.length;i++)hash=(Math.imul(hash,31)+text.charCodeAt(i))|0;return hash;}
function hashBucket(text,capacity){if(capacity<1||(capacity&(capacity-1)))throw Error('capacity must be power of two');const h=javaStringHash(text),spread=(h^(h>>>16))|0;return spread&(capacity-1);}
class HashTableModel{
 constructor(){this.capacity=4;this.entries=new Map();}
 put(key,value){const previous=this.entries.get(key);this.entries.set(key,value);const resized=this.entries.size>this.capacity*.75;if(resized)this.capacity*=2;return{previous,resized};}
 buckets(){const rows=Array.from({length:this.capacity},()=>[]);for(const [key,value]of this.entries)rows[hashBucket(key,this.capacity)].push({key,value});return rows;}
}
function integerList(text,{min=-10000,max=10000}={}){if(text.trim()==='')return [];const tokens=text.split(',').map(x=>x.trim());if(tokens.some(x=>!/^[-+]?\d+$/.test(x)||!Number.isSafeInteger(Number(x))||Number(x)<min||Number(x)>max))throw Error(`请输入 ${min}..${max} 的整数，用逗号分隔。`);if(tokens.length>20)throw Error('最多 20 个元素。');return tokens.map(Number);}
function streamStages(values,threshold=60,delta=5){const filtered=values.filter(x=>x>=threshold),mapped=filtered.map(x=>x+delta),unique=[...new Set(mapped)],sorted=[...unique].sort((a,b)=>a-b);return[values.slice(),filtered,mapped,unique,sorted];}
class PoolModel{
 constructor(){this.running=[];this.waiting=[];this.completed=[];this.serial=0;this.closed=false;}
 submit(){if(this.closed)return {accepted:false,reason:'已 shutdown，拒绝新任务'};const id=++this.serial;if(this.running.length<2){this.running.push(id);return{accepted:true,id,where:'运行'};}if(this.waiting.length<2){this.waiting.push(id);return{accepted:true,id,where:'排队'};}return{accepted:false,id,reason:'队列已满，触发拒绝'};}
 finish(){const done=this.running.shift();if(done===undefined)return null;this.completed.push(done);if(this.waiting.length)this.running.push(this.waiting.shift());return done;}
 shutdown(){this.closed=true;}
}
class GradeBookModel{
 constructor(){this.students=new Map();}
 add(id,name,score){if(!Number.isSafeInteger(id)||id<=0||typeof name!=='string'||name.trim()===''||!Number.isInteger(score)||score<0||score>100)throw Error('ID 为正整数；姓名非空；分数为 0..100 整数。');if(this.students.has(id))throw Error('duplicate id：ID 已存在，状态不改变。');this.students.set(id,{id,name,score});}
 ranked(){return [...this.students.values()].sort((a,b)=>b.score-a.score||b.id-a.id);}
 average(){if(!this.students.size)return null;return [...this.students.values()].reduce((s,x)=>s+x.score,0)/this.students.size;}
}
if(typeof module!=='undefined')module.exports={narrowSigned,javaStringHash,hashBucket,HashTableModel,integerList,streamStages,PoolModel,GradeBookModel};
