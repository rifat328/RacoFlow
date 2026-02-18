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
 *   name: Auth
 *   description: User authentication
 */

/**
 * @swagger
 * /api/v1/auth/sign-up:
 *   post:
 *     summary: Register a new user (customer, admin, or agent)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               phone: { type: string }
 *               address: { type: string }
 *               role: { type: string }
 *     responses:
 *       201:
 *         description: User registered successfully
 */

/**
 * @swagger
 * /api/v1/auth/sign-in:
 *   post:
 *     summary: Login user and return JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login success
 */
