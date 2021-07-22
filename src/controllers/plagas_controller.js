import Plagas from '../models/Plagas'

export const createPlagas = async (req, res) => {
    
    const {name,imgURL, description,damage,prevention} = req.body
    
    try {
        const newPlaga = new Plagas({ 
            name,
            imgURL,
            description,
            damage,
            prevention
        })
    
        const plagaSave = await newPlaga.save()
    
        res.status(201).json(plagaSave)
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
    
}

export const getPlagas = async (req, res) => {
    const plagas = await Plagas.find()
    return res.json({plagas:plagas})
}

export const getPlagasById = async (req, res) => {
    const plagas = await Plagas.findById(req.params.plagasId)
    res.status(200).json({plagas:[plagas]})
}

export const getPlagasByName = async (req, res) => {
    const plagas = await Plagas.findOne({name : req.params.name})
    res.status(200).json({plagas:[plagas]})
}

export const updatePlagasById = async (req, res) => {
    const updatedPlaga = await Plagas.findByIdAndUpdate(req.params.plagasId, req.body, {
        new: true
    })
    res.status(204).json(updatedPlaga)
}

export const deletePlagasById = async (req, res) => {
   await Plagas.findByIdAndDelete(req.params.plagasId)
   res.status(204).json()
}

