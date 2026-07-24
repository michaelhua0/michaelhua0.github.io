import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { site } from "../data/site";
import "./hero.css";

/* ============================================================
   Hero — a cinematic, mouse-reactive spectral field.
   A full-screen WebGL fragment shader renders domain-warped
   flowing light in the site palette (teal-green research +
   amber history), evoking "decoding light into bands."
   Falls back to a static gradient when WebGL is unavailable
   or the visitor prefers reduced motion.
   ============================================================ */

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_mouse;      // 0..1, y flipped to match uv
uniform float u_active;     // 0..1 pointer influence

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
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

  float t = u_time * 0.045;

  // pointer warps the field toward the cursor
  vec2 m = (u_mouse - 0.5) * vec2(aspect, 1.0);
  float md = length(p - m);
  float pull = u_active * exp(-md * 2.4) * 0.35;

  vec2 sp = p * 1.6 + vec2(0.0, t * 0.6);

  // domain warping (IQ-style) for liquid, flowing structure
  vec2 q = vec2(fbm(sp + t), fbm(sp + vec2(5.2, 1.3)));
  vec2 r = vec2(
    fbm(sp + 2.2 * q + vec2(1.7, 9.2) + t * 1.1),
    fbm(sp + 2.2 * q + vec2(8.3, 2.8) - t * 0.9)
  );
  r += (m - p) * pull;
  float f = fbm(sp + 3.4 * r);

  // ---- spectral palette ----
  vec3 deep  = vec3(0.020, 0.028, 0.052);  // near-black navy
  vec3 ink   = vec3(0.043, 0.055, 0.078);  // --ink
  vec3 teal  = vec3(0.071, 0.710, 0.643);  // --band-teal
  vec3 green = vec3(0.247, 0.749, 0.373);  // --band-green
  vec3 amber = vec3(0.878, 0.631, 0.000);  // --band-amber
  vec3 bright= vec3(0.133, 0.827, 0.753);  // --research-bright

  vec3 col = mix(deep, ink, clamp(f * 1.3, 0.0, 1.0));

  float ribbon = smoothstep(0.35, 0.9, f + length(q) * 0.4);
  col = mix(col, teal, ribbon * 0.68);
  col = mix(col, green, clamp(r.x * r.x * 1.4, 0.0, 1.0) * 0.5);

  // warm amber accent, biased to one region for balance
  float warm = smoothstep(0.55, 1.0, r.y + 0.15) * smoothstep(0.0, 0.6, uv.x);
  col = mix(col, amber, warm * 0.28);

  // luminous filaments where the warp folds sharply
  float fil = pow(clamp(1.0 - abs(f - 0.55) * 3.2, 0.0, 1.0), 2.0);
  col += bright * fil * 0.28;

  // pointer bloom
  col += bright * u_active * exp(-md * 3.4) * 0.38;

  // starfield — faint drifting motes
  vec2 gp = uv * u_res.xy / 2.2;
  float star = hash(floor(gp));
  float tw = 0.5 + 0.5 * sin(u_time * 1.5 + star * 30.0);
  float dot = step(0.9965, hash(floor(gp) + 3.1));
  col += vec3(0.7, 0.85, 1.0) * dot * tw * 0.5;

  // cinematic vignette
  float vig = smoothstep(1.25, 0.35, length((uv - 0.5) * vec2(aspect, 1.0)));
  col *= 0.55 + 0.45 * vig;

  // subtle grain to kill banding
  float g = hash(uv * u_res.xy + fract(u_time));
  col += (g - 0.5) * 0.025;

  gl_FragColor = vec4(col, 1.0);
}
`;

const DESTS = [
  { to: "/portfolio", n: "01", label: "Portfolio", desc: "Research, software, and film" },
  {
    to: "/publications",
    n: "02",
    label: "Publications",
    desc: "Peer-reviewed and competition papers",
  },
  { to: "/about", n: "03", label: "About", desc: "Research interests and background" },
];
const CYCLE_MS = 3400;

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

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    if (!canvas || !hero) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const gl = (canvas.getContext("webgl", { antialias: false, alpha: false }) ||
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

    // full-screen triangle
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

    let W = 0;
    let H = 0;
    const resize = () => {
      const rect = hero.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      W = Math.max(1, Math.round(rect.width * dpr));
      H = Math.max(1, Math.round(rect.height * dpr));
      canvas.width = W;
      canvas.height = H;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      gl.viewport(0, 0, W, H);
      gl.uniform2f(uRes, W, H);
    };
    resize();

    // pointer — targets are lerped for buttery motion
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, a: 0, ta: 0 };
    const onMove = (e: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      mouse.tx = (e.clientX - rect.left) / rect.width;
      mouse.ty = 1 - (e.clientY - rect.top) / rect.height;
      mouse.ta = 1;
    };
    const onLeave = () => {
      mouse.ta = 0;
    };
    if (!reduced) {
      hero.addEventListener("pointermove", onMove);
      hero.addEventListener("pointerleave", onLeave);
      hero.addEventListener("pointerdown", onMove);
    }

    const start = performance.now();
    let raf = 0;
    let running = false;

    const render = (now: number) => {
      const t = (now - start) / 1000;
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      mouse.a += (mouse.ta - mouse.a) * 0.05;
      gl.uniform1f(uTime, t);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uActive, mouse.a);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(render);
    };

    const startLoop = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(render);
    };
    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    if (reduced) {
      // one composed static frame
      gl.uniform1f(uTime, 12.0);
      gl.uniform2f(uMouse, 0.5, 0.5);
      gl.uniform1f(uActive, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    const onResize = () => {
      resize();
      if (reduced) {
        gl.uniform1f(uTime, 12.0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
    };
    window.addEventListener("resize", onResize);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (reduced) return;
        if (entry.isIntersecting && !document.hidden) startLoop();
        else stopLoop();
      },
      { threshold: 0.02 },
    );
    io.observe(hero);
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

    if (!reduced) startLoop();

    return () => {
      stopLoop();
      io.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("webglcontextlost", onLost);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      hero.removeEventListener("pointerdown", onMove);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  // Auto-cycling destination band — draws the eye toward the site's sections.
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (paused) return;
    const id = window.setInterval(() => {
      setActive((a) => (a + 1) % DESTS.length);
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [paused, active]);

  const [w1, w2] = site.name.split(" ");
  const roleParts = site.role.split("·").map((s) => s.trim());

  return (
    <section
      ref={heroRef}
      className={`hero ${failed ? "hero--fallback" : ""}`}
      aria-label="Introduction"
    >
      <canvas ref={canvasRef} className="hero__canvas" aria-hidden="true" />
      <div className="hero__scrim" aria-hidden="true" />

      {/* corner data readouts — tech texture */}
      <div className="hero__hud hero__hud--tl" aria-hidden="true">
        <span>SPECTRAL&nbsp;FIELD</span>
        <span>λ 400–700 nm</span>
      </div>
      <div className="hero__hud hero__hud--tr" aria-hidden="true">
        <span>EST. 2024</span>
        <span>CRANBROOK, MI</span>
      </div>

      <div className="hero__content">
        <p className="hero__eyebrow">
          <span className="spectral-tick" aria-hidden="true">
            <i /><i /><i /><i /><i /><i />
          </span>
          <span className="hero__eyebrow-text">
            {roleParts.map((r, i) => (
              <span key={r}>
                {r}
                {i < roleParts.length - 1 && <b aria-hidden="true">·</b>}
              </span>
            ))}
          </span>
        </p>

        <h1 className="hero__title">
          <span className="hero__word" style={{ animationDelay: "0.05s" }}>
            {w1}
          </span>{" "}
          <span className="hero__word hero__word--accent" style={{ animationDelay: "0.18s" }}>
            {w2}
          </span>
        </h1>

        <p className="hero__lede">
          My work connects <em>computer vision</em> and <em>hyperspectral imaging</em> with
          software development, documentary research, and public service.
        </p>
      </div>

      {/* Auto-cycling destination band — animated wayfinding into the site. */}
      <nav
        className="hero__wayfind"
        aria-label="Explore the site"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        {DESTS.map((d, i) => (
          <Link
            key={d.to}
            to={d.to}
            className={`hero__way ${i === active ? "is-active" : ""}`}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
          >
            <span className="hero__way-n" aria-hidden="true">
              {d.n}
            </span>
            <span className="hero__way-text">
              <span className="hero__way-label">{d.label}</span>
              <span className="hero__way-desc">{d.desc}</span>
            </span>
            <span className="hero__way-arrow" aria-hidden="true">
              →
            </span>
            {i === active && (
              <span key={active} className="hero__way-prog" aria-hidden="true" />
            )}
          </Link>
        ))}
      </nav>

      <a href="#explore" className="hero__scroll" aria-label="Scroll to explore">
        <span>Scroll</span>
        <svg viewBox="0 0 16 24" width="13" height="19" aria-hidden="true">
          <path
            d="M8 2v18M2 14l6 6 6-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </section>
  );
}
