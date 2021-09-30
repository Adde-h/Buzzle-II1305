/**
 * Database functions for getstarted
 */
import * as firebase from "firebase";

/**
 * Set firsttime token so user is presented with the
 * home screen on the next app launch.
 */
export const setUserNameAndRedirect = async ({ navigation, nName }) => {
  var user = firebase.auth().currentUser;
  if (user) {
    user.updateProfile({
      displayName: nName,
    })
    .then(function () {
      // Update successful.
      console.log("Successfully updated user displayname");
      navigation.navigate("Profile", {nickName: nName}); // navigation.navigate("Home");
    })
    .catch(function (error) {
      // An error happened.
      console.log("Could not update user displayname", error);
    });
  } else {
    // No user is signed in.
    firebase
    .auth()
    .signInAnonymously()
    .then((userCredential) => {
      // Signed in..
      console.log("Signed in! Uid: ", userCredential.user.uid);

      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          user.updateProfile({
            displayName: nName,
          })
          .then(function () {
            // Update successful.
            console.log("Successfully updated user displayname");
            navigation.navigate("Profile", {nickName: nName}); // navigation.navigate("Home");
          })
          .catch(function (error) {
            // An error happened.
            console.log("Could not update user displayname", error);
          });
        }
      });
    })
    .catch((error) => {
      console.log("Could not sign in: ", error);
    });
  }
};