"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAdmin = exports.verifyToken = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _User = _interopRequireDefault(require("../models/User"));

var _Rol = _interopRequireDefault(require("../models/Rol"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) return res.status(403).json({
    message: "Token no proporcionado"
  });

  try {
    const decoded = _jsonwebtoken.default.verify(token, process.env.SECRET);

    req.userId = decoded.id;
    const user = await _User.default.findById(req.userId, {
      password: 0
    });
    if (!user) return res.status(404).json({
      message: "Usuario no encontrado"
    });
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Sin autorización"
    });
  }
};

exports.verifyToken = verifyToken;

const isAdmin = async (req, res, next) => {
  try {
    const user = await _User.default.findById(req.userId);
    const roles = await _Rol.default.find({
      _id: {
        $in: user.roles
      }
    });

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
    }

    return res.status(403).json({
      message: "Se requiere el rol de administrador"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: error
    });
  }
};

exports.isAdmin = isAdmin;