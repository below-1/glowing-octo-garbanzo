import{S as a,i as s,s as l,e,t as r,a as i,b as t,f as d,g as c,d as o,c as n,h as u,j as f,k as h,l as m,m as p,n as v,r as b,o as x,U as E}from"./client.36844de2.js";import{p as g}from"./api.e630a648.js";import{f as y}from"./index.66705cc8.js";function L(a){let s,l;return{c(){s=e("small"),l=r("nama harus diisi"),this.h()},l(a){s=t(a,"SMALL",{class:!0});var e=d(s);l=c(e,"nama harus diisi"),e.forEach(o),this.h()},h(){u(s,"class","text-red-500 text-xs")},m(a,e){f(a,s,e),h(s,l)},d(a){a&&o(s)}}}function I(a){let s,l;return{c(){s=e("small"),l=r("alamat harus diisi"),this.h()},l(a){s=t(a,"SMALL",{class:!0});var e=d(s);l=c(e,"alamat harus diisi"),e.forEach(o),this.h()},h(){u(s,"class","text-red-500 text-xs")},m(a,e){f(a,s,e),h(s,l)},d(a){a&&o(s)}}}function N(a){let s,l,x,E,g,y,N,w,A,D,V,q,T,U,j,B,k,P,S,H,M,O,_,z,C,F,G,J,K,Q,R,W,X,Y,Z,$,aa=a[4].fields.nama.errors.includes("required"),sa=a[4].fields.address.errors.includes("required"),la=aa&&L(),ea=sa&&I();return{c(){s=e("div"),l=e("div"),x=e("div"),E=r("input data supplier"),g=i(),y=e("div"),N=e("label"),w=r("Nama"),A=i(),D=e("input"),V=i(),la&&la.c(),q=i(),T=e("div"),U=e("label"),j=r("Alamat"),B=i(),k=e("input"),P=i(),ea&&ea.c(),S=i(),H=e("div"),M=e("label"),O=r("Email"),_=i(),z=e("input"),C=i(),F=e("div"),G=e("label"),J=r("No. Hp"),K=i(),Q=e("input"),R=i(),W=e("button"),X=r("simpan"),this.h()},l(a){s=t(a,"DIV",{class:!0});var e=d(s);l=t(e,"DIV",{class:!0});var r=d(l);x=t(r,"DIV",{class:!0});var i=d(x);E=c(i,"input data supplier"),i.forEach(o),g=n(r),y=t(r,"DIV",{class:!0});var u=d(y);N=t(u,"LABEL",{});var f=d(N);w=c(f,"Nama"),f.forEach(o),A=n(u),D=t(u,"INPUT",{class:!0}),V=n(u),la&&la.l(u),u.forEach(o),q=n(r),T=t(r,"DIV",{class:!0});var h=d(T);U=t(h,"LABEL",{});var m=d(U);j=c(m,"Alamat"),m.forEach(o),B=n(h),k=t(h,"INPUT",{class:!0}),P=n(h),ea&&ea.l(h),h.forEach(o),S=n(r),H=t(r,"DIV",{class:!0});var p=d(H);M=t(p,"LABEL",{});var v=d(M);O=c(v,"Email"),v.forEach(o),_=n(p),z=t(p,"INPUT",{type:!0,class:!0}),p.forEach(o),C=n(r),F=t(r,"DIV",{class:!0});var b=d(F);G=t(b,"LABEL",{});var L=d(G);J=c(L,"No. Hp"),L.forEach(o),K=n(b),Q=t(b,"INPUT",{class:!0}),b.forEach(o),R=n(r),W=t(r,"BUTTON",{disabled:!0,class:!0});var I=d(W);X=c(I,"simpan"),I.forEach(o),r.forEach(o),e.forEach(o),this.h()},h(){u(x,"class","font-bold text-xl mb-3"),u(D,"class","border border-gray-300 rounded p-2"),u(y,"class","flex flex-col mb-3"),u(k,"class","border border-gray-300 rounded p-2"),u(T,"class","flex flex-col mb-3"),u(z,"type","email"),u(z,"class","border border-gray-300 rounded p-2"),u(H,"class","flex flex-col mb-3"),u(Q,"class","border border-gray-300 rounded p-2"),u(F,"class","flex flex-col mb-3"),W.disabled=Y=!a[4].valid,u(W,"class","px-6 py-1 bg-blue-600 text-white font-bold rounded shadow disabled:opacity-50"),u(l,"class","w-1/3 p-4 rounded bg-white text-sm"),u(s,"class","flex items-center justify-center flex-grow")},m(e,r){f(e,s,r),h(s,l),h(l,x),h(x,E),h(l,g),h(l,y),h(y,N),h(N,w),h(y,A),h(y,D),m(D,a[0]),h(y,V),la&&la.m(y,null),h(l,q),h(l,T),h(T,U),h(U,j),h(T,B),h(T,k),m(k,a[1]),h(T,P),ea&&ea.m(T,null),h(l,S),h(l,H),h(H,M),h(M,O),h(H,_),h(H,z),m(z,a[2]),h(l,C),h(l,F),h(F,G),h(G,J),h(F,K),h(F,Q),m(Q,a[3]),h(l,R),h(l,W),h(W,X),Z||($=[p(D,"input",a[7]),p(k,"input",a[8]),p(z,"input",a[9]),p(Q,"input",a[10]),p(W,"click",a[6])],Z=!0)},p(a,[s]){1&s&&D.value!==a[0]&&m(D,a[0]),16&s&&(aa=a[4].fields.nama.errors.includes("required")),aa?la||(la=L(),la.c(),la.m(y,null)):la&&(la.d(1),la=null),2&s&&k.value!==a[1]&&m(k,a[1]),16&s&&(sa=a[4].fields.address.errors.includes("required")),sa?ea||(ea=I(),ea.c(),ea.m(T,null)):ea&&(ea.d(1),ea=null),4&s&&z.value!==a[2]&&m(z,a[2]),8&s&&Q.value!==a[3]&&m(Q,a[3]),16&s&&Y!==(Y=!a[4].valid)&&(W.disabled=Y)},i:v,o:v,d(a){a&&o(s),la&&la.d(),ea&&ea.d(),Z=!1,b($)}}}function w(a,s,l){let e,r="",i="",t=null,d=null,c=y((()=>({nama:{value:r,validators:["required"]},address:{value:i,validators:["required"]}})));return x(a,c,(a=>l(4,e=a))),E((()=>{console.log("here")})),[r,i,t,d,e,c,async function(){const a={first_name:r,address:i,mobile:d,email:t};try{const s=await g({url:"/api/v1/supplier",payload:a});console.log(s),alert("sukses menambah data supplier"),window.history.back()}catch(a){console.log(a),alert("gagal menambah data supplier")}},function(){r=this.value,l(0,r)},function(){i=this.value,l(1,i)},function(){t=this.value,l(2,t)},function(){d=this.value,l(3,d)}]}export default class extends a{constructor(a){super(),s(this,a,w,N,l,{})}}
