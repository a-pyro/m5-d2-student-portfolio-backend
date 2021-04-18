import express from 'express';
import studentsRouter from './routes/students.js';
import projectsRouter from './projects/index.js';
import colors from 'colors';
// import listEndpoints from 'express-list-endpoints';
import cors from 'cors';
import morgan from 'morgan';
import {
  notFoundErrorHandler,
  badRequestErrorHandling,
  catchAllErrorHandler,
  forbiddenErrorHandler,
  routeNotFoundHandler,
} from './middlewares/errorHandlers.js';
import { getCurrentDirectory } from './utils/fsTools.js';
import { join } from 'path';

const app = express();

//dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/* static file serving */
const currentDirectory = getCurrentDirectory(import.meta.url);
// console.log(currentDirectory);
const publicDirectory = join(currentDirectory, '../public'); //prendo la direcorty delle foto nella pubblic
app.use(express.static(publicDirectory)); //gli dico di usarla come static
app.use(cors());
app.use(express.json()); // così gli dico che i body sono json, altrimenti arrivanpo undefinded
//va prima dell'use sulle route
app.use('/students', studentsRouter); //usa questa parte comune di path per tutti gli endpoint
app.use('/projects', projectsRouter);

/* Qui ci vanno gli error middlewares */
app.use(routeNotFoundHandler);
app.use(notFoundErrorHandler);
app.use(badRequestErrorHandling);
app.use(forbiddenErrorHandler);
app.use(catchAllErrorHandler);
// console.log(listEndpoints(app));

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`🤸🏻‍♂️ server is running on port: ${port}`);
});
