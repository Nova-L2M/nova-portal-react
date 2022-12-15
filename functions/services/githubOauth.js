// THE PASSPORT/DISCORD OAUTH2 STRATEGY DEFINITION

const passport = require("passport")
const GitHubStrategy = require("passport-github2").Strategy
const axios = require('axios')
const database = require("../API/database")
const { oauthKeys } = require("../info")
passport.serializeUser((user, done) => {
    done(null, user.uid)
})

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
// SCOPES DEFINED BY GITHUB TO GRAB USER PERMISSIONS
var scopes = oauthKeys.scopes

// DEFINES THE GITHUB OAUTH2 STRATEGY
passport.use(
    new GitHubStrategy(
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
                    // update user information
                    console.log("EXISTING USER")
                    done(null, searchUser.user)
                    return searchUser.user
                } else {
                    // CREATE A NEW USER
                    console.log("PASSPORT PROFILE FOLLOWS:");
                    console.log(JSON.stringify(profile));
                    const newUser = {
                        username: profile.username,
                        uid: profile.id,
                        avatar: profile._json.avatar_url,
                        token: accessToken
                    }
                    newUser.name = profile.displayName ? profile.displayName : null;
                    newUser.email = profile.emails ? profile.emails[0].value : null;

                    // TODO: Check if user is a member of the CodeupClassroom organization
                    const config = {
                        method: 'get',
                        url: 'https://api.github.com/user/memberships/orgs',
                        headers: { 
                          'Authorization': `token ${accessToken}`
                        }
                    };
                    const orgsResponse = await axios(config);
                    const orgs = orgsResponse.data;
                    newUser.orgs = orgs;
                    const isMember = orgs.some(org => org.organization.login === 'CodeupClassroom');
                    const isStaff = orgs.some(org => org.organization.login === 'GoCodeup');
                    if (isStaff) {
                        newUser.isStaff = true;
                    } else {
                        newUser.isStaff = false;
                    }
                    if (isMember) {
                        // ADD USER TO DATABASE
                        await database.newUser(newUser)
                        done(null, newUser)
                    } else {
                        // TODO: Exit process, redirect back to frontend page that says "You are not a member of the CodeupClassroom organization"
                        console.log("User is not a member of the CodeupClassroom organization");
                        done(null, false);
                    }
                }
            } catch (error) {
                return console.error(`Error creating a user: ${error.message}`);
            }
        }
    )
)
