'use strict';
(() => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('#main-nav');
  function closeNav() { nav.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); toggle.setAttribute('aria-label','打开导航菜单'); }
  toggle.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; nav.classList.toggle('open',open); toggle.setAttribute('aria-expanded',String(open)); toggle.setAttribute('aria-label',open?'关闭导航菜单':'打开导航菜单'); });
  nav.addEventListener('click',e => { if(e.target.closest('a')) closeNav(); });
  document.addEventListener('keydown', e => { if(e.key==='Escape') closeNav(); });
  document.addEventListener('click',e => { if(!e.target.closest('.topbar')) closeNav(); });
  const search = document.querySelector('#course-search');
  const filters = [...document.querySelectorAll('[data-filter]')];
  const courses = [...document.querySelectorAll('.course')];
  const results = document.querySelector('#course-results');
  let category = 'all';
  function filterCourses() {
    const query = search.value.trim().toLocaleLowerCase();
    let count = 0;
    courses.forEach(card => {
      const visible = (category==='all'||card.dataset.category===category) && card.textContent.toLocaleLowerCase().includes(query);
      card.hidden=!visible;
      if(visible) count++;
    });
    results.textContent=count+' 个课程与工具'+(query||category!=='all'?'符合当前筛选':'，等待探索');
    document.querySelector('.empty-state').hidden=count!==0;
  }
  filters.forEach(button=>button.addEventListener('click',()=>{
    category=button.dataset.filter;
    filters.forEach(item=>{ const selected=item===button; item.classList.toggle('active',selected); item.setAttribute('aria-pressed',String(selected)); });
    filterCourses();
  }));
  search.addEventListener('input',filterCourses);
  document.querySelector('#reset-search').addEventListener('click',()=>{search.value='';filters[0].click();search.focus();});
  document.addEventListener('keydown',e=>{
    const editing=e.target.closest('input,textarea,select,[contenteditable="true"]');
    if(e.key==='/'&&!editing&&!e.ctrlKey&&!e.metaKey&&!e.altKey){e.preventDefault();search.focus();}
  });
  const chapters=['网络概述','网络类型','网络拓扑','网络分层模型','物理层','交换技术','数据链路层','介质访问控制','检错与流量控制','IP 地址与子网划分','网络设备','网络层','路由算法','IPv6','传输层','应用层','网络安全','网络实践'];
  function updateProgress() {
    const title=document.querySelector('#continue-title'), copy=document.querySelector('#continue-copy'),link=document.querySelector('#continue-link');
    title.textContent='下一站，从计算机网络开始';copy.textContent='从第一章建立全局观。学习进度自动保存在当前浏览器。';link.href='network-lab/#chapter-1';link.innerHTML='开始学习 <span>→</span>';
    try {
      const raw=JSON.parse(localStorage.getItem('network-lab-progress')||'[]');
      const done=new Set(Array.isArray(raw)?raw.filter(n=>Number.isInteger(n)&&n>=0&&n<18):[]);
      if(!done.size)return;
      const next=chapters.findIndex((_,i)=>!done.has(i));
      title.textContent=next===-1?'18 章已完成，给坚持的自己一个赞':'继续第 '+(next+1)+' 章：'+chapters[next];
      copy.textContent='已完成 '+done.size+' / 18 章 · '+Math.round(done.size/18*100)+'% · 学习标记保存在当前浏览器。';
      link.href='network-lab/#chapter-'+(next===-1?1:next+1);
      link.innerHTML=(next===-1?'重新复习':'继续学习')+' <span>→</span>';
    } catch { /* Storage may be unavailable; the first chapter stays usable. */ }
  }
  updateProgress();
  window.addEventListener('pageshow',updateProgress);
  window.addEventListener('storage',e=>{if(e.key==='network-lab-progress'||e.key===null)updateProgress();});
  document.querySelector('#year').textContent=new Date().getFullYear();
  const motion=document.createElement('button');
  motion.className='motion-toggle';
  motion.setAttribute('aria-label','暂停背景动效');
  motion.setAttribute('aria-pressed','false');
  motion.textContent='Ⅱ';
  document.body.append(motion);
  function setPaused(paused) { document.body.classList.toggle('motion-paused',paused);motion.setAttribute('aria-pressed',String(paused));motion.setAttribute('aria-label',paused?'开启背景动效':'暂停背景动效');motion.textContent=paused?'▷':'Ⅱ'; }
  try { setPaused(localStorage.getItem('cs-study-motion-paused')==='true'); } catch {}
  motion.addEventListener('click',()=>{const paused=!document.body.classList.contains('motion-paused');setPaused(paused);try{localStorage.setItem('cs-study-motion-paused',String(paused));}catch{}});
})();


