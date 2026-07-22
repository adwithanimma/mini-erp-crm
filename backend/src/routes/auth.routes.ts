import { Router } from "express";
import { login, register } from "../controllers/auth.controller";

const router = Router();

// router.post("/register", register);

router.post("/register", (req, res) => {
  console.log("REGISTER ROUTE HIT");
  res.json({ success: true });
});router.post("/login", login);
router.get("/test", (_req, res) => {
  res.json({ message: "Auth route working" });
});
export default router;