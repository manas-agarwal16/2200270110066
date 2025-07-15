import express from "express";
import cors from "cors";

const app = express();
console.log(process.env);

const allowedOrigins = []; // fill

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//route import
import urlsRouter from "./routes/urls.js";

app.use('',urlsRouter);

app.get("/", (req, res) => {
  res.status(200).send("Welcome to the VStream");
});

export { app };
