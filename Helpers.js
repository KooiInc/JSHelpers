Helpers = initHelpers(window, document);

function initHelpers(w, d, undefined) {
  "use strict";
  var useCustomCss = false;
  var extended = extensions();
  // note: git links are case sensitive
  var pathToCss = 'http://kooiinc.github.io/JSHelpers/Helpers.css';

  var helperObj = {             // Helpers methods:
    report: reportHTML,         // - simple reporting
    useJQ: loadJQ,              // - load jquery (2.1.1)
    useCSS: setCustomCss,       // - load custom css (see project)
    log2Screen: log2Screen,     // - more elaborate reporting
    initSO: SOInit,             // - detect Stackoverflow/jsFiddle and initialize
    printDirect: printDirect,   // - report without fadein effect
    logClear: screenClear,      // - clear current reported results
    Partial: Partial,           // - partially parametrize a function
    cloneObj: cloneObj,         // - clone any object on all levels
    randomID: randomID,         // - a random id for on the fly created elements
    extendDate: useDTF          // - use custom DateTime-formatting
  };

  function setCustomCss(use) {
    useCustomCss = use;
    if (useCustomCss) {
     loadCSS();
    } else {
     unloadCSS();
    }
  }

  function loadJQ(callback) {
      if (w.jQuery) {
        return callback && Object.ofType(callback, Function) ? callback() : true;
      }

      var jqel  = createElementWithProps( 'script',
                                          { src: '//code.jquery.com/jquery-2.1.1.min.js', id: 'jqloaded' } );

      d.querySelector('head').appendChild(jqel);

      if (callback && Object.isOfType(callback, Function))
          jqel.addEventListener('load', callback);

      return void(0);
  }

  function loadCSS() {
    if (d.querySelector('#HelperCSS')) {
      return true;
    }
    var css = createElementWithProps(
                    'link',
                    { href: pathToCss,
                      type: 'text/css',
                      rel: 'stylesheet',
                      id: 'HelperCSS' }
              );
    return d.querySelector('head').appendChild (css);
  }

  function unloadCSS() {
   var css = document.querySelector('#HelperCSS');
   return void (css && document.querySelector('head').removeChild(css));
  }

   // a few usefull augments/polyfills
  function extensions() {
      if (extended) {
        return true;
      }

      Function.args2Arr = function (args) {
        return Array.apply([], {length: args.length}).map( function (v, i) { return this[i]; }, args);
      };

      // run functions sequentially
      Function.prototype.andThen = function () {
       var args = Function.args2Arr(arguments)
          ,next = args.slice(1);
       this();
       return args[0] && next.length
               ? args[0].andThen.apply(args[0], next)
               : args.length == 1  ? args[0]()
               : true;
      };

      Function.prototype.partial = Function.prototype.partial || function () {
        var stored_args = [].slice.call(arguments)
           ,fn = this;
        return function () {
           return fn.apply(null, stored_args.concat([].slice.call(arguments)));
        };
      };

      Function.prototype.partialx = function(){
        var fn = this, args = Array.prototype.slice.call(arguments);
        return function(){
          var arg = 0;
          for ( var i = 0; i < args.length && arg < arguments.length; i++ )
            if ( args[i] === undefined || args[i] === null)
              args[i] = arguments[arg++];
          return fn.apply(this, args);
        };
      };

      Boolean.prototype.yn = function () { return false == this ? 'no' : 'yes'; };

      Number.prototype.toRange = Number.prototype.toRange || function (fn, startvalue) {
        startvalue = startvalue || 0;
        fn = Object.isOfType(fn, Function) ? fn : function (a,i) { return i+startvalue; };
        return String(new Array(this.valueOf())).split(',').map( fn );
      };

      Number.prototype.pretty = function (usa, noprecision) {
            var somenum = this
               ,dec = (''+somenum).split(/[.,]/)
               ,lendec = dec[1] ? dec[1].length : 0
               ,precision = lendec && !noprecision ? decPrecise(somenum,lendec) : dec[1]
               ,sep = usa ? ',' : '.'
               ,decsep = usa ? '.' : ',';

            // from http://stackoverflow.com/questions/10473994/javascript-adding-decimal-numbers-issue/10474209
            function decPrecise(d,l){
              return String(d.toFixed(12)).split(/[.,]/)[1].substr(0,l);
            }

            function xsep(num,sep) {
              var n = String(num).split('')
                 ,i = -3;
              while (n.length + i > 0) {
                  n.splice(i, 0, sep);
                  i -= 4;
              }
              return n.join('');
            }
            return xsep(dec[0],sep) + (dec[1] ? decsep+precision :'');
      };

      Number.prototype.padLeft = function padLeft(len, padchr){
          padchr = padchr || '0';
          var self = this + '';
          return Math.pow( 10, (len || 2) - self.length)
                    .toString()
                    .replace(/0/g, padchr)
                    .slice(1) + self;
      };

      // format static
      String.Format = function(){
        var args = Function.args2Arr(arguments);
        return ''.format.apply(args[0],args.slice(1));
      };

      String.prototype.format = function () {
        return function (text, args) {
                  var len       = text.length,
                      index     = 0,
                      parsed    = '',
                      currToken = ''
                  ;
                  while (index < len) {
                    if (text[index] === '{' && !isNaN(text[index + 1]) ) {
                      index += 1;
                      currToken = '';
                      var istoken = true;
                      while (text[index] !==  '}' ) {
                        if (isNaN(+text[index]) || /\s/i.test(text[index])) {
                          istoken = false;
                          break;
                        }
                        currToken += text[index];
                        index += 1;
                      }
                      parsed += istoken && args[+currToken] || '{' + currToken + (text[index] || '');
                    } else {
                      parsed += text[index];
                    }
                    index += 1;
                  }
                  return parsed;
               }(this, arguments);
      };

      String.prototype.repeat = function(n){
        var s = this, r = '';
        while(n--) {
            r += s;
        }
        return r;
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

      String.prototype.reCleanup = function(encodeHTML){
        var str = encodeHTML ? this.replace(/[\u0080-\u024F]/g, function(a) {return '&#'+a.charCodeAt(0)+';';}) : this;
        return str.replace(/[?*|.+$\/]|\\/g, function(c) {return c==='\\' ? '' : '\\\\'+c;});
      }

      String.joinStrings = function(joinstr){
        joinchar = joinchar || '';
        return Function.args2Arr(arguments).slice(1).join(joinstr);
      }

      Array.prototype.toRE = function (){
        try { return RegExp.apply(null, this); }
        catch(e) { return /.*/; }
      }

      Array.toRE = function(arr) {
        return ([].toRE.call(arr));
      }

      Array.prototype.toCheckboxValues = Array.prototype.toCheckboxValues || function (checked) {
        checked = checked || [];
        var cbxs = [];
        this.map(function (a, i) {
                   cbxs.push({check: checked.indexOf(i)>-1 ? 1 : 0, val: String(a)});
                  }, cbxs);
        return cbxs;
      };

      // MDN Array filter polyfill
      if (!Array.prototype.filter) {
        Array.prototype.filter = function(fun)
        {
          if (this === void 0 || this === null)
            throw new TypeError();

          var t = Object(this);
          var len = t.length >>> 0;
          if (!Object.isOfType(fun, Function))
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

      // remove double values from an array
      Array.prototype.uniquify = function (arr) {
        arr = arr || this;
        return arr.filter(function(val) {
         return !this[val] ? ((this[val] = true), true) : false;
        }, {});
      }

      // MDN Array map polyfill
      if (!Array.prototype.map) {
        Array.prototype.map = function(fun)
        {
          if (this === void 0 || this === null)
            throw new TypeError();

          var t = Object(this);
          var len = t.length >>> 0;
          if (!Object.isOfType(fun, Function))
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

     // determine value frequencies in an array
     Array.prototype.frequencies = function (arr) {
        arr = arr || this;
        var mapped = {sum: 0};
        (arr || this).map(function (a){
            if (!(a in this)) { this[a] = 1; }
            else { this[a] += 1; }
            this.sum += 1;
            return a; }, mapped
        );
        return mapped;
      };

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

     // statics
     Object.extend = function extend(base, extendobj){
      for (var key in extendobj) {
        if (!extendobj.hasOwnProperty(key)) { continue; }
        base[key] = extendobj[key];
      }
      return base;
     };

     Object.print = function (obj, space) {
      space = space || '  ';
      return '<pre class="code">'+JSON.stringify(obj, null, space)+'</pre>';
     }

     Object.format = function (obj, space) {
      space = space || '  ';
      return '<div class="objformat">'+JSON.stringify(obj, null, space)+'</div>';
     }

     // see: http://codereview.stackexchange.com/questions/23317/istypeobj-gettypeobj-v0/23329#23329
     Object.ofType = function (obj) {
          if (!obj) { return false; }
          var test = arguments.length ? Function.args2Arr(arguments).slice(1) : null
             ,self = obj.constructor;
          return test
                 ? !!(test.filter(function(a){return a === self}).length)
                 : (self.constructor.name ||
                    (String(self).match ( /^function\s*([^\s(]+)/im)
                      || [0,'ANONYMOUS_CONSTRUCTOR']) [1] );
     };

     extended = true;
     return extended;
  }

  // StackOverflow/jsFiddle special handling
  function SOInit() {
    var solink = d.querySelector('[data-linkid]');
    if (solink && !solink.querySelector('.linkhover')) {
      solink.appendChild(createElementWithProps('div', { className: 'linkhover', 'data-dyn': 'true' } ));
    }

    loadJQ( jqcallback );

    function jqcallback() {
       $('#helperload').fadeOut(900);
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
              '<p>Click logo to view the related question:<p><h3>' + resp.title + '</h3>' +
              'Asked by <img class="profileimg" src="' +
              resp.owner.profile_image + '"> <div data-link="' +
              resp.owner.link+'">'+ resp.owner.display_name + '</div>; '+
              'rep ' + resp.owner.reputation +'; question views: ' + resp.view_count
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
    entry.innerHTML = Function.args2Arr(arguments).join('');
    report.appendChild(entry);

    if (useCustomCss) {
      var to = function () { entry.className = 'show'; };
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
       ,args = Function.args2Arr(arguments)
       ,lastarg = args.slice(-1)[0]
       ,optkeys = /clear|clrscr|direct|opts|useopts|continuous/i
       ,opts = Object.ofType(lastarg, Object) &&
               Object.keys(lastarg).filter(function(v){return optkeys.test(v);}).length
                ? lastarg.opts instanceof Object ? lastarg.opts : lastarg
                : {empty: 1}
       ,dummy = void(!opts.empty && (args = args.slice(0,-1)))
    ;

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
    p.innerHTML = args.join('')
                   .replace(/\n/g,'<br>')
                   .replace(/`([^`]*)`/g,
                            function(a, b, c) { return '<code>'+b+'</code>'; });
    result.appendChild(p);
    return opts.direct ? (p.className = 'show')
                       : setTimeout(function () { p.className = 'show'; }, +opts.timed*1000 || 0);
  }

  function printDirect() {
    return log2Screen.apply( null, Function.args2Arr(arguments).concat({direct:true}) );
  }

  function screenClear() {
    var res = d.querySelector('#result');
    return  res && (res.innerHTML = '') || true;
  }

  // utilities
  function createElementWithProps(elType, props) {
    var el = d.createElement(elType);
    if (props && Object.isOfType(props, Object)) {
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

  function Partial (func) {
    this.initial = Function.args2Arr(arguments, 1);
    this.funcp = function () {
                 return func.partialx.apply(func, this.initial);
                };
    if (!Partial.prototype.x) {
      Partial.prototype.x = function () {
        return this.funcp().apply(null, Function.args2Arr(arguments));
      };
    }
  };

  function cloneObj(obj) {
    // clone the whole enchillada, recursive
    function clone(o, curr) {
        for (var l in o){
            if (!o.hasOwnProperty(l)) { continue; }
            if (o[l] instanceof Object) {
                curr[l] = cloneObj(o[l]);
            } else {
                curr[l] = o[l];
            }
        }
        return curr;
    }

    return obj instanceof Array
             ? obj.slice().map( function (v) { return cloneObj(v); } )
             : obj instanceof Date
               ? new Date(obj)
               : obj instanceof Object
                 ? clone(obj, {})
                 : obj;
  }

  function randomID() {
     return '_'+Math.floor(10000+Math.random()*10000000).toString(16);
  }

  if (/fiddle|stacksnippets/i.test(self.location.href)) {
    extensions();
    setCustomCss(true);
    w.addEventListener('load', function () {
      var loadingmsg = d.body.insertBefore(createElementWithProps('div', {id:'helperload'}), d.body.firstChild);
    });
    w.addEventListener('load', SOInit);
  }

  // simple date extenter
  // add languages if necessary
  function useDTF(lang) {
    lang = lang || 'NL';
    if (!Date.prototype.add) {
      (function() {
        var fragments     = {
                              'd' : 'Date'
                             ,'m' : 'Month'
                             ,'y' : 'FullYear'
                             ,'h' : 'Hours'
                             ,'mi': 'Minutes'
                             ,'s' : 'Seconds'
                             ,'ms': 'MilliSeconds'
                             , get: function(frag,get){ return get && 'get'+this[frag] || 'set'+this[frag]; }
             }
            ,weekdays     = {
                             NL: toEnum(('zondag,maandag,dinsdag,woensdag,donderdag,' +
                                         'vrijdag,zaterdag').split(','))
                            ,EN:  toEnum(('sunday,monday,tuesday,wednesday,thursday,' +
                                          'friday,saturday').split(','))
                            }
            ,months       = {
                             NL: toEnum(('januari,februari,maart,april,mei,juni,juli,' +
                                         'augustus,september,oktober,' +
                                         'november,december').split(',')),
                             EN: toEnum(('january,february,march,april,may,june,july,' +
                                         'august,september,october,' +
                                         'november,december').split(','))
                            }
            ,weekdayshort = {
                             NL: toEnum(('zo,ma,di,wo,do,vr,za').split(',')),
                             EN: toEnum(('su,mo,tu,we,th,fr,sa').split(','))
                            }
            ,monthshort   = {
                             NL: toEnum(('jan,feb,mrt,apr,mei,jun,jul,' +
                                         'aug,sep,okt,nov,dec').split(',')),
                             EN: toEnum(('jan,feb,mrch,apr,may,jun,jul,' +
                                         'aug,sep,okt,nov,dec').split(','))
                            }
        ;

        function toEnum(valArr) {
          var l = valArr.length, ret = { byArr: valArr };
          while (--l) {
            ret[valArr[l]] = l;
          }
          return ret;
        }

        function setCurrentValues(){
          this.cd   = this.getDate();
          this.cm   = this.getMonth()+1;
          this.cy   = this.getFullYear();
          this.ch   = this.getHours()  || Number(0);
          this.cmin = this.getMinutes() || Number(0);
          this.cs   = this.getSeconds() || Number(0);
          this.cms  = this.getMilliseconds() || Number(0);
          this.dow  = this.getDay() || Number(0);
        }

        function dateset(f,val){
          val = Number(val);
          val -= f === 'm' && 1 || 0;
          f = fragments.get(f);
          this[f](val);
          setCurrentValues.call(this);
          return this;
        }

        function dateAddByObj(args, utc, clone){
          // default: seconds if args is a number
          if (+args) { return this.setSeconds(this.getSeconds()+(+args)); }
          utc = utc && 'UTC' || '';
          var  self = this
              ,add  = function (label, v) {
                       label = label && label.slice(0,1).toUpperCase()+label.slice(1).toLowerCase() || '';
                       label = /Fullyear/.test(label) && 'FullYear' || label;
                       return self['set'+utc+label] && self['set'+utc+label](self['get'+utc+label]()+v)
                              || self;
                      };
          for (var l in args){ add(l, +args[l]) }
          return clone ? new Date(this) : this;
        }

        function dateadd(f, val, utc, clone){
          if (f instanceof Object) {
           return dateAddByObj.apply(this, [f, utc, clone]);
          }
          val = Number(val) || 1;
          var sf = fragments.get(f)
             ,gf = fragments.get(f,1);
          this[sf](this[gf]()+val);
          setCurrentValues.call(this);
          return clone ? new Date(this) : this;
        }

        function d2frags(dat) {
          dat = dat || this;
          dat.cy || setCurrentValues.call(dat);
          var  language = dat.getLang() || 'EN'
              ,base = {
                  yyyy: dat.cy
                , m:    dat.cm
                , d:    dat.cd
                , h:    dat.ch
                , min:  dat.cmin
                , s:    dat.cs
                , ms:   dat.cms
                , dow:  dat.dow
               }
              ,ext = {
                  mm:  base.m.padLeft()
                , dd:  base.d.padLeft()
                , hh:  base.h.padLeft()
                , mi:  base.min.padLeft()
                , ss:  base.s.padLeft()
                , mss: base.ms.padLeft(3)
                , M:   monthshort[language].byArr[base.m - 1]
                , MM:  months[language].byArr[base.m - 1]
                , wd:  weekdayshort[language].byArr[base.dow]
                , WD:  weekdays[language].byArr[base.dow]
                , WDU: weekdays[language].byArr[base.dow].firstUp()
               }
              ,regExBuild = []
          ;

          for (var l in ext) {
            if (ext.hasOwnProperty(l)) {
              base[l] = ext[l];
            }
          }
          for (var l in base) {
            if (base.hasOwnProperty(l)) {
              regExBuild.push('(\\b' + l + '\\b)');
            }
          }
          base.re = new RegExp(regExBuild.join('|'), 'g');
          return base;
        }

        function format(fstr) {
          fstr = fstr || this.strformat || 'yyyy/mm/dd hh:mi:ss';
          var dd = d2frags.call(this);
          return fstr.replace(dd.re, function (a) { return dd[a]; })
                     .replace(/~/g, '');
        }

        function chngLang(lang) {
         this.language = /^[EN][NL]$/i.test(lang) && lang.toUpperCase() || 'NL';
         this.constructor.prototype.language = this.language;
         return this;
        }

        Number.prototype.padLeft = Number.prototype.padLeft ||
          function (len, padchr) {
              padchr = padchr || '0';
              var self = this + '';
              return Math.pow( 10, (len || 2) - self.length)
                        .toString()
                        .replace(/0/g, padchr)
                        .slice(1) + self;
          };

        // add stuff to Date.prototype
        Date.prototype.language       = lang.toUpperCase();
        Date.prototype.setFormat      = function(f){this.strformat = f; return this;}
        Date.prototype.changeLanguage = chngLang;
        Date.prototype.set            = dateset;
        Date.prototype.add            = dateadd;
        Date.prototype.format         = format;
        Date.prototype.getLang        = function() {return Date.prototype.language;};
      }());
    }
  }

  return helperObj;
}
