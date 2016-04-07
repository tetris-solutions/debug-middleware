import test from 'ava'
import {debugMiddleware} from '../index'
import http from 'node-mocks-http'

process.env.DEBUG_PWD = '123456'

test('bypasses empty on _debug query parameter', t => {
  const req = http.createRequest()
  const res = http.createResponse()
  const previousEnv = process.env.NODE_ENV

  process.env.NODE_ENV = 'production'

  debugMiddleware(req, res, () => {
    process.env.NODE_ENV = previousEnv

    t.falsy(req.debugMode)
  })
})

test('bypasses empty on wrong _debug query parameter', t => {
  const req = http.createRequest({
    headers: {
      'Referer': 'http://google.com/?_debug=xxx'
    }
  })
  const res = http.createResponse()
  const previousEnv = process.env.NODE_ENV

  process.env.NODE_ENV = 'production'

  debugMiddleware(req, res, () => {
    process.env.NODE_ENV = previousEnv

    t.falsy(req.debugMode)
  })
})

test('enables debugMode empty on correct _debug query parameter', t => {
  const req = http.createRequest({
    headers: {
      'Referer': 'http://google.com/?_debug=' + process.env.DEBUG_PWD
    }
  })
  const res = http.createResponse()

  debugMiddleware(req, res, () => {
    t.is(true, req.debugMode)
  })
})
