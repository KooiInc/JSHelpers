Helpers = initHelpers(window, document);

function initHelpers(w, d, undefined) {
  "use strict";
  var useCustomCss = false;
  var extended = extensions();

  var helperObj = {
    report: reportHTML,
    useJQ: loadJQ,
    useCSS: setCustomCss,
    log2Screen: log2Screen,
    initSO: SOInit,
    printDirect: printDirect,
    logClear: screenClear
  };

  function setCustomCss(yn) {
    useCustomCss = yn;
    if (useCustomCss) {
     loadCSS();
    } else {
     unloadCSS();
    }
  }

  function loadJQ(callback) {
      if (w.jQuery) {
        return callback && callback instanceof Function ? callback() : true;
      }

      var jqel  = createElementWithProps('script', {src: 'http://code.jquery.com/jquery-2.1.1.min.js', id: 'jqloaded'});

      d.querySelector('head').appendChild(jqel);

      if (callback && callback instanceof Function)
          jqel.addEventListener('load', callback);

      return void(0);
  }

  function loadCSS() {
    if (d.querySelector('#HelperCSS')) {
      return true;
    }
    var css = createElementWithProps(
                    'link',
                    { href: 'https://rawgit.com/KooiInc/Helpers/master/Helpers.css',
                      type: 'text/css',
                      rel: 'stylesheet',
                      id: 'HelperCSS' }
              );
    return d.querySelector('head').appendChild (css);
  }

  function unloadCSS() {
   var css = document.querySelector('#HelperCSS');
   void (css && document.querySelector('head').removeChild(css));
  }

   // a few usefull augments/polyfills
  function extensions() {
        if (extended) {
          return true;
        }
        // remove double values from an array
        function noDoubles(arr) {
          arr = arr || this;
          return arr.filter(function(val) {
           return !this[val] ? ((this[val] = true), true) : false;
          }, {});
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
            var args = ar(arguments);
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
         var args = args2Array(arguments)
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
          return args2Array(arguments).join(joinchar);
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

       extended = true;
       return extended;
  }

  // SO specials
  function SOInit() {
    extensions();
    setCustomCss(true);
    loadJQ( jqcallback );

    function jqcallback() {
       $(document).on('mouseover', '.solink',  setSOLink);
       $(document).on('click', '[data-link]', clicklink);
    };
  }

  function setSOLink(e) {
      if ($(this).attr('data-link')) { return true; }

      $.ajax(
          {
              url: 'http://www.nicon.nl/node/stackx/questionx',
              data: {qid: $('.solink').first().attr('data-linkid')},
              method: 'post',
              success: SOcb
          }
      );

      function SOcb(data) {
          var resp = data.items && data.items[0] || data
          ,linkelement = $('.solink').first()
          ,linktip = linkelement.find('.linkhover').first()
          ;
          linktip.html(
              'Click logo to view the related question:<p><h3>' + resp.title + '</h3></p>' +
              'Asked by <img class="profileimg" src="'+
              resp.owner.profile_image + '"> <div data-link="' +
              resp.owner.link+'">'+ resp.owner.display_name + '</div>; '+
              'rep ' + resp.owner.reputation +'; question views: '+resp.view_count
          );
          linkelement.attr('data-link', resp.link);
      }

      return true;
  }

  // firefox needs a link added to the DOM, Chrome, IE don't
  function clicklink(e) {
      e.stopPropagation(); //just this link
      var linkurl = this.getAttribute('data-link')
         ,xlink = document.querySelector('a[href="'+linkurl+'"]') ||
                  function() {
                      var _link = createElementWithProps(
                                    'a', { href: linkurl, target:'_blank', style: { display: 'none' } }
                                  );
                      document.body.appendChild(_link);
                      return _link; }();
      xlink.click();
  }

  // Reporting
  // 1. simple
  function reportHTML() {
    var report = document.querySelector('#result') ||
        function() {
          var r = createElementWithProps( 'div', {id: 'result'} );
          document.querySelector('body').appendChild(r);
          return r;
        }();
    var entry = createElementWithProps('p');
    entry.innerHTML = args2Array(arguments).join('');
    report.appendChild(entry);

    if (useCustomCss) {
      var to = function () { entry.className = 'fadeIn'; };
      var dummy = setTimeout(to, 100);
    }
  }

  // 2. with parameter object usage
  function log2Screen() {
      var result = document.querySelector('#result') ||
                   function () {
                       var r = createElementWithProps('div', {id: 'result'});
                       document.body.appendChild(r);
                       return r; }()
         ,args = args2Array(arguments)
         ,lastarg = args.slice(-1)[0]
         ,optkeys = /clear|clrscr|direct|opts|useopts|continuous/i
         ,opts = isObjLiteral(lastarg) && Object.keys(lastarg).filter(function(v){return optkeys.test(v);}).length
                 ? lastarg.opts instanceof Object ? lastarg.opts : lastarg
                 : {empty: 1};
      void(!opts.empty && (args = args.slice(0,-1)));

      if (opts.clrscr) {
          return result.innerHTML = '';
      }

      if (opts.clear) {
          result.innerHTML = '';
      }

      if (opts.continuous) {
          return result.innerHTML += args.join('').replace(/\n/g,'<br>');
      }

      var p = createElementWithProps('p');
      p.innerHTML = args.join('').replace(/\n/g,'<br>');
      result.appendChild(p);
      return opts.direct ? (p.className = 'fadeIn')
                         : setTimeout(function () { p.className = 'fadeIn'; }, +opts.timed*1000 || 0);
  }

  function printDirect() {
    return log2Screen.apply( null, args2Array(arguments).concat({direct:true}) );
  }

  function screenClear() {
      var res = d.querySelector('#result');
      return  res && (res.innerHTML = '') || true;
  }

  // utilities
  function createElementWithProps(elType, props) {
    var el = d.createElement(elType);
    if (props && isObjLiteral(props)) {
      for (var l in props) {
        if (!props.hasOwnProperty(l)) continue;
        if (/style/i.test(l)) {
          for (var ll in props[l]) {
            if (!props[l].hasOwnProperty(ll)) continue;
            el.style[ll] = props[l][ll];
          }
        } else {
          el[l] = props[l];
        }
      }
    }
    return el;
  }

  function isObjLiteral(item) {
    return item.constructor === Object;
  }

  function args2Array(args){
    var arr = [];
    for (var i=0;i<args.length;i+=1) {
      arr.push(args[i]);
    }
    return arr;
  }

  return helperObj
}
