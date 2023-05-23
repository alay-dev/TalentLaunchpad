const express = require("express");
const authController = require("../controllers/authController");
const messageController = require("../controllers/messageController");

const router = express.Router();

router.post("/send", authController.protect, messageController.sendMessage);
router.post("/get_chat", authController.protect, messageController.getChat);

router.post(
  "/get_all_candidate_conversation",
  authController.protect,
  messageController.getAllCandidateConversation
);

router.post(
  "/get_all_employer_conversation",
  authController.protect,
  messageController.getAllEmployerConversation
);

module.exports = router;
