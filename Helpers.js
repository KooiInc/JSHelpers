 "use strict";
var Helpers = (function() {
  return {
    report: reportHTML,
    isObj: isPlainObject,
    useJQ: loadJQ,
    augment: extensions
  };

  function reportHTML() {
    var report = document.querySelector('#result') ||
        function() {
          var r = document.createElement('div');
          r.id = 'result';
          document.querySelector('body').appendChild(r);
          return r;
      }();
    report.innerHTML += '<p>' + [].slice.call(arguments).join() + '</p>';
  }
  
  function isPlainObject(item) {
    return (
        item &&
        typeof item === "object" &&
        Object.prototype.toString.call(item) === "object Object" &&
        !item.nodeType
    );
  }

  function loadJQ(cb) {
      if (w.jQuery) {
        return function () {return void( cb && cb());}
      }
      return function () {
        var head  = d.querySelector('head')
           ,jq    = d.createElement('script');
        void( cb && jq.addEventListener('load',cb) );
        jq.src    = '//code.jquery.com/jquery-2.1.1.min.js';
        return head.appendChild(jq);
      };
  }

   // a few usefull augments/polyfills
  function extensions() {
        // remove double values from an array  
        function noDoubles(arr) {
          arr = arr || this;
          return arr.filter(function(val) {
           return !this[val] ? ((this[val] = true), true) : false;
          }, {});
        }
  
        function args2Array(args){
          var arr = [];
          for (var i=0;i<args.length;i+=1) {
            arr.push(args[i]);
          }
          return arr;
        }
  
        function stringformat() {
                var args = args2Array(arguments);
                return this.replace(/(\{\d+\})/g, function(a){
                    return args[+(a.substr(1,a.length-2))||0];
                });
        };
  
        // determine value frequencies in an array
        function frequencies(arr) {
          var mapped = {sum: 0};
          (arr || this).map(function (a){
              if (!(a in this)) { this[a] = 1; }
              else { this[a] += 1; }
              this.sum += 1;
              return a; }, mapped
          );
          return mapped;
        }
  
        String.Format = function(){
            var args = [].slice.call(arguments);
            return stringformat.apply(args[0],args.slice(1));
        };
  
        String.prototype.format = function () {
          return stringformat.apply(this,arguments);
        }
  
        String.prototype.repeat = function(n){
            var s = this, r = '';
            while(n--) {
                r += s;
            }
            return r;
        };
  
        // run functions sequentially
        Function.prototype.andThen = function () {
         var args = [].slice.call(arguments)
            ,next = args.slice(1);
         this();
         return args[0] && next.length
                 ? args[0].andThen.apply(args[0], next)
                 : args.length == 1  ? args[0]()
                 : true;
        };
  
        // is character @ [atpos] upperCase?
        boolean:String.prototype.charIsUpper = function (atpos){
          var chr = this.charAt(atpos);
          return /[A-Z]|[\u0080-\u024F]/.test(chr) && chr === chr.toUpperCase();
        };
  
        String.prototype.firstUp = function () {
          return this.slice(0,1).toUpperCase()+this.slice(1).toLowerCase();
        }
  
        String.prototype.isValidEmail = function() {
          // should be sufficient
          return  /^[\w._-]{1,}[+]?[\w._-]{0,}@[\w.-]+\.[a-zA-Z]{2,6}$/.test(this);
        }
  
        Array.prototype.toRE = function (){
          try { return RegExp.apply(null, this); }
          catch(e) { return /.*/; }
        }
  
        Array.toRE = function(arr) {
          return ([].toRE.call(arr));
        }
  
        String.prototype.reCleanup = function(encodeHTML){
          var str = encodeHTML ? this.replace(/[\u0080-\u024F]/g, function(a) {return '&#'+a.charCodeAt(0)+';';}) : this;
          return str.replace(/[?*|.+$\/]|\\/g, function(c) {return c==='\\' ? '' : '\\\\'+c;});
        }
  
        String.concat = function(joinchar){
          joinchar = joinchar || '';
          return [].slice.call(arguments).join(joinchar);
        }
  
        // MDN Array filter polyfill
        if (!Array.prototype.filter) {
          Array.prototype.filter = function(fun)
          {
            if (this === void 0 || this === null)
              throw new TypeError();
  
            var t = Object(this);
            var len = t.length >>> 0;
            if (typeof fun != "function")
              throw new TypeError();
  
            var res = [];
            var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
            for (var i = 0; i < len; i++) {
              if (i in t)  {
                var val = t[i];
                if (fun.call(thisArg, val, i, t))
                  res.push(val);
              }
            }
  
            return res;
          };
        }
  
        // MDN Array map polyfill
        if (!Array.prototype.map) {
          Array.prototype.map = function(fun)
          {
            if (this === void 0 || this === null)
              throw new TypeError();
  
            var t = Object(this);
            var len = t.length >>> 0;
            if (typeof fun !== "function")
              throw new TypeError();
  
            var res = new Array(len);
            var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
            for (var i = 0; i < len; i++) {
              if (i in t)
                res[i] = fun.call(thisArg, t[i], i, t);
            }
  
            return res;
        };
       }
       Array.prototype.uniquify = noDoubles;
       Array.prototype.frequencies = Array.prototype.frequencies || frequencies;
  
       Array.prototype.each = Array.prototype.each || function (fn,rewrite) {
       for (var i = 0; i < this.length; i++) {
        if (rewrite){
          this[i] = fn(this[i]);
        } else {
         fn(this[i]);
        }
       }
       return this;
     };
  }
}());
