import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

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

router.get('/', (req, res, next) => {
  const projects = getProjects();

  res.send(projects);
});

// router.post('/', (req, res, next) => {
//   const projects = getProjects();
//   const newProject = {...req.body, id: uuidv4()}

// })

export default router;
