// CART3R City — original top-down open-world driving and delivery game.
(()=>{
const canvas=document.getElementById("cityCanvas");if(!canvas)return;
const ctx=canvas.getContext("2d"),W=2400,H=1800,viewW=960,viewH=560;
const hud={mode:document.getElementById("cityMode"),cash:document.getElementById("cityCash"),mission:document.getElementById("cityMission")};
const keys=new Set();let player={x:315,y:300,a:0},car=null,cash=0,mission=0,done=false,started=false,last=0;
const roads=[100,500,900,1300,1700,2100],roadWidth=112;
const buildings=[];
for(let gx=0;gx<5;gx++)for(let gy=0;gy<4;gy++){
 const bx=roads[gx]+roadWidth/2+35,by=roads[gy]+roadWidth/2+35;
 const bw=roads[gx+1]-roads[gx]-roadWidth-70,bh=roads[gy+1]-roads[gy]-roadWidth-70;
 if(bw>70&&bh>70){buildings.push({x:bx,y:by,w:bw*.48,h:bh*.8,c:["#53616c","#766b63","#4b5e59","#68617a"][(gx+gy)%4]});buildings.push({x:bx+bw*.52,y:by,w:bw*.43,h:bh*.62,c:["#625c50","#465c70","#6c6258"][(gx+gy+1)%3]});}
}
const cars=[
{x:255,y:385,a:0,c:"#e0a33b"},{x:740,y:245,a:Math.PI/2,c:"#54a6bd"},{x:1080,y:585,a:0,c:"#b65c68"},
{x:1450,y:820,a:Math.PI/2,c:"#9b8bd1"},{x:1850,y:1180,a:0,c:"#dbd9c9"},{x:350,y:1050,a:Math.PI/2,c:"#56a77a"},
{x:2150,y:1510,a:0,c:"#d47743"},{x:1120,y:1510,a:Math.PI/2,c:"#4d8fca"}
];
const pickups=[{x:430,y:260},{x:860,y:680},{x:1510,y:370},{x:1920,y:760},{x:740,y:1450},{x:2050,y:1600}];
const missionA={x:660,y:280},missionB={x:1880,y:1480};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function blocked(x,y,r=13){return buildings.some(b=>x+r>b.x&&x-r<b.x+b.w&&y+r>b.y&&y-r<b.y+b.h)}
function near(a,b,d){return Math.hypot(a.x-b.x,a.y-b.y)<d}
function interact(){if(car){player.x=car.x-30;player.y=car.y+24;car=null;hud.mode.textContent="ON FOOT";return}
 let c=cars.find(v=>!v.used&&near(player,v,66));if(c){car=c;c.used=true;hud.mode.textContent="DRIVING";}}
document.getElementById("cityInteract").addEventListener("click",interact);
document.getElementById("cityMissionBtn").addEventListener("click",()=>{if(!started){started=true;mission=0;done=false;hud.mission.textContent="Mission started: reach the blue pickup marker."}else if(done){started=false;mission=0;hud.mission.textContent="Mission reset. Find the blue marker."}});
document.getElementById("cityReset").addEventListener("click",()=>{player={x:315,y:300,a:0};if(car)car.used=false;car=null;cash=0;started=false;mission=0;done=false;pickups.forEach(p=>p.got=false);cars.forEach(c=>c.used=false);hud.mode.textContent="ON FOOT";hud.cash.textContent="$0";hud.mission.textContent="Find the blue mission marker."});
document.addEventListener("keydown",e=>{const k=e.key.toLowerCase();if(["arrowup","arrowdown","arrowleft","arrowright"," "].includes(k))e.preventDefault();keys.add(k);if((k==="e"||k===" ")&&!e.repeat)interact()});
document.addEventListener("keyup",e=>keys.delete(e.key.toLowerCase()));
document.querySelectorAll("[data-city-key]").forEach(b=>{const k=b.dataset.cityKey;b.addEventListener("pointerdown",e=>{e.preventDefault();keys.add(k);b.setPointerCapture(e.pointerId)});["pointerup","pointercancel","lostpointercapture"].forEach(ev=>b.addEventListener(ev,()=>keys.delete(k)))});
function drawCar(v,x,y){ctx.save();ctx.translate(x,y);ctx.rotate(v.a);ctx.fillStyle="#10151b";ctx.fillRect(-19,-12,40,24);ctx.fillStyle=v.c;ctx.fillRect(-17,-10,34,20);ctx.fillStyle="#a8d7dc";ctx.fillRect(-7,-8,12,16);ctx.fillStyle="#f7e9b1";ctx.fillRect(13,-7,3,5);ctx.fillRect(13,2,3,5);ctx.restore()}
function world(){
 ctx.fillStyle="#42634e";ctx.fillRect(0,0,W,H);
 // city blocks and road grid
 ctx.fillStyle="#303a43";roads.forEach(x=>ctx.fillRect(x-roadWidth/2,0,roadWidth,H));roads.forEach(y=>ctx.fillRect(0,y-roadWidth/2,W,roadWidth));
 ctx.strokeStyle="#c6b982";ctx.lineWidth=3;ctx.setLineDash([22,24]);roads.forEach(x=>{ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()});roads.forEach(y=>{ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()});ctx.setLineDash([]);
 // sidewalks
 ctx.strokeStyle="#87918b";ctx.lineWidth=5;roads.forEach(x=>{ctx.beginPath();ctx.moveTo(x-roadWidth/2+8,0);ctx.lineTo(x-roadWidth/2+8,H);ctx.stroke();ctx.beginPath();ctx.moveTo(x+roadWidth/2-8,0);ctx.lineTo(x+roadWidth/2-8,H);ctx.stroke()});
 buildings.forEach((b,i)=>{ctx.fillStyle="#202a2d";ctx.fillRect(b.x+9,b.y+12,b.w,b.h);ctx.fillStyle=b.c;ctx.fillRect(b.x,b.y,b.w,b.h);ctx.fillStyle="#aab6b0";ctx.fillRect(b.x+8,b.y+8,b.w-16,5);ctx.fillStyle="#9ec4c1";for(let x=b.x+15;x<b.x+b.w-12;x+=34)for(let y=b.y+18;y<b.y+b.h-10;y+=34)ctx.fillRect(x,y,12,10);ctx.fillStyle="#313c43";ctx.fillRect(b.x+b.w*.4,b.y+b.h-20,24,20)});
 // parks and street trees
 for(let i=0;i<36;i++){let x=(i*347+190)%W,y=(i*229+120)%H;if(!blocked(x,y,20)){ctx.fillStyle="#294b3a";ctx.beginPath();ctx.arc(x,y,15,0,Math.PI*2);ctx.fill();ctx.fillStyle="#70a36d";ctx.beginPath();ctx.arc(x-3,y-4,10,0,Math.PI*2);ctx.fill()}}
 pickups.forEach(p=>{if(!p.got){ctx.fillStyle="#ffd65a";ctx.beginPath();ctx.arc(p.x,p.y,10,0,Math.PI*2);ctx.fill();ctx.fillStyle="#573d11";ctx.font="bold 12px sans-serif";ctx.fillText("$",p.x-4,p.y+4)}});
 if(started&&!done){let m=mission===0?missionA:missionB;ctx.strokeStyle=mission===0?"#52dfff":"#ffe36a";ctx.lineWidth=5;ctx.beginPath();ctx.arc(m.x,m.y,23+Math.sin(Date.now()/180)*4,0,Math.PI*2);ctx.stroke();ctx.fillStyle=ctx.strokeStyle;ctx.beginPath();ctx.arc(m.x,m.y,5,0,Math.PI*2);ctx.fill()}
 else if(!started){ctx.strokeStyle="#52dfff";ctx.lineWidth=5;ctx.beginPath();ctx.arc(missionA.x,missionA.y,20,0,Math.PI*2);ctx.stroke()}
 cars.forEach(v=>{if(!v.used)drawCar(v,v.x,v.y)});if(car)drawCar(car,car.x,car.y);
 if(!car){ctx.fillStyle="#52f3e2";ctx.beginPath();ctx.arc(player.x,player.y,12,0,Math.PI*2);ctx.fill();ctx.fillStyle="#e8ffff";ctx.beginPath();ctx.arc(player.x,player.y-4,4,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#142c2b";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(player.x,player.y+8);ctx.lineTo(player.x-5,player.y+17);ctx.moveTo(player.x,player.y+8);ctx.lineTo(player.x+5,player.y+17);ctx.stroke()}
}
function update(dt){let up=keys.has("w")||keys.has("arrowup"),down=keys.has("s")||keys.has("arrowdown"),left=keys.has("a")||keys.has("arrowleft"),right=keys.has("d")||keys.has("arrowright");
 if(car){let accel=(up?1:0)-(down?1:0),turn=(right?1:0)-(left?1:0);car.a+=turn*dt*(accel<0?-2.5:2.5);let speed=accel*260*dt,nx=car.x+Math.cos(car.a)*speed,ny=car.y+Math.sin(car.a)*speed;if(!blocked(nx,ny,17)){car.x=clamp(nx,15,W-15);car.y=clamp(ny,15,H-15)}}
 else{let dx=(right?1:0)-(left?1:0),dy=(down?1:0)-(up?1:0),len=Math.hypot(dx,dy)||1;dx/=len;dy/=len;let nx=player.x+dx*185*dt,ny=player.y+dy*185*dt;if(!blocked(nx,player.y))player.x=clamp(nx,10,W-10);if(!blocked(player.x,ny))player.y=clamp(ny,10,H-10);if(dx||dy)player.a=Math.atan2(dy,dx)}
 let actor=car||player;pickups.forEach(p=>{if(!p.got&&near(actor,p,28)){p.got=true;cash+=50;hud.cash.textContent="$"+cash}});
 if(started&&!done){let target=mission===0?missionA:missionB;if(near(actor,target,40)){if(mission===0){mission=1;hud.mission.textContent="Pickup secured! Deliver it to the gold marker."}else{done=true;cash+=250;hud.cash.textContent="$"+cash;hud.mission.textContent="Delivery complete! +$250. Start another run when ready.";}}}
}
function frame(t){let dt=Math.min(.04,(t-last)/1000||0);last=t;update(dt);let actor=car||player,cx=clamp(actor.x-viewW/2,0,W-viewW),cy=clamp(actor.y-viewH/2,0,H-viewH);ctx.save();ctx.clearRect(0,0,canvas.width,canvas.height);ctx.translate(-cx,-cy);world();ctx.restore();requestAnimationFrame(frame)}
hud.cash.textContent="$0";requestAnimationFrame(frame);
})();