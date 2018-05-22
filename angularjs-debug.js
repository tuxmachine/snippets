// ==UserScript==
// @name         AngularJS helper script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add some debugging helpers for AngularJS to window
// @author       You
// @match        http://*/*
// @match        https://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    if(!window.angular) return;
    function getContext(prop) {
        if(!$0)
            return console.error('Please select an element in the DOM first');
        try {
            var scope = angular.element($0).scope();
            if(prop)
                return scope[prop];
            return scope;
        } catch (e) {
            if(confirm('Angular scope not found, reload with debug info?'))
                angular.reloadWithDebugInfo();
        }
    }
    Object.defineProperties(window, {
        'ctrl': {
            get: function() { return getContext('$ctrl'); }
        },
        '$ctrl': {
            get: function() { return getContext('$ctrl'); }
        },
        s: {
            get: function() { return getContext(); }
        }
    });
})();
