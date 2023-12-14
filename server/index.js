import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import dashboardRoutes from "./routes/dashboard.js";
import { getBasicData } from "./controllers/dashboard.js";

/* CONFIGURATION */
dotenv.config();
const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* ROUTES */
app.use("/dashboard", dashboardRoutes);

/* STATIC FILES */
/* const __dirname = dirname(fileURLToPath(import.meta.url));
const urlStatic = join(__dirname, "dist");
app.use(express.static(urlStatic)); */

/* REDIRECT PAGES */
/* app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "dist/index.html"));
}); */

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 9000;

app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
