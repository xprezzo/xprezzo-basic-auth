/*!
 * xprezzo-basic-auth
 * Copyright(c) 2020 Ben Ajenoui <info@seohero.io>
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies.
 * @private
 */

var Buffer = require('xprezzo-buffer').Buffer

/**
 * Module exports.
 * @public
 */

module.exports = function(req) {
  if (!req) {
    throw new TypeError('argument req is required')
  } else if (typeof req !== 'object') {
    throw new TypeError('argument req is required to be an object')
  }
  return (new Credentials(req)).verify();
};
module.exports.parse = function(opts) {
  return (new Credentials(opts)).verify();
};
module.exports.Credentials = Credentials;
module.exports.buffer = require("xprezzo-buffer")
module.exports.mixim = require("xprezzo-buffer").mixim

/**
 * Class to represent user credentials.
 * @private
 */

function Credentials (opts) {
  this.name = this.pass = "";
  this.verified = false;
  if (typeof opts === 'object'){
    if (!opts.headers || typeof opts.headers !== 'object') {
      throw new TypeError('argument req is required to have headers property')
    }
    var header=opts.headers.authorization
    this.parseHeader(header);
  } else if (typeof opts === 'string'){
    this.parseHeader(opts);
  }
}

Credentials.prototype.verify = function(){
  return (this.verified)? this: undefined;
}

Credentials.prototype.parseHeader = function(opts){
  // parse header
  var match, userPass;
  if (typeof opts !== 'string' ||
    !(match=/^\s*(?:basic)\s+([A-Z\d\._~\+/-]+=*)\s*$/i.exec(opts)) ||
    !(userPass = /^([^:]*):(.*)$/.exec(Buffer.from(match[1], 'base64').toString()))
  ) {
    return this;
  }
  this.name = userPass[1];
  this.pass = userPass[2];
  this.verified = true;
  return this;
}
