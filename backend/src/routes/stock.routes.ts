import {Router} from "express";
import * as controller from "../controllers/stock.controller";
import {authenticate} from "../middleware/auth.middleware";
import {authorize} from "../middleware/role.middleware";


const router=Router();


router.post(
"/in",
authenticate,
authorize("ADMIN", "WAREHOUSE"),
controller.stockIn
);


router.post(
"/out",
authenticate,
authorize("ADMIN", "WAREHOUSE"),
controller.stockOut
);


router.get(
"/history/:id",
authenticate,
authorize("ADMIN", "WAREHOUSE"),
controller.history
);


export default router;
