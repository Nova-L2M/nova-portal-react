// AUTHENTICATION ROUTES USING PASSPORT TO HANDLE THE OAUTH2 DANCE

const passport = require("passport")
const firebase = require("firebase")
const admin = require("firebase-admin");

// SCOPES DEFINED BY GITHUB TO GRAB USER PERMISSIONS
var scopes = require("../info").oauthKeys.scopes
var referrer = "Unknown"
const whitelist = require("../info").whitelist

module.exports = (app) => {
  app.get("/logout", async (req, res) => {
    await firebase.auth().signOut()
    req.logout()
    res.redirect("/api/user")
  })
  //IF THERE IS AN ERROR, LOG THEM OUT
  //TODO - SEND THEM TO AN ERROR PAGE
  app.get("/error", async (req, res) => {
    req.logout()
  })
  //IF DENIED ACCESS, LOG THEM OUT AND SHOW THEM A DENIED PAGE
  app.get("/denied", async (req, res) => {
    await firebase.auth().signOut()
    return res.status(500).json({ success: false, error: 'You are not a member of the CodeupClassroom organization on Github and are not able to login at this time.' })
  })
  // THIS IS THE OAUTH2 CALLBACK ROUTE
  app.get(
    "/auth",
    passport.authenticate("discord", { failureRedirect: "/api/denied" }),
    async (req, res) => {
      // IF ALL WENT WELL, SEND THEM ON THEIR WAY.
      // CHECK WHITELIST OBJECT WITH referrer VARIABLE AND GET callback_url
      const callback_url = whitelist[referrer] || whitelist['default'];

      const customToken = await admin.auth().createCustomToken(req.user.uid);
      // Test callback
      // return res.status(200).json({ 
      //   success: true,
      //   referrer: referrer,
      //   callback_url: callback_url,
      //   message: 'Success! The Codeup Authentication App has successfully confirmed you are a member of the CodeupClassroom organization on Github. A JWT can be generated from here to be returned back to the frontend. You can navigate to /api/user to see your user object saved in user table.',
      //   jwt: customToken
      // })

      // Production callback
      if (callback_url != whitelist['default'])
        req.logout();
      res.redirect(`${callback_url}?token=${customToken}`);
    }
  )
  app.get(
    "/login/:referrer", async function (req, res) {
      //console.log("REFERRER FOLLOWS:");
      //console.log(req.param("referrer"));
      referrer = req.params.referrer || "Unknown";
      res.redirect("/api/login");
    }
  )
  app.get(
    "/login",
    passport.authenticate("discord", {
      scope: scopes,
      failureRedirect: "/error",
    }),
    async function (req, res) {
      await firebase.auth().signInWithCustomToken(req.user.token)
    }
  )
}