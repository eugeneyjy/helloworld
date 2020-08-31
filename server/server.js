const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();

const clientPath = `${__dirname}/../client`;
console.log(`Serving static from ${clientPath}`);
// app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static(clientPath));
app.use('/', express.static(clientPath));
app.set('port', process.argv[2]);

const server = http.createServer(app);

const io = socketio(server);

io.on('connection', function(socket){});

server.on('error', function(err){
  console.log("Error: ", err);
});

server.listen(app.get('port'), function(){
  console.log("Chess started on " + app.get('port'));
});
