const express = require("express");
const router = express.Router();

const {sendMessage} = require("../controllers/sendMessage");

router.post("/", sendMessage);

module.exports = router;