"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deletePlagasById = exports.updatePlagasById = exports.getPlagasByName = exports.getPlagasById = exports.getPlagas = exports.createPlagas = void 0;

var _Plagas = _interopRequireDefault(require("../models/Plagas"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createPlagas = async (req, res) => {
  const {
    name,
    imgURL,
    description,
    damage,
    prevention
  } = req.body;

  try {
    const newPlaga = new _Plagas.default({
      name,
      imgURL,
      description,
      damage,
      prevention
    });
    const plagaSave = await newPlaga.save();
    res.status(201).json(plagaSave);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

exports.createPlagas = createPlagas;

const getPlagas = async (req, res) => {
  const plagas = await _Plagas.default.find();
  return res.json({
    plagas: plagas
  });
};

exports.getPlagas = getPlagas;

const getPlagasById = async (req, res) => {
  const plagas = await _Plagas.default.findById(req.params.plagasId);
  res.status(200).json(plagas);
};

exports.getPlagasById = getPlagasById;

const getPlagasByName = async (req, res) => {
  const plagas = await _Plagas.default.findOne({
    name: req.params.name
  });
  res.status(200).json(plagas);
};

exports.getPlagasByName = getPlagasByName;

const updatePlagasById = async (req, res) => {
  const updatedPlaga = await _Plagas.default.findByIdAndUpdate(req.params.plagasId, req.body, {
    new: true
  });
  res.status(204).json(updatedPlaga);
};

exports.updatePlagasById = updatePlagasById;

const deletePlagasById = async (req, res) => {
  await _Plagas.default.findByIdAndDelete(req.params.plagasId);
  res.status(204).json();
};

exports.deletePlagasById = deletePlagasById;