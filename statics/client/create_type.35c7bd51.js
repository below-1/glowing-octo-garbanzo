import{S as a,i as s,s as e,e as l,t as r,a as i,b as t,f as c,g as n,d as o,c as d,h as u,j as h,k as f,l as m,m as b,n as p,r as v,o as x}from"./client.36844de2.js";import{p as g}from"./api.e630a648.js";import{f as y}from"./index.66705cc8.js";function E(a){let s,e;return{c(){s=l("small"),e=r("nama harus diisi"),this.h()},l(a){s=t(a,"SMALL",{class:!0});var l=c(s);e=n(l,"nama harus diisi"),l.forEach(o),this.h()},h(){u(s,"class","text-red-500 text-xs")},m(a,l){h(a,s,l),f(s,e)},d(a){a&&o(s)}}}function w(a){let s,e,x,g,y,w,j,I,D,V,L,N,k,q,T,A,B,S,U=a[1].fields.name.errors.includes("required"),M=U&&E();return{c(){s=l("div"),e=l("div"),x=l("div"),g=r("input jenis beban usaha"),y=i(),w=l("div"),j=l("label"),I=r("Nama"),D=i(),V=l("div"),L=l("input"),N=i(),M&&M.c(),k=i(),q=l("button"),T=r("simpan"),this.h()},l(a){s=t(a,"DIV",{class:!0});var l=c(s);e=t(l,"DIV",{class:!0});var r=c(e);x=t(r,"DIV",{class:!0});var i=c(x);g=n(i,"input jenis beban usaha"),i.forEach(o),y=d(r),w=t(r,"DIV",{class:!0});var u=c(w);j=t(u,"LABEL",{});var h=c(j);I=n(h,"Nama"),h.forEach(o),D=d(u),V=t(u,"DIV",{class:!0});var f=c(V);L=t(f,"INPUT",{class:!0}),N=d(f),M&&M.l(f),f.forEach(o),u.forEach(o),k=d(r),q=t(r,"BUTTON",{disabled:!0,class:!0});var m=c(q);T=n(m,"simpan"),m.forEach(o),r.forEach(o),l.forEach(o),this.h()},h(){u(x,"class","font-semibold text-gray-600 text-xl mb-4"),u(L,"class","border border-gray-300 rounded px-2 py-1"),u(V,"class","flex flex-col"),u(w,"class","flex flex-col mb-4  "),q.disabled=A=!a[1].valid,u(q,"class","px-6 py-1 bg-blue-600 text-white font-bold rounded shadow disabled:opacity-50"),u(e,"class","w-1/3 p-4 rounded bg-white text-sm"),u(s,"class","flex items-center justify-center flex-grow")},m(l,r){h(l,s,r),f(s,e),f(e,x),f(x,g),f(e,y),f(e,w),f(w,j),f(j,I),f(w,D),f(w,V),f(V,L),m(L,a[0]),f(V,N),M&&M.m(V,null),f(e,k),f(e,q),f(q,T),B||(S=[b(L,"input",a[4]),b(q,"click",a[3])],B=!0)},p(a,[s]){1&s&&L.value!==a[0]&&m(L,a[0]),2&s&&(U=a[1].fields.name.errors.includes("required")),U?M||(M=E(),M.c(),M.m(V,null)):M&&(M.d(1),M=null),2&s&&A!==(A=!a[1].valid)&&(q.disabled=A)},i:p,o:p,d(a){a&&o(s),M&&M.d(),B=!1,v(S)}}}function j(a,s,e){let l,r="";const i=y((()=>({name:{value:r,validators:["required"]}})));return x(a,i,(a=>e(1,l=a))),[r,l,i,async function(){try{const a=await g({url:"/api/v1/opex",payload:{name:r}});window.history.back(),console.log(a)}catch(a){console.log(a),alert("gagal menambah data beban usaha")}},function(){r=this.value,e(0,r)}]}export default class extends a{constructor(a){super(),s(this,a,j,w,e,{})}}