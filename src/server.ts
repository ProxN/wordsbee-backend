import mongoose from 'mongoose';
import { config } from 'dotenv';

config({ path: './config.env' });

import app from './app';

// const DB: string = process.env.DATABASE_LOCAL as string;
let DB = '';

if (process.env.DATABASE) {
  DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD as string
  );
} else {
  DB = process.env.DATABASE_LOCAL as string;
}

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB CONNECTIONS SUCCESSFULLY!!'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server starting at port ${PORT}`));
