const npiController = require("../doctor/practice.controller");
const doctorController = require("../doctor/doctor.controller");
const express = require("express");
const router = express.Router();
const db = require("_helpers/db");
const Practise = db.Practise;
// Fetch info about an doctor through a NPI Number
router.get("/getInfo/:npi", npiController.getNpiInfo);

//Upload Doctors to the database through a list of NPI
router.get("/upload", npiController.addDoctors);

//Get all the doctors
router.get("/get", npiController.getAllDoctors);

//Get all procedures
router.get("/get/procedures", doctorController.getProcedures);

//Add all Procedures
router.get("/upload/procedures", doctorController.addProcedures);

//Upload Specialties
router.get("/upload/specialties", doctorController.addSpecialities);

//Get Specialities
router.get("/get/specialties", doctorController.getSpecialty);

//register a Doctor
router.post("/register", npiController.signUpDoc);

//Authenticate a doctor
router.post("/authenticate", npiController.authenticateDoctor);

//Update Doctors profile
router.post("/profile/update", npiController.profileUpdate);

//Create and save slots
router.post("/saveslots", npiController.saveSlots);

//Get a doctor through id
router.get("/getdoc/:id", npiController.getDoc);

//Search Doctors
router.post("/search", npiController.searchDocs);

//Upload picture

const multer = require("multer");
const path = require("path");
//Multer storage route
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/uploads");
  },
  filename: (req, file, cb) => {
    let filename = file.originalname.split(".")[0];
    cb(null, filename + "-" + Date.now() + path.extname(file.originalname));
  }
});

let upload = multer({
  storage: storage,
  fileFilter: function(req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg" && ext !== ".pdf") {
      req.fileValidationError = "Forbidden extension";
      return callback(null, false, req.fileValidationError);
    }
    callback(null, true);
  },
  limits: {
    fileSize: 420 * 150 * 200
  }
});

//Uplaod a picture to doctors profile
router.post("/upload/:id", upload.any(), (req, res) => {
  console.log(req.files);

  if (req.files) {
    let { id } = req.params;
    Practise.findOneAndUpdate(
      id,
      { $push: { picture: req.files[0].path } },
      { new: true }
    )
      .then(data => {
        res
          .status(200)
          .json({ status: true, message: "Image uploaded successfully", data });
      })
      .catch(error => {
        res.status(200).json({ status: false, message: error });
      });
  }
});

//Delete a Picture
router.post("/picture/delete", (req, res) => {
  let { id, query } = req.body;

  Practise.findOneAndUpdate(id, { $pull: { picture: query } }, { new: true })
    .then(data => {
      res
        .status(200)
        .json({ status: true, message: "Image deleted successfully", data });
    })
    .catch(error => {
      res.status(200).json({ status: false, message: error });
    });
});

// exporting them
module.exports = router;
