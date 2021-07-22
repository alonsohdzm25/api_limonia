import Rol from '../models/Rol'
import User from '../models/User'

import bcrypt from 'bcryptjs'

export const createRoles = async () => {
    try{
    const count = await Rol.estimatedDocumentCount()

    if (count > 0) return

    const values = await Promise.all([
        new Rol({ name: 'user' }).save(),
        new Rol({ name: 'admin' }).save()
    ])

    console.log(values)
    } catch (err) {
        console.error(err)
    }
}

export const createAdmin = async () => {
    //Checar si existe algun admin
    const user = await User.findOne({ email: "admin@limonia.com" })
    //Obtener id de roles
    const roles = await Rol.find({ name: { $in: ["admin", "user"] } })

    if(!user) {
        // Crear nuevo admin
        await User.create({ 
            username: "admin",
            email: "admin@limonia.com",
            password: await bcrypt.hash("admin",10),
            code: 1101,
            roles: roles.map((roles) => roles._id)
        })
        console.log('Usuario admin creado')
    }

}