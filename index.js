const express = require('express');
const app =     express();
const path =    require('path');
const server =  require('http').createServer(app);
const io =      require('socket.io')(server);
const port =    process.env.PORT || 1111;

server.listen(port, () => {
    console.log('Server listening at port %d', port);
});
app.use(express.static(path.join(__dirname, 'public')));

let users = {}, id = 0;

let createUserId = () => ++id; 

io.on('connection', (socket) => {
    var addedUser = false;
    console.log("User Connected!");

    socket.on('join_game', (username) => {
        console.log(username);
        if (addedUser) return;

        const user = {
            "Character":{
                "UserId":0,
                "MaxHealth":10.0,
                "Position":{"x":30.4,"y":3.6,"z":-11.9},
                "CurrentHealth":{"Value":10.0,"HasValue":true}
            },
            "Id": createUserId(),
            "Name": username
        }

        users[user.id] = user;
        socket.user = user;
        addedUser = true;

        socket.emit('user_data', user);

        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('new_user_joined', user);
    });

    // when the client emits 'new message', this listens and executes
    socket.on('spawn character', (data) => {    // {user: user, info: {position}}
        // we tell the client to execute 'new message'
        console.log("Msg: " + data);
        socket.broadcast.emit('spawn character', data);
    });

    // when the client emits 'new message', this listens and executes
    socket.on('move character', (data) => {    // {user: user, info: {position}}
        // we tell the client to execute 'new message'
        console.log("Msg: " + data);
        socket.broadcast.emit('move character', data);
    });

    // when the client emits 'new message', this listens and executes
    socket.on('character shoot', (data) => {    // {user: user, info: {direction}}
        // we tell the client to execute 'new message'
        console.log("Msg: " + data);
        socket.broadcast.emit('character shoot', data);
    });

    // when the client emits 'new message', this listens and executes
    socket.on('character hit', (data) => {    // {user: user, info: {target, damage}}
        // we tell the client to execute 'new message'
        console.log("Msg: " + data);
        socket.broadcast.emit('character shoot', data);
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', () => {
        if (addedUser) {
            delete users[socket.user.id];
            // echo globally that this client has left
            socket.broadcast.emit('user left', socket.user.username);
        }
    });
});