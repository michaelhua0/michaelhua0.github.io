import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';

const exports = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/cameraLightPath.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText, { exports });

const geometry = new LineGeometry();
geometry.setPositions([0, 0, 0, 1, 0, 0, 2, 0, 0]);
const start = geometry.getAttribute('instanceStart');
const end = geometry.getAttribute('instanceEnd');
const buffer = start.data;
const storage = buffer.array;
for (let frame = 0; frame < 600; frame++) {
  const offset = Math.sin(frame / 60);
  exports.updateCameraLightPath(geometry, [offset, 0, 0, 1, offset, 0, 2, 0, offset]);
  assert.equal(geometry.getAttribute('instanceStart'), start);
  assert.equal(geometry.getAttribute('instanceEnd'), end);
  assert.equal(start.data, buffer);
  assert.equal(buffer.array, storage, 'Animation must reuse GPU buffer storage');
  assert.ok(Math.abs(start.getX(0) - offset) < 1e-6);
  assert.ok(Math.abs(end.getZ(1) - offset) < 1e-6);
  assert.ok(Number.isFinite(geometry.boundingSphere.radius));
}
assert.equal(buffer.version, 600, 'Each change marks the existing buffer for upload');
geometry.dispose();
console.log('600 light-path frames reused the same buffers with valid endpoints and bounds.');
