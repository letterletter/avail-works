/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"debug-run-manage": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["./src/webview/source/debug-run-extension/index.tsx","vendors"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/less-loader/dist/cjs.js?!./src/webview/source/debug-run-extension/app.less":
/*!************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/less-loader/dist/cjs.js??ref--6-2!./src/webview/source/debug-run-extension/app.less ***!
  \************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "./node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default.a);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".plugin-management {\n  position: relative;\n  display: flex;\n  align-items: flex-end;\n  cursor: pointer;\n  min-width: 225px;\n}\n.plugin-management:hover {\n  background: var(--vscode-list-hoverBackground);\n}\n.plugin-management .item-container {\n  flex: 1;\n  display: flex;\n  justify-content: flex-start;\n  align-items: center;\n  position: relative;\n  padding: 8px 16px;\n  overflow: hidden;\n}\n.plugin-management .item-container .img-container {\n  flex: 0 0 40px;\n  width: 40px;\n  height: 40px;\n}\n.plugin-management .item-container .title-container {\n  flex: 1;\n  margin-left: 16px;\n  overflow: hidden;\n}\n.plugin-management .item-container .title-container .title {\n  font-weight: 700;\n  color: var(--vscode-editor-foreground);\n}\n.plugin-management .item-container .title-container .desc {\n  margin-bottom: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  color: var(--vscode-editor-foreground);\n}\n.plugin-management .config-container {\n  position: absolute;\n  right: 16px;\n  top: 8px;\n  font-size: 13px;\n  cursor: pointer;\n  color: var(--vscode-editor-foreground);\n}\n.plugin-management .config-container:hover {\n  color: var(--vscode-button-hoverBackground);\n}\n.plugin-management .button-container {\n  margin: 0 16px 8px 0;\n  border-radius: 2px;\n  padding: 0 4px;\n  line-height: 16px;\n  font-size: 12px;\n  background-color: var(--vscode-extensionButton-prominentBackground);\n  color: var(--vscode-extensionButton-prominentForeground);\n  cursor: pointer;\n}\n.plugin-management .button-container:hover {\n  background: var(--vscode-button-hoverBackground);\n}\n", "",{"version":3,"sources":["webpack://./src/webview/source/debug-run-extension/app.less"],"names":[],"mappings":"AAAA;EACE,kBAAA;EACA,aAAA;EACA,qBAAA;EACA,eAAA;EACA,gBAAA;AACF;AACE;EACI,8CAAA;AACN;AATA;EAYM,OAAA;EACA,aAAA;EACA,2BAAA;EACA,mBAAA;EACA,kBAAA;EACA,iBAAA;EACA,gBAAA;AAAN;AAlBA;EAqBU,cAAA;EACA,WAAA;EACA,YAAA;AAAV;AAvBA;EA2BU,OAAA;EACA,iBAAA;EACA,gBAAA;AADV;AA5BA;EAgCc,gBAAA;EACA,sCAAA;AADd;AAhCA;EAqCc,gBAAA;EACA,gBAAA;EACA,uBAAA;EACA,mBAAA;EACA,sCAAA;AAFd;AAvCA;EA8CM,kBAAA;EACA,WAAA;EACA,QAAA;EACA,eAAA;EACA,eAAA;EACA,sCAAA;AAJN;AAMM;EACI,2CAAA;AAJV;AAlDA;EA2DM,oBAAA;EACA,kBAAA;EACA,cAAA;EACA,iBAAA;EACA,eAAA;EACA,mEAAA;EACA,wDAAA;EACA,eAAA;AANN;AAQM;EACI,gDAAA;AANV","sourcesContent":[".plugin-management {\n  position: relative;\n  display: flex;\n  align-items: flex-end;\n  cursor: pointer;\n  min-width: 225px;\n\n  &:hover {\n      background: var(--vscode-list-hoverBackground);\n  }\n\n  .item-container {\n      flex: 1;\n      display: flex;\n      justify-content: flex-start;\n      align-items: center;\n      position: relative;\n      padding: 8px 16px;\n      overflow: hidden;\n\n      .img-container {\n          flex: 0 0 40px;\n          width: 40px;\n          height: 40px;\n      }\n\n      .title-container {\n          flex: 1;\n          margin-left: 16px;\n          overflow: hidden;\n\n          .title {\n              font-weight: 700;\n              color: var(--vscode-editor-foreground);\n          }\n\n          .desc {\n              margin-bottom: 0;\n              overflow: hidden;\n              text-overflow: ellipsis;\n              white-space: nowrap;\n              color: var(--vscode-editor-foreground);\n          }\n      }\n  }\n  .config-container {\n      position: absolute;\n      right: 16px;\n      top: 8px;\n      font-size: 13px;\n      cursor: pointer;\n      color: var(--vscode-editor-foreground);\n\n      &:hover {\n          color: var(--vscode-button-hoverBackground);\n      }\n  }\n\n  .button-container {\n      margin: 0 16px 8px 0;\n      border-radius: 2px;\n      padding: 0 4px;\n      line-height: 16px;\n      font-size: 12px;\n      background-color: var(--vscode-extensionButton-prominentBackground);\n      color: var(--vscode-extensionButton-prominentForeground);\n      cursor: pointer;\n\n      &:hover {\n          background: var(--vscode-button-hoverBackground);\n      }\n  }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./src/webview/source/debug-run-extension/app.less":
/*!*********************************************************!*\
  !*** ./src/webview/source/debug-run-extension/app.less ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_less_loader_dist_cjs_js_ref_6_2_app_less__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../../node_modules/css-loader/dist/cjs.js!../../../../node_modules/less-loader/dist/cjs.js??ref--6-2!./app.less */ "./node_modules/css-loader/dist/cjs.js!./node_modules/less-loader/dist/cjs.js?!./src/webview/source/debug-run-extension/app.less");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_less_loader_dist_cjs_js_ref_6_2_app_less__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ __webpack_exports__["default"] = (_node_modules_css_loader_dist_cjs_js_node_modules_less_loader_dist_cjs_js_ref_6_2_app_less__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./src/webview/source/debug-run-extension/app.tsx":
/*!********************************************************!*\
  !*** ./src/webview/source/debug-run-extension/app.tsx ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var antd_lib_select_style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! antd/lib/select/style/css */ "./node_modules/antd/lib/select/style/css.js");
/* harmony import */ var antd_lib_select_style_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(antd_lib_select_style_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var antd_lib_select__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! antd/lib/select */ "./node_modules/antd/lib/select/index.js");
/* harmony import */ var antd_lib_select__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(antd_lib_select__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _app_less__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./app.less */ "./src/webview/source/debug-run-extension/app.less");
/* harmony import */ var _hooks_useSendMessage__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../hooks/useSendMessage */ "./src/webview/source/hooks/useSendMessage.ts");
/* harmony import */ var _hooks_useReceiveMessage__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../hooks/useReceiveMessage */ "./src/webview/source/hooks/useReceiveMessage.ts");






// import { PostMessageClient } from '@ad/postmessage-client';




var mockPluginList = ['letterletter.create-project', 'letterletter.availworks-project-creator', 'letterletter.cat-coding', 'letterletter.availworks-app', 'letterletter.availworks-material-helper', 'letterletter.letter-demo-wf-test'];
var DebugAndRunPlugin = function DebugAndRunPlugin() {
  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_5__["useState"])(undefined),
    _useState2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3___default()(_useState, 2),
    pluginId = _useState2[0],
    setPluginId = _useState2[1];
  var _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_5__["useState"])(undefined),
    _useState4 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3___default()(_useState3, 2),
    extensionData = _useState4[0],
    setExtensionData = _useState4[1];
  var _useSendMessage = Object(_hooks_useSendMessage__WEBPACK_IMPORTED_MODULE_7__["default"])(),
    _useSendMessage2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3___default()(_useSendMessage, 1),
    send = _useSendMessage2[0];
  Object(_hooks_useReceiveMessage__WEBPACK_IMPORTED_MODULE_8__["default"])({
    // loadData: (payload: any) => setDeployMethods(payload),
    setExtensionData: function setExtensionData(value) {
      return handleSetExtension(value);
    }
  }, []);
  var handleSetExtension = function handleSetExtension(value) {
    console.log('receive extension', value);
    setExtensionData(value);
  };
  var onRequestClick = function onRequestClick(id) {
    return send('install', id);
  };
  var onUninstallClick = function onUninstallClick(id) {
    return send('uninstall', id);
  };
  var onClick = function onClick(id) {
    // PostMessageClient.instance.send<typeof openRequestType>(openRequestType, id);
  };
  var onConfigClick = function onConfigClick(itemInfo) {
    // PostMessageClient.instance.send<typeof openConfigRequestType>(
    //     openConfigRequestType,
    //     itemInfo,
    // );
  };
  var handleChange = function handleChange(value) {
    send('getExtensionInfo', value);
  };
  var init = /*#__PURE__*/function () {
    var _ref = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default.a.mark(function _callee() {
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default.a.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function init() {
      return _ref.apply(this, arguments);
    };
  }();
  Object(react__WEBPACK_IMPORTED_MODULE_5__["useEffect"])(function () {
    init();
  }, []);

  // 监听页面刷新命令
  Object(react__WEBPACK_IMPORTED_MODULE_5__["useEffect"])(function () {
    // const disposable = PostMessageClient.instance.on<NotificationType<PluginInfo[], any>>(
    //     new NotificationType('vsc://plugin/refresh'),
    //     (pluginList) => {
    //         if (pluginList.length) {
    //             setPluginList(pluginList);
    //         }
    //     },
    // );
    return function () {
      // 取消监听
      // disposable.dispose();
    };
  }, []);
  var setPluginLoading = function setPluginLoading(id, isLoading) {};
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_5___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", null, "\u6D4B\u8BD5\u6D4B\u8BD5 PluginManagement"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(antd_lib_select__WEBPACK_IMPORTED_MODULE_1___default.a, {
    style: {
      width: '100%'
    },
    options: mockPluginList.map(function (item) {
      return {
        label: item,
        value: item
      };
    }),
    onChange: handleChange
  }));
};

// export { PluginManagement };

var IntlConfigHelper = function IntlConfigHelper() {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(DebugAndRunPlugin, null);
};
/* harmony default export */ __webpack_exports__["default"] = (IntlConfigHelper);

/***/ }),

/***/ "./src/webview/source/debug-run-extension/index.tsx":
/*!**********************************************************!*\
  !*** ./src/webview/source/debug-run-extension/index.tsx ***!
  \**********************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app */ "./src/webview/source/debug-run-extension/app.tsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_2__);




// eslint-disable-next-line react/no-deprecated
react_dom__WEBPACK_IMPORTED_MODULE_2___default.a.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_app__WEBPACK_IMPORTED_MODULE_0__["default"], null), document.getElementById('ice-container'));

/***/ }),

/***/ "./src/webview/source/hooks/useReceiveMessage.ts":
/*!*******************************************************!*\
  !*** ./src/webview/source/hooks/useReceiveMessage.ts ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

var useReceiveMessage = function useReceiveMessage(handlers, depend) {
  var handleMessageFromVscode = Object(react__WEBPACK_IMPORTED_MODULE_0__["useCallback"])(function (_ref) {
    var _ref$data = _ref.data,
      type = _ref$data.type,
      payload = _ref$data.payload;
    console.info("receive message from vscode: ", type, payload);
    var keys = Object.keys(handlers);
    var handlerKey = keys.find(function (k) {
      return k === type;
    });
    if (handlerKey) {
      handlers[handlerKey](payload);
    }
  }, depend);
  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {
    window.addEventListener("message", handleMessageFromVscode);
    return function () {
      return window.removeEventListener("message", handleMessageFromVscode);
    };
  }, [handleMessageFromVscode]);
};
/* harmony default export */ __webpack_exports__["default"] = (useReceiveMessage);

/***/ }),

/***/ "./src/webview/source/hooks/useSendMessage.ts":
/*!****************************************************!*\
  !*** ./src/webview/source/hooks/useSendMessage.ts ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

var useSendMessage = function useSendMessage() {
  var sendMessage = Object(react__WEBPACK_IMPORTED_MODULE_0__["useCallback"])(function (type, payload) {
    console.info("send message: ", type, payload);
    //@ts-ignore
    vscode.postMessage({
      type: type,
      payload: payload
    });
  }, []);
  return [sendMessage];
};
/* harmony default export */ __webpack_exports__["default"] = (useSendMessage);

/***/ })

/******/ });