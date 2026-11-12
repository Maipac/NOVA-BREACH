(()=>{var eu=0,dc=1,iu=2;var ms=1,nu=2,er=3,Zn=0,Je=1,vi=2,An=0,cn=1,hn=2,fc=3,pc=4,su=5;var gs=100,ru=101,au=102,ou=103,lu=104,cu=200,hu=201,uu=202,du=203,mc=204,gc=205,fu=206,pu=207,mu=208,gu=209,xu=210,_u=211,vu=212,yu=213,Mu=214,qa=0,Ya=1,Za=2,Xs=3,$a=4,Ja=5,Ka=6,Qa=7,xc=0,Su=1,bu=2,yi=0,_c=1,vc=2,yc=3,Mc=4,Sc=5,bc=6,wc=7;var Tc=300,xs=301,ir=302,nr=303,So=304,qs=1e3,Oi=1001,ja=1002,Ze=1003,wu=1004;var ta=1005;var Ue=1006,bo=1007;var Ri=1008;var li=1009,Ec=1010,Ac=1011,sr=1012,wo=1013,Qi=1014,Ci=1015,Ie=1016,To=1017,Eo=1018,_s=1020,Rc=35902,Cc=35899,Pc=1021,Ic=1022,pi=1023,Sn=1026,Rn=1027,Lc=1028,Ao=1029,$n=1030,Ro=1031;var Co=1033,ea=33776,ia=33777,na=33778,sa=33779,Po=35840,Io=35841,Lo=35842,Do=35843,No=36196,Uo=37492,Fo=37496,Oo=37488,Bo=37489,ra=37490,zo=37491,ko=37808,Ho=37809,Go=37810,Vo=37811,Wo=37812,Xo=37813,qo=37814,Yo=37815,Zo=37816,$o=37817,Jo=37818,Ko=37819,Qo=37820,jo=37821,tl=36492,el=36494,il=36495,nl=36283,sl=36284,aa=36285,rl=36286;var Pr=2300,to=2301,Wa=2302,sc=2303,rc=2400,ac=2401,oc=2402;var Tu=3200;var al=0,Eu=1,ji="",De="srgb",hs="srgb-linear",Ir="linear",ue="srgb";var Xa=7680;var Au=519,Ru=512,Cu=513,Pu=514,Dc=515,Iu=516,Lu=517,Nc=518,Uc=519,Fc=35044,Oc=35048;var Bc="300 es",Bi=2e3,Ys=2001;function sf(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function rf(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}function Lr(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Du(){let n=Lr("canvas");return n.style.display="block",n}var Ch={},Zs=null;function Dr(...n){let t="THREE."+n.shift();Zs?Zs("log",t,...n):console.log(t,...n)}function Nu(n){let t=n[0];if(typeof t=="string"&&t.startsWith("TSL:")){let e=n[1];e&&e.isStackTrace?n[0]+=" "+e.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Ot(...n){n=Nu(n);let t="THREE."+n.shift();if(Zs)Zs("warn",t,...n);else{let e=n[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...n)}}function Bt(...n){n=Nu(n);let t="THREE."+n.shift();if(Zs)Zs("error",t,...n);else{let e=n[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...n)}}function Cr(...n){let t=n.join(" ");t in Ch||(Ch[t]=!0,Ot(...n))}function Uu(n,t,e){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:i()}}setTimeout(r,e)})}var Fu={[qa]:qa,[Za]:Ka,[$a]:$a,[Xs]:Ja,[Ya]:Ya,[Ka]:Za,[Qa]:Qa,[Ja]:Xs},ln=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){let i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){let i=this._listeners;if(i===void 0)return;let s=i[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let i=e[t.type];if(i!==void 0){t.target=this;let s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}},ni=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var Ul=Math.PI/180,eo=180/Math.PI;function vs(){let n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(ni[n&255]+ni[n>>8&255]+ni[n>>16&255]+ni[n>>24&255]+"-"+ni[t&255]+ni[t>>8&255]+"-"+ni[t>>16&15|64]+ni[t>>24&255]+"-"+ni[e&63|128]+ni[e>>8&255]+"-"+ni[e>>16&255]+ni[e>>24&255]+ni[i&255]+ni[i>>8&255]+ni[i>>16&255]+ni[i>>24&255]).toLowerCase()}function re(n,t,e){return Math.max(t,Math.min(e,n))}function af(n,t){return(n%t+t)%t}function Fl(n,t,e){return(1-e)*n+e*t}function Ou(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function ol(n){switch(n.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function Bu(n,t){if(t.constructor===Float32Array)return n;let e=ol(t);if(e===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(n/e,-1)}function zu(n,t){if(t.constructor===Float32Array)return n;let e=ol(t);if(e===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(n*e)}var Pt=class{static{this.prototype.isVector2=!0}constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=re(this.x,t.x,e.x),this.y=re(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=re(this.x,t,e),this.y=re(this.y,t,e),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(re(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let i=this.dot(t)/e;return Math.acos(re(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let i=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*i-a*s+t.x,this.y=r*s+a*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},ze=class{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,r,a,o){let l=i[s+0],c=i[s+1],h=i[s+2],u=i[s+3],d=r[a+0],f=r[a+1],m=r[a+2],x=r[a+3];if(u!==x||l!==d||c!==f||h!==m){let p=l*d+c*f+h*m+u*x;p<0&&(d=-d,f=-f,m=-m,x=-x,p=-p);let g=1-o;if(p<.9995){let v=Math.acos(p),w=Math.sin(v);g=Math.sin(g*v)/w,o=Math.sin(o*v)/w,l=l*g+d*o,c=c*g+f*o,h=h*g+m*o,u=u*g+x*o}else{l=l*g+d*o,c=c*g+f*o,h=h*g+m*o,u=u*g+x*o;let v=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=v,c*=v,h*=v,u*=v}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,s,r,a){let o=i[s],l=i[s+1],c=i[s+2],h=i[s+3],u=r[a],d=r[a+1],f=r[a+2],m=r[a+3];return t[e]=o*m+h*u+l*f-c*d,t[e+1]=l*m+h*d+c*u-o*f,t[e+2]=c*m+h*f+o*d-l*u,t[e+3]=h*m-o*u-l*d-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let i=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(s/2),u=o(r/2),d=l(i/2),f=l(s/2),m=l(r/2);switch(a){case"XYZ":this._x=d*h*u+c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u-d*f*m;break;case"YXZ":this._x=d*h*u+c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u+d*f*m;break;case"ZXY":this._x=d*h*u-c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u-d*f*m;break;case"ZYX":this._x=d*h*u-c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u+d*f*m;break;case"YZX":this._x=d*h*u+c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u-d*f*m;break;case"XZY":this._x=d*h*u-c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u+d*f*m;break;default:Ot("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,i=e[0],s=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],u=e[10],d=i+o+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(a-s)*f}else if(i>o&&i>u){let f=2*Math.sqrt(1+i-o-u);this._w=(h-l)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+c)/f}else if(o>u){let f=2*Math.sqrt(1+o-i-u);this._w=(r-c)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+u-i-o);this._w=(a-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(re(this.dot(t),-1,1)))}rotateTowards(t,e){let i=this.angleTo(t);if(i===0)return this;let s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let i=t._x,s=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=i*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-i*c,this._z=r*h+a*c+i*l-s*o,this._w=a*h-i*o-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){let i=t._x,s=t._y,r=t._z,a=t._w,o=this.dot(t);o<0&&(i=-i,s=-s,r=-r,a=-a,o=-o);let l=1-e;if(o<.9995){let c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+i*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this._onChangeCallback()}else this._x=this._x*l+i*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this.normalize();return this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},F=class{static{this.prototype.isVector3=!0}constructor(t=0,e=0,i=0){this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Ph.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Ph.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*i+r[6]*s,this.y=r[1]*e+r[4]*i+r[7]*s,this.z=r[2]*e+r[5]*i+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,i=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(t){let e=this.x,i=this.y,s=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*s-o*i),h=2*(o*e-r*s),u=2*(r*i-a*e);return this.x=e+l*c+a*u-o*h,this.y=i+l*h+o*c-r*u,this.z=s+l*u+r*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*s,this.y=r[1]*e+r[5]*i+r[9]*s,this.z=r[2]*e+r[6]*i+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=re(this.x,t.x,e.x),this.y=re(this.y,t.y,e.y),this.z=re(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=re(this.x,t,e),this.y=re(this.y,t,e),this.z=re(this.z,t,e),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(re(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let i=t.x,s=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=s*l-r*o,this.y=r*a-i*l,this.z=i*o-s*a,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Ol.copy(this).projectOnVector(t),this.sub(Ol)}reflect(t){return this.sub(Ol.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let i=this.dot(t)/e;return Math.acos(re(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){let s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Ol=new F,Ph=new ze,zt=class{static{this.prototype.isMatrix3=!0}constructor(t,e,i,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,a,o,l,c)}set(t,e,i,s,r,a,o,l,c){let h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=r,h[5]=l,h[6]=i,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let i=t.elements,s=e.elements,r=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],h=i[4],u=i[7],d=i[2],f=i[5],m=i[8],x=s[0],p=s[3],g=s[6],v=s[1],w=s[4],y=s[7],E=s[2],A=s[5],_=s[8];return r[0]=a*x+o*v+l*E,r[3]=a*p+o*w+l*A,r[6]=a*g+o*y+l*_,r[1]=c*x+h*v+u*E,r[4]=c*p+h*w+u*A,r[7]=c*g+h*y+u*_,r[2]=d*x+f*v+m*E,r[5]=d*p+f*w+m*A,r[8]=d*g+f*y+m*_,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-i*r*h+i*o*l+s*r*c-s*a*l}invert(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],u=h*a-o*c,d=o*l-h*r,f=c*r-a*l,m=e*u+i*d+s*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/m;return t[0]=u*x,t[1]=(s*c-h*i)*x,t[2]=(o*i-s*a)*x,t[3]=d*x,t[4]=(h*e-s*l)*x,t[5]=(s*r-o*e)*x,t[6]=f*x,t[7]=(i*l-c*e)*x,t[8]=(a*e-i*r)*x,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,r,a,o){let l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*a+c*o)+a+t,-s*c,s*l,-s*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return Cr("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Bl.makeScale(t,e)),this}rotate(t){return Cr("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Bl.makeRotation(-t)),this}translate(t,e){return Cr("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Bl.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){let i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}},Bl=new zt,Ih=new zt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Lh=new zt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function of(){let n={enabled:!0,workingColorSpace:hs,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ue&&(s.r=Mn(s.r),s.g=Mn(s.g),s.b=Mn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ue&&(s.r=Ws(s.r),s.g=Ws(s.g),s.b=Ws(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ji?Ir:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[a].fromXYZ).multiply(this.spaces[r].toXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[hs]:{primaries:t,whitePoint:i,transfer:Ir,toXYZ:Ih,fromXYZ:Lh,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:De},outputColorSpaceConfig:{drawingBufferColorSpace:De}},[De]:{primaries:t,whitePoint:i,transfer:ue,toXYZ:Ih,fromXYZ:Lh,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:De}}}),n}var se=of();function Mn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Ws(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}var As,io=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{As===void 0&&(As=Lr("canvas")),As.width=t.width,As.height=t.height;let s=As.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),i=As}return i.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=Lr("canvas");e.width=t.width,e.height=t.height;let i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);let s=i.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Mn(r[a]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Mn(e[i]/255)*255):e[i]=Mn(e[i]);return{data:e,width:t.width,height:t.height}}else return Ot("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},lf=0,$s=class{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:lf++}),this.uuid=vs(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width||0,e.height||0,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(zl(s[a].image)):r.push(zl(s[a]))}else r=zl(s);i.url=r}return e||(t.images[this.uuid]=i),i}};function zl(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?io.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Ot("Texture: Unable to serialize Texture."),{})}var cf=0,kl=new F,_i=class n extends ln{constructor(t=n.DEFAULT_IMAGE,e=n.DEFAULT_MAPPING,i=Oi,s=Oi,r=Ue,a=Ri,o=pi,l=li,c=n.DEFAULT_ANISOTROPY,h=ji){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:cf++}),this.uuid=vs(),this.name="",this.source=new $s(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Pt(0,0),this.repeat=new Pt(1,1),this.center=new Pt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new zt,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(kl).x}get height(){return this.source.getSize(kl).y}get depth(){return this.source.getSize(kl).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.mipmapsAutoUpdate=t.mipmapsAutoUpdate,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isPMREMTexture=t.isPMREMTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let i=t[e];if(i===void 0){Ot(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){Ot(`Texture.setValues(): property '${e}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[e]=i}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Tc)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case qs:t.x=t.x-Math.floor(t.x);break;case Oi:t.x=t.x<0?0:1;break;case ja:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case qs:t.y=t.y-Math.floor(t.y);break;case Oi:t.y=t.y<0?0:1;break;case ja:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};_i.DEFAULT_IMAGE=null;_i.DEFAULT_MAPPING=Tc;_i.DEFAULT_ANISOTROPY=1;var ye=class{static{this.prototype.isVector4=!0}constructor(t=0,e=0,i=0,s=1){this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,i=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*i+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,r,l=t.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],m=l[9],x=l[2],p=l[6],g=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-x)<.01&&Math.abs(m-p)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+x)<.1&&Math.abs(m+p)<.1&&Math.abs(c+f+g-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let w=(c+1)/2,y=(f+1)/2,E=(g+1)/2,A=(h+d)/4,_=(u+x)/4,T=(m+p)/4;return w>y&&w>E?w<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(w),s=A/i,r=_/i):y>E?y<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),i=A/s,r=T/s):E<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(E),i=_/r,s=T/r),this.set(i,s,r,e),this}let v=Math.sqrt((p-m)*(p-m)+(u-x)*(u-x)+(d-h)*(d-h));return Math.abs(v)<.001&&(v=1),this.x=(p-m)/v,this.y=(u-x)/v,this.z=(d-h)/v,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=re(this.x,t.x,e.x),this.y=re(this.y,t.y,e.y),this.z=re(this.z,t.z,e.z),this.w=re(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=re(this.x,t,e),this.y=re(this.y,t,e),this.z=re(this.z,t,e),this.w=re(this.w,t,e),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(re(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},no=class extends ln{constructor(t=1,e=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ue,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=i.depth,this.scissor=new ye(0,0,t,e),this.scissorTest=!1,this.viewport=new ye(0,0,t,e),this.textures=[];let s=i.count;for(let r=0;r<s;r++)this.textures[r]=new _i({width:t,height:e,depth:i.depth}),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(t={}){let e={minFilter:Ue,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.mipmapsAutoUpdate!==void 0&&(e.mipmapsAutoUpdate=t.mipmapsAutoUpdate),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,i=t.textures.length;e<i;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let s=Object.assign({},t.textures[e].image);this.textures[e].source=new $s(s)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){let e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;else this.depthTexture=null;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Pe=class extends no{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}},Nr=class extends _i{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Ze,this.minFilter=Ze,this.wrapR=Oi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var so=class extends _i{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Ze,this.minFilter=Ze,this.wrapR=Oi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}};var pe=class n{static{this.prototype.isMatrix4=!0}constructor(t,e,i,s,r,a,o,l,c,h,u,d,f,m,x,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,a,o,l,c,h,u,d,f,m,x,p)}set(t,e,i,s,r,a,o,l,c,h,u,d,f,m,x,p){let g=this.elements;return g[0]=t,g[4]=e,g[8]=i,g[12]=s,g[1]=r,g[5]=a,g[9]=o,g[13]=l,g[2]=c,g[6]=h,g[10]=u,g[14]=d,g[3]=f,g[7]=m,g[11]=x,g[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new n().fromArray(this.elements)}copy(t){let e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){let e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),i.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let e=this.elements,i=t.elements,s=1/Rs.setFromMatrixColumn(t,0).length(),r=1/Rs.setFromMatrixColumn(t,1).length(),a=1/Rs.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*r,e[5]=i[5]*r,e[6]=i[6]*r,e[7]=0,e[8]=i[8]*a,e[9]=i[9]*a,e[10]=i[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,i=t.x,s=t.y,r=t.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){let d=a*h,f=a*u,m=o*h,x=o*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=f+m*c,e[5]=d-x*c,e[9]=-o*l,e[2]=x-d*c,e[6]=m+f*c,e[10]=a*l}else if(t.order==="YXZ"){let d=l*h,f=l*u,m=c*h,x=c*u;e[0]=d+x*o,e[4]=m*o-f,e[8]=a*c,e[1]=a*u,e[5]=a*h,e[9]=-o,e[2]=f*o-m,e[6]=x+d*o,e[10]=a*l}else if(t.order==="ZXY"){let d=l*h,f=l*u,m=c*h,x=c*u;e[0]=d-x*o,e[4]=-a*u,e[8]=m+f*o,e[1]=f+m*o,e[5]=a*h,e[9]=x-d*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){let d=a*h,f=a*u,m=o*h,x=o*u;e[0]=l*h,e[4]=m*c-f,e[8]=d*c+x,e[1]=l*u,e[5]=x*c+d,e[9]=f*c-m,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){let d=a*l,f=a*c,m=o*l,x=o*c;e[0]=l*h,e[4]=x-d*u,e[8]=m*u+f,e[1]=u,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=f*u+m,e[10]=d-x*u}else if(t.order==="XZY"){let d=a*l,f=a*c,m=o*l,x=o*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=d*u+x,e[5]=a*h,e[9]=f*u-m,e[2]=m*u-f,e[6]=o*h,e[10]=x*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(hf,t,uf)}lookAt(t,e,i){let s=this.elements;return wi.subVectors(t,e),wi.lengthSq()===0&&(wi.z=1),wi.normalize(),Nn.crossVectors(i,wi),Nn.lengthSq()===0&&(Math.abs(i.z)===1?wi.x+=1e-4:wi.z+=1e-4,wi.normalize(),Nn.crossVectors(i,wi)),Nn.normalize(),Ma.crossVectors(wi,Nn),s[0]=Nn.x,s[4]=Ma.x,s[8]=wi.x,s[1]=Nn.y,s[5]=Ma.y,s[9]=wi.y,s[2]=Nn.z,s[6]=Ma.z,s[10]=wi.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let i=t.elements,s=e.elements,r=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],h=i[1],u=i[5],d=i[9],f=i[13],m=i[2],x=i[6],p=i[10],g=i[14],v=i[3],w=i[7],y=i[11],E=i[15],A=s[0],_=s[4],T=s[8],I=s[12],R=s[1],D=s[5],N=s[9],O=s[13],P=s[2],z=s[6],V=s[10],X=s[14],st=s[3],Y=s[7],tt=s[11],it=s[15];return r[0]=a*A+o*R+l*P+c*st,r[4]=a*_+o*D+l*z+c*Y,r[8]=a*T+o*N+l*V+c*tt,r[12]=a*I+o*O+l*X+c*it,r[1]=h*A+u*R+d*P+f*st,r[5]=h*_+u*D+d*z+f*Y,r[9]=h*T+u*N+d*V+f*tt,r[13]=h*I+u*O+d*X+f*it,r[2]=m*A+x*R+p*P+g*st,r[6]=m*_+x*D+p*z+g*Y,r[10]=m*T+x*N+p*V+g*tt,r[14]=m*I+x*O+p*X+g*it,r[3]=v*A+w*R+y*P+E*st,r[7]=v*_+w*D+y*z+E*Y,r[11]=v*T+w*N+y*V+E*tt,r[15]=v*I+w*O+y*X+E*it,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],i=t[4],s=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],u=t[6],d=t[10],f=t[14],m=t[3],x=t[7],p=t[11],g=t[15],v=l*f-c*d,w=o*f-c*u,y=o*d-l*u,E=a*f-c*h,A=a*d-l*h,_=a*u-o*h;return e*(x*v-p*w+g*y)-i*(m*v-p*E+g*A)+s*(m*w-x*E+g*_)-r*(m*y-x*A+p*_)}determinantAffine(){let t=this.elements,e=t[0],i=t[4],s=t[8],r=t[1],a=t[5],o=t[9],l=t[2],c=t[6],h=t[10];return e*(a*h-o*c)-i*(r*h-o*l)+s*(r*c-a*l)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],u=t[9],d=t[10],f=t[11],m=t[12],x=t[13],p=t[14],g=t[15],v=e*o-i*a,w=e*l-s*a,y=e*c-r*a,E=i*l-s*o,A=i*c-r*o,_=s*c-r*l,T=h*x-u*m,I=h*p-d*m,R=h*g-f*m,D=u*p-d*x,N=u*g-f*x,O=d*g-f*p,P=v*O-w*N+y*D+E*R-A*I+_*T;if(P===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let z=1/P;return t[0]=(o*O-l*N+c*D)*z,t[1]=(s*N-i*O-r*D)*z,t[2]=(x*_-p*A+g*E)*z,t[3]=(d*A-u*_-f*E)*z,t[4]=(l*R-a*O-c*I)*z,t[5]=(e*O-s*R+r*I)*z,t[6]=(p*y-m*_-g*w)*z,t[7]=(h*_-d*y+f*w)*z,t[8]=(a*N-o*R+c*T)*z,t[9]=(i*R-e*N-r*T)*z,t[10]=(m*A-x*y+g*v)*z,t[11]=(u*y-h*A-f*v)*z,t[12]=(o*I-a*D-l*T)*z,t[13]=(e*D-i*I+s*T)*z,t[14]=(x*w-m*E-p*v)*z,t[15]=(h*E-u*w+d*v)*z,this}scale(t){let e=this.elements,i=t.x,s=t.y,r=t.z;return e[0]*=i,e[4]*=s,e[8]*=r,e[1]*=i,e[5]*=s,e[9]*=r,e[2]*=i,e[6]*=s,e[10]*=r,e[3]*=i,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let i=Math.cos(e),s=Math.sin(e),r=1-i,a=t.x,o=t.y,l=t.z,c=r*a,h=r*o;return this.set(c*a+i,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+i,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,r,a){return this.set(1,i,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){let s=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,h=a+a,u=o+o,d=r*c,f=r*h,m=r*u,x=a*h,p=a*u,g=o*u,v=l*c,w=l*h,y=l*u,E=i.x,A=i.y,_=i.z;return s[0]=(1-(x+g))*E,s[1]=(f+y)*E,s[2]=(m-w)*E,s[3]=0,s[4]=(f-y)*A,s[5]=(1-(d+g))*A,s[6]=(p+v)*A,s[7]=0,s[8]=(m+w)*_,s[9]=(p-v)*_,s[10]=(1-(d+x))*_,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){let s=this.elements;t.x=s[12],t.y=s[13],t.z=s[14];let r=this.determinantAffine();if(r===0)return i.set(1,1,1),e.identity(),this;let a=Rs.set(s[0],s[1],s[2]).length(),o=Rs.set(s[4],s[5],s[6]).length(),l=Rs.set(s[8],s[9],s[10]).length();r<0&&(a=-a),$i.copy(this);let c=1/a,h=1/o,u=1/l;return $i.elements[0]*=c,$i.elements[1]*=c,$i.elements[2]*=c,$i.elements[4]*=h,$i.elements[5]*=h,$i.elements[6]*=h,$i.elements[8]*=u,$i.elements[9]*=u,$i.elements[10]*=u,e.setFromRotationMatrix($i),i.x=a,i.y=o,i.z=l,this}makePerspective(t,e,i,s,r,a,o=Bi,l=!1){let c=this.elements,h=2*r/(e-t),u=2*r/(i-s),d=(e+t)/(e-t),f=(i+s)/(i-s),m,x;if(l)m=r/(a-r),x=a*r/(a-r);else if(o===Bi)m=-(a+r)/(a-r),x=-2*a*r/(a-r);else if(o===Ys)m=-a/(a-r),x=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,s,r,a,o=Bi,l=!1){let c=this.elements,h=2/(e-t),u=2/(i-s),d=-(e+t)/(e-t),f=-(i+s)/(i-s),m,x;if(l)m=1/(a-r),x=a/(a-r);else if(o===Bi)m=-2/(a-r),x=-(a+r)/(a-r);else if(o===Ys)m=-1/(a-r),x=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=m,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){let i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}},Rs=new F,$i=new pe,hf=new F(0,0,0),uf=new F(1,1,1),Nn=new F,Ma=new F,wi=new F,Dh=new pe,Nh=new ze,bn=class n{constructor(t=0,e=0,i=0,s=n.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){let s=t.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(re(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-re(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(re(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-re(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(re(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-re(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Ot("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return Dh.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Dh,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Nh.setFromEuler(this),this.setFromQuaternion(Nh,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};bn.DEFAULT_ORDER="XYZ";var Ur=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},df=0,Uh=new F,Cs=new ze,mn=new pe,Sa=new F,Sr=new F,ff=new F,pf=new ze,Fh=new F(1,0,0),Oh=new F(0,1,0),Bh=new F(0,0,1),zh={type:"added"},mf={type:"removed"},Ps={type:"childadded",child:null},Hl={type:"childremoved",child:null},ai=class n extends ln{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:df++}),this.uuid=vs(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let t=new F,e=new bn,i=new ze,s=new F(1,1,1);function r(){i.setFromEuler(e,!1)}function a(){e.setFromQuaternion(i,void 0,!1)}e._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new pe},normalMatrix:{value:new zt}}),this.matrix=new pe,this.matrixWorld=new pe,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ur,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Cs.setFromAxisAngle(t,e),this.quaternion.multiply(Cs),this}rotateOnWorldAxis(t,e){return Cs.setFromAxisAngle(t,e),this.quaternion.premultiply(Cs),this}rotateX(t){return this.rotateOnAxis(Fh,t)}rotateY(t){return this.rotateOnAxis(Oh,t)}rotateZ(t){return this.rotateOnAxis(Bh,t)}translateOnAxis(t,e){return Uh.copy(t).applyQuaternion(this.quaternion),this.position.add(Uh.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Fh,t)}translateY(t){return this.translateOnAxis(Oh,t)}translateZ(t){return this.translateOnAxis(Bh,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(mn.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?Sa.copy(t):Sa.set(t,e,i);let s=this.parent;this.updateWorldMatrix(!0,!1),Sr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?mn.lookAt(Sr,Sa,this.up):mn.lookAt(Sa,Sr,this.up),this.quaternion.setFromRotationMatrix(mn),s&&(mn.extractRotation(s.matrixWorld),Cs.setFromRotationMatrix(mn),this.quaternion.premultiply(Cs.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(Bt("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(zh),Ps.child=t,this.dispatchEvent(Ps),Ps.child=null):Bt("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(mf),Hl.child=t,this.dispatchEvent(Hl),Hl.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),mn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),mn.multiply(t.parent.matrixWorld)),t.applyMatrix4(mn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(zh),Ps.child=t,this.dispatchEvent(Ps),Ps.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){let a=this.children[i].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Sr,t,ff),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Sr,pf,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(t){t(this);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let e=t.x,i=t.y,s=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*i-r[8]*s,r[13]+=i-r[1]*e-r[5]*i-r[9]*s,r[14]+=s-r[2]*e-r[6]*i-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e,i=!1){let s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),e===!0){let r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,i)}}toJSON(t){let e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(t.shapes,u)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(r(t.animations,l))}}if(e){let o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),u=a(t.shapes),d=a(t.skeletons),f=a(t.animations),m=a(t.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=f),m.length>0&&(i.nodes=m)}return i.object=s,i;function a(o){let l=[];for(let c in o){let h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){let s=t.children[i];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};ai.DEFAULT_UP=new F(0,1,0);ai.DEFAULT_MATRIX_AUTO_UPDATE=!0;ai.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var he=class extends ai{constructor(){super(),this.isGroup=!0,this.type="Group"}},gf={type:"move"},Js=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new he,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new he,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new F,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new F),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new he,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new F,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new F,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,r=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(let x of t.hand.values()){let p=e.getJointPose(x,i),g=this._getHandJoint(c,x);p!==null&&(g.matrix.fromArray(p.transform.matrix),g.matrix.decompose(g.position,g.quaternion,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=p.radius),g.visible=p!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,m=.005;c.inputState.pinching&&d>f+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=f-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.quaternion,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));o!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(gf)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let i=new he;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}},ku={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Un={h:0,s:0,l:0},ba={h:0,s:0,l:0};function Gl(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}var Dt=class{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=De){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,se.colorSpaceToWorking(this,e),this}setRGB(t,e,i,s=se.workingColorSpace){return this.r=t,this.g=e,this.b=i,se.colorSpaceToWorking(this,s),this}setHSL(t,e,i,s=se.workingColorSpace){if(t=af(t,1),e=re(e,0,1),i=re(i,0,1),e===0)this.r=this.g=this.b=i;else{let r=i<=.5?i*(1+e):i+e-i*e,a=2*i-r;this.r=Gl(a,r,t+1/3),this.g=Gl(a,r,t),this.b=Gl(a,r,t-1/3)}return se.colorSpaceToWorking(this,s),this}setStyle(t,e=De){function i(r){r!==void 0&&parseFloat(r)<1&&Ot("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseFloat(r[1]))/100,Math.min(100,parseFloat(r[2]))/100,Math.min(100,parseFloat(r[3]))/100,e);break;case"hsl":case"hsla":if(r=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Ot("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);Ot("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=De){let i=ku[t.toLowerCase()];return i!==void 0?this.setHex(i,e):Ot("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Mn(t.r),this.g=Mn(t.g),this.b=Mn(t.b),this}copyLinearToSRGB(t){return this.r=Ws(t.r),this.g=Ws(t.g),this.b=Ws(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=De){return se.workingToColorSpace(si.copy(this),t),Math.round(re(si.r*255,0,255))*65536+Math.round(re(si.g*255,0,255))*256+Math.round(re(si.b*255,0,255))}getHexString(t=De){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=se.workingColorSpace){se.workingToColorSpace(si.copy(this),e);let i=si.r,s=si.g,r=si.b,a=Math.max(i,s,r),o=Math.min(i,s,r),l,c,h=(o+a)/2;if(o===a)l=0,c=0;else{let u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case i:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-i)/u+2;break;case r:l=(i-s)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=se.workingColorSpace){return se.workingToColorSpace(si.copy(this),e),t.r=si.r,t.g=si.g,t.b=si.b,t}getStyle(t=De){se.workingToColorSpace(si.copy(this),t);let e=si.r,i=si.g,s=si.b;return t!==De?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(Un),this.setHSL(Un.h+t,Un.s+e,Un.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Un),t.getHSL(ba);let i=Fl(Un.h,ba.h,e),s=Fl(Un.s,ba.s,e),r=Fl(Un.l,ba.l,e);return this.setHSL(i,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,i=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*i+r[6]*s,this.g=r[1]*e+r[4]*i+r[7]*s,this.b=r[2]*e+r[5]*i+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},si=new Dt;Dt.NAMES=ku;var Fr=class n{constructor(t,e=1,i=1e3){this.isFog=!0,this.name="",this.color=new Dt(t),this.near=e,this.far=i}clone(){return new n(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},us=class extends ai{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new bn,this.environmentIntensity=1,this.environmentRotation=new bn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),this.background=t.background!==null?t.background.clone():null,this.environment=t.environment!==null?t.environment.clone():null,this.fog=t.fog!==null?t.fog.clone():null,this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),this.overrideMaterial=t.overrideMaterial!==null?t.overrideMaterial.clone():null,this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}},Ji=new F,gn=new F,Vl=new F,xn=new F,Is=new F,Ls=new F,kh=new F,Wl=new F,Xl=new F,ql=new F,Yl=new ye,Zl=new ye,$l=new ye,yn=class n{constructor(t=new F,e=new F,i=new F){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),Ji.subVectors(t,e),s.cross(Ji);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,i,s,r){Ji.subVectors(s,e),gn.subVectors(i,e),Vl.subVectors(t,e);let a=Ji.dot(Ji),o=Ji.dot(gn),l=Ji.dot(Vl),c=gn.dot(gn),h=gn.dot(Vl),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;let d=1/u,f=(c*l-o*h)*d,m=(a*h-o*l)*d;return r.set(1-f-m,m,f)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,xn)===null?!1:xn.x>=0&&xn.y>=0&&xn.x+xn.y<=1}static getInterpolation(t,e,i,s,r,a,o,l){return this.getBarycoord(t,e,i,s,xn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,xn.x),l.addScaledVector(a,xn.y),l.addScaledVector(o,xn.z),l)}static getInterpolatedAttribute(t,e,i,s,r,a){return Yl.setScalar(0),Zl.setScalar(0),$l.setScalar(0),Yl.fromBufferAttribute(t,e),Zl.fromBufferAttribute(t,i),$l.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(Yl,r.x),a.addScaledVector(Zl,r.y),a.addScaledVector($l,r.z),a}static isFrontFacing(t,e,i,s){return Ji.subVectors(i,e),gn.subVectors(t,e),Ji.cross(gn).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Ji.subVectors(this.c,this.b),gn.subVectors(this.a,this.b),Ji.cross(gn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return n.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return n.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,s,r){return n.getInterpolation(t,this.a,this.b,this.c,e,i,s,r)}containsPoint(t){return n.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return n.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let i=this.a,s=this.b,r=this.c,a,o;Is.subVectors(s,i),Ls.subVectors(r,i),Wl.subVectors(t,i);let l=Is.dot(Wl),c=Ls.dot(Wl);if(l<=0&&c<=0)return e.copy(i);Xl.subVectors(t,s);let h=Is.dot(Xl),u=Ls.dot(Xl);if(h>=0&&u<=h)return e.copy(s);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0&&l-h>0)return a=l/(l-h),e.copy(i).addScaledVector(Is,a);ql.subVectors(t,r);let f=Is.dot(ql),m=Ls.dot(ql);if(m>=0&&f<=m)return e.copy(r);let x=f*c-l*m;if(x<=0&&c>=0&&m<=0)return o=c/(c-m),e.copy(i).addScaledVector(Ls,o);let p=h*m-f*u;if(p<=0&&u-h>=0&&f-m>=0)return kh.subVectors(r,s),o=(u-h)/(u-h+(f-m)),e.copy(s).addScaledVector(kh,o);let g=1/(p+x+d);return a=x*g,o=d*g,e.copy(i).addScaledVector(Is,a).addScaledVector(Ls,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},zn=class{constructor(t=new F(1/0,1/0,1/0),e=new F(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(Ki.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(Ki.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let i=Ki.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let i=t.geometry;if(i!==void 0){let r=i.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0&&t.isBatchedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Ki):Ki.fromBufferAttribute(r,a),Ki.applyMatrix4(t.matrixWorld),this.expandByPoint(Ki);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),wa.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),wa.copy(i.boundingBox)),wa.applyMatrix4(t.matrixWorld),this.union(wa)}let s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Ki),Ki.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(br),Ta.subVectors(this.max,br),Ds.subVectors(t.a,br),Ns.subVectors(t.b,br),Us.subVectors(t.c,br),Fn.subVectors(Ns,Ds),On.subVectors(Us,Ns),as.subVectors(Ds,Us);let e=[0,-Fn.z,Fn.y,0,-On.z,On.y,0,-as.z,as.y,Fn.z,0,-Fn.x,On.z,0,-On.x,as.z,0,-as.x,-Fn.y,Fn.x,0,-On.y,On.x,0,-as.y,as.x,0];return!Jl(e,Ds,Ns,Us,Ta)||(e=[1,0,0,0,1,0,0,0,1],!Jl(e,Ds,Ns,Us,Ta))?!1:(Ea.crossVectors(Fn,On),e=[Ea.x,Ea.y,Ea.z],Jl(e,Ds,Ns,Us,Ta))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Ki).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Ki).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(_n[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),_n[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),_n[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),_n[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),_n[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),_n[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),_n[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),_n[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(_n),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},_n=[new F,new F,new F,new F,new F,new F,new F,new F],Ki=new F,wa=new zn,Ds=new F,Ns=new F,Us=new F,Fn=new F,On=new F,as=new F,br=new F,Ta=new F,Ea=new F,os=new F;function Jl(n,t,e,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){os.fromArray(n,r);let o=s.x*Math.abs(os.x)+s.y*Math.abs(os.y)+s.z*Math.abs(os.z),l=t.dot(os),c=e.dot(os),h=i.dot(os);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}var Be=new F,Aa=new Pt,xf=0,xi=class extends ln{constructor(t,e,i=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:xf++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=Fc,this.updateRanges=[],this.gpuType=Ci,this.version=0,this._normalizationScale=t!==void 0?ol(t):void 0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this._normalizationScale=t._normalizationScale,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)Aa.fromBufferAttribute(this,e),Aa.applyMatrix3(t),this.setXY(e,Aa.x,Aa.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)Be.fromBufferAttribute(this,e),Be.applyMatrix3(t),this.setXYZ(e,Be.x,Be.y,Be.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)Be.fromBufferAttribute(this,e),Be.applyMatrix4(t),this.setXYZ(e,Be.x,Be.y,Be.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Be.fromBufferAttribute(this,e),Be.applyNormalMatrix(t),this.setXYZ(e,Be.x,Be.y,Be.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Be.fromBufferAttribute(this,e),Be.transformDirection(t),this.setXYZ(e,Be.x,Be.y,Be.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=this._denormalize(i)),i}setComponent(t,e,i){return this.normalized&&(i=this._normalize(i)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=this._denormalize(e)),e}setX(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=this._denormalize(e)),e}setY(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=this._denormalize(e)),e}setZ(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=this._denormalize(e)),e}setW(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),i=this._normalize(i)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),i=this._normalize(i),s=this._normalize(s)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,r){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),i=this._normalize(i),s=this._normalize(s),r=this._normalize(r)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(t){let e=this._normalizationScale;return e!==void 0?Math.max(t/e,-1):Bu(t,this.array)}_normalize(t){let e=this._normalizationScale;return e!==void 0?Math.round(t*e):zu(t,this.array)}};var Or=class extends xi{constructor(t,e,i){super(new Uint16Array(t),e,i)}};var Br=class extends xi{constructor(t,e,i){super(new Uint32Array(t),e,i)}};var me=class extends xi{constructor(t,e,i){super(new Float32Array(t),e,i)}},_f=new zn,wr=new F,Kl=new F,Ks=class{constructor(t=new F,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let i=this.center;e!==void 0?i.copy(e):_f.setFromPoints(t).getCenter(i);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,i.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;wr.subVectors(t,this.center);let e=wr.lengthSq();if(e>this.radius*this.radius){let i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(wr,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Kl.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(wr.copy(t.center).add(Kl)),this.expandByPoint(wr.copy(t.center).sub(Kl))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},vf=0,Fi=new pe,Ql=new ai,Fs=new F,Ti=new zn,Tr=new zn,Ye=new F,$e=class n extends ln{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:vf++}),this.uuid=vs(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(sf(t)?Br:Or)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let r=new zt().getNormalMatrix(t);i.applyNormalMatrix(r),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return Fi.makeRotationFromQuaternion(t),this.applyMatrix4(Fi),this}rotateX(t){return Fi.makeRotationX(t),this.applyMatrix4(Fi),this}rotateY(t){return Fi.makeRotationY(t),this.applyMatrix4(Fi),this}rotateZ(t){return Fi.makeRotationZ(t),this.applyMatrix4(Fi),this}translate(t,e,i){return Fi.makeTranslation(t,e,i),this.applyMatrix4(Fi),this}scale(t,e,i){return Fi.makeScale(t,e,i),this.applyMatrix4(Fi),this}lookAt(t){return Ql.lookAt(t),Ql.updateMatrix(),this.applyMatrix4(Ql.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Fs).negate(),this.translate(Fs.x,Fs.y,Fs.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let i=[];for(let s=0,r=t.length;s<r;s++){let a=t[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new me(i,3))}else{let i=Math.min(t.length,e.count);for(let s=0;s<i;s++){let r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&Ot("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new zn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Bt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new F(-1/0,-1/0,-1/0),new F(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){let r=e[i];Ti.setFromBufferAttribute(r),this.morphTargetsRelative?(Ye.addVectors(this.boundingBox.min,Ti.min),this.boundingBox.expandByPoint(Ye),Ye.addVectors(this.boundingBox.max,Ti.max),this.boundingBox.expandByPoint(Ye)):(this.boundingBox.expandByPoint(Ti.min),this.boundingBox.expandByPoint(Ti.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Bt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ks);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Bt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new F,1/0);return}if(t){let i=this.boundingSphere.center;if(Ti.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){let o=e[r];Tr.setFromBufferAttribute(o),this.morphTargetsRelative?(Ye.addVectors(Ti.min,Tr.min),Ti.expandByPoint(Ye),Ye.addVectors(Ti.max,Tr.max),Ti.expandByPoint(Ye)):(Ti.expandByPoint(Tr.min),Ti.expandByPoint(Tr.max))}Ti.getCenter(i);let s=0;for(let r=0,a=t.count;r<a;r++)Ye.fromBufferAttribute(t,r),s=Math.max(s,i.distanceToSquared(Ye));if(e)for(let r=0,a=e.length;r<a;r++){let o=e[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Ye.fromBufferAttribute(o,c),l&&(Fs.fromBufferAttribute(t,c),Ye.add(Fs)),s=Math.max(s,i.distanceToSquared(Ye))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Bt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Bt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=e.position,s=e.normal,r=e.uv,a=this.getAttribute("tangent");(a===void 0||a.count!==i.count)&&(a=new xi(new Float32Array(4*i.count),4),this.setAttribute("tangent",a));let o=[],l=[],c=new Uint8Array(i.count);for(let I=0;I<i.count;I++)o[I]=new F,l[I]=new F;let h=new F,u=new F,d=new F,f=new Pt,m=new Pt,x=new Pt,p=new F,g=new F;function v(I,R,D){c[I]=c[R]=c[D]=1,h.fromBufferAttribute(i,I),u.fromBufferAttribute(i,R),d.fromBufferAttribute(i,D),f.fromBufferAttribute(r,I),m.fromBufferAttribute(r,R),x.fromBufferAttribute(r,D),u.sub(h),d.sub(h),m.sub(f),x.sub(f);let N=1/(m.x*x.y-x.x*m.y);isFinite(N)&&(p.copy(u).multiplyScalar(x.y).addScaledVector(d,-m.y).multiplyScalar(N),g.copy(d).multiplyScalar(m.x).addScaledVector(u,-x.x).multiplyScalar(N),o[I].add(p),o[R].add(p),o[D].add(p),l[I].add(g),l[R].add(g),l[D].add(g))}let w=this.groups;w.length===0&&(w=[{start:0,count:t.count}]);for(let I=0,R=w.length;I<R;++I){let D=w[I],N=D.start,O=D.count;for(let P=N,z=N+O;P<z;P+=3)v(t.getX(P+0),t.getX(P+1),t.getX(P+2))}let y=new F,E=new F,A=new F,_=new F;function T(I){A.fromBufferAttribute(s,I),_.copy(A);let R=o[I];y.copy(R),y.sub(A.multiplyScalar(A.dot(R))).normalize(),E.crossVectors(_,R);let N=E.dot(l[I])<0?-1:1;a.setXYZW(I,y.x,y.y,y.z,N)}for(let I=0,R=i.count;I<R;++I)c[I]&&T(I);this._transformed=!0}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==e.count)i=new xi(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);let s=new F,r=new F,a=new F,o=new F,l=new F,c=new F,h=new F,u=new F;if(t)for(let d=0,f=t.count;d<f;d+=3){let m=t.getX(d+0),x=t.getX(d+1),p=t.getX(d+2);s.fromBufferAttribute(e,m),r.fromBufferAttribute(e,x),a.fromBufferAttribute(e,p),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(i,m),l.fromBufferAttribute(i,x),c.fromBufferAttribute(i,p),o.add(h),l.add(h),c.add(h),i.setXYZ(m,o.x,o.y,o.z),i.setXYZ(x,l.x,l.y,l.z),i.setXYZ(p,c.x,c.y,c.z)}else for(let d=0,f=e.count;d<f;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Ye.fromBufferAttribute(t,e),Ye.normalize(),t.setXYZ(e,Ye.x,Ye.y,Ye.z)}toNonIndexed(){function t(o,l){let c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h),f=0,m=0;for(let x=0,p=l.length;x<p;x++){o.isInterleavedBufferAttribute?f=l[x]*o.data.stride+o.offset:f=l[x]*h;for(let g=0;g<h;g++)d[m++]=c[f++]}return new xi(d,h,u)}if(this.index===null)return Ot("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new n,i=this.index.array,s=this.attributes;for(let o in s){let l=s[o],c=t(l,i);e.setAttribute(o,c)}let r=this.morphAttributes;for(let o in r){let l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){let d=c[h],f=t(d,i);l.push(f)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let i=this.attributes;for(let l in i){let c=i[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let f=c[u];h.push(f.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let i=t.index;i!==null&&this.setIndex(i.clone());let s=t.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(e))}let r=t.morphAttributes;for(let c in r){let h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let a=t.groups;for(let c=0,h=a.length;c<h;c++){let u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}let o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},zr=class{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Fc,this.updateRanges=[],this.version=0,this.uuid=vs()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[i+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={});let e=Hh(this.array);t.arrayBuffers[e]===void 0&&(t.arrayBuffers[e]=this.array.slice(0).buffer);let i=new this.array.constructor(t.arrayBuffers[e]),s=new this.constructor(i,this.stride);return s.setUsage(this.usage),s}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){t.arrayBuffers===void 0&&(t.arrayBuffers={});let e=Hh(this.array);t.arrayBuffers[e]===void 0&&(t.arrayBuffers[e]=Array.from(new Uint32Array(this.array.slice(0).buffer)));let i={uuid:this.uuid,buffer:e,type:this.array.constructor.name,stride:this.stride};return i.usage=this.usage,i}};function Hh(n){return n.buffer._uuid===void 0&&(n.buffer._uuid=vs()),n.byteOffset===0&&n.byteLength===n.buffer.byteLength?n.buffer._uuid:n.buffer._uuid+":"+n.byteOffset+":"+n.byteLength}var fi=new F,Qs=class n{constructor(t,e,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=s,this._normalizationScale=t!==void 0?ol(t.array):void 0}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)fi.fromBufferAttribute(this,e),fi.applyMatrix4(t),this.setXYZ(e,fi.x,fi.y,fi.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)fi.fromBufferAttribute(this,e),fi.applyNormalMatrix(t),this.setXYZ(e,fi.x,fi.y,fi.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)fi.fromBufferAttribute(this,e),fi.transformDirection(t),this.setXYZ(e,fi.x,fi.y,fi.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=this._denormalize(i)),i}setComponent(t,e,i){return this.normalized&&(i=this._normalize(i)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=this._normalize(e)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=this._normalize(e)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=this._normalize(e)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=this._normalize(e)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=this._denormalize(e)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=this._denormalize(e)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=this._denormalize(e)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=this._denormalize(e)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=this._normalize(e),i=this._normalize(i)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=this._normalize(e),i=this._normalize(i),s=this._normalize(s)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=s,this}setXYZW(t,e,i,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=this._normalize(e),i=this._normalize(i),s=this._normalize(s),r=this._normalize(r)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){Dr("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let i=0;i<this.count;i++){let s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new xi(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new n(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){Dr("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let i=0;i<this.count;i++){let s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}_denormalize(t){let e=this._normalizationScale;return e!==void 0?Math.max(t/e,-1):Bu(t,this.data.array)}_normalize(t){let e=this._normalizationScale;return e!==void 0?Math.round(t*e):zu(t,this.data.array)}},jl=new F,yf=new F,Mf=new zt,Ei=class{constructor(t=new F(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){let s=jl.subVectors(i,e).cross(yf.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,i=!0){let s=t.delta(jl),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let a=-(t.start.dot(this.normal)+this.constant)/r;return i===!0&&(a<0||a>1)?null:e.copy(t.start).addScaledVector(s,a)}intersectsLine(t){let e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let i=e||Mf.getNormalMatrix(t),s=this.coplanarPoint(jl).applyMatrix4(t),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}},Sf=0,wn=class extends ln{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Sf++}),this.uuid=vs(),this.name="",this.type="Material",this.blending=cn,this.side=Zn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=mc,this.blendDst=gc,this.blendEquation=gs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Dt(0,0,0),this.blendAlpha=0,this.depthFunc=Xs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Au,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Xa,this.stencilZFail=Xa,this.stencilZPass=Xa,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let i=t[e];if(i===void 0){Ot(`Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){Ot(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector2&&i&&i.isVector2||s&&s.isEuler&&i&&i.isEuler||s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(i.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(i.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(t).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(i.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(i.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(e){let r=s(t.textures),a=s(t.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new Dt().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.diffuseRoughness!==void 0&&(this.diffuseRoughness=t.diffuseRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=t.iridescenceThicknessMinimum),t.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=t.iridescenceThicknessMaximum),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=t.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=t.iridescenceThicknessRange[1]),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(i=>new Ei().fromJSON(i))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let i=t.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new Pt().fromArray(i)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Pt().fromArray(t.clearcoatNormalScale)),t.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=e[t.diffuseRoughnessMap]||null),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,i=null;if(e!==null){let s=e.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=e[r].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},js=class extends wn{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Dt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},Os,Er=new F,Bs=new F,zs=new F,ks=new Pt,Ar=new Pt,Hu=new pe,Ra=new F,Rr=new F,Ca=new F,Gh=new Pt,tc=new Pt,Vh=new Pt,kr=class extends ai{constructor(t=new js){if(super(),this.isSprite=!0,this.type="Sprite",Os===void 0){Os=new $e;let e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new zr(e,5);Os.setIndex([0,1,2,0,2,3]),Os.setAttribute("position",new Qs(i,3,0,!1)),Os.setAttribute("uv",new Qs(i,2,3,!1))}this.geometry=Os,this.material=t,this.center=new Pt(.5,.5),this.count=1}intersectsFrustum(t){return t.intersectsSprite(this)}raycast(t,e){t.camera===null&&Bt('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Bs.setFromMatrixScale(this.matrixWorld),Hu.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),zs.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Bs.multiplyScalar(-zs.z);let i=this.material.rotation,s,r;i!==0&&(r=Math.cos(i),s=Math.sin(i));let a=this.center;Pa(Ra.set(-.5,-.5,0),zs,a,Bs,s,r),Pa(Rr.set(.5,-.5,0),zs,a,Bs,s,r),Pa(Ca.set(.5,.5,0),zs,a,Bs,s,r),Gh.set(0,0),tc.set(1,0),Vh.set(1,1);let o=t.ray.intersectTriangle(Ra,Rr,Ca,!1,Er);if(o===null&&(Pa(Rr.set(-.5,.5,0),zs,a,Bs,s,r),tc.set(0,1),o=t.ray.intersectTriangle(Ra,Ca,Rr,!1,Er),o===null))return;let l=t.ray.origin.distanceTo(Er);l<t.near||l>t.far||e.push({distance:l,point:Er.clone(),uv:yn.getInterpolation(Er,Ra,Rr,Ca,Gh,tc,Vh,new Pt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}toJSON(t){let e=super.toJSON(t);return e.object.center=this.center.toArray(),e}};function Pa(n,t,e,i,s,r){ks.subVectors(n,e).addScalar(.5).multiply(i),s!==void 0?(Ar.x=r*ks.x-s*ks.y,Ar.y=s*ks.x+r*ks.y):Ar.copy(ks),n.copy(t),n.x+=Ar.x,n.y+=Ar.y,n.applyMatrix4(Hu)}var vn=new F,ec=new F,Ia=new F,La=new F,ro=class{constructor(t=new F,e=new F(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,vn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=vn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(vn.copy(this.origin).addScaledVector(this.direction,e),vn.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){ec.copy(t).add(e).multiplyScalar(.5),Ia.copy(e).sub(t).normalize(),La.copy(this.origin).sub(ec);let r=t.distanceTo(e)*.5,a=-this.direction.dot(Ia),o=La.dot(this.direction),l=-La.dot(Ia),c=La.lengthSq(),h=Math.abs(1-a*a),u,d,f,m;if(h>0)if(u=a*l-o,d=a*o-l,m=r*h,u>=0)if(d>=-m)if(d<=m){let x=1/h;u*=x,d*=x,f=u*(u+a*d+2*o)+d*(a*u+d+2*l)+c}else d=r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d<=-m?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=m?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(ec).addScaledVector(Ia,d),f}intersectSphere(t,e){if(t.radius<0)return null;vn.subVectors(t.center,this.origin);let i=vn.dot(this.direction),s=vn.dot(vn)-i*i,r=t.radius*t.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){let i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,r,a,o,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(i=(t.min.x-d.x)*c,s=(t.max.x-d.x)*c):(i=(t.max.x-d.x)*c,s=(t.min.x-d.x)*c),h>=0?(r=(t.min.y-d.y)*h,a=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,a=(t.min.y-d.y)*h),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(t.min.z-d.z)*u,l=(t.max.z-d.z)*u):(o=(t.max.z-d.z)*u,l=(t.min.z-d.z)*u),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,vn)!==null}intersectTriangle(t,e,i,s,r){let a=this.origin,o=this.direction,l=o.x,c=o.y,h=o.z,u=t.x-a.x,d=t.y-a.y,f=t.z-a.z,m=e.x-a.x,x=e.y-a.y,p=e.z-a.z,g=i.x-a.x,v=i.y-a.y,w=i.z-a.z,y=Math.abs(l),E=Math.abs(c),A=Math.abs(h),_,T,I,R,D,N,O,P,z,V,X,st;if(y>=E&&y>=A?(I=l,N=u,z=m,st=g,l>=0?(_=c,T=h,R=d,D=f,O=x,P=p,V=v,X=w):(_=h,T=c,R=f,D=d,O=p,P=x,V=w,X=v)):E>=A?(I=c,N=d,z=x,st=v,c>=0?(_=h,T=l,R=f,D=u,O=p,P=m,V=w,X=g):(_=l,T=h,R=u,D=f,O=m,P=p,V=g,X=w)):(I=h,N=f,z=p,st=w,h>=0?(_=l,T=c,R=u,D=d,O=m,P=x,V=g,X=v):(_=c,T=l,R=d,D=u,O=x,P=m,V=v,X=g)),I===0)return null;let Y=_/I,tt=T/I,it=1/I,Et=R-Y*N,Wt=D-tt*N,J=O-Y*z,_t=P-tt*z,St=V-Y*st,Nt=X-tt*st,vt=St*_t-Nt*J,qt=Et*Nt-Wt*St,Fe=J*Wt-_t*Et;if(s){if(vt<0||qt<0||Fe<0)return null}else if((vt<0||qt<0||Fe<0)&&(vt>0||qt>0||Fe>0))return null;let Ft=vt+qt+Fe;if(Ft===0)return null;let de=it*(vt*N+qt*z+Fe*st);return(Ft>0?de<0:de>0)?null:this.at(de/Ft,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Tn=class extends wn{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Dt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bn,this.combine=xc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},Wh=new pe,ls=new ro,Da=new Ks,Xh=new F,Na=new F,Ua=new F,Fa=new F,ic=new F,Oa=new F,qh=new F,Ba=new F,Qt=class extends ai{constructor(t=new $e,e=new Tn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0?this.morphTargetInfluences=t.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,t.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){let s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){let i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;e.fromBufferAttribute(s,t);let o=this.morphTargetInfluences;if(r&&o){Oa.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=o[l],u=r[l];h!==0&&(ic.fromBufferAttribute(u,t),a?Oa.addScaledVector(ic,h):Oa.addScaledVector(ic.sub(e),h))}e.add(Oa)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Da.copy(i.boundingSphere),Da.applyMatrix4(r),ls.copy(t.ray).recast(t.near),!(Da.containsPoint(ls.origin)===!1&&(ls.intersectSphere(Da,Xh)===null||ls.origin.distanceToSquared(Xh)>(t.far-t.near)**2))&&(Wh.copy(r).invert(),ls.copy(t.ray).applyMatrix4(Wh),!(i.boundingBox!==null&&ls.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,ls)))}_computeIntersections(t,e,i){let s,r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,x=d.length;m<x;m++){let p=d[m],g=a[p.materialIndex],v=Math.max(p.start,f.start),w=Math.min(o.count,Math.min(p.start+p.count,f.start+f.count));for(let y=v,E=w;y<E;y+=3){let A=o.getX(y),_=o.getX(y+1),T=o.getX(y+2);s=za(this,g,t,i,c,h,u,A,_,T),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{let m=Math.max(0,f.start),x=Math.min(o.count,f.start+f.count);for(let p=m,g=x;p<g;p+=3){let v=o.getX(p),w=o.getX(p+1),y=o.getX(p+2);s=za(this,a,t,i,c,h,u,v,w,y),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let m=0,x=d.length;m<x;m++){let p=d[m],g=a[p.materialIndex],v=Math.max(p.start,f.start),w=Math.min(l.count,Math.min(p.start+p.count,f.start+f.count));for(let y=v,E=w;y<E;y+=3){let A=y,_=y+1,T=y+2;s=za(this,g,t,i,c,h,u,A,_,T),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{let m=Math.max(0,f.start),x=Math.min(l.count,f.start+f.count);for(let p=m,g=x;p<g;p+=3){let v=p,w=p+1,y=p+2;s=za(this,a,t,i,c,h,u,v,w,y),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}}};function bf(n,t,e,i,s,r,a,o){let l;if(t.side===Je?l=i.intersectTriangle(a,r,s,!0,o):l=i.intersectTriangle(s,r,a,t.side===Zn,o),l===null)return null;Ba.copy(o),Ba.applyMatrix4(n.matrixWorld);let c=e.ray.origin.distanceTo(Ba);return c<e.near||c>e.far?null:{distance:c,point:Ba.clone(),object:n}}function za(n,t,e,i,s,r,a,o,l,c){n.getVertexPosition(o,Na),n.getVertexPosition(l,Ua),n.getVertexPosition(c,Fa);let h=bf(n,t,e,i,Na,Ua,Fa,qh);if(h){let u=new F;yn.getBarycoord(qh,Na,Ua,Fa,u),s&&(h.uv=yn.getInterpolatedAttribute(s,o,l,c,u,new Pt)),r&&(h.uv1=yn.getInterpolatedAttribute(r,o,l,c,u,new Pt)),a&&(h.normal=yn.getInterpolatedAttribute(a,o,l,c,u,new F),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));let d={a:o,b:l,c,normal:new F,materialIndex:0};yn.getNormal(Na,Ua,Fa,d.normal),h.face=d,h.barycoord=u}return h}var kn=class extends _i{constructor(t=null,e=1,i=1,s,r,a,o,l,c=Ze,h=Ze,u,d){super(null,a,o,l,c,h,s,r,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var tr=class extends xi{constructor(t,e,i,s=1){super(t,e,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}};var cs=new Ks,wf=new Pt(.5,.5),ka=new F,Hn=class{constructor(t=new Ei,e=new Ei,i=new Ei,s=new Ei,r=new Ei,a=new Ei){this.planes=[t,e,i,s,r,a]}set(t,e,i,s,r,a){let o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){let e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Bi,i=!1){let s=this.planes,r=t.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],u=r[5],d=r[6],f=r[7],m=r[8],x=r[9],p=r[10],g=r[11],v=r[12],w=r[13],y=r[14],E=r[15];if(s[0].setComponents(c-a,f-h,g-m,E-v).normalize(),s[1].setComponents(c+a,f+h,g+m,E+v).normalize(),s[2].setComponents(c+o,f+u,g+x,E+w).normalize(),s[3].setComponents(c-o,f-u,g-x,E-w).normalize(),i)s[4].setComponents(l,d,p,y).normalize(),s[5].setComponents(c-l,f-d,g-p,E-y).normalize();else if(s[4].setComponents(c-l,f-d,g-p,E-y).normalize(),e===Bi)s[5].setComponents(c+l,f+d,g+p,E+y).normalize();else if(e===Ys)s[5].setComponents(l,d,p,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),cs.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),cs.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(cs)}intersectsSprite(t){cs.center.set(0,0,0);let e=wf.distanceTo(t.center);return cs.radius=.7071067811865476+e,cs.applyMatrix4(t.matrixWorld),this.intersectsSphere(cs)}intersectsSphere(t){let e=this.planes,i=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let i=0;i<6;i++){let s=e[i];if(ka.x=s.normal.x>0?t.max.x:t.min.x,ka.y=s.normal.y>0?t.max.y:t.min.y,ka.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(ka)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},Yh=new pe,ao=class n{constructor(){this.coordinateSystem=Bi,this._frustums=[],this._count=0}setFromArrayCamera(t){let e=t.cameras,i=this._frustums;for(let s=0;s<e.length;s++){let r=e[s];Yh.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),i[s]===void 0&&(i[s]=new Hn),i[s].setFromProjectionMatrix(Yh,r.coordinateSystem,r.reversedDepth)}return this._count=e.length,this}getFrustum(t){return this._frustums[t]}intersectsObject(t){let e=this._frustums;for(let i=0;i<this._count;i++)if(e[i].intersectsObject(t))return!0;return!1}intersectsSprite(t){let e=this._frustums;for(let i=0;i<this._count;i++)if(e[i].intersectsSprite(t))return!0;return!1}intersectsSphere(t){let e=this._frustums;for(let i=0;i<this._count;i++)if(e[i].intersectsSphere(t))return!0;return!1}intersectsBox(t){let e=this._frustums;for(let i=0;i<this._count;i++)if(e[i].intersectsBox(t))return!0;return!1}containsPoint(t){let e=this._frustums;for(let i=0;i<this._count;i++)if(e[i].containsPoint(t))return!0;return!1}copy(t){this.coordinateSystem=t.coordinateSystem;let e=this._frustums,i=t._frustums;for(let s=0;s<t._count;s++)e[s]===void 0&&(e[s]=new Hn),e[s].copy(i[s]);return this._count=t._count,this}clone(){return new n().copy(this)}};var Hr=class extends _i{constructor(t=[],e=xs,i,s,r,a,o,l,c,h){super(t,e,i,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}};var En=class extends _i{constructor(t,e,i=Qi,s,r,a,o=Ze,l=Ze,c,h=Sn,u=1){if(h!==Sn&&h!==Rn)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:t,height:e,depth:u};super(d,s,r,a,o,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new $s(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}},Gr=class extends En{constructor(t,e=Qi,i=xs,s,r,a=Ze,o=Ze,l,c=Sn){let h={width:t,height:t,depth:1},u=[h,h,h,h,h,h];super(t,t,e,i,s,r,a,o,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},Vr=class extends _i{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},zi=class n extends $e{constructor(t=1,e=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let l=[],c=[],h=[],u=[],d=0,f=0;m("z","y","x",-1,-1,i,e,t,a,r,0),m("z","y","x",1,-1,i,e,-t,a,r,1),m("x","z","y",1,1,t,i,e,s,a,2),m("x","z","y",1,-1,t,i,-e,s,a,3),m("x","y","z",1,-1,t,e,i,s,r,4),m("x","y","z",-1,-1,t,e,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new me(c,3)),this.setAttribute("normal",new me(h,3)),this.setAttribute("uv",new me(u,2));function m(x,p,g,v,w,y,E,A,_,T,I){let R=y/_,D=E/T,N=y/2,O=E/2,P=A/2,z=_+1,V=T+1,X=0,st=0,Y=new F;for(let tt=0;tt<V;tt++){let it=tt*D-O;for(let Et=0;Et<z;Et++){let Wt=Et*R-N;Y[x]=Wt*v,Y[p]=it*w,Y[g]=P,c.push(Y.x,Y.y,Y.z),Y[x]=0,Y[p]=0,Y[g]=A>0?1:-1,h.push(Y.x,Y.y,Y.z),u.push(Et/_),u.push(1-tt/T),X+=1}}for(let tt=0;tt<T;tt++)for(let it=0;it<_;it++){let Et=d+it+z*tt,Wt=d+it+z*(tt+1),J=d+(it+1)+z*(tt+1),_t=d+(it+1)+z*tt;l.push(Et,Wt,_t),l.push(Wt,J,_t),st+=6}o.addGroup(f,st,I),f+=st,d+=X}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},Wr=class n extends $e{constructor(t=1,e=1,i=4,s=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:i,radialSegments:s,heightSegments:r},e=Math.max(0,e),i=Math.max(1,Math.floor(i)),s=Math.max(3,Math.floor(s)),r=Math.max(1,Math.floor(r));let a=[],o=[],l=[],c=[],h=e/2,u=Math.PI/2*t,d=e,f=2*u+d,m=i*2+r,x=s+1,p=new F,g=new F;for(let v=0;v<=m;v++){let w=0,y=0,E=0,A=0;if(v<=i){let I=v/i,R=I*Math.PI/2;y=-h-t*Math.cos(R),E=t*Math.sin(R),A=-t*Math.cos(R),w=I*u}else if(v<=i+r){let I=(v-i)/r;y=-h+I*e,E=t,A=0,w=u+I*d}else{let I=(v-i-r)/i,R=I*Math.PI/2;y=h+t*Math.sin(R),E=t*Math.cos(R),A=t*Math.sin(R),w=u+d+I*u}let _=Math.max(0,Math.min(1,w/f)),T=0;v===0?T=.5/s:v===m&&(T=-.5/s);for(let I=0;I<=s;I++){let R=I/s,D=R*Math.PI*2,N=Math.sin(D),O=Math.cos(D);g.x=-E*O,g.y=y,g.z=E*N,o.push(g.x,g.y,g.z),p.set(-E*O,A,E*N),p.normalize(),l.push(p.x,p.y,p.z),c.push(R+T,_)}if(v>0){let I=(v-1)*x;for(let R=0;R<s;R++){let D=I+R,N=I+R+1,O=v*x+R,P=v*x+R+1;a.push(D,N,O),a.push(N,P,O)}}}this.setIndex(a),this.setAttribute("position",new me(o,3)),this.setAttribute("normal",new me(l,3)),this.setAttribute("uv",new me(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}};var ds=class n extends $e{constructor(t=1,e=1,i=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],d=[],f=[],m=0,x=[],p=i/2,g=0;v(),a===!1&&(t>0&&w(!0),e>0&&w(!1)),this.setIndex(h),this.setAttribute("position",new me(u,3)),this.setAttribute("normal",new me(d,3)),this.setAttribute("uv",new me(f,2));function v(){let y=new F,E=new F,A=0,_=(e-t)/i;for(let T=0;T<=r;T++){let I=[],R=T/r,D=R*(e-t)+t;for(let N=0;N<=s;N++){let O=N/s,P=O*l+o,z=Math.sin(P),V=Math.cos(P);E.x=D*z,E.y=-R*i+p,E.z=D*V,u.push(E.x,E.y,E.z),y.set(z,_,V).normalize(),d.push(y.x,y.y,y.z),f.push(O,1-R),I.push(m++)}x.push(I)}for(let T=0;T<s;T++)for(let I=0;I<r;I++){let R=x[I][T],D=x[I+1][T],N=x[I+1][T+1],O=x[I][T+1];(t>0||I!==0)&&(h.push(R,D,O),A+=3),(e>0||I!==r-1)&&(h.push(D,N,O),A+=3)}c.addGroup(g,A,0),g+=A}function w(y){let E=m,A=new Pt,_=new F,T=0,I=y===!0?t:e,R=y===!0?1:-1;for(let N=1;N<=s;N++)u.push(0,p*R,0),d.push(0,R,0),f.push(.5,.5),m++;let D=m;for(let N=0;N<=s;N++){let P=N/s*l+o,z=Math.cos(P),V=Math.sin(P);_.x=I*V,_.y=p*R,_.z=I*z,u.push(_.x,_.y,_.z),d.push(0,R,0),A.x=z*.5+.5,A.y=V*.5*R+.5,f.push(A.x,A.y),m++}for(let N=0;N<s;N++){let O=E+N,P=D+N;y===!0?h.push(P,P+1,O):h.push(P+1,P,O),T+=3}c.addGroup(g,T,y===!0?1:2),g+=T}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Xr=class n extends ds{constructor(t=1,e=1,i=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,i,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new n(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}};var oi=class n extends $e{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};let r=t/2,a=e/2,o=Math.floor(i),l=Math.floor(s),c=o+1,h=l+1,u=t/o,d=e/l,f=[],m=[],x=[],p=[];for(let g=0;g<h;g++){let v=g*d-a;for(let w=0;w<c;w++){let y=w*u-r;m.push(y,-v,0),x.push(0,0,1),p.push(w/o),p.push(1-g/l)}}for(let g=0;g<l;g++)for(let v=0;v<o;v++){let w=v+c*g,y=v+c*(g+1),E=v+1+c*(g+1),A=v+1+c*g;f.push(w,y,A),f.push(y,E,A)}this.setIndex(f),this.setAttribute("position",new me(m,3)),this.setAttribute("normal",new me(x,3)),this.setAttribute("uv",new me(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.width,t.height,t.widthSegments,t.heightSegments)}};var Gn=class n extends $e{constructor(t=1,e=32,i=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));let l=Math.min(a+o,Math.PI),c=0,h=[],u=new F,d=new F,f=[],m=[],x=[],p=[];for(let g=0;g<=i;g++){let v=[],w=g/i,y=a+w*o,E=t*Math.cos(y),A=Math.sqrt(t*t-E*E),_=0;g===0&&a===0?_=.5/e:g===i&&l===Math.PI&&(_=-.5/e);for(let T=0;T<=e;T++){let I=T/e,R=s+I*r;u.x=-A*Math.cos(R),u.y=E,u.z=A*Math.sin(R),m.push(u.x,u.y,u.z),d.copy(u).normalize(),x.push(d.x,d.y,d.z),p.push(I+_,1-w),v.push(c++)}h.push(v)}for(let g=0;g<i;g++)for(let v=0;v<e;v++){let w=h[g][v+1],y=h[g][v],E=h[g+1][v],A=h[g+1][v+1];(g!==0||a>0)&&f.push(w,y,A),(g!==i-1||l<Math.PI)&&f.push(y,E,A)}this.setIndex(f),this.setAttribute("position",new me(m,3)),this.setAttribute("normal",new me(x,3)),this.setAttribute("uv",new me(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var qr=class n extends $e{constructor(t=1,e=.4,i=12,s=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:s,arc:r,thetaStart:a,thetaLength:o},i=Math.floor(i),s=Math.floor(s);let l=[],c=[],h=[],u=[],d=new F,f=new F,m=new F;for(let x=0;x<=i;x++){let p=a+x/i*o;for(let g=0;g<=s;g++){let v=g/s*r;f.x=(t+e*Math.cos(p))*Math.cos(v),f.y=(t+e*Math.cos(p))*Math.sin(v),f.z=e*Math.sin(p),c.push(f.x,f.y,f.z),d.x=t*Math.cos(v),d.y=t*Math.sin(v),m.subVectors(f,d).normalize(),h.push(m.x,m.y,m.z),u.push(g/s),u.push(x/i)}}for(let x=1;x<=i;x++)for(let p=1;p<=s;p++){let g=(s+1)*x+p-1,v=(s+1)*(x-1)+p-1,w=(s+1)*(x-1)+p,y=(s+1)*x+p;l.push(g,v,y),l.push(v,w,y)}this.setIndex(l),this.setAttribute("position",new me(c,3)),this.setAttribute("normal",new me(h,3)),this.setAttribute("uv",new me(u,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}};function ys(n){let t={};for(let e in n){t[e]={};for(let i in n[e]){let s=n[e][i];if(Zh(s))s.isRenderTargetTexture?(Ot("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone();else if(Array.isArray(s))if(Zh(s[0])){let r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();t[e][i]=r}else t[e][i]=s.slice();else t[e][i]=s}}return t}function ci(n){let t={};for(let e=0;e<n.length;e++){let i=ys(n[e]);for(let s in i)t[s]=i[s]}return t}function Zh(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function Tf(n){let t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function zc(n){let t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:se.workingColorSpace}var tn={clone:ys,merge:ci},Ef=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Af=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,ge=class extends wn{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ef,this.fragmentShader=Af,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ys(t.uniforms),this.uniformsGroups=Tf(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(let i in t.uniforms){let s=t.uniforms[i];switch(this.uniforms[i]={},s.type){case"t":this.uniforms[i].value=e[s.value]||null;break;case"c":this.uniforms[i].value=new Dt().setHex(s.value);break;case"v2":this.uniforms[i].value=new Pt().fromArray(s.value);break;case"v3":this.uniforms[i].value=new F().fromArray(s.value);break;case"v4":this.uniforms[i].value=new ye().fromArray(s.value);break;case"m3":this.uniforms[i].value=new zt().fromArray(s.value);break;case"m4":this.uniforms[i].value=new pe().fromArray(s.value);break;default:this.uniforms[i].value=s.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(let i in t.extensions)this.extensions[i]=t.extensions[i];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}},oo=class extends ge{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Vn=class extends wn{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Dt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Dt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=al,this.normalScale=new Pt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};var lo=class extends wn{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Tu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},co=class extends wn{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function Hs(n,t){return!n||n.constructor===t?n:typeof t.BYTES_PER_ELEMENT=="number"?new t(n):Array.prototype.slice.call(n)}function Ha(n){return n!==void 0&&n.inTangents!==void 0&&n.outTangents!==void 0}var Wn=class{constructor(t,e,i,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(i),this.sampleValues=e,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,i=this._cachedIndex,s=e[i],r=e[i-1];i:{t:{let a;e:{n:if(!(t<s)){for(let o=i+2;;){if(s===void 0){if(t<r)break n;return i=e.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===o)break;if(r=s,s=e[++i],t<s)break t}a=e.length;break e}if(!(t>=r)){let o=e[1];t<o&&(i=2,r=o);for(let l=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(s=r,r=e[--i-1],t>=r)break t}a=i,i=0;break e}break i}for(;i<a;){let o=i+a>>>1;t<e[o]?a=o:i=o+1}if(s=e[i],r=e[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=e.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=t*s;for(let a=0;a!==s;++a)e[a]=i[r+a];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},ho=class extends Wn{constructor(t,e,i,s){super(t,e,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:rc,endingEnd:rc}}intervalChanged_(t,e,i){let s=this.parameterPositions,r=t-2,a=t+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case ac:r=t,o=2*e-i;break;case oc:r=s.length-2,o=e+s[r]-s[r+1];break;default:r=t,o=i}if(l===void 0)switch(this.getSettings_().endingEnd){case ac:a=t,l=2*i-e;break;case oc:a=1,l=i+s[1]-s[0];break;default:a=t-1,l=e}let c=(i-e)*.5,h=this.valueSize;this._weightPrev=c/(e-o),this._weightNext=c/(l-i),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(t,e,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,m=(i-e)/(s-e),x=m*m,p=x*m,g=-d*p+2*d*x-d*m,v=(1+d)*p+(-1.5-2*d)*x+(-.5+d)*m+1,w=(-1-f)*p+(1.5+f)*x+.5*m,y=f*p-f*x;for(let E=0;E!==o;++E)r[E]=g*a[h+E]+v*a[c+E]+w*a[l+E]+y*a[u+E];return r}},uo=class extends Wn{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t,e,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=(i-e)/(s-e),u=1-h;for(let d=0;d!==o;++d)r[d]=a[c+d]*u+a[l+d]*h;return r}},fo=class extends Wn{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t){return this.copySampleValue_(t-1)}},po=class extends Wn{interpolate_(t,e,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=this.inTangents,u=this.outTangents;if(!h||!u){let m=(i-e)/(s-e),x=1-m;for(let p=0;p!==o;++p)r[p]=a[c+p]*x+a[l+p]*m;return r}let d=o*2,f=t-1;for(let m=0;m!==o;++m){let x=a[c+m],p=a[l+m],g=f*d+m*2,v=u[g],w=u[g+1],y=t*d+m*2,E=h[y],A=h[y+1],_=Cf(i,e,v,E,s);r[m]=Gu(_,x,w,A,p)}return r}};function Gu(n,t,e,i,s){let r=1-n;return r*r*r*t+3*r*r*n*e+3*r*n*n*i+n*n*n*s}function Rf(n,t,e,i,s){let r=1-n;return 3*r*r*(e-t)+6*r*n*(i-e)+3*n*n*(s-i)}function Cf(n,t,e,i,s){let r=(n-t)/(s-t);for(let a=0;a<8;a++){let o=Gu(r,t,e,i,s)-n;if(Math.abs(o)<1e-10)break;let l=Rf(r,t,e,i,s);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-o/l))}return r}var Ai=class{constructor(t,e,i,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Hs(e,this.TimeBufferType),this.values=Hs(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,i;if(e.toJSON!==this.toJSON)i=e.toJSON(t);else{i={name:t.name,times:Hs(t.times,Array),values:Hs(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(i.interpolation=s),Ha(t.settings)&&(i.settings={inTangents:Hs(t.settings.inTangents,Array),outTangents:Hs(t.settings.outTangents,Array)})}return i.type=t.ValueTypeName,i}InterpolantFactoryMethodDiscrete(t){return new fo(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new uo(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new ho(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){let e=new po(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(t){let e;switch(t){case Pr:e=this.InterpolantFactoryMethodDiscrete;break;case to:e=this.InterpolantFactoryMethodLinear;break;case Wa:e=this.InterpolantFactoryMethodSmooth;break;case sc:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return Ot("KeyframeTrack:",i),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Pr;case this.InterpolantFactoryMethodLinear:return to;case this.InterpolantFactoryMethodSmooth:return Wa;case this.InterpolantFactoryMethodBezier:return sc}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let i=0,s=e.length;i!==s;++i)e[i]+=t;Ha(this.settings)&&($h(this.settings.inTangents,t),$h(this.settings.outTangents,t))}return this}scale(t){if(t!==1){let e=this.times;for(let i=0,s=e.length;i!==s;++i)e[i]*=t;Ha(this.settings)&&(Jh(this.settings.inTangents,t),Jh(this.settings.outTangents,t))}return this}trim(t,e){let i=this.times,s=i.length,r=0,a=s-1;for(;r!==s&&i[r]<t;)++r;for(;a!==-1&&i[a]>e;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=i.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(Bt("KeyframeTrack: Invalid value size in track.",this),t=!1);let i=this.times,s=this.values,r=i.length;r===0&&(Bt("KeyframeTrack: Track is empty.",this),t=!1);let a=null;for(let o=0;o!==r;o++){let l=i[o];if(typeof l=="number"&&isNaN(l)){Bt("KeyframeTrack: Time is not a valid number.",this,o,l),t=!1;break}if(a!==null&&a>l){Bt("KeyframeTrack: Out of order keys.",this,o,l,a),t=!1;break}a=l}if(s!==void 0&&rf(s))for(let o=0,l=s.length;o!==l;++o){let c=s[o];if(isNaN(c)){Bt("KeyframeTrack: Value is not a valid number.",this,o,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===Wa,r=t.length-1,a=1;for(let o=1;o<r;++o){let l=!1,c=t[o],h=t[o+1];if(c!==h&&(o!==1||c!==t[0]))if(s)l=!0;else{let u=o*i,d=u-i,f=u+i;for(let m=0;m!==i;++m){let x=e[u+m];if(x!==e[d+m]||x!==e[f+m]){l=!0;break}}}if(l){if(o!==a){t[a]=t[o];let u=o*i,d=a*i;for(let f=0;f!==i;++f)e[d+f]=e[u+f]}++a}}if(r>0){t[a]=t[r];for(let o=r*i,l=a*i,c=0;c!==i;++c)e[l+c]=e[o+c];++a}return a!==t.length?(this.times=t.slice(0,a),this.values=e.slice(0,a*i)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),i=this.constructor,s=new i(this.name,t,e);return s.createInterpolant=this.createInterpolant,Ha(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function $h(n,t){for(let e=0,i=n.length;e!==i;e+=2)n[e]+=t}function Jh(n,t){for(let e=0,i=n.length;e!==i;e+=2)n[e]*=t}Ai.prototype.ValueTypeName="";Ai.prototype.TimeBufferType=Float32Array;Ai.prototype.ValueBufferType=Float32Array;Ai.prototype.DefaultInterpolation=to;var Xn=class extends Ai{constructor(t,e,i){super(t,e,i)}};Xn.prototype.ValueTypeName="bool";Xn.prototype.ValueBufferType=Array;Xn.prototype.DefaultInterpolation=Pr;Xn.prototype.InterpolantFactoryMethodLinear=void 0;Xn.prototype.InterpolantFactoryMethodSmooth=void 0;var mo=class extends Ai{constructor(t,e,i,s){super(t,e,i,s)}};mo.prototype.ValueTypeName="color";var go=class extends Ai{constructor(t,e,i,s){super(t,e,i,s)}};go.prototype.ValueTypeName="number";var xo=class extends Wn{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t,e,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(i-e)/(s-e),c=t*o;for(let h=c+o;c!==h;c+=4)ze.slerpFlat(r,0,a,c-o,a,c,l);return r}},Yr=class extends Ai{constructor(t,e,i,s){super(t,e,i,s)}InterpolantFactoryMethodLinear(t){return new xo(this.times,this.values,this.getValueSize(),t)}};Yr.prototype.ValueTypeName="quaternion";Yr.prototype.InterpolantFactoryMethodSmooth=void 0;var qn=class extends Ai{constructor(t,e,i){super(t,e,i)}};qn.prototype.ValueTypeName="string";qn.prototype.ValueBufferType=Array;qn.prototype.DefaultInterpolation=Pr;qn.prototype.InterpolantFactoryMethodLinear=void 0;qn.prototype.InterpolantFactoryMethodSmooth=void 0;var _o=class extends Ai{constructor(t,e,i,s){super(t,e,i,s)}};_o.prototype.ValueTypeName="vector";var vo=class{constructor(t,e,i){let s=this,r=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=i,this._abortController=null,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let f=c[u],m=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return m}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Vu=new vo,yo=class{constructor(t){this.manager=t!==void 0?t:Vu,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},this.priority="auto",this.cache="default",typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){let i=this;return new Promise(function(s,r){i.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}setPriority(t){return this.priority=t,this}setCache(t){return this.cache=t,this}abort(){return this}};yo.DEFAULT_MATERIAL_NAME="__DEFAULT";var Zr=class extends ai{static registerNode(t){this.prototype._lightNode=t}constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Dt(t),this.intensity=e}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}};var nc=new pe,Kh=new F,Qh=new F,$r=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Pt(512,512),this.mapType=li,this.map=null,this.mapPass=null,this.matrix=new pe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Hn,this._frameExtents=new Pt(1,1),this._viewportCount=1,this._viewports=[new ye(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera;Kh.setFromMatrixPosition(t.matrixWorld),e.position.copy(Kh),Qh.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Qh),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum)}_updateMatrix(t,e,i,s){nc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),i.setFromProjectionMatrix(nc,t.coordinateSystem,t.reversedDepth);let r=this._frameExtents,a=s?s.z/r.x:1,o=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;t.coordinateSystem===Ys||t.reversedDepth?e.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):e.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),e.multiply(nc)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.mapType=t.mapType,this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.mapType=this.mapType,t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},Ga=new F,Va=new ze,on=new F,Jr=class extends ai{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new pe,this.projectionMatrix=new pe,this.projectionMatrixInverse=new pe,this.coordinateSystem=Bi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(Ga,Va,on),on.x===1&&on.y===1&&on.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ga,Va,on.set(1,1,1)).invert()}updateWorldMatrix(t,e,i=!1){super.updateWorldMatrix(t,e,i),this.matrixWorld.decompose(Ga,Va,on),on.x===1&&on.y===1&&on.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ga,Va,on.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Bn=new F,jh=new Pt,tu=new Pt,ri=class extends Jr{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=eo*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Ul*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return eo*2*Math.atan(Math.tan(Ul*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){Bn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Bn.x,Bn.y).multiplyScalar(-t/Bn.z),Bn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Bn.x,Bn.y).multiplyScalar(-t/Bn.z)}getViewSize(t,e){return this.getViewBounds(t,jh,tu),e.subVectors(tu,jh)}setViewOffset(t,e,i,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(Ul*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,e-=a.offsetY*i/c,s*=a.width/l,i*=a.height/c}let o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-i,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}};var lc=class extends $r{constructor(){super(new ri(90,1,.5,500)),this.isPointLightShadow=!0}},fs=class extends Zr{constructor(t,e,i=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new lc}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.distance=this.distance,e.object.decay=this.decay,e.object.shadow=this.shadow.toJSON(),e}},ps=class extends Jr{constructor(t=-1,e=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=i-t,a=i+t,o=s+e,l=s-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},cc=class extends $r{constructor(){super(new ps(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Kr=class extends Zr{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ai.DEFAULT_UP),this.updateMatrix(),this.target=new ai,this.shadow=new cc}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}};var Qr=class extends $e{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){let t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}};var Gs=-90,Vs=1,Yn=class extends ai{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new ri(Gs,Vs,t,e);s.layers=this.layers,this.add(s);let r=new ri(Gs,Vs,t,e);r.layers=this.layers,this.add(r);let a=new ri(Gs,Vs,t,e);a.layers=this.layers,this.add(a);let o=new ri(Gs,Vs,t,e);o.layers=this.layers,this.add(o);let l=new ri(Gs,Vs,t,e);l.layers=this.layers,this.add(l);let c=new ri(Gs,Vs,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[i,s,r,a,o,l]=e;for(let c of e)this.remove(c);if(t===Bi)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Ys)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,l,c,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;let x=i.texture.mipmapsAutoUpdate;i.texture.mipmapsAutoUpdate=!1;let p=!1;t.isWebGLRenderer===!0?p=t.state.buffers.depth.getReversed():p=t.reversedDepthBuffer,t.setRenderTarget(i,0,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(i,1,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(i,2,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(i,3,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(i,4,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),i.texture.mipmapsAutoUpdate=x,t.setRenderTarget(i,5,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=m,i.texture.needsPMREMUpdate=!0}},Mo=class extends ri{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t,this.perCameraFrustumCulled=!1}},jr=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(t){this._document=t,t.hidden!==void 0&&(this._pageVisibilityHandler=Pf.bind(this),t.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(t){return this._timescale=t,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(t){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(t!==void 0?t:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function Pf(){this._document.hidden===!1&&this.reset()}var kc="\\[\\]\\.:\\/",If=new RegExp("["+kc+"]","g"),Hc="[^"+kc+"]",Lf="[^"+kc.replace("\\.","")+"]",Df=/((?:WC+[\/:])*)/.source.replace("WC",Hc),Nf=/(WCOD+)?/.source.replace("WCOD",Lf),Uf=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Hc),Ff=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Hc),Of=new RegExp("^"+Df+Nf+Uf+Ff+"$"),Bf=["material","materials","bones","map"],hc=class{constructor(t,e,i){let s=i||we.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(t,e)}setValue(t,e){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,i=t.length;e!==i;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,i=t.length;e!==i;++e)t[e].unbind()}},we=class n{constructor(t,e,i){this.path=e,this.parsedPath=i||n.parseTrackName(e),this.node=n.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,i){return t&&t.isAnimationObjectGroup?new n.Composite(t,e,i):new n(t,e,i)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(If,"")}static parseTrackName(t){let e=Of.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let i={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=i.nodeName.substring(s+1);Bf.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return i}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let i=t.skeleton.getBoneByName(e);if(i!==void 0)return i}if(t.children){let i=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===e||o.uuid===e)return o;let l=i(o.children);if(l)return l}return null},s=i(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)t[e++]=i[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,i=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=n.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){Ot("PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=e.objectIndex;switch(i){case"materials":if(!t.material){Bt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){Bt("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){Bt("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){Bt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){Bt("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[i]===void 0){Bt("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[i]}if(c!==void 0){if(t[c]===void 0){Bt("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let a=t[s];if(a===void 0){let c=e.nodeName;Bt("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?o=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){Bt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){Bt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};we.Composite=hc;we.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};we.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};we.prototype.GetterByBindingType=[we.prototype._getValue_direct,we.prototype._getValue_array,we.prototype._getValue_arrayElement,we.prototype._getValue_toArray];we.prototype.SetterByBindingTypeAndVersioning=[[we.prototype._setValue_direct,we.prototype._setValue_direct_setNeedsUpdate,we.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[we.prototype._setValue_array,we.prototype._setValue_array_setNeedsUpdate,we.prototype._setValue_array_setMatrixWorldNeedsUpdate],[we.prototype._setValue_arrayElement,we.prototype._setValue_arrayElement_setNeedsUpdate,we.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[we.prototype._setValue_fromArray,we.prototype._setValue_fromArray_setNeedsUpdate,we.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var P_=new Float32Array(1);var uc=class{static{this.prototype.isMatrix2=!0}constructor(t,e,i,s){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,i,s)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let i=0;i<4;i++)this.elements[i]=t[i+e];return this}set(t,e,i,s){let r=this.elements;return r[0]=t,r[2]=e,r[1]=i,r[3]=s,this}};function Gc(n,t,e,i){let s=zf(i);switch(e){case Pc:return n*t;case Lc:return n*t/s.components*s.byteLength;case Ao:return n*t/s.components*s.byteLength;case $n:return n*t*2/s.components*s.byteLength;case Ro:return n*t*2/s.components*s.byteLength;case Ic:return n*t*3/s.components*s.byteLength;case pi:return n*t*4/s.components*s.byteLength;case Co:return n*t*4/s.components*s.byteLength;case ea:case ia:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case na:case sa:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Io:case Do:return Math.max(n,16)*Math.max(t,8)/4;case Po:case Lo:return Math.max(n,8)*Math.max(t,8)/2;case No:case Uo:case Oo:case Bo:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Fo:case ra:case zo:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case ko:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Ho:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case Go:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case Vo:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case Wo:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case Xo:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case qo:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case Yo:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case Zo:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case $o:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case Jo:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case Ko:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case Qo:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case jo:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case tl:case el:case il:return Math.ceil(n/4)*Math.ceil(t/4)*16;case nl:case sl:return Math.ceil(n/4)*Math.ceil(t/4)*8;case aa:case rl:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function zf(n){switch(n){case li:case Ec:return{byteLength:1,components:1};case sr:case Ac:case Ie:return{byteLength:2,components:1};case To:case Eo:return{byteLength:2,components:4};case Qi:case wo:case Ci:return{byteLength:4,components:1};case Rc:case Cc:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"187"}}));typeof window<"u"&&(window.__THREE__?Ot("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="187");function ud(){let n=null,t=!1,e=null,i=null;function s(r,a){i=n.requestAnimationFrame(s),e(r,a)}return{start:function(){t!==!0&&e!==null&&n!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){n=r}}}function Xf(n){let t=new WeakMap;function e(o,l){let c=o.array,h=o.usage,u=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=n.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=n.SHORT;else if(c instanceof Uint32Array)f=n.UNSIGNED_INT;else if(c instanceof Int32Array)f=n.INT;else if(c instanceof Int8Array)f=n.BYTE;else if(c instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,l,c){let h=l.array,u=l.updateRanges;if(n.bindBuffer(c,o),u.length===0)n.bufferSubData(c,0,h);else{u.sort((f,m)=>f.start-m.start);let d=0;for(let f=1;f<u.length;f++){let m=u[d],x=u[f];x.start<=m.start+m.count+1?m.count=Math.max(m.count,x.start+x.count-m.start):(++d,u[d]=x)}u.length=d+1;for(let f=0,m=u.length;f<m;f++){let x=u[f];n.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=t.get(o);l&&(n.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var qf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Yf=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Zf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,$f=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Jf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Kf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Qf=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,jf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,tp=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,ep=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,ip=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,np=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,sp=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,rp=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,ap=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,op=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,lp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,cp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,hp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,up=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,dp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,fp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,pp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,mp=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,gp=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,xp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,_p=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,vp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,yp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Mp="gl_FragColor = linearToOutputTexel( gl_FragColor );",Sp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,bp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,wp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,Tp=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Ep=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Ap=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Rp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Cp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Pp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Ip=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Lp=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Dp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Np=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Up=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Fp=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Op=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * worldNormal, ENVMAP_MAX_LOD );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * reflectVec, roughnessToMip( roughness ) );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureLod( envMap, envMapRotation * retroVec, roughnessToMip( roughness ) );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_PMREM
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,Bp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,zp=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,kp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Hp=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Gp=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.045 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef USE_DIFFUSE_ROUGHNESS
	float diffuseRoughnessFactor = diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		diffuseRoughnessFactor *= texture2D( diffuseRoughnessMap, vDiffuseRoughnessMapUv ).r;
	#endif
	material.diffuseRoughness = saturate( diffuseRoughnessFactor );
#endif
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.045 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Vp=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float diffuseRoughness;
	#endif
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
#ifdef USE_DIFFUSE_ROUGHNESS
	const float EON_EPSILON = 1e-7;
	float FON_DirectionalAlbedo( const in float mu, const in float roughness, const in float A ) {
		float muComp = 1.0 - mu;
		float gOverPi = muComp * ( 0.0571085289 + muComp * ( 0.491881867 + muComp * ( - 0.332181442 + muComp * 0.0714429953 ) ) );
		return A * ( 1.0 + roughness * gOverPi );
	}
	vec3 BRDF_EON( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 diffuseColor, const in float roughness ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return BRDF_Lambert( rho );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float s = dot( lightDir, viewDir ) - dotNL * dotNV;
		float sOverT = ( s > 0.0 ) ? s / max( max( dotNL, dotNV ), EON_EPSILON ) : s;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		vec3 singleScatter = rho * RECIPROCAL_PI * A * ( 1.0 + roughness * sOverT );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		float albedoV = FON_DirectionalAlbedo( dotNV, roughness, A );
		float albedoL = FON_DirectionalAlbedo( dotNL, roughness, A );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		vec3 multiScatter = rhoMultiScatter * RECIPROCAL_PI
			* max( EON_EPSILON, 1.0 - albedoV )
			* max( EON_EPSILON, 1.0 - albedoL )
			/ max( EON_EPSILON, 1.0 - averageAlbedo );
		return singleScatter + multiScatter;
	}
	vec3 EON_DirectionalAlbedo( const in vec3 diffuseColor, const in float roughness, const in float dotNV ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return rho;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		float directionalAlbedo = FON_DirectionalAlbedo( dotNV, roughness, A );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		return rho * directionalAlbedo + rhoMultiScatter * ( 1.0 - directionalAlbedo );
	}
#endif
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = max( material.clearcoatRoughness, 0.045 );
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = max( material.roughness, 0.045 );
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float alphaT = max( material.alphaT, alpha );
		float V = V_GGX_SmithCorrelated_Anisotropic( alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		vec3 diffuseBRDF = BRDF_EON( directLight.direction, geometryViewDir, geometryNormal, material.diffuseColor, material.diffuseRoughness ) * ( 1.0 - material.metalness );
	#else
		vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );
	#endif
	reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuseAlbedo = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness );
		vec3 diffuse = irradiance * RECIPROCAL_PI * diffuseAlbedo * ( 1.0 - singleScattering - multiScattering );
	#else
		vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#endif
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuse = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness ) * ( 1.0 - totalScatteringDielectric );
	#else
		vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	#endif
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Wp=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_LIGHT_PROBE_GRIDS > 0
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		int probeGrid = - 1;
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( isInsideLightProbeGrid( probeWorldPos, probeWorldNormal, probesMin[ i ], probesMax[ i ], probesResolution[ i ] ) ) probeGrid = UNROLLED_LOOP_INDEX;
		}
		#pragma unroll_loop_end
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( probeGrid == UNROLLED_LOOP_INDEX ) irradiance += getLightProbeGridIrradiance( probesSH[ i ], probesMin[ i ], probesMax[ i ], probesResolution[ i ], probeWorldPos, probeWorldNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Xp=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_PMREM )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,qp=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Yp=`#if NUM_LIGHT_PROBE_GRIDS > 0
uniform highp sampler3D probesSH[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMin[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMax[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesResolution[ NUM_LIGHT_PROBE_GRIDS ];
bool isInsideLightProbeGrid( vec3 worldPos, vec3 worldNormal, vec3 probesMin, vec3 probesMax, vec3 probesResolution ) {
	vec3 spacing = ( probesMax - probesMin ) / probesResolution;
	vec3 samplePos = worldPos + worldNormal * spacing * 0.5;
	vec3 margin = spacing * 0.01;
	return all( greaterThanEqual( samplePos, probesMin - margin ) ) && all( lessThanEqual( samplePos, probesMax + margin ) );
}
vec3 getLightProbeGridIrradiance( highp sampler3D probesSH, vec3 probesMin, vec3 probesMax, vec3 probesResolution, vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 probeSpacing = gridRange / res;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.5 / res, 1.0 - 0.5 / res );
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Zp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,$p=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Jp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Kp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Qp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,jp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,tm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,em=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,im=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,nm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,sm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,rm=`#if defined( USE_MORPHCOLORS )
	#if defined( USE_COLOR_ALPHA )
		vColor *= morphTargetBaseInfluence;
	#elif defined( USE_COLOR )
		vColor.rgb *= morphTargetBaseInfluence;
	#endif
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor.rgb += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,am=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,om=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,lm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,cm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,hm=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,um=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,dm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,fm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,pm=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,mm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,gm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,xm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,_m=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,vm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,ym=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Mm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Sm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,bm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,wm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Tm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Em=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Am=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				vec2 radius = shadowRadius * texelSize;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float lightDistance = length( lightToPosition );
			float depthRange = shadowCameraFar - shadowCameraNear;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float depthA = - shadowCameraNear / depthRange - shadowBias;
				float depthB = shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#else
				float depthA = shadowCameraFar / depthRange + shadowBias;
				float depthB = - shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			shadow = 0.0;
			for ( int i = 0; i < 5; i ++ ) {
				vec2 offset = vogelDiskSample( i, 5, phi );
				vec3 direction = bd3D + ( tangent * offset.x + bitangent * offset.y ) * texelSize;
				vec3 absDirection = abs( direction );
				float dp = depthA + depthB / max( max( absDirection.x, absDirection.y ), absDirection.z );
				shadow += texture( shadowMap, vec4( direction, dp ) );
			}
			shadow *= 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Rm=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Cm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Pm=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Im=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Lm=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Dm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Nm=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Um=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Fm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Om=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Bm=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,zm=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,km=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Hm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Gm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	uniform mat3 diffuseRoughnessMapTransform;
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Vm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	vDiffuseRoughnessMapUv = ( diffuseRoughnessMapTransform * vec3( DIFFUSE_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Wm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Xm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,qm=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ym=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Zm=`uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <envmap_common_pars_fragment>
void main() {
	#ifdef ENVMAP_TYPE_PMREM
		vec4 texColor = textureLod( envMap, backgroundRotation * vWorldDirection, roughnessToMip( backgroundBlurriness ) );
	#else
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$m=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Jm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Km=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Qm=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,jm=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,t0=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,e0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,i0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,n0=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,s0=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,r0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,a0=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,o0=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,l0=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,c0=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,h0=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,u0=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,d0=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,f0=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,p0=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,m0=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,g0=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DIFFUSE_ROUGHNESS
	uniform float diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		uniform sampler2D diffuseRoughnessMap;
	#endif
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,x0=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,_0=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,v0=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,y0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,M0=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,S0=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,b0=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,w0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Jt={alphahash_fragment:qf,alphahash_pars_fragment:Yf,alphamap_fragment:Zf,alphamap_pars_fragment:$f,alphatest_fragment:Jf,alphatest_pars_fragment:Kf,aomap_fragment:Qf,aomap_pars_fragment:jf,batching_pars_vertex:tp,batching_vertex:ep,begin_vertex:ip,beginnormal_vertex:np,bsdfs:sp,iridescence_fragment:rp,bumpmap_pars_fragment:ap,clipping_planes_fragment:op,clipping_planes_pars_fragment:lp,clipping_planes_pars_vertex:cp,clipping_planes_vertex:hp,color_fragment:up,color_pars_fragment:dp,color_pars_vertex:fp,color_vertex:pp,common:mp,defaultnormal_vertex:gp,displacementmap_pars_vertex:xp,displacementmap_vertex:_p,emissivemap_fragment:vp,emissivemap_pars_fragment:yp,colorspace_fragment:Mp,colorspace_pars_fragment:Sp,envmap_fragment:bp,envmap_common_pars_fragment:wp,envmap_pars_fragment:Tp,envmap_pars_vertex:Ep,envmap_physical_pars_fragment:Op,envmap_vertex:Ap,fog_vertex:Rp,fog_pars_vertex:Cp,fog_fragment:Pp,fog_pars_fragment:Ip,gradientmap_pars_fragment:Lp,lightmap_pars_fragment:Dp,lights_lambert_fragment:Np,lights_lambert_pars_fragment:Up,lights_pars_begin:Fp,lights_toon_fragment:Bp,lights_toon_pars_fragment:zp,lights_phong_fragment:kp,lights_phong_pars_fragment:Hp,lights_physical_fragment:Gp,lights_physical_pars_fragment:Vp,lights_fragment_begin:Wp,lights_fragment_maps:Xp,lights_fragment_end:qp,lightprobes_pars_fragment:Yp,logdepthbuf_fragment:Zp,logdepthbuf_pars_fragment:$p,logdepthbuf_pars_vertex:Jp,logdepthbuf_vertex:Kp,map_fragment:Qp,map_pars_fragment:jp,map_particle_fragment:tm,map_particle_pars_fragment:em,metalnessmap_fragment:im,metalnessmap_pars_fragment:nm,morphinstance_vertex:sm,morphcolor_vertex:rm,morphnormal_vertex:am,morphtarget_pars_vertex:om,morphtarget_vertex:lm,normal_fragment_begin:cm,normal_fragment_maps:hm,normal_pars_fragment:um,normal_pars_vertex:dm,normal_vertex:fm,normalmap_pars_fragment:pm,clearcoat_normal_fragment_begin:mm,clearcoat_normal_fragment_maps:gm,clearcoat_pars_fragment:xm,iridescence_pars_fragment:_m,opaque_fragment:vm,packing:ym,premultiplied_alpha_fragment:Mm,project_vertex:Sm,dithering_fragment:bm,dithering_pars_fragment:wm,roughnessmap_fragment:Tm,roughnessmap_pars_fragment:Em,shadowmap_pars_fragment:Am,shadowmap_pars_vertex:Rm,shadowmap_vertex:Cm,shadowmask_pars_fragment:Pm,skinbase_vertex:Im,skinning_pars_vertex:Lm,skinning_vertex:Dm,skinnormal_vertex:Nm,specularmap_fragment:Um,specularmap_pars_fragment:Fm,tonemapping_fragment:Om,tonemapping_pars_fragment:Bm,transmission_fragment:zm,transmission_pars_fragment:km,uv_pars_fragment:Hm,uv_pars_vertex:Gm,uv_vertex:Vm,worldpos_vertex:Wm,background_vert:Xm,background_frag:qm,backgroundCube_vert:Ym,backgroundCube_frag:Zm,cube_vert:$m,cube_frag:Jm,depth_vert:Km,depth_frag:Qm,distance_vert:jm,distance_frag:t0,equirect_vert:e0,equirect_frag:i0,linedashed_vert:n0,linedashed_frag:s0,meshbasic_vert:r0,meshbasic_frag:a0,meshlambert_vert:o0,meshlambert_frag:l0,meshmatcap_vert:c0,meshmatcap_frag:h0,meshnormal_vert:u0,meshnormal_frag:d0,meshphong_vert:f0,meshphong_frag:p0,meshphysical_vert:m0,meshphysical_frag:g0,meshtoon_vert:x0,meshtoon_frag:_0,points_vert:v0,points_frag:y0,shadow_vert:M0,shadow_frag:S0,sprite_vert:b0,sprite_frag:w0},gt={common:{diffuse:{value:new Dt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new zt},alphaMap:{value:null},alphaMapTransform:{value:new zt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new zt}},envmap:{envMap:{value:null},envMapRotation:{value:new zt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new zt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new zt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new zt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new zt},normalScale:{value:new Pt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new zt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new zt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new zt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new zt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Dt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new Dt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new zt},alphaTest:{value:0},uvTransform:{value:new zt}},sprite:{diffuse:{value:new Dt(16777215)},opacity:{value:1},center:{value:new Pt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new zt},alphaMap:{value:null},alphaMapTransform:{value:new zt},alphaTest:{value:0}}},dn={basic:{uniforms:ci([gt.common,gt.specularmap,gt.envmap,gt.aomap,gt.lightmap,gt.fog]),vertexShader:Jt.meshbasic_vert,fragmentShader:Jt.meshbasic_frag},lambert:{uniforms:ci([gt.common,gt.specularmap,gt.envmap,gt.aomap,gt.lightmap,gt.emissivemap,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.fog,gt.lights,{emissive:{value:new Dt(0)},envMapIntensity:{value:1}}]),vertexShader:Jt.meshlambert_vert,fragmentShader:Jt.meshlambert_frag},phong:{uniforms:ci([gt.common,gt.specularmap,gt.envmap,gt.aomap,gt.lightmap,gt.emissivemap,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.fog,gt.lights,{emissive:{value:new Dt(0)},specular:{value:new Dt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Jt.meshphong_vert,fragmentShader:Jt.meshphong_frag},standard:{uniforms:ci([gt.common,gt.envmap,gt.aomap,gt.lightmap,gt.emissivemap,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.roughnessmap,gt.metalnessmap,gt.fog,gt.lights,{emissive:{value:new Dt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Jt.meshphysical_vert,fragmentShader:Jt.meshphysical_frag},toon:{uniforms:ci([gt.common,gt.aomap,gt.lightmap,gt.emissivemap,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.gradientmap,gt.fog,gt.lights,{emissive:{value:new Dt(0)}}]),vertexShader:Jt.meshtoon_vert,fragmentShader:Jt.meshtoon_frag},matcap:{uniforms:ci([gt.common,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.fog,{matcap:{value:null}}]),vertexShader:Jt.meshmatcap_vert,fragmentShader:Jt.meshmatcap_frag},points:{uniforms:ci([gt.points,gt.fog]),vertexShader:Jt.points_vert,fragmentShader:Jt.points_frag},dashed:{uniforms:ci([gt.common,gt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Jt.linedashed_vert,fragmentShader:Jt.linedashed_frag},depth:{uniforms:ci([gt.common,gt.displacementmap]),vertexShader:Jt.depth_vert,fragmentShader:Jt.depth_frag},normal:{uniforms:ci([gt.common,gt.bumpmap,gt.normalmap,gt.displacementmap,{opacity:{value:1}}]),vertexShader:Jt.meshnormal_vert,fragmentShader:Jt.meshnormal_frag},sprite:{uniforms:ci([gt.sprite,gt.fog]),vertexShader:Jt.sprite_vert,fragmentShader:Jt.sprite_frag},background:{uniforms:{uvTransform:{value:new zt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Jt.background_vert,fragmentShader:Jt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new zt}},vertexShader:Jt.backgroundCube_vert,fragmentShader:Jt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Jt.cube_vert,fragmentShader:Jt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Jt.equirect_vert,fragmentShader:Jt.equirect_frag},distance:{uniforms:ci([gt.common,gt.displacementmap,{referencePosition:{value:new F},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Jt.distance_vert,fragmentShader:Jt.distance_frag},shadow:{uniforms:ci([gt.lights,gt.fog,{color:{value:new Dt(0)},opacity:{value:1}}]),vertexShader:Jt.shadow_vert,fragmentShader:Jt.shadow_frag}};dn.physical={uniforms:ci([dn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new zt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new zt},clearcoatNormalScale:{value:new Pt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new zt},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new zt},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new zt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new zt},sheen:{value:0},sheenColor:{value:new Dt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new zt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new zt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new zt},transmissionSamplerSize:{value:new Pt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new zt},attenuationDistance:{value:0},attenuationColor:{value:new Dt(0)},specularColor:{value:new Dt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new zt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new zt},anisotropyVector:{value:new Pt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new zt}}]),vertexShader:Jt.meshphysical_vert,fragmentShader:Jt.meshphysical_frag};var ll={r:0,b:0,g:0},T0=new pe,dd=new zt;dd.set(-1,0,0,0,1,0,0,0,1);function E0(n,t,e,i,s,r){let a=new Dt(0),o=s===!0?0:1,l,c,h=null,u=0,d=null;function f(v){let w=v.isScene===!0?v.background:null;if(w&&w.isTexture){let y=v.backgroundBlurriness>0;w=t.get(w,y)}return w}function m(v){let w=!1,y=f(v);y===null?p(a,o):y&&y.isColor&&(p(y,1),w=!0);let E=n.xr.getEnvironmentBlendMode();E==="additive"?e.buffers.color.setClear(0,0,0,1,r):E==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(n.autoClear||w)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function x(v,w){let y=f(w);y&&y.isCubeTexture?(c===void 0&&(c=new Qt(new zi(1,1,1),new ge({name:"BackgroundCubeMaterial",uniforms:ys(dn.backgroundCube.uniforms),vertexShader:dn.backgroundCube.vertexShader,fragmentShader:dn.backgroundCube.fragmentShader,side:Je,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(E,A,_){this.matrixWorld.copyPosition(_.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=y,c.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(T0.makeRotationFromEuler(w.backgroundRotation)).transpose(),y.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(dd),c.material.toneMapped=se.getTransfer(y.colorSpace)!==ue,(h!==y||u!==y.version||d!==n.toneMapping)&&(c.material.needsUpdate=!0,h=y,u=y.version,d=n.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new Qt(new oi(2,2),new ge({name:"BackgroundMaterial",uniforms:ys(dn.background.uniforms),vertexShader:dn.background.vertexShader,fragmentShader:dn.background.fragmentShader,side:Zn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,l.material.toneMapped=se.getTransfer(y.colorSpace)!==ue,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(h!==y||u!==y.version||d!==n.toneMapping)&&(l.material.needsUpdate=!0,h=y,u=y.version,d=n.toneMapping),l.layers.enableAll(),v.unshift(l,l.geometry,l.material,0,0,null))}function p(v,w){v.getRGB(ll,zc(n)),e.buffers.color.setClear(ll.r,ll.g,ll.b,w,r)}function g(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(v,w=1){a.set(v),o=w,p(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(v){o=v,p(a,o)},render:m,addToRenderList:x,dispose:g}}function A0(n,t){let e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=d(null),r=s,a=!1;function o(D,N,O,P,z){let V=!1,X=u(D,P,O,N);r!==X&&(r=X,c(r.object)),V=f(D,P,O,z),V&&m(D,P,O,z),z!==null&&t.update(z,n.ELEMENT_ARRAY_BUFFER),(V||a)&&(a=!1,y(D,N,O,P),z!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(z).buffer))}function l(){return n.createVertexArray()}function c(D){return n.bindVertexArray(D)}function h(D){return n.deleteVertexArray(D)}function u(D,N,O,P){let z=P.wireframe===!0,V=i[N.id];V===void 0&&(V={},i[N.id]=V);let X=D.isInstancedMesh===!0?D.id:0,st=V[X];st===void 0&&(st={},V[X]=st);let Y=st[O.id];Y===void 0&&(Y={},st[O.id]=Y);let tt=Y[z];return tt===void 0&&(tt=d(l()),Y[z]=tt),tt}function d(D){let N=[],O=[],P=[];for(let z=0;z<e;z++)N[z]=0,O[z]=0,P[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:N,enabledAttributes:O,attributeDivisors:P,object:D,attributes:{},index:null}}function f(D,N,O,P){let z=r.attributes,V=N.attributes,X=0,st=O.getAttributes();for(let Y in st)if(st[Y].location>=0){let it=z[Y],Et=V[Y];if(Et===void 0&&(Y==="instanceMatrix"&&D.instanceMatrix&&(Et=D.instanceMatrix),Y==="instanceColor"&&D.instanceColor&&(Et=D.instanceColor)),it===void 0||it.attribute!==Et||Et&&it.data!==Et.data)return!0;X++}return r.attributesNum!==X||r.index!==P}function m(D,N,O,P){let z={},V=N.attributes,X=0,st=O.getAttributes();for(let Y in st)if(st[Y].location>=0){let it=V[Y];it===void 0&&(Y==="instanceMatrix"&&D.instanceMatrix&&(it=D.instanceMatrix),Y==="instanceColor"&&D.instanceColor&&(it=D.instanceColor));let Et={};Et.attribute=it,it&&it.data&&(Et.data=it.data),z[Y]=Et,X++}r.attributes=z,r.attributesNum=X,r.index=P}function x(){let D=r.newAttributes;for(let N=0,O=D.length;N<O;N++)D[N]=0}function p(D){g(D,0)}function g(D,N){let O=r.newAttributes,P=r.enabledAttributes,z=r.attributeDivisors;O[D]=1,P[D]===0&&(n.enableVertexAttribArray(D),P[D]=1),z[D]!==N&&(n.vertexAttribDivisor(D,N),z[D]=N)}function v(){let D=r.newAttributes,N=r.enabledAttributes;for(let O=0,P=N.length;O<P;O++)N[O]!==D[O]&&(n.disableVertexAttribArray(O),N[O]=0)}function w(D,N,O,P,z,V,X){X===!0?n.vertexAttribIPointer(D,N,O,z,V):n.vertexAttribPointer(D,N,O,P,z,V)}function y(D,N,O,P){x();let z=P.attributes,V=O.getAttributes(),X=N.defaultAttributeValues;for(let st in V){let Y=V[st];if(Y.location>=0){let tt=z[st];if(tt===void 0&&(st==="instanceMatrix"&&D.instanceMatrix&&(tt=D.instanceMatrix),st==="instanceColor"&&D.instanceColor&&(tt=D.instanceColor)),tt!==void 0){let it=tt.normalized,Et=tt.itemSize,Wt=t.get(tt);if(Wt===void 0)continue;let J=Wt.buffer,_t=Wt.type,St=Wt.bytesPerElement,Nt=_t===n.INT||_t===n.UNSIGNED_INT||tt.gpuType===wo;if(tt.isInterleavedBufferAttribute){let vt=tt.data,qt=vt.isInterleavedBuffer===!0?vt.stride:vt.itemSize,Fe=tt.offset;if(vt.isInstancedInterleavedBuffer||vt.isInstancedBufferAttribute){for(let Ft=0;Ft<Y.locationSize;Ft++)g(Y.location+Ft,vt.meshPerAttribute);D.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=vt.meshPerAttribute*vt.count)}else for(let Ft=0;Ft<Y.locationSize;Ft++)p(Y.location+Ft);n.bindBuffer(n.ARRAY_BUFFER,J);for(let Ft=0;Ft<Y.locationSize;Ft++)w(Y.location+Ft,Et/Y.locationSize,_t,it,qt*St,(Fe+Et/Y.locationSize*Ft)*St,Nt)}else{if(tt.isInstancedBufferAttribute){for(let vt=0;vt<Y.locationSize;vt++)g(Y.location+vt,tt.meshPerAttribute);D.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=tt.meshPerAttribute*tt.count)}else for(let vt=0;vt<Y.locationSize;vt++)p(Y.location+vt);n.bindBuffer(n.ARRAY_BUFFER,J);for(let vt=0;vt<Y.locationSize;vt++)w(Y.location+vt,Et/Y.locationSize,_t,it,Et*St,Et/Y.locationSize*vt*St,Nt)}}else if(X!==void 0){let it=X[st];if(it!==void 0)switch(it.length){case 2:n.vertexAttrib2fv(Y.location,it);break;case 3:n.vertexAttrib3fv(Y.location,it);break;case 4:n.vertexAttrib4fv(Y.location,it);break;default:n.vertexAttrib1fv(Y.location,it)}}}}v()}function E(){I();for(let D in i){let N=i[D];for(let O in N){let P=N[O];for(let z in P){let V=P[z];for(let X in V)h(V[X].object),delete V[X];delete P[z]}}delete i[D]}}function A(D){if(i[D.id]===void 0)return;let N=i[D.id];for(let O in N){let P=N[O];for(let z in P){let V=P[z];for(let X in V)h(V[X].object),delete V[X];delete P[z]}}delete i[D.id]}function _(D){for(let N in i){let O=i[N];for(let P in O){let z=O[P];if(z[D.id]===void 0)continue;let V=z[D.id];for(let X in V)h(V[X].object),delete V[X];delete z[D.id]}}}function T(D){for(let N in i){let O=i[N],P=D.isInstancedMesh===!0?D.id:0,z=O[P];if(z!==void 0){for(let V in z){let X=z[V];for(let st in X)h(X[st].object),delete X[st];delete z[V]}delete O[P],Object.keys(O).length===0&&delete i[N]}}}function I(){R(),a=!0,r!==s&&(r=s,c(r.object))}function R(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:I,resetDefaultState:R,dispose:E,releaseStatesOfGeometry:A,releaseStatesOfObject:T,releaseStatesOfProgram:_,initAttributes:x,enableAttribute:p,disableUnusedAttributes:v}}function R0(n,t,e){let i;function s(l){i=l}function r(l,c){n.drawArrays(i,l,c),e.update(c,i,1)}function a(l,c,h){h!==0&&(n.drawArraysInstanced(i,l,c,h),e.update(c,i,h))}function o(l,c,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,h);let d=0;for(let f=0;f<h;f++)d+=c[f];e.update(d,i,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function C0(n,t,e,i){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let _=t.get("EXT_texture_filter_anisotropic");s=n.getParameter(_.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(_){return!(_!==pi&&i.convert(_)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(_){let T=_===Ie&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(_!==li&&_!==Ci&&!T&&i.convert(_)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE))}function l(_){if(_==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";_="mediump"}return _==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp",h=l(c);h!==c&&(Ot("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),d=e.logarithmicDepthBuffer===!0&&u===!1;e.reversedDepthBuffer===!0&&u===!1&&Ot("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),e.logarithmicDepthBuffer===!0&&u===!0&&Ot("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");let f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=n.getParameter(n.MAX_TEXTURE_SIZE),p=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),g=n.getParameter(n.MAX_VERTEX_ATTRIBS),v=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),w=n.getParameter(n.MAX_VARYING_VECTORS),y=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),E=n.getParameter(n.MAX_SAMPLES),A=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:m,maxTextureSize:x,maxCubemapSize:p,maxAttributes:g,maxVertexUniforms:v,maxVaryings:w,maxFragmentUniforms:y,maxSamples:E,samples:A}}function P0(n){let t=this,e=null,i=0,s=!1,r=!1,a=new Ei,o=new zt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let f=u.length!==0||d||i!==0||s;return s=d,i=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){let m=u.clippingPlanes,x=u.clipIntersection,p=u.clipShadows,g=n.get(u);if(!s||m===null||m.length===0||r&&!p)r?h(null):c();else{let v=r?0:i,w=v*4,y=g.clippingState||null;l.value=y,y=h(m,d,w,f);for(let E=0;E!==w;++E)y[E]=e[E];g.clippingState=y,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=v}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(u,d,f,m){let x=u!==null?u.length:0,p=null;if(x!==0){if(p=l.value,m!==!0||p===null){let g=f+x*4,v=d.matrixWorldInverse;o.getNormalMatrix(v),(p===null||p.length<g)&&(p=new Float32Array(g));for(let w=0,y=f;w!==x;++w,y+=4)a.copy(u[w]).applyMatrix4(v,o),a.normal.toArray(p,y),p[y+3]=a.constant}l.value=p,l.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,p}}var Ms=class extends Pe{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new Hr(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new zi(5,5,5),r=new ge({name:"CubemapFromEquirect",uniforms:ys(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Je,blending:An});r.uniforms.tEquirect.value=e;let a=new Qt(s,r),o=e.minFilter;return e.minFilter===Ri&&(e.minFilter=Ue),new Yn(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,i=!0,s=!0){let r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,i,s);t.setRenderTarget(r)}},Wu=256,I0=3,L0=20,fd=256,pd=16,D0=3,N0=new F,U0=new Dt,ar=class n{constructor(t){this._renderer=t,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new Yn(1,10,null),this._boxMesh=new Qt(new zi(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(t,e=0,i=.1,s=100,r={}){let{size:a=256,position:o=N0}=r,l=this._renderer;this._setSize(a);let c=this._allocateTarget(),h=this._getSourceTarget(!0);e>0&&(h.texture.mipmapsAutoUpdate=!1);let u=l.autoClear,d=l.autoClearColor,f=l.autoClearDepth,m=l.autoClearStencil,x=t.background;l.autoClear=!0,l.autoClearColor=!0,l.autoClearDepth=!0,l.autoClearStencil=!0,x===null&&(t.background=l.getClearColor(U0));let p=new Yn(i,s,h);return p.position.copy(o),p.update(l,t),l.autoClear=u,l.autoClearColor=d,l.autoClearDepth=f,l.autoClearStencil=m,t.background=x,e>0&&(h.texture.mipmapsAutoUpdate=!0,this._blur(c,e)),this._applyPMREM(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Yu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=qu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(t,e){return e>0?1-Math.sqrt(1-t/e):0}_setSize(t){this._cubeSize=Math.max(Wu,Ou(t))}_fromTexture(t,e){t.mapping===xs||t.mapping===ir?this._setSize(t.image.length===0?Wu:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4);let i=e||this._allocateTarget();return this._textureToCubemap(t),this._applyPMREM(i),i}_allocateTarget(){let t=this._cubeSize,e=Xu(t,!1,!1),i=Math.log2(t)-I0;for(let s=0;s<=i;s++)e.texture.mipmaps.push({width:t>>s,height:t>>s});return e.texture.name="PMREM",e.texture.isPMREMTexture=!0,e}_getSourceTarget(t=!1){let e=this._cubeSize,i=this._sourceTarget;return(i===null||i.width!==e||t&&i.depthBuffer===!1)&&(i!==null&&i.dispose(),this._sourceTarget=Xu(e,!0,t)),this._sourceTarget}_compileMaterial(t){this._boxMesh.material=t,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(t,e,i){let s=this._boxMesh,r=this._cubeCamera;s.material=i,r.renderTarget=t,r.activeMipmapLevel=e;let a=t.width>>e;t.viewport.set(0,0,a,a),r.update(this._renderer,s),t.viewport.set(0,0,t.width,t.height)}_textureToCubemap(t){let e;t.mapping===xs||t.mapping===ir?(this._cubemapMaterial===null&&(this._cubemapMaterial=Yu()),e=this._cubemapMaterial,e.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=qu()),e=this._equirectMaterial),e.uniforms.envMap.value=t,this._renderCube(this._getSourceTarget(),0,e)}_applyPMREM(t){this._ggxMaterial===null&&(this._ggxMaterial=F0(),this._integrationMaterial=O0());let e=this._cubeSize,i=t.texture.mipmaps.length-1,s=this._ggxMaterial.uniforms;s.envMap.value=this._sourceTarget.texture;let r=this._integrationMaterial.uniforms;r.envMap.value=this._sourceTarget.texture,r.sourceLod.value=Math.log2(e/pd);for(let a=0;a<=i;a++){let o=n.lodToRoughness(a,i);if(a>i-D0)r.roughness.value=o,this._renderCube(t,a,this._integrationMaterial);else{let l=o>0?Math.log2(e)+.5*Math.log2(6/(fd*Math.pow(o,4)))+.5:0;s.roughness.value=o,s.lodBias.value=l,this._renderCube(t,a,this._ggxMaterial)}}}_blur(t,e){this._blurMaterial===null&&(this._blurMaterial=B0());let i=this._blurMaterial,s=i.uniforms,r=this._sourceTarget;s.sigma.value=Math.min(e,Math.PI)/Math.SQRT2,s.envMap.value=r.texture,this._renderCube(t,0,i),s.envMap.value=t.texture,this._renderCube(r,0,i)}};function Xu(n,t,e){return new Ms(n,{minFilter:Ri,generateMipmaps:t,type:Ie,colorSpace:hs,depthBuffer:e})}function ca(n,t,e){return new ge({name:n,uniforms:t,vertexShader:Jt.cube_vert,fragmentShader:e,side:Je,blending:An,depthTest:!1,depthWrite:!1})}function F0(){return ca("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${fd}u

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float lodBias;

		#include <common>

		// Van der Corput radical inverse
		float radicalInverse_VdC( uint bits ) {

			bits = ( bits << 16u ) | ( bits >> 16u );
			bits = ( ( bits & 0x55555555u ) << 1u ) | ( ( bits & 0xAAAAAAAAu ) >> 1u );
			bits = ( ( bits & 0x33333333u ) << 2u ) | ( ( bits & 0xCCCCCCCCu ) >> 2u );
			bits = ( ( bits & 0x0F0F0F0Fu ) << 4u ) | ( ( bits & 0xF0F0F0F0u ) >> 4u );
			bits = ( ( bits & 0x00FF00FFu ) << 8u ) | ( ( bits & 0xFF00FF00u ) >> 8u );
			return float( bits ) * 2.3283064365386963e-10; // / 0x100000000

		}

		// Hammersley sequence
		vec2 hammersley( uint i, uint N ) {

			return vec2( float( i ) / float( N ), radicalInverse_VdC( i ) );

		}

		void main() {

			vec3 N = normalize( vWorldDirection );

			// For very low roughness, just sample the environment directly
			if ( roughness < 0.001 ) {

				gl_FragColor = vec4( textureLod( envMap, N, 0.0 ).rgb, 1.0 );
				return;

			}

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			// Tangent space basis for VNDF sampling
			vec3 up = abs( N.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, N ) );
			vec3 bitangent = cross( N, tangent );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			for ( uint i = 0u; i < GGX_SAMPLES; i ++ ) {

				vec2 Xi = hammersley( i, GGX_SAMPLES );

				// With V = N, sample the reflected direction directly.
				float invQ = 1.0 / ( 1.0 - Xi.x + alpha2 * Xi.x );
				float NdotL = ( 1.0 - Xi.x - alpha2 * Xi.x ) * invQ;

				if ( NdotL > 0.0 ) {

					float phi = 2.0 * PI * Xi.y;
					float sinTheta = 2.0 * alpha * sqrt( Xi.x * ( 1.0 - Xi.x ) ) * invQ;
					vec3 L = N * NdotL + ( tangent * cos( phi ) + bitangent * sin( phi ) ) * sinTheta;

					// Match the source mip to the sample's solid angle. The terms
					// independent of the sample are precomputed in lodBias.
					float d = alpha2 * invQ;
					float lod = max( log2( d ) + lodBias, 0.0 );

					// Weight by NdotL for the split-sum approximation
					prefilteredColor += textureLod( envMap, L, lod ).rgb * NdotL;
					totalWeight += NdotL;

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function O0(){return ca("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:pd}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float sourceLod;
		uniform int sourceSize;

		void main() {

			vec3 N = normalize( vWorldDirection );

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			float texelSize = 2.0 / float( sourceSize );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			// Pair opposite texels: only the one in N's hemisphere contributes.
			for ( int face = 0; face < 3; face ++ ) {

				for ( int y = 0; y < sourceSize; y ++ ) {

					for ( int x = 0; x < sourceSize; x ++ ) {

						vec2 uv = ( vec2( x, y ) + 0.5 ) * texelSize - 1.0;
						vec3 texelDirection = face == 0 ? vec3( 1.0, uv ) : ( face == 1 ? vec3( uv.x, 1.0, uv.y ) : vec3( uv, 1.0 ) );

						float invDistance = inversesqrt( 1.0 + dot( uv, uv ) );
						float NdotL = dot( N, texelDirection );
						texelDirection *= NdotL < 0.0 ? - 1.0 : 1.0;
						NdotL = abs( NdotL ) * invDistance;

						// With V = N, NdotH squared is ( 1 + NdotL ) / 2. Common factors
						// in the GGX distribution and texel solid angle cancel when normalized.
						float d = 1.0 + alpha2 + ( alpha2 - 1.0 ) * NdotL;
						float weight = NdotL * invDistance * invDistance * invDistance / ( d * d );

						prefilteredColor += textureLod( envMap, texelDirection, sourceLod ).rgb * weight;
						totalWeight += weight;

					}

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function B0(){return ca("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${L0}
		#define GOLDEN_ANGLE 2.39996322973

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float sigma;

		#include <common>

		void main() {

			vec3 outputDirection = normalize( vWorldDirection );

			vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, outputDirection ) );
			vec3 bitangent = cross( outputDirection, tangent );

			// Truncate the kernel at three standard deviations or at the antipode.
			float thetaMax = min( 3.0 * sigma, PI );
			float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

			vec3 accumColor = vec3( 0.0 );
			float accumWeight = 0.0;

			for ( int i = 0; i < SAMPLES; i ++ ) {

				// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
				float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
				float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
				float phi = float( i ) * GOLDEN_ANGLE;

				vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
				vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

				// Correct the planar sample density to solid angle.
				float weight = sin( theta ) / theta;

				accumColor += weight * textureLod( envMap, sampleDirection, 0.0 ).rgb;
				accumWeight += weight;

			}

			gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

		}
	`)}function qu(){return ca("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

		varying vec3 vWorldDirection;

		uniform sampler2D envMap;

		#include <common>

		void main() {

			// Average four subpixel samples to preserve small, bright features.
			vec3 direction = normalize( vWorldDirection );
			vec3 dx = dFdx( direction ) * 0.25;
			vec3 dy = dFdy( direction ) * 0.25;

			vec3 color = textureLod( envMap, equirectUv( normalize( direction - dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction - dx + dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx + dy ) ), 0.0 ).rgb;
			gl_FragColor = vec4( color * 0.25, 1.0 );

		}
	`)}function Yu(){return ca("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function z0(n){let t=new WeakMap,e=new WeakMap,i=null;function s(d,f=!1){return d==null?null:f?a(d):r(d)}function r(d){if(d&&d.isTexture){let f=d.mapping;if(f===nr||f===So)if(t.has(d)){let m=t.get(d).texture;return o(m,d.mapping)}else{let m=d.image;if(m&&m.height>0){let x=new Ms(m.height);return x.fromEquirectangularTexture(n,d),t.set(d,x),d.addEventListener("dispose",c),o(x.texture,d.mapping)}else return null}}return d}function a(d){if(d&&d.isTexture&&d.isPMREMTexture!==!0){let f=d.mapping,m=f===nr||f===So,x=f===xs||f===ir;if(m||x){let p=e.get(d),g=p!==void 0?p.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==g)return i===null&&(i=new ar(n)),p=m?i.fromEquirectangular(d,p):i.fromCubemap(d,p),p.texture.pmremVersion=d.pmremVersion,e.set(d,p),p.texture;if(p!==void 0)return p.texture;{let v=d.image;return m&&v&&v.height>0||x&&v&&l(v)?(i===null&&(i=new ar(n)),p=m?i.fromEquirectangular(d):i.fromCubemap(d),p.texture.pmremVersion=d.pmremVersion,e.set(d,p),d.addEventListener("dispose",h),p.texture):null}}}return d}function o(d,f){return f===nr?d.mapping=xs:f===So&&(d.mapping=ir),d}function l(d){let f=0,m=6;for(let x=0;x<m;x++)d[x]!==void 0&&f++;return f===m}function c(d){let f=d.target;f.removeEventListener("dispose",c);let m=t.get(f);m!==void 0&&(t.delete(f),m.dispose())}function h(d){let f=d.target;f.removeEventListener("dispose",h);let m=e.get(f);m!==void 0&&(e.delete(f),m.dispose())}function u(){t=new WeakMap,e=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:u}}function k0(n){let t={};function e(i){if(t[i]!==void 0)return t[i];let s=n.getExtension(i);return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){let s=e(i);return s===null&&Cr("WebGLRenderer: "+i+" extension not supported."),s}}}function H0(n,t,e,i){let s={},r=new WeakMap,a=new FinalizationRegistry(m=>delete s[m]);function o(m){l(m.target)}function l(m){m.index!==null&&t.remove(m.index);for(let p in m.attributes)t.remove(m.attributes[p]);m.removeEventListener("dispose",o),delete s[m.id],a.unregister(m);let x=r.get(m);x&&(t.remove(x),r.delete(m)),i.releaseStatesOfGeometry(m),m.isInstancedBufferGeometry===!0&&delete m._maxInstanceCount,e.memory.geometries--}function c(m,x){return s[x.id]!==void 0||(x.addEventListener("dispose",o),s[x.id]=new WeakRef(x),a.register(x,x.id,x),e.memory.geometries++),x}function h(m){let x=m.attributes;for(let p in x)t.update(x[p],n.ARRAY_BUFFER)}function u(m){let x=m.index,p=m.attributes.position,g=0;if(p===void 0)return;let v=x!==null?x.array.length:p.array.length/3-1,w=p.count>=65535?Br:Or,y=new w(Math.ceil(v/3)*6,1),E=y.array;if(x!==null){let _=x.array;g=x.version;for(let T=0,I=0;T<v;T+=3){let R=_[T+0],D=_[T+1],N=_[T+2];E[I++]=R,E[I++]=D,E[I++]=D,E[I++]=N,E[I++]=N,E[I++]=R}}else{g=p.version;for(let _=0,T=0;_<v;_+=3){let I=_+0,R=_+1,D=_+2;E[T++]=I,E[T++]=R,E[T++]=R,E[T++]=D,E[T++]=D,E[T++]=I}}y.version=g;let A=r.get(m);A&&t.remove(A),r.set(m,y)}function d(m){let x=r.get(m);if(x){let p=m.index;p!==null&&x.version<p.version&&u(m)}else u(m);return r.get(m)}function f(){for(let m in s){let x=s[m].deref();x!==void 0&&l(x)}}return{get:c,update:h,getWireframeAttribute:d,dispose:f}}function G0(n,t,e){let i;function s(u){i=u}let r,a;function o(u){r=u.type,a=u.bytesPerElement}function l(u,d){n.drawElements(i,d,r,u*a),e.update(d,i,1)}function c(u,d,f){f!==0&&(n.drawElementsInstanced(i,d,r,u*a,f),e.update(d,i,f))}function h(u,d,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,d,0,r,u,0,f);let x=0;for(let p=0;p<f;p++)x+=d[p];e.update(x,i,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function V0(n){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(e.calls++,a){case n.TRIANGLES:e.triangles+=o*(r/3);break;case n.LINES:e.lines+=o*(r/2);break;case n.LINE_STRIP:e.lines+=o*(r-1);break;case n.LINE_LOOP:e.lines+=o*r;break;case n.POINTS:e.points+=o*r;break;default:Bt("WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function W0(n,t,e){let i=new WeakMap,s=new ye;function r(a,o,l){let c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0,d=i.get(o);if(d===void 0||d.count!==u){let I=function(){_.dispose(),i.delete(o),o.removeEventListener("dispose",I)};d!==void 0&&d.texture.dispose();let f=o.morphAttributes.position!==void 0,m=o.morphAttributes.normal!==void 0,x=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],g=o.morphAttributes.normal||[],v=o.morphAttributes.color||[],w=0;f===!0&&(w=1),m===!0&&(w=2),x===!0&&(w=3);let y=o.attributes.position.count*w,E=1;y>t.maxTextureSize&&(E=Math.ceil(y/t.maxTextureSize),y=t.maxTextureSize);let A=new Float32Array(y*E*4*u),_=new Nr(A,y,E,u);_.type=Ci,_.needsUpdate=!0;let T=w*4;for(let R=0;R<u;R++){let D=p[R],N=g[R],O=v[R],P=y*E*4*R;for(let z=0;z<D.count;z++){let V=z*T;f===!0&&(s.fromBufferAttribute(D,z),A[P+V+0]=s.x,A[P+V+1]=s.y,A[P+V+2]=s.z,A[P+V+3]=0),m===!0&&(s.fromBufferAttribute(N,z),A[P+V+4]=s.x,A[P+V+5]=s.y,A[P+V+6]=s.z,A[P+V+7]=0),x===!0&&(s.fromBufferAttribute(O,z),A[P+V+8]=s.x,A[P+V+9]=s.y,A[P+V+10]=s.z,A[P+V+11]=O.itemSize===4?s.w:1)}}d={count:u,texture:_,size:new Pt(y,E)},i.set(o,d),o.addEventListener("dispose",I)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",a.morphTexture,e);else{let f=0;for(let x=0;x<c.length;x++)f+=c[x];let m=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(n,"morphTargetBaseInfluence",m),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:r}}function X0(n,t,e,i,s){let r=new WeakMap;function a(c){let h=s.render.frame,u=c.geometry,d=t.get(c,u);if(r.get(d)!==h&&(t.update(d),r.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){let f=c.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return d}function o(){r=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),i.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:a,dispose:o}}var q0={[_c]:"LINEAR_TONE_MAPPING",[vc]:"REINHARD_TONE_MAPPING",[yc]:"CINEON_TONE_MAPPING",[Mc]:"ACES_FILMIC_TONE_MAPPING",[bc]:"AGX_TONE_MAPPING",[wc]:"NEUTRAL_TONE_MAPPING",[Sc]:"CUSTOM_TONE_MAPPING"};function Y0(n,t,e,i,s,r){let a=new Pe(t,e,{type:n,depthBuffer:s,stencilBuffer:r,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,l=null,c=null,h=new $e;h.setAttribute("position",new me([-1,3,0,-1,-1,0,3,-1,0],3)),h.setAttribute("uv",new me([0,2,0,0,2,0],2));let u=new oo({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new Qt(h,u),f=new ps(-1,1,1,-1,0,1),m=null,x=null,p=!1,g,v=null,w=[],y=!1;this.setSize=function(E,A){a.setSize(E,A),o!==null&&o.setSize(E,A),l!==null&&l.setSize(E,A);for(let _=0;_<w.length;_++){let T=w[_];T.setSize&&T.setSize(E,A)}},this.setEffects=function(E){w=E,y=w.length>0&&w[0].isRenderPass===!0;let A=a.width,_=a.height;w.length>0&&o===null&&(o=new Pe(A,_,{type:Ie,depthBuffer:!1,stencilBuffer:!1}),l=new Pe(A,_,{type:Ie,depthBuffer:!1,stencilBuffer:!1}));let T=s===!0&&w.some(I=>I.needsDepthTexture===!0);T!==(a.depthTexture!==null)&&(T===!0&&c===null&&(c=new En(A,_),r===!0&&(c.format=Rn,c.type=_s)),a.dispose(),a.depthTexture=T?c:null,a.resolveDepthBuffer=T,a.storeMultisampledDepthBuffer=T);for(let I=0;I<w.length;I++){let R=w[I];R.setSize&&R.setSize(A,_),T&&R.needsDepthTexture===!0&&R.setDepthTexture&&R.setDepthTexture(c)}},this.begin=function(E,A){if(p||E.toneMapping===yi&&w.length===0)return!1;if(v=A,A!==null){let _=A.width,T=A.height;(a.width!==_||a.height!==T)&&this.setSize(_,T)}return y===!1&&E.setRenderTarget(a),g=E.toneMapping,E.toneMapping=yi,!0},this.hasRenderPass=function(){return y},this.end=function(E,A){E.toneMapping=g,p=!0;let _=a,T=o;for(let I=0;I<w.length;I++){let R=w[I];R.enabled!==!1&&(R.render(E,T,_,A),R.needsSwap!==!1&&(_=T,T=T===o?l:o))}if(m!==E.outputColorSpace||x!==E.toneMapping){m=E.outputColorSpace,x=E.toneMapping,u.defines={},se.getTransfer(m)===ue&&(u.defines.SRGB_TRANSFER="");let I=q0[x];I&&(u.defines[I]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=_.texture,E.setRenderTarget(v),E.render(d,f),v=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),h.dispose(),u.dispose()}}var md=new _i,gd=new En(1,1),xd=new Gr(1),_d=new Nr,vd=new so,yd=new Hr,Zu=[],$u=[],Ju=new Float32Array(16),Ku=new Float32Array(9),Qu=new Float32Array(4);function or(n,t,e){let i=n[0];if(i<=0||i>0)return n;let s=t*e,r=Zu[s];if(r===void 0&&(r=new Float32Array(s),Zu[s]=r),t!==0){i.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,n[a].toArray(r,o)}return r}function Ge(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function Ve(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function ul(n,t){let e=$u[t];e===void 0&&(e=new Int32Array(t),$u[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function Z0(n,t){let e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function $0(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ge(e,t))return;n.uniform2fv(this.addr,t),Ve(e,t)}}function J0(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ge(e,t))return;n.uniform3fv(this.addr,t),Ve(e,t)}}function K0(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ge(e,t))return;n.uniform4fv(this.addr,t),Ve(e,t)}}function Q0(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(Ge(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),Ve(e,t)}else{if(Ge(e,i))return;Qu.set(i),n.uniformMatrix2fv(this.addr,!1,Qu),Ve(e,i)}}function j0(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(Ge(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),Ve(e,t)}else{if(Ge(e,i))return;Ku.set(i),n.uniformMatrix3fv(this.addr,!1,Ku),Ve(e,i)}}function tg(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(Ge(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),Ve(e,t)}else{if(Ge(e,i))return;Ju.set(i),n.uniformMatrix4fv(this.addr,!1,Ju),Ve(e,i)}}function eg(n,t){let e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function ig(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ge(e,t))return;n.uniform2iv(this.addr,t),Ve(e,t)}}function ng(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ge(e,t))return;n.uniform3iv(this.addr,t),Ve(e,t)}}function sg(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ge(e,t))return;n.uniform4iv(this.addr,t),Ve(e,t)}}function rg(n,t){let e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function ag(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ge(e,t))return;n.uniform2uiv(this.addr,t),Ve(e,t)}}function og(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ge(e,t))return;n.uniform3uiv(this.addr,t),Ve(e,t)}}function lg(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ge(e,t))return;n.uniform4uiv(this.addr,t),Ve(e,t)}}function dl(n){return n.version===0&&(n.compareFunction=Uc,n.needsUpdate=!0),n}function cg(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?r=dl(gd):r=md,e.setTexture2D(t||r,s)}function hg(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||vd,s)}function ug(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_CUBE_SHADOW?r=dl(xd):r=yd,e.setTextureCube(t||r,s)}function dg(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||_d,s)}function fg(n){switch(n){case 5126:return Z0;case 35664:return $0;case 35665:return J0;case 35666:return K0;case 35674:return Q0;case 35675:return j0;case 35676:return tg;case 5124:case 35670:return eg;case 35667:case 35671:return ig;case 35668:case 35672:return ng;case 35669:case 35673:return sg;case 5125:return rg;case 36294:return ag;case 36295:return og;case 36296:return lg;case 35678:case 36198:case 36298:case 36306:case 35682:return cg;case 35679:case 36299:case 36307:return hg;case 35680:case 36300:case 36308:case 36293:return ug;case 36289:case 36303:case 36311:case 36292:return dg}}function pg(n,t){n.uniform1fv(this.addr,t)}function mg(n,t){let e=or(t,this.size,2);n.uniform2fv(this.addr,e)}function gg(n,t){let e=or(t,this.size,3);n.uniform3fv(this.addr,e)}function xg(n,t){let e=or(t,this.size,4);n.uniform4fv(this.addr,e)}function _g(n,t){let e=or(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function vg(n,t){let e=or(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function yg(n,t){let e=or(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function Mg(n,t){n.uniform1iv(this.addr,t)}function Sg(n,t){n.uniform2iv(this.addr,t)}function bg(n,t){n.uniform3iv(this.addr,t)}function wg(n,t){n.uniform4iv(this.addr,t)}function Tg(n,t){n.uniform1uiv(this.addr,t)}function Eg(n,t){n.uniform2uiv(this.addr,t)}function Ag(n,t){n.uniform3uiv(this.addr,t)}function Rg(n,t){n.uniform4uiv(this.addr,t)}function Cg(n,t,e){let i=this.cache,s=t.length,r=ul(e,s);Ge(i,r)||(n.uniform1iv(this.addr,r),Ve(i,r));let a;this.type===n.SAMPLER_2D_SHADOW?a=dl(gd):a=md;for(let o=0;o!==s;++o)e.setTexture2D(t[o]||a,r[o])}function Pg(n,t,e){let i=this.cache,s=t.length,r=ul(e,s);Ge(i,r)||(n.uniform1iv(this.addr,r),Ve(i,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||vd,r[a])}function Ig(n,t,e){let i=this.cache,s=t.length,r=ul(e,s);Ge(i,r)||(n.uniform1iv(this.addr,r),Ve(i,r));let a;this.type===n.SAMPLER_CUBE_SHADOW?a=dl(xd):a=yd;for(let o=0;o!==s;++o)e.setTextureCube(t[o]||a,r[o])}function Lg(n,t,e){let i=this.cache,s=t.length,r=ul(e,s);Ge(i,r)||(n.uniform1iv(this.addr,r),Ve(i,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||_d,r[a])}function Dg(n){switch(n){case 5126:return pg;case 35664:return mg;case 35665:return gg;case 35666:return xg;case 35674:return _g;case 35675:return vg;case 35676:return yg;case 5124:case 35670:return Mg;case 35667:case 35671:return Sg;case 35668:case 35672:return bg;case 35669:case 35673:return wg;case 5125:return Tg;case 36294:return Eg;case 36295:return Ag;case 36296:return Rg;case 35678:case 36198:case 36298:case 36306:case 35682:return Cg;case 35679:case 36299:case 36307:return Pg;case 35680:case 36300:case 36308:case 36293:return Ig;case 36289:case 36303:case 36311:case 36292:return Lg}}var Xc=class{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=fg(e.type)}},qc=class{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Dg(e.type)}},Yc=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(t,e[o.id],i)}}},Vc=/(\w+)(\])?(\[|\.)?/g;function ju(n,t){n.seq.push(t),n.map[t.id]=t}function Ng(n,t,e){let i=n.name,s=i.length;for(Vc.lastIndex=0;;){let r=Vc.exec(i),a=Vc.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){ju(e,c===void 0?new Xc(o,n,t):new qc(o,n,t));break}else{let u=e.map[o];u===void 0&&(u=new Yc(o),ju(e,u)),e=u}}}var rr=class{constructor(t,e){this.seq=[],this.map={};let i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){let o=t.getActiveUniform(e,a),l=t.getUniformLocation(e,o.name);Ng(o,l,this)}let s=[],r=[];for(let a of this.seq)a.type===t.SAMPLER_2D_SHADOW||a.type===t.SAMPLER_CUBE_SHADOW||a.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(t,e,i,s){let r=this.map[e];r!==void 0&&r.setValue(t,i,s)}setOptional(t,e,i){let s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let r=0,a=e.length;r!==a;++r){let o=e[r],l=i[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,s)}}static seqWithValue(t,e){let i=[];for(let s=0,r=t.length;s!==r;++s){let a=t[s];a.id in e&&i.push(a)}return i}};function td(n,t,e){let i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}var Ug=37297,Fg=0;function Og(n,t){let e=n.split(`
`),i=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){let o=a+1;i.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return i.join(`
`)}var ed=new zt;function Bg(n){se._getMatrix(ed,se.workingColorSpace,n);let t=`mat3( ${ed.elements.map(e=>e.toFixed(4))} )`;switch(se.getTransfer(n)){case Ir:return[t,"LinearTransferOETF"];case ue:return[t,"sRGBTransferOETF"];default:return Ot("WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function id(n,t,e){let i=n.getShaderParameter(t,n.COMPILE_STATUS),r=(n.getShaderInfoLog(t)||"").trim();if(i&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+Og(n.getShaderSource(t),o)}else return r}function zg(n,t){let e=Bg(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( ${e[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}var kg={[_c]:"Linear",[vc]:"Reinhard",[yc]:"Cineon",[Mc]:"ACESFilmic",[bc]:"AgX",[wc]:"Neutral",[Sc]:"Custom"};function Hg(n,t){let e=kg[t];return e===void 0?(Ot("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var cl=new F;function Gg(){se.getLuminanceCoefficients(cl);let n=cl.x.toFixed(4),t=cl.y.toFixed(4),e=cl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Vg(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(la).join(`
`)}function Wg(n){let t=[];for(let e in n){let i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function Xg(n,t){let e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let r=n.getActiveAttrib(t,s),a=r.name,o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:n.getAttribLocation(t,a),locationSize:o}}return e}function la(n){return n!==""}function nd(n,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,t.numLightProbeGrids)}function sd(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var qg=/^[ \t]*#include +<([\w\d./]+)>/gm;function Zc(n){return n.replace(qg,Yg)}function Yg(n,t){let e=Jt[t];if(e===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">");return Zc(e)}var Zg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function rd(n){return n.replace(Zg,$g)}function $g(n,t,e,i){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function ad(n){let t=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?t+=`
#define HIGH_PRECISION`:n.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}var Jg={[ms]:"SHADOWMAP_TYPE_PCF",[er]:"SHADOWMAP_TYPE_VSM"};function Kg(n){return Jg[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var Qg={[ir]:"ENVMAP_MODE_REFRACTION"};function jg(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":Qg[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}var tx={[xc]:"ENVMAP_BLENDING_MULTIPLY",[Su]:"ENVMAP_BLENDING_MIX",[bu]:"ENVMAP_BLENDING_ADD"};function ex(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":tx[n.combine]||"ENVMAP_BLENDING_NONE"}function ix(n,t,e,i){let s=n.getContext(),r=e.defines,a=e.vertexShader,o=e.fragmentShader,l=Kg(e),c=e.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",h=jg(e),u=ex(e),d=Vg(e),f=Wg(r),m=s.createProgram(),x,p,g=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(x=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,f].filter(la).join(`
`),x.length>0&&(x+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,f].filter(la).join(`
`),p.length>0&&(p+=`
`)):(x=[ad(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,f,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+e.diffuseRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(la).join(`
`),p=[ad(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,f,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",e.envMapPMREM?"#define ENVMAP_MAX_LOD "+e.envMapMaxLod+".0":"",e.envMapPMREM?"#define ENVMAP_SIZE "+e.envMapSize+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",e.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==yi?"#define TONE_MAPPING":"",e.toneMapping!==yi?Jt.tonemapping_pars_fragment:"",e.toneMapping!==yi?Hg("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Jt.colorspace_pars_fragment,zg("linearToOutputTexel",e.outputColorSpace),Gg(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(la).join(`
`)),a=Zc(a),a=nd(a,e),a=sd(a,e),o=Zc(o),o=nd(o,e),o=sd(o,e),a=rd(a),o=rd(o),e.isRawShaderMaterial!==!0&&(g=`#version 300 es
`,x=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+x,p=["#define varying in",e.glslVersion===Bc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Bc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let v=g+x+a,w=g+p+o,y=td(s,s.VERTEX_SHADER,v),E=td(s,s.FRAGMENT_SHADER,w);s.attachShader(m,y),s.attachShader(m,E),e.index0AttributeName!==void 0?s.bindAttribLocation(m,0,e.index0AttributeName):e.hasPositionAttribute===!0&&s.bindAttribLocation(m,0,"position"),s.linkProgram(m);function A(R){if(n.debug.checkShaderErrors){let D=s.getProgramInfoLog(m)||"",N=s.getShaderInfoLog(y)||"",O=s.getShaderInfoLog(E)||"",P=D.trim(),z=N.trim(),V=O.trim(),X=!0,st=!0;if(s.getProgramParameter(m,s.LINK_STATUS)===!1)if(X=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,m,y,E);else{let Y=id(s,y,"vertex"),tt=id(s,E,"fragment");Bt("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(m,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+P+`
`+Y+`
`+tt)}else P!==""?Ot("WebGLProgram: Program Info Log:",P):(z===""||V==="")&&(st=!1);st&&(R.diagnostics={runnable:X,programLog:P,vertexShader:{log:z,prefix:x},fragmentShader:{log:V,prefix:p}})}s.deleteShader(y),s.deleteShader(E),_=new rr(s,m),T=Xg(s,m)}let _;this.getUniforms=function(){return _===void 0&&A(this),_};let T;this.getAttributes=function(){return T===void 0&&A(this),T};let I=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return I===!1&&(I=s.getProgramParameter(m,Ug)),I},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(m),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Fg++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=y,this.fragmentShader=E,this}var nx=0,$c=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,i){let s=this._getShaderCacheForMaterial(t);return s.has(e)===!1&&(s.add(e),e.usedTimes++),s.has(i)===!1&&(s.add(i),i.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){let e=this.shaderCache,i=e.get(t);return i===void 0&&(i=new Jc(t),e.set(t,i)),i}},Jc=class{constructor(t){this.id=nx++,this.code=t,this.usedTimes=0}};function sx(n){return n===$n||n===ra||n===aa}function rx(n,t,e,i,s,r){let a=new Ur,o=new $c,l=new Set,c=[],h=new Map,u=i.logarithmicDepthBuffer,d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function f(_){return l.add(_),_===0?"uv":`uv${_}`}function m(_,T,I,R,D,N){let O=R.fog,P=D.geometry,z=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?R.environment:null,V=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,X=t.get(_.envMap||z,V),st=d[_.type],Y=i.precision;_.precision!==null&&(Y=i.getMaxPrecision(_.precision),Y!==_.precision&&Ot("WebGLProgram.getParameters:",_.precision,"not supported, using",Y,"instead."));let tt=P.morphAttributes.position||P.morphAttributes.normal||P.morphAttributes.color,it=tt!==void 0?tt.length:0,Et=0;P.morphAttributes.position!==void 0&&(Et=1),P.morphAttributes.normal!==void 0&&(Et=2),P.morphAttributes.color!==void 0&&(Et=3);let Wt,J,_t,St;if(st){let xt=dn[st];Wt=xt.vertexShader,J=xt.fragmentShader}else{Wt=_.vertexShader,J=_.fragmentShader;let xt=o.getVertexShaderStage(_),fe=o.getFragmentShaderStage(_);o.update(_,xt,fe),_t=xt.id,St=fe.id}let Nt=n.getRenderTarget(),vt=n.state.buffers.depth.getReversed(),qt=D.isInstancedMesh===!0,Fe=D.isBatchedMesh===!0,Ft=!!_.map,de=!!_.matcap,_e=!!X,ee=_e&&X.isPMREMTexture===!0,je=!!_.aoMap,ke=!!_.lightMap,gi=!!_.bumpMap&&_.wireframe===!1,Re=!!_.normalMap,an=!!_.displacementMap,We=!!_.emissiveMap,Li=!!_.metalnessMap,Di=!!_.roughnessMap,Ni=_.anisotropy>0,B=_.clearcoat>0,Ui=_.diffuseRoughness>0,Te=_.dispersion>0,Ee=_.retroreflectivity>0,mt=_.iridescence>0,He=_.sheen>0,Ut=_.transmission>0,Vt=Ni&&!!_.anisotropyMap,C=B&&!!_.clearcoatMap,S=B&&!!_.clearcoatNormalMap,H=B&&!!_.clearcoatRoughnessMap,nt=Ui&&!!_.diffuseRoughnessMap,Q=mt&&!!_.iridescenceMap,ot=mt&&!!_.iridescenceThicknessMap,ft=He&&!!_.sheenColorMap,Z=He&&!!_.sheenRoughnessMap,$=!!_.specularMap,ct=!!_.specularColorMap,L=!!_.specularIntensityMap,K=Ut&&!!_.transmissionMap,q=Ut&&!!_.thicknessMap,ht=!!_.gradientMap,at=!!_.alphaMap,lt=_.alphaTest>0,It=!!_.alphaHash,$t=!!_.extensions,rt=yi;_.toneMapped&&(Nt===null||Nt.isXRRenderTarget===!0)&&(rt=n.toneMapping);let Lt=ee?X.isCompressedCubeTexture?X.image[0].mipmaps:X.mipmaps:null,Zt={shaderID:st,shaderType:_.type,shaderName:_.name,vertexShader:Wt,fragmentShader:J,defines:_.defines,customVertexShaderID:_t,customFragmentShaderID:St,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:Y,batching:Fe,batchingColor:Fe&&D._colorsTexture!==null,instancing:qt,instancingColor:qt&&D.instanceColor!==null,instancingMorph:qt&&D.morphTexture!==null,outputColorSpace:Nt===null?n.outputColorSpace:Nt.isXRRenderTarget===!0?Nt.texture.colorSpace:se.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:Ft,matcap:de,envMap:_e,envMapMode:_e&&X.mapping,envMapPMREM:ee,envMapMaxLod:ee?Lt.length-1:null,envMapSize:ee?Lt[0].width:null,aoMap:je,lightMap:ke,bumpMap:gi,normalMap:Re,displacementMap:an,emissiveMap:We,normalMapObjectSpace:Re&&_.normalMapType===Eu,normalMapTangentSpace:Re&&_.normalMapType===al,packedNormalMap:Re&&_.normalMapType===al&&sx(_.normalMap.format),metalnessMap:Li,roughnessMap:Di,anisotropy:Ni,anisotropyMap:Vt,clearcoat:B,clearcoatMap:C,clearcoatNormalMap:S,clearcoatRoughnessMap:H,diffuseRoughness:Ui,diffuseRoughnessMap:nt,dispersion:Te,retroreflection:Ee,iridescence:mt,iridescenceMap:Q,iridescenceThicknessMap:ot,sheen:He,sheenColorMap:ft,sheenRoughnessMap:Z,specularMap:$,specularColorMap:ct,specularIntensityMap:L,transmission:Ut,transmissionMap:K,thicknessMap:q,gradientMap:ht,opaque:_.transparent===!1&&_.blending===cn&&_.alphaToCoverage===!1,alphaMap:at,alphaTest:lt,alphaHash:It,combine:_.combine,mapUv:Ft&&f(_.map.channel),aoMapUv:je&&f(_.aoMap.channel),lightMapUv:ke&&f(_.lightMap.channel),bumpMapUv:gi&&f(_.bumpMap.channel),normalMapUv:Re&&f(_.normalMap.channel),displacementMapUv:an&&f(_.displacementMap.channel),emissiveMapUv:We&&f(_.emissiveMap.channel),metalnessMapUv:Li&&f(_.metalnessMap.channel),roughnessMapUv:Di&&f(_.roughnessMap.channel),anisotropyMapUv:Vt&&f(_.anisotropyMap.channel),clearcoatMapUv:C&&f(_.clearcoatMap.channel),clearcoatNormalMapUv:S&&f(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:H&&f(_.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:nt&&f(_.diffuseRoughnessMap.channel),iridescenceMapUv:Q&&f(_.iridescenceMap.channel),iridescenceThicknessMapUv:ot&&f(_.iridescenceThicknessMap.channel),sheenColorMapUv:ft&&f(_.sheenColorMap.channel),sheenRoughnessMapUv:Z&&f(_.sheenRoughnessMap.channel),specularMapUv:$&&f(_.specularMap.channel),specularColorMapUv:ct&&f(_.specularColorMap.channel),specularIntensityMapUv:L&&f(_.specularIntensityMap.channel),transmissionMapUv:K&&f(_.transmissionMap.channel),thicknessMapUv:q&&f(_.thicknessMap.channel),alphaMapUv:at&&f(_.alphaMap.channel),vertexTangents:!!P.attributes.tangent&&(Re||Ni),vertexNormals:!!P.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!P.attributes.color&&P.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!P.attributes.uv&&(Ft||at),fog:!!O,useFog:_.fog===!0,fogExp2:!!O&&O.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||P.attributes.normal===void 0&&Re===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:vt,skinning:D.isSkinnedMesh===!0,hasPositionAttribute:P.attributes.position!==void 0,morphTargets:P.morphAttributes.position!==void 0,morphNormals:P.morphAttributes.normal!==void 0,morphColors:P.morphAttributes.color!==void 0,morphTargetsCount:it,morphTextureStride:Et,numSunLights:T.sun.length,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numSunLightShadows:T.sunShadowMap.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numLightProbeGrids:N.filter(xt=>xt.texture!==null).length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:n.shadowMap.enabled&&I.length>0,shadowMapType:n.shadowMap.type,toneMapping:rt,decodeVideoTexture:Ft&&_.map.isVideoTexture===!0&&se.getTransfer(_.map.colorSpace)===ue,decodeVideoTextureEmissive:We&&_.emissiveMap.isVideoTexture===!0&&se.getTransfer(_.emissiveMap.colorSpace)===ue,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===vi,flipSided:_.side===Je,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:$t&&_.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:($t&&_.extensions.multiDraw===!0||Fe)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Zt.vertexUv1s=l.has(1),Zt.vertexUv2s=l.has(2),Zt.vertexUv3s=l.has(3),l.clear(),Zt}function x(_){let T=[];if(_.shaderID?T.push(_.shaderID):(T.push(_.customVertexShaderID),T.push(_.customFragmentShaderID)),_.defines!==void 0)for(let I in _.defines)T.push(I),T.push(_.defines[I]);return _.isRawShaderMaterial===!1&&(p(T,_),g(T,_),T.push(n.outputColorSpace)),T.push(_.customProgramCacheKey),T.join()}function p(_,T){_.push(T.precision),_.push(T.outputColorSpace),_.push(T.envMapMode),_.push(T.envMapPMREM),_.push(T.envMapMaxLod),_.push(T.envMapSize),_.push(T.mapUv),_.push(T.alphaMapUv),_.push(T.lightMapUv),_.push(T.aoMapUv),_.push(T.bumpMapUv),_.push(T.normalMapUv),_.push(T.displacementMapUv),_.push(T.emissiveMapUv),_.push(T.metalnessMapUv),_.push(T.roughnessMapUv),_.push(T.anisotropyMapUv),_.push(T.clearcoatMapUv),_.push(T.clearcoatNormalMapUv),_.push(T.clearcoatRoughnessMapUv),_.push(T.diffuseRoughnessMapUv),_.push(T.iridescenceMapUv),_.push(T.iridescenceThicknessMapUv),_.push(T.sheenColorMapUv),_.push(T.sheenRoughnessMapUv),_.push(T.specularMapUv),_.push(T.specularColorMapUv),_.push(T.specularIntensityMapUv),_.push(T.transmissionMapUv),_.push(T.thicknessMapUv),_.push(T.combine),_.push(T.fogExp2),_.push(T.sizeAttenuation),_.push(T.morphTargetsCount),_.push(T.numSunLights),_.push(T.numDirLights),_.push(T.numPointLights),_.push(T.numSpotLights),_.push(T.numSpotLightMaps),_.push(T.numHemiLights),_.push(T.numRectAreaLights),_.push(T.numSunLightShadows),_.push(T.numDirLightShadows),_.push(T.numPointLightShadows),_.push(T.numSpotLightShadows),_.push(T.numSpotLightShadowsWithMaps),_.push(T.numLightProbes),_.push(T.numLightProbeGrids),_.push(T.shadowMapType),_.push(T.toneMapping),_.push(T.numClippingPlanes),_.push(T.numClipIntersection),_.push(T.depthPacking)}function g(_,T){a.disableAll(),T.instancing&&a.enable(0),T.instancingColor&&a.enable(1),T.instancingMorph&&a.enable(2),T.matcap&&a.enable(3),T.envMap&&a.enable(4),T.normalMapObjectSpace&&a.enable(5),T.normalMapTangentSpace&&a.enable(6),T.clearcoat&&a.enable(7),T.iridescence&&a.enable(8),T.alphaTest&&a.enable(9),T.vertexColors&&a.enable(10),T.vertexAlphas&&a.enable(11),T.vertexUv1s&&a.enable(12),T.vertexUv2s&&a.enable(13),T.vertexUv3s&&a.enable(14),T.vertexTangents&&a.enable(15),T.anisotropy&&a.enable(16),T.alphaHash&&a.enable(17),T.batching&&a.enable(18),T.dispersion&&a.enable(19),T.retroreflection&&a.enable(24),T.diffuseRoughness&&a.enable(25),T.batchingColor&&a.enable(20),T.gradientMap&&a.enable(21),T.packedNormalMap&&a.enable(22),T.vertexNormals&&a.enable(23),_.push(a.mask),a.disableAll(),T.fog&&a.enable(0),T.useFog&&a.enable(1),T.flatShading&&a.enable(2),T.logarithmicDepthBuffer&&a.enable(3),T.reversedDepthBuffer&&a.enable(4),T.skinning&&a.enable(5),T.morphTargets&&a.enable(6),T.morphNormals&&a.enable(7),T.morphColors&&a.enable(8),T.premultipliedAlpha&&a.enable(9),T.shadowMapEnabled&&a.enable(10),T.doubleSided&&a.enable(11),T.flipSided&&a.enable(12),T.useDepthPacking&&a.enable(13),T.dithering&&a.enable(14),T.transmission&&a.enable(15),T.sheen&&a.enable(16),T.opaque&&a.enable(17),T.pointsUvs&&a.enable(18),T.decodeVideoTexture&&a.enable(19),T.decodeVideoTextureEmissive&&a.enable(20),T.alphaToCoverage&&a.enable(21),T.numLightProbeGrids>0&&a.enable(22),T.hasPositionAttribute&&a.enable(23),_.push(a.mask)}function v(_){let T=d[_.type],I;if(T){let R=dn[T];I=tn.clone(R.uniforms)}else I=_.uniforms;return I}function w(_,T){let I=h.get(T);return I!==void 0?++I.usedTimes:(I=new ix(n,T,_,s),c.push(I),h.set(T,I)),I}function y(_){if(--_.usedTimes===0){let T=c.indexOf(_);c[T]=c[c.length-1],c.pop(),h.delete(_.cacheKey),_.destroy()}}function E(_){o.remove(_)}function A(){o.dispose()}return{getParameters:m,getProgramCacheKey:x,getUniforms:v,acquireProgram:w,releaseProgram:y,releaseShaderCache:E,programs:c,dispose:A}}function ax(){let n=new WeakMap;function t(a){return n.has(a)}function e(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,l){n.get(a)[o]=l}function r(){n=new WeakMap}return{has:t,get:e,remove:i,update:s,dispose:r}}function ox(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.materialVariant!==t.materialVariant?n.materialVariant-t.materialVariant:n.z!==t.z?n.z-t.z:n.id-t.id}function od(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function ld(){let n=[],t=0,e=[],i=[],s=[];function r(){t=0,e.length=0,i.length=0,s.length=0}function a(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function o(d,f,m,x,p,g){let v=n[t];return v===void 0?(v={id:d.id,object:d,geometry:f,material:m,materialVariant:a(d),groupOrder:x,renderOrder:d.renderOrder,z:p,group:g},n[t]=v):(v.id=d.id,v.object=d,v.geometry=f,v.material=m,v.materialVariant=a(d),v.groupOrder=x,v.renderOrder=d.renderOrder,v.z=p,v.group=g),t++,v}function l(d,f,m,x,p,g,v){v.reversedDepth===!0&&(p=-p);let w=o(d,f,m,x,p,g);m.transmission>0?i.push(w):m.transparent===!0?s.push(w):e.push(w)}function c(d,f,m,x,p,g){let v=o(d,f,m,x,p,g);m.transmission>0?i.unshift(v):m.transparent===!0?s.unshift(v):e.unshift(v)}function h(d,f){e.length>1&&e.sort(d||ox),i.length>1&&i.sort(f||od),s.length>1&&s.sort(f||od)}function u(){for(let d=t,f=n.length;d<f;d++){let m=n[d];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:e,transmissive:i,transparent:s,init:r,push:l,unshift:c,finish:u,sort:h}}function lx(){let n=new WeakMap;function t(i,s){let r=n.get(i),a;return r===void 0?(a=new ld,n.set(i,[a])):s>=r.length?(a=new ld,r.push(a)):a=r[s],a}function e(){n=new WeakMap}return{get:t,dispose:e}}function cx(){let n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new F,color:new Dt};break;case"SpotLight":e={position:new F,direction:new F,color:new Dt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new F,color:new Dt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new F,skyColor:new Dt,groundColor:new Dt};break;case"RectAreaLight":e={color:new Dt,position:new F,halfWidth:new F,halfHeight:new F};break}return n[t.id]=e,e}}}function hx(){let n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Pt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Pt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Pt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}var ux=0;function dx(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function fx(n){let t=new cx,e=hx(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new F);let s=new F,r=new pe,a=new pe;function o(c){let h=0,u=0,d=0;for(let N=0;N<9;N++)i.probe[N].set(0,0,0);let f=0,m=0,x=0,p=0,g=0,v=0,w=0,y=0,E=0,A=0,_=0,T=0,I=0,R=0;c.sort(dx);for(let N=0,O=c.length;N<O;N++){let P=c[N],z=P.color,V=P.intensity,X=P.distance,st=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===$n?st=P.shadow.map.texture:st=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)h+=z.r*V,u+=z.g*V,d+=z.b*V;else if(P.isLightProbe){for(let Y=0;Y<9;Y++)i.probe[Y].addScaledVector(P.sh.coefficients[Y],V);R++}else if(P.isSunLight){let Y=t.get(P);if(Y.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let tt=P.shadow,it=e.get(P);it.shadowIntensity=tt.intensity,it.shadowBias=tt.bias,it.shadowNormalBias=tt.normalBias,it.shadowRadius=tt.radius,it.shadowMapSize.copy(tt.mapSize).multiply(tt.getFrameExtents()),i.sunShadow[m]=it,i.sunShadowMap[m]=st;let Et=tt.getViewportCount();for(let Wt=0;Wt<Et;Wt++)i.sunShadowMatrix[x+Wt]=tt.getMatrix(Wt),i.sunShadowCascade[x+Wt]=tt._cascadeData[Wt];x+=Et,m++}i.sun[f]=Y,f++}else if(P.isDirectionalLight){let Y=t.get(P);if(Y.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let tt=P.shadow,it=e.get(P);it.shadowIntensity=tt.intensity,it.shadowBias=tt.bias,it.shadowNormalBias=tt.normalBias,it.shadowRadius=tt.radius,it.shadowMapSize=tt.mapSize,i.directionalShadow[p]=it,i.directionalShadowMap[p]=st,i.directionalShadowMatrix[p]=P.shadow.matrix,E++}i.directional[p]=Y,p++}else if(P.isSpotLight){let Y=t.get(P);Y.position.setFromMatrixPosition(P.matrixWorld),Y.color.copy(z).multiplyScalar(V),Y.distance=X,Y.coneCos=Math.cos(P.angle),Y.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),Y.decay=P.decay,i.spot[v]=Y;let tt=P.shadow;if(P.map&&(i.spotLightMap[T]=P.map,T++,tt.updateMatrices(P),P.castShadow&&I++),i.spotLightMatrix[v]=tt.matrix,P.castShadow){let it=e.get(P);it.shadowIntensity=tt.intensity,it.shadowBias=tt.bias,it.shadowNormalBias=tt.normalBias,it.shadowRadius=tt.radius,it.shadowMapSize=tt.mapSize,i.spotShadow[v]=it,i.spotShadowMap[v]=st,_++}v++}else if(P.isRectAreaLight){let Y=t.get(P);Y.color.copy(z).multiplyScalar(V),Y.halfWidth.set(P.width*.5,0,0),Y.halfHeight.set(0,P.height*.5,0),i.rectArea[w]=Y,w++}else if(P.isPointLight){let Y=t.get(P);if(Y.color.copy(P.color).multiplyScalar(P.intensity),Y.distance=P.distance,Y.decay=P.decay,P.castShadow){let tt=P.shadow,it=e.get(P);it.shadowIntensity=tt.intensity,it.shadowBias=tt.bias,it.shadowNormalBias=tt.normalBias,it.shadowRadius=tt.radius,it.shadowMapSize=tt.mapSize,it.shadowCameraNear=tt.camera.near,it.shadowCameraFar=tt.camera.far,i.pointShadow[g]=it,i.pointShadowMap[g]=st,i.pointShadowMatrix[g]=P.shadow.matrix,A++}i.point[g]=Y,g++}else if(P.isHemisphereLight){let Y=t.get(P);Y.skyColor.copy(P.color).multiplyScalar(V),Y.groundColor.copy(P.groundColor).multiplyScalar(V),i.hemi[y]=Y,y++}}w>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=gt.LTC_FLOAT_1,i.rectAreaLTC2=gt.LTC_FLOAT_2):(i.rectAreaLTC1=gt.LTC_HALF_1,i.rectAreaLTC2=gt.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=d;let D=i.hash;(D.sunLength!==f||D.directionalLength!==p||D.pointLength!==g||D.spotLength!==v||D.rectAreaLength!==w||D.hemiLength!==y||D.numSunShadows!==m||D.numDirectionalShadows!==E||D.numPointShadows!==A||D.numSpotShadows!==_||D.numSpotMaps!==T||D.numLightProbes!==R)&&(i.sun.length=f,i.directional.length=p,i.spot.length=v,i.rectArea.length=w,i.point.length=g,i.hemi.length=y,i.sunShadow.length=m,i.sunShadowMap.length=m,i.sunShadowMatrix.length=x,i.sunShadowCascade.length=x,i.directionalShadow.length=E,i.directionalShadowMap.length=E,i.directionalShadowMatrix.length=E,i.pointShadow.length=A,i.pointShadowMap.length=A,i.pointShadowMatrix.length=A,i.spotShadow.length=_,i.spotShadowMap.length=_,i.spotLightMatrix.length=_+T-I,i.spotLightMap.length=T,i.numSpotLightShadowsWithMaps=I,i.numLightProbes=R,D.sunLength=f,D.directionalLength=p,D.pointLength=g,D.spotLength=v,D.rectAreaLength=w,D.hemiLength=y,D.numSunShadows=m,D.numDirectionalShadows=E,D.numPointShadows=A,D.numSpotShadows=_,D.numSpotMaps=T,D.numLightProbes=R,i.version=ux++)}function l(c,h){let u=0,d=0,f=0,m=0,x=0,p=0,g=h.matrixWorldInverse;for(let v=0,w=c.length;v<w;v++){let y=c[v];if(y.isSunLight){let E=i.sun[u];E.direction.setFromMatrixPosition(y.matrixWorld),E.direction.transformDirection(g),u++}else if(y.isDirectionalLight){let E=i.directional[d];E.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),E.direction.sub(s),E.direction.transformDirection(g),d++}else if(y.isSpotLight){let E=i.spot[m];E.position.setFromMatrixPosition(y.matrixWorld),E.position.applyMatrix4(g),E.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),E.direction.sub(s),E.direction.transformDirection(g),m++}else if(y.isRectAreaLight){let E=i.rectArea[x];E.position.setFromMatrixPosition(y.matrixWorld),E.position.applyMatrix4(g),a.identity(),r.copy(y.matrixWorld),r.premultiply(g),a.extractRotation(r),E.halfWidth.set(y.width*.5,0,0),E.halfHeight.set(0,y.height*.5,0),E.halfWidth.applyMatrix4(a),E.halfHeight.applyMatrix4(a),x++}else if(y.isPointLight){let E=i.point[f];E.position.setFromMatrixPosition(y.matrixWorld),E.position.applyMatrix4(g),f++}else if(y.isHemisphereLight){let E=i.hemi[p];E.direction.setFromMatrixPosition(y.matrixWorld),E.direction.transformDirection(g),p++}}}return{setup:o,setupView:l,state:i}}function cd(n){let t=new fx(n),e=[],i=[],s=[];function r(u){h.camera=u,e.length=0,i.length=0,s.length=0}function a(u){u.isLightProbeGrid?s.push(u):e.push(u)}function o(u){i.push(u)}function l(){t.setup(e),s.sort((u,d)=>u.priority-d.priority||u.id-d.id)}function c(u){t.setupView(e,u)}let h={lightsArray:e,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:h,setupLights:l,setupLightsView:c,pushLight:a,pushShadow:o}}function px(n){let t=new WeakMap;function e(s,r=0){let a=t.get(s),o;return a===void 0?(o=new cd(n),t.set(s,[o])):r>=a.length?(o=new cd(n),a.push(o)):o=a[r],o}function i(){t=new WeakMap}return{get:e,dispose:i}}var mx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,gx=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,xx=[new F(1,0,0),new F(-1,0,0),new F(0,1,0),new F(0,-1,0),new F(0,0,1),new F(0,0,-1)],_x=[new F(0,-1,0),new F(0,-1,0),new F(0,0,1),new F(0,0,-1),new F(0,-1,0),new F(0,-1,0)],hd=new pe,oa=new F,Wc=new F;function vx(n,t,e){let i=new Hn,s=new Pt,r=new Pt,a=new ye,o=new lo,l=new co,c={},h=e.maxTextureSize,u={[Zn]:Je,[Je]:Zn,[vi]:vi},d=new ge({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Pt},radius:{value:4}},vertexShader:mx,fragmentShader:gx}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let m=new $e;m.setAttribute("position",new xi(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new Qt(m,d),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ms;let g=this.type;this.render=function(A,_,T){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||A.length===0)return;this.type===nu&&(Ot("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=ms);let I=n.getRenderTarget(),R=n.getActiveCubeFace(),D=n.getActiveMipmapLevel(),N=n.state;N.setBlending(An),N.buffers.depth.getReversed()===!0?N.buffers.color.setClear(0,0,0,0):N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);let O=g!==this.type;O&&_.traverse(function(P){P.material&&(Array.isArray(P.material)?P.material.forEach(z=>z.needsUpdate=!0):P.material.needsUpdate=!0)});for(let P=0,z=A.length;P<z;P++){let V=A[P],X=V.shadow;if(X===void 0){Ot("WebGLShadowMap:",V,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;s.copy(X.mapSize);let st=X.getFrameExtents();s.multiply(st),r.copy(X.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/st.x),s.x=r.x*st.x,X.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/st.y),s.y=r.y*st.y,X.mapSize.y=r.y));let Y=n.state.buffers.depth.getReversed();if(X.camera._reversedDepth=Y,X.map===null||O===!0){if(X.map!==null&&(X.map.depthTexture!==null&&(X.map.depthTexture.dispose(),X.map.depthTexture=null),X.map.dispose()),this.type===er){if(V.isPointLight){Ot("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}X.map=new Pe(s.x,s.y,{format:$n,type:Ie,minFilter:Ue,magFilter:Ue,generateMipmaps:!1}),X.map.texture.name=V.name+".shadowMap",X.map.depthTexture=new En(s.x,s.y,Ci),X.map.depthTexture.name=V.name+".shadowMapDepth",X.map.depthTexture.format=Sn,X.map.depthTexture.compareFunction=null,X.map.depthTexture.minFilter=Ze,X.map.depthTexture.magFilter=Ze}else V.isPointLight?(X.map=new Ms(s.x),X.map.depthTexture=new Gr(s.x,Qi)):(X.map=new Pe(s.x,s.y),X.map.depthTexture=new En(s.x,s.y,Qi)),X.map.depthTexture.name=V.name+".shadowMap",X.map.depthTexture.format=Sn,this.type===ms?(X.map.depthTexture.compareFunction=Y?Nc:Dc,X.map.depthTexture.minFilter=Ue,X.map.depthTexture.magFilter=Ue):(X.map.depthTexture.compareFunction=null,X.map.depthTexture.minFilter=Ze,X.map.depthTexture.magFilter=Ze);X.camera.updateProjectionMatrix()}X.map.isWebGLCubeRenderTarget!==!0&&(X.map.width!==s.x||X.map.height!==s.y)&&X.map.setSize(s.x,s.y);let tt=X.map.isWebGLCubeRenderTarget?6:X.getViewportCount();V.isPointLight!==!0&&X.updateMatrices(V,T);let it=(X.camera.layers.mask&4294967294)!==0?X.camera.layers:T.layers;for(let Et=0;Et<tt;Et++){let Wt=X.getCamera(Et);if(V.isPointLight){let J=X.camera,_t=X.matrix,St=V.distance||J.far;St!==J.far&&(J.far=St,J.updateProjectionMatrix()),oa.setFromMatrixPosition(V.matrixWorld),J.position.copy(oa),Wc.copy(J.position),Wc.add(xx[Et]),J.up.copy(_x[Et]),J.lookAt(Wc),J.updateMatrixWorld(),_t.makeTranslation(-oa.x,-oa.y,-oa.z),hd.multiplyMatrices(J.projectionMatrix,J.matrixWorldInverse),X._frustum.setFromProjectionMatrix(hd,J.coordinateSystem,J.reversedDepth)}if(X.map.isWebGLCubeRenderTarget)n.setRenderTarget(X.map,Et),n.clear();else{Et===0&&(n.setRenderTarget(X.map),n.clear());let J=X.getViewport(Et);a.set(r.x*J.x,r.y*J.y,r.x*J.z,r.y*J.w),N.viewport(a)}i=X.getFrustum(Et),y(_,T,Wt,V,it,this.type)}X.isPointLightShadow!==!0&&this.type===er&&v(X,T),X.needsUpdate=!1}g=this.type,p.needsUpdate=!1,n.setRenderTarget(I,R,D)};function v(A,_){let T=t.update(x);d.defines.VSM_SAMPLES!==A.blurSamples&&(d.defines.VSM_SAMPLES=A.blurSamples,f.defines.VSM_SAMPLES=A.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),A.mapPass===null?A.mapPass=new Pe(s.x,s.y,{format:$n,type:Ie}):(A.mapPass.width!==A.map.width||A.mapPass.height!==A.map.height)&&A.mapPass.setSize(A.map.width,A.map.height),d.uniforms.shadow_pass.value=A.map.depthTexture,d.uniforms.resolution.value.set(A.map.width,A.map.height),d.uniforms.radius.value=A.radius,n.setRenderTarget(A.mapPass),n.clear(),n.renderBufferDirect(_,null,T,d,x,null),f.uniforms.shadow_pass.value=A.mapPass.texture,f.uniforms.resolution.value.set(A.map.width,A.map.height),f.uniforms.radius.value=A.radius,n.setRenderTarget(A.map),n.clear(),n.renderBufferDirect(_,null,T,f,x,null)}function w(A,_,T,I){let R=null,D=T.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(D!==void 0)R=D;else if(R=T.isPointLight===!0?l:o,n.localClippingEnabled&&_.clipShadows===!0&&Array.isArray(_.clippingPlanes)&&_.clippingPlanes.length!==0||_.displacementMap&&_.displacementScale!==0||_.alphaMap&&_.alphaTest>0||_.map&&_.alphaTest>0||_.alphaToCoverage===!0){let N=R.uuid,O=_.uuid,P=c[N];P===void 0&&(P={},c[N]=P);let z=P[O];z===void 0&&(z=R.clone(),P[O]=z,_.addEventListener("dispose",E)),R=z}if(R.visible=_.visible,R.wireframe=_.wireframe,I===er?R.side=_.shadowSide!==null?_.shadowSide:_.side:R.side=_.shadowSide!==null?_.shadowSide:u[_.side],R.alphaMap=_.alphaMap,R.alphaTest=_.alphaToCoverage===!0?.5:_.alphaTest,R.map=_.map,R.clipShadows=_.clipShadows,R.clippingPlanes=_.clippingPlanes,R.clipIntersection=_.clipIntersection,R.displacementMap=_.displacementMap,R.displacementScale=_.displacementScale,R.displacementBias=_.displacementBias,R.wireframeLinewidth=_.wireframeLinewidth,R.linewidth=_.linewidth,T.isPointLight===!0&&R.isMeshDistanceMaterial===!0){let N=n.properties.get(R);N.light=T}return R}function y(A,_,T,I,R,D){if(A.visible===!1)return;if(A.layers.test(R)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&D===er)&&(!A.frustumCulled||A.intersectsFrustum(i))){A.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,A.matrixWorld);let P=t.update(A),z=A.material;if(Array.isArray(z)){let V=P.groups;for(let X=0,st=V.length;X<st;X++){let Y=V[X],tt=z[Y.materialIndex];if(tt&&tt.visible){let it=w(A,tt,I,D);A.onBeforeShadow(n,A,_,T,P,it,Y),n.renderBufferDirect(T,null,P,it,A,Y),A.onAfterShadow(n,A,_,T,P,it,Y)}}}else if(z.visible){let V=w(A,z,I,D);A.onBeforeShadow(n,A,_,T,P,V,null),n.renderBufferDirect(T,null,P,V,A,null),A.onAfterShadow(n,A,_,T,P,V,null)}}let O=A.children;for(let P=0,z=O.length;P<z;P++)y(O[P],_,T,I,R,D)}function E(A){A.target.removeEventListener("dispose",E);for(let T in c){let I=c[T],R=A.target.uuid;R in I&&(I[R].dispose(),delete I[R])}}}function yx(n,t){function e(){let L=!1,K=new ye,q=null,ht=new ye(0,0,0,0);return{setMask:function(at){q!==at&&!L&&(n.colorMask(at,at,at,at),q=at)},setLocked:function(at){L=at},setClear:function(at,lt,It,$t,rt){rt===!0&&(at*=$t,lt*=$t,It*=$t),K.set(at,lt,It,$t),ht.equals(K)===!1&&(n.clearColor(at,lt,It,$t),ht.copy(K))},reset:function(){L=!1,q=null,ht.set(-1,0,0,0)}}}function i(){let L=!1,K=!1,q=null,ht=null,at=null;return{setReversed:function(lt){if(K!==lt){let It=t.get("EXT_clip_control");lt?It.clipControlEXT(It.LOWER_LEFT_EXT,It.ZERO_TO_ONE_EXT):It.clipControlEXT(It.LOWER_LEFT_EXT,It.NEGATIVE_ONE_TO_ONE_EXT),K=lt;let $t=at;at=null,this.setClear($t)}},getReversed:function(){return K},setTest:function(lt){lt?vt(n.DEPTH_TEST):qt(n.DEPTH_TEST)},setMask:function(lt){q!==lt&&!L&&(n.depthMask(lt),q=lt)},setFunc:function(lt){if(K&&(lt=Fu[lt]),ht!==lt){switch(lt){case qa:n.depthFunc(n.NEVER);break;case Ya:n.depthFunc(n.ALWAYS);break;case Za:n.depthFunc(n.LESS);break;case Xs:n.depthFunc(n.LEQUAL);break;case $a:n.depthFunc(n.EQUAL);break;case Ja:n.depthFunc(n.GEQUAL);break;case Ka:n.depthFunc(n.GREATER);break;case Qa:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}ht=lt}},setLocked:function(lt){L=lt},setClear:function(lt){at!==lt&&(at=lt,K&&(lt=1-lt),n.clearDepth(lt))},reset:function(){L=!1,q=null,ht=null,at=null,K=!1}}}function s(){let L=!1,K=null,q=null,ht=null,at=null,lt=null,It=null,$t=null,rt=null;return{setTest:function(Lt){L||(Lt?vt(n.STENCIL_TEST):qt(n.STENCIL_TEST))},setMask:function(Lt){K!==Lt&&!L&&(n.stencilMask(Lt),K=Lt)},setFunc:function(Lt,Zt,xt){(q!==Lt||ht!==Zt||at!==xt)&&(n.stencilFunc(Lt,Zt,xt),q=Lt,ht=Zt,at=xt)},setOp:function(Lt,Zt,xt){(lt!==Lt||It!==Zt||$t!==xt)&&(n.stencilOp(Lt,Zt,xt),lt=Lt,It=Zt,$t=xt)},setLocked:function(Lt){L=Lt},setClear:function(Lt){rt!==Lt&&(n.clearStencil(Lt),rt=Lt)},reset:function(){L=!1,K=null,q=null,ht=null,at=null,lt=null,It=null,$t=null,rt=null}}}let r=new e,a=new i,o=new s,l={},c=new WeakMap,h={},u={},d={},f=new WeakMap,m=[],x=null,p=!1,g=null,v=null,w=null,y=null,E=null,A=null,_=null,T=new Dt(0,0,0),I=0,R=!1,D=null,N=null,O=null,P=null,z=null,V=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),X=!1,st=0,Y=n.getParameter(n.VERSION);Y.indexOf("WebGL")!==-1?(st=parseFloat(/^WebGL (\d)/.exec(Y)[1]),X=st>=1):Y.indexOf("OpenGL ES")!==-1&&(st=parseFloat(/^OpenGL ES (\d)/.exec(Y)[1]),X=st>=2);let tt=null,it={},Et=n.getParameter(n.SCISSOR_BOX),Wt=n.getParameter(n.VIEWPORT),J=new ye().fromArray(Et),_t=new ye().fromArray(Wt);function St(L,K,q,ht){let at=new Uint8Array(4),lt=n.createTexture();n.bindTexture(L,lt),n.texParameteri(L,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(L,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let It=0;It<q;It++)L===n.TEXTURE_3D||L===n.TEXTURE_2D_ARRAY?n.texImage3D(K,0,n.RGBA,1,1,ht,0,n.RGBA,n.UNSIGNED_BYTE,at):n.texImage2D(K+It,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,at);return lt}let Nt={};Nt[n.TEXTURE_2D]=St(n.TEXTURE_2D,n.TEXTURE_2D,1),Nt[n.TEXTURE_CUBE_MAP]=St(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Nt[n.TEXTURE_2D_ARRAY]=St(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Nt[n.TEXTURE_3D]=St(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),vt(n.DEPTH_TEST),a.setFunc(Xs),gi(!1),Re(dc),vt(n.CULL_FACE),je(An);function vt(L){h[L]!==!0&&(n.enable(L),h[L]=!0)}function qt(L){h[L]!==!1&&(n.disable(L),h[L]=!1)}function Fe(L,K){return d[L]!==K?(n.bindFramebuffer(L,K),d[L]=K,L===n.DRAW_FRAMEBUFFER&&(d[n.FRAMEBUFFER]=K),L===n.FRAMEBUFFER&&(d[n.DRAW_FRAMEBUFFER]=K),!0):!1}function Ft(L,K){let q=m,ht=!1;if(L){q=f.get(K),q===void 0&&(q=[],f.set(K,q));let at=L.textures;if(q.length!==at.length||q[0]!==n.COLOR_ATTACHMENT0){for(let lt=0,It=at.length;lt<It;lt++)q[lt]=n.COLOR_ATTACHMENT0+lt;q.length=at.length,ht=!0}}else q[0]!==n.BACK&&(q[0]=n.BACK,ht=!0);ht&&n.drawBuffers(q)}function de(L){return x!==L?(n.useProgram(L),x=L,!0):!1}let _e={[gs]:n.FUNC_ADD,[ru]:n.FUNC_SUBTRACT,[au]:n.FUNC_REVERSE_SUBTRACT};_e[ou]=n.MIN,_e[lu]=n.MAX;let ee={[cu]:n.ZERO,[hu]:n.ONE,[uu]:n.SRC_COLOR,[mc]:n.SRC_ALPHA,[xu]:n.SRC_ALPHA_SATURATE,[mu]:n.DST_COLOR,[fu]:n.DST_ALPHA,[du]:n.ONE_MINUS_SRC_COLOR,[gc]:n.ONE_MINUS_SRC_ALPHA,[gu]:n.ONE_MINUS_DST_COLOR,[pu]:n.ONE_MINUS_DST_ALPHA,[_u]:n.CONSTANT_COLOR,[vu]:n.ONE_MINUS_CONSTANT_COLOR,[yu]:n.CONSTANT_ALPHA,[Mu]:n.ONE_MINUS_CONSTANT_ALPHA};function je(L,K,q,ht,at,lt,It,$t,rt,Lt){if(L===An){p===!0&&(qt(n.BLEND),p=!1);return}if(p===!1&&(vt(n.BLEND),p=!0),L!==su){if(L!==g||Lt!==R){if((v!==gs||E!==gs)&&(n.blendEquation(n.FUNC_ADD),v=gs,E=gs),Lt)switch(L){case cn:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case hn:n.blendFunc(n.ONE,n.ONE);break;case fc:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case pc:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:Bt("WebGLState: Invalid blending: ",L);break}else switch(L){case cn:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case hn:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case fc:Bt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case pc:Bt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Bt("WebGLState: Invalid blending: ",L);break}w=null,y=null,A=null,_=null,T.set(0,0,0),I=0,g=L,R=Lt}return}at=at||K,lt=lt||q,It=It||ht,(K!==v||at!==E)&&(n.blendEquationSeparate(_e[K],_e[at]),v=K,E=at),(q!==w||ht!==y||lt!==A||It!==_)&&(n.blendFuncSeparate(ee[q],ee[ht],ee[lt],ee[It]),w=q,y=ht,A=lt,_=It),($t.equals(T)===!1||rt!==I)&&(n.blendColor($t.r,$t.g,$t.b,rt),T.copy($t),I=rt),g=L,R=!1}function ke(L,K){L.side===vi?qt(n.CULL_FACE):vt(n.CULL_FACE);let q=L.side===Je;K&&(q=!q),gi(q),L.blending===cn&&L.transparent===!1?je(An):je(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),a.setFunc(L.depthFunc),a.setTest(L.depthTest),a.setMask(L.depthWrite),r.setMask(L.colorWrite);let ht=L.stencilWrite;o.setTest(ht),ht&&(o.setMask(L.stencilWriteMask),o.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),o.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),We(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?vt(n.SAMPLE_ALPHA_TO_COVERAGE):qt(n.SAMPLE_ALPHA_TO_COVERAGE)}function gi(L){D!==L&&(L?n.frontFace(n.CW):n.frontFace(n.CCW),D=L)}function Re(L){L!==eu?(vt(n.CULL_FACE),L!==N&&(L===dc?n.cullFace(n.BACK):L===iu?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):qt(n.CULL_FACE),N=L}function an(L){L!==O&&(X&&n.lineWidth(L),O=L)}function We(L,K,q){L?(vt(n.POLYGON_OFFSET_FILL),(P!==K||z!==q)&&(P=K,z=q,a.getReversed()&&(K=-K,q=-q),n.polygonOffset(K,q))):qt(n.POLYGON_OFFSET_FILL)}function Li(L){L?vt(n.SCISSOR_TEST):qt(n.SCISSOR_TEST)}function Di(L){L===void 0&&(L=n.TEXTURE0+V-1),tt!==L&&(n.activeTexture(L),tt=L)}function Ni(L,K,q){q===void 0&&(tt===null?q=n.TEXTURE0+V-1:q=tt);let ht=it[q];ht===void 0&&(ht={type:void 0,texture:void 0},it[q]=ht),(ht.type!==L||ht.texture!==K)&&(tt!==q&&(n.activeTexture(q),tt=q),n.bindTexture(L,K||Nt[L]),ht.type=L,ht.texture=K)}function B(){let L=it[tt];L!==void 0&&L.type!==void 0&&(n.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function Ui(){try{n.compressedTexImage2D(...arguments)}catch(L){Bt("WebGLState:",L)}}function Te(){try{n.compressedTexImage3D(...arguments)}catch(L){Bt("WebGLState:",L)}}function Ee(){try{n.texSubImage2D(...arguments)}catch(L){Bt("WebGLState:",L)}}function mt(){try{n.texSubImage3D(...arguments)}catch(L){Bt("WebGLState:",L)}}function He(){try{n.compressedTexSubImage2D(...arguments)}catch(L){Bt("WebGLState:",L)}}function Ut(){try{n.compressedTexSubImage3D(...arguments)}catch(L){Bt("WebGLState:",L)}}function Vt(){try{n.texStorage2D(...arguments)}catch(L){Bt("WebGLState:",L)}}function C(){try{n.texStorage3D(...arguments)}catch(L){Bt("WebGLState:",L)}}function S(){try{n.texImage2D(...arguments)}catch(L){Bt("WebGLState:",L)}}function H(){try{n.texImage3D(...arguments)}catch(L){Bt("WebGLState:",L)}}function nt(L){return u[L]!==void 0?u[L]:n.getParameter(L)}function Q(L,K){u[L]!==K&&(n.pixelStorei(L,K),u[L]=K)}function ot(L){J.equals(L)===!1&&(n.scissor(L.x,L.y,L.z,L.w),J.copy(L))}function ft(L){_t.equals(L)===!1&&(n.viewport(L.x,L.y,L.z,L.w),_t.copy(L))}function Z(L,K){let q=c.get(K);q===void 0&&(q=new WeakMap,c.set(K,q));let ht=q.get(L);ht===void 0&&(ht=n.getUniformBlockIndex(K,L.name),n.uniformBlockBinding(K,ht,ht),q.set(L,ht))}function $(L,K,q){let at=c.get(K).get(L);l[at]!==q&&(n.bindBufferBase(n.UNIFORM_BUFFER,at,q),l[at]=q)}function ct(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),h={},u={},tt=null,it={},d={},l={},f=new WeakMap,m=[],x=null,p=!1,g=null,v=null,w=null,y=null,E=null,A=null,_=null,T=new Dt(0,0,0),I=0,R=!1,D=null,N=null,O=null,P=null,z=null,J.set(0,0,n.canvas.width,n.canvas.height),_t.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:vt,disable:qt,bindFramebuffer:Fe,drawBuffers:Ft,useProgram:de,setBlending:je,setMaterial:ke,setFlipSided:gi,setCullFace:Re,setLineWidth:an,setPolygonOffset:We,setScissorTest:Li,activeTexture:Di,bindTexture:Ni,unbindTexture:B,compressedTexImage2D:Ui,compressedTexImage3D:Te,texImage2D:S,texImage3D:H,pixelStorei:Q,getParameter:nt,updateUBOMapping:Z,uniformBlockBinding:$,texStorage2D:Vt,texStorage3D:C,texSubImage2D:Ee,texSubImage3D:mt,compressedTexSubImage2D:He,compressedTexSubImage3D:Ut,scissor:ot,viewport:ft,reset:ct}}function Mx(n,t,e,i,s,r,a){let o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Pt,h=new WeakMap,u=new Set,d,f=new WeakMap,m=new Set,x=new FinalizationRegistry(C=>m.delete(C)),p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(C,S){return p?new OffscreenCanvas(C,S):Lr("canvas")}function v(C,S,H){let nt=1,Q=Vt(C);if((Q.width>H||Q.height>H)&&(nt=H/Math.max(Q.width,Q.height)),nt<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){let ot=Math.floor(nt*Q.width),ft=Math.floor(nt*Q.height);d===void 0&&(d=g(ot,ft));let Z=S?g(ot,ft):d;return Z.width=ot,Z.height=ft,Z.getContext("2d").drawImage(C,0,0,ot,ft),Ot("WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+ot+"x"+ft+")."),Z}else return"data"in C&&Ot("WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),C;return C}function w(C){return C.generateMipmaps}function y(C){n.generateMipmap(C)}function E(C){return C.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?n.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function A(C,S,H,nt,Q,ot=!1){if(C!==null){if(n[C]!==void 0)return n[C];Ot("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let ft;nt&&(ft=t.get("EXT_texture_norm16"),ft||Ot("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Z=S;if(S===n.RED&&(H===n.FLOAT&&(Z=n.R32F),H===n.HALF_FLOAT&&(Z=n.R16F),H===n.UNSIGNED_BYTE&&(Z=n.R8),H===n.UNSIGNED_SHORT&&ft&&(Z=ft.R16_EXT),H===n.SHORT&&ft&&(Z=ft.R16_SNORM_EXT)),S===n.RED_INTEGER&&(H===n.UNSIGNED_BYTE&&(Z=n.R8UI),H===n.UNSIGNED_SHORT&&(Z=n.R16UI),H===n.UNSIGNED_INT&&(Z=n.R32UI),H===n.BYTE&&(Z=n.R8I),H===n.SHORT&&(Z=n.R16I),H===n.INT&&(Z=n.R32I)),S===n.RG&&(H===n.FLOAT&&(Z=n.RG32F),H===n.HALF_FLOAT&&(Z=n.RG16F),H===n.UNSIGNED_BYTE&&(Z=n.RG8),H===n.UNSIGNED_SHORT&&ft&&(Z=ft.RG16_EXT),H===n.SHORT&&ft&&(Z=ft.RG16_SNORM_EXT)),S===n.RG_INTEGER&&(H===n.UNSIGNED_BYTE&&(Z=n.RG8UI),H===n.UNSIGNED_SHORT&&(Z=n.RG16UI),H===n.UNSIGNED_INT&&(Z=n.RG32UI),H===n.BYTE&&(Z=n.RG8I),H===n.SHORT&&(Z=n.RG16I),H===n.INT&&(Z=n.RG32I)),S===n.RGB_INTEGER&&(H===n.UNSIGNED_BYTE&&(Z=n.RGB8UI),H===n.UNSIGNED_SHORT&&(Z=n.RGB16UI),H===n.UNSIGNED_INT&&(Z=n.RGB32UI),H===n.BYTE&&(Z=n.RGB8I),H===n.SHORT&&(Z=n.RGB16I),H===n.INT&&(Z=n.RGB32I)),S===n.RGBA_INTEGER&&(H===n.UNSIGNED_BYTE&&(Z=n.RGBA8UI),H===n.UNSIGNED_SHORT&&(Z=n.RGBA16UI),H===n.UNSIGNED_INT&&(Z=n.RGBA32UI),H===n.BYTE&&(Z=n.RGBA8I),H===n.SHORT&&(Z=n.RGBA16I),H===n.INT&&(Z=n.RGBA32I)),S===n.RGB&&(H===n.UNSIGNED_SHORT&&ft&&(Z=ft.RGB16_EXT),H===n.SHORT&&ft&&(Z=ft.RGB16_SNORM_EXT),H===n.UNSIGNED_INT_5_9_9_9_REV&&(Z=n.RGB9_E5),H===n.UNSIGNED_INT_10F_11F_11F_REV&&(Z=n.R11F_G11F_B10F)),S===n.RGBA){let $=ot?Ir:se.getTransfer(Q);H===n.FLOAT&&(Z=n.RGBA32F),H===n.HALF_FLOAT&&(Z=n.RGBA16F),H===n.UNSIGNED_BYTE&&(Z=$===ue?n.SRGB8_ALPHA8:n.RGBA8),H===n.UNSIGNED_SHORT&&ft&&(Z=ft.RGBA16_EXT),H===n.SHORT&&ft&&(Z=ft.RGBA16_SNORM_EXT),H===n.UNSIGNED_SHORT_4_4_4_4&&(Z=n.RGBA4),H===n.UNSIGNED_SHORT_5_5_5_1&&(Z=n.RGB5_A1)}return(Z===n.R16F||Z===n.R32F||Z===n.RG16F||Z===n.RG32F||Z===n.RGBA16F||Z===n.RGBA32F)&&t.get("EXT_color_buffer_float"),Z}function _(C,S){let H;return C?S===null||S===Qi||S===_s?H=n.DEPTH24_STENCIL8:S===Ci?H=n.DEPTH32F_STENCIL8:S===sr&&(H=n.DEPTH24_STENCIL8,Ot("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===Qi||S===_s?H=n.DEPTH_COMPONENT24:S===Ci?H=n.DEPTH_COMPONENT32F:S===sr&&(H=n.DEPTH_COMPONENT16),H}function T(C,S){return w(C)===!0||C.isFramebufferTexture&&C.minFilter!==Ze&&C.minFilter!==Ue?Math.log2(Math.max(S.width,S.height))+1:C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?S.mipmaps.length:1}function I(C){let S=new WeakRef(C);i.get(C).__ref=S,m.add(S),x.register(C,S,S)}function R(C){let S=i.get(C).__ref;S!==void 0&&(m.delete(S),x.unregister(S))}function D(C){O(C.target)}function N(C){P(C.target)}function O(C){C.removeEventListener("dispose",D),R(C),V(C),C.isVideoTexture&&h.delete(C),C.isHTMLTexture&&u.delete(C)}function P(C){C.removeEventListener("dispose",N),R(C),st(C)}function z(){for(let C of m){let S=C.deref();S!==void 0&&(S.isRenderTarget===!0?P(S):O(S))}m.clear(),u.clear()}function V(C){let S=i.get(C);if(S.__webglInit===void 0)return;let H=C.source,nt=f.get(H);if(nt){let Q=nt[S.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&X(C),Object.keys(nt).length===0&&f.delete(H)}i.remove(C)}function X(C){let S=i.get(C);n.deleteTexture(S.__webglTexture);let H=C.source,nt=f.get(H);delete nt[S.__cacheKey],a.memory.textures--}function st(C){let S=i.get(C);S.__depthDisposeCallback&&S.__depthDisposeCallback();let H=C.depthTexture;if(H&&H.renderTarget===C&&O(H),C.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(S.__webglFramebuffer[Q]))for(let ot=0;ot<S.__webglFramebuffer[Q].length;ot++)n.deleteFramebuffer(S.__webglFramebuffer[Q][ot]);else n.deleteFramebuffer(S.__webglFramebuffer[Q]);S.__webglDepthbuffer&&n.deleteRenderbuffer(S.__webglDepthbuffer[Q])}else{if(Array.isArray(S.__webglFramebuffer))for(let Q=0;Q<S.__webglFramebuffer.length;Q++)n.deleteFramebuffer(S.__webglFramebuffer[Q]);else n.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&n.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&n.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let Q=0;Q<S.__webglColorRenderbuffer.length;Q++)S.__webglColorRenderbuffer[Q]&&n.deleteRenderbuffer(S.__webglColorRenderbuffer[Q]);S.__webglDepthRenderbuffer&&n.deleteRenderbuffer(S.__webglDepthRenderbuffer)}let nt=C.textures;for(let Q=0,ot=nt.length;Q<ot;Q++){let ft=i.get(nt[Q]);ft.__webglTexture&&(n.deleteTexture(ft.__webglTexture),a.memory.textures--),i.remove(nt[Q])}i.remove(C)}let Y=0;function tt(){Y=0}function it(){return Y}function Et(C){Y=C}function Wt(){let C=Y;return C>=s.maxTextures&&Ot("WebGLTextures: Trying to use "+(C+1)+" texture units while this GPU supports only "+s.maxTextures),Y+=1,C}function J(C){let S=[];return S.push(C.wrapS),S.push(C.wrapT),S.push(C.wrapR||0),S.push(C.magFilter),S.push(C.minFilter),S.push(C.anisotropy),S.push(C.internalFormat),S.push(C.format),S.push(C.type),S.push(C.generateMipmaps),S.push(C.mipmapsAutoUpdate),S.push(C.premultiplyAlpha),S.push(C.flipY),S.push(C.unpackAlignment),S.push(C.colorSpace),S.join()}function _t(C,S){let H=i.get(C);if(C.isVideoTexture&&He(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&H.__version!==C.version){let nt=C.image;if(nt===null)Ot("WebGLRenderer: Texture marked for update but no image data found.");else if(nt.complete===!1)Ot("WebGLRenderer: Texture marked for update but image is incomplete");else{ke(H,C,S);return}}else C.isExternalTexture&&(H.__webglTexture=C.sourceTexture?C.sourceTexture:null);e.bindTexture(n.TEXTURE_2D,H.__webglTexture,n.TEXTURE0+S)}function St(C,S){let H=i.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&H.__version!==C.version){ke(H,C,S);return}else C.isExternalTexture&&(H.__webglTexture=C.sourceTexture?C.sourceTexture:null);e.bindTexture(n.TEXTURE_2D_ARRAY,H.__webglTexture,n.TEXTURE0+S)}function Nt(C,S){let H=i.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&H.__version!==C.version){ke(H,C,S);return}e.bindTexture(n.TEXTURE_3D,H.__webglTexture,n.TEXTURE0+S)}function vt(C,S){let H=i.get(C);if(C.version>0&&H.__version!==C.version){gi(H,C,S);return}e.bindTexture(n.TEXTURE_CUBE_MAP,H.__webglTexture,n.TEXTURE0+S)}let qt={[qs]:n.REPEAT,[Oi]:n.CLAMP_TO_EDGE,[ja]:n.MIRRORED_REPEAT},Fe={[Ze]:n.NEAREST,[wu]:n.NEAREST_MIPMAP_NEAREST,[ta]:n.NEAREST_MIPMAP_LINEAR,[Ue]:n.LINEAR,[bo]:n.LINEAR_MIPMAP_NEAREST,[Ri]:n.LINEAR_MIPMAP_LINEAR},Ft={[Ru]:n.NEVER,[Uc]:n.ALWAYS,[Cu]:n.LESS,[Dc]:n.LEQUAL,[Pu]:n.EQUAL,[Nc]:n.GEQUAL,[Iu]:n.GREATER,[Lu]:n.NOTEQUAL};function de(C,S){if(S.type===Ci&&t.has("OES_texture_float_linear")===!1&&(S.magFilter===Ue||S.magFilter===bo||S.magFilter===ta||S.magFilter===Ri||S.minFilter===Ue||S.minFilter===bo||S.minFilter===ta||S.minFilter===Ri)&&Ot("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(C,n.TEXTURE_WRAP_S,qt[S.wrapS]),n.texParameteri(C,n.TEXTURE_WRAP_T,qt[S.wrapT]),(C===n.TEXTURE_3D||C===n.TEXTURE_2D_ARRAY)&&n.texParameteri(C,n.TEXTURE_WRAP_R,qt[S.wrapR]),n.texParameteri(C,n.TEXTURE_MAG_FILTER,Fe[S.magFilter]),n.texParameteri(C,n.TEXTURE_MIN_FILTER,Fe[S.minFilter]),S.compareFunction&&(n.texParameteri(C,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(C,n.TEXTURE_COMPARE_FUNC,Ft[S.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===Ze||S.minFilter!==ta&&S.minFilter!==Ri||S.type===Ci&&t.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||i.get(S).__currentAnisotropy){let H=t.get("EXT_texture_filter_anisotropic");n.texParameterf(C,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,s.getMaxAnisotropy())),i.get(S).__currentAnisotropy=S.anisotropy}}}function _e(C,S){let H=!1;C.__webglInit===void 0&&(C.__webglInit=!0,S.addEventListener("dispose",D),I(S));let nt=S.source,Q=f.get(nt);Q===void 0&&(Q={},f.set(nt,Q));let ot=J(S);if(ot!==C.__cacheKey){Q[ot]===void 0&&(Q[ot]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,H=!0),Q[ot].usedTimes++;let ft=Q[C.__cacheKey];ft!==void 0&&(Q[C.__cacheKey].usedTimes--,ft.usedTimes===0&&X(S)),C.__cacheKey=ot,C.__webglTexture=Q[ot].texture}return H}function ee(C,S,H){return Math.floor(Math.floor(C/H)/S)}function je(C,S,H,nt){let ot=C.updateRanges;if(ot.length===0)e.texSubImage2D(n.TEXTURE_2D,0,0,0,S.width,S.height,H,nt,S.data);else{ot.sort((L,K)=>L.start-K.start);let ft=0;for(let L=1;L<ot.length;L++){let K=ot[ft],q=ot[L],ht=K.start+K.count,at=ee(q.start,S.width,4),lt=ee(K.start,S.width,4);q.start<=ht+1&&at===lt&&ee(q.start+q.count-1,S.width,4)===at?K.count=Math.max(K.count,q.start+q.count-K.start):(++ft,ot[ft]=q)}ot.length=ft+1;let Z=e.getParameter(n.UNPACK_ROW_LENGTH),$=e.getParameter(n.UNPACK_SKIP_PIXELS),ct=e.getParameter(n.UNPACK_SKIP_ROWS);e.pixelStorei(n.UNPACK_ROW_LENGTH,S.width);for(let L=0,K=ot.length;L<K;L++){let q=ot[L],ht=Math.floor(q.start/4),at=Math.ceil(q.count/4),lt=ht%S.width,It=Math.floor(ht/S.width),$t=at,rt=1;e.pixelStorei(n.UNPACK_SKIP_PIXELS,lt),e.pixelStorei(n.UNPACK_SKIP_ROWS,It),e.texSubImage2D(n.TEXTURE_2D,0,lt,It,$t,rt,H,nt,S.data)}C.clearUpdateRanges(),e.pixelStorei(n.UNPACK_ROW_LENGTH,Z),e.pixelStorei(n.UNPACK_SKIP_PIXELS,$),e.pixelStorei(n.UNPACK_SKIP_ROWS,ct)}}function ke(C,S,H){let nt=n.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(nt=n.TEXTURE_2D_ARRAY),S.isData3DTexture&&(nt=n.TEXTURE_3D);let Q=_e(C,S),ot=S.source;e.bindTexture(nt,C.__webglTexture,n.TEXTURE0+H);let ft=i.get(ot);if(ot.version!==ft.__version||Q===!0){if(e.activeTexture(n.TEXTURE0+H),(typeof ImageBitmap<"u"&&S.image instanceof ImageBitmap)===!1){let rt=se.getPrimaries(se.workingColorSpace),Lt=S.colorSpace===ji?null:se.getPrimaries(S.colorSpace),Zt=S.colorSpace===ji||rt===Lt?n.NONE:n.BROWSER_DEFAULT_WEBGL;e.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,S.flipY),e.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),e.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Zt)}e.pixelStorei(n.UNPACK_ALIGNMENT,S.unpackAlignment);let $=v(S.image,!1,s.maxTextureSize);$=Ut(S,$);let ct=r.convert(S.format,S.colorSpace),L=r.convert(S.type),K=A(S.internalFormat,ct,L,S.normalized,S.colorSpace,S.isVideoTexture);de(nt,S);let q,ht=S.mipmaps,at=S.isVideoTexture!==!0,lt=ft.__version===void 0||Q===!0,It=ot.dataReady,$t=T(S,$);if(S.isDepthTexture)K=_(S.format===Rn,S.type),lt&&(at?e.texStorage2D(n.TEXTURE_2D,1,K,$.width,$.height):e.texImage2D(n.TEXTURE_2D,0,K,$.width,$.height,0,ct,L,null));else if(S.isDataTexture)if(ht.length>0){at&&lt&&e.texStorage2D(n.TEXTURE_2D,$t,K,ht[0].width,ht[0].height);for(let rt=0,Lt=ht.length;rt<Lt;rt++)q=ht[rt],at?It&&e.texSubImage2D(n.TEXTURE_2D,rt,0,0,q.width,q.height,ct,L,q.data):e.texImage2D(n.TEXTURE_2D,rt,K,q.width,q.height,0,ct,L,q.data);S.generateMipmaps=!1}else at?(lt&&e.texStorage2D(n.TEXTURE_2D,$t,K,$.width,$.height),It&&je(S,$,ct,L)):e.texImage2D(n.TEXTURE_2D,0,K,$.width,$.height,0,ct,L,$.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){at&&lt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,$t,K,ht[0].width,ht[0].height,$.depth);for(let rt=0,Lt=ht.length;rt<Lt;rt++)if(q=ht[rt],S.format!==pi)if(ct!==null)if(at){if(It)if(S.layerUpdates.size>0){let Zt=Gc(q.width,q.height,S.format,S.type);for(let xt of S.layerUpdates){let fe=q.data.subarray(xt*Zt/q.data.BYTES_PER_ELEMENT,(xt+1)*Zt/q.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,rt,0,0,xt,q.width,q.height,1,ct,fe)}}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,rt,0,0,0,q.width,q.height,$.depth,ct,q.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,rt,K,q.width,q.height,$.depth,0,q.data,0,0);else Ot("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else at?It&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,rt,0,0,0,q.width,q.height,$.depth,ct,L,q.data):e.texImage3D(n.TEXTURE_2D_ARRAY,rt,K,q.width,q.height,$.depth,0,ct,L,q.data);S.layerUpdates.size>0&&S.clearLayerUpdates()}else{at&&lt&&e.texStorage2D(n.TEXTURE_2D,$t,K,ht[0].width,ht[0].height);for(let rt=0,Lt=ht.length;rt<Lt;rt++)q=ht[rt],S.format!==pi?ct!==null?at?It&&e.compressedTexSubImage2D(n.TEXTURE_2D,rt,0,0,q.width,q.height,ct,q.data):e.compressedTexImage2D(n.TEXTURE_2D,rt,K,q.width,q.height,0,q.data):Ot("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):at?It&&e.texSubImage2D(n.TEXTURE_2D,rt,0,0,q.width,q.height,ct,L,q.data):e.texImage2D(n.TEXTURE_2D,rt,K,q.width,q.height,0,ct,L,q.data)}else if(S.isDataArrayTexture)if(at){if(lt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,$t,K,$.width,$.height,$.depth),It)if(S.layerUpdates.size>0){let rt=Gc($.width,$.height,S.format,S.type);for(let Lt of S.layerUpdates){let Zt=$.data.subarray(Lt*rt/$.data.BYTES_PER_ELEMENT,(Lt+1)*rt/$.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,Lt,$.width,$.height,1,ct,L,Zt)}S.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,$.width,$.height,$.depth,ct,L,$.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,K,$.width,$.height,$.depth,0,ct,L,$.data);else if(S.isData3DTexture)at?(lt&&e.texStorage3D(n.TEXTURE_3D,$t,K,$.width,$.height,$.depth),It&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,$.width,$.height,$.depth,ct,L,$.data)):e.texImage3D(n.TEXTURE_3D,0,K,$.width,$.height,$.depth,0,ct,L,$.data);else if(S.isFramebufferTexture){if(lt)if(at)e.texStorage2D(n.TEXTURE_2D,$t,K,$.width,$.height);else{let rt=$.width,Lt=$.height;for(let Zt=0;Zt<$t;Zt++)e.texImage2D(n.TEXTURE_2D,Zt,K,rt,Lt,0,ct,L,null),rt>>=1,Lt>>=1}}else if(S.isHTMLTexture){if("texElementImage2D"in n){let rt=n.canvas;if(rt.hasAttribute("layoutsubtree")||rt.setAttribute("layoutsubtree","true"),$.parentNode!==rt){rt.appendChild($),u.add(S),rt.onpaint=Lt=>{let Zt=Lt.changedElements;for(let xt of u)Zt.includes(xt.image)&&(xt.needsUpdate=!0)},rt.requestPaint();return}if(n.texElementImage2D.length===3)n.texElementImage2D(n.TEXTURE_2D,n.RGBA8,$);else{let Zt=n.RGBA,xt=n.RGBA,fe=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,0,Zt,xt,fe,$)}n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(ht.length>0){if(at&&lt){let rt=Vt(ht[0]);e.texStorage2D(n.TEXTURE_2D,$t,K,rt.width,rt.height)}for(let rt=0,Lt=ht.length;rt<Lt;rt++)q=ht[rt],at?It&&e.texSubImage2D(n.TEXTURE_2D,rt,0,0,ct,L,q):e.texImage2D(n.TEXTURE_2D,rt,K,ct,L,q);S.generateMipmaps=!1}else if(at){if(lt){let rt=Vt($);e.texStorage2D(n.TEXTURE_2D,$t,K,rt.width,rt.height)}It&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,ct,L,$)}else e.texImage2D(n.TEXTURE_2D,0,K,ct,L,$);w(S)&&S.mipmapsAutoUpdate===!0&&y(nt),ft.__version=ot.version,S.onUpdate&&S.onUpdate(S)}C.__version=S.version}function gi(C,S,H){if(S.image.length!==6)return;let nt=_e(C,S),Q=S.source;e.bindTexture(n.TEXTURE_CUBE_MAP,C.__webglTexture,n.TEXTURE0+H);let ot=i.get(Q);if(Q.version!==ot.__version||nt===!0){e.activeTexture(n.TEXTURE0+H);let ft=se.getPrimaries(se.workingColorSpace),Z=S.colorSpace===ji?null:se.getPrimaries(S.colorSpace),$=S.colorSpace===ji||ft===Z?n.NONE:n.BROWSER_DEFAULT_WEBGL;e.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,S.flipY),e.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),e.pixelStorei(n.UNPACK_ALIGNMENT,S.unpackAlignment),e.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,$);let ct=S.isCompressedTexture||S.image[0].isCompressedTexture,L=S.image[0]&&S.image[0].isDataTexture,K=[];for(let xt=0;xt<6;xt++)!ct&&!L?K[xt]=v(S.image[xt],!0,s.maxCubemapSize):K[xt]=L?S.image[xt].image:S.image[xt],K[xt]=Ut(S,K[xt]);let q=K[0],ht=r.convert(S.format,S.colorSpace),at=r.convert(S.type),lt=A(S.internalFormat,ht,at,S.normalized,S.colorSpace),It=S.isVideoTexture!==!0,$t=ot.__version===void 0||nt===!0,rt=Q.dataReady,Lt=T(S,q);de(n.TEXTURE_CUBE_MAP,S);let Zt;if(S.isDepthTexture){if(lt=_(S.format===Rn,S.type),$t)if(It)e.texStorage2D(n.TEXTURE_CUBE_MAP,1,lt,q.width,q.height);else for(let xt=0;xt<6;xt++)e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,0,lt,q.width,q.height,0,ht,at,null)}else if(ct){It&&$t&&e.texStorage2D(n.TEXTURE_CUBE_MAP,Lt,lt,q.width,q.height);for(let xt=0;xt<6;xt++){Zt=K[xt].mipmaps;for(let fe=0;fe<Zt.length;fe++){let Xe=Zt[fe];S.format!==pi?ht!==null?It?rt&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,fe,0,0,Xe.width,Xe.height,ht,Xe.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,fe,lt,Xe.width,Xe.height,0,Xe.data):Ot("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):It?rt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,fe,0,0,Xe.width,Xe.height,ht,at,Xe.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,fe,lt,Xe.width,Xe.height,0,ht,at,Xe.data)}}}else{if(Zt=S.mipmaps,It&&$t){Zt.length>0&&Lt++;let xt=Vt(K[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,Lt,lt,xt.width,xt.height)}for(let xt=0;xt<6;xt++)if(L){It?rt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,0,0,0,K[xt].width,K[xt].height,ht,at,K[xt].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,0,lt,K[xt].width,K[xt].height,0,ht,at,K[xt].data);for(let fe=0;fe<Zt.length;fe++){let Ln=Zt[fe].image[xt].image;It?rt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,fe+1,0,0,Ln.width,Ln.height,ht,at,Ln.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,fe+1,lt,Ln.width,Ln.height,0,ht,at,Ln.data)}}else{It?rt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,0,0,0,ht,at,K[xt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,0,lt,ht,at,K[xt]);for(let fe=0;fe<Zt.length;fe++){let Xe=Zt[fe];It?rt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,fe+1,0,0,ht,at,Xe.image[xt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xt,fe+1,lt,ht,at,Xe.image[xt])}}}w(S)&&S.mipmapsAutoUpdate===!0&&y(n.TEXTURE_CUBE_MAP),ot.__version=Q.version,S.onUpdate&&S.onUpdate(S)}C.__version=S.version}function Re(C,S,H,nt,Q,ot){let ft=r.convert(H.format,H.colorSpace),Z=r.convert(H.type),$=A(H.internalFormat,ft,Z,H.normalized,H.colorSpace),ct=i.get(S),L=i.get(H);if(L.__renderTarget=S,!ct.__hasExternalTextures){let K=Math.max(1,S.width>>ot),q=Math.max(1,S.height>>ot);Q===n.TEXTURE_3D||Q===n.TEXTURE_2D_ARRAY?e.texImage3D(Q,ot,$,K,q,S.depth,0,ft,Z,null):e.texImage2D(Q,ot,$,K,q,0,ft,Z,null)}e.bindFramebuffer(n.FRAMEBUFFER,C),mt(S)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,nt,Q,L.__webglTexture,0,Ee(S)):(Q===n.TEXTURE_2D||Q>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,nt,Q,L.__webglTexture,ot),e.bindFramebuffer(n.FRAMEBUFFER,null)}function an(C,S,H){if(n.bindRenderbuffer(n.RENDERBUFFER,C),S.depthBuffer){let nt=S.depthTexture,Q=nt&&nt.isDepthTexture?nt.type:null,ot=_(S.stencilBuffer,Q),ft=S.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;mt(S)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ee(S),ot,S.width,S.height):H?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ee(S),ot,S.width,S.height):n.renderbufferStorage(n.RENDERBUFFER,ot,S.width,S.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,ft,n.RENDERBUFFER,C)}else{let nt=S.textures;for(let Q=0;Q<nt.length;Q++){let ot=nt[Q],ft=r.convert(ot.format,ot.colorSpace),Z=r.convert(ot.type),$=A(ot.internalFormat,ft,Z,ot.normalized,ot.colorSpace);mt(S)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ee(S),$,S.width,S.height):H?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ee(S),$,S.width,S.height):n.renderbufferStorage(n.RENDERBUFFER,$,S.width,S.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function We(C,S,H){let nt=S.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(n.FRAMEBUFFER,C),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let Q=i.get(S.depthTexture);Q.__renderTarget=S;let ot=nt?S.depthTexture.image[0]:S.depthTexture.image;(!Q.__webglTexture||ot.width!==S.width||ot.height!==S.height)&&(ot.width=S.width,ot.height=S.height,S.depthTexture.needsUpdate=!0),nt?vt(S.depthTexture,0):_t(S.depthTexture,0);let ft=Q.__webglTexture,Z=Ee(S),$=nt?n.TEXTURE_CUBE_MAP_POSITIVE_X+H:n.TEXTURE_2D,ct=S.depthTexture.format===Rn?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(S.depthTexture.format===Sn)mt(S)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ct,$,ft,0,Z):n.framebufferTexture2D(n.FRAMEBUFFER,ct,$,ft,0);else if(S.depthTexture.format===Rn)mt(S)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ct,$,ft,0,Z):n.framebufferTexture2D(n.FRAMEBUFFER,ct,$,ft,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Li(C){let S=i.get(C),H=C.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==C.depthTexture){let nt=C.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),nt){let Q=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,nt.removeEventListener("dispose",Q)};nt.addEventListener("dispose",Q),S.__depthDisposeCallback=Q}S.__boundDepthTexture=nt}if(C.depthTexture&&!S.__autoAllocateDepthBuffer)if(H)for(let nt=0;nt<6;nt++)We(S.__webglFramebuffer[nt],C,nt);else C.texture.mipmaps.length>0?We(S.__webglFramebuffer[0],C,0):We(S.__webglFramebuffer,C,0);else if(H){S.__webglDepthbuffer=[];for(let nt=0;nt<6;nt++)if(e.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer[nt]),S.__webglDepthbuffer[nt]===void 0)S.__webglDepthbuffer[nt]=n.createRenderbuffer(),an(S.__webglDepthbuffer[nt],C,!1);else{let Q=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ot=S.__webglDepthbuffer[nt];n.bindRenderbuffer(n.RENDERBUFFER,ot),n.framebufferRenderbuffer(n.FRAMEBUFFER,Q,n.RENDERBUFFER,ot)}}else if(C.texture.mipmaps.length>0?e.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer[0]):e.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=n.createRenderbuffer(),an(S.__webglDepthbuffer,C,!1);else{let Q=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ot=S.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ot),n.framebufferRenderbuffer(n.FRAMEBUFFER,Q,n.RENDERBUFFER,ot)}e.bindFramebuffer(n.FRAMEBUFFER,null)}function Di(C,S,H){let nt=i.get(C);S!==void 0&&Re(nt.__webglFramebuffer,C,C.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),H!==void 0&&Li(C)}function Ni(C){let S=C.texture,H=i.get(C),nt=i.get(S);C.addEventListener("dispose",N),I(C);let Q=C.textures,ot=C.isWebGLCubeRenderTarget===!0,ft=Q.length>1;if(ft||(nt.__webglTexture===void 0&&(nt.__webglTexture=n.createTexture()),nt.__version=S.version,a.memory.textures++),ot){H.__webglFramebuffer=[];for(let Z=0;Z<6;Z++)if(S.mipmaps.length>0){H.__webglFramebuffer[Z]=[];for(let $=0;$<S.mipmaps.length;$++)H.__webglFramebuffer[Z][$]=n.createFramebuffer()}else H.__webglFramebuffer[Z]=n.createFramebuffer()}else{if(S.mipmaps.length>0){H.__webglFramebuffer=[];for(let Z=0;Z<S.mipmaps.length;Z++)H.__webglFramebuffer[Z]=n.createFramebuffer()}else H.__webglFramebuffer=n.createFramebuffer();if(ft)for(let Z=0,$=Q.length;Z<$;Z++){let ct=i.get(Q[Z]);ct.__webglTexture===void 0&&(ct.__webglTexture=n.createTexture(),a.memory.textures++)}if(C.samples>0&&mt(C)===!1){H.__webglMultisampledFramebuffer=n.createFramebuffer(),H.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let Z=0;Z<Q.length;Z++){let $=Q[Z];H.__webglColorRenderbuffer[Z]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,H.__webglColorRenderbuffer[Z]);let ct=r.convert($.format,$.colorSpace),L=r.convert($.type),K=A($.internalFormat,ct,L,$.normalized,$.colorSpace,C.isXRRenderTarget===!0),q=Ee(C);n.renderbufferStorageMultisample(n.RENDERBUFFER,q,K,C.width,C.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Z,n.RENDERBUFFER,H.__webglColorRenderbuffer[Z])}n.bindRenderbuffer(n.RENDERBUFFER,null),C.depthBuffer&&(H.__webglDepthRenderbuffer=n.createRenderbuffer(),an(H.__webglDepthRenderbuffer,C,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ot){e.bindTexture(n.TEXTURE_CUBE_MAP,nt.__webglTexture),de(n.TEXTURE_CUBE_MAP,S);for(let Z=0;Z<6;Z++)if(S.mipmaps.length>0)for(let $=0;$<S.mipmaps.length;$++)Re(H.__webglFramebuffer[Z][$],C,S,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,$);else Re(H.__webglFramebuffer[Z],C,S,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0);w(S)?y(n.TEXTURE_CUBE_MAP):S.mipmaps.length>0&&n.texParameteri(n.TEXTURE_CUBE_MAP,n.TEXTURE_MAX_LEVEL,S.mipmaps.length-1),e.unbindTexture()}else if(ft){for(let Z=0,$=Q.length;Z<$;Z++){let ct=Q[Z],L=i.get(ct),K=n.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(K=C.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(K,L.__webglTexture),de(K,ct),Re(H.__webglFramebuffer,C,ct,n.COLOR_ATTACHMENT0+Z,K,0),w(ct)&&y(K)}e.unbindTexture()}else{let Z=n.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(Z=C.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(Z,nt.__webglTexture),de(Z,S),S.mipmaps.length>0)for(let $=0;$<S.mipmaps.length;$++)Re(H.__webglFramebuffer[$],C,S,n.COLOR_ATTACHMENT0,Z,$);else Re(H.__webglFramebuffer,C,S,n.COLOR_ATTACHMENT0,Z,0);w(S)?y(Z):S.mipmaps.length>0&&n.texParameteri(Z,n.TEXTURE_MAX_LEVEL,S.mipmaps.length-1),e.unbindTexture()}C.depthBuffer&&Li(C)}function B(C){let S=C.textures;for(let H=0,nt=S.length;H<nt;H++){let Q=S[H];if(w(Q)&&Q.mipmapsAutoUpdate===!0){let ot=E(C),ft=i.get(Q).__webglTexture;e.bindTexture(ot,ft),y(ot),e.unbindTexture()}}}let Ui=[];function Te(C){if(C.samples>0){if(mt(C)===!1){let S=C.textures,H=C.width,nt=C.height,Q=n.COLOR_BUFFER_BIT,ot=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ft=i.get(C),Z=S.length>1;if(Z)for(let ct=0;ct<S.length;ct++)e.bindFramebuffer(n.FRAMEBUFFER,ft.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ct,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,ft.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ct,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,ft.__webglMultisampledFramebuffer),C.texture.mipmaps.length>0?e.bindFramebuffer(n.DRAW_FRAMEBUFFER,ft.__webglFramebuffer[0]):e.bindFramebuffer(n.DRAW_FRAMEBUFFER,ft.__webglFramebuffer);for(let ct=0;ct<S.length;ct++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(Q|=n.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(Q|=n.STENCIL_BUFFER_BIT)),Z){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,ft.__webglColorRenderbuffer[ct]);let L=i.get(S[ct]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,L,0)}n.blitFramebuffer(0,0,H,nt,0,0,H,nt,Q,n.NEAREST),l===!0&&(Ui.length=0,Ui.push(n.COLOR_ATTACHMENT0+ct),C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&Ui.push(ot),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Ui))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),Z)for(let ct=0;ct<S.length;ct++){e.bindFramebuffer(n.FRAMEBUFFER,ft.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ct,n.RENDERBUFFER,ft.__webglColorRenderbuffer[ct]);let L=i.get(S[ct]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,ft.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ct,n.TEXTURE_2D,L,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,ft.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&l){let S=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[S])}}}function Ee(C){return Math.min(s.maxSamples,C.samples)}function mt(C){let S=i.get(C);return C.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function He(C){let S=a.render.frame;h.get(C)!==S&&(h.set(C,S),C.update())}function Ut(C,S){let H=C.colorSpace,nt=C.format,Q=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||H!==hs&&H!==ji&&(se.getTransfer(H)===ue?(nt!==pi||Q!==li)&&Ot("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Bt("WebGLTextures: Unsupported texture color space:",H)),S}function Vt(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=Wt,this.resetTextureUnits=tt,this.getTextureUnits=it,this.setTextureUnits=Et,this.setTexture2D=_t,this.setTexture2DArray=St,this.setTexture3D=Nt,this.setTextureCube=vt,this.rebindTextures=Di,this.setupRenderTarget=Ni,this.updateRenderTargetMipmap=B,this.updateMultisampleRenderTarget=Te,this.setupDepthRenderbuffer=Li,this.setupFrameBufferTexture=Re,this.useMultisampledRTT=mt,this.dispose=z}function Sx(n,t){function e(i,s=ji){let r,a=se.getTransfer(s);if(i===li)return n.UNSIGNED_BYTE;if(i===To)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Eo)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Rc)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Cc)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Ec)return n.BYTE;if(i===Ac)return n.SHORT;if(i===sr)return n.UNSIGNED_SHORT;if(i===wo)return n.INT;if(i===Qi)return n.UNSIGNED_INT;if(i===Ci)return n.FLOAT;if(i===Ie)return n.HALF_FLOAT;if(i===Pc)return n.ALPHA;if(i===Ic)return n.RGB;if(i===pi)return n.RGBA;if(i===Sn)return n.DEPTH_COMPONENT;if(i===Rn)return n.DEPTH_STENCIL;if(i===Lc)return n.RED;if(i===Ao)return n.RED_INTEGER;if(i===$n)return n.RG;if(i===Ro)return n.RG_INTEGER;if(i===Co)return n.RGBA_INTEGER;if(i===ea||i===ia||i===na||i===sa)if(a===ue)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===ea)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===ia)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===na)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===sa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===ea)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===ia)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===na)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===sa)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Po||i===Io||i===Lo||i===Do)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Po)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Io)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Lo)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Do)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===No||i===Uo||i===Fo||i===Oo||i===Bo||i===ra||i===zo)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(i===No||i===Uo)return a===ue?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Fo)return a===ue?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===Oo)return r.COMPRESSED_R11_EAC;if(i===Bo)return r.COMPRESSED_SIGNED_R11_EAC;if(i===ra)return r.COMPRESSED_RG11_EAC;if(i===zo)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===ko||i===Ho||i===Go||i===Vo||i===Wo||i===Xo||i===qo||i===Yo||i===Zo||i===$o||i===Jo||i===Ko||i===Qo||i===jo)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(i===ko)return a===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Ho)return a===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Go)return a===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Vo)return a===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Wo)return a===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Xo)return a===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===qo)return a===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Yo)return a===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Zo)return a===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===$o)return a===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Jo)return a===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Ko)return a===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Qo)return a===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===jo)return a===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===tl||i===el||i===il)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(i===tl)return a===ue?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===el)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===il)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===nl||i===sl||i===aa||i===rl)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(i===nl)return r.COMPRESSED_RED_RGTC1_EXT;if(i===sl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===aa)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===rl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===_s?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}var bx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,wx=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Kc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let i=new Vr(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,i=new ge({vertexShader:bx,fragmentShader:wx,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Qt(new oi(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Qc=class extends ln{constructor(t,e){super();let i=this,s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,m=null,x=typeof XRWebGLBinding<"u",p=new Kc,g={},v=e.getContextAttributes(),w=null,y=null,E=[],A=[],_=new Pt,T=null,I=null,R=new ri;R.viewport=new ye;let D=new ri;D.viewport=new ye;let N=[R,D],O=new Mo,P=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let _t=E[J];return _t===void 0&&(_t=new Js,E[J]=_t),_t.getTargetRaySpace()},this.getControllerGrip=function(J){let _t=E[J];return _t===void 0&&(_t=new Js,E[J]=_t),_t.getGripSpace()},this.getHand=function(J){let _t=E[J];return _t===void 0&&(_t=new Js,E[J]=_t),_t.getHandSpace()};function V(J){let _t=A.indexOf(J.inputSource);if(_t===-1)return;let St=E[_t];St!==void 0&&(St.update(J.inputSource,J.frame,c||a),St.dispatchEvent({type:J.type,data:J.inputSource}))}function X(){s.removeEventListener("select",V),s.removeEventListener("selectstart",V),s.removeEventListener("selectend",V),s.removeEventListener("squeeze",V),s.removeEventListener("squeezestart",V),s.removeEventListener("squeezeend",V),s.removeEventListener("end",X),s.removeEventListener("inputsourceschange",st);for(let J=0;J<E.length;J++){let _t=A[J];_t!==null&&(A[J]=null,E[J].disconnect(_t))}P=null,z=null,p.reset();for(let J in g)delete g[J];if(t.setRenderTarget(w),f=null,d=null,u=null,s=null,y=null,Wt.stop(),i.isPresenting=!1,t.setPixelRatio(T),t.setSize(_.width,_.height,!1),I!==null){let J=I.camera;J.fov=I.fov,J.zoom=I.zoom,J.updateProjectionMatrix(),I=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){r=J,i.isPresenting===!0&&Ot("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){o=J,i.isPresenting===!0&&Ot("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(J){c=J},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&x&&(u=new XRWebGLBinding(s,e)),u},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(J){if(s=J,s!==null){if(w=t.getRenderTarget(),s.addEventListener("select",V),s.addEventListener("selectstart",V),s.addEventListener("selectend",V),s.addEventListener("squeeze",V),s.addEventListener("squeezestart",V),s.addEventListener("squeezeend",V),s.addEventListener("end",X),s.addEventListener("inputsourceschange",st),v.xrCompatible!==!0&&await e.makeXRCompatible(),T=t.getPixelRatio(),t.getSize(_),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let St=null,Nt=null,vt=null;v.depth&&(vt=v.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,St=v.stencil?Rn:Sn,Nt=v.stencil?_s:Qi);let qt={colorFormat:e.RGBA8,depthFormat:vt,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(qt),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),y=new Pe(d.textureWidth,d.textureHeight,{format:pi,type:li,depthTexture:new En(d.textureWidth,d.textureHeight,Nt,void 0,void 0,void 0,void 0,void 0,void 0,St),stencilBuffer:v.stencil,colorSpace:t.outputColorSpace,samples:v.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let St={antialias:v.antialias,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,St),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new Pe(f.framebufferWidth,f.framebufferHeight,{format:pi,type:li,colorSpace:t.outputColorSpace,stencilBuffer:v.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Wt.setContext(s),Wt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function st(J){for(let _t=0;_t<J.removed.length;_t++){let St=J.removed[_t],Nt=A.indexOf(St);Nt>=0&&(A[Nt]=null,E[Nt].disconnect(St))}for(let _t=0;_t<J.added.length;_t++){let St=J.added[_t],Nt=A.indexOf(St);if(Nt===-1){for(let qt=0;qt<E.length;qt++)if(qt>=A.length){A.push(St),Nt=qt;break}else if(A[qt]===null){A[qt]=St,Nt=qt;break}if(Nt===-1)break}let vt=E[Nt];vt&&vt.connect(St)}}function Y(J,_t){_t===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(_t.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(s===null)return;let _t=J.near,St=J.far;p.texture!==null&&(p.depthNear>0&&(_t=p.depthNear),p.depthFar>0&&(St=p.depthFar)),O.near=D.near=R.near=_t,O.far=D.far=R.far=St,(P!==O.near||z!==O.far)&&(s.updateRenderState({depthNear:O.near,depthFar:O.far}),P=O.near,z=O.far),O.layers.mask=J.layers.mask|6,R.layers.mask=O.layers.mask&-5,D.layers.mask=O.layers.mask&-3;let Nt=J.parent,vt=O.cameras;Y(O,Nt);for(let qt=0;qt<vt.length;qt++)Y(vt[qt],Nt);O.projectionMatrix.copy(R.projectionMatrix),O.projectionMatrixInverse.copy(R.projectionMatrixInverse),I===null&&J.isPerspectiveCamera&&(I={camera:J,fov:J.fov,zoom:J.zoom}),tt(J,O,Nt)};function tt(J,_t,St){St===null?J.matrix.copy(_t.matrixWorld):(J.matrix.copy(St.matrixWorld),J.matrix.invert(),J.matrix.multiply(_t.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(_t.projectionMatrix),J.projectionMatrixInverse.copy(_t.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=eo*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(J){l=J,d!==null&&(d.fixedFoveation=J),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=J)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(O)},this.getCameraTexture=function(J){return g[J]};let it=null;function Et(J,_t){if(h=_t.getViewerPose(c||a),m=_t,h!==null){let St=h.views;f!==null&&(t.setRenderTargetFramebuffer(y,f.framebuffer),t.setRenderTarget(y));let Nt=!1;St.length!==O.cameras.length&&(O.cameras.length=0,Nt=!0);for(let Ft=0;Ft<St.length;Ft++){let de=St[Ft],_e=null;if(f!==null)_e=f.getViewport(de);else{let je=u.getViewSubImage(d,de);_e=je.viewport,Ft===0&&(t.setRenderTargetTextures(y,je.colorTexture,je.depthStencilTexture),t.setRenderTarget(y))}let ee=N[Ft];ee===void 0&&(ee=new ri,ee.layers.enable(Ft),ee.viewport=new ye,N[Ft]=ee),ee.matrix.fromArray(de.transform.matrix),ee.matrix.decompose(ee.position,ee.quaternion,ee.scale),ee.projectionMatrix.fromArray(de.projectionMatrix),ee.projectionMatrixInverse.copy(ee.projectionMatrix).invert(),ee.viewport.set(_e.x,_e.y,_e.width,_e.height),Ft===0&&(O.matrix.copy(ee.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),Nt===!0&&O.cameras.push(ee)}let vt=s.enabledFeatures;if(vt&&vt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){u=i.getBinding();let Ft=u.getDepthInformation(St[0]);Ft&&Ft.isValid&&Ft.texture&&p.init(Ft,s.renderState)}if(vt&&vt.includes("camera-access")&&x){t.state.unbindTexture(),u=i.getBinding();for(let Ft=0;Ft<St.length;Ft++){let de=St[Ft].camera;if(de){let _e=g[de];_e||(_e=new Vr,g[de]=_e);let ee=u.getCameraImage(de);_e.sourceTexture=ee}}}}for(let St=0;St<E.length;St++){let Nt=A[St],vt=E[St];Nt!==null&&vt!==void 0&&vt.update(Nt,_t,c||a)}it&&it(J,_t),_t.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:_t}),m=null}let Wt=new ud;Wt.setAnimationLoop(Et),this.setAnimationLoop=function(J){it=J},this.dispose=function(){}}},Tx=new pe,Md=new zt;Md.set(-1,0,0,0,1,0,0,0,1);function Ex(n,t){function e(p,g){p.matrixAutoUpdate===!0&&p.updateMatrix(),g.value.copy(p.matrix)}function i(p,g){g.color.getRGB(p.fogColor.value,zc(n)),g.isFog?(p.fogNear.value=g.near,p.fogFar.value=g.far):g.isFogExp2&&(p.fogDensity.value=g.density)}function s(p,g,v,w,y){g.isNodeMaterial?g.uniformsNeedUpdate=!1:g.isMeshBasicMaterial?r(p,g):g.isMeshLambertMaterial?(r(p,g),g.envMap&&(p.envMapIntensity.value=g.envMapIntensity)):g.isMeshToonMaterial?(r(p,g),u(p,g)):g.isMeshPhongMaterial?(r(p,g),h(p,g),g.envMap&&(p.envMapIntensity.value=g.envMapIntensity)):g.isMeshStandardMaterial?(r(p,g),d(p,g),g.isMeshPhysicalMaterial&&f(p,g,y)):g.isMeshMatcapMaterial?(r(p,g),m(p,g)):g.isMeshDepthMaterial?r(p,g):g.isMeshDistanceMaterial?(r(p,g),x(p,g)):g.isMeshNormalMaterial?r(p,g):g.isLineBasicMaterial?(a(p,g),g.isLineDashedMaterial&&o(p,g)):g.isPointsMaterial?l(p,g,v,w):g.isSpriteMaterial?c(p,g):g.isShadowMaterial?(p.color.value.copy(g.color),p.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function r(p,g){p.opacity.value=g.opacity,g.color&&p.diffuse.value.copy(g.color),g.emissive&&p.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(p.map.value=g.map,e(g.map,p.mapTransform)),g.alphaMap&&(p.alphaMap.value=g.alphaMap,e(g.alphaMap,p.alphaMapTransform)),g.bumpMap&&(p.bumpMap.value=g.bumpMap,e(g.bumpMap,p.bumpMapTransform),p.bumpScale.value=g.bumpScale,g.side===Je&&(p.bumpScale.value*=-1)),g.normalMap&&(p.normalMap.value=g.normalMap,e(g.normalMap,p.normalMapTransform),p.normalScale.value.copy(g.normalScale),g.side===Je&&p.normalScale.value.negate()),g.displacementMap&&(p.displacementMap.value=g.displacementMap,e(g.displacementMap,p.displacementMapTransform),p.displacementScale.value=g.displacementScale,p.displacementBias.value=g.displacementBias),g.emissiveMap&&(p.emissiveMap.value=g.emissiveMap,e(g.emissiveMap,p.emissiveMapTransform)),g.specularMap&&(p.specularMap.value=g.specularMap,e(g.specularMap,p.specularMapTransform)),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest);let v=t.get(g),w=v.envMap,y=v.envMapRotation;w&&(p.envMap.value=w,p.envMapRotation.value.setFromMatrix4(Tx.makeRotationFromEuler(y)).transpose(),w.isCubeTexture&&w.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(Md),p.reflectivity.value=g.reflectivity,p.ior.value=g.ior,p.refractionRatio.value=g.refractionRatio),g.lightMap&&(p.lightMap.value=g.lightMap,p.lightMapIntensity.value=g.lightMapIntensity,e(g.lightMap,p.lightMapTransform)),g.aoMap&&(p.aoMap.value=g.aoMap,p.aoMapIntensity.value=g.aoMapIntensity,e(g.aoMap,p.aoMapTransform))}function a(p,g){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,g.map&&(p.map.value=g.map,e(g.map,p.mapTransform))}function o(p,g){p.dashSize.value=g.dashSize,p.totalSize.value=g.dashSize+g.gapSize,p.scale.value=g.scale}function l(p,g,v,w){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,p.size.value=g.size*v,p.scale.value=w*.5,g.map&&(p.map.value=g.map,e(g.map,p.uvTransform)),g.alphaMap&&(p.alphaMap.value=g.alphaMap,e(g.alphaMap,p.alphaMapTransform)),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest)}function c(p,g){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,p.rotation.value=g.rotation,g.map&&(p.map.value=g.map,e(g.map,p.mapTransform)),g.alphaMap&&(p.alphaMap.value=g.alphaMap,e(g.alphaMap,p.alphaMapTransform)),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest)}function h(p,g){p.specular.value.copy(g.specular),p.shininess.value=Math.max(g.shininess,1e-4)}function u(p,g){g.gradientMap&&(p.gradientMap.value=g.gradientMap)}function d(p,g){p.metalness.value=g.metalness,g.metalnessMap&&(p.metalnessMap.value=g.metalnessMap,e(g.metalnessMap,p.metalnessMapTransform)),p.roughness.value=g.roughness,g.roughnessMap&&(p.roughnessMap.value=g.roughnessMap,e(g.roughnessMap,p.roughnessMapTransform)),g.envMap&&(p.envMapIntensity.value=g.envMapIntensity)}function f(p,g,v){p.ior.value=g.ior,g.diffuseRoughness>0&&(p.diffuseRoughness.value=g.diffuseRoughness,g.diffuseRoughnessMap&&(p.diffuseRoughnessMap.value=g.diffuseRoughnessMap,e(g.diffuseRoughnessMap,p.diffuseRoughnessMapTransform))),g.sheen>0&&(p.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),p.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(p.sheenColorMap.value=g.sheenColorMap,e(g.sheenColorMap,p.sheenColorMapTransform)),g.sheenRoughnessMap&&(p.sheenRoughnessMap.value=g.sheenRoughnessMap,e(g.sheenRoughnessMap,p.sheenRoughnessMapTransform))),g.clearcoat>0&&(p.clearcoat.value=g.clearcoat,p.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(p.clearcoatMap.value=g.clearcoatMap,e(g.clearcoatMap,p.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,e(g.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(p.clearcoatNormalMap.value=g.clearcoatNormalMap,e(g.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===Je&&p.clearcoatNormalScale.value.negate())),g.dispersion>0&&(p.dispersion.value=g.dispersion),g.retroreflectivity>0&&(p.retroreflectivity.value=g.retroreflectivity),g.iridescence>0&&(p.iridescence.value=g.iridescence,p.iridescenceIOR.value=g.iridescenceIOR,p.iridescenceThicknessMinimum.value=g.iridescenceThicknessMinimum,p.iridescenceThicknessMaximum.value=g.iridescenceThicknessMaximum,g.iridescenceMap&&(p.iridescenceMap.value=g.iridescenceMap,e(g.iridescenceMap,p.iridescenceMapTransform)),g.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=g.iridescenceThicknessMap,e(g.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),g.transmission>0&&(p.transmission.value=g.transmission,p.transmissionSamplerMap.value=v.texture,p.transmissionSamplerSize.value.set(v.width,v.height),g.transmissionMap&&(p.transmissionMap.value=g.transmissionMap,e(g.transmissionMap,p.transmissionMapTransform)),p.thickness.value=g.thickness,g.thicknessMap&&(p.thicknessMap.value=g.thicknessMap,e(g.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=g.attenuationDistance,p.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(p.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(p.anisotropyMap.value=g.anisotropyMap,e(g.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=g.specularIntensity,p.specularColor.value.copy(g.specularColor),g.specularColorMap&&(p.specularColorMap.value=g.specularColorMap,e(g.specularColorMap,p.specularColorMapTransform)),g.specularIntensityMap&&(p.specularIntensityMap.value=g.specularIntensityMap,e(g.specularIntensityMap,p.specularIntensityMapTransform))}function m(p,g){g.matcap&&(p.matcap.value=g.matcap)}function x(p,g){let v=t.get(g).light;p.referencePosition.value.setFromMatrixPosition(v.matrixWorld),p.nearDistance.value=v.shadow.camera.near,p.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function Ax(n,t,e,i){let s={},r={};function a(v,w){let y=w.program;i.uniformBlockBinding(v,y,s[v.id])}function o(v,w){let y=s[v.id];y===void 0&&(m(v),y=l(v),s[v.id]=y,v.addEventListener("dispose",p));let E=w.program;i.updateUBOMapping(v,E);let A=t.render.frame;r[v.id]!==A&&(c(v),r[v.id]=A)}function l(v){let w=n.createBuffer(),y=v.__size,E=v.usage;return n.bindBuffer(n.UNIFORM_BUFFER,w),n.bufferData(n.UNIFORM_BUFFER,y,E),n.bindBuffer(n.UNIFORM_BUFFER,null),w}function c(v){let w=s[v.id],y=v.uniforms,E=v.__cache;n.bindBuffer(n.UNIFORM_BUFFER,w);for(let A=0,_=y.length;A<_;A++){let T=y[A];if(Array.isArray(T))for(let I=0,R=T.length;I<R;I++)h(T[I],A,I,E);else h(T,A,0,E)}n.bindBuffer(n.UNIFORM_BUFFER,null)}function h(v,w,y,E){if(d(v,w,y,E)===!0){let A=v.__offset,_=v.value;if(Array.isArray(_)){let T=0;for(let I=0;I<_.length;I++){let R=_[I],D=x(R,!0);u(R,v.__data,T),T+=D.storage/Float32Array.BYTES_PER_ELEMENT}}else u(_,v.__data,0);n.bufferSubData(n.UNIFORM_BUFFER,A,v.__data)}}function u(v,w,y){typeof v=="number"||typeof v=="boolean"?w[y]=v:v.isMatrix3?(w[y]=v.elements[0],w[y+1]=v.elements[1],w[y+2]=v.elements[2],w[y+3]=0,w[y+4]=v.elements[3],w[y+5]=v.elements[4],w[y+6]=v.elements[5],w[y+7]=0,w[y+8]=v.elements[6],w[y+9]=v.elements[7],w[y+10]=v.elements[8],w[y+11]=0):ArrayBuffer.isView(v)?w.set(v.subarray(0,w.length-y),y):v.toArray(w,y)}function d(v,w,y,E){let A=v.value,_=w+"_"+y;if(Array.isArray(A)){E[_]===void 0&&(E[_]=[]);let T=E[_],I=!1;for(let R=0;R<A.length;R++)f(A[R],T,R)===!0&&(I=!0);return I}return f(A,E,_)}function f(v,w,y){if(w[y]===void 0)return typeof v=="number"||typeof v=="boolean"?w[y]=v:ArrayBuffer.isView(v)?w[y]=v.slice():w[y]=v.clone(),!0;{let E=w[y];if(typeof v=="number"||typeof v=="boolean"){if(E!==v)return w[y]=v,!0}else{if(ArrayBuffer.isView(v))return!0;if(E.equals(v)===!1)return E.copy(v),!0}}return!1}function m(v){let w=v.uniforms,y=0,E=16;for(let _=0,T=w.length;_<T;_++){let I=Array.isArray(w[_])?w[_]:[w[_]];for(let R=0,D=I.length;R<D;R++){let N=I[R],O=Array.isArray(N.value)?N.value:[N.value],P=Array.isArray(w[_])||Array.isArray(N.value),z=y;for(let X=0,st=O.length;X<st;X++){let Y=O[X],tt=x(Y,P),it=y%E,Et=it%tt.boundary,Wt=it+Et;y+=Et,Wt!==0&&E-Wt<tt.storage&&(y+=E-Wt),X===0&&(z=y),y+=tt.storage}let V=N.type==="int"?Int32Array:N.type==="uint"?Uint32Array:Float32Array;N.__data=new V((y-z)/Float32Array.BYTES_PER_ELEMENT),N.__offset=z}}let A=y%E;return A>0&&(y+=E-A),v.__size=y,v.__cache={},this}function x(v,w){let y={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(y.boundary=4,y.storage=4):v.isVector2?(y.boundary=8,y.storage=8):v.isVector3||v.isColor?(y.boundary=16,y.storage=12):v.isVector4?(y.boundary=16,y.storage=16):v.isMatrix3?(y.boundary=16,y.storage=48):v.isMatrix4?(y.boundary=16,y.storage=64):v.isTexture?Ot("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(y.boundary=16,y.storage=v.byteLength):Ot("WebGLRenderer: Unsupported uniform value type.",v),w===!0&&(y.boundary=16,y.storage=Math.ceil(y.storage/16)*16),y}function p(v){let w=v.target;w.removeEventListener("dispose",p),n.deleteBuffer(s[w.id]),delete s[w.id],delete r[w.id]}function g(){for(let v in s)n.deleteBuffer(s[v]);s={},r={}}return{bind:a,update:o,dispose:g}}var Rx=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),un=null;function Cx(){return un===null&&(un=new kn(Rx,16,16,$n,Ie),un.name="DFG_LUT",un.minFilter=Ue,un.magFilter=Ue,un.wrapS=Oi,un.wrapT=Oi,un.generateMipmaps=!1,un.needsUpdate=!0),un}var hl=class{constructor(t={}){let{canvas:e=Du(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=li}=t;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=a;let x=f,p=new Set([Co,Ro,Ao]),g=new Set([li,Qi,sr,_s,To,Eo]),v=new Uint32Array(4),w=new Int32Array(4),y={textures:[],min:[],max:[],resolution:[]},E=null,A=null,_=[],T=[],I=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=yi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let R=this,D=!1,N=null,O=null,P=null,z=null;this._outputColorSpace=De;let V=0,X=0,st=null,Y=-1,tt=null,it=new ye,Et=new ye,Wt=null,J=new Dt(0),_t=0,St=e.width,Nt=e.height,vt=1,qt=null,Fe=null,Ft=new ye(0,0,St,Nt),de=new ye(0,0,St,Nt),_e=!1,ee=new Hn,je=new ao,ke=!1,gi=!1,Re=new pe,an=new F,We=new ye,Li={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Di=!1;function Ni(){return st===null?vt:1}let B=i;function Ui(b,U){return e.getContext(b,U)}let Te,Ee,mt,He,Ut,Vt,C,S,H,nt,Q,ot,ft,Z,$,ct,L,K,q,ht,at,lt,It;try{let b={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"187"}`),e.addEventListener("webglcontextlost",Lt,!1),e.addEventListener("webglcontextrestored",Zt,!1),e.addEventListener("webglcontextcreationerror",xt,!1),B===null){let U="webgl2";if(B=Ui(U,b),B===null)throw Ui(U)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}$t()}catch(b){throw e.removeEventListener("webglcontextlost",Lt,!1),e.removeEventListener("webglcontextrestored",Zt,!1),e.removeEventListener("webglcontextcreationerror",xt,!1),Bt("WebGLRenderer: "+b.message),b}function $t(){Te=new k0(B),Te.init(),at=new Sx(B,Te),Ee=new C0(B,Te,t,at),mt=new yx(B,Te),Ee.reversedDepthBuffer&&d&&mt.buffers.depth.setReversed(!0),O=B.createFramebuffer(),P=B.createFramebuffer(),z=B.createFramebuffer(),He=new V0(B),Ut=new ax,Vt=new Mx(B,Te,mt,Ut,Ee,at,He),C=new z0(R),S=new Xf(B),lt=new A0(B,S),H=new H0(B,S,He,lt),nt=new X0(B,H,S,lt,He),K=new W0(B,Ee,Vt),$=new P0(Ut),Q=new rx(R,C,Te,Ee,lt,$),ot=new Ex(R,Ut),ft=new lx,Z=new px(Te),L=new E0(R,C,mt,nt,m,l),ct=new vx(R,nt,Ee),It=new Ax(B,He,Ee,mt),q=new R0(B,Te,He),ht=new G0(B,Te,He),He.programs=Q.programs,R.capabilities=Ee,R.extensions=Te,R.properties=Ut,R.renderLists=ft,R.shadowMap=ct,R.state=mt,R.info=He}x!==li&&(I=new Y0(x,e.width,e.height,o,s,r));let rt=new Qc(R,B);this.xr=rt,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){let b=Te.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){let b=Te.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return vt},this.setPixelRatio=function(b){b!==void 0&&(vt=b,this.setSize(St,Nt,!1))},this.getSize=function(b){return b.set(St,Nt)},this.setSize=function(b,U,W=!0){if(rt.isPresenting){Ot("WebGLRenderer: Can't change size while VR device is presenting.");return}St=b,Nt=U,e.width=Math.floor(b*vt),e.height=Math.floor(U*vt),W===!0&&(e.style.width=b+"px",e.style.height=U+"px"),I!==null&&I.setSize(e.width,e.height),this.setViewport(0,0,b,U)},this.getDrawingBufferSize=function(b){return b.set(St*vt,Nt*vt).floor()},this.setDrawingBufferSize=function(b,U,W){St=b,Nt=U,vt=W,e.width=Math.floor(b*W),e.height=Math.floor(U*W),this.setViewport(0,0,b,U)},this.setEffects=function(b){if(x===li){Bt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(b){for(let U=0;U<b.length;U++)if(b[U].isOutputPass===!0){Ot("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}I.setEffects(b||[])},this.getCurrentViewport=function(b){return b.copy(it)},this.getViewport=function(b){return b.copy(Ft)},this.setViewport=function(b,U,W,k){b.isVector4?Ft.set(b.x,b.y,b.z,b.w):Ft.set(b,U,W,k),mt.viewport(it.copy(Ft).multiplyScalar(Ni()).round())},this.getScissor=function(b){return b.copy(de)},this.setScissor=function(b,U,W,k){b.isVector4?de.set(b.x,b.y,b.z,b.w):de.set(b,U,W,k),mt.scissor(Et.copy(de).multiplyScalar(Ni()).round())},this.getScissorTest=function(){return _e},this.setScissorTest=function(b){mt.setScissorTest(_e=b)},this.setOpaqueSort=function(b){qt=b},this.setTransparentSort=function(b){Fe=b},this.getClearColor=function(b){return b.copy(L.getClearColor())},this.setClearColor=function(){L.setClearColor(...arguments)},this.getClearAlpha=function(){return L.getClearAlpha()},this.setClearAlpha=function(){L.setClearAlpha(...arguments)},this.clear=function(b=!0,U=!0,W=!0){let k=0;if(b){let G=!1;if(st!==null){let pt=st.texture.format;G=p.has(pt)}if(G){let pt=st.texture.type,Mt=g.has(pt),dt=L.getClearColor(),yt=L.getClearAlpha(),At=dt.r,Xt=dt.g,ie=dt.b;Mt?(v[0]=At,v[1]=Xt,v[2]=ie,v[3]=yt,B.clearBufferuiv(B.COLOR,0,v)):(w[0]=At,w[1]=Xt,w[2]=ie,w[3]=yt,B.clearBufferiv(B.COLOR,0,w))}else k|=B.COLOR_BUFFER_BIT}U&&(k|=B.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),W&&(k|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),k!==0&&B.clear(k)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(b){b.setRenderer(this),N=b},this.dispose=function(){e.removeEventListener("webglcontextlost",Lt,!1),e.removeEventListener("webglcontextrestored",Zt,!1),e.removeEventListener("webglcontextcreationerror",xt,!1),L.dispose(),ft.dispose(),Z.dispose(),Vt.dispose(),Ut.dispose(),C.dispose(),nt.dispose(),H.dispose(),lt.dispose(),It.dispose(),Q.dispose(),rt.dispose(),rt.removeEventListener("sessionstart",vh),rt.removeEventListener("sessionend",yh),ns.stop()};function Lt(b){b.preventDefault(),Dr("WebGLRenderer: Context Lost."),D=!0}function Zt(){Dr("WebGLRenderer: Context Restored."),D=!1;let b=He.autoReset,U=ct.enabled,W=ct.autoUpdate,k=ct.needsUpdate,G=ct.type;$t(),He.autoReset=b,ct.enabled=U,ct.autoUpdate=W,ct.needsUpdate=k,ct.type=G}function xt(b){Bt("WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function fe(b){let U=b.target;U.removeEventListener("dispose",fe),Xe(U)}function Xe(b){Ln(b),Ut.remove(b)}function Ln(b){let U=Ut.get(b).programs;U!==void 0&&(U.forEach(function(W){Q.releaseProgram(W)}),b.isShaderMaterial&&Q.releaseShaderCache(b))}this.renderBufferDirect=function(b,U,W,k,G,pt){U===null&&(U=Li);let Mt=G.isMesh&&G.matrixWorld.determinantAffine()<0,dt=tf(b,U,W,k,G);mt.setMaterial(k,Mt);let yt=W.index,At=1;if(k.wireframe===!0){if(yt=H.getWireframeAttribute(W),yt===void 0)return;At=2}let Xt=W.drawRange,ie=W.attributes.position,bt=Xt.start*At,ne=(Xt.start+Xt.count)*At;pt!==null&&(bt=Math.max(bt,pt.start*At),ne=Math.min(ne,(pt.start+pt.count)*At)),yt!==null?(bt=Math.max(bt,0),ne=Math.min(ne,yt.count)):ie!=null&&(bt=Math.max(bt,0),ne=Math.min(ne,ie.count));let Oe=ne-bt;if(Oe<0||Oe===1/0)return;lt.setup(G,k,dt,W,yt);let Se,ve=q;if(yt!==null&&(Se=S.get(yt),ve=ht,ve.setIndex(Se)),G.isMesh)k.wireframe===!0?(mt.setLineWidth(k.wireframeLinewidth*Ni()),ve.setMode(B.LINES)):ve.setMode(B.TRIANGLES);else if(G.isLine){let ei=k.linewidth;ei===void 0&&(ei=1),mt.setLineWidth(ei*Ni()),G.isLineSegments?ve.setMode(B.LINES):G.isLineLoop?ve.setMode(B.LINE_LOOP):ve.setMode(B.LINE_STRIP)}else G.isPoints?ve.setMode(B.POINTS):G.isSprite&&ve.setMode(B.TRIANGLES);if(G.isBatchedMesh)if(Te.get("WEBGL_multi_draw"))ve.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{let ei=G._multiDrawStarts,wt=G._multiDrawCounts,di=G._multiDrawCount,le=yt?S.get(yt).bytesPerElement:1,ss=Ut.get(k).currentProgram.getUniforms();for(let ii=0;ii<di;ii++)ss.setValue(B,"_gl_DrawID",ii),ve.render(ei[ii]/le,wt[ii])}else if(G.isInstancedMesh)ve.renderInstances(bt,Oe,G.count);else if(W.isInstancedBufferGeometry){let ei=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,wt=Math.min(W.instanceCount,ei);ve.renderInstances(bt,Oe,wt)}else ve.render(bt,Oe)};function _h(b,U,W,k){N!==null&&b.isNodeMaterial&&N.setObject(k,b),ke===!0&&$.setState(b,W,!1),b.transparent===!0&&b.side===vi&&b.forceSinglePass===!1?(b.side=Je,b.needsUpdate=!0,Mr(b,U,k),b.side=Zn,b.needsUpdate=!0,Mr(b,U,k),b.side=vi):Mr(b,U,k)}this.compile=function(b,U,W=null){W===null&&(W=b),N!==null&&N.renderStart(b,U,W),A=Z.get(W),A.init(U),T.push(A),W.traverseVisible(function(G){G.isLight&&G.layers.test(U.layers)&&(A.pushLight(G),G.castShadow&&A.pushShadow(G))}),b!==W&&b.traverseVisible(function(G){G.isLight&&G.layers.test(U.layers)&&(A.pushLight(G),G.castShadow&&A.pushShadow(G))}),A.setupLights(),N!==null&&N.updateLights(A.state.lightsArray),gi=this.localClippingEnabled,ke=$.init(this.clippingPlanes,gi),ke===!0&&$.setGlobalState(this.clippingPlanes,U),N!==null&&ct.render(A.state.shadowsArray,W,U);let k=new Set;return b.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;let pt=G.material;if(pt)if(Array.isArray(pt))for(let Mt=0;Mt<pt.length;Mt++){let dt=pt[Mt];_h(dt,W,U,G),k.add(dt)}else _h(pt,W,U,G),k.add(pt)}),A=T.pop(),N!==null&&N.renderEnd(),k},this.compileAsync=function(b,U,W=null){let k=this.compile(b,U,W);return new Promise(G=>{function pt(){if(k.forEach(function(Mt){let yt=Ut.get(Mt).currentProgram;(yt===void 0||yt.isReady())&&k.delete(Mt)}),k.size===0){G(b);return}setTimeout(pt,10)}Te.get("KHR_parallel_shader_compile")!==null?pt():setTimeout(pt,10)})};let Dl=null;function Qd(b){Dl&&Dl(b)}function vh(){ns.stop()}function yh(){ns.start()}let ns=new ud;ns.setAnimationLoop(Qd),typeof self<"u"&&ns.setContext(self),this.setAnimationLoop=function(b){Dl=b,rt.setAnimationLoop(b),b===null?ns.stop():ns.start()},rt.addEventListener("sessionstart",vh),rt.addEventListener("sessionend",yh),this.render=function(b,U){if(U!==void 0&&U.isCamera!==!0){Bt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;N!==null&&N.renderStart(b,U);let W=rt.enabled===!0&&rt.isPresenting===!0,k=I!==null&&(st===null||W)&&I.begin(R,st);if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),rt.enabled===!0&&rt.isPresenting===!0&&(I===null||I.isCompositing()===!1)&&(rt.cameraAutoUpdate===!0&&rt.updateCamera(U),U=rt.getCamera()),b.isScene===!0&&b.onBeforeRender(R,b,U,st),A=Z.get(b,T.length),A.init(U),A.state.textureUnits=Vt.getTextureUnits(),T.push(A),Re.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),U.isArrayCamera?je.setFromArrayCamera(U):ee.setFromProjectionMatrix(Re,Bi,U.reversedDepth),gi=this.localClippingEnabled,ke=$.init(this.clippingPlanes,gi),E=ft.get(b,_.length),E.init(),_.push(E),this.info.render.frame++,rt.enabled===!0&&rt.isPresenting===!0){let Mt=R.xr.getDepthSensingMesh();Mt!==null&&Nl(Mt,U,-1/0,R.sortObjects)}Nl(b,U,0,R.sortObjects),E.finish(),N!==null&&N.updateLights(A.state.lightsArray),R.sortObjects===!0&&E.sort(qt,Fe),Di=rt.enabled===!1||rt.isPresenting===!1||rt.hasDepthSensing()===!1,Di&&L.addToRenderList(E,b),this.info.autoReset===!0&&this.info.reset(),ke===!0&&$.beginShadows();let G=A.state.shadowsArray;if(ct.render(G,b,U),ke===!0&&$.endShadows(),(k&&I.hasRenderPass())===!1){let Mt=E.opaque,dt=E.transmissive;if(A.setupLights(),U.isArrayCamera){let yt=U.cameras;if(dt.length>0)for(let At=0,Xt=yt.length;At<Xt;At++){let ie=yt[At];Sh(Mt,dt,b,ie)}Di&&L.render(b);for(let At=0,Xt=yt.length;At<Xt;At++){let ie=yt[At];Mh(E,b,ie,ie.viewport)}}else dt.length>0&&Sh(Mt,dt,b,U),Di&&L.render(b),Mh(E,b,U)}st!==null&&X===0&&(Vt.updateMultisampleRenderTarget(st),Vt.updateRenderTargetMipmap(st)),k&&I.end(R),b.isScene===!0&&b.onAfterRender(R,b,U),lt.resetDefaultState(),Y=-1,tt=null,T.pop(),T.length>0?(A=T[T.length-1],Vt.setTextureUnits(A.state.textureUnits),ke===!0&&$.setGlobalState(R.clippingPlanes,A.state.camera)):A=null,_.pop(),_.length>0?E=_[_.length-1]:E=null,N!==null&&N.renderEnd()};function Nl(b,U,W,k){if(b.visible===!1)return;if(b.layers.test(U.layers)){if(b.isGroup)W=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(U);else if(b.isLight)A.pushLight(b),b.castShadow&&A.pushShadow(b);else if(b.isSprite){let Mt=U.isArrayCamera?je:ee;if(!b.frustumCulled||b.intersectsFrustum(Mt)){k&&We.setFromMatrixPosition(b.matrixWorld).applyMatrix4(Re);let dt=nt.update(b),yt=b.material;yt.visible&&E.push(b,dt,yt,W,We.z,null,U)}}else if(b.isMesh||b.isLine||b.isPoints){let Mt=U.isArrayCamera?je:ee;if(!b.frustumCulled||b.intersectsFrustum(Mt)){let dt=nt.update(b),yt=b.material;if(k&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),We.copy(b.boundingSphere.center)):(dt.boundingSphere===null&&dt.computeBoundingSphere(),We.copy(dt.boundingSphere.center)),We.applyMatrix4(b.matrixWorld).applyMatrix4(Re)),Array.isArray(yt)){let At=dt.groups;for(let Xt=0,ie=At.length;Xt<ie;Xt++){let bt=At[Xt],ne=yt[bt.materialIndex];ne&&ne.visible&&E.push(b,dt,ne,W,We.z,bt,U)}}else yt.visible&&E.push(b,dt,yt,W,We.z,null,U)}}}let pt=b.children;for(let Mt=0,dt=pt.length;Mt<dt;Mt++)Nl(pt[Mt],U,W,k)}function Mh(b,U,W,k){let{opaque:G,transmissive:pt,transparent:Mt}=b;A.setupLightsView(W),ke===!0&&$.setGlobalState(R.clippingPlanes,W),k&&mt.viewport(it.copy(k)),G.length>0&&va(G,U,W),pt.length>0&&va(pt,U,W),Mt.length>0&&va(Mt,U,W),mt.buffers.depth.setTest(!0),mt.buffers.depth.setMask(!0),mt.buffers.color.setMask(!0),mt.setPolygonOffset(!1)}function Sh(b,U,W,k){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;if(A.state.transmissionRenderTarget[k.id]===void 0){let bt=Te.has("EXT_color_buffer_half_float")||Te.has("EXT_color_buffer_float");A.state.transmissionRenderTarget[k.id]=new Pe(1,1,{generateMipmaps:!0,type:bt?Ie:li,minFilter:Ri,samples:Math.max(4,Ee.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:se.workingColorSpace})}let pt=A.state.transmissionRenderTarget[k.id],Mt=k.viewport||it;pt.setSize(Mt.z*R.transmissionResolutionScale,Mt.w*R.transmissionResolutionScale);let dt=R.getRenderTarget(),yt=R.getActiveCubeFace(),At=R.getActiveMipmapLevel();R.setRenderTarget(pt),R.getClearColor(J),_t=R.getClearAlpha(),_t<1&&R.setClearColor(16777215,.5),R.clear(),Di&&L.render(W);let Xt=R.toneMapping;R.toneMapping=yi;let ie=k.viewport;if(k.viewport!==void 0&&(k.viewport=void 0),A.setupLightsView(k),ke===!0&&$.setGlobalState(R.clippingPlanes,k),va(b,W,k),Vt.updateMultisampleRenderTarget(pt),Vt.updateRenderTargetMipmap(pt),Te.has("WEBGL_multisampled_render_to_texture")===!1){let bt=!1;for(let ne=0,Oe=U.length;ne<Oe;ne++){let Se=U[ne],{object:ve,geometry:ei,material:wt,group:di}=Se;if(wt.side===vi&&ve.layers.test(k.layers)){let le=wt.side;wt.side=Je,wt.needsUpdate=!0,bh(ve,W,k,ei,wt,di),wt.side=le,wt.needsUpdate=!0,bt=!0}}bt===!0&&(Vt.updateMultisampleRenderTarget(pt),Vt.updateRenderTargetMipmap(pt))}R.setRenderTarget(dt,yt,At),R.setClearColor(J,_t),ie!==void 0&&(k.viewport=ie),R.toneMapping=Xt}function va(b,U,W){let k=U.isScene===!0?U.overrideMaterial:null;for(let G=0,pt=b.length;G<pt;G++){let Mt=b[G],{object:dt,geometry:yt,group:At}=Mt,Xt=Mt.material;Xt.allowOverride===!0&&k!==null&&(Xt=k),dt.layers.test(W.layers)&&bh(dt,U,W,yt,Xt,At)}}function bh(b,U,W,k,G,pt){N!==null&&G.isNodeMaterial&&N.setObject(b,G),b.onBeforeRender(R,U,W,k,G,pt),b.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),G.onBeforeRender(R,U,W,k,b,pt),G.transparent===!0&&G.side===vi&&G.forceSinglePass===!1?(G.side=Je,G.needsUpdate=!0,R.renderBufferDirect(W,U,k,G,b,pt),G.side=Zn,G.needsUpdate=!0,R.renderBufferDirect(W,U,k,G,b,pt),G.side=vi):R.renderBufferDirect(W,U,k,G,b,pt),b.onAfterRender(R,U,W,k,G,pt)}function wh(b){let U=0;for(let W of b)W.texture!==null&&U++;return U}function Mr(b,U,W){U.isScene!==!0&&(U=Li);let k=Ut.get(b),G=A.state.lights,pt=A.state.shadowsArray,Mt=G.state.version,dt=Q.getParameters(b,G.state,pt,U,W,A.state.lightProbeGridArray),yt=Q.getProgramCacheKey(dt),At=k.programs;k.environment=b.isMeshStandardMaterial||b.isMeshLambertMaterial||b.isMeshPhongMaterial?U.environment:null,k.fog=U.fog;let Xt=b.isMeshStandardMaterial||b.isMeshLambertMaterial&&!b.envMap||b.isMeshPhongMaterial&&!b.envMap;k.envMap=C.get(b.envMap||k.environment,Xt),k.envMapRotation=k.environment!==null&&b.envMap===null?U.environmentRotation:b.envMapRotation,At===void 0&&(b.addEventListener("dispose",fe),At=new Map,k.programs=At,k.programVariants=new Map);let ie=At.get(yt);if(ie!==void 0){if(k.currentProgram===ie&&k.lightsStateVersion===Mt)return Eh(b,dt),ie}else dt.uniforms=Q.getUniforms(b),N!==null&&b.isNodeMaterial&&N.build(b,W,dt),b.onBeforeCompile(dt,R),ie=Q.acquireProgram(dt,yt),At.set(yt,ie),k.uniforms=dt.uniforms;let bt=k.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(bt.clippingPlanes=$.uniform),Eh(b,dt),k.needsLights=nf(b),k.lightsStateVersion=Mt,k.needsLights&&(bt.ambientLightColor.value=G.state.ambient,bt.lightProbe.value=G.state.probe,bt.sunLights.value=G.state.sun,bt.sunLightShadows.value=G.state.sunShadow,bt.directionalLights.value=G.state.directional,bt.directionalLightShadows.value=G.state.directionalShadow,bt.spotLights.value=G.state.spot,bt.spotLightShadows.value=G.state.spotShadow,bt.rectAreaLights.value=G.state.rectArea,bt.ltc_1.value=G.state.rectAreaLTC1,bt.ltc_2.value=G.state.rectAreaLTC2,bt.pointLights.value=G.state.point,bt.pointLightShadows.value=G.state.pointShadow,bt.hemisphereLights.value=G.state.hemi,bt.sunShadowMatrix.value=G.state.sunShadowMatrix,bt.sunShadowCascade.value=G.state.sunShadowCascade,bt.directionalShadowMatrix.value=G.state.directionalShadowMatrix,bt.spotLightMatrix.value=G.state.spotLightMatrix,bt.spotLightMap.value=G.state.spotLightMap,bt.pointShadowMatrix.value=G.state.pointShadowMatrix),k.numLightProbeGrids=wh(A.state.lightProbeGridArray),k.currentProgram=ie,k.uniformsList=null,ie}function jd(b,U,W,k,G){let pt=Ut.get(b),Mt=pt.currentProgram.id+","+k+","+G,dt=pt.programVariants.get(Mt);return dt===void 0?(dt=Mr(b,U,W),pt.programVariants.set(Mt,dt)):(pt.currentProgram=dt,pt.uniformsList=null,pt.outputColorSpace=k,pt.toneMapping=G),dt}function Th(b){if(b.uniformsList===null){let U=b.currentProgram.getUniforms();b.uniformsList=rr.seqWithValue(U.seq,b.uniforms)}return b.uniformsList}function Eh(b,U){let W=Ut.get(b);W.outputColorSpace=U.outputColorSpace,W.batching=U.batching,W.batchingColor=U.batchingColor,W.instancing=U.instancing,W.instancingColor=U.instancingColor,W.instancingMorph=U.instancingMorph,W.skinning=U.skinning,W.morphTargets=U.morphTargets,W.morphNormals=U.morphNormals,W.morphColors=U.morphColors,W.morphTargetsCount=U.morphTargetsCount,W.numClippingPlanes=U.numClippingPlanes,W.numIntersection=U.numClipIntersection,W.vertexAlphas=U.vertexAlphas,W.vertexTangents=U.vertexTangents,W.toneMapping=U.toneMapping}function tf(b,U,W,k,G){U.isScene!==!0&&(U=Li),Vt.resetTextureUnits();let pt=U.fog,Mt=k.isMeshStandardMaterial||k.isMeshLambertMaterial||k.isMeshPhongMaterial?U.environment:null,dt=st===null?R.outputColorSpace:st.isXRRenderTarget===!0?st.texture.colorSpace:se.workingColorSpace,yt=k.isMeshStandardMaterial||k.isMeshLambertMaterial&&!k.envMap||k.isMeshPhongMaterial&&!k.envMap,At=C.get(k.envMap||Mt,yt),Xt=k.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,ie=!!W.attributes.tangent&&(!!k.normalMap||k.anisotropy>0),bt=!!W.morphAttributes.position,ne=!!W.morphAttributes.normal,Oe=!!W.morphAttributes.color,Se=yi;k.toneMapped&&(st===null||st.isXRRenderTarget===!0)&&(Se=R.toneMapping);let ve=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,ei=ve!==void 0?ve.length:0,wt=Ut.get(k),di=A.state.lights;if(ke===!0&&(gi===!0||b!==tt)){let Ce=b===tt&&k.id===Y;$.setState(k,b,Ce)}let le=!1,ss=!1;k.version===wt.__version?wt.needsLights&&wt.lightsStateVersion!==di.state.version||G.isBatchedMesh&&wt.batching===!1||!G.isBatchedMesh&&wt.batching===!0||G.isBatchedMesh&&wt.batchingColor===!0&&G._colorsTexture===null||G.isBatchedMesh&&wt.batchingColor===!1&&G._colorsTexture!==null||G.isInstancedMesh&&wt.instancing===!1||!G.isInstancedMesh&&wt.instancing===!0||G.isSkinnedMesh&&wt.skinning===!1||!G.isSkinnedMesh&&wt.skinning===!0||G.isInstancedMesh&&wt.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&wt.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&wt.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&wt.instancingMorph===!1&&G.morphTexture!==null||wt.envMap!==At||k.fog===!0&&wt.fog!==pt||wt.numClippingPlanes!==void 0&&(wt.numClippingPlanes!==$.numPlanes||wt.numIntersection!==$.numIntersection)||wt.vertexAlphas!==Xt||wt.vertexTangents!==ie||wt.morphTargets!==bt||wt.morphNormals!==ne||wt.morphColors!==Oe||wt.morphTargetsCount!==ei||wt.numLightProbeGrids!==wh(A.state.lightProbeGridArray)?le=!0:(wt.outputColorSpace!==dt||wt.toneMapping!==Se)&&(ss=!0):(le=!0,wt.__version=k.version);let ii=wt.currentProgram;(le===!0||ss===!0)&&(ii=ss===!0?jd(k,U,G,dt,Se):Mr(k,U,G),N&&k.isNodeMaterial&&N.onUpdateProgram(k,ii,wt));let ya=!1,Dn=!1,rs=!1,ae=ii.getUniforms(),ti=wt.uniforms;if(mt.useProgram(ii.program)&&(ya=!0,Dn=!0,rs=!0),k.id!==Y&&(Y=k.id,Dn=!0),ya||tt!==b){mt.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),ae.setValue(B,"projectionMatrix",b.projectionMatrix),ae.setValue(B,"viewMatrix",b.matrixWorldInverse);let qe=ae.map.cameraPosition;qe!==void 0&&qe.setValue(B,an.setFromMatrixPosition(b.matrixWorld)),Ee.logarithmicDepthBuffer&&ae.setValue(B,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial)&&ae.setValue(B,"isOrthographic",b.isOrthographicCamera===!0),tt!==b&&(tt=b,Dn=!0,rs=!0)}if(wt.needsLights&&(di.state.sunShadowMap.length>0&&ae.setValue(B,"sunShadowMap",di.state.sunShadowMap,Vt),di.state.directionalShadowMap.length>0&&ae.setValue(B,"directionalShadowMap",di.state.directionalShadowMap,Vt),di.state.spotShadowMap.length>0&&ae.setValue(B,"spotShadowMap",di.state.spotShadowMap,Vt),di.state.pointShadowMap.length>0&&ae.setValue(B,"pointShadowMap",di.state.pointShadowMap,Vt)),G.isSkinnedMesh){ae.setOptional(B,G,"bindMatrix"),ae.setOptional(B,G,"bindMatrixInverse");let Ce=G.skeleton;Ce&&(Ce.boneTexture===null&&Ce.computeBoneTexture(),ae.setValue(B,"boneTexture",Ce.boneTexture,Vt))}G.isBatchedMesh&&(ae.setOptional(B,G,"batchingTexture"),ae.setValue(B,"batchingTexture",G._matricesTexture,Vt),ae.setOptional(B,G,"batchingIdTexture"),ae.setValue(B,"batchingIdTexture",G._indirectTexture,Vt),ae.setOptional(B,G,"batchingColorTexture"),G._colorsTexture!==null&&ae.setValue(B,"batchingColorTexture",G._colorsTexture,Vt));let Zi=W.morphAttributes;if((Zi.position!==void 0||Zi.normal!==void 0||Zi.color!==void 0)&&K.update(G,W,ii),(Dn||wt.receiveShadow!==G.receiveShadow)&&(wt.receiveShadow=G.receiveShadow,ae.setValue(B,"receiveShadow",G.receiveShadow)),(k.isMeshStandardMaterial||k.isMeshLambertMaterial||k.isMeshPhongMaterial)&&k.envMap===null&&U.environment!==null&&(ti.envMapIntensity.value=U.environmentIntensity),ti.dfgLUT!==void 0&&(ti.dfgLUT.value=Cx()),Dn){if(ae.setValue(B,"toneMappingExposure",R.toneMappingExposure),wt.needsLights&&ef(ti,rs),pt&&k.fog===!0&&ot.refreshFogUniforms(ti,pt),ot.refreshMaterialUniforms(ti,k,vt,Nt,A.state.transmissionRenderTarget[b.id]),wt.needsLights&&wt.numLightProbeGrids>0){let Ce=y,qe=0;for(let pn of A.state.lightProbeGridArray)pn.texture!==null&&(Ce.textures[qe]=pn.texture,Ce.min[qe]=pn.boundingBox.min,Ce.max[qe]=pn.boundingBox.max,Ce.resolution[qe]=pn.resolution,qe++);for(let pn in Ce)Ce[pn].length=qe;ti.probesSH.value=Ce.textures,ti.probesMin.value=Ce.min,ti.probesMax.value=Ce.max,ti.probesResolution.value=Ce.resolution}rr.upload(B,Th(wt),ti,Vt)}if(k.isShaderMaterial&&k.uniformsNeedUpdate===!0&&(rr.upload(B,Th(wt),ti,Vt),k.uniformsNeedUpdate=!1),k.isSpriteMaterial&&ae.setValue(B,"center",G.center),ae.setValue(B,"modelViewMatrix",G.modelViewMatrix),ae.setValue(B,"normalMatrix",G.normalMatrix),ae.setValue(B,"modelMatrix",G.matrixWorld),k.uniformsGroups!==void 0){let Ce=k.uniformsGroups;for(let qe=0,pn=Ce.length;qe<pn;qe++){let Rh=Ce[qe];It.update(Rh,ii),It.bind(Rh,ii)}}return ii}function ef(b,U){b.ambientLightColor.needsUpdate=U,b.lightProbe.needsUpdate=U,b.sunLights.needsUpdate=U,b.sunLightShadows.needsUpdate=U,b.directionalLights.needsUpdate=U,b.directionalLightShadows.needsUpdate=U,b.pointLights.needsUpdate=U,b.pointLightShadows.needsUpdate=U,b.spotLights.needsUpdate=U,b.spotLightShadows.needsUpdate=U,b.rectAreaLights.needsUpdate=U,b.hemisphereLights.needsUpdate=U}function nf(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return V},this.getActiveMipmapLevel=function(){return X},this.getRenderTarget=function(){return st},this.setRenderTargetTextures=function(b,U,W){let k=Ut.get(b);k.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,k.__autoAllocateDepthBuffer===!1&&(k.__useRenderToTexture=!1),Ut.get(b.texture).__webglTexture=U,Ut.get(b.depthTexture).__webglTexture=k.__autoAllocateDepthBuffer?void 0:W,k.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,U){let W=Ut.get(b);W.__webglFramebuffer=U,W.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(b,U=0,W=0){st=b,V=U,X=W;let k=null,G=!1,pt=!1;if(b){let dt=Ut.get(b);if(dt.__useDefaultFramebuffer!==void 0){mt.bindFramebuffer(B.FRAMEBUFFER,dt.__webglFramebuffer),it.copy(b.viewport),Et.copy(b.scissor),Wt=b.scissorTest,mt.viewport(it),mt.scissor(Et),mt.setScissorTest(Wt),Y=-1;return}else if(dt.__webglFramebuffer===void 0)Vt.setupRenderTarget(b);else if(dt.__hasExternalTextures)Vt.rebindTextures(b,Ut.get(b.texture).__webglTexture,Ut.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){let Xt=b.depthTexture;if(dt.__boundDepthTexture!==Xt){if(Xt!==null&&Ut.has(Xt)&&(b.width!==Xt.image.width||b.height!==Xt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Vt.setupDepthRenderbuffer(b)}}let yt=b.texture;(yt.isData3DTexture||yt.isDataArrayTexture||yt.isCompressedArrayTexture)&&(pt=!0);let At=Ut.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(At[U])?k=At[U][W]:k=At[U],G=!0):b.samples>0&&Vt.useMultisampledRTT(b)===!1?k=Ut.get(b).__webglMultisampledFramebuffer:Array.isArray(At)?k=At[W]:k=At,it.copy(b.viewport),Et.copy(b.scissor),Wt=b.scissorTest}else it.copy(Ft).multiplyScalar(vt).floor(),Et.copy(de).multiplyScalar(vt).floor(),Wt=_e;if(W!==0&&(k=O),mt.bindFramebuffer(B.FRAMEBUFFER,k)&&mt.drawBuffers(b,k),mt.viewport(it),mt.scissor(Et),mt.setScissorTest(Wt),G){let dt=Ut.get(b.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+U,dt.__webglTexture,W)}else if(pt){let dt=U;for(let yt=0;yt<b.textures.length;yt++){let At=Ut.get(b.textures[yt]);B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0+yt,At.__webglTexture,W,dt)}}else if(b!==null&&W!==0){let dt=Ut.get(b.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,dt.__webglTexture,W)}Y=-1};function Ah(b){let U=Ut.get(b);return(U.__readFormat!==b.format||U.__readType!==b.type)&&(U.__readFormat=b.format,U.__readType=b.type,U.__formatReadable=Ee.textureFormatReadable(b.format),U.__typeReadable=Ee.textureTypeReadable(b.type)),U}this.readRenderTargetPixels=function(b,U,W,k,G,pt,Mt,dt=0){if(!(b&&b.isWebGLRenderTarget)){Bt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let yt=Ut.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Mt!==void 0&&(yt=yt[Mt],Array.isArray(yt)&&(yt=yt[0])),yt){mt.bindFramebuffer(B.FRAMEBUFFER,yt);try{let At=b.textures[dt],Xt=At.format,ie=At.type;b.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+dt);let bt=Ah(At);if(bt.__formatReadable===!1){Bt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(bt.__typeReadable===!1){Bt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=b.width-k&&W>=0&&W<=b.height-G&&B.readPixels(U,W,k,G,at.convert(Xt),at.convert(ie),pt)}finally{let At=st!==null?Ut.get(st).__webglFramebuffer:null;mt.bindFramebuffer(B.FRAMEBUFFER,At)}}},this.readRenderTargetPixelsAsync=async function(b,U,W,k,G,pt,Mt,dt=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let yt=Ut.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Mt!==void 0&&(yt=yt[Mt],Array.isArray(yt)&&(yt=yt[0])),yt)if(U>=0&&U<=b.width-k&&W>=0&&W<=b.height-G){mt.bindFramebuffer(B.FRAMEBUFFER,yt);let At=b.textures[dt],Xt=At.format,ie=At.type;b.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+dt);let bt=Ah(At);if(bt.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(bt.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let ne=B.createBuffer();B.bindBuffer(B.PIXEL_PACK_BUFFER,ne),B.bufferData(B.PIXEL_PACK_BUFFER,pt.byteLength,B.STREAM_READ),B.readPixels(U,W,k,G,at.convert(Xt),at.convert(ie),0),B.bindBuffer(B.PIXEL_PACK_BUFFER,null);let Oe=st!==null?Ut.get(st).__webglFramebuffer:null;mt.bindFramebuffer(B.FRAMEBUFFER,Oe);let Se=B.fenceSync(B.SYNC_GPU_COMMANDS_COMPLETE,0);return B.flush(),await Uu(B,Se,4),B.bindBuffer(B.PIXEL_PACK_BUFFER,ne),B.getBufferSubData(B.PIXEL_PACK_BUFFER,0,pt),B.bindBuffer(B.PIXEL_PACK_BUFFER,null),B.deleteBuffer(ne),B.deleteSync(Se),pt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,U=null,W=0){let k=Math.pow(2,-W),G=Math.floor(b.image.width*k),pt=Math.floor(b.image.height*k),Mt=U!==null?U.x:0,dt=U!==null?U.y:0;Vt.setTexture2D(b,0),B.copyTexSubImage2D(B.TEXTURE_2D,W,0,0,Mt,dt,G,pt),mt.unbindTexture()},this.copyTextureToTexture=function(b,U,W=null,k=null,G=0,pt=0){let Mt,dt,yt,At,Xt,ie,bt,ne,Oe,Se=b.isCompressedTexture?b.mipmaps[pt]:b.image;if(W!==null)Mt=W.max.x-W.min.x,dt=W.max.y-W.min.y,yt=W.isBox3?W.max.z-W.min.z:1,At=W.min.x,Xt=W.min.y,ie=W.isBox3?W.min.z:0;else{let ae=Math.pow(2,-G);Mt=Math.floor(Se.width*ae),dt=Math.floor(Se.height*ae),b.isDataArrayTexture?yt=Se.depth:b.isData3DTexture?yt=Math.floor(Se.depth*ae):yt=1,At=0,Xt=0,ie=0}k!==null?(bt=k.x,ne=k.y,Oe=k.z):(bt=0,ne=0,Oe=0);let ve=at.convert(U.format),ei=at.convert(U.type),wt;U.isData3DTexture?(Vt.setTexture3D(U,0),wt=B.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(Vt.setTexture2DArray(U,0),wt=B.TEXTURE_2D_ARRAY):(Vt.setTexture2D(U,0),wt=B.TEXTURE_2D),mt.activeTexture(B.TEXTURE0),mt.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,U.flipY),mt.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),mt.pixelStorei(B.UNPACK_ALIGNMENT,U.unpackAlignment);let di=mt.getParameter(B.UNPACK_ROW_LENGTH),le=mt.getParameter(B.UNPACK_IMAGE_HEIGHT),ss=mt.getParameter(B.UNPACK_SKIP_PIXELS),ii=mt.getParameter(B.UNPACK_SKIP_ROWS),ya=mt.getParameter(B.UNPACK_SKIP_IMAGES);mt.pixelStorei(B.UNPACK_ROW_LENGTH,Se.width),mt.pixelStorei(B.UNPACK_IMAGE_HEIGHT,Se.height),mt.pixelStorei(B.UNPACK_SKIP_PIXELS,At),mt.pixelStorei(B.UNPACK_SKIP_ROWS,Xt),mt.pixelStorei(B.UNPACK_SKIP_IMAGES,ie);let Dn=b.isDataArrayTexture||b.isData3DTexture,rs=U.isDataArrayTexture||U.isData3DTexture;if(b.isDepthTexture){let ae=Ut.get(b),ti=Ut.get(U),Zi=Ut.get(ae.__renderTarget),Ce=Ut.get(ti.__renderTarget);mt.bindFramebuffer(B.READ_FRAMEBUFFER,Zi.__webglFramebuffer),mt.bindFramebuffer(B.DRAW_FRAMEBUFFER,Ce.__webglFramebuffer);for(let qe=0;qe<yt;qe++)Dn&&(B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Ut.get(b).__webglTexture,G,ie+qe),B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Ut.get(U).__webglTexture,pt,Oe+qe)),B.blitFramebuffer(At,Xt,At+Mt,Xt+dt,bt,ne,bt+Mt,ne+dt,B.DEPTH_BUFFER_BIT,B.NEAREST);mt.bindFramebuffer(B.READ_FRAMEBUFFER,null),mt.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else if(G!==0||b.isRenderTargetTexture||Ut.has(b)){let ae=Ut.get(b),ti=Ut.get(U);mt.bindFramebuffer(B.READ_FRAMEBUFFER,P),mt.bindFramebuffer(B.DRAW_FRAMEBUFFER,z);for(let Zi=0;Zi<yt;Zi++)Dn?B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,ae.__webglTexture,G,ie+Zi):B.framebufferTexture2D(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,ae.__webglTexture,G),rs?B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,ti.__webglTexture,pt,Oe+Zi):B.framebufferTexture2D(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,ti.__webglTexture,pt),G!==0?B.blitFramebuffer(At,Xt,At+Mt,Xt+dt,bt,ne,bt+Mt,ne+dt,B.COLOR_BUFFER_BIT,B.NEAREST):rs?B.copyTexSubImage3D(wt,pt,bt,ne,Oe+Zi,At,Xt,Mt,dt):B.copyTexSubImage2D(wt,pt,bt,ne,At,Xt,Mt,dt);mt.bindFramebuffer(B.READ_FRAMEBUFFER,null),mt.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else rs?b.isDataTexture||b.isData3DTexture?B.texSubImage3D(wt,pt,bt,ne,Oe,Mt,dt,yt,ve,ei,Se.data):U.isCompressedArrayTexture?B.compressedTexSubImage3D(wt,pt,bt,ne,Oe,Mt,dt,yt,ve,Se.data):B.texSubImage3D(wt,pt,bt,ne,Oe,Mt,dt,yt,ve,ei,Se):b.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,pt,bt,ne,Mt,dt,ve,ei,Se.data):b.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,pt,bt,ne,Se.width,Se.height,ve,Se.data):B.texSubImage2D(B.TEXTURE_2D,pt,bt,ne,Mt,dt,ve,ei,Se);mt.pixelStorei(B.UNPACK_ROW_LENGTH,di),mt.pixelStorei(B.UNPACK_IMAGE_HEIGHT,le),mt.pixelStorei(B.UNPACK_SKIP_PIXELS,ss),mt.pixelStorei(B.UNPACK_SKIP_ROWS,ii),mt.pixelStorei(B.UNPACK_SKIP_IMAGES,ya),pt===0&&U.generateMipmaps===!0&&U.mipmapsAutoUpdate===!0&&B.generateMipmap(wt),mt.unbindTexture()},this.initRenderTarget=function(b){Ut.get(b).__webglFramebuffer===void 0&&Vt.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?Vt.setTextureCube(b,0):b.isData3DTexture?Vt.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?Vt.setTexture2DArray(b,0):Vt.setTexture2D(b,0),mt.unbindTexture()},this.resetState=function(){V=0,X=0,st=null,mt.reset(),lt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Bi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=se._getDrawingBufferColorSpace(t),e.unpackColorSpace=se._getUnpackColorSpace()}};var M=(n=0,t=0,e=0)=>({x:n,y:t,z:e}),ui=n=>({x:n.x,y:n.y,z:n.z}),Yt=(n,t)=>({x:n.x+t.x,y:n.y+t.y,z:n.z+t.z}),Ne=(n,t)=>({x:n.x-t.x,y:n.y-t.y,z:n.z-t.z}),kt=(n,t)=>({x:n.x*t,y:n.y*t,z:n.z*t});var Le=(n,t,e)=>({x:n.x+t.x*e,y:n.y+t.y*e,z:n.z+t.z*e}),Mi=(n,t)=>n.x*t.x+n.y*t.y+n.z*t.z,ha=(n,t)=>({x:n.y*t.z-n.z*t.y,y:n.z*t.x-n.x*t.z,z:n.x*t.y-n.y*t.x}),Hi=n=>Math.hypot(n.x,n.y,n.z),Gi=(n,t)=>Math.hypot(n.x-t.x,n.y-t.y,n.z-t.z),Cn=n=>Math.hypot(n.x,n.z),nn=(n,t,e)=>({x:n.x+(t.x-n.x)*e,y:n.y+(t.y-n.y)*e,z:n.z+(t.z-n.z)*e});function fn(n,t={x:0,y:0,z:-1}){let e=Hi(n);return e>1e-5?{x:n.x/e,y:n.y/e,z:n.z/e}:ui(t)}var sn=fn,Pn=(n=0,t=0)=>({x:n,y:t}),Ss=(n,t)=>({x:n.x+t.x,y:n.y+t.y});var Vi=(n,t)=>({x:n.x*t,y:n.y*t}),jc=(n,t)=>n.x*t.x+n.y*t.y,th=n=>Math.hypot(n.x,n.y);function ua(n,t={x:0,y:1}){let e=Math.hypot(n.x,n.y);return e>1e-5?{x:n.x/e,y:n.y/e}:{x:t.x,y:t.y}}var Me=(n,t,e)=>Math.min(Math.max(n,t),e),ki=(n,t,e)=>n+(t-n)*e;function Ht(n,t,e){let i=Me((e-n)/(t-n),0,1);return i*i*(3-2*i)}var Ae=n=>n-Math.floor(n),jt=(n=0,t=1)=>n+Math.random()*(t-n);function lr(n){let t=n;for(;t>Math.PI;)t-=2*Math.PI;for(;t<-Math.PI;)t+=2*Math.PI;return t}function Jn(){for(;;){let n={x:jt(-1,1),y:jt(-1,1),z:jt(-1,1)},t=Hi(n);if(t>.05&&t<=1)return kt(n,1/t)}}function hi(n,t,e=0){let i=Math.imul(n|0,374761393)+Math.imul(t|0,668265263)+Math.imul(e|0,-2048144777)|0;return i=Math.imul(i^i>>>13,1274126177),i^=i>>>16,(i&16777215)/16777216}var fl=(n,t)=>{let e=n%t;return e<0?e+t:e};function Px(n,t,e,i){let s=Math.floor(n),r=Math.floor(t),a=n-s,o=t-r;a=a*a*(3-2*a),o=o*o*(3-2*o);let l=fl(s,e),c=fl(s+1,e),h=fl(r,e),u=fl(r+1,e),d=hi(l,h,i),f=hi(c,h,i),m=hi(l,u,i),x=hi(c,u,i);return ki(ki(d,f,a),ki(m,x,a),o)}function Wi(n,t,e,i,s){let r=0,a=.5,o=e,l=0;for(let c=0;c<i;c++)r+=a*Px(n*o,t*o,o,s+c*17|0),l+=a,a*=.5,o*=2;return r/l}var Xi=n=>n<=0?0:n>=1?255:n*255+.5|0;function Ix(){return{h:.5,cr:.5,cg:.5,cb:.5,rough:.5,metal:1,er:0,eg:0,eb:0}}function Lx(n,t){let e=1.7320508,i=.5,s=e*.5,r=n-Math.floor(n)-i,a=t-e*Math.floor(t/e)-s,o=n-i,l=t-s,c=o-Math.floor(o)-i,h=l-e*Math.floor(l/e)-s,u=r*r+a*a<c*c+h*h,d=Math.abs(u?r:c),f=Math.abs(u?a:h);return .5-Math.max(d,d*.5+f*.8660254)}function Dx(n,t,e){let i=n*2,s=t*2,r=Math.floor(i),a=Math.floor(s),o=i-r,l=s-a,c=Math.min(o,1-o),h=Math.min(l,1-l),u=Math.min(c,h),d=Ht(.004,.016,u),f=hi(r,a,7),m=Ht(.1,.108,u),x=.25+.55*d,p=Wi(n,t,6,5,3),g=Wi(n,t,48,3,9),v=.7+.6*p,w=.135*v,y=.15*v,E=.18*v,A=.22+.4*p+.12*g;if(f<.5){let N=Math.abs(Ae(o*14)-.5),O=Math.abs(Ae(l*14)-.5),z=(Math.floor(o*14)+Math.floor(l*14)&1)===0?N*3+O:N+O*3,V=Ht(.42,.3,z)*m;x+=.1*V,A+=.08*V,w*=.9,y*=.9,E*=.9}else{x+=.05*m;let D=Math.min(Math.abs(o-.5),Math.abs(l-.5)),N=Ht(.003,.008,D);x-=.08*(1-N)*m,v=.8+.2*N,w*=v,y*=v,E*=v}let _=c-.055,T=h-.055,I=Math.sqrt(_*_+T*T),R=Ht(.02,.013,I);return x+=.18*R,v=R*.7,w+=(.22-w)*v,y+=(.23-y)*v,E+=(.25-E)*v,v=.35+.65*d,w*=v,y*=v,E*=v,A=ki(.85,A,d),e.h=x,e.cr=w,e.cg=y,e.cb=E,e.rough=Me(A,.08,1),e.metal=.35,e.er=0,e.eg=0,e.eb=0,e}function Nx(n,t,e,i){let s=1-t,r=Wi(n,t,5,5,21),a=Wi(n,t,40,3,5),o=.15,l=.165,c=.19,h=.5,u=.36+.3*r,d=.5,f=0,m=0,x=0,p;if(s<.08)h=.55+.1*Ht(.2,.35,Math.abs(Ae(s/.08*3)-.5)),o=.06,l=.065,c=.075;else if(s<.47){let g=(s-.08)/.39,v=n*2,w=Math.floor(v),y=v-w,E=Math.min(y,1-y)*2,A=Math.min(g,1-g)*1.56,_=Math.min(E,A),T=Ht(.008,.03,_),I=Ht(.14,.16,_);if(h=.3+.3*T+.08*I,hi(w,3,11)<.5){let R=Ht(.35,.37,E)*Ht(.3,.32,A),D=Ht(.15,.3,Math.abs(Ae(g*14)-.5));h-=R*.25*(1-D),p=R*(1-D),o+=(o*.35-o)*p,l+=(l*.35-l)*p,c+=(c*.35-c)*p}else{p=I*.7,o+=(.23-o)*p,l+=(.25-l)*p,c+=(.28-c)*p,d=ki(d,.3,I*.7);let R=y*2,D=g*1.56;R>.22&&R<.7&&D>.2&&D<.32&&(Ae((R+D)*9)<.5?(o=.75,l=.55,c=.06):(o=.04,l=.04,c=.04),d=.1)}p=.4+.6*T,o*=p,l*=p,c*=p}else if(s<.55){let g=(s-.47)/.08,v=Math.abs(g-.5);h=.2+.25*Ht(.38,.5,v),o=.03,l=.03,c=.035;let w=Math.min(Ae(n*4),1-Ae(n*4));p=Ht(.17,.1,v)*Ht(.03,.05,w),f=e.x*p,m=e.y*p,x=e.z*p,u=.6}else if(s<.94){let g=(s-.55)/.39,v=n*4,w=Math.floor(v),y=v-w,E=Math.min(y,1-y),A=Math.min(g,1-g)*1.56,_=Ht(.006,.025,Math.min(E,A)),T=hi(w,5,13);if(h=.3+.3*_+.1*T,p=.8+.4*T,o*=p,l*=p,c*=p,T>.7&&Math.abs(y-.5)<.1&&g>.8&&g<.84&&(f=1,m=.45,x=.1),T<.25){let I=Ht(.2,.3,Math.abs(Ae(y*8)-.5)),R=Ht(.2,.22,E)*Ht(.2,.22,A);h-=R*.2*(1-I),p=R*(1-I),o+=(o*.4-o)*p,l+=(l*.4-l)*p,c+=(c*.4-c)*p}p=.4+.6*_,o*=p,l*=p,c*=p}else h=.6+.08*Ht(.2,.35,Math.abs(Ae(n*16)-.5)),o=.08,l=.085,c=.1;return p=.75+.5*r,o*=p,l*=p,c*=p,u+=.1*a,p=.7+.3*Ht(0,.3,s),o*=p,l*=p,c*=p,i.h=h,i.cr=o,i.cg=l,i.cb=c,i.rough=Me(u,.1,1),i.metal=d,i.er=f,i.eg=m,i.eb=x,i}function Ux(n,t,e,i){let s=Wi(n,t,4,5,33),r=Math.abs(n-.5),a=.75+.5*s,o=.11*a,l=.12*a,c=.14*a,h=.6,u=0,d=0,f=0,m=Ae(t*4),x=Ht(0,.02,Math.min(m,1-m));if(h=.3+.3*x,a=.45+.55*x,o*=a,l*=a,c*=a,r<.09){h=.15,o=.02,l=.02,c=.025;let g=Ht(.04,.07,Math.min(Ae(t*2),1-Ae(t*2)));a=Ht(.04,.02,r)*g,u=e.x*a,d=e.y*a,f=e.z*a}else if(r>.3){let g=Ht(.2,.32,Math.abs(Ae(n*20)-.5));h-=.12*(1-g),a=.7+.3*g,o*=a,l*=a,c*=a}let p=Math.min(n,1-n);return h*=.6+.4*Ht(0,.03,p),i.h=h,i.cr=o,i.cg=l,i.cb=c,i.rough=.3+.3*s,i.metal=.85,i.er=u,i.eg=d,i.eb=f,i}function eh(n,t,e,i){let s=1-t,r=Math.min(n,1-n),a=Math.min(t,1-t),o=Math.min(r,a),l=Ht(.085,.075,o),c=Math.sin(n*2*Math.PI*7),h=Wi(n,t,20,4,55),u=Wi(n,t,3,4,8),d=ki(.42+.14*c,.8,l),f=.85+.3*u,m=e.x*f,x=e.y*f,p=e.z*f,g=.15,v=.5+.2*h;l<.5&&s>.14&&s<.26&&(Ae((n+s)*6)<.5?(m=.8,x=.6,p=.05):(m=.04,x=.04,p=.04)),l<.5&&s>.62&&s<.8&&n>.14&&n<.42&&(s>.73&&n<.4||s<.68&&n<.3)&&!(s>.68&&s<.73)&&(m+=(.78-m)*.85,x+=(.78-x)*.85,p+=(.74-p)*.85),l>.5&&(m=.14,x=.15,p=.16,g=.9,v=.35);let w=Ht(.66,.72,h+.24*(1-Ht(0,.14,o)));m+=(.3-m)*w,x+=(.3-x)*w,p+=(.31-p)*w,g=ki(g,1,w),v=ki(v,.3,w),d-=.03*w;let y=r-.04,E=a-.04,A=Math.sqrt(y*y+E*E);return d+=.15*Ht(.022,.014,A),i.h=d,i.cr=m,i.cg=x,i.cb=p,i.rough=v,i.metal=g,i.er=0,i.eg=0,i.eb=0,i}function Fx(n,t,e){let s=Math.floor(n*4),r=Math.floor(t*4),a=hi(Math.trunc(s/2),r,3)<.4,o=Ae(n*4),l=Ae(t*4);a&&(o=Ae(n*4/2));let c=Math.min(o,1-o)*(a?2:1),h=Math.min(l,1-l),u=Math.min(c,h),d=Ht(.01,.05,u),f=Wi(n,t,8,4,71);return e.h=.35+.4*d+.1*hi(s,r,9),e.cr=e.cg=e.cb=(.55+.4*f)*(.5+.5*d),e.rough=.25+.35*f,e.metal=1,e.er=0,e.eg=0,e.eb=0,e}function Ox(n,t,e){let s=Math.floor(n*6),r=Math.floor(t*6),a=Ae(n*6),o=Ae(t*6),l=hi(s,r,17),c=Math.min(Math.min(a,1-a),Math.min(o,1-o)),h=Ht(.02,.07,c),u=Wi(n,t,6,4,19),d=.7+.6*u,f=.1*d,m=.11*d,x=.13*d,p=.3+.3*h+.25*l,g=0,v=0,w=0;if(l>.86){let y=Ht(.14,.18,c),E=Ht(.3,.4,Math.abs(Ae(o*7)-.5))*(hi(Math.trunc(a*9),Math.trunc(o*7),s+5)>.4?1:.15);d=y*(.15+.85*E),g=.15*d,v=.85*d,w=1*d,f+=(.01-f)*y,m+=(.02-m)*y,x+=(.03-x)*y,p=ki(p,.35,y)}else if(l<.2){let y=Ht(.2,.3,Math.abs(Ae(o*6)-.5));p-=.2*(1-y)*h,d=.5+.5*y,f*=d,m*=d,x*=d}else if(l>.55&&l<.62){let y=a-.5,E=o-.5;d=Ht(.12,.08,Math.sqrt(y*y+E*E)),g=1*d,v=.35*d,w=.08*d}return d=.4+.6*h,f*=d,m*=d,x*=d,e.h=p,e.cr=f,e.cg=m,e.cb=x,e.rough=.3+.35*u,e.metal=.85,e.er=g,e.eg=v,e.eb=w,e}function Bx(n,t,e,i){let s=n*n,r=new Float32Array(s),a=new Float32Array(s*3),o=new Uint8Array(s*4).fill(255),l=new Uint8Array(s*4).fill(255),c=new Uint8Array(s*4).fill(255),h=e?new Uint8Array(s*4).fill(255):null,u=Ix();for(let d=0;d<n;d++){let f=(d+.5)/n,m=d*n,x=(n-1-d)*n;for(let p=0;p<n;p++){i((p+.5)/n,f,u);let g=m+p,v=(x+p)*4;r[g]=u.h,a[g*3]=u.cr,a[g*3+1]=u.cg,a[g*3+2]=u.cb,c[v+1]=Xi(u.rough),c[v+2]=Xi(u.metal),h&&(h[v]=Xi(u.er),h[v+1]=Xi(u.eg),h[v+2]=Xi(u.eb))}}for(let d=0;d<n;d++){let f=d*n,m=(n-1-d)*n,x=(d+n-1)%n*n,p=(d+1)%n*n,g=(d+n-3)%n*n,v=(d+3)%n*n;for(let w=0;w<n;w++){let y=(w+n-1)%n,E=(w+1)%n,A=(w+n-3)%n,_=(w+3)%n,T=f+w,I=(m+w)*4,R=r[T],D=(r[f+E]-r[f+y])*t,N=(r[p+w]-r[x+w])*t,O=1/Math.sqrt(D*D+N*N+1);l[I]=Xi(-D*O*.5+.5),l[I+1]=Xi(N*O*.5+.5),l[I+2]=Xi(O*.5+.5);let P=(r[f+_]+r[f+A]+r[v+w]+r[g+w])*.25,z=Me(1-(P-R)*2.2,.45,1.08);o[I]=Xi(a[T*3]*z),o[I+1]=Xi(a[T*3+1]*z),o[I+2]=Xi(a[T*3+2]*z)}}return{albedo:o,normal:l,orm:c,emission:h}}function zx(n,t,e,i){let s=new Uint8Array(n*t*4).fill(255);for(let r=0;r<t;r++){let a=(r+.5)/t,o=(t-1-r)*n;for(let l=0;l<n;l++){let c=Xi(i((l+.5)/n,a)),h=(o+l)*4;e?s[h+3]=c:(s[h]=c,s[h+1]=c,s[h+2]=c)}}return s}function da(n,t,e,i,s,r,a){let o=new kn(t,e,i,pi,li);return o.name=n,o.colorSpace=s?De:ji,o.wrapS=o.wrapT=r?qs:Oi,o.magFilter=Ue,o.minFilter=Ri,o.generateMipmaps=!0,o.anisotropy=a,o.needsUpdate=!0,o}function Kn(n,t,e,i,s){let r=Bx(t,e,i,s);return{name:n,map:da(`${n}.albedo`,r.albedo,t,t,!0,!0,8),normalMap:da(`${n}.normal`,r.normal,t,t,!1,!0,8),ormMap:da(`${n}.orm`,r.orm,t,t,!1,!0,8),emissiveMap:r.emission?da(`${n}.emission`,r.emission,t,t,!0,!0,8):null}}function Qn(n,t,e,i,s,r=!1){return da(n,zx(t,e,i,s),t,e,!0,r,r?8:1)}var pl=(n,t)=>Math.sqrt((n-.5)*(n-.5)+(t-.5)*(t-.5))*2,jn={glow:(n,t)=>Math.pow(Math.max(1-pl(n,t),0),2.2),softDot:(n,t)=>Math.pow(Math.max(1-pl(n,t),0),1.6),ring(n,t){let e=pl(n,t),i=(e-.82)/.07;return Math.exp(-i*i)+.25*Math.pow(Math.max(1-e/.82,0),.5)*(e<.82?1:0)},flare(n,t){let e=(n-.5)*2,i=(t-.5)*2,s=Math.sqrt(e*e+i*i),r=Math.atan2(i,e),a=Math.pow(Math.abs(Math.cos(r*2.5+.4)),10)*.9+Math.pow(Math.abs(Math.cos(r*4+1.3)),24)*.5;return Math.pow(Math.max(1-s*2.2,0),2)*1.4+a*Math.pow(Math.max(1-s,0),2.5)},smoke(n,t){let e=pl(n,t),i=Wi(n,t,4,4,91);return Math.pow(Math.max(1-e,0),1.3)*Ht(.25,.75,i+.3*(1-e))*.9},shaft(n,t){let e=Math.sin(n*Math.PI);return Math.pow(1-t,1.8)*(.35+.65*e)},hex(n,t){let e=Lx(n*6,t*6*1.1547),i=Ht(.07,0,e),s=Wi(n,t,6,2,4);return i+.12*s},scan:(n,t)=>.55+.45*Math.sin(t*256*.8)},ut={sunDir:fn(M(.48,.66,.42)),planetDir:fn(M(-.5,.5,-.7)),floor:null,wallCyan:null,pillar:null,crateOrange:null,crateTeal:null,crateGrey:null,plating:null,tech:null,glow:null,softDot:null,ring:null,flare:null,smoke:null,shaft:null,hex:null,scan:null};function kx(){return new Promise(n=>{let t=!1,e=()=>{t||(t=!0,n())};typeof requestAnimationFrame=="function"&&requestAnimationFrame(()=>setTimeout(e,0)),setTimeout(e,40)})}var ih=null;function Sd(n=null){return ih||(ih=Hx(n)),ih}async function Hx(n){let t=M(.25,.9,1),e=M(.55,.25,.08),i=M(.09,.29,.32),s=M(.32,.34,.37),r=[["Bodenplatten",1024*1024,()=>{ut.floor=Kn("floor",1024,5,!1,Dx)}],["Wandpaneele",1024*1024,()=>{ut.wallCyan=Kn("wallCyan",1024,5,!0,(l,c,h)=>Nx(l,c,t,h))}],["S\xE4ulen",512*512,()=>{ut.pillar=Kn("pillar",512,5,!0,(l,c,h)=>Ux(l,c,t,h))}],["Frachtcontainer",512*512,()=>{ut.crateOrange=Kn("crateOrange",512,5,!1,(l,c,h)=>eh(l,c,e,h))}],["Frachtcontainer",512*512,()=>{ut.crateTeal=Kn("crateTeal",512,5,!1,(l,c,h)=>eh(l,c,i,h))}],["Frachtcontainer",512*512,()=>{ut.crateGrey=Kn("crateGrey",512,5,!1,(l,c,h)=>eh(l,c,s,h))}],["Panzerplatten",512*512,()=>{ut.plating=Kn("plating",512,4,!1,Fx)}],["Technikmodule",512*512,()=>{ut.tech=Kn("tech",512,5,!0,Ox)}],["Lichteffekte",512*512,()=>{ut.glow=Qn("glow",128,128,!1,jn.glow),ut.softDot=Qn("softDot",64,64,!0,jn.softDot),ut.ring=Qn("ring",256,256,!1,jn.ring),ut.flare=Qn("flare",256,256,!1,jn.flare),ut.smoke=Qn("smoke",128,128,!0,jn.smoke),ut.shaft=Qn("shaft",64,256,!1,jn.shaft),ut.hex=Qn("hex",512,512,!1,jn.hex,!0),ut.scan=Qn("scan",8,256,!1,jn.scan)}]],a=r.reduce((l,c)=>l+c[1],0),o=0;for(let[l,c,h]of r)n&&n(o/a,l),await kx(),h(),o+=c;return n&&n(1,"Bereit"),ut}var fa=new F;function qi(n,t,e,i,s,r){let a=2*Math.PI*s/4,o=Math.max(r-2*s,0),l=Math.PI/4;fa.copy(t),fa[i]=0,fa.normalize();let c=.5*a/(a+o),h=1-fa.angleTo(n)/l;return Math.sign(fa[e])===1?h*c:o/(a+o)+c+c*(1-h)}var ml=class n extends zi{constructor(t=1,e=1,i=1,s=2,r=.1){let a=s*2+1;if(r=Math.min(t/2,e/2,i/2,r),super(1,1,1,a,a,a),this.type="RoundedBoxGeometry",this.parameters={width:t,height:e,depth:i,segments:s,radius:r},a===1)return;let o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;let l=new F,c=new F,h=new F(t,e,i).divideScalar(2).subScalar(r),u=this.attributes.position.array,d=this.attributes.normal.array,f=this.attributes.uv.array,m=u.length/6,x=new F,p=.5/a;for(let g=0,v=0;g<u.length;g+=3,v+=2)switch(l.fromArray(u,g),c.copy(l),c.x-=Math.sign(c.x)*p,c.y-=Math.sign(c.y)*p,c.z-=Math.sign(c.z)*p,c.normalize(),u[g+0]=h.x*Math.sign(l.x)+c.x*r,u[g+1]=h.y*Math.sign(l.y)+c.y*r,u[g+2]=h.z*Math.sign(l.z)+c.z*r,d[g+0]=c.x,d[g+1]=c.y,d[g+2]=c.z,Math.floor(g/m)){case 0:x.set(1,0,0),f[v+0]=qi(x,c,"z","y",r,i),f[v+1]=1-qi(x,c,"y","z",r,e);break;case 1:x.set(-1,0,0),f[v+0]=1-qi(x,c,"z","y",r,i),f[v+1]=1-qi(x,c,"y","z",r,e);break;case 2:x.set(0,1,0),f[v+0]=1-qi(x,c,"x","z",r,t),f[v+1]=qi(x,c,"z","x",r,i);break;case 3:x.set(0,-1,0),f[v+0]=1-qi(x,c,"x","z",r,t),f[v+1]=1-qi(x,c,"z","x",r,i);break;case 4:x.set(0,0,1),f[v+0]=1-qi(x,c,"x","y",r,t),f[v+1]=1-qi(x,c,"y","x",r,e);break;case 5:x.set(0,0,-1),f[v+0]=qi(x,c,"x","y",r,t),f[v+1]=1-qi(x,c,"y","x",r,e);break}}static fromJSON(t){return new n(t.width,t.height,t.depth,t.segments,t.radius)}};var pa=1;function Yi(n,t=1){return new Dt().setRGB(n.x,n.y,n.z,De).multiplyScalar(t)}function te(n,t){return n.position.set(t.x,t.y,t.z),n}var Gx=new F(0,0,1),r1=new F(0,1,0),Vx=new F;function cr(n,t){let e=fn(t);return n.quaternion.setFromUnitVectors(Gx,Vx.set(e.x,e.y,e.z)),n}var bd=new Map,wd=new Map;function Wx(n){let t=wd.get(n);if(!t){let e=i=>{let s=i.clone();return s.repeat.set(n,n),s.needsUpdate=!0,s};t={normal:e(ut.plating.normalMap),orm:e(ut.plating.ormMap)},wd.set(n,t)}return t}var Kt={pbr(n,t=2.2){let e=`${n.name}|${t}`,i=bd.get(e);return i||(i=new Vn({map:n.map,normalMap:n.normalMap,roughnessMap:n.ormMap,metalnessMap:n.ormMap,roughness:1,metalness:1}),n.emissiveMap&&t>0&&(i.emissiveMap=n.emissiveMap,i.emissive=new Dt(1,1,1),i.emissiveIntensity=t),bd.set(e,i),i)},metal(n,{rough:t=.35,metal:e=1,plating:i=1}={}){let s=new Vn({color:Yi(n),metalness:e,roughness:t});if(i>0){let r=Wx(i);s.normalMap=r.normal,s.normalScale.set(.8,.8),s.roughnessMap=r.orm,s.roughness=Math.min(t/.42,2.4)}return s},glow(n,t=3){return new Tn({color:Yi(n,t)})},additive(n,t,e=1,i=!0){return new Tn({map:n||null,color:Yi(t,e),blending:hn,transparent:!0,depthWrite:!1,depthTest:i,side:vi,fog:!1})}},et={box(n,t,e,i=0){return i>0?new ml(n,t,e,2,Math.min(i,Math.min(n,t,e)*.49)):new zi(n,t,e)},sphere(n,t=24){return new Gn(n,t,Math.max(8,Math.round(t*.66)))},cyl(n,t,e=24){return new ds(n,n,t,e)},capsule(n,t){return new Wr(n,Math.max(t-2*n,.001),8,16)},cone(n,t,e,i=24){return new ds(n,t,e,i)},torus(n,t){return new qr(n,t,12,48).rotateX(Math.PI/2)},plane(n,t){return new oi(n,t)},pyramid(n,t,e){let i=new Xr(Math.SQRT1_2,1,4,1).rotateY(Math.PI/4);return i.translate(0,.5,0),i.scale(n,t,e),i.computeVertexNormals(),i},tileUV(n,t,e=t){n.computeBoundingBox();let i=n.boundingBox.min,s=n.boundingBox.max,r=n.attributes.position,a=n.attributes.normal,o=n.attributes.uv;for(let l=0;l<r.count;l++){let c=r.getX(l)-i.x,h=r.getY(l)-s.y,u=r.getZ(l)-i.z,d=Math.abs(a.getX(l)),f=Math.abs(a.getY(l)),m=Math.abs(a.getZ(l));f>=d&&f>=m?o.setXY(l,c/t,u/t):d>=m?o.setXY(l,u/t,h/e):o.setXY(l,c/t,h/e)}return o.needsUpdate=!0,n},tiledBox(n,t,e,i,s=i,r=0){return et.tileUV(et.box(n,t,e,r),i,s)},part(n,t,e,i,{rot:s=null,shadow:r=!0}={}){let a=new Qt(t,e);return a.position.set(i.x,i.y,i.z),s&&a.rotation.set(s.x,s.y,s.z),a.castShadow=r,a.receiveShadow=!1,n.add(a),a},glowSprite(n,t,e=1,i=null){let s=new kr(new js({map:i||ut.glow,color:Yi(t,e),blending:hn,transparent:!0,depthWrite:!1,fog:!1}));return s.scale.set(n,n,1),s}};function ma(n){return n.layers.enable(pa),n}var ga=class n extends Qt{constructor(t,e={}){super(t),this.isReflector=!0,this.type="Reflector",this.forceUpdate=!1,this._reflectionCameras=new WeakMap;let i=this,s=e.color!==void 0?new Dt(e.color):new Dt(8355711),r=e.textureWidth||512,a=e.textureHeight||512,o=e.clipBias||0,l=e.shader||n.ReflectorShader,c=e.multisample!==void 0?e.multisample:4,h=new Ei,u=new F,d=new F,f=new F,m=new pe,x=new F(0,0,-1),p=new ye,g=new F,v=new F,w=new ye,y=new pe,E=new Pe(r,a,{samples:c,type:Ie}),A=new ge({name:l.name!==void 0?l.name:"unspecified",uniforms:tn.clone(l.uniforms),fragmentShader:l.fragmentShader,vertexShader:l.vertexShader});A.uniforms.tDiffuse.value=E.texture,A.uniforms.color.value=s,A.uniforms.textureMatrix.value=y,this.material=A,this.onBeforeRender=function(_,T,I){let R=this.getReflectionCamera(I);if(d.setFromMatrixPosition(i.matrixWorld),f.setFromMatrixPosition(I.matrixWorld),m.extractRotation(i.matrixWorld),u.set(0,0,1),u.applyMatrix4(m),g.subVectors(d,f),g.dot(u)>0===!0&&this.forceUpdate===!1)return;g.reflect(u).negate(),g.add(d),m.extractRotation(I.matrixWorld),x.set(0,0,-1),x.applyMatrix4(m),x.add(f),v.subVectors(d,x),v.reflect(u).negate(),v.add(d),R.position.copy(g),R.up.set(0,1,0),R.up.applyMatrix4(m),R.up.reflect(u),R.lookAt(v),R.far=I.far,R.updateMatrixWorld(),R.projectionMatrix.copy(I.projectionMatrix),R.projectionMatrix.elements[8]*=-1,R.projectionMatrix.elements[12]*=-1,y.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),y.multiply(R.projectionMatrix),y.multiply(R.matrixWorldInverse),y.multiply(i.matrixWorld),h.setFromNormalAndCoplanarPoint(u,d),h.applyMatrix4(R.matrixWorldInverse),p.set(h.normal.x,h.normal.y,h.normal.z,h.constant);let N=R.projectionMatrix;R.isOrthographicCamera?(w.x=(Math.sign(p.x)+N.elements[8])/N.elements[0],w.y=(Math.sign(p.y)+N.elements[9])/N.elements[5],w.z=-I.far,w.w=1):(w.x=(Math.sign(p.x)+N.elements[8])/N.elements[0],w.y=(Math.sign(p.y)+N.elements[9])/N.elements[5],w.z=-1,w.w=(1+N.elements[10])/N.elements[14]),p.multiplyScalar(2/p.dot(w)),N.elements[2]=p.x,N.elements[6]=p.y,R.isOrthographicCamera?(N.elements[10]=p.z-o,N.elements[14]=p.w-1):(N.elements[10]=p.z+1-o,N.elements[14]=p.w),i.visible=!1;let O=_.getRenderTarget(),P=_.xr.enabled,z=_.shadowMap.autoUpdate;_.xr.enabled=!1,_.shadowMap.autoUpdate=!1,_.setRenderTarget(E),_.state.buffers.depth.setMask(!0),_.autoClear===!1&&_.clear(),_.render(T,R),_.xr.enabled=P,_.shadowMap.autoUpdate=z,_.setRenderTarget(O);let V=I.viewport;V!==void 0&&_.state.viewport(V),i.visible=!0,this.forceUpdate=!1},this.getRenderTarget=function(){return E},this.dispose=function(){E.dispose(),i.material.dispose()},this.getReflectionCamera=function(_){let T=this._reflectionCameras.get(_);return T===void 0&&(T=_.clone(),this._reflectionCameras.set(_,T)),T}}};ga.ReflectorShader={name:"ReflectorShader",uniforms:{color:{value:null},tDiffuse:{value:null},textureMatrix:{value:null}},vertexShader:`
		uniform mat4 textureMatrix;
		varying vec4 vUv;

		#include <common>
		#include <logdepthbuf_pars_vertex>

		void main() {

			vUv = textureMatrix * vec4( position, 1.0 );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			#include <logdepthbuf_vertex>

		}`,fragmentShader:`
		uniform vec3 color;
		uniform sampler2D tDiffuse;
		varying vec4 vUv;

		#include <logdepthbuf_pars_fragment>

		float blendOverlay( float base, float blend ) {

			return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );

		}

		vec3 blendOverlay( vec3 base, vec3 blend ) {

			return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );

		}

		void main() {

			#include <logdepthbuf_fragment>

			vec4 base = texture2DProj( tDiffuse, vUv );
			gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`};function Ed(n,t=!1){let e=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),s=new Set(Object.keys(n[0].morphAttributes)),r={},a={},o=n[0].morphTargetsRelative,l=new $e;l.morphTargetsRelative=o;let c=0;for(let h=0;h<n.length;++h){let u=n[h],d=0,f=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let m in u.attributes){if(!i.has(m))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+m+'" attribute exists among all geometries, or in none of them.'),null;r[m]===void 0&&(r[m]=[]),r[m].push(u.attributes[m]),d++}if(d!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let m in u.morphAttributes){if(!s.has(m))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;if(u.morphAttributes[m].length!==n[0].morphAttributes[m].length)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have the same number of morph targets for the "'+m+'" morph attribute.'),null;a[m]===void 0&&(a[m]=[]),a[m].push(u.morphAttributes[m]),f++}if(f!==s.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of morph attributes."),null;if(t){let m;if(e)m=u.index.count;else if(u.attributes.position!==void 0)m=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,m,h),c+=m}}if(e){let h=0,u=[];for(let d=0;d<n.length;++d){let f=n[d].index;for(let m=0;m<f.count;++m)u.push(f.getX(m)+h);h+=n[d].attributes.position.count}l.setIndex(u)}for(let h in r){let u=Td(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(let h in a){let u=a[h][0].length;if(u!==0){l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let d=0;d<u;++d){let f=[];for(let x=0;x<a[h].length;++x)f.push(a[h][x][d]);let m=Td(f);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(m)}}}return l}function Td(n){let t,e,i,s=-1,r=0;for(let c=0;c<n.length;++c){let h=n[c];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=h.normalized),i!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}let a=new t(r),o=new xi(a,e,i),l=0;for(let c=0;c<n.length;++c){let h=n[c];if(h.isInterleavedBufferAttribute){let u=l/e;for(let d=0,f=h.count;d<f;d++)for(let m=0;m<e;m++){let x=h.getComponent(d,m);o.setComponent(d+u,m,x)}}else a.set(h.array,l);l+=h.count*e}return s!==void 0&&(o.gpuType=s),o}var Ad=`
  uint hashU(int x, int y, int z, int s) {
    uint h = uint(x) * 374761393u + uint(y) * 668265263u;
    h = h + uint(z) * 1440662683u + uint(s) * 2246822519u;
    h = (h ^ (h >> 13u)) * 1274126177u;
    h ^= h >> 16u;
    return h;
  }
  float hash3(int x, int y, int z, int s) { return float(hashU(x, y, z, s) & 0xFFFFFFu) / 16777216.0; }
  float sstep(float e0, float e1, float x) { float t = clamp((x - e0) / (e1 - e0), 0.0, 1.0); return t * t * (3.0 - 2.0 * t); }
  float vnoise3(vec3 p, int seed) {
    vec3 pf = floor(p);
    ivec3 i = ivec3(pf);
    vec3 f = p - pf;
    f = f * f * (3.0 - 2.0 * f);
    float x00 = mix(hash3(i.x, i.y, i.z, seed), hash3(i.x + 1, i.y, i.z, seed), f.x);
    float x10 = mix(hash3(i.x, i.y + 1, i.z, seed), hash3(i.x + 1, i.y + 1, i.z, seed), f.x);
    float x01 = mix(hash3(i.x, i.y, i.z + 1, seed), hash3(i.x + 1, i.y, i.z + 1, seed), f.x);
    float x11 = mix(hash3(i.x, i.y + 1, i.z + 1, seed), hash3(i.x + 1, i.y + 1, i.z + 1, seed), f.x);
    return mix(mix(x00, x10, f.y), mix(x01, x11, f.y), f.z);
  }
  float fbm3(vec3 p, int octaves, int seed) {
    float sum = 0.0, amp = 0.5, n = 0.0;
    vec3 q = p;
    for (int o = 0; o < 6; o++) {
      if (o >= octaves) break;
      sum += amp * vnoise3(q, seed + o * 31);
      n += amp; amp *= 0.5;
      q = q * 2.03 + vec3(11.3, 7.7, 3.1);
    }
    return sum / n;
  }
  vec3 srgbToLinear(vec3 c) {
    return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(vec3(0.04045), c));
  }
`,Xx=`
  uniform vec3 uSun;
  uniform vec3 uPlanet;
  varying vec3 vDir;
  ${Ad}
  void main() {
    vec3 d = normalize(vDir);
    const float ang = 0.30;
    const float D = 10.0;
    float R = D * sin(ang);
    vec3 C = uPlanet * D;
    vec3 axis = normalize(vec3(0.35, 1.0, 0.25));
    vec3 bandAxis = normalize(vec3(0.3, 0.8, -0.5));

    // deep space + nebula
    vec3 q = d * 2.2;
    float n = fbm3(q + vec3(3.0, 1.0, 7.0), 5, 40);
    float n2 = fbm3(q * 1.7 + vec3(n * 2.5, 0.0, n * 2.5), 5, 77);
    float bv = dot(d, bandAxis) * 2.2;
    float band = exp(-bv * bv);
    float dens = sstep(0.42, 0.78, n2) * sstep(0.3, 0.7, n) * (0.25 + 0.75 * band);
    float hue = fbm3(q * 0.8 + vec3(9.0), 3, 12);
    vec3 neb = mix(vec3(0.05, 0.13, 0.45), vec3(0.60, 0.10, 0.42), sstep(0.35, 0.65, hue));
    neb += vec3(0.10, 0.55, 0.55) * pow(dens, 3.0);
    vec3 col = vec3(0.012, 0.016, 0.035) + neb * dens * 1.7;
    col += vec3(0.03, 0.045, 0.10) * band * 0.8;

    // sun
    float s = max(dot(d, uSun), 0.0);
    col += vec3(1.0, 0.92, 0.78) * (sstep(0.9994, 0.9998, s) * 3.0 + pow(s, 900.0) * 1.2 + pow(s, 70.0) * 0.22 + pow(s, 8.0) * 0.04);

    float cover = 0.0;
    // ringed gas giant
    float b = dot(d, C);
    float disc = b * b - (dot(C, C) - R * R);
    float tPlanet = 1e30;
    if (disc > 0.0 && b > 0.0) {
      float t = b - sqrt(disc);
      tPlanet = t;
      vec3 p = d * t;
      vec3 nrm = normalize(p - C);
      float lit = sstep(-0.12, 0.45, dot(nrm, uSun));
      float lat = dot(nrm, axis);
      float turb = fbm3(nrm * 3.0 + vec3(0.0, lat * 5.0, 0.0), 4, 5);
      float bandv = sin(lat * 19.0 + turb * 5.5) * 0.5 + 0.5;
      vec3 pc = mix(vec3(0.80, 0.47, 0.25), vec3(0.96, 0.82, 0.62), bandv);
      pc = mix(pc, vec3(0.42, 0.22, 0.22), sstep(0.5, 0.75, fbm3(nrm * 5.0 + vec3(4.0, lat * 9.0, 2.0), 4, 6)));
      float storm = sstep(0.16, 0.0, length(nrm - normalize(vec3(0.5, 0.25, 0.83))));
      pc = mix(pc, vec3(0.95, 0.55, 0.35), storm * 0.7);
      float rim = pow(1.0 - max(dot(nrm, -d), 0.0), 3.0);
      col = pc * lit * 0.95 + vec3(0.35, 0.6, 1.0) * rim * (0.15 + lit) * 0.9 + vec3(0.006, 0.01, 0.02);
      cover = 1.0;
    } else {
      float a = acos(clamp(dot(d, uPlanet), -1.0, 1.0));
      vec3 e = d - uPlanet * dot(d, uPlanet);
      vec3 en = length(e) > 1e-5 ? normalize(e) : vec3(0.0, 0.0, -1.0);
      float f = clamp(dot(en, uSun) * 0.6 + 0.6, 0.0, 1.0);
      col += vec3(0.25, 0.45, 0.95) * exp(-(a - ang) / 0.02) * 0.55 * f;
    }
    // rings
    float dn = dot(d, axis);
    if (abs(dn) > 1e-4) {
      float t = dot(C, axis) / dn;
      if (t > 0.0 && t < tPlanet) {
        vec3 p = d * t;
        float rr = length(p - C) / R;
        if (rr > 1.35 && rr < 2.4) {
          float x = (rr - 1.35) / 1.05;
          float a = (0.45 + 0.55 * sin(rr * 46.0)) * (0.6 + 0.4 * sin(rr * 13.0 + 1.0));
          a *= sstep(0.0, 0.04, x) * sstep(1.0, 0.9, x);
          a *= (rr > 1.93 && rr < 1.99) ? 0.08 : 1.0;
          // planet shadow across the ring
          vec3 pc = p - C;
          float along = dot(pc, uSun);
          float perp = length(pc - uSun * along);
          float shadow = (along < 0.0 && perp < R) ? 0.12 : 1.0;
          vec3 rc = mix(vec3(0.85, 0.75, 0.62), vec3(0.6, 0.5, 0.45), x);
          float k = clamp(a * 0.75, 0.0, 1.0);
          col = mix(col, rc * shadow, k);
          cover = max(cover, k);
        }
      }
    }
    gl_FragColor = vec4(col, cover);
  }
`,qx=`
  varying vec3 vDir;
  void main() {
    vDir = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Yx=`
  varying vec3 vWorld;
  void main() {
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWorld = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
    gl_Position.z = gl_Position.w;   // always at the far plane
  }
`,Zx=`
  uniform samplerCube uBase;
  uniform float uIntensity;
  varying vec3 vWorld;
  ${Ad}
  vec3 starLayer(vec3 d, float k, float thresh, int seed, float pix) {
    vec3 p = d * k;
    vec3 c = floor(p);
    ivec3 i = ivec3(c);
    float h = hash3(i.x, i.y, i.z, seed);
    if (h < thresh) return vec3(0.0);
    vec3 sp = c + vec3(0.25 + 0.5 * hash3(i.x, i.y, i.z, seed + 1),
                       0.25 + 0.5 * hash3(i.x, i.y, i.z, seed + 2),
                       0.25 + 0.5 * hash3(i.x, i.y, i.z, seed + 3));
    float r = 0.05 + 0.09 * hash3(i.x, i.y, i.z, seed + 4);
    // never smaller than ~1.3 pixels (energy preserving), so stars do not shimmer when the view turns
    float rr = max(r, pix * k * 1.3);
    float b = sstep(rr, 0.0, length(p - sp)) * (r * r) / (rr * rr);
    float tint = hash3(i.x, i.y, i.z, seed + 5);
    vec3 colr = mix(vec3(0.7, 0.8, 1.0), vec3(1.0, 0.85, 0.7), tint);
    return colr * b * b * (0.5 + 1.2 * hash3(i.x, i.y, i.z, seed + 6));
  }
  void main() {
    vec3 d = normalize(vWorld - cameraPosition);
    vec4 base = textureCube(uBase, d);
    float pix = length(fwidth(d));
    vec3 stars = starLayer(d, 150.0, 0.72, 1, pix) * 1.5 + starLayer(d, 340.0, 0.80, 2, pix) * 1.0;
    vec3 col = base.rgb + stars * (1.0 - base.a);
    gl_FragColor = vec4(srgbToLinear(clamp(col, 0.0, 1.0)) * uIntensity, 1.0);
  }
`;function $x(n,t){let e=new Ms(t,{type:Ie,generateMipmaps:!0,minFilter:Ri,magFilter:Ue}),i=new us,s=new ge({uniforms:{uSun:{value:new F(ut.sunDir.x,ut.sunDir.y,ut.sunDir.z)},uPlanet:{value:new F(ut.planetDir.x,ut.planetDir.y,ut.planetDir.z)}},vertexShader:qx,fragmentShader:Xx,side:Je,depthTest:!1,depthWrite:!1}),r=new Gn(1,64,32);i.add(new Qt(r,s));let a=new Yn(.01,10,e),o=n.toneMapping;return n.toneMapping=yi,a.update(n,i),n.toneMapping=o,r.dispose(),s.dispose(),e}function Jx(n){let t=n.y,e=t<0?M(.03,.033,.04):nn(M(.1,.11,.14),M(.03,.035,.06),t),i=Math.atan2(n.x,-n.z),s=Ae(i/(2*Math.PI)*8+.5),r=Ht(.12,.2,s)*Ht(.88,.8,s),a=Math.floor(i/(2*Math.PI)*8+.5+8)%8,o=a%2===0?M(.15,.85,1):M(1,.25,.65),l=r*Ht(.06,.12,t)*Ht(.3,.22,t)*.9;e=M(e.x+o.x*l,e.y+o.y*l,e.z+o.z*l);let c=r*Ht(.5,.55,t)*Ht(.66,.6,t)*(a%4===1?1:0);e=M(e.x+1*c,e.y+.6*c,e.z+.25*c);let h=Ht(.86,.95,t)*1.1;e=M(e.x+.9*h,e.y+.95*h,e.z+1*h);let u=Math.max(Mi(n,ut.sunDir),0),d=Math.pow(u,40)*1.5;return e=M(e.x+1*d,e.y+.9*d,e.z+.75*d),e}var nh=n=>n<=.04045?n/12.92:Math.pow((n+.055)/1.055,2.4);function Kx(n,t){let e=new Float32Array(n*t*4);for(let s=0;s<t;s++){let r=((s+.5)/t-.5)*Math.PI,a=Math.sin(r),o=Math.cos(r);for(let l=0;l<n;l++){let c=((l+.5)/n-.5)*2*Math.PI,h={x:Math.cos(c)*o,y:a,z:Math.sin(c)*o},u=Jx(h),d=(s*n+l)*4;e[d]=nh(Me(u.x,0,1)),e[d+1]=nh(Me(u.y,0,1)),e[d+2]=nh(Me(u.z,0,1)),e[d+3]=1}}let i=new kn(e,n,t,pi,Ci);return i.mapping=nr,i.colorSpace=hs,i.magFilter=Ue,i.minFilter=Ue,i.needsUpdate=!0,i}function Rd(n,t){let e=$x(n,1024),i=new ge({uniforms:{uBase:{value:e.texture},uIntensity:{value:1.7}},vertexShader:Yx,fragmentShader:Zx,side:Je,depthWrite:!1,depthTest:!0,fog:!1}),s=new Qt(new Gn(400,48,24),i);s.name="sky",s.renderOrder=-1e3,s.frustumCulled=!1,s.castShadow=!1,s.receiveShadow=!1,s.onBeforeRender=(l,c,h)=>{s.position.setFromMatrixPosition(h.matrixWorld),s.updateMatrixWorld(!0)},t.add(s);let r=Kx(512,256),a=new ar(n),o=a.fromEquirectangular(r);return a.dispose(),r.dispose(),t.environment=o.texture,t.environmentIntensity=1,t.background=null,{mesh:s,update(l){s.position.setFromMatrixPosition(l.matrixWorld)},setIntensity(l){i.uniforms.uIntensity.value=l},dispose(){s.removeFromParent(),s.geometry.dispose(),i.dispose(),e.dispose(),o.dispose()}}}var Qx=-16,jx=`
  attribute vec3 iPos;
  attribute vec3 iVel;
  attribute vec4 iColor;
  attribute vec2 iSizeRot;   // size, rotation
  attribute float iStretch;
  varying vec2 vUv;
  varying vec4 vColor;
  #include <fog_pars_vertex>
  void main() {
    vUv = uv;
    vColor = iColor;
    vec4 mv = viewMatrix * vec4(iPos, 1.0);
    vec2 corner = position.xy;          // -0.5 .. 0.5
    float size = iSizeRot.x;
    vec2 axisX = vec2(cos(iSizeRot.y), sin(iSizeRot.y));
    vec2 axisY = vec2(-axisX.y, axisX.x);
    vec2 offset;
    if (iStretch > 0.0) {
      // velocity-aligned streak in view space
      vec3 vv = (viewMatrix * vec4(iVel, 0.0)).xyz;
      float sp = length(vv.xy);
      vec2 dir = sp > 1e-4 ? vv.xy / sp : vec2(1.0, 0.0);
      vec2 perp = vec2(-dir.y, dir.x);
      float lenA = size + length(iVel) * iStretch;
      offset = dir * corner.x * lenA + perp * corner.y * size;
    } else {
      offset = (axisX * corner.x + axisY * corner.y) * size;
    }
    mv.xy += offset;
    gl_Position = projectionMatrix * mv;
    vec4 mvPosition = mv;
    #include <fog_vertex>
  }
`,t_=`
  uniform sampler2D map;
  uniform float additive;
  varying vec2 vUv;
  varying vec4 vColor;
  #include <fog_pars_fragment>
  void main() {
    vec4 t = texture2D(map, vUv);
    vec4 c = vec4(vColor.rgb * t.rgb, vColor.a * t.a);
    if (c.a < 0.002) discard;
    gl_FragColor = c;
    #include <fog_fragment>
  }
`,e_={softDot:3e3,glow:1500,smoke:600},rh=class{constructor(t,e,i){let s=e_[e]||1e3;this.cap=s,this.count=0;let r=new oi(1,1),a=new Qr;a.index=r.index,a.setAttribute("position",r.getAttribute("position")),a.setAttribute("uv",r.getAttribute("uv")),this.pos=new Float32Array(s*3),this.vel=new Float32Array(s*3),this.col=new Float32Array(s*4),this.sr=new Float32Array(s*2),this.st=new Float32Array(s);let o=(c,h)=>{let u=new tr(c,h);return u.setUsage(Oc),u};this.aPos=o(this.pos,3),this.aVel=o(this.vel,3),this.aCol=o(this.col,4),this.aSR=o(this.sr,2),this.aSt=o(this.st,1),a.setAttribute("iPos",this.aPos),a.setAttribute("iVel",this.aVel),a.setAttribute("iColor",this.aCol),a.setAttribute("iSizeRot",this.aSR),a.setAttribute("iStretch",this.aSt),a.instanceCount=0;let l=i!=="alpha";this.material=new ge({uniforms:tn.merge([gt.fog,{map:{value:ut[e]},additive:{value:l?1:0}}]),vertexShader:jx,fragmentShader:t_,transparent:!0,depthWrite:!1,blending:l?hn:cn,fog:!l}),this.mesh=new Qt(a,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=l?40:35,this.mesh.name=`particles:${e}:${i}`,t.add(this.mesh),this.geometry=a,this.parts=[]}add(t){this.parts.length>=this.cap&&this.parts.shift(),this.parts.push(t)}update(t){let e=this.parts,i=0;for(let h=0;h<e.length;h++){let u=e[h];if(u.age+=t,u.age>=u.life)continue;let d=Math.exp(-u.damp*t);u.vx=u.vx*d+u.ax*t,u.vy=u.vy*d+(u.ay+(u.grav?Qx:0))*t,u.vz=u.vz*d+u.az*t,u.x+=u.vx*t,u.y+=u.vy*t,u.z+=u.vz*t,u.rot+=u.av*t,e[i++]=u}e.length=i;let s=Math.min(i,this.cap),r=this.pos,a=this.vel,o=this.col,l=this.sr,c=this.st;for(let h=0;h<s;h++){let u=e[h],d=u.age/u.life,f=u.opacity?Cd(u.opacity,d):1,m=u.sizeCurve?Cd(u.sizeCurve,d):1;r[h*3]=u.x,r[h*3+1]=u.y,r[h*3+2]=u.z,a[h*3]=u.vx,a[h*3+1]=u.vy,a[h*3+2]=u.vz,o[h*4]=u.r,o[h*4+1]=u.g,o[h*4+2]=u.b,o[h*4+3]=u.a*f,l[h*2]=u.size*m,l[h*2+1]=u.rot,c[h]=u.stretch}if(this.geometry.instanceCount=s,s>0)for(let h of[this.aPos,this.aVel,this.aCol,this.aSR,this.aSt])h.clearUpdateRanges(),h.addUpdateRange(0,s*h.itemSize),h.needsUpdate=!0}clear(t){this.parts=this.parts.filter(e=>t(e))}};function Cd(n,t){let e=n.values,i=n.keyTimes;if(t<=i[0])return e[0];for(let s=1;s<i.length;s++)if(t<=i[s]){let r=(t-i[s-1])/Math.max(i[s]-i[s-1],1e-6);return e[s-1]+(e[s]-e[s-1])*r}return e[e.length-1]}var hr=new Dt,gl={h:0,s:0,l:0};function sh(n,t){return n+(t?(Math.random()-.5)*t:0)}function i_(n,t){let e=Math.min(t,180)*Math.PI/180,i=Math.cos(e),s=i+Math.random()*(1-i),r=Math.sqrt(Math.max(0,1-s*s)),a=Math.random()*Math.PI*2,o=r*Math.cos(a),l=r*Math.sin(a),c=s,h=n.x,u=n.y,d=n.z,f,m,x;Math.abs(u)<.99?(f=d,m=0,x=-h):(f=1,m=0,x=0);let p=Math.hypot(f,m,x);f/=p,m/=p,x/=p;let g=u*x-d*m,v=d*f-h*x,w=h*m-u*f;return{x:f*o+g*l+h*c,y:m*o+v*l+u*c,z:x*o+w*l+d*c}}var xl=class{constructor(t){this.scene=t,this.batches=new Map,this.emitters=[]}batch(t){let e=t.particleImage||"softDot",i=t.blendMode==="alpha"?"alpha":"additive",s=`${e}|${i}`,r=this.batches.get(s);return r||(r=new rh(this.scene,e,i),this.batches.set(s,r)),r}spawn(t,e,i,s,r,a,o){let l=i,c=s,h=r,u=t.emitterShape;if(u){if(u.box)l+=(Math.random()-.5)*u.box[0],c+=(Math.random()-.5)*u.box[1],h+=(Math.random()-.5)*u.box[2];else if(u.cyl){let y=Math.random()*Math.PI*2,E=Math.sqrt(Math.random())*u.cyl[0];l+=Math.cos(y)*E,h+=Math.sin(y)*E,c+=(Math.random()-.5)*u.cyl[1]}}let d=i_(a,t.spreadingAngle??0),f=Math.max(0,sh(t.particleVelocity||0,t.particleVelocityVariation)),m=t.particleColor||{x:1,y:1,z:1,w:1},x=m.x,p=m.y,g=m.z,v=t.particleColorVariation;v?(hr.setRGB(x,p,g,De).getHSL(gl,De),hr.setHSL(gl.h+(Math.random()-.5)*v.x,Math.min(1,Math.max(0,gl.s+(Math.random()-.5)*v.y)),Math.min(1,Math.max(0,gl.l+(Math.random()-.5)*v.z)),De)):hr.setRGB(x,p,g,De);let w=t.acceleration||{x:0,y:0,z:0};e.add({x:l,y:c,z:h,vx:d.x*f,vy:d.y*f,vz:d.z*f,ax:w.x,ay:w.y,az:w.z,grav:!!t.isAffectedByGravity,damp:t.dampingFactor||0,age:0,life:Math.max(.02,sh(t.particleLifeSpan||1,t.particleLifeSpanVariation)),size:Math.max(.001,sh(t.particleSize||.1,t.particleSizeVariation)),rot:((t.particleAngle||0)+(Math.random()-.5)*(t.particleAngleVariation||0))*Math.PI/180,av:(Math.random()-.5)*(t.particleAngularVelocityVariation||0)*Math.PI/180,stretch:t.stretchFactor||0,r:hr.r*(t.intensity||1),g:hr.g*(t.intensity||1),b:hr.b*(t.intensity||1),a:m.w??1,opacity:t.opacity||null,sizeCurve:t.size||null,looping:o})}burst(t,e,i=null){let s=this.batch(t),r=i||t.emittingDirection||{x:0,y:1,z:0},a=Math.max(1,Math.round(t.birthRate||1));for(let o=0;o<a;o++)this.spawn(t,s,e.x,e.y,e.z,r,!1)}emitter(t){let e={cfg:t,position:{x:0,y:0,z:0},active:!0,acc:0,removed:!1,remove:()=>{e.removed=!0,e.active=!1}};if(this.emitters.push(e),t.warmupDuration){let i=.03333333333333333;for(let r=0;r<t.warmupDuration;r+=i)this.emitStep(e,i);let s=this.batch(t);for(let r=0;r<t.warmupDuration;r+=i)s.update(i)}return e}emitStep(t,e){if(!t.active)return;let i=t.cfg,s=(i.birthRate||0)/(i.emissionDuration||1);t.acc+=s*e;let r=this.batch(i),a=i.emittingDirection||{x:0,y:1,z:0};for(;t.acc>=1;)t.acc-=1,this.spawn(i,r,t.position.x,t.position.y,t.position.z,a,!0)}update(t){let e=0;for(let i=0;i<this.emitters.length;i++){let s=this.emitters[i];s.removed||(this.emitStep(s,t),this.emitters[e++]=s)}this.emitters.length=e;for(let i of this.batches.values())i.update(t)}clear(){for(let t of this.batches.values())t.clear(e=>e.looping)}get count(){let t=0;for(let e of this.batches.values())t+=e.parts.length;return t}};var ah=.03,n_=-16,In=(n,t)=>({values:n,keyTimes:t}),_l=class{constructor(t){this.scene=t,this.root=new he,this.root.name="fx",t.add(this.root),this.particles=new xl(t),this.trauma=0,this.lights=[],this.lightIdx=0;for(let e=0;e<3;e++){let i=new fs(16777215,0,16,2);ma(i),this.root.add(i),this.lights.push({light:i,t:1,dur:1,peak:0})}this.tweens=[],this.debrisList=[],this.trails=[],this.unitBox=new zi(1,1,1),this.unitPlane=new oi(1,1),this.beamMats=new Map,this.sparks={particleImage:"softDot",blendMode:"additive",birthRate:16,particleLifeSpan:.32,particleLifeSpanVariation:.2,particleVelocity:7,particleVelocityVariation:5,spreadingAngle:55,particleSize:.035,particleSizeVariation:.02,stretchFactor:.06,isAffectedByGravity:!0,particleColor:{x:1,y:.8,z:.4,w:1},opacity:In([1,1,0],[0,.6,1]),intensity:3},this.fire={particleImage:"glow",blendMode:"additive",birthRate:34,particleLifeSpan:.5,particleLifeSpanVariation:.25,particleVelocity:3.5,particleVelocityVariation:3,spreadingAngle:180,particleSize:1,particleSizeVariation:.6,particleColor:{x:1,y:.55,z:.18,w:1},particleColorVariation:{x:.04,y:.1,z:.1},dampingFactor:2.5,intensity:1.3,opacity:In([.9,.7,0],[0,.35,1]),size:In([.5,1.5,2],[0,.4,1])},this.smoke={particleImage:"smoke",blendMode:"alpha",birthRate:14,particleLifeSpan:1.6,particleLifeSpanVariation:.6,particleVelocity:1.6,particleVelocityVariation:1.2,spreadingAngle:180,particleSize:1.3,particleSizeVariation:.6,particleAngleVariation:180,particleAngularVelocityVariation:40,acceleration:{x:0,y:.9,z:0},dampingFactor:1.2,particleColor:{x:.12,y:.13,z:.15,w:.7},opacity:In([0,.6,0],[0,.2,1]),size:In([.8,2.2,3.2],[0,.5,1])},this.embers={particleImage:"softDot",blendMode:"additive",birthRate:60,particleLifeSpan:.9,particleLifeSpanVariation:.5,particleVelocity:12,particleVelocityVariation:8,spreadingAngle:180,particleSize:.05,particleSizeVariation:.03,stretchFactor:.05,isAffectedByGravity:!0,dampingFactor:.8,particleColor:{x:1,y:.7,z:.3,w:1},intensity:3,opacity:In([1,1,0],[0,.5,1])},this.shards={particleImage:"softDot",blendMode:"additive",birthRate:40,particleLifeSpan:.55,particleLifeSpanVariation:.3,particleVelocity:5,particleVelocityVariation:4,spreadingAngle:180,particleSize:.09,particleSizeVariation:.06,dampingFactor:3,intensity:2.5,opacity:In([1,.8,0],[0,.5,1])}}tween(t,e,i=null){let s={t:0,dur:Math.max(t,1e-4),onUpdate:e,onDone:i,dead:!1};return this.tweens.push(s),e&&e(0),s}after(t,e){return this.tween(t,null,e)}update(t){this.trauma=Math.max(0,this.trauma-t*1.6);for(let i of this.lights)if(i.t<i.dur){i.t+=t;let s=Math.max(0,1-i.t/i.dur);i.light.intensity=i.peak*s*s}let e=this.tweens;this.tweens=[];for(let i of e){if(i.dead)continue;i.t+=t;let s=Math.min(1,i.t/i.dur);i.onUpdate&&i.onUpdate(s),s>=1?(i.dead=!0,i.onDone&&i.onDone()):this.tweens.push(i)}for(let i of this.trails)i.em.position.x=i.obj.position.x,i.em.position.y=i.obj.position.y,i.em.position.z=i.obj.position.z;this.updateDebris(t),this.particles.update(t)}shake(t){this.trauma=Math.min(1,this.trauma+t)}flash(t,e,i,s,r=16){this.lightIdx=(this.lightIdx+1)%this.lights.length;let a=this.lights[this.lightIdx];te(a.light,t),a.light.color.copy(Yi(e));let o=i*ah;a.light.intensity=o,a.light.distance=r,a.t=0,a.dur=s,a.peak=o}beamMat(t,e,i=null){let s=`${t.x},${t.y},${t.z},${e},${i}`,r=this.beamMats.get(s);return r||(r=Kt.additive(i?ut[i]:null,t,e),this.beamMats.set(s,r)),r}fadingMesh(t,e){let i=new Qt(t,e.clone());return i.castShadow=!1,i.receiveShadow=!1,this.root.add(i),i}fadeOutAndRemove(t,e,i=null,s=!1){let r=t.material,a=r.opacity;this.tween(e,o=>{r.opacity=a*(1-o),i&&i(o)},()=>{t.removeFromParent(),r.dispose(),s&&t.geometry.dispose()})}tracer(t,e,i,s=.025,r=.08,a=2.5){let o=Ne(e,t),l=Hi(o);if(l<.05)return;let c=this.fadingMesh(this.unitBox,this.beamMat(i,a));te(c,kt(Yt(t,e),.5)),cr(c,kt(o,1/l)),c.scale.set(s,s,l),this.fadeOutAndRemove(c,r)}railBeam(t,e,i){this.tracer(t,e,M(1,1,1),.035,.35,4),this.tracer(t,e,i,.085,.5,2);let s=Ne(e,t),r=Hi(s),a=Math.min(Math.floor(r/2.2),26);if(a<=0)return;let o=kt(s,1/r);for(let l=1;l<=a;l++){let c=Le(t,s,l/(a+1)),h=this.fadingMesh(this.unitPlane,this.beamMat(i,1.6,"ring"));te(h,c),cr(h,o),h.scale.set(.7,.7,.7),h.visible=!1,this.after(l*.008,()=>{h.visible=!0,this.fadeOutAndRemove(h,.5,u=>{let f=.7*(1+1.4*(1-(1-u)*(1-u)));h.scale.set(f,f,f)})})}}glowPop(t,e,i,s=1.5,r=.18,a=null){let o=et.glowSprite(i,e,s,a);te(o,t),this.root.add(o);let l=o.material;this.tween(r,c=>{let h=1-(1-c)*(1-c),u=i*(1+.8*h);o.scale.set(u,u,1),l.opacity=1-c},()=>{o.removeFromParent(),l.dispose()})}impact(t,e,i,s=!1){let r={...this.sparks,particleColor:{...nn(i,M(1,.85,.6),.5),w:1}};s&&(r.birthRate=40,r.particleVelocity=10),this.particles.burst(r,Le(t,e,.03),e),this.glowPop(Le(t,e,.06),i,s?1.4:.55,1.6,.12);let a=this.fadingMesh(this.unitPlane,this.beamMat(nn(i,M(1,.45,.1),.6),1.2,"glow")),o=s?.9:.32;a.scale.set(o,o,1),a.material.polygonOffset=!0,a.material.polygonOffsetFactor=-2,a.material.polygonOffsetUnits=-2,te(a,Le(t,e,.012)),cr(a,e),this.fadeOutAndRemove(a,s?2.2:1.2)}hitSparks(t,e,i,s){let r={...this.shards,particleColor:s?{x:1,y:.9,z:.5,w:1}:{...i,w:1},birthRate:s?22:9};this.particles.burst(r,t,kt(e,-1)),s&&this.glowPop(t,M(1,.9,.6),.8,1.5,.12)}explosion(t,e,i,s=.5){this.particles.burst({...this.fire,particleColor:{...i,w:1},particleSize:e*.38,particleVelocity:e*1.3},t),this.particles.burst({...this.embers,particleColor:{...nn(i,M(1,.9,.7),.4),w:1},particleVelocity:6+e*2.4},t),this.particles.burst({...this.smoke,particleSize:e*.45},t),this.glowPop(t,nn(i,M(1,1,1),.5),e*2.4,1.5,.22);let r=this.fadingMesh(this.unitPlane,this.beamMat(i,1.6,"ring"));r.rotation.set(-Math.PI/2,0,0),te(r,M(t.x,Math.max(t.y-e*.3,.06),t.z)),r.renderOrder=30;let a=e*3.4;this.fadeOutAndRemove(r,.45,o=>{let l=1-(1-o)*(1-o),c=1+(a-1)*l;r.scale.set(c,c,c)}),this.flash(Yt(t,M(0,.6,0)),i,Math.min(1600*e,7e3)*.6,.45,8+e*4),this.shake(s)}debris(t,e,i,s,r){if(!(this.debrisList.length>70))for(let a=0;a<e;a++){let o=s*jt(.5,1.3),l=et.box(o,o*jt(.4,1),o*jt(.5,1.2),o*.1),c=new Qt(l,i);c.castShadow=!0,te(c,Le(t,Jn(),s));let h=kt(Jn(),r*jt(.4,1));h.y=Math.abs(h.y)*.8+r*.35;let u=Jn();this.root.add(c),this.debrisList.push({m:c,v:h,half:o*.4,axis:new F(u.x,u.y,u.z).normalize(),spin:jt(4,14),life:jt(1.8,3),age:0})}}updateDebris(t){let e=new ze,i=0;for(let s of this.debrisList){s.age+=t;let r=s.m;if(s.age>=s.life+.35){r.removeFromParent(),r.geometry.dispose();continue}if(s.v.y+=n_*t,r.position.x+=s.v.x*t,r.position.y+=s.v.y*t,r.position.z+=s.v.z*t,r.position.y<s.half){r.position.y=s.half,s.v.y<0&&(s.v.y=-s.v.y*.35);let a=Math.max(0,1-6*t);s.v.x*=a,s.v.z*=a,s.spin*=a,Math.abs(s.v.y)<.4&&(s.v.y=0)}if(e.setFromAxisAngle(s.axis,s.spin*t),r.quaternion.premultiply(e),s.age>s.life){let a=Math.max(.01,1-(s.age-s.life)/.35);r.scale.set(a,a,a)}this.debrisList[i++]=s}this.debrisList.length=i}spawnFlash(t,e){this.glowPop(Yt(t,M(0,1,0)),e,3.5,1.6,.35);let i=this.fadingMesh(this.unitPlane,this.beamMat(e,1.4,"ring"));i.rotation.set(-Math.PI/2,0,0),te(i,M(t.x,t.y+.06,t.z)),i.scale.set(4,4,4),this.fadeOutAndRemove(i,.4,s=>{let r=4+-3.7*Math.min(1,s*.4/.35);i.scale.set(r,r,r)})}attachTrail(t,e,i){let s=this.particles.emitter({particleImage:"glow",blendMode:"additive",birthRate:70,particleLifeSpan:.3,particleLifeSpanVariation:.1,particleSize:i,particleSizeVariation:.1,particleVelocity:.3,spreadingAngle:180,particleColor:{...e,w:1},intensity:1.6,opacity:In([.7,0],[0,1]),size:In([1,.2],[0,1])});s.position.x=t.position.x,s.position.y=t.position.y,s.position.z=t.position.z;let r={obj:t,em:s};return this.trails.push(r),{remove:()=>{s.remove();let a=this.trails.indexOf(r);a>=0&&this.trails.splice(a,1)}}}clear(){for(let t of this.tweens)t.dead=!0;this.tweens=[];for(let t of this.root.children.slice())t.isLight||(t.removeFromParent(),(t.isMesh||t.isSprite)&&t.material&&!this.isSharedMat(t.material)&&t.material.dispose());for(let t of this.debrisList)t.m.geometry.dispose();this.debrisList=[];for(let t of this.trails)t.em.remove();this.trails=[];for(let t of this.lights)t.t=t.dur,t.light.intensity=0;this.particles.clear(),this.trauma=0}isSharedMat(t){for(let e of this.beamMats.values())if(e===t)return!0;return!1}};var vl="ZYX",oh=class n{static n=64;static origin=-32;constructor(t){let e=n.n;this.height=new Float32Array(e*e),this.blocked=new Uint8Array(e*e),this.dist=new Int32Array(e*e).fill(2147483647),this.queue=new Int32Array(e*e);for(let i=0;i<e;i++)for(let s=0;s<e;s++){let r=n.origin+s+.5,a=n.origin+i+.5,o=0,l=!1;for(let c of t){if(!(c.y0<1.8))continue;let h=c.y1>2,u=h?.45:0;r>c.minX-u&&r<c.maxX+u&&a>c.minZ-u&&a<c.maxZ+u&&(h?l=!0:o=Math.max(o,c.y1))}this.height[i*e+s]=o,this.blocked[i*e+s]=l?1:0}}cell(t,e){let i=n.n;return[Math.min(Math.max(Math.floor(t-n.origin),0),i-1),Math.min(Math.max(Math.floor(e-n.origin),0),i-1)]}passable(t,e){return!this.blocked[e]&&Math.abs(this.height[t]-this.height[e])<=.85}rebuild(t){let e=n.n,i=2147483647,s=this.dist,r=this.queue,a=this.blocked,o=this.height;s.fill(i);let l=0,c=0,[h,u]=this.cell(t.x,t.z),d=(f,m)=>{for(let x=-f;x<=f;x++)for(let p=-f;p<=f;p++){let g=h+p,v=u+x;if(g<0||v<0||g>=e||v>=e)continue;let w=v*e+g;a[w]||s[w]!==i||m&&Math.abs(o[w]-t.y)>.7||(s[w]=Math.abs(p)+Math.abs(x),r[c++]=w)}};for(d(0,!0),c===0&&d(1,!0),c===0&&d(2,!1),c===0&&d(4,!1);l<c;){let f=r[l++],m=f%e,x=f/e|0,p=s[f]+1;for(let g=0;g<4;g++){let v=m+(g===0?1:g===1?-1:0),w=x+(g===2?1:g===3?-1:0);if(v<0||w<0||v>=e||w>=e)continue;let y=w*e+v;s[y]!==i||!this.passable(f,y)||(s[y]=p,r[c++]=y)}}}direction(t,e){let i=n.n,s=2147483647,r=this.dist,a=this.height,o=this.blocked,[l,c]=this.cell(t.x,t.z),h=c*i+l,u=1/0,d=e.x-t.x,f=e.z-t.z,m=r[h];for(let p=-1;p<=1;p++)for(let g=-1;g<=1;g++){if(g===0&&p===0)continue;let v=l+g,w=c+p;if(v<0||w<0||v>=i||w>=i)continue;let y=w*i+v;if(r[y]===s)continue;if(g!==0&&p!==0){let T=c*i+v,I=w*i+l;if(r[T]===s||r[I]===s||Math.abs(a[T]-a[h])>.85||Math.abs(a[I]-a[h])>.85)continue}if(m!==s&&!o[h]&&Math.abs(a[y]-a[h])>.85)continue;let E=n.origin+v+.5,A=n.origin+w+.5,_=r[y]+.02*Math.hypot(e.x-E,e.z-A);_<u&&(u=_,d=E-t.x,f=A-t.z)}let x=Math.hypot(d,f);return x>1e-4?{x:d/x,y:f/x}:{x:0,y:0}}},Pd=`
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`,s_=`
  uniform sampler2D uHex;
  uniform float uTime;
  uniform float uBoost;
  varying vec2 vUv;
  void main() {
    vec2 uv = vUv;
    float t = uTime;
    vec2 c = uv - vec2(0.5);
    float r = length(c);
    float a = atan(c.y, c.x);
    float swirl = sin(a * 3.0 + r * 18.0 - t * 3.0) * 0.5 + 0.5;
    float wave = sin(r * 30.0 - t * 5.0) * 0.5 + 0.5;
    float hexv = texture2D(uHex, uv).r;
    vec3 hot = vec3(1.0, 0.25, 0.08);
    vec3 colr = hot * (0.15 + 0.9 * swirl * (1.0 - r) + hexv * (0.6 + 1.0 * wave));
    colr *= (1.0 + uBoost * 3.0);
    gl_FragColor = vec4(colr, 1.0);
  }
`,r_=`
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    vec2 uv = vUv;
    float t = uTime;
    float f1 = sin(uv.y * 26.0 - t * 7.0 + sin(uv.x * 12.566 + t) * 2.0) * 0.5 + 0.5;
    float f2 = sin(uv.y * 70.0 - t * 13.0 + uv.x * 25.13) * 0.5 + 0.5;
    float pulse = 0.85 + 0.15 * sin(t * 2.3);
    vec3 base = vec3(0.10, 0.55, 0.95);
    vec3 hot = vec3(0.75, 1.0, 1.0);
    vec3 colr = mix(base, hot, f1 * f1 * 0.7) * (0.55 + 0.75 * f1 + 0.3 * f2) * pulse;
    gl_FragColor = vec4(colr, 1.0);
  }
`,a_={name:"FloorMirror",uniforms:{color:{value:null},tDiffuse:{value:null},textureMatrix:{value:null},uStrength:{value:.16}},vertexShader:`
    uniform mat4 textureMatrix;
    varying vec4 vUv;
    void main() {
      vUv = textureMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float uStrength;
    varying vec4 vUv;
    void main() {
      vec3 refl = texture2DProj(tDiffuse, vUv).rgb;
      gl_FragColor = vec4(refl, uStrength);
    }
  `},yl=class n{static half=32;static wallH=8;static cyan=M(.25,.9,1);static magenta=M(1,.2,.6);static orange=M(1,.5,.12);static red=M(1,.16,.1);constructor(t,e,i){this.scene=t,this.particles=e,this.renderer=i,this.root=new he,this.root.name="level",t.add(this.root),this.obstacles=[],this.gates=[],this.pickupSpots=[],this.portalMats=[],this.spinners=[],this.beacons=[],this.timeUniforms=[],this.glowMats=new Map,this.poolMats=new Map,this.sunLight=null,this.coreLight=null,this.sky=null,this.buildSkyAndLights(t),this.buildFloor(),this.buildWalls(),this.buildCore(),this.buildPillarsAndBeams(),this.buildPlatforms(),this.buildCover(),this.buildGenerators(),this.buildSkyline(),this.buildFloorStrips(),this.buildAtmosphere(),this.mergeStatic(),this.nav=new oh(this.obstacles),this.pickupSpots.push(M(20,1.6,-20),M(-20,1.6,20),M(0,0,18),M(0,0,-18),M(18,0,0),M(-18,0,0),M(-12,0,-24),M(12,0,24),M(26,0,-6),M(-26,0,6))}static_(t){return t.userData.static=!0,t}box(t,e,i,s,r,a,o,l,{tileV:c=null,collide:h=!0,chamfer:u=0,emission:d=2.2}={}){let f=a-r,m=et.tiledBox(i,f,s,l,c??l,u),x=new Qt(m,Kt.pbr(o,d));return x.position.set(t,r+f/2,e),x.castShadow=!0,x.receiveShadow=!0,this.root.add(this.static_(x)),h&&this.obstacles.push({minX:t-i/2,maxX:t+i/2,minZ:e-s/2,maxZ:e+s/2,y0:r,y1:a}),x}glowMat(t,e){let i=`${t.x},${t.y},${t.z},${e}`,s=this.glowMats.get(i);return s||(s=Kt.glow(t,e),this.glowMats.set(i,s)),s}glowBox(t,e,i,s,r,a,o,l=3){return this.static_(et.part(this.root,et.box(s,r,a),this.glowMat(o,l),M(t,e,i),{shadow:!1}))}part(t,e,i,s={}){let r=et.part(this.root,t,e,i,s);return r.rotation.order=vl,s.rot&&r.rotation.set(s.rot.x,s.rot.y,s.rot.z),r.receiveShadow=r.castShadow,this.static_(r)}pool(t,e,i,s,r,a=.03){let o=`${s.x},${s.y},${s.z},${r}`,l=this.poolMats.get(o);l||(l=Kt.additive(ut.glow,s,r),l.polygonOffset=!0,l.polygonOffsetFactor=-1,l.polygonOffsetUnits=-1,this.poolMats.set(o,l));let c=new Qt(new oi(i,i),l);c.rotation.set(-Math.PI/2,0,0),c.position.set(t,a,e),c.castShadow=!1,c.renderOrder=10,this.root.add(this.static_(c))}sprite(t,e,i,s,r=this.root){let a=et.glowSprite(t,e,i);return te(a,s),r.add(a),a}omni(t,e,i,s){let r=new fs(Yi(t).getHex(),e*ah,s,2);return r.color=Yi(t),ma(r),te(r,i),this.root.add(r),r}buildSkyAndLights(t){this.sky=Rd(this.renderer,t),t.fog=new Fr(Yi(M(.03,.06,.1)).getHex(),28,150),t.fog.color=Yi(M(.03,.06,.1));let e=new Kr(16777215,2.2);e.color=Yi(M(1,.92,.8)),e.castShadow=!0,e.shadow.mapSize.set(4096,4096);let i=e.shadow.camera;i.left=-48,i.right=48,i.top=48,i.bottom=-48,i.near=5,i.far=140,e.shadow.bias=-4e-4,e.shadow.normalBias=.035,e.shadow.radius=3,te(e,kt(ut.sunDir,60)),e.target.position.set(0,0,0),ma(e),this.root.add(e),this.root.add(e.target),this.sunLight=e,this.coreLight=this.omni(n.cyan,3e3,M(0,3,0),28),this.omni(n.magenta,4500,M(-18.5,3.2,-18.5),22),this.omni(n.orange,4500,M(18.5,3.2,18.5),22)}buildFloor(){let t=ut.floor,e=600/4;for(let a of[t.map,t.ormMap])a.repeat.set(e,e),a.anisotropy=16,a.needsUpdate=!0;let i=new Vn({map:t.map,roughnessMap:t.ormMap,metalnessMap:t.ormMap,roughness:1,metalness:1}),s=new Qt(new oi(600,600),i);s.rotation.x=-Math.PI/2,s.receiveShadow=!0,s.name="floor",this.root.add(s);let r=new ga(new oi(600,600),{textureWidth:1280,textureHeight:720,clipBias:.003,multisample:0,shader:a_});r.material.transparent=!0,r.material.depthWrite=!1,r.material.blending=cn,r.material.polygonOffset=!0,r.material.polygonOffsetFactor=-1,r.material.polygonOffsetUnits=-1,r.rotation.x=-Math.PI/2,r.position.y=.001,r.renderOrder=1,r.name="floorMirror",this.root.add(r),this.mirror=r}buildWalls(){let t=n.half,e=2,i=n.wallH,s=ut.wallCyan;this.box(0,-(t+e/2),2*t+2*e,e,0,i,s,4),this.box(0,t+e/2,2*t+2*e,e,0,i,s,4),this.box(-(t+e/2),0,e,2*t,0,i,s,4),this.box(t+e/2,0,e,2*t,0,i,s,4);let r=ut.pillar;this.box(0,-(t+.6),2*t+4,3.2,i,i+.7,r,4,{collide:!1,emission:0}),this.box(0,t+.6,2*t+4,3.2,i,i+.7,r,4,{collide:!1,emission:0}),this.box(-(t+.6),0,3.2,2*t,i,i+.7,r,4,{collide:!1,emission:0}),this.box(t+.6,0,3.2,2*t,i,i+.7,r,4,{collide:!1,emission:0});let a=i-.12;this.glowBox(0,a,-(t-.9),2*t,.1,.1,n.magenta,4),this.glowBox(0,a,t-.9,2*t,.1,.1,n.magenta,4),this.glowBox(-(t-.9),a,0,.1,.1,2*t,n.magenta,4),this.glowBox(t-.9,a,0,.1,.1,2*t,n.magenta,4);let o=[[M(0,0,1),0],[M(0,0,-1),Math.PI],[M(1,0,0),Math.PI/2],[M(-1,0,0),-Math.PI/2]];for(let[l,c]of o){let h=kt(l,-t),u=M(l.z,0,-l.x),d=Math.abs(u.x)>.5;for(let g of[-1,1]){let v=Yt(Yt(h,kt(u,g*3.1)),kt(l,.7));this.box(v.x,v.z,1.3,1.3,0,6.2,ut.pillar,1.3,{tileV:4,chamfer:.06});let w=Yt(v,kt(l,.68));this.glowBox(w.x,3,w.z,d?.12:.05,5.4,d?.05:.12,n.red,5)}let f=Yt(h,kt(l,.7));this.box(f.x,f.z,d?7.5:1.5,d?1.5:7.5,5.4,6.6,ut.pillar,1.5,{tileV:4,collide:!1,chamfer:.06});let m=new ge({uniforms:{uHex:{value:ut.hex},uTime:{value:0},uBoost:{value:0}},vertexShader:Pd,fragmentShader:s_,side:vi});this.portalMats.push(m),this.timeUniforms.push(m.uniforms.uTime);let x=new Qt(new oi(5,5.4),m);te(x,Yt(Yt(h,kt(l,.12)),M(0,2.7,0))),x.rotation.set(0,c,0),this.root.add(x),this.sprite(11,n.red,.55,Yt(Yt(h,kt(l,.8)),M(0,2.7,0)));let p=Yt(h,kt(l,4.5));this.pool(p.x,p.z,15,n.red,.5),this.gates.push({pos:Yt(h,kt(l,3.2)),dir:l})}}buildCore(){this.box(0,0,6.4,6.4,0,.4,ut.tech,3.2,{chamfer:.05}),this.obstacles.push({minX:-1.9,maxX:1.9,minZ:-1.9,maxZ:1.9,y0:.4,y1:9});for(let s of[-1,1])for(let r of[-1,1])this.box(s*1.55,r*1.55,.55,.55,.4,8.2,ut.pillar,.55,{tileV:4,collide:!1,chamfer:.04});this.box(0,0,4.4,4.4,8.2,9,ut.tech,2.2,{collide:!1,chamfer:.08}),this.box(0,0,3.4,3.4,.4,1,ut.tech,1.7,{collide:!1,chamfer:.08});let t=new ge({uniforms:{uTime:{value:0}},vertexShader:Pd,fragmentShader:r_});this.timeUniforms.push(t.uniforms.uTime);let e=new Qt(et.cyl(.85,7.3,32),t);e.position.set(0,4.6,0),this.root.add(e);let i=Kt.metal(M(.5,.55,.6),{rough:.25});[2.3,4.6,6.9].forEach((s,r)=>{let a=new he;a.rotation.order=vl,a.position.set(0,s,0),this.root.add(a),et.part(a,et.torus(2.55,.09),i,M(0,0,0)),et.part(a,et.torus(2.55,.035),this.glowMat(n.cyan,4),M(0,.1,0),{shadow:!1}),a.rotation.set(r===1?.25:.12,0,r===2?.2:-.1);let o=9+r*3.5;this.spinners.push({node:a,rate:(r%2===0?2:-2)*Math.PI/o})}),this.sprite(11,n.cyan,.28,M(0,4.6,0)),this.pool(0,0,26,n.cyan,.28)}buildPillarsAndBeams(){for(let l of[-1,1])for(let c of[-1,1])this.box(l*14,c*14,2.4,2.4,0,10,ut.pillar,2.4,{tileV:4,chamfer:.12}),this.box(l*14,c*14,3.2,3.2,0,.5,ut.tech,1.6,{collide:!1,chamfer:.08}),this.box(l*14,c*14,3.3,3.3,10,10.6,ut.tech,1.65,{collide:!1,chamfer:.1});for(let l of[-1,1])this.box(0,l*14,28-2.4,.8,9.2,10,ut.pillar,4,{collide:!1,emission:0}),this.box(l*14,0,.8,28-2.4,9.2,10,ut.pillar,4,{collide:!1,emission:0}),this.glowBox(0,9.17,l*14,25,.06,.16,n.cyan,4),this.glowBox(l*14,9.17,0,.16,.06,25,n.cyan,4);let e=[M(0,0,14),M(0,0,-14),M(14,0,0),M(-14,0,0),M(7,0,7),M(-7,0,-7),M(7,0,-7),M(-7,0,7)],i=Kt.metal(M(.12,.13,.15),{rough:.4}),s=Kt.metal(M(.1,.1,.12),{rough:.4}),r=this.glowMat(M(.85,.95,1),3),a=Kt.additive(ut.shaft,M(.55,.8,1),.05),o=Kt.additive(ut.shaft,M(.55,.8,1),.035);e.forEach((l,c)=>{let h=c<4,u=h?9.2:9;h||this.part(et.box(.35,.35,15.5),i,M(l.x,9.4,l.z),{rot:M(0,Math.atan2(l.x,l.z),0),shadow:!1}),this.part(et.cyl(h?.9:.6,.35),s,M(l.x,u-.2,l.z),{shadow:!1}),this.part(et.cyl(h?.7:.45,.06),r,M(l.x,u-.4,l.z),{shadow:!1});let d=u-.4,f=new Qt(et.cone(h?.7:.45,h?4.2:3,d,32),h?a:o);f.position.set(l.x,d/2,l.z),f.renderOrder=20,this.root.add(this.static_(f)),this.pool(l.x,l.z,h?11:8,M(.6,.85,1),h?.38:.3)})}buildPlatforms(){for(let t of[1,-1]){let e=20*t,i=-20*t;this.box(e,i,9,9,0,1.6,ut.tech,3,{chamfer:.04});for(let c=0;c<3;c++){let h=1.2-.4*c,u=4.5+.5+c;this.box(e-t*u,i,1,3.4,0,h,ut.crateGrey,1.7),this.box(e,i+t*u,3.4,1,0,h,ut.crateGrey,1.7)}this.box(e+t*4.3,i,.35,9,1.6,2.6,ut.crateGrey,1.5),this.box(e,i-t*4.3,9,.35,1.6,2.6,ut.crateGrey,1.5),this.glowBox(e+t*4.3,2.63,i,.12,.05,8.6,n.orange,4),this.glowBox(e,2.63,i-t*4.3,8.6,.05,.12,n.orange,4),this.glowBox(e-t*4.52,1.5,i,.04,.08,8.8,n.cyan,4),this.glowBox(e,1.5,i+t*4.52,8.8,.08,.04,n.cyan,4);let s=new he;s.position.set(e+t*2.2,1.6,i-t*2.2),this.root.add(s),et.part(s,et.cyl(.6,.25),Kt.metal(M(.15,.16,.18)),M(0,.12,0)),et.part(s,et.cyl(.45,.04),this.glowMat(n.cyan,5),M(0,.26,0),{shadow:!1});let r=new he;r.rotation.order=vl,r.position.set(0,1.9,0),s.add(r);let a=new Qt(et.sphere(.75,16),Kt.additive(ut.scan,n.cyan,.9));r.add(a);let o=new Qt(et.torus(1.1,.02),Kt.additive(null,n.cyan,1.5));o.rotation.order=vl,o.rotation.set(.5,0,.2),r.add(o),this.spinners.push({node:r,rate:2*Math.PI/7});let l=new Qt(et.cone(.9,.42,1.6,24),Kt.additive(ut.shaft,n.cyan,.25));l.position.set(0,1.08,0),l.rotation.set(Math.PI,0,0),s.add(l)}}buildCover(){let s=(c,h,u,d,f)=>{this.box(c,h,u?5.2:2.6,u?2.6:5.2,d,d+2.6,f,2.6,{chamfer:.03})};s(-24,-5,!1,0,ut.crateOrange),s(-24,-5.6,!1,2.6,ut.crateTeal),s(-21.2,-4.2,!1,0,ut.crateTeal),s(24,5,!1,0,ut.crateTeal),s(24,5.6,!1,2.6,ut.crateOrange),s(21.2,4.2,!1,0,ut.crateGrey),s(-5,24,!0,0,ut.crateOrange),s(-4.2,21.2,!0,0,ut.crateGrey),s(-5.6,24,!0,2.6,ut.crateGrey),s(5,-24,!0,0,ut.crateTeal),s(4.2,-21.2,!0,0,ut.crateOrange),s(5.6,-24,!0,2.6,ut.crateOrange);let r=1.3,a=[ut.crateOrange,ut.crateTeal,ut.crateGrey],o=(c,h,u,d)=>{this.box(c,h,r,r,u*r,(u+1)*r,a[d%3],r,{chamfer:.03})};for(let c of[1,-1])o(7.6*c,7.6*c,0,0),o(9*c,7.6*c,0,2),o(7.6*c,9*c,0,1),o(7.7*c,7.7*c,1,2),o(-8.2*c,8.6*c,0,1),o(-9.6*c,8.4*c,0,0),o(27*c,-14*c,0,2),o(27*c,-12.6*c,0,0),o(27*c,-13.3*c,1,1),o(28.4*c,-13.2*c,0,1),o(-14*c,-27*c,0,1),o(-12.6*c,-27.2*c,0,2),o(3.5*c,-14.5*c,0,0),o(-17*c,3*c,0,2),o(-17.2*c,4.4*c,0,1);let l=(c,h,u)=>{let d=u?3.4:.55,f=u?.55:3.4;this.box(c,h,d,f,0,1.15,ut.crateGrey,1.7,{tileV:1.15,chamfer:.05}),this.glowBox(c,1.17,h,u?3:.1,.04,u?.1:3,n.cyan,4)};l(0,10.5,!0),l(0,-10.5,!0),l(10.5,0,!1),l(-10.5,0,!1),l(-19,-11,!0),l(19,11,!0),l(11,-19,!1),l(-11,19,!1),l(0,24,!0),l(0,-24,!0),l(24,-1.5,!1),l(-24,1.5,!1)}buildGenerators(){let t=Kt.metal(M(.42,.44,.47),{rough:.22}),e=Kt.metal(M(.2,.21,.23),{rough:.3}),i=Kt.metal(M(.3,.3,.32),{rough:.3});for(let[s,r]of[[-1,n.magenta],[1,n.orange]]){let a=22.5*s,o=22.5*s;this.box(a,o,4.6,4.6,0,3.4,ut.tech,2.3,{chamfer:.08,emission:3}),this.box(a,o,3.2,3.2,3.4,4.3,ut.tech,1.6,{collide:!1,chamfer:.08}),this.part(et.cyl(.9,1.6),e,M(a,5.1,o)),this.part(et.cyl(.93,.12),this.glowMat(r,5),M(a,5.3,o),{shadow:!1}),this.part(et.cyl(.93,.12),this.glowMat(r,5),M(a,4.7,o),{shadow:!1}),this.glowBox(a-s*2.33,1.7,o,.05,2.2,.25,r,5),this.glowBox(a,1.7,o-s*2.33,.25,2.2,.05,r,5);for(let[l,c]of[[-3.6,.6],[.6,-3.6]]){let h=a+l*s,u=o+c*s;this.part(et.capsule(.95,4),t,M(h,2,u)),this.part(et.torus(.97,.06),this.glowMat(r,4),M(h,2.6,u),{shadow:!1}),this.obstacles.push({minX:h-.9,maxX:h+.9,minZ:u-.9,maxZ:u+.9,y0:0,y1:4}),this.part(et.cyl(.14,2.6,12),i,M((h+a)/2,3,(u+o)/2),{rot:Math.abs(l)>Math.abs(c)?M(0,0,Math.PI/2):M(Math.PI/2,0,0)})}this.pool(a-s*3.2,o-s*3.2,16,r,.45),this.sprite(7,r,.45,M(a,5,o))}}buildSkyline(){let t=0,e=Kt.metal(M(.1,.1,.12),{rough:.5,plating:0});for(let i=0;i<4;i++)for(let s=0;s<5;s++){t+=1;let r=hi(t,1,91),a=hi(t,2,91),o=hi(t,3,91),l=-40+s*20+(r-.5)*8,c=46+a*16,h=7+r*7,u=16+o*30,[d,f]=i===0?[l,-c]:i===1?[l,c]:i===2?[-c,l]:[c,l],m=this.box(d,f,h,h,0,u,ut.wallCyan,8,{collide:!1,emission:2.5});m.castShadow=!1;let x=t%3===0?n.magenta:t%3===1?n.cyan:n.orange;if(this.glowBox(d,u+.2,f,h*.9,.25,h*.9,x,2.5),o>.5){this.part(et.cyl(.12,9,8),e,M(d,u+4.5,f),{shadow:!1});let p=this.sprite(2.5,n.red,1.2,M(d,u+9,f));this.beacons.push({sprite:p,wait:.3+r})}}}buildFloorStrips(){for(let s of[-1,1])this.glowBox(0,.012,s*17.6,.14,.02,21.5,n.cyan,2.6),this.glowBox(s*17.6,.012,0,21.5,.02,.14,n.cyan,2.6),this.glowBox(-.9,.012,s*30.2,.08,.02,3.2,n.red,3),this.glowBox(.9,.012,s*30.2,.08,.02,3.2,n.red,3),this.glowBox(s*30.2,.012,-.9,3.2,.02,.08,n.red,3),this.glowBox(s*30.2,.012,.9,3.2,.02,.08,n.red,3);let e=5.2;for(let s of[-1,1])this.glowBox(0,.012,s*e,2*e,.02,.1,n.cyan,2.6),this.glowBox(s*e,.012,0,.1,.02,2*e,n.cyan,2.6);let i=n.half-.35;for(let s of[-1,1])this.glowBox(0,.012,s*i,2*i,.02,.07,n.orange,2.2),this.glowBox(s*i,.012,0,.07,.02,2*i,n.orange,2.2)}buildAtmosphere(){let t={values:[0,1,1,0],keyTimes:[0,.15,.8,1]},e=this.particles.emitter({particleImage:"softDot",blendMode:"additive",birthRate:160,particleLifeSpan:9,particleLifeSpanVariation:3,emitterShape:{box:[62,9,62]},particleSize:.035,particleSizeVariation:.025,particleVelocity:.25,particleVelocityVariation:.2,spreadingAngle:180,particleColor:{x:.6,y:.85,z:1,w:.55},opacity:t,warmupDuration:9});e.position.x=0,e.position.y=4.6,e.position.z=0;let i=this.particles.emitter({particleImage:"softDot",blendMode:"additive",birthRate:26,particleLifeSpan:3.2,particleLifeSpanVariation:1,emitterShape:{cyl:[1.2,1]},particleSize:.06,particleSizeVariation:.04,particleVelocity:2.2,particleVelocityVariation:1,emittingDirection:{x:0,y:1,z:0},spreadingAngle:14,particleColor:{x:.5,y:.95,z:1,w:1},intensity:2,opacity:t});i.position.x=0,i.position.y=1.2,i.position.z=0}mergeStatic(){let t=new Map;for(let e of this.root.children.slice()){if(!e.isMesh||!e.userData.static)continue;let i=`${e.material.uuid}|${e.castShadow}|${e.receiveShadow}|${e.renderOrder}`,s=t.get(i);s||(s=[],t.set(i,s)),s.push(e)}for(let e of t.values()){if(e.length<2)continue;let i=[];for(let o of e){o.updateMatrix();let l=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();l.applyMatrix4(o.matrix);for(let c of Object.keys(l.attributes))["position","normal","uv"].includes(c)||l.deleteAttribute(c);l.morphAttributes={},i.push(l)}let s=Ed(i,!1);for(let o of i)o.dispose();if(!s)continue;let r=e[0],a=new Qt(s,r.material);a.castShadow=r.castShadow,a.receiveShadow=r.receiveShadow,a.renderOrder=r.renderOrder,a.name="merged";for(let o of e)o.removeFromParent(),o.geometry.dispose();this.root.add(a)}}update(t,e){for(let i of this.timeUniforms)i.value=e;for(let i of this.spinners)i.node.rotation.y+=i.rate*t;for(let i of this.beacons){let s=1.1+i.wait,r=e%s,a=r<.9?1-.9*(r/.9):r<1.1?.1+.9*((r-.9)/.2):1;i.sprite.material.opacity=a}}portalBoost(t,e){let i=this.portalMats[t];i&&(i.uniforms.uBoost.value=e)}resolve(t,e,i,s,r=.5){for(let o of this.obstacles){if(i+r>=o.y1||i+s<=o.y0)continue;let l=Me(t.x,o.minX,o.maxX),c=Me(t.z,o.minZ,o.maxZ),h=t.x-l,u=t.z-c,d=h*h+u*u;if(!(d>=e*e))if(d>1e-8){let f=Math.sqrt(d);t.x=l+h/f*e,t.z=c+u/f*e}else{let f=t.x-o.minX,m=o.maxX-t.x,x=t.z-o.minZ,p=o.maxZ-t.z,g=Math.min(Math.min(f,m),Math.min(x,p));g===f?t.x=o.minX-e:g===m?t.x=o.maxX+e:g===x?t.z=o.minZ-e:t.z=o.maxZ+e}}let a=n.half-e;t.x=Me(t.x,-a,a),t.z=Me(t.z,-a,a)}groundHeight(t,e,i,s,r=.5){let a=0;for(let o of this.obstacles)o.y1<=s+r&&o.y1>a&&t>o.minX-i&&t<o.maxX+i&&e>o.minZ-i&&e<o.maxZ+i&&(a=o.y1);return a}raycast(t,e,i){let s=i,r=M(0,1,0),a=!1;if(e.y<-1e-5){let u=-t.y/e.y;u>0&&u<s&&(s=u,r=M(0,1,0),a=!0)}let o=34e37,l=Math.abs(e.x)>1e-7?1/e.x:o,c=Math.abs(e.y)>1e-7?1/e.y:o,h=Math.abs(e.z)>1e-7?1/e.z:o;for(let u of this.obstacles){let d=(u.minX-t.x)*l,f=(u.maxX-t.x)*l,m=Math.min(d,f),x=Math.max(d,f),p=0;d=(u.y0-t.y)*c,f=(u.y1-t.y)*c;let g=Math.min(d,f),v=Math.max(d,f);g>m&&(m=g,p=1),x=Math.min(x,v),d=(u.minZ-t.z)*h,f=(u.maxZ-t.z)*h;let w=Math.min(d,f),y=Math.max(d,f);w>m&&(m=w,p=2),x=Math.min(x,y),!(x<Math.max(m,0)||m<=0||m>=s)&&(s=m,a=!0,r=p===0?M(e.x>0?-1:1,0,0):p===1?M(0,e.y>0?-1:1,0):M(0,0,e.z>0?-1:1))}return a?{t:s,n:r}:null}lineOfSight(t,e){let i=e.x-t.x,s=e.y-t.y,r=e.z-t.z,a=Math.hypot(i,s,r);return a<1e-4?!0:this.raycast(t,{x:i/a,y:s/a,z:r/a},a)===null}};var o_={x:1,y:1,z:1},xa={x:.35,y:.92,z:1},Dd={x:1,y:.25,z:.2},Nd={x:1,y:.62,z:.15},Ud={x:.6,y:.75,z:.85},Fd={x:.3,y:1,z:.55},Ke="hud-fh",Si="hud-fd",l_="hud-fm";function Qe(n,t=1){if(typeof n=="string")return n;let e=Math.round(Math.min(Math.max(n.x,0),1)*255),i=Math.round(Math.min(Math.max(n.y,0),1)*255),s=Math.round(Math.min(Math.max(n.z,0),1)*255);return t>=1?`rgb(${e}, ${i}, ${s})`:`rgba(${e}, ${i}, ${s}, ${t})`}var bi="#fff",ts=Qe(xa),ur=Qe(Dd),Ml=Qe(Nd),es=Qe(Ud),c_=Qe(Fd);function ce(n,t=null){let e=document.createElement("div");return n&&(e.className=n),t&&t.appendChild(e),e}function h_(n,t=0,e=0,i=""){let s=ce(i?`hud-node ${i}`:"hud-node",n);return t!==0&&(s.style.left=`${t}px`),e!==0&&(s.style.bottom=`${e}px`),s}var lh=class{constructor(t,e,i,s=bi,r="center",a="baseline"){this.el=ce(`hud-lb ${e} hud-h${r[0]} hud-v${a[0]}`),this.el.style.fontSize=`${i}px`,this.h=r,this.v=a,this.text=null,this.color=null,this.anim=null,this.set(t),this.setColor(s)}at(t,e){let i=this.el.style;return this.h==="right"?i.right=`${-t}px`:i.left=`${t}px`,this.v==="center"?i.top=`${-e}px`:i.bottom=`${e}px`,this}addTo(t){return t.appendChild(this.el),this}set(t){t!==this.text&&(this.text=t,this.el.textContent=t)}setColor(t){t!==this.color&&(this.color=t,this.el.style.color=t)}stop(){this.anim&&(this.anim.cancel(),this.anim=null)}};function oe(n,t,e,i=bi,s="center",r="baseline"){return new lh(n,t,e,i,s,r)}var bs=class{constructor(t,e,i,s){this.node=ce("hud-bar");let r=this.node.style;r.width=`${t}px`,r.height=`${e}px`,r.transform=`skewX(${(-Math.atan2(i,e)).toFixed(5)}rad)`;let a=ce("hud-bar-bg",this.node);a.style.borderColor=Qe(s,.55),this.fill=ce("hud-bar-fill",this.node),this.last=-1,this.color=null,this.hidden=!1,this.alpha=1,this.setColor(Qe(s)),this.set(1)}at(t,e){return this.node.style.left=`${t}px`,this.node.style.bottom=`${e}px`,this}set(t){let e=Math.max(0,Math.min(1,t));Math.abs(e-this.last)<.004||(this.last=e,this.fill.style.transform=`scaleX(${e.toFixed(4)})`,this.fill.style.visibility=e<=.001?"hidden":"visible")}setColor(t){t!==this.color&&(this.color=t,this.fill.style.backgroundColor=t)}setHidden(t){t!==this.hidden&&(this.hidden=t,this.node.style.display=t?"none":"")}setAlpha(t){t!==this.alpha&&(this.alpha=t,this.node.style.opacity=String(t))}};function Id(n,t){let e=1.25/Math.sqrt(.9)*50,i=32,s=[];for(let r=0;r<=i;r++){let a=r/i;s.push(`${Qe(n,Number(Math.pow(a,t).toFixed(4)))} ${(a*100).toFixed(2)}%`)}return`radial-gradient(ellipse ${e.toFixed(3)}% ${e.toFixed(3)}% at 50% 50%, ${s.join(", ")})`}var Sl=class{constructor(t,e){this.el=ce(`hud-fx ${t}`,e),this.shown=0}setAlpha(t){let e=t<.002?0:Math.round(t*400)/400;e!==this.shown&&(e>0!=this.shown>0&&(this.el.style.visibility=e>0?"visible":"hidden"),this.shown=e,this.el.style.opacity=String(e))}},Ld="http://www.w3.org/2000/svg",bl=class{constructor(t){this.root=t,t.classList.add("hud-root"),this.laidOut={width:0,height:0},this.s=1,this.gameLayer=ce("hud-game"),this.center=ce("hud-anchor hud-center"),this.bl=ce("hud-anchor hud-bl"),this.br=ce("hud-anchor hud-br"),this.tl=ce("hud-anchor hud-tl"),this.tr=ce("hud-anchor hud-tr"),this.tc=ce("hud-anchor hud-tc"),this.overlay=ce("hud-anchor hud-overlay"),this.crossLines=[],this.crossGap=-1,this.hitMarker=ce("hud-node hud-hitmarker"),this.hitLines=[],this.hitColor=null,this.hitAnims=[],this.dashBar=new bs(70,4,2,xa),this.reloadLabel=oe("",Si,16,ts),this.powerLabel=oe("",Ke,20,Qe({x:.8,y:.5,z:1})),this.hpBar=new bs(300,16,8,Fd),this.shBar=new bs(300,9,5,xa),this.hpLabel=oe("100",Ke,54,bi,"left"),this.shLabel=oe("100",Ke,26,ts,"left"),this.ammoLabel=oe("36",Ke,72,bi,"right"),this.reserveLabel=oe("/ \u221E",Ke,28,es,"left"),this.weaponLabel=oe("PULSGEWEHR",Si,20,ts,"right"),this.slots=[],this.waveLabel=oe("WELLE 1",Ke,30,bi),this.enemiesLabel=oe("",Si,17,es),this.scoreLabel=oe("0",Ke,44,bi,"right"),this.comboLabel=oe("",Ke,26,Ml,"right"),this.comboBar=new bs(120,5,3,Nd),this.bossNode=ce("hud-node"),this.bossHidden=!1,this.bossBar=new bs(620,14,8,Dd),this.bossLabel=oe("",Ke,20,ur),this.radar=ce("hud-node hud-radar"),this.blips=[],this.radarR=78,this.announceLabel=oe("",Ke,84,bi),this.announceSub=oe("",Si,26,ts),this.announceScale=null,this.feed=[],this.vignette=null,this.lowHp=null,this.lowHpAlpha=0,this.flashNode=null,this.flashAnim=null,this.dmgArcs=[],this.dmgAngles=[],this.dmgLife=[],this.vignetteAlpha=0,this.time=0,this.dim=null,this.dimAnim=null,this.menuNode=ce("hud-node hud-menu"),this.menuAnim=null,this.lastScore=null,this.lastCombo=null,this.lastWave=null,this.lastEnemies=null,this.lastOvercharge=null,this.lastReserve=null,this.lastAmmo=null,this.lastHp=null,this.lastShield=null,this.lastWeaponColor=null,this.weaponColorCss=ts,this.build(),this.layout(),typeof ResizeObserver<"u"?(this.resizeObserver=new ResizeObserver(()=>this.layout()),this.resizeObserver.observe(t)):window.addEventListener("resize",()=>this.layout())}build(){let t=this.root;this.vignette=new Sl("hud-vignette",t),this.vignette.el.style.backgroundImage=Id({x:1,y:.05,z:.02},2.6),this.lowHp=new Sl("hud-lowhp",t),this.lowHp.el.style.backgroundImage=Id({x:.9,y:0,z:0},3.4),this.flashNode=ce("hud-fx hud-flash",t),t.appendChild(this.gameLayer);for(let m of[this.center,this.bl,this.br,this.tl,this.tr,this.tc])this.gameLayer.appendChild(m);this.dim=ce("hud-dim",t),t.appendChild(this.overlay),this.overlay.appendChild(this.menuNode);let{center:e,bl:i,br:s,tc:r,tr:a,tl:o}=this;for(let m=0;m<4;m++){let x=ce(m<2?"hud-cross hud-cross-h":"hud-cross hud-cross-v",e);this.crossLines.push(x)}ce("hud-cross-dot",e);for(let m=0;m<4;m++){let x=ce("hud-hitline",this.hitMarker),p=Math.PI/4+m*Math.PI/2;x.style.transform=`translate(${(Math.cos(p)*15).toFixed(3)}px, ${(-Math.sin(p)*15).toFixed(3)}px) rotate(${(-p).toFixed(5)}rad)`,this.hitLines.push(x)}e.appendChild(this.hitMarker),this.dashBar.at(-35,-46),e.appendChild(this.dashBar.node),this.reloadLabel.at(0,-78).addTo(e),this.powerLabel.at(0,-110).addTo(e);{let m=Math.PI/2+.34,x=Math.PI/2-.34,p=`M ${(Math.cos(m)*120).toFixed(3)} ${(-Math.sin(m)*120).toFixed(3)} A 120 120 0 0 1 ${(Math.cos(x)*120).toFixed(3)} ${(-Math.sin(x)*120).toFixed(3)}`;for(let g=0;g<5;g++){let v=document.createElementNS(Ld,"svg");v.setAttribute("class","hud-arc"),v.setAttribute("viewBox","-140 -140 280 280");let w=document.createElementNS(Ld,"path");w.setAttribute("d",p),v.appendChild(w),e.appendChild(v),this.dmgArcs.push({el:v,shown:0}),this.dmgAngles.push(0),this.dmgLife.push(0)}}let l=oe("VITAL",Si,15,es,"left").at(0,84);this.hpLabel.at(0,34),this.shLabel.at(112,36);let c=oe("SCHILD",Si,13,Qe(xa,.8),"left").at(112,62);this.hpBar.at(0,10),this.shBar.at(5,-3);for(let m of[l.el,this.hpLabel.el,this.shLabel.el,c.el,this.hpBar.node,this.shBar.node])i.appendChild(m);this.ammoLabel.at(-84,30).addTo(s),this.reserveLabel.at(-76,34).addTo(s),this.weaponLabel.at(0,100).addTo(s);for(let m=0;m<4;m++){let x=h_(s,-32-(3-m)*70,6),p=ce("hud-slot",x),g=oe(`${m+1}`,l_,11,es,"left","center").at(-28,0).addTo(x),v=oe("",Si,12,bi,"center","center").at(5,0).addTo(x);this.slots.push({box:p,key:g,name:v,state:""})}this.waveLabel.at(0,-44).addTo(r),this.enemiesLabel.at(0,-66).addTo(r),this.bossBar.at(-310,-118),this.bossLabel.at(0,-98),this.bossNode.appendChild(this.bossBar.node),this.bossNode.appendChild(this.bossLabel.el),this.setBossHidden(!0),r.appendChild(this.bossNode);let h=oe("PUNKTE",Si,15,es,"right").at(0,-30);this.scoreLabel.at(0,-74),this.comboLabel.at(0,-106),this.comboBar.at(-124,-118);for(let m of[h.el,this.scoreLabel.el,this.comboLabel.el,this.comboBar.node])a.appendChild(m);for(let m=0;m<5;m++){let x=oe("",Si,16,es,"right").at(0,-150-m*22).addTo(a);x.el.style.opacity="0",this.feed.push({label:x,from:0,wait:0,dur:0})}let u=this.radarR;this.radar.style.left=`${u+6}px`,this.radar.style.bottom=`${-(u+6)}px`,ce("hud-radar-ring",this.radar),ce("hud-radar-ring2",this.radar),ce("hud-radar-me",this.radar);for(let m=0;m<48;m++)this.blips.push({el:ce("hud-blip",this.radar),shown:!1,key:""});o.appendChild(this.radar);let d=ce("hud-anchor hud-announce",this.gameLayer);this.announceLabel.at(0,0).addTo(d);let f=ce("hud-anchor hud-announce-sub",this.gameLayer);this.announceSub.at(0,0).addTo(f),this.announceLabel.el.style.opacity="0",this.announceSub.el.style.opacity="0"}layout(t=null){let e=t?t.width:this.root.clientWidth||window.innerWidth,i=t?t.height:this.root.clientHeight||window.innerHeight;this.laidOut={width:e,height:i};let s=Math.max(.6,Math.min(i/900,e/1440));(s!==this.s||!this.scaleWritten)&&(this.s=s,this.scaleWritten=!0,this.root.style.setProperty("--s",s.toFixed(4)))}resizeIfNeeded(){}update(t){let e=t.dt;this.time+=e;let i=t.hp,s=t.shield,r=t.ammo;this.hpBar.set(i/100),this.shBar.set(s/100);let a=Math.ceil(i);a!==this.lastHp&&(this.lastHp=a,this.hpLabel.set(String(a)));let o=Math.trunc(s);o!==this.lastShield&&(this.lastShield=o,this.shLabel.set(String(o)));let l=i<35;this.hpLabel.setColor(l?ur:bi),this.hpBar.setColor(l?ur:c_);let c=l?(.35+.25*Math.sin(this.time*6))*(1-i/35*.6):0;this.lowHpAlpha+=(c-this.lowHpAlpha)*.2,this.lowHp.setAlpha(this.lowHpAlpha),r!==this.lastAmmo&&(this.lastAmmo=r,this.ammoLabel.set(`${r}`)),this.ammoLabel.setColor(r===0?ur:bi),t.reserve!==this.lastReserve&&(this.lastReserve=t.reserve,this.reserveLabel.set(t.reserve<0?"/ \u221E":`/ ${t.reserve}`)),this.weaponLabel.set(t.weaponName);let h=this.color(t.weaponColor);this.weaponLabel.setColor(h);let u=t.weaponNames,d=t.weaponUsable;for(let x=0;x<this.slots.length&&x<u.length;x++){let p=this.slots[x],g=x===t.weaponIndex,v=`${u[x]}|${g?h:""}|${d[x]?1:0}`;v!==p.state&&(p.state=v,p.name.set(u[x]),p.box.style.backgroundColor=g?Qe(t.weaponColor,.3):"rgba(0, 0, 0, 0.4)",p.box.style.borderColor=g?h:Qe(Ud,.35),p.name.setColor(d[x]?bi:"rgba(255, 255, 255, 0.35)"))}let f=Math.round((7+t.spread*520)*10)/10;if(f!==this.crossGap){this.crossGap=f;let x=f+4;this.crossLines[0].style.transform=`translate(${x}px, 0px)`,this.crossLines[1].style.transform=`translate(${-x}px, 0px)`,this.crossLines[2].style.transform=`translate(0px, ${-x}px)`,this.crossLines[3].style.transform=`translate(0px, ${x}px)`}this.dashBar.set(t.dash),this.dashBar.setAlpha(t.dash>=1?.35:1),this.reloadLabel.set(t.reloading>0?"LADE NACH\u2026":r===0?"LEER \u2013 [R]":"");let m=t.overcharge>0?Math.ceil(t.overcharge):0;m!==this.lastOvercharge&&(this.lastOvercharge=m,this.powerLabel.set(m>0?`\xDCBERLADUNG  ${m}s`:"")),t.score!==this.lastScore&&(this.lastScore=t.score,this.scoreLabel.set(this.formatScore(t.score))),t.combo>1?(t.combo!==this.lastCombo&&(this.lastCombo=t.combo,this.comboLabel.set(`KOMBO \xD7${t.combo}`)),this.comboBar.setHidden(!1),this.comboBar.set(t.comboT)):(this.lastCombo!==0&&(this.lastCombo=0,this.comboLabel.set("")),this.comboBar.setHidden(!0)),t.wave!==this.lastWave&&(this.lastWave=t.wave,this.waveLabel.set(`WELLE ${t.wave}`)),t.enemiesLeft!==this.lastEnemies&&(this.lastEnemies=t.enemiesLeft,this.enemiesLabel.set(t.enemiesLeft>0?`GEGNER  ${t.enemiesLeft}`:"")),t.bossName!=null?(this.setBossHidden(!1),this.bossLabel.set(t.bossName),this.bossBar.set(t.bossHp)):this.setBossHidden(!0),this.vignetteAlpha=Math.max(0,this.vignetteAlpha-e*1.4),this.vignette.setAlpha(this.vignetteAlpha);for(let x=0;x<this.dmgArcs.length;x++)this.dmgLife[x]>0&&(this.dmgLife[x]-=e,this.setArcAlpha(x,Math.max(0,Math.min(1,this.dmgLife[x]*1.6))))}color(t){let e=this.lastWeaponColor;return(!e||e.x!==t.x||e.y!==t.y||e.z!==t.z)&&(this.lastWeaponColor={x:t.x,y:t.y,z:t.z},this.weaponColorCss=Qe(t)),this.weaponColorCss}setBossHidden(t){t!==this.bossHidden&&(this.bossHidden=t,this.bossNode.style.display=t?"none":"")}setArcAlpha(t,e){let i=this.dmgArcs[t],s=Math.round(e*200)/200;s!==i.shown&&(s>0!=i.shown>0&&(i.el.style.visibility=s>0?"visible":"hidden"),i.shown=s,i.el.style.opacity=String(s))}formatScore(t){let e=Math.trunc(Number(t)||0),i=String(Math.abs(e)).replace(/\B(?=(\d{3})+(?!\d))/g,".");return e<0?`-${i}`:i}setRadar(t,e){let i=this.radarR-5;for(let s=0;s<this.blips.length;s++){let r=this.blips[s];if(s<t.length){let a=t[s].p.x/e,o=t[s].p.y/e,l=Math.hypot(a,o);l>1&&(a/=l,o/=l);let c=t[s].boss?2:l>1?.7:1,h=`translate(${(a*i).toFixed(1)}px, ${(-o*i).toFixed(1)}px) scale(${c})|${l>1?.55:1}`;if(h!==r.key){r.key=h;let u=h.lastIndexOf("|");r.el.style.transform=h.slice(0,u),r.el.style.opacity=h.slice(u+1)}r.shown||(r.shown=!0,r.el.style.display="block")}else r.shown&&(r.shown=!1,r.el.style.display="none")}}hit(t,e){for(let s of this.hitAnims)s.cancel();let i=t?ur:e?Ml:bi;i!==this.hitColor&&(this.hitColor=i,this.hitMarker.style.color=i),this.hitAnims=[this.hitMarker.animate([{opacity:1},{opacity:0}],{duration:t?400:180})],t&&this.hitAnims.push(this.hitMarker.animate([{scale:"1.5"},{scale:"1"}],{duration:150}))}damage(t,e){if(this.vignetteAlpha=Math.min(.9,this.vignetteAlpha+(.25+t/40)),e!=null){let i=0;for(let s=0;s<this.dmgLife.length;s++)this.dmgLife[s]<this.dmgLife[i]&&(i=s);this.dmgLife[i]=1.1,this.dmgAngles[i]=e,this.dmgArcs[i].el.style.transform=`rotate(${e.toFixed(4)}rad)`}}flash(t,e,i){this.flashAnim&&(this.flashAnim.cancel(),this.flashAnim=null);let s=this.flashNode;if(s.style.backgroundColor=Qe(t),!(i>0)||!(e>0)){s.style.visibility="hidden";return}s.style.visibility="visible";let r=s.animate([{opacity:e},{opacity:0}],{duration:i*1e3});r.onfinish=()=>{this.flashAnim===r&&(this.flashAnim=null,s.style.visibility="hidden")},this.flashAnim=r}announce(t,e="",i=o_,s=1.6){let r=.15+s+.5,a=[{opacity:0,offset:0},{opacity:1,offset:.15/r},{opacity:1,offset:(.15+s)/r},{opacity:0,offset:1}];for(let[o,l]of[[this.announceLabel,t],[this.announceSub,e]])o.stop(),o.set(l),o.anim=o.el.animate(a,{duration:r*1e3});this.announceLabel.setColor(Qe(i)),this.announceScale&&this.announceScale.cancel(),this.announceScale=this.announceLabel.el.animate([{scale:"1.25 1"},{scale:"1 1"}],{duration:250})}feedAlpha(t){let e=t.label.anim;if(!e||e.currentTime==null)return 0;let i=Number(e.currentTime)/1e3;return i<=t.wait?t.from:t.dur<=0||i>=t.wait+t.dur?0:t.from*(1-(i-t.wait)/t.dur)}feedFade(t,e,i,s){t.label.stop(),t.from=e,t.wait=i,t.dur=s;let r=i+s;if(!(e>0)||!(r>0))return;let a=i>0?[{opacity:e,offset:0},{opacity:e,offset:i/r},{opacity:0,offset:1}]:[{opacity:e},{opacity:0}];t.label.anim=t.label.el.animate(a,{duration:r*1e3})}feedLine(t,e=null){let i=this.feed;for(let s=i.length-1;s>0;s--){let r=i[s-1],a=this.feedAlpha(r);i[s].label.set(r.label.text),i[s].label.setColor(r.label.color),this.feedFade(i[s],a,0,a*1.8)}i[0].label.set(t),i[0].label.setColor(e?Qe(e):es),this.feedFade(i[0],1,1.6,.8)}clearMenu(){this.menuNode.replaceChildren(),this.menuAnim&&(this.menuAnim.cancel(),this.menuAnim=null)}setDim(t){this.dimAnim&&(this.dimAnim.cancel(),this.dimAnim=null),this.dim.style.opacity=String(t),this.dim.style.visibility=t>0?"visible":"hidden"}setGameLayerAlpha(t){this.gameLayer.classList.toggle("hud-off",t<=0)}title(t,e,i,s=bi){let r=oe(t,Ke,i,Qe(xa,.55)).at(4,e-3),a=oe(t,Ke,i,Qe({x:1,y:.2,z:.6},.5)).at(-4,e+2),o=oe(t,Ke,i,s).at(0,e);this.menuNode.append(a.el,r.el,o.el)}prompt(t,e){let i=oe(t,Ke,28,ts).at(0,e);i.el.classList.add("hud-blink"),this.menuNode.appendChild(i.el)}controls(t){[["W A S D","Bewegen"],["MAUS","Zielen"],["LINKSKLICK","Feuern"],["LEERTASTE","Springen"],["SHIFT","Sprinten"],["Q","Dash"],["R","Nachladen"],["1 \u2013 4 / RAD","Waffe wechseln"],["ESC","Pause"],["F","Vollbild"],["M","Musik an/aus"]].forEach((i,s)=>{let r=s<6?0:1,a=s<6?s:s-6,o=r===0?-270:50,l=oe(i[0],Ke,17,ts,"left").at(o,t-a*26),c=oe(i[1],Si,17,"rgba(255, 255, 255, 0.85)","left").at(o+(r===0?130:120),t-a*26);this.menuNode.append(l.el,c.el)})}showMenu(t,e){this.clearMenu(),this.setDim(.45),this.setGameLayerAlpha(0),this.title("NOVA BREACH",190,150),oe("A R E N A - P R O T O K O L L   //   S T A T I O N   H E L I X - 9",Si,22,ts).at(0,150).addTo(this.menuNode);let i=ce("hud-menu-line",this.menuNode);i.style.left="-380px",i.style.bottom="131px",this.prompt("KLICKEN ODER ENTER ZUM STARTEN",60),this.controls(-20),t>0&&oe(`BESTLEISTUNG   ${this.formatScore(t)} PUNKTE   \xB7   WELLE ${e}`,Ke,22,Ml).at(0,-230).addTo(this.menuNode),oe("\xDCberlebe so viele Wellen wie m\xF6glich. Alle 5 Wellen wartet ein Boss.",Si,17,"rgba(255, 255, 255, 0.6)").at(0,-270).addTo(this.menuNode)}showPause(){this.clearMenu(),this.setDim(.6),this.title("PAUSE",120,120),this.prompt("KLICKEN ODER ESC ZUM FORTSETZEN",40),this.controls(-30),oe("ALT+F4  \u2013  Spiel beenden",Si,17,"rgba(255, 255, 255, 0.6)").at(0,-230).addTo(this.menuNode)}showGameOver(t){this.clearMenu(),this.setGameLayerAlpha(0),this.setDim(.62),this.dimAnim=this.dim.animate([{opacity:0},{opacity:.62}],{duration:800}),this.title("SYSTEMAUSFALL",170,120,ur);let e=Math.trunc(t.time);[["PUNKTE",this.formatScore(t.score)],["ERREICHTE WELLE",`${t.wave}`],["ABSCH\xDCSSE",`${t.kills}`],["TREFFERQUOTE",`${t.accuracy} %`],["\xDCBERLEBT",`${Math.trunc(e/60)}:${String(e%60).padStart(2,"0")}`]].forEach((s,r)=>{let a=oe(s[0],Si,22,es,"right").at(-20,80-r*36),o=oe(s[1],Ke,28,bi,"left").at(20,78-r*36);this.menuNode.append(a.el,o.el)}),oe(t.newBest?"NEUER REKORD!":`REKORD   ${this.formatScore(t.best)}`,Ke,26,Ml).at(0,-120).addTo(this.menuNode),this.prompt("KLICKEN ODER ENTER F\xDCR NEUEN VERSUCH",-190),this.menuNode.style.opacity="1",this.menuAnim=this.menuNode.animate([{opacity:0,offset:0},{opacity:0,offset:.5},{opacity:1,offset:1}],{duration:1e3})}showGame(){this.clearMenu(),this.menuNode.style.opacity="1",this.setDim(0),this.setGameLayerAlpha(1)}resetTransient(){this.vignetteAlpha=0,this.vignette.setAlpha(0),this.lowHpAlpha=0,this.lowHp.setAlpha(0);for(let t=0;t<this.dmgArcs.length;t++)this.dmgLife[t]=0,this.setArcAlpha(t,0);for(let t of this.feed)t.label.stop(),t.from=0,t.wait=0,t.dur=0;this.announceLabel.stop(),this.announceSub.stop()}};var fr=44100,u_=22,j=Math.fround,Gt=Math.sin,Tt=Math.exp,dr=Math.floor,Pi=Math.min,is=Math.max,wl=3.141592502593994,Bd=2*wl,d_=j(1/fr),Tl=class{constructor(t){this.s=t|0}next(){return this.s=Math.imul(this.s,1664525)+1013904223|0,j(this.s)/2147483648}},f_=n=>Math.trunc(j(j(n)*fr));function xe(n,t,e,i=1){let s=f_(n),r=new Float32Array(s),a=new Tl(Math.imul(i,7919)+13),o=j(t);for(let l=0;l<s;l++){let c=j(l/fr),h=Pi(1,j((s-l)/300));r[l]=j(Math.tanh(j(j(e(c,a))*o)))*h}return r}function p_(){let n={},t=Bd,e=d_,i=j;{let s=0,r=0;n.rifle=xe(.2,1.3,(a,o)=>(s=j(s+t*(150+1e3*Tt(-a*42))*e),r=j(r+(o.next()-r)*.5),(Gt(s)+.4*Gt(s*2.01))*Tt(-a*24)*.55+r*Tt(-a*50)*.8))}{let s=0,r=0,a=0;n.shotgun=xe(.55,2,(o,l)=>{let c=.06+.6*Tt(-o*14);return s=j(s+(l.next()-s)*c),r=j(r+(s-r)*c),a=j(a+t*(48+90*Tt(-o*18))*e),r*Tt(-o*8)*1.4+Gt(a)*Tt(-o*11)*.9})}{let s=0,r=0,a=0;n.rail=xe(.9,1.6,(o,l)=>(s=j(s+t*(110+2400*Tt(-o*7))*e),r=j(r+t*53*e),a=j(a+(l.next()-a)*.7),2*(s/t-dr(s/t+.5))*Tt(-o*5)*.45*(.7+.3*Gt(r*6))+a*Tt(-o*30)*.9+Gt(r)*Tt(-o*6)*.7))}{let s=0,r=0;n.launcher=xe(.5,1.7,(a,o)=>(s=j(s+t*(50+170*Tt(-a*16))*e),r=j(r+(o.next()-r)*.12),Gt(s)*Tt(-a*8)+r*Tt(-a*12)*1.3))}{let s=0,r=0,a=0;n.explosion=xe(1.5,2.4,(o,l)=>{let c=.012+.35*Tt(-o*6);return s=j(s+(l.next()-s)*c),r=j(r+(s-r)*c),a=j(a+t*(28+60*Tt(-o*7))*e),r*Tt(-o*3.2)*2.2+Gt(a)*Tt(-o*4.5)*.9})}{let s=0;n.enemyShot=xe(.22,.9,r=>{s=j(s+t*(380+1300*Tt(-r*16))*e);let a=Gt(s)>0?1:-1;return(Gt(s)*.7+a*.18)*Tt(-r*17)})}{let s=0;n.hit=xe(.06,.8,a=>(s=j(s+t*2300*e),Gt(s)*Tt(-a*90)));let r=0;n.crit=xe(.1,.9,a=>(r=j(r+t*(a<i(.03)?2600:3500)*e),Gt(r)*Tt(-a*45)))}{let s=0;n.kill=xe(.22,.8,r=>(s=j(s+t*(r<i(.07)?880:1320)*e),(Gt(s)+.3*Gt(s*2))*Tt(-r*16)*.8))}{let s=0,r=0;n.enemyDie=xe(.4,1.5,(a,o)=>(s=j(s+t*(70+600*Tt(-a*12))*e),r=j(r+(o.next()-r)*.3),(Gt(s)>0?1:-1)*Tt(-a*11)*.35+r*Tt(-a*9)*.9))}{let s=0,r=0;n.hurt=xe(.3,1.6,(o,l)=>(s=j(s+t*(70+90*Tt(-o*20))*e),r=j(r+(l.next()-r)*.2),Gt(s)*Tt(-o*12)+r*Tt(-o*20)*.8));let a=0;n.shieldHit=xe(.25,1,(o,l)=>(a=j(a+t*(900+500*Gt(o*90))*e),Gt(a)*Tt(-o*16)*.6+l.next()*Tt(-o*40)*.3))}{let s=0;n.pickup=xe(.42,.8,a=>{let o=a<i(.09)?660:a<i(.18)?880:1320;s=j(s+t*o*e);let l=a<i(.09)?a:a<i(.18)?a-i(.09):a-i(.18);return(Gt(s)+.25*Gt(s*3))*Tt(-l*9)*.7});let r=0;n.power=xe(.8,.9,a=>{r=j(r+t*(220+900*a*a+30*Gt(a*70))*e);let o=2*(r/t-dr(r/t+.5));return(Gt(r)*.7+o*.2)*Pi(1,a*20)*Tt(-is(0,a-.5)*9)})}{let s=0,r=0;n.reload=xe(.5,1.4,(o,l)=>{let c=Tt(-is(0,o-i(.02))*90)*(o>i(.02)?1:0),h=Tt(-is(0,o-i(.3))*70)*(o>i(.3)?1:0),u=Tt(-is(0,o-i(.38))*110)*(o>i(.38)?1:0),d=l.next();return r=j(r+(d-r)*.35),s=d-r,s*(c*.8+h+u*.7)+Gt(o*t*420)*u*.25}),n.empty=xe(.07,1,(o,l)=>l.next()*Tt(-o*130)*.6+Gt(o*t*1500)*Tt(-o*100)*.3);let a=0;n.swap=xe(.18,1.2,(o,l)=>(a=j(a+(l.next()-a)*.25),a*Gt(Pi(o/i(.18),1)*wl)*.9+Gt(o*t*300)*Tt(-is(0,o-i(.12))*80)*(o>i(.12)?.3:0)))}{let s=0,r=0;n.dash=xe(.35,1.6,(c,h)=>{let u=Gt(Pi(c/i(.35),1)*wl),d=.05+.4*u;return s=j(s+(h.next()-s)*d),r=j(r+(s-r)*d),r*u*1.5});let a=0;n.jump=xe(.14,.9,(c,h)=>(a=j(a+t*(130+120*c*7)*e),Gt(a)*Tt(-c*26)*.5+h.next()*Tt(-c*60)*.12));let o=0,l=0;n.land=xe(.16,1.2,(c,h)=>(o=j(o+t*(60+70*Tt(-c*30))*e),l=j(l+(h.next()-l)*.15),Gt(o)*Tt(-c*26)*.7+l*Tt(-c*30)))}{let s=0,r=0;n.wave=xe(1.1,.9,m=>{let x=Math.trunc(j(m/i(.26))),p=j(m-j(x*i(.26))),g=x%2===0?440:587.3;s=j(s+t*g*e);let v=Gt(s)>0?1:-1;return r=j(r+(v-r)*.18),(r*.5+Gt(s)*.4)*Pi(1,p*80)*Tt(-p*5)*(x<4?1:0)});let a=0,o=0;n.boss=xe(2,1.6,(m,x)=>{a=j(a+t*(44+12*Gt(m*3))*e);let p=2*(a/t-dr(a/t+.5));return o=j(o+(p+.3*x.next()-o)*(.04+.1*Pi(m,1))),o*Pi(1,m*4)*Tt(-is(0,m-i(1.2))*4)*(.7+.3*Gt(m*37))*2});let l=0;n.spawn=xe(.4,.8,m=>(l=j(l+t*(180+1500*m)*e),Gt(l)*(.6+.4*Gt(m*160))*Gt(Pi(m/i(.4),1)*wl)*.6));let c=0;n.waveClear=xe(.7,.8,m=>{let x=m<i(.12)?523.25:m<i(.24)?659.25:m<i(.36)?783.99:1046.5;c=j(c+t*x*e);let p=m<i(.36)?m%i(.12):m-i(.36);return(Gt(c)+.3*Gt(c*2))*Tt(-p*6)*.6});let h=0;n.death=xe(1.6,1.3,(m,x)=>(h=j(h+t*(220*Tt(-m*1.6)+30)*e),(2*(h/t-dr(h/t+.5))*.4+Gt(h*.5)*.6)*Tt(-m*1.6)+x.next()*Tt(-m*14)*.5));let u=0;n.ui=xe(.12,.7,m=>(u=j(u+t*990*e),Gt(u)*Tt(-m*30)));let d=0;n.melee=xe(.2,1.4,(m,x)=>(d=j(d+t*(90+200*Tt(-m*30))*e),Gt(d)*Tt(-m*20)+x.next()*Tt(-m*50)*.5));let f=0;n.beep=xe(.09,.7,m=>(f=j(f+t*1760*e),(Gt(f)>0?.5:-.5)*Tt(-m*25)))}return n}function*m_(){let n=fr,e=j(60/104),i=j(e/4),s=8,r=Math.trunc(j(j(s*4*e)*n)),a=new Float32Array(r),o=new Float32Array(r),l=Bd,c=new Tl(4242),h=(p,g,v,w,y)=>{let E=Math.trunc(j(p*n)),A=Math.trunc(j(g*n));v=j(v),w=j(w);for(let _=0;_<A;_++){let T=j(y(j(_/n))),I=(E+_)%r;a[I]+=j(T*v),o[I]+=j(T*w)}},u=[73.42,73.42,87.31,65.41,73.42,73.42,58.27,65.41],d=[[146.83,174.61,220],[146.83,174.61,220],[174.61,220,261.63],[130.81,164.81,196],[146.83,174.61,220],[146.83,174.61,220],[116.54,146.83,174.61],[130.81,164.81,196]],f=[1,0,1,1,0,1,1,0,1,0,1,1,0,1,0,1],m=[1,1,1,2,1,1,1,1,1,1,2,1,1,1,1,2],x=[0,1,2,1,0,2,1,2,0,1,2,0,2,1,0,2];for(let p=0;p<s;p++){let g=j(p*4*e);for(let y=0;y<4;y++){let E=j(g+j(y*e)),A=0;if(h(E,.3,.75,.75,_=>(A=j(A+l*(42+95*Tt(-_*28))/n),Gt(A)*Tt(-_*10))),yield,y%2===1){let _=0,T=0;h(E,.22,.26,.26,I=>{let R=c.next();return _=j(_+(R-_)*.3),T=j(T+l*185/n),(R-_)*Tt(-I*20)+Gt(T)*Tt(-I*30)*.5}),yield}}for(let y=0;y<16;y++){let E=j(g+j(y*i)),A=0,_=j(y%4===2?.16:y%2===1?.05:.09),T=y%4===2?45:90;if(h(E,.07,j(_*j(.8)),_,I=>{let R=c.next();return A=j(A+(R-A)*.6),(R-A)*Tt(-I*T)}),yield,f[y]===1){let I=j(j(u[p])*m[y]),R=0,D=0;h(E,j(i*j(1.1)),.34,.34,N=>{R=j(R+I/n),R=j(R-dr(R));let O=2*R-1,P=.03+.22*Tt(-N*18);return D=j(D+(O-D)*P),D*Pi(1,N*300)*Tt(-N*7)}),yield}if(p>=2){let I=j(j(d[p][x[y]])*(y%8===7?4:2));for(let[R,D]of[[0,.085],[3,.05],[6,.028]]){let N=j(D),O=0,P=R===3?j(N*j(.3)):N,z=R===6?j(N*j(.3)):R===3?N:j(N*j(.8));h(j(E+j(R*i)),.32,P,z,V=>(O=j(O+l*I/n),(Gt(O)+.35*Gt(O*2)+.15*Gt(O*3))*Tt(-V*13)*Pi(1,V*400))),yield}}}let v=j(4*e),w=j(v+.25);for(let y=0;y<3;y++){let E=j(d[p][y]);for(let[A,_,T]of[[.996,.05,.02],[1.004,.02,.05],[.5,.03,.03]]){let I=j(E*j(A)),R=j(y*j(.31)),D=0;h(g,w,_,T,N=>{R=j(R+I/n),R=j(R-dr(R)),D=j(D+(2*R-1-D)*.045);let O=Pi(1,N/.25)*Pi(1,is(0,(w-N)/.25));return D*O}),yield}}}for(let p=0;p<r;p++)a[p]=Math.tanh(j(a[p]*j(1.15))),o[p]=Math.tanh(j(o[p]*j(1.15)));return{left:a,right:o}}function Od(n){if(typeof MessageChannel=="function"){let t=new MessageChannel;t.port1.onmessage=()=>{t.port1.close(),n()},t.port2.postMessage(0)}else setTimeout(n,0)}var g_=4,x_=400,El=class{constructor({enabled:t=!0}={}){if(this.enabled=t,this.ctx=null,this.master=null,this.players=[],this.next=0,this.sounds={},this.music=null,this.musicSource=null,this.musicBuffer=null,this.musicStarted=!1,this._musicVolume=.42,this._musicOn=!0,this._resumeAt=-1/0,!t)return;let e=globalThis.AudioContext||globalThis.webkitAudioContext;if(!e){this.enabled=!1;return}try{try{this.ctx=new e({sampleRate:fr,latencyHint:"interactive"})}catch{this.ctx=new e}let r=this.ctx;this.master=r.createGain(),this.master.gain.value=.9,this.master.connect(r.destination);let a=p_();for(let o of Object.keys(a))this.sounds[o]=this.buffer([a[o]]);for(let o=0;o<u_;o++){let l=r.createGain(),c=r.createStereoPanner();l.connect(c),c.connect(this.master),this.players.push({gain:l,pan:c,src:null})}this.music=r.createGain(),this.music.gain.value=this._musicOn?this._musicVolume:0,this.music.connect(this.master)}catch{this.enabled=!1;return}let i=m_(),s=()=>{let r=performance.now();for(;;){let a;try{a=i.next()}catch{return}if(a.done){this.startMusic(a.value);return}if(performance.now()-r>=g_)break}Od(s)};Od(s)}get musicVolume(){return this._musicVolume}set musicVolume(t){this._musicVolume=t,this.applyMusicVolume()}get musicOn(){return this._musicOn}set musicOn(t){this._musicOn=!!t,this.applyMusicVolume()}applyMusicVolume(){if(!this.music)return;let t=this.music.gain,e=this.ctx.currentTime;t.cancelScheduledValues(e),t.setTargetAtTime(this._musicOn?this._musicVolume:0,e,.012)}resume(){if(!this.enabled||!this.ctx||this.ctx.state==="running"||this.ctx.state==="closed")return;this._resumeAt=performance.now();let t=this.ctx.resume();t&&t.catch&&t.catch(()=>{})}setMaster(t){this.enabled&&(this.master.gain.value=t)}play(t,e=1,i=0){if(!this.enabled)return;let s=this.sounds[t];if(!s||this.ctx.state!=="running"&&performance.now()-this._resumeAt>x_)return;let r=this.players[this.next];if(this.next=(this.next+1)%this.players.length,r.src){r.src.onended=null;try{r.src.stop()}catch{}r.src.disconnect(),r.src=null}r.gain.gain.value=e,r.pan.pan.value=is(-1,Pi(1,i));let a=this.ctx.createBufferSource();a.buffer=s,a.connect(r.gain),a.onended=()=>{a.disconnect(),r.src===a&&(r.src=null)},a.start(),r.src=a}playAt(t,e,i,s,r=1){if(!this.enabled)return;let a=Ne(e,i),o=Hi(a),l=1/(1+o*o/180);if(l<.03)return;let c=M(Math.cos(s),0,-Math.sin(s)),h=o>.5?Mi(kt(a,1/o),c)*.8:0;this.play(t,r*l,h)}buffer(t){let e=this.ctx.createBuffer(t.length,t[0].length,fr);for(let i=0;i<t.length;i++)e.copyToChannel(t[i],i);return e}startMusic({left:t,right:e}){if(!(!this.enabled||this.musicStarted))try{this.musicBuffer=this.buffer([t,e]);let i=this.ctx.createBufferSource();i.buffer=this.musicBuffer,i.loop=!0,i.connect(this.music),i.start(),this.musicSource=i,this.musicStarted=!0}catch{}}};var kd=["skitter","drone","trooper","roller","brute","boss"],mi={skitter:{displayName:"SKITTER",hp:38,speed:6.6,radius:.6,height:.9,score:50,cost:1,flies:!1,glow:M(1,.2,.1)},drone:{displayName:"DROHNE",hp:30,speed:6,radius:.6,height:1,score:75,cost:1.5,flies:!0,glow:M(1,.55,.1)},trooper:{displayName:"TROOPER",hp:95,speed:3.6,radius:.45,height:1.95,score:150,cost:3,flies:!1,glow:M(1,.15,.4)},roller:{displayName:"ROLLMINE",hp:45,speed:8.6,radius:.6,height:1.1,score:100,cost:2,flies:!1,glow:M(1,.8,.1)},brute:{displayName:"KOLOSS",hp:420,speed:2.3,radius:1,height:3.1,score:500,cost:9,flies:!1,glow:M(1,.32,.05)},boss:{displayName:"OVERSEER",hp:2600,speed:3,radius:2.3,height:4,score:5e3,cost:0,flies:!0,glow:M(1,.1,.18)}},Al="ZYX",__=!0,zd=new Map;function ws(n,...t){let e=`${n}:${t.join(",")}`,i=zd.get(e);return i||(i=et[n](...t),zd.set(e,i)),i}var Rt={box:(n,t,e,i=0)=>ws("box",n,t,e,i),sphere:(n,t=24)=>ws("sphere",n,t),cyl:(n,t,e=24)=>ws("cyl",n,t,e),capsule:(n,t)=>ws("capsule",n,t),cone:(n,t,e,i=24)=>ws("cone",n,t,e,i),torus:(n,t)=>ws("torus",n,t),pyramid:(n,t,e)=>ws("pyramid",n,t,e)};function Ct(n,t,e,i,s){let r=et.part(n,t,e,i,s);return r.rotation.order=Al,r.receiveShadow=__&&r.castShadow,r}function Ts(n,t=null){let e=new he;return e.rotation.order=Al,t&&te(e,t),n.add(e),e}var v_=new ze().setFromAxisAngle(new F(1,0,0),Math.PI/2),pr=class{constructor(t,e,i){let s=mi[t];this.kind=t,this.node=new he,this.model=new he,this.node.rotation.order=Al,this.model.rotation.order=Al,this.pos=ui(e),this.vel=M(0,0,0),this.yaw=0,this.maxHp=s.hp*i,this.hp=this.maxHp,this.radius=s.radius,this.height=s.height,this.speed=s.speed*jt(.92,1.08),this.attackCD=jt(.8,2),this.burst=0,this.burstT=0,this.flash=0,this.anim=jt(0,10),this.strafe=jt()<.5?-1:1,this.strafeT=jt(1.5,4),this.spawnT=.45,this.dead=!1,this.state=0,this.stateT=0,this.sees=!1,this.losT=jt(0,.2),this.side=0,this.armor=[],this.legs=[],this.spinners=[],this.hits=[],this.muzzles=[],this.debrisMat=null,this.blink=null,this.node.add(this.model),this.build(),te(this.node,this.pos),this.node.scale.set(.01,.01,.01)}get forward(){return M(Math.sin(this.yaw),0,Math.cos(this.yaw))}get right(){return M(Math.cos(this.yaw),0,-Math.sin(this.yaw))}world(t){let e=Math.sin(this.yaw),i=Math.cos(this.yaw);return M(this.pos.x+i*t.x+e*t.z,this.pos.y+t.y,this.pos.z-e*t.x+i*t.z)}get center(){return M(this.pos.x,this.pos.y+(mi[this.kind].flies?0:this.height*.55),this.pos.z)}armorMat(t,e=.38){let i=Kt.metal(t,{rough:e,plating:1});return i.normalScale.set(.45,.45),this.armor.push(i),i}build(){let t=this.model,e=this.armorMat(M(.075,.078,.09),.3),i=mi[this.kind].glow,s=Kt.glow(i,5);switch(this.kind){case"skitter":{let r=this.armorMat(M(.2,.035,.03),.34);Ct(t,Rt.sphere(.5,20),r,M(0,.48,0)).scale.set(.95,.5,1.3),Ct(t,Rt.sphere(.3,16),e,M(0,.46,.6)).scale.set(1,.7,1),Ct(t,Rt.box(.36,.07,.1),s,M(0,.5,.86),{shadow:!1}),Ct(t,Rt.box(.06,.05,.9),s,M(0,.74,-.05),{shadow:!1}),Ct(t,Rt.pyramid(.16,.5,.16),e,M(.14,.4,.82),{rot:M(Math.PI/2,0,0)}),Ct(t,Rt.pyramid(.16,.5,.16),e,M(-.14,.4,.82),{rot:M(Math.PI/2,0,0)}),[.4,0,-.4].forEach((c,h)=>{for(let u of[-1,1]){let d=Ts(t,M(u*.36,.5,c));Ct(d,Rt.box(.55,.08,.09),e,M(u*.25,.14,0),{rot:M(0,0,u*.55)}),Ct(d,Rt.box(.07,.72,.07),e,M(u*.56,-.1,0),{rot:M(0,0,u*.22)}),d.name=`${h}`,this.legs.push(d)}}),this.hits=[{offset:M(0,.5,0),r:.68,crit:!1}];let l=et.glowSprite(1.6,i,.35);te(l,M(0,.5,.5)),t.add(l);break}case"drone":{let r=this.armorMat(M(.24,.13,.03),.32);Ct(t,Rt.sphere(.42),e,M(0,0,0)),Ct(t,Rt.sphere(.17,16),s,M(0,.02,.33),{shadow:!1});let a=Ts(t);Ct(a,Rt.torus(.68,.055),r,M(0,0,0));for(let l=0;l<3;l++){let c=l/3*2*Math.PI;Ct(a,Rt.box(.12,.05,.32),s,M(Math.sin(c)*.68,0,Math.cos(c)*.68),{rot:M(0,c,0),shadow:!1})}this.spinners.push(a);for(let l of[-1,1])Ct(t,Rt.box(.16,.16,.6,.04),r,M(l*.52,-.05,-.05)),Ct(t,Rt.cyl(.05,.06,10),Kt.glow(M(.3,.8,1),5),M(l*.52,-.05,-.37),{rot:M(Math.PI/2,0,0),shadow:!1});Ct(t,Rt.cyl(.05,.45,10),e,M(0,-.3,.3),{rot:M(Math.PI/2,0,0)});let o=et.glowSprite(1.5,i,.4);te(o,M(0,0,.35)),t.add(o),this.hits=[{offset:M(0,0,0),r:.7,crit:!1}],this.muzzles=[M(0,-.3,.55)];break}case"trooper":{let r=this.armorMat(M(.17,.03,.07),.32);for(let l of[-1,1]){let c=Ts(t,M(l*.17,.98,0));Ct(c,Rt.capsule(.105,.55),e,M(0,-.25,0));let h=Ts(c,M(0,-.5,0));Ct(h,Rt.capsule(.085,.52),r,M(0,-.22,0)),Ct(h,Rt.box(.15,.09,.3,.02),e,M(0,-.45,.06)),this.legs.push(c),this.legs.push(h),Ct(t,Rt.sphere(.16,14),r,M(l*.37,1.62,0)),Ct(t,Rt.capsule(.075,.6),e,M(l*.36,1.38,.22),{rot:M(1.15,0,0)})}Ct(t,Rt.box(.42,.2,.28,.04),e,M(0,1.02,0)),Ct(t,Rt.box(.58,.56,.36,.07),r,M(0,1.4,0)),Ct(t,Rt.box(.22,.05,.03),s,M(0,1.5,.185),{shadow:!1}),Ct(t,Rt.box(.3,.42,.14,.03),e,M(0,1.42,-.22)),Ct(t,Rt.sphere(.175,16),e,M(0,1.84,.02)).scale.set(1,1.1,1.1),Ct(t,Rt.box(.26,.065,.12),s,M(0,1.86,.13),{shadow:!1}),Ct(t,Rt.box(.09,.13,.8,.02),e,M(.2,1.28,.55)),Ct(t,Rt.box(.05,.05,.3),s,M(.2,1.36,.6),{shadow:!1});let o=et.glowSprite(.9,i,.4);te(o,M(0,1.86,.2)),t.add(o),this.hits=[{offset:M(0,.55,0),r:.42,crit:!1},{offset:M(0,1.2,0),r:.5,crit:!1},{offset:M(0,1.84,0),r:.26,crit:!0}],this.muzzles=[M(.2,1.3,1)];break}case"roller":{let r=Ts(t,M(0,.55,0));Ct(r,Rt.sphere(.55),e,M(0,0,0)),Ct(r,Rt.torus(.555,.04),s,M(0,0,0),{shadow:!1}),Ct(r,Rt.torus(.555,.04),s,M(0,0,0),{rot:M(0,0,Math.PI/2),shadow:!1}),Ct(r,Rt.torus(.555,.04),s,M(0,0,0),{rot:M(Math.PI/2,0,0),shadow:!1});for(let o=0;o<6;o++){let l=[M(1,0,0),M(-1,0,0),M(0,1,0),M(0,-1,0),M(0,0,1),M(0,0,-1)][o],c=Ct(r,Rt.cone(0,.09,.3,8),e,kt(l,.62));cr(c,l),c.quaternion.multiply(v_)}this.spinners.push(r);let a=et.glowSprite(2.2,i,.5);te(a,M(0,.55,0)),a.name="blink",t.add(a),this.blink=a,this.hits=[{offset:M(0,.55,0),r:.66,crit:!1}];break}case"brute":{let r=this.armorMat(M(.2,.07,.025),.34);for(let o of[-1,1]){let l=Ts(t,M(o*.5,1.3,0));Ct(l,Rt.capsule(.3,1.3),e,M(0,-.6,0)),Ct(l,Rt.box(.5,.5,.62,.12),r,M(0,-.45,.06)),Ct(l,Rt.box(.56,.3,.75,.06),r,M(0,-1.15,.08)),this.legs.push(l),Ct(t,Rt.sphere(.52,20),r,M(o*1.18,2.55,0)).scale.set(1,.85,1.15),Ct(t,Rt.capsule(.22,1.15),e,M(o*1.25,1.75,.1)),Ct(t,Rt.sphere(.3,14),r,M(o*1.25,1.18,.12)),Ct(t,Rt.cyl(.17,1.1,14),e,M(o*1.18,2.95,.4),{rot:M(Math.PI/2,0,0)}),Ct(t,Rt.cyl(.12,.05,14),s,M(o*1.18,2.95,.96),{rot:M(Math.PI/2,0,0),shadow:!1}),this.muzzles.push(M(o*1.18,2.95,1.1))}Ct(t,Rt.box(1.35,.42,.85,.08),e,M(0,1.35,0)),Ct(t,Rt.box(1.75,1.25,1.15,.34),e,M(0,2.15,0)),Ct(t,Rt.box(1.25,.42,.3,.1),r,M(0,2.5,.5)),Ct(t,Rt.box(.9,.3,.2,.08),r,M(0,1.62,.5)),Ct(t,Rt.sphere(.27,16),s,M(0,2,.52),{shadow:!1}),Ct(t,Rt.torus(.34,.05),r,M(0,2,.56),{rot:M(Math.PI/2,0,0)}),Ct(t,Rt.box(.42,.32,.42,.06),e,M(0,2.92,.2)),Ct(t,Rt.box(.3,.07,.05),s,M(0,2.94,.42),{shadow:!1});let a=et.glowSprite(2.2,i,.45);te(a,M(0,2,.7)),t.add(a),this.hits=[{offset:M(0,.8,0),r:.8,crit:!1},{offset:M(0,2.1,0),r:1.15,crit:!1},{offset:M(0,2,.6),r:.4,crit:!0},{offset:M(0,2.92,.2),r:.3,crit:!0}];break}case"boss":{let r=this.armorMat(M(.16,.02,.04),.3);Ct(t,Rt.sphere(1.8,36),e,M(0,0,0)),Ct(t,Rt.sphere(.72,24),s,M(0,0,1.38),{shadow:!1}),Ct(t,Rt.torus(.85,.12),r,M(0,0,1.55),{rot:M(Math.PI/2,0,0)}),Ct(t,Rt.sphere(.25,12),Kt.glow(M(1,.9,.7),8),M(0,0,2.02),{shadow:!1}),[2.7,3.2,3.7].forEach((l,c)=>{let h=Ts(t);Ct(h,Rt.torus(l,.11),r,M(0,0,0)),Ct(h,Rt.torus(l,.045),s,M(0,.13,0),{shadow:!1}),h.rotation.set(c*.5+.2,0,c*.4),this.spinners.push(h)});for(let l=0;l<4;l++){let c=l/4*2*Math.PI+Math.PI/4;Ct(t,Rt.box(.22,2.6,1.2,.1),e,M(Math.sin(c)*1.9,.3,Math.cos(c)*1.9),{rot:M(0,c,0)}).rotation.set(0,c,0),Ct(t,Rt.box(.08,2.2,.08),s,M(Math.sin(c)*2.06,.3,Math.cos(c)*2.06),{shadow:!1})}Ct(t,Rt.cone(.2,1.3,1.6),e,M(0,-2.2,0)),Ct(t,Rt.cyl(1,.08),s,M(0,-3,0),{shadow:!1}),Ct(t,Rt.cone(0,.5,1.8,12),e,M(0,2.4,0));let a=et.glowSprite(7,i,.5);te(a,M(0,0,1.6)),t.add(a);let o=et.glowSprite(5,M(1,.4,.1),.5);te(o,M(0,-3.1,0)),t.add(o),this.hits=[{offset:M(0,0,0),r:2,crit:!1},{offset:M(0,0,1.45),r:.85,crit:!0}],this.muzzles=[M(0,0,2.2),M(1.6,-.6,1.4),M(-1.6,-.6,1.4)];break}}this.debrisMat=this.armor[this.armor.length-1]??e}setFlash(t){let e=t?1:0;for(let i of this.armor)i.emissive.setRGB(e,e,e),i.emissiveIntensity=t?.55:0}rayHit(t,e,i,s=0){let r=1/0,a=1/0;for(let o of this.hits){let l=this.world(o.offset),c=o.r+s,h=Ne(t,l),u=Mi(h,e),d=Mi(h,h)-c*c,f=u*u-d;if(f<0)continue;let m=-u-Math.sqrt(f);m<0&&(m=d<0?0:-1),!(m<0||m>i)&&(o.crit?a=Math.min(a,m):r=Math.min(r,m))}return a<1/0&&a<=r+.7?{t:Math.min(a,r),crit:!0}:r<1/0?{t:r,crit:!1}:null}};var ch=M(1,1,1),Es=new F,uh=class{constructor(t,e,i,s){this.def=t,this.node=e,this.muzzle=i,this.flash=s,this.ammo=t.mag,this.reserve=t.reserveStart,this.cooldown=0}reset(){this.ammo=this.def.mag,this.reserve=this.def.reserveStart,this.cooldown=0}},dh=class{constructor(t){this.pos=t.pos,this.vel=t.vel,this.damage=t.damage,this.splash=t.splash,this.fromPlayer=t.fromPlayer,this.life=t.life,this.radius=t.radius,this.color=t.color,this.gravity=t.gravity,this.node=t.node,this.trail=t.trail||null}},fh=class{constructor(t,e,i,s){this.kind=t,this.pos=e,this.node=i,this.spin=s,this.life=28,this.t=jt(0,6)}};function hh(n,t=!0){n.traverse(e=>{e.material&&(Array.isArray(e.material)?e.material.forEach(i=>i.dispose()):e.material.dispose()),t&&e.geometry&&!e.isSprite&&e.geometry.dispose()})}function Hd(n,t){n.traverse(e=>{if(!e.material)return;let i=e.material;i.transparent||(i.transparent=!0,i.needsUpdate=!0),i.userData.baseOpacity===void 0&&(i.userData.baseOpacity=i.opacity),i.opacity=i.userData.baseOpacity*t})}var Gd={buildWeapons(){let n=Kt.metal(M(.11,.115,.13),{rough:.32,plating:2}),t=Kt.metal(M(.36,.38,.42),{rough:.24,plating:2}),e=(s,r,a,o,l=null)=>et.part(s,r,a,o,{rot:l,shadow:!1}),i=(s,r,a,o)=>{let l=new he;te(l,a),r.add(l);let c=et.glowSprite(o,nn(s.color,ch,.35),3,ut.flare);c.material.depthTest=!1,c.visible=!1,l.add(c),r.traverse(h=>{h.castShadow=!1,h.receiveShadow=!1,h.layers.set(pa)}),r.visible=!1,this.weaponHolder.add(r),this.weapons.push(new uh(s,r,l,c))};{let s=M(.25,.9,1),r={name:"PULSGEWEHR",short:"PULS",kind:"hitscan",damage:13,pellets:1,spread:.008,interval:.092,mag:40,reload:1.25,color:s,kick:.035,sound:"rifle",reserveMax:-1,reserveStart:-1},a=new he,o=Kt.glow(s,2.2);e(a,et.box(.09,.14,.5,.015),n,M(0,0,0)),e(a,et.box(.07,.05,.64,.01),t,M(0,.09,-.1)),e(a,et.cyl(.024,.42,14),t,M(0,.02,-.46),M(Math.PI/2,0,0)),e(a,et.box(.078,.09,.3,.02),n,M(0,.02,-.36)),e(a,et.box(.094,.018,.3),o,M(0,.035,-.04)),e(a,et.box(.082,.012,.2),o,M(0,0,-.36)),e(a,et.box(.06,.22,.1,.01),t,M(0,-.16,-.03),M(.16,0,0)),e(a,et.box(.06,.17,.085,.015),n,M(0,-.13,.18),M(-.32,0,0)),e(a,et.box(.07,.11,.26,.02),n,M(0,-.02,.36)),e(a,et.box(.03,.05,.06),n,M(0,.135,.06)),e(a,et.box(.012,.012,.012),o,M(0,.165,.06)),i(r,a,M(0,.02,-.7),.55)}{let s=M(1,.55,.12),r={name:"STREUKANONE",short:"STREU",kind:"hitscan",damage:9.5,pellets:10,spread:.07,interval:.72,mag:8,reload:1.6,color:s,kick:.16,sound:"shotgun",reserveMax:56,reserveStart:24},a=new he,o=Kt.glow(s,2.2);e(a,et.box(.115,.14,.46,.02),n,M(0,0,.02));for(let l of[-.036,.036])e(a,et.cyl(.036,.62,16),t,M(l,.03,-.46),M(Math.PI/2,0,0)),e(a,et.cyl(.027,.01,16),Kt.glow(s,1.2),M(l,.03,-.772),M(Math.PI/2,0,0));e(a,et.box(.13,.085,.22,.02),t,M(0,-.035,-.4)),e(a,et.box(.134,.016,.16),o,M(0,-.035,-.4)),e(a,et.box(.12,.02,.3),o,M(0,.05,.04)),e(a,et.box(.065,.18,.09,.015),n,M(0,-.14,.2),M(-.35,0,0)),e(a,et.box(.08,.12,.28,.02),n,M(0,-.03,.38)),e(a,et.box(.02,.03,.4),t,M(0,.085,-.3)),i(r,a,M(0,.03,-.8),.95)}{let s=M(.72,.42,1),r={name:"RAILGUN",short:"RAIL",kind:"rail",damage:190,pellets:1,spread:0,interval:1.05,mag:4,reload:1.9,color:s,kick:.2,sound:"rail",reserveMax:24,reserveStart:8},a=new he,o=Kt.glow(s,2.6);e(a,et.box(.12,.17,.42,.02),n,M(0,0,.12));for(let l of[-.046,.046])e(a,et.box(.03,.06,.95,.005),t,M(l,.03,-.4));e(a,et.box(.028,.028,.9),o,M(0,.03,-.4));for(let l=0;l<5;l++)e(a,et.torus(.078,.013),n,M(0,.03,-.12-l*.17),M(Math.PI/2,0,0));e(a,et.cyl(.03,.26,14),n,M(0,.14,.1),M(Math.PI/2,0,0)),e(a,et.cyl(.022,.01,14),o,M(0,.14,-.035),M(Math.PI/2,0,0)),e(a,et.box(.124,.02,.24),o,M(0,-.02,.12)),e(a,et.box(.065,.18,.09,.015),n,M(0,-.15,.22),M(-.32,0,0)),e(a,et.box(.08,.12,.22,.02),n,M(0,-.02,.42)),i(r,a,M(0,.03,-.9),.9)}{let s=M(.35,1,.45),r={name:"PLASMAWERFER",short:"PLASMA",kind:"launcher",damage:135,pellets:1,spread:0,interval:.85,mag:4,reload:2.1,color:s,kick:.2,sound:"launcher",reserveMax:20,reserveStart:8},a=new he,o=Kt.glow(s,2.2);e(a,et.cyl(.085,.62,20),n,M(0,.04,-.3),M(Math.PI/2,0,0)),e(a,et.torus(.09,.018),o,M(0,.04,-.6),M(Math.PI/2,0,0)),e(a,et.torus(.092,.014),t,M(0,.04,-.35),M(Math.PI/2,0,0)),e(a,et.torus(.092,.014),t,M(0,.04,-.15),M(Math.PI/2,0,0)),e(a,et.box(.14,.16,.36,.025),n,M(0,-.01,.16)),e(a,et.sphere(.075,16),o,M(0,.1,.12)),e(a,et.torus(.085,.012),t,M(0,.1,.12)),e(a,et.torus(.085,.012),t,M(0,.1,.12),M(0,0,Math.PI/2)),e(a,et.box(.065,.18,.09,.015),n,M(0,-.16,.24),M(-.32,0,0)),e(a,et.box(.06,.14,.08,.015),t,M(0,-.12,-.2),M(.2,0,0)),i(r,a,M(0,.04,-.66),.8)}},selectWeapon(n){n===this.cur||n<0||n>=this.weapons.length||this.switchT>0||(this.pendingWeapon=n,this.switchT=.28,this.reloadT=0,this.audio.play("swap",.7))},startReload(){let n=this.weapons[this.cur];this.reloadT<=0&&n.ammo<n.def.mag&&(n.def.reserveMax<0||n.reserve>0)&&(this.reloadDur=n.def.reload,this.reloadT=this.reloadDur,this.audio.play("reload",.8))},updateWeapons(n,t){if(["Digit1","Digit2","Digit3","Digit4"].forEach((s,r)=>{t.hit(s)&&this.selectWeapon(r)}),t.scroll!==0&&this.switchT<=0&&this.selectWeapon((this.cur+(t.scroll>0?this.weapons.length-1:1))%this.weapons.length),this.switchT>0){let s=this.switchT;this.switchT-=n,s>.14&&this.switchT<=.14&&this.pendingWeapon>=0&&(this.weapons[this.cur].node.visible=!1,this.weapons[this.cur].flash.visible=!1,this.cur=this.pendingWeapon,this.pendingWeapon=-1,this.weapons[this.cur].node.visible=!0)}let i=this.weapons[this.cur];for(let s of this.weapons)s.cooldown=Math.max(0,s.cooldown-n);if(this.bloom=Math.max(0,this.bloom-n*.05),this.hitSoundT=Math.max(0,this.hitSoundT-n),this.reloadT>0){if(this.reloadT-=n,this.reloadT<=0){let s=i.def.mag-i.ammo;if(i.def.reserveMax<0)i.ammo=i.def.mag;else{let r=Math.min(s,i.reserve);i.ammo+=r,i.reserve-=r}}return}if(!(this.switchT>0)){if(t.hit("KeyR")){this.startReload();return}if(t.fire&&i.cooldown<=0){if(i.ammo<=0){i.def.reserveMax<0||i.reserve>0?this.startReload():t.clicked&&(this.audio.play("empty"),this.hud.feedLine(`${i.def.name}: keine Munition`,M(1,.4,.3)),this.selectWeapon(0));return}this.fire(i)}}},spreadDir(n){if(n<=0)return this.viewDir;let t=this.viewDir,e=sn(ha(t,M(0,1,0)),M(1,0,0)),i=ha(e,t),s=jt(0,2*Math.PI),r=Math.sqrt(jt())*n;return fn(Yt(t,Yt(kt(e,Math.cos(s)*r),kt(i,Math.sin(s)*r))))},fire(n){let t=n.def;n.ammo-=1,n.cooldown=t.interval*(this.overcharge>0?.8:1),this.shotsFired+=1;let e=this.overcharge>0?2:1;this.kickZ=Math.min(.13,this.kickZ+t.kick*.7),this.kickRot=Math.min(.3,this.kickRot+t.kick*.9),this.recoilPitch+=t.kick*.12,this.fx.shake(t.kick*.9),this.audio.play(t.sound,t.kind==="hitscan"&&t.pellets===1?.55:.9),n.flash.visible=!0,n.flash.material.rotation=jt(0,6.28);let i=jt(.8,1.25),s=n.flash.userData.baseSize||(n.flash.userData.baseSize=n.flash.scale.x);n.flash.scale.set(s*i,s*i,1),this.flashT=.045;let r=this.eye,a=this.viewDir,o=this.rightV;this.camera.updateMatrixWorld(!0),n.muzzle.getWorldPosition(Es),this.camera.worldToLocal(Es);let l=sn(M(Es.x,Es.y,Es.z)),c=ha(o,a),h=Le(r,Yt(Yt(kt(o,l.x),kt(c,l.y)),kt(a,-l.z)),1.5);this.fx.flash(Le(r,a,.8),t.color,500+t.kick*4e3,.09,9);let u=!1;switch(t.kind){case"hitscan":{let d=(this.onGround?0:.012)+Math.min(Cn(this.vel)/9.6,1)*.004;for(let f=0;f<t.pellets;f++){let m=this.spreadDir(t.spread+this.bloom+d),x=this.level.raycast(r,m,220),p=x?x.t:220,g=null,v=!1;for(let y of this.enemies){if(y.dead)continue;let E=y.rayHit(r,m,p);E&&(p=E.t,g=y,v=E.crit)}let w=Le(r,m,p);if(this.fx.tracer(h,w,t.color,t.pellets>1?.018:.024,.07,t.pellets>1?1.6:2.6),g){let y=t.damage*e;t.pellets>1&&(y*=Me(1.25-p/34,.35,1)),this.damageEnemy(g,y*(v?2:1),w,m,v),u=!0}else x&&this.fx.impact(w,x.n,t.color)}t.pellets===1&&(this.bloom=Math.min(.028,this.bloom+.0045));break}case"rail":{let d=a,f=this.level.raycast(r,d,260),m=f?f.t:260;for(let p of this.enemies.slice()){if(p.dead)continue;let g=p.rayHit(r,d,m,.12);g&&(this.damageEnemy(p,t.damage*e*(g.crit?1.6:1),Le(r,d,g.t),d,g.crit),u=!0)}let x=Le(r,d,m);this.fx.railBeam(h,x,t.color),f&&this.fx.impact(x,f.n,t.color,!0);break}case"launcher":{let d=a,f=Ne(Yt(Le(r,d,.9),kt(o,.16)),M(0,.14,0));this.spawnProjectile(f,Yt(kt(d,40),M(0,1.2,0)),t.damage*e,5.5,!0,5,.22,t.color,5,!0),u=!1;break}}u&&(this.shotsHit+=1)},damageEnemy(n,t,e,i,s,r=!1){if(n.dead)return;n.hp-=t,n.flash<=0&&n.setFlash(!0),n.flash=.07,n.sees=!0;let a=n.hp<=0,o=mi[n.kind];if(r||(this.fx.hitSparks(e,i,o.glow,s),this.hud.hit(a,s),this.hitSoundT<=0&&(this.audio.play(s?"crit":"hit",.5),this.hitSoundT=.04)),n.kind!=="boss"&&n.kind!=="brute"){let l=Math.min(t*.06,4);n.vel.x+=i.x*l,n.vel.z+=i.z*l}a&&this.killEnemy(n)},killEnemy(n,t=!0){if(n.dead)return;n.dead=!0,n.setFlash(!1),n.node.removeFromParent();let e=mi[n.kind],i=n.center,s;switch(n.kind){case"skitter":case"drone":s=1.3;break;case"trooper":s=1.6;break;case"roller":s=4.2;break;case"brute":s=3.4;break;default:s=7}if(this.fx.explosion(i,s,n.kind==="roller"?M(1,.7,.2):nn(e.glow,M(1,.6,.2),.5),Math.min(.9,s*.12)),this.fx.debris(i,n.kind==="boss"?26:n.kind==="brute"?12:5,n.debrisMat,n.kind==="boss"?.6:n.kind==="brute"?.4:.2,4+s*1.6),this.audio.playAt(s>3?"explosion":"enemyDie",i,this.pos,this.yaw,s>3?1:.8),this.fx.after(4,()=>hh(n.node,!1)),n.kind==="roller"&&this.radialDamage(i,5,70,26,n),n.kind==="boss"){for(let c=0;c<5;c++){let h=Yt(i,kt(Jn(),2.5));this.fx.after(.15+c*.18,()=>{this.fx.explosion(h,4,M(1,.5,.2),.4),this.audio.play("explosion",.8)})}this.hud.flash(ch,.5,.6),this.hud.announce("OVERSEER ZERST\xD6RT",`+${e.score*this.comboMult}`,M(1,.8,.3),2);let l=["health","ammo","power"];for(let c=0;c<3;c++)this.spawnPickup(l[Math.floor(Math.random()*3)],M(i.x+jt(-3,3),0,i.z+jt(-3,3)))}if(!t)return;this.kills+=1,this.combo+=1,this.comboT=1;let r=e.score*this.comboMult;this.score+=r,this.hud.feedLine(`${e.displayName}  +${r}`),this.hitSoundT<=.03&&this.audio.play("kill",.6);let a=jt(),o=n.kind==="brute"?1:n.kind==="trooper"?.3:.15;if(n.kind!=="boss"&&a<o){let l=jt(),c=this.hp<60,h=l<(c?.6:.35)?"health":l<.92?"ammo":"power";this.spawnPickup(h,M(i.x,this.level.groundHeight(i.x,i.z,.2,2.5),i.z))}},radialDamage(n,t,e,i,s=null){for(let r of this.enemies.slice()){if(r.dead||r===s)continue;let a=Gi(r.center,n)-r.radius;if(a<t){let o=Me(1-a/t,0,1);this.damageEnemy(r,e*(.35+.65*o),r.center,sn(Ne(r.center,n)),!1,!0)}}if(i>0){let r=Yt(this.pos,M(0,.9,0)),a=Gi(r,n);if(a<t){let o=Me(1-a/t,0,1);this.hurtPlayer(i*(.3+.7*o),n);let l=kt(sn(Ne(r,n)),9*o);this.vel.x+=l.x,this.vel.y+=Math.max(l.y,0)+3*o,this.vel.z+=l.z,this.onGround=!1}}},spawnProjectile(n,t,e,i,s,r,a,o,l,c){let h=new he,u=new Qt(et.sphere(a*.7,10),Kt.additive(null,nn(o,ch,.6),3));h.add(u),h.add(et.glowSprite(a*(c?9:7),o,c?1.5:1.2)),te(h,n),this.scene.add(h);let d=c?this.fx.attachTrail(h,o,a*1.6):null;this.projectiles.push(new dh({pos:ui(n),vel:ui(t),damage:e,splash:i,fromPlayer:s,life:r,radius:a,color:o,gravity:l,node:h,trail:d}))},removeProjectile(n){let t=this.projectiles[n];t.trail&&t.trail.remove(),t.node.removeFromParent(),hh(t.node),this.projectiles.splice(n,1)},updateProjectiles(n){let t=0;for(;t<this.projectiles.length;){let e=this.projectiles[t];e.life-=n,e.gravity!==0&&(e.vel.y-=e.gravity*n);let i=kt(e.vel,n),s=Hi(i),r=s>1e-6?kt(i,1/s):M(0,-1,0),a=s,o=null,l=null,c=!1,h=!1,u=this.level.raycast(e.pos,r,s);if(u&&(a=u.t,o=u.n),e.fromPlayer)for(let f of this.enemies){if(f.dead)continue;let m=f.rayHit(e.pos,r,a,e.radius);m&&(a=m.t,l=f,h=m.crit)}else if(this.phase==="playing")for(let[f,m]of[[Yt(this.pos,M(0,.75,0)),.7],[Yt(this.pos,M(0,1.5,0)),.42]]){let x=Ne(e.pos,f),p=Mi(x,r),g=Mi(x,x)-(m+e.radius)*(m+e.radius),v=p*p-g;if(v<0)continue;let w=-p-Math.sqrt(v);w<0&&g<0&&(w=0),w>=0&&w<=a&&(a=w,c=!0)}let d=o!==null||l!==null||c;if(d||e.life<=0){let f=Le(e.pos,r,a);if(e.splash>0)if(this.fx.explosion(f,e.splash*.8,e.color,e.fromPlayer?.35:.3),this.audio.playAt("explosion",f,this.pos,this.yaw,.9),e.fromPlayer){let x=!1;for(let p of this.enemies)if(!p.dead&&Gi(p.center,f)-p.radius<e.splash){x=!0;break}x&&(this.shotsHit+=1,this.hud.hit(!1,!1)),this.radialDamage(f,e.splash,e.damage,e.damage*.22)}else{let x=Gi(Yt(this.pos,M(0,.9,0)),f);x<e.splash&&this.hurtPlayer(e.damage*Me(1.15-x/e.splash,.25,1),f)}else d&&(l?this.damageEnemy(l,e.damage*(h?2:1),f,r,h):c?(this.hurtPlayer(e.damage,Ne(f,kt(r,3))),this.fx.glowPop(f,e.color,1)):o&&this.fx.impact(f,o,e.color));let m=this.projectiles.indexOf(e);m>=0&&this.removeProjectile(m);continue}e.pos=Yt(e.pos,i),te(e.node,e.pos),t+=1}},spawnPickup(n,t){let e=new he,i=new he;e.add(i);let s;switch(n){case"health":{s=M(.3,1,.5);let l=Kt.glow(s,4);et.part(i,et.box(.5,.16,.16,.03),l,M(0,0,0),{shadow:!1}),et.part(i,et.box(.16,.5,.16,.03),l,M(0,0,0),{shadow:!1});break}case"ammo":{s=M(1,.6,.15),et.part(i,et.box(.42,.3,.3,.04),Kt.metal(M(.2,.2,.22),{rough:.35}),M(0,0,0)),et.part(i,et.box(.44,.06,.32),Kt.glow(s,4),M(0,.05,0),{shadow:!1}),et.part(i,et.box(.1,.32,.32),Kt.glow(s,4),M(0,0,0),{shadow:!1});break}default:{s=M(.75,.4,1);let l=Kt.glow(s,5);et.part(i,et.pyramid(.4,.38,.4),l,M(0,0,0),{shadow:!1}),et.part(i,et.pyramid(.4,.38,.4),l,M(0,0,0),{rot:M(Math.PI,0,0),shadow:!1})}}e.add(et.glowSprite(1.7,s,.7));let r=new Qt(et.plane(1.5,1.5),Kt.additive(ut.ring,s,.9));r.rotation.set(-Math.PI/2,0,0),r.position.set(0,-.84,0),e.add(r);let a=new Qt(et.cone(.05,.55,1.8,16),Kt.additive(ut.shaft,s,.35));e.add(a);let o=ui(t);o.y=this.level.groundHeight(t.x,t.z,.2,t.y+.3)+.9,te(e,o),this.scene.add(e),this.pickups.push(new fh(n,o,e,i))},updatePickups(n){let t=0;for(;t<this.pickups.length;){let e=this.pickups[t];e.life-=n,e.t+=n;let i=e.life<=0,s=Yt(this.pos,M(0,.9,0)),r=Gi(s,e.pos);if(this.phase==="playing"){let a=!0;switch(e.kind){case"health":a=this.hp<100;break;case"ammo":a=this.weapons.some(o=>o.def.reserveMax>0&&o.reserve<o.def.reserveMax);break;default:a=!0}if(a&&r<4.5&&(e.pos=Le(e.pos,sn(Ne(s,e.pos)),Math.min(r,n*(4+(4.5-r)*5)))),a&&r<1.3)switch(i=!0,e.kind){case"health":this.hp=Math.min(100,this.hp+30),this.hud.feedLine("+30 Vital",M(.4,1,.6)),this.hud.flash(M(.3,1,.5),.18,.35),this.audio.play("pickup");break;case"ammo":for(let o of this.weapons)o.def.reserveMax>0&&(o.reserve=Math.min(o.def.reserveMax,o.reserve+Math.max(1,Math.trunc(o.def.reserveMax*.35))));this.hud.feedLine("Munition aufgef\xFCllt",M(1,.7,.3)),this.hud.flash(M(1,.6,.2),.15,.35),this.audio.play("pickup");break;default:this.overcharge=12,this.hud.announce("\xDCBERLADUNG","Doppelter Schaden \xB7 schnellere Feuerrate",M(.8,.5,1),1.2),this.hud.flash(M(.7,.4,1),.3,.5),this.audio.play("power")}}if(i){e.node.removeFromParent(),hh(e.node),this.pickups.splice(t,1);continue}te(e.node,Yt(e.pos,M(0,Math.sin(e.t*2.2)*.12,0))),e.spin.rotation.y+=n*2*Math.PI/2.4,e.life<4?(Hd(e.node,.35+.65*Math.abs(Math.sin(e.life*6))),e.blinking=!0):e.blinking&&(Hd(e.node,1),e.blinking=!1),t+=1}},faceToward(n,t,e,i=8){if(th(t)<1e-4)return;let s=Math.atan2(t.x,t.y);n.yaw+=lr(s-n.yaw)*Math.min(1,e*i)},moveGround(n,t,e,i){let s=Math.min(1,i*7);n.vel.x+=(t.x*e-n.vel.x)*s,n.vel.z+=(t.y*e-n.vel.z)*s;let r=M(n.pos.x+n.vel.x*i,n.pos.y,n.pos.z+n.vel.z*i);this.level.resolve(r,Math.min(n.radius,.6)*.75,n.pos.y,n.height,.55);let a=this.level.groundHeight(r.x,r.z,.15,n.pos.y,.55);r.y=a>n.pos.y?Math.min(a,n.pos.y+i*7):Math.max(a,n.pos.y-i*14),n.pos=r},enemyShoot(n,t,e,i,s,r=0,a=.6,o=0){let l=mi[n.kind],c=n.world(t),h=Gi(c,this.pos),u=Yt(Yt(this.pos,M(0,1.15,0)),kt(M(this.vel.x,0,this.vel.z),h/e*a));r>0&&(u.y=this.pos.y+.3);let d=sn(Ne(u,c));d=fn(Yt(d,kt(Jn(),s))),this.spawnProjectile(c,kt(d,e),i,r,!1,6,r>0?.2:.11,r>0?M(1,.45,.1):l.glow,o,r>0),this.fx.glowPop(c,l.glow,r>0?1.6:.9,1.5,.1),this.audio.playAt(r>0?"launcher":"enemyShot",c,this.pos,this.yaw,.75)},updateEnemies(n){let t=this.phase==="playing",e=Yt(this.pos,M(0,1.1,0)),i=this.pos,s=this.enemies,r=s.length;if(r>1)for(let o=0;o<r-1;o++){let l=s[o];if(l.kind==="boss")continue;let c=mi[l.kind].flies;for(let h=o+1;h<r;h++){let u=s[h];if(u.kind==="boss"||c!==mi[u.kind].flies)continue;let d=u.pos.x-l.pos.x,f=u.pos.z-l.pos.z,m=(l.radius+u.radius)*.9,x=d*d+f*f;if(x<m*m&&x>1e-5){let p=Math.sqrt(x),g=(m-p)*.5*Math.min(1,n*12);l.pos.x-=d/p*g,l.pos.z-=f/p*g,u.pos.x+=d/p*g,u.pos.z+=f/p*g}}}for(let o of s.slice()){if(o.dead)continue;let l=mi[o.kind];if(o.anim+=n,o.flash>0&&(o.flash-=n,o.flash<=0&&o.setFlash(!1)),o.spawnT>0){o.spawnT-=n;let f=1-Math.max(0,o.spawnT)/.45,m=Math.max(.01,f*f*(3-2*f));o.node.scale.set(m,m,m),te(o.node,o.pos),o.node.rotation.set(0,o.yaw,0);continue}o.losT-=n,o.losT<=0&&(o.losT=.2,o.sees=this.level.lineOfSight(l.flies?o.pos:Yt(o.pos,M(0,o.height*.8,0)),e)),o.attackCD-=n;let c=Pn(i.x-o.pos.x,i.z-o.pos.z),h=th(c),u=h>.001?Vi(c,1/h):Pn(0,1),d=Pn(-u.y,u.x);switch(o.strafeT-=n,o.strafeT<=0&&(o.strafeT=jt(1.5,4),o.strafe=-o.strafe),o.kind){case"skitter":{let f=o.sees&&h<7,m=f?u:this.level.nav.direction(o.pos,i),x=f?Vi(d,Math.sin(o.anim*5)*.35):Pn(0,0),p=ua(Ss(m,x));this.moveGround(o,p,h<1.2?0:o.speed,n),this.faceToward(o,h<3?u:p,n,10),t&&h<1.75&&Math.abs(o.pos.y-i.y)<2.3&&o.attackCD<=0&&(o.attackCD=.8,this.hurtPlayer(9+this.wave*.3,o.pos),this.audio.play("melee",.8),o.state=1,o.stateT=.2),o.stateT>0&&(o.stateT-=n);let g=Cn(o.vel);o.legs.forEach((v,w)=>{let y=o.anim*(6+g*2.2)+w*2.1;v.rotation.set(Math.sin(y)*.12,Math.cos(y)*.45*Math.min(1,g/2+.2),Math.sin(y)*.18*(w%2===0?1:-1))}),o.model.position.set(0,Math.abs(Math.sin(o.anim*14))*.03*g/6,o.stateT>0?.3:0);break}case"roller":{let f=o.sees&&h<10?u:this.level.nav.direction(o.pos,i);o.vel.x+=(f.x*o.speed-o.vel.x)*Math.min(1,n*2.2),o.vel.z+=(f.y*o.speed-o.vel.z)*Math.min(1,n*2.2);let m=M(o.pos.x+o.vel.x*n,o.pos.y,o.pos.z+o.vel.z*n),x=m.x,p=m.z;this.level.resolve(m,.5,o.pos.y,1,.55),Math.hypot(x-m.x,p-m.z)>1e-4&&(o.vel.x*=.82,o.vel.y*=.82,o.vel.z*=.82);let g=this.level.groundHeight(m.x,m.z,.15,o.pos.y,.55);m.y=g>o.pos.y?Math.min(g,o.pos.y+n*7):Math.max(g,o.pos.y-n*14),o.pos=m;let v=Cn(o.vel);if(v>.2&&o.spinners[0]){let y=fn(ha(M(0,1,0),M(o.vel.x,0,o.vel.z))),E=Math.sin(o.yaw),A=Math.cos(o.yaw);Es.set(A*y.x-E*y.z,0,E*y.x+A*y.z).normalize();let _=new ze().setFromAxisAngle(Es,v*n/.55);o.spinners[0].quaternion.premultiply(_)}let w=h<8?14:4;if(o.blink&&(o.blink.material.opacity=.4+.6*Math.abs(Math.sin(o.anim*w))),t&&Gi(o.center,e)<2.4){this.killEnemy(o,!1);continue}break}case"drone":{let f;h>15?f=u:h<8?f=Vi(u,-1):f=Vi(d,o.strafe),o.sees||(f=this.level.nav.direction(o.pos,i)),f=ua(Ss(f,Vi(d,o.strafe*.4)));let m=i.y+3+Math.sin(o.anim*1.3)*.6,x=Math.min(1,n*2.5);o.vel.x+=(f.x*o.speed-o.vel.x)*x,o.vel.y+=((m-o.pos.y)*2.5-o.vel.y)*x,o.vel.z+=(f.y*o.speed-o.vel.z)*x;let p=Le(o.pos,o.vel,n);this.level.resolve(p,.6,p.y-.5,1,0),p.y=Math.max(p.y,this.level.groundHeight(p.x,p.z,.6,p.y+3,0)+1.2),o.pos=p,this.faceToward(o,u,n,6),o.spinners[0]&&o.spinners[0].rotation.set(0,o.anim*5,0);let g=Pn(o.vel.x,o.vel.z);o.model.rotation.set(Me(jc(g,u)*.04,-.3,.3),0,Me(-jc(g,d)*.05,-.4,.4)),t&&o.sees&&o.attackCD<=0&&h<32&&(o.attackCD=jt(1.5,2.4)*Math.max(.6,1-this.wave*.02),this.enemyShoot(o,o.muzzles[0],21,8,.03));break}case"trooper":{let f,m=o.speed;!o.sees||h>22?f=this.level.nav.direction(o.pos,i):h<8?(f=ua(Ss(Vi(u,-1),Vi(d,o.strafe*.8))),m*=.8):(f=ua(Ss(Vi(d,o.strafe),Vi(u,.25))),m*=.65),o.burst>0&&(m*=.3),this.moveGround(o,f,m,n),this.faceToward(o,o.sees?u:f,n,7),t&&o.sees&&h<34?(o.burst===0&&o.attackCD<=0&&(o.burst=3,o.burstT=.25),o.burst>0&&(o.burstT-=n,o.burstT<=0&&(o.burstT=.15,o.burst-=1,this.enemyShoot(o,o.muzzles[0],27,7,.035),o.burst===0&&(o.attackCD=jt(1.8,2.8)*Math.max(.6,1-this.wave*.02))))):o.burst=0;let x=Cn(o.vel),p=o.anim*(3+x*1.6),g=Math.min(1,x/2.5)*.65;o.legs[0].rotation.set(Math.sin(p)*g,0,0),o.legs[1].rotation.set(Math.max(0,-Math.cos(p))*g*1.3,0,0),o.legs[2].rotation.set(-Math.sin(p)*g,0,0),o.legs[3].rotation.set(Math.max(0,Math.cos(p))*g*1.3,0,0),o.model.position.set(0,Math.abs(Math.sin(p))*.04*g,0);break}case"brute":{let f=o.sees&&h<15,m=o.sees&&h<9?u:this.level.nav.direction(o.pos,i);this.moveGround(o,m,f?o.speed*.55:o.speed,n),this.faceToward(o,o.sees?u:m,n,3),t&&o.sees&&h<40&&h>4.5&&o.attackCD<=0&&(o.side=1-o.side,this.enemyShoot(o,o.muzzles[o.side],15,28,.02,3.6,.5),o.burst+=1,o.attackCD=o.burst%2===0?jt(2.6,3.4):.45),t&&h<3.3&&Math.abs(o.pos.y-i.y)<3&&o.stateT<=0&&(o.stateT=1.5,this.hurtPlayer(26,o.pos),this.vel.x+=u.x*11,this.vel.y+=4.5,this.vel.z+=u.y*11,this.onGround=!1,this.fx.spawnFlash(Yt(o.pos,kt(M(u.x,0,u.y),1.5)),l.glow),this.fx.shake(.5),this.audio.play("melee")),o.stateT-=n;let x=Cn(o.vel),p=o.anim*(2+x*1.3),g=Math.min(1,x/1.5)*.4;o.legs[0].rotation.set(Math.sin(p)*g,0,0),o.legs[1].rotation.set(-Math.sin(p)*g,0,0),o.model.position.set(0,Math.abs(Math.cos(p))*.07*g,0),o.model.rotation.set(0,0,Math.sin(p)*.04*g);break}case"boss":this.updateBoss(o,n,u,d,h,t);break}te(o.node,o.pos),o.node.rotation.set(0,o.yaw,0)}let a=0;for(let o of this.enemies)o.dead||(this.enemies[a++]=o);this.enemies.length=a},updateBoss(n,t,e,i,s,r){let a=mi[n.kind],o=Vi(i,n.strafe*.7);s>20?o=Ss(o,e):s<12&&(o=Ss(o,Vi(e,-1)));let l=5.6+Math.sin(n.anim*.8)*.7,c=Math.min(1,t*1.5);n.vel.x+=(o.x*n.speed-n.vel.x)*c,n.vel.y+=((l-n.pos.y)*2-n.vel.y)*c,n.vel.z+=(o.y*n.speed-n.vel.z)*c;let h=Le(n.pos,n.vel,t);if(this.level.resolve(h,2.4,h.y-2,4,0),n.pos=h,this.faceToward(n,e,t,2.5),n.spinners.forEach((d,f)=>{d.rotation.set(f*.5+.2+n.anim*(.5+f*.25),n.anim*(f%2===0?.9:-.7),f*.4)}),!r)return;let u=n.hp<n.maxHp*.4?.7:1;if(n.stateT-=t,n.stateT<=0&&(n.state=(n.state+1)%4,n.stateT=[3.2,1.6,3,1.8][n.state],n.burst=0,n.burstT=.5,n.state===3&&this.enemies.length<14)){for(let d=0;d<2+this.bossCount;d++)this.spawnEnemy("drone",Yt(Yt(n.pos,kt(Jn(),3)),M(0,1,0)));this.hud.feedLine("OVERSEER setzt Drohnen ab",M(1,.4,.3))}switch(n.burstT-=t,n.state){case 0:n.burstT<=0&&n.sees&&(n.burstT=.2*u,n.side=(n.side+1)%3,this.enemyShoot(n,n.muzzles[n.side],26,9,.04));break;case 1:if(n.burst===0&&n.burstT<=0){n.burst=1;let d=M(n.pos.x,1,n.pos.z);this.fx.spawnFlash(M(n.pos.x,0,n.pos.z),a.glow),this.fx.tracer(Ne(n.pos,M(0,2.5,0)),M(n.pos.x,.1,n.pos.z),a.glow,.5,.4,2),this.audio.playAt("rail",d,this.pos,this.yaw,.8);let f=30,m=Math.floor(Math.random()*f);for(let x=0;x<f;x++){if((x+m)%10<2)continue;let p=x/f*2*Math.PI,g=M(Math.sin(p),0,Math.cos(p));this.spawnProjectile(Le(d,g,2.5),kt(g,12),14,0,!1,4.5,.16,a.glow,0,!1)}}break;case 2:n.burstT<=0&&n.sees&&(n.burstT=.75*u,n.side=(n.side+1)%3,this.enemyShoot(n,n.muzzles[1+n.side%2],17,26,.03,3.8,.5));break;default:break}}};var be={a:"KeyA",s:"KeyS",d:"KeyD",f:"KeyF",q:"KeyQ",w:"KeyW",e:"KeyE",r:"KeyR",n1:"Digit1",n2:"Digit2",n3:"Digit3",n4:"Digit4",ret:"Enter",m:"KeyM",space:"Space",esc:"Escape",shift:"ShiftLeft"},Cl=class{constructor(){this.keys=new Set,this.pressed=[],this.dx=0,this.dy=0,this.fire=!1,this.clicked=!1,this.scroll=0}down(t){return this.keys.has(t)}hit(t){return this.pressed.includes(t)}},mh=class{constructor(){this.f=new Cl}key(t,e){let i=this.f;e?i.keys.has(t)||(i.keys.add(t),i.pressed.push(t)):i.keys.delete(t)}mouse(t,e){this.f.dx+=t,this.f.dy+=e}button(t){this.f.fire=t,t&&(this.f.clicked=!0)}scroll(t){this.f.scroll+=t}releaseAll(){this.f.keys.clear(),this.f.fire=!1}frame(){let t=this.f,e=new Cl;return e.keys=new Set(t.keys),e.pressed=t.pressed.slice(),e.dx=t.dx,e.dy=t.dy,e.fire=t.fire,e.clicked=t.clicked,e.scroll=t.scroll,t.pressed.length=0,t.dx=0,t.dy=0,t.clicked=!1,t.scroll=0,e}},y_=new F(1,0,0),M_=new F(0,1,0),S_=new F(0,0,1),Vd=new ze,Wd=new ze,Xd=new ze;function Rl(n){try{let t=parseInt(localStorage.getItem(n),10);return Number.isFinite(t)?t:0}catch{return 0}}function qd(n,t){try{localStorage.setItem(n,String(t))}catch{}}function b_(){return(typeof performance<"u"?performance.now():Date.now())/1e3}function ph(n,t=!0){n.traverse(e=>{let i=e.material;Array.isArray(i)?i.forEach(s=>s.dispose()):i&&i.dispose(),t&&e.geometry&&!e.isSprite&&e.geometry.dispose()})}function Yd(n){let t=n.slice();for(let e=t.length-1;e>0;e--){let i=Math.floor(Math.random()*(e+1)),s=t[e];t[e]=t[i],t[i]=s}return t}var mr=class{constructor({renderer:t,hudRoot:e,audioEnabled:i=!0}){$d(),this.onCapture=null,this.onToggleFullscreen=null,this.phase="menu",this.time=0,this.animTime=0,this.lastRenderTime=0,this.demo=!1,this.pauseRequested=!1,this.autoStart=!1,this.demoMortal=!1,this.fpsAverage=0,this.menuAngle=.6,this.pos=M(0,0,15),this.vel=M(0,0,0),this.yaw=0,this.pitch=0,this.hp=100,this.shield=100,this.sinceHurt=10,this.onGround=!0,this.coyote=0,this.jumpBuffer=0,this.dashCD=0,this.dashT=0,this.dashDir=M(0,0,-1),this.eyeY=1.7,this.bob=0,this.fov=64,this.overcharge=0,this.deadT=0,this.stepT=0,this.weapons=[],this.cur=0,this.pendingWeapon=-1,this.switchT=0,this.reloadT=0,this.reloadDur=1,this.kickZ=0,this.kickRot=0,this.bloom=0,this.sway=Pn(0,0),this.recoilPitch=0,this.flashT=0,this.hitSoundT=0,this.enemies=[],this.projectiles=[],this.pickups=[],this.navT=0,this.trail=null,this.gateBoost=[0,0,0,0],this.wave=0,this.spawnQueue=[],this.spawnT=0,this.intermission=3,this.waveActive=!1,this.score=0,this.combo=0,this.comboT=0,this.kills=0,this.shotsFired=0,this.shotsHit=0,this.timeAlive=0,this.bossCount=0,this.demoWeaponT=0,this.renderer=t,this.scene=new us,this.input=new mh,this.setupCamera(),this.fx=new _l(this.scene),this.level=new yl(this.scene,this.fx.particles,t),this.hud=new bl(e),this.audio=new El({enabled:i}),this.buildWeapons(),this.setupTrail(),this.hud.showMenu(Rl("nova.bestScore"),Rl("nova.bestWave")),this.weaponRoot.visible=!1,this.updateMenuCamera(0)}get eye(){return M(this.pos.x,this.pos.y+this.eyeY,this.pos.z)}get viewDir(){return M(-Math.sin(this.yaw)*Math.cos(this.pitch),Math.sin(this.pitch),-Math.cos(this.yaw)*Math.cos(this.pitch))}get fwd(){return M(-Math.sin(this.yaw),0,-Math.cos(this.yaw))}get rightV(){return M(Math.cos(this.yaw),0,-Math.sin(this.yaw))}setupCamera(){let t=this.renderer&&this.renderer.domElement,e=t?t.clientWidth||t.width:0,i=t?t.clientHeight||t.height:0,s=e>0&&i>0?e/i:16/9;this.camera=new ri(this.fov,s,.1,600),this.camNode=this.camera,this.scene.add(this.camera),this.weaponRoot=new he,this.weaponHolder=new he,this.camera.add(this.weaponRoot),this.weaponRoot.add(this.weaponHolder)}setupTrail(){this.trail={particleImage:"glow",birthRate:70,particleLifeSpan:.3,particleLifeSpanVariation:.1,particleSize:.28,particleSizeVariation:.1,particleVelocity:.3,spreadingAngle:180,blendMode:"additive",isLightingEnabled:!1,opacity:{values:[.7,0],keyTimes:[0,1]},size:{values:[1,.2],keyTimes:[0,1]}}}setFov(t){this.camera.fov!==t&&(this.camera.fov=t,this.camera.updateProjectionMatrix())}tick(t){let e=b_(),i=this.lastRenderTime===0?1/60:e-this.lastRenderTime;this.lastRenderTime=e,i>.001&&(this.fpsAverage=this.fpsAverage===0?1/i:this.fpsAverage*.98+1/i*.02);let s=this.input.frame();if(this.demo&&this.demoInput(s),this.hud.resizeIfNeeded(),this.pauseRequested&&(this.pauseRequested=!1,this.phase==="playing"&&!this.demo)){this.setPaused(!0);return}switch(s.hit(be.m)&&(this.audio.musicOn=!this.audio.musicOn,this.audio.play("ui")),s.hit(be.f)&&this.onToggleFullscreen&&this.onToggleFullscreen(),this.phase!=="paused"&&(this.animTime+=t,this.level.update(t,this.animTime)),this.phase){case"menu":this.updateMenuCamera(t),this.fx.update(t),(s.clicked||s.hit(be.ret)||s.hit(be.space)||this.autoStart)&&(this.autoStart=!1,this.startGame());break;case"paused":(s.clicked||s.hit(be.esc)||s.hit(be.ret))&&this.setPaused(!1);break;case"playing":if(s.hit(be.esc)){this.setPaused(!0);return}this.time+=t,this.timeAlive+=t,this.simulate(t,s);break;case"dead":{this.deadT+=t;let r=t*.4;this.time+=r,this.updateWorld(r),this.fx.update(t),this.updateDeathCamera(t),this.updateHUD(t),this.deadT>1.4&&(s.clicked||s.hit(be.ret)||s.hit(be.space))&&this.startGame();break}}}setPaused(t){this.phase!=="playing"&&this.phase!=="paused"||(this.phase=t?"paused":"playing",this.audio.play("ui"),t?this.hud.showPause():this.hud.showGame(),this.audio.musicVolume=t?.15:.42,this.input.releaseAll(),this.onCapture&&this.onCapture(!t))}startGame(){for(let t of this.enemies)t.node.removeFromParent(),ph(t.node,!1);for(let t of this.projectiles)t.trail&&t.trail.remove(),t.node.removeFromParent(),ph(t.node);for(let t of this.pickups)t.node.removeFromParent(),ph(t.node);this.enemies.length=0,this.projectiles.length=0,this.pickups.length=0,this.fx.clear(),this.hud.resetTransient(),this.pos=M(0,0,16),this.vel=M(0,0,0),this.yaw=0,this.pitch=0,this.hp=100,this.shield=100,this.sinceHurt=10,this.onGround=!0,this.dashCD=0,this.dashT=0,this.overcharge=0,this.eyeY=1.7,this.deadT=0;for(let t of this.weapons)t.reset(),t.node.visible=!1;this.cur=0,this.pendingWeapon=-1,this.switchT=0,this.reloadT=0,this.bloom=0,this.kickZ=0,this.kickRot=0,this.weapons[0].node.visible=!0,this.weaponRoot.visible=!0,this.wave=0,this.spawnQueue.length=0,this.intermission=2.5,this.waveActive=!1,this.score=0,this.combo=0,this.comboT=0,this.kills=0,this.shotsFired=0,this.shotsHit=0,this.timeAlive=0,this.bossCount=0,this.phase="playing",this.hud.showGame(),this.hud.announce("BEREIT MACHEN","Gegner n\xE4hern sich \xFCber die roten Portale",M(1,1,1),1.8),this.audio.play("power",.7),this.audio.musicVolume=.42,this.input.releaseAll(),this.onCapture&&this.onCapture(!0)}die(){if(this.phase!=="playing")return;this.phase="dead",this.deadT=0,this.hp=0,this.weaponRoot.visible=!1,this.audio.play("death"),this.audio.musicVolume=.2,this.fx.shake(1),this.hud.flash(M(1,.1,.05),.6,.8);let t=Rl("nova.bestScore"),e=this.score>t;this.demo||(e&&qd("nova.bestScore",this.score),this.wave>Rl("nova.bestWave")&&qd("nova.bestWave",this.wave));let i=this.shotsFired>0?Math.trunc(this.shotsHit/this.shotsFired*100):0;this.hud.showGameOver({score:this.score,wave:this.wave,kills:this.kills,accuracy:Math.min(i,100),best:Math.max(t,this.score),newBest:e,time:Math.trunc(this.timeAlive)}),this.onCapture&&this.onCapture(!1)}updateMenuCamera(t){this.menuAngle+=t*.09;let e=25;te(this.camNode,M(Math.cos(this.menuAngle)*e,7.5+Math.sin(this.menuAngle*.7)*1.5,Math.sin(this.menuAngle)*e)),this.camNode.lookAt(0,3.6,0),this.setFov(62)}setCameraRotation(t,e,i){Vd.setFromAxisAngle(M_,e),Wd.setFromAxisAngle(y_,t),Xd.setFromAxisAngle(S_,i),this.camNode.quaternion.copy(Vd).multiply(Wd).multiply(Xd)}updateDeathCamera(t){let e=Math.min(this.deadT/1.1,1),i=e*e*(3-2*e),s=ki(this.eyeY,.45,i);te(this.camNode,M(this.pos.x,this.pos.y+s,this.pos.z)),this.setCameraRotation(this.pitch*(1-i)+.25*i,this.yaw,.9*i)}simulate(t,e){this.updatePlayer(t,e),this.updateWeapons(t,e),this.updateWorld(t),this.updateWaves(t),this.fx.update(t),this.updateCamera(t,e),this.updateHUD(t)}updateWorld(t){this.navT-=t,this.navT<=0&&(this.navT=.14,this.level.nav.rebuild(this.pos)),this.updateEnemies(t),this.updateProjectiles(t),this.updatePickups(t);for(let e=0;e<this.gateBoost.length;e++)this.gateBoost[e]>0&&(this.gateBoost[e]=Math.max(0,this.gateBoost[e]-t*1.5),this.level.portalBoost(e,this.gateBoost[e]))}updatePlayer(t,e){this.yaw-=e.dx*.0021,this.pitch=Me(this.pitch-e.dy*.0021,-1.5,1.5),this.yaw=lr(this.yaw);let s=this.pos,r=this.vel,a=this.fwd,o=this.rightV,l=M(0,0,0);e.down(be.w)&&(l=Yt(l,a)),e.down(be.s)&&(l=Ne(l,a)),e.down(be.d)&&(l=Yt(l,o)),e.down(be.a)&&(l=Ne(l,o));let c=Hi(l);c>0&&(l=kt(l,1/c));let h=e.down(be.shift)&&e.down(be.w)&&c>0,u=h?9.6:6.6;if(this.dashCD=Math.max(0,this.dashCD-t),e.hit(be.q)&&this.dashCD<=0&&(this.dashDir=c>0?ui(l):ui(a),this.dashT=.17,this.dashCD=2.2,this.audio.play("dash"),this.fx.shake(.12)),this.dashT>0)this.dashT-=t,r.x=this.dashDir.x*25,r.z=this.dashDir.z*25,this.dashT<=0&&(r.x=this.dashDir.x*u,r.z=this.dashDir.z*u);else{let g=kt(l,u),v=M(g.x-r.x,0,g.z-r.z),w=this.onGround?c>0?70:55:c>0?22:2,y=Hi(v),E=w*t;y>E&&(v=kt(v,E/y)),r.x+=v.x,r.y+=v.y,r.z+=v.z}this.jumpBuffer=e.hit(be.space)?.12:Math.max(0,this.jumpBuffer-t),this.coyote=this.onGround?.1:Math.max(0,this.coyote-t),this.jumpBuffer>0&&this.coyote>0&&(r.y=7.8,this.onGround=!1,this.coyote=0,this.jumpBuffer=0,this.audio.play("jump",.5)),r.y-=21*t;let d=M(s.x+r.x*t,s.y,s.z+r.z*t);this.level.resolve(d,.45,s.y,1.8);for(let g of this.enemies){if(g.dead||mi[g.kind].flies)continue;let v=d.x-g.pos.x,w=d.z-g.pos.z,y=Math.hypot(v,w),E=g.radius+.4;if(y<E&&y>.001&&Math.abs(g.pos.y-s.y)<1.6){let A=(E-y)*.5/y;d.x+=v*A,d.z+=w*A}}let f=s.y+r.y*t,m=this.level.groundHeight(d.x,d.z,.3,Math.max(s.y,f),this.onGround?.5:.08);f<=m?(!this.onGround&&r.y<-7&&(this.audio.play("land",Math.min(1,-r.y/16)),this.fx.shake(Math.min(.25,-r.y/60))),f=m,r.y=0,this.onGround=!0):this.onGround&&f-m<.5&&r.y<=0?(f=m,r.y=0):this.onGround=!1,r.x=(d.x-s.x)/t*.5+r.x*.5,r.z=(d.z-s.z)/t*.5+r.z*.5,this.pos=M(d.x,f,d.z);let x=Cn(r);this.onGround&&x>1&&(this.bob+=t*x*1.25),this.sinceHurt+=t,this.sinceHurt>4&&this.shield<100&&(this.shield=Math.min(100,this.shield+24*t)),this.overcharge>0&&(this.overcharge=Math.max(0,this.overcharge-t)),this.combo>0&&(this.comboT-=t/4.5,this.comboT<=0&&(this.combo=0));let p=64+(h?5:0)+(this.dashT>0?10:0);this.fov+=(p-this.fov)*Math.min(1,t*9)}updateCamera(t,e){this.eyeY+=(1.7-this.eyeY)*Math.min(1,t*12);let s=this.vel,r=this.rightV,a=Math.min(Cn(s)/6.6,1.4),o=this.onGround?Math.sin(this.bob*2)*.035*a:0,l=this.onGround?Math.cos(this.bob)*.02*a:0,c=this.fx.trauma*this.fx.trauma,h=kt(M(jt(-1,1),jt(-1,1),jt(-1,1)),c*.045);this.recoilPitch=Math.max(0,this.recoilPitch-t*.9-this.recoilPitch*t*9);let u=-Mi(s,r)/9.6*.022;te(this.camNode,Le(Yt(this.eye,M(0,o,0)),r,l)),this.setCameraRotation(this.pitch+this.recoilPitch+h.x,this.yaw+h.y,u+h.z),this.setFov(this.fov);let d=this.sway;d.x+=(Me(-e.dx*.0012,-.06,.06)-d.x)*Math.min(1,t*10),d.y+=(Me(e.dy*.0012,-.05,.05)-d.y)*Math.min(1,t*10),this.kickZ=Math.max(0,this.kickZ-t*1.4-this.kickZ*t*14),this.kickRot=Math.max(0,this.kickRot-t*.8-this.kickRot*t*12);let f=M(.3+d.x+l*.6,-.3+d.y-o*.7-(this.onGround?0:Me(s.y*.006,-.05,.05)),-.84+this.kickZ),m=M(this.kickRot+d.y*.6,d.x*.8,d.x*.5);if(this.reloadT>0){let x=Math.sin((1-this.reloadT/this.reloadDur)*Math.PI);f.y-=.22*x,m.x-=.5*x,m.z+=.35*x}if(this.switchT>0){let x=this.switchT>.14?(.28-this.switchT)/.14:this.switchT/.14;f.y-=.45*x,m.x-=.7*x}e.down(be.shift)&&e.down(be.w)&&this.onGround&&this.reloadT<=0&&(m.y+=.25,f.x-=.03,f.y-=.03),te(this.weaponHolder,f),this.weaponHolder.rotation.set(m.x,m.y,m.z),this.flashT>0&&(this.flashT-=t,this.flashT<=0&&(this.weapons[this.cur].flash.visible=!1))}updateHUD(t){let e=this.weapons[this.cur],i=[],s=Math.cos(this.yaw),r=Math.sin(this.yaw),a=0,o=null;for(let l of this.enemies){if(l.dead)continue;a+=1,!o&&l.kind==="boss"&&(o=l);let c=l.pos.x-this.pos.x,h=l.pos.z-this.pos.z;i.push({p:Pn(c*s-h*r,-(c*r+h*s)),boss:l.kind==="boss"})}this.hud.setRadar(i,34),this.hud.update({dt:t,hp:this.hp,shield:this.shield,ammo:e.ammo,reserve:e.def.reserveMax<0?-1:e.reserve,weaponName:e.def.name,weaponIndex:this.cur,weaponNames:this.weapons.map(l=>l.def.short),weaponUsable:this.weapons.map(l=>l.ammo>0||l.reserve!==0),weaponColor:e.def.color,spread:e.def.spread*(e.def.pellets>1?.5:1)+this.bloom,reloading:this.reloadT,dash:1-this.dashCD/2.2,overcharge:this.overcharge,score:this.score,combo:this.comboMult,comboT:this.comboT,wave:Math.max(this.wave,1),enemiesLeft:this.spawnQueue.length+a,bossName:o?`OVERSEER  MK ${this.bossCount}`:null,bossHp:o?o.hp/o.maxHp:0})}get comboMult(){return Math.min(1+Math.floor(this.combo/4),8)}hurtPlayer(t,e=null){if(this.phase!=="playing"||this.dashT>0||this.demo&&!this.demoMortal)return;let i=t;if(this.sinceHurt=0,this.shield>0){let r=Math.min(this.shield,i);this.shield-=r,i-=r,this.audio.play("shieldHit",.7),this.shield<=0&&this.hud.flash(M(.3,.9,1),.25,.3)}i>0&&(this.hp-=i,this.audio.play("hurt",.9));let s=null;if(e){let r=sn(M(e.x-this.pos.x,0,e.z-this.pos.z));s=Math.atan2(Mi(r,this.rightV),Mi(r,this.fwd))}this.hud.damage(t,s),this.fx.shake(Math.min(.5,.12+t/50)),this.hp<=0&&this.die()}updateWaves(t){if(!this.waveActive){this.intermission-=t,this.intermission<=0&&this.startWave();return}let e=this.enemies.length;if(this.spawnQueue.length>0){this.spawnT-=t;let i=Math.min(8+this.wave*2,26);this.spawnT<=0&&e<i&&(this.spawnEnemy(this.spawnQueue.shift()),this.spawnT=Math.max(.22,.95-this.wave*.045)*jt(.7,1.3))}else if(e===0){this.waveActive=!1,this.intermission=5.5;let i=250*this.wave;this.score+=i,this.hud.announce(`WELLE ${this.wave} GESCHAFFT`,`+${i} Bonus  \xB7  n\xE4chste Welle in 5 Sekunden`,M(.4,1,.6),2.2),this.audio.play("waveClear");let s=Yd(this.level.pickupSpots);this.spawnPickup("health",ui(s.shift())),this.spawnPickup("ammo",ui(s.shift())),this.wave%3===0&&this.spawnPickup("power",ui(s.shift()))}}startWave(){this.wave+=1,this.waveActive=!0,this.spawnT=.6;let t=this.wave,e=t%5===0,i=4.5+t*3+Math.pow(t,1.3);e&&(i*=.45);let s=["skitter","skitter"];t>=2&&s.push("drone","drone"),t>=3&&s.push("trooper","trooper"),t>=4&&s.push("roller"),t>=6&&s.push("brute"),t>=9&&s.push("trooper","brute","roller");let r=[],a=0;for(;i>.9&&a<200;){a+=1;let o=s[Math.floor(Math.random()*s.length)],l=mi[o].cost;l>i+.5||(r.push(o),i-=l)}r=Yd(r),e&&(r.unshift("boss"),this.bossCount+=1),this.spawnQueue=r,e?(this.hud.announce("WARNUNG","OVERSEER n\xE4hert sich",M(1,.2,.15),2.4),this.audio.play("boss")):(this.hud.announce(`WELLE ${t}`,`${r.length} Feindkontakte`,M(1,1,1),1.5),this.audio.play("wave",.8))}spawnEnemy(t,e=null){let i=this.level.gates,s=i.map((d,f)=>f).sort((d,f)=>Gi(i[f].pos,this.pos)-Gi(i[d].pos,this.pos)),r=s[Math.floor(Math.random()*Math.min(3,s.length))],a=i[r],o=M(a.dir.z,0,-a.dir.x),l=e?ui(e):Le(Le(a.pos,o,jt(-1.6,1.6)),a.dir,jt(0,1.5));e||(t==="drone"&&(l.y=3.2),t==="boss"&&(l=Le(a.pos,a.dir,7),l.y=6.5),this.gateBoost[r]=1);let c=mi[t],h=1+(this.wave-1)*.07+(t==="boss"?(this.bossCount-1)*.45:0),u=new pr(t,ui(l),h);u.yaw=Math.atan2(this.pos.x-l.x,this.pos.z-l.z),this.scene.add(u.node),this.enemies.push(u),this.fx.spawnFlash(c.flies?Ne(l,M(0,1,0)):ui(l),c.glow),this.audio.playAt("spawn",l,this.pos,this.yaw,.9)}demoInput(t){if(t.keys=new Set,t.pressed=[],t.dx=0,t.dy=0,t.fire=!1,t.clicked=!1,t.scroll=0,this.phase==="menu"||this.phase==="dead")return t;let e=this.eye,i=null,s=1/0;for(let r of this.enemies){if(r.dead||r.spawnT>0)continue;let a=r.center,o=Gi(a,e);o<s&&this.level.lineOfSight(e,a)&&(s=o,i=r)}if(t.keys.add(be.w),t.keys.add(this.time%6<3?be.a:be.d),i){let r=sn(Ne(i.center,e)),a=Math.atan2(-r.x,-r.z),o=Math.asin(Me(r.y,-1,1)),l=lr(a-this.yaw),c=o-this.pitch;t.dx=-l*.25/.0021,t.dy=-c*.25/.0021,t.fire=Math.abs(l)<.06&&Math.abs(c)<.06,t.clicked=t.fire}else{let r=sn(Ne(M(0,1.5,0),e)),a=lr(Math.atan2(-r.x,-r.z)-this.yaw);t.dx=-a*.1/.0021,t.dy=this.pitch*.1/.0021}return this.demoWeaponT+=1/60,this.demoWeaponT>5&&(this.demoWeaponT=0,t.pressed.push([be.n1,be.n2,be.n3,be.n4][(this.cur+1)%4])),t}debugState(){let t=this.weapons[this.cur];return{phase:this.phase,wave:this.wave,score:this.score,kills:this.kills,hp:this.hp,shield:this.shield,enemies:this.enemies.length,projectiles:this.projectiles.length,pickups:this.pickups.length,fps:Math.round(this.fpsAverage*10)/10,weapon:t?t.def.name:null,pos:{x:Math.round(this.pos.x*100)/100,y:Math.round(this.pos.y*100)/100,z:Math.round(this.pos.z*100)/100},yaw:Math.round(this.yaw*1e3)/1e3,shotsFired:this.shotsFired}}},Zd=!1;function $d(){Zd||(Object.assign(mr.prototype,Gd),Zd=typeof mr.prototype.buildWeapons=="function")}try{$d()}catch{}var gr={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};var Ii=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},w_=new ps(-1,1,1,-1,0,1),gh=class extends $e{constructor(){super(),this.setAttribute("position",new me([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new me([0,2,0,0,2,0],2))}},T_=new gh,xr=class{constructor(t){this._mesh=new Qt(T_,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,w_)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}};var _r=class extends Ii{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof ge?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=tn.clone(t.uniforms),this.material=new ge({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new xr(this.material)}render(t,e,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var _a=class extends Ii{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,i){let s=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),t.setRenderTarget(i),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}},Pl=class extends Ii{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}};var Il=class{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){let i=t.getSize(new Pt);this._width=i.width,this._height=i.height,e=new Pe(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Ie}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new _r(gr),this.copyPass.material.blending=An,this.timer=new jr}swapBuffers(){let t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){let e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){this.timer.update(),t===void 0&&(t=this.timer.getDelta());let e=this.renderer.getRenderTarget(),i=!1;for(let s=0,r=this.passes.length;s<r;s++){let a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,t,i),a.needsSwap){if(i){let o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}_a!==void 0&&(a instanceof _a?i=!0:a instanceof Pl&&(i=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){let e=this.renderer.getSize(new Pt);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;let i=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(i,s),this.renderTarget2.setSize(i,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(i,s)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var Ll=class extends Ii{constructor(t,e,i=null,s=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=i,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new Dt}render(t,e,i){let s=t.autoClear;t.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),t.autoClear=s}};var Jd={name:"LuminosityHighPassShader",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Dt(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};var vr=class n extends Ii{constructor(t,e=1,i,s){super(),this.strength=e,this.radius=i,this.threshold=s,this.resolution=t!==void 0?new Pt(t.x,t.y):new Pt(256,256),this.clearColor=new Dt(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Pe(r,a,{type:Ie,depthBuffer:!1}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){let u=new Pe(r,a,{type:Ie,depthBuffer:!1});u.texture.name="UnrealBloomPass.h"+h,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);let d=new Pe(r,a,{type:Ie,depthBuffer:!1});d.texture.name="UnrealBloomPass.v"+h,d.texture.generateMipmaps=!1,this.renderTargetsVertical.push(d),r=Math.round(r/2),a=Math.round(a/2)}let o=Jd;this.highPassUniforms=tn.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new ge({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let l=[6,10,14,18,22];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new Pt(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new F(1,1,1),new F(1,1,1),new F(1,1,1),new F(1,1,1),new F(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=tn.clone(gr.uniforms),this.blendMaterial=new ge({uniforms:this.copyUniforms,vertexShader:gr.vertexShader,fragmentShader:gr.fragmentShader,premultipliedAlpha:!0,blending:hn,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Dt,this._oldClearAlpha=1,this._basic=new Tn,this._fsQuad=new xr(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(t,e){let i=Math.round(t/2),s=Math.round(e/2);this.renderTargetBright.setSize(i,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(i,s),this.renderTargetsVertical[r].setSize(i,s),this.separableBlurMaterials[r].uniforms.invSize.value=new Pt(1/i,1/s),i=Math.round(i/2),s=Math.round(s/2)}render(t,e,i,s,r){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let a=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),r&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=i.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=n.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[l]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=n.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[l]),t.clear(),this._fsQuad.render(t),o=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(i),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=a}_getSeparableBlurMaterial(t){let e=[],i=t/3;for(let a=0;a<t;a++)e.push(.39894*Math.exp(-.5*a*a/(i*i))/i);let s=[],r=[];for(let a=1;a<t;a+=2){let o=e[a],l=a+1<t?e[a+1]:0,c=o+l;s.push((a*o+(a+1)*l)/c),r.push(c)}return new ge({defines:{KERNEL_PAIRS:s.length},uniforms:{colorTexture:{value:null},invSize:{value:new Pt(.5,.5)},direction:{value:new Pt(.5,.5)},centerWeight:{value:e[0]},gaussianOffsets:{value:s},gaussianWeights:{value:r}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(t){return new ge({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}};vr.BlurDirectionX=new Pt(1,0);vr.BlurDirectionY=new Pt(0,1);var xh=class extends Ii{constructor(t,e){super(),this.scene=t,this.camera=e,this.needsSwap=!1}render(t,e,i){let s=this.camera,r=s.near,a=s.far,o=s.layers.mask,l=t.autoClear,c=t.shadowMap.autoUpdate;t.autoClear=!1,t.shadowMap.autoUpdate=!1,t.setRenderTarget(i),t.clearDepth(),s.layers.set(pa),s.near=.01,s.far=20,s.updateProjectionMatrix(),t.render(this.scene,s),s.near=r,s.far=a,s.updateProjectionMatrix(),s.layers.mask=o,t.shadowMap.autoUpdate=c,t.autoClear=l}},E_={name:"NovaGrade",uniforms:{tDiffuse:{value:null},uExposure:{value:1},uSaturation:{value:1.12},uContrast:{value:.18},uVignette:{value:.55},uVignettePower:{value:1.3},uFringe:{value:.006}},vertexShader:`
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float uExposure, uSaturation, uContrast, uVignette, uVignettePower, uFringe;
    varying vec2 vUv;
    // three.js ACESFilmicToneMapping (linear sRGB in, linear out)
    vec3 RRTAndODTFit(vec3 v) {
      vec3 a = v * (v + 0.0245786) - 0.000090537;
      vec3 b = v * (0.983729 * v + 0.4329510) + 0.238081;
      return a / b;
    }
    vec3 aces(vec3 color) {
      const mat3 inM = mat3(vec3(0.59719, 0.07600, 0.02840), vec3(0.35458, 0.90834, 0.13383), vec3(0.04823, 0.01566, 0.83777));
      const mat3 outM = mat3(vec3(1.60475, -0.10208, -0.00327), vec3(-0.53108, 1.10813, -0.07276), vec3(-0.07367, -0.00605, 1.07602));
      color = inM * (color / 0.6);
      color = RRTAndODTFit(color);
      return clamp(outM * color, 0.0, 1.0);
    }
    vec3 toSRGB(vec3 c) {
      return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), c));
    }
    void main() {
      vec2 c = vUv - 0.5;
      float r2 = dot(c, c);
      // colour fringe grows toward the edges (SCNCamera colorFringeStrength)
      vec2 off = c * uFringe * r2 * 4.0;
      vec3 col = vec3(texture2D(tDiffuse, vUv - off).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv + off).b);
      col = aces(col * uExposure);
      float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
      col = max(mix(vec3(luma), col, uSaturation), 0.0);
      float v = pow(clamp(length(c) * 1.4142, 0.0, 1.0), 2.0 * uVignettePower);
      col *= 1.0 - uVignette * v;
      vec3 s = toSRGB(col);
      s = clamp((s - 0.5) * (1.0 + uContrast) + 0.5, 0.0, 1.0);
      gl_FragColor = vec4(s, 1.0);
    }
  `};function Kd(n,t,e){let i=n.getSize(new Pt),s=n.getPixelRatio(),r=new Pe(Math.max(1,i.x*s),Math.max(1,i.y*s),{type:Ie,samples:4}),a=new Il(n,r);a.setPixelRatio(s),a.setSize(i.x,i.y),a.addPass(new Ll(t,e)),a.addPass(new xh(t,e));let o=new vr(new Pt(i.x,i.y),.45,.35,1);a.addPass(o);let l=new _r(E_);return a.addPass(l),{composer:a,bloom:o,grade:l,render(){a.render()},setSize(c,h,u){n.setPixelRatio(u),n.setSize(c,h,!1),a.setPixelRatio(u),a.setSize(c,h)}}}var rn=new URLSearchParams(location.search),yr=[];window.addEventListener("error",n=>yr.push(String(n.message||n.error)));window.addEventListener("unhandledrejection",n=>yr.push(`unhandled: ${String(n.reason&&n.reason.message||n.reason)}`));var A_=new Set(["KeyW","KeyA","KeyS","KeyD","KeyQ","KeyE","KeyR","KeyF","KeyM","Space","ShiftLeft","Digit1","Digit2","Digit3","Digit4","Enter","Escape","Tab"]);function R_(){let n=document.getElementById("loading"),t=document.getElementById("loading-bar"),e=document.getElementById("loading-label");return{progress(i,s){t&&(t.style.transform=`scaleX(${Math.max(.02,i).toFixed(3)})`),e&&s&&(e.textContent=s.toUpperCase())},hide(){n&&(n.classList.add("done"),setTimeout(()=>n.remove(),600))}}}async function C_(){let n=document.getElementById("view"),t=document.getElementById("hud"),e=R_(),i=new hl({canvas:n,antialias:!1,powerPreference:"high-performance",stencil:!1}),s=Math.min(window.devicePixelRatio||1,2),r=s;i.setPixelRatio(s),i.setSize(window.innerWidth,window.innerHeight,!1),i.shadowMap.enabled=!0,i.shadowMap.type=ms,i.toneMapping=yi,i.info.autoReset=!1,await Sd((O,P)=>e.progress(O,P));let a=rn.get("demo")==="1",o=new mr({renderer:i,hudRoot:t,audioEnabled:rn.get("mute")!=="1"});o.demo=a,o.demoMortal=rn.get("mortal")==="1";let l=Kd(i,o.scene,o.camera),c=rn.get("cam"),h=rn.get("pose"),u=null;if(h==="lineup"){let O=1.5;for(let P of kd){let z=new pr(P,{x:O,y:P==="drone"?1.6:P==="boss"?4.4:0,z:P==="boss"?12:16},1);z.node.scale.set(1,1,1),z.node.rotation.set(0,.45,0),o.scene.add(z.node),O+=P==="brute"?4.5:P==="trooper"?2.6:2.4}u=[12,3,26,12.5,2.8,14]}c&&(u=c.split(",").map(Number)),u&&(t.style.display="none",o.weaponRoot.visible=!1,rn.get("fov")&&o.setFov(Number(rn.get("fov"))));let d=()=>document.pointerLockElement===n,f=()=>{if(!(a||u||d()))try{let O=n.requestPointerLock({unadjustedMovement:!0});O&&O.catch&&O.catch(()=>{try{let P=n.requestPointerLock();P&&P.catch&&P.catch(()=>{})}catch{}})}catch{}};o.onCapture=O=>{O?f():d()&&document.exitPointerLock()},o.onToggleFullscreen=()=>{if(window.novaShell&&window.novaShell.toggleFullscreen){window.novaShell.toggleFullscreen();return}document.fullscreenElement?document.exitFullscreen().catch(()=>{}):document.documentElement.requestFullscreen().catch(()=>{})};let m=!1,x=()=>{m||(m=!0),o.audio.resume()},p=O=>O.code==="ShiftRight"?"ShiftLeft":O.code==="NumpadEnter"?"Enter":O.code;if(!a){window.addEventListener("keydown",z=>{x();let V=p(z);A_.has(V)&&z.preventDefault(),!z.repeat&&(z.altKey&&V==="F4"||o.input.key(V,!0))}),window.addEventListener("keyup",z=>o.input.key(p(z),!1)),n.addEventListener("mousedown",z=>{x(),z.button===0&&(o.phase==="playing"&&!d()&&f(),o.input.button(!0))}),window.addEventListener("mouseup",z=>{z.button===0&&o.input.button(!1)}),window.addEventListener("mousemove",z=>{d()&&o.input.mouse(z.movementX,z.movementY)});let O=0;window.addEventListener("wheel",z=>{let V=performance.now();Math.abs(z.deltaY)<1||V-O<120||(O=V,o.input.scroll(-Math.sign(z.deltaY)))},{passive:!0}),window.addEventListener("contextmenu",z=>z.preventDefault()),document.addEventListener("pointerlockchange",()=>{!d()&&o.phase==="playing"&&(o.pauseRequested=!0)});let P=()=>{o.input.releaseAll(),o.phase==="playing"&&(o.pauseRequested=!0)};window.addEventListener("blur",P),document.addEventListener("visibilitychange",()=>{document.hidden&&P()})}let g=Number(rn.get("wave")||1),v=Number(rn.get("weapon")||0),w=Number(rn.get("pauseAt")||0),y=!1,E=0;a&&rn.get("menu")!=="1"&&!u&&setTimeout(()=>{o.autoStart=!0},1500),v&&(o.demoWeaponT=-1e9);let A=()=>{let O=window.innerWidth,P=window.innerHeight;o.camera.aspect=O/Math.max(1,P),o.camera.updateProjectionMatrix(),l.setSize(O,P,s)};window.addEventListener("resize",A),A();let _=16,T=0,I=O=>{if(_+=(O-_)*.05,T+=O,T<1500)return;T=0;let P=s;_>18&&s>.6?P=Math.max(.6,s-.15):_<11&&s<r&&(P=Math.min(r,s+.15)),Math.abs(P-s)>.001&&(s=P,A())};window.__nova={game:o,renderer:i,postfx:l,debugState(){let O=0;return o.scene.traverse(()=>{O+=1}),{...o.debugState(),errors:yr.slice(0,20),renderScale:Math.round(s*100)/100,drawCalls:i.info.render.calls,triangles:i.info.render.triangles,geometries:i.info.memory.geometries,textures:i.info.memory.textures,programs:i.info.programs?i.info.programs.length:null,sceneObjects:O,particles:o.fx.particles.count,frameMs:Math.round(_*10)/10}}},e.hide();let R=performance.now(),D=0,N=O=>{let P=(O-R)/1e3;R=O;let z=Math.min(Math.max(P,5e-4),.05);i.info.reset();try{u?(D+=z,o.level.update(z,D),o.fx.update(z),o.camera.position.set(u[0],u[1],u[2]),o.camera.lookAt(u[3],u[4],u[5]),o.camera.updateMatrixWorld(!0)):(a&&o.phase==="playing"&&(E+=z,y||(y=!0,g>1&&(o.wave=g-1)),v&&o.cur!==v-1&&o.switchT<=0&&o.selectWeapon(v-1),w>0&&E>=w&&o.setPaused(!0)),o.tick(z)),l.render()}catch(V){yr.push(String(V&&V.stack||V)),console.error(V)}I(P*1e3),requestAnimationFrame(N)};requestAnimationFrame(N)}C_().catch(n=>{yr.push(String(n&&n.stack||n)),console.error(n);let t=document.getElementById("loading-label");t&&(t.textContent=`FEHLER BEIM START: ${String(n&&n.message||n)}`),window.__nova={debugState:()=>({phase:"boot-failed",errors:yr})}});})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
