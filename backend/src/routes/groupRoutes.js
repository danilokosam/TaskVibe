import express from "express";
import {
  createGroup,
  addMemberToGroup,
  createGroupInvitation,
  joinGroupByInvitation,
} from "../controllers/groupController";
import checkJwt from "../middlewares/checkJwt";

const router = express.Router();

// Rutas existentes
router.post("/", checkJwt, createGroup);
router.post("/members", checkJwt, addMemberToGroup);
router.post("/:groupId/invitations", checkJwt, createGroupInvitation);
router.get("/join/:inviteCode", checkJwt, joinGroupByInvitation);

export default router;
