var queryString = require('querystring')

/**
 * reads debug header, setting req.debugMode
 * @param {Object} req express request
 * @param {Object} res express response
 * @param {Function} next next handler
 * @returns {undefined}
 */
function debugMiddleware (req, res, next) {
  if (process.env.NODE_ENV !== 'production') {
    req.debugMode = true
    return next()
  }

  if (req.query._debug === process.env.DEBUG_PWD) {
    req.debugMode = true
    return next()
  }

  var referer = req.get('referer')

  if (!referer) return next()

  var qs = referer.split('?')[1]

  if (!qs) return next()

  qs = queryString.parse(qs)

  if (qs._debug && qs._debug === process.env.DEBUG_PWD) {
    req.debugMode = true
  }

  return next()
}

module.exports = debugMiddleware
