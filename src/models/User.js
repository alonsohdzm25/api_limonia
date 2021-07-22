import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    code: {
        type: String, required: true
    },
    status: {
        type: String, required: true, default: "Sin verificar"
    },
    roles: [{
        ref: "Rol",
        type: Schema.Types.ObjectId
    }]
}, {
    timestamp: true,
    versionKey: false
})

userSchema.statics.encryptPassword = async (password) => { 
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
 }

userSchema.statics.comparePassword = async (password, recivedPassword) => { 
    return await bcrypt.compare(password, recivedPassword)
}

export default model('User', userSchema)