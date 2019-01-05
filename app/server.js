const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const md5 = require('md5');

const {Room} = require('./lib/room');

var roomIds = [];
var composerSocketIds = [];
var rooms = {};

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.set('view engine', 'ejs');
app.use(express.static(publicPath));

app.get('/', (req, res) => {
    res.render('connect');
});

app.post('/create-room', (req, res) => {
    let time = new Date().getTime();
    let hash = md5(time);

    roomIds.push(hash);

    res.send(hash);
});

app.get('/room/:roomid', (req, res) => {
    let roomExists = roomIds.find((el) => {
        return el === req.params.roomid;
    });

    if(typeof roomExists === 'undefined' && ! rooms[req.param.roomid]) {
        return res.status(404).send();
    }

    res.render('room');
});

io.on('connection', async (socket) => {
    socket.on('join', (params, callback) => {
        var isComposer = false;

        socket.join(params.roomId);

        //find if room exists, if not this is a composer. set socket id as composer. if it does its a listener
        if( ! rooms[params.roomId]) {
            //create new room instance
            var room = new Room(params.roomId, socket.id);
            rooms[params.roomId] = (room);

            isComposer = true;
        } else {
            //add user to correct room.
            rooms[params.roomId].addUser(socket.id);
        }

        // io.to(params.roomId).emit('updateUserCount', users.getUserCount(params.room));
        callback(isComposer);
    });

    socket.on('pressMidiKey', (data) => {
        socket.broadcast.to(data.roomId).emit('midiKeyPressed', data);
    })
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});