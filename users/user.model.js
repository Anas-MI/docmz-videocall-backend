const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Schema Model
const schema = new Schema({
  email: { type: String, unique: true },
  role: { type: String },
  name: { type: String },
  phone: { type: String },
  home: { type: String },
  work: { type: String },
  preferredNumber: { type: String },
  Address: { type: Object },
  sex: { type: String },
  dob: { type: String },
  active: { type: Boolean },
  wellnessReminder: { type: Boolean },
  appointmentReminderText: { type: Boolean },
  notify: { type: Boolean },
  race: { type: Array },
  ethnicity: { type: String },
  zip: { type: String },
  password: { type: String },
  passwordtoken: { type: String },
  verified: { type: Boolean },
  passwordexpires: { type: Date },
  createdDate: { type: Date, default: Date.now },
  appointments: [{ type: Schema.Types.ObjectId, ref: "Appointments" }],
  lastLogin: { type: Date, default: Date.now },
  bloodGroup: { type: String },
  customerProfile: { type: String }
});

//Exporting the schema
module.exports = mongoose.model("Patient", schema);
