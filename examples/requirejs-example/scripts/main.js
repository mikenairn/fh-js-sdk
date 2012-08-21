require(["scripts/feedhenry.js"], function() {
  var config = {
    host:"https://testing.deacon.henora.net",
    appid: "vH_oeCyq37FPMNVDJZo_pWW0",
    appkey: "vH_oeCyq37FPMNVDJZo_pWW0",
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
            }, function(err){
              alert(err);
            });
  }

  document.getElementById('run_action_button').onclick = function() {
    var options = {
      act: "getConfig",
      req: {
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
      clientToken: "vH_oeCyq37FPMNVDJZo_pWW0",
      endRedirectUrl: window.location.href,
      authCallback: "authLoggin",
      params: {
        userId: "test1",
        password: "password"
      }
    };
    $fh.auth(options,
            function(res) {
              document.getElementById('authResponse').innerHTML = "<p>" + JSON.stringify(res) + "</p>";
            }, function(err){
              alert(err);
            });
  };

});

function authLoggin(res){
  
}