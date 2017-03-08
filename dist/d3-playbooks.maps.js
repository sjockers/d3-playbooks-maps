/******/ (function(modules) { // webpackBootstrap
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

	'use strict';
	
	__webpack_require__(43);
	
	__webpack_require__(11);
	
	var _examples = __webpack_require__(3);
	
	var _examples2 = _interopRequireDefault(_examples);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	if (false) {
	  window.d3 = d3;
	  (0, _examples2.default)();
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	// fix dimensions: use given width / height as overall sizes without margins
	exports.default = function (chart) {
	  var height = chart.height,
	      width = chart.width,
	      margin = chart.margin;
	
	  chart.containerWidth = width;
	  chart.containerHeight = height;
	  chart.height = height - margin.top - margin.bottom;
	  chart.width = width - margin.left - margin.right;
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate) {(function (root) {
	
	  // Store setTimeout reference so promise-polyfill will be unaffected by
	  // other code modifying setTimeout (like sinon.useFakeTimers())
	  var setTimeoutFunc = setTimeout;
	
	  function noop() {}
	  
	  // Polyfill for Function.prototype.bind
	  function bind(fn, thisArg) {
	    return function () {
	      fn.apply(thisArg, arguments);
	    };
	  }
	
	  function Promise(fn) {
	    if (typeof this !== 'object') throw new TypeError('Promises must be constructed via new');
	    if (typeof fn !== 'function') throw new TypeError('not a function');
	    this._state = 0;
	    this._handled = false;
	    this._value = undefined;
	    this._deferreds = [];
	
	    doResolve(fn, this);
	  }
	
	  function handle(self, deferred) {
	    while (self._state === 3) {
	      self = self._value;
	    }
	    if (self._state === 0) {
	      self._deferreds.push(deferred);
	      return;
	    }
	    self._handled = true;
	    Promise._immediateFn(function () {
	      var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
	      if (cb === null) {
	        (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
	        return;
	      }
	      var ret;
	      try {
	        ret = cb(self._value);
	      } catch (e) {
	        reject(deferred.promise, e);
	        return;
	      }
	      resolve(deferred.promise, ret);
	    });
	  }
	
	  function resolve(self, newValue) {
	    try {
	      // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
	      if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');
	      if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
	        var then = newValue.then;
	        if (newValue instanceof Promise) {
	          self._state = 3;
	          self._value = newValue;
	          finale(self);
	          return;
	        } else if (typeof then === 'function') {
	          doResolve(bind(then, newValue), self);
	          return;
	        }
	      }
	      self._state = 1;
	      self._value = newValue;
	      finale(self);
	    } catch (e) {
	      reject(self, e);
	    }
	  }
	
	  function reject(self, newValue) {
	    self._state = 2;
	    self._value = newValue;
	    finale(self);
	  }
	
	  function finale(self) {
	    if (self._state === 2 && self._deferreds.length === 0) {
	      Promise._immediateFn(function() {
	        if (!self._handled) {
	          Promise._unhandledRejectionFn(self._value);
	        }
	      });
	    }
	
	    for (var i = 0, len = self._deferreds.length; i < len; i++) {
	      handle(self, self._deferreds[i]);
	    }
	    self._deferreds = null;
	  }
	
	  function Handler(onFulfilled, onRejected, promise) {
	    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
	    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
	    this.promise = promise;
	  }
	
	  /**
	   * Take a potentially misbehaving resolver function and make sure
	   * onFulfilled and onRejected are only called once.
	   *
	   * Makes no guarantees about asynchrony.
	   */
	  function doResolve(fn, self) {
	    var done = false;
	    try {
	      fn(function (value) {
	        if (done) return;
	        done = true;
	        resolve(self, value);
	      }, function (reason) {
	        if (done) return;
	        done = true;
	        reject(self, reason);
	      });
	    } catch (ex) {
	      if (done) return;
	      done = true;
	      reject(self, ex);
	    }
	  }
	
	  Promise.prototype['catch'] = function (onRejected) {
	    return this.then(null, onRejected);
	  };
	
	  Promise.prototype.then = function (onFulfilled, onRejected) {
	    var prom = new (this.constructor)(noop);
	
	    handle(this, new Handler(onFulfilled, onRejected, prom));
	    return prom;
	  };
	
	  Promise.all = function (arr) {
	    var args = Array.prototype.slice.call(arr);
	
	    return new Promise(function (resolve, reject) {
	      if (args.length === 0) return resolve([]);
	      var remaining = args.length;
	
	      function res(i, val) {
	        try {
	          if (val && (typeof val === 'object' || typeof val === 'function')) {
	            var then = val.then;
	            if (typeof then === 'function') {
	              then.call(val, function (val) {
	                res(i, val);
	              }, reject);
	              return;
	            }
	          }
	          args[i] = val;
	          if (--remaining === 0) {
	            resolve(args);
	          }
	        } catch (ex) {
	          reject(ex);
	        }
	      }
	
	      for (var i = 0; i < args.length; i++) {
	        res(i, args[i]);
	      }
	    });
	  };
	
	  Promise.resolve = function (value) {
	    if (value && typeof value === 'object' && value.constructor === Promise) {
	      return value;
	    }
	
	    return new Promise(function (resolve) {
	      resolve(value);
	    });
	  };
	
	  Promise.reject = function (value) {
	    return new Promise(function (resolve, reject) {
	      reject(value);
	    });
	  };
	
	  Promise.race = function (values) {
	    return new Promise(function (resolve, reject) {
	      for (var i = 0, len = values.length; i < len; i++) {
	        values[i].then(resolve, reject);
	      }
	    });
	  };
	
	  // Use polyfill for setImmediate for performance gains
	  Promise._immediateFn = (typeof setImmediate === 'function' && function (fn) { setImmediate(fn); }) ||
	    function (fn) {
	      setTimeoutFunc(fn, 0);
	    };
	
	  Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
	    if (typeof console !== 'undefined' && console) {
	      console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
	    }
	  };
	
	  /**
	   * Set the immediate function to execute callbacks
	   * @param fn {function} Function to execute
	   * @deprecated
	   */
	  Promise._setImmediateFn = function _setImmediateFn(fn) {
	    Promise._immediateFn = fn;
	  };
	
	  /**
	   * Change the function to execute on unhandled rejection
	   * @param {function} fn Function to execute on unhandled rejection
	   * @deprecated
	   */
	  Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
	    Promise._unhandledRejectionFn = fn;
	  };
	  
	  if (typeof module !== 'undefined' && module.exports) {
	    module.exports = Promise;
	  } else if (!root.Promise) {
	    root.Promise = Promise;
	  }
	
	})(this);
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(44).setImmediate))

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	// render example map
	exports.default = function () {
	
	  // sorry for this hack but it's necessary because of current
	  // webpack stack during development
	  var el = document.createElement('script');
	  el.async = false;
	  el.src = './lib/d3-playbooks.riot-components.min.js';
	  el.type = 'text/javascript';
	  document.body.appendChild(el);
	
	  d3.playbooks.choroplethMap.defaults({
	    width: 800,
	    height: 800
	  });
	
	  var renderMaps = function renderMaps() {
	
	    d3.playbooks.choroplethMap({
	      elementId: 'simple-map',
	      dataUrl: './data/nrw_data.csv',
	      geoDataUrl: './data/nrw_munis.geojson',
	      responsiveSvg: true,
	      xCol: 'regionalschluessel',
	      yCol: 'bevoelkerungsdichte',
	      getId: function getId(f) {
	        return f.properties.RS.substring(1);
	      },
	      drawExtra: function drawExtra(M) {
	        var labels = M.data.filter(function (d) {
	          return d[M.yCol] > 2000;
	        }).map(function (d) {
	          var _M$path$centroid = M.path.centroid(d),
	              _M$path$centroid2 = _slicedToArray(_M$path$centroid, 2),
	              x = _M$path$centroid2[0],
	              y = _M$path$centroid2[1];
	
	          d.x = x;
	          d.y = y;
	          return d;
	        });
	        M.g.selectAll('.label').data(labels).enter().append('text').attr('transform', function (d) {
	          return 'translate(' + [d.x, d.y] + ')';
	        }).attr('class', 'label').attr('dx', '.5em').style('fill', 'black').style('font-size', '10px').text(function (d) {
	          return d.name;
	        });
	        M.g.selectAll('.point').data(labels).enter().append('circle').attr('r', 2).style('fill', 'black').attr('cx', function (d) {
	          return d.x;
	        }).attr('cy', function (d) {
	          return d.y;
	        });
	      }
	    }).render().selector({ getLabel: function getLabel(f) {
	        return f.name;
	      } });
	
	    d3.playbooks.choroplethMap({
	      elementId: 'superbugs-map',
	      cssNamespace: 'superbugs-map',
	      dataUrl: './data/e-coli.csv',
	      geoDataUrl: './data/europe.topo.json',
	      responsiveSvg: true,
	      isTopojson: true,
	      topojsonLayerName: 'europe_clipped',
	      getId: function getId(f) {
	        return f.properties.iso_a2;
	      },
	      yExtent: [0, 64]
	    }).render().infobox({
	      element: '#superbugs-map__infobox',
	      template: '\n        <h3>{name}</h3>\n        <p class="infobox__data">{display_value}</p>\n        <h4>Escherichia coli vs cephalosporins</h4>\n        <p class="infobox__subtitle">Resistance to 3rd generation cephalosporins in percent.\n        Of all infections with this bacterium, this percentage was resistant to this antibiotic.</p>\n        <p class="infobox__eudata">EU: 12 %</p>\n        <p class="infobox__annotation">ECDC Surveillance report 2014, except Poland (2013)</p>\n      '
	    }).selector({
	      element: '#superbugs-map__selector',
	      getLabel: function getLabel(f) {
	        return f.name;
	      }
	    }).legend({
	      element: '#superbugs-map__legend',
	      wrapperTemplate: '<ul name="legend">{body}</ul>',
	      itemTemplate: '<li style="background-color:{color}">{label} %</li>'
	    });
	  };
	
	  // wait for `d3-playbooks-riot-components`
	  setTimeout(renderMaps, 100);
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _generate = __webpack_require__(5);
	
	var _generate2 = _interopRequireDefault(_generate);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (_ref) {
	  var opts = _ref.opts,
	      template = _ref.template,
	      plays = _ref.plays;
	
	  var map = function map() {};
	
	  // the main object that will hold
	  // information and might change over time
	  var M = {};
	
	  // set playbook funcs as properties for this map.
	  // they could be overwritten via the opts merge below
	  for (var name in plays) {
	    M[name] = plays[name];
	  }
	
	  // opts and getter / setter methods for these
	
	  var _loop = function _loop(_name) {
	    M[_name] = opts[_name];
	    map[_name] = function () {
	      for (var _len = arguments.length, val = Array(_len), _key = 0; _key < _len; _key++) {
	        val[_key] = arguments[_key];
	      }
	
	      if (val.length === 1) {
	        M.ready.then(function () {
	          return M[_name] = val[0];
	        });
	        return map;
	      } else return M[_name];
	    };
	  };
	
	  for (var _name in opts) {
	    _loop(_name);
	  }
	
	  (0, _generate2.default)(template, M);
	
	  M.init();
	
	  // load async data
	  M.rawData.then(function (d) {
	    return M.rawData = d;
	  });
	  M.geoData.then(function (d) {
	    return M.geoData = d;
	  });
	
	  // public methods
	  d3.playbooks.PUBLIC_METHODS.map(function (func) {
	    map[func] = function (opts) {
	      M.ready.then(function () {
	        return M[func](opts);
	      });
	      return map;
	    };
	  });
	
	  return map;
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (template, C) {
	  var _loop = function _loop(func) {
	    C[func] = function () {
	      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	      var functions = template[func];
	      // parent funcs can either be mapping for storing returns
	      // or just an array of funcs to run
	      if (Array.isArray(functions)) {
	        functions.map(function (f) {
	          return C[f](C, opts);
	        });
	      } else {
	        for (var attr in functions) {
	          var f = functions[attr];
	          // don't store return as value if attr starts with `_`
	          if (attr.indexOf('_') == 0) {
	            C[f](C, opts);
	          } else {
	            C[attr] = C[f](C, opts);
	          }
	        }
	      }
	    };
	  };
	
	  for (var func in template) {
	    _loop(func);
	  }
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	// playbook functions that should be public on the returned chart instance
	var publics = ['render', 'resize', 'update'];
	
	exports.default = function () {
	  return d3.playbooks.PUBLIC_METHODS || publics;
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _base_map = __webpack_require__(8);
	
	var _base_map2 = _interopRequireDefault(_base_map);
	
	var _choropleth_map = __webpack_require__(9);
	
	var _choropleth_map2 = _interopRequireDefault(_choropleth_map);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  baseMap: _base_map2.default,
	  choroplethMap: _choropleth_map2.default
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _loader = __webpack_require__(14);
	
	var _loader2 = _interopRequireDefault(_loader);
	
	var _prepare = __webpack_require__(16);
	
	var _prepare2 = _interopRequireDefault(_prepare);
	
	var _merge_data = __webpack_require__(15);
	
	var _merge_data2 = _interopRequireDefault(_merge_data);
	
	var _get_ready = __webpack_require__(25);
	
	var _get_ready2 = _interopRequireDefault(_get_ready);
	
	var _get_chart_element = __webpack_require__(35);
	
	var _get_chart_element2 = _interopRequireDefault(_get_chart_element);
	
	var _fix_dimensions = __webpack_require__(1);
	
	var _fix_dimensions2 = _interopRequireDefault(_fix_dimensions);
	
	var _update_dimensions = __webpack_require__(33);
	
	var _update_dimensions2 = _interopRequireDefault(_update_dimensions);
	
	var _get_breakpoints = __webpack_require__(29);
	
	var _get_breakpoints2 = _interopRequireDefault(_get_breakpoints);
	
	var _setup_responsiveness = __webpack_require__(30);
	
	var _setup_responsiveness2 = _interopRequireDefault(_setup_responsiveness);
	
	var _init_svg = __webpack_require__(37);
	
	var _init_svg2 = _interopRequireDefault(_init_svg);
	
	var _init_g = __webpack_require__(36);
	
	var _init_g2 = _interopRequireDefault(_init_g);
	
	var _update_svg = __webpack_require__(34);
	
	var _update_svg2 = _interopRequireDefault(_update_svg);
	
	var _reset_g = __webpack_require__(20);
	
	var _reset_g2 = _interopRequireDefault(_reset_g);
	
	var _get_extent_domain = __webpack_require__(18);
	
	var _get_extent_domain2 = _interopRequireDefault(_get_extent_domain);
	
	var _get_ordinal_domain = __webpack_require__(19);
	
	var _get_ordinal_domain2 = _interopRequireDefault(_get_ordinal_domain);
	
	var _get_color = __webpack_require__(13);
	
	var _get_color2 = _interopRequireDefault(_get_color);
	
	var _update_breakpoints = __webpack_require__(32);
	
	var _update_breakpoints2 = _interopRequireDefault(_update_breakpoints);
	
	var _update_breakpoint_classes = __webpack_require__(31);
	
	var _update_breakpoint_classes2 = _interopRequireDefault(_update_breakpoint_classes);
	
	var _get_path = __webpack_require__(23);
	
	var _get_path2 = _interopRequireDefault(_get_path);
	
	var _get_projection = __webpack_require__(24);
	
	var _get_projection2 = _interopRequireDefault(_get_projection);
	
	var _draw_map = __webpack_require__(21);
	
	var _draw_map2 = _interopRequireDefault(_draw_map);
	
	var _get_geo_data = __webpack_require__(22);
	
	var _get_geo_data2 = _interopRequireDefault(_get_geo_data);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// geo specific
	
	// import getSizeFunc from '../../utils/sizes/get_size.js'
	exports.default = {
	  plays: {
	    getData: _loader2.default,
	    prepareData: _prepare2.default,
	    getGeoData: _get_geo_data2.default,
	    mergeData: _merge_data2.default,
	    getReady: _get_ready2.default,
	    getChartElement: _get_chart_element2.default,
	    fixDimensions: _fix_dimensions2.default,
	    updateDimensions: _update_dimensions2.default,
	    setUpResponsiveness: _setup_responsiveness2.default,
	    initSvg: _init_svg2.default,
	    initG: _init_g2.default,
	    getXDomain: _get_ordinal_domain2.default.bind({ col: 'xCol' }),
	    getYDomain: _get_extent_domain2.default.bind({ col: 'yCol' }),
	    // getXScale: getScale.bind({axis: 'x'}),
	    // getYScale: getScale.bind({axis: 'y'}),
	    // getXAxis: getAxis.bind({kind: 'axisBottom', axis: 'x'}),
	    // getYAxis: getAxis.bind({kind: 'axisLeft', axis: 'y'}),
	    // renderXAxis: renderAxis.bind({cssClasses: 'x axis'}),
	    // renderYAxis: renderAxis.bind({axis: 'y', cssClasses: 'y axis'}),
	    // renderXLabel: renderAxisLabel.bind({axis: 'x'}),
	    // renderYLabel: renderAxisLabel.bind({axis: 'y'}),
	    getColorFunc: _get_color2.default,
	    // getSizeFunc: getSizeFunc,
	    getBreakpoints: _get_breakpoints2.default,
	    updateBreakpoints: _update_breakpoints2.default,
	    updateBreakpointClasses: _update_breakpoint_classes2.default,
	    updateSvg: _update_svg2.default,
	    resetG: _reset_g2.default,
	
	    // geo specific
	    getProjection: _get_projection2.default,
	    getPath: _get_path2.default,
	    drawData: _draw_map2.default
	  },
	  defaults: {
	    ready: false,
	    data: null,
	    geoData: null,
	    features: null,
	    width: 600,
	    height: 600,
	    cssNamespace: 'd3-playbooks',
	    margin: {
	      top: 0,
	      right: 0,
	      bottom: 0,
	      left: 0
	    },
	    // showXAxis: true,
	    // showYAxis: true,
	    // showXLabel: true,
	    // showYLabel: true,
	    xCol: 'id',
	    yCol: 'value',
	    xTransform: function xTransform(d) {
	      return d;
	    },
	    yTransform: function yTransform(d) {
	      return Number(d);
	    },
	    // xScaleNice: true,
	    // yScaleNice: true,
	    responsive: true,
	    responsiveSvg: false,
	    // xTicks: 10,
	    // yTicks: 10,
	    color: d3.schemeCategory10.slice(3), // FIXME
	    nullColor: 'gray',
	    filter: false,
	    drawExtra: function drawExtra(c) {},
	    breakpoints: {
	      small: 480,
	      medium: 768,
	      large: 1280
	    },
	
	    // geo specific
	    isTopojson: false,
	    projection: d3.geoMercator(),
	    path: d3.geoPath(),
	    topojsonLayerName: 'layer',
	    topojsonObjectsAccessor: 'objects',
	    getFeatures: function getFeatures(d) {
	      return d.geoData.features;
	    },
	    getValue: function getValue(f) {
	      return Number(f.properties.value);
	    },
	    getId: function getId(f) {
	      return f.properties.id;
	    },
	    getProps: function getProps(f) {
	      return f.properties;
	    }
	  }
	};
	// import getScale from '../../utils/scales/get_scale.js'
	// import getAxis from '../../utils/axes/get_axis.js'
	// import renderAxis from '../../utils/axes/render_axis.js'
	// import renderAxisLabel from '../../utils/axes/render_axis_label.js'

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _get_choropleth_color = __webpack_require__(12);
	
	var _get_choropleth_color2 = _interopRequireDefault(_get_choropleth_color);
	
	var _get_legend_items = __webpack_require__(26);
	
	var _get_legend_items2 = _interopRequireDefault(_get_legend_items);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  plays: {
	    getColorFunc: _get_choropleth_color2.default,
	    getLegendItems: _get_legend_items2.default
	  },
	  defaults: {
	    color: ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026'] }
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  init: {
	    rawData: 'getData',
	    geoData: 'getGeoData',
	    ready: 'getReady',
	    element: 'getChartElement',
	    _responsive: 'setUpResponsiveness',
	    _updateDimensions: 'updateDimensions',
	    breakpoints: 'getBreakpoints',
	    _updateBreakpoints: 'updateBreakpoints',
	    _updateBreakpointClasses: 'updateBreakpointClasses',
	    svg: 'initSvg',
	    g: 'initG'
	  },
	  setupData: {
	    csvData: 'prepareData',
	    features: 'getFeatures',
	    data: 'mergeData'
	  },
	  setup: {
	    xDomain: 'getXDomain',
	    yDomain: 'getYDomain',
	    getColor: 'getColorFunc'
	  },
	  prepareDraw: {
	    projection: 'getProjection',
	    path: 'getPath'
	  },
	  draw: {
	    drawedSelection: 'drawData',
	    extraDrawedSelections: 'drawExtra'
	  },
	  render: ['setupData', 'setup', 'prepareDraw', 'draw'],
	  resize: ['updateBreakpoints', 'updateBreakpointClasses', 'updateSvg', 'resetG', 'prepareDraw', 'draw'],
	  update: ['setup', 'updateSvg', 'resetG', 'prepareDraw', 'draw']
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(28);
	
	__webpack_require__(27);
	
	var _template = __webpack_require__(10);
	
	var _template2 = _interopRequireDefault(_template);
	
	var _available_maps = __webpack_require__(7);
	
	var _available_maps2 = _interopRequireDefault(_available_maps);
	
	var _map = __webpack_require__(4);
	
	var _map2 = _interopRequireDefault(_map);
	
	var _get_publics = __webpack_require__(6);
	
	var _get_publics2 = _interopRequireDefault(_get_publics);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// init
	// // FIXME: currently, `d3-playbooks-maps` is currently only standalone
	
	/*
	 * make some stuff public for addons to hook into
	 */
	
	// polyfills
	d3.playbooks = {};
	d3.playbooks.TEMPLATE = _template2.default;
	_available_maps2.default.baseChart = _available_maps2.default.baseMap;
	d3.playbooks.CHARTS = _available_maps2.default;
	d3.playbooks.PUBLIC_METHODS = (0, _get_publics2.default)();
	
	var overrides = {};
	
	// set app-wide defaults
	d3.playbooks.defaults = function (opts) {
	  overrides.baseMap = opts;
	};
	
	// add new map type as function
	d3.playbooks.addMap = function (name, _ref) {
	  var defaults = _ref.defaults,
	      plays = _ref.plays;
	
	
	  overrides[name] = {};
	
	  d3.playbooks[name] = function (options) {
	    // merge opts
	    var opts = Object.assign({}, d3.playbooks.CHARTS.baseChart.defaults, // base defaults
	    defaults, // chart type defaults
	    overrides.baseMap, // global overrides
	    overrides[name], // chart type overrides
	    options // concrete opts
	    );
	    // merge plays
	    plays = Object.assign({}, d3.playbooks.CHARTS.baseChart.plays, plays);
	    var template = d3.playbooks.TEMPLATE;
	    return (0, _map2.default)({ opts: opts, template: template, plays: plays });
	  };
	
	  // add setter method for override defaults
	  // for given map type
	  d3.playbooks[name].defaults = function (opts) {
	    overrides[name] = opts;
	  };
	};
	
	// add concrete map types
	for (var name in _available_maps2.default) {
	  d3.playbooks.addMap(name, _available_maps2.default[name]);
	}

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	/** compute getColor func special for choropleths
	 *
	 * @param color -
	 *  a callable - will just return as is
	 *  an Array, this will compute a d3 scaleQuantile
	**/
	exports.default = function (_ref) {
	  var color = _ref.color,
	      yDomain = _ref.yDomain;
	
	  if (typeof color === 'function') return color;else {
	    return d3.scaleQuantile().domain(yDomain).range(color);
	  }
	};

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	/** compute getColor func
	 *
	 * @param color -
	 *  a string, everything gets the same color
	 *  an Array, this will compute a d3 scaleOrdinal to get the color (e.g. for group based data)
	 *  a mapping (object), the color for the given value will be returned
	 *  a callable - will just return as is
	**/
	exports.default = function (_ref) {
	  var color = _ref.color,
	      groupCol = _ref.groupCol;
	
	
	  if (typeof color === 'string') return function () {
	    return color;
	  };else if (Array.isArray(color)) {
	    var _getColor = d3.scaleOrdinal(color);
	    return function (d) {
	      return _getColor(d[groupCol] || d);
	    };
	  } else if (color.constructor === Object) {
	    if (!groupCol) {
	      throw new Error('need groupCol for this color func');
	    }
	    return function (d) {
	      return color[d[groupCol]];
	    };
	  } else if (typeof color === 'function') return color;else {
	    throw new Error('can\'t compute color function from ' + color);
	  }
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _promisePolyfill = __webpack_require__(2);
	
	var _promisePolyfill2 = _interopRequireDefault(_promisePolyfill);
	
	var _transform_data = __webpack_require__(17);
	
	var _transform_data2 = _interopRequireDefault(_transform_data);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _loadCsv(dataUrl) {
	  return new _promisePolyfill2.default(function (resolve, reject) {
	    d3.csv(dataUrl, function (err, d) {
	      err ? reject(err) : resolve(d);
	    });
	  });
	}
	
	exports.default = function (_ref) {
	  var data = _ref.data,
	      dataUrl = _ref.dataUrl,
	      xCol = _ref.xCol,
	      yCol = _ref.yCol,
	      yCols = _ref.yCols,
	      filter = _ref.filter,
	      timeFormat = _ref.timeFormat;
	
	  if (data || dataUrl) {
	    return new _promisePolyfill2.default(function (resolve) {
	      // also return promise if data is already there
	      var _getData = data ? new _promisePolyfill2.default(function (r) {
	        return r((0, _transform_data2.default)({ data: data, xCol: xCol, yCol: yCol }));
	      }) : _loadCsv(dataUrl);
	      _getData.then(function (rows) {
	        if (filter) rows = rows.filter(filter);
	        if (timeFormat) {
	          // FIXME
	          var parseTime = d3.timeParse(timeFormat);
	          rows.forEach(function (r) {
	            return r[xCol] = parseTime(r[xCol]);
	          });
	        }
	
	        // ensure data is present
	        // FIXME overthink for maps
	        // if (xCol && yCols) {
	        //   resolve(rows.filter(r => (r[xCol] && yCols.map(c => r[c]).every(e => !!e))))
	        // } else {
	        //   resolve(rows.filter(r => (r[xCol] && r[yCol])))
	        // }
	        resolve(rows);
	      });
	    });
	  } else {
	    return new _promisePolyfill2.default(function (r) {
	      return r(null);
	    });
	  }
	};

/***/ },
/* 15 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	// merge geoData with csvData, if there is some
	//
	// csvData:
	//    xCol = csv column to identify geoData by getId(feature)
	//    yCol = csv column with numerical values
	//
	// geoData:
	//    getId = function to get identification value from feature (acts as `x`)
	//    getValue = function to get numerical value from feature (acts as `y`)
	//
	// in general, data will be assigned to geoJson-features directly like `f.name`
	// (instead of `f.properties.name`
	
	exports.default = function (_ref) {
	  var csvData = _ref.csvData,
	      xCol = _ref.xCol,
	      yCol = _ref.yCol,
	      features = _ref.features,
	      getValue = _ref.getValue,
	      getId = _ref.getId,
	      getProps = _ref.getProps;
	
	
	  var setFeatData = function setFeatData(feat) {
	    var props = getProps(feat);
	    Object.keys(props).map(function (k) {
	      feat[k] = props[k];
	      var value = getValue(feat);
	      if (value) feat[yCol] = value;
	    });
	    return feat;
	  };
	
	  features.map(function (f) {
	    return setFeatData(f);
	  });
	
	  // get additional data from csv, existing keys will be overwritten
	  if (csvData) {
	    // get csvData mapping for efficient matching
	    var cData = {};
	    csvData.map(function (d) {
	      return cData[d[xCol]] = d;
	    });
	
	    var setFeatCsvData = function setFeatCsvData(feat) {
	      var featId = getId(feat);
	      var data = cData[featId];
	      if (data) Object.keys(data).map(function (k) {
	        return feat[k] = data[k];
	      });
	      return feat;
	    };
	
	    features.map(function (f) {
	      return setFeatCsvData(f);
	    });
	  }
	
	  return features;
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	/*
	 * prepare x / y data based on transform funcs
	 */
	exports.default = function (_ref) {
	  var rawData = _ref.rawData,
	      xCol = _ref.xCol,
	      yCol = _ref.yCol,
	      yCols = _ref.yCols,
	      xTransform = _ref.xTransform,
	      yTransform = _ref.yTransform,
	      yTransforms = _ref.yTransforms;
	
	  if (rawData) {
	    return rawData.map(function (d) {
	      d[xCol] = xTransform(d[xCol]);
	      if (yCols) {
	        yCols.map(function (c) {
	          var cd = d[c];
	          var transform = yTransforms[c] || yTransform;
	          d[c] = transform(cd);
	        });
	      } else {
	        d[yCol] = yTransform(d[yCol]);
	      }
	      return d;
	    });
	  } else {
	    return null;
	  }
	};

/***/ },
/* 17 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	/**
	 * transform input data given on init via the `data` option
	 * to array of mappings:
	 *    [{x: 1, y: 2}, {x: 2, y: 3}, ...]
	 * to have same structure as the asynchronous `dataUrl` csv handling
	**/
	exports.default = function (_ref) {
	  var data = _ref.data,
	      xCol = _ref.xCol,
	      yCol = _ref.yCol,
	      yCols = _ref.yCols;
	
	
	  /**
	   * [
	   *  ['a', 'b', 'c'],   <= xCol (default: 'x')
	   *  [1, 2, 3]          <= yCol (default: 'y')
	   * ]
	  **/
	  if (Array.isArray(data) && Array.isArray(data[0])) {
	    return data[0].map(function (d, i) {
	      var _data = {};
	      _data[xCol] = d;
	      _data[yCol] = data[1][i];
	      return _data;
	    });
	  }
	
	  /**
	   * {
	   *   x: [1, 2, 3],
	   *   y: [4, 5, 6],
	   *   foo: ['a', 'b', 'c']
	   * }
	   **/
	  else if (data.constructor === Object) {
	      var keys = Object.keys(data);
	      return data[keys[0]].map(function (_, i) {
	        var d = {};
	        keys.map(function (k) {
	          d[k] = data[k][i];
	        });
	        return d;
	      });
	    } else return data;
	};

/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (_ref) {
	  var data = _ref.data,
	      xCol = _ref.xCol,
	      yCol = _ref.yCol,
	      xExtent = _ref.xExtent,
	      yExtent = _ref.yExtent;
	
	  var y = this.col === 'yCol';
	  var col = y ? yCol : xCol;
	  var extent = y ? yExtent : xExtent;
	  return extent || d3.extent(data, function (d) {
	    return d[col];
	  });
	};

/***/ },
/* 19 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (_ref) {
	  var data = _ref.data,
	      xCol = _ref.xCol,
	      yCol = _ref.yCol;
	
	  var col = this.col === 'y' ? yCol : xCol;
	  return data.map(function (d) {
	    return d[col];
	  });
	};

/***/ },
/* 20 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	// remove all children of the main `g` element
	// and all children of the base `element` that are flagged with a css class named `--delete-on-update`
	// prepare for re-drawing (e.g. during resize) with margins
	exports.default = function (_ref) {
	  var g = _ref.g,
	      element = _ref.element,
	      margin = _ref.margin;
	
	  element.selectAll('.--delete-on-update').remove();
	  g.selectAll('*').remove();
	  g.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
	};

/***/ },
/* 21 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (_ref) {
	  var g = _ref.g,
	      data = _ref.data,
	      path = _ref.path,
	      getColor = _ref.getColor,
	      nullColor = _ref.nullColor,
	      yCol = _ref.yCol;
	
	  return g.attr('class', 'map').selectAll('path').data(data).enter().append('path').attr('class', 'map__item').attr('d', path).attr('fill', function (d) {
	    return getColor(d[yCol]) || nullColor;
	  });
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _promisePolyfill = __webpack_require__(2);
	
	var _promisePolyfill2 = _interopRequireDefault(_promisePolyfill);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (_ref) {
	  var isTopojson = _ref.isTopojson,
	      topojsonLayerName = _ref.topojsonLayerName,
	      topojsonObjectsAccessor = _ref.topojsonObjectsAccessor,
	      geoDataUrl = _ref.geoDataUrl,
	      geoData = _ref.geoData;
	
	  if (geoData) {
	    return new _promisePolyfill2.default(function (r) {
	      return r(geoData);
	    });
	  } else {
	    return new _promisePolyfill2.default(function (resolve, reject) {
	      // d3.json(geoDataUrl, (err, d) => err ? reject(err) : resolve(d))
	      d3.json(geoDataUrl, function (err, d) {
	        if (err) reject(err);
	        if (isTopojson) {
	          resolve(topojson.feature(d, d[topojsonObjectsAccessor][topojsonLayerName]));
	        } else {
	          resolve(d);
	        }
	      });
	    });
	  }
	};

/***/ },
/* 23 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (_ref) {
	  var path = _ref.path,
	      projection = _ref.projection;
	  return path.projection(projection);
	};

/***/ },
/* 24 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (_ref) {
	  var width = _ref.width,
	      height = _ref.height,
	      geoData = _ref.geoData,
	      projection = _ref.projection;
	  return projection.fitSize([width, height], geoData);
	};

/***/ },
/* 25 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (_ref) {
	  var rawData = _ref.rawData,
	      geoData = _ref.geoData;
	  return Promise.all([rawData, geoData]);
	};

/***/ },
/* 26 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	// for use with `d3-playbooks-riot-components`
	
	exports.default = function (_ref, _ref2) {
	  var yDomain = _ref.yDomain,
	      getColor = _ref.getColor;
	  var getLabel = _ref2.getLabel;
	
	  if (!getLabel) getLabel = function getLabel(q) {
	    return Math.round(q);
	  };
	  var quantiles = getColor.quantiles();
	  var quantileWidth = quantiles[0];
	  quantiles.push(yDomain[1]);
	  return quantiles.map(function (q) {
	    return {
	      label: getLabel(q),
	      color: getColor(q - quantileWidth / 2)
	    };
	  });
	};

/***/ },
/* 27 */
/***/ function(module, exports) {

	'use strict';
	
	if (!Array.isArray) {
	  Array.isArray = function (arg) {
	    return Object.prototype.toString.call(arg) === '[object Array]';
	  };
	}

/***/ },
/* 28 */
/***/ function(module, exports) {

	'use strict';
	
	// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
	if (typeof Object.assign != 'function') {
	  Object.assign = function (target, varArgs) {
	    // .length of function is 2
	    'use strict';
	
	    if (target == null) {
	      // TypeError if undefined or null
	      throw new TypeError('Cannot convert undefined or null to object');
	    }
	
	    var to = Object(target);
	
	    for (var index = 1; index < arguments.length; index++) {
	      var nextSource = arguments[index];
	
	      if (nextSource != null) {
	        // Skip over if undefined or null
	        for (var nextKey in nextSource) {
	          // Avoid bugs when hasOwnProperty is shadowed
	          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
	            to[nextKey] = nextSource[nextKey];
	          }
	        }
	      }
	    }
	    return to;
	  };
	}

/***/ },
/* 29 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	// convert breakpoints into sorted array if needed
	exports.default = function (_ref) {
	  var breakpoints = _ref.breakpoints,
	      responsive = _ref.responsive;
	
	  return responsive ? Object.keys(breakpoints).map(function (b) {
	    return {
	      name: b,
	      width: breakpoints[b]
	    };
	  }).sort(function (a, b) {
	    return a.width - b.width;
	  }) : breakpoints;
	};

/***/ },
/* 30 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (chart) {
	  if (chart.responsive && !chart.responsiveSvg) {
	    var width = chart.width,
	        height = chart.height;
	
	    // preserve original values
	
	    chart._originWidth = width;
	    chart._originHeight = height;
	
	    // setup height calculation
	    var heightRatio = height / width;
	    var xTicksRatio = chart.xTicks / width;
	    var yTicksRatio = chart.yTicks / height;
	    chart._getHeight = function (width) {
	      return parseInt(width * heightRatio);
	    };
	
	    // show at least two ticks
	    chart._getXTicks = function (width) {
	      var ticks = parseInt(width * xTicksRatio);
	      return ticks < 2 ? 2 : ticks > chart.xTicks ? chart.xTicks : ticks;
	    };
	    chart._getYTicks = function (height) {
	      var ticks = parseInt(height * yTicksRatio);
	      return ticks < 2 ? 2 : ticks > chart.yTicks ? chart.yTicks : ticks;
	    };
	
	    // add event listener
	    window.addEventListener('resize', function () {
	      if (chart.updateDimensions(chart)) {
	        chart.resize();
	      }
	    });
	  }
	};

/***/ },
/* 31 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (_ref) {
	  var element = _ref.element,
	      breakpoint = _ref.breakpoint;
	  var activeClass = breakpoint.activeClass,
	      inactiveClasses = breakpoint.inactiveClasses;
	
	  inactiveClasses.map(function (c) {
	    return element.classed(c, false);
	  });
	  element.classed(activeClass, true);
	};

/***/ },
/* 32 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	// set breakpoint flags
	exports.default = function (chart) {
	  // get css class shorthand
	  var _ = function _(name) {
	    return chart.cssNamespace + '--' + name;
	  };
	  // see `getBreakpoints`
	  var active = chart.breakpoints.find(function (b) {
	    return chart.width <= b.width;
	  }).name;
	  var activeClass = _(active);
	
	  var inactiveClasses = chart.breakpoints.filter(function (b) {
	    return b.name !== activeClass;
	  }).map(function (b) {
	    return _(b.name);
	  });
	
	  // some convenient shorthands for breakpoints
	  chart.breakpoints.map(function (b) {
	    return chart['is_' + b.name] = b.name === active;
	  });
	
	  chart.breakpoint = {
	    active: active,
	    activeClass: activeClass,
	    inactiveClasses: inactiveClasses
	  };
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _fix_dimensions = __webpack_require__(1);
	
	var _fix_dimensions2 = _interopRequireDefault(_fix_dimensions);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// compute chart dimensions (for use on resize)
	// return whether to perform resize or not (boolean)
	// @param {object} chart - chart instance from `chart.js`
	exports.default = function (chart) {
	  // const currentWidth = chart.element.node().clientWidth - 10  // FIXME possible scrollbars
	  var currentWidth = chart.element.node().clientWidth;
	
	  // containerWidth is smaller than origin width
	  if (currentWidth < chart._originWidth) {
	    chart.width = currentWidth;
	    chart.height = chart._getHeight(currentWidth);
	    (0, _fix_dimensions2.default)(chart); // FIXME ???
	    // do resize
	    return true;
	
	    // wrapper is equal or bigger than origin width
	  } else {
	    // restore originals
	    if (!(chart.containerWidth === chart._originWidth)) {
	      chart.width = chart._originWidth;
	      chart.height = chart._originHeight;
	      (0, _fix_dimensions2.default)(chart); // FIXME ???
	      // resize
	      return true;
	
	      // don't resize
	    } else {
	      return false;
	    }
	  }
	};

/***/ },
/* 34 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (_ref) {
	  var svg = _ref.svg,
	      containerWidth = _ref.containerWidth,
	      containerHeight = _ref.containerHeight,
	      margin = _ref.margin;
	
	  // update svg dimensions
	  svg.attr('width', containerWidth).attr('height', containerHeight);
	};

/***/ },
/* 35 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	/**
	 * return element to which a chart will be applied.
	 * if element not in `document`, it will be created
	 *
	 * @param {string} elementId - id of html element
	 * @param {string} cssNamespace
	 **/
	exports.default = function (_ref) {
	  var elementId = _ref.elementId,
	      cssNamespace = _ref.cssNamespace;
	
	  var element = d3.select('#' + elementId);
	  if (element.empty()) {
	    element = d3.select('body').append('div');
	    elementId ? element.attr('id', elementId) : null;
	  }
	
	  return element.append('div').attr('class', cssNamespace + ' ' + cssNamespace + '__wrapper');
	};

/***/ },
/* 36 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	// init svg elemnt child (`g`) the first time
	// @return g
	exports.default = function (_ref) {
	  var svg = _ref.svg,
	      margin = _ref.margin;
	
	  return svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
	};

/***/ },
/* 37 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	// init svg the first time
	// @return svg as wrapper svg element (use for resizing if responsive)
	exports.default = function (_ref) {
	  var element = _ref.element,
	      width = _ref.width,
	      height = _ref.height,
	      containerWidth = _ref.containerWidth,
	      containerHeight = _ref.containerHeight,
	      responsiveSvg = _ref.responsiveSvg,
	      cssNamespace = _ref.cssNamespace;
	
	  var svg = element.append('svg');
	
	  if (responsiveSvg) {
	    svg
	    //responsive SVG needs these 2 attributes and no width and height attr
	    .attr('preserveAspectRatio', 'xMinYMin meet').attr('viewBox', '0 0 ' + width + ' ' + height)
	    //class to make it responsive
	    .classed('svg-content-responsive', true).classed(cssNamespace + '__svg', true);
	    element.classed('svg-container-responsive', true);
	  } else {
	    svg.attr('width', containerWidth).attr('height', containerHeight).attr('class', cssNamespace + '__svg');
	  }
	  return svg;
	};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(39)();
	// imports
	
	
	// module
	exports.push([module.id, ".d3-playbooks{position:relative}.d3-playbooks .map{fill:none}.d3-playbooks .map__item{stroke:gray;stroke-width:.5}.d3-playbooks .svg-container-responsive{display:inline-block;position:relative;width:100%;padding-bottom:100%;vertical-align:top;overflow:hidden}.d3-playbooks .svg-container-responsive .svg-content-responsive{display:inline-block;position:absolute}", ""]);
	
	// exports


/***/ },
/* 39 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 40 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	
	
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	
	
	
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
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
	    var timeout = runTimeout(cleanUpNextTick);
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
	    runClearTimeout(timeout);
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
	        runTimeout(drainQueue);
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
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
	    "use strict";
	
	    if (global.setImmediate) {
	        return;
	    }
	
	    var nextHandle = 1; // Spec says greater than zero
	    var tasksByHandle = {};
	    var currentlyRunningATask = false;
	    var doc = global.document;
	    var registerImmediate;
	
	    function setImmediate(callback) {
	      // Callback can either be a function or a string
	      if (typeof callback !== "function") {
	        callback = new Function("" + callback);
	      }
	      // Copy function arguments
	      var args = new Array(arguments.length - 1);
	      for (var i = 0; i < args.length; i++) {
	          args[i] = arguments[i + 1];
	      }
	      // Store and register the task
	      var task = { callback: callback, args: args };
	      tasksByHandle[nextHandle] = task;
	      registerImmediate(nextHandle);
	      return nextHandle++;
	    }
	
	    function clearImmediate(handle) {
	        delete tasksByHandle[handle];
	    }
	
	    function run(task) {
	        var callback = task.callback;
	        var args = task.args;
	        switch (args.length) {
	        case 0:
	            callback();
	            break;
	        case 1:
	            callback(args[0]);
	            break;
	        case 2:
	            callback(args[0], args[1]);
	            break;
	        case 3:
	            callback(args[0], args[1], args[2]);
	            break;
	        default:
	            callback.apply(undefined, args);
	            break;
	        }
	    }
	
	    function runIfPresent(handle) {
	        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
	        // So if we're currently running a task, we'll need to delay this invocation.
	        if (currentlyRunningATask) {
	            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
	            // "too much recursion" error.
	            setTimeout(runIfPresent, 0, handle);
	        } else {
	            var task = tasksByHandle[handle];
	            if (task) {
	                currentlyRunningATask = true;
	                try {
	                    run(task);
	                } finally {
	                    clearImmediate(handle);
	                    currentlyRunningATask = false;
	                }
	            }
	        }
	    }
	
	    function installNextTickImplementation() {
	        registerImmediate = function(handle) {
	            process.nextTick(function () { runIfPresent(handle); });
	        };
	    }
	
	    function canUsePostMessage() {
	        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
	        // where `global.postMessage` means something completely different and can't be used for this purpose.
	        if (global.postMessage && !global.importScripts) {
	            var postMessageIsAsynchronous = true;
	            var oldOnMessage = global.onmessage;
	            global.onmessage = function() {
	                postMessageIsAsynchronous = false;
	            };
	            global.postMessage("", "*");
	            global.onmessage = oldOnMessage;
	            return postMessageIsAsynchronous;
	        }
	    }
	
	    function installPostMessageImplementation() {
	        // Installs an event handler on `global` for the `message` event: see
	        // * https://developer.mozilla.org/en/DOM/window.postMessage
	        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages
	
	        var messagePrefix = "setImmediate$" + Math.random() + "$";
	        var onGlobalMessage = function(event) {
	            if (event.source === global &&
	                typeof event.data === "string" &&
	                event.data.indexOf(messagePrefix) === 0) {
	                runIfPresent(+event.data.slice(messagePrefix.length));
	            }
	        };
	
	        if (global.addEventListener) {
	            global.addEventListener("message", onGlobalMessage, false);
	        } else {
	            global.attachEvent("onmessage", onGlobalMessage);
	        }
	
	        registerImmediate = function(handle) {
	            global.postMessage(messagePrefix + handle, "*");
	        };
	    }
	
	    function installMessageChannelImplementation() {
	        var channel = new MessageChannel();
	        channel.port1.onmessage = function(event) {
	            var handle = event.data;
	            runIfPresent(handle);
	        };
	
	        registerImmediate = function(handle) {
	            channel.port2.postMessage(handle);
	        };
	    }
	
	    function installReadyStateChangeImplementation() {
	        var html = doc.documentElement;
	        registerImmediate = function(handle) {
	            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
	            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
	            var script = doc.createElement("script");
	            script.onreadystatechange = function () {
	                runIfPresent(handle);
	                script.onreadystatechange = null;
	                html.removeChild(script);
	                script = null;
	            };
	            html.appendChild(script);
	        };
	    }
	
	    function installSetTimeoutImplementation() {
	        registerImmediate = function(handle) {
	            setTimeout(runIfPresent, 0, handle);
	        };
	    }
	
	    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
	    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
	    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;
	
	    // Don't get fooled by e.g. browserify environments.
	    if ({}.toString.call(global.process) === "[object process]") {
	        // For Node.js before 0.9
	        installNextTickImplementation();
	
	    } else if (canUsePostMessage()) {
	        // For non-IE10 modern browsers
	        installPostMessageImplementation();
	
	    } else if (global.MessageChannel) {
	        // For web workers, where supported
	        installMessageChannelImplementation();
	
	    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
	        // For IE 6–8
	        installReadyStateChangeImplementation();
	
	    } else {
	        // For older browsers
	        installSetTimeoutImplementation();
	    }
	
	    attachTo.setImmediate = setImmediate;
	    attachTo.clearImmediate = clearImmediate;
	}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(40)))

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(38);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(42)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/index.js!./main.scss", function() {
				var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/index.js!./main.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var apply = Function.prototype.apply;
	
	// DOM APIs, for completeness
	
	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) {
	  if (timeout) {
	    timeout.close();
	  }
	};
	
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
	
	// setimmediate attaches itself to the global object
	__webpack_require__(41);
	exports.setImmediate = setImmediate;
	exports.clearImmediate = clearImmediate;


/***/ }
/******/ ]);
//# sourceMappingURL=d3-playbooks.maps.js.map