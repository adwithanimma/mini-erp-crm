import { Router } from "express";
import * as controller from "../controllers/product.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";


const router = Router();


// SALES can read products (needed to build challans), but not modify them
router.get(
    "/",
    authenticate,
    authorize("ADMIN", "WAREHOUSE", "SALES"),
    controller.getProducts
);


router.post(
    "/",
    authenticate,
    authorize("ADMIN", "WAREHOUSE"),
    controller.createProduct
);


router.put(
    "/:id",
    authenticate,
    authorize("ADMIN", "WAREHOUSE"),
    controller.updateProduct
);


router.delete(
    "/:id",
    authenticate,
    authorize("ADMIN", "WAREHOUSE"),
    controller.deleteProduct
);


export default router;
