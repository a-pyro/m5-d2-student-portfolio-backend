import { v4 as uuidv4 } from 'uuid';
import {
  getProjects,
  getStudents,
  writeProfilePicture,
  writeStudents,
} from '../utils/fsTools.js';
import asyncHandler from '../middlewares/async.js';
//@desc     Get All Students
//@route    GET /students
//@access   Public
export const getStudentsController = asyncHandler(async (req, res, next) => {
  const students = await getStudents();
  res.status(200).send(students);
});
//@desc     add student
//@route    POST /students
//@access   Public
export const addStudentController = asyncHandler(async (req, res, next) => {
  const students = await getStudents();
  const newStudent = { ...req.body, id: uuidv4(), createdAt: new Date() };
  // console.log(students);

  students.push(newStudent);
  // console.log(req.body);
  // console.log(students);
  await writeStudents(students);
  res.status(201).send(newStudent.id);
});

//@desc     Get Single Student
//@route    GET /students/:id
//@access   Public
export const getSingleStudentController = asyncHandler(
  async (req, res, next) => {
    const students = await getStudents();
    const id = req.params.id;
    const student = students.find((stud) => stud.id === id);
    console.log(student);
    res.status(200).send(student);
  }
);

//@desc     delete student
//@route    DELETE /students
//@access   Public
export const deleteStudentController = asyncHandler(async (req, res, next) => {
  const students = await getStudents();
  const id = req.params.id;

  const filteredStudents = students.filter((stud) => stud.id !== id);
  await writeStudents(filteredStudents);

  res.status(204).send();
});

//@desc     update student
//@route    PUT /students/:id
//@access   Public
export const updateStudentController = asyncHandler(async (req, res, next) => {
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
});

//@desc     get projects from student
//@route    GET /students/:id/projects
//@access   Public
export const getStudentProjectsController = asyncHandler(
  async (req, res, next) => {
    const reqParam = req.params.id;
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
  }
);

//@desc     check if there's already a student with that email
//@route    POST /students/checkEmail
//@access   Public
export const checkEmailController = asyncHandler(async (req, res) => {
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

//@desc     upload student picture
//@route    POST /students/:id/uploadPhoto
//@access   Public
export const uploadStudentPhotoController = asyncHandler(
  async (req, res, next) => {
    const paramsID = req.params.id;
    // console.log(paramsID);
    // console.log(req.file);

    const imgURL = `${req.protocol}://${req.get(
      'host'
    )}/img/students/${paramsID}.jpg`;
    // console.log(imgURL);
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
  }
);
