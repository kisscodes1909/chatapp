const express = require('express');
const {saveMessage, getMessages} = require('../model/messages');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const {getCurrentUser, getUserAvatar} = require('../core-functions/user');

io.on('connection', (socket) => {
    console.log('user connected');
});

const sendMessage = async (req, res, next) => {
    const io = req.app.get('socketio');
    const currUser = getCurrentUser(req);

    if( !currUser ) {
        res.sendStatus(500); 
        return;
    }

    let message = await saveMessage({
        name: currUser.firstname,
        message: req.body.message,
        userId: currUser._id,
        avatar: getUserAvatar(req, currUser.avatar)
    });
    
    //message = checkYourMessage(currUser, message.toObject());
    
    // IO emit
    io.emit('message', message);

    res.sendStatus(200);
}

const checkYourMessage = (currUser, message) => {

    if( message.userId === currUser._id ) {
        message['yourMessage'] = true;
    } else {
        message['yourMessage'] = false;
    }

    return message;
}


const getMessagesController = async (req, res, next) => {   

    const timeToLoadMore = req.query.timeToLoadMore ? req.query.timeToLoadMore : new Date();
    
    let messages = await getMessages(timeToLoadMore);

    messages = messages.reverse();

    const currUser = getCurrentUser(req);

    let returnData = {
        timeToLoadMore: null,
        messages
    }
    
    // Set time to load
    returnData.timeToLoadMore = messages.length > 0 ? messages[0].createAt : null;

    res.send(returnData);
}

module.exports = {
    sendMessage,
    getMessagesController
}
