import { db } from "../DATABASE/db.js";
import { users } from "../DATABASE/schema.js";
import { eq } from "drizzle-orm";

export const promoteToBuyer = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Update the user's role to BUYER
    const updatedUser = await db
      .update(users)
      .set({ role: "BUYER" })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        role: users.role,
      });

    if (updatedUser.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User promoted to Buyer successfully",
      data: updatedUser[0],
    });
  } catch (error) {
    next(error); // Let your pg-aware errorMiddleware handle this
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await db.select().from(users);
    res.status(200).json({ success: true, data: allUsers });
  } catch (error) {
    next(error);
  }
};
