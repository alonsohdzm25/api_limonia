"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _cors = _interopRequireDefault(require("cors"));

var _helmet = _interopRequireDefault(require("helmet"));

var _package = _interopRequireDefault(require("../package.json"));

var _initialSetup = require("./libs/initialSetup");

var _plagas_routes = _interopRequireDefault(require("./routes/plagas_routes"));

var _auth_routes = _interopRequireDefault(require("./routes/auth_routes"));

var _user_routes = _interopRequireDefault(require("./routes/user_routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express.default)();
(0, _initialSetup.createRoles)();
(0, _initialSetup.createAdmin)(); //Settings

app.set('pkg', _package.default);
app.set("port", process.env.PORT || 4000);
app.set("json spaces", 4); //Middlewares

const corsOptins = {//http://localhost:4000
};
app.use((0, _cors.default)(corsOptins));
app.use((0, _helmet.default)());
app.use((0, _morgan.default)('dev'));
app.use(_express.default.json());
app.use(_express.default.urlencoded({
  extended: false
})); //Rutas de bienvenida

app.get('/', (req, res) => {
  res.json({
    message: "Bienvenido a mi api de plagas de limon persa",
    name: app.get('pkg').name,
    version: app.get('pkg').version,
    description: app.get('pkg').description,
    author: app.get('pkg').author
  });
}); //Rutas

app.use('/api/plagas', _plagas_routes.default);
app.use('/api/auth', _auth_routes.default);
app.use('/api/user', _user_routes.default);
var _default = app;
exports.default = _default;