var http = require('http'),
request = require('request'),
express = require('express'),
os = require( 'os' ),
ejs = require('ejs');

var serverPort = process.env.SERVER_PORT || 45714;
var clientPort = process.env.CLIENT_PORT || 45715;

var networkInterfaces = os.networkInterfaces( );

function getIpAddress() {
    var keys = Object.keys(networkInterfaces);
    for (var x = 0; x < keys.length; ++x) {
        var netIf = networkInterfaces[keys[x]];
        for (var y = 0; y < netIf.length; ++ y) {
            var addr = netIf[y];
            if (addr.family === 'IPv4' && !addr.internal) {
                return addr.address;
            }
        }
    }
    return '127.0.0.1';
}

//eventually, actual domain will be supplied instead of generating one from IP address
var serverHost = '//'+getIpAddress()+':'+serverPort;
var platformScript = '/3rd/platform.js';
var serverApp = express();

//if we decide to enable CORS
// serverApp.use(function(req, res, next) {
//     if ((/^\/api\/3rd\/.+$/).test(req.path)) {
//         var corsOrigin = req.headers.origin;
//         var corsMethod = req.headers['access-control-request-method'];
//         var corsHeaders = req.headers['access-control-request-headers'];
//         var hasACorsFlag = corsOrigin || corsMethod || corsHeaders;
//         if (hasACorsFlag) {
//             res.header('Access-Control-Allow-Origin', corsOrigin);
//             res.header('Access-Control-Allow-Methods', corsMethod);
//             res.header('Access-Control-Allow-Headers', corsHeaders);
//             res.header('Access-Control-Max-Age', 60 * 60 * 24);
//             if (req.method === 'OPTIONS') {
//                 res.send(200);
//                 return;
//             }
//         }
//     }
//     next();
// });

//serve platform script file
serverApp.engine('js', ejs.renderFile);
serverApp.get(platformScript, function(req, res) {

    res.render('server'+platformScript, {
        serverHost: serverHost,
        platformScript: platformScript,
        xListingContent: 'website-config-id=237',
        authorization: 'Bearer 3448f98a-ac8b-3216-beee-8584175c6070'
    });
});

serverApp.use(express.static('server'));

//simulate client server for testing how widget will be embedded
var clientApp = express();
clientApp.set('view engine', 'html');
clientApp.engine('html', ejs.renderFile);
clientApp.use("/styles", express.static(__dirname + "/styles"))

clientApp.get('/', function(req, res) {
  console.log(platformScript)
      res.render('client/index', {
          serverHost: serverHost,
          platformScript: platformScript
      });
});

http.createServer(serverApp).listen(serverPort);
http.createServer(clientApp).listen(clientPort);