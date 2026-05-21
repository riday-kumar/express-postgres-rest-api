import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { pool } from "../../db/index.js";
import { userController } from "./user.controller.js";
import auth from "../../middleware/auth.js";
import { USER_ROLE } from "../../types/index.js";

const router = Router();

router.post("/", userController.createUser);
router.get(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.agent),
  userController.getAllUser,
);
router.get("/:id", userController.getSingleUser);
router.put("/:id", userController.userUpdate);
router.delete("/:id", userController.userDelete);

export const userRoute = router;
