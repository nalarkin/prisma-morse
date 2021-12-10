import express from 'express';
import { loadExpress } from './express';

const app = express();
loadExpress({ app });

// create this export to allow access for easy testing
export { app };
