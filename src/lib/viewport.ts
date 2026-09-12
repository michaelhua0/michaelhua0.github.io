// iOS collapses its toolbar during the first scroll of a gesture, which grows
// window.innerHeight by ~100px mid-swipe. The camera section is laid out in
// svh, which does not move, so reading innerHeight made the scroll math drift
// away from the stylesheet exactly when the animation started. Measure the svh
// unit itself and cache it until the window actually resizes.
let probe: HTMLDivElement | null = null;
let cached = 0;

export function viewportHeight() {
  if (cached) return cached;
  if (typeof document === "undefined") return 0;
  if (!probe) {
    probe = document.createElement("div");
    probe.setAttribute("aria-hidden", "true");
    probe.style.cssText =
      "position:fixed;top:0;left:0;width:0;height:100svh;pointer-events:none;visibility:hidden";
    document.body.append(probe);
  }
  cached = probe.getBoundingClientRect().height || window.innerHeight;
  return cached;
}

export function invalidateViewportHeight() {
  cached = 0;
}
