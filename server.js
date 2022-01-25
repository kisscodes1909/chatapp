const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const { send, sendStatus } = require('express/lib/response');
const port = process.env.PORT || 1234;


app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

const dbUrl = "mongodb+srv://kisscodes1909:0914145271@chatapplication.nqfje.mongodb.net/chatApplication?retryWrites=true&w=majority";

const Message = mongoose.model('Message', {
    name: String,
    message: String,
});

const messages = [
    {name: "John", message: "Hello"},
    {name: "Jane", message: "Hi"}
];



app.get('/messages', (req, res) => {
    Message.find({}, (err, message) => {
        res.send(message);
    });

    //res.send(messages);
});

app.post('/messages', (req, res) => {
    const message = new Message(req.body);

    message.save((err)=>{
        if( err ) {
            sendStatus(500);
        }

        messages.push(req.body);
        io.emit('message', req.body);
        console.log(messages);
        res.sendStatus(200);
    });

});

io.on('connection', (socket) => {
    console.log('user connected');
});

mongoose.connect(dbUrl, (error)=>{
    console.log('mongodb connection successful');

    console.log(error);
});

http.listen(port, ()=>{
    console.log(`Server is running POST ${port}`);
});