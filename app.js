require("rootpath")();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const expressValidator = require("express-validator");
const http = require('http');
const https = require('https');
const socket = require('./socket');
// app.use(expressValidator());
const cors = require("cors");

const jwt = require("_helpers/jwt");
const errorHandler = require("_helpers/error-handler");
const cookieparser = require("cookie-parser");
const session = require("express-session");
const morgan = require("morgan");
const { createServer } = require('http');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cookieparser());
const compression = require("compression")

//Compress all the requests
app.use(compression());

// app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(cors({ origin: "http://localhost:3000" }));

//Socket.io
const port = 3001
//New Socket code

const server = createServer(app);
server.listen(port)
socket(server)








// const sio = require('socket.io')
// const server = http.createServer(app).listen(port)
// const io = sio(server);

// //Initiliasing the socket connection

// io.sockets.on("connection", socket => {
//   console.log(socket.id)
//   let room = "";

//   //Sending to all clients in the room except the sender
//   socket.on("message", message => socket.broadcast.to(room).emit('message'))
//   socket.on("find", () => {

//     //Getting the url when the socket is initialised ie. someone connects 
//     const url = socket.request.headers.referer.split("/")
//     //Getting the unique id of that room or call
//     room = url[url.length - 1];

//     //Checking if we already have a room
//     const sr = io.sockets.adapter.rooms[room]

//     if(sr === undefined){
//       //No room with this name found, so create it

//       //Creating the room
//       socket.join(room)
//       socket.emit("create");

//     } else if(sr.length === 1){
//       // if the room already exists

//       socket.emit('join')
//     } else {

//       //Stopping users to join if the number of users is greater than 2
//       socket.emit('full', room)
//     }

//   } )


// //Authentication for someone trying to enter a room
// socket.on("auth", data => {
//   console.log({data});
//   data.sid = socket.id;

//   //Sending to all clients in room except the sender
//   socket.broadcast.to(room).emit("approve", data)
// })

// //Accept a request
// socket.on("accept", id => {
//   console.log({
//     "Accept request id": id
//   })


// console.log({
//     "io.sockets.connected[id]": io.sockets.connected[id]
//   })

//   io.sockets.connected[id].join(room);

//   //Sending to all the clients in the room, including the sender

//   io.in(room).emit("bridge")


// })

// //Reject request

// socket.on("reject", () => {
//   socket.emit('full')
// })

// //Leave request

// socket.on("leave", () => {
//   socket.broadcast.to(room).emit("hangup");
//   //Leave the room
//   socket.leave(room)
// })






// })



// initialize express-session to allow us track the logged-in user across sessions.
app.use(
  session({
    key: "user_sid",
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000
    }
  })
);

// var socket = require('socket.io');

// start server
// const port = process.env.PORT || 4000;
// const server = app.listen(process.env.PORT, function() {
// 	console.log(`Server listening on port ${process.env.PORT}`);
// });

// var server = http.createServer(app);
// io = socket(server);

// require('./socket/socket')(io);

// // middleware function to check for logged in users
// let sessionChecker = (req, res, next) => {
//     if (req.session.user && req.cookies.user_sid) {
//         res.redirect('/');
//     } else {
//         next();
//     }
// };

// // middleware for checking if the cookie information is saved or not
// app.use((req, res, next) => {
//     if (req.cookies.user_sid && !req.session.user) {
//         res.clearCookie('user_sid');
//     }
//     next();
// });

// use JWT auth to secure the api
app.use(jwt());

// NPI
app.use("/doctors", require("./routes/doctor_routes.js"));

//Codes
app.use("/codes", require("./routes/codes_routes"));

//Insurance
app.use("/insurance", require("./routes/insurance_routes"));

//User Routes
app.use("/patient", require("./routes/user_routes"));

//Stripe Routes
app.use("/Stripe", require("./routes/stripe_routes"));

//Appointment Routes
app.use("/appointment", require("./routes/appointment_routes"));

app.use(errorHandler);

module.exports = app;
