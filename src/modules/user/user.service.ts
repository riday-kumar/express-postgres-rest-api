import { pool } from "../../db";
import type { IUser } from "./user.interface";
import bcrypt from "bcryptjs";

const createUserIntoDB = async (payLoad: IUser) => {
  const { name, email, password, age, role } = payLoad;

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  // console.log(hashPassword);

  const result = await pool.query(
    `
        INSERT INTO users(name, email, password,age,role)VALUES($1,$2,$3,$4,$5)
        RETURNING name, email, age,role
    `,
    [name, email, hashPassword, age, role || "user"],
  );

  delete result.rows[0].password;

  return result;
};

const getAllUsersFromDB = async () => {
  const result = await pool.query(`
            SELECT * FROM users
            `);
  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const result = await pool.query(
    `
        SELECT * FROM users WHERE id=$1
        `,
    [id],
  );

  return result;
};

const userUpdateFromDB = async (payLoad: IUser, id: string) => {
  const { name, password, age } = payLoad;
  const result = await pool.query(
    `UPDATE users SET name = COALESCE($1,name), password = COALESCE($2,password), age= COALESCE($3,age) WHERE id = $4 RETURNING *
    `,
    [name, password, age, id],
  );

  return result;
};

const userDeleteFromDB = async (id: string) => {
  const result = await pool.query(
    `
            DELETE FROM users WHERE id=$1
        `,
    [id],
  );

  return result;
};

export const userService = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  userUpdateFromDB,
  userDeleteFromDB,
};
