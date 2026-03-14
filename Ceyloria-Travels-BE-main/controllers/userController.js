const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
// import axios from "axios";
// import nodemailer from "nodemailer";
// import OTP from "../models/otp.js";


dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// helper: admin guard
function ensureAdmin(req, res) {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ message: "Forbidden: Admins only" });
    return false;
  }
  return true;
}

// Create User Signup
exports.createUser = function(req, res) {
  const passwordHash = bcrypt.hashSync(req.body.password, 10);

  const userData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: passwordHash,
    role: "customer",
    phone: req.body.phone || "Not Given",
  };

  User.create(userData)
    .then(() => {
      res.json({ message: "User Created Successfully" });
    })
    .catch(() => {
      res.json({ message: "Failed to create user" });
    });
}

// Create Admin (Backend)
exports.createAdmin = function(req, res) {
  const defaultPassword = "admin123";
  const passwordHash = bcrypt.hashSync(defaultPassword, 10);

  const userData = {
    firstName: "Admin",
    lastName: "User",
    email: req.body.email,
    password: passwordHash,
    role: "admin",
    phone: "Not Given",
    isEmailVerified: true,
  };

  User.create(userData)
    .then(() => {
      res.json({
        message: "Admin Created Successfully with default details",
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Failed to create admin",
        error,
      });
    });
}

// login Users
exports.LoginUser = function(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User Not Found" });
      }

      // block check
      if (user.isBlock) {
        return res
          .status(403)
          .json({ message: "Your account has been blocked. Please contact support." });
      }

      const isPasswordCorrect = bcrypt.compareSync(password, user.password);

      if (isPasswordCorrect) {
        const token = jwt.sign(
          {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isBlock: user.isBlock,
            isEmailVerified: user.isEmailVerified,
            image: user.image,
          },
          process.env.JWT_SECRET
        );

        res.json({
          token: token,
          message: "Login Successful",
          role: user.role,
        });
      } else {
        res.status(403).json({ message: "Incorrect Password" });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Login Failed", error: error.message });
    });
}

// isAdmin
exports.isAdmin = function(req) {
  if (req.user == null) return false;
  return req.user.role === "admin";
}


// GET ALL ADMINS
exports.getAdmins = function(req, res) {
  User.findAll({ 
    where: { role: "admin" },
    order: [['createdAt', 'DESC']]
  })
    .then((admins) => {
      res.json(admins);
    })
    .catch((error) => {
      console.error("Error fetching admins:", error);
      res.status(500).json({ message: "Failed to fetch admins" });
    });
}


// DELETE ADMIN
exports.deleteAdmin = async (req, res) => {  
  try {
    const adminId = req.params.id;

    await User.destroy({ where: { id: adminId } });

    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.log("Delete error:", error);
    res.status(500).json({ message: "Failed to delete admin" });
  }
};
