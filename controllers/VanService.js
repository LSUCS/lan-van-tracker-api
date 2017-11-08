'use strict';

var SettingsService = require('./SettingsService');
var mongoose = require('mongoose');
var Van = mongoose.model('Van');

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

    Van.findOne({}, {_id:false, status:true}, function(err, task) {
        if(err) {
            res.statusCode = 500;
            res.end(err.message);
            return;
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(task));
    });
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
    });
  } else {
      res.statusCode = 401;
      res.end();
  }
};

exports.setVanStatus = function(args, res, next) {

    if(SettingsService.getAuthKey() === args['AuthKey'].value) {

        var status = args.body.value.status;
        if(status !== "tracking" && status !== "disconnected" && status !== "connected") {
            res.statusCode = 405;
            res.setHeader('Content-Type', 'application/json');
            res.end('{"errorDescription":"Status code was not one of the accepted values (tracking, disconnected or connected)"}');
            return;
        }

        Van.findOneAndUpdate({}, args.body.value, {new: true, upsert: true, projection: {_id:false, status:true}}, function (err, task) {
            if (err) {
                res.statusCode = 500;
                res.end(err.message);
                return;
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(task));
        });
    } else {
        res.statusCode = 401;
        res.end();
    }
};

