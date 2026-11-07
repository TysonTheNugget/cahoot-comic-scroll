/* Shared opening scene for the editor and release game. All times are seconds. */
window.createOpening = function(canvas, onRace) {
  const ctx = canvas.getContext('2d'), W=canvas.width, H=canvas.height;
  const sheets={}, names=['brown-horse-idle','white-horse-idle','horse-idle','white-mounted-idle','cowboy-flying','meeting-owl','white-mounted-run'];
  const ready=Promise.all(names.map(name=>new Promise((resolve,reject)=>{
    const image=new Image(); image.onload=()=>{sheets[name]=image;resolve()}; image.onerror=()=>reject(new Error('Could not load '+name)); image.src='assets/'+name+'.png';
  })));
  const box=document.createElement('div'); box.className='opening-dialogue'; box.hidden=true;
  const speaker=document.createElement('strong'), line=document.createElement('p'), next=document.createElement('button');
  const cancel=document.createElement('button');cancel.textContent='Back to editor';cancel.className='secondary';
  box.append(speaker,line,next,cancel); canvas.after(box); box.setAttribute('aria-live','polite');
  const dialogue=[['Cowboy owl','We have a mission: bury and lock 10% of the CAHOOT supply.'],['White owl','The chest is waiting at the end of the trail. Ready, partner?'],['Cowboy owl','Let’s ride! Tap to begin.']];
  let active=false, loaded=false, age=0, prev=0, index=-1, layout={}, cancelled=()=>{};
  function showLine(){box.dataset.speaker=index===1?'white':'cowboy';speaker.textContent=dialogue[index][0];line.textContent=dialogue[index][1];next.textContent=index===dialogue.length-1?'Tap the scene to race':'Next';}
  function advance(){if(!active||index<0)return;if(index<dialogue.length-1){index++;showLine()}else{active=false;box.hidden=true;onRace()}}
  next.onclick=advance;box.addEventListener('pointerdown',e=>{if(canvas.id==='game'){e.stopPropagation();advance()}});
  cancel.onclick=()=>{active=false;box.hidden=true;cancelled()};
  canvas.addEventListener('pointerdown',e=>{if(active){e.stopImmediatePropagation();e.preventDefault();advance()}},true);
  window.addEventListener('keydown',e=>{if(active&&['Space','Enter','ArrowUp'].includes(e.code)){e.preventDefault();e.stopImmediatePropagation();if(!e.repeat)advance()}},true);
  const smooth=v=>{v=Math.max(0,Math.min(1,v));return v*v*(3-2*v)};
  function sprite(name,t,cx,bottom,width,alpha=1){const im=sheets[name];if(!im)return;const sw=im.width/6,sh=im.height/6,f=Math.floor(t*(name.includes("horse-idle")&&!name.includes("mounted")?18:8))%36;ctx.save();ctx.globalAlpha=alpha;ctx.drawImage(im,(f%6)*sw,Math.floor(f/6)*sh,sw,sh,cx-width/2,bottom-width*sh/sw,width,width*sh/sw);ctx.restore()}
  return {
    get active(){return active},
    companion(t,distance,horse,markers,ending=false,jump=0){
      const size=horse?.size??245,width=size*440/430;
      let y=horse?.y??119;
      for(const m of (markers||[]).slice().sort((a,b)=>a.at-b.at)){if(distance<m.at)break;const v=smooth((distance-m.at)/(m.transition||350));y=y+(m.y-y)*v;if(v<1)break}
      const cx=(horse?.x??W*.3)+width*1.5;
      sprite(ending?'white-mounted-idle':'white-mounted-run',t,cx,H-y-jump,width);
    },
    async start(value,onCancel){layout=value||{};cancelled=onCancel||(()=>{});active=true;loaded=false;age=0;prev=0;index=-1;box.hidden=false;speaker.textContent='At the starting line';line.textContent='Loading the riders…';next.hidden=true;cancel.hidden=canvas.id!=='stage';
      try{await ready;if(!active)return;loaded=true;line.textContent='Two horses. One trail. A treasure waiting.'}catch(e){line.textContent=e.message+'. Reload to try again.';cancel.hidden=false}
    },
    draw(now,background,props){if(!active)return false;const dt=prev?Math.min((now-prev)/1000,.05):0;prev=now;if(loaded&&!document.hidden)age+=dt;ctx.clearRect(0,0,W,H);if(background?.naturalWidth)ctx.drawImage(background,0,0,W,H);if(!loaded)return true;
      const ground=H-(layout.horse?.y??119), width=Math.min(W*.23,(layout.horse?.size??290)*440/430), a=layout.horse?.x??W*.3,b=a+width*1.5;
      const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
      const descent=smooth((age-3)/5), blend=smooth((age-8)/.7);
      [a,b].forEach((cx,i)=>{
        sprite(i?'white-horse-idle':'brown-horse-idle',age,cx,ground,width,1-blend);
        if(age>3&&blend<1){const ow=width*(i?.62:.67),target=ground-width*.50;const bottom=reduced?target:-20+(target+20)*descent;sprite(i?'meeting-owl':'cowboy-flying',age,cx-width*.06,bottom,ow,(reduced?descent:1)*(1-blend))}
        if(blend>0)sprite(i?'white-mounted-idle':'horse-idle',age,cx,ground,width,blend);
      });
      if(props)props(ctx);
      if(age>=8.9&&index<0){index=0;next.hidden=false;showLine()}
      return true;
    }
  };
};
