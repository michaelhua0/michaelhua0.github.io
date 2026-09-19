import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const compile = path => ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const timelineModule = { exports: {} };
vm.runInNewContext(compile('src/lib/cameraTimeline.ts'), { exports: timelineModule.exports });
function setup(coarse = false, enabled = true) {
  let now = 0, id = 0, cleanup;
  const frames = new Map(), listeners = new Map(), calls = [], rendered = [];
  const win = {
    scrollY: 0, innerHeight: 800,
    matchMedia: () => ({ matches: coarse }),
    scrollTo: options => { win.scrollY = options.top; calls.push(options); },
    addEventListener: (name, fn) => listeners.set(name, fn),
    removeEventListener: name => listeners.delete(name),
  };
  const exports = {};
  vm.runInNewContext(compile('src/hooks/useCameraScrollPacing.ts'), {
    exports, require: name => name === 'react' ? {
      useRef: current => ({ current }), useCallback: fn => fn,
      useLayoutEffect: fn => { cleanup = fn(); },
    } : timelineModule.exports,
    window: win, document: { documentElement: { scrollHeight: 4000 }, querySelector: () => null, addEventListener() {}, removeEventListener() {} },
    performance: { now: () => now }, Element: class {},
    getComputedStyle: () => ({ getPropertyValue: () => '70' }),
    requestAnimationFrame: fn => { frames.set(++id, fn); return id; },
    cancelAnimationFrame: key => frames.delete(key),
  });
  const navigate = exports.useCameraScrollPacing({ current: { getBoundingClientRect: () => ({ top: 70 - win.scrollY }) } }, enabled, () => 400, () => rendered.push(win.scrollY));
  return {
    win, calls, listeners, navigate, rendered,
    tick(ms) { now += ms; const pending = [...frames.values()]; frames.clear(); pending.forEach(fn => fn(now)); },
    wheel(deltaY, extra = {}) { let prevented = false; listeners.get('wheel')?.({ deltaY, deltaX: 0, cancelable: true, preventDefault() { prevented = true; }, ...extra }); return prevented; },
    cleanup() { cleanup?.(); assert.equal(frames.size, 0); assert.equal(listeners.size, 0); },
  };
}
for (const interval of [16, 100, 500]) {
  const test = setup();
  assert.equal(test.wheel(1), true);
  test.wheel(1); test.wheel(1);
  for (let i = 0; i < Math.ceil(1600 / interval); i++) test.tick(interval);
  assert.equal(test.win.scrollY, 418, `Optics at ${interval}ms/frame`);
  test.tick(200); assert.equal(test.wheel(1), true); test.tick(1600);
  assert.equal(test.win.scrollY, 660);
  test.tick(200); assert.equal(test.wheel(1), false, 'Release page at last stage');
  assert.equal(test.wheel(-1), true); test.tick(1600); assert.equal(test.win.scrollY, 418);
  test.tick(200); test.wheel(-1); test.tick(1600); assert.equal(test.win.scrollY, 0);
  test.tick(200); assert.equal(test.wheel(-1), false);
  assert.equal(test.listeners.has('scroll'), false, 'No scroll feedback loop');
  test.cleanup();
}
// Every paced scroll write renders that exact position in the same callback.
const synced = setup(); synced.wheel(1);
const samples = [0];
for (let i = 0; i < 100; i++) {
  synced.tick(16);
  samples.push(synced.win.scrollY);
  assert.equal(synced.rendered.at(-1), synced.win.scrollY);
}
assert.equal(synced.rendered.length, synced.calls.length);
for (let i = 2; i < samples.length; i++) {
  assert.ok(Math.abs(samples[i] - 2 * samples[i - 1] + samples[i - 2]) < 1,
    'No abrupt velocity change while crossing from opening to reading interval');
}
synced.cleanup();
const reverse = setup(); reverse.wheel(1); reverse.tick(300); reverse.wheel(-1); reverse.tick(1600); assert.equal(reverse.win.scrollY, 0); reverse.cleanup();
const touch = setup(true); touch.navigate(660); assert.equal(touch.calls[0].behavior, 'smooth'); touch.tick(2000); assert.equal(touch.calls.length, 1, 'No arrival retries'); touch.cleanup();
const interrupted = setup(); interrupted.wheel(1); interrupted.tick(100); interrupted.listeners.get('pointerdown')(); const y = interrupted.win.scrollY; interrupted.tick(2000); assert.equal(interrupted.win.scrollY, y); interrupted.cleanup();
const ignored = setup(); assert.equal(ignored.wheel(1, { ctrlKey: true }), false); assert.equal(ignored.wheel(1, { cancelable: false }), false); ignored.cleanup();
const disabled = setup(false, false); assert.equal(disabled.listeners.size, 0); disabled.cleanup();
console.log('Camera scroll checks passed: stage navigation, 16/100/500ms frames, reversal, endpoints, interruption, touch buttons, disabled motion.');
