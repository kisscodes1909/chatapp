const mongoose = require('mongoose');

const User = mongoose.model('User', {
    firstname: String,
    lastname: String,
    password: String,
    email: String,
});

const addUser = async (userData) => {
    const user = new User(userData);
    try {
       const response = user.save();
       return response;
    } catch (error) {
       console.log(error);
    }
}

const getUserByEmail = async (email) => {
    const query = User.where({email});
    try {
        const user = query.findOne();
        return user;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    addUser,
    getUserByEmail
}