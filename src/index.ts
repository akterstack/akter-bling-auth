import "reflect-metadata";
import * as dotenv from "dotenv";
import { AuthDataSource } from "./AuthDataSource"
import app from "./app";

dotenv.config();

const PORT = process.env.APP_PORT || 3000;

AuthDataSource.initialize()
  .then(async () => {
    console.log("Successfully connected to database.")
  })
  .catch((err) => console.log(err))

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
