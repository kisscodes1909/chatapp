const mongoose = require('mongoose');

const Message = mongoose.model('Message', {
    name: String,
    message: String,
});


const saveMessage = async (messageParams) => {
    const message = new Message(messageParams);
    try {
        const response = message.save();
        return response;
    } catch (error) {
        return error;
    }
}

const getMessages = async () => {
    try {
        const messages = await Message.find({}); 
        return messages;
    } catch (error) {
        return error;
    }
}

module.exports = {
    saveMessage,
    getMessages
}