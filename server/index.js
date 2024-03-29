import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import morgan from "morgan";
import metallicRoutes from "./routes/metallic.js";
import paintRoutes from "./routes/paint.js";
import generalRoutes from "./routes/general.js";

/* CONFIGURATION */
const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* ROUTES */
app.use("/api/metallic", metallicRoutes);
app.use("/api/paint", paintRoutes);
app.use("/api/general", generalRoutes);

/* STATIC FILES */
const __dirname = dirname(fileURLToPath(import.meta.url));
const urlStatic = join(__dirname, "/dist");
app.use(express.static(urlStatic));

/* REDIRECT PAGES */
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "/dist/index.html"));
});

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 9000;

app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
