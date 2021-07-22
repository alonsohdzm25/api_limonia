"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAdmin = exports.createRoles = void 0;

var _Rol = _interopRequireDefault(require("../models/Rol"));

var _User = _interopRequireDefault(require("../models/User"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createRoles = async () => {
  try {
    const count = await _Rol.default.estimatedDocumentCount();
    if (count > 0) return;
    const values = await Promise.all([new _Rol.default({
      name: 'user'
    }).save(), new _Rol.default({
      name: 'admin'
    }).save()]);
    console.log(values);
  } catch (err) {
    console.error(err);
  }
};

exports.createRoles = createRoles;

const createAdmin = async () => {
  //Checar si existe algun admin
  const user = await _User.default.findOne({
    email: "admin@limonia.com"
  }); //Obtener id de roles

  const roles = await _Rol.default.find({
    name: {
      $in: ["admin", "user"]
    }
  });

  if (!user) {
    // Crear nuevo admin
    await _User.default.create({
      username: "admin",
      email: "admin@limonia.com",
      password: await _bcryptjs.default.hash("admin", 10),
      code: 1101,
      roles: roles.map(roles => roles._id)
    });
    console.log('Usuario admin creado');
  }
};

exports.createAdmin = createAdmin;