const db = require('../models');
const User = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password, role, department } = req.body;

  try {
    const userExists = await db.User.findOne({ where: { email } }); // ✅ use db.User
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.User.create({
      name,
      email,
      password: hashedPassword,
      role,
      department,
    });

    res.status(201).json({ message: "User registered", user: newUser });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ message: "Registration error", error: err.message });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role, department: user.department },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};
