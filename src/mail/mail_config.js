import nodemailer from 'nodemailer';

const mail = {
    user: 'limonia_org@hotmail.com',
    pass: 'AcaroBlanco123'
}

let transporter = nodemailer.createTransport({
    host: "outlook.office365.com",
    port: 587,
    tls: {
        rejectUnathorized: false
    },
    secure: false, // true for 465, false for other ports
    auth: {
      user: mail.user, // generated ethereal user
      pass: mail.pass, // generated ethereal password
    },
  });

  export const sendEmail = async (email, html) => {
    try {
        await transporter.sendMail({
            from: `LimonIA <${mail.user}>`, // sender address
            to: email, // list of receivers
            subject: "Confirma tu cuenta en LimonIA", // Subject line
            text: "Hola estimado usuario, gracias por registrarte en nuestra aplicación móvil", // plain text body
            html // html body
          })     
    } catch (error) {
        console.log("Algo no va bien con el email",error)
    }
  }

  export const recoveryPassword = async (email, html) => {
    try {
        await transporter.sendMail({
            from: `LimonIA <${mail.user}>`, // sender address
            to: email, // list of receivers
            subject: "Recuperación de contraseña", // Subject line
            text: "Hola estimado usuario, da clic en el siguiente enlace para restaurar tu contraseña", // plain text body
            html // html body
          })     
    } catch (error) {
        console.log("Algo no va bien con el email",error)
    }
  }

  export const getTemplate = (username, token) => {
    return `
    <html>
        <head>
            <title>Confirmacion de correo electronico</title>
        </head>
        <body>
            <div id="img-container">
                <img src="https://firebasestorage.googleapis.com/v0/b/limonia-37fd9.appspot.com/o/limonia_app%2Ficon.png?alt=media&token=1d315345-2b20-406c-8674-0cc208eacad5" alt="">
                <h1>Bienvenido/a ${ username }</h1>
            </div>
            <div id="div-message">
                <p>Para confirmar tu cuenta por favor ingresa al siguiente enlace</p>
                <a
                    href="https://limonia.herokuapp.com/api/auth/confirm/${ token }"
                    target="_blank"
                >Confirmar Cuenta</a>
            </div>
        </body>

        <style>
            * {
                font-family: monospace, sans-serif;;
            }

            html {
                font-size: 16sp;
            }

            #img-container {
                text-align: center;
            }

            #img-container img {
                width: 100px;
                height: 100px;
            }

            #div-message {
                text-align: center
            }

        </style>

    </html>
    `
}

export const getTemplatePassword = (username, token) => {
    return `
    <html>
        <head>
            <title>Recuperación de contraseña</title>
        </head>
        <body>
            <div id="img-container">
                <img src="https://firebasestorage.googleapis.com/v0/b/limonia-37fd9.appspot.com/o/limonia_app%2Ficon.png?alt=media&token=1d315345-2b20-406c-8674-0cc208eacad5" alt="">
                <h1>Estimado/a ${ username }</h1>
            </div>
            <div id="div-message">
                <p>Para restaurar su contraseña por favor ingresa al siguiente enlace</p>
                <a
                    href="https://limonia.herokuapp.com/api/auth/recoverypassword/${ token }"
                    target="_blank"
                >Recuperar Contraseña</a>
            </div>
        </body>

        <style>
            * {
                font-family: monospace, sans-serif;;
            }

            html {
                font-size: 16sp;
            }

            #img-container {
                text-align: center;
            }

            #img-container img {
                width: 100px;
                height: 100px;
            }

            #div-message {
                text-align: center
            }

        </style>

    </html>
    `
}

