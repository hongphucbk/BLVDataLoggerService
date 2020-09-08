require('dotenv').config();
var mongoose = require('mongoose');
const axios = require('axios');


mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true});

var DataLogger = require('./models/datalogger.model')
var History = require('./models/history.model')

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


let data
let jsondata

server.on('published',function getdata(packet,client) {
	if(packet.topic =='data') 
	{		
		try{
			let data = packet.payload.toString();
			let jsondata = JSON.parse(data);
			jsondata.created_at = new Date();
			// jsondata.PR = 20;
			// jsondata.status = 'COOLING'
			//console.log(data);
			//console.log(jsondata);
			
			var saveData = jsondata

			DataLogger.insertMany(saveData, function(err) {
				if (err){
					console.log('MongoDB has error', err.message)
				}
			});
		}catch(err){
			console.log("Error " + err.message);
		}
	} 

	if(packet.topic =='bondek2') 
	{		
		try{
			data = packet.payload.toString();
			jsondata = JSON.parse(data);
			jsondata.created_at = new Date();
			// jsondata.PR = 20;
			// jsondata.status = 'COOLING'
			//console.log(data);
			//console.log(jsondata);
			

			// DataLogger.insertMany(saveData, function(err) {
			// 	if (err){
			// 		console.log('MongoDB has error', err.message)
			// 	}
			// });
			//console.log(jsondata.MO)

			let strPath = 'http://out.lysaghtvietnam.com/v10/inplan/report/'+ jsondata.MO +'/auto/1';
			axios.get(strPath).then(resp => {
				if (resp.data.result == 1) {
					console.log(resp.data);
					jsondata.isSuccessReported = 1

				}else{
					jsondata.isSuccessReported = 0
				}

				saveData = jsondata
				History.insertMany(saveData, function(err) {
					if (err){
						console.log('MongoDB has error', err.message)
					}
				});

			    
			});
		}catch(err){
			console.log("Error " + err.message);
		}
	} 
})
