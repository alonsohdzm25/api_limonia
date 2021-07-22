"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.confirm = exports.signIn = exports.signUp = void 0;

var _User = _interopRequireDefault(require("../models/User"));

var _Rol = _interopRequireDefault(require("../models/Rol"));

var _bson = require("bson");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _uuid = require("uuid");

var _mail_config = require("../mail/mail_config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const signUp = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      roles
    } = req.body;
    const randomCode = (0, _uuid.v4)();
    const newUser = new _User.default({
      username,
      email,
      password: await _User.default.encryptPassword(password),
      code: randomCode
    });

    if (roles) {
      const foundRoles = await _Rol.default.find({
        name: {
          $in: roles
        }
      });
      newUser.roles = foundRoles.map(roles => roles._id);
    } else {
      const roles = await _Rol.default.findOne({
        name: "user"
      });
      newUser.roles = [roles._id];
    }

    const savedUser = await newUser.save();

    const token = _jsonwebtoken.default.sign({
      id: savedUser._id,
      code: randomCode
    }, process.env.SECRET, {
      expiresIn: 86400 //24 horas

    }); //Obtener template


    const template = (0, _mail_config.getTemplate)(username, token); //Enviar email

    await (0, _mail_config.sendEmail)(email, template);
    return res.json({
      token
    });
  } catch (error) {
    console.log(error);
    return res.json({
      message: `A ocurrudo un error: ${error}`
    });
  }
};

exports.signUp = signUp;

const signIn = async (req, res) => {
  try {
    const userFound = await _User.default.findOne({
      email: req.body.email
    }).populate("roles");
    if (!userFound) return res.json({
      message: "Usuario no encontrado"
    });
    const matchPassword = await _User.default.comparePassword(req.body.password, userFound.password);
    if (!matchPassword) return res.json({
      token: null,
      message: 'Contraseña invalida'
    });

    const token = _jsonwebtoken.default.sign({
      id: userFound._id
    }, process.env.SECRET, {
      expiresIn: 86400
    });

    res.json({
      token
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: `Ah ocurrido un error ${error}`
    });
  }
};

exports.signIn = signIn;

const confirm = async (req, res) => {
  try {
    //Obtener el token
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
      id,
      code
    } = data; //Buscar si existe el usuario

    const user = (await _User.default.findOne((0, _bson.ObjectId)(id))) || null;
    console.log(user);

    if (user === null) {
      return res.json({
        message: "Usuario no encontrado"
      });
    } //Verificar email


    if (code !== user.code) {
      return res.json({
        message: "El codigo no coincide con el registrado"
      });
    } //Actualizar usuario


    user.status = "Verificado";
    await user.save(); //Redireccionar a la confirmación

    return res.json({
      message: "Correo confirmado exitosamente"
    });
  } catch (error) {
    console.log(error);
    return res.json({
      message: `Error al confirmar usuario: ${error}`
    });
  }
};

exports.confirm = confirm;