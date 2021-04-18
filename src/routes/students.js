import { Router } from 'express';
import { checkFile } from '../middlewares/checkFileMime.js';
import {
  addStudentController,
  checkEmailController,
  deleteStudentController,
  getSingleStudentController,
  getStudentsController,
  updateStudentController,
  getStudentProjectsController,
  uploadStudentPhotoController,
} from '../controllers/students.js';
import multerParse from '../middlewares/multerParse.js';
const upload = multerParse();
const router = Router();

router.route('/').get(getStudentsController).post(addStudentController);

router.route('/checkEmail').post(checkEmailController);

router
  .route('/:id')
  .get(getSingleStudentController)
  .delete(deleteStudentController)
  .put(updateStudentController);

router.route('/:id/projects').get(getStudentProjectsController);

// ========== Image upload ================
// router.get('/home', authCheckMiddleware, home.get);

// router
//   .route('/:id/uploadPhoto')
//   .post(multer().single('profilePic'), checkFile, uploadStudentPhotoController);

router.route('/:id/uploadPhoto').post(upload, uploadStudentPhotoController);

export default router;
