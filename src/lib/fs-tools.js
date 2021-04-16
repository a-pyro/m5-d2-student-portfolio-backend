import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
const { readJSON, writeJSON, writeFile } = fs;

/* leggo e collego il mio file json */
const __currentPath = fileURLToPath(import.meta.url);
const __currentDirname = dirname(__currentPath);
const __dataFolderPath = join(__currentDirname, '../data');
const studentIMGfolderPath = join(
  __currentDirname,
  '../../public/img/students'
);

/* prendo il path degli students */
// console.log(__dataFolderPath);

export const getStudents = async () =>
  await readJSON(join(__dataFolderPath, 'students.json'));

export const getProjects = async () =>
  await readJSON(join(__dataFolderPath, 'projects.json'));

export const getReviews = async () =>
  await readJSON(join(__dataFolderPath, 'reviews.json'));

export const writeProjects = async (projectsArr) =>
  await writeJSON(join(__dataFolderPath, 'projects.json'), projectsArr);

export const writeStudents = async (studentsArr) =>
  await writeJSON(join(__dataFolderPath, 'students.json'), studentsArr);

export const writeReviews = async (reviewsArr) =>
  await writeJSON(join(__dataFolderPath, 'reviews.json'), reviewsArr);

export const writeProfilePicture = async (fileName, content) => {
  await writeFile(join(studentIMGfolderPath, fileName), content);
};

export const getCurrentDirectory = (importMetaUrl) => {
  const currentWorkingFile = fileURLToPath(importMetaUrl);
  const currentWorkingDirectory = dirname(currentWorkingFile);
  return currentWorkingDirectory;
};
