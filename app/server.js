const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const md5 = require('md5');

const {Room} = require('./lib/room');

var roomIds = [];
var composerSocketIds = {};
var rooms = {};
var listeners = {};

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

    //save room id temporarily to validate existing in first room join with socket
    roomIds.push(hash);

    res.send(hash);
});

app.get('/room/:roomid', (req, res) => {
    let roomExists = roomIds.find((el) => {
        return el === req.params.roomid;
    });

    if(typeof io.sockets.adapter.rooms[req.params.roomid] !== 'undefined' || typeof roomExists !== 'undefined') {
        res.render('room');
    }

    return res.status(404).send();
});

io.on('connection', (socket) => {
    socket.on('join', (params, callback) => {
        var isComposer = false;

        socket.join(params.roomId);

        //after room joined with roomId, can delete the room id from the roomIds array
        roomIds = roomIds.filter(id => id === params.roomId);

        //find if room exists, if not this is a composer. set socket id as composer. if it does its a listener
        if( ! rooms[params.roomId]) {
            //create new room instance
            rooms[params.roomId] = new Room(params.roomId, socket.id);

            composerSocketIds[socket.id] = params.roomId;

            isComposer = true;
        } else {
            //add user to correct room.
            rooms[params.roomId].addUser(socket.id);
            listeners[socket.id] = params.roomId;

            io.to(params.roomId).emit('updateListeners', fetchListeners(params.roomId));
        }

        // io.to(params.roomId).emit('updateUserCount', users.getUserCount(params.room));
        callback(isComposer);
    });

    socket.on('pressMidiKey', (data) => {
        //r - room id
        //t - type
        //n - note number
        //v - velocity

        let roomId = data.r;
        delete data.r;

        socket.broadcast.to(roomId).emit('midiKeyPressed', data);
    });

    socket.on('disconnect', function () {
        if(composerSocketIds[socket.id]) {
            let currentRoomId = composerSocketIds[socket.id];
            delete rooms[currentRoomId];
            delete composerSocketIds[socket.id];
            roomIds = roomIds.filter(id => id !== currentRoomId);

            socket.broadcast.to(currentRoomId).emit('composerLeft');

            delete io.sockets.adapter.rooms[currentRoomId];
        } else {
            if(listeners[socket.id]) {
                let roomId = listeners[socket.id];
                delete listeners[socket.id];

                io.to(roomId).emit('updateListeners', fetchListeners(roomId));
            }
        }
    });

    socket.on('requestListenerAmount', (data, callback) => {
        let roomId = data.roomId;

        callback(fetchListeners(roomId));
    });
});

function fetchListeners(roomId) {
    let count = 0, key;

    for(key in listeners) {
        if(listeners[key] && listeners[key] === roomId) {
            count++;
        }
    }

    return count
}

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});