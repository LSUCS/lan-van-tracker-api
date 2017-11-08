'use strict';

var url = require('url');

var Van = require('./VanService');

module.exports.getVanLocation = function getVanLocation (req, res, next) {
  Van.getVanLocation(req.swagger.params, res, next);
};

module.exports.getVanStatus = function getVanStatus (req, res, next) {
  Van.getVanStatus(req.swagger.params, res, next);
};

module.exports.setVanLocation = function setVanLocation (req, res, next) {
  Van.setVanLocation(req.swagger.params, res, next);
};

module.exports.setVanStatus = function setVanStatus (req, res, next) {
  Van.setVanStatus(req.swagger.params, res, next);
};
