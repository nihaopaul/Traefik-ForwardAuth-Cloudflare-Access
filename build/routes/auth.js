import express from "express";
import validate from "../authentication.js";
const router = express.Router();

router.get("/", async (req, res, next) => {
  const { CF_Authorization } = req.cookies;
  let isValid = await validate.test(CF_Authorization);
  let status = isValid ? 200 : 403;
  res.sendStatus(status);
});

export default router;
