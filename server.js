var http = require('http');
var url = require('url');
var fs = require('fs');

var mime = require('./mime.json');

http.createServer(function(req, res) {
    var file = url.parse(req.url).pathname;
    var extension = file.substring(file.lastIndexOf('.'));
    var type = mime[extension];
    fs.readFile('.' + file, function(err, data) {
        console.log(file);
        if (err) {
            res.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            res.end("Page Not Found");
        } else {
            if (type) res.writeHead(200, {
                'Content-Type': type
            });
            res.end(data);
        }
    });
}).listen(3000);
console.log("server listening at 3000");
