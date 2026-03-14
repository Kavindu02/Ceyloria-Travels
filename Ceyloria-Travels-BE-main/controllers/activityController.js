const Activity = require("../models/activity.js");

exports.getActivities = async (req, res) => {
    try {
        const activities = await Activity.findAll({ order: [['createdAt', 'DESC']] });
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch activities", error: error.message });
    }
};

exports.createActivity = async (req, res) => {
    try {
        const newActivity = await Activity.create(req.body);
        res.status(201).json({ message: "Activity created successfully", activity: newActivity });
    } catch (error) {
        res.status(500).json({ message: "Failed to create activity", error: error.message });
    }
};

exports.updateActivity = async (req, res) => {
    try {
        const [updatedRows] = await Activity.update(req.body, { where: { id: req.params.id } });
        if (updatedRows === 0) return res.status(404).json({ message: "Activity not found" });
        const updatedActivity = await Activity.findByPk(req.params.id);
        res.json({ message: "Activity updated successfully", activity: updatedActivity });
    } catch (error) {
        res.status(500).json({ message: "Failed to update activity", error: error.message });
    }
};

exports.deleteActivity = async (req, res) => {
    try {
        const deletedRows = await Activity.destroy({ where: { id: req.params.id } });
        if (deletedRows === 0) return res.status(404).json({ message: "Activity not found" });
        res.json({ message: "Activity deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete activity", error: error.message });
    }
};

exports.getActivityById = async (req, res) => {
    try {
        const activity = await Activity.findByPk(req.params.id);
        if (!activity) return res.status(404).json({ message: "Activity not found" });
        res.json(activity);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch activity", error: error.message });
    }
};
