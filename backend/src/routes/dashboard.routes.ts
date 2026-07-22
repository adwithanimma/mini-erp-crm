import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import * as controller from "../controllers/dashboard.controller";

const router = Router();

router.get("/", authenticate, (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Mini ERP Dashboard",
    user: (req as any).user,
  });
});

router.get(
  "/stats",
  authenticate,
  authorize("ADMIN", "ACCOUNTS"),
  controller.getStats
);

export default router;
