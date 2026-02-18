import { Router } from "express";
import { signIn, signOut, signUp } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);
authRouter.post("/sign-out", signOut);

export default authRouter;

/**
 * @swagger
 * tags:
 * name: Auth
 * description: User authentication for RacoFlow
 */

/**
 * @swagger
 * /api/v1/auth/sign-up:
 * post:
 * summary: Register a new user (Defaults to USER role)
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required: [name, email, password]
 * properties:
 * name: { type: string, example: "John Doe" }
 * email: { type: string, example: "john@example.com" }
 * password: { type: string, example: "securePassword123" }
 * phone: { type: string }
 * address: { type: string }
 * responses:
 * 201:
 * description: User registered successfully
 * 400:
 * description: Email already exists
 */

/**
 * @swagger
 * /api/v1/auth/sign-in:
 * post:
 * summary: Login user and return JWT (via Cookie or JSON)
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required: [email, password]
 * properties:
 * email: { type: string }
 * password: { type: string }
 * responses:
 * 200:
 * description: Login success
 * 401:
 * description: Invalid credentials
 */
