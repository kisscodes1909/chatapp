const express = require('express');
const route = express.Router();

const {getAvatar} = require('../controller/uploadController');

route.get('/avatar/:fileName', getAvatar);

module.exports = route;