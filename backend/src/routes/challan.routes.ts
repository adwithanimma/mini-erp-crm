import {Router} from "express";
import * as controller from "../controllers/challan.controller";
import {authenticate} from "../middleware/auth.middleware";
import {authorize} from "../middleware/role.middleware";


const router=Router();


router.post(
"/",
authenticate,
authorize("ADMIN", "SALES"),
controller.createChallan
);


router.get(
"/",
authenticate,
authorize("ADMIN", "SALES", "ACCOUNTS"),
controller.getChallans
);


router.patch(
"/:id/status",
authenticate,
authorize("ADMIN", "SALES"),
controller.updateChallanStatus
);


export default router;
