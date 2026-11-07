(() => {
 const zone=document.querySelector('.shooting-star-zone'), star=zone.querySelector('.shooting-star');
 const observer=new IntersectionObserver(entries=>{
  if(!entries.some(entry=>entry.isIntersecting))return;
  observer.disconnect();
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const dx=zone.clientWidth*.78,dy=zone.clientHeight*.6,angle=Math.atan2(dy,dx)*180/Math.PI;
  star.animate([
   {transform:`translate(0,0) rotate(${angle}deg) scale(.65)`,opacity:0,offset:0},
   {transform:`translate(${dx*.08}px,${dy*.08}px) rotate(${angle}deg) scale(1)`,opacity:1,offset:.15},
   {transform:`translate(${dx*.72}px,${dy*.72}px) rotate(${angle}deg) scale(.85)`,opacity:1,offset:.75},
   {transform:`translate(${dx}px,${dy}px) rotate(${angle}deg) scale(.15)`,opacity:0,offset:1}
  ],{duration:1900,easing:'cubic-bezier(.4,0,.8,1)',fill:'forwards'});
 },{threshold:.6});
 observer.observe(zone);
})();
