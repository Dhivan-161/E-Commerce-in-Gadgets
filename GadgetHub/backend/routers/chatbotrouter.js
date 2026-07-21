const express = require('express');
const router = express.Router();
const { handleChat } = require('../controlers/chatbotcontrol');

router.post('/chat', handleChat);

module.exports = router;
