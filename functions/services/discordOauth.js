// THE PASSPORT/DISCORD OAUTH2 STRATEGY DEFINITION

const passport = require("passport")
const DiscordStrategy = require("passport-discord").Strategy
const axios = require('axios');
const database = require("../API/database")
const { oauthKeys } = require("../info")
passport.serializeUser((user, done) => {
  done(null, user.uid)
});

// CHECKS IF A USER ALREADY EXISTS
// IF HE EXISTS, UPDATE THEM, OTHERWISE, CREATE THEM
// FOR MORE INFORMATION ON HOW PASSPORT-JS WORKS, HEAD TO THEIR WEBSITE
passport.deserializeUser(async (uid, done) => {
  try {
    const user = await database.findUser(uid)
    if (user.success === true) {
      done(null, user.user)
    } else {
      done(null)
    }
  } catch (error) {
    console.log(`Error deserializing user: ${error.message}`)
    done(error)
  }
  database
    .findUser(uid)
    .then(user => {
      done(null, user.user)
    })
    .catch(error => {
      console.log(`Error deserializing user: ${error.message}`)
    })
})
// SCOPES DEFINED BY DISCORD TO GRAB USER PERMISSIONS
var scopes = oauthKeys.scopes

// DEFINES THE DISCORD OAUTH2 STRATEGY
passport.use(
  new DiscordStrategy(
    {
      clientID: oauthKeys.clientID,
      clientSecret: oauthKeys.clientSecret,
      callbackURL: "/api/auth",
      scope: scopes,
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const uid = profile.id
        const searchUser = await database.findUser(uid)
        console.log(`SEARCH USER RESULT: ${searchUser}`)
        if (searchUser.success === true) {
          // user exists
          console.log("EXISTING USER")
          // update user information
          const updatedUser = {
            username: profile.username,
            discriminator: profile.discriminator,
            uid: profile.id,
            email: profile.email,
            avatar: profile.avatar,
            guilds: profile.guilds,
            token: accessToken,
            refreshToken: refreshToken
          }
          const updateUser = await database.updateUser(uid, updatedUser);
          if (updateUser.success === true) {
            console.log("User updated successfully.")
          } else {
            console.log("Error updating user.")
          }
          done(null, searchUser.user)
          return searchUser.user
        } else {
          // create a new user
          const newUser = {
            username: profile.username,
            discriminator: profile.discriminator,
            uid: profile.id,
            email: profile.email,
            avatar: profile.avatar,
            guilds: profile.guilds,
            token: accessToken,
            refreshToken: refreshToken
          }

          // Check if user is a member of the "Revolution" server (ID: 917846329412157491)
          const guilds = await profile.guilds;
          console.log("Finding if user is a member of the Revolution server...");
          const guild = await guilds.find(guild => guild.id === "917846329412157491");
          if (!guild) {
            return done(null, false, { message: "You must be a member of the Revolution server to use this app." });
          }
          // Get the user's server roles for the "Revolution" server (ID: 917846329412157491) from the Discord API
          const rolesArrayPromise = await axios.get(`https://discord.com/api/users/@me/guilds/917846329412157491/member`, {
            headers: {
              authorization: `Bearer ${accessToken}`
            }
          });
          const rolesArray = await rolesArrayPromise.data.roles;

          // and check if they have the "Members(New)" role (ID: 979903450684985345)
          const isMember = await rolesArray.find(role => role === "979903450684985345");
          if (!isMember) {
            return done(null, false, { message: "You must have the Members(New) role to use this app." });
          }

          // If the user has a nickname in the "Revolution" server (ID: 917846329412157491), set the "nickname" field on the user document to that nickname.
          const nickname = await profile.guilds.find(guild => guild.id === "917846329412157491").nick;
          if (nickname) {
            newUser.nickname = nickname;
          }

          // Check if user is a CrossServerLead member (ID: 971261365895438346) of the Revolution server (ID: 917846329412157491).
          // If they are, make the "is_boss_manager" field on the user document true.
          const isBossManager = await rolesArray.find(role => role === "971261365895438346");
          if (isBossManager) {
            newUser.is_boss_manager = true
          }
          await database.newUser(profile, newUser)
          done(null, newUser)
        }
      } catch (error) {
        return console.error(`Error creating a user: ${error}`)
      }
    }
  )
)
