const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let specialties2 = new Schema({
  procedure_name: { type: String },
  name: { type: String },
  speciality_id: { type: String, unique: true },
  popular: { type: Boolean, default: false },
  default_procedure_id: { type: Number }
});

module.exports = mongoose.model("Specialties2", specialties2);
