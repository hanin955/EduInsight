import auditLog from "../models/AuditLog.js";

export const ajouterAuditLog = async (req, res) => {
    try {
        const newLog = new auditLog(req.body);
        await newLog.save();
        res.status(201).json(newLog);
    } catch (err) {
        res.status(400).json({ message: "Erreur lors de l'ajout du log", error: err.message });
    }
};

export const listerAuditLogs = async (req, res) => {
    try {
        const logs = await auditLog.find().sort({ createdAt: -1 }); // plus récents en premier
        res.status(200).json(logs);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération des logs", error: err.message });
    }
};

export const getbyIdAuditLog = async (req, res) => {
    try {
        const foundLog = await auditLog.findById(req.params.id);
        if (!foundLog) {
            return res.status(404).json({ message: "Log non trouvé" });
        }
        res.status(200).json(foundLog);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération du log", error: err.message });
    }
};

export const updateAuditLog = async (req, res) => {
    try {
        const updatedLog = await auditLog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedLog) {
            return res.status(404).json({ message: "Log non trouvé" });
        }
        res.status(200).json(updatedLog);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du log", error: err.message });
    }
};

export const deleteAuditLog = async (req, res) => {
    try {
        const deletedLog = await auditLog.findByIdAndDelete(req.params.id);
        if (!deletedLog) {
            return res.status(404).json({ message: "Log non trouvé" });
        }
        res.status(200).json({ message: "Log supprimé avec succès" });
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la suppression du log", error: err.message });
    }
};