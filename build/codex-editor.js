var CodexEditor =
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
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Codex Editor
	 *
	 * Short Description (눈_눈;)
	 * @version 2.0.0
	 *
	 * How to start?
	 * Example:
	 *           new CodexEditor({
	 *                holderId : 'codex-editor',
	 *                initialBlock : 'paragraph',
	 *                placeholder : 'Write your story....',
	 *                tools: {
	 *                    quote: Quote,
	 *                    anotherTool : AnotherTool
	 *                },
	 *                toolsConfig: {
	 *                     quote: {
	 *                        iconClassname : 'quote-icon',
	 *                        displayInToolbox : true,
	 *                        enableLineBreaks : true
	 *                     },
	 *                     anotherTool: {
	 *                        iconClassname : 'tool-icon'
	 *                     }
	 *                 }
	 *            });
	 *
	 * - tools is an object: {
	 *       pluginName: PluginClass,
	 *       .....
	 *   }
	 * - toolsConfig is an additional configuration that uses Codex Editor API
	 *      iconClassname - CSS classname of toolbox icon
	 *      displayInToolbox - if you want to see your Tool in toolbox hided in "plus" button, than set "True". By default : "False"
	 *      enableLineBreaks - by default enter creates new block that set as initialblock, but if you set this property "True", enter will break the lines in current block
	 *
	 * @author CodeX-Team <https://ifmo.su>
	 *
	 */
	
	/**
	 * @typedef {CodexEditor} CodexEditor - editor class
	 */
	
	/**
	 * @typedef {Object} EditorConfig
	 * @property {String} holderId - Element to append Editor
	 * ...
	 */
	
	'use strict';
	
	/**
	 * Require Editor modules places in components/modules dir
	 */
	// eslint-disable-next-line
	let modules = (["blockManager.js","caret.js","events.js","renderer.js","toolbar.js","tools.js","ui.js"]).map( module => __webpack_require__(1)("./" + module));
	
	/**
	 * @class
	 *
	 * @classdesc CodeX Editor base class
	 *
	 * @property this.config - all settings
	 * @property this.moduleInstances - constructed editor components
	 *
	 * @type {CodexEditor}
	 */
	module.exports = class CodexEditor {
	
	    /** Editor version */
	    static get version() {
	
	        return ("2.0.0");
	
	    }
	
	    /**
	     * @param {EditorConfig} config - user configuration
	     *
	     */
	    constructor(config) {
	
	        /**
	         * Configuration object
	         */
	        this.config = {};
	
	        /**
	         * Editor Components
	         */
	        this.moduleInstances = {};
	
	        Promise.resolve()
	            .then(() => {
	
	                this.configuration = config;
	
	            })
	            .then(() => this.init())
	            .then(() => this.start())
	            .then(() => {
	
	                console.log('CodeX Editor is ready');
	
	            })
	            .catch(error => {
	
	                console.log('CodeX Editor does not ready beecause of %o', error);
	
	            });
	
	    }
	
	    /**
	     * Setting for configuration
	     * @param {Object} config
	     */
	    set configuration(config = {}) {
	
	        this.config.holderId = config.holderId;
	        this.config.placeholder = config.placeholder || 'write your story...';
	        this.config.sanitizer = config.sanitizer || {
	            p: true,
	            b: true,
	            a: true
	        };
	
	        this.config.hideToolbar = config.hideToolbar ? config.hideToolbar : false;
	        this.config.tools = config.tools || {};
	        this.config.toolsConfig = config.toolsConfig || {};
	
	    }
	
	    /**
	     * Returns private property
	     * @returns {{}|*}
	     */
	    get configuration() {
	
	        return this.config;
	
	    }
	
	    /**
	     * Initializes modules:
	     *  - make and save instances
	     *  - configure
	     */
	    init() {
	
	        /**
	         * Make modules instances and save it to the @property this.moduleInstances
	         */
	        this.constructModules();
	
	        /**
	         * Modules configuration
	         */
	        this.configureModules();
	
	    }
	
	    /**
	     * Make modules instances and save it to the @property this.moduleInstances
	     */
	    constructModules() {
	
	        modules.forEach( Module => {
	
	            try {
	
	                /**
	                 * We use class name provided by displayName property
	                 *
	                 * On build, Babel will transform all Classes to the Functions so, name will always be 'Function'
	                 * To prevent this, we use 'babel-plugin-class-display-name' plugin
	                 * @see  https://www.npmjs.com/package/babel-plugin-class-display-name
	                 */
	
	                this.moduleInstances[Module.displayName] = new Module({
	                    config : this.configuration
	                });
	
	            } catch ( e ) {
	
	                console.log('Module %o skipped because %o', Module, e);
	
	            }
	
	        });
	
	    }
	
	    /**
	     * Modules instances configuration:
	     *  - pass other modules to the 'state' property
	     *  - ...
	     */
	    configureModules() {
	
	        for(let name in this.moduleInstances) {
	
	            /**
	             * Module does not need self-instance
	             */
	            this.moduleInstances[name].state = this.getModulesDiff( name );
	
	        }
	
	    }
	
	    /**
	     * Return modules without passed name
	     */
	    getModulesDiff( name ) {
	
	        let diff = {};
	
	        for(let moduleName in this.moduleInstances) {
	
	            /**
	             * Skip module with passed name
	             */
	            if (moduleName === name) {
	
	                continue;
	
	            }
	            diff[moduleName] = this.moduleInstances[moduleName];
	
	        }
	
	        return diff;
	
	    }
	
	    /**
	     * Start Editor!
	     *
	     * @return {Promise}
	     */
	    start() {
	
	        let prepareDecorator = module => module.prepare();
	
	        return Promise.resolve()
	            .then(prepareDecorator(this.moduleInstances.UI))
	            .then(prepareDecorator(this.moduleInstances.Tools))
	            .then(prepareDecorator(this.moduleInstances.BlockManager))
	
	            .catch(function (error) {
	
	                console.log('Error occured', error);
	
	            });
	
	    }
	
	};
	
	// module.exports = (function (editor) {
	//
	//     'use strict';
	//
	//     editor.version = VERSION;
	//     editor.scriptPrefix = 'cdx-script-';
	//
	//     var init = function () {
	//
	//         editor.core          = require('./modules/core');
	//         editor.tools         = require('./modules/tools');
	//         editor.ui            = require('./modules/ui');
	//         editor.transport     = require('./modules/transport');
	//         editor.renderer      = require('./modules/renderer');
	//         editor.saver         = require('./modules/saver');
	//         editor.content       = require('./modules/content');
	//         editor.toolbar       = require('./modules/toolbar/toolbar');
	//         editor.callback      = require('./modules/callbacks');
	//         editor.draw          = require('./modules/draw');
	//         editor.caret         = require('./modules/caret');
	//         editor.notifications = require('./modules/notifications');
	//         editor.parser        = require('./modules/parser');
	//         editor.sanitizer     = require('./modules/sanitizer');
	//         editor.listeners     = require('./modules/listeners');
	//         editor.destroyer     = require('./modules/destroyer');
	//         editor.paste         = require('./modules/paste');
	//
	//     };
	//
	//     /**
	//      * @public
	//      * holds initial settings
	//      */
	//     editor.settings = {
	//         tools     : ['paragraph', 'header', 'picture', 'list', 'quote', 'code', 'twitter', 'instagram', 'smile'],
	//         holderId  : 'codex-editor',
	//
	//         // Type of block showing on empty editor
	//         initialBlockPlugin: 'paragraph'
	//     };
	//
	//     /**
	//      * public
	//      *
	//      * Static nodes
	//      */
	//     editor.nodes = {
	//         holder            : null,
	//         wrapper           : null,
	//         toolbar           : null,
	//         inlineToolbar     : {
	//             wrapper : null,
	//             buttons : null,
	//             actions : null
	//         },
	//         toolbox           : null,
	//         notifications     : null,
	//         plusButton        : null,
	//         showSettingsButton: null,
	//         showTrashButton   : null,
	//         blockSettings     : null,
	//         pluginSettings    : null,
	//         defaultSettings   : null,
	//         toolbarButtons    : {}, // { type : DomEl, ... }
	//         redactor          : null
	//     };
	//
	//     /**
	//      * @public
	//      *
	//      * Output state
	//      */
	//     editor.state = {
	//         jsonOutput  : [],
	//         blocks      : [],
	//         inputs      : []
	//     };
	//
	//     /**
	//     * @public
	//     * Editor plugins
	//     */
	//     editor.tools = {};
	//
	//     editor.start = function (userSettings) {
	//
	//         init();
	//
	//         editor.core.prepare(userSettings)
	//
	//         // If all ok, make UI, bind events and parse initial-content
	//             .then(editor.ui.prepare)
	//             .then(editor.tools.prepare)
	//             .then(editor.sanitizer.prepare)
	//             .then(editor.paste.prepare)
	//             .then(editor.transport.prepare)
	//             .then(editor.renderer.makeBlocksFromData)
	//             .then(editor.ui.saveInputs)
	//             .catch(function (error) {
	//
	//                 editor.core.log('Initialization failed with error: %o', 'warn', error);
	//
	//             });
	//
	//     };
	//
	//     return editor;
	//
	// })({});


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	var map = {
		"./blockManager.js": 2,
		"./caret.js": 4,
		"./events.js": 5,
		"./renderer.js": 6,
		"./toolbar.js": 7,
		"./tools.js": 8,
		"./ui.js": 9
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 1;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(_) {/**
	 * @class BlockManager
	 * @classdesc Manage editor`s blocks storage and appearance
	 */
	
	import Block from '../block';
	
	class BlockManager {
	
	    /**
	     * @constructor
	     *
	     * @param {EditorConfig} config
	     */
	    constructor({ config }) {
	
	        this.config = config;
	        this.Editor = null;
	
	        /**
	         * Proxy for Blocks instance {@link Blocks}
	         *
	         * @type {Proxy}
	         * @private
	         */
	        this._blocks = null;
	
	        /**
	         * Index of current working block
	         *
	         * @type {number}
	         * @private
	         */
	        this.currentBlockIndex = -1;
	
	    }
	
	    /**
	     * Editor modules setting
	     *
	     * @param Editor
	     */
	    set state(Editor) {
	
	        this.Editor = Editor;
	
	    }
	
	    /**
	     * Should be called after Editor.UI preparation
	     * Define this._blocks property
	     *
	     * @returns {Promise}
	     */
	    prepare() {
	
	        return new Promise(resolve => {
	
	            let blocks = new Blocks(this.Editor.UI.nodes.redactor);
	
	            /**
	             * We need to use Proxy to overload set/get [] operator.
	             * So we can use array-like syntax to access blocks
	             *
	             * @example
	             * this._blocks[0] = new Block(...);
	             *
	             * block = this._blocks[0];
	             *
	             * @todo proxy the enumerate method
	             *
	             * @type {Proxy}
	             * @private
	             */
	            this._blocks = new Proxy(blocks, {
	                set: Blocks.set,
	                get: Blocks.get
	            });
	
	            resolve();
	
	        });
	
	    }
	
	    /**
	     * Insert new block into _blocks
	     *
	     * @param {String} toolName — plugin name
	     * @param {Object} data — plugin data
	     */
	    insert(toolName, data) {
	
	        let toolInstance = this.Editor.Tools.construct(toolName, data),
	            block = new Block(toolInstance);
	
	        this._blocks[++this.currentBlockIndex] = block;
	
	    }
	
	    /**
	     * Replace current working block
	     *
	     * @param {String} toolName — plugin name
	     * @param {Object} data — plugin data
	     */
	    replace(toolName, data) {
	
	        let toolInstance = this.Editor.Tools.construct(toolName, data),
	            block = new Block(toolInstance);
	
	        this._blocks.insert(this.currentBlockIndex, block, true);
	
	    }
	
	    /**
	     * Get Block instance by html element
	     *
	     * @todo get first level block before searching
	     *
	     * @param {HTMLElement} element
	     * @returns {Block}
	     */
	    getBlock(element) {
	
	        let nodes = this._blocks.nodes,
	            index = nodes.indexOf(element);
	
	        if (index >= 0) {
	
	            return this._blocks[index];
	
	        }
	
	    }
	
	    /**
	     * Get current Block instance
	     *
	     * @return {Block}
	     */
	    get currentBlock() {
	
	        return this._blocks[this.currentBlockIndex];
	
	    }
	
	    /**
	     * Get working html element
	     *
	     * @return {HTMLElement}
	     */
	    get currentNode() {
	
	        return this._blocks.nodes[this.currentBlockIndex];
	
	    }
	
	    /**
	     * Set currentBlockIndex to passed block
	     *
	     * @todo get first level block before searching
	     *
	     * @param {HTMLElement} element
	     */
	    set currentNode(element) {
	
	        let nodes = this._blocks.nodes;
	
	        this.currentBlockIndex = nodes.indexOf(element);
	
	    }
	
	    /**
	     * Get array of Block instances
	     *
	     * @returns {Block[]} {@link Blocks#array}
	     */
	    get blocks() {
	
	        return this._blocks.array;
	
	    }
	
	}
	
	/**
	 * @class Blocks
	 * @classdesc Class to work with Block instances array
	 *
	 * @private
	 *
	 * @property {HTMLElement} workingArea — editor`s working node
	 *
	 */
	class Blocks {
	
	    /**
	     * @constructor
	     *
	     * @param {HTMLElement} workingArea — editor`s working node
	     */
	    constructor(workingArea) {
	
	        this.blocks = [];
	        this.workingArea = workingArea;
	
	    }
	
	    /**
	     * Push back new Block
	     *
	     * @param {Block} block
	     */
	    push(block) {
	
	        this.blocks.push(block);
	        this.workingArea.appendChild(block.html);
	
	    }
	
	    /**
	     * Insert new Block at passed index
	     *
	     * @param {Number} index — index to insert Block
	     * @param {Block} block — Block to insert
	     * @param {Boolean} replace — it true, replace block on given index
	     */
	    insert(index, block, replace = false) {
	
	        if (!this.length) {
	
	            this.push(block);
	            return;
	
	        }
	
	        if (index > this.length) {
	
	            index = this.length;
	
	        }
	
	        if (replace) {
	
	            this.blocks[index].html.remove();
	
	        }
	
	        let deleteCount = replace ? 1 : 0;
	
	        this.blocks.splice(index, deleteCount, block);
	
	        if (index > 0) {
	
	            let previousBlock = this.blocks[index - 1];
	
	            previousBlock.html.insertAdjacentElement('afterend', block.html);
	
	        } else {
	
	            let nextBlock = this.blocks[index + 1];
	
	            if (nextBlock) {
	
	                nextBlock.html.insertAdjacentElement('beforebegin', block.html);
	
	            } else {
	
	                this.workingArea.appendChild(block.html);
	
	            }
	
	        }
	
	    }
	
	    /**
	     * Insert Block after passed target
	     *
	     * @todo decide if this method is necessary
	     *
	     * @param {Block} targetBlock — target after wich Block should be inserted
	     * @param {Block} newBlock — Block to insert
	     */
	    insertAfter(targetBlock, newBlock) {
	
	        let index = this.blocks.indexOf(targetBlock);
	
	        this.insert(index + 1, newBlock);
	
	    }
	
	    /**
	     * Get Block by index
	     *
	     * @param {Number} index — Block index
	     * @returns {Block}
	     */
	    get(index) {
	
	        return this.blocks[index];
	
	    }
	
	    /**
	     * Return index of passed Block
	     *
	     * @param {Block} block
	     * @returns {Number}
	     */
	    indexOf(block) {
	
	        return this.blocks.indexOf(block);
	
	    }
	
	    /**
	     * Get length of Block instances array
	     *
	     * @returns {Number}
	     */
	    get length() {
	
	        return this.blocks.length;
	
	    }
	
	    /**
	     * Get Block instances array
	     *
	     * @returns {Block[]}
	     */
	    get array() {
	
	        return this.blocks;
	
	    }
	
	    /**
	     * Get blocks html elements array
	     *
	     * @returns {HTMLElement[]}
	     */
	    get nodes() {
	
	        return _.array(this.workingArea.children);
	
	    }
	
	    /**
	     * Proxy trap to implement array-like setter
	     *
	     * @example
	     * blocks[0] = new Block(...)
	     *
	     * @param {Blocks} instance — Blocks instance
	     * @param {Number|String} index — block index
	     * @param {Block} block — Block to set
	     * @returns {Boolean}
	     */
	    static set(instance, index, block) {
	
	        if (isNaN(Number(index))) {
	
	            return false;
	
	        }
	
	        instance.insert(index, block);
	
	        return true;
	
	    }
	
	    /**
	     * Proxy trap to implement array-like getter
	     *
	     * @param {Blocks} instance — Blocks instance
	     * @param {Number|String} index — Block index
	     * @returns {Block|*}
	     */
	    static get(instance, index) {
	
	        if (isNaN(Number(index))) {
	
	            return instance[index];
	
	        }
	
	        return instance.get(index);
	
	    }
	
	}
	
	module.exports = BlockManager;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	/**
	 * Codex Editor Util
	 */
	export default class Util {
	
	    /**
	     * @typedef {Object} ChainData
	     * @property {Object} data - data that will be passed to the success or fallback
	     * @property {Function} function - function's that must be called asynchronically
	     */
	
	    /**
	     * Fires a promise sequence asyncronically
	     *
	     * @param {Object[]} chains - list or ChainData's
	     * @param {Function} success - success callback
	     * @param {Function} fallback - callback that fires in case of errors
	     *
	     * @return {Promise}
	     */
	    static sequence(chains, success = () => {}, fallback = () => {}) {
	
	        return new Promise(function (resolve) {
	
	            /**
	             * pluck each element from queue
	             * First, send resolved Promise as previous value
	             * Each plugins "prepare" method returns a Promise, that's why
	             * reduce current element will not be able to continue while can't get
	             * a resolved Promise
	             */
	            chains.reduce(function (previousValue, currentValue, iteration) {
	
	                return previousValue
	                    .then(() => waitNextBlock(currentValue, success, fallback))
	                    .then(() => {
	
	                        // finished
	                        if (iteration === chains.length - 1) {
	
	                            resolve();
	
	                        }
	
	                    });
	
	            }, Promise.resolve());
	
	        });
	
	        /**
	         * Decorator
	         *
	         * @param {ChainData} chainData
	         *
	         * @param {Function} successCallback
	         * @param {Function} fallbackCallback
	         *
	         * @return {Promise}
	         */
	        function waitNextBlock(chainData, successCallback, fallbackCallback) {
	
	            return new Promise(function (resolve) {
	
	                chainData.function()
	                    .then(() => {
	
	                        successCallback(chainData.data);
	
	                    })
	                    .then(resolve)
	                    .catch(function () {
	
	                        fallbackCallback(chainData.data);
	
	                        // anyway, go ahead even it falls
	                        resolve();
	
	                    });
	
	            });
	
	        }
	
	    }
	
	    /**
	     * Make array from array-like collection
	     *
	     * @param {*} collection
	     *
	     * @return {Array}
	     */
	    static array(collection) {
	
	        return Array.prototype.slice.call(collection);
	
	    }
	
	};

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	/**
	 * Codex Editor Caret Module
	 *
	 * @author CodeX-Team <https://ifmo.su>
	 * @version 2.0.0
	 */
	
	/**
	 * @class
	 * @classdesc Can move or change caret position
	 *
	 * @property {Number} inputIndex - index of input where currently is caret
	 * @property {Number} offset - caret offset
	 */
	export default class Caret extends Module {
	
	    /**
	     * @constructor
	     */
	    constructor(config) {
	
	        super(config);
	
	        this.inputIndex = null;
	        this.offset = null;
	        this.focusedNodeIndex = null;
	
	    }
	
	    position() {
	
	        let atStart = function () {
	
	            let selection       = window.getSelection(),
	                anchorOffset    = selection.anchorOffset,
	                anchorNode      = selection.anchorNode,
	                firstLevelBlock = editor.content.getFirstLevelBlock(anchorNode),
	                pluginsRender   = firstLevelBlock.childNodes[0];
	
	            if (!editor.core.isDomNode(anchorNode)) {
	
	                anchorNode = anchorNode.parentNode;
	
	            }
	
	            let isFirstNode  = anchorNode === pluginsRender.childNodes[0],
	                isOffsetZero = anchorOffset === 0;
	
	            return isFirstNode && isOffsetZero;
	
	        };
	
	        let atTheEnd = function () {
	
	            let selection    = window.getSelection(),
	                anchorOffset = selection.anchorOffset,
	                anchorNode   = selection.anchorNode;
	
	            /** Caret is at the end of input */
	            return !anchorNode || !anchorNode.length || anchorOffset === anchorNode.length;
	
	        };
	
	        return {
	            atStart,
	            atTheEnd
	        }
	    };
	
	    /**
	     * Creates Document Range and sets caret to the element.
	     *
	     * @param {Node} element - Changed Node.
	     * @param {Number} index - index of child in Element
	     * @param {Number} offset - caret offset relatively Element
	     */
	    set(element, index, offset) {
	
	        offset = offset || this.offset || 0;
	        index  = index  || this.focusedNodeIndex || 0;
	
	        var childs = element.childNodes,
	            nodeToSet;
	
	        if ( childs.length === 0 ) {
	
	            nodeToSet = element;
	
	        } else {
	
	            nodeToSet = childs[index];
	
	        }
	
	        /** If Element is INPUT */
	        if (element.contentEditable != 'true') {
	
	            element.focus();
	            return;
	
	        }
	
	        if (editor.core.isDomNode(nodeToSet)) {
	
	            nodeToSet = editor.content.getDeepestTextNodeFromPosition(nodeToSet, nodeToSet.childNodes.length);
	
	        }
	
	        let range     = document.createRange(),
	            selection = window.getSelection();
	
	        window.setTimeout(function () {
	
	            range.setStart(nodeToSet, offset);
	            range.setEnd(nodeToSet, offset);
	
	            selection.removeAllRanges();
	            selection.addRange(range);
	
	            editor.caret.saveCurrentInputIndex();
	
	        }, 20);
	
	    }
	
	    /**
	     * @todo add description
	     */
	    saveCurrentInputIndex() {
	
	        /** Index of Input that we paste sanitized content */
	        var selection   = window.getSelection(),
	            inputs      = editor.state.inputs,
	            focusedNode = selection.anchorNode,
	            focusedNodeHolder;
	
	        if (!focusedNode) {
	
	            return;
	
	        }
	
	        /** Looking for parent contentEditable block */
	        while (focusedNode.contentEditable != 'true') {
	
	            focusedNodeHolder = focusedNode.parentNode;
	            focusedNode       = focusedNodeHolder;
	
	        }
	
	        /** Input index in DOM level */
	        var editableElementIndex = 0;
	
	        while (focusedNode != inputs[editableElementIndex]) {
	
	            editableElementIndex ++;
	
	        }
	
	        caret.inputIndex = editableElementIndex;
	
	    }
	
	    /**
	     * Returns current input index (caret object)
	     * @returns {Number}
	     */
	    getInputIndex() {
	
	        return this.inputIndex;
	
	    }
	
	    /**
	     *
	     * @param index
	     */
	    setToNextBlock(index) {
	
	        var inputs = editor.state.inputs,
	            nextInput = inputs[index + 1];
	
	        if (!nextInput) {
	
	            editor.core.log('We are reached the end');
	            return;
	
	        }
	
	        /**
	         * When new Block created or deleted content of input
	         * We should add some text node to set caret
	         */
	        if (!nextInput.childNodes.length) {
	
	            var emptyTextElement = document.createTextNode('');
	
	            nextInput.appendChild(emptyTextElement);
	
	        }
	
	        editor.caret.inputIndex = index + 1;
	        editor.caret.set(nextInput, 0, 0);
	        editor.content.workingNodeChanged(nextInput);
	
	    }
	
	    /**
	     * @param {int} index - index of input
	     */
	    setToPreviousBlock(index) {
	
	        index = index || 0;
	
	        var inputs = editor.state.inputs,
	            previousInput = inputs[index - 1],
	            lastChildNode,
	            lengthOfLastChildNode,
	            emptyTextElement;
	
	
	        if (!previousInput) {
	
	            editor.core.log('We are reached first node');
	            return;
	
	        }
	
	        lastChildNode = editor.content.getDeepestTextNodeFromPosition(previousInput, previousInput.childNodes.length);
	        lengthOfLastChildNode = lastChildNode.length;
	
	        /**
	         * When new Block created or deleted content of input
	         * We should add some text node to set caret
	         */
	        if (!previousInput.childNodes.length) {
	
	            emptyTextElement = document.createTextNode('');
	            previousInput.appendChild(emptyTextElement);
	
	        }
	        editor.caret.inputIndex = index - 1;
	        editor.caret.set(previousInput, previousInput.childNodes.length - 1, lengthOfLastChildNode);
	        editor.content.workingNodeChanged(inputs[index - 1]);
	
	    }
	
	    /**
	     * Inserts node at the caret location
	     * @param {HTMLElement|DocumentFragment} node
	     */
	    insertNode (node) {
	
	        var selection, range,
	            lastNode = node;
	
	        if (node.nodeType == editor.core.nodeTypes.DOCUMENT_FRAGMENT) {
	
	            lastNode = node.lastChild;
	
	        }
	
	        selection = window.getSelection();
	
	        range = selection.getRangeAt(0);
	        range.deleteContents();
	
	        range.insertNode(node);
	
	        range.setStartAfter(lastNode);
	        range.collapse(true);
	
	        selection.removeAllRanges();
	        selection.addRange(range);
	
	
	    }
	
	}
	
	module.exports = Caret;
	
	// module.exports = (function (caret) {//
	//     /**
	//      * @param {int} index - index of first-level block after that we set caret into next input
	//      */
	//     caret.setToNextBlock = function (index) {
	//
	//         var inputs = editor.state.inputs,
	//             nextInput = inputs[index + 1];
	//
	//         if (!nextInput) {
	//
	//             editor.core.log('We are reached the end');
	//             return;
	//
	//         }
	//
	//         /**
	//          * When new Block created or deleted content of input
	//          * We should add some text node to set caret
	//          */
	//         if (!nextInput.childNodes.length) {
	//
	//             var emptyTextElement = document.createTextNode('');
	//
	//             nextInput.appendChild(emptyTextElement);
	//
	//         }
	//
	//         editor.caret.inputIndex = index + 1;
	//         editor.caret.set(nextInput, 0, 0);
	//         editor.content.workingNodeChanged(nextInput);
	//
	//     };
	//
	//     /**
	//      * @param {int} index - index of target input.
	//      * Sets caret to input with this index
	//      */
	//     caret.setToBlock = function (index) {
	//
	//         var inputs = editor.state.inputs,
	//             targetInput = inputs[index];
	//
	//         if ( !targetInput ) {
	//
	//             return;
	//
	//         }
	//
	//         /**
	//          * When new Block created or deleted content of input
	//          * We should add some text node to set caret
	//          */
	//         if (!targetInput.childNodes.length) {
	//
	//             var emptyTextElement = document.createTextNode('');
	//
	//             targetInput.appendChild(emptyTextElement);
	//
	//         }
	//
	//         editor.caret.inputIndex = index;
	//         editor.caret.set(targetInput, 0, 0);
	//         editor.content.workingNodeChanged(targetInput);
	//
	//     };
	//
	//
	//
	//
	
	//
	//     return caret;
	//
	// })({});

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	/**
	 * @module eventDispatcher
	 *
	 * Has two important methods:
	 *    - {Function} on - appends subscriber to the event. If event doesn't exist - creates new one
	 *    - {Function} emit - fires all subscribers with data
	 *
	 * @version 1.0.0
	 *
	 * @typedef {Events} Events
	 * @property {Object} subscribers - all subscribers grouped by event name
	 */
	export default class Events extends Module {
	
	    /**
	     * @constructor
	     */
	    constructor() {
	
	        super();
	
	        this.subscribers = {};
	
	    }
	
	    /**
	     * @param {String} eventName - event name
	     * @param {Function} callback - subscriber
	     */
	    on(eventName, callback) {
	
	        if (!(eventName in this.subscribers)) {
	
	            this.subscribers[eventName] = [];
	
	        }
	
	        // group by events
	        this.subscribers[eventName].push(callback);
	
	    }
	
	    /**
	     * @param {String} eventName - event name
	     * @param {Object} data - subscribers get this data when they were fired
	     */
	    emit(eventName, data) {
	
	        this.subscribers[eventName].reduce(function (previousData, currentHandler) {
	
	            let newData = currentHandler(previousData);
	
	            return newData ? newData : previousData;
	
	        }, data);
	
	    }
	
	    /**
	     * Destroyer
	     */
	    destroy() {
	
	        this.Editor = null;
	        this.subscribers = null;
	
	    }
	
	}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(_) {/**
	 * Codex Editor Renderer Module
	 *
	 * @author Codex Team
	 * @version 2.0.0
	 */
	
	class Renderer {
	
	    /**
	     * @constructor
	     *
	     * @param {EditorConfig} config
	     */
	    constructor(config) {
	
	        this.config = config;
	        this.Editor = null;
	
	    }
	
	    /**
	     * Editor modules setter
	     *
	     * @param {Object} Editor
	     */
	    set state(Editor) {
	
	        this.Editor = Editor;
	
	    }
	
	    /**
	     *
	     * Make plugin blocks from array of plugin`s data
	     *
	     * @param {Object[]} items
	     */
	    render(items) {
	
	        let chainData = [];
	
	        for (let i = 0; i < items.length; i++) {
	
	            chainData.push({
	                function: () => this.insertBlock(items[i])
	            });
	
	        }
	
	        _.sequence(chainData);
	
	    }
	
	    /**
	     * Get plugin instance
	     * Add plugin instance to BlockManager
	     * Insert block to working zone
	     *
	     * @param {Object} item
	     * @returns {Promise.<T>}
	     * @private
	     */
	    insertBlock(item) {
	
	        let tool = item.type,
	            data = item.data;
	
	        this.Editor.BlockManager.insert(tool, data);
	
	        return Promise.resolve();
	
	    }
	
	}
	
	module.exports = Renderer;
	
	// module.exports = (function (renderer) {
	//
	//     let editor = codex.editor;
	//
	//     /**
	//      * Asyncronously parses input JSON to redactor blocks
	//      */
	//     renderer.makeBlocksFromData = function () {
	//
	//         /**
	//          * If redactor is empty, add first paragraph to start writing
	//          */
	//         if (editor.core.isEmpty(editor.state.blocks) || !editor.state.blocks.items.length) {
	//
	//             editor.ui.addInitialBlock();
	//             return;
	//
	//         }
	//
	//         Promise.resolve()
	//
	//         /** First, get JSON from state */
	//             .then(function () {
	//
	//                 return editor.state.blocks;
	//
	//             })
	//
	//             /** Then, start to iterate they */
	//             .then(editor.renderer.appendBlocks)
	//
	//             /** Write log if something goes wrong */
	//             .catch(function (error) {
	//
	//                 editor.core.log('Error while parsing JSON: %o', 'error', error);
	//
	//             });
	//
	//     };
	//
	//     /**
	//      * Parses JSON to blocks
	//      * @param {object} data
	//      * @return Promise -> nodeList
	//      */
	//     renderer.appendBlocks = function (data) {
	//
	//         var blocks = data.items;
	//
	//         /**
	//          * Sequence of one-by-one blocks appending
	//          * Uses to save blocks order after async-handler
	//          */
	//         var nodeSequence = Promise.resolve();
	//
	//         for (var index = 0; index < blocks.length ; index++ ) {
	//
	//             /** Add node to sequence at specified index */
	//             editor.renderer.appendNodeAtIndex(nodeSequence, blocks, index);
	//
	//         }
	//
	//     };
	//
	//     /**
	//      * Append node at specified index
	//      */
	//     renderer.appendNodeAtIndex = function (nodeSequence, blocks, index) {
	//
	//         /** We need to append node to sequence */
	//         nodeSequence
	//
	//         /** first, get node async-aware */
	//             .then(function () {
	//
	//                 return editor.renderer.getNodeAsync(blocks, index);
	//
	//             })
	//
	//             /**
	//              * second, compose editor-block from JSON object
	//              */
	//             .then(editor.renderer.createBlockFromData)
	//
	//             /**
	//              * now insert block to redactor
	//              */
	//             .then(function (blockData) {
	//
	//                 /**
	//                  * blockData has 'block', 'type' and 'stretched' information
	//                  */
	//                 editor.content.insertBlock(blockData);
	//
	//                 /** Pass created block to next step */
	//                 return blockData.block;
	//
	//             })
	//
	//             /** Log if something wrong with node */
	//             .catch(function (error) {
	//
	//                 editor.core.log('Node skipped while parsing because %o', 'error', error);
	//
	//             });
	//
	//     };
	//
	//     /**
	//      * Asynchronously returns block data from blocksList by index
	//      * @return Promise to node
	//      */
	//     renderer.getNodeAsync = function (blocksList, index) {
	//
	//         return Promise.resolve().then(function () {
	//
	//             return {
	//                 tool : blocksList[index],
	//                 position : index
	//             };
	//
	//         });
	//
	//     };
	//
	//     /**
	//      * Creates editor block by JSON-data
	//      *
	//      * @uses render method of each plugin
	//      *
	//      * @param {Object} toolData.tool
	//      *                              { header : {
	//      *                                                text: '',
	//      *                                                type: 'H3', ...
	//      *                                            }
	//      *                               }
	//      * @param {Number} toolData.position - index in input-blocks array
	//      * @return {Object} with type and Element
	//      */
	//     renderer.createBlockFromData = function ( toolData ) {
	//
	//         /** New parser */
	//         var block,
	//             tool = toolData.tool,
	//             pluginName = tool.type;
	//
	//         /** Get first key of object that stores plugin name */
	//         // for (var pluginName in blockData) break;
	//
	//         /** Check for plugin existance */
	//         if (!editor.tools[pluginName]) {
	//
	//             throw Error(`Plugin «${pluginName}» not found`);
	//
	//         }
	//
	//         /** Check for plugin having render method */
	//         if (typeof editor.tools[pluginName].render != 'function') {
	//
	//             throw Error(`Plugin «${pluginName}» must have «render» method`);
	//
	//         }
	//
	//         if ( editor.tools[pluginName].available === false ) {
	//
	//             block = editor.draw.unavailableBlock();
	//
	//             block.innerHTML = editor.tools[pluginName].loadingMessage;
	//
	//             /**
	//             * Saver will extract data from initial block data by position in array
	//             */
	//             block.dataset.inputPosition = toolData.position;
	//
	//         } else {
	//
	//             /** New Parser */
	//             block = editor.tools[pluginName].render(tool.data);
	//
	//         }
	//
	//         /** is first-level block stretched */
	//         var stretched = editor.tools[pluginName].isStretched || false;
	//
	//         /** Retrun type and block */
	//         return {
	//             type      : pluginName,
	//             block     : block,
	//             stretched : stretched
	//         };
	//
	//     };
	//
	//     return renderer;
	//
	// })({});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	/**
	 *
	 * «Toolbar» is the node that moves up/down over current block
	 *
	 *  ______________________________________ Toolbar ____________________________________________
	 * |                                                                                           |
	 * |  ..................... Content ....................   ......... Block Actions ..........  |
	 * |  .                                                .   .                                .  |
	 * |  .                                                .   . [Open Settings] [Remove Block] .  |
	 * |  .  [Plus Button]  [Toolbox: {Tool1}, {Tool2}]    .   .                                .  |
	 * |  .                                                .   .        [Settings Panel]        .  |
	 * |  ..................................................   ..................................  |
	 * |                                                                                           |
	 * |___________________________________________________________________________________________|
	 *
	 *
	 * Toolbox — its an Element contains tools buttons. Can be shown by Plus Button.
	 *
	 *  _______________ Toolbox _______________
	 * |                                       |
	 * | [Header] [Image] [List] [Quote] ...   |
	 * |_______________________________________|
	 *
	 *
	 * Settings Panel — is an Element with block settings:
	 *
	 *   ____ Settings Panel ____
	 *  | ...................... |
	 *  | .   Tool Settings    . |
	 *  | ...................... |
	 *  | .  Default Settings  . |
	 *  | ...................... |
	 *  |________________________|
	 *
	 *
	 * @class
	 * @classdesc Toolbar module
	 *
	 * @typedef {Toolbar} Toolbar
	 * @property {Object} nodes
	 * @property {Element} nodes.wrapper        - Toolbar main element
	 * @property {Element} nodes.content        - Zone with Plus button and toolbox.
	 * @property {Element} nodes.actions        - Zone with Block Settings and Remove Button
	 * @property {Element} nodes.plusButton     - Button that opens or closes Toolbox
	 * @property {Element} nodes.toolbox        - Container for tools
	 * @property {Element} nodes.settingsToggler - open/close Settings Panel button
	 * @property {Element} nodes.removeBlockButton - Remove Block button
	 * @property {Element} nodes.settings          - Settings Panel
	 * @property {Element} nodes.pluginSettings    - Plugin Settings section of Settings Panel
	 * @property {Element} nodes.defaultSettings   - Default Settings section of Settings Panel
	 */
	export default class Toolbar extends Module {
	
	    /**
	     * @constructor
	     */
	    constructor(config) {
	
	        super(config);
	
	        this.nodes = {
	            wrapper : null,
	            content : null,
	            actions : null,
	
	            // Content Zone
	            plusButton : null,
	            toolbox : null,
	
	            // Actions Zone
	            settingsToggler : null,
	            removeBlockButton: null,
	            settings: null,
	
	            // Settings Zone: Plugin Settings and Default Settings
	            pluginSettings: null,
	            defaultSettings: null,
	        };
	
	        this.CSS = {
	            toolbar: 'ce-toolbar',
	            content: 'ce-toolbar__content',
	            actions: 'ce-toolbar__actions',
	
	            // Content Zone
	            toolbox: 'ce-toolbar__toolbox',
	            plusButton: 'ce-toolbar__plus',
	
	            // Actions Zone
	            settingsToggler: 'ce-toolbar__settings-btn',
	            removeBlockButton: 'ce-toolbar__remove-btn',
	
	            // Settings Panel
	            settings: 'ce-settings',
	            defaultSettings: 'ce-settings_default',
	            pluginSettings: 'ce-settings_plugin',
	        };
	
	    }
	
	    /**
	     * Makes toolbar
	     */
	    make() {
	
	        this.nodes.wrapper = $.make('div', this.CSS.toolbar);
	
	        /**
	         * Make Content Zone and Actions Zone
	         */
	        ['content',  'actions'].forEach( el => {
	
	            this.nodes[el] = $.make('div', this.CSS[el]);
	            $.append(this.nodes.wrapper, this.nodes[el]);
	
	        });
	
	
	        /**
	         * Fill Content Zone:
	         *  - Plus Button
	         *  - Toolbox
	         */
	        ['plusButton', 'toolbox'].forEach( el => {
	
	            this.nodes[el] = $.make('div', this.CSS[el]);
	            $.append(this.nodes.content, this.nodes[el]);
	
	        });
	
	        /**
	         * Fill Actions Zone:
	         *  - Settings Toggler
	         *  - Remove Block Button
	         *  - Settings Panel
	         */
	        this.nodes.settingsToggler  = $.make('span', this.CSS.settingsToggler);
	        this.nodes.removeBlockButton = this.makeRemoveBlockButton();
	
	        $.append(this.nodes.actions, [this.nodes.settingsToggler, this.nodes.removeBlockButton]);
	
	        /**
	         * Make and append Settings Panel
	         */
	        this.makeBlockSettingsPanel();
	
	        /**
	         * Append toolbar to the Editor
	         */
	        $.append(this.Editor.UI.nodes.wrapper, this.nodes.wrapper);
	
	    }
	
	    /**
	     * Panel with block settings with 2 sections:
	     *
	     * @return {Element}
	     */
	    makeBlockSettingsPanel() {
	
	        this.nodes.settings = $.make('div', this.CSS.settings);
	
	        this.nodes.pluginSettings = $.make('div', this.CSS.pluginSettings);
	        this.nodes.defaultSettings = $.make('div', this.CSS.defaultSettings);
	
	        $.append(this.nodes.settings, [this.nodes.pluginSettings, this.nodes.defaultSettings]);
	        $.append(this.nodes.actions, this.nodes.settings);
	
	    }
	
	    /**
	     * Makes Remove Block button, and confirmation panel
	     * @return {Element} wrapper with button and panel
	     */
	    makeRemoveBlockButton() {
	
	        /**
	         * @todo  add confirmation panel and handlers
	         * @see  {@link settings#makeRemoveBlockButton}
	         */
	        return $.make('span', this.CSS.removeBlockButton);
	
	    }
	
	}

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	/**
	 * @module Codex Editor Tools Submodule
	 *
	 * Creates Instances from Plugins and binds external config to the instances
	 */
	
	/**
	 * Load user defined tools
	 * Tools must contain the following important objects:
	 *
	 * @typedef {Object} ToolsConfig
	 * @property {String} iconClassname - this a icon in toolbar
	 * @property {Boolean} displayInToolbox - will be displayed in toolbox. Default value is TRUE
	 * @property {Boolean} enableLineBreaks - inserts new block or break lines. Default value is FALSE
	 */
	
	/**
	 * @todo update according to current API
	 *
	 * @typedef {Object} Tool
	 * @property render
	 * @property save
	 * @property settings
	 * @property validate
	 */
	
	/**
	 * Class properties:
	 *
	 * @typedef {Tool} Tool
	 * @property {String} name - name of this module
	 * @property {Object[]} toolInstances - list of tool instances
	 * @property {Tools[]} available - available Tools
	 * @property {Tools[]} unavailable - unavailable Tools
	 * @property {Object} toolsClasses - all classes
	 * @property {EditorConfig} config - Editor config
	 */
	
	export default class Tools extends Module {
	
	    /**
	     * Returns available Tools
	     * @return {Tool[]}
	     */
	    get available() {
	
	        return this.toolsAvailable;
	
	    }
	
	    /**
	     * Returns unavailable Tools
	     * @return {Tool[]}
	     */
	    get unavailable() {
	
	        return this.toolsUnavailable;
	
	    }
	
	    /**
	     * If config wasn't passed by user
	     * @return {ToolsConfig}
	     */
	    get defaultConfig() {
	
	        return {
	            iconClassName : 'default-icon',
	            displayInToolbox : false,
	            enableLineBreaks : false
	        };
	
	    }
	
	    /**
	     * @constructor
	     *
	     * @param {ToolsConfig} config
	     */
	    constructor({ config }) {
	
	        super(config);
	
	        this.toolClasses = {};
	        this.toolsAvailable = {};
	        this.toolsUnavailable = {};
	
	    }
	
	    /**
	     * Creates instances via passed or default configuration
	     * @return {boolean}
	     */
	    prepare() {
	
	        if (!this.config.hasOwnProperty('tools')) {
	
	            return Promise.reject("Can't start without tools");
	
	        }
	
	        for(let toolName in this.config.tools) {
	
	            this.toolClasses[toolName] = this.config.tools[toolName];
	
	        }
	
	        /**
	         * getting classes that has prepare method
	         */
	        let sequenceData = this.getListOfPrepareFunctions();
	
	        /**
	         * if sequence data contains nothing then resolve current chain and run other module prepare
	         */
	        if (sequenceData.length === 0) {
	
	            return Promise.resolve();
	
	        }
	
	        /**
	         * to see how it works {@link Util#sequence}
	         */
	        return _.sequence(sequenceData, (data) => {
	
	            this.success(data);
	
	        }, (data) => {
	
	            this.fallback(data);
	
	        });
	
	    }
	
	    /**
	     * Binds prepare function of plugins with user or default config
	     * @return {Array} list of functions that needs to be fired sequently
	     */
	    getListOfPrepareFunctions() {
	
	        let toolPreparationList = [];
	
	        for(let toolName in this.toolClasses) {
	
	            let toolClass = this.toolClasses[toolName];
	
	            if (typeof toolClass.prepare === 'function') {
	
	                toolPreparationList.push({
	                    function : toolClass.prepare,
	                    data : {
	                        toolName
	                    }
	                });
	
	            }
	
	        }
	
	        return toolPreparationList;
	
	    }
	
	    /**
	     * @param {ChainData.data} data - append tool to available list
	     */
	    success(data) {
	
	        this.toolsAvailable[data.toolName] = this.toolClasses[data.toolName];
	
	    }
	
	    /**
	     * @param {ChainData.data} data - append tool to unavailable list
	     */
	    fallback(data) {
	
	        this.toolsUnavailable[data.toolName] = this.toolClasses[data.toolName];
	
	    }
	
	    /**
	     * Returns all tools
	     * @return {Array}
	     */
	    getTools() {
	
	        return this.toolInstances;
	
	    }
	
	    /**
	     * Return tool`a instance
	     *
	     * @param {String} tool — tool name
	     * @param {Object} data — initial data
	     *
	     * @todo throw exceptions if tool doesnt exist
	     *
	     */
	    construct(tool, data) {
	
	        let plugin = this.toolClasses[tool],
	            config = this.config.toolsConfig[tool];
	
	        let instance = new plugin(data, config);
	
	        return instance;
	
	    }
	
	}

/***/ }),
/* 9 */
/***/ (function(module, exports) {

	/**
	 * Module UI
	 *
	 * @type {UI}
	 */
	// let className = {
	
	/**
	     * @const {string} BLOCK_CLASSNAME - redactor blocks name
	     */
	// BLOCK_CLASSNAME : 'ce-block',
	
	/**
	     * @const {String} wrapper for plugins content
	     */
	// BLOCK_CONTENT : 'ce-block__content',
	
	/**
	     * @const {String} BLOCK_STRETCHED - makes block stretched
	     */
	// BLOCK_STRETCHED : 'ce-block--stretched',
	
	/**
	     * @const {String} BLOCK_HIGHLIGHTED - adds background
	     */
	// BLOCK_HIGHLIGHTED : 'ce-block--focused',
	
	/**
	     * @const {String} - for all default settings
	     */
	// SETTINGS_ITEM : 'ce-settings__item'
	// };
	
	let CSS = {
	    editorWrapper : 'codex-editor',
	    editorZone    : 'ce-redactor'
	};
	
	/**
	 * @class
	 *
	 * @classdesc Makes CodeX Editor UI:
	 *                <codex-editor>
	 *                    <ce-redactor />
	 *                    <ce-toolbar />
	 *                    <ce-inline-toolbar />
	 *                </codex-editor>
	 *
	 * @typedef {UI} UI
	 * @property {EditorConfig} config   - editor configuration {@link CodexEditor#configuration}
	 * @property {Object} Editor         - available editor modules {@link CodexEditor#moduleInstances}
	 * @property {Object} nodes          -
	 * @property {Element} nodes.wrapper  - element where we need to append redactor
	 * @property {Element} nodes.wrapper  - <codex-editor>
	 * @property {Element} nodes.redactor - <ce-redactor>
	 */
	
	export default class UI extends Module {
	
	    /**
	     * @constructor
	     *
	     * @param  {EditorConfig} config
	     */
	    constructor({ config }) {
	
	        super(config);
	
	        this.nodes = {
	            holder: null,
	            wrapper: null,
	            redactor: null
	        };
	
	    }
	
	    /**
	     * @protected
	     *
	     * Making main interface
	     */
	    prepare() {
	
	        return new Promise( (resolve, reject) => {
	
	            /**
	             * Element where we need to append CodeX Editor
	             * @type {Element}
	             */
	            this.nodes.holder = document.getElementById(this.config.holderId);
	
	            if (!this.nodes.holder) {
	
	                reject(Error("Holder wasn't found by ID: #" + this.config.holderId));
	                return;
	
	            }
	
	            /**
	             * Create and save main UI elements
	             */
	            this.nodes.wrapper  = $.make('div', CSS.editorWrapper);
	            this.nodes.redactor = $.make('div', CSS.editorZone);
	
	            this.nodes.wrapper.appendChild(this.nodes.redactor);
	            this.nodes.holder.appendChild(this.nodes.wrapper);
	
	            /**
	             * Make toolbar
	             */
	            this.Editor.Toolbar.make();
	
	            /**
	             * Load and append CSS
	             */
	            this.loadStyles();
	
	            resolve();
	
	        })
	
	        /** Add toolbox tools */
	        // .then(addTools_)
	
	        /** Make container for inline toolbar */
	        // .then(makeInlineToolbar_)
	
	        /** Add inline toolbar tools */
	        // .then(addInlineToolbarTools_)
	
	        /** Draw wrapper for notifications */
	        // .then(makeNotificationHolder_)
	
	        /** Add eventlisteners to redactor elements */
	        // .then(bindEvents_)
	
	            .catch(e => {
	
	                console.error(e);
	
	            // editor.core.log("Can't draw editor interface");
	
	            });
	
	    }
	
	    loadStyles() {
	
	        /**
	         * Load CSS
	         */
	        let styles = require('../../styles/main.css');
	
	        /**
	         * Make tag
	         */
	        let tag = $.make('style', null, {
	            textContent: styles.toString()
	        });
	
	        /**
	         * Append styles
	         */
	        $.append(document.head, tag);
	
	    }
	
	}
	
	// /**
	//  * Codex Editor UI module
	//  *
	//  * @author Codex Team
	//  * @version 1.2.0
	//  */
	//
	// module.exports = (function (ui) {
	//
	//     let editor = codex.editor;
	//
	//     /**
	//      * Basic editor classnames
	//      */
	//     ui.prepare = function () {
	//
	
	//
	//     };
	//
	//     /** Draw notifications holder */
	//     var makeNotificationHolder_ = function () {
	//
	//         /** Append block with notifications to the document */
	//         editor.nodes.notifications = editor.notifications.createHolder();
	//
	//     };
	//
	//     /**
	//      * @private
	//      * Append tools passed in editor.tools
	//      */
	//     var addTools_ = function () {
	//
	//         var tool,
	//             toolName,
	//             toolButton;
	//
	//         for ( toolName in editor.settings.tools ) {
	//
	//             tool = editor.settings.tools[toolName];
	//
	//             editor.tools[toolName] = tool;
	//
	//             if (!tool.iconClassname && tool.displayInToolbox) {
	//
	//                 editor.core.log('Toolbar icon classname missed. Tool %o skipped', 'warn', toolName);
	//                 continue;
	//
	//             }
	//
	//             if (typeof tool.render != 'function') {
	//
	//                 editor.core.log('render method missed. Tool %o skipped', 'warn', toolName);
	//                 continue;
	//
	//             }
	//
	//             if (!tool.displayInToolbox) {
	//
	//                 continue;
	//
	//             } else {
	//
	//                 /** if tools is for toolbox */
	//                 toolButton = editor.draw.toolbarButton(toolName, tool.iconClassname);
	//
	//                 editor.nodes.toolbox.appendChild(toolButton);
	//
	//                 editor.nodes.toolbarButtons[toolName] = toolButton;
	//
	//             }
	//
	//         }
	//
	//     };
	//
	//     var addInlineToolbarTools_ = function () {
	//
	//         var tools = {
	//
	//             bold: {
	//                 icon    : 'ce-icon-bold',
	//                 command : 'bold'
	//             },
	//
	//             italic: {
	//                 icon    : 'ce-icon-italic',
	//                 command : 'italic'
	//             },
	//
	//             link: {
	//                 icon    : 'ce-icon-link',
	//                 command : 'createLink'
	//             }
	//         };
	//
	//         var toolButton,
	//             tool;
	//
	//         for(var name in tools) {
	//
	//             tool = tools[name];
	//
	//             toolButton = editor.draw.toolbarButtonInline(name, tool.icon);
	//
	//             editor.nodes.inlineToolbar.buttons.appendChild(toolButton);
	//             /**
	//              * Add callbacks to this buttons
	//              */
	//             editor.ui.setInlineToolbarButtonBehaviour(toolButton, tool.command);
	//
	//         }
	//
	//     };
	//
	//     /**
	//      * @private
	//      * Bind editor UI events
	//      */
	//     var bindEvents_ = function () {
	//
	//         editor.core.log('ui.bindEvents fired', 'info');
	//
	//         // window.addEventListener('error', function (errorMsg, url, lineNumber) {
	//         //     editor.notifications.errorThrown(errorMsg, event);
	//         // }, false );
	//
	//         /** All keydowns on Document */
	//         editor.listeners.add(document, 'keydown', editor.callback.globalKeydown, false);
	//
	//         /** All keydowns on Redactor zone */
	//         editor.listeners.add(editor.nodes.redactor, 'keydown', editor.callback.redactorKeyDown, false);
	//
	//         /** All keydowns on Document */
	//         editor.listeners.add(document, 'keyup', editor.callback.globalKeyup, false );
	//
	//         /**
	//          * Mouse click to radactor
	//          */
	//         editor.listeners.add(editor.nodes.redactor, 'click', editor.callback.redactorClicked, false );
	//
	//         /**
	//          * Clicks to the Plus button
	//          */
	//         editor.listeners.add(editor.nodes.plusButton, 'click', editor.callback.plusButtonClicked, false);
	//
	//         /**
	//          * Clicks to SETTINGS button in toolbar
	//          */
	//         editor.listeners.add(editor.nodes.showSettingsButton, 'click', editor.callback.showSettingsButtonClicked, false );
	//
	//         /** Bind click listeners on toolbar buttons */
	//         for (var button in editor.nodes.toolbarButtons) {
	//
	//             editor.listeners.add(editor.nodes.toolbarButtons[button], 'click', editor.callback.toolbarButtonClicked, false);
	//
	//         }
	//
	//     };
	//
	//     ui.addBlockHandlers = function (block) {
	//
	//         if (!block) return;
	//
	//         /**
	//          * Block keydowns
	//          */
	//         editor.listeners.add(block, 'keydown', editor.callback.blockKeydown, false);
	//
	//         /**
	//          * Pasting content from another source
	//          * We have two type of sanitization
	//          * First - uses deep-first search algorithm to get sub nodes,
	//          * sanitizes whole Block_content and replaces cleared nodes
	//          * This method is deprecated
	//          * Method is used in editor.callback.blockPaste(event)
	//          *
	//          * Secont - uses Mutation observer.
	//          * Observer "observe" DOM changes and send changings to callback.
	//          * Callback gets changed node, not whole Block_content.
	//          * Inserted or changed node, which we've gotten have been cleared and replaced with diry node
	//          *
	//          * Method is used in editor.callback.blockPasteViaSanitize(event)
	//          *
	//          * @uses html-janitor
	//          * @example editor.callback.blockPasteViaSanitize(event), the second method.
	//          *
	//          */
	//         editor.listeners.add(block, 'paste', editor.paste.blockPasteCallback, false);
	//
	//         /**
	//          * Show inline toolbar for selected text
	//          */
	//         editor.listeners.add(block, 'mouseup', editor.toolbar.inline.show, false);
	//         editor.listeners.add(block, 'keyup', editor.toolbar.inline.show, false);
	//
	//     };
	//
	//     /** getting all contenteditable elements */
	//     ui.saveInputs = function () {
	//
	//         var redactor = editor.nodes.redactor;
	//
	//         editor.state.inputs = [];
	//
	//         /** Save all inputs in global variable state */
	//         var inputs = redactor.querySelectorAll('[contenteditable], input, textarea');
	//
	//         Array.prototype.map.call(inputs, function (current) {
	//
	//             if (!current.type || current.type == 'text' || current.type == 'textarea') {
	//
	//                 editor.state.inputs.push(current);
	//
	//             }
	//
	//         });
	//
	//     };
	//
	//     /**
	//      * Adds first initial block on empty redactor
	//      */
	//     ui.addInitialBlock = function () {
	//
	//         var initialBlockType = editor.settings.initialBlockPlugin,
	//             initialBlock;
	//
	//         if ( !editor.tools[initialBlockType] ) {
	//
	//             editor.core.log('Plugin %o was not implemented and can\'t be used as initial block', 'warn', initialBlockType);
	//             return;
	//
	//         }
	//
	//         initialBlock = editor.tools[initialBlockType].render();
	//
	//         initialBlock.setAttribute('data-placeholder', editor.settings.placeholder);
	//
	//         editor.content.insertBlock({
	//             type  : initialBlockType,
	//             block : initialBlock
	//         });
	//
	//         editor.content.workingNodeChanged(initialBlock);
	//
	//     };
	//
	//     ui.setInlineToolbarButtonBehaviour = function (button, type) {
	//
	//         editor.listeners.add(button, 'mousedown', function (event) {
	//
	//             editor.toolbar.inline.toolClicked(event, type);
	//
	//         }, false);
	//
	//     };
	//
	//     return ui;
	//
	// })({});


/***/ })
/******/ ]);
//# sourceMappingURL=codex-editor.js.map