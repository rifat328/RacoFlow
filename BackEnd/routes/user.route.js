import { Router } from "express";
import {
  getUser,
  getUsers,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { authorize, checkRole } from "../middlewares/auth.middleware.js";
const userRouter = Router();

userRouter.get("/", authorize, checkRole("admin"), getUsers);
userRouter.get("/me", authorize, (req, res) => {
  const { password, __v, ...safeUser } = req.user._doc;
  res.json(safeUser);
});
userRouter.get("/:id", authorize, getUser);
userRouter.post("/", authorize, (reg, res) =>
  res.send({
    title:
      "CREATE A User ,Caution :: User creation logic handeled by auth sign up , to handle duplication this fild is empty",
  }),
);
userRouter.put("/:id", authorize, checkRole(["customer", "admin"]), updateUser);
userRouter.delete("/:id", authorize, checkRole("admin"), deleteUser);
// userRouter.get("/me", authorize, (req, res) => {
//   const { password, __v, ...safeUser } = req.user._doc;
//   res.json(safeUser);
// });
export default userRouter;
// This file defines the user-related routes for the application.
// It includes routes for getting a user, getting all users, updating a user, and deleting a user.
// The routes are protected by authorization middleware to ensure that only authenticated users can access them.

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management routes
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully returned list of all users
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       403:
 *         description: Forbidden - Only admin can access this route
 */

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get a single user by ID (Any logged-in user)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details returned successfully
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Create a user (Disabled) — Handled by Auth Sign-Up
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User creation disabled — Use /auth/sign-up
 */

/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     summary: Update a user (Admin or the user themselves)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *               address: { type: string }
 *               role: { type: string }
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       403:
 *         description: Forbidden - Only admin or the same user can update
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       403:
 *         description: Forbidden - Only admin can delete users
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/v1/users/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user data
 *       401:
 *         description: Unauthorized
 */
