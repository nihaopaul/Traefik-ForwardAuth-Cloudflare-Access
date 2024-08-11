import express from "express";

import cookieParser from "cookie-parser";
import auth from "./routes/auth.js";

const app = express();

app.use(cookieParser());
app.use("/auth", auth);
app.listen(process.env.PORT || 3000);

export default app;
