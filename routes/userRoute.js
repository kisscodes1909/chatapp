const express = require('express');
const route = express.Router();

const {createNewUser, login, logout} = require('../controller/userController');

//const {signInChecker} = require('../core-functions/user');

route.get('/register', (req, res) => {
    res.render('register', {
        formData: {
            'firstName': '',
            'lastName': '',
            'email': '',
            'password': '',
            'repassword': ''
        },
        status: {}
    });
    
});

route.post('/register', createNewUser);

route.get('/login', (req, res) => {
    res.render('login', {
        formData: {
            'email': '',
            'password': '',
        },
        status: {}
    });

});

route.post('/login', login);

route.get('/logout', logout);

module.exports = route;