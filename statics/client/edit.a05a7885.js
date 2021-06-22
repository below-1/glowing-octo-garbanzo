import{S as a,i as s,s as t,e,t as r,a as l,b as i,f as o,g as c,d as n,c as d,h as u,j as f,k as h,l as m,m as b,n as p,r as v,o as g}from"./client.36844de2.js";import{g as x,a as y}from"./api.e630a648.js";import{f as E}from"./index.66705cc8.js";function w(a){let s,t;return{c(){s=e("small"),t=r("nama harus diisi"),this.h()},l(a){s=i(a,"SMALL",{class:!0});var e=o(s);t=c(e,"nama harus diisi"),e.forEach(n),this.h()},h(){u(s,"class","text-red-500 text-xs")},m(a,e){f(a,s,e),h(s,t)},d(a){a&&n(s)}}}function k(a){let s,t,g,x,y,E,k,I,L,$,A,D,T,V,j,N,B,S,q,U,K,P,_,M,O,R,X,z,C,F=a[3].fields.title.errors.includes("required"),G=F&&w();return{c(){s=e("div"),t=e("div"),g=e("div"),x=r("input data kategori"),y=l(),E=e("div"),k=e("label"),I=r("Nama"),L=l(),$=e("input"),A=l(),G&&G.c(),D=l(),T=e("div"),V=e("label"),j=r("Subtitle"),N=l(),B=e("input"),S=l(),q=e("div"),U=e("label"),K=r("Keterangan"),P=l(),_=e("textarea"),M=l(),O=e("button"),R=r("simpan"),this.h()},l(a){s=i(a,"DIV",{class:!0});var e=o(s);t=i(e,"DIV",{class:!0});var r=o(t);g=i(r,"DIV",{class:!0});var l=o(g);x=c(l,"input data kategori"),l.forEach(n),y=d(r),E=i(r,"DIV",{class:!0});var u=o(E);k=i(u,"LABEL",{});var f=o(k);I=c(f,"Nama"),f.forEach(n),L=d(u),$=i(u,"INPUT",{class:!0}),A=d(u),G&&G.l(u),u.forEach(n),D=d(r),T=i(r,"DIV",{class:!0});var h=o(T);V=i(h,"LABEL",{});var m=o(V);j=c(m,"Subtitle"),m.forEach(n),N=d(h),B=i(h,"INPUT",{class:!0}),h.forEach(n),S=d(r),q=i(r,"DIV",{class:!0});var b=o(q);U=i(b,"LABEL",{});var p=o(U);K=c(p,"Keterangan"),p.forEach(n),P=d(b),_=i(b,"TEXTAREA",{rows:!0,class:!0}),o(_).forEach(n),b.forEach(n),M=d(r),O=i(r,"BUTTON",{disabled:!0,class:!0});var v=o(O);R=c(v,"simpan"),v.forEach(n),r.forEach(n),e.forEach(n),this.h()},h(){u(g,"class","font-bold text-xl mb-3"),u($,"class","border border-gray-300 rounded p-2"),u(E,"class","flex flex-col mb-3"),u(B,"class","border border-gray-300 rounded p-2"),u(T,"class","flex flex-col mb-3"),u(_,"rows","5"),u(_,"class","border border-gray-300 rounded p-2"),u(q,"class","flex flex-col mb-3"),O.disabled=X=!a[3].valid,u(O,"class","px-6 py-1 bg-blue-600 text-white font-bold rounded shadow disabled:opacity-50"),u(t,"class","w-1/3 p-4 rounded bg-white text-sm"),u(s,"class","flex items-center justify-center flex-grow")},m(e,r){f(e,s,r),h(s,t),h(t,g),h(g,x),h(t,y),h(t,E),h(E,k),h(k,I),h(E,L),h(E,$),m($,a[0]),h(E,A),G&&G.m(E,null),h(t,D),h(t,T),h(T,V),h(V,j),h(T,N),h(T,B),m(B,a[1]),h(t,S),h(t,q),h(q,U),h(U,K),h(q,P),h(q,_),m(_,a[2]),h(t,M),h(t,O),h(O,R),z||(C=[b($,"input",a[7]),b(B,"input",a[8]),b(_,"input",a[9]),b(O,"click",a[5])],z=!0)},p(a,[s]){1&s&&$.value!==a[0]&&m($,a[0]),8&s&&(F=a[3].fields.title.errors.includes("required")),F?G||(G=w(),G.c(),G.m(E,null)):G&&(G.d(1),G=null),2&s&&B.value!==a[1]&&m(B,a[1]),4&s&&m(_,a[2]),8&s&&X!==(X=!a[3].valid)&&(O.disabled=X)},i:p,o:p,d(a){a&&n(s),G&&G.d(),z=!1,v(C)}}}async function I(a){return a.params}function L(a,s,t){let e,{id:r}=s,l="",i="",o="",c=E((()=>({title:{value:l,validators:["required"]}})));return g(a,c,(a=>t(3,e=a))),a.$$set=a=>{"id"in a&&t(6,r=a.id)},a.$$.update=()=>{64&a.$$.dirty&&async function({id:a}){if(a)try{const s=await x({url:`/api/v1/category/${a}`});t(0,l=s.title),t(1,i=s.meta_title),t(2,o=s.content)}catch(a){console.log(a),alert("gagal mengambil data kategori"),window.history.back()}}({id:r})},[l,i,o,e,c,async function(){const a={title:l,meta_title:i,content:o};try{await y({url:`/api/v1/category/${r}`,payload:a}),alert("sukses menambah data kategori"),window.history.back()}catch(a){console.log(a),alert("gagal menambah data kategori")}},r,function(){l=this.value,t(0,l)},function(){i=this.value,t(1,i)},function(){o=this.value,t(2,o)}]}export default class extends a{constructor(a){super(),s(this,a,L,k,t,{id:6})}}export{I as preload};
