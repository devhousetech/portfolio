import { useEffect, useRef, useState, useCallback } from 'react'

const CW = 480
const CH = 200
const GRAVITY  = 0.5
const JUMP_VEL = -6
const MOVE_SPD = 1.8
const CAR_H     = 52
const CAR_W_IDLE = Math.round(342 * CAR_H / 259)
const CAR_W_MOV  = Math.round(587 * CAR_H / 259)
const REA_H      = 52
const GROUND_Y   = CH - 50

const P = {
  sky1:'#5baee0',sky2:'#87ceeb',sky3:'#b8e4f5',
  grass:'#4a9040',grass2:'#5aaa4e',
  road:'#555566',roadln:'#ffee88',side:'#888898',
  dirt:'#8b5e3c',dirt2:'#6b4020',
  house1:'#e8d5b0',house2:'#d4b896',house3:'#ddc0a0',
  roof1:'#c04030',roof2:'#8b2020',roof3:'#4a7030',
  win:'#aad4ff',winbdr:'#8888aa',door:'#8b4513',chimney:'#aa6644',
  fence:'#ddd5c0',forsale:'#cc2222',signbg:'#ffffff',
  tree1:'#2d6e20',tree2:'#3d8e30',trunk:'#8b5e3c',
  cloud:'rgba(255,255,255,0.9)',sun:'rgba(255,240,100,0.9)',
  gold:'#ffd700',teal:'#4adede',walldk:'rgba(4,8,14,0.96)',
}

const IMGS = {}
function loadImages(cb) {
  const urls = {
    idle:   '/assets/game/main-char.png',
    moving: '/assets/game/main-char-moving.png',
    rea1:   '/assets/game/realtor-1.png',
    rea2:   '/assets/game/realtor-2.png',
    rea3:   '/assets/game/realtor-3.png',
    banana: '/assets/game/banana.png',
    gull:   '/assets/game/sea-gull.png',
    house1: '/assets/game/house-1.png',
    house2: '/assets/game/house-2.png',
    house3: '/assets/game/house-3.png',
    house4: '/assets/game/house-4.png',
    house5: '/assets/game/house-5.png',
    house6: '/assets/game/house-6.png',
    tree1:  '/assets/game/tree-1.png',
    tree2:  '/assets/game/tree-2.png',
    tree3:  '/assets/game/tree-3.png',
    tree4:  '/assets/game/tree-4.png',
    cloud1: '/assets/game/cloud-1.png',
    cloud2: '/assets/game/cloud-2.png',
    bg:     '/assets/game/california-bg.png',
    road:   '/assets/game/road.png',
  }
  let n=0, total=Object.keys(urls).length
  Object.entries(urls).forEach(([k,url])=>{
    const img=new window.Image()
    img.onload  = ()=>{ IMGS[k]=img; if(++n===total) cb() }
    img.onerror = ()=>{ if(++n===total) cb() }
    img.src=url
  })
}

let CTX=null
const r=(x,y,w,h,c)=>{ CTX.fillStyle=c; CTX.fillRect(Math.round(x),Math.round(y),w,h) }

function drawImg(key,x,groundY,targetH){
  const img=IMGS[key]; if(!img) return 0
  const sc=targetH/img.naturalHeight, w=img.naturalWidth*sc
  CTX.drawImage(img,x,groundY-targetH,w,targetH); return w
}
function drawFrame(key,fi,total,x,groundY,targetH){
  const img=IMGS[key]; if(!img) return 0
  const FW=img.naturalWidth/total,FH=img.naturalHeight
  const sc=targetH/FH,dw=FW*sc
  CTX.drawImage(img,fi*FW,0,FW,FH,x,groundY-targetH,dw,targetH); return dw
}

function drawCloud(x,y,w,idx){
  const key=idx%2===0?'cloud1':'cloud2'
  const img=IMGS[key]; if(!img) return
  const targetW=w*2
  const scale=targetW/img.naturalWidth
  const h=img.naturalHeight*scale
  CTX.globalAlpha=0.88
  CTX.drawImage(img,x-targetW/2,y-h/2,targetW,h)
  CTX.globalAlpha=1
}
function drawTree(x,gY,size,variant){
  const keys=['tree1','tree2','tree3','tree4']
  const img=IMGS[keys[variant%4]]; if(!img) return
  const targetH=size==='big'?70:48
  const scale=targetH/img.naturalHeight
  const w=img.naturalWidth*scale
  CTX.drawImage(img,x-w/2,gY-targetH,w,targetH)
}
function drawHouse(x,gY,v){
  const keys=['house1','house2','house3','house4','house5','house6']
  const key=keys[v%keys.length]
  const img=IMGS[key]; if(!img) return
  const targetH=80
  const scale=targetH/img.naturalHeight
  const w=img.naturalWidth*scale
  CTX.drawImage(img,x,gY-targetH,w,targetH)
  // For sale sign
  const sx=x+w+4,sy=gY-18
  r(sx,sy,2,16,'#999'); r(sx-8,sy,20,11,P.signbg); r(sx-8,sy,20,2,P.forsale)
  CTX.fillStyle=P.forsale; CTX.font='bold 4px monospace'; CTX.fillText('FOR SALE',sx-7,sy+8)
}
function drawFence(x,gY,len){
  r(x,gY-12,len,2,P.fence); r(x,gY-8,len,2,P.fence)
  for(let i=0;i<=len;i+=8){ r(x+i,gY-14,2,14,P.fence); r(x+i,gY-15,2,2,'#aaa8a0') }
}

// ── World ──────────────────────────────────────────────────────────────────
function createWorld(){
  const features=[],realtors=[],clouds=Array.from({length:8},(_,i)=>({wx:80+i*200,y:18+Math.random()*22,w:28+Math.random()*28,spd:0.05+Math.random()*0.05}))
  let nextX=80,rCount=0
  const MSGS=['Deal closed!','1 property sold!','Thank you Mike!','Commission!','You found me!','Best closer!']
  const ensureTo=(maxX)=>{
    while(nextX<maxX+400){
      const roll=Math.random()
      if(roll<0.35){
        const v=Math.floor(Math.random()*4),hw=44+Math.floor(Math.random()*12)
        features.push({type:'house',x:nextX,variant:v,w:hw})
        realtors.push({x:nextX+hw/2-4,groundY:GROUND_Y-11,bumped:false,bumpTimer:0,frame:0,msg:MSGS[rCount%MSGS.length],variant:rCount%3})
        rCount++; nextX+=hw+120+Math.floor(Math.random()*180)
      } else if(roll<0.55){
        const cnt=1+Math.floor(Math.random()*3)
        for(let i=0;i<cnt;i++) features.push({type:'tree',x:nextX+i*18,size:Math.random()>.5?'big':'small',variant:Math.floor(Math.random()*4)})
        nextX+=cnt*18+60+Math.floor(Math.random()*80)
      } else { nextX+=80+Math.floor(Math.random()*100) }
    }
  }
  return {features,realtors,clouds,ensureTo}
}

// ── Obstacles ──────────────────────────────────────────────────────────────
function createObstacles(){
  const list=[]
  let nextX=600
  const ensureTo=(maxX,score)=>{
    // Lvl1 (0-49): wide gaps | Lvl2 (50-99): medium | Lvl3 (100+): tight
    const minGap = score<50?280 : score<100?220 : 160
    const maxGap = score<50?480 : score<100?340 : 260
    while(nextX<maxX+300){
      // Always mix bananas and seagulls from the start
      const type = Math.random()<0.5 ? 'banana' : 'seagull'
      list.push({
        x:nextX, type,
        y: type==='seagull' ? GROUND_Y-CAR_H-10-Math.random()*10 : GROUND_Y,
        bobPhase:Math.random()*Math.PI*2, hit:false,
      })
      nextX+=minGap+Math.floor(Math.random()*(maxGap-minGap))
    }
  }
  const getVisible=(camX)=>list.filter(o=>!o.hit&&o.x>camX-20&&o.x<camX+CW+60)
  return {ensureTo,getVisible,list}
}

// ── Component ──────────────────────────────────────────────────────────────
export default function PixelGame(){
  const canvasRef=useRef(null)
  const stateRef =useRef(null)
  const worldRef =useRef(null)
  const rafRef   =useRef(null)
  const keysRef  =useRef({})
  const loadedRef=useRef(false)
  const musicRef  =useRef(null)
  const jumpSndRef=useRef(null)
  const hitSndRef =useRef(null)
  const [started, setStarted]=useState(false)
  const [score,   setScore]  =useState(0)
  const [best,    setBest]   =useState(0)
  const [gameOver,setGameOver]=useState(false)
  const [restartKey,setRestartKey]=useState(0)
  const [fullscreen,setFullscreen]=useState(false)
  const [muted,setMuted]=useState(false)

  const initState=useCallback(()=>{
    const world=createWorld(); worldRef.current=world; world.ensureTo(CW+400)
    const obs=createObstacles()
    return{x:30,y:GROUND_Y-CAR_H,velY:0,onGround:true,isMoving:false,moveDecay:0,frame:0,camX:0,wallX:0,popups:[],score:0,gameOver:false,obstacles:obs}
  },[])

  // Mobile control handlers
  const mobileLeft  = useCallback(()=>{ keysRef.current['ArrowLeft']=true  },[])
  const mobileRight = useCallback(()=>{ keysRef.current['ArrowRight']=true },[])
  const mobileStop  = useCallback(()=>{ keysRef.current['ArrowLeft']=false; keysRef.current['ArrowRight']=false },[])
  const mobileJump  = useCallback(()=>{
    if(stateRef.current?.gameOver){ stateRef.current=initState(); setScore(0); setGameOver(false); setStarted(true); setRestartKey(k=>k+1); return }
    if(!started) setStarted(true)
    keysRef.current['Space']=true
    setTimeout(()=>{ keysRef.current['Space']=false },100)
  },[started, initState])

  const toggleMute = useCallback(()=>{
    setMuted(m=>{
      const next=!m
      if(musicRef.current) musicRef.current.muted=next
      if(jumpSndRef.current) jumpSndRef.current.muted=next
      if(hitSndRef.current) hitSndRef.current.muted=next
      return next
    })
  },[])

  const toggleFullscreen = useCallback(()=>{
    setFullscreen(f=>{
      if(!f){
        canvasRef.current?.closest('div')?.requestFullscreen?.()
      } else {
        document.exitFullscreen?.()
      }
      return !f
    })
  },[])

  // Init audio once on mount
  useEffect(()=>{
    const music=new Audio('/assets/game/city-music.mp3')
    music.loop=true; music.volume=0.25
    musicRef.current=music

    const jumpSnd=new Audio('/assets/game/jump.mp3')
    jumpSnd.volume=0.35
    jumpSndRef.current=jumpSnd

    const hitSnd=new Audio('/assets/game/game-over.mp3')
    hitSnd.volume=0.4
    hitSndRef.current=hitSnd

    return ()=>{ music.pause() }
  },[])

  useEffect(()=>{
    const dn=(e)=>{
      keysRef.current[e.code]=true
      if(['Space','ArrowUp'].includes(e.code)) e.preventDefault()
      if(!started && e.code==='Space') setStarted(true)
      // Spacebar retries on game over
      if(e.code==='Space' && stateRef.current?.gameOver){
        stateRef.current=initState(); setScore(0); setGameOver(false); setStarted(true); setRestartKey(k=>k+1)
        if(musicRef.current){ musicRef.current.currentTime=0; musicRef.current.play().catch(()=>{}) }
      }
    }
    const up=(e)=>{ keysRef.current[e.code]=false }
    window.addEventListener('keydown',dn); window.addEventListener('keyup',up)
    return()=>{ window.removeEventListener('keydown',dn); window.removeEventListener('keyup',up) }
  },[started])

  useEffect(()=>{
    const canvas=canvasRef.current
    const ctx=canvas.getContext('2d'); ctx.imageSmoothingEnabled=false; CTX=ctx
    stateRef.current=initState()
    loadImages(()=>{ loadedRef.current=true })
    const stars=Array.from({length:40},()=>({wx:Math.random()*1200,y:8+Math.random()*35,r:Math.random()}))

    const loop=()=>{
      CTX=ctx
      const s=stateRef.current, world=worldRef.current
      if(!s||!world){ rafRef.current=requestAnimationFrame(loop); return }

      if(started && !s.gameOver){
        s.frame++
        const goL=!!keysRef.current['ArrowLeft'], goR=!!keysRef.current['ArrowRight']
        const doJ=!!keysRef.current['Space']||!!keysRef.current['ArrowUp']
        if(goL) s.x-=MOVE_SPD
        if(goR) s.x+=MOVE_SPD
        // Start music on first movement
      if(!musicRef.current?.playing && musicRef.current?.paused){
        musicRef.current.play().catch(()=>{})
      }
      if(goL||goR) s.moveDecay=10; else s.moveDecay=Math.max(0,s.moveDecay-1)
        s.isMoving=s.moveDecay>0
        if(doJ&&s.onGround){
          s.velY=JUMP_VEL; s.onGround=false
          keysRef.current['Space']=false; keysRef.current['ArrowUp']=false
          if(jumpSndRef.current){ jumpSndRef.current.currentTime=0; jumpSndRef.current.play().catch(()=>{}) }
        }
        // Hang time — reduce gravity at peak of jump
        const atPeak = s.velY > -2 && s.velY < 3 && !s.onGround
        const effectiveGravity = atPeak ? GRAVITY * 0.15 : GRAVITY
        s.velY += effectiveGravity
        s.y += s.velY
        if(s.y>=GROUND_Y-CAR_H){ s.y=GROUND_Y-CAR_H; s.velY=0; s.onGround=true }
        s.wallX+=0.07; s.wallX=Math.min(s.wallX,s.x-5); if(s.x<s.wallX) s.x=s.wallX
        const targetCam=s.x+CAR_W_IDLE/2-CW*0.35; s.camX=Math.max(s.wallX,targetCam)
        s.wallX=Math.max(s.wallX,s.camX-20); s.x=Math.min(s.x,s.camX+CW-CAR_W_MOV-4)
        world.ensureTo(s.camX+800)
        s.obstacles.ensureTo(s.camX+800,s.score)

        // Car hitbox — padded inward
        const cp=28
        const cL=s.x+cp, cR=s.x+(s.isMoving?CAR_W_MOV:CAR_W_IDLE)-cp
        const cT=s.y+10, cB=s.y+CAR_H-4

        // Obstacle collision
        for(const obs of s.obstacles.getVisible(s.camX)){
          if(obs.hit) continue
          // Small tight hitboxes
          const oW=obs.type==='banana'?8:12,  oH=obs.type==='banana'?5:8
          const oX=obs.x+2, oY=obs.type==='banana'?GROUND_Y-oH:obs.y
          const nearGround = s.onGround
          if(cL<oX+oW&&cR>oX&&cT<oY+oH&&cB>oY&&(obs.type!=='banana'||nearGround)){
            obs.hit=true
            s.hitFlash=30
            s.gameOver=true
            if(musicRef.current){ musicRef.current.pause(); musicRef.current.currentTime=0 }
            if(hitSndRef.current){ hitSndRef.current.currentTime=0; hitSndRef.current.play().catch(()=>{}) }
            setTimeout(()=>setGameOver(true), 600)
          }
        }

        // Realtor collision
        for(const rea of world.realtors){
          if(rea.bumped){rea.bumpTimer++;continue}
          rea.frame++
          if(cL<rea.x+16&&cR>rea.x&&cT<rea.groundY&&cB>rea.groundY-REA_H){
            rea.bumped=true; rea.bumpTimer=0
            s.score++
            s.popups.push({x:rea.x-s.camX+8,y:rea.groundY-REA_H-12,life:55})
            setScore(sc=>{ const n=sc+1; setBest(b=>Math.max(b,n)); return n })
          }
        }
        s.popups=s.popups.map(p=>({...p,y:p.y-.55,life:p.life-1})).filter(p=>p.life>0)
        for(const cl of world.clouds) cl.wx-=cl.spd
      }

      // ── Draw ────────────────────────────────────────────────────────
      const s2=stateRef.current, cam=s2.camX
      // Background image — parallax scroll at 0.3x speed
      if(IMGS['bg']){
        const bgImg=IMGS['bg']
        const bgScale=CH/bgImg.naturalHeight
        const bgW=bgImg.naturalWidth*bgScale
        // Tile the bg if needed, scroll slowly
        const bgOff=((cam*0.3)%bgW+bgW)%bgW
        CTX.drawImage(bgImg,-bgOff,0,bgW,CH)
        if(bgOff>0) CTX.drawImage(bgImg,bgW-bgOff,0,bgW,CH)
      } else {
        const sky=ctx.createLinearGradient(0,0,0,CH)
        sky.addColorStop(0,P.sky1); sky.addColorStop(.6,P.sky2); sky.addColorStop(1,P.sky3)
        ctx.fillStyle=sky; ctx.fillRect(0,0,CW,CH)
      }
      // Road sprite — tiled horizontally, anchored to bottom
      if(IMGS['road']){
        const rImg=IMGS['road']
        const rH=CH*0.38  // road takes bottom 38% of canvas
        const rY=CH-rH
        const rScale=rH/rImg.naturalHeight
        const rW=rImg.naturalWidth*rScale
        // Tile with scroll
        const rOff=Math.round(cam)%rW
        for(let x=-rOff; x<CW+rW; x+=rW){
          CTX.drawImage(rImg,x,rY,rW,rH)
        }
      } else {
        r(0,GROUND_Y,CW,12,P.road)
        r(0,GROUND_Y-8,CW,8,P.grass)
        r(0,GROUND_Y+12,CW,CH-GROUND_Y-12,P.dirt)
      }

      for(const f of worldRef.current.features){
        const fx=f.x-cam; if(fx>CW+80||fx<-120) continue
        if(f.type==='house') drawHouse(fx,GROUND_Y-17,f.variant)
        else if(f.type==='tree') drawTree(fx,GROUND_Y-17,f.size,f.variant)
      }
      for(const rea of worldRef.current.realtors){
        const rx=rea.x-cam; if(rx<-30||rx>CW+30) continue
        drawImg(`rea${rea.variant+1}`,rx-8,rea.groundY,REA_H)
        if(rea.bumped&&rea.bumpTimer<80){
          CTX.font='7px monospace'
          const tw=CTX.measureText(rea.msg).width,bw=tw+10,bh=13,bx=rx+4-bw/2,by=rea.groundY-REA_H-20
          CTX.fillStyle='rgba(255,255,240,0.96)'; CTX.beginPath(); CTX.roundRect(bx,by,bw,bh,3); CTX.fill()
          CTX.beginPath(); CTX.moveTo(rx+1,by+bh); CTX.lineTo(rx+7,by+bh); CTX.lineTo(rx+4,by+bh+5); CTX.fill()
          CTX.fillStyle='#333'; CTX.fillText(rea.msg,bx+5,by+bh-3)
          CTX.font='12px serif'; CTX.fillText('🙌',rx+1,rea.groundY-REA_H-22)
        }
      }

      // Obstacles
      const t2=s2.frame*.03
      for(const obs of s2.obstacles.getVisible(cam)){
        const ox=obs.x-cam
        if(obs.type==='banana'){
          const img=IMGS['banana']
          if(img){ const bh=14,bw=img.naturalWidth*(bh/img.naturalHeight); CTX.drawImage(img,ox-bw/2,GROUND_Y-bh,bw,bh) }
        } else {
          const img=IMGS['gull']
          if(img){
            const bob=Math.sin(t2+obs.bobPhase)*6
            const fi=Math.floor(s2.frame/14)%3
            const FW2=img.naturalWidth/3,FH2=img.naturalHeight,gh=30,gw=FW2*(gh/FH2)
            CTX.drawImage(img,fi*FW2,0,FW2,FH2,ox,obs.y+bob-gh,gw,gh)
          }
        }
      }

      // Car
      if(loadedRef.current){
        const cx=s2.x-cam, cy=s2.y+CAR_H
        if(s2.isMoving){ const fi=Math.floor(s2.frame/9)%8; drawFrame('moving',fi,8,cx,cy,CAR_H) }
        else drawImg('idle',cx,cy,CAR_H)
      }

      // Red hit flash — decay even after game over
      if(s2.hitFlash > 0){
        ctx.fillStyle=`rgba(220,30,30,${(s2.hitFlash/30)*0.55})`
        ctx.fillRect(0,0,CW,CH)
        s2.hitFlash--
      }

      // Popups
      for(const pop of s2.popups){
        ctx.globalAlpha=Math.min(1,pop.life/20); ctx.font='bold 8px monospace'; ctx.fillStyle=P.gold
        ctx.fillText('+1 Deal!',pop.x-18,pop.y); ctx.globalAlpha=1
      }

      const nR=worldRef.current.realtors.find(r2=>!r2.bumped&&r2.x>cam+CW)
      if(nR){ ctx.fillStyle=P.teal; ctx.font='8px monospace'; ctx.fillText('► realtor ahead',CW-108,14) }

      const wSx=s2.wallX-cam
      const wg=ctx.createLinearGradient(wSx-10,0,wSx+15,0)
      wg.addColorStop(0,P.walldk); wg.addColorStop(1,'transparent')
      ctx.fillStyle=wg; ctx.fillRect(0,0,Math.max(wSx+15,0),CH)
      const eg=ctx.createLinearGradient(0,0,30,0)
      eg.addColorStop(0,'rgba(2,4,8,0.98)'); eg.addColorStop(1,'transparent')
      ctx.fillStyle=eg; ctx.fillRect(0,0,30,CH)

      rafRef.current=requestAnimationFrame(loop)
    }
    rafRef.current=requestAnimationFrame(loop)
    return()=>cancelAnimationFrame(rafRef.current)
  },[started,initState,restartKey])

  return(
    <section id='minigame' style={{padding:'clamp(80px,10vw,120px) clamp(20px,5vw,60px)',maxWidth:'var(--max)',margin:'0 auto',borderTop:'1px solid var(--border)'}}>
      <div style={{marginBottom:32,display:'flex',alignItems:'flex-end',justifyContent:'space-between',flexWrap:'wrap',gap:16}}>
        <div>
          <div style={{fontSize:11,fontWeight:500,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--teal)',marginBottom:8}}>Mini Game</div>
          <h2 style={{fontSize:'clamp(28px,3vw,40px)',fontWeight:700,letterSpacing:'-0.02em',color:'var(--offwhite)',margin:0}}>Take a Break</h2>
        </div>
        <div style={{display:'flex',gap:24,fontFamily:'monospace',alignItems:'flex-end'}}>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:10,color:'var(--muted)',letterSpacing:'0.1em',textTransform:'uppercase'}}>Deals</div>
            <div style={{fontSize:24,fontWeight:700,color:'var(--offwhite)',lineHeight:1}}>{String(score).padStart(3,'0')}</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:10,color:'var(--muted)',letterSpacing:'0.1em',textTransform:'uppercase'}}>Best</div>
            <div style={{fontSize:24,fontWeight:700,color:'var(--teal)',lineHeight:1}}>{String(best).padStart(3,'0')}</div>
          </div>
        </div>
      </div>

      <div id='game-container' style={{position:'relative',border:'1px solid var(--border)',borderRadius:6,overflow:'hidden'}}>
        <canvas ref={canvasRef} width={CW} height={CH} style={{display:'block',width:'100%',imageRendering:'pixelated'}}/>

        {gameOver&&(
          <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'rgba(6,10,16,0.75)'}}>
            <div style={{background:'rgba(12,13,15,0.97)',border:'1px solid var(--border)',borderRadius:8,padding:'28px 40px',display:'flex',flexDirection:'column',alignItems:'center',gap:16,minWidth:220}}>
              <div style={{fontSize:18,fontWeight:700,color:'#ff5555',letterSpacing:'0.08em',fontFamily:'monospace'}}>GAME OVER</div>
              <div style={{display:'flex',gap:32,marginTop:4}}>
                <div style={{textAlign:'center'}}>
                  <div style={{fontSize:9,color:'var(--muted)',letterSpacing:'0.12em',textTransform:'uppercase',fontFamily:'monospace'}}>Score</div>
                  <div style={{fontSize:28,fontWeight:700,color:'var(--offwhite)',fontFamily:'monospace',lineHeight:1.2}}>{score}</div>
                </div>
                <div style={{textAlign:'center'}}>
                  <div style={{fontSize:9,color:'var(--muted)',letterSpacing:'0.12em',textTransform:'uppercase',fontFamily:'monospace'}}>Best</div>
                  <div style={{fontSize:28,fontWeight:700,color:'var(--teal)',fontFamily:'monospace',lineHeight:1.2}}>{best}</div>
                </div>
              </div>
              <div style={{fontSize:10,color:'var(--muted)',fontFamily:'monospace'}}>{score>=100?'🔥 Level 3':score>=50?'⚡ Level 2':'🍌 Level 1'}</div>
              <button onClick={()=>{
              stateRef.current=initState(); setScore(0); setGameOver(false); setStarted(true); setRestartKey(k=>k+1)
              if(musicRef.current){ musicRef.current.currentTime=0; musicRef.current.play().catch(()=>{}) }
            }}
                style={{marginTop:4,padding:'9px 32px',background:'var(--offwhite)',color:'var(--bg)',border:'none',borderRadius:4,fontSize:12,fontWeight:700,fontFamily:'monospace',cursor:'pointer',letterSpacing:'0.1em'}}
                onMouseEnter={e=>e.currentTarget.style.opacity='.85'}
                onMouseLeave={e=>e.currentTarget.style.opacity='1'}>RETRY</button>
            </div>
          </div>
        )}

        {!started&&!gameOver&&(
          <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'rgba(6,10,16,0.82)',gap:10}}>
            <div style={{fontSize:13,fontWeight:600,color:'var(--offwhite)',letterSpacing:'0.06em'}}>MIKE'S SUBDIVISION RUN</div>
            <div style={{fontSize:11,color:'var(--silver)',fontFamily:'monospace'}}>Drive through the neighborhood & bump realtors to close deals</div>
            <div style={{fontSize:10,color:'var(--muted)',fontFamily:'monospace'}}>Avoid banana peels &amp; seagulls — gets faster every 50 deals</div>
            <div style={{fontSize:10,color:P.teal,fontFamily:'monospace',marginTop:8,letterSpacing:'0.12em'}}>PRESS ANY KEY TO START</div>
          </div>
        )}
      </div>

      {/* Mobile controls */}
      <div style={{marginTop:12,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
        <div style={{display:'flex',gap:8}}>
          {/* Left */}
          <button
            onTouchStart={e=>{e.preventDefault();mobileLeft()}}
            onTouchEnd={e=>{e.preventDefault();mobileStop()}}
            onMouseDown={mobileLeft} onMouseUp={mobileStop} onMouseLeave={mobileStop}
            style={{width:52,height:52,borderRadius:8,border:'1px solid var(--border)',background:'rgba(255,255,255,0.06)',color:'var(--offwhite)',fontSize:20,cursor:'pointer',userSelect:'none',touchAction:'none'}}>◀</button>
          {/* Right */}
          <button
            onTouchStart={e=>{e.preventDefault();mobileRight()}}
            onTouchEnd={e=>{e.preventDefault();mobileStop()}}
            onMouseDown={mobileRight} onMouseUp={mobileStop} onMouseLeave={mobileStop}
            style={{width:52,height:52,borderRadius:8,border:'1px solid var(--border)',background:'rgba(255,255,255,0.06)',color:'var(--offwhite)',fontSize:20,cursor:'pointer',userSelect:'none',touchAction:'none'}}>▶</button>
        </div>

        {/* Keyboard hints — hidden on small screens */}
        <div style={{display:'flex',gap:16,flexWrap:'wrap',justifyContent:'center'}}>
          {[['← →','Drive'],['Space / ↑','Jump']].map(([k,v])=>(
            <div key={k} style={{fontSize:10,color:'var(--muted)',fontFamily:'monospace'}}>
              <span style={{color:'var(--silver)'}}>{k}</span> — {v}
            </div>
          ))}
        </div>

        <div style={{display:'flex',gap:8}}>
          {/* Jump */}
          <button
            onTouchStart={e=>{e.preventDefault();mobileJump()}}
            onMouseDown={mobileJump}
            style={{width:52,height:52,borderRadius:8,border:'1px solid var(--border)',background:'rgba(255,255,255,0.06)',color:'var(--offwhite)',fontSize:13,fontWeight:600,cursor:'pointer',userSelect:'none',touchAction:'none',fontFamily:'monospace'}}>JUMP</button>
          {/* Mute */}
          <button
            onClick={toggleMute}
            title={muted?'Unmute':'Mute'}
            style={{width:52,height:52,borderRadius:8,border:'1px solid var(--border)',background:muted?'rgba(255,80,80,0.12)':'rgba(255,255,255,0.06)',color:'var(--offwhite)',fontSize:18,cursor:'pointer',userSelect:'none'}}>
            {muted?'🔇':'🔊'}
          </button>
          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            title="Fullscreen"
            style={{width:52,height:52,borderRadius:8,border:'1px solid var(--border)',background:'rgba(255,255,255,0.06)',color:'var(--offwhite)',fontSize:16,cursor:'pointer',userSelect:'none'}}>⛶</button>
        </div>
      </div>
    </section>
  )
}
