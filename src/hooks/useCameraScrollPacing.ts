import { useCallback, useLayoutEffect, useRef, type RefObject } from "react";
import { cameraTimeline } from "../lib/cameraTimeline";

// Give the moving hardware more time than the interval between the two
// already-open views. These functions map scroll distance to playback time.
const seekTime = (position: number) => position <= .65 ? position / .45 : .65 / .45 + (position - .65) / 1.8;
const seekPosition = (time: number) => time <= .65 / .45 ? time * .45 : .65 + (time - .65 / .45) * 1.8;
const seekEase = (t: number) => t < .15 ? t * t / .255 : t > .85 ? 1 - (1 - t) ** 2 / .255 : (t - .075) / .85;

const nativeScrollTo = (top: number) => window.scrollTo({ top, behavior: "smooth" });

// Pace quick gestures through the camera, then carry their remaining movement
// into the page. Chapter buttons have their own reversible, eased transition.
export function useCameraScrollPacing(
  sectionRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  distance: () => number,
) {
  const navigateRef = useRef(nativeScrollTo);
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!enabled || !section) {
      navigateRef.current = nativeScrollTo;
      return;
    }
    let lastY = window.scrollY;
    let target = lastY;
    let frame = 0;
    let previousTime = 0;
    let bypass = false;
    let escaped = false;
    let touchY = 0;
    let lastScrollTime = performance.now();
    let mode: "pace" | "chapter" = "pace";
    let velocity = 0;
    let chapterStart = 0;
    let chapterEnd = 0;
    let chapterOrigin = 0;
    let chapterDistance = 1;
    let chapterElapsed = 0;
    let chapterDuration = 0;
    const limits = () => {
      const nav = Number.parseFloat(getComputedStyle(section).getPropertyValue("--nav-h"));
      const start = window.scrollY + section.getBoundingClientRect().top - nav;
      return { start, end: start + cameraTimeline.length * distance() };
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      lastY = target = window.scrollY;
      velocity = 0;
    };
    const eligible = (direction: number) => {
      const { start, end } = limits();
      if (escaped || document.querySelector("dialog[open]")) return false;
      return direction < 0
        ? lastY > start + 1 && lastY <= end + 2
        : !bypass && lastY >= start - 2 && lastY < end - 1;
    };
    const tick = (now: number) => {
      const dt = Math.min(100, now - previousTime);
      previousTime = now;
      const { start: storyStart, end } = limits();
      let done = false;
      if (mode === "chapter") {
        chapterElapsed += dt;
        const t = Math.min(1, chapterElapsed / chapterDuration);
        const playbackTime = chapterStart + (chapterEnd - chapterStart) * seekEase(t);
        lastY = chapterOrigin + seekPosition(playbackTime) * chapterDistance;
        done = t === 1;
      } else {
        const direction = Math.sign(target - lastY);
        const remaining = Math.abs(target - lastY);
        const inStory = direction > 0 ? lastY < end : lastY > storyStart && lastY <= end + 2;
        if (inStory) velocity = distance() * (direction < 0 ? .5 : .62);
        else {
          // Accelerate out of the story without a hold or a jump to the target.
          velocity = Math.min(1800, velocity + 2600 * dt / 1000, Math.sqrt(2 * 2600 * remaining));
        }
        lastY += direction * Math.min(remaining, velocity * dt / 1000);
        done = Math.abs(target - lastY) <= 1;
      }
      if (done) lastY = target;
      window.scrollTo({ top: lastY, behavior: "instant" });
      lastY = window.scrollY;
      if (mode === "chapter") bypass = lastY >= end - 1;
      else if (lastY >= end - 1) bypass = true;
      if (lastY <= storyStart + 1) { bypass = false; escaped = false; }
      if (!done) frame = requestAnimationFrame(tick);
      else frame = 0;
    };
    const start = () => {
      if (!frame) {
        previousTime = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };
    const queue = (next: number) => {
      mode = "pace";
      target = Math.max(0, Math.min(document.documentElement.scrollHeight - innerHeight, next));
      start();
    };
    navigateRef.current = (top: number) => {
      stop();
      bypass = false;
      escaped = false;
      mode = "chapter";
      target = Math.max(0, Math.min(document.documentElement.scrollHeight - innerHeight, top));
      chapterOrigin = limits().start;
      chapterDistance = distance();
      chapterStart = seekTime((lastY - chapterOrigin) / chapterDistance);
      chapterEnd = seekTime((target - chapterOrigin) / chapterDistance);
      chapterElapsed = 0;
      chapterDuration = Math.max(650, Math.abs(chapterEnd - chapterStart) * 1000);
      start();
    };
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || !event.deltaY || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const direction = Math.sign(event.deltaY);
      if (frame && (mode === "chapter" || Math.sign(target - lastY) !== direction)) stop();
      if (!eligible(direction)) { if (frame) stop(); return; }
      event.preventDefault();
      const pixels = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
      queue((frame ? target : lastY) + pixels);
    };
    const onScroll = () => {
      const actual = window.scrollY;
      const now = performance.now();
      const delta = actual - lastY;
      const direction = Math.sign(delta);
      const nativeLimit = Math.max(8, distance() * (direction < 0 ? .5 : .62) * Math.min(100, now - lastScrollTime) / 1000);
      lastScrollTime = now;
      if (Math.abs(delta) <= 1) return;
      const { start: storyStart, end } = limits();
      // A fast upward gesture from the rest of the page enters at Sensor,
      // then runs the same measured return through the camera assembly.
      if (!escaped && direction < 0 && lastY > end + 2 && actual < end && !document.querySelector("dialog[open]")) {
        cancelAnimationFrame(frame);frame = 0;
        lastY = end;
        window.scrollTo({ top: lastY, behavior: "instant" });
        queue(actual);
      } else if (eligible(direction) && Math.abs(delta) > nativeLimit) {
        window.scrollTo({ top: lastY, behavior: "instant" });
        queue(actual);
      } else {
        stop();
        if (actual <= storyStart + 20) { bypass = false; escaped = false; }
      }
    };
    const onTouchStart = (event: TouchEvent) => { stop(); touchY = event.touches[0]?.clientY ?? 0; };
    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      const next = event.touches[0].clientY;
      const delta = touchY - next;
      touchY = next;
      if (!delta) return;
      const direction = Math.sign(delta);
      if (frame && Math.sign(target - lastY) !== direction) stop();
      if (!eligible(direction)) return;
      event.preventDefault();
      queue((frame ? target : lastY) + delta);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" || (event.key === "Enter" && (event.target as Element).closest("a:not(.camera-story__next)"))) { bypass = true; escaped = true; stop(); }
      if (["ArrowUp", "PageUp", "Home"].includes(event.key)) stop();
    };
    const onPointer = (event: PointerEvent) => {
      const element = event.target as Element;
      if (element.closest("a:not(.camera-story__next)")) { bypass = true; escaped = true; }
      if (element.closest("a, button, input, select, textarea")) stop();
    };
    const onVisibility = () => { if (document.hidden) stop(); };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      navigateRef.current = nativeScrollTo;
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [sectionRef, enabled, distance]);
  return useCallback((top: number) => navigateRef.current(top), []);
}
