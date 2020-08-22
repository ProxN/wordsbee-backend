import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import api from './api';
import ErrorGlobalHandler from './middlewares/error.middleware';

const app: Application = express();

/**
 * Middlewares
 */
app.set('trust proxy', 1);

app.use(express.json());

const allowedOrigins = [
  'http://localhost:3000',
  'https://wordsbee.netlify.app',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          'The CORS policy for this site does not ' +
          'allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Set security HTTP headers
app.use(helmet());

// Data sanitization against XSS
app.use(xss());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

app.use(cookieParser());
// Routes

app.use('/api/v1', api);

/**
 * Global Error handling
 */

app.use(ErrorGlobalHandler);

app.get('*', (req: Request, res: Response) => {
  res.status(404).json({
    status: 'fail',
    message: `You just hit a route (${req.originalUrl}) that doesn't exist... the sadness.`,
  });
});

export default app;
