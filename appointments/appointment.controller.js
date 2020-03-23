const db = require("_helpers/db"),
  express = require("express"),
  app = express(),
  Practise = db.Practise;
Appointment = db.Appointment;
Patient = db.User;
let moment = require("moment");
let nodemailer = require("nodemailer");
let ejs = require("ejs");
//SMTP Config
let smtpConfig = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL,
  // you can try with TLS, but port is then 587
  auth: {
    user: "anas3rde@gmail.com", // Your email id
    pass: "8123342590" // Your password
  },
  tls: {
    rejectUnauthorized: false
  }
};

//Read html file for - Appointment Approved

let fs = require("fs"),
  path = require("path"),
  filePath = path.join(__dirname, "/appointmentConfirmed.html");
console.log({ filePath });
let template = fs.readFileSync(filePath, { encoding: "utf-8" });

//Book an appointment
let bookAppointment = (req, res) => {
  let { patient, transactionId, timeSlot, practise } = req.body;

  Appointment.findByIdAndUpdate(
    timeSlot,
    {
      $set: {
        ...req.body,
        booked: true,
        paid: true
      }
    },
    { new: true }
  ).then(data => {
    Patient.findByIdAndUpdate(patient, { $push: { appointments: data._id } })
      .then(doctor => {
        Practise.findByIdAndUpdate(practise, {
          $push: { appointments: data._id }
        })
          .then(patient => {
            res
              .status(200)
              .json({ status: true, message: "Appointment Booked" });
          })
          .catch(error => {
            res.status(404).json({ status: false, message: error });
          });
      })
      .catch(err => {
        res.status(404).json({ status: false, message: err });
      });
  });
};

//Confirm appointment
let approveAppointment = (req, res) => {
  let { timeSlot, email, patient, time, date, address, doctor } = req.body;
  let fields = {
    patient,
    time,
    date,
    address,
    doctor
  };

  let html = ejs.render(template, fields);

  // console.log({html})

  //       let transporter = nodemailer.createTransport(smtpConfig);
  // let mailOptions = {
  //   from: 'anas3rde@gmail.com', // sender address
  //   to: email, // list of receivers
  //   subject: "Appointment Confirmed - DocMz", // Subject line
  //   // text: 'this is some text', //, // plaintext body
  //   html
  // }
  // console.log({mailOptions})
  //   transporter.sendMail(mailOptions, function(error, info){
  //     if(error){
  //       // return false;
  //       console.log({error})
  //     }else{
  //       console.log('Message sent: ' + info.response);
  //       // return true;
  //     };
  //     console.log('Message sent');
  //   });

  Appointment.findByIdAndUpdate(timeSlot, {
    $set: {
      approved: true
    }
  })
    .then(data => {
      let transporter = nodemailer.createTransport(smtpConfig);
      let mailOptions = {
        from: "anas3rde@gmail.com", // sender address
        to: email, // list of receivers
        subject: "Appointment Confirmed - DocMz", // Subject line
        // text: 'this is some text', //, // plaintext body
        html
      };

      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          // return false;
          console.log({ error });
        } else {
          console.log("Message sent: " + info.response);
        }
      });

      res.status(200).json({ status: true, message: "Appointment Approved" });
    })
    .catch(error => {
      res.status(404).json({ status: false, message: error });
    });
};

//Cancel appointment by Doctor
let cancelAppointment = (req, res) => {
  let { id, byDoctor, byPatient, reason } = req.body;
  Appointment.findByIdAndUpdate(
    id,
    {
      $set: {
        cancelledByPatient: byPatient,
        cancelledByDoctor: byDoctor,
        reasonForCancellation: reason
      }
    },
    { new: true }
  )
    .then(appointment => {
      res.status(200).json({
        status: true,
        message: "Appointment Cancelled",
        data: appointment
      });
    })
    .catch(error => {
      res.status(400).json({ status: false, message: error });
    });
};

//Get appointments for the next 3 days
let getAppointments = (req, res) => {
  let { limit, doctor, date } = req.body;

  function addDays(theDate, days) {
    return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
  }
  // let today = new Date()
  let newDate = new Date(date);
  let nextDate = addDays(newDate, limit);
  console.log({ nextDate });
  Appointment.find({ doctor, bookedFor: { $gt: newDate, $lt: nextDate } })
    .sort({ bookedFor: 1 })
    .then(appointments => {
      res.status(200).json({
        status: true,
        message: "Appointments Fetched",
        data: appointments
      });
    })
    .catch(error => {
      res.status(404).json({ status: false, message: error });
    });
};
// find({ sale_date: { $gt: ISODate("2014-11-04"), $lt: new ISODate("2014-11-05") });

//Cron job to filter out appointments of past date
let schedule = require("node-schedule");

let filterOutAppointments = schedule.scheduleJob("0 0 */3 * * *", function() {
  //Getting a date older than today
  let older_than = moment()
    .subtract(2, "days")
    .toDate();

  console.log({ older_than });

  Appointment.find({ bookedFor: { $lte: older_than }, booked: false })
    .deleteMany()
    .exec()
    .then(RemovedDocs => {
      console.log({ RemovedDocs });
      console.log("Appointments Removed Successfully");
    })
    .catch(err => {
      console.error({ "Somethings Wrong - Check Cron Job": err });
    });
});

module.exports = {
  cancelAppointment,
  bookAppointment,
  getAppointments,
  approveAppointment
};
