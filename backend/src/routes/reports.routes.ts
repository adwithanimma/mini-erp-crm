import { Router } from "express";
import * as controller from "../controllers/reports.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.get(
  "/:type",
  authenticate,
  authorize("ADMIN", "ACCOUNTS"),
  controller.getReport
);

export default router;
