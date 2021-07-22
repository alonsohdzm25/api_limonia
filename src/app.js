import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'

import pkg from '../package.json'

import { createRoles, createAdmin } from './libs/initialSetup'

import plagasRoutes from './routes/plagas_routes'
import authRoutes from './routes/auth_routes'
import usersRoutes from './routes/user_routes'
import productRoutes from './routes/product_routes'

const app = express()
createRoles()
createAdmin()

//Settings
app.set('pkg', pkg)
app.set("port", process.env.PORT || 4000)
app.set("json spaces", 4)

//Middlewares
const corsOptins = {
    //http://localhost:4000
}
app.use(cors(corsOptins))
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//Rutas de bienvenida
app.get('/', (req, res) => {
    res.json({
        message: "Bienvenido a mi api de plagas de limon persa",
        name: app.get('pkg').name,
        version: app.get('pkg').version,
        description: app.get('pkg').description,
        author: app.get('pkg').author
    })
})

//Rutas
app.use('/api/plagas', plagasRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/user', usersRoutes)
app.use('/api/prohibitedproduct', productRoutes)

export default app;