import { useEffect, useRef } from 'react'

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0, 1); }
`

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_click0; uniform float u_ctime0;
uniform vec2 u_click1; uniform float u_ctime1;
uniform vec2 u_click2; uniform float u_ctime2;

vec2 hash2(vec2 p) {
  p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(
    mix(dot(hash2(i+vec2(0,0)),f-vec2(0,0)), dot(hash2(i+vec2(1,0)),f-vec2(1,0)), u.x),
    mix(dot(hash2(i+vec2(0,1)),f-vec2(0,1)), dot(hash2(i+vec2(1,1)),f-vec2(1,1)), u.x),
    u.y);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  uv.y = 1.0 - uv.y;
  float ar = u_res.x / u_res.y;
  vec2 p = uv * vec2(ar, 1.0);
  float t = u_time * 0.20;

  vec2 disturbance = vec2(0.0);
  float duration = 2.2;

  vec2 cpos[3];
  float ctimes[3];
  cpos[0] = u_click0; ctimes[0] = u_ctime0;
  cpos[1] = u_click1; ctimes[1] = u_ctime1;
  cpos[2] = u_click2; ctimes[2] = u_ctime2;

  for (int i = 0; i < 3; i++) {
    float age = u_time - ctimes[i];
    if (age < 0.0 || age > duration) continue;
    float surge  = exp(-age * 3.0);
    float settle = exp(-age * 0.8) * 0.3;
    float fade   = surge + settle;
    vec2 cp = cpos[i] * vec2(ar, 1.0);
    vec2 diff = p - cp;
    float d = length(diff);
    float influence = exp(-d * 8.0);
    vec2 pushDir = d > 0.001 ? normalize(diff) : vec2(0.0);
    vec2 swirl = vec2(-pushDir.y, pushDir.x);
    float centerFade = smoothstep(0.0, 0.06, d);
    disturbance += (pushDir * 0.22 + swirl * 0.08) * influence * fade * centerFade;
  }

  vec2 pd = p - disturbance;

  vec2 q = vec2(
    noise(pd * 1.2 + vec2(t*0.30, t*0.15)),
    noise(pd * 1.2 + vec2(t*0.20, t*0.35) + 4.3)
  );
  vec2 r = vec2(
    noise(pd * 2.8 + 2.2*q + vec2(t*0.55, t*0.10)),
    noise(pd * 2.8 + 2.2*q + vec2(t*0.10, t*0.50) + 7.1)
  );
  vec2 s = vec2(
    noise(pd * 5.5 + 2.0*r + vec2(t*0.80, 0.0)),
    noise(pd * 5.5 + 2.0*r + vec2(0.0, t*0.65) + 3.7)
  );

  float eps = 0.008;
  float hx = noise((pd+vec2(eps,0.0))*3.2 + 1.5*r + t*0.25)
           - noise((pd-vec2(eps,0.0))*3.2 + 1.5*r + t*0.25);
  float hy = noise((pd+vec2(0.0,eps))*3.2 + 1.5*r + t*0.25)
           - noise((pd-vec2(0.0,eps))*3.2 + 1.5*r + t*0.25);
  vec3 normal = normalize(vec3(-hx*6.0, -hy*6.0, 1.0));

  vec3 lightDir = normalize(vec3(-0.4, -0.6, 1.0));
  float diff2 = max(dot(normal, lightDir), 0.0);
  vec3 halfVec = normalize(lightDir + vec3(0.0, 0.0, 1.0));
  float spec      = pow(max(dot(normal, halfVec), 0.0), 28.0);
  float specSharp = pow(max(dot(normal, halfVec), 0.0), 120.0);

  vec3 base   = vec3(0.047, 0.051, 0.059);
  vec3 mid    = vec3(0.068, 0.072, 0.082);
  vec3 silver = vec3(0.68,  0.70,  0.75);

  vec3 col = mix(base, mid, diff2 * 0.35);
  col += silver * spec      * 0.30;
  col += silver * specSharp * 0.25;

  float vign = uv.x*(1.0-uv.x)*uv.y*(1.0-uv.y);
  col *= pow(vign*16.0, 0.4)*0.6 + 0.4;

  gl_FragColor = vec4(col, 1.0);
}
`

// Detect low-end device
const isLowEnd = () => {
  const cores = navigator.hardwareConcurrency || 4
  const memory = navigator.deviceMemory || 4
  const mobile = /Mobi|Android/i.test(navigator.userAgent)
  return cores <= 4 || memory <= 4 || (mobile && cores <= 6)
}

export default function HeroFluid() {
  const canvasRef = useRef(null)
  const rafRef    = useRef(null)
  const clicksRef = useRef([])
  const lowEnd    = isLowEnd()

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas.getContext('webgl', { antialias: false })
    if (!gl) return

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const onClick = (e) => {
      if (lowEnd) return
      if (e.clientY > window.innerHeight) return
      const x = e.clientX / window.innerWidth
      const y = e.clientY / window.innerHeight
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

    const uRes    = gl.getUniformLocation(prog, 'u_res')
    const uTime   = gl.getUniformLocation(prog, 'u_time')
    const uClicks = [0,1,2].map(i => ({
      pos:  gl.getUniformLocation(prog, `u_click${i}`),
      time: gl.getUniformLocation(prog, `u_ctime${i}`),
    }))

    const start = performance.now()

    const draw = (t) => {
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, t)
      const clicks = clicksRef.current
      for (let i = 0; i < 3; i++) {
        const ck = clicks[i]
        gl.uniform2f(uClicks[i].pos,  ck ? ck.x : -1.0, ck ? ck.y : -1.0)
        gl.uniform1f(uClicks[i].time, ck ? ck.t : -999.0)
      }
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    if (lowEnd) {
      // Draw once at a nice moment and stop — zero ongoing CPU/GPU cost
      draw(3.5)
    } else {
      const tick = () => {
        draw((performance.now() - start) * 0.001)
        rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('click', onClick)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        background: 'rgba(12,13,15,0.55)',
      }} />
    </>
  )
}
