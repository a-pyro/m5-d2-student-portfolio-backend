import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
const { readJSON, writeJSON, writeFile } = fs;

/* leggo e collego il mio file json */
const currentPath = fileURLToPath(import.meta.url);
const currentDirname = dirname(currentPath);
const dataFolderPath = join(currentDirname, '../data');
const studentIMGfolderPath = join(currentDirname, '../../public/img/students');
// console.log(import.meta.url);
// console.log(fileURLToPath(import.meta.url));
const projectsIMGfolderPath = join(currentDirname, '../../public/img/projects');

/* prendo il path degli students */
// console.log(dataFolderPath);

export const getStudents = async () =>
  await readJSON(join(dataFolderPath, 'students.json'));

export const getProjects = async () =>
  await readJSON(join(dataFolderPath, 'projects.json'));

export const getReviews = async () =>
  await readJSON(join(dataFolderPath, 'reviews.json'));

export const writeProjects = async (projectsArr) =>
  await writeJSON(join(dataFolderPath, 'projects.json'), projectsArr);

export const writeStudents = async (studentsArr) =>
  await writeJSON(join(dataFolderPath, 'students.json'), studentsArr);

export const writeReviews = async (reviewsArr) =>
  await writeJSON(join(dataFolderPath, 'reviews.json'), reviewsArr);

export const writeProfilePicture = async (fileName, content) => {
  await writeFile(join(studentIMGfolderPath, fileName), content);
};

export const writeProjectPicture = async (fileName, content) => {
  await writeFile(join(projectsIMGfolderPath, fileName), content);
};

export const getCurrentDirectory = (importMetaUrl) => {
  const currentWorkingFile = fileURLToPath(importMetaUrl);
  const currentWorkingDirectory = dirname(currentWorkingFile);
  return currentWorkingDirectory;
};
