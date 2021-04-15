import express from 'express';
import studentsRouter from './students/index.js';
import projectsRouter from './projects/index.js';
import reviwesRouter from './reviews/index.js';
import listEndpoints from 'express-list-endpoints';

import cors from 'cors';
import {
  notFoundErrorHandler,
  badRequestErrorHandling,
} from './errorHandlers.js';

const server = express();
const port = process.env.PORT || 3002;

server.use(cors());
server.use(express.json()); // così gli dico che i body sono json, altrimenti arrivanpo undefinded
//va prima dell'use sulle route
server.use('/students', studentsRouter); //usa questa parte comune di path per tutti gli endpoint
server.use('/projects', projectsRouter);
server.use('/reviews', reviwesRouter);

/* Qui ci vanno gli error middlewares */
server.use(notFoundErrorHandler);
server.use(badRequestErrorHandling);
console.log(listEndpoints(server));
server.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
