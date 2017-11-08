'use strict';

var SettingsService = require('./SettingsService');
var mongoose = require('mongoose');
var parse = require('csv-parse');
var Van = mongoose.model('Van');
var DropUp = mongoose.model('DropUp');

exports.getCurrentDropup = function(args, res, next) {
    Van.findOne({}, {_id:false, currentDropUpId:true}, function(err, task) {
        if(err) {
            res.statusCode = 500;
            res.end(err.message);
            return;
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(task));
    });
};

exports.getDropUps = function(args, res, next) {

    var query;

    if(SettingsService.getAuthKey() === args['AuthKey'].value) {
        query = DropUp.find({}, {_id: false, __v: false, 'people._id': false}).sort({id: 1})
    } else {
        query = DropUp.find({}, {_id: false, 'people.name': true, time: true, id: true}).sort({id: 1});
    }

    query.exec(function (err, task) {
        if (err) {
            res.statusCode = 500;
            res.end(err.message);
            return;
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(task));
    });
};

exports.setCurrentDropup = function(args, res, next) {

    if(SettingsService.getAuthKey() === args['AuthKey'].value) {

        Van.findOneAndUpdate({}, args.body.value, {
            new: true,
            upsert: true,
            projection: {_id: false, currentDropUpId: true}
        }, function (err, task) {
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

exports.setDropUps = function(args, res, next) {

    if(SettingsService.getAuthKey() === args['AuthKey'].value) {

        var dropups = [];
        parse(args.file.value.buffer.toString(), function (err, output) {
            var dropup = {};
            var people = [];
            var id = 0;
            for (var i = 1; i < output.length; ++i) {
                dropup['id'] = id++;
                dropup['address'] = output[i][2];
                dropup['time'] = output[i][3];
                people.push({name: output[i][0], phonenumber: output[i][1]});
                for (var j = i + 1; j < output.length; ++j) {
                    if (!output[j][2] || !output[j][3]) {
                        people.push({name: output[j][0], phonenumber: output[j][1]});
                        //This stops the last element being added twice if it has no address or time
                        //(i.e. an extra person at a dropup point)
                        if (j === (output.length - 1)) {
                            i = j;
                        }
                    } else {
                        i = j - 1;
                        break;
                    }
                }

                dropup['people'] = people;

                dropups.push(dropup);

                dropup = {};
                people = [];
            }
        });

        DropUp.remove({}, function (err, task) {
            if (err) {
                res.statusCode = 500;
                res.end(err.message);
                return;
            }

            DropUp.create(dropups, function (err, task) {
                if (err) {
                    res.statusCode = 500;
                    res.end(err.message);
                    return;
                }

                DropUp.find({}, {
                    _id: false,
                    __v: false,
                    'people._id': false
                }).sort({id: 1}).exec(function (err, task) {
                    if (err) {
                        res.statusCode = 500;
                        res.end(err.message);
                        return;
                    }
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(task));
                });
            });
        });
    } else {
        res.statusCode = 401;
        res.end();
    }
};