import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { Pool } from "pg";
import "dotenv/config";
const app: Application = express();
const port = 3000;

// middleware
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
});

const initDB = async () => {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(20),
            email VARCHAR(20) NOT NULL UNIQUE,
            password VARCHAR(20) NOT NULL,
            is_active BOOLEAN DEFAULT true,
            age INT,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            )
            `);
    console.log("Database connected successfully!");
  } catch (error) {
    console.log(error);
  }
};

initDB();

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Express Js",
  });
});

app.get("/api/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
            SELECT * FROM users
            `);

    res.status(200).json({
      success: true,
      message: "All Users get successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

app.get("/api/users/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const result = await pool.query(
      `
        SELECT * FROM users WHERE id=$1
        `,
      [id],
    );

    if (!result.rows[0]) {
      res.status(404).json({
        success: false,
        message: "User Not Found",
        data: {},
      });
    }

    res.status(200).json({
      success: true,
      message: "User get successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

app.post("/api/users", async (req: Request, res: Response) => {
  //   console.log(req.body);
  //   const body = req.body;
  const { name, email, password, age } = req.body;

  try {
    const result = await pool.query(
      `
        INSERT INTO users(name, email, password,age)VALUES($1,$2,$3,$4)
        RETURNING *
    `,
      [name, email, password, age],
    );
    //   console.log(result);

    res.status(201).json({
      success: true,
      message: "user created successfully",
      // data: body,
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

app.put("/api/users/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const { name, password, age } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users SET name = $1, password = $2, age= $3 WHERE id = $4 RETURNING *
    `,
      [name, password, age, id],
    );

    if (!result.rows[0]) {
      res.status(404).json({
        success: false,
        message: "User Not Found",
        data: {},
      });
    }

    res.status(200).json({
      success: true,
      message: "user updated!",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
