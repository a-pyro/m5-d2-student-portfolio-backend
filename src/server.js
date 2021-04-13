import express from 'express';
import studentsRouter from './students/index.js';
import listEndpoints from 'express-list-endpoints';
import cors from 'cors';

const server = express();
const port = 3001;

server.use(cors());
server.use(express.json()); // così gli dico che i body sono json, altrimenti arrivanpo undefinded
server.use('/students', studentsRouter);

console.log(listEndpoints(server));
server.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
