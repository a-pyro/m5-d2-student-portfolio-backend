import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { check, validationResult } from 'express-validator';
// import validator from 'validator';

const router = express.Router();

/* leggo e collego il mio file json */
const __currentPath = fileURLToPath(import.meta.url);
const __projectsDirname = dirname(__currentPath);
const projectsJSONpath = join(__projectsDirname, 'projects.json');
// console.log(projectsJSONpath);

/* prendo il path degli students */
const __srcPath = dirname(__projectsDirname);
const __projectsPath = join(__srcPath, 'students');
const studentsJSONpath = join(__projectsPath, 'students.json');

const getStudents = () =>
  JSON.parse(fs.readFileSync(studentsJSONpath).toString());

const getProjects = () =>
  JSON.parse(fs.readFileSync(projectsJSONpath.toString()));

const writeProjects = (projectsArr) =>
  fs.writeFileSync(projectsJSONpath, JSON.stringify(projectsArr));

const writeStudents = (studentsArr) =>
  fs.writeFileSync(studentsJSONpath, JSON.stringify(studentsArr));

router.get('/', (req, res, next) => {
  const projects = getProjects();

  res.status(200).send(projects);
});

router.get('/:id', (req, res, next) => {
  const projects = getProjects();
  try {
    const project = projects.find((proj) => proj.id === req.params.id);
    if (project) {
      res.status(200).send(project);
    } else {
      const err = new Error();
      err.httpStatusCode = 404;
      next(err);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post(
  '/',
  [
    check('name')
      .exists()
      .withMessage('name is mandatory')
      .not()
      .isEmpty()
      .withMessage('cant accept empty strings'),
  ],
  (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        const projects = getProjects();
        const students = getStudents();
        const newProject = {
          ...req.body,
          id: uuidv4(),
          creationDate: new Date(),
        };
        // console.log(students);
        // check if is the first project added, if it's initialize count:1 else +=1
        const newStudentsArray = students.reduce((acc, cv) => {
          if (cv.id === req.body.studentID) {
            if (cv.hasOwnProperty('numbersOfProjects')) {
              cv.numbersOfProjects += 1;
            } else {
              cv.numbersOfProjects = 1;
            }
          }
          acc.push(cv);
          return acc;
        }, []);
        //aggiorno i projects
        projects.push(newProject);
        // scrivere su disco gli student
        writeStudents(newStudentsArray);
        //scrivere su disco il progetto
        writeProjects(projects);
        res.status(201).send(newProject.id);
      } else {
        const err = new Error();
        err.httpStatusCode = 400;
        err.errorList = errors;
        next(err);
      }
    } catch (error) {
      error.httpStatusCode = 500;
      next(error);
    }
  }
);

export default router;
