'use strict';

var authKey;

var randomString = require('randomstring');
var mongoose = require('mongoose');
var Settings = mongoose.model('Settings');

exports.getAuthKey = function() {
    return authKey;
};

exports.initAndPopulateSettings = function() {

    Settings.findOne({}, function(err, task) {
        if(err) {
            console.error("An error occurred whilst trying to initialise the defaults for the settings in the database");
            return;
        }
        if(!task) {
            //This provides 571 bits of security, i.e. more than you will ever need in your lifetime to stop brute force attacks
            var newAuthKey = randomString.generate({
                length: 96,
                charset: 'alphanumeric'
            });

            Settings.findOneAndUpdate({}, {authKey: newAuthKey}, {
                new: true,
                upsert: true
            }, function (err, task) {
                if (err) {
                    console.error("An error occurred whilst trying to initialise the defaults for the settings in the database");
                    return;
                }
                authKey = task.authKey;
                console.log("Settings initialised successfully");
            });
        } else {
            authKey = task.authKey;
            console.log("Settings loaded successfully");
        }
    });
};