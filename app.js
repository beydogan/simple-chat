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

if (process.env.REDISTOGO_URL) {
	//console.log()
	var pub = require("redis").createClient("6379", process.env.REDISTOGO_URL);
	
	//pub.auth(rtg.auth.split(":")[1]);
} else {
	var pub = redis.createClient();
}

io.sockets.on('connection', function (client) {
	if (process.env.REDISTOGO_URL) {
		var sub = require("redis").createClient(rtg.port, rtg.hostname);
		sub.auth(rtg.auth.split(":")[1]);
	} else {
		var sub = redis.createClient();
	}

	console.log("CLIENT CONNECTED!")

	sub.on("message", function (channel, message) {
		console.log(message)
		console.log("RECEIVED CHANNEL:" +channel);
		client.emit("message", message);
	});

	client.on("message", function (msg) {
		console.log("=====START=====")
	    console.log(msg);
	    //sub.subscribe("CHAT:52");
	    //pub.publish("CHAT:52", "fdskkfdsa");
	    if(msg.type == "chat"){
	        pub.publish("CHAT:" + msg.kanal, msg);
	    }
	    else if(msg.type == "connectChat"){
	    	console.log("CONNECT CHAT")
	    	console.log("#############")
			sub.subscribe("CHAT:" + msg.kanal);
			pub.publish("CHAT:" + msg.kanal, "CONNECTED USER");
	    }


	    console.log("=====END=====")
	});

	client.on('disconnect', function () {
	    sub.quit();
	});
	 
 	
});