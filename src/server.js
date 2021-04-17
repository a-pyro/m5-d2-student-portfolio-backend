import express from 'express';
import studentsRouter from './students/index.js';
import projectsRouter from './projects/index.js';
import listEndpoints from 'express-list-endpoints';
import cors from 'cors';
import {
  notFoundErrorHandler,
  badRequestErrorHandling,
  catchAllErrorHandler,
  forbiddenErrorHandler,
  routeNotFoundHandler,
} from './middlewares/errors/errorHandlers.js';
import { getCurrentDirectory } from './lib/fs-tools.js';
import { join } from 'path';

const server = express();
const port = process.env.PORT || 3002;

/* static file serving */
const currentDirectory = getCurrentDirectory(import.meta.url);
// console.log(currentDirectory);
const publicDirectory = join(currentDirectory, '../public'); //prendo la direcorty delle foto nella pubblic
server.use(express.static(publicDirectory)); //gli dico di usarla come static

server.use(cors());
server.use(express.json()); // così gli dico che i body sono json, altrimenti arrivanpo undefinded
//va prima dell'use sulle route
server.use('/students', studentsRouter); //usa questa parte comune di path per tutti gli endpoint
server.use('/projects', projectsRouter);

/* Qui ci vanno gli error middlewares */
server.use(notFoundErrorHandler);
server.use(badRequestErrorHandling);
server.use(forbiddenErrorHandler);

server.use(catchAllErrorHandler);

server.use(routeNotFoundHandler);
// console.log(listEndpoints(server));

server.listen(port, () => {
  console.log(`🤸🏻‍♂️ server is running on port: ${port}`);
});
server.on('error', (error) => {
  console.log(`🚫 server not running due to: ${error}`);
});
