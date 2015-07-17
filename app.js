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
		var sub = require("redis").createClient("6379", process.env.REDISTOGO_URL);
	} else {
		var sub = redis.createClient();
	}

	console.log("CLIENT CONNECTED!")

	sub.on("message", function (channel, message) {
		console.log(message)
		console.log("L44 RECEIVED CHANNEL:" +channel);
		client.emit("message", JSON.stringify(message));
	});

	client.on("message", function (msg) {
		console.log("=====START=====")
	    if(msg.type == "chat_message"){
	        pub.publish("USER:" + msg.user_id, JSON.stringify(msg));
	    }else if(msg.type == "user_connect"){
	    	console.log("CONNECT CHAT L54")
			sub.subscribe("USER:" + msg.user_id);
	    }
	    console.log("=====END=====")
	});

	client.on('disconnect', function () {
	    console.log("=====CLIENT DISCONNECT=====")
	    sub.quit();
	});
	 
 	
});