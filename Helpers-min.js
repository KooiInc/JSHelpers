Helpers=initHelpers(window,document);
function initHelpers(l,h,x){function p(a){(q=a)?h.querySelector("#HelperCSS")||(a=g("link",{href:"//kooiinc.github.io/JSHelpers/Helpers.css",type:"text/css",rel:"stylesheet",id:"HelperCSS"}),h.querySelector("head").appendChild(a)):(a=document.querySelector("#HelperCSS"))&&document.querySelector("head").removeChild(a)}function r(a){if(l.jQuery)return a&&Object.ofType(a,Function)?a():!0;var b=g("script",{src:"//code.jquery.com/jquery-2.1.1.min.js",id:"jqloaded"});h.querySelector("head").appendChild(b);
a&&Object.isOfType(a,Function)&&b.addEventListener("load",a)}function t(){if(u)return!0;Function.args2Arr=function(a){return Array.apply([],{length:a.length}).map(function(a,c){return this[c]},a)};Function.prototype.andThen=function(){var a=Function.args2Arr(arguments),b=a.slice(1);this();return a[0]&&b.length?a[0].andThen.apply(a[0],b):1==a.length?a[0]():!0};Function.prototype.partial=Function.prototype.partial||function(){var a=[].slice.call(arguments),b=this;return function(){return b.apply(null,
a.concat([].slice.call(arguments)))}};Function.prototype.partialx=function(){var a=this,b=Array.prototype.slice.call(arguments);return function(){for(var c=0,d=0;d<b.length&&c<arguments.length;d++)if(b[d]===x||null===b[d])b[d]=arguments[c++];return a.apply(this,b)}};Boolean.prototype.yn=function(){return 0==this?"no":"yes"};Number.prototype.toRange=Number.prototype.toRange||function(a,b){b=b||0;a=Object.isOfType(a,Function)?a:function(a,d){return d+b};return String(Array(this.valueOf())).split(",").map(a)};
Number.prototype.pretty=function(a,b){function c(a,b){return String(a.toFixed(12)).split(/[.,]/)[1].substr(0,b)}var d=(""+this).split(/[.,]/),e=d[1]?d[1].length:0,e=e&&!b?c(this,e):d[1],f=a?".":",";return function(a,b){for(var c=String(a).split(""),d=-3;0<c.length+d;)c.splice(d,0,b),d-=4;return c.join("")}(d[0],a?",":".")+(d[1]?f+e:"")};Number.prototype.padLeft=function(a,b){var c=this+"";return Math.pow(10,(a||2)-c.length).toString().replace(/0/g,b||"0").slice(1)+c};String.Format=function(){var a=
Function.args2Arr(arguments);return"".format.apply(a[0],a.slice(1))};String.prototype.format=function(){for(var a=arguments,b=this.length,c=0,d="",e;c<b;){if("{"!==this[c]||isNaN(parseInt(this[c+1],10)))d+=this[c];else{c+=1;e="";for(var f=!0;"}"!==this[c];){if(isNaN(parseInt(this[c],10))){f=!1;break}e+=this[c];c+=1}d+=f&&a[+e]||"{"+e+(this[c]||"")}c+=1}return d};String.prototype.repeat=function(a){for(var b="";a--;)b+=this;return b};String.prototype.charIsUpper=function(a){a=this.charAt(a);return/[A-Z]|[\u0080-\u024F]/.test(a)&&
a===a.toUpperCase()};String.prototype.firstUp=function(){return this.slice(0,1).toUpperCase()+this.slice(1).toLowerCase()};String.prototype.isValidEmail=function(){return/^[\w._-]{1,}[+]?[\w._-]{0,}@[\w.-]+\.[a-zA-Z]{2,6}$/.test(this)};String.prototype.reCleanup=function(a){return(a?this.replace(/[\u0080-\u024F]/g,function(a){return"&#"+a.charCodeAt(0)+";"}):this).replace(/[?*|.+$\/]|\\/g,function(a){return"\\"===a?"":"\\\\"+a})};String.joinStrings=function(a){joinchar=joinchar||"";return Function.args2Arr(arguments).slice(1).join(a)};
Array.prototype.toRE=function(){try{return RegExp.apply(null,this)}catch(a){return/.*/}};Array.toRE=function(a){return[].toRE.call(a)};Array.prototype.toCheckboxValues=Array.prototype.toCheckboxValues||function(a){a=a||[];var b=[];this.map(function(c,d){b.push({check:-1<a.indexOf(d)?1:0,val:String(c)})},b);return b};Array.prototype.filter||(Array.prototype.filter=function(a){if(void 0===this||null===this)throw new TypeError;var b=Object(this),c=b.length>>>0;if(!Object.isOfType(a,Function))throw new TypeError;
for(var d=[],e=2<=arguments.length?arguments[1]:void 0,f=0;f<c;f++)if(f in b){var g=b[f];a.call(e,g,f,b)&&d.push(g)}return d});Array.prototype.uniquify=function(a){return(a||this).filter(function(a){return this[a]?!1:(this[a]=!0,!0)},{})};Array.prototype.map||(Array.prototype.map=function(a){if(void 0===this||null===this)throw new TypeError;var b=Object(this),c=b.length>>>0;if(!Object.isOfType(a,Function))throw new TypeError;for(var d=Array(c),e=2<=arguments.length?arguments[1]:void 0,f=0;f<c;f++)f in
b&&(d[f]=a.call(e,b[f],f,b));return d});Array.prototype.frequencies=function(a){var b={sum:0};(a||this||this).map(function(a){this[a]=a in this?this[a]+1:1;this.sum+=1;return a},b);return b};Array.prototype.each=Array.prototype.each||function(a,b){for(var c=0;c<this.length;c++)b?this[c]=a(this[c]):a(this[c]);return this};Object.extend=function(a,b){for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c]);return a};Object.print=function(a,b){return'<pre class="code">'+JSON.stringify(a,null,b||"  ")+"</pre>"};
Object.format=function(a,b){return'<div class="objformat">'+JSON.stringify(a,null,b||"  ")+"</div>"};Object.isOfType=function(a){if(!a)return!1;var b=1<arguments.length?Function.args2Arr(arguments).slice(1):[],c=a.constructor;return b.length?!!b.filter(function(a){return a===c}).length:c.name||(String(c).match(/^function\s*([^\s(]+)/im)||[0,"ANONYMOUS_CONSTRUCTOR"])[1]};Object.ofType=Object.isOfType;return u=!0}function v(){var a=h.querySelector("[data-linkid]");a&&!a.querySelector(".linkhover")&&
a.appendChild(g("div",{className:"linkhover waiting","data-dyn":"true"}));r(function(){$(".linkhover").removeClass("waiting");$("#helperload").fadeOut(900);$(document).on("mouseover",".solink",y);$(document).on("click","[data-link]",z)})}function y(a){if($(this).attr("data-link"))return!0;$.ajax({url:"//www.nicon.nl/node/stackx/questionx",data:{qid:$(".solink").first().attr("data-linkid")},method:"post",success:function(a){a=a.items&&a.items[0]||a;var b=$(".solink").first();b.find(".linkhover").first().html("<p>Click logo to view the related question:<p><h3>"+
a.title+'</h3>Asked by <img class="profileimg" src="'+a.owner.profile_image+'"> <div data-link="'+a.owner.link+'">'+a.owner.display_name+"</div>; rep "+a.owner.reputation+"; question views: "+a.view_count);b.attr("data-link",a.link)}});return!0}function z(a){a.stopPropagation();a=this.getAttribute("data-link");var b;(b=document.querySelector('a[href="'+a+'"]'))||(a=g("a",{href:a,target:"_blank",style:{display:"none"}}),document.body.appendChild(a),b=a);b.click()}function w(){var a=document.querySelector("#result")||
function(){var a=g("div",{id:"result"});document.body.appendChild(a);return a}(),b=Function.args2Arr(arguments),c=b.slice(-1)[0],d=/clear|clrscr|direct|opts|useopts|continuous/i,c=Object.isOfType(c,Object)&&Object.keys(c).filter(function(a){return d.test(a)}).length?c.opts instanceof Object?c.opts:c:{empty:1};!c.empty&&(b=b.slice(0,-1));if(c.clrscr)return a.innerHTML="";c.clear&&(a.innerHTML="");if(c.continuous)return a.innerHTML+=b.join("").replace(/\n/g,"<br>");var e=g("p");e.innerHTML=b.join("").replace(/\n/g,
"<br>").replace(/`([^`]*)`/g,function(a,b,c){return"<code>"+b+"</code>"});a.appendChild(e);return c.direct?e.className="show":setTimeout(function(){e.className="show"},1E3*+c.timed||0)}function g(a,b){var c=h.createElement(a);if(b&&Object.isOfType(b,Object))for(var d in b)if(b.hasOwnProperty(d))if(/style/i.test(d))for(var e in b[d])b[d].hasOwnProperty(e)&&(c.style[e]=b[d][e]);else c[d]=b[d];return c}function m(a){this.initial=Function.args2Arr(arguments,1);this.funcp=function(){return a.partialx.apply(a,
this.initial)};m.prototype.x||(m.prototype.x=function(){return this.funcp().apply(null,Function.args2Arr(arguments))})}function n(a){function b(a,b){for(var c in a)a.hasOwnProperty(c)&&(b[c]=a[c]instanceof Object?n(a[c]):a[c]);return b}return a instanceof Array?a.slice().map(function(a){return n(a)}):a instanceof Date?new Date(a):a instanceof Object?b(a,{}):a}var q=!1,u=t(),B={report:function(){var a=document.querySelector("#result")||function(){var a=g("div",{id:"result"});document.querySelector("body").appendChild(a);
return a}(),b=g("p");b.innerHTML=Function.args2Arr(arguments).join("");a.appendChild(b);q&&setTimeout(function(){b.className="show"},100)},useJQ:r,useCSS:p,log2Screen:w,initSO:v,printDirect:function(){return w.apply(null,Function.args2Arr(arguments).concat({direct:!0}))},logClear:function(){var a=h.querySelector("#result");return a&&(a.innerHTML=""),!0},Partial:m,cloneObj:n,randomID:function(){return"_"+Math.floor(1E4+1E7*Math.random()).toString(16)},extendDate:function(a){a=a||"NL";Date.prototype.add||
function(){function b(a){for(var b=a.length,c={byArr:a};--b;)c[a[b]]=b;return c}function c(){this.cd=this.getDate();this.cm=this.getMonth()+1;this.cy=this.getFullYear();this.ch=this.getHours()||Number(0);this.cmin=this.getMinutes()||Number(0);this.cs=this.getSeconds()||Number(0);this.cms=this.getMilliseconds()||Number(0);this.dow=this.getDay()||Number(0)}function d(a,b,c){if(+a)return this.setSeconds(this.getSeconds()+ +a);b=b&&"UTC"||"";for(var k in a){var d=k,A=+a[k],d=d&&d.slice(0,1).toUpperCase()+
d.slice(1).toLowerCase()||"",d=/Fullyear/.test(d)&&"FullYear"||d;this["set"+b+d]&&this["set"+b+d](this["get"+b+d]()+A)}return c?new Date(this):this}function e(a){a=a||this;a.cy||c.call(a);var b=a.getLang()||"EN";a={yyyy:a.cy,m:a.cm,d:a.cd,h:a.ch,min:a.cmin,s:a.cs,ms:a.cms,dow:a.dow};var b={mm:a.m.padLeft(),dd:a.d.padLeft(),hh:a.h.padLeft(),mi:a.min.padLeft(),ss:a.s.padLeft(),mss:a.ms.padLeft(3),M:m[b].byArr[a.m-1],MM:h[b].byArr[a.m-1],wd:l[b].byArr[a.dow],WD:g[b].byArr[a.dow],WDU:g[b].byArr[a.dow].firstUp()},
d=[],k;for(k in b)b.hasOwnProperty(k)&&(a[k]=b[k]);for(k in a)a.hasOwnProperty(k)&&d.push("(\\b"+k+"\\b)");a.re=new RegExp(d.join("|"),"g");return a}var f={d:"Date",m:"Month",y:"FullYear",h:"Hours",mi:"Minutes",s:"Seconds",ms:"MilliSeconds",get:function(a,b){return b&&"get"+this[a]||"set"+this[a]}},g={NL:b("zondag maandag dinsdag woensdag donderdag vrijdag zaterdag".split(" ")),EN:b("sunday monday tuesday wednesday thursday friday saturday".split(" "))},h={NL:b("januari februari maart april mei juni juli augustus september oktober november december".split(" ")),
EN:b("january february march april may june july august september october november december".split(" "))},l={NL:b("zo ma di wo do vr za".split(" ")),EN:b("su mo tu we th fr sa".split(" "))},m={NL:b("jan feb mrt apr mei jun jul aug sep okt nov dec".split(" ")),EN:b("jan feb mrch apr may jun jul aug sep okt nov dec".split(" "))};Number.prototype.padLeft=Number.prototype.padLeft||function(a,b){var c=this+"";return Math.pow(10,(a||2)-c.length).toString().replace(/0/g,b||"0").slice(1)+c};Date.prototype.language=
a.toUpperCase();Date.prototype.setFormat=function(a){this.strformat=a;return this};Date.prototype.changeLanguage=function(a){this.language=/^[EN][NL]$/i.test(a)&&a.toUpperCase()||"NL";this.constructor.prototype.language=this.language;return this};Date.prototype.set=function(a,b){b=Number(b);b-="m"===a&&1||0;a=f.get(a);this[a](b);c.call(this);return this};Date.prototype.add=function(a,b,e,g){if(a instanceof Object)return d.apply(this,[a,e,g]);b=Number(b)||1;e=f.get(a);a=f.get(a,1);this[e](this[a]()+
b);c.call(this);return g?new Date(this):this};Date.prototype.format=function(a){a=a||this.strformat||"yyyy/mm/dd hh:mi:ss";var b=e.call(this);return a.replace(b.re,function(a){return b[a]}).replace(/~/g,"")};Date.prototype.getLang=function(){return Date.prototype.language}}()}};/fiddle|stacksnippets/i.test(self.location.href)&&(t(),p(!0),l.addEventListener("load",function(){h.body.insertBefore(g("div",{id:"helperload"}),h.body.firstChild)}),l.addEventListener("load",v));return B}
