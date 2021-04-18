export const checkFile = () => (req, res, next) => {
  const { mimetype } = req.file;
  // console.log(mimetype);
  if (!['image/jpeg', 'image/png'].includes(mimetype)) {
    res.status(400).send({
      message: `Only ${types.join(
        ','
      )} mime-types are accepted! You sent: ${mimetype}`,
    });
  } else {
    next();
  }
};
