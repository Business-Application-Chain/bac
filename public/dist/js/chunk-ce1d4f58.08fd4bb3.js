(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-ce1d4f58"],{"02f4":function(t,e,n){var i=n("4588"),r=n("be13");t.exports=function(t){return function(e,n){var a,s,o=String(r(e)),c=i(n),u=o.length;return c<0||c>=u?t?"":void 0:(a=o.charCodeAt(c),a<55296||a>56319||c+1===u||(s=o.charCodeAt(c+1))<56320||s>57343?t?o.charAt(c):a:t?o.slice(c,c+2):s-56320+(a-55296<<10)+65536)}}},"0364":function(t,e,n){t.exports=n.p+"img/browser@3x.8213fa37.png"},"0390":function(t,e,n){"use strict";var i=n("02f4")(!0);t.exports=function(t,e,n){return e+(n?i(t,e).length:1)}},"214f":function(t,e,n){"use strict";n("b0c5");var i=n("2aba"),r=n("32e9"),a=n("79e5"),s=n("be13"),o=n("2b4c"),c=n("520a"),u=o("species"),l=!a(function(){var t=/./;return t.exec=function(){var t=[];return t.groups={a:"7"},t},"7"!=="".replace(t,"$<a>")}),f=function(){var t=/(?:)/,e=t.exec;t.exec=function(){return e.apply(this,arguments)};var n="ab".split(t);return 2===n.length&&"a"===n[0]&&"b"===n[1]}();t.exports=function(t,e,n){var d=o(t),h=!a(function(){var e={};return e[d]=function(){return 7},7!=""[t](e)}),p=h?!a(function(){var e=!1,n=/a/;return n.exec=function(){return e=!0,null},"split"===t&&(n.constructor={},n.constructor[u]=function(){return n}),n[d](""),!e}):void 0;if(!h||!p||"replace"===t&&!l||"split"===t&&!f){var v=/./[d],g=n(s,d,""[t],function(t,e,n,i,r){return e.exec===c?h&&!r?{done:!0,value:v.call(e,n,i)}:{done:!0,value:t.call(n,e,i)}:{done:!1}}),m=g[0],b=g[1];i(String.prototype,t,m),r(RegExp.prototype,d,2==e?function(t,e){return b.call(t,this,e)}:function(t){return b.call(t,this)})}}},"224b":function(t,e,n){"use strict";var i=n("5512"),r=n.n(i);r.a},"28a5":function(t,e,n){"use strict";var i=n("aae3"),r=n("cb7c"),a=n("ebd6"),s=n("0390"),o=n("9def"),c=n("5f1b"),u=n("520a"),l=Math.min,f=[].push,d="split",h="length",p="lastIndex",v=!!function(){try{return new RegExp("x","y")}catch(t){}}();n("214f")("split",2,function(t,e,n,g){var m;return m="c"=="abbc"[d](/(b)*/)[1]||4!="test"[d](/(?:)/,-1)[h]||2!="ab"[d](/(?:ab)*/)[h]||4!="."[d](/(.?)(.?)/)[h]||"."[d](/()()/)[h]>1||""[d](/.?/)[h]?function(t,e){var r=String(this);if(void 0===t&&0===e)return[];if(!i(t))return n.call(r,t,e);var a,s,o,c=[],l=(t.ignoreCase?"i":"")+(t.multiline?"m":"")+(t.unicode?"u":"")+(t.sticky?"y":""),d=0,v=void 0===e?4294967295:e>>>0,g=new RegExp(t.source,l+"g");while(a=u.call(g,r)){if(s=g[p],s>d&&(c.push(r.slice(d,a.index)),a[h]>1&&a.index<r[h]&&f.apply(c,a.slice(1)),o=a[0][h],d=s,c[h]>=v))break;g[p]===a.index&&g[p]++}return d===r[h]?!o&&g.test("")||c.push(""):c.push(r.slice(d)),c[h]>v?c.slice(0,v):c}:"0"[d](void 0,0)[h]?function(t,e){return void 0===t&&0===e?[]:n.call(this,t,e)}:n,[function(n,i){var r=t(this),a=void 0==n?void 0:n[e];return void 0!==a?a.call(n,r,i):m.call(String(r),n,i)},function(t,e){var i=g(m,t,this,e,m!==n);if(i.done)return i.value;var u=r(t),f=String(this),d=a(u,RegExp),h=u.unicode,p=(u.ignoreCase?"i":"")+(u.multiline?"m":"")+(u.unicode?"u":"")+(v?"y":"g"),b=new d(v?u:"^(?:"+u.source+")",p),y=void 0===e?4294967295:e>>>0;if(0===y)return[];if(0===f.length)return null===c(b,f)?[f]:[];var x=0,_=0,C=[];while(_<f.length){b.lastIndex=v?_:0;var w,A=c(b,v?f:f.slice(_));if(null===A||(w=l(o(b.lastIndex+(v?0:_)),f.length))===x)_=s(f,_,h);else{if(C.push(f.slice(x,_)),C.length===y)return C;for(var E=1;E<=A.length-1;E++)if(C.push(A[E]),C.length===y)return C;_=x=w}}return C.push(f.slice(x)),C}]})},"2e2e":function(t,e,n){"use strict";var i=n("b8dc"),r=n.n(i);r.a},"3b8d":function(t,e,n){"use strict";n.d(e,"a",function(){return s});var i=n("795b"),r=n.n(i);function a(t,e,n,i,a,s,o){try{var c=t[s](o),u=c.value}catch(l){return void n(l)}c.done?e(u):r.a.resolve(u).then(i,a)}function s(t){return function(){var e=this,n=arguments;return new r.a(function(i,r){var s=t.apply(e,n);function o(t){a(s,i,r,o,c,"next",t)}function c(t){a(s,i,r,o,c,"throw",t)}o(void 0)})}}},"520a":function(t,e,n){"use strict";var i=n("0bfb"),r=RegExp.prototype.exec,a=String.prototype.replace,s=r,o="lastIndex",c=function(){var t=/a/,e=/b*/g;return r.call(t,"a"),r.call(e,"a"),0!==t[o]||0!==e[o]}(),u=void 0!==/()??/.exec("")[1],l=c||u;l&&(s=function(t){var e,n,s,l,f=this;return u&&(n=new RegExp("^"+f.source+"$(?!\\s)",i.call(f))),c&&(e=f[o]),s=r.call(f,t),c&&s&&(f[o]=f.global?s.index+s[0].length:e),u&&s&&s.length>1&&a.call(s[0],n,function(){for(l=1;l<arguments.length-2;l++)void 0===arguments[l]&&(s[l]=void 0)}),s}),t.exports=s},5512:function(t,e,n){},"56f2":function(t,e,n){t.exports=n.p+"img/dashboard@3x.a704bcfc.png"},5760:function(t,e,n){t.exports=n.p+"img/dapp@3x.6a9d1b31.png"},"5f1b":function(t,e,n){"use strict";var i=n("23c6"),r=RegExp.prototype.exec;t.exports=function(t,e){var n=t.exec;if("function"===typeof n){var a=n.call(t,e);if("object"!==typeof a)throw new TypeError("RegExp exec method returned something other than an Object or null");return a}if("RegExp"!==i(t))throw new TypeError("RegExp#exec called on incompatible receiver");return r.call(t,e)}},"6e4c":function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAklJREFUOBGNlE1vEkEcxp+hs7tNF2h8gUVbqbaQtlptVw9aoLyoV+OX0B78GB7q2YtnL/oNPMtrowcKKB5sEAVjBdE0adkW6LLjLE2TGg87k2w2s/ufZ37/55ldIitP2GAwhERdsCwLQ4tBVigGPROUUpwjXWSPXiMAE0M4DxpZvYTNzTpW9Cm0W/vo/D5AZDWITLaGhUUfVHMCphoBZBE5gIy5HrHU3TByuW/QAm5omgdbxQbW4mEUiz+gcNqPtWfQvIozHq8gqdQGy+e/QNdn0GrvodMxEInOIPO2hsVrU1CtHl4G65ieACxGHEUJlR6zVGIOuUJjROfXVJS2mojFwihVdqAcGsjeaiAgCXoYjc2O/FrRg2hxDz9V24gnQshl65hf0OB2n4f65gUmvTKYIx9vWZbXWTwxi0KhCb/fzS8VlfJ33nYI5cpPyD0D+eQuLigWLAFBGoleQTq9Df3m5RFh1SbkgaQzPOWrF+ExJQw6n2HaggKIRJLWWSLJCfMN+HnCNmW5xD1cm+Ne7kCSKT5s85QnBVO+fecpe/+uhus3eMr2OfxlIMpTLhRqCM0H4Bke4pWviulxdnywT1PaoZ+e8yl58PA5G/RNTjIGa8gX8b4UTtXnz6jkgpf1sHGQwVnWP/bwH4H/FQnjw8lrkTBONMifZd1R8KRY5E5dy0sidbzG+SuxhYgl0LLgjqMyurskSChoDJXv3xMDEPgx2EKjlO3NBQEcNydfkymmGAaU7r6t77jAqYA0z/jYeHcP9KjvVCv0/i9VxeKjYdceMAAAAABJRU5ErkJggg=="},"781f":function(t,e,n){"use strict";n("28a5");var i=n("14ac"),r=new WebSocket(i["a"].websocketUrl,"echo-protocol"),a=[];r.onopen=function(t){},r.addEventListener("message",function(t){var e=t.data.split("|");201==e[0]&&a.forEach(function(t){return t({mod:e[1],name:e[2],data:JSON.parse(e[3])})})}),setInterval(function(){r.send("102|kernel|peerInfo")},6e4),r.onclose=function(t){},e["a"]={ws:r,add:function(t){a.push(t)}}},"7caa":function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAbhJREFUOBHtVL1OAkEQ/mbZOwgQjAZjYmW0wZbE6CPY6SvoC1nZW9nY+QzaWttAYoUmoPITINzP+g3kQjS5Ba2dy+zP7Mw3Mzs7J6+nTQcfpTw0PoXvZ3bUbi0lP40LxKoDaY8+Y1nqeVbGmALmLJy37WKtMhQgNYvapaBAucSUqU6mnzerMxeR+W1czOCKXM8o1DSHDoNrA/fhYBuMskj2XxAsQqBynqB0GKN6PENQSTFpWYzvme+AoH3yJlA+cxjdClyHe0/2BlNg8mgQ7KZMLUa4H2P6wKiGNNQoiYu+YHBFsDcirSiQUW+uZxB1Ld7vqph1LJIuQTLSFJlF2BRIieuVKVNHysDnTYD4WWAP3NzQjfSANxsRqOIQHrHQL/Q+Vjk5h6Td2NJ68G2QNb2EnKVVItAJED0J0j4dGQ8SzZQWpqqnYEo6Z3aWEe9xw8ozzvnxqmERYZ4WI3eMXNTtenh8Nj4iCN/yryi7rV8Z+ZT/AX23s96ZlZQvWVhOPhF2Kz+Oulf+A9lxfYddkhDEIDVs7SRBOBkjmK7osRxntlgqstv4dyGYgsLFCIxDwC6ZR5pjmCf+AhrDfntcD8urAAAAAElFTkSuQmCC"},"7f7f":function(t,e,n){var i=n("86cc").f,r=Function.prototype,a=/^\s*function ([^ (]*)/,s="name";s in r||n("9e1e")&&i(r,s,{configurable:!0,get:function(){try{return(""+this).match(a)[1]}catch(t){return""}}})},"86e9":function(t,e,n){"use strict";var i=n("a9b6"),r=n.n(i);r.a},"88b0":function(t,e,n){"use strict";var i=n("d2be"),r=n.n(i);r.a},"96cf":function(t,e){!function(e){"use strict";var n,i=Object.prototype,r=i.hasOwnProperty,a="function"===typeof Symbol?Symbol:{},s=a.iterator||"@@iterator",o=a.asyncIterator||"@@asyncIterator",c=a.toStringTag||"@@toStringTag",u="object"===typeof t,l=e.regeneratorRuntime;if(l)u&&(t.exports=l);else{l=e.regeneratorRuntime=u?t.exports:{},l.wrap=x;var f="suspendedStart",d="suspendedYield",h="executing",p="completed",v={},g={};g[s]=function(){return this};var m=Object.getPrototypeOf,b=m&&m(m(R([])));b&&b!==i&&r.call(b,s)&&(g=b);var y=A.prototype=C.prototype=Object.create(g);w.prototype=y.constructor=A,A.constructor=w,A[c]=w.displayName="GeneratorFunction",l.isGeneratorFunction=function(t){var e="function"===typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},l.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,A):(t.__proto__=A,c in t||(t[c]="GeneratorFunction")),t.prototype=Object.create(y),t},l.awrap=function(t){return{__await:t}},E(k.prototype),k.prototype[o]=function(){return this},l.AsyncIterator=k,l.async=function(t,e,n,i){var r=new k(x(t,e,n,i));return l.isGeneratorFunction(e)?r:r.next().then(function(t){return t.done?t.value:r.next()})},E(y),y[c]="Generator",y[s]=function(){return this},y.toString=function(){return"[object Generator]"},l.keys=function(t){var e=[];for(var n in t)e.push(n);return e.reverse(),function n(){while(e.length){var i=e.pop();if(i in t)return n.value=i,n.done=!1,n}return n.done=!0,n}},l.values=R,N.prototype={constructor:N,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=n,this.done=!1,this.delegate=null,this.method="next",this.arg=n,this.tryEntries.forEach(S),!t)for(var e in this)"t"===e.charAt(0)&&r.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=n)},stop:function(){this.done=!0;var t=this.tryEntries[0],e=t.completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function i(i,r){return o.type="throw",o.arg=t,e.next=i,r&&(e.method="next",e.arg=n),!!r}for(var a=this.tryEntries.length-1;a>=0;--a){var s=this.tryEntries[a],o=s.completion;if("root"===s.tryLoc)return i("end");if(s.tryLoc<=this.prev){var c=r.call(s,"catchLoc"),u=r.call(s,"finallyLoc");if(c&&u){if(this.prev<s.catchLoc)return i(s.catchLoc,!0);if(this.prev<s.finallyLoc)return i(s.finallyLoc)}else if(c){if(this.prev<s.catchLoc)return i(s.catchLoc,!0)}else{if(!u)throw new Error("try statement without catch or finally");if(this.prev<s.finallyLoc)return i(s.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var i=this.tryEntries[n];if(i.tryLoc<=this.prev&&r.call(i,"finallyLoc")&&this.prev<i.finallyLoc){var a=i;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var s=a?a.completion:{};return s.type=t,s.arg=e,a?(this.method="next",this.next=a.finallyLoc,v):this.complete(s)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),v},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),S(n),v}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var i=n.completion;if("throw"===i.type){var r=i.arg;S(n)}return r}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,i){return this.delegate={iterator:R(t),resultName:e,nextLoc:i},"next"===this.method&&(this.arg=n),v}}}function x(t,e,n,i){var r=e&&e.prototype instanceof C?e:C,a=Object.create(r.prototype),s=new N(i||[]);return a._invoke=L(t,n,s),a}function _(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(i){return{type:"throw",arg:i}}}function C(){}function w(){}function A(){}function E(t){["next","throw","return"].forEach(function(e){t[e]=function(t){return this._invoke(e,t)}})}function k(t){function e(n,i,a,s){var o=_(t[n],t,i);if("throw"!==o.type){var c=o.arg,u=c.value;return u&&"object"===typeof u&&r.call(u,"__await")?Promise.resolve(u.__await).then(function(t){e("next",t,a,s)},function(t){e("throw",t,a,s)}):Promise.resolve(u).then(function(t){c.value=t,a(c)},function(t){return e("throw",t,a,s)})}s(o.arg)}var n;function i(t,i){function r(){return new Promise(function(n,r){e(t,i,n,r)})}return n=n?n.then(r,r):r()}this._invoke=i}function L(t,e,n){var i=f;return function(r,a){if(i===h)throw new Error("Generator is already running");if(i===p){if("throw"===r)throw a;return Q()}n.method=r,n.arg=a;while(1){var s=n.delegate;if(s){var o=O(s,n);if(o){if(o===v)continue;return o}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(i===f)throw i=p,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);i=h;var c=_(t,e,n);if("normal"===c.type){if(i=n.done?p:d,c.arg===v)continue;return{value:c.arg,done:n.done}}"throw"===c.type&&(i=p,n.method="throw",n.arg=c.arg)}}}function O(t,e){var i=t.iterator[e.method];if(i===n){if(e.delegate=null,"throw"===e.method){if(t.iterator.return&&(e.method="return",e.arg=n,O(t,e),"throw"===e.method))return v;e.method="throw",e.arg=new TypeError("The iterator does not provide a 'throw' method")}return v}var r=_(i,t.iterator,e.arg);if("throw"===r.type)return e.method="throw",e.arg=r.arg,e.delegate=null,v;var a=r.arg;return a?a.done?(e[t.resultName]=a.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=n),e.delegate=null,v):a:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,v)}function j(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function S(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function N(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(j,this),this.reset(!0)}function R(t){if(t){var e=t[s];if(e)return e.call(t);if("function"===typeof t.next)return t;if(!isNaN(t.length)){var i=-1,a=function e(){while(++i<t.length)if(r.call(t,i))return e.value=t[i],e.done=!1,e;return e.value=n,e.done=!0,e};return a.next=a}}return{next:Q}}function Q(){return{value:n,done:!0}}}(function(){return this||"object"===typeof self&&self}()||Function("return this")())},"9d64":function(t,e,n){t.exports=n.p+"img/logo.50dd17b7.png"},a9b6:function(t,e,n){},aae3:function(t,e,n){var i=n("d3f4"),r=n("2d95"),a=n("2b4c")("match");t.exports=function(t){var e;return i(t)&&(void 0!==(e=t[a])?!!e:"RegExp"==r(t))}},b0c5:function(t,e,n){"use strict";var i=n("520a");n("5ca1")({target:"RegExp",proto:!0,forced:i!==/./.exec},{exec:i})},b8dc:function(t,e,n){},c9d9:function(t,e,n){"use strict";var i=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{directives:[{name:"click-outside",rawName:"v-click-outside",value:t.hide,expression:"hide"}],staticClass:"lang-comp"},[i("div",{staticClass:"comp-cont",on:{click:function(e){t.visible=!t.visible}}},["zh"==t.$i18n.locale?i("img",{staticClass:"comp-img",attrs:{src:n("7caa")}}):t._e(),"en"==t.$i18n.locale?i("img",{staticClass:"comp-img",attrs:{src:n("6e4c")}}):t._e(),i("div",{staticClass:"comp-text"},[t._v(t._s(t.$t("lang")))]),i("i",{staticClass:"iconfont arrow-icon",class:{active:t.visible}},[t._v("")])]),i("transition",{attrs:{name:"fade-in-up"}},[t.visible?i("div",{staticClass:"comp-hide"},[i("div",{staticClass:"hide-item",on:{click:function(e){t.setLang("zh")}}},[i("img",{staticClass:"hide-item_img",attrs:{src:n("7caa")}}),i("div",{staticClass:"hide-item_txt"},[t._v("中文(简)")])]),i("div",{staticClass:"hide-item",on:{click:function(e){t.setLang("en")}}},[i("img",{staticClass:"hide-item_img",attrs:{src:n("6e4c")}}),i("div",{staticClass:"hide-item_txt"},[t._v("English")])])]):t._e()])],1)},r=[],a=(n("cadf"),n("551c"),n("097d"),n("e67d")),s=n.n(a),o={data:function(){return{visible:!1}},mounted:function(){console.log(this.$i18n.locale)},directives:{ClickOutside:s.a},methods:{setLang:function(t){this.$i18n.locale=t,this.visible=!1,localStorage.setItem("lang",t)},hide:function(){this.visible=!1}}},c=o,u=(n("88b0"),n("2877")),l=Object(u["a"])(c,i,r,!1,null,"011df4df",null);l.options.__file="lang.vue";e["a"]=l.exports},cd56:function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"main-page"},[n("main-header"),n("div",{staticClass:"page-cont"},[n("side-bar",{attrs:{name:t.$router.currentRoute.name}}),n("div",{staticClass:"cont-bd"},[n("transition",{attrs:{mode:"out-in"}},[n("router-view")],1)],1)],1)],1)},r=[],a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"main-header-comp"},[i("router-link",{staticClass:"logo",attrs:{to:{name:"dashboard"}}},[i("img",{staticClass:"logo-img",attrs:{src:n("9d64")}})]),i("div",{staticClass:"send-btn",on:{click:function(e){t.sendVisible=!0}}},[i("i",{staticClass:"iconfont send-btn_icon"},[t._v("")]),i("span",[t._v("Send")])]),i("router-link",{staticClass:"user-btn",attrs:{to:{name:"account"}}},[i("i",{staticClass:"iconfont user-btn_icon"},[t._v("")]),i("span",{staticClass:"user-btn_txt"},[t._v("\n            "+t._s(t._f("bac")(t.balance))+"\n            "),i("span",{staticClass:"user-btn_desc"},[t._v("BAC")])])]),i("div",{directives:[{name:"click-outside",rawName:"v-click-outside",value:t.hideMessage,expression:"hideMessage"}],staticClass:"message-btn",staticStyle:{display:"none"}},[i("div",{staticClass:"icon-btn",on:{click:function(e){t.messageVisible=!t.messageVisible}}},[i("i",{staticClass:"iconfont message-icon"},[t._v("")]),i("div",{staticClass:"btn-badge"},[t._v("9+")])]),i("transition",{attrs:{name:"fade-in-up"}},[t.messageVisible?i("div",{staticClass:"message-list sec"},[i("div",{staticClass:"sec-header"},[t._v("消息通知")]),i("div",{staticClass:"message-cont"},[i("div",{staticClass:"message-item",on:{click:t.goMessage}},[i("div",{staticClass:"message-item_inner"},[i("b",[t._v("[公告]")]),t._v(" 北京时间2点服务器进行维护北京时间2点服务器进行维护北京时间2点服务器进行维护北京时间2点服务器进行维护\n                        ")])]),i("div",{staticClass:"message-item",on:{click:t.goMessage}},[i("div",{staticClass:"message-item_inner"},[i("b",[t._v("[公告]")]),t._v(" 北京时间2点服务器进行维护北京时间2点服务器进行维护北京时间2点服务器进行维护北京时间2点服务器进行维护\n                        ")])]),i("div",{staticClass:"message-item",on:{click:t.goMessage}},[i("div",{staticClass:"message-item_inner"},[i("b",[t._v("[公告]")]),t._v(" 北京时间2点服务器进行维护北京时间2点服务器进行维护北京时间2点服务器进行维护北京时间2点服务器进行维护\n                        ")])])]),i("div",{staticClass:"message-more",on:{click:t.goMessage}},[t._v("查看全部")])]):t._e()])],1),i("router-link",{staticClass:"icon-btn setting-btn",attrs:{to:{name:"settings"}}},[i("i",{staticClass:"iconfont setting-icon"},[t._v("")])]),i("div",{staticClass:"icon-btn logout-btn",on:{click:t.logout}},[i("i",{staticClass:"iconfont setting-icon"},[t._v("")])]),i("lang"),t.sendVisible?i("send",{attrs:{visible:t.sendVisible},on:{"update:visible":function(e){t.sendVisible=e}}}):t._e()],1)},s=[],o=n("cebc"),c=n("c9d9"),u=n("e67d"),l=n.n(u),f=n("42ba"),d=n("2f62"),h=n("21aa"),p={data:function(){return{messageVisible:!1,sendVisible:!1}},components:{Lang:c["a"],Send:f["a"]},computed:Object(o["a"])({},Object(d["b"])({balance:function(t){return t.account.balance}})),directives:{ClickOutside:l.a},methods:{hideMessage:function(){this.messageVisible=!1},goMessage:function(){this.messageVisible=!1,this.$router.push({name:"message"})},logout:function(){Object(h["a"])(this.$store),this.$router.push({path:"/"})}}},v=p,g=(n("2e2e"),n("2877")),m=Object(g["a"])(v,a,s,!1,null,"7febb3fa",null);m.options.__file="MainHeader.vue";var b=m.exports,y=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"side-bar-comp"},[i("router-link",{staticClass:"comp-item",class:{active:"dashboard"==t.name},attrs:{to:{name:"dashboard"}}},[i("img",{staticClass:"comp-item_hd",attrs:{src:n("56f2")}}),i("div",{staticClass:"comp-item_ft"},[t._v(t._s(t.$t("Dashboard")))])]),i("div",{staticClass:"comp-line"},[t._v("\n        "+t._s(t.$t("CoreData"))+"\n    ")]),i("router-link",{staticClass:"comp-item",attrs:{to:{name:"account"}}},[i("img",{staticClass:"comp-item_hd",attrs:{src:n("ed5b")}}),i("div",{staticClass:"comp-item_ft"},[t._v(t._s(t.$t("Account")))])]),i("router-link",{staticClass:"comp-item",attrs:{to:{name:"contact"}}},[i("img",{staticClass:"comp-item_hd",attrs:{src:n("da4b")}}),i("div",{staticClass:"comp-item_ft"},[t._v(t._s(t.$t("Contact")))])]),i("router-link",{staticClass:"comp-item",attrs:{to:{name:"explorer"}}},[i("img",{staticClass:"comp-item_hd",attrs:{src:n("0364")}}),i("div",{staticClass:"comp-item_ft"},[t._v(t._s(t.$t("Explorer")))])]),i("router-link",{staticClass:"comp-item",staticStyle:{display:"none"},attrs:{to:{name:"assets"}}},[i("img",{staticClass:"comp-item_hd",attrs:{src:n("5760")}}),i("div",{staticClass:"comp-item_ft"},[t._v("资产")])]),i("router-link",{staticClass:"comp-item",attrs:{to:{name:"dapp"}}},[i("img",{staticClass:"comp-item_hd",attrs:{src:n("5760")}}),i("div",{staticClass:"comp-item_ft"},[t._v("Dapp")])]),i("div",{staticClass:"network-sec"},[i("div",{staticClass:"get-btn"},[i("x-btn",{attrs:{type:"primary"},on:{click:t.facut}},[t._v(t._s(t.$t("GetTestCoins")))])],1),i("div",{staticClass:"sec-title"},[t._v("TEST NET "+t._s(t.$t("Synchronizationstatus")))]),i("div",{staticClass:"sec-desc"},[t._v(t._s(t.$t("Synchronizing"))+": "+t._s(t.height)+"/"+t._s(t.peerHeight))]),i("div",{staticClass:"sec-desc"},[t._v(t._s(t.$t("Connections"))+": "+t._s(t.peerCount))])])],1)},x=[],_=(n("96cf"),n("3b8d")),C=(n("7f7f"),n("781f")),w=n("be58"),A=n("bc3a"),E=n.n(A),k=n("e141"),L=n("14ac"),O={data:function(){return{height:"-",peerHeight:"-",peerCount:"-"}},props:{name:String},components:{XBtn:w["a"]},computed:Object(o["a"])({},Object(d["b"])({account:function(t){return t.account},key:function(t){return t.key}})),created:function(){var t=this;C["a"].add(function(e){var n=e.mod,i=e.name,r=e.data;"kernel"==n&&"status"==i&&(t.height=r.height,t.peerHeight=r.peerHeight,t.peerCount=r.peerCount)})},methods:{facut:function(){var t=Object(_["a"])(regeneratorRuntime.mark(function t(){var e;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,E.a.get(L["a"].facutIp+this.account.address[0]);case 2:e=t.sent,200==e.data.code?k["a"].success(this.$t("TransferSuccess")+e.data.result.transactionHash):k["a"].error(e.data.error);case 4:case"end":return t.stop()}},t,this)}));function e(){return t.apply(this,arguments)}return e}()}},j=O,S=(n("224b"),Object(g["a"])(j,y,x,!1,null,"30e351fc",null));S.options.__file="SideBar.vue";var N=S.exports,R={components:{MainHeader:b,SideBar:N},created:function(){},watch:{}},Q=R,V=(n("86e9"),Object(g["a"])(Q,i,r,!1,null,"21022815",null));V.options.__file="Main.vue";e["default"]=V.exports},d2be:function(t,e,n){},da4b:function(t,e,n){t.exports=n.p+"img/contact@3x.de349921.png"},e67d:function(t,e){function n(t){return"function"===typeof t.value||(console.warn("[Vue-click-outside:] provided expression",t.expression,"is not a function."),!1)}function i(t,e){if(!t||!e)return!1;for(var n=0,i=e.length;n<i;n++)try{if(t.contains(e[n]))return!0;if(e[n].contains(t))return!1}catch(r){return!1}return!1}function r(t){return"undefined"!==typeof t.componentInstance&&t.componentInstance.$isServer}t.exports={bind:function(t,e,a){function s(e){if(a.context){var n=e.path||e.composedPath&&e.composedPath();n&&n.length>0&&n.unshift(e.target),t.contains(e.target)||i(a.context.popupItem,n)||t.__vueClickOutside__.callback(e)}}n(e)&&(t.__vueClickOutside__={handler:s,callback:e.value},!r(a)&&document.addEventListener("click",s))},update:function(t,e){n(e)&&(t.__vueClickOutside__.callback=e.value)},unbind:function(t,e,n){!r(n)&&document.removeEventListener("click",t.__vueClickOutside__.handler),delete t.__vueClickOutside__}}},ed5b:function(t,e,n){t.exports=n.p+"img/account@3x.258bfdac.png"}}]);
//# sourceMappingURL=chunk-ce1d4f58.08fd4bb3.js.map