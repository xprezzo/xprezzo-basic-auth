# xprezzo-basic-auth

Basic auth Authorization header field parser for [xprezzo](https://github.com/xprezzo).

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/). Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```
$ npm install xprezzo-basic-auth
```

## API

<!-- eslint-disable no-unused-vars -->

```js
var auth = require('xprezzo-basic-auth')
```

### auth(req)

Get the basic auth credentials from the given request. The `Authorization`
header is parsed and if the header is invalid, `undefined` is returned,
otherwise an object with `name` and `pass` properties.

### auth.parse(string)

Parse a basic auth authorization header string. This will return an object
with `name` and `pass` properties, or `undefined` if the string is invalid.

## Example

Pass a Node.js request object to the module export. If parsing fails
`undefined` is returned, otherwise an object with `.name` and `.pass`.

<!-- eslint-disable no-unused-vars, no-undef -->

```js
var auth = require('xprezzo-basic-auth')
var user = auth(req)
// => { name: 'something', pass: 'whatever' }
```

A header string from any other location can also be parsed with
`auth.parse`, for example a `Proxy-Authorization` header:

<!-- eslint-disable no-unused-vars, no-undef -->

```js
var auth = require('xprezzo-basic-auth')
var user = auth.parse(req.getHeader('Proxy-Authorization'))
```

### With vanilla node.js http server

```js
var http = require('http')
var auth = require('xprezzo-basic-auth')
var compare = require('tsscmp')

// Create server
var server = http.createServer(function (req, res) {
  var credentials = auth(req)

  // Check credentials
  // The "check" function will typically be against your user store
  if (!credentials || !check(credentials.name, credentials.pass)) {
    res.statusCode = 401
    res.setHeader('WWW-Authenticate', 'Basic realm="example"')
    res.end('Access denied')
  } else {
    res.end('Access granted')
  }
})

// Basic function to validate credentials for example
function check (name, pass) {
  var valid = true

  // Simple method to prevent short-circut and use timing-safe compare
  valid = compare(name, 'john') && valid
  valid = compare(pass, 'secret') && valid

  return valid
}

// Listen
server.listen(3000)
```

## People

Xprezzo and related projects are maintained by [Cloudgen Wong](mailto:cloudgen.wong@gmail.com).

# License

[MIT](LICENSE)
