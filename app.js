const express = require("express");
const app = express();
let server = require('http').createServer(app);
const PORT = process.env.PORT;
//const PORT = 8080;
let io = require('socket.io')(server);
let segments = [];
let clients = 0;
let canvasData;
app.use(express.static(__dirname));
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/index.html");
});
io.on('connection', function(socket){
socket.broadcast.emit("new_user");
socket.on('addServerText', function(){
io.sockets.emit('addClientText');
})

socket.on('addServerSimpleText', function(){
  io.sockets.emit('addClientSimpleText');
  })

socket.on('moveTextServer', function(data){
io.sockets.emit('moveTextClient', data);
  })
socket.on('editTextServer', function(data){
io.sockets.emit('editTextClient', data);
 })
socket.on('drawing', function (canvasJson) {
       console.log("Drawing");
       canvasData = canvasJson;
       socket.broadcast.emit('drawing', canvasData);
    });
  socket.on('newCanvas', function(canvasJson){
   console.log("Drawing");
       canvasData = canvasJson;
       socket.broadcast.emit('drawing', canvasData);
  });
});
 server.listen(PORT, function(){
  console.log('Listening on port ' + PORT);
})
