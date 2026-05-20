import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import type { ROLES } from "../types";

const auth = (...roles: ROLES[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // console.log("from middleware", roles);
    try {
      // console.log("This is Protected Route");
      // console.log(req.headers.authorization);

      const token = req.headers.authorization;
      // console.log(token);

      if (!token) {
        res.status(401).json({
          success: false,
          message: "Unauthorized Access",
        });
      }

      const decoded = jwt.verify(
        token as string,
        config.secret as string,
      ) as JwtPayload;
      // console.log(decoded);

      const userData = await pool.query(
        `
        SELECT * FROM users WHERE email=$1
      `,
        [decoded.email],
      );

      console.log(userData.rows[0]);

      if (userData.rows.length === 0) {
        res.send(404).json({
          success: false,
          message: "User Not Found",
        });
      }

      const user = userData.rows[0];

      if (!user?.is_active) {
        res.status(403).json({
          success: false,
          message: "Forbidden",
        });
      }

      console.log("Auth Role From Middleware: ", user.role);

      if (roles.length && !roles.includes(user.role)) {
        res.status(403).json({ success: false, message: "Forbidden" });
      }

      req.user = decoded; // we have added user into the request

      next();
    } catch (error) {
      next(error);
    }
  };
};
export default auth;
