// insert into global namespace
$fh = {
  APP_MODE_DEBUG: 'debug',
  APP_MODE_RELEASE: 'release',
  APP_MODE_DISTRIBUTION: 'distribution',
  CLOUD_TYPE_FH: 'fh',
  CLOUD_TYPE_NODE: 'node'
};

(function() {
  var options;
  var cloudProps;

  $fh.init = function(opts, cb) {
    if (!opts.apiurl) {
      return f('init_no_apiurl');
    }
    if (!opts.appid) {
      return f('init_no_appId');
    }
    if (!opts.appkey) {
      return f('init_no_appKey');
    }
    var udid = $fh.__readCookieValue($fh._mock_uuid_cookie_name);
    if (null == udid) {
      udid = $fh.__createUUID();
      $fh.__createCookie($fh._mock_uuid_cookie_name, udid);
    }
    options = opts;

    var path = $fh.boxprefix + "app/init";
    var url = options.apiurl + path + "?appKey=" + options.appkey + "&appId=" + options.appid + "&deviceID=" + udid;

    return $fh.__ajax({
      "url": url,
      "method": "POST",
      success: function(res) {
        cloudProps = JSON.parse(JSON.stringify(res));
        cb(null, res);
      },
      error: function(req, statusText, error) {
        cb({
          "req": req,
          "statusText": statusText,
          "message": error
        });
      }
    });

  };

  $fh.act = function(opts, cb) {
    if (null == cloudProps) {
      return cb({
        "message": "Must call init first"
      });
    }

    if (!opts.endpoint) {
      return f('act_no_endpoint');
    }
    if (!opts.guid) {
      return f('act_no_guid');
    }

    //ToDo Should be selectable by mode
    var url = cloudProps.hosts.releaseCloudUrl + "/cloud/" + opts.endpoint;
    var params = opts.params || {};

    return $fh.__ajax({
      "url": url,
      "method": "POST",
      "data": JSON.stringify(opts),
      success: function(res) {
        cb(null, res);
      },
      error: function(req, statusText, error) {
        cb({
          "req": req,
          "statusText": statusText,
          "message": error
        });
      }
    });
  };

  $fh._current_auth_user = null;

  $fh.auth = function (opts, cb) {
    var req = {};
    var secure = true;
    if ('secure' in opts) {
      secure = opts.secure;
    }
    if (!opts.policyId) {
      return f('auth_no_policyId');
    }
    if (!opts.clientToken) {
      return f('auth_no_clientToken');
    }
    req.policyId = opts.policyId;
    req.clientToken = opts.clientToken;
    req.params = {};
    if (opts.params) {
      req.params = opts.params;
    }
    var endurl = req.params.endurl || "status=complete";
    $fh._current_auth_user = req;

    var udid = $fh.__readCookieValue($fh._mock_uuid_cookie_name);

    var path = $fh.boxprefix + "admin/authpolicy/auth";
    //ToDO Fix me
    var url = options.apiurl + path + "?policyId=" + opts.policyId + "&clientToken=" + opts.clientToken + "&device=" + udid + "&params={}";

    var params = opts.params || {};

    return $fh.__ajax({
      "url": url,
      "method": "POST",
      "data": JSON.stringify(params),
      success: function(res) {
        cb(null, res);
      },
      error: function(req, statusText, error) {
        cb({
          "req": req,
          "statusText": statusText,
          "message": error
        });
      }
    });


//    $fh.env({}, function (props) {
//      req.device = props.uuid;
//      $fh.call('admin/authpolicy/auth', req, function (res) {

//        if (res.status && res.status === "ok") {
//          if (res.url) {
//            document.addEventListener("webviewUrlChange", function(e) {
//              var url = e.data;
//              if (url.indexOf(endurl) > -1) {
//                $fh.webview({'act':'close'});
//                var i = url.split("?");
//                if (i.length == 2) {
//                  var queryString = i[1];
//                  var pairs = queryString.split("&");
//                  var qmap = {};
//                  for (var p = 0; p < pairs.length; p++) {
//                    var q = pairs[p];
//                    var qp = q.split("=");
//                    qmap[qp[0]] = qp[1];
//                  }
//                  if (qmap['result'] && qmap['result'] === 'success') {
//                    var sucRes = {'sessionToken': qmap['fh_auth_session'], 'authResponse' : JSON.parse(decodeURIComponent(qmap['authResponse']))};
//                    s(sucRes);
//                  } else {
//                    f({'message':qmap['message']});
//                  }
//                } else {
//                  f({'message':'unknown_error'});
//                }
//              }
//            });
//            $fh.webview({act:'open', url:res.url});
//          } else {
//            return s(res);
//          }
//        } else {
//          return f(res)
//        }

//      }, null, secure, function (msg, e) {
//        f({'message':msg});
//      });
//    },null)

  };

  function isSameOrigin(url) {
    var loc = window.location;
    // http://blog.stevenlevithan.com/archives/parseuri-split-url
    var uriParts = new RegExp("^(?:([^:/?#.]+):)?(?://)?(([^:/?#]*)(?::(\\d*))?)((/(?:[^?#](?![^?#/]*\\.[^?#/.]+(?:[\\?#]|$)))*/?)?([^?#/]*))?(?:\\?([^#]*))?(?:#(.*))?");

    var locParts = uriParts.exec(loc);
    var urlParts = uriParts.exec(url);

    return ((urlParts[1] == null || urlParts[1] === '') && // no protocol }
            (urlParts[3] == null || urlParts[3] === '') && // no domain   } - > relative url
            (urlParts[4] == null || urlParts[4] === '')) // no port       }
            || (locParts[1] === urlParts[1] && // protocol matches }
            locParts[3] === urlParts[3] && // domain matches   }-> absolute url
            locParts[4] === urlParts[4]); // port matches      }
  }


  // ** millicore/src/main/webapp/box/static/apps/libs/feedhenry/feedhenry-core.js **

  var __XMLHttpRequest__ = window.ActiveXObject ? ActiveXObject : XMLHttpRequest;
  var __useActiveXObject = window.ActiveXObject ? true : false;

  var __xhr = function () {
    if (__useActiveXObject) {
      return new __XMLHttpRequest__("Microsoft.XMLHTTP");
    } else {
      return new __XMLHttpRequest__();
    }
  };

  var __cb_counts = 0;

  var __load_script = function (url, callback) {
    var script;
    var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
    script = document.createElement("script");
    script.async = "async";
    script.src = url;
    script.type = "text/javascript";
    script.onload = script.onreadystatechange = function () {
      if (!script.readyState || /loaded|complete/.test(script.readyState)) {
        script.onload = script.onreadystatechange = null;
        if (head && script.parentNode) {
          head.removeChild(script);
        }
        script = undefined;
        if (callback && typeof callback === "function") {
          callback();
        }
      }
    };
    head.insertBefore(script, head.firstChild);
  };


  $fh.__ajax = function (options) {
    if (!isSameOrigin(options.url)) {
      options.dataType = 'jsonp';
    }

    var o = options ? options : {};
    var req;
    var url = o.url;
    var method = o.type || 'GET';
    var data = o.data || null;
    var timeoutTimer;
    var rurl = /\?/;
    var datatype = o.dataType === "jsonp" ? "jsonp" : "json";

    //prevent cache
    //url += (rurl.test(url) ? "&" : "?") + "fhts=" + (new Date()).getTime();

    var done = function (status, statusText, responseText) {
      var issuccess = false;
      var error;
      var res;
      if (status >= 200 && status <= 300 || status == 304) {
        if (status == 304) {
          statusText = "notmodified";
          issuccess = true;
        } else {
          if (o.dataType && o.dataType.indexOf('json') != -1) {
            try {
              if (typeof responseText === "string") {
                res = JSON.parse(responseText);
              } else {
                res = responseText;
              }
              issuccess = true;
            } catch (e) {
              issuccess = false;
              statusText = "parseerror";
              error = e;
            }
          } else {
            res = responseText;
            issuccess = true;
          }
        }
      } else {
        error = statusText;
        if (!statusText || status) {
          statusText = "error";
          if (status < 0) {
            status = 0;
          }
        }
      }
      if (issuccess) {
        req = undefined;
        if (o.success && typeof o.success === 'function') {
          o.success(res);
        }
      } else {
        if (o.error && typeof o.error === 'function') {
          o.error(req, statusText, error);
        }
      }
    };

    var types = {
      'json': function () {
        req = __xhr();
        req.open(method, url, true);
        if (o.contentType) {
          req.setRequestHeader('Content-Type', o.contentType);
        }
        req.setRequestHeader('X-Request-With', 'XMLHttpRequest');
        var handler = function () {
          if (req.readyState == 4) {
            if (timeoutTimer) {
              clearTimeout(timeoutTimer);
            }
            var statusText;
            try {
              statusText = req.statusText;
            } catch (e) {
              statusText = "";
            }
            done(req.status, req.statusText, req.responseText);
          }
        };

        req.onreadystatechange = handler;

        req.send(data);
      },

      'jsonp': function () {
        var callbackId = 'fhcb' + __cb_counts++;
        window[callbackId] = function (response) {
          if (timeoutTimer) {
            clearTimeout(timeoutTimer);
          }
          done(200, "", response);
          window[callbackId] = undefined;
          try {
            delete window[callbackId]
          } catch(e) {
          }
        };
        url += (rurl.test(url) ? "&" : "?") + "_callback=" + callbackId;
        __load_script(url);
      }
    };

    if (o.timeout > 0) {
      timeoutTimer = setTimeout(function () {
        if (req) {
          req.abort();
        }
        done(0, 'timeout');
      }, o.timeout);
    }

    types[datatype]();
  };

  // As we're not on-device, we can't talk to anything other than FeedHenry for our cloud needs (x domain issue),
  // so params structure don't change
  $fh._getCloudParams = function (params) {
    return params;
  };

  $fh._addRequestParams = function (params, callback) {

    $fh.env({}, function (props) {
      var fhParams = {};
//      fhParams.cuid = props.uuid;
//      fhParams.destination = props.destination;
//      fhParams.domain = props.domain;
//      fhParams.version = props.version;

      params = params || {};
//      params.__fh = fhParams;
//      params = $fh._getCloudParams(params);

      callback(params);
    });
  };

  $fh._getRequestUrl = function (host, path, secure) {
    if(!host) {
      return $fh.boxprefix + path;
    } else {
      return host + $fh.boxprefix + path;
    }
  };

  //These were $fh.legacy.*
  $fh.fh_timeout = 20000;
  $fh.boxprefix = '/box/srv/1.1/';

  $fh.call = function (path, params, success, xhr, secure, error) {
    try {

      $fh._addRequestParams(params, function (req) {
        var to = $fh.fh_timeout;
        if (typeof req.timeout != "undefined") {
          to = req.timeout;
          req.timeout = undefined;
        }
        var reqstring = JSON.stringify(req);

        alert(reqstring);

        // Check if the path needs to be converted to a request url, otherwise use it as is
        var url = path;
        if (path.indexOf('http') < 0) {
          url = $fh._getRequestUrl(params.host, path, secure);
        }

        var ajaxParams = {
          type: "POST",
          url: url,
          dataType: 'jsonp',
          contentType: 'application/json',
          cache: false,
          data: reqstring,
          timeout: to,
          success: function (res) {
            if (success) {
              success(res);
            }
          },
          error: function (xhr, msg, err) {
            alert("error");
//            $fh.legacy.error(xhr, msg, err, error);
          }
        };

        //ajaxParams.xhr = $fh.xhr;
        $fh.__ajax(ajaxParams);
      });

    } catch (e) {
      console.log(e);
      var url = $fh.legacy.hostname + $fh.legacy.pathprefix + path; //TODO Is $fh.legacy.hostname correct here?
      try {
        // Facebook javascript api
        var ajax = new Ajax();
        ajax.responseType = Ajax.JSON;
        ajax.ondone = function (res) {
          // console.log(JSON.stringify(res));
          if (success) {
            success(res);
          }
        };
        var reqtext = JSON.stringify(req);
        var data = {
          'fh_fb_data': reqtext
        };
        // ajax.onerror = $fh.error;
        ajax.post(url, data);
      } catch (ex) {

      }
    }
  };

  // ** millicore/src/main/webapp/box/static/apps/libs/feedhenry/feedhenry-core.js **

  // ** millicore/src/main/webapp/box/static/apps/libs/feedhenry/feedhenry-api.js **

  var defaultargs = {
    success: function () {
    },
    failure: function () {
    },
    params: {}
  };

  var handleargs = function (inargs, defaultparams, applyto) {
    var outargs = [null, null, null];
    var origargs = [null, null, null];
    var numargs = inargs.length;

    if (2 < numargs) {
      origargs[0] = inargs[numargs - 3];
      origargs[1] = inargs[numargs - 2];
      origargs[2] = inargs[numargs - 1];
    } else if (2 == numargs) {
      origargs[1] = inargs[0];
      origargs[2] = inargs[1];
    } else if (1 == numargs) {
      origargs[2] = inargs[0];
    }

    var i = 0,
            j = 0;
    for (; i < 3; i++) {
      var a = origargs[i];
      var ta = typeof a;
      //console.log('iter i:'+i+' j:'+j+' ta:'+ta);
      if (a && 0 == j && ('object' == ta || 'boolean' == ta)) {
        //console.log('object i:'+i+' j:'+j+' ta:'+ta);
        outargs[j++] = a;
      } else if (a && 'function' == ta) {
        j = 0 == j ? 1 : j;
        //console.log('function i:'+i+' j:'+j+' ta:'+ta);
        outargs[j++] = a;
      }
    }

    if (null == outargs[0]) {
      outargs[0] = defaultparams ? defaultparams : defaultargs.params;
    } else {
      var paramsarg = outargs[0];
      paramsarg._defaults = [];
      for (var n in defaultparams) {
        if (defaultparams.hasOwnProperty(n)) {
          if (typeof paramsarg[n] === "undefined") {  //we don't want to use !paramsarg[n] here because the parameter could exists in the argument and it could be false
            paramsarg[n] = defaultparams[n];
            paramsarg._defaults.push(n);
          }
        }
      }
    }

    outargs[1] = null == outargs[1] ? defaultargs.success : outargs[1];
    outargs[2] = null == outargs[2] ? defaultargs.failure : outargs[2];

    applyto(outargs[0], outargs[1], outargs[2]);
  };


  $fh.env = function () {
    handleargs(arguments, {}, function (p, s, f) {
      // flat property set - no sub objects!
      __env({}, function (destEnv) {
//        destEnv.domain = $fh.legacy.domain;
//        destEnv.application = $fh.legacy.widget.guid;
//        destEnv.template = null; // template instance
//        destEnv.instance = $fh.legacy.instance;
//        destEnv.install = null; // tbd
//        destEnv.version = $fh.legacy.widget.version;
//        destEnv.destination = $fh.legacy.destinationName;
//        destEnv.subscriber = $fh.legacy.user.id;
//        destEnv.agent = navigator.userAgent || 'unknown';
        s(destEnv);
      }, null);
    });
  };

  //renamed from $fh.__dest__.env
  function __env(p, s, f) {
    s({
      height: window.innerHeight,
      width: window.innerWidth,
      uuid: function () {
        var uuid = $fh.__readCookieValue($fh._mock_uuid_cookie_name);
        if (null == uuid) {
          uuid = $fh.__createUUID();
          $fh.__createCookie($fh._mock_uuid_cookie_name, uuid);
        }
        return uuid;
      }()
    });
  }

  $fh.__readCookieValue = function (cookie_name) {
    var name_str = cookie_name + "=";
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var c = cookies[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(name_str) == 0) {
        return c.substring(name_str.length, c.length);
      }
    }
    return null;
  };

  $fh.__createCookie = function (cookie_name, cookie_value) {
    var date = new Date();
    date.setTime(date.getTime() + 36500 * 24 * 60 * 60 * 1000); //100 years
    var expires = "; expires=" + date.toGMTString();
    document.cookie = cookie_name + "=" + cookie_value + expires + "; path = /";
  };

  $fh.__createUUID = function () {
    //from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    //based on RFC 4122, section 4.4 (Algorithms for creating UUID from truely random pr pseudo-random number)
    var s = [];
    var hexDigitals = "0123456789ABCDEF";
    for (var i = 0; i < 32; i++) {
      s[i] = hexDigitals.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[12] = "4";
    s[16] = hexDigitals.substr((s[16] & 0x3) | 0x8, 1);
    var uuid = s.join("");
    return uuid;
  };

  $fh._mock_uuid_cookie_name = "mock_uuid";
  $fh._current_auth_user = null;

  // ** millicore/src/main/webapp/box/static/apps/libs/feedhenry/feedhenry-api.js **

  return $fh;
})();