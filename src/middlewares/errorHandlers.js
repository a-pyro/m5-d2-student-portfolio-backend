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
  if (!req.pathname) {
    res.status(404).send({
      message: `${req.protocol}://${req.hostname}:${process.env.PORT}${req.originalUrl} is not implemented!`,
    });
  } else {
    next();
  }
};

export const catchAllErrorHandler = (err, req, res, next) => {
  console.log('catchAllErrorHandler'.red);
  console.log(err.stack);

  if (err.origin === 'multerExt') {
    return res
      .status(err.statusCode)
      .send({ success: false, message: err.message });
  }

  if (err.field !== 'profilePic') {
    return res.status(400).send({
      success: false,
      message: `profilePic expected as fieldname, you sent ${err.field}`,
    });
  }
  // console.log(err.stack);
  // res.status(500).send('Generic Server Error');
  res.status(500).send({ message: 'internal server error 💩' });
};
