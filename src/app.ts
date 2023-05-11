import express from "express";
import 'express-async-errors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import { Application, Router} from 'express';
import { ErrorHandler } from './commons/error';

const app: Application = express();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const apiRouter: Router = express.Router();
app.use('/api/v1', apiRouter);

// apiRouter.use('/products', productRouter);

app.use('*', ErrorHandler.pagenotFound());
app.use(ErrorHandler.handle());
ErrorHandler.exceptionRejectionHandler();

export default app;