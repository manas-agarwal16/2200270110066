import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN?.split(",");


app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//route import
import urlsRouter from "./routes/urls.js";

app.use("", urlsRouter);

app.get("/", (req, res) => {
  res.status(200).send("Welcome");
});

export { app };
