import express from 'express';
import bodyParser from 'body-parser';
import identifyRouter from './routes/identify';
import { initializeDB } from './db';

const app = express();

app.use(bodyParser.json());
app.use('/identify', identifyRouter);

const PORT = process.env.PORT || 3000;

initializeDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
