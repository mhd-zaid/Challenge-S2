import express from "express";
import {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getUser,
    recoverUser,
    updatePassword,
} from "../routes/usersRoutes.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);
router.get("/:id", getUser);
router.patch("/:id", updateUser);
router.patch("/:id/password", updatePassword);
router.delete("/:id", deleteUser);
router.post("/recover/:id", recoverUser);

export default router;
