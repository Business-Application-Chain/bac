(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[20],{"/Mu5":function(t,e,s){},"0Gnu":function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAAAXNSR0IArs4c6QAAAgtJREFUWAnt2UFOwkAUAND50EqIMcaEeAIu4YoS3LhhQeLOhTfQGBe6AAoudGGM3sA9CSewAVa9BCcwJMZoQqCFLwOUAGkp307LkDCb0umfP4/PzAQCsGnT9J7uvA7jGodhyygnG0Fzx4ImWHf8AGOZXKWbXTfeKy4yMAeIQEcKFoGOHBwUvRFwELTCB69qTT2hr3q+6tnpEx7aPeuSIR65xU3XNKOcHqFW+OMOvpWE+s4AvtzAvI+6EUMFc5BodOhg0ehIwCLRkYFFoSMFU9A81q1FDuaIdTaiG5b3bQTMJ56h+Q2hbQzMjRxNsI5DNwqmYnn81oF9v0v8pwqUMdTvKltXYWnAWsV61RF9Pb4BlI83SCwiXjUqdu38BZOr8kgDniCx8PljG9ozprzQkoFHTMQT9muZ2iOm3dDCT4mM3ke3iSh9owRp6NlmrmrljZJqzo+Vr8JTHTJM2ciM7INd2ArwGImYHA6wplX71w5a2go7wAmczZaZ8DW8MFHQG4BuLAYXjaJad1JJCwYGnTiwvFFUFjadcHBL3wOnGpTr/OkyStBmCeXMuIf2cg7h4OUJyPcAJttX8s1b6LiNlWzTQf34QMl5YfkbkKbCAPCmlZQbHWDoVlmnT5oKN8vqtR+Wo6UBOxX0u+7AfhUK+nx2Zob9LxIV6vVbb7ckqJWkxu8qTK0YNX7rKvwH8ti347mi0hYAAAAASUVORK5CYII="},Bjdk:function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"login-export-page"},[a("login-step",{attrs:{step:"3"}}),a("div",{staticClass:"page-title"},[t._v("\n        "+t._s(t.$t("yourFile"))+"\n    ")]),a("div",{staticClass:"page-desc"},[t._v("\n        "+t._s(t.$t("PleasekeepyourfileinasafeplaceYouwillneedtheminordertoretrievethewallet"))+"\n    ")]),a("div",{staticClass:"page-sec pointer-sec",on:{click:t.createAndDownloadFile}},[a("div",{staticClass:"export-cont"},[a("div",{staticClass:"export-cont_title"},[t._v(t._s(t.$t("Exportyourfile")))]),a("img",{staticClass:"export-cont_img",attrs:{src:s("0Gnu")}}),a("div",{staticClass:"export-cont_ft"},[t._v(t._s(t.$t("Export")))])])])],1)},i=[],n=(s("pIFo"),s("vljD")),o=s("Qthk"),c=s("4yH9"),r=s("cIm9"),l=function(t,e){var s=document.createElement("a"),a=new Blob([e]);s.download=t,s.href=URL.createObjectURL(a),s.click(),URL.revokeObjectURL(a)},p=l,u={data:function(){return{}},components:{XBtn:n["a"],XInput:o["a"],LoginStep:r["a"]},computed:{},methods:{goBack:function(){this.$router.go(-1)},createAndDownloadFile:function(){var t=JSON.stringify(this.$store.state.key),e={data:c["a"].encrypt(t)};p("bac_keystore.json",JSON.stringify(e)),this.$router.replace({path:"/"})}}},d=u,A=(s("U+xh"),s("KHd+")),v=Object(A["a"])(d,a,i,!1,null,"59161a5f",null);e["default"]=v.exports},"IU+Z":function(t,e,s){"use strict";var a=s("Mukb"),i=s("KroJ"),n=s("eeVq"),o=s("vhPU"),c=s("K0xU");t.exports=function(t,e,s){var r=c(t),l=s(o,r,""[t]),p=l[0],u=l[1];n(function(){var e={};return e[r]=function(){return 7},7!=""[t](e)})&&(i(String.prototype,t,p),a(RegExp.prototype,r,2==e?function(t,e){return u.call(t,this,e)}:function(t){return u.call(t,this)}))}},"U+xh":function(t,e,s){"use strict";var a=s("aONN"),i=s.n(a);i.a},Y8fu:function(t,e,s){"use strict";var a=s("/Mu5"),i=s.n(a);i.a},aONN:function(t,e,s){},cIm9:function(t,e,s){"use strict";var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"login-step-comp"},[s("x-circle",{attrs:{type:1==t.step?"plain":"primary"}}),s("div",{staticClass:"comp-text"},[t._v(t._s(t.$t("madeBackupWords")))]),s("div",{staticClass:"comp-line"}),s("x-circle",{attrs:{type:2==t.step?"plain":3==t.step?"primary":"disabled"}}),s("div",{staticClass:"comp-text",class:{disabled:1==t.step}},[t._v(t._s(t.$t("setPassword")))]),s("div",{staticClass:"comp-line"}),s("x-circle",{attrs:{type:3==t.step?"plain":"disabled"}}),s("div",{staticClass:"comp-text",class:{disabled:1==t.step||2==t.step}},[t._v(t._s(t.$t("exportFile")))])],1)},i=[],n=s("+t9L"),o={props:{step:{default:1}},components:{XCircle:n["a"]}},c=o,r=(s("Y8fu"),s("KHd+")),l=Object(r["a"])(c,a,i,!1,null,"31b4fce0",null);e["a"]=l.exports},pIFo:function(t,e,s){s("IU+Z")("replace",2,function(t,e,s){return[function(a,i){"use strict";var n=t(this),o=void 0==a?void 0:a[e];return void 0!==o?o.call(a,n,i):s.call(String(n),a,i)},s]})}}]);
//# sourceMappingURL=20.52c6ccb6.js.map