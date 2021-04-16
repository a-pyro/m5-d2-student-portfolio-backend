import { Router } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import {
  getProjects,
  getStudents,
  writeProfilePicture,
  writeStudents,
} from '../lib/fs-tools.js';
import { checkFile } from '../middlewares/index.js';

const router = Router();

router.post('/', async (req, res) => {
  const students = await getStudents();
  const newStudent = { ...req.body, id: uuidv4(), createdAt: new Date() };
  // console.log(students);

  students.push(newStudent);
  // console.log(req.body);
  // console.log(students);
  await writeStudents(students);
  res.status(201).send(newStudent.id);
});

router.post('/checkEmail', async (req, res) => {
  const students = await getStudents();
  const email = req.body.email;
  // console.log(email);
  const findEmail = students.find((student) => student.email === email);
  // console.log(findEmail);
  if (findEmail) {
    res.status(200).send(true);
  } else {
    res.status(200).send(false);
  }
});

router.get('/', async (req, res) => {
  const students = await getStudents();

  // console.log(students);

  res.status(200).send(students);
});

router.get('/:id', async (req, res) => {
  const students = await getStudents();
  const id = req.params.id;
  const student = students.find((stud) => stud.id === id);
  console.log(student);
  res.status(200).send(student);
});

router.delete('/:id', async (req, res) => {
  const students = await getStudents();
  const id = req.params.id;

  const filteredStudents = students.filter((stud) => stud.id !== id);
  await writeStudents(filteredStudents);

  res.status(204).send();
});

router.put('/:id', async (req, res, next) => {
  try {
    const students = await getStudents();
    const paramsId = req.params.id;
    const editedStudent = { ...req.body };

    const newStudents = students.reduce((acc, student) => {
      if (student.id === paramsId) {
        const mergedStudend = {
          ...student,
          ...editedStudent,
          updatedAt: new Date(),
        };
        acc.push(mergedStudend);
        return acc;
      }
      acc.push(student);
      return acc;
    }, []);

    await writeStudents(newStudents);
    res.status(200).send(editedStudent);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// get all the project for a student
router.get('/:studentId/projects', async (req, res, next) => {
  try {
    const reqParam = req.params.studentId;
    // console.log(reqParam);
    const projects = await getProjects();
    const projectsOfTheUser = projects.filter(
      (proj) => proj.studentID === reqParam
    );
    if (projectsOfTheUser.length === 0) {
      res.status(400).send('student has 0 projects');
      return;
    }
    res.status(200).send(projectsOfTheUser);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

///::::::::::::::::::::::::::::>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// ========== Image upload ================
///::::::::::::::::::::::::::::>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

router.post(
  '/:id/uploadPhoto',
  multer().single('profilePic'),
  checkFile(['image/jpeg', 'image/png']),
  async (req, res, next) => {
    try {
      const paramsID = req.params.id;
      // console.log(paramsID);
      // console.log(req.file);

      const imgURL = `${req.protocol}://${req.get(
        'host'
      )}/img/students/${paramsID}.jpg`;
      console.log(imgURL);
      const students = await getStudents();

      // prima di mettere l'url nello studente fixare la pubblic folder per servire file statici
      const updatedStudents = students.reduce((acc, cv) => {
        if (cv.id === paramsID) {
          cv.image = imgURL;
          cv.updatedAt = new Date();
          acc.push(cv);
          return acc;
        }
        acc.push(cv);
        return acc;
      }, []);
      //scrivo studenti
      await writeStudents(updatedStudents);

      //scrivo file su disco
      await writeProfilePicture(`${paramsID}.jpg`, req.file.buffer);
      res.status(200).send({ imgURL });
    } catch (err) {
      const error = new Error(err.message);
      error.httpStatusCode = 500;
      next(error);
    }
  }
);

export default router;
