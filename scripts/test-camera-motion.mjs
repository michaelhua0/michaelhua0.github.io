import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const compile = path => ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
const timeline = {};
vm.runInNewContext(compile('src/lib/cameraTimeline.ts'), { exports: timeline });
function render(prefersReducedMotion, choice, storageUnavailable = false) {
  const exports = {};
  vm.runInNewContext(compile('src/components/Hero.tsx'), {
    exports,
    sessionStorage: { getItem() { if (storageUnavailable) throw new Error('Storage blocked'); return choice; } },
    require: name => {
      if (name === 'react' || name === 'react/jsx-runtime') return require(name);
      if (name === 'react-router-dom') return { Link: 'a' };
      if (name.endsWith('usePrefersReducedMotion')) return { usePrefersReducedMotion: () => prefersReducedMotion };
      if (name.endsWith('useCameraScrollPacing')) return { useCameraScrollPacing: () => () => {} };
      if (name.endsWith('cameraTimeline')) return timeline;
      if (name.endsWith('/images')) return { imageUrl: path => path };
      if (name.endsWith('ArrowUpRight')) return { __esModule: true, default: () => null };
      return {};
    },
  });
  return renderToStaticMarkup(createElement(exports.default));
}
const reduced = render(true, null);
assert.match(reduced, /data-motion="reduced"/);
assert.match(reduced, /camera-story--still/);
assert.match(reduced, /Enable camera animation/);
const enabled = render(true, 'enabled');
assert.match(enabled, /data-motion="animated"/);
assert.doesNotMatch(enabled, /camera-story--still/);
assert.match(enabled, /Use reduced motion/);
const normal = render(false, null);
assert.match(normal, /data-motion="animated"/);
assert.doesNotMatch(normal, /camera-story__motion-choice/);
assert.match(render(true, null, true), /Enable camera animation/);
console.log('Camera motion checks passed: reduced-motion default, explicit opt-in, normal default, blocked storage.');
