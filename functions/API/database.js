// EXECUTES DATABASE FUNCTIONALITY RELATED TO FIRESTORE

const admin = require("firebase-admin")

module.exports.findUser = async uid => {
  let obj
  try {
    const user = await admin
      .firestore()
      .collection("users")
      .doc(uid)
      .get()
    if (!user.exists) {
      obj = { success: false, error: `user with uid ${uid} does not exist` }
    } else {
      obj = { success: true, user: user.data() }
    }
  } catch (error) {
    console.log(`SEARCH USER ERROR: ${error.message}`)
    obj = { success: false, error: error.message }
    console.log("RETURNING OBJECT:")
    console.log(obj)
  }
  return obj
}

module.exports.getUsers = async () => {
  let obj
  try {
    const users = []
    const data = await admin
      .firestore()
      .collection("users")
      .orderBy("createdAt", "desc")
      .get()
    data.forEach(user => {
      users.push(user.data())
    })
    obj = { success: true, users: users }
  } catch (error) {
    console.error(`Error getting users: ${error}`)
    obj = { success: false, error: error.message }
  }
  return obj
}

module.exports.newUser = async (profile, newUser) => {
  let obj
  try {
    // create a new user in firebase auth
    console.log("CREATING NEW USER IN FIREBASE AUTH");
    // console log stringified profile
    console.log(JSON.stringify(profile));
    const userRecord = await admin.auth().createUser(profile)
    //create a new user in firestore
    await admin
      .firestore()
      .collection("users")
      .doc(profile.id)
      .set(newUser);
    
    obj = { success: true, user: userRecord }
  } catch (error) {
    console.error(`Error creating a user: ${error}`)
    obj = { success: false, error: error.message }
  }
  return obj
}

module.exports.updateUser = async (uid, updatedUser) => {
  let obj
  try {
    const user = await admin
      .firestore()
      .collection("users")
      .doc(uid)
      .get()
    if (!user.exists) {
      obj = { success: false, error: `user with uid ${uid} does not exist` }
    } else {
      await admin
        .firestore()
        .collection("users")
        .doc(uid)
        .update(updatedUser)
      obj = { success: true }
    }
  } catch (error) {
    console.log(`UPDATE USER ERROR: ${error.message}`)
    obj = { success: false, error: error.message }
  }
  return obj
}