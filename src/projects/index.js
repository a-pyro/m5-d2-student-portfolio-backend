import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const router = express.Router();

/* leggo e collego il mio file json */
const __path = fileURLToPath(import.meta.url);
const __dirname = dirname(__path);
const projectsJSONpath = join(__dirname, 'projects.json');
// console.log(projectsJSONpath);
const getProjects = () =>
  JSON.parse(fs.readFileSync(projectsJSONpath.toString()));

const writeProjects = (projectsArr) =>
  fs.writeFileSync(projectsJSONpath, JSON.stringify(projectsArr));

router.get('/', (req, res, next) => {
  const projects = getProjects();
  res.send(projects);
});

export default router;
