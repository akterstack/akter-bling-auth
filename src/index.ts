import "reflect-metadata";
import * as dotenv from "dotenv";
import app from "./app";

dotenv.config();

const PORT = process.env.APP_PORT || 3000;

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
