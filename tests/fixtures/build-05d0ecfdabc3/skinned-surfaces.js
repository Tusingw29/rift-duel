import * as T from './vendor/three.module.js';
// Ring surfaces with explicit world-space bind coordinates and up to four
// weights per vertex. Merge by material after authoring to bound draw calls.
export function skinnedSurfaces(body,bones,materials){
 body.parent.updateMatrixWorld(true);const skeleton=new T.Skeleton(bones);
 const one=b=>[[bones.indexOf(b),1]],blend=(a,b,w)=>[[bones.indexOf(a),1-w],[bones.indexOf(b),w]];
 function surface(rings,material,sides=12){
  if(rings.at(-1)[1]<rings[0][1])rings=[...rings].reverse();
  const cap=r=>[r[0],r[1],r[2],0,0,r[5]];rings=[cap(rings[0]),...rings,cap(rings.at(-1))];
  const pos=[],normalWeights=[],skinIndex=[],uv=[],colors=[],indices=[];
  const low=rings[0][1],height=Math.max(.001,rings.at(-1)[1]-low);
  for(const [x,y,z,rx,rz,bind] of rings)for(let i=0;i<=sides;i++){
   const a=i/sides*Math.PI*2;pos.push(x+Math.cos(a)*rx,y,z+Math.sin(a)*rz);uv.push(i/sides,(y-low)/height);
   const ids=[0,0,0,0],weights=[0,0,0,0];bind.forEach(([id,w],j)=>{ids[j]=id;weights[j]=w;});skinIndex.push(...ids);normalWeights.push(...weights);
   const shade=.88+.12*Math.sin(a);colors.push(shade,shade,shade);
  }
  for(let j=0;j<rings.length-1;j++)for(let i=0;i<sides;i++){const a=j*(sides+1)+i,b=a+sides+1;indices.push(a,b,a+1,b,b+1,a+1);}
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setAttribute('color',new T.Float32BufferAttribute(colors,3));geo.setAttribute('skinIndex',new T.Uint16BufferAttribute(skinIndex,4));geo.setAttribute('skinWeight',new T.Float32BufferAttribute(normalWeights,4));geo.setIndex(indices);geo.computeVertexNormals();
  const mesh=new T.SkinnedMesh(geo,materials[material]);body.add(mesh);mesh.bind(skeleton);mesh.castShadow=true;mesh.frustumCulled=false;return mesh;
 }
 function batch(){for(const material of Object.values(materials)){
  const pieces=body.children.filter(n=>n.isSkinnedMesh&&n.material===material);if(pieces.length<2)continue;
  const arrays={},indices=[];let offset=0;for(const name of Object.keys(pieces[0].geometry.attributes))arrays[name]=[];
  for(const mesh of pieces){for(const [name,attr] of Object.entries(mesh.geometry.attributes))arrays[name].push(...attr.array);for(const i of mesh.geometry.index.array)indices.push(i+offset);offset+=mesh.geometry.attributes.position.count;}
  const geo=new T.BufferGeometry();for(const [name,array] of Object.entries(arrays)){const size=pieces[0].geometry.attributes[name].itemSize;geo.setAttribute(name,name==='skinIndex'?new T.Uint16BufferAttribute(array,size):new T.Float32BufferAttribute(array,size));}geo.setIndex(indices);
  const mesh=new T.SkinnedMesh(geo,material);body.add(mesh);mesh.bind(skeleton);mesh.castShadow=true;mesh.frustumCulled=false;
  for(const piece of pieces){body.remove(piece);piece.geometry.dispose();}
 }}
 return {skeleton,surface,one,blend,batch};
}
