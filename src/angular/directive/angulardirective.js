/**
 * directive base
 * @type {{}}
 */
(function () {

  function create(HashMap) {
    return {
      /**
       * 用来存储实例化的多个对象
       */
      _instances: new HashMap(),
      /**
       * 添加一个实例
       * @param key
       * @param value
       */
      addInstance: function (key, value) {
        this._instances.put(key, value);
      },
      /**
       * 获取实例
       * @param key
       */
      getInstance: function (key) {
        return this._instances.get(key);
      },
      /**
       * 通过Directive的Id获取Directive对象
       * @param id
       */
      getDirectiveById: function (id) {
        return Tool.namespace(id);
      }
    }
  }

  if (typeof define === "function" && (define.amd || define.cmd)) {
    define("AngularDirective", ["HashMap"], function (HashMap) {
      return create(HashMap);
    });
  } else {
    window.AngularDirective = create(HashMap);
  }
})();