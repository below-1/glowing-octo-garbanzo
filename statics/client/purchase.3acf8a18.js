import{S as a,i as t,s as r,e,t as s,a as n,y as l,b as o,f as c,g as i,d as f,c as h,z as p,h as d,j as g,k as m,A as u,N as E,D as v,E as $,F as b,m as T,J as y,R as x,V as D}from"./client.36844de2.js";import{F as w}from"./FaPencilAlt.537b2edc.js";import{r as I}from"./rupiah.1a14ef94.js";import{f as j}from"./fdate.efd9ea5d.js";import{g as k}from"./api.e630a648.js";import"./IconBase.52240270.js";import"./index.5aa8ac3e.js";import"./index.3ccf8cd9.js";import"./index.51f164c6.js";function _(a,t,r){const e=a.slice();return e[8]=t[r],e[10]=r,e}function A(a,t,r){const e=a.slice();return e[11]=t[r],e}function H(a){let t,r,T,y,x,D,k,_,A,H,V,N,B,O,S,C,F,R,P,z,J,L,U,Y,q,G,K,M=a[11].id+"",Q=j(new Date(a[11].created_at))+"",W=I(parseInt(a[11].grand_total))+"",X=I(parseInt(a[11].transaction.nominal))+"",Z=(a[11].content?a[11].content:"")+"",aa=a[11].transaction.status+"";return Y=new w({}),{c(){t=e("tr"),r=e("td"),T=s(M),y=n(),x=e("td"),D=s(Q),k=n(),_=e("td"),A=s(W),H=n(),V=e("td"),N=s(X),B=n(),O=e("td"),S=s(Z),C=n(),F=e("td"),R=s(aa),P=n(),z=e("td"),J=e("div"),L=e("a"),U=e("div"),l(Y.$$.fragment),G=n(),this.h()},l(a){t=o(a,"TR",{});var e=c(t);r=o(e,"TD",{});var s=c(r);T=i(s,M),s.forEach(f),y=h(e),x=o(e,"TD",{});var n=c(x);D=i(n,Q),n.forEach(f),k=h(e),_=o(e,"TD",{});var l=c(_);A=i(l,W),l.forEach(f),H=h(e),V=o(e,"TD",{});var d=c(V);N=i(d,X),d.forEach(f),B=h(e),O=o(e,"TD",{});var g=c(O);S=i(g,Z),g.forEach(f),C=h(e),F=o(e,"TD",{});var m=c(F);R=i(m,aa),m.forEach(f),P=h(e),z=o(e,"TD",{});var u=c(z);J=o(u,"DIV",{class:!0});var E=c(J);L=o(E,"A",{href:!0,class:!0});var v=c(L);U=o(v,"DIV",{class:!0});var $=c(U);p(Y.$$.fragment,$),$.forEach(f),v.forEach(f),E.forEach(f),u.forEach(f),G=h(e),e.forEach(f),this.h()},h(){d(U,"class","w-3 h-3 text-blue-500"),d(L,"href",q=`/app/sale/${a[11].id}/detail`),d(L,"class","rd-action mr-2"),d(J,"class","flex items-center justify-end")},m(a,e){g(a,t,e),m(t,r),m(r,T),m(t,y),m(t,x),m(x,D),m(t,k),m(t,_),m(_,A),m(t,H),m(t,V),m(V,N),m(t,B),m(t,O),m(O,S),m(t,C),m(t,F),m(F,R),m(t,P),m(t,z),m(z,J),m(J,L),m(L,U),u(Y,U,null),m(t,G),K=!0},p(a,t){(!K||8&t)&&M!==(M=a[11].id+"")&&E(T,M),(!K||8&t)&&Q!==(Q=j(new Date(a[11].created_at))+"")&&E(D,Q),(!K||8&t)&&W!==(W=I(parseInt(a[11].grand_total))+"")&&E(A,W),(!K||8&t)&&X!==(X=I(parseInt(a[11].transaction.nominal))+"")&&E(N,X),(!K||8&t)&&Z!==(Z=(a[11].content?a[11].content:"")+"")&&E(S,Z),(!K||8&t)&&aa!==(aa=a[11].transaction.status+"")&&E(R,aa),(!K||8&t&&q!==(q=`/app/sale/${a[11].id}/detail`))&&d(L,"href",q)},i(a){K||(v(Y.$$.fragment,a),K=!0)},o(a){$(Y.$$.fragment,a),K=!1},d(a){a&&f(t),b(Y)}}}function V(a){let t,r,l,p,u,E=a[10]+1+"";function v(){return a[5](a[10])}return{c(){t=e("button"),r=s(E),l=n(),this.h()},l(a){t=o(a,"BUTTON",{class:!0});var e=c(t);r=i(e,E),l=h(e),e.forEach(f),this.h()},h(){d(t,"class","inline-block rounded px-2 py-1 text-center text-xs font-bold border border-gray-300 mr-2")},m(a,e){g(a,t,e),m(t,r),m(t,l),p||(u=T(t,"click",v),p=!0)},p(t,r){a=t},d(a){a&&f(t),p=!1,u()}}}function N(a){let t,r,T,I,j,k,N,B,O,S,C,F,R,P,z,J,L,U,Y,q,G,K,M,Q,W,X,Z,aa,ta,ra,ea,sa,na,la,oa,ca,ia,fa,ha,pa,da,ga,ma,ua,Ea=a[2].first_name+"";z=new w({});let va=a[3],$a=[];for(let t=0;t<va.length;t+=1)$a[t]=H(A(a,va,t));const ba=a=>$($a[a],1,1,(()=>{$a[a]=null}));let Ta=Array(a[4]),ya=[];for(let t=0;t<Ta.length;t+=1)ya[t]=V(_(a,Ta,t));return{c(){t=e("div"),r=e("section"),T=e("div"),I=s("supplier / "),j=s(Ea),k=s(" / daftar pembelian"),N=n(),B=e("div"),O=n(),S=e("a"),C=e("span"),F=s("edit supplier"),R=n(),P=e("div"),l(z.$$.fragment),L=n(),U=e("section"),Y=e("table"),q=e("thead"),G=e("tr"),K=e("th"),M=n(),Q=e("th"),W=s("waktu"),X=n(),Z=e("th"),aa=s("harga total"),ta=n(),ra=e("th"),ea=s("nominal bayar"),sa=n(),na=e("th"),la=s("keterangan"),oa=n(),ca=e("th"),ia=s("status pembayaran"),fa=n(),ha=e("th"),pa=n(),da=e("tbody");for(let a=0;a<$a.length;a+=1)$a[a].c();ga=n(),ma=e("section");for(let a=0;a<ya.length;a+=1)ya[a].c();this.h()},l(a){t=o(a,"DIV",{class:!0});var e=c(t);r=o(e,"SECTION",{class:!0});var s=c(r);T=o(s,"DIV",{class:!0});var n=c(T);I=i(n,"supplier / "),j=i(n,Ea),k=i(n," / daftar pembelian"),n.forEach(f),N=h(s),B=o(s,"DIV",{class:!0}),c(B).forEach(f),O=h(s),S=o(s,"A",{href:!0,class:!0});var l=c(S);C=o(l,"SPAN",{class:!0});var d=c(C);F=i(d,"edit supplier"),d.forEach(f),R=h(l),P=o(l,"DIV",{class:!0});var g=c(P);p(z.$$.fragment,g),g.forEach(f),l.forEach(f),s.forEach(f),L=h(e),U=o(e,"SECTION",{});var m=c(U);Y=o(m,"TABLE",{class:!0});var u=c(Y);q=o(u,"THEAD",{});var E=c(q);G=o(E,"TR",{});var v=c(G);K=o(v,"TH",{}),c(K).forEach(f),M=h(v),Q=o(v,"TH",{});var $=c(Q);W=i($,"waktu"),$.forEach(f),X=h(v),Z=o(v,"TH",{});var b=c(Z);aa=i(b,"harga total"),b.forEach(f),ta=h(v),ra=o(v,"TH",{});var y=c(ra);ea=i(y,"nominal bayar"),y.forEach(f),sa=h(v),na=o(v,"TH",{});var x=c(na);la=i(x,"keterangan"),x.forEach(f),oa=h(v),ca=o(v,"TH",{});var D=c(ca);ia=i(D,"status pembayaran"),D.forEach(f),fa=h(v),ha=o(v,"TH",{}),c(ha).forEach(f),v.forEach(f),E.forEach(f),pa=h(u),da=o(u,"TBODY",{});var w=c(da);for(let a=0;a<$a.length;a+=1)$a[a].l(w);w.forEach(f),u.forEach(f),m.forEach(f),ga=h(e),ma=o(e,"SECTION",{class:!0});var _=c(ma);for(let a=0;a<ya.length;a+=1)ya[a].l(_);_.forEach(f),e.forEach(f),this.h()},h(){d(T,"class","font-bold text-lg"),d(B,"class","flex-grow"),d(C,"class","mr-2 text-sm font-bold"),d(P,"class","w-3 h-3"),d(S,"href",J=`/app/supplier/${a[0]}/edit`),d(S,"class","bg-indigo-600 text-white rounded flex items-center px-4 py-2"),d(r,"class","bg-white flex items-center px-4 py-2"),d(Y,"class","jo-table"),d(ma,"class","pagination"),d(t,"class","cont")},m(a,e){g(a,t,e),m(t,r),m(r,T),m(T,I),m(T,j),m(T,k),m(r,N),m(r,B),m(r,O),m(r,S),m(S,C),m(C,F),m(S,R),m(S,P),u(z,P,null),m(t,L),m(t,U),m(U,Y),m(Y,q),m(q,G),m(G,K),m(G,M),m(G,Q),m(Q,W),m(G,X),m(G,Z),m(Z,aa),m(G,ta),m(G,ra),m(ra,ea),m(G,sa),m(G,na),m(na,la),m(G,oa),m(G,ca),m(ca,ia),m(G,fa),m(G,ha),m(Y,pa),m(Y,da);for(let a=0;a<$a.length;a+=1)$a[a].m(da,null);m(t,ga),m(t,ma);for(let a=0;a<ya.length;a+=1)ya[a].m(ma,null);ua=!0},p(a,[t]){if((!ua||4&t)&&Ea!==(Ea=a[2].first_name+"")&&E(j,Ea),(!ua||1&t&&J!==(J=`/app/supplier/${a[0]}/edit`))&&d(S,"href",J),8&t){let r;for(va=a[3],r=0;r<va.length;r+=1){const e=A(a,va,r);$a[r]?($a[r].p(e,t),v($a[r],1)):($a[r]=H(e),$a[r].c(),v($a[r],1),$a[r].m(da,null))}for(D(),r=va.length;r<$a.length;r+=1)ba(r);y()}if(18&t){let r;for(Ta=Array(a[4]),r=0;r<Ta.length;r+=1){const e=_(a,Ta,r);ya[r]?ya[r].p(e,t):(ya[r]=V(e),ya[r].c(),ya[r].m(ma,null))}for(;r<ya.length;r+=1)ya[r].d(1);ya.length=Ta.length}},i(a){if(!ua){v(z.$$.fragment,a);for(let a=0;a<va.length;a+=1)v($a[a]);ua=!0}},o(a){$(z.$$.fragment,a),$a=$a.filter(Boolean);for(let a=0;a<$a.length;a+=1)$($a[a]);ua=!1},d(a){a&&f(t),b(z),x($a,a),x(ya,a)}}}async function B(a){return a.params}function O(a,t,r){let{id:e}=t,s={},n=[],l=0,o=0;return a.$$set=a=>{"id"in a&&r(0,e=a.id)},a.$$.update=()=>{1&a.$$.dirty&&async function(a){if(!a)return;const t=`/api/v1/supplier/${a}`;try{r(2,s=await k({url:t}))}catch(a){console.log(a),alert("gagal mengambil data supplier")}}(e),3&a.$$.dirty&&async function({id:a,keyword:t,per_page:e,page:s}){console.log("here");const l={keyword:t,per_page:e,page:s};try{const t=await k({url:`/api/v1/supplier/${a}/purchase`,params:l});r(3,n=t.items),r(4,o=t.total_page),console.log(t)}catch(a){console.log(a),alert("gagal mengambil data pembelian")}}({id:e,keyword:"",per_page:10,page:l})},[e,l,s,n,o,a=>{r(1,l=a)}]}export default class extends a{constructor(a){super(),t(this,a,O,N,r,{id:0})}}export{B as preload};