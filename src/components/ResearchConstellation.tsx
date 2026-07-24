import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { site } from "../data/site";
import "./constellation.css";

type Kind = "center" | "primary" | "signal";
type Cat = "research" | "history" | "core";

interface NodeDef {
  id: string;
  label: string;
  kind: Kind;
  cat: Cat;
  to?: string; // primary nodes navigate
  nx: number; // home position, normalized 0..1
  ny: number;
  depth: number; // 0 (foreground/anchored) .. 1 (background, more parallax)
  r: number; // dot radius (px, base)
}

const NODES: NodeDef[] = [
  { id: "center", label: site.name, kind: "center", cat: "core", nx: 0.5, ny: 0.46, depth: 0, r: 9 },

  { id: "about", label: "About", kind: "primary", cat: "core", to: "/about", nx: 0.26, ny: 0.28, depth: 0.15, r: 7 },
  { id: "portfolio", label: "Portfolio", kind: "primary", cat: "core", to: "/portfolio", nx: 0.72, ny: 0.3, depth: 0.15, r: 7 },
  { id: "publications", label: "Publications", kind: "primary", cat: "core", to: "/publications", nx: 0.6, ny: 0.7, depth: 0.15, r: 7 },

  { id: "ai", label: "AI", kind: "signal", cat: "research", nx: 0.86, ny: 0.5, depth: 0.7, r: 4 },
  { id: "ml", label: "Machine learning", kind: "signal", cat: "research", nx: 0.88, ny: 0.16, depth: 0.85, r: 4 },
  { id: "cv", label: "Computer vision", kind: "signal", cat: "research", nx: 0.62, ny: 0.13, depth: 0.75, r: 4 },
  { id: "hsi", label: "Hyperspectral imaging", kind: "signal", cat: "research", nx: 0.39, ny: 0.74, depth: 0.6, r: 4 },
  { id: "trans", label: "Transformers", kind: "signal", cat: "research", nx: 0.79, ny: 0.6, depth: 0.8, r: 4 },
  { id: "seg", label: "3D segmentation", kind: "signal", cat: "research", nx: 0.49, ny: 0.87, depth: 0.65, r: 4 },
  { id: "app", label: "App development", kind: "signal", cat: "research", nx: 0.9, ny: 0.74, depth: 0.9, r: 4 },
  { id: "stem", label: "STEM", kind: "signal", cat: "research", nx: 0.13, ny: 0.5, depth: 0.7, r: 4 },
  { id: "history", label: "History", kind: "signal", cat: "history", nx: 0.21, ny: 0.74, depth: 0.6, r: 4 },
];

const EDGES: [string, string][] = [
  ["center", "about"],
  ["center", "portfolio"],
  ["center", "publications"],
  ["about", "stem"],
  ["portfolio", "ai"],
  ["portfolio", "ml"],
  ["portfolio", "cv"],
  ["portfolio", "trans"],
  ["portfolio", "app"],
  ["portfolio", "hsi"],
  ["portfolio", "history"],
  ["publications", "trans"],
  ["publications", "hsi"],
  ["publications", "seg"],
  ["publications", "cv"],
  ["publications", "history"],
  ["ai", "ml"],
  ["ml", "cv"],
  ["hsi", "seg"],
];

const COLORS: Record<Cat, string> = {
  core: "#e7ecf2",
  research: "#22d3c0",
  history: "#eab63c",
};

interface Live extends NodeDef {
  x: number;
  y: number;
  x0: number;
  y0: number;
  phase: number;
}

export default function ResearchConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    if (!canvas || !hero) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const nodes: Live[] = NODES.map((n, i) => ({
      ...n,
      x: 0,
      y: 0,
      x0: 0,
      y0: 0,
      phase: i * 1.7,
    }));
    const byId = new Map(nodes.map((n) => [n.id, n]));

    const pointer = { x: -9999, y: -9999, active: false };

    const resize = () => {
      const rect = hero.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      for (const n of nodes) {
        n.x0 = n.nx * W;
        n.y0 = n.ny * H;
      }
      if (reduced) {
        for (const n of nodes) {
          n.x = n.x0;
          n.y = n.y0;
        }
        draw(0);
        positionLabels();
      }
    };

    const positionLabels = () => {
      for (const n of nodes) {
        const el = labelRefs.current.get(n.id);
        if (el) el.style.transform = `translate(-50%, -50%) translate(${n.x}px, ${n.y}px)`;
      }
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);

      // edges
      for (const [a, b] of EDGES) {
        const na = byId.get(a)!;
        const nb = byId.get(b)!;
        const cat: Cat = na.cat === "history" || nb.cat === "history" ? "history" : "research";
        // brighten edges near the pointer
        const mx = (na.x + nb.x) / 2;
        const my = (na.y + nb.y) / 2;
        const d = Math.hypot(mx - pointer.x, my - pointer.y);
        const near = pointer.active ? Math.max(0, 1 - d / 300) : 0;
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.strokeStyle = COLORS[cat];
        ctx.globalAlpha = 0.1 + near * 0.4;
        ctx.lineWidth = 1 + near * 0.8;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // nodes
      for (const n of nodes) {
        const color = COLORS[n.cat];
        const d = Math.hypot(n.x - pointer.x, n.y - pointer.y);
        const near = pointer.active ? Math.max(0, 1 - d / 220) : 0;
        const pulse = reduced ? 0 : Math.sin(t / 900 + n.phase) * 0.5 + 0.5;
        const rr = n.r + near * 3 + (n.kind === "center" ? 2 : 0);

        // halo
        ctx.beginPath();
        ctx.arc(n.x, n.y, rr + 6 + near * 6, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.06 + near * 0.14 + pulse * 0.03;
        ctx.fill();

        // ring for primary + center
        if (n.kind !== "signal") {
          ctx.beginPath();
          ctx.arc(n.x, n.y, rr + 4, 0, Math.PI * 2);
          ctx.strokeStyle = color;
          ctx.globalAlpha = 0.5 + near * 0.5;
          ctx.lineWidth = 1.4;
          ctx.stroke();
        }

        // core dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, rr, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = n.kind === "signal" ? 0.7 + near * 0.3 : 0.95;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const step = (t: number) => {
      for (const n of nodes) {
        // gentle autonomous drift
        const drift = 6 * (0.3 + n.depth);
        const dx = Math.sin(t / 2600 + n.phase) * drift;
        const dy = Math.cos(t / 3100 + n.phase * 1.3) * drift;

        // parallax: field shifts opposite to pointer, more for deeper nodes
        let px = 0;
        let py = 0;
        if (pointer.active) {
          px = -(pointer.x - W / 2) * 0.02 * n.depth;
          py = -(pointer.y - H / 2) * 0.02 * n.depth;

          // local attraction toward pointer when close
          const ax = pointer.x - n.x0;
          const ay = pointer.y - n.y0;
          const dist = Math.hypot(ax, ay) || 1;
          const R = 240;
          if (dist < R) {
            const f = (1 - dist / R) * (10 + n.depth * 14);
            px += (ax / dist) * f;
            py += (ay / dist) * f;
          }
        }

        // ease toward target
        const tx = n.x0 + dx + px;
        const ty = n.y0 + dy + py;
        n.x += (tx - n.x) * 0.12;
        n.y += (ty - n.y) * 0.12;
      }
      draw(t);
      positionLabels();
    };

    let raf = 0;
    let running = false;
    const loop = (t: number) => {
      step(t);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // init positions at home so first frame is composed
    resize();
    for (const n of nodes) {
      n.x = n.x0;
      n.y = n.y0;
    }
    positionLabels();

    // pointer
    const onMove = (e: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };
    if (!reduced) {
      hero.addEventListener("pointermove", onMove);
      hero.addEventListener("pointerleave", onLeave);
      hero.addEventListener("pointerdown", onMove);
    }

    window.addEventListener("resize", resize);

    // pause when off-screen or tab hidden
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !document.hidden) start();
        else stop();
      },
      { threshold: 0.05 },
    );
    io.observe(hero);
    const onVis = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVis);

    start();

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      hero.removeEventListener("pointerdown", onMove);
    };
  }, []);

  const setRef = (id: string) => (el: HTMLElement | null) => {
    if (el) labelRefs.current.set(id, el);
    else labelRefs.current.delete(id);
  };

  return (
    <section className="const" ref={heroRef} aria-label="Research constellation — site navigation">
      <canvas ref={canvasRef} className="const__canvas" aria-hidden="true" />

      <div className="const__layer">
        {NODES.map((n) => {
          if (n.kind === "center") {
            return (
              <div key={n.id} ref={setRef(n.id)} className="const__node const__center">
                <h1 className="const__title">{site.name}</h1>
                <p className="const__role">{site.role}</p>
              </div>
            );
          }
          if (n.kind === "primary") {
            return (
              <Link
                key={n.id}
                ref={setRef(n.id)}
                to={n.to!}
                className={`const__node const__primary cat-${n.cat}`}
              >
                <span className="const__dot" aria-hidden="true" />
                {n.label}
              </Link>
            );
          }
          return (
            <span
              key={n.id}
              ref={setRef(n.id)}
              className={`const__node const__signal cat-${n.cat}`}
            >
              {n.label}
            </span>
          );
        })}
      </div>

      <div className="const__invite">
        <span className="const__invite-text">Navigate the constellation</span>
        <a href="#explore" className="const__scroll" aria-label="Explore the research">
          <span>Explore the research</span>
          <svg viewBox="0 0 16 24" width="14" height="20" aria-hidden="true">
            <path d="M8 2v18M2 14l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  );
}
