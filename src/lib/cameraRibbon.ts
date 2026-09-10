export type Point3 = readonly [number, number, number];
const mix = (a: Point3, b: Point3, t: number): Point3 => [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
const distance = (a: Point3,b: Point3) => Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);

/** Millimetre-space route: down outside the PCB, over the ports, then into CSI.
 * USB housings occupy board-local x=27.5..42.5, with a 12.8 mm top surface.
 * The low leg remains outside x=47; the crossing is at y=19; the final descent
 * stays inside x=23. Rounded corners never leave these clearance corridors.
 */
export function cameraRibbonPath(start: Point3, board: Point3, count = 97): Point3[] {
  const [x,y,z]=board;
  const knots: Point3[]=[start,[start[0],y+2,start[2]],[x+47,y+2,z+4],[x+47,y+19,z+4],[x+23,y+19,z+4],[x+16,y+2.1,z+4]];
  const points: Point3[]=[start];
  for(let i=1;i<knots.length-1;i++){
    const p=knots[i],before=knots[i-1],after=knots[i+1];
    const radius=Math.min(2,distance(p,before)*.3,distance(p,after)*.3);
    const entry=mix(p,before,radius/distance(p,before));
    const exit=mix(p,after,radius/distance(p,after));
    points.push(entry);
    for(let j=1;j<=8;j++){const t=j/8;points.push(mix(mix(entry,p,t),mix(p,exit,t),t));}
  }
  points.push(knots.at(-1)!);
  const lengths=[0];for(let i=1;i<points.length;i++)lengths.push(lengths[i-1]+distance(points[i-1],points[i]));
  const total=lengths.at(-1)!;let segment=1;
  return Array.from({length:count},(_,i)=>{
    const position=total*i/(count-1);
    while(segment<lengths.length-1&&lengths[segment]<position)segment++;
    return mix(points[segment-1],points[segment],(position-lengths[segment-1])/(lengths[segment]-lengths[segment-1]));
  });
}
