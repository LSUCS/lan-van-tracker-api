/*jslint node:true, es5:true, nomen: true, plusplus: true */
/*globals module */
/*globals require */


//limit the scope
(function(){
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var van = new Schema({
        latitude        : {type : Number},
        longitude       : {type : Number},
        currentDropUpId : {type : Number}
    });

    var dropup = new Schema({
        id                  : {type : Number},
        address             : {type : String},
        time                : {type : String},
        people: [{
            name            : {type : String},
            phonenumber     : {type : String}
        }]
    });

    var settings = new Schema({
        authKey : {type : String}
    });

    module.exports.Van      = mongoose.model('Van', van);
    module.exports.DropUp   = mongoose.model('DropUp', dropup);
    module.exports.Settings = mongoose.model('Settings', settings);

    module.exports.getId = function (id) {
        "use strict";
        try {
            return mongoose.Types.ObjectId(id);
        } catch (ex) {
            console.log(ex);
            return null;
        }
    };
}());