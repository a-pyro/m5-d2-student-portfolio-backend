export const notFoundErrorHandler = (err, req, res, next) => {
  if (err.httpStatusCode === 404) {
    res.status(404).send(err.message || 'NOT FOUND');
  } else {
    next(err);
  }
};
