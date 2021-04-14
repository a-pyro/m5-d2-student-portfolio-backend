export const notFoundErrorHandler = (err, req, res, next) => {
  if (err.httpStatusCode === 404) {
    res.status(404).send(err.message || 'NOT FOUND');
  } else {
    next(err);
  }
};

export const badRequestErrorHandling = (err, req, res, next) => {
  if (err.httpStatusCode === 400) {
    res.status(400).send(err.errorList);
  } else {
    next(err);
  }
};
