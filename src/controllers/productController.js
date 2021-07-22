import Product from '../models/Products'

export const getProducts = async (req, res) => {
    const products = await Product.find()
    return res.json({product:products})
}

export const getProductByName = async (req, res) => {
    const products = await Product.findOne({comercialName : req.params.comercialName})
    res.status(200).json({product:[products]})
}