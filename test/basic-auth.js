const assert = require('assert')
const auth = require('..')

function request (authorization) {
  return {
    headers: {
      authorization: authorization
    }
  }
}

describe('auth(req)', function () {
  describe('arguments', function () {
    describe('req', function () {
      it('should be required', function () {
        assert.throws(auth, /argument req is required/)
      })

      it('should accept a request', function () {
        const req = request('basic Zm9vOmJhcg==')
        const creds = auth(req)
        assert.strictEqual(creds.name, 'foo')
        creds.name = 'foooo'
        assert.strictEqual(creds.username(), 'foo')
        assert.strictEqual(creds.pass, 'bar')
        creds.pass = 'barrr'
        assert.strictEqual(creds.password(), 'bar')
      })

      it('should reject null', function () {
        assert.throws(auth.bind(null, null), /argument req is required/)
      })

      it('should reject a number', function () {
        assert.throws(auth.bind(null, 42), /argument req is required/)
      })

      it('should reject an object without headers', function () {
        assert.throws(auth.bind(null, {}), /argument req is required/)
      })
    })
  })

  describe('with no Authorization field', function () {
    it('should return undefined', function () {
      const req = request()
      assert.strictEqual(auth(req), undefined)
    })
  })

  describe('with malformed Authorization field', function () {
    it('should return undefined', function () {
      const req = request('Something')
      assert.strictEqual(auth(req), undefined)
    })
  })

  describe('with malformed Authorization scheme', function () {
    it('should return undefined', function () {
      const req = request('basic_Zm9vOmJhcg==')
      assert.strictEqual(auth(req), undefined)
    })
  })

  describe('with malformed credentials', function () {
    it('should return undefined', function () {
      const req = request('basic Zm9vcgo=')
      assert.strictEqual(auth(req), undefined)
    })
  })

  describe('with malformed credentials', function () {
    it('should return undefined', function () {
      const req = request('basic Zm9vOmJhcg==#')
      assert.strictEqual(auth(req), undefined)
    })
  })

  describe('with malformed credentials', function () {
    it('should return undefined', function () {
      const req = request('basic +Zm9vOmJhcg==#')
      assert.strictEqual(auth(req), undefined)
    })
  })

  describe('with valid credentials', function () {
    it('should return .name and .pass', function () {
      const req = request('basic Zm9vOmJhcg==')
      const creds = auth(req)
      assert.strictEqual(creds.name, 'foo')
      creds.name = 'foooo'
      assert.strictEqual(creds.username(), 'foo')
      assert.strictEqual(creds.pass, 'bar')
      creds.pass = 'barrr'
      assert.strictEqual(creds.password(), 'bar')
    })
  })

  describe('with empty password', function () {
    it('should return .name and .pass', function () {
      const req = request('basic Zm9vOg==')
      const creds = auth(req)
      assert.strictEqual(creds.name, 'foo')
      creds.name = 'foooo'
      assert.strictEqual(creds.username(), 'foo')
      assert.strictEqual(creds.pass, '')
      creds.pass = 'barrr'
      assert.strictEqual(creds.password(), '')
    })
  })

  describe('with empty userid', function () {
    it('should return .name and .pass', function () {
      const req = request('basic OnBhc3M=')
      const creds = auth(req)
      assert.strictEqual(creds.name, '')
      creds.name = 'foooo'
      assert.strictEqual(creds.username(), '')
      assert.strictEqual(creds.pass, 'pass')
      creds.pass = 'passss'
      assert.strictEqual(creds.password(), 'pass')
    })
  })

  describe('with empty userid and pass', function () {
    it('should return .name and .pass', function () {
      const req = request('basic Og==')
      const creds = auth(req)
      assert.strictEqual(creds.name, '')
      creds.name = 'foooo'
      assert.strictEqual(creds.username(), '')
      assert.strictEqual(creds.pass, '')
      creds.pass = 'barrr'
      assert.strictEqual(creds.password(), '')
    })
  })

  describe('with colon in pass', function () {
    it('should return .name and .pass', function () {
      const req = request('basic Zm9vOnBhc3M6d29yZA==')
      const creds = auth(req)
      assert.strictEqual(creds.name, 'foo')
      creds.name = 'foooo'
      assert.strictEqual(creds.username(), 'foo')
      assert.strictEqual(creds.pass, 'pass:word')
      creds.pass = 'barrr'
      assert.strictEqual(creds.password(), 'pass:word')
    })
  })

  describe('with scheme "Basic"', function () {
    it('should return .name and .pass', function () {
      const req = request('Basic Zm9vOmJhcg==')
      const creds = auth(req)
      assert.strictEqual(creds.name, 'foo')
      creds.name = 'foooo'
      assert.strictEqual(creds.username(), 'foo')
      assert.strictEqual(creds.pass, 'bar')
      creds.pass = 'barrr'
      assert.strictEqual(creds.password(), 'bar')
    })
  })

  describe('with scheme "BASIC"', function () {
    it('should return .name and .pass', function () {
      const req = request('BASIC Zm9vOmJhcg==')
      const creds = auth(req)
      assert.strictEqual(creds.name, 'foo')
      assert.strictEqual(creds.pass, 'bar')
    })
  })

  describe('with scheme "BaSiC"', function () {
    it('should return .name and .pass', function () {
      const req = request('BaSiC Zm9vOmJhcg==')
      const creds = auth(req)
      assert.strictEqual(creds.name, 'foo')
      creds.name = 'foooo'
      assert.strictEqual(creds.username(), 'foo')
      assert.strictEqual(creds.pass, 'bar')
      creds.pass = 'barrr'
      assert.strictEqual(creds.password(), 'bar')
    })
  })
})

describe('auth.parse(string)', function () {
  describe('with undefined string', function () {
    it('should return undefined', function () {
      assert.strictEqual(auth.parse(), undefined)
    })
  })

  describe('with malformed string', function () {
    it('should return undefined', function () {
      assert.strictEqual(auth.parse('Something'), undefined)
    })
  })

  describe('with malformed scheme', function () {
    it('should return undefined', function () {
      assert.strictEqual(auth.parse('basic_Zm9vOmJhcg=='), undefined)
    })
  })

  describe('with malformed credentials', function () {
    it('should return undefined', function () {
      assert.strictEqual(auth.parse('basic Zm9vcgo='), undefined)
    })
  })

  describe('with valid credentials', function () {
    it('should return .name and .pass', function () {
      const creds = auth.parse('basic Zm9vOmJhcg==')
      assert.strictEqual(creds.name, 'foo')
      creds.name = 'foooo'
      assert.strictEqual(creds.username(), 'foo')
      assert.strictEqual(creds.pass, 'bar')
      creds.pass = 'barrr'
      assert.strictEqual(creds.password(), 'bar')
    })
  })

  describe('with empty password', function () {
    it('should return .name and .pass', function () {
      const creds = auth.parse('basic Zm9vOg==')
      assert.strictEqual(creds.name, 'foo')
      creds.name = 'foooo'
      assert.strictEqual(creds.username(), 'foo')
      assert.strictEqual(creds.pass, '')
      creds.pass = 'barrr'
      assert.strictEqual(creds.password(), '')
    })
  })

  describe('with empty userid', function () {
    it('should return .name and .pass', function () {
      const creds = auth.parse('basic OnBhc3M=')
      assert.strictEqual(creds.name, '')
      creds.name = 'foooo'
      assert.strictEqual(creds.username(), '')
      assert.strictEqual(creds.pass, 'pass')
      creds.pass = 'passss'
      assert.strictEqual(creds.password(), 'pass')
    })
  })

  describe('with empty userid and pass', function () {
    it('should return .name and .pass', function () {
      const creds = auth.parse('basic Og==')
      assert.strictEqual(creds.name, '')
      creds.name = 'foooo'
      assert.strictEqual(creds.username(), '')
      assert.strictEqual(creds.pass, '')
      creds.pass = 'passss'
      assert.strictEqual(creds.password(), '')
    })
  })

  describe('with colon in pass', function () {
    it('should return .name and .pass', function () {
      const creds = auth.parse('basic Zm9vOnBhc3M6d29yZA==')
      assert.strictEqual(creds.name, 'foo')
      creds.name = 'foooo'
      assert.strictEqual(creds.username(), 'foo')
      assert.strictEqual(creds.pass, 'pass:word')
      creds.pass = 'passss'
      assert.strictEqual(creds.password(), 'pass:word')
    })
  })

  describe('with scheme "Basic"', function () {
    it('should return .name and .pass', function () {
      const req = request('Basic Zm9vOmJhcg==')
      const creds = auth(req)
      assert.strictEqual(creds.name, 'foo')
      creds.name = 'foooo'
      assert.strictEqual(creds.username(), 'foo')
      assert.strictEqual(creds.pass, 'bar')
      creds.pass = 'passss'
      assert.strictEqual(creds.password(), 'bar')
    })
  })

  describe('with scheme "BASIC"', function () {
    it('should return .name and .pass', function () {
      const req = request('BASIC Zm9vOmJhcg==')
      const creds = auth(req)
      assert.strictEqual(creds.name, 'foo')
      creds.name = 'foooo'
      assert.strictEqual(creds.username(), 'foo')
      assert.strictEqual(creds.pass, 'bar')
      creds.pass = 'passss'
      assert.strictEqual(creds.password(), 'bar')
    })
  })

  describe('with scheme "BaSiC"', function () {
    it('should return .name and .pass', function () {
      const req = request('BaSiC Zm9vOmJhcg==')
      const creds = auth(req)
      assert.strictEqual(creds.name, 'foo')
      creds.name = 'foooo'
      assert.strictEqual(creds.username(), 'foo')
      assert.strictEqual(creds.pass, 'bar')
      creds.pass = 'passss'
      assert.strictEqual(creds.password(), 'bar')
    })
  })
})
