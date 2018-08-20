((w, d) => {
  "use strict";
  let useCustomCss = false;
  let extended = extensions();
  // note: git links are case sensitive
  const pathToCss = "//kooiinc.github.io/JSHelpers/Helpers.css";
  const helperObj = {             // Helpers methods:
    report: reportHTML,         // - simple reporting
    useCSS: setCustomCss,       // - load custom css (see project)
    log2Screen: log2Screen,     // - more elaborate reporting
    initSO: SOInit,             // - detect Stackoverflow/jsFiddle and initialize
    printDirect: printDirect,   // - report without fadein effect
    logClear: screenClear,      // - clear current reported results
    Partial: Partial,           // - partially parametrize a function
    cloneObj: cloneObj,         // - clone any object on all levels
    randomID: randomID,         // - a random id for on the fly created elements
    extendDate: useDTF,         // - use custom DateTime-formatting
    modalMss: ModalMessage,     // - modal messages helper
    xhr: XHR(),                 // - replaces JQ ajax
    fader: Fader(),             // - fadeIn/-Out
  };

  if (/fiddle|stacksnippets/i.test(self.location.href)) {
    console.log("ehr...");
    extensions();
    setCustomCss(true);
    w.addEventListener("load", () =>
      d.body.insertBefore(createElementWithProps("div", {id: "helperload"}), d.body.firstChild));
    w.addEventListener("load", SOInit);
  }


  function setCustomCss(use) {
    useCustomCss = use;
    if (useCustomCss) {
      loadCSS();
    } else {
      unloadCSS();
    }
  }

  function loadCSS() {
    if (d.querySelector("#HelperCSS")) {
      return true;
    }
    const css = createElementWithProps(
      "link",
      {
        href: pathToCss,
        type: "text/css",
        rel: "stylesheet",
        id: "HelperCSS"
      }
    );
    return d.querySelector("head").appendChild(css);
  }

  function unloadCSS() {
    const css = document.querySelector("#HelperCSS");
    return void (css && document.querySelector("head").removeChild(css));
  }

  // StackOverflow/jsFiddle special handling
  function SOInit() {
    const solink = d.querySelector("[data-linkid]");
    if (solink && !solink.querySelector(".linkhover")) {
      solink.appendChild(createElementWithProps("div", {className: "linkhover waiting", "data-dyn": "true"}));
    }

    d.querySelector(".linkhover").classList.remove("waiting");
    const helperLoader = d.querySelector("#helperload");
    helperObj.fader.fadeOutCB(helperLoader, 600, () => helperLoader.style.display = "none");
    w.addEventListener("mouseover", setSOLink);
    w.addEventListener("click", clickSOLink);
  }

  function setSOLink(evt) {
    if (!evt.target.dataset.link) {
      return;
    }

    const SOcb = data => {
      const resp = data.items && data.items[0] || data;
      const linkelement = d.querySelector(".solink");
      const linktip = linkelement.querySelector(".linkhover");
      linktip.innerHTML = `
         <p>
            Click logo to view the related question:
         </p>
         <h3>${resp.data.title}</h3>
            Asked by <img class="profileimg" src="${resp["owner"]["profile_image"]}"> 
            <div data-link="${resp["owner"].link}>${resp["owner"]["display_name"]}</div>
            rep ${resp["owner"]["reputation"]}; question views: ${resp["view_count"]}
         </p>`;
      linkelement.attr("data-link", resp.link);
    };

    helperObj.xhr(
      {
        data: {
          url: "//www.nicon.nl/node/stackx/questionx",
          qid: d.querySelector(".solink").dataset.linkid,
        },
        done: SOcb,
      }
    );
  }

  function Fader() {
    const getStyle = (opacity, time) => `opacity:${opacity};transition:opacity linear ${time || 0.8}s 0s;`;
    const fadeIn = (elem, time) => elem.setAttribute("style", getStyle(1, time));
    const fadeOut = (elem, time) => elem.setAttribute("style", getStyle(0, time));
    return {
      fadeIn: fadeIn,
      fadeOut: fadeOut,
      fadeInCB: (elem, time, cb) => (fadeIn(elem, time), cb && setTimeout(cb, time * 1000)),
      fadeOutCB: (elem, time, cb) => (fadeOut(elem, time), cb && setTimeout(cb, time * 1000)),
    }
  }

  // firefox needs a link added to the DOM, Chrome, IE don't
  function clickSOLink(evt) {
    if (!evt.dataset.link) { return; }
    evt.stopPropagation(); //just this link
    const linkurl = evt.target.dataset.link;
    const xlink = d.querySelector(`a[href="${linkurl}"]`) ||
      function () {
        const _link = createElementWithProps(
          "a", {href: linkurl, target: "_blank", style: {display: "none"}}
        );
        document.body.appendChild(_link);
        return _link;
      }();
    xlink.click();
  }

  // Reporting
  // 1. simple
  function reportHTML() {
    const report = d.querySelector("#result") ||
      function () {
        const r = createElementWithProps("div", {id: "result"});
        document.querySelector("body").appendChild(r);
        return r;
      }();
    const entry = createElementWithProps("p");
    entry.innerHTML = Function.args2Arr(arguments).join("");
    report.appendChild(entry);

    if (useCustomCss) {
      const to = function () {
        entry.className = "show";
      };
      setTimeout(to, 100);
    }
  }

  // 2. with parameter object usage
  function log2Screen() {
    const result = document.querySelector("#result") ||
      function () {
        const r = createElementWithProps("div", {id: "result"});
        document.body.appendChild(r);
        return r;
      }();
    const args = Function.args2Arr(arguments);
    const lastarg = args.slice(-1)[0];
    const optkeys = /clear|clrscr|direct|opts|useopts|continuous/i;
    const opts = Object.isOfType(lastarg, Object) &&
    Object.keys(lastarg).filter(function (v) {
      return optkeys.test(v);
    }).length ?
      lastarg.opts instanceof Object ? lastarg.opts : lastarg :
      {empty: 1};

    if (opts["clrscr"]) {
      return result.innerHTML = "";
    }

    if (opts.clear) {
      result.innerHTML = "";
    }

    if (opts["continuous"]) {
      return result.innerHTML += args.join("").replace(/\n/g, "<br>");
    }

    const p = createElementWithProps("p");
    p.innerHTML = args.join("")
      .replace(/\n/g, "<br>")
      .replace(/`([^`]*)`/g,
        function (a, b) {
          return "<code>" + b + "</code>";
        });
    result.appendChild(p);
    return opts.direct ? (p.className = "show")
      : setTimeout(function () {
        p.className = "show";
      }, +opts["timed"] * 1000 || 0);
  }

  function printDirect() {
    return log2Screen.apply(null, Function.args2Arr(arguments).concat({direct: true}));
  }

  function screenClear() {
    const res = d.querySelector("#result");
    return res && (res.innerHTML = "") || true;
  }

  // utilities
  function createElementWithProps(elType, props) {
    const el = d.createElement(elType);
    if (props && Object.isOfType(props, Object)) {
      for (let l in props) {
        if (!props.hasOwnProperty(l)) continue;
        if (/style/i.test(l)) {
          for (let ll in props[l]) {
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

  function Partial(func) {
    this.initial = Function.args2Arr(arguments, 1);
    this.funcp = function () {
      return func.partialx.apply(func, this.initial);
    };
    if (!Partial.prototype.x) {
      Partial.prototype.x = function () {
        return this.funcp().apply(null, Function.args2Arr(arguments));
      };
    }
  }

  function cloneObj(obj) {
    // clone the whole enchillada, recursive
    function clone(o, curr) {
      for (let l in o) {
        if (!o.hasOwnProperty(l)) {
          continue;
        }
        if (o[l] instanceof Object) {
          curr[l] = cloneObj(o[l]);
        } else {
          curr[l] = o[l];
        }
      }
      return curr;
    }

    return obj instanceof Array
      ? obj.slice().map(function (v) {
        return cloneObj(v);
      })
      : obj instanceof Date
        ? new Date(obj)
        : obj instanceof Object
          ? clone(obj, {})
          : obj;
  }

  function randomID() {
    return "_" + Math.floor(10000 + Math.random() * 10000000).toString(16);
  }

  // simple date extenter
  // add languages if necessary
  function useDTF(lang) {
    lang = lang || "NL";
    if (!Date.prototype.add) {
      (function () {
        const fragments = {
            "d": "Date"
            , "m": "Month"
            , "y": "FullYear"
            , "h": "Hours"
            , "mi": "Minutes"
            , "s": "Seconds"
            , "ms": "MilliSeconds"
            , get: function (frag, get) {
              return get && "get" + this[frag] || "set" + this[frag];
            }
          }
          , weekdays = {
            NL: toEnum(("zondag,maandag,dinsdag,woensdag,donderdag," +
              "vrijdag,zaterdag").split(","))
            , EN: toEnum(("sunday,monday,tuesday,wednesday,thursday," +
            "friday,saturday").split(","))
          }
          , months = {
            NL: toEnum(("januari,februari,maart,april,mei,juni,juli," +
              "augustus,september,oktober," +
              "november,december").split(",")),
            EN: toEnum(("january,february,march,april,may,june,july," +
              "august,september,october," +
              "november,december").split(","))
          }
          , weekdayshort = {
            NL: toEnum(("zo,ma,di,wo,do,vr,za").split(",")),
            EN: toEnum(("su,mo,tu,we,th,fr,sa").split(","))
          }
          , monthshort = {
            NL: toEnum(("jan,feb,mrt,apr,mei,jun,jul," +
              "aug,sep,okt,nov,dec").split(",")),
            EN: toEnum(("jan,feb,mrch,apr,may,jun,jul," +
              "aug,sep,okt,nov,dec").split(","))
          }
        ;

        function toEnum(valArr) {
          let l = valArr.length;
          const ret = {byArr: valArr};
          while (--l) {
            ret[valArr[l]] = l;
          }
          return ret;
        }

        function setCurrentValues() {
          this.cd = this.getDate();
          this.cm = this.getMonth() + 1;
          this.cy = this.getFullYear();
          this.ch = this.getHours() || Number(0);
          this.cmin = this.getMinutes() || Number(0);
          this.cs = this.getSeconds() || Number(0);
          this.cms = this.getMilliseconds() || Number(0);
          this.dow = this.getDay() || Number(0);
        }

        function dateset(f, val) {
          val = Number(val);
          val -= f === "m" && 1 || 0;
          f = fragments.get(f);
          this[f](val);
          setCurrentValues.call(this);
          return this;
        }

        function dateAddByObj(args, utc, clone) {
          // default: seconds if args is a number
          if (+args) {
            return this.setSeconds(this.getSeconds() + (+args));
          }
          utc = utc && "UTC" || "";
          const self = this
            , add = function (label, v) {
            label = label && label.slice(0, 1).toUpperCase() + label.slice(1).toLowerCase() || "";
            label = /Fullyear/.test(label) && "FullYear" || label;
            return self["set" + utc + label] && self["set" + utc + label](self["get" + utc + label]() + v)
              || self;
          };
          for (let l in args) {
            if (args.hasOwnProperty(l)) { add(l, +args[l]); }
          }
          return clone ? new Date(this) : this;
        }

        function dateadd(f, val, utc, clone) {
          if (f instanceof Object) {
            return dateAddByObj.apply(this, [f, utc, clone]);
          }
          val = Number(val) || 1;
          const sf = fragments.get(f)
            , gf = fragments.get(f, 1);
          this[sf](this[gf]() + val);
          setCurrentValues.call(this);
          return clone ? new Date(this) : this;
        }

        function d2frags(dat) {
          dat = dat || this;
          dat.cy || setCurrentValues.call(dat);
          const language = dat.getLang() || "EN"
            , base = {
              yyyy: dat.cy
              , m: dat.cm
              , d: dat.cd
              , h: dat.ch
              , min: dat.cmin
              , s: dat.cs
              , ms: dat.cms
              , dow: dat.dow
            }
            , ext = {
              mm: base.m.padLeft()
              , dd: base.d.padLeft()
              , hh: base.h.padLeft()
              , mi: base.min.padLeft()
              , ss: base.s.padLeft()
              , mss: base.ms.padLeft(3)
              , M: monthshort[language].byArr[base.m - 1]
              , MM: months[language].byArr[base.m - 1]
              , wd: weekdayshort[language].byArr[base.dow]
              , WD: weekdays[language].byArr[base.dow]
              , WDU: weekdays[language].byArr[base.dow].firstUp()
            }
            , regExBuild = []
          ;

          for (let l in ext) {
            if (ext.hasOwnProperty(l)) {
              base[l] = ext[l];
            }
          }
          for (let l in base) {
            if (base.hasOwnProperty(l)) {
              regExBuild.push("(\\b" + l + "\\b)");
            }
          }
          base.re = new RegExp(regExBuild.join("|"), "g");
          return base;
        }

        function format(fstr) {
          fstr = fstr || this.strformat || "yyyy/mm/dd hh:mi:ss";
          const dd = d2frags.call(this);
          return fstr.replace(dd.re, function (a) {
              return dd[a];
            })
            .replace(/~/g, "");
        }

        function chngLang(lang) {
          this.language = /^[EN][NL]$/i.test(lang) && lang.toUpperCase() || "NL";
          this.constructor.prototype.language = this.language;
          return this;
        }

        Number.prototype.padLeft = Number.prototype.padLeft ||
          function (len, padchr) {
            padchr = padchr || "0";
            const self = this + "";
            return Math.pow(10, (len || 2) - self.length)
              .toString()
              .replace(/0/g, padchr)
              .slice(1) + self;
          };

        // add stuff to Date.prototype
        Date.prototype.language = lang.toUpperCase();
        Date.prototype.setFormat = function (f) {
          this.strformat = f;
          return this;
        };
        Date.prototype.changeLanguage = chngLang;
        Date.prototype.set = dateset;
        Date.prototype.add = dateadd;
        Date.prototype.format = format;
        Date.prototype.getLang = function () {
          return Date.prototype.language;
        };
      }());
    }
  }

  function ModalMessage() {
    createPopupCss();

    function remove() {
      d.querySelector(".alertBox").classList.remove("isDone");
      setTimeout(() => {
        d.body.removeChild(d.querySelector(".between"));
        d.body.removeChild(d.querySelector(".alertBox"));
      }, 300);
    }

    const modalMssg = {
      create(message, omitOkBttn) {
        if (d.querySelector(".alertBox")) {
          return d.querySelector("#alertOk") ? remove() : true;
        }
        let betweenLayer = d.createElement("div");
        let modalBox = d.createElement("div");
        modalBox.classList.add("alertBox", "centeredHV");
        modalBox.innerHTML = `</div>${message}</div>`;
        betweenLayer.classList.add("between");

        if (!omitOkBttn) {
          let ok = d.createElement("div");
          ok.id = "alertOk";
          ok.classList.add("okHandle");
          modalBox.insertBefore(ok, modalBox.firstChild);
        } else {
          modalBox.classList.add("reallyModal");
        }

        d.body.appendChild(betweenLayer);
        d.body.appendChild(modalBox);

        setTimeout(() => modalBox.classList.add("isDone"), 10);
      },
      remove: remove
    };

    d.addEventListener("click", defaultModalRemover);

    return modalMssg;

    function defaultModalRemover(evt) {
      const fromElement = evt.target;
      if (fromElement.id === "alertOk" ||
        d.querySelector("#alertOk") &&
        fromElement.classList.contains("between")) {
        modalMssg.remove();
      }
    }

    function createPopupCss() {
      let cssBlock = d.createElement("link");
      cssBlock.rel = "stylesheet";
      cssBlock.href = URL.createObjectURL(getCssBlob());
      d.querySelector("head").appendChild(cssBlock);
    }

    function getCssBlob() {
      const cleanup = str =>
        str.replace(/\n/g, "").replace(/\s{2,}/g, " ").replace(/; /g, ";")
          .replace(/(}\s)/g, "}").replace(/(\s})/g, "}").replace(/(\s+{)/g, "{")
          .replace(/({\s+)/g, "{").replace(/: /g, ":");
      return new Blob([cleanup(`
      .between {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        overflow: hidden;
        background-color: white;
        opacity: 0.5;
      }
      .alertBox {
        min-width: 300px;
        max-width: 400px;
        max-height: 400px;
        background-color: white;
        padding: 15px 48px 15px 15px;
        box-shadow: 3px 2px 12px #777;
        border-radius: 6px;
        z-index: 2;
        opacity: 0;
        transition: opacity ease-in-out 0.3s 0s;
      }
      .isDone {
        opacity: 1;
        transition: opacity ease-in-out 0.4s 0s;
      }
      .alertBox.reallyModal {
        padding-right: 15px;
      }
      .alertBox p,
      .alertBox div,
      .alertBox h3 {
        margin-top: 0.4em;
        margin-bottom: 0;
      }
      .alertBox h3 {
        margin-top: 0.3em;
        font-size: 0.9em;
      }
      .okHandle {
        float: right;
        cursor: pointer;
        margin-right: -58px;
        margin-top: -26px !important;
        width: 32px;
        height: 32px;
        background: url('data:image/svg+xml;utf8,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22iso-8859-1%22%3F%3E%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20version%3D%221.1%22%20id%3D%22Layer_1%22%20x%3D%220px%22%20y%3D%220px%22%20viewBox%3D%220%200%20128%20128%22%20style%3D%22enable-background%3Anew%200%200%20128%20128%3B%22%20xml%3Aspace%3D%22preserve%22%3E%3Crect%20x%3D%22-368%22%20y%3D%226%22%20style%3D%22display%3Anone%3Bfill%3A%23E0E0E0%3B%22%20width%3D%22866%22%20height%3D%221018%22%2F%3E%3Ccircle%20style%3D%22fill%3A%23FFFFFF%3B%22%20cx%3D%2264%22%20cy%3D%2264%22%20r%3D%2248%22%2F%3E%3Ccircle%20style%3D%22fill%3A%238CCFB9%3B%22%20cx%3D%2264%22%20cy%3D%2264%22%20r%3D%2239%22%2F%3E%3Ccircle%20style%3D%22fill%3Anone%3Bstroke%3A%23444B54%3Bstroke-width%3A6%3Bstroke-miterlimit%3A10%3B%22%20cx%3D%2264%22%20cy%3D%2264%22%20r%3D%2248%22%2F%3E%3Cpolyline%20style%3D%22fill%3Anone%3Bstroke%3A%23FFFFFF%3Bstroke-width%3A6%3Bstroke-linecap%3Around%3Bstroke-miterlimit%3A10%3B%22%20points%3D%2242%2C69%2055.55%2C81%20%20%2086%2C46%20%22%2F%3E%3C%2Fsvg%3E') no-repeat;
      }
      .centeredHV {
        margin: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }`)], {type: "text/css"});
    }
  }

  function XHR() {
    const modalMessage = ModalMessage();
    const xhrError = error => {
      modalMessage.create(`XHR error occured ${error.message}`, true);
    };
    const xhrAsync = (xData, timeout = 2000) => {
      const isJSON = !xData.responseType; // Note: json response by default
      const url = xData.url;
      delete xData.url;
      return new Promise((resolve, reject) => {
        const xRequest = new XMLHttpRequest();
        xRequest.timeout = timeout;
        xRequest.onerror = error => reject(error);
        xRequest.onreadystatechange = () => {
          if (xRequest.readyState === 4) {
            if (xRequest.status === 200) {
              resolve(isJSON && JSON.parse(xRequest.response) || xRequest.response);
            } else {
              reject(xRequest.status);
            }
          }
        };
        xRequest.ontimeout = () => reject("timed out");
        xRequest.open("post", url); // note: always post here
        xRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xRequest.send(JSON.stringify(xData));
      });
    };
    return {
      xhr: async xhrData => {
        try {
          const xhrResponse = await xhrAsync(xhrData.data);
          const hasCb = xhrData.done && xhrData.done instanceof Function;
          return xhrResponse.error
            ? xhrError(xhrResponse)
            : hasCb
              ? xhrData.done(xhrResponse)
              : true;
        } catch (error) {
          return xhrError(error);
        }
      },
      concatObj(someObj, obj2Concat) {
        for (const l in obj2Concat) {
          if (obj2Concat.hasOwnProperty(l)) {
            someObj[l] = obj2Concat[l];
          }
        }
      },
      addHandlers(events, element, handler) {
        events = events instanceof Array ? events : [events];
        events.forEach(evt => element.addEventListener(evt, handler));
      }
    };
  }

  // a few usefull augments/polyfills
  function extensions() {
    if (extended) {
      return true;
    }

    Function.args2Arr = function (args) {
      return Array.apply([], {length: args.length}).map(function (v, i) {
        return this[i];
      }, args);
    };

    // run functions sequentially
    Function.prototype.andThen = function () {
      const args = Function.args2Arr(arguments);
      const next = args.slice(1);
      this();
      return args[0] && next.length ?
        args[0].andThen.apply(args[0], next) :
        args.length === 1 ?
          args[0]() :
          true;
    };

    Function.prototype.partial = Function.prototype.partial || function () {
      const stored_args = [].slice.call(arguments);
      const fn = this;
      return function () {
        return fn.apply(null, stored_args.concat([].slice.call(arguments)));
      };
    };

    Function.prototype.partialx = function () {
      const fn = this, args = Array.prototype.slice.call(arguments);
      return function () {
        let arg = 0;
        for (let i = 0; i < args.length && arg < arguments.length; i++) {
          if (args[i] === undefined || args[i] === null) {
            args[i] = arguments[arg++];
          }
        }
        return fn.apply(this, args);
      };
    };

    Boolean.prototype.yn = function () {
      return false === this ? "no" : "yes";
    };

    Number.prototype.toRange = Number.prototype.toRange || function (fn, startvalue) {
      startvalue = startvalue || 0;
      fn = Object.isOfType(fn, Function) ? fn : function (a, i) {
        return i + startvalue;
      };
      return String(new Array(this.valueOf())).split(",").map(fn);
    };

    Number.prototype.pretty = function (usa, noprecision) {
      const somenum = this;
      const dec = ("" + somenum).split(/[.,]/);
      const lendec = dec[1] ? dec[1].length : 0;
      const precision = lendec && !noprecision ? decPrecise(somenum, lendec) : dec[1];
      const sep = usa ? "," : ".";
      const decsep = usa ? "." : ",";

      // from http://stackoverflow.com/questions/10473994/javascript-adding-decimal-numbers-issue/10474209
      function decPrecise(d, l) {
        return String(d.toFixed(12)).split(/[.,]/)[1].substr(0, l);
      }

      function xsep(num, sep) {
        const n = String(num).split("")
        ;let i = -3;
        while (n.length + i > 0) {
          n.splice(i, 0, sep);
          i -= 4;
        }
        return n.join("");
      }

      return xsep(dec[0], sep) + (dec[1] ? decsep + precision : "");
    };

    Number.prototype.padLeft = function padLeft(len, padchr) {
      padchr = padchr || "0";
      const self = this + "";
      return Math.pow(10, (len || 2) - self.length)
        .toString()
        .replace(/0/g, padchr)
        .slice(1) + self;
    };

    // format static
    String.Format = function () {
      const args = Function.args2Arr(arguments);
      return "".format.apply(args[0], args.slice(1));
    };

    String.prototype.format = function () {
      return function (text, args) {
        const len = text.length;
        let index = 0,
          parsed = "",
          currToken = ""
        ;
        while (index < len) {
          if (text[index] === "{" && !isNaN(parseInt(text[index + 1], 10))) {
            index += 1;
            currToken = "";
            let istoken = true;
            while (text[index] !== "}") {
              if (isNaN(parseInt(text[index], 10))) {
                istoken = false;
                break;
              }
              currToken += text[index];
              index += 1;
            }
            parsed += istoken && args[+currToken] || "{" + currToken + (text[index] || "");
          } else {
            parsed += text[index];
          }
          index += 1;
        }
        return parsed;
      }(this, arguments);
    };

    String.prototype.repeat = function (n) {
      const s = this;
      let r = "";
      while (n--) {
        r += s;
      }
      return r;
    };

    // is character @ [atpos] upperCase?
    String.prototype.charIsUpper = function (atpos) {
      const chr = this.charAt(atpos);
      return /[A-Z]|[\u0080-\u024F]/.test(chr) && chr === chr.toUpperCase();
    };

    String.prototype.firstUp = function () {
      return this.slice(0, 1).toUpperCase() + this.slice(1).toLowerCase();
    };

    String.prototype.isValidEmail = function () {
      // should be sufficient
      return /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/.test(this);
    };

    String.prototype.reCleanup = function (encodeHTML) {
      const str = encodeHTML ? this.replace(/[\u0080-\u024F]/g, function (a) {
        return "&#" + a.charCodeAt(0) + ";";
      }) : this;
      return str.replace(/[?*|.+$\/]|\\/g, function (c) {
        return c === "\\" ? "" : "\\\\" + c;
      });
    };

    Array.prototype.toRE = function () {
      try {
        return RegExp.apply(null, this);
      }
      catch (e) {
        return /.*/;
      }
    };

    Array.toRE = function (arr) {
      return ([].toRE.call(arr));
    };

    Array.toCheckboxValues = (checkedIndex = 0, ...checked) => {
      return checked.reduce((reduced, value, i) => reduced.concat({
        check: i === checkedIndex ? 1 : 0,
        val: String(value)
      }), []);
    };

    // determine value frequencies in an array
    Array.frequencies = arr => {
      return arr.reduce((reduced, value) => {
        if (reduced[value]) {
          reduced[value] += 1;
        } else {
          reduced[value] = 1;
        }
        reduced.sum += value;
        return reduced;
      }, {sum: 0});
    };

    Object.print = Object.format = (thisObj, space = " ") =>
      `<pre class="code">${JSON.stringify(thisObj, null, space)}</pre>`;

    // see: http://codereview.stackexchange.com/questions/23317/istypeobj-gettypeobj-v0/23329#23329
    Object.ofType = Object.isOfType = thisObj => {
      if (!thisObj) {
        return false;
      }
      const test = arguments.length > 1 ? Function.args2Arr(arguments).slice(1) : [];
      const self = thisObj.constructor;
      return (test).length ?
        !!(test.filter(function (a) {
          return a === self;
        }).length) :
        self.name || (String(self).match(/^function\s*([^\s(]+)/im) || [0, "ANONYMOUS_CONSTRUCTOR"])[1];
    };

    extended = true;
    return extended;
  }

  return helperObj;
})(window, document);
