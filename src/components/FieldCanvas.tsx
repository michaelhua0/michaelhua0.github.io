import { useEffect, useRef, useState } from "react";
import "./field.css";

/* ============================================================
   FieldCanvas — one continuous, living atmosphere behind the
   whole landing page. A WebGL fragment shader renders a graded
   sky with a warm/teal horizon, a sun bloom, a drifting sea of
   clouds and a scatter of stars. It reacts to the pointer and to
   scroll (the horizon rises and the clouds sink as you descend),
   so the entire page reads as a single interactive scene.
   Degrades to a static frame under reduced-motion and to a CSS
   gradient if WebGL is unavailable.
   ============================================================ */

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_mouse;   // 0..1
uniform float u_active;
uniform float u_scroll;  // 0..1.5 scroll progress

float hash(vec2 p){
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p){
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
const mat2 M = mat2(1.62, 1.18, -1.18, 1.62);
float fbm(vec2 p){
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 6; i++){
    v += a * noise(p);
    p = M * p;
    a *= 0.5;
  }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  float aspect = u_res.x / u_res.y;
  float scroll = clamp(u_scroll, 0.0, 1.5);

  float horizonY = 0.44 - scroll * 0.10;

  // --- sky ---
  vec3 zenith = vec3(0.012, 0.018, 0.038);
  vec3 midsky = vec3(0.045, 0.065, 0.10);
  vec3 sky = mix(midsky, zenith, smoothstep(horizonY, 1.05, uv.y));

  vec2 sun = vec2(0.66 + (u_mouse.x - 0.5) * 0.06, horizonY + 0.015);
  vec2 auv = vec2(uv.x * aspect, uv.y);
  float sd = distance(auv, vec2(sun.x * aspect, sun.y));

  vec3 warm = vec3(0.98, 0.63, 0.28);
  vec3 teal = vec3(0.09, 0.74, 0.66);

  float hb = exp(-abs(uv.y - horizonY) * 7.5);
  vec3 hglow = mix(teal, warm, smoothstep(0.15, 0.9, uv.x));
  sky += hglow * hb * 0.5;

  sky += warm * exp(-sd * 4.5) * 0.75;
  sky += warm * exp(-sd * 1.3) * 0.10;

  float pd = distance(auv, vec2(u_mouse.x * aspect, u_mouse.y));
  sky += teal * u_active * exp(-pd * 3.2) * 0.22;

  vec3 col = sky;

  // --- sea of clouds ---
  float t = u_time * 0.014;
  float belowness = smoothstep(horizonY + 0.06, horizonY - 0.55, uv.y);
  vec2 cp = vec2(uv.x * aspect, uv.y);
  cp.x *= mix(3.2, 1.15, belowness);
  cp.y *= 2.3;
  cp.x += t * mix(0.5, 1.4, belowness) + scroll * 0.25;
  cp.y -= scroll * 0.6 + t * 0.2;
  float warpn = fbm(cp * 0.6 + t);
  float dns = fbm(cp + warpn * 1.3);

  float body = smoothstep(0.52, 0.92, dns);
  float vmask = smoothstep(horizonY + 0.14, horizonY - 0.4, uv.y);
  float mask = body * vmask;

  float distant = smoothstep(0.6, 0.86, fbm(cp * vec2(1.0, 3.2) + t * 0.6))
                  * exp(-abs(uv.y - horizonY - 0.03) * 11.0);
  mask = max(mask, distant * 0.55);

  float lit = smoothstep(0.5, 0.96, dns);
  vec3 cloudDark = vec3(0.05, 0.07, 0.12);
  vec3 cloudLit  = vec3(0.92, 0.74, 0.52);
  vec3 cloudCol = mix(cloudDark, cloudLit, lit);
  cloudCol = mix(cloudCol, warm * 1.15, lit * exp(-sd * 2.2) * 0.6);
  col = mix(col, cloudCol, clamp(mask, 0.0, 1.0));

  // foreground mist
  float mist = smoothstep(0.16, -0.02, uv.y) * (0.4 + 0.6 * fbm(vec2(uv.x * 3.0 + t, uv.y * 4.0)));
  col = mix(col, vec3(0.04, 0.06, 0.10), clamp(mist, 0.0, 1.0) * 0.55);

  // stars in the upper sky
  vec2 gp = floor(uv * u_res.xy / 2.6);
  float star = step(0.9972, hash(gp)) * smoothstep(horizonY + 0.12, 1.0, uv.y);
  col += vec3(0.8, 0.86, 1.0) * star * (0.4 + 0.6 * sin(u_time * 2.0 + hash(gp) * 30.0));

  // grade + vignette + grain
  col = pow(max(col, 0.0), vec3(0.94));
  float vig = smoothstep(1.35, 0.35, distance(uv, vec2(0.5, 0.5)));
  col *= 0.62 + 0.38 * vig;
  float g = hash(uv * u_res.xy + fract(u_time));
  col += (g - 0.5) * 0.018;

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export default function FieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const gl = (canvas.getContext("webgl", { antialias: false, alpha: false, depth: false }) ||
      canvas.getContext("experimental-webgl", { antialias: false, alpha: false })) as
      | WebGLRenderingContext
      | null;
    if (!gl) {
      setFailed(true);
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) {
      setFailed(true);
      return;
    }
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setFailed(true);
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uActive = gl.getUniformLocation(prog, "u_active");
    const uScroll = gl.getUniformLocation(prog, "u_scroll");

    let W = 0;
    let H = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = Math.max(1, Math.round(window.innerWidth * dpr));
      H = Math.max(1, Math.round(window.innerHeight * dpr));
      canvas.width = W;
      canvas.height = H;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      gl.viewport(0, 0, W, H);
      gl.uniform2f(uRes, W, H);
    };
    resize();

    const mouse = { x: 0.5, y: 0.55, tx: 0.5, ty: 0.55, a: 0, ta: 0 };
    const scroll = { v: 0, t: 0 };

    const onMove = (e: PointerEvent) => {
      mouse.tx = e.clientX / window.innerWidth;
      mouse.ty = 1 - e.clientY / window.innerHeight;
      mouse.ta = 1;
    };
    const onLeave = () => {
      mouse.ta = 0;
    };
    const onScroll = () => {
      scroll.t = Math.min(1.5, window.scrollY / Math.max(1, window.innerHeight));
    };
    onScroll();

    if (!reduced) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    window.addEventListener("resize", resize);

    const start = performance.now();
    let raf = 0;
    let running = false;

    const draw = (t: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      mouse.a += (mouse.ta - mouse.a) * 0.04;
      scroll.v += (scroll.t - scroll.v) * 0.08;
      gl.uniform1f(uTime, t);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uActive, mouse.a);
      gl.uniform1f(uScroll, scroll.v);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now: number) => {
      draw((now - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    const startLoop = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    if (reduced) {
      gl.uniform1f(uTime, 8.0);
      gl.uniform2f(uMouse, 0.5, 0.55);
      gl.uniform1f(uActive, 0);
      gl.uniform1f(uScroll, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    } else {
      startLoop();
    }

    const onVis = () => {
      if (reduced) return;
      if (document.hidden) stopLoop();
      else startLoop();
    };
    document.addEventListener("visibilitychange", onVis);

    const onLost = (e: Event) => {
      e.preventDefault();
      stopLoop();
      setFailed(true);
    };
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      stopLoop();
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("webglcontextlost", onLost);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <div className={`field ${failed ? "field--fallback" : ""}`} aria-hidden="true">
      <canvas ref={canvasRef} className="field__canvas" />
    </div>
  );
}
