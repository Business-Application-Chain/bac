(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[10],{"gH+Q":function(s,t,n){"use strict";var e=n("pXvw"),a=n.n(e);a.a},nIie:function(s,t,n){"use strict";n.r(t);var e=function(){var s=this,t=s.$createElement,n=s._self._c||t;return n("div",{staticClass:"settings-index-page sec"},[n("div",{staticClass:"sec-header"},[s._v("\n        "+s._s(s.$t("PaymentPassword"))),1==s.account.secondsign||1==s.account.secondsign_unconfirmed?n("span",{staticClass:"warn"},[s._v("["+s._s(s.$t("Hasbeenset"))+"]")]):s._e()]),n("div",{staticClass:"settings-pw"},[n("div",{staticClass:"pw-hd"},[n("div",{staticClass:"pw-hd_title"},[s._v(s._s(s.$t("Password")))]),n("x-input",{attrs:{type:"password",status:s.status,disabeld:1==s.account.secondsign||1==s.account.secondsign_unconfirmed},model:{value:s.password,callback:function(t){s.password="string"===typeof t?t.trim():t},expression:"password"}}),n("div",{staticClass:"pw-hd_title second-title"},[s._v(s._s(s.$t("ConfirmPassword")))]),n("x-input",{attrs:{type:"password",status:s.status,disabeld:1==s.account.secondsign||1==s.account.secondsign_unconfirmed},model:{value:s.secondPassword,callback:function(t){s.secondPassword="string"===typeof t?t.trim():t},expression:"secondPassword"}}),n("div",{staticClass:"hd-btn"},[n("x-btn",{attrs:{type:"primary",disabled:s.disabled,loading:s.loading,width:"126px"},on:{click:s.submit}},[s._v(s._s(s.$t("Submit")))])],1)],1),n("div",{staticClass:"pw-ft"},[n("div",{staticClass:"pw-ft_warn"},[n("span",{staticClass:"warn-circle"}),s._v(s._s(s.$t("Warning"))+"："+s._s(s.$t("Thepaymentpasswordcannotbemodifiedafteritisset"))+"\n            ")]),n("div",{staticClass:"pw-ft_desc"},[s._v(s._s(s.$t("PaymentPasswordsethint")))]),n("div",{staticClass:"pw-ft_primary"},[s._v(s._s(s.$t("Fee"))+"："),n("b",[s._v(s._s(s._f("bac")(s.fee))+" BAC")])])])])])},a=[],i=(n("a1Th"),n("yT7P")),c=n("Qthk"),o=n("vljD"),r=n("X02F"),d=n("lPiR"),u=n.n(d),l=n("L2JU"),p=n("4UHB"),w={data:function(){return{password:"",secondPassword:"",fee:"",loading:!1}},components:{XInput:c["a"],XBtn:o["a"]},computed:Object(i["a"])({disabled:function(){return""==this.password||this.password!=this.secondPassword},status:function(){return""!=this.password&&this.password==this.secondPassword?"success":""}},Object(l["b"])(["account","key"])),created:function(){var s=this;r["a"].account.getPasswordFee().then(function(t){null!==t&&(s.fee=t.fee)})},methods:{submit:function(){var s=this;this.loading=!0;var t=u()(this.password).toString();r["a"].account.addSignature([this.key.mnemonic,t,this.account.publicKey]).then(function(t){s.loading=!1,null!==t&&(p["a"].success(s.$t("Success")),location.reload())})}}},f=w,b=(n("gH+Q"),n("KHd+")),v=Object(b["a"])(f,e,a,!1,null,"1b28bf5c",null);t["default"]=v.exports},pXvw:function(s,t,n){},yT7P:function(s,t,n){"use strict";function e(s,t,n){return t in s?Object.defineProperty(s,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):s[t]=n,s}function a(s){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},a=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(a=a.concat(Object.getOwnPropertySymbols(n).filter(function(s){return Object.getOwnPropertyDescriptor(n,s).enumerable}))),a.forEach(function(t){e(s,t,n[t])})}return s}n.d(t,"a",function(){return a})}}]);
//# sourceMappingURL=10.4230e9a9.js.map