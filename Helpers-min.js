Helpers=initHelpers(window,document);
function initHelpers(m,h,z){function r(a){(t=a)?h.querySelector("#HelperCSS")||(a=k("link",{href:"http://kooiinc.github.io/JSHelpers/Helpers.css",type:"text/css",rel:"stylesheet",id:"HelperCSS"}),h.querySelector("head").appendChild(a)):(a=document.querySelector("#HelperCSS"))&&document.querySelector("head").removeChild(a)}function u(a){if(m.jQuery)return a&&Object.ofType(a,Function)?a():!0;var c=k("script",{src:"//code.jquery.com/jquery-2.1.1.min.js",id:"jqloaded"});h.querySelector("head").appendChild(c);
a&&l(a,Function)&&c.addEventListener("load",a)}function v(){function a(){var b=e(arguments);return this.replace(/(\{\d+\})/g,function(d){return b[+d.substr(1,d.length-2)||0]})}function c(b){var d={sum:0};(b||this).map(function(b){this[b]=b in this?this[b]+1:1;this.sum+=1;return b},d);return d}if(w)return!0;String.Format=function(){var b=e(arguments);return a.apply(b[0],b.slice(1))};String.prototype.format=function(){return a.apply(this,arguments)};String.prototype.repeat=function(b){for(var d="";b--;)d+=
this;return d};Boolean.prototype.yn=function(){return 0==this?"no":"yes"};Number.prototype.toRange=Number.prototype.toRange||function(b,d){d=d||0;b=l(b,Function)?b:function(b,a){return a+d};return String(Array(this.valueOf())).split(",").map(b)};Number.prototype.pretty=Number.prototype.pretty||function(b,d){return A(this,b,d)};Function.prototype.andThen=function(){var b=e(arguments),d=b.slice(1);this();return b[0]&&d.length?b[0].andThen.apply(b[0],d):1==b.length?b[0]():!0};Function.prototype.partial=
Function.prototype.partial||function(){var b=[].slice.call(arguments),d=this;return function(){return d.apply(null,b.concat([].slice.call(arguments)))}};Function.prototype.partialx=function(){var b=this,d=Array.prototype.slice.call(arguments);return function(){for(var a=0,c=0;c<d.length&&a<arguments.length;c++)if(d[c]===z||null===d[c])d[c]=arguments[a++];return b.apply(this,d)}};String.prototype.charIsUpper=function(b){b=this.charAt(b);return/[A-Z]|[\u0080-\u024F]/.test(b)&&b===b.toUpperCase()};String.prototype.firstUp=
function(){return this.slice(0,1).toUpperCase()+this.slice(1).toLowerCase()};String.prototype.isValidEmail=function(){return/^[\w._-]{1,}[+]?[\w._-]{0,}@[\w.-]+\.[a-zA-Z]{2,6}$/.test(this)};Array.prototype.toRE=function(){try{return RegExp.apply(null,this)}catch(b){return/.*/}};Array.toRE=function(b){return[].toRE.call(b)};Array.prototype.toCheckboxValues=Array.prototype.toCheckboxValues||function(b){b=b||[];var d=[];this.map(function(a,c){d.push({check:-1<b.indexOf(c)?1:0,val:String(a)})},d);return d};
String.prototype.reCleanup=function(b){return(b?this.replace(/[\u0080-\u024F]/g,function(b){return"&#"+b.charCodeAt(0)+";"}):this).replace(/[?*|.+$\/]|\\/g,function(b){return"\\"===b?"":"\\\\"+b})};String.concat=function(b){b=b||"";return e(arguments).join(b)};Array.prototype.filter||(Array.prototype.filter=function(b){if(void 0===this||null===this)throw new TypeError;var a=Object(this),c=a.length>>>0;if(!l(b,Function))throw new TypeError;for(var n=[],B=2<=arguments.length?arguments[1]:void 0,g=0;g<
c;g++)if(g in a){var e=a[g];b.call(B,e,g,a)&&n.push(e)}return n});Array.prototype.map||(Array.prototype.map=function(b){if(void 0===this||null===this)throw new TypeError;var a=Object(this),c=a.length>>>0;if(!l(b,Function))throw new TypeError;for(var n=Array(c),e=2<=arguments.length?arguments[1]:void 0,g=0;g<c;g++)g in a&&(n[g]=b.call(e,a[g],g,a));return n});Array.prototype.uniquify=function(b){return(b||this).filter(function(b){return this[b]?!1:(this[b]=!0,!0)},{})};Array.prototype.frequencies=Array.prototype.frequencies||
c;Array.prototype.each=Array.prototype.each||function(b,a){for(var c=0;c<this.length;c++)a?this[c]=b(this[c]):b(this[c]);return this};Object.extend=function(b,a){for(var c in a)a.hasOwnProperty(c)&&(b[c]=a[c]);return b};Object.print=function(b,a){return'<pre class="code">'+JSON.stringify(b,null,a||"  ")+"</pre>"};Object.format=function(b,a){return'<div class="objformat">'+JSON.stringify(b,null,a||"  ")+"</div>"};Object.ofType=l;return w=!0}function x(){var a=h.querySelector("[data-linkid]");a&&!a.querySelector(".linkhover")&&
a.appendChild(k("div",{className:"linkhover","data-dyn":"true"}));u(function(){$("#helperload").fadeOut(900);$(document).on("mouseover",".solink",C);$(document).on("click","[data-link]",D)})}function C(a){if($(this).attr("data-link"))return!0;$.ajax({url:"http://www.nicon.nl/node/stackx/questionx",data:{qid:$(".solink").first().attr("data-linkid")},method:"post",success:function(a){a=a.items&&a.items[0]||a;var b=$(".solink").first();b.find(".linkhover").first().html("<p>Click logo to view the related question:<p><h3>"+
a.title+'</h3>Asked by <img class="profileimg" src="'+a.owner.profile_image+'"> <div data-link="'+a.owner.link+'">'+a.owner.display_name+"</div>; rep "+a.owner.reputation+"; question views: "+a.view_count);b.attr("data-link",a.link)}});return!0}function D(a){a.stopPropagation();a=this.getAttribute("data-link");var c;(c=document.querySelector('a[href="'+a+'"]'))||(a=k("a",{href:a,target:"_blank",style:{display:"none"}}),document.body.appendChild(a),c=a);c.click()}function y(){var a=document.querySelector("#result")||
function(){var b=k("div",{id:"result"});document.body.appendChild(b);return b}(),c=e(arguments),b=c.slice(-1)[0],d=/clear|clrscr|direct|opts|useopts|continuous/i,b=Object.ofType(b,Object)&&Object.keys(b).filter(function(b){return d.test(b)}).length?b.opts instanceof Object?b.opts:b:{empty:1};!b.empty&&(c=c.slice(0,-1));if(b.clrscr)return a.innerHTML="";b.clear&&(a.innerHTML="");if(b.continuous)return a.innerHTML+=c.join("").replace(/\n/g,"<br>");var f=k("p");f.innerHTML=c.join("").replace(/\n/g,"<br>").replace(/`([^`]*)`/g,
function(b,a,c){return"<code>"+a+"</code>"});a.appendChild(f);return b.direct?f.className="show":setTimeout(function(){f.className="show"},1E3*+b.timed||0)}function k(a,c){var b=h.createElement(a);if(c&&l(c,Object))for(var d in c)if(c.hasOwnProperty(d))if(/style/i.test(d))for(var f in c[d])c[d].hasOwnProperty(f)&&(b.style[f]=c[d][f]);else b[d]=c[d];return b}function e(a,c){for(var b=[];b.length<a.length;)b.push(a[b.length]);return c?b.slice(c):b}function l(a){if(!a)return!1;var c=arguments.length?
e(arguments).slice(1):null,b=a.constructor;return c?!!c.filter(function(a){return a===b}).length:b.constructor.name||(String(b).match(/^function\s*([^\s(]+)/im)||[0,"ANONYMOUS_CONSTRUCTOR"])[1]}function p(a){this.initial=e(arguments,1);this.funcp=function(){return a.partialx.apply(a,this.initial)};p.prototype.x||(p.prototype.x=function(){return this.funcp().apply(null,e(arguments))})}function q(a){function c(b,a){for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c]instanceof Object?q(b[c]):b[c]);return a}
return a instanceof Array?a.slice().map(function(b){return q(b)}):a instanceof Date?new Date(a):a instanceof Object?c(a,{}):a}function A(a,c,b){function d(b,a){return String(b.toFixed(12)).split(/[.,]/)[1].substr(0,a)}var f=(""+a).split(/[.,]/),e=f[1]?f[1].length:0;a=e&&!b?d(a,e):f[1];b=c?".":",";return function(b,a){for(var c=String(b).split(""),d=-3;0<c.length+d;)c.splice(d,0,a),d-=4;return c.join("")}(f[0],c?",":".")+(f[1]?b+a:"")}var t=!1,w=v(),E={report:function(){var a=document.querySelector("#result")||
function(){var b=k("div",{id:"result"});document.querySelector("body").appendChild(b);return b}(),c=k("p");c.innerHTML=e(arguments).join("");a.appendChild(c);t&&setTimeout(function(){c.className="show"},100)},useJQ:u,useCSS:r,log2Screen:y,initSO:x,printDirect:function(){return y.apply(null,e(arguments).concat({direct:!0}))},logClear:function(){var a=h.querySelector("#result");return a&&(a.innerHTML=""),!0},Partial:p,cloneObj:q,randomID:function(){return"_"+Math.floor(1E4+1E7*Math.random()).toString(16)},
extendDate:function(a){a=a||"NL";Date.prototype.add||function(){function c(b){for(var a=b.length,c={byArr:b};--a;)c[b[a]]=a;return c}function b(){this.cd=this.getDate();this.cm=this.getMonth()+1;this.cy=this.getFullYear();this.ch=this.getHours()||Number(0);this.cmin=this.getMinutes()||Number(0);this.cs=this.getSeconds()||Number(0);this.cms=this.getMilliseconds()||Number(0);this.dow=this.getDay()||Number(0)}function d(b,a,c){if(+b)return this.setSeconds(this.getSeconds()+ +b);a=a&&"UTC"||"";for(var d in b){var e=
d,g=+b[d],e=e&&e.slice(0,1).toUpperCase()+e.slice(1).toLowerCase()||"",e=/Fullyear/.test(e)&&"FullYear"||e;this["set"+a+e]&&this["set"+a+e](this["get"+a+e]()+g)}return c?new Date(this):this}function e(a){a=a||this;a.cy||b.call(a);var c=a.getLang()||"EN";a={yyyy:a.cy,m:a.cm,d:a.cd,h:a.ch,min:a.cmin,s:a.cs,ms:a.cms,dow:a.dow};var c={mm:a.m.padLeft(),dd:a.d.padLeft(),hh:a.h.padLeft(),mi:a.min.padLeft(),ss:a.s.padLeft(),mss:a.ms.padLeft(3),M:p[c].byArr[a.m-1],MM:l[c].byArr[a.m-1],wd:m[c].byArr[a.dow],
WD:g[c].byArr[a.dow],WDU:g[c].byArr[a.dow].firstUp()},d=[],f;for(f in c)c.hasOwnProperty(f)&&(a[f]=c[f]);for(f in a)a.hasOwnProperty(f)&&d.push("(\\b"+f+"\\b)");a.re=new RegExp(d.join("|"),"g");return a}function k(a){var b=this+"";return(Math.pow(10,(a||2)-b.length)+b).slice(1)}var h={d:"Date",m:"Month",y:"FullYear",h:"Hours",mi:"Minutes",s:"Seconds",ms:"MilliSeconds",get:function(a,b){return b&&"get"+this[a]||"set"+this[a]}},g={NL:c("zondag maandag dinsdag woensdag donderdag vrijdag zaterdag".split(" ")),
EN:c("sunday monday tuesday wednesday thursday friday saturday".split(" "))},l={NL:c("januari februari maart april mei juni juli augustus september oktober november december".split(" ")),EN:c("january february march april may june july august september october november december".split(" "))},m={NL:c("zo ma di wo do vr za".split(" ")),EN:c("su mo tu we th fr sa".split(" "))},p={NL:c("jan feb mrt apr mei jun jul aug sep okt nov dec".split(" ")),EN:c("jan feb mrch apr may jun jul aug sep okt nov dec".split(" "))};
Number.prototype.padLeft=Number.prototype.padLeft||k;Date.prototype.language=a.toUpperCase();Date.prototype.setFormat=function(a){this.strformat=a;return this};Date.prototype.changeLanguage=function(a){this.language=/^[EN][NL]$/i.test(a)&&a.toUpperCase()||"NL";this.constructor.prototype.language=this.language;return this};Date.prototype.set=function(a,c){c=Number(c);c-="m"===a&&1||0;a=h.get(a);this[a](c);b.call(this);return this};Date.prototype.add=function(a,c,e,f){if(a instanceof Object)return d.apply(this,
[a,e,f]);c=Number(c)||1;e=h.get(a);a=h.get(a,1);this[e](this[a]()+c);b.call(this);return f?new Date(this):this};Date.prototype.format=function(a){a=a||this.strformat||"yyyy/mm/dd hh:mi:ss";var b=e.call(this);return a.replace(b.re,function(a){return b[a]}).replace(/~/g,"")};Date.prototype.getLang=function(){return Date.prototype.language}}()}};/fiddle|stacksnippets/i.test(self.location.href)&&(v(),r(!0),m.addEventListener("load",function(){h.body.insertBefore(k("div",{id:"helperload"}),h.body.firstChild)}),
m.addEventListener("load",x));return E};