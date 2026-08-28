import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { User } from "../models/Users";
import { userSchema } from "../types/auth.types";
import jwt from "jsonwebtoken";


const generateJWT = (userId: string, name: string, email: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set. Please configure it in your .env file.");
  }
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  
  return jwt.sign(
    { userId, name, email },
    secret,
    { expiresIn } as jwt.SignOptions
  );
};

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password }: z.infer<typeof userSchema> = req.body;

    // Normalize email to lowercase for consistent checking
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      res.status(409).json({
        error: "User already exists",
      });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store to database
    const user = new User({ name, email: normalizedEmail, password: hashedPassword });
    await user.save();

    // Generae JWT
    const token = generateJWT(user.id.toString(),user.email,user.name);

    // Response
    res.status(201).json({
      message: "Signed up successfully",
      token,
      data: { name, email: normalizedEmail },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const signin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: z.infer<typeof userSchema> = req.body;

    // Normalize email to lowercase for consistent checking
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const userExists = await User.findOne({ email: normalizedEmail });
    if (!userExists) {
      res.status(404).json({
        error: "User not found",
      });
      return;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, userExists.password);
    if (!isValidPassword) {
      res.status(401).json({
        error: "Invalid credentials",
      });
      return;
    }


    // Generate JWT token
    const token = generateJWT(userExists.id.toString(),userExists.email,userExists.name);



    // Successful signin
    res.status(200).json({
      message: "Signed in successfully",
      token,
      data: { name: userExists.name },
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};