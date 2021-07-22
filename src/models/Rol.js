import { Schema, model } from "mongoose";

export const ROLES = ["user","admin"]

const rolSchema = new Schema({
    name: String
}, {
    versionKey: false
})

export default model('Rol', rolSchema)