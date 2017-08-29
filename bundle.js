(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var DSHttpAdapter = require('js-data-http')

function DSJsonApiAdapter (options) {
  var defaultOptions = {
    serialize: DSJsonApiAdapter.serialize,
    deserialize: DSJsonApiAdapter.deserialize,
    queryTransform: DSJsonApiAdapter.queryTransform
  }

  options = _.extend({}, defaultOptions, options)

  this.defaults = options
  this.http = new DSHttpAdapter(options)
}

/*	==========================================================================
	 Prototype Methods
	========================================================================== */
DSJsonApiAdapter.prototype.create = function (definition, attrs, options) {
  return this.http.create(definition, attrs, options)
}

DSJsonApiAdapter.prototype.find = function (definition, id, options) {
  return this.http.find(definition, id, options)
}

DSJsonApiAdapter.prototype.findAll = function (definition, params, options) {
  return this.http.findAll(definition, params, options)
}

DSJsonApiAdapter.prototype.update = function (definition, id, attrs, options) {
  options.method = 'PATCH'
  return this.http.update(definition, id, attrs, options)
}

DSJsonApiAdapter.prototype.updateAll = function (definition, attrs, params, options) {
  return this.http.updateAll(definition, attrs, params, options)
}

DSJsonApiAdapter.prototype.destroy = function (definition, id, options) {
  return this.http.destroy(definition, id, options)
}

DSJsonApiAdapter.prototype.destroyAll = function (definition, params, options) {
  return this.http.destroyAll(definition, params, options)
}

/*	==========================================================================
	 Static Methods
	========================================================================== */
DSJsonApiAdapter.serialize = function serialize (resourceConfig, data) {
  return {
    data: {
      id: data.id,
      type: resourceConfig.name,
      attributes: _.omit(data, ['id'])
    }
  }
}

DSJsonApiAdapter.deserialize = function (resourceConfig, response) {
  // Add the include data first
  if (_.has(response, 'data.include')) {
    if (!Array.isArray(response.data.include)) {
      response.data.include = [response.data.include]
    }

    response.data.include.map(injectInclude.bind(this, resourceConfig))
  }

  var deserializedData = null

  if (_.has(response, 'data.data')) {
    if (!Array.isArray(response.data.data)) {
      response.data.data = [response.data.data]
    }

    deserializedData = response.data.data.map(deserializeData.bind(this, resourceConfig))
  }

  return deserializedData
}

DSJsonApiAdapter.queryTransform = function (resourceConfig, params) {
  var returnParams = {}

  if (params.offset) _.set(returnParams, 'offset', params.offset)
  if (params.limit) _.set(returnParams, 'limit', params.limit)
  if (params.where) {
    _.forEach(params.where, function (value, key) {
      _.set(returnParams, key, value)
    })
  }

  return returnParams
}

/*	==========================================================================
	 Helper Functions
	========================================================================== */
function deserializeData (resourceConfig, data) {
  if (!data) {
    return
  }

  if (data.relationships) {
    _.forEach(data.relationships, function (value) {
      var relations = [].concat(value.data)

      _.forEach(relations, function (relation) {
        if (!data[ relation.type + 'Ids' ]) {
          data[ relation.type + 'Ids' ] = []
        }

        data[ relation.type + 'Ids' ].push(relation.id)
      })
    })

    delete data.relationships
  }

  // Move the attributes to the top level
  _.extend(data, data.attributes)
  delete data.attributes

  // Remove the type
  delete data.type

  return data
}

function injectInclude (resourceConfig, data) {
  data = deserializeData(data)

  var type = data.type
  delete data.type

  resourceConfig.getResource(type).inject(data)
}

module.exports = DSJsonApiAdapter

},{"js-data-http":2}],2:[function(require,module,exports){
/*!
 * js-data-http
 * @version 2.1.0 - Homepage <http://www.js-data.io/docs/dshttpadapter>
 * @author Jason Dobry <jason.dobry@gmail.com>
 * @copyright (c) 2014-2015 Jason Dobry 
 * @license MIT <https://github.com/js-data/js-data-http/blob/master/LICENSE>
 * 
 * @overview Http adapter for js-data.
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("js-data"));
	else if(typeof define === 'function' && define.amd)
		define(["js-data"], factory);
	else if(typeof exports === 'object')
		exports["DSHttpAdapter"] = factory(require("js-data"));
	else
		root["DSHttpAdapter"] = factory(root["JSData"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var JSData = __webpack_require__(1);
	var axios = null;

	try {
	  axios = __webpack_require__(2);
	} catch (e) {}

	var DSUtils = JSData.DSUtils;
	var deepMixIn = DSUtils.deepMixIn;
	var removeCircular = DSUtils.removeCircular;
	var copy = DSUtils.copy;
	var makePath = DSUtils.makePath;
	var isString = DSUtils.isString;
	var isNumber = DSUtils.isNumber;

	var Defaults = (function () {
	  function Defaults() {
	    _classCallCheck(this, Defaults);
	  }

	  _createClass(Defaults, [{
	    key: 'queryTransform',
	    value: function queryTransform(resourceConfig, params) {
	      return params;
	    }
	  }, {
	    key: 'deserialize',
	    value: function deserialize(resourceConfig, data) {
	      return data ? 'data' in data ? data.data : data : data;
	    }
	  }, {
	    key: 'serialize',
	    value: function serialize(resourceConfig, data) {
	      return data;
	    }
	  }, {
	    key: 'log',
	    value: function log() {}
	  }, {
	    key: 'error',
	    value: function error() {}
	  }]);

	  return Defaults;
	})();

	var defaultsPrototype = Defaults.prototype;

	defaultsPrototype.basePath = '';

	defaultsPrototype.forceTrailingSlash = '';

	defaultsPrototype.httpConfig = {};

	defaultsPrototype.verbsUseBasePath = false;

	var DSHttpAdapter = (function () {
	  function DSHttpAdapter(options) {
	    _classCallCheck(this, DSHttpAdapter);

	    this.defaults = new Defaults();
	    if (console) {
	      this.defaults.log = function (a, b) {
	        return console[typeof console.info === 'function' ? 'info' : 'log'](a, b);
	      };
	    }
	    if (console) {
	      this.defaults.error = function (a, b) {
	        return console[typeof console.error === 'function' ? 'error' : 'log'](a, b);
	      };
	    }
	    deepMixIn(this.defaults, options);
	    this.http = options.http || axios;
	  }

	  _createClass(DSHttpAdapter, [{
	    key: 'getEndpoint',
	    value: function getEndpoint(resourceConfig, id, options) {
	      var _this2 = this;

	      options = options || {};
	      options.params = options.params || {};

	      var item = undefined;
	      var parentKey = resourceConfig.parentKey;
	      var endpoint = options.hasOwnProperty('endpoint') ? options.endpoint : resourceConfig.endpoint;
	      var parentField = resourceConfig.parentField;
	      var parentDef = resourceConfig.getResource(resourceConfig.parent);
	      var parentId = options.params[parentKey];

	      if (parentId === false || !parentKey || !parentDef) {
	        if (parentId === false) {
	          delete options.params[parentKey];
	        }
	        return endpoint;
	      } else {
	        delete options.params[parentKey];

	        if (DSUtils._sn(id)) {
	          item = resourceConfig.get(id);
	        } else if (DSUtils._o(id)) {
	          item = id;
	        }

	        if (item) {
	          parentId = parentId || item[parentKey] || (item[parentField] ? item[parentField][parentDef.idAttribute] : null);
	        }

	        if (parentId) {
	          var _ret = (function () {
	            delete options.endpoint;
	            var _options = {};
	            DSUtils.forOwn(options, function (value, key) {
	              _options[key] = value;
	            });
	            return {
	              v: DSUtils.makePath(_this2.getEndpoint(parentDef, parentId, DSUtils._(parentDef, _options)), parentId, endpoint)
	            };
	          })();

	          if (typeof _ret === 'object') return _ret.v;
	        } else {
	          return endpoint;
	        }
	      }
	    }
	  }, {
	    key: 'getPath',
	    value: function getPath(method, resourceConfig, id, options) {
	      var _this = this;
	      options = options || {};
	      if (isString(options.urlPath)) {
	        return makePath.apply(DSUtils, [options.basePath || _this.defaults.basePath || resourceConfig.basePath, options.urlPath]);
	      } else {
	        var args = [options.basePath || _this.defaults.basePath || resourceConfig.basePath, this.getEndpoint(resourceConfig, isString(id) || isNumber(id) || method === 'create' ? id : null, options)];
	        if (method === 'find' || method === 'update' || method === 'destroy') {
	          args.push(id);
	        }
	        return makePath.apply(DSUtils, args);
	      }
	    }
	  }, {
	    key: 'HTTP',
	    value: function HTTP(config) {
	      var _this = this;
	      var start = new Date();
	      config = copy(config);
	      config = deepMixIn(config, _this.defaults.httpConfig);
	      if (!('verbsUseBasePath' in config)) {
	        config.verbsUseBasePath = _this.defaults.verbsUseBasePath;
	      }
	      if (!config.urlOverride && config.verbsUseBasePath) {
	        config.url = makePath(config.basePath || _this.defaults.basePath, config.url);
	      }
	      if (_this.defaults.forceTrailingSlash && config.url[config.url.length - 1] !== '/' && !config.urlOverride) {
	        config.url += '/';
	      }
	      if (typeof config.data === 'object') {
	        config.data = removeCircular(config.data);
	      }
	      config.method = config.method.toUpperCase();
	      var suffix = config.suffix || _this.defaults.suffix;
	      if (suffix && config.url.substr(config.url.length - suffix.length) !== suffix && !config.urlOverride) {
	        config.url += suffix;
	      }

	      // logs the HTTP response
	      function logResponse(data) {
	        // examine the data object
	        if (data instanceof Error) {
	          // log the Error object
	          _this.defaults.error('FAILED: ' + (data.message || 'Unknown Error'), data);
	          return DSUtils.Promise.reject(data);
	        } else if (typeof data === 'object') {
	          var str = start.toUTCString() + ' - ' + config.method + ' ' + config.url + ' - ' + data.status + ' ' + (new Date().getTime() - start.getTime()) + 'ms';

	          if (data.status >= 200 && data.status < 300) {
	            if (_this.defaults.log) {
	              _this.defaults.log(str, data);
	            }
	            return data;
	          } else {
	            if (_this.defaults.error) {
	              _this.defaults.error('FAILED: ' + str, data);
	            }
	            return DSUtils.Promise.reject(data);
	          }
	        } else {
	          // unknown type for 'data' that is not an Object or Error
	          _this.defaults.error('FAILED', data);
	          return DSUtils.Promise.reject(data);
	        }
	      }

	      if (!this.http) {
	        throw new Error('You have not configured this adapter with an http library!');
	      }

	      return this.http(config).then(logResponse, logResponse);
	    }
	  }, {
	    key: 'GET',
	    value: function GET(url, config) {
	      config = config || {};
	      config.method = config.method || 'get';
	      config.urlOverride = !!config.url;
	      config.url = config.url || url;
	      return this.HTTP(config);
	    }
	  }, {
	    key: 'POST',
	    value: function POST(url, attrs, config) {
	      config = config || {};
	      config.method = config.method || 'post';
	      config.urlOverride = !!config.url;
	      config.url = config.url || url;
	      config.data = config.data || attrs;
	      return this.HTTP(config);
	    }
	  }, {
	    key: 'PUT',
	    value: function PUT(url, attrs, config) {
	      config = config || {};
	      config.method = config.method || 'put';
	      config.urlOverride = !!config.url;
	      config.url = config.url || url;
	      config.data = config.data || attrs;
	      return this.HTTP(config);
	    }
	  }, {
	    key: 'DEL',
	    value: function DEL(url, config) {
	      config = config || {};
	      config.method = config.method || 'delete';
	      config.urlOverride = !!config.url;
	      config.url = config.url || url;
	      return this.HTTP(config);
	    }
	  }, {
	    key: 'find',
	    value: function find(resourceConfig, id, options) {
	      var _this = this;
	      options = options ? copy(options) : {};
	      options.suffix = options.suffix || resourceConfig.suffix;
	      options.params = options.params || {};
	      options.params = _this.defaults.queryTransform(resourceConfig, options.params);
	      return _this.GET(_this.getPath('find', resourceConfig, id, options), options).then(function (data) {
	        var item = (options.deserialize ? options.deserialize : _this.defaults.deserialize)(resourceConfig, data);
	        return !item ? DSUtils.Promise.reject(new Error('Not Found!')) : item;
	      });
	    }
	  }, {
	    key: 'findAll',
	    value: function findAll(resourceConfig, params, options) {
	      var _this = this;
	      options = options ? copy(options) : {};
	      options.suffix = options.suffix || resourceConfig.suffix;
	      options.params = options.params || {};
	      if (params) {
	        params = _this.defaults.queryTransform(resourceConfig, params);
	        deepMixIn(options.params, params);
	      }
	      return _this.GET(_this.getPath('findAll', resourceConfig, params, options), options).then(function (data) {
	        return (options.deserialize ? options.deserialize : _this.defaults.deserialize)(resourceConfig, data);
	      });
	    }
	  }, {
	    key: 'create',
	    value: function create(resourceConfig, attrs, options) {
	      var _this = this;
	      options = options ? copy(options) : {};
	      options.suffix = options.suffix || resourceConfig.suffix;
	      options.params = options.params || {};
	      options.params = _this.defaults.queryTransform(resourceConfig, options.params);
	      return _this.POST(_this.getPath('create', resourceConfig, attrs, options), options.serialize ? options.serialize(resourceConfig, attrs) : _this.defaults.serialize(resourceConfig, attrs), options).then(function (data) {
	        return (options.deserialize ? options.deserialize : _this.defaults.deserialize)(resourceConfig, data);
	      });
	    }
	  }, {
	    key: 'update',
	    value: function update(resourceConfig, id, attrs, options) {
	      var _this = this;
	      options = options ? copy(options) : {};
	      options.suffix = options.suffix || resourceConfig.suffix;
	      options.params = options.params || {};
	      options.params = _this.defaults.queryTransform(resourceConfig, options.params);
	      return _this.PUT(_this.getPath('update', resourceConfig, id, options), options.serialize ? options.serialize(resourceConfig, attrs) : _this.defaults.serialize(resourceConfig, attrs), options).then(function (data) {
	        return (options.deserialize ? options.deserialize : _this.defaults.deserialize)(resourceConfig, data);
	      });
	    }
	  }, {
	    key: 'updateAll',
	    value: function updateAll(resourceConfig, attrs, params, options) {
	      var _this = this;
	      options = options ? copy(options) : {};
	      options.suffix = options.suffix || resourceConfig.suffix;
	      options.params = options.params || {};
	      if (params) {
	        params = _this.defaults.queryTransform(resourceConfig, params);
	        deepMixIn(options.params, params);
	      }
	      return this.PUT(_this.getPath('updateAll', resourceConfig, attrs, options), options.serialize ? options.serialize(resourceConfig, attrs) : _this.defaults.serialize(resourceConfig, attrs), options).then(function (data) {
	        return (options.deserialize ? options.deserialize : _this.defaults.deserialize)(resourceConfig, data);
	      });
	    }
	  }, {
	    key: 'destroy',
	    value: function destroy(resourceConfig, id, options) {
	      var _this = this;
	      options = options ? copy(options) : {};
	      options.suffix = options.suffix || resourceConfig.suffix;
	      options.params = options.params || {};
	      options.params = _this.defaults.queryTransform(resourceConfig, options.params);
	      return _this.DEL(_this.getPath('destroy', resourceConfig, id, options), options).then(function (data) {
	        return (options.deserialize ? options.deserialize : _this.defaults.deserialize)(resourceConfig, data);
	      });
	    }
	  }, {
	    key: 'destroyAll',
	    value: function destroyAll(resourceConfig, params, options) {
	      var _this = this;
	      options = options ? copy(options) : {};
	      options.suffix = options.suffix || resourceConfig.suffix;
	      options.params = options.params || {};
	      if (params) {
	        params = _this.defaults.queryTransform(resourceConfig, params);
	        deepMixIn(options.params, params);
	      }
	      return this.DEL(_this.getPath('destroyAll', resourceConfig, params, options), options).then(function (data) {
	        return (options.deserialize ? options.deserialize : _this.defaults.deserialize)(resourceConfig, data);
	      });
	    }
	  }]);

	  return DSHttpAdapter;
	})();

	module.exports = DSHttpAdapter;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(3);

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var defaults = __webpack_require__(4);
	var utils = __webpack_require__(5);
	var deprecatedMethod = __webpack_require__(6);
	var dispatchRequest = __webpack_require__(7);
	var InterceptorManager = __webpack_require__(15);

	// Polyfill ES6 Promise if needed
	(function () {
	  // webpack is being used to set es6-promise to the native Promise
	  // for the standalone build. It's necessary to make sure polyfill exists.
	  var P = __webpack_require__(16);
	  if (P && typeof P.polyfill === 'function') {
	    P.polyfill();
	  }
	})();

	var axios = module.exports = function axios(config) {
	  config = utils.merge({
	    method: 'get',
	    headers: {},
	    transformRequest: defaults.transformRequest,
	    transformResponse: defaults.transformResponse
	  }, config);

	  // Don't allow overriding defaults.withCredentials
	  config.withCredentials = config.withCredentials || defaults.withCredentials;

	  // Hook up interceptors middleware
	  var chain = [dispatchRequest, undefined];
	  var promise = Promise.resolve(config);

	  axios.interceptors.request.forEach(function (interceptor) {
	    chain.unshift(interceptor.fulfilled, interceptor.rejected);
	  });

	  axios.interceptors.response.forEach(function (interceptor) {
	    chain.push(interceptor.fulfilled, interceptor.rejected);
	  });

	  while (chain.length) {
	    promise = promise.then(chain.shift(), chain.shift());
	  }

	  // Provide alias for success
	  promise.success = function success(fn) {
	    deprecatedMethod('success', 'then', 'https://github.com/mzabriskie/axios/blob/master/README.md#response-api');

	    promise.then(function(response) {
	      fn(response.data, response.status, response.headers, response.config);
	    });
	    return promise;
	  };

	  // Provide alias for error
	  promise.error = function error(fn) {
	    deprecatedMethod('error', 'catch', 'https://github.com/mzabriskie/axios/blob/master/README.md#response-api');

	    promise.then(null, function(response) {
	      fn(response.data, response.status, response.headers, response.config);
	    });
	    return promise;
	  };

	  return promise;
	};

	// Expose defaults
	axios.defaults = defaults;

	// Expose all/spread
	axios.all = function (promises) {
	  return Promise.all(promises);
	};
	axios.spread = __webpack_require__(21);

	// Expose interceptors
	axios.interceptors = {
	  request: new InterceptorManager(),
	  response: new InterceptorManager()
	};

	// Provide aliases for supported request methods
	(function () {
	  function createShortMethods() {
	    utils.forEach(arguments, function (method) {
	      axios[method] = function (url, config) {
	        return axios(utils.merge(config || {}, {
	          method: method,
	          url: url
	        }));
	      };
	    });
	  }

	  function createShortMethodsWithData() {
	    utils.forEach(arguments, function (method) {
	      axios[method] = function (url, data, config) {
	        return axios(utils.merge(config || {}, {
	          method: method,
	          url: url,
	          data: data
	        }));
	      };
	    });
	  }

	  createShortMethods('delete', 'get', 'head');
	  createShortMethodsWithData('post', 'put', 'patch');
	})();


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(5);

	var PROTECTION_PREFIX = /^\)\]\}',?\n/;
	var DEFAULT_CONTENT_TYPE = {
	  'Content-Type': 'application/x-www-form-urlencoded'
	};

	module.exports = {
	  transformRequest: [function (data, headers) {
	    if(utils.isFormData(data)) {
	      return data;
	    }
	    if (utils.isArrayBuffer(data)) {
	      return data;
	    }
	    if (utils.isArrayBufferView(data)) {
	      return data.buffer;
	    }
	    if (utils.isObject(data) && !utils.isFile(data) && !utils.isBlob(data)) {
	      // Set application/json if no Content-Type has been specified
	      if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
	        headers['Content-Type'] = 'application/json;charset=utf-8';
	      }
	      return JSON.stringify(data);
	    }
	    return data;
	  }],

	  transformResponse: [function (data) {
	    if (typeof data === 'string') {
	      data = data.replace(PROTECTION_PREFIX, '');
	      try {
	        data = JSON.parse(data);
	      } catch (e) {}
	    }
	    return data;
	  }],

	  headers: {
	    common: {
	      'Accept': 'application/json, text/plain, */*'
	    },
	    patch: utils.merge(DEFAULT_CONTENT_TYPE),
	    post: utils.merge(DEFAULT_CONTENT_TYPE),
	    put: utils.merge(DEFAULT_CONTENT_TYPE)
	  },

	  xsrfCookieName: 'XSRF-TOKEN',
	  xsrfHeaderName: 'X-XSRF-TOKEN'
	};


/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	/*global toString:true*/

	// utils is a library of generic helper functions non-specific to axios

	var toString = Object.prototype.toString;

	/**
	 * Determine if a value is an Array
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an Array, otherwise false
	 */
	function isArray(val) {
	  return toString.call(val) === '[object Array]';
	}

	/**
	 * Determine if a value is an ArrayBuffer
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
	 */
	function isArrayBuffer(val) {
	  return toString.call(val) === '[object ArrayBuffer]';
	}

	/**
	 * Determine if a value is a FormData
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an FormData, otherwise false
	 */
	function isFormData(val) {
	  return toString.call(val) === '[object FormData]';
	}

	/**
	 * Determine if a value is a view on an ArrayBuffer
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
	 */
	function isArrayBufferView(val) {
	  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
	    return ArrayBuffer.isView(val);
	  } else {
	    return (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
	  }
	}

	/**
	 * Determine if a value is a String
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a String, otherwise false
	 */
	function isString(val) {
	  return typeof val === 'string';
	}

	/**
	 * Determine if a value is a Number
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Number, otherwise false
	 */
	function isNumber(val) {
	  return typeof val === 'number';
	}

	/**
	 * Determine if a value is undefined
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if the value is undefined, otherwise false
	 */
	function isUndefined(val) {
	  return typeof val === 'undefined';
	}

	/**
	 * Determine if a value is an Object
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an Object, otherwise false
	 */
	function isObject(val) {
	  return val !== null && typeof val === 'object';
	}

	/**
	 * Determine if a value is a Date
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Date, otherwise false
	 */
	function isDate(val) {
	  return toString.call(val) === '[object Date]';
	}

	/**
	 * Determine if a value is a File
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a File, otherwise false
	 */
	function isFile(val) {
	  return toString.call(val) === '[object File]';
	}

	/**
	 * Determine if a value is a Blob
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Blob, otherwise false
	 */
	function isBlob(val) {
	  return toString.call(val) === '[object Blob]';
	}

	/**
	 * Trim excess whitespace off the beginning and end of a string
	 *
	 * @param {String} str The String to trim
	 * @returns {String} The String freed of excess whitespace
	 */
	function trim(str) {
	  return str.replace(/^\s*/, '').replace(/\s*$/, '');
	}

	/**
	 * Iterate over an Array or an Object invoking a function for each item.
	 *
	 * If `obj` is an Array or arguments callback will be called passing
	 * the value, index, and complete array for each item.
	 *
	 * If 'obj' is an Object callback will be called passing
	 * the value, key, and complete object for each property.
	 *
	 * @param {Object|Array} obj The object to iterate
	 * @param {Function} fn The callback to invoke for each item
	 */
	function forEach(obj, fn) {
	  // Don't bother if no value provided
	  if (obj === null || typeof obj === 'undefined') {
	    return;
	  }

	  // Check if obj is array-like
	  var isArrayLike = isArray(obj) || (typeof obj === 'object' && !isNaN(obj.length));

	  // Force an array if not already something iterable
	  if (typeof obj !== 'object' && !isArrayLike) {
	    obj = [obj];
	  }

	  // Iterate over array values
	  if (isArrayLike) {
	    for (var i = 0, l = obj.length; i < l; i++) {
	      fn.call(null, obj[i], i, obj);
	    }
	  }
	  // Iterate over object keys
	  else {
	    for (var key in obj) {
	      if (obj.hasOwnProperty(key)) {
	        fn.call(null, obj[key], key, obj);
	      }
	    }
	  }
	}

	/**
	 * Accepts varargs expecting each argument to be an object, then
	 * immutably merges the properties of each object and returns result.
	 *
	 * When multiple objects contain the same key the later object in
	 * the arguments list will take precedence.
	 *
	 * Example:
	 *
	 * ```js
	 * var result = merge({foo: 123}, {foo: 456});
	 * console.log(result.foo); // outputs 456
	 * ```
	 *
	 * @param {Object} obj1 Object to merge
	 * @returns {Object} Result of all merge properties
	 */
	function merge(/*obj1, obj2, obj3, ...*/) {
	  var result = {};
	  forEach(arguments, function (obj) {
	    forEach(obj, function (val, key) {
	      result[key] = val;
	    });
	  });
	  return result;
	}

	module.exports = {
	  isArray: isArray,
	  isArrayBuffer: isArrayBuffer,
	  isFormData: isFormData,
	  isArrayBufferView: isArrayBufferView,
	  isString: isString,
	  isNumber: isNumber,
	  isObject: isObject,
	  isUndefined: isUndefined,
	  isDate: isDate,
	  isFile: isFile,
	  isBlob: isBlob,
	  forEach: forEach,
	  merge: merge,
	  trim: trim
	};


/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Supply a warning to the developer that a method they are using
	 * has been deprecated.
	 *
	 * @param {string} method The name of the deprecated method
	 * @param {string} [instead] The alternate method to use if applicable
	 * @param {string} [docs] The documentation URL to get further details
	 */
	module.exports = function deprecatedMethod(method, instead, docs) {
	  try {
	    console.warn(
	      'DEPRECATED method `' + method + '`.' +
	      (instead ? ' Use `' + instead + '` instead.' : '') +
	      ' This method will be removed in a future release.');

	    if (docs) {
	      console.warn('For more information about usage see ' + docs);
	    }
	  } catch (e) {}
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	/**
	 * Dispatch a request to the server using whichever adapter
	 * is supported by the current environment.
	 *
	 * @param {object} config The config that is to be used for the request
	 * @returns {Promise} The Promise to be fulfilled
	 */
	module.exports = function dispatchRequest(config) {
	  return new Promise(function (resolve, reject) {
	    try {
	      // For browsers use XHR adapter
	      if (typeof window !== 'undefined') {
	        __webpack_require__(9)(resolve, reject, config);
	      }
	      // For node use HTTP adapter
	      else if (typeof process !== 'undefined') {
	        __webpack_require__(9)(resolve, reject, config);
	      }
	    } catch (e) {
	      reject(e);
	    }
	  });
	};


	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ },
/* 8 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/*global ActiveXObject:true*/

	var defaults = __webpack_require__(4);
	var utils = __webpack_require__(5);
	var buildUrl = __webpack_require__(10);
	var cookies = __webpack_require__(11);
	var parseHeaders = __webpack_require__(12);
	var transformData = __webpack_require__(13);
	var urlIsSameOrigin = __webpack_require__(14);

	module.exports = function xhrAdapter(resolve, reject, config) {
	  // Transform request data
	  var data = transformData(
	    config.data,
	    config.headers,
	    config.transformRequest
	  );

	  // Merge headers
	  var requestHeaders = utils.merge(
	    defaults.headers.common,
	    defaults.headers[config.method] || {},
	    config.headers || {}
	  );

	  if (utils.isFormData(data)) {
	    delete requestHeaders['Content-Type']; // Let the browser set it
	  }

	  // Create the request
	  var request = new (XMLHttpRequest || ActiveXObject)('Microsoft.XMLHTTP');
	  request.open(config.method.toUpperCase(), buildUrl(config.url, config.params), true);

	  // Listen for ready state
	  request.onreadystatechange = function () {
	    if (request && request.readyState === 4) {
	      // Prepare the response
	      var responseHeaders = parseHeaders(request.getAllResponseHeaders());
	      var responseData = ['text', ''].indexOf(config.responseType || '') !== -1 ? request.responseText : request.response;
	      var response = {
	        data: transformData(
	          responseData,
	          responseHeaders,
	          config.transformResponse
	        ),
	        status: request.status,
	        statusText: request.statusText,
	        headers: responseHeaders,
	        config: config
	      };

	      // Resolve or reject the Promise based on the status
	      (request.status >= 200 && request.status < 300 ?
	        resolve :
	        reject)(response);

	      // Clean up request
	      request = null;
	    }
	  };

	  // Add xsrf header
	  var xsrfValue = urlIsSameOrigin(config.url) ?
	      cookies.read(config.xsrfCookieName || defaults.xsrfCookieName) :
	      undefined;
	  if (xsrfValue) {
	    requestHeaders[config.xsrfHeaderName || defaults.xsrfHeaderName] = xsrfValue;
	  }

	  // Add headers to the request
	  utils.forEach(requestHeaders, function (val, key) {
	    // Remove Content-Type if data is undefined
	    if (!data && key.toLowerCase() === 'content-type') {
	      delete requestHeaders[key];
	    }
	    // Otherwise add header to the request
	    else {
	      request.setRequestHeader(key, val);
	    }
	  });

	  // Add withCredentials to request if needed
	  if (config.withCredentials) {
	    request.withCredentials = true;
	  }

	  // Add responseType to request if needed
	  if (config.responseType) {
	    try {
	      request.responseType = config.responseType;
	    } catch (e) {
	      if (request.responseType !== 'json') {
	        throw e;
	      }
	    }
	  }

	  if (utils.isArrayBuffer(data)) {
	    data = new DataView(data);
	  }

	  // Send the request
	  request.send(data);
	};


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(5);

	function encode(val) {
	  return encodeURIComponent(val).
	    replace(/%40/gi, '@').
	    replace(/%3A/gi, ':').
	    replace(/%24/g, '$').
	    replace(/%2C/gi, ',').
	    replace(/%20/g, '+');
	}

	/**
	 * Build a URL by appending params to the end
	 *
	 * @param {string} url The base of the url (e.g., http://www.google.com)
	 * @param {object} [params] The params to be appended
	 * @returns {string} The formatted url
	 */
	module.exports = function buildUrl(url, params) {
	  if (!params) {
	    return url;
	  }

	  var parts = [];

	  utils.forEach(params, function (val, key) {
	    if (val === null || typeof val === 'undefined') {
	      return;
	    }
	    if (!utils.isArray(val)) {
	      val = [val];
	    }

	    utils.forEach(val, function (v) {
	      if (utils.isDate(v)) {
	        v = v.toISOString();
	      }
	      else if (utils.isObject(v)) {
	        v = JSON.stringify(v);
	      }
	      parts.push(encode(key) + '=' + encode(v));
	    });
	  });

	  if (parts.length > 0) {
	    url += (url.indexOf('?') === -1 ? '?' : '&') + parts.join('&');
	  }

	  return url;
	};


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(5);

	module.exports = {
	  write: function write(name, value, expires, path, domain, secure) {
	    var cookie = [];
	    cookie.push(name + '=' + encodeURIComponent(value));

	    if (utils.isNumber(expires)) {
	      cookie.push('expires=' + new Date(expires).toGMTString());
	    }

	    if (utils.isString(path)) {
	      cookie.push('path=' + path);
	    }

	    if (utils.isString(domain)) {
	      cookie.push('domain=' + domain);
	    }

	    if (secure === true) {
	      cookie.push('secure');
	    }

	    document.cookie = cookie.join('; ');
	  },

	  read: function read(name) {
	    var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
	    return (match ? decodeURIComponent(match[3]) : null);
	  },

	  remove: function remove(name) {
	    this.write(name, '', Date.now() - 86400000);
	  }
	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(5);

	/**
	 * Parse headers into an object
	 *
	 * ```
	 * Date: Wed, 27 Aug 2014 08:58:49 GMT
	 * Content-Type: application/json
	 * Connection: keep-alive
	 * Transfer-Encoding: chunked
	 * ```
	 *
	 * @param {String} headers Headers needing to be parsed
	 * @returns {Object} Headers parsed into an object
	 */
	module.exports = function parseHeaders(headers) {
	  var parsed = {}, key, val, i;

	  if (!headers) { return parsed; }

	  utils.forEach(headers.split('\n'), function(line) {
	    i = line.indexOf(':');
	    key = utils.trim(line.substr(0, i)).toLowerCase();
	    val = utils.trim(line.substr(i + 1));

	    if (key) {
	      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
	    }
	  });

	  return parsed;
	};


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(5);

	/**
	 * Transform the data for a request or a response
	 *
	 * @param {Object|String} data The data to be transformed
	 * @param {Array} headers The headers for the request or response
	 * @param {Array|Function} fns A single function or Array of functions
	 * @returns {*} The resulting transformed data
	 */
	module.exports = function transformData(data, headers, fns) {
	  utils.forEach(fns, function (fn) {
	    data = fn(data, headers);
	  });

	  return data;
	};


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(5);
	var msie = /(msie|trident)/i.test(navigator.userAgent);
	var urlParsingNode = document.createElement('a');
	var originUrl;

	/**
	 * Parse a URL to discover it's components
	 *
	 * @param {String} url The URL to be parsed
	 * @returns {Object}
	 */
	function urlResolve(url) {
	  var href = url;

	  if (msie) {
	    // IE needs attribute set twice to normalize properties
	    urlParsingNode.setAttribute('href', href);
	    href = urlParsingNode.href;
	  }

	  urlParsingNode.setAttribute('href', href);

	  // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
	  return {
	    href: urlParsingNode.href,
	    protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
	    host: urlParsingNode.host,
	    search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
	    hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
	    hostname: urlParsingNode.hostname,
	    port: urlParsingNode.port,
	    pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
	              urlParsingNode.pathname :
	              '/' + urlParsingNode.pathname
	  };
	}

	originUrl = urlResolve(window.location.href);

	/**
	 * Determine if a URL shares the same origin as the current location
	 *
	 * @param {String} requestUrl The URL to test
	 * @returns {boolean} True if URL shares the same origin, otherwise false
	 */
	module.exports = function urlIsSameOrigin(requestUrl) {
	  var parsed = (utils.isString(requestUrl)) ? urlResolve(requestUrl) : requestUrl;
	  return (parsed.protocol === originUrl.protocol &&
	        parsed.host === originUrl.host);
	};


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(5);

	function InterceptorManager() {
	  this.handlers = [];
	}

	/**
	 * Add a new interceptor to the stack
	 *
	 * @param {Function} fulfilled The function to handle `then` for a `Promise`
	 * @param {Function} rejected The function to handle `reject` for a `Promise`
	 *
	 * @return {Number} An ID used to remove interceptor later
	 */
	InterceptorManager.prototype.use = function (fulfilled, rejected) {
	  this.handlers.push({
	    fulfilled: fulfilled,
	    rejected: rejected
	  });
	  return this.handlers.length - 1;
	};

	/**
	 * Remove an interceptor from the stack
	 *
	 * @param {Number} id The ID that was returned by `use`
	 */
	InterceptorManager.prototype.eject = function (id) {
	  if (this.handlers[id]) {
	    this.handlers[id] = null;
	  }
	};

	/**
	 * Iterate over all the registered interceptors
	 *
	 * This method is particularly useful for skipping over any
	 * interceptors that may have become `null` calling `remove`.
	 *
	 * @param {Function} fn The function to call for each interceptor
	 */
	InterceptorManager.prototype.forEach = function (fn) {
	  utils.forEach(this.handlers, function (h) {
	    if (h !== null) {
	      fn(h);
	    }
	  });
	};

	module.exports = InterceptorManager;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var require;var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(process, setImmediate, global, module) {/*!
	 * @overview es6-promise - a tiny implementation of Promises/A+.
	 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
	 * @license   Licensed under MIT license
	 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
	 * @version   2.3.0
	 */

	(function() {
	    "use strict";
	    function lib$es6$promise$utils$$objectOrFunction(x) {
	      return typeof x === 'function' || (typeof x === 'object' && x !== null);
	    }

	    function lib$es6$promise$utils$$isFunction(x) {
	      return typeof x === 'function';
	    }

	    function lib$es6$promise$utils$$isMaybeThenable(x) {
	      return typeof x === 'object' && x !== null;
	    }

	    var lib$es6$promise$utils$$_isArray;
	    if (!Array.isArray) {
	      lib$es6$promise$utils$$_isArray = function (x) {
	        return Object.prototype.toString.call(x) === '[object Array]';
	      };
	    } else {
	      lib$es6$promise$utils$$_isArray = Array.isArray;
	    }

	    var lib$es6$promise$utils$$isArray = lib$es6$promise$utils$$_isArray;
	    var lib$es6$promise$asap$$len = 0;
	    var lib$es6$promise$asap$$toString = {}.toString;
	    var lib$es6$promise$asap$$vertxNext;
	    var lib$es6$promise$asap$$customSchedulerFn;

	    var lib$es6$promise$asap$$asap = function asap(callback, arg) {
	      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len] = callback;
	      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len + 1] = arg;
	      lib$es6$promise$asap$$len += 2;
	      if (lib$es6$promise$asap$$len === 2) {
	        // If len is 2, that means that we need to schedule an async flush.
	        // If additional callbacks are queued before the queue is flushed, they
	        // will be processed by this flush that we are scheduling.
	        if (lib$es6$promise$asap$$customSchedulerFn) {
	          lib$es6$promise$asap$$customSchedulerFn(lib$es6$promise$asap$$flush);
	        } else {
	          lib$es6$promise$asap$$scheduleFlush();
	        }
	      }
	    }

	    function lib$es6$promise$asap$$setScheduler(scheduleFn) {
	      lib$es6$promise$asap$$customSchedulerFn = scheduleFn;
	    }

	    function lib$es6$promise$asap$$setAsap(asapFn) {
	      lib$es6$promise$asap$$asap = asapFn;
	    }

	    var lib$es6$promise$asap$$browserWindow = (typeof window !== 'undefined') ? window : undefined;
	    var lib$es6$promise$asap$$browserGlobal = lib$es6$promise$asap$$browserWindow || {};
	    var lib$es6$promise$asap$$BrowserMutationObserver = lib$es6$promise$asap$$browserGlobal.MutationObserver || lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver;
	    var lib$es6$promise$asap$$isNode = typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

	    // test for web worker but not in IE10
	    var lib$es6$promise$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
	      typeof importScripts !== 'undefined' &&
	      typeof MessageChannel !== 'undefined';

	    // node
	    function lib$es6$promise$asap$$useNextTick() {
	      var nextTick = process.nextTick;
	      // node version 0.10.x displays a deprecation warning when nextTick is used recursively
	      // setImmediate should be used instead instead
	      var version = process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);
	      if (Array.isArray(version) && version[1] === '0' && version[2] === '10') {
	        nextTick = setImmediate;
	      }
	      return function() {
	        nextTick(lib$es6$promise$asap$$flush);
	      };
	    }

	    // vertx
	    function lib$es6$promise$asap$$useVertxTimer() {
	      return function() {
	        lib$es6$promise$asap$$vertxNext(lib$es6$promise$asap$$flush);
	      };
	    }

	    function lib$es6$promise$asap$$useMutationObserver() {
	      var iterations = 0;
	      var observer = new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush);
	      var node = document.createTextNode('');
	      observer.observe(node, { characterData: true });

	      return function() {
	        node.data = (iterations = ++iterations % 2);
	      };
	    }

	    // web worker
	    function lib$es6$promise$asap$$useMessageChannel() {
	      var channel = new MessageChannel();
	      channel.port1.onmessage = lib$es6$promise$asap$$flush;
	      return function () {
	        channel.port2.postMessage(0);
	      };
	    }

	    function lib$es6$promise$asap$$useSetTimeout() {
	      return function() {
	        setTimeout(lib$es6$promise$asap$$flush, 1);
	      };
	    }

	    var lib$es6$promise$asap$$queue = new Array(1000);
	    function lib$es6$promise$asap$$flush() {
	      for (var i = 0; i < lib$es6$promise$asap$$len; i+=2) {
	        var callback = lib$es6$promise$asap$$queue[i];
	        var arg = lib$es6$promise$asap$$queue[i+1];

	        callback(arg);

	        lib$es6$promise$asap$$queue[i] = undefined;
	        lib$es6$promise$asap$$queue[i+1] = undefined;
	      }

	      lib$es6$promise$asap$$len = 0;
	    }

	    function lib$es6$promise$asap$$attemptVertex() {
	      try {
	        var r = require;
	        var vertx = __webpack_require__(19);
	        lib$es6$promise$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext;
	        return lib$es6$promise$asap$$useVertxTimer();
	      } catch(e) {
	        return lib$es6$promise$asap$$useSetTimeout();
	      }
	    }

	    var lib$es6$promise$asap$$scheduleFlush;
	    // Decide what async method to use to triggering processing of queued callbacks:
	    if (lib$es6$promise$asap$$isNode) {
	      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useNextTick();
	    } else if (lib$es6$promise$asap$$BrowserMutationObserver) {
	      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMutationObserver();
	    } else if (lib$es6$promise$asap$$isWorker) {
	      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMessageChannel();
	    } else if (lib$es6$promise$asap$$browserWindow === undefined && "function" === 'function') {
	      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$attemptVertex();
	    } else {
	      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useSetTimeout();
	    }

	    function lib$es6$promise$$internal$$noop() {}

	    var lib$es6$promise$$internal$$PENDING   = void 0;
	    var lib$es6$promise$$internal$$FULFILLED = 1;
	    var lib$es6$promise$$internal$$REJECTED  = 2;

	    var lib$es6$promise$$internal$$GET_THEN_ERROR = new lib$es6$promise$$internal$$ErrorObject();

	    function lib$es6$promise$$internal$$selfFullfillment() {
	      return new TypeError("You cannot resolve a promise with itself");
	    }

	    function lib$es6$promise$$internal$$cannotReturnOwn() {
	      return new TypeError('A promises callback cannot return that same promise.');
	    }

	    function lib$es6$promise$$internal$$getThen(promise) {
	      try {
	        return promise.then;
	      } catch(error) {
	        lib$es6$promise$$internal$$GET_THEN_ERROR.error = error;
	        return lib$es6$promise$$internal$$GET_THEN_ERROR;
	      }
	    }

	    function lib$es6$promise$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
	      try {
	        then.call(value, fulfillmentHandler, rejectionHandler);
	      } catch(e) {
	        return e;
	      }
	    }

	    function lib$es6$promise$$internal$$handleForeignThenable(promise, thenable, then) {
	       lib$es6$promise$asap$$asap(function(promise) {
	        var sealed = false;
	        var error = lib$es6$promise$$internal$$tryThen(then, thenable, function(value) {
	          if (sealed) { return; }
	          sealed = true;
	          if (thenable !== value) {
	            lib$es6$promise$$internal$$resolve(promise, value);
	          } else {
	            lib$es6$promise$$internal$$fulfill(promise, value);
	          }
	        }, function(reason) {
	          if (sealed) { return; }
	          sealed = true;

	          lib$es6$promise$$internal$$reject(promise, reason);
	        }, 'Settle: ' + (promise._label || ' unknown promise'));

	        if (!sealed && error) {
	          sealed = true;
	          lib$es6$promise$$internal$$reject(promise, error);
	        }
	      }, promise);
	    }

	    function lib$es6$promise$$internal$$handleOwnThenable(promise, thenable) {
	      if (thenable._state === lib$es6$promise$$internal$$FULFILLED) {
	        lib$es6$promise$$internal$$fulfill(promise, thenable._result);
	      } else if (thenable._state === lib$es6$promise$$internal$$REJECTED) {
	        lib$es6$promise$$internal$$reject(promise, thenable._result);
	      } else {
	        lib$es6$promise$$internal$$subscribe(thenable, undefined, function(value) {
	          lib$es6$promise$$internal$$resolve(promise, value);
	        }, function(reason) {
	          lib$es6$promise$$internal$$reject(promise, reason);
	        });
	      }
	    }

	    function lib$es6$promise$$internal$$handleMaybeThenable(promise, maybeThenable) {
	      if (maybeThenable.constructor === promise.constructor) {
	        lib$es6$promise$$internal$$handleOwnThenable(promise, maybeThenable);
	      } else {
	        var then = lib$es6$promise$$internal$$getThen(maybeThenable);

	        if (then === lib$es6$promise$$internal$$GET_THEN_ERROR) {
	          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$GET_THEN_ERROR.error);
	        } else if (then === undefined) {
	          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
	        } else if (lib$es6$promise$utils$$isFunction(then)) {
	          lib$es6$promise$$internal$$handleForeignThenable(promise, maybeThenable, then);
	        } else {
	          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
	        }
	      }
	    }

	    function lib$es6$promise$$internal$$resolve(promise, value) {
	      if (promise === value) {
	        lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$selfFullfillment());
	      } else if (lib$es6$promise$utils$$objectOrFunction(value)) {
	        lib$es6$promise$$internal$$handleMaybeThenable(promise, value);
	      } else {
	        lib$es6$promise$$internal$$fulfill(promise, value);
	      }
	    }

	    function lib$es6$promise$$internal$$publishRejection(promise) {
	      if (promise._onerror) {
	        promise._onerror(promise._result);
	      }

	      lib$es6$promise$$internal$$publish(promise);
	    }

	    function lib$es6$promise$$internal$$fulfill(promise, value) {
	      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }

	      promise._result = value;
	      promise._state = lib$es6$promise$$internal$$FULFILLED;

	      if (promise._subscribers.length !== 0) {
	        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, promise);
	      }
	    }

	    function lib$es6$promise$$internal$$reject(promise, reason) {
	      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }
	      promise._state = lib$es6$promise$$internal$$REJECTED;
	      promise._result = reason;

	      lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publishRejection, promise);
	    }

	    function lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
	      var subscribers = parent._subscribers;
	      var length = subscribers.length;

	      parent._onerror = null;

	      subscribers[length] = child;
	      subscribers[length + lib$es6$promise$$internal$$FULFILLED] = onFulfillment;
	      subscribers[length + lib$es6$promise$$internal$$REJECTED]  = onRejection;

	      if (length === 0 && parent._state) {
	        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, parent);
	      }
	    }

	    function lib$es6$promise$$internal$$publish(promise) {
	      var subscribers = promise._subscribers;
	      var settled = promise._state;

	      if (subscribers.length === 0) { return; }

	      var child, callback, detail = promise._result;

	      for (var i = 0; i < subscribers.length; i += 3) {
	        child = subscribers[i];
	        callback = subscribers[i + settled];

	        if (child) {
	          lib$es6$promise$$internal$$invokeCallback(settled, child, callback, detail);
	        } else {
	          callback(detail);
	        }
	      }

	      promise._subscribers.length = 0;
	    }

	    function lib$es6$promise$$internal$$ErrorObject() {
	      this.error = null;
	    }

	    var lib$es6$promise$$internal$$TRY_CATCH_ERROR = new lib$es6$promise$$internal$$ErrorObject();

	    function lib$es6$promise$$internal$$tryCatch(callback, detail) {
	      try {
	        return callback(detail);
	      } catch(e) {
	        lib$es6$promise$$internal$$TRY_CATCH_ERROR.error = e;
	        return lib$es6$promise$$internal$$TRY_CATCH_ERROR;
	      }
	    }

	    function lib$es6$promise$$internal$$invokeCallback(settled, promise, callback, detail) {
	      var hasCallback = lib$es6$promise$utils$$isFunction(callback),
	          value, error, succeeded, failed;

	      if (hasCallback) {
	        value = lib$es6$promise$$internal$$tryCatch(callback, detail);

	        if (value === lib$es6$promise$$internal$$TRY_CATCH_ERROR) {
	          failed = true;
	          error = value.error;
	          value = null;
	        } else {
	          succeeded = true;
	        }

	        if (promise === value) {
	          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$cannotReturnOwn());
	          return;
	        }

	      } else {
	        value = detail;
	        succeeded = true;
	      }

	      if (promise._state !== lib$es6$promise$$internal$$PENDING) {
	        // noop
	      } else if (hasCallback && succeeded) {
	        lib$es6$promise$$internal$$resolve(promise, value);
	      } else if (failed) {
	        lib$es6$promise$$internal$$reject(promise, error);
	      } else if (settled === lib$es6$promise$$internal$$FULFILLED) {
	        lib$es6$promise$$internal$$fulfill(promise, value);
	      } else if (settled === lib$es6$promise$$internal$$REJECTED) {
	        lib$es6$promise$$internal$$reject(promise, value);
	      }
	    }

	    function lib$es6$promise$$internal$$initializePromise(promise, resolver) {
	      try {
	        resolver(function resolvePromise(value){
	          lib$es6$promise$$internal$$resolve(promise, value);
	        }, function rejectPromise(reason) {
	          lib$es6$promise$$internal$$reject(promise, reason);
	        });
	      } catch(e) {
	        lib$es6$promise$$internal$$reject(promise, e);
	      }
	    }

	    function lib$es6$promise$enumerator$$Enumerator(Constructor, input) {
	      var enumerator = this;

	      enumerator._instanceConstructor = Constructor;
	      enumerator.promise = new Constructor(lib$es6$promise$$internal$$noop);

	      if (enumerator._validateInput(input)) {
	        enumerator._input     = input;
	        enumerator.length     = input.length;
	        enumerator._remaining = input.length;

	        enumerator._init();

	        if (enumerator.length === 0) {
	          lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
	        } else {
	          enumerator.length = enumerator.length || 0;
	          enumerator._enumerate();
	          if (enumerator._remaining === 0) {
	            lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
	          }
	        }
	      } else {
	        lib$es6$promise$$internal$$reject(enumerator.promise, enumerator._validationError());
	      }
	    }

	    lib$es6$promise$enumerator$$Enumerator.prototype._validateInput = function(input) {
	      return lib$es6$promise$utils$$isArray(input);
	    };

	    lib$es6$promise$enumerator$$Enumerator.prototype._validationError = function() {
	      return new Error('Array Methods must be provided an Array');
	    };

	    lib$es6$promise$enumerator$$Enumerator.prototype._init = function() {
	      this._result = new Array(this.length);
	    };

	    var lib$es6$promise$enumerator$$default = lib$es6$promise$enumerator$$Enumerator;

	    lib$es6$promise$enumerator$$Enumerator.prototype._enumerate = function() {
	      var enumerator = this;

	      var length  = enumerator.length;
	      var promise = enumerator.promise;
	      var input   = enumerator._input;

	      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
	        enumerator._eachEntry(input[i], i);
	      }
	    };

	    lib$es6$promise$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
	      var enumerator = this;
	      var c = enumerator._instanceConstructor;

	      if (lib$es6$promise$utils$$isMaybeThenable(entry)) {
	        if (entry.constructor === c && entry._state !== lib$es6$promise$$internal$$PENDING) {
	          entry._onerror = null;
	          enumerator._settledAt(entry._state, i, entry._result);
	        } else {
	          enumerator._willSettleAt(c.resolve(entry), i);
	        }
	      } else {
	        enumerator._remaining--;
	        enumerator._result[i] = entry;
	      }
	    };

	    lib$es6$promise$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
	      var enumerator = this;
	      var promise = enumerator.promise;

	      if (promise._state === lib$es6$promise$$internal$$PENDING) {
	        enumerator._remaining--;

	        if (state === lib$es6$promise$$internal$$REJECTED) {
	          lib$es6$promise$$internal$$reject(promise, value);
	        } else {
	          enumerator._result[i] = value;
	        }
	      }

	      if (enumerator._remaining === 0) {
	        lib$es6$promise$$internal$$fulfill(promise, enumerator._result);
	      }
	    };

	    lib$es6$promise$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
	      var enumerator = this;

	      lib$es6$promise$$internal$$subscribe(promise, undefined, function(value) {
	        enumerator._settledAt(lib$es6$promise$$internal$$FULFILLED, i, value);
	      }, function(reason) {
	        enumerator._settledAt(lib$es6$promise$$internal$$REJECTED, i, reason);
	      });
	    };
	    function lib$es6$promise$promise$all$$all(entries) {
	      return new lib$es6$promise$enumerator$$default(this, entries).promise;
	    }
	    var lib$es6$promise$promise$all$$default = lib$es6$promise$promise$all$$all;
	    function lib$es6$promise$promise$race$$race(entries) {
	      /*jshint validthis:true */
	      var Constructor = this;

	      var promise = new Constructor(lib$es6$promise$$internal$$noop);

	      if (!lib$es6$promise$utils$$isArray(entries)) {
	        lib$es6$promise$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
	        return promise;
	      }

	      var length = entries.length;

	      function onFulfillment(value) {
	        lib$es6$promise$$internal$$resolve(promise, value);
	      }

	      function onRejection(reason) {
	        lib$es6$promise$$internal$$reject(promise, reason);
	      }

	      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
	        lib$es6$promise$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
	      }

	      return promise;
	    }
	    var lib$es6$promise$promise$race$$default = lib$es6$promise$promise$race$$race;
	    function lib$es6$promise$promise$resolve$$resolve(object) {
	      /*jshint validthis:true */
	      var Constructor = this;

	      if (object && typeof object === 'object' && object.constructor === Constructor) {
	        return object;
	      }

	      var promise = new Constructor(lib$es6$promise$$internal$$noop);
	      lib$es6$promise$$internal$$resolve(promise, object);
	      return promise;
	    }
	    var lib$es6$promise$promise$resolve$$default = lib$es6$promise$promise$resolve$$resolve;
	    function lib$es6$promise$promise$reject$$reject(reason) {
	      /*jshint validthis:true */
	      var Constructor = this;
	      var promise = new Constructor(lib$es6$promise$$internal$$noop);
	      lib$es6$promise$$internal$$reject(promise, reason);
	      return promise;
	    }
	    var lib$es6$promise$promise$reject$$default = lib$es6$promise$promise$reject$$reject;

	    var lib$es6$promise$promise$$counter = 0;

	    function lib$es6$promise$promise$$needsResolver() {
	      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
	    }

	    function lib$es6$promise$promise$$needsNew() {
	      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
	    }

	    var lib$es6$promise$promise$$default = lib$es6$promise$promise$$Promise;
	    /**
	      Promise objects represent the eventual result of an asynchronous operation. The
	      primary way of interacting with a promise is through its `then` method, which
	      registers callbacks to receive either a promise's eventual value or the reason
	      why the promise cannot be fulfilled.

	      Terminology
	      -----------

	      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
	      - `thenable` is an object or function that defines a `then` method.
	      - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
	      - `exception` is a value that is thrown using the throw statement.
	      - `reason` is a value that indicates why a promise was rejected.
	      - `settled` the final resting state of a promise, fulfilled or rejected.

	      A promise can be in one of three states: pending, fulfilled, or rejected.

	      Promises that are fulfilled have a fulfillment value and are in the fulfilled
	      state.  Promises that are rejected have a rejection reason and are in the
	      rejected state.  A fulfillment value is never a thenable.

	      Promises can also be said to *resolve* a value.  If this value is also a
	      promise, then the original promise's settled state will match the value's
	      settled state.  So a promise that *resolves* a promise that rejects will
	      itself reject, and a promise that *resolves* a promise that fulfills will
	      itself fulfill.


	      Basic Usage:
	      ------------

	      ```js
	      var promise = new Promise(function(resolve, reject) {
	        // on success
	        resolve(value);

	        // on failure
	        reject(reason);
	      });

	      promise.then(function(value) {
	        // on fulfillment
	      }, function(reason) {
	        // on rejection
	      });
	      ```

	      Advanced Usage:
	      ---------------

	      Promises shine when abstracting away asynchronous interactions such as
	      `XMLHttpRequest`s.

	      ```js
	      function getJSON(url) {
	        return new Promise(function(resolve, reject){
	          var xhr = new XMLHttpRequest();

	          xhr.open('GET', url);
	          xhr.onreadystatechange = handler;
	          xhr.responseType = 'json';
	          xhr.setRequestHeader('Accept', 'application/json');
	          xhr.send();

	          function handler() {
	            if (this.readyState === this.DONE) {
	              if (this.status === 200) {
	                resolve(this.response);
	              } else {
	                reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
	              }
	            }
	          };
	        });
	      }

	      getJSON('/posts.json').then(function(json) {
	        // on fulfillment
	      }, function(reason) {
	        // on rejection
	      });
	      ```

	      Unlike callbacks, promises are great composable primitives.

	      ```js
	      Promise.all([
	        getJSON('/posts'),
	        getJSON('/comments')
	      ]).then(function(values){
	        values[0] // => postsJSON
	        values[1] // => commentsJSON

	        return values;
	      });
	      ```

	      @class Promise
	      @param {function} resolver
	      Useful for tooling.
	      @constructor
	    */
	    function lib$es6$promise$promise$$Promise(resolver) {
	      this._id = lib$es6$promise$promise$$counter++;
	      this._state = undefined;
	      this._result = undefined;
	      this._subscribers = [];

	      if (lib$es6$promise$$internal$$noop !== resolver) {
	        if (!lib$es6$promise$utils$$isFunction(resolver)) {
	          lib$es6$promise$promise$$needsResolver();
	        }

	        if (!(this instanceof lib$es6$promise$promise$$Promise)) {
	          lib$es6$promise$promise$$needsNew();
	        }

	        lib$es6$promise$$internal$$initializePromise(this, resolver);
	      }
	    }

	    lib$es6$promise$promise$$Promise.all = lib$es6$promise$promise$all$$default;
	    lib$es6$promise$promise$$Promise.race = lib$es6$promise$promise$race$$default;
	    lib$es6$promise$promise$$Promise.resolve = lib$es6$promise$promise$resolve$$default;
	    lib$es6$promise$promise$$Promise.reject = lib$es6$promise$promise$reject$$default;
	    lib$es6$promise$promise$$Promise._setScheduler = lib$es6$promise$asap$$setScheduler;
	    lib$es6$promise$promise$$Promise._setAsap = lib$es6$promise$asap$$setAsap;
	    lib$es6$promise$promise$$Promise._asap = lib$es6$promise$asap$$asap;

	    lib$es6$promise$promise$$Promise.prototype = {
	      constructor: lib$es6$promise$promise$$Promise,

	    /**
	      The primary way of interacting with a promise is through its `then` method,
	      which registers callbacks to receive either a promise's eventual value or the
	      reason why the promise cannot be fulfilled.

	      ```js
	      findUser().then(function(user){
	        // user is available
	      }, function(reason){
	        // user is unavailable, and you are given the reason why
	      });
	      ```

	      Chaining
	      --------

	      The return value of `then` is itself a promise.  This second, 'downstream'
	      promise is resolved with the return value of the first promise's fulfillment
	      or rejection handler, or rejected if the handler throws an exception.

	      ```js
	      findUser().then(function (user) {
	        return user.name;
	      }, function (reason) {
	        return 'default name';
	      }).then(function (userName) {
	        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
	        // will be `'default name'`
	      });

	      findUser().then(function (user) {
	        throw new Error('Found user, but still unhappy');
	      }, function (reason) {
	        throw new Error('`findUser` rejected and we're unhappy');
	      }).then(function (value) {
	        // never reached
	      }, function (reason) {
	        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
	        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
	      });
	      ```
	      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.

	      ```js
	      findUser().then(function (user) {
	        throw new PedagogicalException('Upstream error');
	      }).then(function (value) {
	        // never reached
	      }).then(function (value) {
	        // never reached
	      }, function (reason) {
	        // The `PedgagocialException` is propagated all the way down to here
	      });
	      ```

	      Assimilation
	      ------------

	      Sometimes the value you want to propagate to a downstream promise can only be
	      retrieved asynchronously. This can be achieved by returning a promise in the
	      fulfillment or rejection handler. The downstream promise will then be pending
	      until the returned promise is settled. This is called *assimilation*.

	      ```js
	      findUser().then(function (user) {
	        return findCommentsByAuthor(user);
	      }).then(function (comments) {
	        // The user's comments are now available
	      });
	      ```

	      If the assimliated promise rejects, then the downstream promise will also reject.

	      ```js
	      findUser().then(function (user) {
	        return findCommentsByAuthor(user);
	      }).then(function (comments) {
	        // If `findCommentsByAuthor` fulfills, we'll have the value here
	      }, function (reason) {
	        // If `findCommentsByAuthor` rejects, we'll have the reason here
	      });
	      ```

	      Simple Example
	      --------------

	      Synchronous Example

	      ```javascript
	      var result;

	      try {
	        result = findResult();
	        // success
	      } catch(reason) {
	        // failure
	      }
	      ```

	      Errback Example

	      ```js
	      findResult(function(result, err){
	        if (err) {
	          // failure
	        } else {
	          // success
	        }
	      });
	      ```

	      Promise Example;

	      ```javascript
	      findResult().then(function(result){
	        // success
	      }, function(reason){
	        // failure
	      });
	      ```

	      Advanced Example
	      --------------

	      Synchronous Example

	      ```javascript
	      var author, books;

	      try {
	        author = findAuthor();
	        books  = findBooksByAuthor(author);
	        // success
	      } catch(reason) {
	        // failure
	      }
	      ```

	      Errback Example

	      ```js

	      function foundBooks(books) {

	      }

	      function failure(reason) {

	      }

	      findAuthor(function(author, err){
	        if (err) {
	          failure(err);
	          // failure
	        } else {
	          try {
	            findBoooksByAuthor(author, function(books, err) {
	              if (err) {
	                failure(err);
	              } else {
	                try {
	                  foundBooks(books);
	                } catch(reason) {
	                  failure(reason);
	                }
	              }
	            });
	          } catch(error) {
	            failure(err);
	          }
	          // success
	        }
	      });
	      ```

	      Promise Example;

	      ```javascript
	      findAuthor().
	        then(findBooksByAuthor).
	        then(function(books){
	          // found books
	      }).catch(function(reason){
	        // something went wrong
	      });
	      ```

	      @method then
	      @param {Function} onFulfilled
	      @param {Function} onRejected
	      Useful for tooling.
	      @return {Promise}
	    */
	      then: function(onFulfillment, onRejection) {
	        var parent = this;
	        var state = parent._state;

	        if (state === lib$es6$promise$$internal$$FULFILLED && !onFulfillment || state === lib$es6$promise$$internal$$REJECTED && !onRejection) {
	          return this;
	        }

	        var child = new this.constructor(lib$es6$promise$$internal$$noop);
	        var result = parent._result;

	        if (state) {
	          var callback = arguments[state - 1];
	          lib$es6$promise$asap$$asap(function(){
	            lib$es6$promise$$internal$$invokeCallback(state, child, callback, result);
	          });
	        } else {
	          lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection);
	        }

	        return child;
	      },

	    /**
	      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
	      as the catch block of a try/catch statement.

	      ```js
	      function findAuthor(){
	        throw new Error('couldn't find that author');
	      }

	      // synchronous
	      try {
	        findAuthor();
	      } catch(reason) {
	        // something went wrong
	      }

	      // async with promises
	      findAuthor().catch(function(reason){
	        // something went wrong
	      });
	      ```

	      @method catch
	      @param {Function} onRejection
	      Useful for tooling.
	      @return {Promise}
	    */
	      'catch': function(onRejection) {
	        return this.then(null, onRejection);
	      }
	    };
	    function lib$es6$promise$polyfill$$polyfill() {
	      var local;

	      if (typeof global !== 'undefined') {
	          local = global;
	      } else if (typeof self !== 'undefined') {
	          local = self;
	      } else {
	          try {
	              local = Function('return this')();
	          } catch (e) {
	              throw new Error('polyfill failed because global object is unavailable in this environment');
	          }
	      }

	      var P = local.Promise;

	      if (P && Object.prototype.toString.call(P.resolve()) === '[object Promise]' && !P.cast) {
	        return;
	      }

	      local.Promise = lib$es6$promise$promise$$default;
	    }
	    var lib$es6$promise$polyfill$$default = lib$es6$promise$polyfill$$polyfill;

	    var lib$es6$promise$umd$$ES6Promise = {
	      'Promise': lib$es6$promise$promise$$default,
	      'polyfill': lib$es6$promise$polyfill$$default
	    };

	    /* global define:true module:true window: true */
	    if ("function" === 'function' && __webpack_require__(20)['amd']) {
	      !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return lib$es6$promise$umd$$ES6Promise; }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof module !== 'undefined' && module['exports']) {
	      module['exports'] = lib$es6$promise$umd$$ES6Promise;
	    } else if (typeof this !== 'undefined') {
	      this['ES6Promise'] = lib$es6$promise$umd$$ES6Promise;
	    }

	    lib$es6$promise$polyfill$$default();
	}).call(this);


	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8), __webpack_require__(17).setImmediate, (function() { return this; }()), __webpack_require__(18)(module)))

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {var nextTick = __webpack_require__(8).nextTick;
	var apply = Function.prototype.apply;
	var slice = Array.prototype.slice;
	var immediateIds = {};
	var nextImmediateId = 0;

	// DOM APIs, for completeness

	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) { timeout.close(); };

	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};

	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};

	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};

	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);

	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};

	// That's not how node.js implements it but the exposed api is the same.
	exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
	  var id = nextImmediateId++;
	  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

	  immediateIds[id] = true;

	  nextTick(function onNextTick() {
	    if (immediateIds[id]) {
	      // fn.call() is faster so we optimize for the common use-case
	      // @see http://jsperf.com/call-apply-segu
	      if (args) {
	        fn.apply(null, args);
	      } else {
	        fn.call(null);
	      }
	      // Prevent ids from leaking
	      exports.clearImmediate(id);
	    }
	  });

	  return id;
	};

	exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
	  delete immediateIds[id];
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(17).setImmediate, __webpack_require__(17).clearImmediate))

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 19 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },
/* 21 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Syntactic sugar for invoking a function and expanding an array for arguments.
	 *
	 * Common use case would be to use `Function.prototype.apply`.
	 *
	 *  ```js
	 *  function f(x, y, z) {}
	 *  var args = [1, 2, 3];
	 *  f.apply(null, args);
	 *  ```
	 *
	 * With `spread` this example can be re-written.
	 *
	 *  ```js
	 *  spread(function(x, y, z) {})([1, 2, 3]);
	 *  ```
	 *
	 * @param {Function} callback
	 * @returns {Function}
	 */
	module.exports = function spread(callback) {
	  return function (arr) {
	    callback.apply(null, arr);
	  };
	};


/***/ }
/******/ ])
});
;
},{"js-data":3}],3:[function(require,module,exports){
/*!
 * js-data
 * @version 2.3.0 - Homepage <http://www.js-data.io/>
 * @author Jason Dobry <jason.dobry@gmail.com>
 * @copyright (c) 2014-2015 Jason Dobry 
 * @license MIT <https://github.com/js-data/js-data/blob/master/LICENSE>
 * 
 * @overview Robust framework-agnostic data store.
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["JSData"] = factory();
	else
		root["JSData"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var _datastoreIndex = __webpack_require__(1);

	var _utils = __webpack_require__(2);

	var _errors = __webpack_require__(3);

	/**
	 * The library export.
	 *   - window.JSData
	 *   - require('js-data')
	 *   - define(['js-data', function (JSData) { ... }]);
	 *   - import JSData from 'js-data'
	 */
	module.exports = {
	  DS: _datastoreIndex['default'],
	  DSUtils: _utils['default'],
	  DSErrors: _errors['default'],
	  createStore: function createStore(options) {
	    return new _datastoreIndex['default'](options);
	  },
	  version: {
	    full: '2.3.0',
	    major: parseInt('2', 10),
	    minor: parseInt('3', 10),
	    patch: parseInt('0', 10),
	    alpha: true ? 'false' : false,
	    beta: true ? 'false' : false
	  }
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	/* jshint eqeqeq:false */

	var _utils = __webpack_require__(2);

	var _errors = __webpack_require__(3);

	var _sync_methodsIndex = __webpack_require__(4);

	var _async_methodsIndex = __webpack_require__(5);

	function lifecycleNoopCb(resource, attrs, cb) {
	  cb(null, attrs);
	}

	function lifecycleNoop(resource, attrs) {
	  return attrs;
	}

	function compare(_x, _x2, _x3, _x4) {
	  var _again = true;

	  _function: while (_again) {
	    var orderBy = _x,
	        index = _x2,
	        a = _x3,
	        b = _x4;
	    def = cA = cB = undefined;
	    _again = false;

	    var def = orderBy[index];
	    var cA = _utils['default'].get(a, def[0]),
	        cB = _utils['default'].get(b, def[0]);
	    if (_utils['default']._s(cA)) {
	      cA = _utils['default'].upperCase(cA);
	    }
	    if (_utils['default']._s(cB)) {
	      cB = _utils['default'].upperCase(cB);
	    }
	    if (def[1] === 'DESC') {
	      if (cB < cA) {
	        return -1;
	      } else if (cB > cA) {
	        return 1;
	      } else {
	        if (index < orderBy.length - 1) {
	          _x = orderBy;
	          _x2 = index + 1;
	          _x3 = a;
	          _x4 = b;
	          _again = true;
	          continue _function;
	        } else {
	          return 0;
	        }
	      }
	    } else {
	      if (cA < cB) {
	        return -1;
	      } else if (cA > cB) {
	        return 1;
	      } else {
	        if (index < orderBy.length - 1) {
	          _x = orderBy;
	          _x2 = index + 1;
	          _x3 = a;
	          _x4 = b;
	          _again = true;
	          continue _function;
	        } else {
	          return 0;
	        }
	      }
	    }
	  }
	}

	var Defaults = (function () {
	  function Defaults() {
	    _classCallCheck(this, Defaults);
	  }

	  _createClass(Defaults, [{
	    key: 'errorFn',
	    value: function errorFn(a, b) {
	      if (this.error && typeof this.error === 'function') {
	        try {
	          if (typeof a === 'string') {
	            throw new Error(a);
	          } else {
	            throw a;
	          }
	        } catch (err) {
	          a = err;
	        }
	        this.error(this.name || null, a || null, b || null);
	      }
	    }
	  }]);

	  return Defaults;
	})();

	var defaultsPrototype = Defaults.prototype;

	defaultsPrototype.actions = {};
	defaultsPrototype.afterCreate = lifecycleNoopCb;
	defaultsPrototype.afterCreateCollection = lifecycleNoop;
	defaultsPrototype.afterCreateInstance = lifecycleNoop;
	defaultsPrototype.afterDestroy = lifecycleNoopCb;
	defaultsPrototype.afterEject = lifecycleNoop;
	defaultsPrototype.afterInject = lifecycleNoop;
	defaultsPrototype.afterReap = lifecycleNoop;
	defaultsPrototype.afterUpdate = lifecycleNoopCb;
	defaultsPrototype.afterValidate = lifecycleNoopCb;
	defaultsPrototype.allowSimpleWhere = true;
	defaultsPrototype.basePath = '';
	defaultsPrototype.beforeCreate = lifecycleNoopCb;
	defaultsPrototype.beforeCreateCollection = lifecycleNoop;
	defaultsPrototype.beforeCreateInstance = lifecycleNoop;
	defaultsPrototype.beforeDestroy = lifecycleNoopCb;
	defaultsPrototype.beforeEject = lifecycleNoop;
	defaultsPrototype.beforeInject = lifecycleNoop;
	defaultsPrototype.beforeReap = lifecycleNoop;
	defaultsPrototype.beforeUpdate = lifecycleNoopCb;
	defaultsPrototype.beforeValidate = lifecycleNoopCb;
	defaultsPrototype.bypassCache = false;
	defaultsPrototype.cacheResponse = !!_utils['default'].w;
	defaultsPrototype.clearEmptyQueries = true;
	defaultsPrototype.computed = {};
	defaultsPrototype.defaultAdapter = 'http';
	defaultsPrototype.debug = false;
	defaultsPrototype.defaultValues = {};
	defaultsPrototype.eagerEject = false;
	// TODO: Implement eagerInject in DS#create
	defaultsPrototype.eagerInject = false;
	defaultsPrototype.endpoint = '';
	defaultsPrototype.error = console ? function (a, b, c) {
	  return console[typeof console.error === 'function' ? 'error' : 'log'](a, b, c);
	} : false;
	defaultsPrototype.fallbackAdapters = ['http'];
	defaultsPrototype.findStrictCache = false;
	defaultsPrototype.idAttribute = 'id';
	defaultsPrototype.ignoredChanges = [/\$/];
	defaultsPrototype.instanceEvents = !!_utils['default'].w;
	defaultsPrototype.keepChangeHistory = false;
	defaultsPrototype.linkRelations = true;
	defaultsPrototype.log = console ? function (a, b, c, d, e) {
	  return console[typeof console.info === 'function' ? 'info' : 'log'](a, b, c, d, e);
	} : false;

	defaultsPrototype.logFn = function (a, b, c, d) {
	  var _this = this;
	  if (_this.debug && _this.log && typeof _this.log === 'function') {
	    _this.log(_this.name || null, a || null, b || null, c || null, d || null);
	  }
	};

	defaultsPrototype.maxAge = false;
	defaultsPrototype.methods = {};
	defaultsPrototype.notify = !!_utils['default'].w;
	defaultsPrototype.omit = [];
	defaultsPrototype.onConflict = 'merge';
	defaultsPrototype.reapAction = !!_utils['default'].w ? 'inject' : 'none';
	defaultsPrototype.reapInterval = !!_utils['default'].w ? 30000 : false;
	defaultsPrototype.relationsEnumerable = false;
	defaultsPrototype.resetHistoryOnInject = true;
	defaultsPrototype.returnMeta = false;
	defaultsPrototype.strategy = 'single';
	defaultsPrototype.upsert = !!_utils['default'].w;
	defaultsPrototype.useClass = true;
	defaultsPrototype.useFilter = false;
	defaultsPrototype.validate = lifecycleNoopCb;
	defaultsPrototype.watchChanges = !!_utils['default'].w;
	defaultsPrototype.defaultFilter = function (collection, resourceName, params, options) {
	  var filtered = collection;
	  var where = null;
	  var reserved = {
	    skip: '',
	    offset: '',
	    where: '',
	    limit: '',
	    orderBy: '',
	    sort: ''
	  };

	  params = params || {};
	  options = options || {};

	  if (_utils['default']._o(params.where)) {
	    where = params.where;
	  } else {
	    where = {};
	  }

	  if (options.allowSimpleWhere) {
	    _utils['default'].forOwn(params, function (value, key) {
	      if (!(key in reserved) && !(key in where)) {
	        where[key] = {
	          '==': value
	        };
	      }
	    });
	  }

	  if (_utils['default'].isEmpty(where)) {
	    where = null;
	  }

	  if (where) {
	    filtered = _utils['default'].filter(filtered, function (attrs) {
	      var first = true;
	      var keep = true;
	      _utils['default'].forOwn(where, function (clause, field) {
	        if (!_utils['default']._o(clause)) {
	          clause = {
	            '==': clause
	          };
	        }
	        _utils['default'].forOwn(clause, function (term, op) {
	          var expr = undefined;
	          var isOr = op[0] === '|';
	          var val = _utils['default'].get(attrs, field);
	          op = isOr ? op.substr(1) : op;
	          if (op === '==') {
	            expr = val == term;
	          } else if (op === '===') {
	            expr = val === term;
	          } else if (op === '!=') {
	            expr = val != term;
	          } else if (op === '!==') {
	            expr = val !== term;
	          } else if (op === '>') {
	            expr = val > term;
	          } else if (op === '>=') {
	            expr = val >= term;
	          } else if (op === '<') {
	            expr = val < term;
	          } else if (op === '<=') {
	            expr = val <= term;
	          } else if (op === 'isectEmpty') {
	            expr = !_utils['default'].intersection(val || [], term || []).length;
	          } else if (op === 'isectNotEmpty') {
	            expr = _utils['default'].intersection(val || [], term || []).length;
	          } else if (op === 'in') {
	            if (_utils['default']._s(term)) {
	              expr = term.indexOf(val) !== -1;
	            } else {
	              expr = _utils['default'].contains(term, val);
	            }
	          } else if (op === 'notIn') {
	            if (_utils['default']._s(term)) {
	              expr = term.indexOf(val) === -1;
	            } else {
	              expr = !_utils['default'].contains(term, val);
	            }
	          } else if (op === 'contains') {
	            if (_utils['default']._s(val)) {
	              expr = val.indexOf(term) !== -1;
	            } else {
	              expr = _utils['default'].contains(val, term);
	            }
	          } else if (op === 'notContains') {
	            if (_utils['default']._s(val)) {
	              expr = val.indexOf(term) === -1;
	            } else {
	              expr = !_utils['default'].contains(val, term);
	            }
	          }
	          if (expr !== undefined) {
	            keep = first ? expr : isOr ? keep || expr : keep && expr;
	          }
	          first = false;
	        });
	      });
	      return keep;
	    });
	  }

	  var orderBy = null;

	  if (_utils['default']._s(params.orderBy)) {
	    orderBy = [[params.orderBy, 'ASC']];
	  } else if (_utils['default']._a(params.orderBy)) {
	    orderBy = params.orderBy;
	  }

	  if (!orderBy && _utils['default']._s(params.sort)) {
	    orderBy = [[params.sort, 'ASC']];
	  } else if (!orderBy && _utils['default']._a(params.sort)) {
	    orderBy = params.sort;
	  }

	  // Apply 'orderBy'
	  if (orderBy) {
	    (function () {
	      var index = 0;
	      _utils['default'].forEach(orderBy, function (def, i) {
	        if (_utils['default']._s(def)) {
	          orderBy[i] = [def, 'ASC'];
	        } else if (!_utils['default']._a(def)) {
	          throw new _errors['default'].IA('DS.filter("' + resourceName + '"[, params][, options]): ' + _utils['default'].toJson(def) + ': Must be a string or an array!', {
	            params: {
	              'orderBy[i]': {
	                actual: typeof def,
	                expected: 'string|array'
	              }
	            }
	          });
	        }
	      });
	      filtered = _utils['default'].sort(filtered, function (a, b) {
	        return compare(orderBy, index, a, b);
	      });
	    })();
	  }

	  var limit = _utils['default']._n(params.limit) ? params.limit : null;
	  var skip = null;

	  if (_utils['default']._n(params.skip)) {
	    skip = params.skip;
	  } else if (_utils['default']._n(params.offset)) {
	    skip = params.offset;
	  }

	  // Apply 'limit' and 'skip'
	  if (limit && skip) {
	    filtered = _utils['default'].slice(filtered, skip, Math.min(filtered.length, skip + limit));
	  } else if (_utils['default']._n(limit)) {
	    filtered = _utils['default'].slice(filtered, 0, Math.min(filtered.length, limit));
	  } else if (_utils['default']._n(skip)) {
	    if (skip < filtered.length) {
	      filtered = _utils['default'].slice(filtered, skip);
	    } else {
	      filtered = [];
	    }
	  }

	  if (filtered === collection) {
	    return filtered.slice();
	  } else {
	    return filtered;
	  }
	};

	var DS = (function () {
	  function DS(options) {
	    _classCallCheck(this, DS);

	    var _this = this;
	    options = options || {};

	    _this.store = {};
	    _this.definitions = {};
	    _this.adapters = {};
	    _this.defaults = new Defaults();
	    _this.observe = _utils['default'].observe;
	    _utils['default'].forOwn(options, function (v, k) {
	      if (k === 'omit') {
	        _this.defaults.omit = v.concat(Defaults.prototype.omit);
	      } else {
	        _this.defaults[k] = v;
	      }
	    });
	    _this.defaults.logFn('new data store created', _this.defaults);

	    var P = _utils['default'].Promise;

	    if (P && !P.prototype.spread) {
	      P.prototype.spread = function (cb) {
	        return this.then(function (arr) {
	          return cb.apply(this, arr);
	        });
	      };
	    }

	    _utils['default'].Events(_this);
	  }

	  _createClass(DS, [{
	    key: 'getAdapterName',
	    value: function getAdapterName(options) {
	      var errorIfNotExist = false;
	      options = options || {};
	      this.defaults.logFn('getAdapterName', options);
	      if (_utils['default']._s(options)) {
	        errorIfNotExist = true;
	        options = {
	          adapter: options
	        };
	      }
	      if (this.adapters[options.adapter]) {
	        return options.adapter;
	      } else if (errorIfNotExist) {
	        throw new Error(options.adapter + ' is not a registered adapter!');
	      } else {
	        return options.defaultAdapter;
	      }
	    }
	  }, {
	    key: 'getAdapter',
	    value: function getAdapter(options) {
	      options = options || {};
	      this.defaults.logFn('getAdapter', options);
	      return this.adapters[this.getAdapterName(options)];
	    }
	  }, {
	    key: 'registerAdapter',
	    value: function registerAdapter(name, Adapter, options) {
	      var _this = this;
	      options = options || {};
	      _this.defaults.logFn('registerAdapter', name, Adapter, options);
	      if (_utils['default'].isFunction(Adapter)) {
	        _this.adapters[name] = new Adapter(options);
	      } else {
	        _this.adapters[name] = Adapter;
	      }
	      if (options['default']) {
	        _this.defaults.defaultAdapter = name;
	      }
	      _this.defaults.logFn('default adapter is ' + _this.defaults.defaultAdapter);
	    }
	  }, {
	    key: 'is',
	    value: function is(resourceName, instance) {
	      var definition = this.definitions[resourceName];
	      if (!definition) {
	        throw new _errors['default'].NER(resourceName);
	      }
	      return instance instanceof definition[definition['class']];
	    }
	  }, {
	    key: 'clear',
	    value: function clear() {
	      var _this2 = this;

	      var ejected = {};
	      _utils['default'].forOwn(this.definitions, function (definition) {
	        var name = definition.name;
	        ejected[name] = definition.ejectAll();
	        _this2.store[name].completedQueries = {};
	        _this2.store[name].queryData = {};
	      });
	      return ejected;
	    }
	  }]);

	  return DS;
	})();

	var dsPrototype = DS.prototype;

	dsPrototype.getAdapterName.shorthand = false;
	dsPrototype.getAdapter.shorthand = false;
	dsPrototype.registerAdapter.shorthand = false;
	dsPrototype.errors = _errors['default'];
	dsPrototype.utils = _utils['default'];

	function addMethods(target, obj) {
	  _utils['default'].forOwn(obj, function (v, k) {
	    target[k] = v;
	    target[k].before = function (fn) {
	      var orig = target[k];
	      target[k] = function () {
	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	          args[_key] = arguments[_key];
	        }

	        return orig.apply(this, fn.apply(this, args) || args);
	      };
	    };
	  });
	}

	addMethods(dsPrototype, _sync_methodsIndex['default']);
	addMethods(dsPrototype, _async_methodsIndex['default']);

	exports['default'] = DS;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* jshint eqeqeq:false */

	/**
	 * Mix of ES6 and CommonJS module imports because the interop of Babel + Webpack + ES6 modules + CommonJS isn't very good.
	 */

	var _errors = __webpack_require__(3);

	var BinaryHeap = __webpack_require__(7);
	var forEach = __webpack_require__(8);
	var slice = __webpack_require__(9);
	var forOwn = __webpack_require__(13);
	var contains = __webpack_require__(10);
	var deepMixIn = __webpack_require__(14);
	var pascalCase = __webpack_require__(19);
	var remove = __webpack_require__(11);
	var pick = __webpack_require__(15);
	var _keys = __webpack_require__(16);
	var sort = __webpack_require__(12);
	var upperCase = __webpack_require__(20);
	var get = __webpack_require__(17);
	var set = __webpack_require__(18);
	var observe = __webpack_require__(6);
	var w = undefined;
	var objectProto = Object.prototype;
	var toString = objectProto.toString;
	var P = undefined;

	/**
	 * Attempt to detect the global Promise constructor.
	 * JSData will still work without one, as long you do something like this:
	 *
	 * var JSData = require('js-data');
	 * JSData.DSUtils.Promise = MyPromiseLib;
	 */
	try {
	  P = Promise;
	} catch (err) {
	  console.error('js-data requires a global Promise constructor!');
	}

	var isArray = Array.isArray || function isArray(value) {
	  return toString.call(value) == '[object Array]' || false;
	};

	var isRegExp = function isRegExp(value) {
	  return toString.call(value) == '[object RegExp]' || false;
	};

	// adapted from lodash.isString
	var isString = function isString(value) {
	  return typeof value == 'string' || value && typeof value == 'object' && toString.call(value) == '[object String]' || false;
	};

	var isObject = function isObject(value) {
	  return toString.call(value) == '[object Object]' || false;
	};

	// adapted from lodash.isDate
	var isDate = function isDate(value) {
	  return value && typeof value == 'object' && toString.call(value) == '[object Date]' || false;
	};

	// adapted from lodash.isNumber
	var isNumber = function isNumber(value) {
	  var type = typeof value;
	  return type == 'number' || value && type == 'object' && toString.call(value) == '[object Number]' || false;
	};

	// adapted from lodash.isFunction
	var isFunction = function isFunction(value) {
	  return typeof value == 'function' || value && toString.call(value) === '[object Function]' || false;
	};

	// shorthand argument checking functions, using these shaves 1.18 kb off of the minified build
	var isStringOrNumber = function isStringOrNumber(value) {
	  return isString(value) || isNumber(value);
	};
	var isStringOrNumberErr = function isStringOrNumberErr(field) {
	  return new _errors['default'].IA('"' + field + '" must be a string or a number!');
	};
	var isObjectErr = function isObjectErr(field) {
	  return new _errors['default'].IA('"' + field + '" must be an object!');
	};
	var isArrayErr = function isArrayErr(field) {
	  return new _errors['default'].IA('"' + field + '" must be an array!');
	};

	// adapted from mout.isEmpty
	var isEmpty = function isEmpty(val) {
	  if (val == null) {
	    // jshint ignore:line
	    // typeof null == 'object' so we check it first
	    return true;
	  } else if (typeof val === 'string' || isArray(val)) {
	    return !val.length;
	  } else if (typeof val === 'object') {
	    var result = true;
	    forOwn(val, function () {
	      result = false;
	      return false; // break loop
	    });
	    return result;
	  } else {
	    return true;
	  }
	};

	// Find the intersection between two arrays
	var intersection = function intersection(array1, array2) {
	  if (!array1 || !array2) {
	    return [];
	  }
	  var result = [];
	  var item = undefined;
	  for (var i = 0, _length = array1.length; i < _length; i++) {
	    item = array1[i];
	    if (contains(result, item)) {
	      continue;
	    }
	    if (contains(array2, item)) {
	      result.push(item);
	    }
	  }
	  return result;
	};

	var filter = function filter(array, cb, thisObj) {
	  var results = [];
	  forEach(array, function (value, key, arr) {
	    if (cb(value, key, arr)) {
	      results.push(value);
	    }
	  }, thisObj);
	  return results;
	};

	/**
	 * Attempt to detect whether we are in the browser.
	 */
	try {
	  w = window;
	  w = {};
	} catch (e) {
	  w = null;
	}

	/**
	 * Event mixin. Usage:
	 *
	 * function handler() { ... }
	 * Events(myObject);
	 * myObject.on('foo', handler);
	 * myObject.emit('foo', 'some', 'data');
	 * myObject.off('foo', handler);
	 */
	function Events(target) {
	  var events = {};
	  target = target || this;
	  target.on = function (type, func, ctx) {
	    events[type] = events[type] || [];
	    events[type].push({
	      f: func,
	      c: ctx
	    });
	  };
	  target.off = function (type, func) {
	    var listeners = events[type];
	    if (!listeners) {
	      events = {};
	    } else if (func) {
	      for (var i = 0; i < listeners.length; i++) {
	        if (listeners[i].f === func) {
	          listeners.splice(i, 1);
	          break;
	        }
	      }
	    } else {
	      listeners.splice(0, listeners.length);
	    }
	  };
	  target.emit = function () {
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    var listeners = events[args.shift()] || [];
	    if (listeners) {
	      for (var i = 0; i < listeners.length; i++) {
	        listeners[i].f.apply(listeners[i].c, args);
	      }
	    }
	  };
	}

	/**
	 * Lifecycle hooks that should support promises.
	 */
	var toPromisify = ['beforeValidate', 'validate', 'afterValidate', 'beforeCreate', 'afterCreate', 'beforeUpdate', 'afterUpdate', 'beforeDestroy', 'afterDestroy'];

	/**
	 * Return whether "prop" is in the blacklist.
	 */
	var isBlacklisted = observe.isBlacklisted;

	// adapted from angular.copy
	var copy = function copy(source, destination, stackSource, stackDest, blacklist) {
	  if (!destination) {
	    destination = source;
	    if (source) {
	      if (isArray(source)) {
	        destination = copy(source, [], stackSource, stackDest, blacklist);
	      } else if (isDate(source)) {
	        destination = new Date(source.getTime());
	      } else if (isRegExp(source)) {
	        destination = new RegExp(source.source, source.toString().match(/[^\/]*$/)[0]);
	        destination.lastIndex = source.lastIndex;
	      } else if (isObject(source)) {
	        destination = copy(source, Object.create(Object.getPrototypeOf(source)), stackSource, stackDest, blacklist);
	      }
	    }
	  } else {
	    if (source === destination) {
	      throw new Error('Cannot copy! Source and destination are identical.');
	    }

	    stackSource = stackSource || [];
	    stackDest = stackDest || [];

	    if (isObject(source)) {
	      var index = stackSource.indexOf(source);
	      if (index !== -1) {
	        return stackDest[index];
	      }

	      stackSource.push(source);
	      stackDest.push(destination);
	    }

	    var result = undefined;
	    if (isArray(source)) {
	      var i = undefined;
	      destination.length = 0;
	      for (i = 0; i < source.length; i++) {
	        result = copy(source[i], null, stackSource, stackDest, blacklist);
	        if (isObject(source[i])) {
	          stackSource.push(source[i]);
	          stackDest.push(result);
	        }
	        destination.push(result);
	      }
	    } else {
	      if (isArray(destination)) {
	        destination.length = 0;
	      } else {
	        forEach(destination, function (value, key) {
	          delete destination[key];
	        });
	      }
	      for (var key in source) {
	        if (source.hasOwnProperty(key)) {
	          if (isBlacklisted(key, blacklist)) {
	            continue;
	          }
	          result = copy(source[key], null, stackSource, stackDest, blacklist);
	          if (isObject(source[key])) {
	            stackSource.push(source[key]);
	            stackDest.push(result);
	          }
	          destination[key] = result;
	        }
	      }
	    }
	  }
	  return destination;
	};

	// adapted from angular.equals
	var equals = function equals(_x, _x2) {
	  var _again = true;

	  _function: while (_again) {
	    var o1 = _x,
	        o2 = _x2;
	    t1 = t2 = length = key = keySet = undefined;
	    _again = false;

	    if (o1 === o2) {
	      return true;
	    }
	    if (o1 === null || o2 === null) {
	      return false;
	    }
	    if (o1 !== o1 && o2 !== o2) {
	      return true;
	    } // NaN === NaN
	    var t1 = typeof o1,
	        t2 = typeof o2,
	        length,
	        key,
	        keySet;
	    if (t1 == t2) {
	      if (t1 == 'object') {
	        if (isArray(o1)) {
	          if (!isArray(o2)) {
	            return false;
	          }
	          if ((length = o1.length) == o2.length) {
	            // jshint ignore:line
	            for (key = 0; key < length; key++) {
	              if (!equals(o1[key], o2[key])) {
	                return false;
	              }
	            }
	            return true;
	          }
	        } else if (isDate(o1)) {
	          if (!isDate(o2)) {
	            return false;
	          }
	          _x = o1.getTime();
	          _x2 = o2.getTime();
	          _again = true;
	          continue _function;
	        } else if (isRegExp(o1) && isRegExp(o2)) {
	          return o1.toString() == o2.toString();
	        } else {
	          if (isArray(o2)) {
	            return false;
	          }
	          keySet = {};
	          for (key in o1) {
	            if (key.charAt(0) === '$' || isFunction(o1[key])) {
	              continue;
	            }
	            if (!equals(o1[key], o2[key])) {
	              return false;
	            }
	            keySet[key] = true;
	          }
	          for (key in o2) {
	            if (!keySet.hasOwnProperty(key) && key.charAt(0) !== '$' && o2[key] !== undefined && !isFunction(o2[key])) {
	              return false;
	            }
	          }
	          return true;
	        }
	      }
	    }
	    return false;
	  }
	};

	/**
	 * Given either an instance or the primary key of an instance, return the primary key.
	 */
	var resolveId = function resolveId(definition, idOrInstance) {
	  if (isString(idOrInstance) || isNumber(idOrInstance)) {
	    return idOrInstance;
	  } else if (idOrInstance && definition) {
	    return idOrInstance[definition.idAttribute] || idOrInstance;
	  } else {
	    return idOrInstance;
	  }
	};

	/**
	 * Given either an instance or the primary key of an instance, return the instance.
	 */
	var resolveItem = function resolveItem(resource, idOrInstance) {
	  if (resource && (isString(idOrInstance) || isNumber(idOrInstance))) {
	    return resource.index[idOrInstance] || idOrInstance;
	  } else {
	    return idOrInstance;
	  }
	};

	var isValidString = function isValidString(val) {
	  return val != null && val !== ''; // jshint ignore:line
	};

	var join = function join(items, separator) {
	  separator = separator || '';
	  return filter(items, isValidString).join(separator);
	};

	var makePath = function makePath() {
	  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	    args[_key2] = arguments[_key2];
	  }

	  var result = join(args, '/');
	  return result.replace(/([^:\/]|^)\/{2,}/g, '$1/');
	};

	exports['default'] = {
	  Promise: P,
	  /**
	   * Method to wrap an "options" object so that it will inherit from
	   * some parent object, such as a resource definition.
	   */
	  _: function _(parent, options) {
	    var _this = this;
	    parent = parent || {};
	    options = options || {};
	    if (options && options.constructor === parent.constructor) {
	      return options;
	    } else if (!isObject(options)) {
	      throw new _errors['default'].IA('"options" must be an object!');
	    }
	    forEach(toPromisify, function (name) {
	      if (typeof options[name] === 'function' && options[name].toString().indexOf('for (var _len = arg') === -1) {
	        options[name] = _this.promisify(options[name]);
	      }
	    });
	    // Dynamic constructor function
	    var O = function Options(attrs) {
	      var self = this;
	      forOwn(attrs, function (value, key) {
	        self[key] = value;
	      });
	    };
	    // Inherit from some parent object
	    O.prototype = parent;
	    // Give us a way to get the original options back.
	    O.prototype.orig = function () {
	      var orig = {};
	      forOwn(this, function (value, key) {
	        orig[key] = value;
	      });
	      return orig;
	    };
	    return new O(options);
	  },
	  _n: isNumber,
	  _s: isString,
	  _sn: isStringOrNumber,
	  _snErr: isStringOrNumberErr,
	  _o: isObject,
	  _oErr: isObjectErr,
	  _a: isArray,
	  _aErr: isArrayErr,
	  compute: function compute(fn, field) {
	    var _this = this;
	    var args = [];
	    forEach(fn.deps, function (dep) {
	      args.push(get(_this, dep));
	    });
	    // compute property
	    set(_this, field, fn[fn.length - 1].apply(_this, args));
	  },
	  contains: contains,
	  copy: copy,
	  deepMixIn: deepMixIn,
	  diffObjectFromOldObject: observe.diffObjectFromOldObject,
	  BinaryHeap: BinaryHeap,
	  equals: equals,
	  Events: Events,
	  filter: filter,
	  fillIn: function fillIn(target, obj) {
	    forOwn(obj, function (v, k) {
	      if (!(k in target)) {
	        target[k] = v;
	      }
	    });
	    return target;
	  },
	  forEach: forEach,
	  forOwn: forOwn,
	  fromJson: function fromJson(json) {
	    return isString(json) ? JSON.parse(json) : json;
	  },
	  get: get,
	  intersection: intersection,
	  isArray: isArray,
	  isBlacklisted: isBlacklisted,
	  isEmpty: isEmpty,
	  isFunction: isFunction,
	  isObject: isObject,
	  isNumber: isNumber,
	  isString: isString,
	  keys: _keys,
	  makePath: makePath,
	  observe: observe,
	  omit: function omit(obj, bl) {
	    var toRemove = [];
	    forOwn(obj, function (v, k) {
	      if (isBlacklisted(k, bl)) {
	        toRemove.push(k);
	      }
	    });
	    forEach(toRemove, function (k) {
	      delete obj[k];
	    });
	    return obj;
	  },
	  pascalCase: pascalCase,
	  pick: pick,
	  // Turn the given node-style callback function into one that can return a promise.
	  promisify: function promisify(fn, target) {
	    var _this = this;
	    if (!fn) {
	      return;
	    } else if (typeof fn !== 'function') {
	      throw new Error('Can only promisify functions!');
	    }
	    return function () {
	      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	        args[_key3] = arguments[_key3];
	      }

	      return new _this.Promise(function (resolve, reject) {

	        args.push(function (err, result) {
	          if (err) {
	            reject(err);
	          } else {
	            resolve(result);
	          }
	        });

	        try {
	          var promise = fn.apply(target || this, args);
	          if (promise && promise.then) {
	            promise.then(resolve, reject);
	          }
	        } catch (err) {
	          reject(err);
	        }
	      });
	    };
	  },
	  remove: remove,
	  set: set,
	  slice: slice,
	  sort: sort,
	  toJson: JSON.stringify,
	  updateTimestamp: function updateTimestamp(timestamp) {
	    var newTimestamp = typeof Date.now === 'function' ? Date.now() : new Date().getTime();
	    if (timestamp && newTimestamp <= timestamp) {
	      return timestamp + 1;
	    } else {
	      return newTimestamp;
	    }
	  },
	  upperCase: upperCase,
	  // Return a copy of "object" with cycles removed.
	  removeCircular: function removeCircular(object) {
	    return (function rmCirc(value, ctx) {
	      var i = undefined;
	      var nu = undefined;

	      if (typeof value === 'object' && value !== null && !(value instanceof Boolean) && !(value instanceof Date) && !(value instanceof Number) && !(value instanceof RegExp) && !(value instanceof String)) {

	        // check if current object points back to itself
	        var cur = ctx.cur;
	        var parent = ctx.ctx;
	        while (parent) {
	          if (parent.cur === cur) {
	            return undefined;
	          }
	          parent = parent.ctx;
	        }

	        if (isArray(value)) {
	          nu = [];
	          for (i = 0; i < value.length; i += 1) {
	            nu[i] = rmCirc(value[i], { ctx: ctx, cur: value[i] });
	          }
	        } else {
	          nu = {};
	          forOwn(value, function (v, k) {
	            nu[k] = rmCirc(value[k], { ctx: ctx, cur: value[k] });
	          });
	        }
	        return nu;
	      }
	      return value;
	    })(object, { ctx: null, cur: object });
	  },
	  resolveItem: resolveItem,
	  resolveId: resolveId,
	  respond: function respond(response, meta, options) {
	    if (options.returnMeta === 'array') {
	      return [response, meta];
	    } else if (options.returnMeta === 'object') {
	      return { response: response, meta: meta };
	    } else {
	      return response;
	    }
	  },
	  w: w,
	  // This is where the magic of relations happens.
	  applyRelationGettersToTarget: function applyRelationGettersToTarget(store, definition, target) {
	    this.forEach(definition.relationList, function (def) {
	      var relationName = def.relation;
	      var localField = def.localField;
	      var localKey = def.localKey;
	      var foreignKey = def.foreignKey;
	      var localKeys = def.localKeys;
	      var enumerable = typeof def.enumerable === 'boolean' ? def.enumerable : !!definition.relationsEnumerable;
	      if (typeof def.link === 'boolean' ? def.link : !!definition.linkRelations) {
	        delete target[localField];
	        var prop = {
	          enumerable: enumerable
	        };
	        if (def.type === 'belongsTo') {
	          prop.get = function () {
	            return get(this, localKey) ? definition.getResource(relationName).get(get(this, localKey)) : undefined;
	          };
	          prop.set = function (parent) {
	            set(this, localKey, get(parent, definition.getResource(relationName).idAttribute));
	            return get(this, localField);
	          };
	        } else if (def.type === 'hasMany') {
	          prop.get = function () {
	            var params = {};
	            if (foreignKey) {
	              params[foreignKey] = this[definition.idAttribute];
	              return definition.getResource(relationName).defaultFilter.call(store, store.store[relationName].collection, relationName, params, { allowSimpleWhere: true });
	            } else if (localKeys) {
	              var keys = get(this, localKeys) || [];
	              return definition.getResource(relationName).getAll(isArray(keys) ? keys : _keys(keys));
	            }
	            return undefined;
	          };
	          prop.set = function (children) {
	            var _this2 = this;

	            if (foreignKey) {
	              forEach(children, function (child) {
	                set(child, foreignKey, get(_this2, definition.idAttribute));
	              });
	            } else if (localKeys) {
	              (function () {
	                var keys = [];
	                forEach(children, function (child) {
	                  keys.push(get(child, definition.getResource(relationName).idAttribute));
	                });
	                set(_this2, localKeys, keys);
	              })();
	            }
	            return get(this, localField);
	          };
	        } else if (def.type === 'hasOne') {
	          if (localKey) {
	            prop.get = function () {
	              return get(this, localKey) ? definition.getResource(relationName).get(get(this, localKey)) : undefined;
	            };
	            prop.set = function (sibling) {
	              set(this, localKey, get(sibling, definition.getResource(relationName).idAttribute));
	              return get(this, localField);
	            };
	          } else {
	            prop.get = function () {
	              var params = {};
	              params[foreignKey] = this[definition.idAttribute];
	              var items = params[foreignKey] ? definition.getResource(relationName).defaultFilter.call(store, store.store[relationName].collection, relationName, params, { allowSimpleWhere: true }) : [];
	              if (items.length) {
	                return items[0];
	              }
	              return undefined;
	            };
	            prop.set = function (sibling) {
	              set(sibling, foreignKey, get(this, definition.idAttribute));
	              return get(this, localField);
	            };
	          }
	        }
	        if (def.get) {
	          (function () {
	            var orig = prop.get;
	            prop.get = function () {
	              var _this3 = this;

	              return def.get(definition, def, this, function () {
	                for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
	                  args[_key4] = arguments[_key4];
	                }

	                return orig.apply(_this3, args);
	              });
	            };
	          })();
	        }
	        Object.defineProperty(target, localField, prop);
	      }
	    });
	  }
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * Thrown during a method call when an argument passed into the method is invalid.
	 */

	var IllegalArgumentError = (function (_Error) {
	  _inherits(IllegalArgumentError, _Error);

	  function IllegalArgumentError(message) {
	    _classCallCheck(this, IllegalArgumentError);

	    _get(Object.getPrototypeOf(IllegalArgumentError.prototype), 'constructor', this).call(this);
	    if (typeof Error.captureStackTrace === 'function') {
	      Error.captureStackTrace(this, this.constructor);
	    }
	    this.type = this.constructor.name;
	    this.message = message;
	  }

	  /**
	   * Thrown when an invariant is violated or unrecoverable error is encountered during execution.
	   */
	  return IllegalArgumentError;
	})(Error);

	var RuntimeError = (function (_Error2) {
	  _inherits(RuntimeError, _Error2);

	  function RuntimeError(message) {
	    _classCallCheck(this, RuntimeError);

	    _get(Object.getPrototypeOf(RuntimeError.prototype), 'constructor', this).call(this);
	    if (typeof Error.captureStackTrace === 'function') {
	      Error.captureStackTrace(this, this.constructor);
	    }
	    this.type = this.constructor.name;
	    this.message = message;
	  }

	  /**
	   * Thrown when attempting to access or work with a non-existent resource.
	   */
	  return RuntimeError;
	})(Error);

	var NonexistentResourceError = (function (_Error3) {
	  _inherits(NonexistentResourceError, _Error3);

	  function NonexistentResourceError(resourceName) {
	    _classCallCheck(this, NonexistentResourceError);

	    _get(Object.getPrototypeOf(NonexistentResourceError.prototype), 'constructor', this).call(this);
	    if (typeof Error.captureStackTrace === 'function') {
	      Error.captureStackTrace(this, this.constructor);
	    }
	    this.type = this.constructor.name;
	    this.message = resourceName + ' is not a registered resource!';
	  }

	  return NonexistentResourceError;
	})(Error);

	exports['default'] = {
	  IllegalArgumentError: IllegalArgumentError,
	  IA: IllegalArgumentError,
	  RuntimeError: RuntimeError,
	  R: RuntimeError,
	  NonexistentResourceError: NonexistentResourceError,
	  NER: NonexistentResourceError
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var _utils = __webpack_require__(2);

	var _errors = __webpack_require__(3);

	var NER = _errors['default'].NER;
	var IA = _errors['default'].IA;
	var R = _errors['default'].R;

	var fakeId = 'DS_' + new Date().getTime();

	function diffIsEmpty(diff) {
	  return !(_utils['default'].isEmpty(diff.added) && _utils['default'].isEmpty(diff.removed) && _utils['default'].isEmpty(diff.changed));
	}

	function check(fnName, resourceName, id, options) {
	  var _this = this;
	  var definition = _this.definitions[resourceName];
	  options = options || {};

	  id = _utils['default'].resolveId(definition, id);
	  if (!definition) {
	    throw new NER(resourceName);
	  } else if (!_utils['default']._sn(id)) {
	    throw _utils['default']._snErr('id');
	  }
	  id = id === fakeId ? undefined : id;

	  options = _utils['default']._(definition, options);

	  options.logFn(fnName, id, options);

	  return { _this: _this, definition: definition, _resourceName: resourceName, _id: id, _options: options };
	}

	exports['default'] = {

	  // Return the changes for the given item, if any.
	  //
	  // @param resourceName The name of the type of resource of the item whose changes are to be returned.
	  // @param id The primary key of the item whose changes are to be returned.
	  // @param options Optional configuration.
	  // @param options.ignoredChanges Array of strings or regular expressions of fields, the changes of which are to be ignored.
	  // @returns The changes of the given item, if any.
	  changes: function changes(resourceName, id, options) {
	    var _check$call = check.call(this, 'changes', resourceName, id, options);

	    var _this = _check$call._this;
	    var definition = _check$call.definition;
	    var _resourceName = _check$call._resourceName;
	    var _id = _check$call._id;
	    var _options = _check$call._options;

	    var item = definition.get(_id);
	    if (item) {
	      var _ret = (function () {
	        var observer = _this.store[_resourceName].observers[_id];
	        if (observer && typeof observer === 'function') {
	          // force observation handler to be fired for item if there are changes and `Object.observe` is not available
	          observer.deliver();
	        }

	        var ignoredChanges = _options.ignoredChanges || [];
	        // add linked relations to list of ignored changes
	        _utils['default'].forEach(definition.relationFields, function (field) {
	          if (!_utils['default'].contains(ignoredChanges, field)) {
	            ignoredChanges.push(field);
	          }
	        });
	        // calculate changes
	        var diff = _utils['default'].diffObjectFromOldObject(item, _this.store[_resourceName].previousAttributes[_id], _utils['default'].equals, ignoredChanges);
	        // remove functions from diff
	        _utils['default'].forOwn(diff, function (changeset, name) {
	          var toKeep = [];
	          _utils['default'].forOwn(changeset, function (value, field) {
	            if (!_utils['default'].isFunction(value)) {
	              toKeep.push(field);
	            }
	          });
	          diff[name] = _utils['default'].pick(diff[name], toKeep);
	        });
	        // definitely ignore changes to linked relations
	        _utils['default'].forEach(definition.relationFields, function (field) {
	          delete diff.added[field];
	          delete diff.removed[field];
	          delete diff.changed[field];
	        });
	        return {
	          v: diff
	        };
	      })();

	      if (typeof _ret === 'object') return _ret.v;
	    }
	  },

	  // Return the change history of the given item, if any.
	  //
	  // @param resourceName The name of the type of resource of the item whose change history is to be returned.
	  // @param id The primary key of the item whose change history is to be returned.
	  // @returns The change history of the given item, if any.
	  changeHistory: function changeHistory(resourceName, id) {
	    var _check$call2 = check.call(this, 'changeHistory', resourceName, id || fakeId);

	    var _this = _check$call2._this;
	    var definition = _check$call2.definition;
	    var _resourceName = _check$call2._resourceName;
	    var _id = _check$call2._id;

	    var resource = _this.store[_resourceName];

	    if (!definition.keepChangeHistory) {
	      definition.errorFn('changeHistory is disabled for this resource!');
	    } else {
	      if (_resourceName) {
	        var item = definition.get(_id);
	        if (item) {
	          return resource.changeHistories[_id];
	        }
	      } else {
	        return resource.changeHistory;
	      }
	    }
	  },

	  // Re-compute the computed properties of the given item.
	  //
	  // @param resourceName The name of the type of resource of the item whose computed properties are to be re-computed.
	  // @param instance The instance whose computed properties are to be re-computed.
	  // @returns The item whose computed properties were re-computed.
	  compute: function compute(resourceName, instance) {
	    var _this = this;
	    var definition = _this.definitions[resourceName];

	    instance = _utils['default'].resolveItem(_this.store[resourceName], instance);
	    if (!definition) {
	      throw new NER(resourceName);
	    } else if (!instance) {
	      throw new R('Item not in the store!');
	    } else if (!_utils['default']._o(instance) && !_utils['default']._sn(instance)) {
	      throw new IA('"instance" must be an object, string or number!');
	    }

	    definition.logFn('compute', instance);

	    // re-compute all computed properties
	    _utils['default'].forOwn(definition.computed, function (fn, field) {
	      _utils['default'].compute.call(instance, fn, field);
	    });
	    return instance;
	  },

	  // Factory function to create an instance of the specified Resource.
	  //
	  // @param resourceName The name of the type of resource of which to create an instance.
	  // @param attrs Hash of properties with which to initialize the instance.
	  // @param options Optional configuration.
	  // @param options.defaults Default values with which to initialize the instance.
	  // @returns The new instance.
	  createInstance: function createInstance(resourceName, attrs, options) {
	    var definition = this.definitions[resourceName];
	    var item = undefined;

	    attrs = attrs || {};

	    if (!definition) {
	      throw new NER(resourceName);
	    } else if (attrs && !_utils['default'].isObject(attrs)) {
	      throw new IA('"attrs" must be an object!');
	    }

	    options = _utils['default']._(definition, options);
	    options.logFn('createInstance', attrs, options);

	    // lifecycle
	    options.beforeCreateInstance(options, attrs);

	    // grab instance constructor function from Resource definition
	    var Constructor = definition[definition['class']];

	    // create instance
	    item = new Constructor();

	    // add default values
	    if (options.defaultValues) {
	      _utils['default'].deepMixIn(item, options.defaultValues);
	    }
	    _utils['default'].deepMixIn(item, attrs);

	    // compute computed properties
	    if (definition.computed) {
	      definition.compute(item);
	    }
	    // lifecycle
	    options.afterCreateInstance(options, item);
	    return item;
	  },

	  // Create a new collection of the specified Resource.
	  //
	  // @param resourceName The name of the type of resource of which to create a collection
	  // @param arr Possibly empty array of data from which to create the collection.
	  // @param params The criteria by which to filter items. Will be passed to `DS#findAll` if `fetch` is called. See http://www.js-data.io/docs/query-syntax
	  // @param options Optional configuration.
	  // @param options.notify Whether to call the beforeCreateCollection and afterCreateCollection lifecycle hooks..
	  // @returns The new collection.
	  createCollection: function createCollection(resourceName, arr, params, options) {
	    var _this = this;
	    var definition = _this.definitions[resourceName];

	    arr = arr || [];
	    params = params || {};

	    if (!definition) {
	      throw new NER(resourceName);
	    } else if (arr && !_utils['default'].isArray(arr)) {
	      throw new IA('"arr" must be an array!');
	    }

	    options = _utils['default']._(definition, options);

	    options.logFn('createCollection', arr, options);

	    // lifecycle
	    options.beforeCreateCollection(options, arr);

	    // define the API for this collection
	    Object.defineProperties(arr, {
	      //  Call DS#findAll with the params of this collection, filling the collection with the results.
	      fetch: {
	        value: function value(params, options) {
	          var __this = this;
	          __this.params = params || __this.params;
	          return definition.findAll(__this.params, options).then(function (data) {
	            if (data === __this) {
	              return __this;
	            }
	            data.unshift(__this.length);
	            data.unshift(0);
	            __this.splice.apply(__this, data);
	            data.shift();
	            data.shift();
	            if (data.$$injected) {
	              _this.store[resourceName].queryData[_utils['default'].toJson(__this.params)] = __this;
	              __this.$$injected = true;
	            }
	            return __this;
	          });
	        }
	      },
	      // params for this collection. See http://www.js-data.io/docs/query-syntax
	      params: {
	        value: params,
	        writable: true
	      },
	      // name of the resource type of this collection
	      resourceName: {
	        value: resourceName
	      }
	    });

	    // lifecycle
	    options.afterCreateCollection(options, arr);
	    return arr;
	  },
	  defineResource: __webpack_require__(27),
	  digest: function digest() {
	    this.observe.Platform.performMicrotaskCheckpoint();
	  },
	  eject: __webpack_require__(28),
	  ejectAll: __webpack_require__(29),
	  filter: __webpack_require__(30),

	  // Return the item with the given primary key if its in the store.
	  //
	  // @param resourceName The name of the type of resource of the item to retrieve.
	  // @param id The primary key of the item to retrieve.
	  // @returns The item with the given primary key if it's in the store.
	  ///
	  get: function get(resourceName, id) {
	    var _check$call3 = check.call(this, 'get', resourceName, id);

	    // return the item if it exists
	    var _this = _check$call3._this;
	    var _resourceName = _check$call3._resourceName;
	    var _id = _check$call3._id;
	    return _this.store[_resourceName].index[_id];
	  },

	  // Return the items in the store that have the given primary keys.
	  //
	  // @param resourceName The name of the type of resource of the items to retrieve.
	  // @param ids The primary keys of the items to retrieve.
	  // @returns The items with the given primary keys if they're in the store.
	  getAll: function getAll(resourceName, ids) {
	    var _this = this;
	    var definition = _this.definitions[resourceName];
	    var resource = _this.store[resourceName];
	    var collection = [];

	    if (!definition) {
	      throw new NER(resourceName);
	    } else if (ids && !_utils['default']._a(ids)) {
	      throw _utils['default']._aErr('ids');
	    }

	    definition.logFn('getAll', ids);

	    if (_utils['default']._a(ids)) {
	      // return just the items with the given primary keys
	      var _length = ids.length;
	      for (var i = 0; i < _length; i++) {
	        if (resource.index[ids[i]]) {
	          collection.push(resource.index[ids[i]]);
	        }
	      }
	    } else {
	      // most efficient of retrieving ALL items from the store
	      collection = resource.collection.slice();
	    }

	    return collection;
	  },

	  // Return the whether the item with the given primary key has any changes.
	  //
	  // @param resourceName The name of the type of resource of the item.
	  // @param id The primary key of the item.
	  // @returns Whether the item with the given primary key has any changes.
	  hasChanges: function hasChanges(resourceName, id) {
	    var _check$call4 = check.call(this, 'hasChanges', resourceName, id);

	    var definition = _check$call4.definition;
	    var _id = _check$call4._id;

	    return definition.get(_id) ? diffIsEmpty(definition.changes(_id)) : false;
	  },
	  inject: __webpack_require__(31),

	  // Return the timestamp from the last time the item with the given primary key was changed.
	  //
	  // @param resourceName The name of the type of resource of the item.
	  // @param id The primary key of the item.
	  // @returns Timestamp from the last time the item was changed.
	  lastModified: function lastModified(resourceName, id) {
	    var _check$call5 = check.call(this, 'lastModified', resourceName, id || fakeId);

	    var _this = _check$call5._this;
	    var _resourceName = _check$call5._resourceName;
	    var _id = _check$call5._id;

	    var resource = _this.store[_resourceName];

	    if (_id) {
	      if (!(_id in resource.modified)) {
	        resource.modified[_id] = 0;
	      }
	      return resource.modified[_id];
	    }
	    return resource.collectionModified;
	  },

	  // Return the timestamp from the last time the item with the given primary key was saved via an adapter.
	  //
	  // @param resourceName The name of the type of resource of the item.
	  // @param id The primary key of the item.
	  // @returns Timestamp from the last time the item was saved.
	  lastSaved: function lastSaved(resourceName, id) {
	    var _check$call6 = check.call(this, 'lastSaved', resourceName, id || fakeId);

	    var _this = _check$call6._this;
	    var _resourceName = _check$call6._resourceName;
	    var _id = _check$call6._id;

	    var resource = _this.store[_resourceName];

	    if (!(_id in resource.saved)) {
	      resource.saved[_id] = 0;
	    }
	    return resource.saved[_id];
	  },

	  // Return the previous attributes of the item with the given primary key before it was changed.
	  //
	  // @param resourceName The name of the type of resource of the item.
	  // @param id The primary key of the item.
	  // @returns The previous attributes of the item
	  previous: function previous(resourceName, id) {
	    var _check$call7 = check.call(this, 'previous', resourceName, id);

	    var _this = _check$call7._this;
	    var _resourceName = _check$call7._resourceName;
	    var _id = _check$call7._id;

	    var resource = _this.store[_resourceName];

	    // return resource from cache
	    return resource.previousAttributes[_id] ? _utils['default'].copy(resource.previousAttributes[_id]) : undefined;
	  },

	  // Revert all attributes of the item with the given primary key to their previous values.
	  //
	  // @param resourceName The name of the type of resource of the item.
	  // @param id The primary key of the item.
	  // @returns The reverted item
	  revert: function revert(resourceName, id) {
	    var _check$call8 = check.call(this, 'revert', resourceName, id);

	    var _this = _check$call8._this;
	    var definition = _check$call8.definition;
	    var _resourceName = _check$call8._resourceName;
	    var _id = _check$call8._id;

	    return definition.inject(_this.previous(_resourceName, _id));
	  }
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	exports['default'] = {
	  create: __webpack_require__(34),
	  destroy: __webpack_require__(35),
	  destroyAll: __webpack_require__(36),
	  find: __webpack_require__(37),
	  findAll: __webpack_require__(38),
	  loadRelations: __webpack_require__(39),
	  reap: __webpack_require__(40),
	  refresh: function refresh(resourceName, id, options) {
	    var _this = this;
	    var DSUtils = _this.utils;

	    return new DSUtils.Promise(function (resolve, reject) {
	      var definition = _this.definitions[resourceName];
	      id = DSUtils.resolveId(_this.definitions[resourceName], id);
	      if (!definition) {
	        reject(new _this.errors.NER(resourceName));
	      } else if (!DSUtils._sn(id)) {
	        reject(DSUtils._snErr('id'));
	      } else {
	        options = DSUtils._(definition, options);
	        options.bypassCache = true;
	        options.logFn('refresh', id, options);
	        resolve(_this.get(resourceName, id));
	      }
	    }).then(function (item) {
	      return item ? _this.find(resourceName, id, options) : item;
	    });
	  },
	  refreshAll: function refreshAll(resourceName, params, options) {
	    var _this = this;
	    var DSUtils = _this.utils;
	    var definition = _this.definitions[resourceName];
	    params = params || {};

	    return new DSUtils.Promise(function (resolve, reject) {
	      if (!definition) {
	        reject(new _this.errors.NER(resourceName));
	      } else if (!DSUtils._o(params)) {
	        reject(DSUtils._oErr('params'));
	      } else {
	        options = DSUtils._(definition, options);
	        options.bypassCache = true;
	        options.logFn('refreshAll', params, options);
	        resolve(_this.filter(resourceName, params, options));
	      }
	    }).then(function (existing) {
	      options.bypassCache = true;
	      return _this.findAll(resourceName, params, options).then(function (found) {
	        DSUtils.forEach(existing, function (item) {
	          if (found.indexOf(item) === -1) {
	            definition.eject(item);
	          }
	        });
	        return found;
	      });
	    });
	  },
	  save: __webpack_require__(41),
	  update: __webpack_require__(42),
	  updateAll: __webpack_require__(43)
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
	 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
	 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
	 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
	 * Code distributed by Google as part of the polymer project is also
	 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
	 */

	// Modifications
	// Copyright 2014-2015 Jason Dobry
	//
	// Summary of modifications:
	// Fixed use of "delete" keyword for IE8 compatibility
	// Exposed diffObjectFromOldObject on the exported object
	// Added the "equals" argument to diffObjectFromOldObject to be used to check equality
	// Added a way in diffObjectFromOldObject to ignore changes to certain properties
	// Removed all code related to:
	// - ArrayObserver
	// - ArraySplice
	// - PathObserver
	// - CompoundObserver
	// - Path
	// - ObserverTransform

	(function(global) {
	  var testingExposeCycleCount = global.testingExposeCycleCount;

	  // Detect and do basic sanity checking on Object/Array.observe.
	  function detectObjectObserve() {
	    if (typeof Object.observe !== 'function' ||
	        typeof Array.observe !== 'function') {
	      return false;
	    }

	    var records = [];

	    function callback(recs) {
	      records = recs;
	    }

	    var test = {};
	    var arr = [];
	    Object.observe(test, callback);
	    Array.observe(arr, callback);
	    test.id = 1;
	    test.id = 2;
	    delete test.id;
	    arr.push(1, 2);
	    arr.length = 0;

	    Object.deliverChangeRecords(callback);
	    if (records.length !== 5)
	      return false;

	    if (records[0].type != 'add' ||
	        records[1].type != 'update' ||
	        records[2].type != 'delete' ||
	        records[3].type != 'splice' ||
	        records[4].type != 'splice') {
	      return false;
	    }

	    Object.unobserve(test, callback);
	    Array.unobserve(arr, callback);

	    return true;
	  }

	  var hasObserve = detectObjectObserve();

	  var createObject = ('__proto__' in {}) ?
	    function(obj) { return obj; } :
	    function(obj) {
	      var proto = obj.__proto__;
	      if (!proto)
	        return obj;
	      var newObject = Object.create(proto);
	      Object.getOwnPropertyNames(obj).forEach(function(name) {
	        Object.defineProperty(newObject, name,
	                             Object.getOwnPropertyDescriptor(obj, name));
	      });
	      return newObject;
	    };

	  var MAX_DIRTY_CHECK_CYCLES = 1000;

	  function dirtyCheck(observer) {
	    var cycles = 0;
	    while (cycles < MAX_DIRTY_CHECK_CYCLES && observer.check_()) {
	      cycles++;
	    }
	    if (testingExposeCycleCount)
	      global.dirtyCheckCycleCount = cycles;

	    return cycles > 0;
	  }

	  function objectIsEmpty(object) {
	    for (var prop in object)
	      return false;
	    return true;
	  }

	  function diffIsEmpty(diff) {
	    return objectIsEmpty(diff.added) &&
	           objectIsEmpty(diff.removed) &&
	           objectIsEmpty(diff.changed);
	  }

	  function isBlacklisted(prop, bl) {
	    if (!bl || !bl.length) {
	      return false;
	    }
	    var matches;
	    for (var i = 0; i < bl.length; i++) {
	      if ((Object.prototype.toString.call(bl[i]) === '[object RegExp]' && bl[i].test(prop)) || bl[i] === prop) {
	        return matches = prop;
	      }
	    }
	    return !!matches;
	  }

	  function diffObjectFromOldObject(object, oldObject, equals, bl) {
	    var added = {};
	    var removed = {};
	    var changed = {};

	    for (var prop in oldObject) {
	      var newValue = object[prop];

	      if (isBlacklisted(prop, bl))
	        continue;

	      if (newValue !== undefined && (equals ? equals(newValue, oldObject[prop]) : newValue === oldObject[prop]))
	        continue;

	      if (!(prop in object)) {
	        removed[prop] = undefined;
	        continue;
	      }

	      if (equals ? !equals(newValue, oldObject[prop]) : newValue !== oldObject[prop])
	        changed[prop] = newValue;
	    }

	    for (var prop in object) {
	      if (prop in oldObject)
	        continue;

	      if (isBlacklisted(prop, bl))
	        continue;

	      added[prop] = object[prop];
	    }

	    if (Array.isArray(object) && object.length !== oldObject.length)
	      changed.length = object.length;

	    return {
	      added: added,
	      removed: removed,
	      changed: changed
	    };
	  }

	  var eomTasks = [];
	  function runEOMTasks() {
	    if (!eomTasks.length)
	      return false;

	    for (var i = 0; i < eomTasks.length; i++) {
	      eomTasks[i]();
	    }
	    eomTasks.length = 0;
	    return true;
	  }

	  var runEOM = hasObserve ? (function(){
	    return function(fn) {
	      return Promise.resolve().then(fn);
	    }
	  })() :
	  (function() {
	    return function(fn) {
	      eomTasks.push(fn);
	    };
	  })();

	  var observedObjectCache = [];

	  function newObservedObject() {
	    var observer;
	    var object;
	    var discardRecords = false;
	    var first = true;

	    function callback(records) {
	      if (observer && observer.state_ === OPENED && !discardRecords)
	        observer.check_(records);
	    }

	    return {
	      open: function(obs) {
	        if (observer)
	          throw Error('ObservedObject in use');

	        if (!first)
	          Object.deliverChangeRecords(callback);

	        observer = obs;
	        first = false;
	      },
	      observe: function(obj, arrayObserve) {
	        object = obj;
	        if (arrayObserve)
	          Array.observe(object, callback);
	        else
	          Object.observe(object, callback);
	      },
	      deliver: function(discard) {
	        discardRecords = discard;
	        Object.deliverChangeRecords(callback);
	        discardRecords = false;
	      },
	      close: function() {
	        observer = undefined;
	        Object.unobserve(object, callback);
	        observedObjectCache.push(this);
	      }
	    };
	  }

	  function getObservedObject(observer, object, arrayObserve) {
	    var dir = observedObjectCache.pop() || newObservedObject();
	    dir.open(observer);
	    dir.observe(object, arrayObserve);
	    return dir;
	  }

	  var UNOPENED = 0;
	  var OPENED = 1;
	  var CLOSED = 2;

	  var nextObserverId = 1;

	  function Observer() {
	    this.state_ = UNOPENED;
	    this.callback_ = undefined;
	    this.target_ = undefined; // TODO(rafaelw): Should be WeakRef
	    this.directObserver_ = undefined;
	    this.value_ = undefined;
	    this.id_ = nextObserverId++;
	  }

	  Observer.prototype = {
	    open: function(callback, target) {
	      if (this.state_ != UNOPENED)
	        throw Error('Observer has already been opened.');

	      addToAll(this);
	      this.callback_ = callback;
	      this.target_ = target;
	      this.connect_();
	      this.state_ = OPENED;
	      return this.value_;
	    },

	    close: function() {
	      if (this.state_ != OPENED)
	        return;

	      removeFromAll(this);
	      this.disconnect_();
	      this.value_ = undefined;
	      this.callback_ = undefined;
	      this.target_ = undefined;
	      this.state_ = CLOSED;
	    },

	    deliver: function() {
	      if (this.state_ != OPENED)
	        return;

	      dirtyCheck(this);
	    },

	    report_: function(changes) {
	      try {
	        this.callback_.apply(this.target_, changes);
	      } catch (ex) {
	        Observer._errorThrownDuringCallback = true;
	        console.error('Exception caught during observer callback: ' +
	                       (ex.stack || ex));
	      }
	    },

	    discardChanges: function() {
	      this.check_(undefined, true);
	      return this.value_;
	    }
	  }

	  var collectObservers = !hasObserve;
	  var allObservers;
	  Observer._allObserversCount = 0;

	  if (collectObservers) {
	    allObservers = [];
	  }

	  function addToAll(observer) {
	    Observer._allObserversCount++;
	    if (!collectObservers)
	      return;

	    allObservers.push(observer);
	  }

	  function removeFromAll(observer) {
	    Observer._allObserversCount--;
	  }

	  var runningMicrotaskCheckpoint = false;

	  global.Platform = global.Platform || {};

	  global.Platform.performMicrotaskCheckpoint = function() {
	    if (runningMicrotaskCheckpoint)
	      return;

	    if (!collectObservers)
	      return;

	    runningMicrotaskCheckpoint = true;

	    var cycles = 0;
	    var anyChanged, toCheck;

	    do {
	      cycles++;
	      toCheck = allObservers;
	      allObservers = [];
	      anyChanged = false;

	      for (var i = 0; i < toCheck.length; i++) {
	        var observer = toCheck[i];
	        if (observer.state_ != OPENED)
	          continue;

	        if (observer.check_())
	          anyChanged = true;

	        allObservers.push(observer);
	      }
	      if (runEOMTasks())
	        anyChanged = true;
	    } while (cycles < MAX_DIRTY_CHECK_CYCLES && anyChanged);

	    if (testingExposeCycleCount)
	      global.dirtyCheckCycleCount = cycles;

	    runningMicrotaskCheckpoint = false;
	  };

	  if (collectObservers) {
	    global.Platform.clearObservers = function() {
	      allObservers = [];
	    };
	  }

	  function ObjectObserver(object) {
	    Observer.call(this);
	    this.value_ = object;
	    this.oldObject_ = undefined;
	  }

	  ObjectObserver.prototype = createObject({
	    __proto__: Observer.prototype,

	    arrayObserve: false,

	    connect_: function(callback, target) {
	      if (hasObserve) {
	        this.directObserver_ = getObservedObject(this, this.value_,
	                                                 this.arrayObserve);
	      } else {
	        this.oldObject_ = this.copyObject(this.value_);
	      }

	    },

	    copyObject: function(object) {
	      var copy = Array.isArray(object) ? [] : {};
	      for (var prop in object) {
	        copy[prop] = object[prop];
	      };
	      if (Array.isArray(object))
	        copy.length = object.length;
	      return copy;
	    },

	    check_: function(changeRecords, skipChanges) {
	      var diff;
	      var oldValues;
	      if (hasObserve) {
	        if (!changeRecords)
	          return false;

	        oldValues = {};
	        diff = diffObjectFromChangeRecords(this.value_, changeRecords,
	                                           oldValues);
	      } else {
	        oldValues = this.oldObject_;
	        diff = diffObjectFromOldObject(this.value_, this.oldObject_);
	      }

	      if (diffIsEmpty(diff))
	        return false;

	      if (!hasObserve)
	        this.oldObject_ = this.copyObject(this.value_);

	      this.report_([
	        diff.added || {},
	        diff.removed || {},
	        diff.changed || {},
	        function(property) {
	          return oldValues[property];
	        }
	      ]);

	      return true;
	    },

	    disconnect_: function() {
	      if (hasObserve) {
	        this.directObserver_.close();
	        this.directObserver_ = undefined;
	      } else {
	        this.oldObject_ = undefined;
	      }
	    },

	    deliver: function() {
	      if (this.state_ != OPENED)
	        return;

	      if (hasObserve)
	        this.directObserver_.deliver(false);
	      else
	        dirtyCheck(this);
	    },

	    discardChanges: function() {
	      if (this.directObserver_)
	        this.directObserver_.deliver(true);
	      else
	        this.oldObject_ = this.copyObject(this.value_);

	      return this.value_;
	    }
	  });

	  var observerSentinel = {};

	  var expectedRecordTypes = {
	    add: true,
	    update: true,
	    'delete': true
	  };

	  function diffObjectFromChangeRecords(object, changeRecords, oldValues) {
	    var added = {};
	    var removed = {};

	    for (var i = 0; i < changeRecords.length; i++) {
	      var record = changeRecords[i];
	      if (!expectedRecordTypes[record.type]) {
	        console.error('Unknown changeRecord type: ' + record.type);
	        console.error(record);
	        continue;
	      }

	      if (!(record.name in oldValues))
	        oldValues[record.name] = record.oldValue;

	      if (record.type == 'update')
	        continue;

	      if (record.type == 'add') {
	        if (record.name in removed)
	          delete removed[record.name];
	        else
	          added[record.name] = true;

	        continue;
	      }

	      // type = 'delete'
	      if (record.name in added) {
	        delete added[record.name];
	        delete oldValues[record.name];
	      } else {
	        removed[record.name] = true;
	      }
	    }

	    for (var prop in added)
	      added[prop] = object[prop];

	    for (var prop in removed)
	      removed[prop] = undefined;

	    var changed = {};
	    for (var prop in oldValues) {
	      if (prop in added || prop in removed)
	        continue;

	      var newValue = object[prop];
	      if (oldValues[prop] !== newValue)
	        changed[prop] = newValue;
	    }

	    return {
	      added: added,
	      removed: removed,
	      changed: changed
	    };
	  }

	  // Export the observe-js object for **Node.js**, with backwards-compatibility
	  // for the old `require()` API. Also ensure `exports` is not a DOM Element.
	  // If we're in the browser, export as a global object.

	  global.Observer = Observer;
	  global.isBlacklisted = isBlacklisted;
	  global.Observer.runEOM_ = runEOM;
	  global.Observer.observerSentinel_ = observerSentinel; // for testing.
	  global.Observer.hasObjectObserve = hasObserve;
	  global.diffObjectFromOldObject = diffObjectFromOldObject;
	  global.ObjectObserver = ObjectObserver;

	})(exports);


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * yabh
	 * @version 1.1.0 - Homepage <http://jmdobry.github.io/yabh/>
	 * @author Jason Dobry <jason.dobry@gmail.com>
	 * @copyright (c) 2015 Jason Dobry 
	 * @license MIT <https://github.com/jmdobry/yabh/blob/master/LICENSE>
	 * 
	 * @overview Yet another Binary Heap.
	 */
	(function webpackUniversalModuleDefinition(root, factory) {
		if(true)
			module.exports = factory();
		else if(typeof define === 'function' && define.amd)
			define("yabh", factory);
		else if(typeof exports === 'object')
			exports["BinaryHeap"] = factory();
		else
			root["BinaryHeap"] = factory();
	})(this, function() {
	return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};

	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {

	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;

	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};

	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;

	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}


	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;

	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;

	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";

	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ function(module, exports, __webpack_require__) {

		/**
		 * @method bubbleUp
		 * @param {array} heap The heap.
		 * @param {function} weightFunc The weight function.
		 * @param {number} n The index of the element to bubble up.
		 */
		function bubbleUp(heap, weightFunc, n) {
		  var element = heap[n];
		  var weight = weightFunc(element);
		  // When at 0, an element can not go up any further.
		  while (n > 0) {
		    // Compute the parent element's index, and fetch it.
		    var parentN = Math.floor((n + 1) / 2) - 1;
		    var _parent = heap[parentN];
		    // If the parent has a lesser weight, things are in order and we
		    // are done.
		    if (weight >= weightFunc(_parent)) {
		      break;
		    } else {
		      heap[parentN] = element;
		      heap[n] = _parent;
		      n = parentN;
		    }
		  }
		}

		/**
		 * @method bubbleDown
		 * @param {array} heap The heap.
		 * @param {function} weightFunc The weight function.
		 * @param {number} n The index of the element to sink down.
		 */
		var bubbleDown = function bubbleDown(heap, weightFunc, n) {
		  var length = heap.length;
		  var node = heap[n];
		  var nodeWeight = weightFunc(node);

		  while (true) {
		    var child2N = (n + 1) * 2,
		        child1N = child2N - 1;
		    var swap = null;
		    if (child1N < length) {
		      var child1 = heap[child1N],
		          child1Weight = weightFunc(child1);
		      // If the score is less than our node's, we need to swap.
		      if (child1Weight < nodeWeight) {
		        swap = child1N;
		      }
		    }
		    // Do the same checks for the other child.
		    if (child2N < length) {
		      var child2 = heap[child2N],
		          child2Weight = weightFunc(child2);
		      if (child2Weight < (swap === null ? nodeWeight : weightFunc(heap[child1N]))) {
		        swap = child2N;
		      }
		    }

		    if (swap === null) {
		      break;
		    } else {
		      heap[n] = heap[swap];
		      heap[swap] = node;
		      n = swap;
		    }
		  }
		};

		function BinaryHeap(weightFunc, compareFunc) {
		  if (!weightFunc) {
		    weightFunc = function (x) {
		      return x;
		    };
		  }
		  if (!compareFunc) {
		    compareFunc = function (x, y) {
		      return x === y;
		    };
		  }
		  if (typeof weightFunc !== 'function') {
		    throw new Error('BinaryHeap([weightFunc][, compareFunc]): "weightFunc" must be a function!');
		  }
		  if (typeof compareFunc !== 'function') {
		    throw new Error('BinaryHeap([weightFunc][, compareFunc]): "compareFunc" must be a function!');
		  }
		  this.weightFunc = weightFunc;
		  this.compareFunc = compareFunc;
		  this.heap = [];
		}

		var BHProto = BinaryHeap.prototype;

		BHProto.push = function (node) {
		  this.heap.push(node);
		  bubbleUp(this.heap, this.weightFunc, this.heap.length - 1);
		};

		BHProto.peek = function () {
		  return this.heap[0];
		};

		BHProto.pop = function () {
		  var front = this.heap[0];
		  var end = this.heap.pop();
		  if (this.heap.length > 0) {
		    this.heap[0] = end;
		    bubbleDown(this.heap, this.weightFunc, 0);
		  }
		  return front;
		};

		BHProto.remove = function (node) {
		  var length = this.heap.length;
		  for (var i = 0; i < length; i++) {
		    if (this.compareFunc(this.heap[i], node)) {
		      var removed = this.heap[i];
		      var end = this.heap.pop();
		      if (i !== length - 1) {
		        this.heap[i] = end;
		        bubbleUp(this.heap, this.weightFunc, i);
		        bubbleDown(this.heap, this.weightFunc, i);
		      }
		      return removed;
		    }
		  }
		  return null;
		};

		BHProto.removeAll = function () {
		  this.heap = [];
		};

		BHProto.size = function () {
		  return this.heap.length;
		};

		module.exports = BinaryHeap;

	/***/ }
	/******/ ])
	});
	;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	

	    /**
	     * Array forEach
	     */
	    function forEach(arr, callback, thisObj) {
	        if (arr == null) {
	            return;
	        }
	        var i = -1,
	            len = arr.length;
	        while (++i < len) {
	            // we iterate over sparse items since there is no way to make it
	            // work properly on IE 7-8. see #64
	            if ( callback.call(thisObj, arr[i], i, arr) === false ) {
	                break;
	            }
	        }
	    }

	    module.exports = forEach;




/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	

	    /**
	     * Create slice of source array or array-like object
	     */
	    function slice(arr, start, end){
	        var len = arr.length;

	        if (start == null) {
	            start = 0;
	        } else if (start < 0) {
	            start = Math.max(len + start, 0);
	        } else {
	            start = Math.min(start, len);
	        }

	        if (end == null) {
	            end = len;
	        } else if (end < 0) {
	            end = Math.max(len + end, 0);
	        } else {
	            end = Math.min(end, len);
	        }

	        var result = [];
	        while (start < end) {
	            result.push(arr[start++]);
	        }

	        return result;
	    }

	    module.exports = slice;




/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var indexOf = __webpack_require__(21);

	    /**
	     * If array contains values.
	     */
	    function contains(arr, val) {
	        return indexOf(arr, val) !== -1;
	    }
	    module.exports = contains;



/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var indexOf = __webpack_require__(21);

	    /**
	     * Remove a single item from the array.
	     * (it won't remove duplicates, just a single item)
	     */
	    function remove(arr, item){
	        var idx = indexOf(arr, item);
	        if (idx !== -1) arr.splice(idx, 1);
	    }

	    module.exports = remove;



/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	

	    /**
	     * Merge sort (http://en.wikipedia.org/wiki/Merge_sort)
	     */
	    function mergeSort(arr, compareFn) {
	        if (arr == null) {
	            return [];
	        } else if (arr.length < 2) {
	            return arr;
	        }

	        if (compareFn == null) {
	            compareFn = defaultCompare;
	        }

	        var mid, left, right;

	        mid   = ~~(arr.length / 2);
	        left  = mergeSort( arr.slice(0, mid), compareFn );
	        right = mergeSort( arr.slice(mid, arr.length), compareFn );

	        return merge(left, right, compareFn);
	    }

	    function defaultCompare(a, b) {
	        return a < b ? -1 : (a > b? 1 : 0);
	    }

	    function merge(left, right, compareFn) {
	        var result = [];

	        while (left.length && right.length) {
	            if (compareFn(left[0], right[0]) <= 0) {
	                // if 0 it should preserve same order (stable)
	                result.push(left.shift());
	            } else {
	                result.push(right.shift());
	            }
	        }

	        if (left.length) {
	            result.push.apply(result, left);
	        }

	        if (right.length) {
	            result.push.apply(result, right);
	        }

	        return result;
	    }

	    module.exports = mergeSort;




/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var hasOwn = __webpack_require__(22);
	var forIn = __webpack_require__(23);

	    /**
	     * Similar to Array/forEach but works over object properties and fixes Don't
	     * Enum bug on IE.
	     * based on: http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
	     */
	    function forOwn(obj, fn, thisObj){
	        forIn(obj, function(val, key){
	            if (hasOwn(obj, key)) {
	                return fn.call(thisObj, obj[key], key, obj);
	            }
	        });
	    }

	    module.exports = forOwn;




/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var forOwn = __webpack_require__(13);
	var isPlainObject = __webpack_require__(24);

	    /**
	     * Mixes objects into the target object, recursively mixing existing child
	     * objects.
	     */
	    function deepMixIn(target, objects) {
	        var i = 0,
	            n = arguments.length,
	            obj;

	        while(++i < n){
	            obj = arguments[i];
	            if (obj) {
	                forOwn(obj, copyProp, target);
	            }
	        }

	        return target;
	    }

	    function copyProp(val, key) {
	        var existing = this[key];
	        if (isPlainObject(val) && isPlainObject(existing)) {
	            deepMixIn(existing, val);
	        } else {
	            this[key] = val;
	        }
	    }

	    module.exports = deepMixIn;




/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var slice = __webpack_require__(9);

	    /**
	     * Return a copy of the object, filtered to only have values for the whitelisted keys.
	     */
	    function pick(obj, var_keys){
	        var keys = typeof arguments[1] !== 'string'? arguments[1] : slice(arguments, 1),
	            out = {},
	            i = 0, key;
	        while (key = keys[i++]) {
	            out[key] = obj[key];
	        }
	        return out;
	    }

	    module.exports = pick;




/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var forOwn = __webpack_require__(13);

	    /**
	     * Get object keys
	     */
	     var keys = Object.keys || function (obj) {
	            var keys = [];
	            forOwn(obj, function(val, key){
	                keys.push(key);
	            });
	            return keys;
	        };

	    module.exports = keys;




/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var isPrimitive = __webpack_require__(26);

	    /**
	     * get "nested" object property
	     */
	    function get(obj, prop){
	        var parts = prop.split('.'),
	            last = parts.pop();

	        while (prop = parts.shift()) {
	            obj = obj[prop];
	            if (obj == null) return;
	        }

	        return obj[last];
	    }

	    module.exports = get;




/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var namespace = __webpack_require__(25);

	    /**
	     * set "nested" object property
	     */
	    function set(obj, prop, val){
	        var parts = (/^(.+)\.(.+)$/).exec(prop);
	        if (parts){
	            namespace(obj, parts[1])[parts[2]] = val;
	        } else {
	            obj[prop] = val;
	        }
	    }

	    module.exports = set;




/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var toString = __webpack_require__(32);
	var camelCase = __webpack_require__(33);
	var upperCase = __webpack_require__(20);
	    /**
	     * camelCase + UPPERCASE first char
	     */
	    function pascalCase(str){
	        str = toString(str);
	        return camelCase(str).replace(/^[a-z]/, upperCase);
	    }

	    module.exports = pascalCase;



/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var toString = __webpack_require__(32);
	    /**
	     * "Safer" String.toUpperCase()
	     */
	    function upperCase(str){
	        str = toString(str);
	        return str.toUpperCase();
	    }
	    module.exports = upperCase;



/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	

	    /**
	     * Array.indexOf
	     */
	    function indexOf(arr, item, fromIndex) {
	        fromIndex = fromIndex || 0;
	        if (arr == null) {
	            return -1;
	        }

	        var len = arr.length,
	            i = fromIndex < 0 ? len + fromIndex : fromIndex;
	        while (i < len) {
	            // we iterate over sparse items since there is no way to make it
	            // work properly on IE 7-8. see #64
	            if (arr[i] === item) {
	                return i;
	            }

	            i++;
	        }

	        return -1;
	    }

	    module.exports = indexOf;



/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	

	    /**
	     * Safer Object.hasOwnProperty
	     */
	     function hasOwn(obj, prop){
	         return Object.prototype.hasOwnProperty.call(obj, prop);
	     }

	     module.exports = hasOwn;




/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var hasOwn = __webpack_require__(22);

	    var _hasDontEnumBug,
	        _dontEnums;

	    function checkDontEnum(){
	        _dontEnums = [
	                'toString',
	                'toLocaleString',
	                'valueOf',
	                'hasOwnProperty',
	                'isPrototypeOf',
	                'propertyIsEnumerable',
	                'constructor'
	            ];

	        _hasDontEnumBug = true;

	        for (var key in {'toString': null}) {
	            _hasDontEnumBug = false;
	        }
	    }

	    /**
	     * Similar to Array/forEach but works over object properties and fixes Don't
	     * Enum bug on IE.
	     * based on: http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
	     */
	    function forIn(obj, fn, thisObj){
	        var key, i = 0;
	        // no need to check if argument is a real object that way we can use
	        // it for arrays, functions, date, etc.

	        //post-pone check till needed
	        if (_hasDontEnumBug == null) checkDontEnum();

	        for (key in obj) {
	            if (exec(fn, obj, key, thisObj) === false) {
	                break;
	            }
	        }


	        if (_hasDontEnumBug) {
	            var ctor = obj.constructor,
	                isProto = !!ctor && obj === ctor.prototype;

	            while (key = _dontEnums[i++]) {
	                // For constructor, if it is a prototype object the constructor
	                // is always non-enumerable unless defined otherwise (and
	                // enumerated above).  For non-prototype objects, it will have
	                // to be defined on this object, since it cannot be defined on
	                // any prototype objects.
	                //
	                // For other [[DontEnum]] properties, check if the value is
	                // different than Object prototype value.
	                if (
	                    (key !== 'constructor' ||
	                        (!isProto && hasOwn(obj, key))) &&
	                    obj[key] !== Object.prototype[key]
	                ) {
	                    if (exec(fn, obj, key, thisObj) === false) {
	                        break;
	                    }
	                }
	            }
	        }
	    }

	    function exec(fn, obj, key, thisObj){
	        return fn.call(thisObj, obj[key], key, obj);
	    }

	    module.exports = forIn;




/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	

	    /**
	     * Checks if the value is created by the `Object` constructor.
	     */
	    function isPlainObject(value) {
	        return (!!value && typeof value === 'object' &&
	            value.constructor === Object);
	    }

	    module.exports = isPlainObject;




/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var forEach = __webpack_require__(8);

	    /**
	     * Create nested object if non-existent
	     */
	    function namespace(obj, path){
	        if (!path) return obj;
	        forEach(path.split('.'), function(key){
	            if (!obj[key]) {
	                obj[key] = {};
	            }
	            obj = obj[key];
	        });
	        return obj;
	    }

	    module.exports = namespace;




/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	

	    /**
	     * Checks if the object is a primitive
	     */
	    function isPrimitive(value) {
	        // Using switch fallthrough because it's simple to read and is
	        // generally fast: http://jsperf.com/testing-value-is-primitive/5
	        switch (typeof value) {
	            case "string":
	            case "number":
	            case "boolean":
	                return true;
	        }

	        return value == null;
	    }

	    module.exports = isPrimitive;




/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/*jshint evil:true, loopfunc:true*/

	var _utils = __webpack_require__(2);

	var _errors = __webpack_require__(3);

	/**
	 * These are DS methods that will be proxied by instances. e.g.
	 *
	 * var store = new JSData.DS();
	 * var User = store.defineResource('user');
	 * var user = User.createInstance({ id: 1 });
	 *
	 * store.update(resourceName, id, attrs[, options]) // DS method
	 * User.update(id, attrs[, options]) // DS method proxied on a Resource
	 * user.DSUpdate(attrs[, options]) // DS method proxied on an Instance
	 */
	var instanceMethods = ['compute', 'eject', 'refresh', 'save', 'update', 'destroy', 'loadRelations', 'changeHistory', 'changes', 'hasChanges', 'lastModified', 'lastSaved', 'previous', 'revert'];

	module.exports = function defineResource(definition) {
	  var _this = this;
	  var definitions = _this.definitions;

	  /**
	   * This allows the name-only definition shorthand.
	   * store.defineResource('user') is the same as store.defineResource({ name: 'user'})
	   */
	  if (_utils['default']._s(definition)) {
	    definition = {
	      name: definition.replace(/\s/gi, '')
	    };
	  }
	  if (!_utils['default']._o(definition)) {
	    throw _utils['default']._oErr('definition');
	  } else if (!_utils['default']._s(definition.name)) {
	    throw new _errors['default'].IA('"name" must be a string!');
	  } else if (definitions[definition.name]) {
	    throw new _errors['default'].R(definition.name + ' is already registered!');
	  }

	  /**
	   * Dynamic Resource constructor function.
	   *
	   * A Resource inherits from the defaults of the data store that created it.
	   */
	  function Resource(options) {
	    this.defaultValues = {};
	    this.methods = {};
	    this.computed = {};
	    _utils['default'].deepMixIn(this, options);
	    var parent = _this.defaults;
	    if (definition['extends'] && definitions[definition['extends']]) {
	      parent = definitions[definition['extends']];
	    }
	    _utils['default'].fillIn(this.defaultValues, parent.defaultValues);
	    _utils['default'].fillIn(this.methods, parent.methods);
	    _utils['default'].fillIn(this.computed, parent.computed);
	    this.endpoint = 'endpoint' in options ? options.endpoint : this.name;
	  }

	  try {
	    var def;

	    var _class;

	    var _ret = (function () {
	      // Resources can inherit from another resource instead of inheriting directly from the data store defaults.
	      if (definition['extends'] && definitions[definition['extends']]) {
	        // Inherit from another resource
	        Resource.prototype = definitions[definition['extends']];
	      } else {
	        // Inherit from global defaults
	        Resource.prototype = _this.defaults;
	      }
	      definitions[definition.name] = new Resource(definition);

	      def = definitions[definition.name];

	      def.getResource = function (resourceName) {
	        return _this.definitions[resourceName];
	      };

	      def.logFn('Preparing resource.');

	      if (!_utils['default']._s(def.idAttribute)) {
	        throw new _errors['default'].IA('"idAttribute" must be a string!');
	      }

	      // Setup nested parent configuration
	      if (def.relations) {
	        def.relationList = [];
	        def.relationFields = [];
	        _utils['default'].forOwn(def.relations, function (relatedModels, type) {
	          _utils['default'].forOwn(relatedModels, function (defs, relationName) {
	            if (!_utils['default']._a(defs)) {
	              relatedModels[relationName] = [defs];
	            }
	            _utils['default'].forEach(relatedModels[relationName], function (d) {
	              d.type = type;
	              d.relation = relationName;
	              d.name = def.name;
	              def.relationList.push(d);
	              if (d.localField) {
	                def.relationFields.push(d.localField);
	              }
	            });
	          });
	        });
	        if (def.relations.belongsTo) {
	          _utils['default'].forOwn(def.relations.belongsTo, function (relatedModel, modelName) {
	            _utils['default'].forEach(relatedModel, function (relation) {
	              if (relation.parent) {
	                def.parent = modelName;
	                def.parentKey = relation.localKey;
	                def.parentField = relation.localField;
	              }
	            });
	          });
	        }
	        if (typeof Object.freeze === 'function') {
	          Object.freeze(def.relations);
	          Object.freeze(def.relationList);
	        }
	      }

	      // Create the wrapper class for the new resource
	      _class = def['class'] = _utils['default'].pascalCase(def.name);

	      try {
	        if (typeof def.useClass === 'function') {
	          eval('function ' + _class + '() { def.useClass.call(this); }');
	          def[_class] = eval(_class);
	          def[_class].prototype = (function (proto) {
	            function Ctor() {}

	            Ctor.prototype = proto;
	            return new Ctor();
	          })(def.useClass.prototype);
	        } else {
	          eval('function ' + _class + '() {}');
	          def[_class] = eval(_class);
	        }
	      } catch (e) {
	        def[_class] = function () {};
	      }

	      // Apply developer-defined instance methods
	      _utils['default'].forOwn(def.methods, function (fn, m) {
	        def[_class].prototype[m] = fn;
	      });

	      /**
	       * var user = User.createInstance({ id: 1 });
	       * user.set('foo', 'bar');
	       */
	      def[_class].prototype.set = function (key, value) {
	        var _this2 = this;

	        _utils['default'].set(this, key, value);
	        def.compute(this);
	        if (def.instanceEvents) {
	          setTimeout(function () {
	            _this2.emit('DS.change', def, _this2);
	          }, 0);
	        }
	        def.handleChange(this);
	        return this;
	      };

	      /**
	       * var user = User.createInstance({ id: 1 });
	       * user.get('id'); // 1
	       */
	      def[_class].prototype.get = function (key) {
	        return _utils['default'].get(this, key);
	      };

	      if (def.instanceEvents) {
	        _utils['default'].Events(def[_class].prototype);
	      }

	      // Setup the relation links
	      _utils['default'].applyRelationGettersToTarget(_this, def, def[_class].prototype);

	      var parentOmit = null;
	      if (!def.hasOwnProperty('omit')) {
	        parentOmit = def.omit;
	        def.omit = [];
	      } else {
	        parentOmit = _this.defaults.omit;
	      }
	      def.omit = def.omit.concat(parentOmit || []);

	      // Prepare for computed properties
	      _utils['default'].forOwn(def.computed, function (fn, field) {
	        if (_utils['default'].isFunction(fn)) {
	          def.computed[field] = [fn];
	          fn = def.computed[field];
	        }
	        if (def.methods && field in def.methods) {
	          def.errorFn('Computed property "' + field + '" conflicts with previously defined prototype method!');
	        }
	        def.omit.push(field);
	        if (_utils['default'].isArray(fn)) {
	          var deps;
	          if (fn.length === 1) {
	            var match = fn[0].toString().match(/function.*?\(([\s\S]*?)\)/);
	            deps = match[1].split(',');
	            deps = _utils['default'].filter(deps, function (x) {
	              return x;
	            });
	            def.computed[field] = deps.concat(fn);
	            fn = def.computed[field];
	            if (deps.length) {
	              def.errorFn('Use the computed property array syntax for compatibility with minified code!');
	            }
	          }
	          deps = fn.slice(0, fn.length - 1);
	          _utils['default'].forEach(deps, function (val, index) {
	            deps[index] = val.trim();
	          });
	          fn.deps = _utils['default'].filter(deps, function (dep) {
	            return !!dep;
	          });
	        } else if (_utils['default'].isObject(fn)) {
	          Object.defineProperty(def[_class].prototype, field, fn);
	        }
	      });

	      // add instance proxies of DS methods
	      _utils['default'].forEach(instanceMethods, function (name) {
	        def[_class].prototype['DS' + _utils['default'].pascalCase(name)] = function () {
	          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	          }

	          args.unshift(this[def.idAttribute] || this);
	          args.unshift(def.name);
	          return _this[name].apply(_this, args);
	        };
	      });

	      // manually add instance proxy for DS#create
	      def[_class].prototype.DSCreate = function () {
	        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	          args[_key2] = arguments[_key2];
	        }

	        args.unshift(this);
	        args.unshift(def.name);
	        return _this.create.apply(_this, args);
	      };

	      // Initialize store data for the new resource
	      _this.store[def.name] = {
	        collection: [],
	        expiresHeap: new _utils['default'].BinaryHeap(function (x) {
	          return x.expires;
	        }, function (x, y) {
	          return x.item === y;
	        }),
	        completedQueries: {},
	        queryData: {},
	        pendingQueries: {},
	        index: {},
	        modified: {},
	        saved: {},
	        previousAttributes: {},
	        observers: {},
	        changeHistories: {},
	        changeHistory: [],
	        collectionModified: 0
	      };

	      var resource = _this.store[def.name];

	      // start the reaping
	      if (def.reapInterval) {
	        setInterval(function () {
	          return def.reap();
	        }, def.reapInterval);
	      }

	      // proxy DS methods with shorthand ones
	      var fns = ['registerAdapter', 'getAdapterName', 'getAdapter', 'is', '!clear'];
	      for (var key in _this) {
	        if (typeof _this[key] === 'function') {
	          fns.push(key);
	        }
	      }

	      /**
	       * Create the Resource shorthands that proxy DS methods. e.g.
	       *
	       * var store = new JSData.DS();
	       * var User = store.defineResource('user');
	       *
	       * store.update(resourceName, id, attrs[, options]) // DS method
	       * User.update(id, attrs[, options]) // DS method proxied on a Resource
	       */
	      _utils['default'].forEach(fns, function (key) {
	        var k = key;
	        if (k[0] === '!') {
	          return;
	        }
	        if (_this[k].shorthand !== false) {
	          def[k] = function () {
	            for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	              args[_key3] = arguments[_key3];
	            }

	            args.unshift(def.name);
	            return _this[k].apply(_this, args);
	          };
	          def[k].before = function (fn) {
	            var orig = def[k];
	            def[k] = function () {
	              for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
	                args[_key4] = arguments[_key4];
	              }

	              return orig.apply(def, fn.apply(def, args) || args);
	            };
	          };
	        } else {
	          def[k] = function () {
	            for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
	              args[_key5] = arguments[_key5];
	            }

	            return _this[k].apply(_this, args);
	          };
	        }
	      });

	      def.beforeValidate = _utils['default'].promisify(def.beforeValidate);
	      def.validate = _utils['default'].promisify(def.validate);
	      def.afterValidate = _utils['default'].promisify(def.afterValidate);
	      def.beforeCreate = _utils['default'].promisify(def.beforeCreate);
	      def.afterCreate = _utils['default'].promisify(def.afterCreate);
	      def.beforeUpdate = _utils['default'].promisify(def.beforeUpdate);
	      def.afterUpdate = _utils['default'].promisify(def.afterUpdate);
	      def.beforeDestroy = _utils['default'].promisify(def.beforeDestroy);
	      def.afterDestroy = _utils['default'].promisify(def.afterDestroy);

	      var defaultAdapter = undefined;
	      if (def.hasOwnProperty('defaultAdapter')) {
	        defaultAdapter = def.defaultAdapter;
	      }

	      // setup "actions"
	      _utils['default'].forOwn(def.actions, function (action, name) {
	        if (def[name] && !def.actions[name]) {
	          throw new Error('Cannot override existing method "' + name + '"!');
	        }
	        action.request = action.request || function (config) {
	          return config;
	        };
	        action.response = action.response || function (response) {
	          return response;
	        };
	        action.responseError = action.responseError || function (err) {
	          return _utils['default'].Promise.reject(err);
	        };
	        def[name] = function (id, options) {
	          if (_utils['default']._o(id)) {
	            options = id;
	          }
	          options = options || {};
	          var adapter = def.getAdapter(action.adapter || defaultAdapter || 'http');
	          var config = _utils['default'].deepMixIn({}, action);
	          if (!options.hasOwnProperty('endpoint') && config.endpoint) {
	            options.endpoint = config.endpoint;
	          }
	          if (typeof options.getEndpoint === 'function') {
	            config.url = options.getEndpoint(def, options);
	          } else {
	            var args = [options.basePath || adapter.defaults.basePath || def.basePath, adapter.getEndpoint(def, _utils['default']._sn(id) ? id : null, options)];
	            if (_utils['default']._sn(id)) {
	              args.push(id);
	            }
	            args.push(action.pathname || name);
	            config.url = _utils['default'].makePath.apply(null, args);
	          }
	          config.method = config.method || 'GET';
	          _utils['default'].deepMixIn(config, options);
	          return new _utils['default'].Promise(function (r) {
	            return r(config);
	          }).then(options.request || action.request).then(function (config) {
	            return adapter.HTTP(config);
	          }).then(options.response || action.response, options.responseError || action.responseError);
	        };
	      });

	      // mix in events
	      _utils['default'].Events(def);

	      def.handleChange = function (data) {
	        resource.collectionModified = _utils['default'].updateTimestamp(resource.collectionModified);
	        if (def.notify) {
	          setTimeout(function () {
	            def.emit('DS.change', def, data);
	          }, 0);
	        }
	      };

	      def.logFn('Done preparing resource.');

	      return {
	        v: def
	      };
	    })();

	    if (typeof _ret === 'object') return _ret.v;
	  } catch (err) {
	    _this.defaults.errorFn(err);
	    delete definitions[definition.name];
	    delete _this.store[definition.name];
	    throw err;
	  }
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Eject an item from the store, if it is currently in the store.
	 *
	 * @param resourceName The name of the resource type of the item eject.
	 * @param id The primary key of the item to eject.
	 * @param options Optional configuration.
	 * @param options.notify Whether to emit the "DS.beforeEject" and "DS.afterEject" events
	 * @param options.clearEmptyQueries Whether to remove cached findAll queries that become empty as a result of this method call.
	 * @returns The ejected item if one was ejected.
	 */
	module.exports = function eject(resourceName, id, options) {
	  var _this = this;
	  var DSUtils = _this.utils;
	  var definition = _this.definitions[resourceName];
	  var resource = _this.store[resourceName];
	  var item = undefined;
	  var found = false;

	  id = DSUtils.resolveId(definition, id);

	  if (!definition) {
	    throw new _this.errors.NER(resourceName);
	  } else if (!DSUtils._sn(id)) {
	    throw DSUtils._snErr('id');
	  }

	  options = DSUtils._(definition, options);

	  options.logFn('eject', id, options);

	  // find the item to eject
	  for (var i = 0; i < resource.collection.length; i++) {
	    if (resource.collection[i][definition.idAttribute] == id) {
	      // jshint ignore:line
	      item = resource.collection[i];
	      // remove its expiration timestamp
	      resource.expiresHeap.remove(item);
	      found = true;
	      break;
	    }
	  }
	  if (found) {
	    var _ret = (function () {
	      // lifecycle
	      definition.beforeEject(options, item);
	      if (options.notify) {
	        definition.emit('DS.beforeEject', definition, item);
	      }

	      // find the item in any ($$injected) cached queries
	      var toRemove = [];
	      DSUtils.forOwn(resource.queryData, function (items, queryHash) {
	        if (items.$$injected) {
	          DSUtils.remove(items, item);
	        }
	        // optionally remove any empty queries
	        if (!items.length && options.clearEmptyQueries) {
	          toRemove.push(queryHash);
	        }
	      });

	      // clean up
	      DSUtils.forEach(resource.changeHistories[id], function (changeRecord) {
	        DSUtils.remove(resource.changeHistory, changeRecord);
	      });
	      DSUtils.forEach(toRemove, function (queryHash) {
	        delete resource.completedQueries[queryHash];
	        delete resource.queryData[queryHash];
	      });
	      if (resource.observers[id] && typeof resource.observers[id].close === 'function') {
	        // stop observation
	        resource.observers[id].close();
	      }
	      delete resource.observers[id];
	      delete resource.index[id];
	      delete resource.previousAttributes[id];
	      delete resource.completedQueries[id];
	      delete resource.pendingQueries[id];
	      delete resource.changeHistories[id];
	      delete resource.modified[id];
	      delete resource.saved[id];

	      // remove it from the store
	      resource.collection.splice(i, 1);
	      // collection has been modified
	      definition.handleChange(item);

	      // lifecycle
	      definition.afterEject(options, item);
	      if (options.notify) {
	        definition.emit('DS.afterEject', definition, item);
	      }

	      return {
	        v: item
	      };
	    })();

	    if (typeof _ret === 'object') return _ret.v;
	  }
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Eject a collection of items from the store, if any items currently in the store match the given criteria.
	 *
	 * @param resourceName The name of the resource type of the items eject.
	 * @param params The criteria by which to match items to eject. See http://www.js-data.io/docs/query-syntax
	 * @param options Optional configuration.
	 * @returns The collection of items that were ejected, if any.
	 */
	module.exports = function ejectAll(resourceName, params, options) {
	  var _this = this;
	  var DSUtils = _this.utils;
	  var definition = _this.definitions[resourceName];
	  params = params || {};

	  if (!definition) {
	    throw new _this.errors.NER(resourceName);
	  } else if (!DSUtils._o(params)) {
	    throw DSUtils._oErr('params');
	  }

	  definition.logFn('ejectAll', params, options);

	  var resource = _this.store[resourceName];
	  var queryHash = DSUtils.toJson(params);

	  // get items that match the criteria
	  var items = definition.filter(params);

	  if (DSUtils.isEmpty(params)) {
	    // remove all completed queries if ejecting all items
	    resource.completedQueries = {};
	  } else {
	    // remove matching completed query, if any
	    delete resource.completedQueries[queryHash];
	  }
	  // prepare to remove matching items
	  DSUtils.forEach(items, function (item) {
	    if (item && item[definition.idAttribute]) {
	      definition.eject(item[definition.idAttribute], options);
	    }
	  });
	  // collection has been modified
	  definition.handleChange(items);
	  return items;
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Return the subset of items currently in the store that match the given criteria.
	 *
	 * The actual filtering is delegated to DS#defaults.defaultFilter, which can be overridden by developers.
	 *
	 * @param resourceName The name of the resource type of the items to filter.
	 * @param params The criteria by which to filter items. See http://www.js-data.io/docs/query-syntax
	 * @param options Optional configuration.
	 * @returns Matching items.
	 */
	module.exports = function filter(resourceName, params, options) {
	  var _this = this;
	  var DSUtils = _this.utils;
	  var definition = _this.definitions[resourceName];

	  if (!definition) {
	    throw new _this.errors.NER(resourceName);
	  } else if (params && !DSUtils._o(params)) {
	    throw DSUtils._oErr('params');
	  }

	  // Protect against null
	  params = params || {};
	  options = DSUtils._(definition, options);
	  options.logFn('filter', params, options);

	  // delegate filtering to DS#defaults.defaultFilter, which can be overridden by developers.
	  return definition.defaultFilter.call(_this, _this.store[resourceName].collection, resourceName, params, options);
	};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var _utils = __webpack_require__(2);

	var _errors = __webpack_require__(3);

	/**
	 * This is a beast of a file, but it's where a significant portion of the magic happens.
	 *
	 * DS#inject makes up the core of how data gets into the store.
	 */

	/**
	 * This factory function produces an observer handler function tailor-made for the current item being injected.
	 *
	 * The observer handler is what allows computed properties and change tracking to function.
	 *
	 * @param definition Resource definition produced by DS#defineResource
	 * @param resource Resource data as internally stored by the data store
	 * @returns {Function} Observer handler function
	 * @private
	 */
	function makeObserverHandler(definition, resource) {
	  var DS = this;

	  // using "var" avoids a JSHint error
	  var name = definition.name;

	  /**
	   * This will be called by observe-js when a new change record is available for the observed object
	   *
	   * @param added Change record for added properties
	   * @param removed Change record for removed properties
	   * @param changed Change record for changed properties
	   * @param oldValueFn Function that can be used to get the previous value of a changed property
	   * @param firstTime Whether this is the first time this function is being called for the given item. Will only be true once.
	   */
	  return function _react(added, removed, changed, oldValueFn, firstTime) {
	    var target = this;
	    var item = undefined;

	    // Get the previous primary key of the observed item, in-case some knucklehead changed it
	    var innerId = oldValueFn && oldValueFn(definition.idAttribute) ? oldValueFn(definition.idAttribute) : target[definition.idAttribute];

	    // Ignore changes to relation links
	    _utils['default'].forEach(definition.relationFields, function (field) {
	      delete added[field];
	      delete removed[field];
	      delete changed[field];
	    });

	    // Detect whether there are actually any changes
	    if (!_utils['default'].isEmpty(added) || !_utils['default'].isEmpty(removed) || !_utils['default'].isEmpty(changed) || firstTime) {
	      item = DS.get(name, innerId);

	      // update item and collection "modified" timestamps
	      resource.modified[innerId] = _utils['default'].updateTimestamp(resource.modified[innerId]);

	      if (item && definition.instanceEvents) {
	        setTimeout(function () {
	          item.emit('DS.change', definition, item);
	        }, 0);
	      }

	      definition.handleChange(item);

	      // Save a change record for the item
	      if (definition.keepChangeHistory) {
	        var changeRecord = {
	          resourceName: name,
	          target: item,
	          added: added,
	          removed: removed,
	          changed: changed,
	          timestamp: resource.modified[innerId]
	        };
	        resource.changeHistories[innerId].push(changeRecord);
	        resource.changeHistory.push(changeRecord);
	      }
	    }

	    // Recompute computed properties if any computed properties depend on changed properties
	    if (definition.computed) {
	      item = item || DS.get(name, innerId);
	      _utils['default'].forOwn(definition.computed, function (fn, field) {
	        var compute = false;
	        // check if required fields changed
	        _utils['default'].forEach(fn.deps, function (dep) {
	          if (dep in added || dep in removed || dep in changed || !(field in item)) {
	            compute = true;
	          }
	        });
	        compute = compute || !fn.deps.length;
	        if (compute) {
	          _utils['default'].compute.call(item, fn, field);
	        }
	      });
	    }

	    if (definition.idAttribute in changed) {
	      definition.errorFn('Doh! You just changed the primary key of an object! Your data for the "' + name + '" resource is now in an undefined (probably broken) state.');
	    }
	  };
	}

	/**
	 * A recursive function for injecting data into the store.
	 *
	 * @param definition Resource definition produced by DS#defineResource
	 * @param resource Resource data as internally stored by the data store
	 * @param attrs The data to be injected. Will be an object or an array of objects.
	 * @param options Optional configuration.
	 * @returns The injected data
	 * @private
	 */
	function _inject(definition, resource, attrs, options) {
	  var _this = this;
	  var injected = undefined;

	  if (_utils['default']._a(attrs)) {
	    // have an array of objects, go ahead and inject each one individually and return the resulting array
	    injected = [];
	    for (var i = 0; i < attrs.length; i++) {
	      injected.push(_inject.call(_this, definition, resource, attrs[i], options));
	    }
	  } else {
	    // create the observer handler for the data to be injected
	    var _react = makeObserverHandler.call(_this, definition, resource);

	    // check if "idAttribute" is a computed property
	    var c = definition.computed;
	    var idA = definition.idAttribute;
	    // compute the primary key if necessary
	    if (c && c[idA]) {
	      (function () {
	        var args = [];
	        _utils['default'].forEach(c[idA].deps, function (dep) {
	          args.push(attrs[dep]);
	        });
	        attrs[idA] = c[idA][c[idA].length - 1].apply(attrs, args);
	      })();
	    }

	    if (!(idA in attrs)) {
	      // we cannot inject any object into the store that does not have a primary key!
	      var error = new _errors['default'].R(definition.name + '.inject: "attrs" must contain the property specified by "idAttribute"!');
	      options.errorFn(error);
	      throw error;
	    } else {
	      try {
	        (function () {
	          // when injecting object that contain their nested relations, this code
	          // will recursively inject them into their proper places in the data store.
	          // Magic!
	          _utils['default'].forEach(definition.relationList, function (def) {
	            var relationName = def.relation;
	            var relationDef = _this.definitions[relationName];
	            var toInject = attrs[def.localField];
	            if (toInject) {
	              if (!relationDef) {
	                throw new _errors['default'].R(definition.name + ' relation is defined but the resource is not!');
	              }
	              // handle injecting hasMany relations
	              if (_utils['default']._a(toInject)) {
	                (function () {
	                  var items = [];
	                  _utils['default'].forEach(toInject, function (toInjectItem) {
	                    if (toInjectItem !== _this.store[relationName].index[toInjectItem[relationDef.idAttribute]]) {
	                      try {
	                        var injectedItem = relationDef.inject(toInjectItem, options.orig());
	                        if (def.foreignKey) {
	                          _utils['default'].set(injectedItem, def.foreignKey, attrs[definition.idAttribute]);
	                        }
	                        items.push(injectedItem);
	                      } catch (err) {
	                        options.errorFn(err, 'Failed to inject ' + def.type + ' relation: "' + relationName + '"!');
	                      }
	                    }
	                  });
	                })();
	              } else {
	                // handle injecting belongsTo and hasOne relations
	                if (toInject !== _this.store[relationName].index[toInject[relationDef.idAttribute]]) {
	                  try {
	                    var _injected = relationDef.inject(attrs[def.localField], options.orig());
	                    if (def.foreignKey) {
	                      _utils['default'].set(_injected, def.foreignKey, attrs[definition.idAttribute]);
	                    }
	                  } catch (err) {
	                    options.errorFn(err, 'Failed to inject ' + def.type + ' relation: "' + relationName + '"!');
	                  }
	                }
	              }
	            }
	          });

	          // primary key of item being injected
	          var id = attrs[idA];
	          // item being injected
	          var item = definition.get(id);
	          // 0 if the item is new, otherwise the previous last modified timestamp of the item
	          var initialLastModified = item ? resource.modified[id] : 0;

	          // item is new
	          if (!item) {
	            if (attrs instanceof definition[definition['class']]) {
	              item = attrs;
	            } else {
	              item = new definition[definition['class']]();
	            }
	            // remove relation properties from the item, since those relations have been injected by now
	            _utils['default'].forEach(definition.relationList, function (def) {
	              delete attrs[def.localField];
	            });
	            // copy remaining properties to the injected item
	            _utils['default'].deepMixIn(item, attrs);

	            // add item to collection
	            resource.collection.push(item);
	            resource.changeHistories[id] = [];

	            // If we're in the browser, start observation
	            if (definition.watchChanges) {
	              resource.observers[id] = new _this.observe.ObjectObserver(item);
	              resource.observers[id].open(_react, item);
	            }

	            // index item
	            resource.index[id] = item;
	            // fire observation handler for the first time
	            _react.call(item, {}, {}, {}, null, true);
	            // save "previous" attributes of the injected item, for change diffs later
	            resource.previousAttributes[id] = _utils['default'].copy(item, null, null, null, definition.relationFields);
	          } else {
	            // item is being re-injected
	            // new properties take precedence
	            if (options.onConflict === 'merge') {
	              _utils['default'].deepMixIn(item, attrs);
	            } else if (options.onConflict === 'replace') {
	              _utils['default'].forOwn(item, function (v, k) {
	                if (k !== definition.idAttribute) {
	                  if (!attrs.hasOwnProperty(k)) {
	                    delete item[k];
	                  }
	                }
	              });
	              _utils['default'].forOwn(attrs, function (v, k) {
	                if (k !== definition.idAttribute) {
	                  item[k] = v;
	                }
	              });
	            }

	            if (definition.resetHistoryOnInject) {
	              // clear change history for item
	              resource.previousAttributes[id] = _utils['default'].copy(item, null, null, null, definition.relationFields);
	              if (resource.changeHistories[id].length) {
	                _utils['default'].forEach(resource.changeHistories[id], function (changeRecord) {
	                  _utils['default'].remove(resource.changeHistory, changeRecord);
	                });
	                resource.changeHistories[id].splice(0, resource.changeHistories[id].length);
	              }
	            }
	            if (resource.observers[id] && typeof resource.observers[id] === 'function') {
	              // force observation callback to be fired if there are any changes to the item and `Object.observe` is not available
	              resource.observers[id].deliver();
	            }
	          }
	          // update modified timestamp of item
	          resource.modified[id] = initialLastModified && resource.modified[id] === initialLastModified ? _utils['default'].updateTimestamp(resource.modified[id]) : resource.modified[id];

	          // reset expiry tracking for item
	          resource.expiresHeap.remove(item);
	          var timestamp = new Date().getTime();
	          resource.expiresHeap.push({
	            item: item,
	            timestamp: timestamp,
	            expires: definition.maxAge ? timestamp + definition.maxAge : Number.MAX_VALUE
	          });

	          // final injected item
	          injected = item;
	        })();
	      } catch (err) {
	        options.errorFn(err, attrs);
	      }
	    }
	  }
	  return injected;
	}

	/**
	 * Inject the given object or array of objects into the data store.
	 *
	 * @param resourceName The name of the type of resource of the data to be injected.
	 * @param attrs Object or array of objects. Objects must contain a primary key.
	 * @param options Optional configuration.
	 * @param options.notify Whether to emit the "DS.beforeInject" and "DS.afterInject" events.
	 * @returns The injected data.
	 */
	module.exports = function inject(resourceName, attrs, options) {
	  var _this = this;
	  var definition = _this.definitions[resourceName];
	  var resource = _this.store[resourceName];
	  var injected = undefined;

	  if (!definition) {
	    throw new _errors['default'].NER(resourceName);
	  } else if (!_utils['default']._o(attrs) && !_utils['default']._a(attrs)) {
	    throw new _errors['default'].IA(resourceName + '.inject: "attrs" must be an object or an array!');
	  }

	  options = _utils['default']._(definition, options);
	  options.logFn('inject', attrs, options);

	  // lifecycle
	  options.beforeInject(options, attrs);
	  if (options.notify) {
	    definition.emit('DS.beforeInject', definition, attrs);
	  }

	  // start the recursive injection of data
	  injected = _inject.call(_this, definition, resource, attrs, options);

	  // collection was modified
	  definition.handleChange(injected);

	  // lifecycle
	  options.afterInject(options, injected);
	  if (options.notify) {
	    definition.emit('DS.afterInject', definition, injected);
	  }

	  return injected;
	};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	

	    /**
	     * Typecast a value to a String, using an empty string value for null or
	     * undefined.
	     */
	    function toString(val){
	        return val == null ? '' : val.toString();
	    }

	    module.exports = toString;




/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var toString = __webpack_require__(32);
	var replaceAccents = __webpack_require__(44);
	var removeNonWord = __webpack_require__(45);
	var upperCase = __webpack_require__(20);
	var lowerCase = __webpack_require__(46);
	    /**
	    * Convert string to camelCase text.
	    */
	    function camelCase(str){
	        str = toString(str);
	        str = replaceAccents(str);
	        str = removeNonWord(str)
	            .replace(/[\-_]/g, ' ') //convert all hyphens and underscores to spaces
	            .replace(/\s[a-z]/g, upperCase) //convert first char of each word to UPPERCASE
	            .replace(/\s+/g, '') //remove spaces
	            .replace(/^[A-Z]/g, lowerCase); //convert first char to lowercase
	        return str;
	    }
	    module.exports = camelCase;



/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Using an adapter, create a new item.
	 *
	 * Generally a primary key will NOT be provided in the properties hash,
	 * because the adapter's persistence layer should be generating one.
	 *
	 * @param resourceName The name of the type of resource of the new item.
	 * @param attrs Hash of properties with which to create the new item.
	 * @param options Optional configuration.
	 * @param options.cacheResponse Whether the newly created item as returned by the adapter should be injected into the data store.
	 * @param options.upsert If the properties hash contains a primary key, attempt to call DS#update instead.
	 * @param options.notify Whether to emit the "DS.beforeCreate" and "DS.afterCreate" events.
	 * @param options.beforeValidate Lifecycle hook.
	 * @param options.validate Lifecycle hook.
	 * @param options.afterValidate Lifecycle hook.
	 * @param options.beforeCreate Lifecycle hook.
	 * @param options.afterCreate Lifecycle hook.
	 */
	module.exports = function create(resourceName, attrs, options) {
	  var _this = this;
	  var DSUtils = _this.utils;
	  var definition = _this.definitions[resourceName];
	  var adapter = undefined;

	  options = options || {};
	  attrs = attrs || {};

	  var rejectionError = undefined;
	  if (!definition) {
	    rejectionError = new _this.errors.NER(resourceName);
	  } else if (!DSUtils._o(attrs)) {
	    rejectionError = DSUtils._oErr('attrs');
	  } else {
	    options = DSUtils._(definition, options);
	    if (options.upsert && DSUtils._sn(attrs[definition.idAttribute])) {
	      return _this.update(resourceName, attrs[definition.idAttribute], attrs, options);
	    }
	    options.logFn('create', attrs, options);
	  }

	  return new DSUtils.Promise(function (resolve, reject) {
	    if (rejectionError) {
	      reject(rejectionError);
	    } else {
	      resolve(attrs);
	    }
	  })
	  // start lifecycle
	  .then(function (attrs) {
	    return options.beforeValidate.call(attrs, options, attrs);
	  }).then(function (attrs) {
	    return options.validate.call(attrs, options, attrs);
	  }).then(function (attrs) {
	    return options.afterValidate.call(attrs, options, attrs);
	  }).then(function (attrs) {
	    return options.beforeCreate.call(attrs, options, attrs);
	  }).then(function (attrs) {
	    if (options.notify) {
	      definition.emit('DS.beforeCreate', definition, attrs);
	    }
	    adapter = _this.getAdapterName(options);
	    return _this.adapters[adapter].create(definition, DSUtils.omit(attrs, options.omit), options);
	  }).then(function (attrs) {
	    return options.afterCreate.call(attrs, options, attrs);
	  }).then(function (attrs) {
	    if (options.notify) {
	      definition.emit('DS.afterCreate', definition, attrs);
	    }
	    if (options.cacheResponse) {
	      // injected created intem into the store
	      var created = _this.inject(definition.name, attrs, options.orig());
	      var id = created[definition.idAttribute];
	      // mark item's `find` query as completed, so a subsequent `find` call for this item will resolve immediately
	      var resource = _this.store[resourceName];
	      resource.completedQueries[id] = new Date().getTime();
	      resource.saved[id] = DSUtils.updateTimestamp(resource.saved[id]);
	      return created;
	    } else {
	      // just return an un-injected instance
	      return _this.createInstance(resourceName, attrs, options);
	    }
	  }).then(function (item) {
	    return DSUtils.respond(item, { adapter: adapter }, options);
	  });
	};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Using an adapter, destroy an item.
	 *
	 * @param resourceName The name of the type of resource of the item to destroy.
	 * @param id The primary key of the item to destroy.
	 * @param options Optional configuration.
	 * @param options.eagerEject Whether to eject the item from the store before the adapter operation completes, re-injecting if the adapter operation fails.
	 * @param options.notify Whether to emit the "DS.beforeDestroy" and "DS.afterDestroy" events.
	 * @param options.beforeDestroy Lifecycle hook.
	 * @param options.afterDestroy Lifecycle hook.
	 * @returns The primary key of the destroyed item.
	 */
	module.exports = function destroy(resourceName, id, options) {
	  var _this = this;
	  var DSUtils = _this.utils;
	  var definition = _this.definitions[resourceName];
	  var item = undefined;
	  var adapter = undefined;

	  return new DSUtils.Promise(function (resolve, reject) {
	    id = DSUtils.resolveId(definition, id);
	    if (!definition) {
	      reject(new _this.errors.NER(resourceName));
	    } else if (!DSUtils._sn(id)) {
	      reject(DSUtils._snErr('id'));
	    } else {
	      // check if the item is in the store
	      item = definition.get(id) || { id: id };
	      options = DSUtils._(definition, options);
	      options.logFn('destroy', id, options);
	      resolve(item);
	    }
	  })
	  // start lifecycle
	  .then(function (attrs) {
	    return options.beforeDestroy.call(attrs, options, attrs);
	  }).then(function (attrs) {
	    if (options.notify) {
	      definition.emit('DS.beforeDestroy', definition, attrs);
	    }
	    // don't wait for the adapter, remove the item from the store
	    if (options.eagerEject) {
	      definition.eject(id);
	    }
	    adapter = definition.getAdapter(options);
	    return adapter.destroy(definition, id, options);
	  }).then(function () {
	    return options.afterDestroy.call(item, options, item);
	  }).then(function (item) {
	    if (options.notify) {
	      definition.emit('DS.afterDestroy', definition, item);
	    }
	    // make sure the item is removed from the store
	    definition.eject(id);
	    return DSUtils.respond(id, { adapter: adapter }, options);
	  })['catch'](function (err) {
	    // rollback by re-injecting the item into the store
	    if (options && options.eagerEject && item) {
	      definition.inject(item, { notify: false });
	    }
	    return DSUtils.Promise.reject(err);
	  });
	};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Using an adapter, destroy an item.
	 *
	 * @param resourceName The name of the type of resource of the item to destroy.
	 * @param params The criteria by which to filter items to destroy. See http://www.js-data.io/docs/query-syntax
	 * @param options Optional configuration.
	 * @param options.eagerEject Whether to eject the items from the store before the adapter operation completes, re-injecting if the adapter operation fails.
	 * @param options.notify Whether to emit the "DS.beforeDestroy" and "DS.afterDestroy" events.
	 * @param options.beforeDestroy Lifecycle hook.
	 * @param options.afterDestroy Lifecycle hook.
	 * @returns The ejected items, if any.
	 */
	module.exports = function destroyAll(resourceName, params, options) {
	  var _this = this;
	  var DSUtils = _this.utils;
	  var definition = _this.definitions[resourceName];
	  var ejected = undefined,
	      toEject = undefined,
	      adapter = undefined;

	  params = params || {};

	  return new DSUtils.Promise(function (resolve, reject) {
	    if (!definition) {
	      reject(new _this.errors.NER(resourceName));
	    } else if (!DSUtils._o(params)) {
	      reject(DSUtils._oErr('attrs'));
	    } else {
	      options = DSUtils._(definition, options);
	      options.logFn('destroyAll', params, options);
	      resolve();
	    }
	  }).then(function () {
	    // find items that are to be ejected from the store
	    toEject = definition.defaultFilter.call(_this, resourceName, params);
	    return options.beforeDestroy(options, toEject);
	  }).then(function () {
	    if (options.notify) {
	      definition.emit('DS.beforeDestroy', definition, toEject);
	    }
	    // don't wait for the adapter, remove the items from the store
	    if (options.eagerEject) {
	      ejected = definition.ejectAll(params);
	    }
	    adapter = definition.getAdapterName(options);
	    return _this.adapters[adapter].destroyAll(definition, params, options);
	  }).then(function () {
	    return options.afterDestroy(options, toEject);
	  }).then(function () {
	    if (options.notify) {
	      definition.emit('DS.afterDestroy', definition, toEject);
	    }
	    // make sure items are removed from the store
	    return ejected || definition.ejectAll(params);
	  }).then(function (items) {
	    return DSUtils.respond(items, { adapter: adapter }, options);
	  })['catch'](function (err) {
	    // rollback by re-injecting the items into the store
	    if (options && options.eagerEject && ejected) {
	      definition.inject(ejected, { notify: false });
	    }
	    return DSUtils.Promise.reject(err);
	  });
	};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	/* jshint -W082 */

	/**
	 * Using an adapter, retrieve a single item.
	 *
	 * @param resourceName The of the type of resource of the item to retrieve.
	 * @param id The primary key of the item to retrieve.
	 * @param options Optional configuration.
	 * @param options.bypassCache Whether to ignore any cached item and force the retrieval through the adapter.
	 * @param options.cacheResponse Whether to inject the found item into the data store.
	 * @param options.strictCache Whether to only consider items to be "cached" if they were injected into the store as the result of `find` or `findAll`.
	 * @param options.strategy The retrieval strategy to use.
	 * @param options.findStrategy The retrieval strategy to use. Overrides "strategy".
	 * @param options.fallbackAdapters Array of names of adapters to use if using "fallback" strategy.
	 * @param options.findFallbackAdapters Array of names of adapters to use if using "fallback" strategy. Overrides "fallbackAdapters".
	 * @returns The item.
	 */
	module.exports = function find(resourceName, id, options) {
	  var _this = this;
	  var DSUtils = _this.utils;
	  var definition = _this.definitions[resourceName];
	  var resource = _this.store[resourceName];
	  var adapter = undefined;

	  return new DSUtils.Promise(function (resolve, reject) {
	    if (!definition) {
	      reject(new _this.errors.NER(resourceName));
	    } else if (!DSUtils._sn(id)) {
	      reject(DSUtils._snErr('id'));
	    } else {
	      options = DSUtils._(definition, options);
	      options.logFn('find', id, options);

	      if (options.params) {
	        options.params = DSUtils.copy(options.params);
	      }

	      if (options.bypassCache || !options.cacheResponse) {
	        delete resource.completedQueries[id];
	      }
	      if ((!options.findStrictCache || id in resource.completedQueries) && definition.get(id) && !options.bypassCache) {
	        // resolve immediately with the cached item
	        resolve(definition.get(id));
	      } else {
	        // we're going to delegate to the adapter next
	        delete resource.completedQueries[id];
	        resolve();
	      }
	    }
	  }).then(function (item) {
	    if (!item) {
	      if (!(id in resource.pendingQueries)) {
	        var promise = undefined;
	        var strategy = options.findStrategy || options.strategy;

	        // try subsequent adapters if the preceeding one fails
	        if (strategy === 'fallback') {
	          (function () {
	            var makeFallbackCall = function makeFallbackCall(index) {
	              adapter = definition.getAdapterName((options.findFallbackAdapters || options.fallbackAdapters)[index]);
	              return _this.adapters[adapter].find(definition, id, options)['catch'](function (err) {
	                index++;
	                if (index < options.fallbackAdapters.length) {
	                  return makeFallbackCall(index);
	                } else {
	                  return DSUtils.Promise.reject(err);
	                }
	              });
	            };

	            promise = makeFallbackCall(0);
	          })();
	        } else {
	          adapter = definition.getAdapterName(options);
	          // just make a single attempt
	          promise = _this.adapters[adapter].find(definition, id, options);
	        }

	        resource.pendingQueries[id] = promise.then(function (data) {
	          // Query is no longer pending
	          delete resource.pendingQueries[id];
	          if (options.cacheResponse) {
	            // inject the item into the data store
	            var injected = definition.inject(data, options.orig());
	            // mark the item as "cached"
	            resource.completedQueries[id] = new Date().getTime();
	            resource.saved[id] = DSUtils.updateTimestamp(resource.saved[id]);
	            return injected;
	          } else {
	            // just return an un-injected instance
	            return definition.createInstance(data, options.orig());
	          }
	        });
	      }
	      return resource.pendingQueries[id];
	    } else {
	      // resolve immediately with the item
	      return item;
	    }
	  }).then(function (item) {
	    return DSUtils.respond(item, { adapter: adapter }, options);
	  })['catch'](function (err) {
	    if (resource) {
	      delete resource.pendingQueries[id];
	    }
	    return DSUtils.Promise.reject(err);
	  });
	};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	/* jshint -W082 */
	function processResults(data, resourceName, queryHash, options) {
	  var _this = this;
	  var DSUtils = _this.utils;
	  var definition = _this.definitions[resourceName];
	  var resource = _this.store[resourceName];
	  var idAttribute = _this.definitions[resourceName].idAttribute;
	  var date = new Date().getTime();

	  data = data || [];

	  // Query is no longer pending
	  delete resource.pendingQueries[queryHash];
	  resource.completedQueries[queryHash] = date;

	  // Merge the new values into the cache
	  var injected = definition.inject(data, options.orig());

	  // Make sure each object is added to completedQueries
	  if (DSUtils._a(injected)) {
	    DSUtils.forEach(injected, function (item) {
	      if (item) {
	        var id = item[idAttribute];
	        if (id) {
	          resource.completedQueries[id] = date;
	          resource.saved[id] = DSUtils.updateTimestamp(resource.saved[id]);
	        }
	      }
	    });
	  } else {
	    options.errorFn('response is expected to be an array!');
	    resource.completedQueries[injected[idAttribute]] = date;
	  }

	  return injected;
	}

	/**
	 * Using an adapter, retrieve a collection of items.
	 *
	 * @param resourceName The name of the type of resource of the items to retrieve.
	 * @param params The criteria by which to filter items to retrieve. See http://www.js-data.io/docs/query-syntax
	 * @param options Optional configuration.
	 * @param options.bypassCache Whether to ignore any cached query for these items and force the retrieval through the adapter.
	 * @param options.cacheResponse Whether to inject the found items into the data store.
	 * @returns The items.
	 */
	module.exports = function findAll(resourceName, params, options) {
	  var _this = this;
	  var DSUtils = _this.utils;
	  var definition = _this.definitions[resourceName];
	  var resource = _this.store[resourceName];
	  var queryHash = undefined,
	      adapter = undefined;

	  return new DSUtils.Promise(function (resolve, reject) {
	    params = params || {};

	    if (!_this.definitions[resourceName]) {
	      reject(new _this.errors.NER(resourceName));
	    } else if (!DSUtils._o(params)) {
	      reject(DSUtils._oErr('params'));
	    } else {
	      options = DSUtils._(definition, options);
	      queryHash = DSUtils.toJson(params);
	      options.logFn('findAll', params, options);

	      if (options.params) {
	        options.params = DSUtils.copy(options.params);
	      }

	      // force a new request
	      if (options.bypassCache || !options.cacheResponse) {
	        delete resource.completedQueries[queryHash];
	        delete resource.queryData[queryHash];
	      }
	      if (queryHash in resource.completedQueries) {
	        if (options.useFilter) {
	          if (options.localKeys) {
	            resolve(definition.getAll(options.localKeys, options.orig()));
	          } else {
	            // resolve immediately by filtering data from the data store
	            resolve(definition.filter(params, options.orig()));
	          }
	        } else {
	          // resolve immediately by returning the cached array from the previously made query
	          resolve(resource.queryData[queryHash]);
	        }
	      } else {
	        resolve();
	      }
	    }
	  }).then(function (items) {
	    if (!(queryHash in resource.completedQueries)) {
	      if (!(queryHash in resource.pendingQueries)) {
	        var promise = undefined;
	        var strategy = options.findAllStrategy || options.strategy;

	        // try subsequent adapters if the preceeding one fails
	        if (strategy === 'fallback') {
	          (function () {
	            var makeFallbackCall = function makeFallbackCall(index) {
	              adapter = definition.getAdapterName((options.findAllFallbackAdapters || options.fallbackAdapters)[index]);
	              return _this.adapters[adapter].findAll(definition, params, options)['catch'](function (err) {
	                index++;
	                if (index < options.fallbackAdapters.length) {
	                  return makeFallbackCall(index);
	                } else {
	                  return DSUtils.Promise.reject(err);
	                }
	              });
	            };

	            promise = makeFallbackCall(0);
	          })();
	        } else {
	          adapter = definition.getAdapterName(options);
	          // just make a single attempt
	          promise = _this.adapters[adapter].findAll(definition, params, options);
	        }

	        resource.pendingQueries[queryHash] = promise.then(function (data) {
	          // Query is no longer pending
	          delete resource.pendingQueries[queryHash];
	          if (options.cacheResponse) {
	            // inject the items into the data store
	            resource.queryData[queryHash] = processResults.call(_this, data, resourceName, queryHash, options);
	            resource.queryData[queryHash].$$injected = true;
	            return resource.queryData[queryHash];
	          } else {
	            DSUtils.forEach(data, function (item, i) {
	              data[i] = definition.createInstance(item, options.orig());
	            });
	            return data;
	          }
	        });
	      }

	      return resource.pendingQueries[queryHash];
	    } else {
	      // resolve immediately with the items
	      return items;
	    }
	  }).then(function (items) {
	    return DSUtils.respond(items, { adapter: adapter }, options);
	  })['catch'](function (err) {
	    if (resource) {
	      delete resource.pendingQueries[queryHash];
	    }
	    return DSUtils.Promise.reject(err);
	  });
	};

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	/**
	 * Load the specified relations for the given instance.
	 *
	 * @param resourceName The name of the type of resource of the instance for which to load relations.
	 * @param instance The instance or the primary key of the instance.
	 * @param relations An array of the relations to load.
	 * @param options Optional configuration.
	 * @returns The instance, now with its relations loaded.
	 */
	module.exports = function loadRelations(resourceName, instance, relations, options) {
	  var _this = this;
	  var DSUtils = _this.utils;
	  var DSErrors = _this.errors;

	  var definition = _this.definitions[resourceName];

	  return new DSUtils.Promise(function (resolve, reject) {
	    if (DSUtils._sn(instance)) {
	      instance = definition.get(instance);
	    }

	    if (DSUtils._s(relations)) {
	      relations = [relations];
	    }

	    relations = relations || [];

	    if (!definition) {
	      reject(new DSErrors.NER(resourceName));
	    } else if (!DSUtils._o(instance)) {
	      reject(new DSErrors.IA('"instance(id)" must be a string, number or object!'));
	    } else if (!DSUtils._a(relations)) {
	      reject(new DSErrors.IA('"relations" must be a string or an array!'));
	    } else {
	      (function () {
	        var _options = DSUtils._(definition, options);
	        _options.logFn('loadRelations', instance, relations, _options);

	        var tasks = [];

	        DSUtils.forEach(definition.relationList, function (def) {
	          var relationName = def.relation;
	          var relationDef = definition.getResource(relationName);
	          var __options = DSUtils._(relationDef, options);

	          // relations can be loaded based on resource name or field name
	          if (!relations.length || DSUtils.contains(relations, relationName) || DSUtils.contains(relations, def.localField)) {
	            var task = undefined;
	            var params = {};
	            if (__options.allowSimpleWhere) {
	              params[def.foreignKey] = instance[definition.idAttribute];
	            } else {
	              params.where = {};
	              params.where[def.foreignKey] = {
	                '==': instance[definition.idAttribute]
	              };
	            }

	            if (def.type === 'hasMany') {
	              var orig = __options.orig();
	              if (def.localKeys) {
	                delete params[def.foreignKey];
	                var keys = DSUtils.get(instance, def.localKeys) || [];
	                keys = DSUtils._a(keys) ? keys : DSUtils.keys(keys);
	                params.where = _defineProperty({}, relationDef.idAttribute, {
	                  'in': keys
	                });
	                orig.localKeys = keys;
	              }
	              task = relationDef.findAll(params, orig);
	            } else if (def.type === 'hasOne') {
	              if (def.localKey && DSUtils.get(instance, def.localKey)) {
	                task = relationDef.find(DSUtils.get(instance, def.localKey), __options.orig());
	              } else if (def.foreignKey) {
	                task = relationDef.findAll(params, __options.orig()).then(function (hasOnes) {
	                  return hasOnes.length ? hasOnes[0] : null;
	                });
	              }
	            } else if (DSUtils.get(instance, def.localKey)) {
	              task = relationDef.find(DSUtils.get(instance, def.localKey), __options.orig());
	            }

	            if (task) {
	              tasks.push(task);
	            }
	          }
	        });

	        resolve(tasks);
	      })();
	    }
	  }).then(function (tasks) {
	    return DSUtils.Promise.all(tasks);
	  }).then(function () {
	    return instance;
	  });
	};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Find expired items of the specified resource type and perform the configured action.
	 *
	 * @param resourceName The name of the type of resource of the items to reap.
	 * @param options Optional configuration.
	 * @returns The reaped items.
	 */
	module.exports = function reap(resourceName, options) {
	  var _this = this;
	  var DSUtils = _this.utils;
	  var definition = _this.definitions[resourceName];
	  var resource = _this.store[resourceName];

	  return new DSUtils.Promise(function (resolve, reject) {

	    if (!definition) {
	      reject(new _this.errors.NER(resourceName));
	    } else {
	      options = DSUtils._(definition, options);
	      if (!options.hasOwnProperty('notify')) {
	        options.notify = false;
	      }
	      options.logFn('reap', options);
	      var items = [];
	      var now = new Date().getTime();
	      var expiredItem = undefined;

	      // find the expired items
	      while ((expiredItem = resource.expiresHeap.peek()) && expiredItem.expires < now) {
	        items.push(expiredItem.item);
	        delete expiredItem.item;
	        resource.expiresHeap.pop();
	      }
	      resolve(items);
	    }
	  }).then(function (items) {
	    // only hit lifecycle if there are items
	    if (items.length) {
	      definition.beforeReap(options, items);
	      if (options.notify) {
	        definition.emit('DS.beforeReap', definition, items);
	      }
	    }

	    if (options.reapAction === 'inject') {
	      (function () {
	        var timestamp = new Date().getTime();
	        DSUtils.forEach(items, function (item) {
	          resource.expiresHeap.push({
	            item: item,
	            timestamp: timestamp,
	            expires: definition.maxAge ? timestamp + definition.maxAge : Number.MAX_VALUE
	          });
	        });
	      })();
	    } else if (options.reapAction === 'eject') {
	      DSUtils.forEach(items, function (item) {
	        definition.eject(item[definition.idAttribute]);
	      });
	    } else if (options.reapAction === 'refresh') {
	      var _ret2 = (function () {
	        var tasks = [];
	        DSUtils.forEach(items, function (item) {
	          tasks.push(definition.refresh(item[definition.idAttribute]));
	        });
	        return {
	          v: DSUtils.Promise.all(tasks)
	        };
	      })();

	      if (typeof _ret2 === 'object') return _ret2.v;
	    }
	    return items;
	  }).then(function (items) {
	    // only hit lifecycle if there are items
	    if (items.length) {
	      definition.afterReap(options, items);
	      if (options.notify) {
	        definition.emit('DS.afterReap', definition, items);
	      }
	    }
	    return items;
	  });
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Save a single item in its present state.
	 *
	 * @param resourceName The name of the type of resource of the item.
	 * @param id The primary key of the item.
	 * @param options Optional congifuration.
	 * @returns The item, now saved.
	 */
	module.exports = function save(resourceName, id, options) {
	  var _this = this;
	  var DSUtils = _this.utils;
	  var DSErrors = _this.errors;

	  var definition = _this.definitions[resourceName];
	  var resource = _this.store[resourceName];
	  var item = undefined,
	      noChanges = undefined,
	      adapter = undefined;

	  return new DSUtils.Promise(function (resolve, reject) {
	    id = DSUtils.resolveId(definition, id);
	    if (!definition) {
	      reject(new DSErrors.NER(resourceName));
	    } else if (!DSUtils._sn(id)) {
	      reject(DSUtils._snErr('id'));
	    } else if (!definition.get(id)) {
	      reject(new DSErrors.R('id "' + id + '" not found in cache!'));
	    } else {
	      item = definition.get(id);
	      options = DSUtils._(definition, options);
	      options.logFn('save', id, options);
	      resolve(item);
	    }
	  })
	  // start lifecycle
	  .then(function (attrs) {
	    return options.beforeValidate.call(attrs, options, attrs);
	  }).then(function (attrs) {
	    return options.validate.call(attrs, options, attrs);
	  }).then(function (attrs) {
	    return options.afterValidate.call(attrs, options, attrs);
	  }).then(function (attrs) {
	    return options.beforeUpdate.call(attrs, options, attrs);
	  }).then(function (attrs) {
	    if (options.notify) {
	      definition.emit('DS.beforeUpdate', definition, attrs);
	    }
	    // only send changed properties to the adapter
	    if (options.changesOnly) {

	      if (resource.observers[id] && typeof resource.observers[id] === 'function') {
	        resource.observers[id].deliver();
	      }
	      var toKeep = [];
	      var changes = definition.changes(id);

	      for (var key in changes.added) {
	        toKeep.push(key);
	      }
	      for (key in changes.changed) {
	        toKeep.push(key);
	      }
	      changes = DSUtils.pick(attrs, toKeep);
	      // no changes? no save
	      if (DSUtils.isEmpty(changes)) {
	        // no changes, return
	        options.logFn('save - no changes', id, options);
	        noChanges = true;
	        return attrs;
	      } else {
	        attrs = changes;
	      }
	    }
	    adapter = definition.getAdapterName(options);
	    return _this.adapters[adapter].update(definition, id, DSUtils.omit(attrs, options.omit), options);
	  }).then(function (data) {
	    return options.afterUpdate.call(data, options, data);
	  }).then(function (attrs) {
	    if (options.notify) {
	      definition.emit('DS.afterUpdate', definition, attrs);
	    }
	    if (noChanges) {
	      // no changes, just return
	      return attrs;
	    } else if (options.cacheResponse) {
	      // inject the reponse into the store, updating the item
	      var injected = definition.inject(attrs, options.orig());
	      var _id = injected[definition.idAttribute];
	      // mark the item as "saved"
	      resource.saved[_id] = DSUtils.updateTimestamp(resource.saved[_id]);
	      if (!definition.resetHistoryOnInject) {
	        resource.previousAttributes[_id] = DSUtils.copy(injected, null, null, null, definition.relationFields);
	      }
	      return injected;
	    } else {
	      // just return an instance
	      return definition.createInstance(attrs, options.orig());
	    }
	  }).then(function (item) {
	    return DSUtils.respond(item, { adapter: adapter }, options);
	  });
	};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Update a single item using the supplied properties hash.
	 *
	 * @param resourceName The name of the type of resource of the item to update.
	 * @param id The primary key of the item to update.
	 * @param attrs The attributes with which to update the item.
	 * @param options Optional configuration.
	 * @returns The item, now updated.
	 */
	module.exports = function update(resourceName, id, attrs, options) {
	  var _this = this;
	  var DSUtils = _this.utils;
	  var DSErrors = _this.errors;

	  var definition = _this.definitions[resourceName];
	  var adapter = undefined;

	  return new DSUtils.Promise(function (resolve, reject) {
	    id = DSUtils.resolveId(definition, id);
	    if (!definition) {
	      reject(new DSErrors.NER(resourceName));
	    } else if (!DSUtils._sn(id)) {
	      reject(DSUtils._snErr('id'));
	    } else {
	      options = DSUtils._(definition, options);
	      options.logFn('update', id, attrs, options);
	      resolve(attrs);
	    }
	  })
	  // start lifecycle
	  .then(function (attrs) {
	    return options.beforeValidate.call(attrs, options, attrs);
	  }).then(function (attrs) {
	    return options.validate.call(attrs, options, attrs);
	  }).then(function (attrs) {
	    return options.afterValidate.call(attrs, options, attrs);
	  }).then(function (attrs) {
	    return options.beforeUpdate.call(attrs, options, attrs);
	  }).then(function (attrs) {
	    if (options.notify) {
	      definition.emit('DS.beforeUpdate', definition, attrs);
	    }
	    adapter = definition.getAdapterName(options);
	    return _this.adapters[adapter].update(definition, id, DSUtils.omit(attrs, options.omit), options);
	  }).then(function (data) {
	    return options.afterUpdate.call(data, options, data);
	  }).then(function (attrs) {
	    if (options.notify) {
	      definition.emit('DS.afterUpdate', definition, attrs);
	    }
	    if (options.cacheResponse) {
	      // inject the updated item into the store
	      var injected = definition.inject(attrs, options.orig());
	      var resource = _this.store[resourceName];
	      var _id = injected[definition.idAttribute];
	      // mark the item as "saved"
	      resource.saved[_id] = DSUtils.updateTimestamp(resource.saved[_id]);
	      if (!definition.resetHistoryOnInject) {
	        resource.previousAttributes[_id] = DSUtils.copy(injected, null, null, null, definition.relationFields);
	      }
	      return injected;
	    } else {
	      // just return an instance
	      return definition.createInstance(attrs, options.orig());
	    }
	  }).then(function (item) {
	    return DSUtils.respond(item, { adapter: adapter }, options);
	  });
	};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Update a collection of items using the supplied properties hash.
	 *
	 * @param resourceName The name of the type of resource of the items to update.
	 * @param attrs  The attributes with which to update the item.
	 * @param params The criteria by which to select items to update. See http://www.js-data.io/docs/query-syntax
	 * @param options Optional configuration.
	 * @returns The updated items.
	 */
	module.exports = function updateAll(resourceName, attrs, params, options) {
	  var _this = this;
	  var DSUtils = _this.utils;
	  var DSErrors = _this.errors;

	  var definition = _this.definitions[resourceName];
	  var adapter = undefined;

	  return new DSUtils.Promise(function (resolve, reject) {
	    if (!definition) {
	      reject(new DSErrors.NER(resourceName));
	    } else {
	      options = DSUtils._(definition, options);
	      options.logFn('updateAll', attrs, params, options);
	      resolve(attrs);
	    }
	  })
	  // start lifecycle
	  .then(function (attrs) {
	    return options.beforeValidate.call(attrs, options, attrs);
	  }).then(function (attrs) {
	    return options.validate.call(attrs, options, attrs);
	  }).then(function (attrs) {
	    return options.afterValidate.call(attrs, options, attrs);
	  }).then(function (attrs) {
	    return options.beforeUpdate.call(attrs, options, attrs);
	  }).then(function (attrs) {
	    if (options.notify) {
	      definition.emit('DS.beforeUpdate', definition, attrs);
	    }
	    adapter = definition.getAdapterName(options);
	    return _this.adapters[adapter].updateAll(definition, DSUtils.omit(attrs, options.omit), params, options);
	  }).then(function (data) {
	    return options.afterUpdate.call(data, options, data);
	  }).then(function (data) {
	    if (options.notify) {
	      definition.emit('DS.afterUpdate', definition, attrs);
	    }
	    var origOptions = options.orig();
	    if (options.cacheResponse) {
	      var _ret = (function () {
	        // inject the updated items into the store
	        var injected = definition.inject(data, origOptions);
	        var resource = _this.store[resourceName];
	        // mark the items as "saved"
	        DSUtils.forEach(injected, function (i) {
	          var id = i[definition.idAttribute];
	          resource.saved[id] = DSUtils.updateTimestamp(resource.saved[id]);
	          if (!definition.resetHistoryOnInject) {
	            resource.previousAttributes[id] = DSUtils.copy(i, null, null, null, definition.relationFields);
	          }
	        });
	        return {
	          v: injected
	        };
	      })();

	      if (typeof _ret === 'object') return _ret.v;
	    } else {
	      var _ret2 = (function () {
	        // just return instances
	        var instances = [];
	        DSUtils.forEach(data, function (item) {
	          instances.push(definition.createInstance(item, origOptions));
	        });
	        return {
	          v: instances
	        };
	      })();

	      if (typeof _ret2 === 'object') return _ret2.v;
	    }
	  }).then(function (items) {
	    return DSUtils.respond(items, { adapter: adapter }, options);
	  });
	};

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var toString = __webpack_require__(32);
	    /**
	    * Replaces all accented chars with regular ones
	    */
	    function replaceAccents(str){
	        str = toString(str);

	        // verifies if the String has accents and replace them
	        if (str.search(/[\xC0-\xFF]/g) > -1) {
	            str = str
	                    .replace(/[\xC0-\xC5]/g, "A")
	                    .replace(/[\xC6]/g, "AE")
	                    .replace(/[\xC7]/g, "C")
	                    .replace(/[\xC8-\xCB]/g, "E")
	                    .replace(/[\xCC-\xCF]/g, "I")
	                    .replace(/[\xD0]/g, "D")
	                    .replace(/[\xD1]/g, "N")
	                    .replace(/[\xD2-\xD6\xD8]/g, "O")
	                    .replace(/[\xD9-\xDC]/g, "U")
	                    .replace(/[\xDD]/g, "Y")
	                    .replace(/[\xDE]/g, "P")
	                    .replace(/[\xE0-\xE5]/g, "a")
	                    .replace(/[\xE6]/g, "ae")
	                    .replace(/[\xE7]/g, "c")
	                    .replace(/[\xE8-\xEB]/g, "e")
	                    .replace(/[\xEC-\xEF]/g, "i")
	                    .replace(/[\xF1]/g, "n")
	                    .replace(/[\xF2-\xF6\xF8]/g, "o")
	                    .replace(/[\xF9-\xFC]/g, "u")
	                    .replace(/[\xFE]/g, "p")
	                    .replace(/[\xFD\xFF]/g, "y");
	        }
	        return str;
	    }
	    module.exports = replaceAccents;



/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var toString = __webpack_require__(32);
	    // This pattern is generated by the _build/pattern-removeNonWord.js script
	    var PATTERN = /[^\x20\x2D0-9A-Z\x5Fa-z\xC0-\xD6\xD8-\xF6\xF8-\xFF]/g;

	    /**
	     * Remove non-word chars.
	     */
	    function removeNonWord(str){
	        str = toString(str);
	        return str.replace(PATTERN, '');
	    }

	    module.exports = removeNonWord;



/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var toString = __webpack_require__(32);
	    /**
	     * "Safer" String.toLowerCase()
	     */
	    function lowerCase(str){
	        str = toString(str);
	        return str.toLowerCase();
	    }

	    module.exports = lowerCase;



/***/ }
/******/ ])
});

},{}]},{},[1]);
