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

export const forbiddenErrorHandler = (err, req, res, next) => {
  if (err.httpStatusCode === 403) res.status(403).send('Forbidden');
  next(err);
};

export const catchAllErrorHandler = (err, req, res, next) =>
  res.status(500).send('Generic Server Error');
