export const notFoundErrorHandler = (err, req, res, next) => {
  if (err.httpStatusCode === 404) {
    console.log('error here');
    res.status(404).send(err.message || 'NOT FOUND');
    return;
  }
  next(err);
};

export const badRequestErrorHandling = (err, req, res, next) => {
  if (err.httpStatusCode === 400) {
    res.status(400).send(err.errorList);
    return;
  }
  next(err);
};

export const forbiddenErrorHandler = (err, req, res, next) => {
  if (err.httpStatusCode === 403) {
    res.status(403).send('Forbidden');
    return;
  }
  next(err);
};

export const catchAllErrorHandler = (err, req, res, next) =>
  res.status(500).send('Generic Server Error');
