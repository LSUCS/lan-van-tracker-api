'use strict';

var url = require('url');

var Dropups = require('./DropupsService');

module.exports.getCurrentDropup = function getCurrentDropup (req, res, next) {
  Dropups.getCurrentDropup(req.swagger.params, res, next);
};

module.exports.getDropUps = function getDropUps (req, res, next) {
  Dropups.getDropUps(req.swagger.params, res, next);
};

module.exports.setCurrentDropup = function setCurrentDropup (req, res, next) {
  Dropups.setCurrentDropup(req.swagger.params, res, next);
};

module.exports.setDropUps = function setDropUps (req, res, next) {
  Dropups.setDropUps(req.swagger.params, res, next);
};
