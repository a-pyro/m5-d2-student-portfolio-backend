import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { check, validationResult } from 'express-validator';
import {
  getProjects,
  getStudents,
  writeProjects,
  writeStudents,
} from '../lib/fs-tools.js';

const router = express.Router();

// prendo tutti
router.get('/', async (req, res, next) => {
  const projects = await getProjects();

  res.status(200).send(projects);
});

// prendo singolo
router.get('/:id', async (req, res, next) => {
  const projects = await getProjects();
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

// posto progetto
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
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        const projects = await getProjects();
        const students = await getStudents();
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
        await writeStudents(newStudentsArray);
        //scrivere su disco il progetto
        await writeProjects(projects);
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

// put project

// delete project

// post review
router.post(
  '/:id/reviews',
  [
    check('name').exists().withMessage('name props must be present'),
    check('projectID').exists().notEmpty().withMessage('projID Must BE there'),
    check('text').exists().notEmpty().withMessage('a text should be provided'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        console.log('match');
        res.send({ params: req.params.id });
        const newReview = {
          ...req.body,
          id: uuidv4(),
          creationDate: new Date(),
        };
        console.log(newReview);
      } else {
        const err = new Error();
        err.errorList = errors;
        err.httpStatusCode = 400;
        next(err);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export default router;
