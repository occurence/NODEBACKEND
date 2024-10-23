import { app } from "./app.js";
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const { DB_HOST, PORT } = process.env;
// process.env.DB_HOST
mongoose
.connect(DB_HOST, {
  // useNewUrlParser: true,
  // useCreateIndex: true,
  // useUnifiedTopology: true,
})
.then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running. Use our API on port: ${PORT}`);
  });
  console.log('Database connection is successful');
})
.catch((error) => {
  console.log(`Server is not running. Error message: ${error.message}`);
  process.exit(1);
});