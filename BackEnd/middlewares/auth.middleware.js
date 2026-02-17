import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import { db } from "../DATABASE/db.js"; // Drizzle db instance
import { users } from "../DATABASE/schema.js"; // users table
import { eq } from "drizzle-orm"; //  equality helper

export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    // Check if user exists and if their role is in the allowed list
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied for role: ${req.user?.role || "Guest"}`,
      });
    }
    next();
  };
};

export const authorize = async (req, res, next) => {
  try {
    let token;

    // 1. Check Bearer Token
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 2. Fallback to Cookie
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized access, no token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // --- DRIZZLE REPLACEMENT FOR User.findById ---
    //  use .select() and .where() with the eq() helper in drizzle
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1);

    if (!user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User no longer exists" });
    }

    // Attach user to request (excluding password for safety)
    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Unauthorized access",
      error: error.message,
    });
  }
};
