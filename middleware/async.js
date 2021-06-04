// monkey patch the (req, res) route

function asyncMiddleware(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = asyncMiddleware;
