import express from "express";
import { PORT, CORS_ORIGIN } from "./config/env.js";
import cookieParser from "cookie-parser";
import connectToDatabase from "./DATABASE/mongodb.js";
// import authRouter from "./routes/auth.routes.js";
// import userRouter from "./routes/user.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
// import parcelRouter from "./routes/parcel.routes.js";
// import arcjetMiddleware from "./middlewares/arcjet.middleware.js";
import cors from "cors";
import { swaggerSpec } from "./swagger.js";
import swaggerUi from "swagger-ui-express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// cors middleware setup
const allowedOrigins = (CORS_ORIGIN || "http://localhost:3000").split(",");
//CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// arcjet middleware for bot detection and rate limiting
// app.use(arcjetMiddleware);

// Use routes
// app.use("/api/v1/auth", authRouter);
// app.use("/api/v1/users", userRouter);
// app.use("/api/v1/projects", parcelRouter);
// app.use("/api/v1/tasks", parcelRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the RacoFlow workflow");
});

//error handling middleware
app.use(errorMiddleware);

// test route
app.get("/test-cookie", (req, res) => {
  res.cookie("test", "hello", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });
  res.send("cookie set");
});

app.listen(PORT, async () => {
  console.log(`Server is running on port  : http://localhost:${PORT}`);
  await connectToDatabase();
});

export default app;
