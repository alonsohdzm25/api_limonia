import User from '../models/User'
import Rol from '../models/Rol'
import { ObjectId } from 'bson'

import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

import { getTemplate, getTemplatePassword, recoveryPassword, sendEmail} from '../mail/mail_config'



export const signUp = async (req, res) => {
    try {
        const { username, email, password, roles } = req.body

        const randomCode = uuidv4();

        const newUser = new User({
            username,
            email,
            password: await User.encryptPassword(password),
            code: randomCode
        })

        if (roles) {
            const foundRoles = await Rol.find({ name: { $in: roles }})
            newUser.roles = foundRoles.map(roles => roles._id)
        } else {
            const roles = await Rol.findOne({ name: "user" })
            newUser.roles = [ roles._id ]
        }        

        const savedUser = await newUser.save()

        const token = jwt.sign({ id: savedUser._id, code: randomCode }, process.env.SECRET, {
            expiresIn: 86400 //24 horas
        })
        //Obtener template
        const template = getTemplate(username, token)
        //Enviar email
        await sendEmail(email,template)

        return res.json({ success: "true",token: token, message: "Registro exitoso" })

    } catch (error) {
        console.log(error)
        return res.json({ success: "false", token: null, message: `Error: ${error}`})
    }

    

}
export const signIn = async (req, res) => {   
    try {
        const userFound = await User.findOne({ email: req.body.email }).populate("roles")

        if(!userFound) return res.json({ success: "false", token:null, message: "No existe ningun usuario con ese correo electronico" })
        
        const matchPassword = await User.comparePassword(
            req.body.password, 
            userFound.password
            )

        if(!matchPassword) 
            return res.json({
                success: "false",
                token:null, 
                message:'Contraseña invalida'
            })

        const token = jwt.sign({ id: userFound._id}, process.env.SECRET, {
            expiresIn: 86400
        })

        res.json({ success: "true", token: token, message: "Inicio de sesion correcto" })
    } catch (error) {
        console.log(error)
        res.json({
            success: "false",
            token:null,
            message: `Ah ocurrido un error ${error}`
        })
        
    }
    
}

export const confirm = async (req, res) => {
    try {
        //Obtener el token
        const { token } = req.params
        //Verificar la data
        const data = jwt.verify(token, process.env.SECRET, (error, decoded) => {
            if (error) {
                success: "false",
                console.log("Error al obtener data del token")
            } else {
                return decoded
            }
        })

        if(data === null) {
            return res.json({
                success: "false",
                message:"Error al obtener data"
            })
        }

        const {id, code} = data

        //Buscar si existe el usuario
        const user  = await User.findOne(ObjectId(id)) || null
        console.log(user)
        if (user === null) {
            return res.json({
                success: "false",
                message: "Usuario no encontrado"
            })
        }
        //Verificar email
        if(code !== user.code) {
            return res.json({
                success: "false",
                message: "El codigo no coincide con el registrado"
            })
        }

        //Actualizar usuario
        user.status = "Verificado"
        await user.save()

        //Redireccionar a la confirmación
        return res.sendFile('/app/src/public/verify.html')


    } catch (error) {
        console.log(error)
        return res.sendFile('/app/src/public/error.html')
    }
}

export const resendEmail = async (req, res) => {
    try {
        const userFound = await User.findOne({ email: req.body.email }).populate("roles")
        if(!userFound) return res.json({ success: "false", message: "No existe ningun usuario con ese correo electronico" })


        const token = jwt.sign({ id: userFound._id, code: userFound.code }, process.env.SECRET, {
            expiresIn: 86400 //24 horas
        })

        const template = getTemplate(userFound.username, token)
        await sendEmail(userFound.email, template)

        return res.json({ success: "true", message:"Email enviado correctamente" })

    } catch ( error ) {
        console.log(error)
        res.json({
            success: "false",
            message: "Error al enviar el codigo de recuperacion de contraseña"
        })
    }
}

export const repairPassword = async (req, res) => {
    try {
        const userFound = await User.findOne({ email: req.body.email }).populate("roles")
        if(!userFound) return res.json({ success: "false", message: "No existe ningun usuario con ese correo electronico" })


        const token = jwt.sign({ id: userFound._id }, process.env.SECRET, {
            expiresIn: 86400 //24 horas
        })

        const template = getTemplatePassword(userFound.username, token)
        await recoveryPassword(userFound.email, template)

        return res.json({ success: "true", message:"Email enviado correctamente" })

    } catch ( error ) {
        console.log(error)
        res.json({
            success: "false",
            message: "Error al enviar el codigo de recuperacion de contraseña"
        })
    }
}