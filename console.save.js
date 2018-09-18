(function(console){

    console.save = function(data, filename){

        if(!data) {
            console.error('Console.save: No data')
            return;
        }

        if(!filename) filename = 'console.json'

        if(typeof data === "object"){
            data = JSON.stringify(data, undefined, 4)
        }

        var blob = new Blob([data], {type: 'text/json'}),
            e    = document.createEvent('MouseEvents'),
            a    = document.createElement('a')

        a.download = filename
        a.href = window.URL.createObjectURL(blob)
        a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        a.dispatchEvent(e)
    }
    console.export = function(data, filename) {
        if(!data || !(data instanceof Array)) {
            console.error('Console.export: invalid data')
            return;
        }
        data = json2csv(data);

        if(!filename) filename = 'console.csv'

        var blob = new Blob([data], {type: 'text/csv'}),
            e    = document.createEvent('MouseEvents'),
            a    = document.createElement('a')

        a.download = filename
        a.href = window.URL.createObjectURL(blob)
        a.dataset.downloadurl =  ['text/csv', a.download, a.href].join(':')
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        a.dispatchEvent(e)
    }

    function json2csv(data) {
        let keys = Object.keys(data[0]);
        let csv = data.map(row => {
            return keys.map(key => escapeForCsv(row[key])).join(';');
        });
        csv.unshift(keys.map(escapeForCsv).join(';'));
        return csv.join('\r\n');
    }

    function escapeForCsv(value) {
        if(/^[0-9a-z ]*$/i.test(value))
            return value;
        return '"' + value.replace('"', '""') + '"';
    }
})(console)
