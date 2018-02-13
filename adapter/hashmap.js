(function () {

  function obj2str(o) {
    var r = [];
    if (typeof o == "string")
      return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
    if (typeof o == "object") {
      for (var i in o)
        r.push("\"" + i + "\":" + obj2str(o[i]));
      if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
        r.push("toString:" + o.toString.toString());
      }
      r = "{" + r.join() + "}";
      return r;
    }
    return o.toString();
  }

  var Class = function () {
    this.size = 0;
    this.entry = {};
  }

  Class.prototype = {
    put: function (key, value) {
      this.entry[key] = value;
      this.size++;
    },
    putAll: function (map) {
      if (typeof map == "object" && !map.sort) {
        for (var key in map) {
          this.put(key, map[key]);
        }
      } else {
        throw "输入类型不正确，必须是HashMap类型！";
      }
    },
    get: function (key) {
      return this.entry[key];
    },
    remove: function (key) {
      if (this.size == 0)
        return;
      delete this.entry[key];
      this.size--;
    },
    containsKey: function (key) {
      if (this.entry[key]) {
        return true;
      }
      return false;
    },
    containsValue: function (value) {
      for (var key in this.entry) {
        if (this.entry[key] == value) {
          return true;
        }
      }
      return false;
    },
    clear: function () {
      this.entry = {};
      this.size = 0;
    },
    isEmpty: function () {
      return this.size == 0;
    },
    size: function () {
      return this.size;
    },
    keySet: function () {
      var keys = [];
      for (var key in this.entry) {
        keys.push(key);
      }
      return keys;
    },
    entrySet: function () {
      var entrys = [];
      for (var key in this.entry) {
        var et = {};
        et[key] = this.entry[key];
        entrys.push(et);
      }
      return entrys;
    },
    values: function () {
      var values = [];
      for (var key in this.entry) {
        values.push(this.entry[key]);
      }
      return values;
    },
    each: function (cb) {
      for (var key in this.entry) {
        cb.call(this, key, this.entry[key]);
      }
    },
    toString: function () {
      return obj2str(this.entry);
    }

  }

  if (typeof module != 'undefined' && module.exports) {
    module.exports = Class;
  }
  else if (typeof define === 'function' && (define.amd || define.cmd)) {
    define("HashMap", function () {
      return Class;
    });
  } else {
    window.HashMap = Class;
  }

})();