const stories = [...document.querySelectorAll('.story')];
const owls = [...document.querySelectorAll('.owl')];
const sprites = [...document.querySelectorAll('.sprite')];
const camp = document.querySelector('.camp');
const progress = document.querySelector('.progress');
const sky = document.querySelector('.sky-art');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const lettering = [];
document.querySelectorAll('[data-letters]').forEach(heading => {
 const label = heading.innerText.replace(/\s+/g,' ').trim();
 heading.setAttribute('aria-label',label);
 const lines = heading.innerHTML.split(/<br\s*\/?\s*>/i);
 heading.replaceChildren();
 const chars=[];
 lines.forEach(line=>{
  const row=document.createElement('span');row.className='line';row.setAttribute('aria-hidden','true');
  line.trim().split(/\s+/).forEach((text,index)=>{
   if(index)row.append(' ');
   const word=document.createElement('span');word.className='word';
   [...text].forEach(char=>{const span=document.createElement('span');span.className='letter';span.textContent=char;word.append(span);chars.push(span);});row.append(word);
  });heading.append(row);
 });
 lettering.push({heading,chars,section:heading.closest('.chapter'),top:0});
});
const clamp = (v, min=0, max=1) => Math.max(min, Math.min(max,v));
const ease = v => v*v*(3-2*v);
let lastFrame = -1, geometry = [], campTop = 0, height = innerHeight, end = 1;
function measure(){height=innerHeight;geometry=stories.map(el=>({el,top:el.parentElement.offsetTop,size:el.parentElement.offsetHeight}));campTop=camp.offsetTop;end=document.documentElement.scrollHeight-height;lettering.forEach(item=>{item.top=0;for(let node=item.heading;node;node=node.offsetParent){item.top+=node.offsetTop;}});}
let startedAt;
function render(time){
 startedAt ??= time;
 const y=scrollY;
 const travel = Math.max(0, document.documentElement.clientWidth * 3 - height);
 sky.style.transform = `translate3d(0,${-clamp(y/end)*travel}px,0)`;
 const landing=ease(clamp((y+height*.8-campTop)/(height*.5)));
 geometry.forEach(({el,top,size},i)=>{
  const offset=(top+size*.5-y-height*.5)/height;
  const visible=clamp((1.18-Math.abs(offset))/.4);
  el.style.opacity=reduced.matches?'1':visible;
  el.style.transform=reduced.matches?'none':`translate3d(0,${offset*55}px,0) scale(${.96+.04*visible})`;
 });
 lettering.forEach(({chars,top},index)=>{
  // Reveal while the headline travels from 72% to 28% of the viewport.
  const entry=index===0?clamp((time-startedAt-150)/1300):clamp((y+height*.72-top)/(height*.44));
  chars.forEach((char,i)=>{
   const p=reduced.matches?1:ease(clamp((entry-i/chars.length*.48)/.52));
   const direction=i%2?1:-1;
   char.style.opacity=p;
   char.style.transform=`translate3d(${(1-p)*direction*25}px,${(1-p)*95}px,0) rotate(${(1-p)*direction*30}deg) scale(${.45+p*.55})`;
  });
 });
 owls.forEach((owl,i)=>{
  const bob=reduced.matches?0:Math.sin(time/750+i*2)*10;
  const drift=reduced.matches?0:Math.sin(y/680+i)*14;
  owl.style.opacity=1-landing;
  owl.style.visibility=landing>=1?'hidden':'visible';
  owl.style.transform=`translate3d(${drift+(i?-1:1)*landing*innerWidth*.18}px,${bob+landing*height*.22}px,0) rotate(${reduced.matches?0:Math.sin(time/1200+i)*3}deg) scale(${1-landing*.22})`;
 });
 const frame=reduced.matches?0:Math.floor(time/75)%36;
 if(frame!==lastFrame){sprites.forEach(s=>{
  const col=frame%6,row=Math.floor(frame/6);
  if(s.classList.contains('cahoot')){
   // This supplied sheet has uneven transparent gaps between its six rows.
   const rows=[0,180,360,530,704,869,1057];
   const frameHeight=rows[row+1]-rows[row];
   s.style.backgroundSize=`600% ${1057/frameHeight*100}%`;
   s.style.backgroundPosition=`${col*20}% ${rows[row]/(1057-frameHeight)*100}%`;
  }else{s.style.backgroundPosition=`${col*20}% ${row*20}%`;}
 });lastFrame=frame;}
 progress.style.transform=`scaleX(${clamp(y/end)})`;
 requestAnimationFrame(render);
}
addEventListener('resize',measure,{passive:true});
addEventListener('load',measure);document.fonts.ready.then(measure);measure();requestAnimationFrame(render);

