"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

const plagasSchema = new _mongoose.Schema({
  name: String,
  imgURL: String,
  description: String,
  damage: String,
  prevention: String
}, {
  timestamp: true,
  versionKey: false
});

var _default = (0, _mongoose.model)('Plagas', plagasSchema);

exports.default = _default;