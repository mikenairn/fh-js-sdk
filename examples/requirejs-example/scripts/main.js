require(["scripts/feedhenry.js"], function(fh) {
  var config = {
    apiurl:"https://apps.feedhenry.example.com",
    appid: "EF_ERidviTlOPiGrt6pCOr6b",
    appkey: "EF_ERidviTlOPiGrt6pCOr6b",
    mode: "debug"
  };

  fh_init();

  document.getElementById('run_init_button').onclick = function() {
    fh_init();
  };

  function fh_init() {
    $fh.init(config,
            function(err, res) {
              if (err != null) {
                alert('An error occured: ' + err.statusText + ' : ' + err.message);
              } else {
                document.getElementById('initResponse').innerHTML = "<p>" + JSON.stringify(res) + "</p>";
              }
            });
  }

  document.getElementById('run_action_button').onclick = function() {
    var options = {
      guid: "EF_ERidviTlOPiGrt6pCOr6b",
      endpoint: "getConfig",
      params: {
        somekey: "someval"
      }
    };
    $fh.act(options,
            function(err, res) {
              if (err != null) {
                alert('An error occured: ' + err.statusText + ' : ' + err.message);
              } else {
                document.getElementById('actResponse').innerHTML = "<p>" + JSON.stringify(res) + "</p>";
              }
            });
  };

  document.getElementById('run_auth_button').onclick = function() {
    var options = {
      policyId: "FeedHenry",
      clientToken: "EF_ERidviTlOPiGrt6pCOr6b"
    };
    $fh.auth(options,
            function(err, res) {
              if (err != null) {
                alert('An error occured: ' + err.statusText + ' : ' + err.message);
              } else {
                document.getElementById('authResponse').innerHTML = "<p>" + JSON.stringify(res) + "</p>";
              }
            });
  };

});