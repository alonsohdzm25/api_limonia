import User from "../models/User"
import Rol from "../models/Rol"
import { ObjectId } from "bson"
import jwt from 'jsonwebtoken'

export const createUser = async (req, res) => {
    try {
        const { username, email, password, roles } = req.body

        const rolesFound = await Rol.find({ name: { $in: roles } })

        //Crear nuevo usuario
        const user = new User({
            username,
            email,
            password,
            roles: rolesFound.map((roles) => roles._id)
        })

        //Encriptar contraseña
        user.password = await User.encryptPassword(user.password)

        //Guardando el nuevo usuario
        const savedUser = await user.save()

        return res.json({
            _id: savedUser._id,
            username: savedUser.email,
            email: savedUser.email,
            roles: savedUser.roles
        })

    } catch (error) {
        console.log(error)
        res.json({ message:`Error al crear usuario: ${error}` })
    }
}

export const getUsers = async (req, res) => {
    try {
        const users = await User.find()
        return res.json(users)
    } catch (error) {
        res.json({message: `Error: ${ error }`})
    }
}

export const getUser = async (req, res) => {
    try {

        const { token } = req.params
        //Verificar la data
        const data = jwt.verify(token, process.env.SECRET, (error, decoded) => {
            if (error) {
                console.log("Error al obtener data del token")
            } else {
                return decoded
            }
        })

        if(data === null) {
            return res.json({
                message:"Error al obtener data"
            })
        }

        const {id} = data

        const user = await User.findOne(ObjectId(id))
        res.json(user)
    } catch (error) {
        res.json({message: `Error: ${ error }`})
    }
}

export const updateUser = async (req, res) => {
    try {

        const { token } = req.params
        //Verificar la data
        const data = jwt.verify(token, process.env.SECRET, (error, decoded) => {
            if (error) {
                console.log("Error al obtener data del token")
            } else {
                return decoded
            }
        })

        if(data === null) {
            return res.json({
                success: "false",
                message:"Error al decodificar el token de usuario"
            })
        }

        const {id} = data

        const userFound = await User.findOne(ObjectId(id))

        userFound.password = await User.encryptPassword(req.body.newPassword)

        await User.findOneAndUpdate({_id:ObjectId(id)}, userFound , {
            new: true
        })
        res.json({
            success: "true",
            message: "Contraseña actualizada"
        })
    } catch (error) {
        res.json({success:"false", message: `Error: ${ error }`})
    }
}

export const deleteUser = async (req, res) => {
   try {

        const { token } = req.params
        //Verificar la data
        const data = jwt.verify(token, process.env.SECRET, (error, decoded) => {
            if (error) {
                console.log("Error al obtener data del token")
            } else {
                return decoded
            }
        })

        if(data === null) {
            return res.json({
                message:"Error al obtener data"
            })
        }

        const {id} = data

        await User.findOneAndDelete({ id: ObjectId(id) })
        res.json({
            message: "Cuenta eliminada con exito"
        })
   } catch (error) {
       res.json({message: `Error: ${ error }`})
   }
}