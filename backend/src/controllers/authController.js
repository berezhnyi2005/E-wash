import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const handleValidationError = (res, errors) => {
  return res.status(400).json({
    status: "error",
    errors,
  });
};

export const register = async (req, res) => {
  try {
    const errors = [];
    const { name, email, password } = req.body;

    if (!name) errors.push("MISSING_NAME");
    if (!email) errors.push("MISSING_EMAIL");
    if (!password) errors.push("MISSING_PASSWORD");

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("INVALID_EMAIL");
    }

    if (password && password.length < 6) {
      errors.push("PASSWORD_TOO_SHORT");
    }

    if (errors.length) {
      return handleValidationError(res, errors);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return handleValidationError(res, ["EMAIL_ALREADY_EXISTS"]);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "USER",
        isVerified: true,
        verificationToken: null,
      },
    });

    res.status(201).json({
      status: "success",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch {
    res.status(500).json({
      status: "error",
      message: "REGISTRATION_FAILED",
    });
  }
};

export const login = async (req, res) => {
  try {
    const errors = [];
    const { email, password } = req.body;

    if (!email) errors.push("MISSING_EMAIL");
    if (!password) errors.push("MISSING_PASSWORD");

    if (errors.length) {
      return handleValidationError(res, errors);
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        status: "error",
        errors: ["INVALID_CREDENTIALS"],
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        errors: ["INVALID_CREDENTIALS"],
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    res.json({
      status: "success",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch {
    res.status(500).json({
      status: "error",
      message: "LOGIN_FAILED",
    });
  }
};
