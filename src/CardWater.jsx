import { useEffect, useRef } from 'react'

const VERT = `attribute vec2 a_pos; void main(){gl_Position=vec4(a_pos,0,1);}`

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_click0; uniform float u_ctime0;
uniform vec2 u_click1; uniform float u_ctime1;
uniform vec2 u_click2; uniform float u_ctime2;

vec2 hash2(vec2 p){p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));return -1.0+2.0*fract(sin(p)*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);return mix(mix(dot(hash2(i),f),dot(hash2(i+vec2(1,0)),f-vec2(1,0)),u.x),mix(dot(hash2(i+vec2(0,1)),f-vec2(0,1)),dot(hash2(i+vec2(1,1)),f-vec2(1,1)),u.x),u.y);}

void main(){
  vec2 uv = gl_FragCoord.xy/u_res;
  uv.y = 1.0 - uv.y;
  float ar = u_res.x/u_res.y;
  vec2 p = uv*vec2(ar,1.0);
  float t = u_time*0.20;

  vec2 disturbance = vec2(0.0);
  float duration = 2.2;
  vec2 cpos[3]; float ctimes[3];
  cpos[0]=u_click0; ctimes[0]=u_ctime0;
  cpos[1]=u_click1; ctimes[1]=u_ctime1;
  cpos[2]=u_click2; ctimes[2]=u_ctime2;

  for(int i=0;i<3;i++){
    float age = u_time - ctimes[i];
    if(age<0.0||age>duration) continue;
    float fade = exp(-age*1.5)*(1.0-age/duration);
    vec2 cp = cpos[i]*vec2(ar,1.0);
    vec2 diff = p - cp;
    float d = length(diff);
    float influence = exp(-d*8.0);
    vec2 pushDir = d>0.001 ? normalize(diff) : vec2(0.0);
    vec2 swirl = vec2(-pushDir.y, pushDir.x);
    float centerFade = smoothstep(0.0,0.06,d);
    disturbance += (pushDir*0.22+swirl*0.08)*influence*fade*centerFade;
  }

  vec2 pd = p - disturbance;

  vec2 q = vec2(noise(pd*1.2+vec2(t*.30,t*.15)),noise(pd*1.2+vec2(t*.20,t*.35)+4.3));
  vec2 r = vec2(noise(pd*2.8+2.2*q+vec2(t*.55,t*.10)),noise(pd*2.8+2.2*q+vec2(t*.10,t*.50)+7.1));

  float eps=0.008;
  float hx=noise((pd+vec2(eps,0.0))*3.2+1.5*r+t*.25)-noise((pd-vec2(eps,0.0))*3.2+1.5*r+t*.25);
  float hy=noise((pd+vec2(0.0,eps))*3.2+1.5*r+t*.25)-noise((pd-vec2(0.0,eps))*3.2+1.5*r+t*.25);
  vec3 n=normalize(vec3(-hx*6.,-hy*6.,1.));
  vec3 l=normalize(vec3(-.4,-.6,1.));
  vec3 h2=normalize(l+vec3(0,0,1));
  float spec=pow(max(dot(n,h2),0.),28.);
  float specS=pow(max(dot(n,h2),0.),120.);

  vec3 silver=vec3(0.68,0.70,0.75);
  float brightness = spec*0.30 + specS*0.25;
  vec3 col = silver * brightness;
  float alpha = clamp(brightness * 3.0, 0.0, 0.85);
  gl_FragColor=vec4(col, alpha);
}
`

export default function CardWater() {
  const canvasRef = useRef(null)
  const rafRef    = useRef(null)
  const clicksRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false })
    if (!gl) return

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width  = Math.max(rect.width,  1)
      canvas.height = Math.max(rect.height, 1)
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const onClick = (e) => {
      const rect = canvas.getBoundingClientRect()
      if (e.clientX < rect.left || e.clientX > rect.right) return
      if (e.clientY < rect.top  || e.clientY > rect.bottom) return
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top)  / rect.height
      const now = (performance.now() - start) * 0.001
      clicksRef.current.push({ x, y, t: now })
      if (clicksRef.current.length > 3) clicksRef.current.shift()
    }
    window.addEventListener('click', onClick)

    const compile = (type, src) => {
      const s = gl.createShader(type)
      gl.shaderSource(s, src); gl.compileShader(s); return s
    }
    const prog = gl.createProgram()
    gl.attachShader(prog, compile(gl.VERTEX_SHADER,   VERT))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog); gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    const uRes    = gl.getUniformLocation(prog, 'u_res')
    const uTime   = gl.getUniformLocation(prog, 'u_time')
    const uClicks = [0,1,2].map(i => ({
      pos:  gl.getUniformLocation(prog, `u_click${i}`),
      time: gl.getUniformLocation(prog, `u_ctime${i}`),
    }))

    const start = performance.now()
    const tick = () => {
      const t = (performance.now() - start) * 0.001
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, t)
      const clicks = clicksRef.current
      for (let i = 0; i < 3; i++) {
        const ck = clicks[i]
        gl.uniform2f(uClicks[i].pos,  ck ? ck.x : -1.0, ck ? ck.y : -1.0)
        gl.uniform1f(uClicks[i].time, ck ? ck.t : -999.0)
      }
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('click', onClick)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 2,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  )
}
