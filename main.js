var express = require('express');
app = express();
server = require('http').createServer(app);
io = require('socket.io')(server);

var SerialPort = require("serialport");
var serialport = SerialPort.SerialPort;

// list serial ports:

app.use(express.static('public'));		

var brightness = 0;

io.sockets.on('connection', function (socket) {
	console.log('Alguien se ha conectado con Sockets');
	socket.on('led', function (data) {
		brightness = data.value;
		
		var buf = new Buffer(1);
		buf.writeUInt8(brightness, 0);
		//serialPort.write(buf);
		
			
	});
		socket.on('newmessage', function (socket) {
	sockets.emit('message', socket);
	console.log(socket);
});
socket.on('connectToPort', function (portName) {
	

	 myPort = new serialport(portName, {
		baudRate: 9600,
		// look for return and newline at the end of each data packet:
		
 });
  myPort.on("open", function () {
  console.log('open');
});
  myPort.on('data', function(data) {
    console.log('data received: ' + data);
	io.sockets.emit('message', data.toString());
  });
  

});


});




console.log("running");


app.get('/getPorts', function(req, res){
	listPorts = [];
	SerialPort.list(function (err, ports) {
		
		ports.forEach(function(port) {
    		console.log(port.comName);
    		listPorts.push({id: port.comName, value: port.comName})
  });
  		res.send(ports);
  	});
	
	});
	


server.listen(8080);