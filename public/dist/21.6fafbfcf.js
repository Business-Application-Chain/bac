(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[21],{"/Mu5":function(t,s,a){},"0dPx":function(t,s,a){},VSiE:function(t,s,a){"use strict";a.r(s);var i=function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("div",{staticClass:"login-setpassword-page"},[a("login-step",{attrs:{step:"2"}}),a("div",{staticClass:"page-title"},[t._v("\n        "+t._s(t.$t("yourPassword"))+"\n    ")]),a("div",{staticClass:"page-desc"},[t._v("\n        "+t._s(t.$t("weAdviseYouToUseStrongPasswordForYourOwnSecurity"))+"\n    ")]),a("div",{staticClass:"page-sec"},[a("div",{staticClass:"password-sec"},[a("div",{staticClass:"sec-title first-title"},[t._v("\n                "+t._s(t.$t("password"))+"\n            ")]),a("x-input",{attrs:{type:"password",status:t.pwStatus},model:{value:t.password,callback:function(s){t.password=s},expression:"password"}}),a("div",{staticClass:"sec-title second-title"},[t._v("\n                "+t._s(t.$t("confirmPassword"))+"\n            ")]),a("x-input",{attrs:{type:"password",status:t.pwStatus},model:{value:t.confirmPw,callback:function(s){t.confirmPw=s},expression:"confirmPw"}})],1)]),a("div",{staticClass:"page-sec"},[a("div",{staticClass:"btn-cont"},[a("div",{staticClass:"btn-cont_hd"},[a("x-btn",{on:{click:t.goBack}},[t._v(t._s(t.$t("back")))])],1),a("div",{staticClass:"btn-cont_ft"},[a("x-btn",{attrs:{disabled:"success"!=t.pwStatus,type:"primary"},on:{click:t.goNext}},[t._v(t._s(t.$t("continueNext")))])],1)])])],1)},e=[],c=(a("a1Th"),a("+t9L")),n=a("vljD"),o=a("Qthk"),r=a("cIm9"),p=a("lPiR"),l=a.n(p),d={data:function(){return{password:"",confirmPw:""}},components:{XCircle:c["a"],XBtn:n["a"],XInput:o["a"],LoginStep:r["a"]},computed:{pwStatus:function(){return""!=this.password&&this.password==this.confirmPw?"success":""}},methods:{goBack:function(){this.$router.go(-1)},goNext:function(){this.password==this.confirmPw?(this.$store.dispatch("setKey",{password:l()(this.password).toString()}),this.$router.push({path:"export"})):alert("两次密码不一致")}}},u=d,v=(a("cvRs"),a("KHd+")),w=Object(v["a"])(u,i,e,!1,null,"0ed249d7",null);s["default"]=w.exports},Y8fu:function(t,s,a){"use strict";var i=a("/Mu5"),e=a.n(i);e.a},cIm9:function(t,s,a){"use strict";var i=function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("div",{staticClass:"login-step-comp"},[a("x-circle",{attrs:{type:1==t.step?"plain":"primary"}}),a("div",{staticClass:"comp-text"},[t._v(t._s(t.$t("madeBackupWords")))]),a("div",{staticClass:"comp-line"}),a("x-circle",{attrs:{type:2==t.step?"plain":3==t.step?"primary":"disabled"}}),a("div",{staticClass:"comp-text",class:{disabled:1==t.step}},[t._v(t._s(t.$t("setPassword")))]),a("div",{staticClass:"comp-line"}),a("x-circle",{attrs:{type:3==t.step?"plain":"disabled"}}),a("div",{staticClass:"comp-text",class:{disabled:1==t.step||2==t.step}},[t._v(t._s(t.$t("exportFile")))])],1)},e=[],c=a("+t9L"),n={props:{step:{default:1}},components:{XCircle:c["a"]}},o=n,r=(a("Y8fu"),a("KHd+")),p=Object(r["a"])(o,i,e,!1,null,"31b4fce0",null);s["a"]=p.exports},cvRs:function(t,s,a){"use strict";var i=a("0dPx"),e=a.n(i);e.a}}]);
//# sourceMappingURL=21.6fafbfcf.js.map