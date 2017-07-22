webpackJsonp([1],{

/***/ "../node_modules/hammerjs/hammer.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*! Hammer.JS - v2.0.7 - 2016-04-22
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2016 Jorik Tangelder;
 * Licensed under the MIT license */
(function(window, document, exportName, undefined) {
  'use strict';

var VENDOR_PREFIXES = ['', 'webkit', 'Moz', 'MS', 'ms', 'o'];
var TEST_ELEMENT = document.createElement('div');

var TYPE_FUNCTION = 'function';

var round = Math.round;
var abs = Math.abs;
var now = Date.now;

/**
 * set a timeout with a given scope
 * @param {Function} fn
 * @param {Number} timeout
 * @param {Object} context
 * @returns {number}
 */
function setTimeoutContext(fn, timeout, context) {
    return setTimeout(bindFn(fn, context), timeout);
}

/**
 * if the argument is an array, we want to execute the fn on each entry
 * if it aint an array we don't want to do a thing.
 * this is used by all the methods that accept a single and array argument.
 * @param {*|Array} arg
 * @param {String} fn
 * @param {Object} [context]
 * @returns {Boolean}
 */
function invokeArrayArg(arg, fn, context) {
    if (Array.isArray(arg)) {
        each(arg, context[fn], context);
        return true;
    }
    return false;
}

/**
 * walk objects and arrays
 * @param {Object} obj
 * @param {Function} iterator
 * @param {Object} context
 */
function each(obj, iterator, context) {
    var i;

    if (!obj) {
        return;
    }

    if (obj.forEach) {
        obj.forEach(iterator, context);
    } else if (obj.length !== undefined) {
        i = 0;
        while (i < obj.length) {
            iterator.call(context, obj[i], i, obj);
            i++;
        }
    } else {
        for (i in obj) {
            obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
        }
    }
}

/**
 * wrap a method with a deprecation warning and stack trace
 * @param {Function} method
 * @param {String} name
 * @param {String} message
 * @returns {Function} A new function wrapping the supplied method.
 */
function deprecate(method, name, message) {
    var deprecationMessage = 'DEPRECATED METHOD: ' + name + '\n' + message + ' AT \n';
    return function() {
        var e = new Error('get-stack-trace');
        var stack = e && e.stack ? e.stack.replace(/^[^\(]+?[\n$]/gm, '')
            .replace(/^\s+at\s+/gm, '')
            .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@') : 'Unknown Stack Trace';

        var log = window.console && (window.console.warn || window.console.log);
        if (log) {
            log.call(window.console, deprecationMessage, stack);
        }
        return method.apply(this, arguments);
    };
}

/**
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} target
 * @param {...Object} objects_to_assign
 * @returns {Object} target
 */
var assign;
if (typeof Object.assign !== 'function') {
    assign = function assign(target) {
        if (target === undefined || target === null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        var output = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source !== undefined && source !== null) {
                for (var nextKey in source) {
                    if (source.hasOwnProperty(nextKey)) {
                        output[nextKey] = source[nextKey];
                    }
                }
            }
        }
        return output;
    };
} else {
    assign = Object.assign;
}

/**
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} dest
 * @param {Object} src
 * @param {Boolean} [merge=false]
 * @returns {Object} dest
 */
var extend = deprecate(function extend(dest, src, merge) {
    var keys = Object.keys(src);
    var i = 0;
    while (i < keys.length) {
        if (!merge || (merge && dest[keys[i]] === undefined)) {
            dest[keys[i]] = src[keys[i]];
        }
        i++;
    }
    return dest;
}, 'extend', 'Use `assign`.');

/**
 * merge the values from src in the dest.
 * means that properties that exist in dest will not be overwritten by src
 * @param {Object} dest
 * @param {Object} src
 * @returns {Object} dest
 */
var merge = deprecate(function merge(dest, src) {
    return extend(dest, src, true);
}, 'merge', 'Use `assign`.');

/**
 * simple class inheritance
 * @param {Function} child
 * @param {Function} base
 * @param {Object} [properties]
 */
function inherit(child, base, properties) {
    var baseP = base.prototype,
        childP;

    childP = child.prototype = Object.create(baseP);
    childP.constructor = child;
    childP._super = baseP;

    if (properties) {
        assign(childP, properties);
    }
}

/**
 * simple function bind
 * @param {Function} fn
 * @param {Object} context
 * @returns {Function}
 */
function bindFn(fn, context) {
    return function boundFn() {
        return fn.apply(context, arguments);
    };
}

/**
 * let a boolean value also be a function that must return a boolean
 * this first item in args will be used as the context
 * @param {Boolean|Function} val
 * @param {Array} [args]
 * @returns {Boolean}
 */
function boolOrFn(val, args) {
    if (typeof val == TYPE_FUNCTION) {
        return val.apply(args ? args[0] || undefined : undefined, args);
    }
    return val;
}

/**
 * use the val2 when val1 is undefined
 * @param {*} val1
 * @param {*} val2
 * @returns {*}
 */
function ifUndefined(val1, val2) {
    return (val1 === undefined) ? val2 : val1;
}

/**
 * addEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function addEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.addEventListener(type, handler, false);
    });
}

/**
 * removeEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function removeEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.removeEventListener(type, handler, false);
    });
}

/**
 * find if a node is in the given parent
 * @method hasParent
 * @param {HTMLElement} node
 * @param {HTMLElement} parent
 * @return {Boolean} found
 */
function hasParent(node, parent) {
    while (node) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

/**
 * small indexOf wrapper
 * @param {String} str
 * @param {String} find
 * @returns {Boolean} found
 */
function inStr(str, find) {
    return str.indexOf(find) > -1;
}

/**
 * split string on whitespace
 * @param {String} str
 * @returns {Array} words
 */
function splitStr(str) {
    return str.trim().split(/\s+/g);
}

/**
 * find if a array contains the object using indexOf or a simple polyFill
 * @param {Array} src
 * @param {String} find
 * @param {String} [findByKey]
 * @return {Boolean|Number} false when not found, or the index
 */
function inArray(src, find, findByKey) {
    if (src.indexOf && !findByKey) {
        return src.indexOf(find);
    } else {
        var i = 0;
        while (i < src.length) {
            if ((findByKey && src[i][findByKey] == find) || (!findByKey && src[i] === find)) {
                return i;
            }
            i++;
        }
        return -1;
    }
}

/**
 * convert array-like objects to real arrays
 * @param {Object} obj
 * @returns {Array}
 */
function toArray(obj) {
    return Array.prototype.slice.call(obj, 0);
}

/**
 * unique array with objects based on a key (like 'id') or just by the array's value
 * @param {Array} src [{id:1},{id:2},{id:1}]
 * @param {String} [key]
 * @param {Boolean} [sort=False]
 * @returns {Array} [{id:1},{id:2}]
 */
function uniqueArray(src, key, sort) {
    var results = [];
    var values = [];
    var i = 0;

    while (i < src.length) {
        var val = key ? src[i][key] : src[i];
        if (inArray(values, val) < 0) {
            results.push(src[i]);
        }
        values[i] = val;
        i++;
    }

    if (sort) {
        if (!key) {
            results = results.sort();
        } else {
            results = results.sort(function sortUniqueArray(a, b) {
                return a[key] > b[key];
            });
        }
    }

    return results;
}

/**
 * get the prefixed property
 * @param {Object} obj
 * @param {String} property
 * @returns {String|Undefined} prefixed
 */
function prefixed(obj, property) {
    var prefix, prop;
    var camelProp = property[0].toUpperCase() + property.slice(1);

    var i = 0;
    while (i < VENDOR_PREFIXES.length) {
        prefix = VENDOR_PREFIXES[i];
        prop = (prefix) ? prefix + camelProp : property;

        if (prop in obj) {
            return prop;
        }
        i++;
    }
    return undefined;
}

/**
 * get a unique id
 * @returns {number} uniqueId
 */
var _uniqueId = 1;
function uniqueId() {
    return _uniqueId++;
}

/**
 * get the window object of an element
 * @param {HTMLElement} element
 * @returns {DocumentView|Window}
 */
function getWindowForElement(element) {
    var doc = element.ownerDocument || element;
    return (doc.defaultView || doc.parentWindow || window);
}

var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;

var SUPPORT_TOUCH = ('ontouchstart' in window);
var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined;
var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

var INPUT_TYPE_TOUCH = 'touch';
var INPUT_TYPE_PEN = 'pen';
var INPUT_TYPE_MOUSE = 'mouse';
var INPUT_TYPE_KINECT = 'kinect';

var COMPUTE_INTERVAL = 25;

var INPUT_START = 1;
var INPUT_MOVE = 2;
var INPUT_END = 4;
var INPUT_CANCEL = 8;

var DIRECTION_NONE = 1;
var DIRECTION_LEFT = 2;
var DIRECTION_RIGHT = 4;
var DIRECTION_UP = 8;
var DIRECTION_DOWN = 16;

var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

var PROPS_XY = ['x', 'y'];
var PROPS_CLIENT_XY = ['clientX', 'clientY'];

/**
 * create new input type manager
 * @param {Manager} manager
 * @param {Function} callback
 * @returns {Input}
 * @constructor
 */
function Input(manager, callback) {
    var self = this;
    this.manager = manager;
    this.callback = callback;
    this.element = manager.element;
    this.target = manager.options.inputTarget;

    // smaller wrapper around the handler, for the scope and the enabled state of the manager,
    // so when disabled the input events are completely bypassed.
    this.domHandler = function(ev) {
        if (boolOrFn(manager.options.enable, [manager])) {
            self.handler(ev);
        }
    };

    this.init();

}

Input.prototype = {
    /**
     * should handle the inputEvent data and trigger the callback
     * @virtual
     */
    handler: function() { },

    /**
     * bind the events
     */
    init: function() {
        this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    },

    /**
     * unbind the events
     */
    destroy: function() {
        this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    }
};

/**
 * create new input type manager
 * called by the Manager constructor
 * @param {Hammer} manager
 * @returns {Input}
 */
function createInputInstance(manager) {
    var Type;
    var inputClass = manager.options.inputClass;

    if (inputClass) {
        Type = inputClass;
    } else if (SUPPORT_POINTER_EVENTS) {
        Type = PointerEventInput;
    } else if (SUPPORT_ONLY_TOUCH) {
        Type = TouchInput;
    } else if (!SUPPORT_TOUCH) {
        Type = MouseInput;
    } else {
        Type = TouchMouseInput;
    }
    return new (Type)(manager, inputHandler);
}

/**
 * handle input events
 * @param {Manager} manager
 * @param {String} eventType
 * @param {Object} input
 */
function inputHandler(manager, eventType, input) {
    var pointersLen = input.pointers.length;
    var changedPointersLen = input.changedPointers.length;
    var isFirst = (eventType & INPUT_START && (pointersLen - changedPointersLen === 0));
    var isFinal = (eventType & (INPUT_END | INPUT_CANCEL) && (pointersLen - changedPointersLen === 0));

    input.isFirst = !!isFirst;
    input.isFinal = !!isFinal;

    if (isFirst) {
        manager.session = {};
    }

    // source event is the normalized value of the domEvents
    // like 'touchstart, mouseup, pointerdown'
    input.eventType = eventType;

    // compute scale, rotation etc
    computeInputData(manager, input);

    // emit secret event
    manager.emit('hammer.input', input);

    manager.recognize(input);
    manager.session.prevInput = input;
}

/**
 * extend the data with some usable properties like scale, rotate, velocity etc
 * @param {Object} manager
 * @param {Object} input
 */
function computeInputData(manager, input) {
    var session = manager.session;
    var pointers = input.pointers;
    var pointersLength = pointers.length;

    // store the first input to calculate the distance and direction
    if (!session.firstInput) {
        session.firstInput = simpleCloneInputData(input);
    }

    // to compute scale and rotation we need to store the multiple touches
    if (pointersLength > 1 && !session.firstMultiple) {
        session.firstMultiple = simpleCloneInputData(input);
    } else if (pointersLength === 1) {
        session.firstMultiple = false;
    }

    var firstInput = session.firstInput;
    var firstMultiple = session.firstMultiple;
    var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;

    var center = input.center = getCenter(pointers);
    input.timeStamp = now();
    input.deltaTime = input.timeStamp - firstInput.timeStamp;

    input.angle = getAngle(offsetCenter, center);
    input.distance = getDistance(offsetCenter, center);

    computeDeltaXY(session, input);
    input.offsetDirection = getDirection(input.deltaX, input.deltaY);

    var overallVelocity = getVelocity(input.deltaTime, input.deltaX, input.deltaY);
    input.overallVelocityX = overallVelocity.x;
    input.overallVelocityY = overallVelocity.y;
    input.overallVelocity = (abs(overallVelocity.x) > abs(overallVelocity.y)) ? overallVelocity.x : overallVelocity.y;

    input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
    input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;

    input.maxPointers = !session.prevInput ? input.pointers.length : ((input.pointers.length >
        session.prevInput.maxPointers) ? input.pointers.length : session.prevInput.maxPointers);

    computeIntervalInputData(session, input);

    // find the correct target
    var target = manager.element;
    if (hasParent(input.srcEvent.target, target)) {
        target = input.srcEvent.target;
    }
    input.target = target;
}

function computeDeltaXY(session, input) {
    var center = input.center;
    var offset = session.offsetDelta || {};
    var prevDelta = session.prevDelta || {};
    var prevInput = session.prevInput || {};

    if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
        prevDelta = session.prevDelta = {
            x: prevInput.deltaX || 0,
            y: prevInput.deltaY || 0
        };

        offset = session.offsetDelta = {
            x: center.x,
            y: center.y
        };
    }

    input.deltaX = prevDelta.x + (center.x - offset.x);
    input.deltaY = prevDelta.y + (center.y - offset.y);
}

/**
 * velocity is calculated every x ms
 * @param {Object} session
 * @param {Object} input
 */
function computeIntervalInputData(session, input) {
    var last = session.lastInterval || input,
        deltaTime = input.timeStamp - last.timeStamp,
        velocity, velocityX, velocityY, direction;

    if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined)) {
        var deltaX = input.deltaX - last.deltaX;
        var deltaY = input.deltaY - last.deltaY;

        var v = getVelocity(deltaTime, deltaX, deltaY);
        velocityX = v.x;
        velocityY = v.y;
        velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
        direction = getDirection(deltaX, deltaY);

        session.lastInterval = input;
    } else {
        // use latest velocity info if it doesn't overtake a minimum period
        velocity = last.velocity;
        velocityX = last.velocityX;
        velocityY = last.velocityY;
        direction = last.direction;
    }

    input.velocity = velocity;
    input.velocityX = velocityX;
    input.velocityY = velocityY;
    input.direction = direction;
}

/**
 * create a simple clone from the input used for storage of firstInput and firstMultiple
 * @param {Object} input
 * @returns {Object} clonedInputData
 */
function simpleCloneInputData(input) {
    // make a simple copy of the pointers because we will get a reference if we don't
    // we only need clientXY for the calculations
    var pointers = [];
    var i = 0;
    while (i < input.pointers.length) {
        pointers[i] = {
            clientX: round(input.pointers[i].clientX),
            clientY: round(input.pointers[i].clientY)
        };
        i++;
    }

    return {
        timeStamp: now(),
        pointers: pointers,
        center: getCenter(pointers),
        deltaX: input.deltaX,
        deltaY: input.deltaY
    };
}

/**
 * get the center of all the pointers
 * @param {Array} pointers
 * @return {Object} center contains `x` and `y` properties
 */
function getCenter(pointers) {
    var pointersLength = pointers.length;

    // no need to loop when only one touch
    if (pointersLength === 1) {
        return {
            x: round(pointers[0].clientX),
            y: round(pointers[0].clientY)
        };
    }

    var x = 0, y = 0, i = 0;
    while (i < pointersLength) {
        x += pointers[i].clientX;
        y += pointers[i].clientY;
        i++;
    }

    return {
        x: round(x / pointersLength),
        y: round(y / pointersLength)
    };
}

/**
 * calculate the velocity between two points. unit is in px per ms.
 * @param {Number} deltaTime
 * @param {Number} x
 * @param {Number} y
 * @return {Object} velocity `x` and `y`
 */
function getVelocity(deltaTime, x, y) {
    return {
        x: x / deltaTime || 0,
        y: y / deltaTime || 0
    };
}

/**
 * get the direction between two points
 * @param {Number} x
 * @param {Number} y
 * @return {Number} direction
 */
function getDirection(x, y) {
    if (x === y) {
        return DIRECTION_NONE;
    }

    if (abs(x) >= abs(y)) {
        return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
    }
    return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
}

/**
 * calculate the absolute distance between two points
 * @param {Object} p1 {x, y}
 * @param {Object} p2 {x, y}
 * @param {Array} [props] containing x and y keys
 * @return {Number} distance
 */
function getDistance(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];

    return Math.sqrt((x * x) + (y * y));
}

/**
 * calculate the angle between two coordinates
 * @param {Object} p1
 * @param {Object} p2
 * @param {Array} [props] containing x and y keys
 * @return {Number} angle
 */
function getAngle(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];
    return Math.atan2(y, x) * 180 / Math.PI;
}

/**
 * calculate the rotation degrees between two pointersets
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} rotation
 */
function getRotation(start, end) {
    return getAngle(end[1], end[0], PROPS_CLIENT_XY) + getAngle(start[1], start[0], PROPS_CLIENT_XY);
}

/**
 * calculate the scale factor between two pointersets
 * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} scale
 */
function getScale(start, end) {
    return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
}

var MOUSE_INPUT_MAP = {
    mousedown: INPUT_START,
    mousemove: INPUT_MOVE,
    mouseup: INPUT_END
};

var MOUSE_ELEMENT_EVENTS = 'mousedown';
var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';

/**
 * Mouse events input
 * @constructor
 * @extends Input
 */
function MouseInput() {
    this.evEl = MOUSE_ELEMENT_EVENTS;
    this.evWin = MOUSE_WINDOW_EVENTS;

    this.pressed = false; // mousedown state

    Input.apply(this, arguments);
}

inherit(MouseInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function MEhandler(ev) {
        var eventType = MOUSE_INPUT_MAP[ev.type];

        // on start we want to have the left mouse button down
        if (eventType & INPUT_START && ev.button === 0) {
            this.pressed = true;
        }

        if (eventType & INPUT_MOVE && ev.which !== 1) {
            eventType = INPUT_END;
        }

        // mouse must be down
        if (!this.pressed) {
            return;
        }

        if (eventType & INPUT_END) {
            this.pressed = false;
        }

        this.callback(this.manager, eventType, {
            pointers: [ev],
            changedPointers: [ev],
            pointerType: INPUT_TYPE_MOUSE,
            srcEvent: ev
        });
    }
});

var POINTER_INPUT_MAP = {
    pointerdown: INPUT_START,
    pointermove: INPUT_MOVE,
    pointerup: INPUT_END,
    pointercancel: INPUT_CANCEL,
    pointerout: INPUT_CANCEL
};

// in IE10 the pointer types is defined as an enum
var IE10_POINTER_TYPE_ENUM = {
    2: INPUT_TYPE_TOUCH,
    3: INPUT_TYPE_PEN,
    4: INPUT_TYPE_MOUSE,
    5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816
};

var POINTER_ELEMENT_EVENTS = 'pointerdown';
var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel';

// IE10 has prefixed support, and case-sensitive
if (window.MSPointerEvent && !window.PointerEvent) {
    POINTER_ELEMENT_EVENTS = 'MSPointerDown';
    POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
}

/**
 * Pointer events input
 * @constructor
 * @extends Input
 */
function PointerEventInput() {
    this.evEl = POINTER_ELEMENT_EVENTS;
    this.evWin = POINTER_WINDOW_EVENTS;

    Input.apply(this, arguments);

    this.store = (this.manager.session.pointerEvents = []);
}

inherit(PointerEventInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function PEhandler(ev) {
        var store = this.store;
        var removePointer = false;

        var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
        var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
        var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;

        var isTouch = (pointerType == INPUT_TYPE_TOUCH);

        // get index of the event in the store
        var storeIndex = inArray(store, ev.pointerId, 'pointerId');

        // start and mouse must be down
        if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
            if (storeIndex < 0) {
                store.push(ev);
                storeIndex = store.length - 1;
            }
        } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
            removePointer = true;
        }

        // it not found, so the pointer hasn't been down (so it's probably a hover)
        if (storeIndex < 0) {
            return;
        }

        // update the event in the store
        store[storeIndex] = ev;

        this.callback(this.manager, eventType, {
            pointers: store,
            changedPointers: [ev],
            pointerType: pointerType,
            srcEvent: ev
        });

        if (removePointer) {
            // remove from the store
            store.splice(storeIndex, 1);
        }
    }
});

var SINGLE_TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var SINGLE_TOUCH_TARGET_EVENTS = 'touchstart';
var SINGLE_TOUCH_WINDOW_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Touch events input
 * @constructor
 * @extends Input
 */
function SingleTouchInput() {
    this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
    this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
    this.started = false;

    Input.apply(this, arguments);
}

inherit(SingleTouchInput, Input, {
    handler: function TEhandler(ev) {
        var type = SINGLE_TOUCH_INPUT_MAP[ev.type];

        // should we handle the touch events?
        if (type === INPUT_START) {
            this.started = true;
        }

        if (!this.started) {
            return;
        }

        var touches = normalizeSingleTouches.call(this, ev, type);

        // when done, reset the started state
        if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
            this.started = false;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function normalizeSingleTouches(ev, type) {
    var all = toArray(ev.touches);
    var changed = toArray(ev.changedTouches);

    if (type & (INPUT_END | INPUT_CANCEL)) {
        all = uniqueArray(all.concat(changed), 'identifier', true);
    }

    return [all, changed];
}

var TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Multi-user touch events input
 * @constructor
 * @extends Input
 */
function TouchInput() {
    this.evTarget = TOUCH_TARGET_EVENTS;
    this.targetIds = {};

    Input.apply(this, arguments);
}

inherit(TouchInput, Input, {
    handler: function MTEhandler(ev) {
        var type = TOUCH_INPUT_MAP[ev.type];
        var touches = getTouches.call(this, ev, type);
        if (!touches) {
            return;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function getTouches(ev, type) {
    var allTouches = toArray(ev.touches);
    var targetIds = this.targetIds;

    // when there is only one touch, the process can be simplified
    if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
        targetIds[allTouches[0].identifier] = true;
        return [allTouches, allTouches];
    }

    var i,
        targetTouches,
        changedTouches = toArray(ev.changedTouches),
        changedTargetTouches = [],
        target = this.target;

    // get target touches from touches
    targetTouches = allTouches.filter(function(touch) {
        return hasParent(touch.target, target);
    });

    // collect touches
    if (type === INPUT_START) {
        i = 0;
        while (i < targetTouches.length) {
            targetIds[targetTouches[i].identifier] = true;
            i++;
        }
    }

    // filter changed touches to only contain touches that exist in the collected target ids
    i = 0;
    while (i < changedTouches.length) {
        if (targetIds[changedTouches[i].identifier]) {
            changedTargetTouches.push(changedTouches[i]);
        }

        // cleanup removed touches
        if (type & (INPUT_END | INPUT_CANCEL)) {
            delete targetIds[changedTouches[i].identifier];
        }
        i++;
    }

    if (!changedTargetTouches.length) {
        return;
    }

    return [
        // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
        uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true),
        changedTargetTouches
    ];
}

/**
 * Combined touch and mouse input
 *
 * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
 * This because touch devices also emit mouse events while doing a touch.
 *
 * @constructor
 * @extends Input
 */

var DEDUP_TIMEOUT = 2500;
var DEDUP_DISTANCE = 25;

function TouchMouseInput() {
    Input.apply(this, arguments);

    var handler = bindFn(this.handler, this);
    this.touch = new TouchInput(this.manager, handler);
    this.mouse = new MouseInput(this.manager, handler);

    this.primaryTouch = null;
    this.lastTouches = [];
}

inherit(TouchMouseInput, Input, {
    /**
     * handle mouse and touch events
     * @param {Hammer} manager
     * @param {String} inputEvent
     * @param {Object} inputData
     */
    handler: function TMEhandler(manager, inputEvent, inputData) {
        var isTouch = (inputData.pointerType == INPUT_TYPE_TOUCH),
            isMouse = (inputData.pointerType == INPUT_TYPE_MOUSE);

        if (isMouse && inputData.sourceCapabilities && inputData.sourceCapabilities.firesTouchEvents) {
            return;
        }

        // when we're in a touch event, record touches to  de-dupe synthetic mouse event
        if (isTouch) {
            recordTouches.call(this, inputEvent, inputData);
        } else if (isMouse && isSyntheticEvent.call(this, inputData)) {
            return;
        }

        this.callback(manager, inputEvent, inputData);
    },

    /**
     * remove the event listeners
     */
    destroy: function destroy() {
        this.touch.destroy();
        this.mouse.destroy();
    }
});

function recordTouches(eventType, eventData) {
    if (eventType & INPUT_START) {
        this.primaryTouch = eventData.changedPointers[0].identifier;
        setLastTouch.call(this, eventData);
    } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
        setLastTouch.call(this, eventData);
    }
}

function setLastTouch(eventData) {
    var touch = eventData.changedPointers[0];

    if (touch.identifier === this.primaryTouch) {
        var lastTouch = {x: touch.clientX, y: touch.clientY};
        this.lastTouches.push(lastTouch);
        var lts = this.lastTouches;
        var removeLastTouch = function() {
            var i = lts.indexOf(lastTouch);
            if (i > -1) {
                lts.splice(i, 1);
            }
        };
        setTimeout(removeLastTouch, DEDUP_TIMEOUT);
    }
}

function isSyntheticEvent(eventData) {
    var x = eventData.srcEvent.clientX, y = eventData.srcEvent.clientY;
    for (var i = 0; i < this.lastTouches.length; i++) {
        var t = this.lastTouches[i];
        var dx = Math.abs(x - t.x), dy = Math.abs(y - t.y);
        if (dx <= DEDUP_DISTANCE && dy <= DEDUP_DISTANCE) {
            return true;
        }
    }
    return false;
}

var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;

// magical touchAction value
var TOUCH_ACTION_COMPUTE = 'compute';
var TOUCH_ACTION_AUTO = 'auto';
var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
var TOUCH_ACTION_NONE = 'none';
var TOUCH_ACTION_PAN_X = 'pan-x';
var TOUCH_ACTION_PAN_Y = 'pan-y';
var TOUCH_ACTION_MAP = getTouchActionProps();

/**
 * Touch Action
 * sets the touchAction property or uses the js alternative
 * @param {Manager} manager
 * @param {String} value
 * @constructor
 */
function TouchAction(manager, value) {
    this.manager = manager;
    this.set(value);
}

TouchAction.prototype = {
    /**
     * set the touchAction value on the element or enable the polyfill
     * @param {String} value
     */
    set: function(value) {
        // find out the touch-action by the event handlers
        if (value == TOUCH_ACTION_COMPUTE) {
            value = this.compute();
        }

        if (NATIVE_TOUCH_ACTION && this.manager.element.style && TOUCH_ACTION_MAP[value]) {
            this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
        }
        this.actions = value.toLowerCase().trim();
    },

    /**
     * just re-set the touchAction value
     */
    update: function() {
        this.set(this.manager.options.touchAction);
    },

    /**
     * compute the value for the touchAction property based on the recognizer's settings
     * @returns {String} value
     */
    compute: function() {
        var actions = [];
        each(this.manager.recognizers, function(recognizer) {
            if (boolOrFn(recognizer.options.enable, [recognizer])) {
                actions = actions.concat(recognizer.getTouchAction());
            }
        });
        return cleanTouchActions(actions.join(' '));
    },

    /**
     * this method is called on each input cycle and provides the preventing of the browser behavior
     * @param {Object} input
     */
    preventDefaults: function(input) {
        var srcEvent = input.srcEvent;
        var direction = input.offsetDirection;

        // if the touch action did prevented once this session
        if (this.manager.session.prevented) {
            srcEvent.preventDefault();
            return;
        }

        var actions = this.actions;
        var hasNone = inStr(actions, TOUCH_ACTION_NONE) && !TOUCH_ACTION_MAP[TOUCH_ACTION_NONE];
        var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_Y];
        var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_X];

        if (hasNone) {
            //do not prevent defaults if this is a tap gesture

            var isTapPointer = input.pointers.length === 1;
            var isTapMovement = input.distance < 2;
            var isTapTouchTime = input.deltaTime < 250;

            if (isTapPointer && isTapMovement && isTapTouchTime) {
                return;
            }
        }

        if (hasPanX && hasPanY) {
            // `pan-x pan-y` means browser handles all scrolling/panning, do not prevent
            return;
        }

        if (hasNone ||
            (hasPanY && direction & DIRECTION_HORIZONTAL) ||
            (hasPanX && direction & DIRECTION_VERTICAL)) {
            return this.preventSrc(srcEvent);
        }
    },

    /**
     * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
     * @param {Object} srcEvent
     */
    preventSrc: function(srcEvent) {
        this.manager.session.prevented = true;
        srcEvent.preventDefault();
    }
};

/**
 * when the touchActions are collected they are not a valid value, so we need to clean things up. *
 * @param {String} actions
 * @returns {*}
 */
function cleanTouchActions(actions) {
    // none
    if (inStr(actions, TOUCH_ACTION_NONE)) {
        return TOUCH_ACTION_NONE;
    }

    var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
    var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);

    // if both pan-x and pan-y are set (different recognizers
    // for different directions, e.g. horizontal pan but vertical swipe?)
    // we need none (as otherwise with pan-x pan-y combined none of these
    // recognizers will work, since the browser would handle all panning
    if (hasPanX && hasPanY) {
        return TOUCH_ACTION_NONE;
    }

    // pan-x OR pan-y
    if (hasPanX || hasPanY) {
        return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
    }

    // manipulation
    if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
        return TOUCH_ACTION_MANIPULATION;
    }

    return TOUCH_ACTION_AUTO;
}

function getTouchActionProps() {
    if (!NATIVE_TOUCH_ACTION) {
        return false;
    }
    var touchMap = {};
    var cssSupports = window.CSS && window.CSS.supports;
    ['auto', 'manipulation', 'pan-y', 'pan-x', 'pan-x pan-y', 'none'].forEach(function(val) {

        // If css.supports is not supported but there is native touch-action assume it supports
        // all values. This is the case for IE 10 and 11.
        touchMap[val] = cssSupports ? window.CSS.supports('touch-action', val) : true;
    });
    return touchMap;
}

/**
 * Recognizer flow explained; *
 * All recognizers have the initial state of POSSIBLE when a input session starts.
 * The definition of a input session is from the first input until the last input, with all it's movement in it. *
 * Example session for mouse-input: mousedown -> mousemove -> mouseup
 *
 * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
 * which determines with state it should be.
 *
 * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
 * POSSIBLE to give it another change on the next cycle.
 *
 *               Possible
 *                  |
 *            +-----+---------------+
 *            |                     |
 *      +-----+-----+               |
 *      |           |               |
 *   Failed      Cancelled          |
 *                          +-------+------+
 *                          |              |
 *                      Recognized       Began
 *                                         |
 *                                      Changed
 *                                         |
 *                                  Ended/Recognized
 */
var STATE_POSSIBLE = 1;
var STATE_BEGAN = 2;
var STATE_CHANGED = 4;
var STATE_ENDED = 8;
var STATE_RECOGNIZED = STATE_ENDED;
var STATE_CANCELLED = 16;
var STATE_FAILED = 32;

/**
 * Recognizer
 * Every recognizer needs to extend from this class.
 * @constructor
 * @param {Object} options
 */
function Recognizer(options) {
    this.options = assign({}, this.defaults, options || {});

    this.id = uniqueId();

    this.manager = null;

    // default is enable true
    this.options.enable = ifUndefined(this.options.enable, true);

    this.state = STATE_POSSIBLE;

    this.simultaneous = {};
    this.requireFail = [];
}

Recognizer.prototype = {
    /**
     * @virtual
     * @type {Object}
     */
    defaults: {},

    /**
     * set options
     * @param {Object} options
     * @return {Recognizer}
     */
    set: function(options) {
        assign(this.options, options);

        // also update the touchAction, in case something changed about the directions/enabled state
        this.manager && this.manager.touchAction.update();
        return this;
    },

    /**
     * recognize simultaneous with an other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    recognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
            return this;
        }

        var simultaneous = this.simultaneous;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (!simultaneous[otherRecognizer.id]) {
            simultaneous[otherRecognizer.id] = otherRecognizer;
            otherRecognizer.recognizeWith(this);
        }
        return this;
    },

    /**
     * drop the simultaneous link. it doesnt remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRecognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        delete this.simultaneous[otherRecognizer.id];
        return this;
    },

    /**
     * recognizer can only run when an other is failing
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    requireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
            return this;
        }

        var requireFail = this.requireFail;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (inArray(requireFail, otherRecognizer) === -1) {
            requireFail.push(otherRecognizer);
            otherRecognizer.requireFailure(this);
        }
        return this;
    },

    /**
     * drop the requireFailure link. it does not remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRequireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        var index = inArray(this.requireFail, otherRecognizer);
        if (index > -1) {
            this.requireFail.splice(index, 1);
        }
        return this;
    },

    /**
     * has require failures boolean
     * @returns {boolean}
     */
    hasRequireFailures: function() {
        return this.requireFail.length > 0;
    },

    /**
     * if the recognizer can recognize simultaneous with an other recognizer
     * @param {Recognizer} otherRecognizer
     * @returns {Boolean}
     */
    canRecognizeWith: function(otherRecognizer) {
        return !!this.simultaneous[otherRecognizer.id];
    },

    /**
     * You should use `tryEmit` instead of `emit` directly to check
     * that all the needed recognizers has failed before emitting.
     * @param {Object} input
     */
    emit: function(input) {
        var self = this;
        var state = this.state;

        function emit(event) {
            self.manager.emit(event, input);
        }

        // 'panstart' and 'panmove'
        if (state < STATE_ENDED) {
            emit(self.options.event + stateStr(state));
        }

        emit(self.options.event); // simple 'eventName' events

        if (input.additionalEvent) { // additional event(panleft, panright, pinchin, pinchout...)
            emit(input.additionalEvent);
        }

        // panend and pancancel
        if (state >= STATE_ENDED) {
            emit(self.options.event + stateStr(state));
        }
    },

    /**
     * Check that all the require failure recognizers has failed,
     * if true, it emits a gesture event,
     * otherwise, setup the state to FAILED.
     * @param {Object} input
     */
    tryEmit: function(input) {
        if (this.canEmit()) {
            return this.emit(input);
        }
        // it's failing anyway
        this.state = STATE_FAILED;
    },

    /**
     * can we emit?
     * @returns {boolean}
     */
    canEmit: function() {
        var i = 0;
        while (i < this.requireFail.length) {
            if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
                return false;
            }
            i++;
        }
        return true;
    },

    /**
     * update the recognizer
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        // make a new copy of the inputData
        // so we can change the inputData without messing up the other recognizers
        var inputDataClone = assign({}, inputData);

        // is is enabled and allow recognizing?
        if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
            this.reset();
            this.state = STATE_FAILED;
            return;
        }

        // reset when we've reached the end
        if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
            this.state = STATE_POSSIBLE;
        }

        this.state = this.process(inputDataClone);

        // the recognizer has recognized a gesture
        // so trigger an event
        if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
            this.tryEmit(inputDataClone);
        }
    },

    /**
     * return the state of the recognizer
     * the actual recognizing happens in this method
     * @virtual
     * @param {Object} inputData
     * @returns {Const} STATE
     */
    process: function(inputData) { }, // jshint ignore:line

    /**
     * return the preferred touch-action
     * @virtual
     * @returns {Array}
     */
    getTouchAction: function() { },

    /**
     * called when the gesture isn't allowed to recognize
     * like when another is being recognized or it is disabled
     * @virtual
     */
    reset: function() { }
};

/**
 * get a usable string, used as event postfix
 * @param {Const} state
 * @returns {String} state
 */
function stateStr(state) {
    if (state & STATE_CANCELLED) {
        return 'cancel';
    } else if (state & STATE_ENDED) {
        return 'end';
    } else if (state & STATE_CHANGED) {
        return 'move';
    } else if (state & STATE_BEGAN) {
        return 'start';
    }
    return '';
}

/**
 * direction cons to string
 * @param {Const} direction
 * @returns {String}
 */
function directionStr(direction) {
    if (direction == DIRECTION_DOWN) {
        return 'down';
    } else if (direction == DIRECTION_UP) {
        return 'up';
    } else if (direction == DIRECTION_LEFT) {
        return 'left';
    } else if (direction == DIRECTION_RIGHT) {
        return 'right';
    }
    return '';
}

/**
 * get a recognizer by name if it is bound to a manager
 * @param {Recognizer|String} otherRecognizer
 * @param {Recognizer} recognizer
 * @returns {Recognizer}
 */
function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
    var manager = recognizer.manager;
    if (manager) {
        return manager.get(otherRecognizer);
    }
    return otherRecognizer;
}

/**
 * This recognizer is just used as a base for the simple attribute recognizers.
 * @constructor
 * @extends Recognizer
 */
function AttrRecognizer() {
    Recognizer.apply(this, arguments);
}

inherit(AttrRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof AttrRecognizer
     */
    defaults: {
        /**
         * @type {Number}
         * @default 1
         */
        pointers: 1
    },

    /**
     * Used to check if it the recognizer receives valid input, like input.distance > 10.
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {Boolean} recognized
     */
    attrTest: function(input) {
        var optionPointers = this.options.pointers;
        return optionPointers === 0 || input.pointers.length === optionPointers;
    },

    /**
     * Process the input and return the state for the recognizer
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {*} State
     */
    process: function(input) {
        var state = this.state;
        var eventType = input.eventType;

        var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
        var isValid = this.attrTest(input);

        // on cancel input and we've recognized before, return STATE_CANCELLED
        if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
            return state | STATE_CANCELLED;
        } else if (isRecognized || isValid) {
            if (eventType & INPUT_END) {
                return state | STATE_ENDED;
            } else if (!(state & STATE_BEGAN)) {
                return STATE_BEGAN;
            }
            return state | STATE_CHANGED;
        }
        return STATE_FAILED;
    }
});

/**
 * Pan
 * Recognized when the pointer is down and moved in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function PanRecognizer() {
    AttrRecognizer.apply(this, arguments);

    this.pX = null;
    this.pY = null;
}

inherit(PanRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PanRecognizer
     */
    defaults: {
        event: 'pan',
        threshold: 10,
        pointers: 1,
        direction: DIRECTION_ALL
    },

    getTouchAction: function() {
        var direction = this.options.direction;
        var actions = [];
        if (direction & DIRECTION_HORIZONTAL) {
            actions.push(TOUCH_ACTION_PAN_Y);
        }
        if (direction & DIRECTION_VERTICAL) {
            actions.push(TOUCH_ACTION_PAN_X);
        }
        return actions;
    },

    directionTest: function(input) {
        var options = this.options;
        var hasMoved = true;
        var distance = input.distance;
        var direction = input.direction;
        var x = input.deltaX;
        var y = input.deltaY;

        // lock to axis?
        if (!(direction & options.direction)) {
            if (options.direction & DIRECTION_HORIZONTAL) {
                direction = (x === 0) ? DIRECTION_NONE : (x < 0) ? DIRECTION_LEFT : DIRECTION_RIGHT;
                hasMoved = x != this.pX;
                distance = Math.abs(input.deltaX);
            } else {
                direction = (y === 0) ? DIRECTION_NONE : (y < 0) ? DIRECTION_UP : DIRECTION_DOWN;
                hasMoved = y != this.pY;
                distance = Math.abs(input.deltaY);
            }
        }
        input.direction = direction;
        return hasMoved && distance > options.threshold && direction & options.direction;
    },

    attrTest: function(input) {
        return AttrRecognizer.prototype.attrTest.call(this, input) &&
            (this.state & STATE_BEGAN || (!(this.state & STATE_BEGAN) && this.directionTest(input)));
    },

    emit: function(input) {

        this.pX = input.deltaX;
        this.pY = input.deltaY;

        var direction = directionStr(input.direction);

        if (direction) {
            input.additionalEvent = this.options.event + direction;
        }
        this._super.emit.call(this, input);
    }
});

/**
 * Pinch
 * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
 * @constructor
 * @extends AttrRecognizer
 */
function PinchRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(PinchRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'pinch',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
    },

    emit: function(input) {
        if (input.scale !== 1) {
            var inOut = input.scale < 1 ? 'in' : 'out';
            input.additionalEvent = this.options.event + inOut;
        }
        this._super.emit.call(this, input);
    }
});

/**
 * Press
 * Recognized when the pointer is down for x ms without any movement.
 * @constructor
 * @extends Recognizer
 */
function PressRecognizer() {
    Recognizer.apply(this, arguments);

    this._timer = null;
    this._input = null;
}

inherit(PressRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PressRecognizer
     */
    defaults: {
        event: 'press',
        pointers: 1,
        time: 251, // minimal time of the pointer to be pressed
        threshold: 9 // a minimal movement is ok, but keep it low
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_AUTO];
    },

    process: function(input) {
        var options = this.options;
        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTime = input.deltaTime > options.time;

        this._input = input;

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (!validMovement || !validPointers || (input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime)) {
            this.reset();
        } else if (input.eventType & INPUT_START) {
            this.reset();
            this._timer = setTimeoutContext(function() {
                this.state = STATE_RECOGNIZED;
                this.tryEmit();
            }, options.time, this);
        } else if (input.eventType & INPUT_END) {
            return STATE_RECOGNIZED;
        }
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function(input) {
        if (this.state !== STATE_RECOGNIZED) {
            return;
        }

        if (input && (input.eventType & INPUT_END)) {
            this.manager.emit(this.options.event + 'up', input);
        } else {
            this._input.timeStamp = now();
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Rotate
 * Recognized when two or more pointer are moving in a circular motion.
 * @constructor
 * @extends AttrRecognizer
 */
function RotateRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(RotateRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof RotateRecognizer
     */
    defaults: {
        event: 'rotate',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
    }
});

/**
 * Swipe
 * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function SwipeRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(SwipeRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof SwipeRecognizer
     */
    defaults: {
        event: 'swipe',
        threshold: 10,
        velocity: 0.3,
        direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
        pointers: 1
    },

    getTouchAction: function() {
        return PanRecognizer.prototype.getTouchAction.call(this);
    },

    attrTest: function(input) {
        var direction = this.options.direction;
        var velocity;

        if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
            velocity = input.overallVelocity;
        } else if (direction & DIRECTION_HORIZONTAL) {
            velocity = input.overallVelocityX;
        } else if (direction & DIRECTION_VERTICAL) {
            velocity = input.overallVelocityY;
        }

        return this._super.attrTest.call(this, input) &&
            direction & input.offsetDirection &&
            input.distance > this.options.threshold &&
            input.maxPointers == this.options.pointers &&
            abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
    },

    emit: function(input) {
        var direction = directionStr(input.offsetDirection);
        if (direction) {
            this.manager.emit(this.options.event + direction, input);
        }

        this.manager.emit(this.options.event, input);
    }
});

/**
 * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
 * between the given interval and position. The delay option can be used to recognize multi-taps without firing
 * a single tap.
 *
 * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
 * multi-taps being recognized.
 * @constructor
 * @extends Recognizer
 */
function TapRecognizer() {
    Recognizer.apply(this, arguments);

    // previous time and center,
    // used for tap counting
    this.pTime = false;
    this.pCenter = false;

    this._timer = null;
    this._input = null;
    this.count = 0;
}

inherit(TapRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'tap',
        pointers: 1,
        taps: 1,
        interval: 300, // max time between the multi-tap taps
        time: 250, // max time of the pointer to be down (like finger on the screen)
        threshold: 9, // a minimal movement is ok, but keep it low
        posThreshold: 10 // a multi-tap can be a bit off the initial position
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_MANIPULATION];
    },

    process: function(input) {
        var options = this.options;

        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTouchTime = input.deltaTime < options.time;

        this.reset();

        if ((input.eventType & INPUT_START) && (this.count === 0)) {
            return this.failTimeout();
        }

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (validMovement && validTouchTime && validPointers) {
            if (input.eventType != INPUT_END) {
                return this.failTimeout();
            }

            var validInterval = this.pTime ? (input.timeStamp - this.pTime < options.interval) : true;
            var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;

            this.pTime = input.timeStamp;
            this.pCenter = input.center;

            if (!validMultiTap || !validInterval) {
                this.count = 1;
            } else {
                this.count += 1;
            }

            this._input = input;

            // if tap count matches we have recognized it,
            // else it has began recognizing...
            var tapCount = this.count % options.taps;
            if (tapCount === 0) {
                // no failing requirements, immediately trigger the tap event
                // or wait as long as the multitap interval to trigger
                if (!this.hasRequireFailures()) {
                    return STATE_RECOGNIZED;
                } else {
                    this._timer = setTimeoutContext(function() {
                        this.state = STATE_RECOGNIZED;
                        this.tryEmit();
                    }, options.interval, this);
                    return STATE_BEGAN;
                }
            }
        }
        return STATE_FAILED;
    },

    failTimeout: function() {
        this._timer = setTimeoutContext(function() {
            this.state = STATE_FAILED;
        }, this.options.interval, this);
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function() {
        if (this.state == STATE_RECOGNIZED) {
            this._input.tapCount = this.count;
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Simple way to create a manager with a default set of recognizers.
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Hammer(element, options) {
    options = options || {};
    options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
    return new Manager(element, options);
}

/**
 * @const {string}
 */
Hammer.VERSION = '2.0.7';

/**
 * default settings
 * @namespace
 */
Hammer.defaults = {
    /**
     * set if DOM events are being triggered.
     * But this is slower and unused by simple implementations, so disabled by default.
     * @type {Boolean}
     * @default false
     */
    domEvents: false,

    /**
     * The value for the touchAction property/fallback.
     * When set to `compute` it will magically set the correct value based on the added recognizers.
     * @type {String}
     * @default compute
     */
    touchAction: TOUCH_ACTION_COMPUTE,

    /**
     * @type {Boolean}
     * @default true
     */
    enable: true,

    /**
     * EXPERIMENTAL FEATURE -- can be removed/changed
     * Change the parent input target element.
     * If Null, then it is being set the to main element.
     * @type {Null|EventTarget}
     * @default null
     */
    inputTarget: null,

    /**
     * force an input class
     * @type {Null|Function}
     * @default null
     */
    inputClass: null,

    /**
     * Default recognizer setup when calling `Hammer()`
     * When creating a new Manager these will be skipped.
     * @type {Array}
     */
    preset: [
        // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
        [RotateRecognizer, {enable: false}],
        [PinchRecognizer, {enable: false}, ['rotate']],
        [SwipeRecognizer, {direction: DIRECTION_HORIZONTAL}],
        [PanRecognizer, {direction: DIRECTION_HORIZONTAL}, ['swipe']],
        [TapRecognizer],
        [TapRecognizer, {event: 'doubletap', taps: 2}, ['tap']],
        [PressRecognizer]
    ],

    /**
     * Some CSS properties can be used to improve the working of Hammer.
     * Add them to this method and they will be set when creating a new Manager.
     * @namespace
     */
    cssProps: {
        /**
         * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userSelect: 'none',

        /**
         * Disable the Windows Phone grippers when pressing an element.
         * @type {String}
         * @default 'none'
         */
        touchSelect: 'none',

        /**
         * Disables the default callout shown when you touch and hold a touch target.
         * On iOS, when you touch and hold a touch target such as a link, Safari displays
         * a callout containing information about the link. This property allows you to disable that callout.
         * @type {String}
         * @default 'none'
         */
        touchCallout: 'none',

        /**
         * Specifies whether zooming is enabled. Used by IE10>
         * @type {String}
         * @default 'none'
         */
        contentZooming: 'none',

        /**
         * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userDrag: 'none',

        /**
         * Overrides the highlight color shown when the user taps a link or a JavaScript
         * clickable element in iOS. This property obeys the alpha value, if specified.
         * @type {String}
         * @default 'rgba(0,0,0,0)'
         */
        tapHighlightColor: 'rgba(0,0,0,0)'
    }
};

var STOP = 1;
var FORCED_STOP = 2;

/**
 * Manager
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Manager(element, options) {
    this.options = assign({}, Hammer.defaults, options || {});

    this.options.inputTarget = this.options.inputTarget || element;

    this.handlers = {};
    this.session = {};
    this.recognizers = [];
    this.oldCssProps = {};

    this.element = element;
    this.input = createInputInstance(this);
    this.touchAction = new TouchAction(this, this.options.touchAction);

    toggleCssProps(this, true);

    each(this.options.recognizers, function(item) {
        var recognizer = this.add(new (item[0])(item[1]));
        item[2] && recognizer.recognizeWith(item[2]);
        item[3] && recognizer.requireFailure(item[3]);
    }, this);
}

Manager.prototype = {
    /**
     * set options
     * @param {Object} options
     * @returns {Manager}
     */
    set: function(options) {
        assign(this.options, options);

        // Options that need a little more setup
        if (options.touchAction) {
            this.touchAction.update();
        }
        if (options.inputTarget) {
            // Clean up existing event listeners and reinitialize
            this.input.destroy();
            this.input.target = options.inputTarget;
            this.input.init();
        }
        return this;
    },

    /**
     * stop recognizing for this session.
     * This session will be discarded, when a new [input]start event is fired.
     * When forced, the recognizer cycle is stopped immediately.
     * @param {Boolean} [force]
     */
    stop: function(force) {
        this.session.stopped = force ? FORCED_STOP : STOP;
    },

    /**
     * run the recognizers!
     * called by the inputHandler function on every movement of the pointers (touches)
     * it walks through all the recognizers and tries to detect the gesture that is being made
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        var session = this.session;
        if (session.stopped) {
            return;
        }

        // run the touch-action polyfill
        this.touchAction.preventDefaults(inputData);

        var recognizer;
        var recognizers = this.recognizers;

        // this holds the recognizer that is being recognized.
        // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
        // if no recognizer is detecting a thing, it is set to `null`
        var curRecognizer = session.curRecognizer;

        // reset when the last recognizer is recognized
        // or when we're in a new session
        if (!curRecognizer || (curRecognizer && curRecognizer.state & STATE_RECOGNIZED)) {
            curRecognizer = session.curRecognizer = null;
        }

        var i = 0;
        while (i < recognizers.length) {
            recognizer = recognizers[i];

            // find out if we are allowed try to recognize the input for this one.
            // 1.   allow if the session is NOT forced stopped (see the .stop() method)
            // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
            //      that is being recognized.
            // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
            //      this can be setup with the `recognizeWith()` method on the recognizer.
            if (session.stopped !== FORCED_STOP && ( // 1
                    !curRecognizer || recognizer == curRecognizer || // 2
                    recognizer.canRecognizeWith(curRecognizer))) { // 3
                recognizer.recognize(inputData);
            } else {
                recognizer.reset();
            }

            // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
            // current active recognizer. but only if we don't already have an active recognizer
            if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
                curRecognizer = session.curRecognizer = recognizer;
            }
            i++;
        }
    },

    /**
     * get a recognizer by its event name.
     * @param {Recognizer|String} recognizer
     * @returns {Recognizer|Null}
     */
    get: function(recognizer) {
        if (recognizer instanceof Recognizer) {
            return recognizer;
        }

        var recognizers = this.recognizers;
        for (var i = 0; i < recognizers.length; i++) {
            if (recognizers[i].options.event == recognizer) {
                return recognizers[i];
            }
        }
        return null;
    },

    /**
     * add a recognizer to the manager
     * existing recognizers with the same event name will be removed
     * @param {Recognizer} recognizer
     * @returns {Recognizer|Manager}
     */
    add: function(recognizer) {
        if (invokeArrayArg(recognizer, 'add', this)) {
            return this;
        }

        // remove existing
        var existing = this.get(recognizer.options.event);
        if (existing) {
            this.remove(existing);
        }

        this.recognizers.push(recognizer);
        recognizer.manager = this;

        this.touchAction.update();
        return recognizer;
    },

    /**
     * remove a recognizer by name or instance
     * @param {Recognizer|String} recognizer
     * @returns {Manager}
     */
    remove: function(recognizer) {
        if (invokeArrayArg(recognizer, 'remove', this)) {
            return this;
        }

        recognizer = this.get(recognizer);

        // let's make sure this recognizer exists
        if (recognizer) {
            var recognizers = this.recognizers;
            var index = inArray(recognizers, recognizer);

            if (index !== -1) {
                recognizers.splice(index, 1);
                this.touchAction.update();
            }
        }

        return this;
    },

    /**
     * bind event
     * @param {String} events
     * @param {Function} handler
     * @returns {EventEmitter} this
     */
    on: function(events, handler) {
        if (events === undefined) {
            return;
        }
        if (handler === undefined) {
            return;
        }

        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            handlers[event] = handlers[event] || [];
            handlers[event].push(handler);
        });
        return this;
    },

    /**
     * unbind event, leave emit blank to remove all handlers
     * @param {String} events
     * @param {Function} [handler]
     * @returns {EventEmitter} this
     */
    off: function(events, handler) {
        if (events === undefined) {
            return;
        }

        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            if (!handler) {
                delete handlers[event];
            } else {
                handlers[event] && handlers[event].splice(inArray(handlers[event], handler), 1);
            }
        });
        return this;
    },

    /**
     * emit event to the listeners
     * @param {String} event
     * @param {Object} data
     */
    emit: function(event, data) {
        // we also want to trigger dom events
        if (this.options.domEvents) {
            triggerDomEvent(event, data);
        }

        // no handlers, so skip it all
        var handlers = this.handlers[event] && this.handlers[event].slice();
        if (!handlers || !handlers.length) {
            return;
        }

        data.type = event;
        data.preventDefault = function() {
            data.srcEvent.preventDefault();
        };

        var i = 0;
        while (i < handlers.length) {
            handlers[i](data);
            i++;
        }
    },

    /**
     * destroy the manager and unbinds all events
     * it doesn't unbind dom events, that is the user own responsibility
     */
    destroy: function() {
        this.element && toggleCssProps(this, false);

        this.handlers = {};
        this.session = {};
        this.input.destroy();
        this.element = null;
    }
};

/**
 * add/remove the css properties as defined in manager.options.cssProps
 * @param {Manager} manager
 * @param {Boolean} add
 */
function toggleCssProps(manager, add) {
    var element = manager.element;
    if (!element.style) {
        return;
    }
    var prop;
    each(manager.options.cssProps, function(value, name) {
        prop = prefixed(element.style, name);
        if (add) {
            manager.oldCssProps[prop] = element.style[prop];
            element.style[prop] = value;
        } else {
            element.style[prop] = manager.oldCssProps[prop] || '';
        }
    });
    if (!add) {
        manager.oldCssProps = {};
    }
}

/**
 * trigger dom event
 * @param {String} event
 * @param {Object} data
 */
function triggerDomEvent(event, data) {
    var gestureEvent = document.createEvent('Event');
    gestureEvent.initEvent(event, true, true);
    gestureEvent.gesture = data;
    data.target.dispatchEvent(gestureEvent);
}

assign(Hammer, {
    INPUT_START: INPUT_START,
    INPUT_MOVE: INPUT_MOVE,
    INPUT_END: INPUT_END,
    INPUT_CANCEL: INPUT_CANCEL,

    STATE_POSSIBLE: STATE_POSSIBLE,
    STATE_BEGAN: STATE_BEGAN,
    STATE_CHANGED: STATE_CHANGED,
    STATE_ENDED: STATE_ENDED,
    STATE_RECOGNIZED: STATE_RECOGNIZED,
    STATE_CANCELLED: STATE_CANCELLED,
    STATE_FAILED: STATE_FAILED,

    DIRECTION_NONE: DIRECTION_NONE,
    DIRECTION_LEFT: DIRECTION_LEFT,
    DIRECTION_RIGHT: DIRECTION_RIGHT,
    DIRECTION_UP: DIRECTION_UP,
    DIRECTION_DOWN: DIRECTION_DOWN,
    DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
    DIRECTION_VERTICAL: DIRECTION_VERTICAL,
    DIRECTION_ALL: DIRECTION_ALL,

    Manager: Manager,
    Input: Input,
    TouchAction: TouchAction,

    TouchInput: TouchInput,
    MouseInput: MouseInput,
    PointerEventInput: PointerEventInput,
    TouchMouseInput: TouchMouseInput,
    SingleTouchInput: SingleTouchInput,

    Recognizer: Recognizer,
    AttrRecognizer: AttrRecognizer,
    Tap: TapRecognizer,
    Pan: PanRecognizer,
    Swipe: SwipeRecognizer,
    Pinch: PinchRecognizer,
    Rotate: RotateRecognizer,
    Press: PressRecognizer,

    on: addEventListeners,
    off: removeEventListeners,
    each: each,
    merge: merge,
    extend: extend,
    assign: assign,
    inherit: inherit,
    bindFn: bindFn,
    prefixed: prefixed
});

// this prevents errors when Hammer is loaded in the presence of an AMD
//  style loader but by script tag, not by the loader.
var freeGlobal = (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : {})); // jshint ignore:line
freeGlobal.Hammer = Hammer;

if (true) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
        return Hammer;
    }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else if (typeof module != 'undefined' && module.exports) {
    module.exports = Hammer;
} else {
    window[exportName] = Hammer;
}

})(window, document, 'Hammer');


/***/ }),

/***/ "./src async recursive":
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = "./src async recursive";

/***/ }),

/***/ "./src/app/app.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ":host {\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-flex: 1;\r\n      -ms-flex: 1;\r\n          flex: 1;\r\n}\r\n\r\n\r\n\r\n.avatar {\r\n  overflow: hidden;\r\n  width: 64px;\r\n  height: 64px;\r\n  border-radius: 50%;\r\n  margin: 12px;\r\n}\r\n\r\n/deep/ .mat-list-item-content {\r\n  height: auto !important;\r\n}\r\n\r\n.content {\r\n  padding: 12px;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "./src/app/app.component.html":
/***/ (function(module, exports) {

module.exports = "<app-home></app-home>\n"

/***/ }),

/***/ "./src/app/app.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var AppComponent = (function () {
    function AppComponent() {
    }
    return AppComponent;
}());
AppComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_10" /* Component */])({
        selector: 'app-root',
        template: __webpack_require__("./src/app/app.component.html"),
        styles: [__webpack_require__("./src/app/app.component.css")]
    }),
    __metadata("design:paramtypes", [])
], AppComponent);

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ "./src/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__("./node_modules/@angular/platform-browser/@angular/platform-browser.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__("./node_modules/@angular/forms/@angular/forms.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__("./node_modules/@angular/http/@angular/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_material__ = __webpack_require__("./node_modules/@angular/material/@angular/material.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_platform_browser_animations__ = __webpack_require__("./node_modules/@angular/platform-browser/@angular/platform-browser/animations.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_flex_layout__ = __webpack_require__("./node_modules/@angular/flex-layout/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_hammerjs__ = __webpack_require__("../node_modules/hammerjs/hammer.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_hammerjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_hammerjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_app_app_routing__ = __webpack_require__("./src/app/app.routing.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__services_authentication_auth_guard_service__ = __webpack_require__("./src/app/services/authentication/auth-guard.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_app_services_authentication_auth_service__ = __webpack_require__("./src/app/services/authentication/auth.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_app_modules_authentication_authentication_api__ = __webpack_require__("./src/app/modules/authentication/authentication-api.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_app_modules_framework_framework_module__ = __webpack_require__("./src/app/modules/framework/framework.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__modules_farmer_farmer_module__ = __webpack_require__("./src/app/modules/farmer/farmer.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__app_component__ = __webpack_require__("./src/app/app.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__components_home_home_component__ = __webpack_require__("./src/app/components/home/home.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16_app_components_common_page_not_found_component__ = __webpack_require__("./src/app/components/common/page-not-found.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__components_default_content_default_content_component__ = __webpack_require__("./src/app/components/default-content/default-content.component.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
//Libraries








//Routes

//Services



//Modules


//Component




var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["b" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_14__app_component__["a" /* AppComponent */],
            __WEBPACK_IMPORTED_MODULE_15__components_home_home_component__["a" /* HomeComponent */],
            __WEBPACK_IMPORTED_MODULE_16_app_components_common_page_not_found_component__["a" /* PageNotFoundComponent */],
            __WEBPACK_IMPORTED_MODULE_17__components_default_content_default_content_component__["a" /* DefaultContentComponent */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormsModule */],
            __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* HttpModule */],
            __WEBPACK_IMPORTED_MODULE_6__angular_flex_layout__["FlexLayoutModule"],
            __WEBPACK_IMPORTED_MODULE_5__angular_platform_browser_animations__["a" /* BrowserAnimationsModule */],
            __WEBPACK_IMPORTED_MODULE_4__angular_material__["a" /* MaterialModule */],
            __WEBPACK_IMPORTED_MODULE_4__angular_material__["b" /* MdNativeDateModule */],
            //Custom Module
            __WEBPACK_IMPORTED_MODULE_12_app_modules_framework_framework_module__["a" /* FrameworkModule */],
            __WEBPACK_IMPORTED_MODULE_13__modules_farmer_farmer_module__["a" /* FarmerModule */],
            //The order of route configuration matters.
            __WEBPACK_IMPORTED_MODULE_8_app_app_routing__["a" /* AppRoutingModule */]
        ],
        exports: [],
        providers: [
            __WEBPACK_IMPORTED_MODULE_10_app_services_authentication_auth_service__["a" /* AuthenticationService */],
            { provide: __WEBPACK_IMPORTED_MODULE_11_app_modules_authentication_authentication_api__["a" /* AuthenticationApi */], useExisting: __WEBPACK_IMPORTED_MODULE_10_app_services_authentication_auth_service__["a" /* AuthenticationService */] },
            __WEBPACK_IMPORTED_MODULE_9__services_authentication_auth_guard_service__["a" /* AuthGuard */]
        ],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_14__app_component__["a" /* AppComponent */]]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ "./src/app/app.routing.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("./node_modules/@angular/router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_app_components_common_page_not_found_component__ = __webpack_require__("./src/app/components/common/page-not-found.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_app_components_default_content_default_content_component__ = __webpack_require__("./src/app/components/default-content/default-content.component.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppRoutingModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




var appRoutes = [
    { path: 'login', component: __WEBPACK_IMPORTED_MODULE_3_app_components_default_content_default_content_component__["a" /* DefaultContentComponent */] },
    { path: 'register', component: __WEBPACK_IMPORTED_MODULE_3_app_components_default_content_default_content_component__["a" /* DefaultContentComponent */] },
    { path: '', component: __WEBPACK_IMPORTED_MODULE_3_app_components_default_content_default_content_component__["a" /* DefaultContentComponent */] },
    { path: '**', component: __WEBPACK_IMPORTED_MODULE_2_app_components_common_page_not_found_component__["a" /* PageNotFoundComponent */] }
];
var AppRoutingModule = (function () {
    function AppRoutingModule() {
    }
    return AppRoutingModule;
}());
AppRoutingModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["b" /* NgModule */])({
        imports: [
            __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* RouterModule */].forRoot(appRoutes)
        ],
        exports: [
            __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* RouterModule */]
        ]
    })
], AppRoutingModule);

//# sourceMappingURL=app.routing.js.map

/***/ }),

/***/ "./src/app/components/common/page-not-found.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PageNotFoundComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var PageNotFoundComponent = (function () {
    function PageNotFoundComponent() {
    }
    return PageNotFoundComponent;
}());
PageNotFoundComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_10" /* Component */])({
        template: "\n    <h1>This is not the page you were looking for!</h1>\n    "
    })
], PageNotFoundComponent);

//# sourceMappingURL=page-not-found.component.js.map

/***/ }),

/***/ "./src/app/components/default-content/default-content.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "firstContent{\r\n  width: 100%;\r\n  height: 100%;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "./src/app/components/default-content/default-content.component.html":
/***/ (function(module, exports) {

module.exports = "<div>\n  <md-card class=\"firstContent\" style=\"margin-bottom: 20px !important;\">Everything about the farmer fvgavgfevgfdvsdvdsgfrvbdsrbrsbsdr</md-card>\n  <md-card class=\"firstContent\">Everything about the farm Machincary fvgavgfevgfdvsdvdsgfrvbdsrbrsbsdr</md-card>\n</div>\n"

/***/ }),

/***/ "./src/app/components/default-content/default-content.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DefaultContentComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var DefaultContentComponent = (function () {
    function DefaultContentComponent() {
    }
    DefaultContentComponent.prototype.ngOnInit = function () {
    };
    return DefaultContentComponent;
}());
DefaultContentComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_10" /* Component */])({
        selector: 'app-default-content',
        template: __webpack_require__("./src/app/components/default-content/default-content.component.html"),
        styles: [__webpack_require__("./src/app/components/default-content/default-content.component.css")]
    }),
    __metadata("design:paramtypes", [])
], DefaultContentComponent);

//# sourceMappingURL=default-content.component.js.map

/***/ }),

/***/ "./src/app/components/home/home.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ":host {\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-orient: vertical;\r\n  -webkit-box-direction: normal;\r\n      -ms-flex-direction: column;\r\n          flex-direction: column;\r\n  -webkit-box-flex: 1;\r\n      -ms-flex: 1;\r\n          flex: 1;\r\n}\r\n.avatar {\r\n  overflow: hidden;\r\n  width: 64px;\r\n  height: 64px;\r\n  border-radius: 50%;\r\n  margin: 12px;\r\n}\r\n\r\n/deep/ .mat-list-item-content {\r\n  height: auto !important;\r\n}\r\n\r\n.content {\r\n  padding: 12px;\r\n}\r\n.example-container {\r\n  width: 500px;\r\n  height: 300px;\r\n  border: 1px solid rgba(0, 0, 0, 0.5);\r\n}\r\n\r\n.example-sidenav-content {\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  height: 100%;\r\n  -webkit-box-align: center;\r\n      -ms-flex-align: center;\r\n          align-items: center;\r\n  -webkit-box-pack: center;\r\n      -ms-flex-pack: center;\r\n          justify-content: center;\r\n}\r\n\r\n.example-sidenav {\r\n  padding: 20px;\r\n}\r\n\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "./src/app/components/home/home.component.html":
/***/ (function(module, exports) {

module.exports = "<div>\n  <fw-framework-body></fw-framework-body>\n</div>\n"

/***/ }),

/***/ "./src/app/components/home/home.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomeComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var HomeComponent = (function () {
    function HomeComponent() {
    }
    HomeComponent.prototype.ngOnInit = function () {
    };
    return HomeComponent;
}());
HomeComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_10" /* Component */])({
        selector: 'app-home',
        template: __webpack_require__("./src/app/components/home/home.component.html"),
        styles: [__webpack_require__("./src/app/components/home/home.component.css")]
    }),
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(),
    __metadata("design:paramtypes", [])
], HomeComponent);

//# sourceMappingURL=home.component.js.map

/***/ }),

/***/ "./src/app/modules/authentication/authentication-api.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthenticationApi; });
var AuthenticationApi = (function () {
    function AuthenticationApi() {
    }
    return AuthenticationApi;
}());

//# sourceMappingURL=authentication-api.js.map

/***/ }),

/***/ "./src/app/modules/authentication/authentication.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".fa-facebook-square{\r\n  color:#3b5998;\r\n}\r\n\r\n.fa-google-plus-square{\r\n  color: #dd4b39;\r\n}\r\n\r\n.googleButton{\r\n  /*background-color: #dd4b39;*/\r\n  width: 40%;\r\n}\r\n\r\n.facebookButton{\r\n  /*background-color: #3b5998;*/\r\n  width: 40%;\r\n}\r\n\r\n.mainDialogContainer{\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-orient: vertical;\r\n  -webkit-box-direction: normal;\r\n      -ms-flex-direction: column;\r\n          flex-direction: column;\r\n  font-size: small;\r\n  height: 100%;\r\n  width: 100%;\r\n}\r\n.authContainer{\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-orient: horizontal;\r\n  -webkit-box-direction: normal;\r\n      -ms-flex-direction: row;\r\n          flex-direction: row;\r\n  -webkit-box-pack: center;\r\n      -ms-flex-pack: center;\r\n          justify-content: center;\r\n}\r\n.tabContainer{\r\n  -webkit-box-orient: horizontal;\r\n  -webkit-box-direction: normal;\r\n      -ms-flex-direction: row;\r\n          flex-direction: row;\r\n  -webkit-box-pack: start;\r\n      -ms-flex-pack: start;\r\n          justify-content: flex-start;\r\n}\r\n\r\n.socialMediaRow{\r\n  -ms-flex-pack: distribute;\r\n      justify-content: space-around;\r\n}\r\n\r\n.fab-top-right {\r\n  position: absolute;\r\n}\r\n\r\n/deep/ .mat-dialog-container{\r\npadding: 14px;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "./src/app/modules/authentication/authentication.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"mainDialogContainer\">\r\n  <div class=\"authContainer\">\r\n    <div class=\"tabContainer\">\r\n      <md-tab-group>\r\n        <md-tab label=\"LogIn\">\r\n              <fw-login></fw-login>\r\n        </md-tab>\r\n        <md-tab  label=\"Register\">\r\n              <fw-register></fw-register>\r\n        </md-tab>\r\n      </md-tab-group>\r\n    </div>\r\n  </div>\r\n  <span fxFlex></span>\r\n  <div fxLayout=\"column\">\r\n    <md-divider ></md-divider>\r\n    <div class=\"padding-top5 text-align-center\"><span>Or start with ..</span></div>\r\n    <div class=\"padding-top5 socialMediaRow\" fxLayout=\"row\">\r\n      <a md-raised-button (click)=\"onClick('facebook')\" class=\"facebookButton\">\r\n        <i class=\"fa fa-facebook-square fa-2x\"></i>\r\n        <span class=\"padding-left5\">Facebook</span>\r\n      </a>\r\n      <a md-raised-button (click)=\"onClick('google')\" class=\"googleButton\">\r\n        <i class=\"fa fa-google-plus-square fa-2x\"></i>\r\n        <span class=\"padding-left5\">Google</span>\r\n      </a>\r\n    </div>\r\n    <div style=\"margin-top:10px;font-size: x-small; text-align:center\">We will never post anything without your permission.</div>\r\n  </div>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/modules/authentication/authentication.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_material__ = __webpack_require__("./node_modules/@angular/material/@angular/material.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__authentication_api__ = __webpack_require__("./src/app/modules/authentication/authentication-api.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_router__ = __webpack_require__("./node_modules/@angular/router/@angular/router.es5.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthenticationComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var AuthenticationComponent = (function () {
    function AuthenticationComponent(dialogRef, authApi, router) {
        this.dialogRef = dialogRef;
        this.authApi = authApi;
        this.router = router;
    }
    AuthenticationComponent.prototype.onClose = function (v) {
        console.log('closing');
        this.dialogRef.close(true);
    };
    AuthenticationComponent.prototype.onClick = function (connectWith) {
        var _this = this;
        console.log('connecting:' + connectWith);
        if (connectWith.match('facebook')) {
            this.authApi.connectWithFacebook()
                .subscribe(function (data) {
                console.log('got valid facebook: ', data);
                _this.dialogRef.close(true);
                _this.router.navigate(['/authenticated']);
            }, function (err) {
                console.log('got error: ', err);
            });
        }
        else if (connectWith.match('google')) {
            this.authApi.connectWithGoogle()
                .subscribe(function (data) {
                console.log('got valid google: ', data);
                _this.dialogRef.close(true);
                _this.router.navigate(['/authenticated']);
            }, function (err) {
                console.log('got error: ', err);
            });
        }
    };
    return AuthenticationComponent;
}());
AuthenticationComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_10" /* Component */])({
        selector: 'fw-authentication',
        template: __webpack_require__("./src/app/modules/authentication/authentication.component.html"),
        styles: [__webpack_require__("./src/app/modules/authentication/authentication.component.css")],
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_material__["c" /* MdDialogRef */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_material__["c" /* MdDialogRef */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__authentication_api__["a" /* AuthenticationApi */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__authentication_api__["a" /* AuthenticationApi */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* Router */]) === "function" && _c || Object])
], AuthenticationComponent);

var _a, _b, _c;
//# sourceMappingURL=authentication.component.js.map

/***/ }),

/***/ "./src/app/modules/authentication/login/login.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".logInForm{\r\n  text-align: center;\r\n}\r\n\r\n.rememberCheckBox{\r\n  -webkit-box-pack: start;\r\n      -ms-flex-pack: start;\r\n          justify-content: flex-start;\r\n  padding-bottom: 8px;\r\n  font-size: x-small;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "./src/app/modules/authentication/login/login.component.html":
/***/ (function(module, exports) {

module.exports = "<form class=\"logInForm\" #logInForm=\"ngForm\" (ngSubmit)=\"onSubmit(logInForm)\" ngNativeValidate>\n  <div fxLayout=\"column\" cellspacing=\"0\">\n    <md-input-container>\n      <input mdInput ngModel name=\"userName\" ngModel #userName=\"ngModel\" placeholder=\"Mobile No./Email Address\" required>\n    </md-input-container>\n\n    <md-input-container >\n      <input mdInput ngModel name=\"password\" ngModel #password=\"ngModel\" placeholder=\"Password\" required>\n    </md-input-container>\n\n    <md-checkbox  name=\"rememberMe\" ngModel  fxLayout=\"row\" class=\"rememberCheckBox\">Remember me!</md-checkbox>\n\n    <button md-button type=\"submit\" style=\"background-color:lightblue\" color=\"white\">LogIn</button>\n  </div>\n  <p style=\"font-size: x-small;\">By Signing in you agree to T&C and Privacy Policy</p>\n</form>\n"

/***/ }),

/***/ "./src/app/modules/authentication/login/login.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("./node_modules/@angular/router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__authentication_api__ = __webpack_require__("./src/app/modules/authentication/authentication-api.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__authentication_component__ = __webpack_require__("./src/app/modules/authentication/authentication.component.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LogInComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var LogInComponent = (function () {
    function LogInComponent(authApi, router, authComp) {
        this.authApi = authApi;
        this.router = router;
        this.authComp = authComp;
        this.submitting = false;
    }
    LogInComponent.prototype.onSubmit = function (logInForm) {
        var _this = this;
        if (logInForm.valid) {
            console.log('submitting...', logInForm.value);
            this.submitting = true;
            this.formError = null;
            this.authApi.logIn(logInForm.value)
                .subscribe(function (data) {
                console.log('got valid: ', data);
                //this.onDClose.emit(true);
                _this.authComp.onClose(true);
                _this.router.navigate(['/farmer']);
            }, function (err) {
                _this.submitting = false;
                console.log('got error: ', err);
                _this.formError = err;
            });
        }
    };
    LogInComponent.prototype.ngOnInit = function () {
    };
    return LogInComponent;
}());
LogInComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_10" /* Component */])({
        selector: 'fw-login',
        template: __webpack_require__("./src/app/modules/authentication/login/login.component.html"),
        styles: [__webpack_require__("./src/app/modules/authentication/login/login.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__authentication_api__["a" /* AuthenticationApi */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__authentication_api__["a" /* AuthenticationApi */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__authentication_component__["a" /* AuthenticationComponent */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__authentication_component__["a" /* AuthenticationComponent */]) === "function" && _c || Object])
], LogInComponent);

var _a, _b, _c;
//# sourceMappingURL=login.component.js.map

/***/ }),

/***/ "./src/app/modules/authentication/register/register.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "/deep/ .mat-select-trigger{\r\nfont-size: small;\r\n}\r\n/deep/ .mat-select-trigger{\r\n  padding: 0px;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "./src/app/modules/authentication/register/register.component.html":
/***/ (function(module, exports) {

module.exports = "<form #registerForm=\"ngForm\" (ngSubmit)=\"onSubmit(registerForm)\" ngNativeValidate>\n  <div fxLayout=\"column\" cellspacing=\"0\">\n    <md-select style=\"font-size:small\" placeholder=\"Choose your role\" required>\n      <md-option *ngFor=\"let role of Roles\" [value]=\"role.name\">{{ role.name }}</md-option>\n    </md-select>\n    <md-input-container>\n      <input mdInput ngModel name=\"name\" placeholder=\"Name\" required>\n    </md-input-container>\n    <md-input-container>\n      <input mdInput ngModel name=\"phone\" placeholder=\"Phone No.\" required>\n    </md-input-container>\n    <md-input-container>\n      <input mdInput ngModel name=\"email\" placeholder=\"Email\" required>\n    </md-input-container>\n    <md-input-container>\n      <input mdInput ngModel name=\"password\" placeholder=\"Password\" required>\n    </md-input-container>\n    <md-input-container>\n      <input mdInput ngModel name=\"confirmPassword\" placeholder=\"Confirm Password\" required>\n    </md-input-container>\n    <button md-button style=\"background-color:lightblue\" color=\"white\">Create Account</button>\n  </div>\n  <div style=\"margin-top:10px; text-align:center; font-size: x-small\">By creating account with aim, I agree to Terms of Services</div>\n</form>\n"

/***/ }),

/***/ "./src/app/modules/authentication/register/register.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("./node_modules/@angular/router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__authentication_api__ = __webpack_require__("./src/app/modules/authentication/authentication-api.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__authentication_component__ = __webpack_require__("./src/app/modules/authentication/authentication.component.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RegisterComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var RegisterComponent = (function () {
    function RegisterComponent(authApi, router, authComp) {
        this.authApi = authApi;
        this.router = router;
        this.authComp = authComp;
        this.submitting = false;
        this.Roles = [
            { name: "Farmer" },
            { name: "Transporter" },
            { name: "WareHouse Owner" },
            { name: "Service Provider" },
            { name: "Advisor" },
            { name: "Agriculutre Institute" },
            { name: "Individual Seller/Buyer" }
        ];
    }
    RegisterComponent.prototype.ngOnInit = function () {
    };
    RegisterComponent.prototype.onSubmit = function (registerForm) {
        var _this = this;
        if (registerForm.valid) {
            console.log('submitting...', registerForm.value);
            this.submitting = true;
            this.formError = null;
            this.authApi.register(registerForm.value)
                .subscribe(function (data) {
                console.log('got valid: ', data);
                //this.onDClose.emit(true);
                _this.authComp.onClose(true);
                _this.router.navigate(['/authenticated']);
            }, function (err) {
                _this.submitting = false;
                console.log('got error: ', err);
                _this.formError = err;
            });
        }
    };
    return RegisterComponent;
}());
RegisterComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_10" /* Component */])({
        selector: 'fw-register',
        template: __webpack_require__("./src/app/modules/authentication/register/register.component.html"),
        styles: [__webpack_require__("./src/app/modules/authentication/register/register.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__authentication_api__["a" /* AuthenticationApi */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__authentication_api__["a" /* AuthenticationApi */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__authentication_component__["a" /* AuthenticationComponent */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__authentication_component__["a" /* AuthenticationComponent */]) === "function" && _c || Object])
], RegisterComponent);

var _a, _b, _c;
//# sourceMappingURL=register.component.js.map

/***/ }),

/***/ "./src/app/modules/farmer/farmer.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".farmer-container{\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -ms-flex-pack: distribute;\r\n      justify-content: space-around;\r\n  -webkit-box-align: start;\r\n      -ms-flex-align: start;\r\n          align-items: flex-start;\r\n  -webkit-box-orient: horizontal;\r\n  -webkit-box-direction: normal;\r\n      -ms-flex-direction: row;\r\n          flex-direction: row;\r\n  -ms-flex-wrap: nowrap;\r\n      flex-wrap: nowrap;\r\n  padding: 10px;\r\n  width: 100%;\r\n  height:100%;\r\n}\r\n.secondaryContainer{\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-padding-start: 10px;\r\n          padding-inline-start: 10px;\r\n  -webkit-padding-end: 10px;\r\n          padding-inline-end: 10px;\r\n  overflow: hidden;\r\n}\r\n\r\n.farmer-menu{\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  border: 1px solid #dddddd;\r\n}\r\n\r\n/deep/ .md-card{\r\n  padding: 20px;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "./src/app/modules/farmer/farmer.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"farmer-container\">\n  <div class=\"farmer-menu\">\n    <md-card>\n      <fw-vertical-menu [itemList]=\"items\">\n      </fw-vertical-menu>\n    </md-card>\n  </div>\n  <div class=\"secondaryContainer\">\n    <router-outlet></router-outlet>\n  </div>\n  <div fxFlex></div>\n</div>\n"

/***/ }),

/***/ "./src/app/modules/farmer/farmer.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FarmerComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var FarmerComponent = (function () {
    function FarmerComponent() {
        this.items = [
            { name: 'My Account', link: '/farmer/profile', icon: 'home' },
            { name: 'Order & Payment Details',
                link: '',
                subMenuItem: [
                    { name: 'Buy', link: '/farmer/order/buy' },
                    { name: 'Sell', link: '/farmer/order/sell' },
                    { name: 'Services', link: '/farmer/order/services' },
                    { name: 'Rent', link: '/farmer/order/rent' }
                ],
                icon: 'add_box'
            },
            { name: 'Messages and Notifications',
                link: '',
                subMenuItem: [
                    { name: 'My Chats', link: '' },
                    { name: 'Alerts', link: '' },
                    { name: 'My Offers', link: '' }
                ],
                icon: 'email'
            },
            { name: 'My Ads', link: '/farmer/order', icon: 'event_note' },
            { name: 'My Product', link: '/farmer/profile', icon: 'view_list' }
        ];
    }
    FarmerComponent.prototype.ngOnInit = function () {
    };
    return FarmerComponent;
}());
FarmerComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_10" /* Component */])({
        selector: 'app-farmer',
        template: __webpack_require__("./src/app/modules/farmer/farmer.component.html"),
        styles: [__webpack_require__("./src/app/modules/farmer/farmer.component.css")]
    }),
    __metadata("design:paramtypes", [])
], FarmerComponent);

//# sourceMappingURL=farmer.component.js.map

/***/ }),

/***/ "./src/app/modules/farmer/farmer.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__("./node_modules/@angular/platform-browser/@angular/platform-browser.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__("./node_modules/@angular/forms/@angular/forms.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__("./node_modules/@angular/http/@angular/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_material__ = __webpack_require__("./node_modules/@angular/material/@angular/material.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_platform_browser_animations__ = __webpack_require__("./node_modules/@angular/platform-browser/@angular/platform-browser/animations.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_flex_layout__ = __webpack_require__("./node_modules/@angular/flex-layout/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_hammerjs__ = __webpack_require__("../node_modules/hammerjs/hammer.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_hammerjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_hammerjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__services_authentication_auth_guard_service__ = __webpack_require__("./src/app/services/authentication/auth-guard.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_app_services_authentication_auth_service__ = __webpack_require__("./src/app/services/authentication/auth.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__authentication_authentication_api__ = __webpack_require__("./src/app/modules/authentication/authentication-api.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__framework_framework_module__ = __webpack_require__("./src/app/modules/framework/framework.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__farmer_component__ = __webpack_require__("./src/app/modules/farmer/farmer.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_app_modules_farmer_order_farmer_order_component__ = __webpack_require__("./src/app/modules/farmer/order/farmer-order.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_app_modules_farmer_profile_farmer_profile_component__ = __webpack_require__("./src/app/modules/farmer/profile/farmer-profile.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_app_modules_farmer_farmer_routing__ = __webpack_require__("./src/app/modules/farmer/farmer.routing.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16_app_modules_farmer_order_buy_order_buy_component__ = __webpack_require__("./src/app/modules/farmer/order/buy/order-buy.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17_app_modules_farmer_order_rent_order_rent_component__ = __webpack_require__("./src/app/modules/farmer/order/rent/order-rent.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18_app_modules_farmer_order_sell_order_sell_component__ = __webpack_require__("./src/app/modules/farmer/order/sell/order-sell.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19_app_modules_farmer_order_services_order_services_component__ = __webpack_require__("./src/app/modules/farmer/order/services/order-services.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20_app_modules_farmer_order_new_order_new_order_component__ = __webpack_require__("./src/app/modules/farmer/order/new-order/new-order.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21_app_modules_farmer_order_new_order_create_order_create_order_component__ = __webpack_require__("./src/app/modules/farmer/order/new-order/create-order/create-order.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22_app_services_farmer_farmer_service__ = __webpack_require__("./src/app/services/farmer/farmer.service.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FarmerModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
//Libraries








//Services



//Modules

//Component











var FarmerModule = (function () {
    function FarmerModule() {
    }
    return FarmerModule;
}());
FarmerModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["b" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_12__farmer_component__["a" /* FarmerComponent */],
            __WEBPACK_IMPORTED_MODULE_13_app_modules_farmer_order_farmer_order_component__["a" /* FarmerOrderComponent */],
            __WEBPACK_IMPORTED_MODULE_16_app_modules_farmer_order_buy_order_buy_component__["a" /* OrderBuyComponent */],
            __WEBPACK_IMPORTED_MODULE_17_app_modules_farmer_order_rent_order_rent_component__["a" /* OrderRentComponent */],
            __WEBPACK_IMPORTED_MODULE_18_app_modules_farmer_order_sell_order_sell_component__["a" /* OrderSellComponent */],
            __WEBPACK_IMPORTED_MODULE_19_app_modules_farmer_order_services_order_services_component__["a" /* OrderServicesComponent */],
            __WEBPACK_IMPORTED_MODULE_21_app_modules_farmer_order_new_order_create_order_create_order_component__["a" /* CreateOrderComponent */],
            __WEBPACK_IMPORTED_MODULE_20_app_modules_farmer_order_new_order_new_order_component__["a" /* NewOrderComponent */],
            __WEBPACK_IMPORTED_MODULE_14_app_modules_farmer_profile_farmer_profile_component__["a" /* FarmerProfileComponent */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormsModule */],
            __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* HttpModule */],
            __WEBPACK_IMPORTED_MODULE_6__angular_flex_layout__["FlexLayoutModule"],
            __WEBPACK_IMPORTED_MODULE_5__angular_platform_browser_animations__["a" /* BrowserAnimationsModule */],
            __WEBPACK_IMPORTED_MODULE_11__framework_framework_module__["a" /* FrameworkModule */],
            __WEBPACK_IMPORTED_MODULE_4__angular_material__["a" /* MaterialModule */],
            __WEBPACK_IMPORTED_MODULE_4__angular_material__["b" /* MdNativeDateModule */],
            __WEBPACK_IMPORTED_MODULE_15_app_modules_farmer_farmer_routing__["a" /* FarmerRoutingModule */]
        ],
        exports: [
            __WEBPACK_IMPORTED_MODULE_12__farmer_component__["a" /* FarmerComponent */],
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_9_app_services_authentication_auth_service__["a" /* AuthenticationService */],
            { provide: __WEBPACK_IMPORTED_MODULE_10__authentication_authentication_api__["a" /* AuthenticationApi */], useExisting: __WEBPACK_IMPORTED_MODULE_9_app_services_authentication_auth_service__["a" /* AuthenticationService */] },
            __WEBPACK_IMPORTED_MODULE_8__services_authentication_auth_guard_service__["a" /* AuthGuard */],
            __WEBPACK_IMPORTED_MODULE_22_app_services_farmer_farmer_service__["a" /* FarmerService */]
        ]
    })
], FarmerModule);

//# sourceMappingURL=farmer.module.js.map

/***/ }),

/***/ "./src/app/modules/farmer/farmer.routing.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("./node_modules/@angular/router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_authentication_auth_guard_service__ = __webpack_require__("./src/app/services/authentication/auth-guard.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_app_modules_farmer_farmer_component__ = __webpack_require__("./src/app/modules/farmer/farmer.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_app_modules_farmer_profile_farmer_profile_component__ = __webpack_require__("./src/app/modules/farmer/profile/farmer-profile.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_app_modules_farmer_order_services_order_services_component__ = __webpack_require__("./src/app/modules/farmer/order/services/order-services.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_app_modules_farmer_order_rent_order_rent_component__ = __webpack_require__("./src/app/modules/farmer/order/rent/order-rent.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_app_modules_farmer_order_sell_order_sell_component__ = __webpack_require__("./src/app/modules/farmer/order/sell/order-sell.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_app_modules_farmer_order_buy_order_buy_component__ = __webpack_require__("./src/app/modules/farmer/order/buy/order-buy.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_app_modules_farmer_order_new_order_new_order_component__ = __webpack_require__("./src/app/modules/farmer/order/new-order/new-order.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_app_modules_farmer_order_new_order_create_order_create_order_component__ = __webpack_require__("./src/app/modules/farmer/order/new-order/create-order/create-order.component.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FarmerRoutingModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};











var farmerRoutes = [
    {
        path: 'farmer',
        canActivate: [__WEBPACK_IMPORTED_MODULE_2__services_authentication_auth_guard_service__["a" /* AuthGuard */]],
        children: [
            {
                path: '',
                component: __WEBPACK_IMPORTED_MODULE_3_app_modules_farmer_farmer_component__["a" /* FarmerComponent */],
                children: [
                    { path: '', redirectTo: 'profile', pathMatch: 'full' },
                    { path: 'profile', component: __WEBPACK_IMPORTED_MODULE_4_app_modules_farmer_profile_farmer_profile_component__["a" /* FarmerProfileComponent */] },
                ]
            },
            {
                path: 'order',
                component: __WEBPACK_IMPORTED_MODULE_3_app_modules_farmer_farmer_component__["a" /* FarmerComponent */],
                children: [
                    { path: '', redirectTo: 'buy', pathMatch: 'full' },
                    { path: 'buy', component: __WEBPACK_IMPORTED_MODULE_8_app_modules_farmer_order_buy_order_buy_component__["a" /* OrderBuyComponent */] },
                    { path: 'sell', component: __WEBPACK_IMPORTED_MODULE_7_app_modules_farmer_order_sell_order_sell_component__["a" /* OrderSellComponent */] },
                    { path: 'rent', component: __WEBPACK_IMPORTED_MODULE_6_app_modules_farmer_order_rent_order_rent_component__["a" /* OrderRentComponent */] },
                    { path: 'services', component: __WEBPACK_IMPORTED_MODULE_5_app_modules_farmer_order_services_order_services_component__["a" /* OrderServicesComponent */] },
                ]
            },
            {
                path: 'neworder',
                component: __WEBPACK_IMPORTED_MODULE_9_app_modules_farmer_order_new_order_new_order_component__["a" /* NewOrderComponent */],
                children: [
                    { path: '', redirectTo: 'create/crop', pathMatch: 'full' },
                    { path: 'create/:category', component: __WEBPACK_IMPORTED_MODULE_10_app_modules_farmer_order_new_order_create_order_create_order_component__["a" /* CreateOrderComponent */] },
                ]
            }
        ]
    }
];
var FarmerRoutingModule = (function () {
    function FarmerRoutingModule() {
    }
    return FarmerRoutingModule;
}());
FarmerRoutingModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["b" /* NgModule */])({
        imports: [
            __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* RouterModule */].forChild(farmerRoutes)
        ],
        exports: [
            __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* RouterModule */]
        ]
    })
], FarmerRoutingModule);

//# sourceMappingURL=farmer.routing.js.map

/***/ }),

/***/ "./src/app/modules/farmer/order/buy/order-buy.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "./src/app/modules/farmer/order/buy/order-buy.component.html":
/***/ (function(module, exports) {

module.exports = "<div>\n<md-tab-group>\n  <md-tab label=\"Active Orders\"><fw-empty-order-cart></fw-empty-order-cart>\n  </md-tab>\n  <md-tab label=\"Delivered Orders\"><fw-empty-order-cart></fw-empty-order-cart></md-tab>\n  <md-tab label=\"Completed Orders\"><fw-empty-order-cart></fw-empty-order-cart></md-tab>\n</md-tab-group>\n</div>\n"

/***/ }),

/***/ "./src/app/modules/farmer/order/buy/order-buy.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OrderBuyComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var OrderBuyComponent = (function () {
    function OrderBuyComponent() {
    }
    OrderBuyComponent.prototype.ngOnInit = function () {
    };
    return OrderBuyComponent;
}());
OrderBuyComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_10" /* Component */])({
        selector: 'farmer-order-buy',
        template: __webpack_require__("./src/app/modules/farmer/order/buy/order-buy.component.html"),
        styles: [__webpack_require__("./src/app/modules/farmer/order/buy/order-buy.component.css")]
    }),
    __metadata("design:paramtypes", [])
], OrderBuyComponent);

//# sourceMappingURL=order-buy.component.js.map

/***/ }),

/***/ "./src/app/modules/farmer/order/farmer-order.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "./src/app/modules/farmer/order/farmer-order.component.html":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/modules/farmer/order/farmer-order.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FarmerOrderComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var FarmerOrderComponent = (function () {
    function FarmerOrderComponent() {
    }
    FarmerOrderComponent.prototype.ngOnInit = function () {
    };
    return FarmerOrderComponent;
}());
FarmerOrderComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_10" /* Component */])({
        selector: 'app-farmer-order',
        template: __webpack_require__("./src/app/modules/farmer/order/farmer-order.component.html"),
        styles: [__webpack_require__("./src/app/modules/farmer/order/farmer-order.component.css")]
    }),
    __metadata("design:paramtypes", [])
], FarmerOrderComponent);

//# sourceMappingURL=farmer-order.component.js.map

/***/ }),

/***/ "./src/app/modules/farmer/order/new-order/create-order/create-order.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "/deep/ .md-card{\r\n  padding: 20px;\r\n}\r\n\r\n.order-button\r\n{\r\n  height: 35px;\r\n  -webkit-box-pack: end;\r\n      -ms-flex-pack: end;\r\n          justify-content: flex-end;\r\n  padding-left: 10px;\r\n}\r\n\r\n\r\n.order-base{\r\n  border: 1px solid #dddddd;\r\n  width: 100%;\r\n}\r\n.order-edit-card{\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-orient: vertical;\r\n  -webkit-box-direction: normal;\r\n      -ms-flex-direction: column;\r\n          flex-direction: column;\r\n  -webkit-box-pack: center;\r\n      -ms-flex-pack: center;\r\n          justify-content: center;\r\n  padding: 10px;\r\n  -webkit-padding-after: 20px;\r\n          padding-block-end: 20px;\r\n}\r\n\r\n.edit-info{\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  margin-top:20px;\r\n  margin-bottom: 20px;\r\n}\r\n.edit-form{\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-orient: vertical;\r\n  -webkit-box-direction: normal;\r\n      -ms-flex-direction: column;\r\n          flex-direction: column;\r\n}\r\n\r\n.form-row{\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-orient: horizontal;\r\n  -webkit-box-direction: normal;\r\n      -ms-flex-direction: row;\r\n          flex-direction: row;\r\n}\r\n.form-column{\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-orient: vertical;\r\n  -webkit-box-direction: normal;\r\n      -ms-flex-direction: column;\r\n          flex-direction: column;\r\n  -ms-flex-wrap: wrap;\r\n      flex-wrap: wrap;\r\n}\r\n\r\n.form-row-column{\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-orient: vertical;\r\n  -webkit-box-direction: normal;\r\n      -ms-flex-direction: column;\r\n          flex-direction: column;\r\n}\r\n\r\n.title-row{\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-orient: horizontal;\r\n  -webkit-box-direction: normal;\r\n      -ms-flex-direction: row;\r\n          flex-direction: row;\r\n  -webkit-box-pack: center;\r\n      -ms-flex-pack: center;\r\n          justify-content: center;\r\n  -webkit-margin-after: 10px;\r\n          margin-block-end: 10px;\r\n}\r\n.same_Width\r\n{\r\n  min-width: 200px;\r\n  max-width:200px;\r\n}\r\n\r\n/deep/ .mat-select{\r\n  padding-bottom: 1.296875em;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "./src/app/modules/farmer/order/new-order/create-order/create-order.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"order-base\">\n  <md-card class=\"order-edit-card\">\n    <div class=\"title-row\">{{title}}</div>\n    <md-divider></md-divider>\n    <div class=\"edit-info\">\n      <form class=\"edit-form\">\n        <div class=\"form-row\">\n          <div class=\"form-column padding-right20\">\n              <md-select class=\"same_Width\" placeholder=\"Select Sub Category\" [(ngModel)]=\"newSellOrder.productSubCategory\" name=\"subCategory\">\n                <md-option *ngFor=\"let subcategory of subCategory\" [value]=\"subcategory\">{{ subcategory }}</md-option>\n              </md-select>\n              <md-select class=\"same_Width\" placeholder=\"Select variety\" [(ngModel)]=\"newSellOrder.variety\" name=\"variety\">\n                <md-option *ngFor=\"let v of variety\" [value]=\"v\">{{ v }}</md-option>\n              </md-select>\n              <md-input-container class=\"same_Width\">\n                <input mdInput placeholder=\"No Of Units\" value=\"123XXX\" [(ngModel)]=\"newSellOrder.noOfUnit\" name=\"noOfUnit\">\n              </md-input-container>\n          </div>\n          <div class=\"form-column padding-right20\">\n            <md-select class=\"same_Width\" placeholder=\"Select Type\" [(ngModel)]=\"newSellOrder.productType\" name=\"producttype\">\n              <md-option *ngFor=\"let t of type\" [value]=\"t\">{{ t }}</md-option>\n            </md-select>\n            <md-select class=\"same_Width\" placeholder=\"Select Units\" [(ngModel)]=\"newSellOrder.productUnitType\" name=\"productunit\">\n              <md-option *ngFor=\"let u of units\" [value]=\"u\">{{ u }}</md-option>\n            </md-select>\n            <md-input-container class=\"same_Width\">\n              <input mdInput placeholder=\"Rate Per Unit\" value=\"200XXX\" [(ngModel)]=\"newSellOrder.ratePerUnit\" name=\"productrate\">\n            </md-input-container>\n          </div>\n        </div>\n        <div class=\"form-row\">\n          <md-input-container>\n            <input mdInput [mdDatepicker]=\"picker\" placeholder=\"Choose a date\" [(ngModel)]=\"newSellOrder.orderDate\" name=\"orderDate\">\n            <button mdSuffix [mdDatepickerToggle]=\"picker\"></button>\n          </md-input-container>\n          <md-datepicker #picker></md-datepicker>\n        </div>\n        <div class=\"form-row\">\n          <md-input-container class=\"grow\">\n            <textarea mdInput placeholder=\"Description\" [(ngModel)]=\"newSellOrder.description\" name=\"description\">1600 Amphitheatre Pkwy</textarea>\n          </md-input-container>\n        </div>\n        <div class=\"form-row\">\n        <div>\n          <a color=\"primary\" md-raised-button (click)=\"OnAddNewOrder()\">Add New Order</a>\n          <span class=\"spacer\"></span>\n        </div>\n        <div fxFlex></div>\n        <div>\n          <a color=\"primary\" md-raised-button (click)=\"OnReset()\">Reset</a>\n          <span class=\"spacer\"></span>\n        </div>\n        </div>\n      </form>\n    </div>\n  </md-card>\n</div>\n"

/***/ }),

/***/ "./src/app/modules/farmer/order/new-order/create-order/create-order.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("./node_modules/@angular/router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_app_services_farmer_farmer_service__ = __webpack_require__("./src/app/services/farmer/farmer.service.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CreateOrderComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var CreateOrderComponent = (function () {
    function CreateOrderComponent(farmerService, route) {
        this.farmerService = farmerService;
        this.route = route;
        this.subCategory = ['Alovera', 'Bajra'];
        this.variety = ['Others', 'abc'];
        this.type = ['Organic', 'Inorganic'];
        this.units = ['Kg', 'Ton'];
        this.title = '';
    }
    CreateOrderComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Intialize the sell order
        this.farmerService.getSellOrder(0)
            .subscribe(function (order) { return _this.newSellOrder = order; }, function (error) { return _this.errorMessage = error; });
        //reintialize the title
        this.route.params.subscribe(function (params) {
            var category = params['category'];
            _this.setTitleAndCategory(category);
            //reintialize the subcategory list
        });
    };
    CreateOrderComponent.prototype.OnReset = function () {
        this.ngOnInit();
    };
    CreateOrderComponent.prototype.setTitleAndCategory = function (category) {
        this.newSellOrder.productCategory = category;
        switch (category) {
            case 'crop': {
                this.title = 'Add Crop Commodities';
                break;
            }
            case 'finished': {
                this.title = 'Add Finished Commodities';
                break;
            }
            case 'ffv': {
                this.title = 'Add Fruits/Flowers/Vegetables Commodities';
                break;
            }
            case 'aqua': {
                this.title = 'Add Fisheries and Aqua Commodities';
                break;
            }
            case 'others': {
                this.title = 'Add Handicrafts, Khadi and Others Commodities';
                break;
            }
            case 'cattle': {
                this.title = 'Add LiveStock/Cattle Order';
                break;
            }
            case 'farm': {
                this.title = 'Add Farm Equipments Order';
                break;
            }
            case 'land': {
                this.title = 'Add Land/ Garden Order';
                break;
            }
            case 'machine': {
                this.title = 'Add Machine-Repairing Order';
                break;
            }
            case 'seeds': {
                this.title = 'Add Seeds/Seedlings Commodities';
                break;
            }
        }
    };
    CreateOrderComponent.prototype.OnAddNewOrder = function () {
        console.log('saving');
        //console.log(this.farmerService.saveSellOrder(this.newSellOrder));
        this.farmerService.saveSellOrder(this.newSellOrder)
            .subscribe(function (data) {
            console.log('got valid: ', data);
            //this.onDClose.emit(true);
            console.log('valid');
        }, function (err) {
            console.log('got error: ', err);
        });
    };
    CreateOrderComponent.prototype.getVariety = function (category, subCategory) {
    };
    return CreateOrderComponent;
}());
CreateOrderComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_10" /* Component */])({
        selector: 'create-order',
        template: __webpack_require__("./src/app/modules/farmer/order/new-order/create-order/create-order.component.html"),
        styles: [__webpack_require__("./src/app/modules/farmer/order/new-order/create-order/create-order.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2_app_services_farmer_farmer_service__["a" /* FarmerService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2_app_services_farmer_farmer_service__["a" /* FarmerService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* ActivatedRoute */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* ActivatedRoute */]) === "function" && _b || Object])
], CreateOrderComponent);

var _a, _b;
//# sourceMappingURL=create-order.component.js.map

/***/ }),

/***/ "./src/app/modules/farmer/order/new-order/new-order.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".farmer-container{\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -ms-flex-pack: distribute;\r\n      justify-content: space-around;\r\n  -webkit-box-align: start;\r\n      -ms-flex-align: start;\r\n          align-items: flex-start;\r\n  -webkit-box-orient: horizontal;\r\n  -webkit-box-direction: normal;\r\n      -ms-flex-direction: row;\r\n          flex-direction: row;\r\n  -ms-flex-wrap: nowrap;\r\n      flex-wrap: nowrap;\r\n  padding: 10px;\r\n  width: 100%;\r\n  height:100%;\r\n}\r\n.secondaryContainer{\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-padding-start: 10px;\r\n          padding-inline-start: 10px;\r\n  -webkit-padding-end: 10px;\r\n          padding-inline-end: 10px;\r\n  overflow: hidden;\r\n}\r\n\r\n.farmer-menu{\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  border: 1px solid #dddddd;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "./src/app/modules/farmer/order/new-order/new-order.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"farmer-container\">\n  <div class=\"farmer-menu\">\n    <md-card>\n    <fw-static-sidenav [itemList]=\"produceItem\"></fw-static-sidenav>\n    </md-card>\n  </div>\n  <div class=\"secondaryContainer\">\n    <router-outlet></router-outlet>\n  </div>\n  <div fxFlex></div>\n</div>\n"

/***/ }),

/***/ "./src/app/modules/farmer/order/new-order/new-order.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NewOrderComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var NewOrderComponent = (function () {
    function NewOrderComponent() {
        this.produceItem = [
            { name: 'Sell Crop Product',
                link: '',
                subMenuItem: [
                    { name: 'Crop Commodities', link: '/farmer/neworder/create/crop' },
                    { name: 'Finished Commodities', link: '/farmer/neworder/create/finished' },
                    { name: 'Fruits/Flowers/Vegetables', link: '/farmer/neworder/create/ffv' },
                    { name: 'Fisheries and Aqua', link: '/farmer/neworder/create/aqua' },
                    { name: 'Handicrafts, Khadi and Others', link: '/farmer/neworder/create/others' }
                ],
                icon: 'shopping_cart'
            },
            { name: 'Sell Other Product ',
                link: '',
                subMenuItem: [
                    { name: 'LiveStock/Cattle', link: '/farmer/neworder/create/cattle' },
                    { name: 'Farm Equipments', link: '/farmer/neworder/create/farm' },
                    { name: 'Land/ Garden', link: '/farmer/neworder/create/land' },
                    { name: 'Machine-Repairing', link: '/farmer/neworder/create/machine' },
                    { name: 'Seeds/Seedlings', link: '/farmer/neworder/create/seeds' }
                ],
                icon: 'settings'
            }
        ];
    }
    NewOrderComponent.prototype.ngOnInit = function () {
    };
    return NewOrderComponent;
}());
NewOrderComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_10" /* Component */])({
        selector: 'app-new-order',
        template: __webpack_require__("./src/app/modules/farmer/order/new-order/new-order.component.html"),
        styles: [__webpack_require__("./src/app/modules/farmer/order/new-order/new-order.component.css")]
    }),
    __metadata("design:paramtypes", [])
], NewOrderComponent);

//# sourceMappingURL=new-order.component.js.map

/***/ }),

/***/ "./src/app/modules/farmer/order/rent/order-rent.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "./src/app/modules/farmer/order/rent/order-rent.component.html":
/***/ (function(module, exports) {

module.exports = "<p>\n  order-rent works!\n</p>\n"

/***/ }),

/***/ "./src/app/modules/farmer/order/rent/order-rent.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OrderRentComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var OrderRentComponent = (function () {
    function OrderRentComponent() {
    }
    OrderRentComponent.prototype.ngOnInit = function () {
    };
    return OrderRentComponent;
}());
OrderRentComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_10" /* Component */])({
        selector: 'farmer-order-rent',
        template: __webpack_require__("./src/app/modules/farmer/order/rent/order-rent.component.html"),
        styles: [__webpack_require__("./src/app/modules/farmer/order/rent/order-rent.component.css")]
    }),
    __metadata("design:paramtypes", [])
], OrderRentComponent);

//# sourceMappingURL=order-rent.component.js.map

/***/ }),

/***/ "./src/app/modules/farmer/order/sell/order-sell.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".order-sell{\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-orient: vertical;\r\n  -webkit-box-direction: normal;\r\n      -ms-flex-direction: column;\r\n          flex-direction: column;\r\n  -webkit-box-pack: start;\r\n      -ms-flex-pack: start;\r\n          justify-content: flex-start;\r\n}\r\n\r\n.create-order-button{\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-orient: horizontal;\r\n  -webkit-box-direction: normal;\r\n      -ms-flex-direction: row;\r\n          flex-direction: row;\r\n  -webkit-box-pack: start;\r\n      -ms-flex-pack: start;\r\n          justify-content: flex-start;\r\n  margin-bottom: 15px;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "./src/app/modules/farmer/order/sell/order-sell.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"order-sell\">\n  <div class=\"create-order-button\">\n    <a color=\"primary\" md-raised-button routerLink=\"/farmer/neworder\">Create New Order</a>\n    <span class=\"spacer\"></span>\n  </div>\n  <md-divider></md-divider>\n  <md-tab-group>\n    <md-tab label=\"Active Order\">Content 1</md-tab>\n    <md-tab label=\"Completed Order\">Content 2</md-tab>\n  </md-tab-group>\n</div>\n"

/***/ }),

/***/ "./src/app/modules/farmer/order/sell/order-sell.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OrderSellComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var OrderSellComponent = (function () {
    function OrderSellComponent() {
    }
    OrderSellComponent.prototype.ngOnInit = function () {
    };
    return OrderSellComponent;
}());
OrderSellComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_10" /* Component */])({
        selector: 'farmer-order-sell',
        template: __webpack_require__("./src/app/modules/farmer/order/sell/order-sell.component.html"),
        styles: [__webpack_require__("./src/app/modules/farmer/order/sell/order-sell.component.css")]
    }),
    __metadata("design:paramtypes", [])
], OrderSellComponent);

//# sourceMappingURL=order-sell.component.js.map

/***/ }),

/***/ "./src/app/modules/farmer/order/services/order-services.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "./src/app/modules/farmer/order/services/order-services.component.html":
/***/ (function(module, exports) {

module.exports = "<p>\n  order-services works!\n</p>\n"

/***/ }),

/***/ "./src/app/modules/farmer/order/services/order-services.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OrderServicesComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var OrderServicesComponent = (function () {
    function OrderServicesComponent() {
    }
    OrderServicesComponent.prototype.ngOnInit = function () {
    };
    return OrderServicesComponent;
}());
OrderServicesComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_10" /* Component */])({
        selector: 'farmer-order-services',
        template: __webpack_require__("./src/app/modules/farmer/order/services/order-services.component.html"),
        styles: [__webpack_require__("./src/app/modules/farmer/order/services/order-services.component.css")]
    }),
    __metadata("design:paramtypes", [])
], OrderServicesComponent);

//# sourceMappingURL=order-services.component.js.map

/***/ }),

/***/ "./src/app/modules/farmer/profile/farmer-profile.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "/deep/ .md-card{\r\n  padding: 20px;\r\n}\r\n\r\n.profile-button\r\n{\r\n  height: 35px;\r\n  -webkit-box-pack: end;\r\n      -ms-flex-pack: end;\r\n          justify-content: flex-end;\r\n  padding-left: 10px;\r\n}\r\n\r\n\r\n.profile-image {\r\n  background-image: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/53474/atom_profile_01.jpg');\r\n  background-size: cover;\r\n  width: 70px;\r\n  height: 70px;\r\n}\r\n\r\n.profile-base{\r\n  border: 1px solid #dddddd;\r\n  width: 100%;\r\n}\r\n\r\n.preview-info{\r\n  display: block;\r\n  -webkit-padding-start: 10px;\r\n          padding-inline-start: 10px;\r\n  -webkit-box-orient: vertical;\r\n  -webkit-box-direction: normal;\r\n      -ms-flex-direction: column;\r\n          flex-direction: column;\r\n  width: 100%\r\n}\r\n.profile-preview-card{\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-orient: horizontal;\r\n  -webkit-box-direction: normal;\r\n      -ms-flex-flow: row;\r\n          flex-flow: row;\r\n  padding: 10px;\r\n}\r\n.profile-edit-card{\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-orient: horizontal;\r\n  -webkit-box-direction: normal;\r\n      -ms-flex-direction: row;\r\n          flex-direction: row;\r\n  padding: 10px;\r\n  -webkit-padding-after: 20px;\r\n          padding-block-end: 20px;\r\n}\r\n\r\n.edit-info{\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-padding-start: 10px;\r\n          padding-inline-start: 10px;\r\n}\r\n.edit-form{\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-orient: vertical;\r\n  -webkit-box-direction: normal;\r\n      -ms-flex-direction: column;\r\n          flex-direction: column;\r\n}\r\n\r\n.form-row{\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-orient: horizontal;\r\n  -webkit-box-direction: normal;\r\n      -ms-flex-direction: row;\r\n          flex-direction: row;\r\n}\r\n.form-column{\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-orient: vertical;\r\n  -webkit-box-direction: normal;\r\n      -ms-flex-direction: column;\r\n          flex-direction: column;\r\n  -webkit-padding-start: 10px;\r\n          padding-inline-start: 10px;\r\n}\r\n\r\n.form-row-column{\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-orient: vertical;\r\n  -webkit-box-direction: normal;\r\n      -ms-flex-direction: column;\r\n          flex-direction: column;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "./src/app/modules/farmer/profile/farmer-profile.component.html":
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"showProfilePreview\" class=\"profile-base\">\n  <md-card class=\"profile-preview-card\">\n      <div md-media-sm md-card-avatar class=\"profile-image\"></div>\n      <div class=\"preview-info\">\n        <div><span>mohituprim@gmail.com (Hyderabad)</span></div>\n        <div>\n          <span>8527331928</span>\n          <span>mohituprim@gmail.com</span>\n          <a href=\"#\">View All</a>\n        </div>\n        <div>\n          <span>+ Add More</span>\n          <span>+ Add More</span>\n        </div>\n      </div>\n      <div fxFlex></div>\n      <div class=\"profile-button\">\n        <button md-raised-button (click)=\"OnProfileEdit()\">Edit</button>\n      </div>\n  </md-card>\n</div>\n<div *ngIf=\"!showProfilePreview\" class=\"profile-base\">\n  <md-card class=\"profile-edit-card\">\n    <div md-media-sm md-card-avatar class=\"profile-image\"></div>\n    <div class=\"edit-info\">\n      <form class=\"edit-form\">\n        <div class=\"form-row\">\n          <div class=\"form-column\">\n            <div class=\"form-row\">\n              <md-input-container>\n                <input mdInput placeholder=\"Name\">mohit uprim\n              </md-input-container>\n            </div>\n            <div class=\"form-row\">\n              <md-select class=\"padding-right20\" placeholder=\"State\" [(ngModel)]=\"myState\" name=\"state\">\n                <md-option *ngFor=\"let state of states\" [value]=\"state.code\">{{ state.name }}</md-option>\n              </md-select>\n            </div>\n            <div class=\"form-row\">\n              <div class=\"form-row-column\">\n                <div>\n                  <span>CONTACT NUMBERS</span>\n                  <button md-button>+ Add More</button>\n                </div>\n                <div>\n                  <md-input-container  class=\"padding-right20\">\n                    <input type=\"tel\" mdInput placeholder=\"Primary\">\n                    <md-icon mdSuffix>edit</md-icon>\n                  </md-input-container>\n                </div>\n              </div>\n            </div>\n            <div class=\"form-row\">\n              <md-input-container>\n                <input mdInput [mdDatepicker]=\"picker\" placeholder=\"Choose a date\">\n                <button mdSuffix [mdDatepickerToggle]=\"picker\"></button>\n              </md-input-container>\n              <md-datepicker #picker></md-datepicker>\n            </div>\n          </div>\n          <div class=\"form-column\">\n            <div class=\"form-row\">\n              <md-input-container>\n                <input mdInput placeholder=\"City\">Hyderabad\n              </md-input-container>\n            </div>\n            <div class=\"form-row\">\n              <md-select placeholder=\"District\" [(ngModel)]=\"myState\" name=\"state\">\n                <md-option *ngFor=\"let state of states\" [value]=\"state.code\">{{ state.name }}</md-option>\n              </md-select>\n            </div>\n            <div class=\"form-row\">\n              <div class=\"form-row-column\">\n                <div>\n                  <span>EMAIL ADDRESSES</span>\n                  <button md-button>+ Add More</button>\n                </div>\n                <div>\n                  <md-input-container>\n                    <input type=\"email\" mdInput placeholder=\"Primary\">\n                    <md-icon mdSuffix>edit</md-icon>\n                  </md-input-container>\n                </div>\n              </div>\n            </div>\n            <div class=\"form-row\" style=\"padding-top: 15px;\">\n              <md-select placeholder=\"Gender\" [(ngModel)]=\"gender\" name=\"gender\">\n                <md-option [value]=\"gender\">Male</md-option>\n                <md-option [value]=\"gender\">Female</md-option>\n                <md-option [value]=\"gender\">Other</md-option>\n              </md-select>\n            </div>\n          </div>\n        </div>\n        <div class=\"form-row\" style=\"padding-inline-start: 10px; flex-grow:1\">\n          <md-input-container style=\"padding:10px;\">\n            <textarea mdInput placeholder=\"Address\">1600 Amphitheatre Pkwy</textarea>\n          </md-input-container>\n        </div>\n        <div class=\"form-row\">\n          <div style=\"padding-left:10px\">\n            <a md-raised-button routerLink=\".\">Update Profile</a>\n          </div>\n          <div style=\"padding-left:10px\">\n            <a md-raised-button routerLink=\".\">Change Password</a>\n          </div>\n          <div style=\"padding-left:10px\">\n            <a md-raised-button (click)=\"OnCancel()\">Cancel</a>\n          </div>\n        </div>\n      </form>\n    </div>\n  </md-card>\n</div>\n"

/***/ }),

/***/ "./src/app/modules/farmer/profile/farmer-profile.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FarmerProfileComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var FarmerProfileComponent = (function () {
    function FarmerProfileComponent() {
        this.showProfilePreview = true;
        this.states = [{ code: '1', name: 'UttarPradesh' }, { code: '2', name: 'Delhi' }, { code: '3', name: 'MadhyaPradesh' }];
        this.myState = '';
    }
    FarmerProfileComponent.prototype.ngOnInit = function () {
        this.myState = this.states[0].code;
    };
    FarmerProfileComponent.prototype.OnProfileEdit = function () {
        this.showProfilePreview = false;
    };
    FarmerProfileComponent.prototype.OnCancel = function () {
        this.showProfilePreview = true;
    };
    return FarmerProfileComponent;
}());
FarmerProfileComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_10" /* Component */])({
        selector: 'app-farmer-profile',
        template: __webpack_require__("./src/app/modules/farmer/profile/farmer-profile.component.html"),
        styles: [__webpack_require__("./src/app/modules/farmer/profile/farmer-profile.component.css")]
    }),
    __metadata("design:paramtypes", [])
], FarmerProfileComponent);

//# sourceMappingURL=farmer-profile.component.js.map

/***/ }),

/***/ "./src/app/modules/framework/dropdown-side-nav/dropdown-side-nav.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".menu-item{\r\npadding: 10px;\r\n}\r\n.menu-header{\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-orient: horizontal;\r\n  -webkit-box-direction: normal;\r\n      -ms-flex-direction: row;\r\n          flex-direction: row;\r\n  -webkit-box-flex: 1;\r\n      -ms-flex-positive: 1;\r\n          flex-grow: 1;\r\n  -webkit-box-align: center;\r\n      -ms-flex-align: center;\r\n          align-items: center;\r\n}\r\n.sidenav-container{\r\n  background: #fff;\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-orient: vertical;\r\n  -webkit-box-direction: normal;\r\n      -ms-flex-direction: column;\r\n          flex-direction: column;\r\n}\r\n.sidenav-header {\r\n  background: rgba(0,0,0,.32);\r\n  color: hsla(0,0%,100%,.87);\r\n}\r\nmd-sidenav-container{\r\n  margin: 0;\r\n  width: 100%;\r\n  height: 100%;\r\n}\r\n\r\n.mat-nav-list{\r\n  padding-top: 0px;\r\n}\r\n\r\n\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "./src/app/modules/framework/dropdown-side-nav/dropdown-side-nav.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"sidenav-container\">\n  <md-nav-list>\n    <md-list-item (click)=\"toggleMarketTab()\" style=\"background: rgba(0,0,0,.32); color: hsla(0,0%,100%,.87);\" >\n      <div class=\"menu-header\">\n        <md-icon md-list-icon>{{marketHeaderIcon}}</md-icon>\n        <h3 md-line>{{marketListHeader}}</h3>\n        <div fxFlex></div>\n        <md-icon md-list-icon *ngIf=\"!marketItems.length\">expand_more</md-icon>\n        <md-icon md-list-icon *ngIf=\"marketItems.length\">expand_less</md-icon>\n      </div>\n    </md-list-item>\n    <md-divider></md-divider>\n    <div [@listAnimation]=\"marketItems.length\" *ngFor=\"let item of marketItems\" ng-show=\"marketItems.length\">\n      <md-list-item class=\"menu-item\">\n        <a>{{item}}</a>\n      </md-list-item>\n      <md-divider></md-divider>\n    </div>\n  </md-nav-list>\n  <md-nav-list flex >\n    <md-list-item  (click)=\"toggleServiceTab()\" style=\"background: rgba(0,0,0,.32);color: hsla(0,0%,100%,.87);\" >\n      <div class=\"menu-header\">\n        <md-icon flex-start  md-list-icon>{{servicesHeaderIcon}}</md-icon>\n        <h3 md-line>{{servicesListHeader}}</h3>\n        <div fxFlex></div>\n        <md-icon md-list-icon flex-end *ngIf=\"!servicesItems.length\">expand_more</md-icon>\n        <md-icon md-list-icon  flex-end *ngIf=\"servicesItems.length\">expand_less</md-icon>\n      </div>\n    </md-list-item>\n    <md-divider></md-divider>\n    <div [@listAnimation]=\"servicesItems.length\" *ngFor=\"let item of servicesItems\" ng-show=\"servicesItems.length\">\n      <md-list-item class=\"menu-item\">\n        <a>{{item}}</a>\n      </md-list-item>\n      <md-divider></md-divider>\n    </div>\n    <md-divider></md-divider>\n  </md-nav-list>\n</div>\n"

/***/ }),

/***/ "./src/app/modules/framework/dropdown-side-nav/dropdown-side-nav.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_animations__ = __webpack_require__("./node_modules/@angular/animations/@angular/animations.es5.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DropDownSideNavComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var DropDownSideNavComponent = (function () {
    function DropDownSideNavComponent() {
        this.marketListHeader = "Buy/Sell";
        this.marketHeaderIcon = "shopping_cart";
        this.marketItemList = ['Agriculture Product', 'Machinary', 'Fertilizer', 'Agriculture Land', 'Spare-Parts'];
        this.servicesListHeader = "Services";
        this.servicesHeaderIcon = "settings";
        this.servicesItemList = ['Transportation', 'WareHousing', 'Financing', 'Machine-Repairing', 'Consulting'];
        this.marketItems = [];
        this.servicesItems = [];
    }
    DropDownSideNavComponent.prototype.ngOnInit = function () {
        this.toggleMarketTab();
        this.toggleServiceTab();
    };
    DropDownSideNavComponent.prototype.showMarketItems = function () {
        this.marketItems = this.marketItemList;
    };
    DropDownSideNavComponent.prototype.hideMarketItems = function () {
        this.marketItems = [];
    };
    DropDownSideNavComponent.prototype.toggleMarketTab = function () {
        this.marketItems.length ? this.hideMarketItems() : this.showMarketItems();
    };
    DropDownSideNavComponent.prototype.showServicesItems = function () {
        this.servicesItems = this.servicesItemList;
    };
    DropDownSideNavComponent.prototype.hideServicesItems = function () {
        this.servicesItems = [];
    };
    DropDownSideNavComponent.prototype.toggleServiceTab = function () {
        this.servicesItems.length ? this.hideServicesItems() : this.showServicesItems();
    };
    return DropDownSideNavComponent;
}());
DropDownSideNavComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_10" /* Component */])({
        selector: 'fw-dropdown-side-nav',
        template: __webpack_require__("./src/app/modules/framework/dropdown-side-nav/dropdown-side-nav.component.html"),
        styles: [__webpack_require__("./src/app/modules/framework/dropdown-side-nav/dropdown-side-nav.component.css")],
        animations: [
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["a" /* trigger */])('listAnimation', [])
        ]
    }),
    __metadata("design:paramtypes", [])
], DropDownSideNavComponent);

__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["a" /* trigger */])('listAnimation', [
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["b" /* transition */])('* => *', [
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["e" /* query */])(':leave', [
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["f" /* stagger */])(100, [
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["d" /* animate */])('0.5s', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["c" /* style */])({ opacity: 0 }))
            ])
        ]),
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["e" /* query */])(':enter', [
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["c" /* style */])({ opacity: 0 }),
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["f" /* stagger */])(100, [
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["d" /* animate */])('0.5s', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["c" /* style */])({ opacity: 1 }))
            ])
        ])
    ])
]);
//# sourceMappingURL=dropdown-side-nav.component.js.map

/***/ }),

/***/ "./src/app/modules/framework/empty-order-cart/empty-order-cart.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".emptycartContainer{\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-orient: vertical;\r\n  -webkit-box-direction: normal;\r\n      -ms-flex-direction: column;\r\n          flex-direction: column;\r\n  min-block-size: 15%;\r\n  -webkit-padding-before: 10px;\r\n          padding-block-start: 10px;\r\n  width: 100%;\r\n}\r\n\r\n.messageCard{\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-orient: vertical;\r\n  -webkit-box-direction: normal;\r\n      -ms-flex-direction: column;\r\n          flex-direction: column;\r\n  -webkit-box-pack: center;\r\n      -ms-flex-pack: center;\r\n          justify-content: center;\r\n  -webkit-box-align: center;\r\n      -ms-flex-align: center;\r\n          align-items: center;\r\n  min-block-size: 50px;\r\n  margin-top:15px\r\n}\r\n\r\n.continue_shopping_order{\r\n  float: right;\r\n  color: #008bcf;\r\n}\r\n\r\n.empty_cart{\r\n  margin: 50px 200px;\r\n  position: relative;\r\n}\r\n\r\n.icon-cart {\r\n  font-size: 200px;\r\n  color: #999;\r\n}\r\n\r\n.display-inline{\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-orient: horizontal;\r\n  -webkit-box-direction: normal;\r\n      -ms-flex-direction: row;\r\n          flex-direction: row;\r\n  -webkit-box-pack: center;\r\n      -ms-flex-pack: center;\r\n          justify-content: center;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "./src/app/modules/framework/empty-order-cart/empty-order-cart.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"emptycartContainer\">\n  <md-card class=\"messageCard\">\n    <div>\n      <span>\n            {{message}}\n      </span>\n      <div class=\"continue_shopping_order\" routerLink=\"\">\n            <div class=\"display-inline\">\n              <h3>Continue Shopping </h3>\n              <md-icon style=\"margin-top:17px;\">arrow_forward</md-icon>\n            </div>\n      </div>\n    </div>\n  </md-card>\n  <div [@flyInOut] class=\"empty_cart\">\n    <md-icon class=\"icon-cart\">add_shopping_cart</md-icon>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/modules/framework/empty-order-cart/empty-order-cart.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_animations__ = __webpack_require__("./node_modules/@angular/animations/@angular/animations.es5.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EmptyOrderCartComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var EmptyOrderCartComponent = (function () {
    function EmptyOrderCartComponent() {
    }
    EmptyOrderCartComponent.prototype.ngOnInit = function () {
    };
    return EmptyOrderCartComponent;
}());
EmptyOrderCartComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_10" /* Component */])({
        selector: 'fw-empty-order-cart',
        template: __webpack_require__("./src/app/modules/framework/empty-order-cart/empty-order-cart.component.html"),
        styles: [__webpack_require__("./src/app/modules/framework/empty-order-cart/empty-order-cart.component.css")],
        animations: [
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["a" /* trigger */])('flyInOut', [
                // state('in', style({transform: 'translateX(0)'})),
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["b" /* transition */])('void => *', [
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["c" /* style */])({ transform: 'translateX(-100%)', left: +500 }),
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["d" /* animate */])("200ms ease-in-out", __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["c" /* style */])({
                        left: 200,
                        opacity: 1.0,
                        zIndex: 2
                    }))
                ]),
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["b" /* transition */])('* => void', [
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["d" /* animate */])(100, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["c" /* style */])({ transform: 'translateX(100%)' }))
                ])
            ])
        ]
    }),
    __metadata("design:paramtypes", [])
], EmptyOrderCartComponent);

//# sourceMappingURL=empty-order-cart.component.js.map

/***/ }),

/***/ "./src/app/modules/framework/framework-body/framework-body.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".mobile-sidenav{\r\n  min-width: 300px;\r\n}\r\n.container{\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-orient: horizontal;\r\n  -webkit-box-direction: normal;\r\n      -ms-flex-direction: row;\r\n          flex-direction: row;\r\n}\r\n.mainContentContainer{\r\n  padding: 10px;\r\n  -webkit-box-flex: 1;\r\n      -ms-flex-positive: 1;\r\n          flex-grow: 1;\r\n}\r\n.sidenav-container{\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-orient: vertical;\r\n  -webkit-box-direction: normal;\r\n      -ms-flex-direction: column;\r\n          flex-direction: column;\r\n  -ms-flex-preferred-size: 25%;\r\n      flex-basis: 25%;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "./src/app/modules/framework/framework-body/framework-body.component.html":
/***/ (function(module, exports) {

module.exports = "<md-sidenav-container fxLayout=\"column\">\n  <div fxLayout=\"column\" >\n    <div fxFlex=\"grow\">\n      <fw-tool-bar (mobileNavToggle)=\"mobileSidenav.toggle()\"></fw-tool-bar>\n    </div>\n    <div class=\"container\">\n      <div class=\"sidenav-container\" *ngIf=\"!authService.isLoggedIn()\">\n        <fw-dropdown-side-nav></fw-dropdown-side-nav>\n      </div>\n      <div class=\"mainContentContainer\">\n        <router-outlet></router-outlet>\n      </div>\n    </div>\n    <div fxFlex=\"grow\" style=\"background-color:black;\">footer</div>\n  </div>\n  <md-sidenav #mobileSidenav class=\"mobile-sidenav\">\n    <fw-static-sidenav [itemList]=\"items\"></fw-static-sidenav>\n  </md-sidenav>\n</md-sidenav-container>\n\n\n"

/***/ }),

/***/ "./src/app/modules/framework/framework-body/framework-body.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_app_services_authentication_auth_service__ = __webpack_require__("./src/app/services/authentication/auth.service.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FrameworkBodyComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var FrameworkBodyComponent = (function () {
    function FrameworkBodyComponent(authService) {
        this.authService = authService;
        this.items = [
            { name: 'Buy/Sell',
                link: '',
                subMenuItem: [
                    { name: 'Agriculture Product', link: '/farmer/order/buy' },
                    { name: 'Machinary', link: '/farmer/order/sell' },
                    { name: 'Fertilizer', link: '/farmer/order/services' },
                    { name: 'Agriculture Land', link: '/farmer/order/rent' },
                    { name: 'Spare-Parts', link: '/farmer/order/rent' }
                ],
                icon: 'shopping_cart'
            },
            { name: 'Services',
                link: '',
                subMenuItem: [
                    { name: 'Transportation', link: '' },
                    { name: 'WareHousing', link: '' },
                    { name: 'Financing', link: '' },
                    { name: 'Machine-Repairing', link: '' },
                    { name: 'Consulting', link: '' }
                ],
                icon: 'settings'
            }
        ];
    }
    FrameworkBodyComponent.prototype.ngOnInit = function () {
    };
    return FrameworkBodyComponent;
}());
FrameworkBodyComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_10" /* Component */])({
        selector: 'fw-framework-body',
        template: __webpack_require__("./src/app/modules/framework/framework-body/framework-body.component.html"),
        styles: [__webpack_require__("./src/app/modules/framework/framework-body/framework-body.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1_app_services_authentication_auth_service__["a" /* AuthenticationService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_app_services_authentication_auth_service__["a" /* AuthenticationService */]) === "function" && _a || Object])
], FrameworkBodyComponent);

var _a;
//# sourceMappingURL=framework-body.component.js.map

/***/ }),

/***/ "./src/app/modules/framework/framework.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__("./node_modules/@angular/common/@angular/common.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__("./node_modules/@angular/router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__("./node_modules/@angular/forms/@angular/forms.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_material__ = __webpack_require__("./node_modules/@angular/material/@angular/material.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_platform_browser_animations__ = __webpack_require__("./node_modules/@angular/platform-browser/@angular/platform-browser/animations.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_flex_layout__ = __webpack_require__("./node_modules/@angular/flex-layout/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_hammerjs__ = __webpack_require__("../node_modules/hammerjs/hammer.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_hammerjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_hammerjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_app_services_authentication_auth_service__ = __webpack_require__("./src/app/services/authentication/auth.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__framework_body_framework_body_component__ = __webpack_require__("./src/app/modules/framework/framework-body/framework-body.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__authentication_login_login_component__ = __webpack_require__("./src/app/modules/authentication/login/login.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__authentication_register_register_component__ = __webpack_require__("./src/app/modules/authentication/register/register.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__authentication_authentication_component__ = __webpack_require__("./src/app/modules/authentication/authentication.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__tool_bar_tool_bar_component__ = __webpack_require__("./src/app/modules/framework/tool-bar/tool-bar.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__vertical_menu_vertical_menu_component__ = __webpack_require__("./src/app/modules/framework/vertical-menu/vertical-menu.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_app_modules_framework_empty_order_cart_empty_order_cart_component__ = __webpack_require__("./src/app/modules/framework/empty-order-cart/empty-order-cart.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16_app_modules_framework_vertical_menu_sub_menu_component__ = __webpack_require__("./src/app/modules/framework/vertical-menu/sub-menu.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17_app_modules_framework_static_sidenav_static_sidenav_component__ = __webpack_require__("./src/app/modules/framework/static-sidenav/static-sidenav.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18_app_modules_framework_dropdown_side_nav_dropdown_side_nav_component__ = __webpack_require__("./src/app/modules/framework/dropdown-side-nav/dropdown-side-nav.component.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FrameworkModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// Libraries









//Component










var FrameworkModule = (function () {
    function FrameworkModule() {
    }
    return FrameworkModule;
}());
FrameworkModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["b" /* NgModule */])({
        imports: [
            __WEBPACK_IMPORTED_MODULE_1__angular_common__["j" /* CommonModule */],
            __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* RouterModule */],
            __WEBPACK_IMPORTED_MODULE_3__angular_forms__["a" /* FormsModule */],
            __WEBPACK_IMPORTED_MODULE_4__angular_material__["a" /* MaterialModule */],
            __WEBPACK_IMPORTED_MODULE_6__angular_flex_layout__["FlexLayoutModule"],
            __WEBPACK_IMPORTED_MODULE_5__angular_platform_browser_animations__["a" /* BrowserAnimationsModule */]
        ],
        declarations: [
            __WEBPACK_IMPORTED_MODULE_9__framework_body_framework_body_component__["a" /* FrameworkBodyComponent */],
            __WEBPACK_IMPORTED_MODULE_13__tool_bar_tool_bar_component__["a" /* ToolBarComponent */],
            __WEBPACK_IMPORTED_MODULE_18_app_modules_framework_dropdown_side_nav_dropdown_side_nav_component__["a" /* DropDownSideNavComponent */],
            __WEBPACK_IMPORTED_MODULE_12__authentication_authentication_component__["a" /* AuthenticationComponent */],
            __WEBPACK_IMPORTED_MODULE_10__authentication_login_login_component__["a" /* LogInComponent */],
            __WEBPACK_IMPORTED_MODULE_11__authentication_register_register_component__["a" /* RegisterComponent */],
            __WEBPACK_IMPORTED_MODULE_14__vertical_menu_vertical_menu_component__["a" /* VerticalMenuComponent */],
            __WEBPACK_IMPORTED_MODULE_16_app_modules_framework_vertical_menu_sub_menu_component__["a" /* SubMenuComponent */],
            __WEBPACK_IMPORTED_MODULE_17_app_modules_framework_static_sidenav_static_sidenav_component__["a" /* StaticSidenavComponent */],
            __WEBPACK_IMPORTED_MODULE_15_app_modules_framework_empty_order_cart_empty_order_cart_component__["a" /* EmptyOrderCartComponent */]
            //Custom Module
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_8_app_services_authentication_auth_service__["a" /* AuthenticationService */]
        ],
        exports: [
            __WEBPACK_IMPORTED_MODULE_9__framework_body_framework_body_component__["a" /* FrameworkBodyComponent */],
            __WEBPACK_IMPORTED_MODULE_14__vertical_menu_vertical_menu_component__["a" /* VerticalMenuComponent */],
            __WEBPACK_IMPORTED_MODULE_15_app_modules_framework_empty_order_cart_empty_order_cart_component__["a" /* EmptyOrderCartComponent */],
            __WEBPACK_IMPORTED_MODULE_17_app_modules_framework_static_sidenav_static_sidenav_component__["a" /* StaticSidenavComponent */]
        ],
        entryComponents: [
            __WEBPACK_IMPORTED_MODULE_12__authentication_authentication_component__["a" /* AuthenticationComponent */]
        ]
    })
], FrameworkModule);

//# sourceMappingURL=framework.module.js.map

/***/ }),

/***/ "./src/app/modules/framework/static-sidenav/static-sidenav.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".menu-item{\r\npadding: 10px;\r\n}\r\n.menu-header{\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-orient: horizontal;\r\n  -webkit-box-direction: normal;\r\n      -ms-flex-direction: row;\r\n          flex-direction: row;\r\n  -webkit-box-flex: 1;\r\n      -ms-flex-positive: 1;\r\n          flex-grow: 1;\r\n  -webkit-box-align: center;\r\n      -ms-flex-align: center;\r\n          align-items: center;\r\n}\r\n.sidenav-container{\r\n  background: #fff;\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-orient: vertical;\r\n  -webkit-box-direction: normal;\r\n      -ms-flex-direction: column;\r\n          flex-direction: column;\r\n}\r\n.sidenav-header {\r\n  background: rgba(0,0,0,.32);\r\n  color: hsla(0,0%,100%,.87);\r\n}\r\nmd-sidenav-container{\r\n  margin: 0;\r\n  width: 100%;\r\n  height: 100%;\r\n}\r\n\r\n.mat-nav-list{\r\n  padding-top: 0px;\r\n}\r\n\r\n\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "./src/app/modules/framework/static-sidenav/static-sidenav.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"sidenav-container\">\n  <div *ngFor=\"let item of itemList\">\n    <md-nav-list>\n      <md-list-item style=\"background: rgba(0,0,0,.32); color: hsla(0,0%,100%,.87);\" >\n        <div class=\"menu-header\">\n          <md-icon md-list-icon>{{item.icon}}</md-icon>\n          <h3 md-line>{{item.name}}</h3>\n          <div fxFlex></div>\n        </div>\n      </md-list-item>\n      <md-divider></md-divider>\n      <div *ngFor=\"let subMenuItem of item.subMenuItem\" routerLink=\"{{subMenuItem.link}}\">\n        <md-list-item class=\"menu-item\">\n          <a>{{subMenuItem.name}}</a>\n        </md-list-item>\n        <md-divider></md-divider>\n      </div>\n    </md-nav-list>\n  </div>\n</div>\n\n"

/***/ }),

/***/ "./src/app/modules/framework/static-sidenav/static-sidenav.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StaticSidenavComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var StaticSidenavComponent = (function () {
    function StaticSidenavComponent() {
    }
    StaticSidenavComponent.prototype.ngOnInit = function () {
    };
    return StaticSidenavComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Input */])(),
    __metadata("design:type", Object)
], StaticSidenavComponent.prototype, "itemList", void 0);
StaticSidenavComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_10" /* Component */])({
        selector: 'fw-static-sidenav',
        template: __webpack_require__("./src/app/modules/framework/static-sidenav/static-sidenav.component.html"),
        styles: [__webpack_require__("./src/app/modules/framework/static-sidenav/static-sidenav.component.css")]
    }),
    __metadata("design:paramtypes", [])
], StaticSidenavComponent);

//# sourceMappingURL=static-sidenav.component.js.map

/***/ }),

/***/ "./src/app/modules/framework/tool-bar/tool-bar.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".toolbar-container{\r\n  background: #fff;\r\n}\r\n\r\n.app-icon-button {\r\n    box-shadow: none;\r\n    -webkit-user-select: none;\r\n       -moz-user-select: none;\r\n        -ms-user-select: none;\r\n            user-select: none;\r\n    background: none;\r\n    border: none;\r\n    cursor: pointer;\r\n    -webkit-filter: none;\r\n            filter: none;\r\n    font-weight: normal;\r\n    height: auto;\r\n    margin: 0;\r\n    min-width: 0;\r\n    text-align: left;\r\n    text-decoration: none;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "./src/app/modules/framework/tool-bar/tool-bar.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"toolbar-container\">\n  <md-toolbar class=\"toolbar-container\">\n    <button class=\"app-icon-button\">\n      <md-icon style=\"padding-right:5px\" (click)=\"mobileNavOpen()\" >menu</md-icon>\n    </button>\n    <span>Agro India Mart</span>\n    <!-- Filler that pushes the menu button to the end of the toolbar -->\n    <span fxFlex></span>\n    <button *ngIf=\"!authService.isLoggedIn()\" md-button (click)=\"openLogInRegisterDialog()\">\n      <md-icon>account_circle</md-icon>LogIn/Register\n    </button>\n    <button *ngIf=\"authService.isLoggedIn()\" md-button (click)=\"logOut()\">\n      <md-icon>account_circle</md-icon>LogOut\n    </button>\n    <button md-icon-button [mdMenuTriggerFor]=\"themeMenu\">\n      <md-icon>more_vert</md-icon>\n    </button>\n  </md-toolbar>\n  <md-menu #themeMenu x-position=\"before\">\n    <button md-menu-item (click)=\"isDarkTheme = !isDarkTheme\">Toggle Theme</button>\n  </md-menu>\n  <md-divider></md-divider>\n</div>\n"

/***/ }),

/***/ "./src/app/modules/framework/tool-bar/tool-bar.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_material__ = __webpack_require__("./node_modules/@angular/material/@angular/material.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__authentication_authentication_component__ = __webpack_require__("./src/app/modules/authentication/authentication.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__authentication_authentication_api__ = __webpack_require__("./src/app/modules/authentication/authentication-api.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_app_services_authentication_auth_service__ = __webpack_require__("./src/app/services/authentication/auth.service.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ToolBarComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var ToolBarComponent = (function () {
    function ToolBarComponent(dialog, authService, authApi) {
        this.dialog = dialog;
        this.authService = authService;
        this.authApi = authApi;
        this.mobileNavToggle = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["s" /* EventEmitter */]();
    }
    ToolBarComponent.prototype.openLogInRegisterDialog = function () {
        this.dialog.open(__WEBPACK_IMPORTED_MODULE_2__authentication_authentication_component__["a" /* AuthenticationComponent */], {
            height: '550px',
            width: '350px'
        });
    };
    ToolBarComponent.prototype.logOut = function () {
        this.authApi.logOut();
    };
    ToolBarComponent.prototype.mobileNavOpen = function () {
        this.mobileNavToggle.emit(true);
    };
    ToolBarComponent.prototype.ngOnInit = function () {
    };
    return ToolBarComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["v" /* Output */])(),
    __metadata("design:type", Object)
], ToolBarComponent.prototype, "mobileNavToggle", void 0);
ToolBarComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_10" /* Component */])({
        selector: 'fw-tool-bar',
        template: __webpack_require__("./src/app/modules/framework/tool-bar/tool-bar.component.html"),
        styles: [__webpack_require__("./src/app/modules/framework/tool-bar/tool-bar.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_material__["d" /* MdDialog */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_material__["d" /* MdDialog */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_4_app_services_authentication_auth_service__["a" /* AuthenticationService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4_app_services_authentication_auth_service__["a" /* AuthenticationService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__authentication_authentication_api__["a" /* AuthenticationApi */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__authentication_authentication_api__["a" /* AuthenticationApi */]) === "function" && _c || Object])
], ToolBarComponent);

var _a, _b, _c;
//# sourceMappingURL=tool-bar.component.js.map

/***/ }),

/***/ "./src/app/modules/framework/vertical-menu/sub-menu.component.html":
/***/ (function(module, exports) {

module.exports = "<md-list-item (click)=\"toggleSubMenu()\">\r\n  <div class=\"subMenu-header\">\r\n    <md-icon md-list-icon>{{subMenu.icon}}</md-icon>\r\n    <h3 md-line>{{subMenu.name}}</h3>\r\n    <div fxFlex></div>\r\n    <md-icon md-list-icon *ngIf=\"!subItems.length\">expand_more</md-icon>\r\n    <md-icon md-list-icon *ngIf=\"subItems.length\">expand_less</md-icon>\r\n  </div>\r\n</md-list-item>\r\n<div [@listAnimation]=\"subItems.length\" *ngFor=\"let item of subItems\" ng-show=\"subItems.length\">\r\n  <a [routerLink]=\"item.link\">\r\n    <md-list-item class=\"subMenu-item\">\r\n      <h3 md-line>{{item.name}}</h3>\r\n    </md-list-item>\r\n  </a>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/modules/framework/vertical-menu/sub-menu.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_animations__ = __webpack_require__("./node_modules/@angular/animations/@angular/animations.es5.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SubMenuComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var SubMenuComponent = (function () {
    function SubMenuComponent() {
        this.subItems = [];
    }
    SubMenuComponent.prototype.ngOnInit = function () {
        this.showSubItems();
        this.toggleSubMenu();
    };
    SubMenuComponent.prototype.showSubItems = function () {
        this.subItems = this.subMenu.subMenuItem;
    };
    SubMenuComponent.prototype.hideSubItems = function () {
        this.subItems = [];
    };
    SubMenuComponent.prototype.toggleSubMenu = function () {
        this.subItems.length ? this.hideSubItems() : this.showSubItems();
    };
    return SubMenuComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Input */])(),
    __metadata("design:type", Object)
], SubMenuComponent.prototype, "subMenu", void 0);
SubMenuComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_10" /* Component */])({
        selector: 'fw-sub-menu',
        template: __webpack_require__("./src/app/modules/framework/vertical-menu/sub-menu.component.html"),
        styles: [__webpack_require__("./src/app/modules/framework/vertical-menu/vertical-menu.component.css")],
        animations: [
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["a" /* trigger */])('listAnimation', [])
        ]
    }),
    __metadata("design:paramtypes", [])
], SubMenuComponent);

__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["a" /* trigger */])('listAnimation', [
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["b" /* transition */])('* => *', [
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["e" /* query */])(':leave', [
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["f" /* stagger */])(100, [
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["d" /* animate */])('0.5s', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["c" /* style */])({ opacity: 0 }))
            ])
        ]),
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["e" /* query */])(':enter', [
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["c" /* style */])({ opacity: 0 }),
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["f" /* stagger */])(100, [
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["d" /* animate */])('0.5s', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["c" /* style */])({ opacity: 1 }))
            ])
        ])
    ])
]);
//# sourceMappingURL=sub-menu.component.js.map

/***/ }),

/***/ "./src/app/modules/framework/vertical-menu/vertical-menu.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".menu-item{\r\npadding-top: 10px;\r\npadding-bottom: 10px;\r\n}\r\n\r\n/deep/ .mat-card{\r\n  padding: 0px;\r\n}\r\n\r\n/deep/ .mat-nav-list{\r\n  padding: 0px;\r\n}\r\n\r\n/* SubMenu CSS */\r\n.subMenu-header{\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-orient: horizontal;\r\n  -webkit-box-direction: normal;\r\n      -ms-flex-direction: row;\r\n          flex-direction: row;\r\n  -webkit-box-flex: 1;\r\n      -ms-flex-positive: 1;\r\n          flex-grow: 1;\r\n  -webkit-box-align: center;\r\n      -ms-flex-align: center;\r\n          align-items: center;\r\n}\r\n\r\n.subMenu-item{\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-orient: horizontal;\r\n  -webkit-box-direction: normal;\r\n      -ms-flex-direction: row;\r\n          flex-direction: row;\r\n  -webkit-box-pack: start;\r\n      -ms-flex-pack: start;\r\n          justify-content: flex-start;\r\n  padding: 10px;\r\n  height: 24px;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "./src/app/modules/framework/vertical-menu/vertical-menu.component.html":
/***/ (function(module, exports) {

module.exports = "<md-nav-list>\n  <div *ngFor=\"let item of itemList\">\n    <a *ngIf=\"item.link.length\" [routerLink]=\"item.link\">\n      <md-list-item>\n        <div class=\"subMenu-header\">\n          <md-icon md-list-icon>{{item.icon}}</md-icon>\n          <h3 md-line>{{item.name}}</h3>\n          <div fxFlex></div>\n        </div>\n      </md-list-item>\n    </a>\n    <div *ngIf=\"!item.link.length\">\n      <fw-sub-menu [subMenu]=\"item\"></fw-sub-menu>\n    </div>\n    <md-divider></md-divider>\n  </div>\n</md-nav-list>\n"

/***/ }),

/***/ "./src/app/modules/framework/vertical-menu/vertical-menu.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return VerticalMenuComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var VerticalMenuComponent = (function () {
    function VerticalMenuComponent() {
    }
    VerticalMenuComponent.prototype.ngOnInit = function () {
    };
    return VerticalMenuComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Input */])(),
    __metadata("design:type", Object)
], VerticalMenuComponent.prototype, "itemList", void 0);
VerticalMenuComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_10" /* Component */])({
        selector: 'fw-vertical-menu',
        template: __webpack_require__("./src/app/modules/framework/vertical-menu/vertical-menu.component.html"),
        styles: [__webpack_require__("./src/app/modules/framework/vertical-menu/vertical-menu.component.css")]
    }),
    __metadata("design:paramtypes", [])
], VerticalMenuComponent);

//# sourceMappingURL=vertical-menu.component.js.map

/***/ }),

/***/ "./src/app/services/authentication/auth-guard.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("./node_modules/@angular/router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__auth_service__ = __webpack_require__("./src/app/services/authentication/auth.service.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthGuard; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AuthGuard = (function () {
    function AuthGuard(authService, router) {
        this.authService = authService;
        this.router = router;
    }
    AuthGuard.prototype.canActivate = function () {
        console.log('AuthGuard#canActivate called ' + this.authService.isAuthenticated);
        return this.checkLoggedIn("random");
    };
    AuthGuard.prototype.canActivateChild = function () {
        return this.canActivate();
    };
    AuthGuard.prototype.checkLoggedIn = function (url) {
        if (this.authService.isLoggedIn()) {
            return true;
        }
        this.authService.redirectUrl = url;
        this.router.navigate(['/login']);
        return false;
    };
    return AuthGuard;
}());
AuthGuard = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthenticationService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthenticationService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === "function" && _b || Object])
], AuthGuard);

var _a, _b;
//# sourceMappingURL=auth-guard.service.js.map

/***/ }),

/***/ "./src/app/services/authentication/auth.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("./node_modules/@angular/router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__("./node_modules/@angular/http/@angular/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__("./node_modules/rxjs/add/operator/map.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_catch__ = __webpack_require__("./node_modules/rxjs/add/operator/catch.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_catch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_catch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_Rx__ = __webpack_require__("./node_modules/rxjs/Rx.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_Rx__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthenticationService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var headers = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["b" /* Headers */]({ 'Content-Type': 'application/json' });
var options = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["c" /* RequestOptions */]({ headers: headers });
var AuthenticationService = (function () {
    function AuthenticationService(router, http) {
        this.router = router;
        this.http = http;
        this.isAuthenticated = false;
        this.currentUser = null;
    }
    AuthenticationService.prototype.isLoggedIn = function () {
        return !!this.currentUser;
    };
    AuthenticationService.prototype.logIn = function (logInUser) {
        console.log('UserService.signIn: ' + logInUser.userName + ' ' + logInUser.password + ' ' + logInUser.rememberMe);
        this.isAuthenticated = true;
        this.currentUser = {
            userName: logInUser.userName
        };
        return this.http.post('http://localhost:3000/auth/login', JSON.stringify(logInUser), options)
            .map(function (resp) { return resp.json(); })
            .catch(this.handleError);
        //return Observable.of({}).delay(2000);
        // return Observable.of({}).delay(2000).flatMap(x=>Observable.throw('Invalid User Name and/or Password'));
    };
    AuthenticationService.prototype.register = function (registerUser) {
        this.isAuthenticated = true;
        console.log(registerUser);
        return this.http.post('http://localhost:3000/auth/register', JSON.stringify(registerUser), options)
            .map(function (resp) { return resp.json(); })
            .catch(this.handleError);
        //this.router.navigate(['/signin']);
        //return Observable.of({}).delay(2000);
    };
    AuthenticationService.prototype.connectWithFacebook = function () {
        this.isAuthenticated = true;
        //return Observable.of({}).delay(2000);
        return this.http.get('http://localhost:3000/auth/facebook')
            .map(function (resp) { return resp.json(); })
            .catch(this.handleError);
    };
    AuthenticationService.prototype.connectWithGoogle = function () {
        this.isAuthenticated = true;
        //return Observable.of({}).delay(2000);
        return this.http.get('http://localhost:3000/auth/google')
            .map(function (resp) { return resp.json(); })
            .catch(this.handleError);
    };
    AuthenticationService.prototype.handleError = function (error) {
        console.error(error);
        return __WEBPACK_IMPORTED_MODULE_5_rxjs_Rx__["Observable"].throw(error.json().error || 'Server error');
    };
    AuthenticationService.prototype.logOut = function () {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.router.navigate(['/login']);
        return __WEBPACK_IMPORTED_MODULE_5_rxjs_Rx__["Observable"].of({});
    };
    return AuthenticationService;
}());
AuthenticationService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_http__["d" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_http__["d" /* Http */]) === "function" && _b || Object])
], AuthenticationService);

var _a, _b;
//# sourceMappingURL=auth.service.js.map

/***/ }),

/***/ "./src/app/services/farmer/farmer.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("./node_modules/@angular/http/@angular/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__("./node_modules/rxjs/Observable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_do__ = __webpack_require__("./node_modules/rxjs/add/operator/do.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_do___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_do__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_catch__ = __webpack_require__("./node_modules/rxjs/add/operator/catch.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_catch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_catch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_observable_throw__ = __webpack_require__("./node_modules/rxjs/add/observable/throw.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_observable_throw___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_observable_throw__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_map__ = __webpack_require__("./node_modules/rxjs/add/operator/map.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_observable_of__ = __webpack_require__("./node_modules/rxjs/add/observable/of.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_observable_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_rxjs_add_observable_of__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FarmerService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var FarmerService = (function () {
    function FarmerService(http) {
        this.http = http;
        this.baseUrl = 'http://localhost:3000/';
    }
    //Sell Order operation
    FarmerService.prototype.getSellOrders = function () {
        return this.http.get(this.baseUrl)
            .map(this.extractData)
            .do(function (data) { return console.log('getOrders: ' + JSON.stringify(data)); })
            .catch(this.handleError);
    };
    FarmerService.prototype.getSellOrder = function (id) {
        if (id === 0) {
            return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].of(this.initializeFarmerSellOrder());
        }
        ;
        var url = this.baseUrl + "/" + id;
        return this.http.get(url)
            .map(this.extractData)
            .do(function (data) { return console.log('getProduct: ' + JSON.stringify(data)); })
            .catch(this.handleError);
    };
    FarmerService.prototype.deleteSellOrder = function (id) {
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]({ 'Content-Type': 'application/json' });
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* RequestOptions */]({ headers: headers });
        var url = this.baseUrl + "/" + id;
        return this.http.delete(url, options)
            .do(function (data) { return console.log('deleteProduct: ' + JSON.stringify(data)); })
            .catch(this.handleError);
    };
    FarmerService.prototype.saveSellOrder = function (order) {
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]({ 'Content-Type': 'application/json' });
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* RequestOptions */]({ headers: headers });
        return this.http.post('http://localhost:3000/farmer/order/sell', JSON.stringify(order), options)
            .map(function (resp) { return resp.json(); })
            .catch(this.handleError);
        // if (order.id === 0) {
        //     return this.createSellOrder(order, options);
        // }
        // return this.updateSellOrder(order, options);
    };
    FarmerService.prototype.createSellOrder = function (order, options) {
        order.id = undefined;
        return this.http.post('http://localhost:3000/farmer/order/sell', order, options)
            .map(this.extractData)
            .do(function (data) { return console.log('createOrder: ' + JSON.stringify(data)); })
            .catch(this.handleError);
    };
    FarmerService.prototype.updateSellOrder = function (product, options) {
        var url = this.baseUrl + "/" + product.id;
        return this.http.put(url, product, options)
            .map(function () { return product; })
            .do(function (data) { return console.log('updateSellOrder: ' + JSON.stringify(data)); })
            .catch(this.handleError);
    };
    FarmerService.prototype.initializeFarmerSellOrder = function () {
        // Return an initialized object
        return {
            id: 0,
            productCode: null,
            productCategory: null,
            productSubCategory: null,
            productType: null,
            productUnitType: null,
            variety: null,
            noOfUnit: 0,
            description: null,
            ratePerUnit: 0,
            imageUrl: null,
            customerAddress: null,
            orderDate: null,
        };
    };
    //Get Orders Detail
    FarmerService.prototype.getBuyOrder = function () { };
    FarmerService.prototype.getRentOrder = function () { };
    FarmerService.prototype.getServicesRequestOrder = function () { };
    //Delete Orders
    FarmerService.prototype.deleteBuyOrder = function () { };
    FarmerService.prototype.deleteRentOrder = function () { };
    FarmerService.prototype.deleteServicesRequestOrder = function () { };
    //Save Orders
    FarmerService.prototype.saveBuyOrder = function () { };
    FarmerService.prototype.saveRentOrder = function () { };
    FarmerService.prototype.saveServicesRequestOrder = function () { };
    FarmerService.prototype.extractData = function (response) {
        var body = response.json();
        return body.data || {};
    };
    FarmerService.prototype.handleError = function (error) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].throw(error.json().error || 'Server error');
    };
    return FarmerService;
}());
FarmerService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* Http */]) === "function" && _a || Object])
], FarmerService);

var _a;
//# sourceMappingURL=farmer.service.js.map

/***/ }),

/***/ "./src/environments/environment.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// The file contents for the current environment will overwrite these during build.
var environment = {
    production: false
};
//# sourceMappingURL=environment.js.map

/***/ }),

/***/ "./src/main.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__("./node_modules/@angular/platform-browser-dynamic/@angular/platform-browser-dynamic.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__("./src/app/app.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__("./src/environments/environment.ts");




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["a" /* enableProdMode */])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./src/main.ts");


/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map