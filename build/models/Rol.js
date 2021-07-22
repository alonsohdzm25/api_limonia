"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ROLES = void 0;

var _mongoose = require("mongoose");

const ROLES = ["user", "admin"];
exports.ROLES = ROLES;
const rolSchema = new _mongoose.Schema({
  name: String
}, {
  versionKey: false
});

var _default = (0, _mongoose.model)('Rol', rolSchema);

exports.default = _default;