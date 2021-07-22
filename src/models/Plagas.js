import { Schema, model } from "mongoose";

const plagasSchema = new Schema({
    name: String,
    imgURL: String,
    description: String,
    damage: String,
    prevention: String
},{
    timestamp: true,
    versionKey: false
})

export default model('Plagas', plagasSchema);