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
// import userRouter from "./routes/user.routes.js";
// import videoRouter from "./routes/video.route.js";
// import subscriptionRouter from "./routes/subscription.routes.js";
// import playlistRouter from "./routes/playlist.routes.js";
// import songsRouter from "./routes/songs.routes.js";

app.get("/", (req, res) => {
  res.status(200).send("Welcome to the VStream");
});

// app.use("/api/v1/users", userRouter);
// app.use("/api/v1/videos", videoRouter);
// app.use("/api/v1/subscription", subscriptionRouter);
// app.use("/api/v1/playlist", playlistRouter);
// app.use("/api/v1/songs", songsRouter);
export { app };
