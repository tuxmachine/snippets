/**
 * breakOn
 *
 * Omg the cookie is being changed, but where? Give me a breakpoint
 * when JS changes my cookies!
 *
 *      breakOn(document, 'cookie');
 *
 * Some JS is getting the scrollTop value causing massive Recalculate
 * Styles costs. Who is the perpetrator PERFetrator?
 *
 *      breakOn(document.body,'scrollTop', 'read')
 *
 * By default, breakOn will only break when JS attempts to change the
 * value of a property. The third optional argument takes 'read' if
 * you'd also like to break when values are read.
 *
 * It is also possible to disable/enable a breakpoint by using
 * methods provided by returned object.
 *
 *     var bp = breakOn(document, 'cookie');
 *     found it!
 *     bp.disable();
 *     something else is up....
 *     bp.enable();
 *
 * breakOn also supports Conditional Breakpoints when the 4th argument
 * is a function. Say you know a property is being changed after the
 * 4th change.
 *
 *     var i = 0;
 *     var bp = breakOn(document, 'cookie', false, function(v) {
 *         return i++ >= 4;
 *     });
 *
 * Or something is leaving a property undefined
 *
 *     var bp = breakOn(document, 'cookie', false, function(v) {
 *         return typeof v === 'undefined';
 *     });
 *
 * https://github.com/paulirish/break-on-access
 */
(function() {
    window.breakOn = function(obj, propertyName, mode, func) {
        // this is directly from https://github.com/paulmillr/es6-shim
        function getPropertyDescriptor(obj, name) {
            var property = Object.getOwnPropertyDescriptor(obj, name);
            var proto = Object.getPrototypeOf(obj);
            while (property === undefined && proto !== null) {
                property = Object.getOwnPropertyDescriptor(proto, name);
                proto = Object.getPrototypeOf(proto);
            }
            return property;
        }

        function verifyNotWritable() {
            if (mode !== 'read')
                throw "This property is not writable, so only possible mode is 'read'.";
        }

        var enabled = true;
        var originalProperty = getPropertyDescriptor(obj, propertyName);
        var newProperty = { enumerable: originalProperty.enumerable };

        // write
        if (originalProperty.set) {// accessor property
            newProperty.set = function(val) {
                if(enabled && (!func || func && func(val)))
                    debugger;

                originalProperty.set.call(this, val);
            }
        } else if (originalProperty.writable) {// value property
            newProperty.set = function(val) {
                if(enabled && (!func || func && func(val)))
                    debugger;

                originalProperty.value = val;
            }
        } else  {
            verifyNotWritable();
        }

        // read
        newProperty.get = function(val) {
              if(enabled && mode === 'read' && (!func || func && func(val)))
                debugger;

            return originalProperty.get ? originalProperty.get.call(this, val) : originalProperty.value;
        }

        Object.defineProperty(obj, propertyName, newProperty);

        return {
          disable: function() {
            enabled = false;
          },

          enable: function() {
            enabled = true;
          }
        };
    };
})();
