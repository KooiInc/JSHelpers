var Helpers = (function() {
  return {
    report: reportHTML
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

}());
