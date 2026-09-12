import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCameraScrollPacing } from "../hooks/useCameraScrollPacing";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import type { CameraScene, CameraSceneBounds } from "./cameraScene";
import { cameraChapters, cameraChapterAt, cameraFlowOffset, cameraPoseAt, cameraTimeline } from "../lib/cameraTimeline";
import { cameraMotionAt } from "../lib/cameraMotion";
import { imageUrl } from "../lib/images";
import { invalidateViewportHeight, viewportHeight } from "../lib/viewport";
import ArrowUpRight from "./ArrowUpRight";
import "./hero.css";

const diffractionImageUrl = imageUrl("ctis-diffraction.jpg");
// Measured in svh, the unit the section is sized in, so a collapsing mobile
// toolbar cannot stretch the scroll budget out from under the layout. The
// factor sets how much scrolling the whole story costs, and hero.css sizes the
// section from it; the two have to move together.
const animationDistance = () => {
  const height = viewportHeight();
  return height * (window.innerWidth <= 700 && height <= 700 ? 1 : 0.5);
};

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelsRef = useRef<SVGSVGElement>(null);
  const figureRef = useRef<HTMLElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<CameraScene | null>(null);
  const progressRef = useRef(0);
  const visualRef = useRef<{progress: number; bounds?: CameraSceneBounds}>({progress:0});
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [chapter, setChapter] = useState(0);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [snapshotVisible, setSnapshotVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const scrollToChapter = useCameraScrollPacing(sectionRef, ready && !failed && !reducedMotion, animationDistance);

  const layoutViewer = useCallback((progress: number, bounds?: CameraSceneBounds) => {
    const pose = cameraPoseAt(progress);
    const section=sectionRef.current, figure=figureRef.current, details=detailsRef.current, controls=controlsRef.current;
    if (section && figure && details && controls) {
      const height = viewportHeight();
      const motion = cameraMotionAt(pose, window.innerWidth, height);
      // Matches the short-window rules in hero.css. A 1440x900 laptop leaves a
      // ~790px viewport, which must stay on the full-width layout.
      const landscape = (window.innerWidth > 520 && height <= 600)
        || (window.innerWidth > 1000 && height <= 620);
      const flow = cameraFlowOffset(progress) * animationDistance();
      const navHeight=Number.parseFloat(getComputedStyle(section).getPropertyValue('--nav-h'));
      const scrolled=navHeight-section.getBoundingClientRect().top;
      let controlsTravel=Math.min(Math.max(0,scrolled),cameraTimeline.length*animationDistance());
      let controlsTop=height-navHeight-80+controlsTravel;
      const figureHeight=figure.offsetHeight, figureTop=figure.offsetTop;
      let y=motion.y*(motion.unit==='svh'?height/100:1)+flow;
      const scale=motion.scale;
      let notesY=flow+motion.notes;
      // Give the opened camera its full width. Move the copy into the space
      // above it instead of shrinking the hardware to fit below the copy.
      if(!reducedMotion && bounds){
        const safeBottom=controlsTop-24;
        const t=Math.max(0,Math.min(1,(pose-cameraTimeline.separationStart)/(cameraTimeline.separationEnd-cameraTimeline.separationStart)));
        const reading=t*t*(3-2*t);
        const bottom=figureTop+y+figureHeight/2+(bounds.bottom-.5)*figureHeight*scale;
        const anchoredY=y+safeBottom-bottom;
        y=Math.min(y,anchoredY)*(1-reading)+anchoredY*reading;
        const copyTravel=Math.min(scrolled,cameraTimeline.length*animationDistance());
        const anchoredTop=figureTop+anchoredY+figureHeight/2+(bounds.top-.5)*figureHeight*scale;
        const compactBy=landscape ? 0 : Math.max(0,anchoredTop-(copyTravel+24+details.offsetHeight+20))*reading;
        y-=compactBy;
        controlsTravel-=compactBy;
        controlsTop-=compactBy;
        // Shortens the section by however much the model was pulled up, so the
        // story ends where the hardware does. Quantised because it feeds the
        // document's scroll extent, which moves ~266px on a phone, and a value
        // that changed every frame churned that extent through every gesture.
        section.style.setProperty('--camera-tighten',`${Math.round(compactBy/4)*4}px`);
        const modelTop=figureTop+y+figureHeight/2+(bounds.top-.5)*figureHeight*scale;
        figure.dataset.contentTop=modelTop.toFixed(2);
        // Never let the copy ride up under the nav, even when the band is tall.
        const notesTop=landscape ? copyTravel+16 : Math.max(copyTravel+16,Math.min(copyTravel+24,modelTop-details.offsetHeight-20));
        notesY+=(notesTop-details.offsetTop-notesY)*reading;
        section.style.setProperty('--intro-opacity',String(1-reading));
      }
      figure.style.transform = reducedMotion ? "none" : `translate3d(${landscape ? 0 : motion.x}%, ${y}px, 0) scale(${scale})`;
      details.style.transform = reducedMotion ? "none" : `translate3d(0, ${notesY}px, 0)`;
      controls.style.transform=reducedMotion?'none':`translateY(${controlsTravel}px)`;
      // Occupied bounds are also useful for checking responsive clearances.
      if(bounds && !reducedMotion){
        figure.dataset.contentBottom=(figureTop+y+figureHeight/2+(bounds.bottom-.5)*figureHeight*scale).toFixed(2);
        controls.dataset.layoutTop=controlsTop.toFixed(2);
      }
    }
  }, [reducedMotion]);

  const setVisualProgress = useCallback((progress: number, bounds?: CameraSceneBounds) => {
    visualRef.current={progress,bounds};
    const pose=cameraPoseAt(progress);
    if(sectionRef.current)sectionRef.current.dataset.pose=pose.toFixed(4);
    layoutViewer(progress,bounds);
    setChapter(cameraChapterAt(progress));
    setDetailsVisible(pose >= cameraTimeline.separationEnd);
    setSnapshotVisible(pose >= 0.9);
  }, [layoutViewer]);

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    setFailed(false);
    const diffractionImage = new Image();
    diffractionImage.src = diffractionImageUrl;
    Promise.all([import("./cameraScene"), diffractionImage.decode()]).then(([{ createCameraScene }]) => {
      if (cancelled || !canvasRef.current || !labelsRef.current) return;
      const scene = createCameraScene(canvasRef.current, labelsRef.current, diffractionImage, reducedMotion, () => {
        setFailed(true);
        setReady(false);
      }, setVisualProgress, () => { if (!cancelled) setReady(true); });
      sceneRef.current = scene;
      scene.setProgress(progressRef.current);
    }).catch(() => { if (!cancelled) setFailed(true); });
    return () => {
      cancelled = true;
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, [reducedMotion, setVisualProgress]);

  useEffect(() => {
    if (reducedMotion) {
      if (controlsRef.current) controlsRef.current.style.transform = "none";
      return;
    }
    let frame = 0;
    const measure = () => {
      frame = 0;
      const section = sectionRef.current;
      if (!section) return;
      const navHeight = Number.parseFloat(getComputedStyle(section).getPropertyValue("--nav-h"));
      // Deconstruction keeps its pace; the opened view has extra reading space.
      const scrolled = navHeight - section.getBoundingClientRect().top;
      const progress = Math.max(0, Math.min(cameraTimeline.length, scrolled / animationDistance()));
      progressRef.current = progress;
      if (sceneRef.current && !failed) {
        sceneRef.current.setProgress(progress);
        layoutViewer(visualRef.current.progress,visualRef.current.bounds);
      }
      else setVisualProgress(progress);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(measure); };
    const onResize = () => { invalidateViewportHeight(); onScroll(); };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [reducedMotion, failed, setVisualProgress, layoutViewer]);

  // Recheck the copy's clearance after a font swap or responsive text reflow.
  useEffect(() => {
    const details = detailsRef.current;
    if (!details) return;
    const observer = new ResizeObserver(() => {
      layoutViewer(visualRef.current.progress, visualRef.current.bounds);
    });
    observer.observe(details);
    return () => observer.disconnect();
  }, [layoutViewer]);

  // A single, cancellable first-visit nudge. Never override an ongoing gesture,
  // a restored scroll position, a fragment link, or a reduced-motion preference.
  useEffect(() => {
    if (!ready || reducedMotion || window.scrollY > 2 || window.location.hash) return;
    try { if (sessionStorage.getItem("mh:camera-preview")) return; } catch { return; }
    let frame = 0;
    let cancelled = false;
    const stop = () => { cancelled = true; clearTimeout(timer); cancelAnimationFrame(frame); };
    const events = ["wheel", "touchstart", "pointerdown", "keydown"] as const;
    events.forEach(name => window.addEventListener(name, stop, { passive: true, once: true }));
    const onVisibility = () => { if (document.hidden) stop(); };
    document.addEventListener("visibilitychange", onVisibility);
    const timer = window.setTimeout(() => {
      if (cancelled || window.scrollY > 2 || document.hidden) return;
      try { sessionStorage.setItem("mh:camera-preview", "1"); } catch { return; }
      const start = performance.now();
      const distance = Math.min(48, viewportHeight() * 0.05);
      const tick = (now: number) => {
        if (cancelled) return;
        const t = Math.min(1, (now - start) / 1450);
        const amount = Math.sin(Math.PI * t) ** 2;
        window.scrollTo({ top: distance * amount, behavior: "instant" });
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, 1100);
    return () => {
      stop();
      events.forEach(name => window.removeEventListener(name, stop));
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [ready, reducedMotion]);

  const goToChapter = useCallback((index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const progress = cameraChapters[index].position;
    if (reducedMotion) {
      progressRef.current = progress;
      sceneRef.current?.setProgress(progress);
      setVisualProgress(progress);
      return;
    }
    const navHeight = Number.parseFloat(getComputedStyle(section).getPropertyValue("--nav-h"));
    scrollToChapter(Math.ceil(window.scrollY + section.getBoundingClientRect().top - navHeight + progress * animationDistance()));
  }, [reducedMotion, scrollToChapter, setVisualProgress]);

  return (
    <section ref={sectionRef} className={`camera-story ${reducedMotion ? "camera-story--still" : ""}`} data-chapter={chapter} aria-label="Michael Hua and his homemade hyperspectral camera">
      <div ref={controlsRef} className="camera-story__controls">
        <p className="camera-story__cost" aria-label="Camera build cost: under 300 dollars"><span>Build cost</span><span>&lt; $300</span></p>
        <div className="camera-story__chapters" role="group" aria-label="Camera animation chapters">{cameraChapters.map((item, index) => <button key={item.label} type="button" onClick={() => goToChapter(index)} className={chapter === index ? "is-active" : ""} aria-pressed={chapter === index} aria-controls="camera-view">{item.label}</button>)}</div>
      </div>
      <div className="camera-story__inner">
        <header className="camera-story__intro" inert={!reducedMotion && detailsVisible} aria-hidden={!reducedMotion && detailsVisible}>
          <p className="camera-story__eyebrow">Hi, I’m</p>
          <h1>Michael Hua</h1>
          <p className="camera-story__description">I’m a student at Cranbrook. I built this hyperspectral camera for under $300. With my reconstruction model, it reaches about 95% of the accuracy of scanning hyperspectral cameras, which cost $10,000 to $20,000 or more.</p>
          <Link to="/portfolio" className="camera-story__link">My Work <ArrowUpRight /></Link>
          <a href="#camera-build" className="camera-story__next" aria-label="See inside the camera" onClick={event => { event.preventDefault(); goToChapter(1); }}><span aria-hidden="true">↓</span></a>
        </header>

        <figure ref={figureRef} id="camera-view" className={`camera-story__figure ${ready ? "is-ready" : ""}`} aria-busy={!ready && !failed}>
          {failed && <div className="camera-story__unavailable"><p>The camera view couldn’t load.</p><Link to="/portfolio/decoding-light">Read About the Camera <ArrowUpRight /></Link></div>}
          <canvas ref={canvasRef} className="camera-story__canvas" role="img" aria-hidden={!ready} aria-label="3D illustration of my homemade hyperspectral camera. Scrolling fades the whole rectangular housing to reveal the fitted optics, then separates them along their axis to show the lenses, diffraction grating, sensor, and Raspberry Pi connected by a ribbon cable." />
          <svg ref={labelsRef} className="camera-story__labels" aria-hidden="true" />
          <figcaption className="sr-only">My homemade hyperspectral camera</figcaption>
        </figure>

        <div ref={detailsRef} id="camera-build" className={`camera-story__details ${detailsVisible ? "is-visible" : ""}`} inert={!detailsVisible} aria-hidden={!detailsVisible}>
          <div className="camera-story__explanation">
            <h2 className="camera-story__chapter-title">
              <span className={chapter !== 2 ? "is-active" : ""} aria-hidden={chapter === 2}>Inside My Camera</span>
              <span className={chapter === 2 ? "is-active" : ""} aria-hidden={chapter !== 2}>The Sensor Image</span>
            </h2>
            <p className="camera-story__scale-note">Spacing expanded for clarity</p>
            <p className="camera-story__explanation-copy">
              <span className={chapter !== 2 ? "is-active" : ""} aria-hidden={chapter === 2}>The lenses focus light through a square aperture. A dual-axis grating separates the light by wavelength before it reaches the camera sensor.</span>
              <span className={chapter === 2 ? "is-active" : ""} aria-hidden={chapter !== 2}>The sensor captures the 0th, ±1st, and diagonal orders in one exposure. My <span className="nowrap">Novel PASS-Transformer</span> recovers the spectra with PSF-aware spatial attention, dispersion-aware spectral attention, and iterative physical consistency. Training is self-supervised, with no ground truth.</span>
            </p>
            <Link to="/portfolio/decoding-light" className="camera-story__link">About This Project <ArrowUpRight /></Link>
          </div>
          <button type="button" className={`camera-snapshot ${snapshotVisible ? "is-visible" : ""}`} aria-label="Enlarge the captured diffraction pattern" onClick={() => dialogRef.current?.showModal()} inert={!snapshotVisible}>
            <img src={diffractionImageUrl} width="1184" height="1139" alt="Captured diffraction pattern showing the 0th, ±1st, and diagonal orders" />
            <span>Sensor Image <ArrowUpRight /></span>
          </button>
        </div>

      </div>
      <dialog ref={dialogRef} className="camera-pattern-dialog" onClick={event => { if (event.target === event.currentTarget) dialogRef.current?.close(); }}>
        <div className="camera-pattern-dialog__head"><h2>Sensor Image</h2><button type="button" aria-label="Close sensor image" onClick={() => dialogRef.current?.close()}>×</button></div>
        <img src={diffractionImageUrl} width="1184" height="1139" alt="Captured 0th-order image at the center, with ±1st and diagonal diffraction orders around it" />
        <p>Captured 0th, ±1st, and diagonal diffraction orders.</p>
      </dialog>
    </section>
  );
}
