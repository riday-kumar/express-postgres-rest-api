import { Router, type Request, type Response } from "express";
import { pool } from "../../db";
import { userController } from "./user.controller";

const router = Router();

router.post("/", userController.createUser);
router.get("/", userController.getAllUser);
router.get("/:id", userController.getSingleUser);
router.put("/:id", userController.userUpdate);
router.delete("/:id", userController.userDelete);
export const userRoute = router;
