// querystringvalues.js
// Print out key/value pairs from querystring.

(function parseQuery(qstr) {
    var query = {};
    var a = qstr.substr(1).split('&');
    for (var i = 0; i < a.length; i++) {
        var b = a[i].split('=');
        query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
    }
    console.log(query);
    return query;
})(window.location.search);
