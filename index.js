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
const prop = new WeakMap()
const Buffer = require('xprezzo-buffer').Buffer

/**
 * setter and getter for verified
 * @private
 */
function __verified__ (verified) {
  let that = prop.get(this)
  if (typeof verified === 'undefined') {
    return that.verified
  } else if (typeof verified === 'boolean') {
    if (typeof that !== 'object') {
      that = {}
    }
    that.verified = verified
    prop.set(this, that)
  }
  return this
}

/**
 * setter and getter for username
 * @private
 */
function __username__ (username) {
  let that = prop.get(this)
  if (typeof username === 'undefined') {
    return that.username
  } else if (typeof username === 'string') {
    if (typeof that !== 'object') {
      /* istanbul ignore next */
      that = {}
    }
    that.username = username
    prop.set(this, that)
  }
  return this
}

/**
 * setter and getter for password
 * @private
 */
function __password__ (password) {
  let that = prop.get(this)
  if (typeof password === 'undefined') {
    return that.password
  } else if (typeof password === 'string') {
    if (typeof that !== 'object') {
      /* istanbul ignore next */
      that = {}
    }
    that.password = password
    prop.set(this, that)
  }
  return this
}

/**
 * Class to represent user credentials.
 * @private
 */

class Credentials {
  constructor (opts) {
    this.name = this.pass = ''
    __verified__.call(this, false)
    if (typeof opts === 'object') {
      if (!opts.headers || typeof opts.headers !== 'object') {
        throw new TypeError('argument req is required to have headers property')
      }
      if (typeof opts.headers.authorization === 'string') {
        this.parseHeader(opts.headers.authorization)
      }
    } else if (typeof opts === 'string') {
      this.parseHeader(opts)
    }
  }

  verify () {
    return (__verified__.call(this)) ? this : undefined
  }

  verified () {
    /* istanbul ignore next */
    return __verified__.call(this)
  }

  username () {
    return __username__.call(this)
  }

  password () {
    return __password__.call(this)
  }

  parseHeader (opts) {
    let match, userPass
    if (typeof opts !== 'string' ||
      !(match = /^\s*(?:basic)\s+([A-Z\d._~+/-]+=*)\s*$/i.exec(opts)) ||
      !(userPass = /^([^:]*):(.*)$/.exec(Buffer.from(match[1], 'base64').toString()))
    ) {
      return this
    }
    __username__.call(this, userPass[1])
    __password__.call(this, userPass[2])
    this.name = __username__.call(this)
    this.pass = __password__.call(this)
    __verified__.call(this, true)
    return this
  }
}

/**
 * Module exports.
 * @public
 */

module.exports = function (req) {
  if (!req) {
    throw new TypeError('argument req is required')
  } else if (typeof req !== 'object') {
    throw new TypeError('argument req is required to be an object')
  }
  return (new Credentials(req)).verify()
}

module.exports.parse = function (opts) {
  return (new Credentials(opts)).verify()
}

module.exports.Credentials = Credentials
module.exports.buffer = require('xprezzo-buffer')
module.exports.mixim = require('xprezzo-buffer').mixim
