/* Deterministic command subset. No network, persistence or concurrency simulation. */
class RedisSim {
  constructor(){this.data=new Map();this.time=0;}
  advance(seconds){if(!Number.isFinite(seconds)||seconds<0)throw Error('invalid time');this.time+=seconds*1000;this.expire();}
  expire(){for(const [k,v]of this.data)if(v.until!==null&&v.until<=this.time)this.data.delete(k);}
  get(k,type){this.expire();const x=this.data.get(k);if(x&&type&&x.type!==type)throw Error('WRONGTYPE Operation against a key holding the wrong kind of value');return x;}
  make(k,type,value){let x=this.get(k,type);if(!x){x={type,value,until:null};this.data.set(k,x);}return x;}
  int(s){if(!/^-?\d+$/.test(s))throw Error('ERR value is not an integer');const n=BigInt(s);if(n<-(1n<<63n)||n>=(1n<<63n))throw Error('ERR increment or decrement would overflow');return n;}
  run(line){try{return this.execute(line);}catch(e){return '(error) '+e.message;}}
  execute(line){const tokens=line.match(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[^\s]+/g)||[];const a=tokens.map(x=>/^['"]/.test(x)?x.slice(1,-1).replace(/\\(["'\\])/g,'$1'):x);const c=(a.shift()||'').toUpperCase();this.expire();
    const exact=n=>{if(a.length!==n)throw Error('ERR wrong number of arguments');};
    const atLeast=n=>{if(a.length<n)throw Error('ERR wrong number of arguments');};
    const arr=x=>x.length?x.map((v,i)=>`${i+1}) ${JSON.stringify(String(v))}`).join('\n'):'(empty array)';
    const k=a[0];
    if(c==='HELP')return 'PING, SET [NX|XX] [EX seconds|PX ms|KEEPTTL], GET, DEL, EXISTS, TYPE, TTL, EXPIRE, PERSIST, INCR, INCRBY, HSET, HGET, HGETALL, LPUSH, RPUSH, LPOP, LRANGE, SADD, SMEMBERS, SISMEMBER, SCARD, ZADD, ZRANGE [REV] [WITHSCORES].\n时间只通过“推进10秒”改变；RESET 可清空模拟数据。';
    if(c==='RESET'){exact(0);this.data.clear();this.time=0;return 'OK (simulator reset)';}
    if(c==='PING'){exact(0);return 'PONG';}
    if(c==='SET'){atLeast(2);let nx=false,xx=false,keep=false,until=null;for(let i=2;i<a.length;i++){const op=a[i].toUpperCase();if(op==='NX')nx=true;else if(op==='XX')xx=true;else if(op==='KEEPTTL')keep=true;else if(op==='EX'||op==='PX'){const n=a[++i];if(!n||!/^\d+$/.test(n)||Number(n)<=0||!Number.isSafeInteger(Number(n)))throw Error('ERR invalid expire time');until=this.time+Number(n)*(op==='EX'?1000:1);}else throw Error('ERR syntax error');}if(nx&&xx||keep&&until!==null)throw Error('ERR syntax error');const old=this.get(k);if(nx&&old||xx&&!old)return '(nil)';this.data.set(k,{type:'string',value:a[1],until:keep?(old?.until??null):until});return 'OK';}
    if(c==='GET'){exact(1);const x=this.get(k,'string');return x?JSON.stringify(x.value):'(nil)';}
    if(c==='DEL'){atLeast(1);return String(a.reduce((n,key)=>n+(this.data.delete(key)?1:0),0));}
    if(c==='EXISTS'){atLeast(1);return String(a.reduce((n,key)=>n+(this.data.has(key)?1:0),0));}
    if(c==='TYPE'){exact(1);return this.get(k)?.type||'none';}
    if(c==='TTL'){exact(1);const x=this.get(k);return String(!x?-2:x.until===null?-1:Math.round((x.until-this.time)/1000));}
    if(c==='EXPIRE'){exact(2);const n=Number(this.int(a[1]));if(!Number.isSafeInteger(n))throw Error('ERR integer out of range');const x=this.get(k);if(!x)return '0';if(n<=0)this.data.delete(k);else x.until=this.time+n*1000;return '1';}
    if(c==='PERSIST'){exact(1);const x=this.get(k);if(!x||x.until===null)return '0';x.until=null;return '1';}
    if(c==='INCR'||c==='INCRBY'){exact(c==='INCR'?1:2);const old=this.get(k,'string');const n=this.int(old?old.value:'0')+this.int(c==='INCR'?'1':a[1]);const s=this.int(String(n)).toString();const x=old||this.make(k,'string','0');x.value=s;return s;}
    if(c==='HSET'){atLeast(3);if(a.length%2!==1)throw Error('ERR wrong number of arguments');const x=this.make(k,'hash',new Map());let n=0;for(let i=1;i<a.length;i+=2){if(!x.value.has(a[i]))n++;x.value.set(a[i],a[i+1]);}return String(n);}
    if(c==='HGET'){exact(2);const x=this.get(k,'hash');return x?.value.has(a[1])?JSON.stringify(x.value.get(a[1])):'(nil)';}
    if(c==='HGETALL'){exact(1);return arr([...(this.get(k,'hash')?.value||[])].flat());}
    if(c==='LPUSH'||c==='RPUSH'){atLeast(2);const x=this.make(k,'list',[]);for(const v of a.slice(1))c==='LPUSH'?x.value.unshift(v):x.value.push(v);return String(x.value.length);}
    if(c==='LPOP'){exact(1);const x=this.get(k,'list');if(!x)return '(nil)';const v=x.value.shift();if(!x.value.length)this.data.delete(k);return JSON.stringify(v);}
    if(c==='LRANGE'){exact(3);const i=Number(this.int(a[1])),j=Number(this.int(a[2]));const v=this.get(k,'list')?.value||[];const start=i<0?Math.max(0,v.length+i):i,end=j<0?v.length+j:j;return arr(end<start?[]:v.slice(start,end+1));}
    if(c==='SADD'){atLeast(2);const x=this.make(k,'set',new Set());const before=x.value.size;for(const v of a.slice(1))x.value.add(v);return String(x.value.size-before);}
    if(c==='SMEMBERS'){exact(1);return arr([...(this.get(k,'set')?.value||[])]);}
    if(c==='SCARD'){exact(1);return String(this.get(k,'set')?.value.size||0);}
    if(c==='SISMEMBER'){exact(2);return this.get(k,'set')?.value.has(a[1])?'1':'0';}
    if(c==='ZADD'){atLeast(3);if(a.length%2!==1)throw Error('ERR wrong number of arguments');const pairs=[];for(let i=1;i<a.length;i+=2){if(a[i].trim()===''||!Number.isFinite(Number(a[i])))throw Error('ERR score is not a valid float');pairs.push([a[i+1],Number(a[i])]);}const x=this.make(k,'zset',new Map());let n=0;for(const [m,s]of pairs){if(!x.value.has(m))n++;x.value.set(m,s);}return String(n);}
    if(c==='ZRANGE'){atLeast(3);const start=Number(this.int(a[1])),end=Number(this.int(a[2]));let rev=false,withscores=false;for(const op of a.slice(3)){if(op.toUpperCase()==='REV')rev=true;else if(op.toUpperCase()==='WITHSCORES')withscores=true;else throw Error('ERR simulator supports rank range only; BYSCORE is not implemented');}const v=[...(this.get(k,'zset')?.value||[])].sort((x,y)=>x[1]-y[1]||byteCompare(x[0],y[0]));if(rev)v.reverse();const i=start<0?Math.max(0,v.length+start):start,j=end<0?v.length+end:end;const out=j<i?[]:v.slice(i,j+1);return arr(withscores?out.flatMap(([m,s])=>[m,String(s)]):out.map(x=>x[0]));}
    throw Error('未实现该命令。输入 HELP 查看支持范围；完整实验请使用本地 redis-cli。');
  }
}
function byteCompare(a,b){const x=new TextEncoder().encode(a),y=new TextEncoder().encode(b);for(let i=0;i<Math.min(x.length,y.length);i++)if(x[i]!==y[i])return x[i]-y[i];return x.length-y.length;}
function keySlot(key){const open=key.indexOf('{');if(open>=0){const close=key.indexOf('}',open+1);if(close>open+1)key=key.slice(open+1,close);}let crc=0;for(const b of new TextEncoder().encode(key)){crc^=b<<8;for(let i=0;i<8;i++)crc=((crc&0x8000)?(crc<<1)^0x1021:crc<<1)&0xffff;}return crc%16384;}
if(typeof module!=='undefined')module.exports={RedisSim,keySlot,byteCompare};
