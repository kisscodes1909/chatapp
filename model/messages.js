const mongoose = require('mongoose');

const Message = mongoose.model('Message', {
    name: String,
    message: String,
    createAt: { type: Date, default: Date.now },
    userId: String,
    avatar: String
});


const saveMessage = async (messageParams) => {
    const message = new Message(messageParams);
    try {
        const response = await message.save()
        return response;
    } catch (error) {
        return error;
    }
}

const getMessages = async (timeToLoadMore = new Date()) => {

    const perPage = 5;
    
    try {
        const messages = await Message.find({createAt:{$lt: timeToLoadMore}})
        .limit(perPage)
        .sort({createAt: 'desc'})
        .lean(); 
        return messages;
    } catch (error) {
        console.log(error);
        return error;
    }
}

module.exports = {
    saveMessage,
    getMessages
}