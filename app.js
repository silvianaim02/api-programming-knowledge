// setup .env bisa dilihat di file loadEnv.js
import './loadEnv.js';
import 'express-async-errors';
import express, { json } from 'express';
import connectDB from './db/connect.js';
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';
import morgan from 'morgan';
import authRouter from './routes/authRoutes.js';
import articleRouter from './routes/articleRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import rateLimiter from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';

// swagger
const swaggerDocument = YAML.load('./swagger.yaml');
const app = express();

const port = process.env.PORT || 5000;

// bakal ngecek ini dulu sebelum ngecek semua route
app.use(cookieParser(process.env.JWT_SECRET));
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.static('./public'));

app.set('trust proxy', 1);
// app.use(
//   rateLimiter({
//     windowMs: 15 * 60 * 1000,
//     max: 60,
//     message: { msg: 'Too many requests, please try again later' },
//   })
// );
app.use(helmet());
// agar bisa digunakan selain di host yang sama, misal agar bisa digunakan oleh fe
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://programmingknowledge-jamaica.vercel.app',
    ],
    methods: ['GET', 'POST', 'DELETE', 'PATCH'],
    credentials: true,
  })
);
app.use(xss());
app.use(mongoSanitize());

app.get('/', (req, res) => {
  res.send(
    '<h1>Programming Knowledge API</h1><a href="/api-docs">Documentation here</a>'
  );
});
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// ROUTE
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/articles', articleRouter);

// kalo di route nggak ada maka akan menjalankan ini, makanya ditaor di bawah route2 yang ada
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// listener
const start = async () => {
  try {
    // setup .env with MONGO_URL variable and assign the value
    await connectDB(process.env.MONGO_URL);
    app.listen(port, console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
