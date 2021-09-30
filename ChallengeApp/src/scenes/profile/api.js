//import firebase from 'react-native-firebase';
import * as firebase from "firebase";

export function signOut() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
      console.log("Sign-out successful!");
    })
    .catch((error) => {
      // An error happened.
      console.log("Sign-out error!", error);
    });
}
