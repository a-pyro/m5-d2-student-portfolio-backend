import multer from 'multer';
import { extname } from 'path';
import errorResponse from '../utils/errorResponse.js';

const multerParse = (req, res, next) => {
  const upload = multer({
    fileFilter: function (req, file, cb) {
      const acceptedExt = ['.png', '.jpg', '.gif', '.bmp', '.jpeg'];

      if (!acceptedExt.includes(extname(file.originalname))) {
        return cb(
          new errorResponse(
            'Image type not allowed: ' + extname(file.originalname),
            400,
            'multerExt'
          )
        );
      }
      cb(null, true);
    },
  });

  return upload.single('profilePic');
};

export default multerParse;
