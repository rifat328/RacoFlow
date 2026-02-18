import { Router } from "express";
import { authorize, checkRole } from "../middlewares/auth.middleware.js";
import {
  promoteToBuyer,
  getAllUsers,
} from "../controllers/admin.controller.js";

const adminRouter = Router();

// Only ADMINs can access these
adminRouter.use(authorize, checkRole(["ADMIN"]));

adminRouter.get("/users", getAllUsers);
adminRouter.patch("/promote/:id", promoteToBuyer);

export default adminRouter;
