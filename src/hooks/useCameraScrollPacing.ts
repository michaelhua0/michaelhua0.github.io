import { useCallback, useLayoutEffect, useRef, type RefObject } from "react";
import { cameraChapters, cameraTimeline } from "../lib/cameraTimeline";

// Give the moving hardware more time than the interval between the open views.
const seekTime = (position: number) => position <= .65 ? position / .45 : .65 / .45 + (position - .65) / 1.8;
const seekPosition = (time: number) => time <= .65 / .45 ? time * .45 : .65 + (time - .65 / .45) * 1.8;
const seekEase = (t: number) => t < .15 ? t * t / .255 : t > .85 ? 1 - (1 - t) ** 2 / .255 : (t - .075) / .85;
const nativeScrollTo = (top: number) => window.scrollTo({ top, behavior: "smooth" });

// One gesture selects one adjacent stage. Its momentum cannot skip the next
// stage; scrolling beyond the two endpoints returns to normal page scrolling.
export function useCameraScrollPacing(
  sectionRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  distance: () => number,
) {
  const navigateRef = useRef(nativeScrollTo);
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!enabled || !section) { navigateRef.current = nativeScrollTo; return; }
    let lastY = window.scrollY;
    let target = lastY;
    let frame = 0;
    let previousTime = 0;
    let escaped = false;
    let interacted = false;
    let touchY = 0;
    let touchUsed = false;
    let lastGestureTime = -Infinity;
    let gestureDirection = 0;
    let gestureCaptured = false;
    let chapterStart = 0, chapterEnd = 0, chapterOrigin = 0, chapterDistance = 1;
    let chapterElapsed = 0, chapterDuration = 0;
    const limits = () => {
      const nav = Number.parseFloat(getComputedStyle(section).getPropertyValue("--nav-h"));
      const start = window.scrollY + section.getBoundingClientRect().top - nav;
      return { start, end: start + cameraTimeline.length * distance() };
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      lastY = target = window.scrollY;
    };
    const tick = (now: number) => {
      chapterElapsed += Math.min(100, now - previousTime);
      previousTime = now;
      const t = Math.min(1, chapterElapsed / chapterDuration);
      const playbackTime = chapterStart + (chapterEnd - chapterStart) * seekEase(t);
      lastY = t === 1 ? target : chapterOrigin + seekPosition(playbackTime) * chapterDistance;
      window.scrollTo({ top: lastY, behavior: "instant" });
      lastY = window.scrollY;
      frame = t < 1 ? requestAnimationFrame(tick) : 0;
    };
    const navigate = (top: number) => {
      stop();
      escaped = false;
      target = Math.max(0, Math.min(document.documentElement.scrollHeight - innerHeight, top));
      chapterOrigin = limits().start;
      chapterDistance = distance();
      chapterStart = seekTime((lastY - chapterOrigin) / chapterDistance);
      chapterEnd = seekTime((target - chapterOrigin) / chapterDistance);
      chapterElapsed = 0;
      chapterDuration = Math.min(2400, Math.max(650, Math.abs(chapterEnd - chapterStart) * 1000));
      previousTime = performance.now();
      frame = requestAnimationFrame(tick);
    };
    navigateRef.current = navigate;
    const blocked = () => escaped || !!document.querySelector("dialog[open]");
    const advance = (direction: number, continuation = false) => {
      if (blocked()) return false;
      const now = performance.now();
      const sameGesture = direction === gestureDirection && (continuation || now - lastGestureTime < 220);
      lastGestureTime = now;
      gestureDirection = direction;
      if ((frame && Math.sign(target - lastY) === direction) || (sameGesture && gestureCaptured)) { gestureCaptured = true; return true; }
      gestureCaptured = false;
      if (frame) stop();
      const { start, end } = limits();
      if (lastY < start - 2 || lastY > end + 2) return false;
      const position = (lastY - start) / distance();
      const stages = direction > 0 ? cameraChapters : [...cameraChapters].reverse();
      const next = stages.find(stage => direction > 0 ? stage.position > position + .005 : stage.position < position - .005);
      if (!next) return false;
      gestureCaptured = true;
      navigate(Math.ceil(start + next.position * distance()));
      return true;
    };
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || !event.deltaY || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      interacted = true;
      if (advance(Math.sign(event.deltaY))) event.preventDefault();
    };
    const onScroll = () => {
      const actual = window.scrollY;
      if (Math.abs(actual - lastY) <= 1) return;
      const delta = actual - lastY;
      const { start, end } = limits();
      if (interacted && !blocked()) {
        // Scrollbar drags and accessibility scrolling also stop at a stage.
        const enteredFromBelow = lastY > end + 2 && actual < end;
        const enteredFromAbove = lastY < start - 2 && actual > start;
        if (enteredFromBelow || enteredFromAbove) {
          window.scrollTo({ top: lastY, behavior: "instant" });
          navigate(enteredFromBelow ? end : start);
          return;
        }
        if (lastY >= start - 2 && lastY <= end + 2) {
          window.scrollTo({ top: lastY, behavior: "instant" });
          if (advance(Math.sign(delta))) return;
          window.scrollTo({ top: actual, behavior: "instant" });
        }
      }
      stop();
    };
    const onTouchStart = (event: TouchEvent) => {
      interacted = true;
      touchY = event.touches[0]?.clientY ?? 0;
      touchUsed = false;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      const next = event.touches[0].clientY;
      const delta = touchY - next;
      touchY = next;
      if (!delta) return;
      if (advance(Math.sign(delta), touchUsed)) { event.preventDefault(); touchUsed = true; }
    };
    const onKey = (event: KeyboardEvent) => {
      interacted = true;
      const element = event.target as Element;
      if (event.key === "Escape" || (event.key === "Enter" && element.closest("a:not(.camera-story__next)"))) { escaped = true; stop(); return; }
      if (element.closest('input, textarea, select, button, [contenteditable="true"]')) return;
      const direction = ["ArrowDown", "PageDown"].includes(event.key) || (event.key === " " && !event.shiftKey) ? 1
        : ["ArrowUp", "PageUp"].includes(event.key) || (event.key === " " && event.shiftKey) ? -1 : 0;
      if (direction && advance(direction, event.repeat)) event.preventDefault();
    };
    const onPointer = (event: PointerEvent) => {
      interacted = true;
      const element = event.target as Element;
      if (element.closest("a:not(.camera-story__next)")) escaped = true;
      if (element.closest("a, button, input, select, textarea")) {
        stop(); lastGestureTime = -Infinity; gestureDirection = 0; gestureCaptured = false;
      }
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
      stop(); navigateRef.current = nativeScrollTo;
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
