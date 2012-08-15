define(function() {
  var options;

  var fh = {
    init: function (opts) {
      options = opts;
    },
    call: function(fn, data, cb) {
      if (options.host == null) {
        return cb({
          "message": "Set host first in init() call e.g. init({host:'https://domain-appId-dev.feedhenry.net'})"
        });
      }

      cb = 'function' !== typeof cb ? data : cb;
      data = 'object' !== typeof data ? {} : data;

      return ajax({
        "url": options.host + "/cloud/" + fn,
        "method": "POST",
        "data": JSON.stringify(data),
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
    },
    init2: function(url, cb) {
      return ajax({
        "url": url,
        "method": "POST",
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
    }
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

  function ajax(options) {
    // see if we need to use jsonp
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
    var done = function(status, statusText, responseText) {
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

    var __cb_counts = 0;
    var types = {
      json: function() {
        req = (window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest());
        req.open(method, url, true);
        if (o.contentType) {
          req.setRequestHeader('Content-Type', o.contentType);
        }
        req.setRequestHeader('X-Request-With', 'XMLHttpRequest');
        var handler = function() {
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
      jsonp: function() {
        var callbackId = 'fhcb' + __cb_counts++;
        window[callbackId] = function(response) {
          if (timeoutTimer) {
            clearTimeout(timeoutTimer);
          }
          done(200, "", response);
          window[callbackId] = undefined;
          try {
            delete window[callbackId];
          } catch (e) {}
        };
        url += (rurl.test(url) ? "&" : "?") + "_callback=" + callbackId;
        // append params to querystring
        url += '&params=' + data;
        loadScript(url);
      }
    };
    if (o.timeout > 0) {
      timeoutTimer = setTimeout(function() {
        if (req) {
          req.abort();
        }
        done(0, 'timeout');
      }, o.timeout);
    }
    types[datatype]();
  }

  function loadScript(url, callback) {
    var script;
    var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
    script = document.createElement("script");
    script.async = "async";
    script.src = url;
    script.type = "text/javascript";
    script.onload = script.onreadystatechange = function() {
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
  }

  return fh;
});