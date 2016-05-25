/* stopBefore
 *
 * Prepend the debugger statement to a function as easy as
 * stopBefore('Element.prototype.removeChild'). Works in Chrome DevTools
 * and Safari Inspector, doesn’t work in Firebug‘s and Firefox Developer
 * Tools‘ console (I don’t know why). Works as a standalone script
 * everywhere.
 *
 * https://gist.github.com/NV/5376464
 */

(function() {

	window.stopBefore = function stopBefore(object, methodName) {

		// stopBefore('Element.prototype.removeChild')
		if (typeof methodName == 'undefined' && typeof object == 'string') {
			var temp = resolvePath(object);
			object = temp.object;
			methodName = temp.methodName;
		}

		var originalMethod = object[methodName];
		object[methodName] = function patched() {
			debugger;
			var result = originalMethod.apply(this, arguments);
			return result;
		};

		object[methodName].removeBreakpoint = function() {
			object[methodName] = originalMethod;
		};

		object[methodName].__original = originalMethod;
	};


	window.stopAfter = function stopAfter(object, methodName) {

		// stopAfter('jQuery.fn.html')
		if (typeof methodName == 'undefined') {
			var temp = resolvePath(object);
			object = temp.object;
			methodName = temp.methodName;
		}

		var originalMethod = object[methodName];
		object[methodName] = function patched() {
			var result = originalMethod.apply(this, arguments);
			debugger;
			return result;
		};

		object[methodName].removeBreakpoint = function() {
			object[methodName] = originalMethod;
		};

		object[methodName].__original = originalMethod;
	};


	function resolvePath(path) {
		var object = this;
		var parts = path.split('.');
		for (var i = 0, ii = parts.length - 1; i < ii; i++) {
			object = object[parts[i]];
		}
		return {
			object: object,
			methodName: parts[ii]
		}
	}

})();
