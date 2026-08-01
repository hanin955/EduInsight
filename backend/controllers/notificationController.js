import notification from "../models/Notification.js";

export const ajouterNotification = async (req, res) => {
    try {
        const newNotification = new notification(req.body);
        await newNotification.save();
        res.status(201).json(newNotification);
    } catch (err) {
        res.status(400).json({ message: "Erreur lors de l'ajout de la notification", error: err.message });
    }
};

export const listerNotifications = async (req, res) => {
    try {
        const notifications = await notification.find().sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération des notifications", error: err.message });
    }
};

export const getbyIdNotification = async (req, res) => {
    try {
        const foundNotification = await notification.findById(req.params.id);
        if (!foundNotification) {
            return res.status(404).json({ message: "Notification non trouvée" });
        }
        res.status(200).json(foundNotification);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération de la notification", error: err.message });
    }
};

export const deleteNotification = async (req, res) => {
    try {
        const deletedNotification = await notification.findByIdAndDelete(req.params.id);
        if (!deletedNotification) {
            return res.status(404).json({ message: "Notification non trouvée" });
        }
        res.status(200).json({ message: "Notification supprimée avec succès" });
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la suppression de la notification", error: err.message });
    }
};

export const markAsRead = async (req, res, next) => {
    try {
        const notif = await notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
        res.status(200).json({ success: true, data: notif });
    } catch (error) { next(error); }
};