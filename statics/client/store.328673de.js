import{w as e}from"./client.36844de2.js";import{g as n}from"./api.e630a648.js";const l=function(){const{subscribe:n,update:l}=e({entity:"pelanggan",id:0,value:!1,on_yes:null});return{subscribe:n,show:({entity:e,id:n,on_yes:o})=>{const s=()=>{o(),l((e=>({...e,value:!1})))};l((l=>({...l,value:!0,entity:e,id:n,on_yes:s})))},hide:()=>{l((e=>({...e,value:!1})))}}}();!function(){const l=e({username:"",first_name:"",mobile:null,email:null,role:null});n({url:"/auth/me"}).then((e=>{l.set({username:e.username,first_name:e.first_name,mobile:e.mobile,email:e.email,role:e.role})})).catch((e=>{console.log("ERROR WHEN VALIDATING USER"),console.log(e)}))}();export{l as d};