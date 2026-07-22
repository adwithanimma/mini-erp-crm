import { Router } from "express";
import * as controller from "../controllers/customer.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.post("/", authenticate, authorize("ADMIN", "SALES"), controller.createCustomer);
router.get("/", authenticate, authorize("ADMIN", "SALES"), controller.getCustomers);
router.put("/:id", authenticate, authorize("ADMIN", "SALES"), controller.updateCustomer);
router.delete("/:id", authenticate, authorize("ADMIN", "SALES"), controller.deleteCustomer);

export default router;
