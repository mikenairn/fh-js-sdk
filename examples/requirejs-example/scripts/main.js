require(["scripts/feedhenry.js"], function(fh) {
  var config = {
    host:"https://engtest.every.henora.net",
    appid: "FRSxYsC1o5kke8USg1EXBQ25",
    appkey: "a29ff8af58715e9c7e3d5c84d2e6d368db8cf21b",
    mode: "debug"
  };

  //fh_init();
  $fh.init(config, function(){}, function(){});

  document.getElementById('run_init_button').onclick = function() {
    fh_init();
  };

  function fh_init() {
    $fh.init(config,
            function(res) {
              document.getElementById('initResponse').innerHTML = "<p>" + JSON.stringify(res) + "</p>";
            }, function(){

            });
  }

  document.getElementById('run_action_button').onclick = function() {
    var options = {
      act: "getConfig",
      params: {
        somekey: "someval"
      }
    };
    $fh.act(options,
            function(res) {
              document.getElementById('actResponse').innerHTML = "<p>" + JSON.stringify(res) + "</p>";
            }, function(err){
              alert(err);
            });
  };

  document.getElementById('run_auth_button').onclick = function() {
    var options = {
      policyId: "FeedHenry",
      clientToken: "EF_ERidviTlOPiGrt6pCOr6b"
    };
    $fh.auth(options,
            function(res) {
              document.getElementById('authResponse').innerHTML = "<p>" + JSON.stringify(res) + "</p>";
            }, function(err){
              alert(err);
            });
  };

});