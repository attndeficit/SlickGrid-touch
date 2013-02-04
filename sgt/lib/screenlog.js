
/*jslint undef: true, newcap: true, nomen: false, white: true, regexp: true */
/*jslint plusplus: false, bitwise: true, maxerr: 50, maxlen: 110, indent: 4 */
/*jslint sub: true */
/*globals window navigator document */
/*globals setTimeout clearTimeout setInterval */ 
/*globals Slick alert */ 

/*
 * Logging to the screen comes handy on mobile defices with no debug console.
 *
 * Usage:    ... load the javascript,
 *
 *           ... load the dependency: json2.js
 *
 *           ... add this tag to your body:
 *                
 *               <div id="logger" />
 *
 *           ... call from your code:
 *
 *               log(var1 [, var2, var3, ...]);
 *
 */

(function ($) {

    // XXX There is a critical issue here. If you log an object with a prototype, then
    // it will follow two many references and goes to recursion (Stop Script Death)
    // TODO This should, eventually, be fixed.

    function safeConvert(obj) {
        var type = $.type(obj);
        if (type == 'object' && $(obj).parent().length > 0) {
            obj = "DOM #" + $(obj).attr('id');
        } else if (type == 'array' || type == 'object') {
            var res;
            if (type == 'array') {
                res = [];
            } else {
                res = {};
            }
            $.each(obj, function (key, value) {
                res[key] = safeConvert(value);
            });
            obj = res;
        }
        return obj;
    }

    // Custom logging. On mobile devices, debug console is
    // lacking. We provide a way to print log messages
    // into the html page itself.
    function log() {
        var args = [new Date()];
        var i;
        for (i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
        args = safeConvert(args);
        var repr = JSON.stringify(args);
        $('#logger').prepend('<code>' + repr + '</code><br>');
    }
    // Make it available for code outside the closure.
    window.log = log;

})(window.jQuery);
