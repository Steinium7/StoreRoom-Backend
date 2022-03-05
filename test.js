var http = require('http')

http.createServer(function(req, res) {

    if (req.url == '/'){
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify({"five":5}))
        res.end;
        console.log('Link has been visited')
        
    }


}).listen(3000, () => { console.log("listening on localhost:3000")})