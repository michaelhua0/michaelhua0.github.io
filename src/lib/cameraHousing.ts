import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { cameraDimensions as dimensions, cameraEnclosure as enclosure, mm } from "./cameraDimensions";

type Point = [number, number, number];

// One mesh with a flush front, planar walls, and a circular lens opening.
// Outer corners share the exact same coordinates; there are no inset end caps
// or overlapping coplanar rims to make the front look folded.
export function createCameraHousingGeometry() {
  const front = mm(enclosure.front), rear = mm(enclosure.rear);
  const h = mm(dimensions.overall.height / 2), d = mm(dimensions.overall.depth / 2);
  const wall = mm(dimensions.wall), radius = mm(dimensions.imaging.diameter / 2);
  const positions: number[] = [], normals: number[] = [];
  const quad = (a: Point, b: Point, c: Point, e: Point, normal: Point) => {
    const cross = new THREE.Vector3().crossVectors(new THREE.Vector3(...b).sub(new THREE.Vector3(...a)), new THREE.Vector3(...c).sub(new THREE.Vector3(...a)));
    const points = cross.dot(new THREE.Vector3(...normal)) >= 0 ? [a,b,c,a,c,e] : [a,c,b,a,e,c];
    points.forEach(point => { positions.push(...point); normals.push(...normal); });
  };
  for (const sign of [-1, 1]) {
    quad([front,sign*h,-d],[rear,sign*h,-d],[rear,sign*h,d],[front,sign*h,d],[0,sign,0]);
    quad([front,-h,sign*d],[rear,-h,sign*d],[rear,h,sign*d],[front,h,sign*d],[0,0,sign]);
    const x0=front+wall, x1=rear-wall, ih=h-wall, id=d-wall;
    quad([x0,sign*ih,-id],[x1,sign*ih,-id],[x1,sign*ih,id],[x0,sign*ih,id],[0,-sign,0]);
    quad([x0,-ih,sign*id],[x1,-ih,sign*id],[x1,ih,sign*id],[x0,ih,sign*id],[0,0,-sign]);
  }
  quad([rear,-h,-d],[rear,h,-d],[rear,h,d],[rear,-h,d],[1,0,0]);
  quad([rear-wall,-h+wall,-d+wall],[rear-wall,h-wall,-d+wall],[rear-wall,h-wall,d-wall],[rear-wall,-h+wall,d-wall],[-1,0,0]);
  for(let i=0;i<96;i++) {
    const a=i*Math.PI/48, b=(i+1)*Math.PI/48, mid=(a+b)/2;
    quad([front,radius*Math.cos(a),radius*Math.sin(a)],[front+wall,radius*Math.cos(a),radius*Math.sin(a)],[front+wall,radius*Math.cos(b),radius*Math.sin(b)],[front,radius*Math.cos(b),radius*Math.sin(b)],[0,-Math.cos(mid),-Math.sin(mid)]);
  }
  const sides = new THREE.BufferGeometry();
  sides.setAttribute("position", new THREE.Float32BufferAttribute(positions,3));
  sides.setAttribute("normal", new THREE.Float32BufferAttribute(normals,3));
  const face = (halfWidth: number, halfHeight: number, x: number, inward: boolean) => {
    const shape = new THREE.Shape();
    shape.moveTo(-halfWidth,-halfHeight);shape.lineTo(halfWidth,-halfHeight);shape.lineTo(halfWidth,halfHeight);shape.lineTo(-halfWidth,halfHeight);shape.closePath();
    const hole = new THREE.Path();hole.absarc(0,0,radius,0,Math.PI*2,true);shape.holes.push(hole);
    const indexed = new THREE.ShapeGeometry(shape,48);
    const geometry = indexed.toNonIndexed();indexed.dispose();
    geometry.deleteAttribute("uv");
    geometry.rotateY(inward ? Math.PI/2 : -Math.PI/2);geometry.translate(x,0,0);
    return geometry;
  };
  const faces = [sides,face(d,h,front,false),face(d-wall,h-wall,front+wall,true)];
  const housing = mergeGeometries(faces);
  faces.forEach(part=>part.dispose());
  if(!housing) throw new Error("Camera housing geometry could not be assembled");
  housing.computeBoundingBox();housing.computeBoundingSphere();
  return housing;
}
