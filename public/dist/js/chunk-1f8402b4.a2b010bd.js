(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1f8402b4"],{3001:function(s,t,e){},"4ad4":function(s,t,e){"use strict";var i=e("3001"),a=e.n(i);a.a},"55c2":function(s,t,e){"use strict";e.r(t);var i=function(){var s=this,t=s.$createElement,e=s._self._c||t;return e("div",{staticClass:"contact-detail-page"},[e("div",{staticClass:"sec"},[e("div",{staticClass:"sec-header"},[s._v(s._s(s.$t("Contact")))]),e("div",{staticClass:"contact-info"},[e("div",{staticClass:"info-hd"},[e("div",{staticClass:"info-item"},[e("span",{staticClass:"info-item_desc"},[s._v(s._s(s.$t("Nickname"))+": ")]),e("span",{staticClass:"info-item_primary"},[s._v(s._s(s.userAccount.username||"-"))])]),e("div",{staticClass:"info-item"},[e("span",{staticClass:"info-item_desc"},[s._v(s._s(s.$t("Address"))+": ")]),e("span",{staticClass:"info-item_primary"},[s._v(s._s(s.userAccount.address[0]))])])]),s.userAccount.isFriend?s._e():e("x-btn",{attrs:{icon:"&#xe601;",width:"90px"},on:{click:function(t){s.addVisible=!0}}},[s._v(s._s(s.$t("Add")))]),e("div",{staticClass:"info-ft"},[e("x-btn",{attrs:{type:"primary",icon:"&#xe60b;",width:"90px"},on:{click:function(t){s.sendVisible=!0}}},[s._v(s._s(s.$t("Send")))])],1)],1)]),e("div",{staticClass:"sec order-sec"},[e("div",{staticClass:"sec-header"},[s._v(s._s(s.$t("Transactions")))]),e("account-orders",{attrs:{address:s.id}})],1),s.sendVisible?e("send",{attrs:{visible:s.sendVisible,recipient:s.id},on:{"update:visible":function(t){s.sendVisible=t}}}):s._e(),s.addVisible?e("add-contact",{attrs:{visible:s.addVisible,address:s.userAccount.address[0]},on:{"update:visible":function(t){s.addVisible=t},success:s.successHandle}}):s._e()],1)},a=[],n=e("cebc"),c=e("be58"),d=e("5d20"),o=e("5f4d"),r=e("42ba"),u=e("8fd0"),l=e("2f62"),p=e("e141"),f={data:function(){return{userAccount:{address:[]},sendVisible:!1,addVisible:!1,id:""}},components:{XBtn:c["a"],AccountOrders:d["a"],Send:r["a"],AddContact:u["a"]},computed:Object(n["a"])({},Object(l["b"])(["account"])),watch:{},created:function(){this.id=this.$route.params.id,this.fetch()},beforeRouteUpdate:function(s,t,e){console.log("beforeRouteUpdate"),this.id=s.params.id,this.fetch(),e()},methods:{fetch:function(){var s=this;o["a"].account.getAccount([this.id,this.account.address[0]]).then(function(t){null!==t&&(s.userAccount=t.account)})},successHandle:function(){p["a"].success(this.$t("Success")),this.userAccount.isFriend=!0}}},h=f,b=(e("602d"),e("2877")),m=Object(b["a"])(h,i,a,!1,null,"3e4b21e9",null);m.options.__file="Detail.vue";t["default"]=m.exports},"602d":function(s,t,e){"use strict";var i=e("b97e"),a=e.n(i);a.a},"8fd0":function(s,t,e){"use strict";var i=function(){var s=this,t=s.$createElement,e=s._self._c||t;return e("div",{staticClass:"add-contact-comp"},[s.compVisible?e("modal",{attrs:{visible:s.compVisible,okLoading:s.okLoading,title:s.$t("AddContact"),hint:s.$t("Addingacontactrequiresafee")},on:{"update:visible":function(t){s.compVisible=t},ok:s.submit}},[e("div",{staticClass:"add-title"},[s._v(s._s(s.$t("Contact")))]),e("x-input",{attrs:{status:s.addressStatus,errorMsg:s.addressError,placeholder:s.$t("Pleaseenteranicknameoraddress")},model:{value:s.compAddress,callback:function(t){s.compAddress="string"===typeof t?t.trim():t},expression:"compAddress"}}),1==s.account.secondsign||1==s.account.secondsign_unconfirmed?e("div",{staticClass:"add-title"},[s._v(s._s(s.$t("PaymentPassword")))]):s._e(),1==s.account.secondsign||1==s.account.secondsign_unconfirmed?e("x-input",{attrs:{type:"password",status:s.passwordStatus,errorMsg:s.passwordError,placeholder:s.Pleaseenterthepaymentpassword},model:{value:s.password,callback:function(t){s.password="string"===typeof t?t.trim():t},expression:"password"}}):s._e(),e("div",{staticClass:"add-fee"},[s._v(s._s(s.$t("Fee"))+"： "+s._s(s._f("bac")(s.fee))+" BAC")])],1):s._e()],1)},a=[],n=(e("6b54"),e("cebc")),c=e("705f"),d=e("42d8"),o=e("5f4d"),r=e("2f62"),u=e("94f8"),l=e.n(u),p={data:function(){return{fee:"",okLoading:!1,compVisible:!1,compAddress:"",addressStatus:"",addressError:"",password:"",passwordStatus:"",passwordError:""}},props:{visible:{default:"false"},address:{default:""}},computed:Object(n["a"])({},Object(r["b"])({account:function(s){return s.account},key:function(s){return s.key}})),watch:{compVisible:function(s){s||this.$emit("update:visible",!1)},compAddress:function(){this.addressStatus=""},password:function(){this.passwordStatus=""}},created:function(){var s=this;this.compVisible=this.visible,this.compAddress=this.address,o["a"].contacts.getFee().then(function(t){null!==t&&(s.fee=t.fee)})},components:{Modal:c["a"],XInput:d["a"]},methods:{submit:function(){var s=this;return""==this.compAddress?(this.addressStatus="error",void(this.addressError=this.$t("Pleaseenteranicknameoraddress"))):1!=this.account.secondsign&&1!=this.account.secondsign_unconfirmed||""!=this.password?(this.okLoading=!0,void o["a"].contacts.add([this.key.mnemonic,this.account.publicKey,this.compAddress,l()(this.password).toString()]).then(function(t){s.okLoading=!1,null!==t&&(s.compVisible=!1,s.$emit("success",t))})):(this.passwordStatus="error",void(this.passwordError=this.$t("Pleaseenterthepaymentpassword")))}}},f=p,h=(e("4ad4"),e("2877")),b=Object(h["a"])(f,i,a,!1,null,"0ab6e676",null);b.options.__file="AddContact.vue";t["a"]=b.exports},b97e:function(s,t,e){}}]);
//# sourceMappingURL=chunk-1f8402b4.a2b010bd.js.map