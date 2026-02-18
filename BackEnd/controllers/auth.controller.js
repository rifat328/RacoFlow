import { db } from "../DATABASE/db.js";
import { users } from "../DATABASE/schema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN, NODE_ENV } from "../config/env.js";
import { eq } from "drizzle-orm";
import ms from "ms"; // to convert JWT_EXPIRES_IN to milliseconds to sync cookie token expiry time

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find User
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check Password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      maxAge: ms(JWT_EXPIRES_IN),
    });

    res.status(200).json({
      success: true,
      message: "Signed in successfully",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const signUp = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "All name, email, password are required" });
    }
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      const error = new Error("User already exists");
      error.statusCode = 409; // Conflict
      throw error;
    }

    //Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const [newUser] = await db
      .insert(users)
      .values({
        name: name,
        email: email,
        password: hashedPassword,
        address: address || null,
        phone: phone || null,
      })
      .returning(); //Using .returning() to get the ID for the token

    //Token generation
    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    //Set the cookie
    res.cookie("tokem", token, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "strict",
      maxAge: ms(JWT_EXPIRES_IN),
    });
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
        token,
      },
    });
  } catch (error) {
    next(error); // for error middleware;
  }
};
export const signOut = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Signed out successfully" });
};
