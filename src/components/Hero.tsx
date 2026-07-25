import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { site } from "../data/site";
import "./hero.css";

/* ============================================================
   Hero — an interactive spectral decomposition field.
   A full-screen WebGL shader renders a dark, structured noise
   field that the cursor acts on like a detector: it lenses the
   field, splits it into discrete measurement bands (à la a
   spectrometer decoding incoming light), and disperses those
   bands into RGB fringing near the pointer — a literal reading
   of "decoding light" rather than a generic flowing blob.
   A pushbroom scanline sweeps the frame. Falls back to a static
   gradient when WebGL is unavailable or the visitor prefers
   reduced motion.
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

const float BANDS = 6.0;

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
  for (int i = 0; i < 5; i++){
    v += a * noise(p);
    p = M * p;
    a *= 0.5;
  }
  return v;
}

// domain-warped scalar field (IQ-style) sampled at a given point
float fieldAt(vec2 sp, float t){
  vec2 q = vec2(fbm(sp + t), fbm(sp + vec2(4.2, 1.8) - t * 0.6));
  vec2 r = vec2(
    fbm(sp + 2.0 * q + vec2(1.2, 7.5) + t * 0.9),
    fbm(sp + 2.0 * q + vec2(8.1, 3.0) - t * 0.7)
  );
  return fbm(sp + 3.0 * r);
}

// six-stop spectral ramp: violet -> blue -> teal -> green -> amber -> ember
vec3 spectralRamp(float x){
  vec3 violet = vec3(0.078, 0.043, 0.208);
  vec3 blue   = vec3(0.071, 0.302, 0.647);
  vec3 teal   = vec3(0.071, 0.710, 0.643);
  vec3 green  = vec3(0.247, 0.749, 0.373);
  vec3 amber  = vec3(0.878, 0.631, 0.000);
  vec3 ember  = vec3(0.950, 0.300, 0.120);

  float seg = clamp(x, 0.0, 1.0) * 5.0;
  vec3 c = violet;
  c = mix(c, blue,  clamp(seg - 0.0, 0.0, 1.0));
  c = mix(c, teal,  clamp(seg - 1.0, 0.0, 1.0));
  c = mix(c, green, clamp(seg - 2.0, 0.0, 1.0));
  c = mix(c, amber, clamp(seg - 3.0, 0.0, 1.0));
  c = mix(c, ember, clamp(seg - 4.0, 0.0, 1.0));
  return c;
}

float quantize(float f){
  return floor(clamp(f, 0.0, 0.999) * BANDS) / BANDS * (BANDS / (BANDS - 1.0));
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  float aspect = u_res.x / u_res.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  float t = u_time * 0.045;

  // ---- cursor as lens: bends sampled space toward the pointer ----
  vec2 m = (u_mouse - 0.5) * vec2(aspect, 1.0);
  vec2 toM = p - m;
  float mDist = length(toM) + 1e-4;
  vec2 mDir = toM / mDist;
  float lens = u_active * 0.5 * exp(-mDist * 2.6);
  vec2 pd = p + (m - p) * lens;

  vec2 sp = pd * 1.7 + vec2(0.0, t * 0.5);

  // ---- chromatic dispersion: sample R/G/B slightly apart, radial to the cursor ----
  // (light literally splitting into its component bands near the "detector")
  float dispAmt = u_active * 0.05 * exp(-mDist * 2.0);
  float fR = fieldAt(sp + mDir * dispAmt, t);
  float fG = fieldAt(sp, t);
  float fB = fieldAt(sp - mDir * dispAmt, t);

  vec3 colR = spectralRamp(quantize(fR));
  vec3 colG = spectralRamp(quantize(fG));
  vec3 colB = spectralRamp(quantize(fB));
  vec3 spectral = vec3(colR.r, colG.g, colB.b);

  // ---- dark instrument base, spectrum revealed where the field resolves ----
  vec3 deep = vec3(0.020, 0.028, 0.052);
  vec3 ink  = vec3(0.043, 0.055, 0.078);
  vec3 base = mix(deep, ink, smoothstep(0.0, 0.6, fG));

  float reveal = smoothstep(0.16, 0.85, fG);
  reveal = max(reveal, u_active * exp(-mDist * 2.0) * 0.9);
  vec3 col = mix(base, spectral, reveal * 0.85);

  // ---- absorption lines: crisp dark seams at each discrete band boundary ----
  float edge = fract(fG * BANDS);
  float edgeDist = min(edge, 1.0 - edge);
  float absorb = 1.0 - smoothstep(0.0, 0.05, edgeDist);
  col *= (1.0 - absorb * 0.55);

  vec3 bright = vec3(0.133, 0.827, 0.753); // --research-bright

  // luminous filaments where the field folds sharply
  float fil = pow(clamp(1.0 - abs(fG - 0.55) * 3.2, 0.0, 1.0), 2.0);
  col += bright * fil * 0.22;

  // pointer bloom
  col += bright * u_active * exp(-mDist * 3.4) * 0.32;

  // ---- pushbroom scanline: a hyperspectral sensor sweeping the frame ----
  float scanY = fract(u_time * 0.05);
  float scanDist = abs(uv.y - scanY);
  float scanLine = exp(-scanDist * 220.0);
  float scanGlow = exp(-scanDist * 18.0) * 0.15;
  float ticks = step(0.982, fract(uv.x * 90.0));
  col += vec3(0.75, 0.92, 1.0) * (scanLine * 0.9 + scanGlow * ticks);

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
  const probeRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const ledeRef = useRef<HTMLParagraphElement>(null);
  const wayfindRef = useRef<HTMLElement>(null);
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
    let cssW = 0;
    let cssH = 0;
    // regions (in hero-local px) where the cursor probe stays hidden — tight
    // boxes around the rendered glyphs (not the full-width centered blocks
    // that contain them) so the readout covers as much open field as
    // possible and only hides right on top of actual text.
    type Rect = { left: number; top: number; right: number; bottom: number };
    let excludeRects: Rect[] = [];
    const computeExcludeRects = () => {
      const heroRect = hero.getBoundingClientRect();
      const rects: Rect[] = [];
      const addRect = (r: { left: number; top: number; right: number; bottom: number } | null, pad: number) => {
        if (!r) return;
        rects.push({
          left: r.left - heroRect.left - pad,
          top: r.top - heroRect.top - pad,
          right: r.right - heroRect.left + pad,
          bottom: r.bottom - heroRect.top + pad,
        });
      };

      // the name — union of just the two word spans, not the full h1 width
      const words = titleRef.current?.querySelectorAll<HTMLElement>(".hero__word");
      if (words && words.length) {
        let l = Infinity;
        let t = Infinity;
        let rt = -Infinity;
        let b = -Infinity;
        words.forEach((w) => {
          const wr = w.getBoundingClientRect();
          l = Math.min(l, wr.left);
          t = Math.min(t, wr.top);
          rt = Math.max(rt, wr.right);
          b = Math.max(b, wr.bottom);
        });
        addRect({ left: l, top: t, right: rt, bottom: b }, 10);
      }

      addRect(eyebrowRef.current?.getBoundingClientRect() ?? null, 8);
      addRect(ledeRef.current?.getBoundingClientRect() ?? null, 8);
      addRect(wayfindRef.current?.getBoundingClientRect() ?? null, 20);
      excludeRects = rects;
    };
    const resize = () => {
      const rect = hero.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      cssW = rect.width;
      cssH = rect.height;
      W = Math.max(1, Math.round(rect.width * dpr));
      H = Math.max(1, Math.round(rect.height * dpr));
      canvas.width = W;
      canvas.height = H;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      gl.viewport(0, 0, W, H);
      gl.uniform2f(uRes, W, H);
      computeExcludeRects();
    };
    resize();

    // pointer — targets are lerped for buttery motion
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, a: 0, ta: 0 };
    const start = performance.now();
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

      const probe = probeRef.current;
      if (probe) {
        const px = mouse.x * cssW;
        const py = (1 - mouse.y) * cssH;
        const inExcluded = excludeRects.some(
          (r) => px >= r.left && px <= r.right && py >= r.top && py <= r.bottom,
        );
        if (mouse.a > 0.02 && !inExcluded) {
          probe.style.transform = `translate3d(${px}px, ${py}px, 0)`;
          probe.style.opacity = String(mouse.a * 0.9);
          const nm = Math.round(400 + (1 - mouse.y) * 300);
          const band = Math.min(5, Math.max(0, Math.floor(((nm - 400) / 300) * 6)));
          probe.textContent = `λ ${nm} nm · BAND ${String(band).padStart(2, "0")}`;
        } else {
          probe.style.opacity = "0";
        }
      }

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

      {/* cursor probe — reads the field's simulated wavelength under the pointer */}
      {!failed && <span ref={probeRef} className="hero__probe" aria-hidden="true" />}

      {/* corner data readout — tech texture */}
      <div className="hero__hud hero__hud--tl" aria-hidden="true">
        <span>SPECTRAL&nbsp;FIELD</span>
        <span>λ 400–700 nm</span>
      </div>

      <div className="hero__content">
        <p className="hero__eyebrow">
          <span className="hero__eyebrow-text" ref={eyebrowRef}>
            {roleParts.map((r, i) => (
              <span key={r}>
                {r}
                {i < roleParts.length - 1 && <b aria-hidden="true">·</b>}
              </span>
            ))}
          </span>
        </p>

        <h1 className="hero__title" ref={titleRef}>
          <span className="hero__word" style={{ animationDelay: "0.05s" }}>
            {w1}
          </span>{" "}
          <span className="hero__word hero__word--accent" style={{ animationDelay: "0.18s" }}>
            {w2}
          </span>
        </h1>

        <p className="hero__lede" ref={ledeRef}>
          My work connects <em>computer vision</em> and <em>hyperspectral imaging</em> with
          software development, documentary research, and public service.
        </p>
      </div>

      {/* Auto-cycling destination band — animated wayfinding into the site. */}
      <nav
        ref={wayfindRef}
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

    </section>
  );
}
