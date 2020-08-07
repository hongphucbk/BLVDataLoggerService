require('dotenv').config();
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true});

var DataLogger = require('./models/datalogger.model')

// Add server MQTT
var mosca = require('mosca');

var settings = {
  http:{
    port: 22000  //MQTT for Web
  },
  port:22001,    //MQTT for PLC
  }
var server = new mosca.Server(settings);

server.on('clientConnected', function(client) {
   console.log('client connected', client.id);
});
server.on('ready', function(){
	console.log("Server Mosca MQTT ready port " + settings.port);
});



server.on('published',function getdata(packet,client) {
	if(packet.topic =='data') 
	{
		// console.log('data: ', packet.topic);
		let data = packet.payload.toString();
		try{
			let jsondata = JSON.parse(data);
			jsondata.created_at = new Date();
			// jsondata.PR = 20;
			// jsondata.status = 'COOLING'
			//console.log(data);
			//console.log(jsondata);
			
			var saveData = jsondata

			DataLogger.insertMany(saveData, function(err) {
				if (err) return handleError(err);
			});


		}catch(err){
			console.log("Error " + err.message);
		}
	} 
})
