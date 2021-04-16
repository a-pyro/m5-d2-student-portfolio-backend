export const notFoundErrorHandler = (err, req, res, next) => {
  if (err.httpStatusCode === 404) {
    console.log('notFoundErrorHandler');
    res.status(404).send(err.message || 'NOT FOUND');
    return;
  }
  next(err);
};

export const badRequestErrorHandling = (err, req, res, next) => {
  if (err.httpStatusCode === 400) {
    console.log('badRequestErrorHandling');

    res.status(400).send(err.errorList);
    return;
  }
  next(err);
};

export const forbiddenErrorHandler = (err, req, res, next) => {
  if (err.httpStatusCode === 403) {
    console.log('forbiddenErrorHandler');

    res.status(403).send('Forbidden');
    return;
  }
  next(err);
};

// se mi chiamano route sbagliata
export const routeNotFoundHandler = (req, res, next) => {
  // console.log(req.originalUrl);
  res.status(404).send({
    message: `${req.protocol}://${req.hostname}:${process.env.PORT}${req.originalUrl} is not implemented or wrong`,
  });
};

export const catchAllErrorHandler = (err, req, res, next) => {
  console.log('catchAllErrorHandler');
  res.status(500).send('Generic Server Error');
};
