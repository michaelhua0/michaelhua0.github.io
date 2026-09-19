import { useCallback, useLayoutEffect, useRef, type RefObject } from "react";
import { cameraChapters, cameraTimeline } from "../lib/cameraTimeline";

const nativeScrollTo = (top: number) => window.scrollTo({ top, behavior: "smooth" });
const seekTime = (position: number) => position <= .65 ? position / .78 : .65 / .78 + (position - .65) / 2.8;
const seekPosition = (time: number) => time <= .65 / .78 ? time * .78 : .65 + (time - .65 / .78) * 2.8;
const ease = (t: number) => t * t * (3 - 2 * t);

// Wheel input selects a chapter; scroll events only update the scene in Hero.
// Never feed our own scroll events back into chapter selection.
export function useCameraScrollPacing(sectionRef: RefObject<HTMLElement | null>, enabled: boolean, distance: () => number) {
  const navigateRef = useRef(nativeScrollTo);
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!enabled || !section) return;
    let frame = 0;
    let target = window.scrollY;
    let lastGesture = -Infinity;
    let lastDirection = 0;
    let captured = false;
    const resetGesture = () => { lastGesture = -Infinity; captured = false; };
    const stop = () => { cancelAnimationFrame(frame); frame = 0; };
    const origin = () => window.scrollY + section.getBoundingClientRect().top
      - Number.parseFloat(getComputedStyle(section).getPropertyValue("--nav-h"));
    const navigate = (top: number) => {
      stop();
      if (window.matchMedia("(pointer: coarse)").matches) { nativeScrollTo(top); return; }
      target = Math.max(0, Math.min(document.documentElement.scrollHeight - window.innerHeight, top));
      const start = origin(), span = distance();
      const from = seekTime((window.scrollY - start) / span);
      const to = seekTime((target - start) / span);
      const duration = Math.min(1500, Math.max(750, Math.abs(to - from) * 1000));
      const began = performance.now();
      const tick = (now: number) => {
        // Wall-clock timing prevents low frame rates from stretching a chapter.
        const t = Math.min(1, (now - began) / duration);
        window.scrollTo({ top: t === 1 ? target : start + seekPosition(from + (to - from) * ease(t)) * span, behavior: "instant" });
        frame = t < 1 ? requestAnimationFrame(tick) : 0;
      };
      frame = requestAnimationFrame(tick);
    };
    navigateRef.current = navigate;
    const advance = (direction: number, repeat = false) => {
      if (document.querySelector("dialog[open]")) return false;
      const now = performance.now();
      const continuing = direction === lastDirection && (repeat || now - lastGesture < 180);
      lastGesture = now;
      lastDirection = direction;
      if (continuing && captured) return true;
      // Finish one stage before accepting another in the same direction, even
      // for mice whose wheel events are farther apart than trackpad events.
      if (frame && direction === Math.sign(target - window.scrollY)) return true;
      captured = false;
      const start = origin(), span = distance();
      const position = (window.scrollY - start) / span;
      if (position < -2 / span || position > cameraTimeline.length + 2 / span) { stop(); return false; }
      const stages = direction > 0 ? cameraChapters : [...cameraChapters].reverse();
      const next = stages.find(stage => direction > 0 ? stage.position > position + .005 : stage.position < position - .005);
      if (!next) { stop(); return false; }
      captured = true;
      navigate(Math.round(start + next.position * span));
      return true;
    };
    const onWheel = (event: WheelEvent) => {
      if (event.defaultPrevented || !event.cancelable || event.ctrlKey || !event.deltaY || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      if (advance(Math.sign(event.deltaY))) event.preventDefault();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key === "Escape" || event.key === "Home" || event.key === "End") { stop(); resetGesture(); return; }
      if (event.target instanceof Element && event.target.closest('input, textarea, select, button, a, [contenteditable="true"]')) return;
      const direction = ["ArrowDown", "PageDown"].includes(event.key) || (event.key === " " && !event.shiftKey) ? 1
        : ["ArrowUp", "PageUp"].includes(event.key) || (event.key === " " && event.shiftKey) ? -1 : 0;
      if (direction && advance(direction, event.repeat)) event.preventDefault();
    };
    const interrupt = () => { stop(); resetGesture(); };
    const onVisibility = () => { if (document.hidden) interrupt(); };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", interrupt);
    window.addEventListener("touchstart", interrupt, { passive: true });
    window.addEventListener("resize", interrupt);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      interrupt(); navigateRef.current = nativeScrollTo;
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", interrupt);
      window.removeEventListener("touchstart", interrupt);
      window.removeEventListener("resize", interrupt);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [sectionRef, enabled, distance]);
  return useCallback((top: number) => navigateRef.current(top), []);
}
