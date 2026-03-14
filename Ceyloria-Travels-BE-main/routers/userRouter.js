const express = require("express");
const {
  createAdmin,
  createUser,
//   deleteAdmin,
//   getAdmins,
//   getUser,
//   googleLogin,
  LoginUser,
  getAdmins,
  deleteAdmin,
//   resetPassword,
//   sendOTP,
//   getCustomers,  
//   setCustomerBlock,  
} = require("../controllers/userController.js");

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/create-admin", createAdmin);
userRouter.post("/login", LoginUser);
userRouter.get("/admins", getAdmins);
userRouter.delete("/admin/:id", deleteAdmin);

// userRouter.post("/googlelogin", googleLogin);
// userRouter.post("/send-otp", sendOTP);
// userRouter.post("/reset-password", resetPassword);

// userRouter.get("/admins", getAdmins);
// userRouter.delete("/admins/:email", deleteAdmin);

// userRouter.get("/customers", getCustomers);
// userRouter.patch("/customers/:email/block", setCustomerBlock);

// userRouter.get("/", getUser);

module.exports = userRouter;
