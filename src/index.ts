import "reflect-metadata";
import * as dotenv from "dotenv";
import { AuthDataSource } from "./AuthDataSource"
import app from "./app";

dotenv.config();

const PORT = Number(process.env.APP_PORT) || 3030;

AuthDataSource.initialize()
  .then(async () => {
    console.log("Successfully connected to database.");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`App is running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
