import mongoose from 'mongoose'

mongoose
    .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
    .then(db => console.log("Base de datos conectada"))
    .catch(err => console.log(err))