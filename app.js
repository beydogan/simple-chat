var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs');

var port = process.env.PORT || 5000;
console.log("Listening on " + port);
 
app.listen(port);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
  });
}
redis = require("redis");

var pub = redis.createClient();

io.sockets.on('connection', function (client) {
	var sub = redis.createClient();

	console.log("CLIENT CONNECTED!")

	sub.on("message", function (channel, message) {
		console.log("RECEIVED CHANNEL:" +channel);
		client.send(message);
	});

	client.on("message", function (msg) {
		console.log("=====START=====")
	    console.log(msg);
	    if(msg.type == "chat"){
	        pub.publish("kanal:" + msg.kanal, msg.message);
	    }
	    else if(msg.type == "setUsername"){
	    	console.log("SUB= CH:" + msg.kanal)
			client.send("SELAM");
			sub.subscribe("kanal:" + msg.kanal);
			pub.publish("kanal:" + msg.kanal, "CONNECTED USER");
	    }

	    console.log("=====END=====")
	});

	client.on('disconnect', function () {
	    sub.quit();
	});
	 
 	
});