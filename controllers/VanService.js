'use strict';

var SettingsService = require('./SettingsService');
var mongoose = require('mongoose');
var Van = mongoose.model('Van');

var lastTrackingUpdate = 0;
var tracking = false;

//This will
setInterval(function() {
    console.log("Running task");
    console.log("Tracking Status: " + tracking);
    console.log("Tracking time difference " + (Math.floor(new Date() / 1000) - lastTrackingUpdate));
    if(tracking && (Math.floor(new Date() / 1000) - lastTrackingUpdate) > 60) {
        console.log("Tracking disabled")
        tracking = false;
    }
}, 1000);

exports.getVanLocation = function(args, res, next) {

    Van.findOne({}, {_id:false, latitude:true, longitude:true}, function(err, task) {
        if(err) {
            res.statusCode = 500;
            res.end(err.message);
            return;
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(task));
    });
};

exports.getVanStatus = function(args, res, next) {

    var response = {status: tracking ? "tracking" : "disconnected"};
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response));
};

exports.setVanLocation = function(args, res, next) {

  if(SettingsService.getAuthKey() === args['AuthKey'].value) {

    Van.findOneAndUpdate({}, args.body.value, {new: true, upsert: true, projection: {_id:false, latitude:true, longitude:true}}, function (err, task) {
        if (err) {
            res.statusCode = 500;
            res.end(err.message);
            return;
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(task));
        lastTrackingUpdate = Math.floor(new Date() / 1000);
        tracking = true
    });
  } else {
      res.statusCode = 401;
      res.end();
  }
};

