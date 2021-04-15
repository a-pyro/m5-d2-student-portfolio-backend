import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getStudents, writeStudents } from '../lib/fs-tools.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const students = await getStudents();
  const newStudent = req.body;
  // console.log(students);
  newStudent.id = uuidv4();
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

router.put('/:id', async (req, res) => {
  const students = await getStudents();
  const id = req.params.id;
  const editedStudent = req.body;
  editedStudent.id = id;
  students.splice(
    students.findIndex((stud) => stud.id === id),
    1,
    editedStudent
  );
  await writeStudents(students);
  res.status(200).send(editedStudent);
});

export default router;
