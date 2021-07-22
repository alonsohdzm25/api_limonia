import jwt from 'jsonwebtoken'

import User from '../models/User'
import Rol from '../models/Rol'

export const verifyToken = async (req, res, next) => {
    let token = req.headers["x-access-token"]

    if (!token) return res.status(403).json({ message: "Token no proporcionado" })
    try {
        const decoded = jwt.verify(token, process.env.SECRET)
        req.userId = decoded.id
        
        const user = await User.findById(req.userId, {password: 0})
        if(!user) return res.status(404).json({ message: "Usuario no encontrado"})

        next()
    } catch (error) {
        return res.status(401).json({ message: "Sin autorización"})
    }
}

export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId)
        const roles = await Rol.find({ _id: { $in: user.roles } })

        for (let i = 0; i < roles.length; i++) {
            if(roles[i].name === "admin") {
                next()
                return
            }
        }

    return res.status(403).json({ message: "Se requiere el rol de administrador" })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: error })
    }

}


