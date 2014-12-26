// simple date extenter
// add languages if necessary
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
                         ,get: function(frag,get){ return get && 'get'+this[frag] || 'set'+this[frag]; }
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

    function dateAddByObj(args,utc){
      // default: seconds if args is a number
      if (+args) { return this.setSeconds(this.getSeconds()+(+args)); }
      utc = utc && 'UTC' || '';
      var  self = this
          ,add  = function (label, v) {
                   label = label && label.slice(0,1).toUpperCase()+label.slice(1).toLowerCase() || '';
                   label = /Fullyear/.test(label) && 'FullYear' || label;
                   return self['set'+utc+label] && self['set'+utc+label](self['get'+utc+label]()+v) || self;
                  };
      for (var l in args){ add(l, +args[l]) }
      return this;
    }

    function dateadd(f,val){
      if (f instanceof Object) {
       return dateAddByObj.call(this,f);
      }
      val = Number(val) || 1;
      var sf = fragments.get(f)
         ,gf = fragments.get(f,1);
      this[sf](this[gf]()+val);
      setCurrentValues.call(this);
      return this;
    }

    function d2frags(dat) {
      dat = dat || this;
      dat.cy || setCurrentValues.call(dat);
      var  lang = dat.language || 'EN'
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
            , M:   monthshort[lang].byArr[base.m - 1]
            , MM:  months[lang].byArr[base.m - 1]
            , wd:  weekdayshort[lang].byArr[base.dow]
            , WD:  weekdays[lang].byArr[base.dow]
            , WDU:  weekdays[lang].byArr[base.dow].firstUp()
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

    function padLeft(base, chr) {
      var len = (String(base || 10).length - String(this).length) + 1;
      return len > 0 ? new Array(len).join(chr || '0') + this : this;
     }

    // alternative
    function padLeftZero(len){
      var self = this+'';
      return (Math.pow( 10, (len || 2)-self.length) + self).slice(1);
    }

    function format(fstr) {
      fstr = fstr || this.strformat || 'yyyy/mm/dd hh:mi:ss';
      var dd = d2frags.call(this);
      return fstr.replace(dd.re, function (a) { return dd[a]; })
                 .replace(/~/g, '');
    }

    function chngLang(lang) {
     this.language = /^[EN][NL]$/i.test(lang) && lang.toUpperCase() || 'NL';
     return this;
    }

    Number.prototype.padLeft = Number.prototype.padLeft || padLeftZero;
    // add stuff to Date.prototype
    Date.prototype.setFormat      = function(f){this.strformat = f; return this;}
    Date.prototype.changeLanguage = chngLang;
    Date.prototype.set            = dateset;
    Date.prototype.add            = dateadd;
    Date.prototype.format         = format;
  }());
}