import{A as e,eo as t}from"./three-vendor-CpYT6u8q.js";var n=e=>typeof e==`object`&&typeof e.then==`function`,r=[];function i(e,t,n=(e,t)=>e===t){if(e===t)return!0;if(!e||!t)return!1;let r=e.length;if(t.length!==r)return!1;for(let i=0;i<r;i++)if(!n(e[i],t[i]))return!1;return!0}function a(e,t=null,a=!1,o={}){t===null&&(t=[e]);for(let e of r)if(i(t,e.keys,e.equal)){if(a)return;if(Object.prototype.hasOwnProperty.call(e,`error`))throw e.error;if(Object.prototype.hasOwnProperty.call(e,`response`))return o.lifespan&&o.lifespan>0&&(e.timeout&&clearTimeout(e.timeout),e.timeout=setTimeout(e.remove,o.lifespan)),e.response;if(!a)throw e.promise}let s={keys:t,equal:o.equal,remove:()=>{let e=r.indexOf(s);e!==-1&&r.splice(e,1)},promise:(n(e)?e:e(...t)).then(e=>{s.response=e,o.lifespan&&o.lifespan>0&&(s.timeout=setTimeout(s.remove,o.lifespan))}).catch(e=>s.error=e)};if(r.push(s),!a)throw s.promise}var o=(e,t,n)=>a(e,t,!1,n),s=(e,t,n)=>void a(e,t,!0,n),c=e=>{if(e===void 0||e.length===0)r.splice(0,r.length);else{let t=r.find(t=>i(e,t.keys,t.equal));t&&t.remove()}};function l(n,r=Math.PI/3){let i=Math.cos(r),a=(1+1e-10)*100,o=[new t,new t,new t],s=new t,c=new t,l=new t,u=new t;function d(e){return`${~~(e.x*a)},${~~(e.y*a)},${~~(e.z*a)}`}let f=n.index?n.toNonIndexed():n,p=f.attributes.position,m={};for(let e=0,n=p.count/3;e<n;e++){let n=3*e,r=o[0].fromBufferAttribute(p,n+0),i=o[1].fromBufferAttribute(p,n+1),a=o[2].fromBufferAttribute(p,n+2);s.subVectors(a,i),c.subVectors(r,i);let l=new t().crossVectors(s,c).normalize();for(let e=0;e<3;e++){let t=o[e],n=d(t);n in m||(m[n]=[]),m[n].push(l)}}let h=new Float32Array(p.count*3),g=new e(h,3,!1);for(let e=0,t=p.count/3;e<t;e++){let t=3*e,n=o[0].fromBufferAttribute(p,t+0),r=o[1].fromBufferAttribute(p,t+1),a=o[2].fromBufferAttribute(p,t+2);s.subVectors(a,r),c.subVectors(n,r),l.crossVectors(s,c).normalize();for(let e=0;e<3;e++){let n=o[e],r=m[d(n)];u.set(0,0,0);for(let e=0,t=r.length;e<t;e++){let t=r[e];l.dot(t)>i&&u.add(t)}u.normalize(),g.setXYZ(t+e,u.x,u.y,u.z)}}return f.setAttribute(`normal`,g),f}var u={uniforms:{tDiffuse:{value:null},h:{value:1/512}},vertexShader:`
      varying vec2 vUv;

      void main() {

        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

      }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float h;

    varying vec2 vUv;

    void main() {

    	vec4 sum = vec4( 0.0 );

    	sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * h, vUv.y ) ) * 0.051;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) ) * 0.0918;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) ) * 0.12245;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) ) * 0.1531;
    	sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) ) * 0.1531;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) ) * 0.12245;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) ) * 0.0918;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * h, vUv.y ) ) * 0.051;

    	gl_FragColor = sum;

    }
  `},d={uniforms:{tDiffuse:{value:null},v:{value:1/512}},vertexShader:`
    varying vec2 vUv;

    void main() {

      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }
  `,fragmentShader:`

  uniform sampler2D tDiffuse;
  uniform float v;

  varying vec2 vUv;

  void main() {

    vec4 sum = vec4( 0.0 );

    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * v ) ) * 0.051;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) ) * 0.0918;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) ) * 0.12245;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) ) * 0.1531;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) ) * 0.1531;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) ) * 0.12245;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) ) * 0.0918;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * v ) ) * 0.051;

    gl_FragColor = sum;

  }
  `};export{s as a,c as i,u as n,o,l as r,d as t};