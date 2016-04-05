var http = require('http');
var url = require('url');
var fs = require('fs');

http.createServer(function(req, res){
    var urlObj = url.parse(req.url);
    console.log(urlObj.pathname);
    fs.readFile('.' + urlObj.pathname, function(err, data){
        if(err)res.end("not found");
        res.end(data);
    });
}).listen(3000);
console.log("server listening at 3000");