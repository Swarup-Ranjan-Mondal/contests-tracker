import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { JWT_SECRET } from "../config/config.js";

// User Signup
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Generate JWT Token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

    // Convert to object and exclude sensitive fields
    const userObj = user.toObject();
    userObj.token = token;
    delete userObj.password;

    res.status(201).json({ user: userObj, message: "User registered successfully" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// User Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

    // Convert to object and exclude sensitive fields
    const userObj = user.toObject();
    userObj.token = token;
    delete userObj.password;

    res.status(200).json({ user: userObj, message: "User signed in successfully" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Server Error" });
  }
};
