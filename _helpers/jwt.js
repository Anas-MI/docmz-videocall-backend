const expressJwt = require("express-jwt");
const userService = require("../users/user.service");

//Exporting it
module.exports = jwt;

function jwt() {
  const secret = "catchmeifyoucan";
  return expressJwt({ secret, isRevoked }).unless({
    path: [
      // public routes that don't require authentication
      "/doctors/getinfo",
      "/patient/register",
      "/patient/authenticate",
      "/patient/update",
      "/patient/forgetpassword",
      "/patient/setpassword",
      { url: /\/patient\/getinfo\/([^\/]*)$/, methods: ["GET", "POST"] },
      "/users/token",
      { url: /\/doctors\/getinfo\/([^\/]*)$/, methods: ["GET", "POST"] },
      "/users/login",
      "/codes/upload/cpt",
      "/codes/upload/cptindex",
      "/codes/upload/icd10index",
      "/codes/upload/icd10",
      "/codes/upload/diseases",
      "/doctors/upload",
      "/doctors/search",
      "/codes/get/diseases",
      "/doctors/get",
      "/insurance/addtodatabase/carriers",
      "/insurance/get/carriers",
      "/insurance/delete/carriers",
      "/doctors/upload/procedures",
      "/doctors/get/procedures",
      "/doctors/upload/specialties",
      "/doctors/get/specialties",
      "/doctors/register",
      "/doctors/authenticate",
      "/doctors/profile/update",
      "/doctors/saveslots",
      "/doctors/picture/delete",
      "/stripe/create/card/profile",
      "/stripe/charge/profile",
      "/stripe/create/profile",
      { url: /\/stripe\/list\/([^\/]*)$/, methods: ["GET", "POST"] },
      "/stripe/charge/card",
      "/stripe/testcard",
      "/appointment/book",
      "/appointment/cancel",
      "/appointment/get",
      "/appointment/approve",
      { url: /\/getdoc\/([^\/]*)$/, methods: ["GET", "POST"] },
      { url: /\/doctors\/upload\/([^\/]*)$/, methods: ["GET", "POST"] }
    ]
  });
}

async function isRevoked(req, payload, done) {
  const user = await userService.getById(payload.sub);

  // revoke token if user no longer exists
  if (!user) {
    return done(null, true);
  }
  done();
}
