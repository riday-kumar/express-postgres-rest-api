import { pool } from "../../db";
import type { IUser } from "./user.interface";

const createUserIntoDB = async (payLoad: IUser) => {
  const { name, email, password, age } = payLoad;
  const result = await pool.query(
    `
        INSERT INTO users(name, email, password,age)VALUES($1,$2,$3,$4)
        RETURNING *
    `,
    [name, email, password, age],
  );

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
