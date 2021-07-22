"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteUser = exports.updateUser = exports.getUser = exports.getUsers = exports.createUser = void 0;

var _User = _interopRequireDefault(require("../models/User"));

var _Rol = _interopRequireDefault(require("../models/Rol"));

var _bson = require("bson");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createUser = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      roles
    } = req.body;
    const rolesFound = await _Rol.default.find({
      name: {
        $in: roles
      }
    }); //Crear nuevo usuario

    const user = new _User.default({
      username,
      email,
      password,
      roles: rolesFound.map(roles => roles._id)
    }); //Encriptar contraseña

    user.password = await _User.default.encryptPassword(user.password); //Guardando el nuevo usuario

    const savedUser = await user.save();
    return res.json({
      _id: savedUser._id,
      username: savedUser.email,
      email: savedUser.email,
      roles: savedUser.roles
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: `Error al crear usuario: ${error}`
    });
  }
};

exports.createUser = createUser;

const getUsers = async (req, res) => {
  try {
    const users = await _User.default.find();
    return res.json(users);
  } catch (error) {
    res.json({
      message: `Error: ${error}`
    });
  }
};

exports.getUsers = getUsers;

const getUser = async (req, res) => {
  try {
    const {
      token
    } = req.params; //Verificar la data

    const data = _jsonwebtoken.default.verify(token, process.env.SECRET, (error, decoded) => {
      if (error) {
        console.log("Error al obtener data del token");
      } else {
        return decoded;
      }
    });

    if (data === null) {
      return res.json({
        message: "Error al obtener data"
      });
    }

    const {
      id
    } = data;
    const user = await _User.default.findOne((0, _bson.ObjectId)(id));
    res.json(user);
  } catch (error) {
    res.json({
      message: `Error: ${error}`
    });
  }
};

exports.getUser = getUser;

const updateUser = async (req, res) => {
  try {
    const {
      token
    } = req.params; //Verificar la data

    const data = _jsonwebtoken.default.verify(token, process.env.SECRET, (error, decoded) => {
      if (error) {
        console.log("Error al obtener data del token");
      } else {
        return decoded;
      }
    });

    if (data === null) {
      return res.json({
        message: "Error al obtener data"
      });
    }

    const {
      id
    } = data;
    const userFound = await _User.default.findOne((0, _bson.ObjectId)(id));
    const matchPassword = await _User.default.comparePassword(req.body.password, userFound.password);

    if (!matchPassword) {
      return res.json({
        message: 'Contraseña incorrecta'
      });
    }

    userFound.password = await _User.default.encryptPassword(req.body.newPassword);
    const updatedUser = await _User.default.findOneAndUpdate({
      _id: (0, _bson.ObjectId)(id)
    }, userFound, {
      new: true
    });
    res.json(updatedUser);
  } catch (error) {
    res.json({
      message: `Error: ${error}`
    });
  }
};

exports.updateUser = updateUser;

const deleteUser = async (req, res) => {
  try {
    const {
      token
    } = req.params; //Verificar la data

    const data = _jsonwebtoken.default.verify(token, process.env.SECRET, (error, decoded) => {
      if (error) {
        console.log("Error al obtener data del token");
      } else {
        return decoded;
      }
    });

    if (data === null) {
      return res.json({
        message: "Error al obtener data"
      });
    }

    const {
      id
    } = data;
    await _User.default.findOneAndDelete({
      id: (0, _bson.ObjectId)(id)
    });
    res.json({
      message: "Cuenta eliminada con exito"
    });
  } catch (error) {
    res.json({
      message: `Error: ${error}`
    });
  }
};

exports.deleteUser = deleteUser;