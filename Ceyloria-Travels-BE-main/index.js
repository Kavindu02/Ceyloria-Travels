const express = require("express");

const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cors = require("cors");
const sequelize = require("./config/database.js");
const userRouter = require("./routers/userRouter.js");
const User = require("./models/user.js");
const packageRouter = require("./routers/travelPackageRoutes.js");
const galleryRouter = require("./routers/galleryRouter.js");
const accommodationRouter = require("./routers/accommodationRouter.js");
const contactRouter = require("./routers/contactRouter.js");
const blogRouter = require("./routers/blogRouter.js");
const destinationRouter = require("./routers/destinationRouter.js");
const activityRouter = require("./routers/activityRouter.js");





dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://sdk-travels-frontend.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

sequelize.authenticate()
  .then(() => {
    console.log("Connected to database");
    return sequelize.sync({ alter: false });
  })
  .then(() => console.log("Database synchronized"))
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });

//JWT Middleware
app.use(async (req, res, next) => {
  if (req.method === "OPTIONS") return next();

  const value = req.header("Authorization");
  if (!value) return next();

  const token = value.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.userId && decoded.email) {
      try {
        const u = await User.findOne({ 
          where: { email: decoded.email },
          attributes: ['id', 'role', 'isBlock', 'isEmailVerified', 'image'] 
        });
        if (!u) {
          return res.status(401).json({ message: "Unauthorized: user not found" });
        }
        decoded.userId = u.id.toString();
        // optional refresh
        decoded.role = u.role ?? decoded.role;
        decoded.isBlock = u.isBlock ?? decoded.isBlock;
        decoded.isEmailVerified = u.isEmailVerified ?? decoded.isEmailVerified;
        decoded.image = u.image ?? decoded.image;
      } catch (lookupErr) {
        console.error("Auth user lookup failed:", lookupErr.message);
        return res.status(500).json({ message: "Auth lookup failed" });
      }
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT verification error:", err.message);
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
});

// Routes
app.use("/users", userRouter);
app.use("/packages", packageRouter);
app.use("/gallery", galleryRouter);
app.use("/accommodations", accommodationRouter);
app.use("/blogs", blogRouter);
app.use("/destinations", destinationRouter);
app.use("/activities", activityRouter);
app.use("/api", contactRouter);


const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`server started on port ${port}`);
});

