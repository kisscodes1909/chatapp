const express = require('express');
const {saveMessage, getMessages} = require('../model/messages');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);


io.on('connection', (socket) => {
    console.log('user connected');
});

const sendMessage = async (req, res, next) => {
    const message = await saveMessage(req.body);   
    const io = req.app.get('socketio');
    io.emit('message', message);
    res.sendStatus(200);
}

const getMessagesController = async (req, res, next) => {    
    const messages = await getMessages();
    res.send(messages);
}

module.exports = {
    sendMessage,
    getMessagesController
}
