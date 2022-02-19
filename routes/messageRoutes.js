const {getMessagesController, sendMessage} = require('../controller/messageController');

const express = require('express');
const route = express.Router();

route.get('/', getMessagesController);

route.post('/', sendMessage);

module.exports = route;