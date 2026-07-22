import { Router } from "express";
import * as controller from "../controllers/search.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// any logged-in user; the controller scopes results to their role
router.get("/", authenticate, controller.search);

export default router;
