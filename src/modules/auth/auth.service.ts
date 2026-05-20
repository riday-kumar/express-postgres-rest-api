import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt from "jsonwebtoken";
import config from "../../config";

const loginUserIntoDB = async (payLoad: {
  email: string;
  password: string;
}) => {
  const { email, password } = payLoad;

  // 1. check if the user exists
  // 2. compare the password with database
  // 3. generate token

  const userData = await pool.query(
    `
        SELECT * FROM users WHERE email=$1
        `,
    [email],
  );

  const user = userData.rows[0];

  if (userData.rows.length === 0) {
    throw new Error("Invalid Credentials");
  }
  //   console.log(user);

  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword) {
    throw new Error("Invalid Credentials");
  }

  // Generate token
  const jwtPayLoad = {
    id: user.id,
    name: user.name,
    email: user.email,
    is_active: user.is_active,
    role: user.role,
  };
  const accessToken = jwt.sign(jwtPayLoad, config.secret as string, {
    expiresIn: "1d",
  });

  const refreshToken = jwt.sign(jwtPayLoad, config.refresh_secret as string, {
    expiresIn: "1d",
  });

  return { accessToken, refreshToken };
};

export const authService = {
  loginUserIntoDB,
};
