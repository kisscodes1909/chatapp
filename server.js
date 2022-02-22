require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const port = process.env.PORT || 1234;
const session = require('express-session');
const cookieParser = require("cookie-parser");
//const nocache = require('nocache');
const compression = require('compression')



//app.set('etag', false);

// setting engine template
app.set('view engine', "ejs");
app.use(express.static(__dirname + '/views', {
    maxAge: 3600000
}));

// Add compression
app.use(compression())


// Disable cache

// setting body params
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

const dbUrl = process.env.MONGODB_URI
 
// setting route
const messageRoute = require('./routes/messageRoutes');
const userRoute = require('./routes/userRoute.js');
const uploadRoute = require('./routes/uploadRoutes.js');

// setting session cookie
app.use(session({
    resave: true, 
    saveUninitialized: false, 
    secret: 'somesecret', 
    cookie: { maxAge: 365 * 24 * 60 * 60 * 1000 }}));

// check Authenication
app.use((req, res, next) => {

    // Fake session

    // req.session.user = {
    //     _id: '620f5188185c1e12e3df8e2a',
    //     firstname: 'Yardley',
    //     lastname: 'Malachi',
    //     password: '$2b$10$Si./3.bhQsFEGD5nhUkKHuyN/g7CLMgPfSYSSYykGGCdNnbyKgGha',
    //     email: 'kisscodes1909@gmail.com',
    //     avatar: '',
    //     __v: 0
    // }

    const {user} = req.session;

    // console.log(user);

    res.locals.siteUrl = req.get('host');

    const authenicationPages = [
        '/user/login',
        '/user/register',
    ]

    if( user === undefined && !authenicationPages.includes(req.path) ) {
        res.redirect('/user/login');
    } else {
        // Set local user
        res.locals.user = user;
        next();
    }
});

// setting cookie 
app.use(cookieParser());

//app.use(nocache());


app.get('/', (req, res) => {
    res.render("index");
});


app.use('/messages', messageRoute);
app.use('/user', userRoute);
app.use('/upload', uploadRoute);


// setting io 
app.set('socketio', io);
io.on('connection', (socket) => {
    console.log('user connected');
});



mongoose.connect(dbUrl, (error)=>{
    console.log('mongodb connection successful');
});

http.listen(port, ()=>{
    console.log(`Server is running POST ${port}`);
});