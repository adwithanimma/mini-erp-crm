import { Router } from "express";
import * as controller from "../controllers/settings.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

// every logged-in role can read (navbar shows company name/logo)
router.get("/", authenticate, controller.getSettings);

// only admin can change
router.put("/", authenticate, authorize("ADMIN"), controller.updateSettings);

export default router;
