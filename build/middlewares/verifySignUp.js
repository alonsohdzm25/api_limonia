"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkRolesExisted = exports.checkDuplicatedUsernameOrEmail = void 0;

var _Rol = require("../models/Rol");

var _User = _interopRequireDefault(require("../models/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const checkDuplicatedUsernameOrEmail = async (req, res, next) => {
  try {
    const user = await _User.default.findOne({
      username: req.body.username
    });
    if (user) return res.json({
      message: "El usuario ya existe"
    });
    const email = await _User.default.findOne({
      email: req.body.email
    });
    if (email) return res.json({
      message: "El email ya esta registrado"
    });
    next();
  } catch (error) {
    res.json({
      message: error
    });
  }
};

exports.checkDuplicatedUsernameOrEmail = checkDuplicatedUsernameOrEmail;

const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!_Rol.ROLES.includes(req.body.roles[i])) {
        return res.json({
          message: `Rol ${req.body.roles[i]} no existe`
        });
      }
    }
  }

  next();
};

exports.checkRolesExisted = checkRolesExisted;