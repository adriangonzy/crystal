/* eslint-disable @typescript-eslint/no-var-requires */
var http = require('http'),
  httpProxy = require('http-proxy')

//
// Create a proxy server with custom application logic
//
var proxy = httpProxy.createProxyServer({ changeOrigin: true })

// To modify the proxy connection before data is sent, you can listen
// for the 'proxyReq' event. When the event is fired, you will receive
// the following arguments:
// (http.ClientRequest proxyReq, http.IncomingMessage req,
//  http.ServerResponse res, Object options). This mechanism is useful when
// you need to modify the proxy request before the proxy connection
// is made to the target.
//

// proxy.on('proxyRes', function (proxyRes, req, res, options) {
//   // proxyReq.setHeader('X-Special-Proxy-Header', 'foobar')
//   res.setHeader('Access-Control-Allow-Origin', '*')
// })

// Listen for the `error` event on `proxy`.
proxy.on('error', function (err, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain',
  })

  res.end('Something went wrong. And we are reporting a custom error message.')
})

var server = http.createServer(function (req, res) {
  // You can define here your custom logic to handle the request
  // and then proxy the request.
  console.log(req.method)
  console.log(req.headers)
  if (req.method === 'OPTIONS') {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('ok')
    console.log(res.headers)
    return
  }
  proxy.web(req, res, {
    target: 'https://relay-goerli.flashbots.net',
  })
})

console.log('listening on port 8545')
server.listen(8545)
