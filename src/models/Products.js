import { Schema, model } from "mongoose";

const productSchema = new Schema({
    comercialName: String,
    ingredienteActivo: String
},{
    timestamp: true,
    versionKey: false
})

export default model('Product', productSchema);