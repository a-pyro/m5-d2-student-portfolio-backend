import express from 'express';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const router = express.Router();

// prendo path dell'index
const __files_path = fileURLToPath(import.meta.url);
// prendo il path della directory
const __dirname = dirname(__files_path);
// prendo il path del file json
const studentsJSONpath = join(__dirname, 'students.json');

router.post('/', (req, res) => {
  const students = JSON.parse(fs.readFileSync(studentsJSONpath).toString());
  const newStudent = req.body;

  newStudent._id = uuidv4();
  students.push(newStudent);
  // console.log(req.body);
  // console.log(students);
  fs.writeFileSync(studentsJSONpath, JSON.stringify(students));
  res.status(201).send('created');
});

router.post('/checkEmail', (req, res) => {
  const students = JSON.parse(fs.readFileSync(studentsJSONpath).toString());
  const email = req.body.email;
  // console.log(email);
  const findEmail = students.find((student) => student.email === email);
  console.log(findEmail);
  if (findEmail) {
    res.status(200).send(true);
  } else {
    res.status(200).send(false);
  }
});

router.get('/', (req, res) => {
  const students = JSON.parse(fs.readFileSync(studentsJSONpath).toString());
  console.log(fs.readFileSync(studentsJSONpath).toString());
  // console.log(students);

  res.status(200).send(students);
});

router.get('/:id', (req, res) => {
  const students = JSON.parse(fs.readFileSync(studentsJSONpath).toString());
  const id = req.params.id;
  const student = students.find((stud) => stud._id === id);
  res.status(200).send(student);
});

router.delete('/:id', (req, res) => {
  const students = JSON.parse(fs.readFileSync(studentsJSONpath).toString());
  const id = req.params.id;

  const filteredStudents = students.filter((stud) => stud._id !== id);
  fs.writeFileSync(studentsJSONpath, JSON.stringify(filteredStudents));

  res.status(204).send();
});

router.put('/:id', (req, res) => {
  const students = JSON.parse(fs.readFileSync(studentsJSONpath).toString());
  const id = req.params.id;
  const editedStudent = req.body;
  editedStudent._id = id;
  students.splice(
    students.findIndex((stud) => stud._id === id),
    1,
    editedStudent
  );
  fs.writeFileSync(studentsJSONpath, JSON.stringify(students));
  res.status(200).send(editedStudent);
});

export default router;
