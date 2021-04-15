import express from 'express';
import { getReviews, writeReviews } from '../lib/fs-tools.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.get('/', async (req, res, next) => {
  res.send('CIAO SCEMO');
});

export default router;
