/* Magic Mirror
    * Module: MMM-SolarDach
    *
    * By tbbear
    * 
    */

const NodeHelper = require('node_helper');
var request = require('request');

module.exports = NodeHelper.create({
	  
    start: function() {
    	console.log("Starting module: " + this.name);
    },
    
     getSolar: function(url) {
	request({
            url: url,
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body);
		console.log(result);
                this.sendSocketNotification('Solar_RESULT', result);
            }
        });
    },
    
  
    //Subclass socketNotificationReceived received.
    socketNotificationReceived: function(notification, payload) {
    	if(notification === 'CONFIG'){
		this.config = payload;
	    } else if (notification === 'GET_Solar') {
                this.getSolar(payload);
 	    }
         },  
});