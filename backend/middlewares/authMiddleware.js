import jwt from "jsonwebtoken";
const protect = async (req, res, next) => {
    const authHeaders = req.headers.authorization;
    if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Accès non autorisé" });
    }
    try {
        const token = authHeaders.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
        id: decoded.id,
        role: decoded.role
    };
    next();
    } catch (err) {
        res.status(401).json({ message: "Token invalide" });
    }
};
export default protect;
