require(["scripts/fh-js.js"], function(fh) {

  document.getElementById('run_button').onclick = function() {

    fh.init2("https://apps.feedhenry.example.com/box/srv/1.1/app/init?appKey=EF_ERidviTlOPiGrt6pCOr6b&deviceID=1234&appId=EF_ERidviTlOPiGrt6pCOr6b",
            function(err, res) {
      if (err != null) {
        alert('An error occured: ' + err.statusText + ' : ' + err.message);
      } else {
        alert(JSON.stringify(res));
        document.getElementById('cloudConfig').innerHTML = "<p>" + JSON.stringify(res) + "</p>";
      }
    });

//    fh.init({
//      "host": "http://apps-uyz1ik3hmek9zhegqlf4obuy-dev.dynofarm.me:9080"
//    });
//
//    fh.call("getConfig", {
//      "testkey": "testval"
//    }, function(err, res) {
//      if (err != null) {
//        alert('An error occured: ' + err.statusText + ' : ' + err.message);
//      } else {
//        alert(JSON.stringify(res.config));
//        document.getElementById('cloudConfig').innerHTML = "<p>" + JSON.stringify(res.config) + "</p>";
//      }
//    });
  };
});