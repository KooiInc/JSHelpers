var Helpers = (function() {
  return {
    report: reportHTML,
    isObj: isPlainObject,
    useJQ: loadJQ
  }

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

}());
