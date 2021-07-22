import { ROLES } from "../models/Rol"
import User from "../models/User"

export const checkDuplicatedUsernameOrEmail = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username })

        if(user) 
            return res.json({ message: "El usuario ya existe" })

        const email = await User.findOne({ email: req.body.email })
        if(email) 
            return res.json({ message: "El email ya esta registrado" })

        next()
    } catch (error) {
        res.json({ message: error })
    }
}

export const checkRolesExisted = (req, res, next) => {
    if(req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++){
            if(!ROLES.includes(req.body.roles[i])){
                return res.json({ message: `Rol ${req.body.roles[i]} no existe` })
            }
        }
    }
    next()
} 
