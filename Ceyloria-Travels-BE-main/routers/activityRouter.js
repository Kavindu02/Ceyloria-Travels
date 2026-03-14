const express = require("express");
const {
    getActivities,
    getActivityById,
    createActivity,
    updateActivity,
    deleteActivity
} = require("../controllers/activityController.js");

const activityRouter = express.Router();

activityRouter.get("/", getActivities);
activityRouter.get("/:id", getActivityById);
activityRouter.post("/", createActivity);
activityRouter.put("/:id", updateActivity);
activityRouter.delete("/:id", deleteActivity);

module.exports = activityRouter;
