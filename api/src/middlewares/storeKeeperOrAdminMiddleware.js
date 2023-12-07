import User from "../models/postgres-user.js";

const storeKeeperOrAdminMiddleware = async (req, res, next) => {
    const userId = req.user.userId;
    if (!userId) {
        return res.status(401).send("Authentification requiered");
    }
    const user = await User.findOne({where: {id: userId}});
    if (!user) {
        return res.status(404).send("User not found");
    }
    if (user.role !== "ROLE_ADMIN" && user.role !== "ROLE_STORE_KEEPER") {
        return res.status(403).send("Not authorized");
    }
    next();
}

export default storeKeeperOrAdminMiddleware;