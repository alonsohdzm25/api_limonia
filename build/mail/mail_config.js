"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTemplate = exports.sendEmail = void 0;

var _nodemailer = _interopRequireDefault(require("nodemailer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const mail = {
  user: 'limonia_org@hotmail.com',
  pass: 'AcaroBlanco123'
};

let transporter = _nodemailer.default.createTransport({
  host: "outlook.office365.com",
  port: 587,
  tls: {
    rejectUnathorized: false
  },
  secure: false,
  // true for 465, false for other ports
  auth: {
    user: mail.user,
    // generated ethereal user
    pass: mail.pass // generated ethereal password

  }
});

const sendEmail = async (email, html) => {
  try {
    await transporter.sendMail({
      from: `LimonIA <${mail.user}>`,
      // sender address
      to: email,
      // list of receivers
      subject: "Confirma tu cuenta en LimonIA",
      // Subject line
      text: "Hola estimado usuario, gracias por registrarte en nuestra aplicación móvil",
      // plain text body
      html // html body

    });
  } catch (error) {
    console.log("Algo no va bien con el email", error);
  }
};

exports.sendEmail = sendEmail;

const getTemplate = (username, token) => {
  return `
        <head>
         <link rel="stylesheet" href="./style.css">
        </head>
        
        <div id="email___content" text-align="center">
            <img width="100px" src="https://image.flaticon.com/icons/png/512/2917/2917995.png" alt="">
            <h2>Hola ${username}</h2>
            <p>Para confirmar tu cuenta, ingresa al siguiente enlace</p>
            <a
                href="https://limonia.herokuapp.com/api/auth/confirm/${token}"
                target="_blank"
            >Confirmar Cuenta</a>
        </div>
    `;
};

exports.getTemplate = getTemplate;