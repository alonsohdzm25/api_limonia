"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const userSchema = new _mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: "Sin verificar"
  },
  roles: [{
    ref: "Rol",
    type: _mongoose.Schema.Types.ObjectId
  }]
}, {
  timestamp: true,
  versionKey: false
});

userSchema.statics.encryptPassword = async password => {
  const salt = await _bcryptjs.default.genSalt(10);
  return await _bcryptjs.default.hash(password, salt);
};

userSchema.statics.comparePassword = async (password, recivedPassword) => {
  return await _bcryptjs.default.compare(password, recivedPassword);
};

var _default = (0, _mongoose.model)('User', userSchema);

exports.default = _default;