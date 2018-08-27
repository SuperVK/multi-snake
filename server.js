var express = require('express');
var app = express();
var Game = require('./game.js')
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
var io = require('socket.io')(listener)
var game = new Game(50, 50, 50, 50)
setInterval(frame, 1000/10)

io.on('connection', function(socket) {
    console.log('yo waddup')
    game.addSnake(socket.id)
    socket.on('facing', function(data) {
        game.setDirection(socket.id, data)
    })
})

function frame() {
    let data = game.process()
    io.sockets.emit('draw', data)
}

app.use('/', express.static('public'));

// listen for requests :)

