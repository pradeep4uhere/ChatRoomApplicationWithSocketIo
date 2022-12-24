const io = require('socket.io')(8001);
const users = {};
console.log('Node Server Working..');
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8005;

// sendFile will go here
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(port);

io.on('connection',socket =>{
    socket.on('new-user-joined',name =>{
        users[socket.id] = name;
        socket.broadcast.emit('user-joined',name);
    });

    socket.on('send',message =>{
        socket.broadcast.emit('receive',{message:message, name:users[socket.id]});
    })


    //If User Left the conversation
    socket.on('disconnect',message =>{
            socket.broadcast.emit('left',users[socket.id]);
            delete users[socket.id];
    });
})

console.log('Server started at http://localhost:' + port);
