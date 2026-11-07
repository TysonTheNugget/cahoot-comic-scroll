(() => {
 const zone=document.querySelector('.rocket-zone'), ship=zone.querySelector('.rocket'), glint=zone.querySelector('.rocket-glint');
 const calm=matchMedia('(prefers-reduced-motion: reduce)');
 const puffs=Array.from({length:28},()=>{const el=document.createElement('i');el.className='rocket-puff';zone.querySelector('.rocket-trail').append(el);return {el,born:-1};});
 let active=false,done=false,elapsed=0,previous=0,lastPuff=0,index=0;
 const limit=n=>Math.max(0,Math.min(1,n));
 function tick(now){
  const rect=zone.getBoundingClientRect();
  const visible=rect.top+rect.height*.67<innerHeight*.82&&rect.bottom>innerHeight*.25;
  if(!active&&!done&&visible)active=true;
  const dt=previous?Math.min(now-previous,50):0;previous=now;
  if(active&&visible&&!document.hidden)elapsed+=dt;
  const w=zone.clientWidth,h=zone.clientHeight,sw=ship.offsetWidth,sh=sw*642/380;
  const t=elapsed/1000,flight=limit((t-1.3)/4.7),distance=flight*flight*(3-2*flight);
  const x=w*.31+Math.min(w*.3,h*.28)*distance,y=h*.67-h*.50*distance;
  const scale=1-.96*distance;
  const bob=t<1.3?Math.sin(t*4)*3*(1-t/1.3):0;
  ship.style.transform=`translate(${x-sw/2}px,${y-sh/2+bob}px) scale(${calm.matches?1:scale})`;
  ship.style.opacity=active?(calm.matches?1:limit(t/.35)*(1-limit((flight-.85)/.15))):0;
  if(active&&!calm.matches&&visible&&t>1&&flight<.92&&t-lastPuff>.075){
   const p=puffs[index++%puffs.length];p.born=t;p.x=x-sw*.23*scale;p.y=y+sh*.34*scale;p.size=scale;p.seed=index;lastPuff=t;
  }
  puffs.forEach(p=>{const age=t-p.born;if(p.born<0||age>1.35){p.el.style.opacity=0;return}p.el.style.opacity=(1-age/1.35)*.55;p.el.style.transform=`translate(${p.x-age*16-10}px,${p.y+age*24-10}px) scale(${p.size*(.3+age*1.5)})`;});
  const sparkle=limit((t-5.7)/.3)*(1-limit((t-6.1)/.6));
  glint.style.opacity=calm.matches?0:sparkle;glint.style.transform=`translate(${x-14}px,${y-14}px) scale(${sparkle}) rotate(${t*15}deg)`;
  if(t>7){active=false;done=true;ship.style.willChange='auto';return}
  requestAnimationFrame(tick);
 }
 requestAnimationFrame(tick);
})();
