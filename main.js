var express = require('express');
app = express();
server = require('http').createServer(app);
io = require('socket.io')(server);

var SerialPort = require("serialport");
var serialport = SerialPort.SerialPort;


app.use(express.static('public'));		

var brightness = 0;

//Every page create a socket connection.
io.sockets.on('connection', function (socket) {
	
	//Socket used in Led.html
  	var brightness = 0;
	socket.on('led', function (data) {
		brightness = data.value;
		
		var buf = new Buffer(1);
		buf.writeUInt8(brightness, 0);
		myPort.write(buf);
		
		io.sockets.emit('led', {value: brightness});	
	});

	//Every page try to connect searching the Arduinos USB port. 
	socket.on('connectToPort', function (portName) {
	

		myPort = new serialport(portName, {
			baudRate: 9600,		
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

//Every page run a GET ajax request to ask for the avaliable ports.
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