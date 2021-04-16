export const checkFile = (types) => (req, res, next) => {
  const typeSent = req.file.mimetype;
  if (!types.includes(typeSent)) {
    res.status('400').send({
      message: `Only${types.join(',')} mime-types are accepted! You sent ${
        req.file.mimetype
      }`,
    });
  } else {
    next();
  }
};
