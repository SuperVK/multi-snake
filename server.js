var express = require('express');
var app = express();
var Game = require('./game.js')
var listener = app.listen('80', function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
var io = require('socket.io')(listener)
var game = new Game(50, 100, 15, 15)
setInterval(frame, 1000/10)

io.on('connection', function(socket) {
    game.addSnake(socket.id)
    socket.on('facing', function(data) {
        
        game.setFacing(socket.id, data)
    })
    socket.on('disconnect', function() {
        game.removeSnake(socket.id)
    })
})

function frame() {
    let data = game.process()
    io.sockets.emit('draw', data)
}

app.use('/', express.static('public'));

// listen for requests :)

