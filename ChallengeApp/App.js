/**
 * Don't touch.
 * Redirect to index file in src folder
 */
import { AppRegistry } from "react-native";
import app from "./src/index";

import * as firebase from "firebase";
import "firebase/firestore";
import firebaseConfig from "./config";
import { LogBox } from "react-native";

LogBox.ignoreLogs(["Setting a timer"]);
LogBox.ignoreLogs(["Require cycle"]);
LogBox.ignoreLogs(["interpolate() was renamed"]);

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faLongArrowAltLeft,
  faCircle,
  faHome,
  faCrown,
  faList,
  faHeart,
  faExclamation,
  faUser,
  faWrench,
  faLevelUpAlt,
  faInfo,
  faEdit,
  faPhone,
  faCrosshairs,
  faBars,
  faPlus,
  faFilter,
  faStar,
  faImages,
  faClock,
  faMapMarkerAlt,
  faWalking,
  faBookmark,
  faGlassCheers,
  faHeartBroken,
  faBirthdayCake,
  faTimes,
  faCheck,
  faSearch,
  faArrowsAltV,
  faTags,
  faQuestionCircle,
  faArrowRight,
  faArrowLeft,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

// Font awesome: Initialize
library.add(
  faLongArrowAltLeft,
  faCircle,
  faCrown,
  faHome,
  faList,
  faHeart,
  faExclamation,
  faUser,
  faWrench,
  faLevelUpAlt,
  faInfo,
  faEdit,
  faPhone,
  faCrosshairs,
  faBars,
  faPlus,
  faFilter,
  faStar,
  faImages,
  faClock,
  faMapMarkerAlt,
  faWalking,
  faBookmark,
  faGlassCheers,
  faHeartBroken,
  faBirthdayCake,
  faTimes,
  faCheck,
  faSearch,
  faArrowsAltV,
  faTags,
  faQuestionCircle,
  faCheckCircle,
  faArrowLeft,
  faArrowRight
);

// Firebase: Initialize
firebase.initializeApp({
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  databaseURL: firebaseConfig.databaseURL,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
});
// Firebase: Cloud Firestore
export const database = firebase.firestore();

AppRegistry.registerComponent("ChallengeApp", () => app);
export default app;
