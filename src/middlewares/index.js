// export const checkFile = (types, formDataKey) => (req, res, next) => {
//   const { fieldname, mimetype } = req.file;
//   console.log(fieldname, mimetype);

//   if (!types.includes(mimetype)) {
//     res.status(400).send({
//       message: `Only ${types.join(
//         ','
//       )} mime-types are accepted! You sent: ${mimetype}`,
//     });
//   } else if (formDataKey !== fieldname) {
//     console.log('here');
//     res.status(400).send({
//       message: `form data key is wrong!
//       you sent ${fieldName}, but should be ${formDataKey}
//       `,
//     });
//   } else {
//     next();
//   }
// };

export const checkFile = (types) => (req, res, next) => {
  const { mimetype } = req.file;
  // console.log(mimetype);
  if (!types.includes(mimetype)) {
    res.status(400).send({
      message: `Only ${types.join(
        ','
      )} mime-types are accepted! You sent: ${mimetype}`,
    });
  } else {
    next();
  }
};
