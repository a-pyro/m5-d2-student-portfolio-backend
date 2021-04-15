import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { check, validationResult } from 'express-validator';
import {
  getProjects,
  getStudents,
  getReviews,
  writeProjects,
  writeStudents,
  writeReviews,
} from '../lib/fs-tools.js';
import e from 'express';

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
    check('name').exists().withMessage('name field is mandatory').trim(),
    check('description').exists().withMessage('field mandatory').trim(),
    check('repoUrl')
      .exists()
      .withMessage('field mandatory')
      .isURL()
      .withMessage('must be a valid url')
      .trim(),
    check('liveUrl').trim(),
    check('studentID').notEmpty().withMessage('provide student id').trim(),
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
router.put(
  '/:id',
  [
    check('name').exists().withMessage('name field is mandatory').trim(),
    check('description').exists().withMessage('field mandatory').trim(),
    check('repoUrl')
      .exists()
      .withMessage('field mandatory')
      .isURL()
      .withMessage('must be a valid url')
      .trim(),
    check('liveUrl').trim(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        const projects = await getProjects();
        console.log(projects);
        const creationDate = projects.find((proj) => proj.id === req.params.id)
          .creationDate;
        const editedProject = {
          ...req.body,
          id: req.params.id,
          modifiedAt: new Date(),
          creationDate,
        };

        const witoutEditedOne = projects.filter(
          (proj) => proj.id !== req.params.id
        );
        witoutEditedOne.push(editedProject);

        await writeProjects(witoutEditedOne);
        res.status(200).send(editedProject);
      } else {
        const err = new Error();
        err.httpStatusCode === 400;
        err.errorList = errors;
        next(err);
      }
    } catch (error) {
      // error.httpStatusCode = 500;
      console.log(error);
      // next(error);
    }
  }
);

// delete project
router.delete('/:id', async (req, res, next) => {
  try {
    const projects = await getProjects();
    const newProjects = projects.filter((proj) => proj.id !== req.params.id);
    await writeProjects(newProjects);
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
  }
});

// post review
router.post(
  '/:id/reviews',
  [
    check('name').exists().withMessage('name props must be present').trim(),
    check('projectID').notEmpty().withMessage('projID Must BE there').trim(),
    check('text').notEmpty().withMessage('a text should be provided').trim(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        const newReview = {
          ...req.body,
          id: uuidv4(),
          creationDate: new Date(),
          name: req.body.name || 'Anonimous',
        };
        console.log(newReview);
        const reviews = await getReviews();
        reviews.push(newReview);
        await writeReviews(reviews);
        res.status(201).send({ params: newReview.id });
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

// get review
router.get('/:id/reviews', async (req, res, next) => {
  try {
    const reviews = await getReviews();
    const reviewsToSend = reviews.filter(
      (rev) => rev.projectID === req.params.id
    );
    if (reviewsToSend.length !== 0) {
      res.status(200).send(reviewsToSend);
      return;
    }
    const err = new Error('No reviews for this project');
    err.httpStatusCode = 404;
    next(err);
  } catch (error) {
    error.httpStatusCode === 500;
    console.log('error', error);
    next(error);
  }
});

// put rev

// delete review

export default router;
