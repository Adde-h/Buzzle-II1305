//import firebase from 'react-native-firebase';
import { database } from "../../../App";

import { firebase } from "@firebase/app";
import CreateQuestionsNavigator from "_navigations";

export function addChallenge() {
  //const admin = require('firebase-admin');


  const newChallengeRef = database.collection("Challenges").doc();

  const newID = newChallengeRef.id;
  const res = newChallengeRef.set({
    id: newID,
    name: "",
    description: "",
    endTime: "",
    creatorUserId: "",
    location: { laticoords: 0, longicoords: 0, address: "" },
    timeCreated: new Date(Date.now()), //admin.firestore.FieldValue.serverTimestamp()
    tags: [],
    nrOfQuestions: 0,
    nrOfReviews: 0,
    ratingSum: 0,
    published: false,
    nrOfAnswers: 0,
  });

  console.log("Challenge ID: ", newID);
  return newID;
}



/*import firebase from 'react-native-firebase';

export function addChallenge(challenge, addComplete ){
    firebase.firestore()
        .collection('Challenge')
        .add({
            name: challenge.name,
            description: challenge.description,
            enddate: challenge.enddate,
            creator: challenge.creator,
            place: challenge.place,
            createAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then((data) => addComplete(data))
        .catch((error) => console.log(error))

}*/

export function updateChallenge(challenge, newID) {
  //const admin = require('firebase-admin');

  const newChallengeRef = database.collection("Challenges").doc(newID);
  const coordlat = challenge.location.laticoords;
  const coordlong = challenge.location.longicoords;
  const cooraddress = challenge.location.address;
  const geopoints = new firebase.firestore.GeoPoint(
    coordlat,
    coordlong,
    cooraddress
  );

  const res = newChallengeRef.set(
    {
      id: newID,
      name: challenge.name,
      description: challenge.description,
      //nrOfAnswers: challenge.nrOfAnswers,
      endTime: challenge.endTime,
      creatorUserId: challenge.creatorUserId,
      location: challenge.location,
      tags: challenge.tags,
      //nrOfQuestions: challenge.nrOfQuestions, // Already set in add submission
      published: true,
      address: challenge.address,
    },
    { merge: true }
  );
  console.log("Added challenge with ID: ", newID);
}

/**
 * Manually corrected submissions
 */

export function addSubmission(questions) {
  const newSubmission = database
    .collection("Challenges")
    .doc(questions.id)
    .collection("Questions")
    .doc();

  const newSubmissionID = newSubmission.id;

  const newSubmissionField = newSubmission.set({
    id: newSubmissionID,
    answer: "",
    orderId: questions.orderId,
    question: questions.question,
    isManuallyCorrected: true,
    allowTextAnswer: questions.allowTextAnswer,
    allowImageAnswer: questions.allowImageAnswer,
    allowVideoAnswer: questions.allowVideoAnswer,
    timeCreated: new Date(Date.now()),
  });
  console.log("Added challenge Submission: ", newSubmissionID);
  return newSubmissionID;
}

export function addQuestion(questions) {
  const newQuestion = database
    .collection("Challenges")
    .doc(questions.id)
    .collection("Questions")
    .doc();

  const newQuestionID = newQuestion.id;

  const newQuestionField = newQuestion.set({
    id: newQuestionID,
    answer: questions.answer,
    orderId: questions.orderId,
    question: questions.question,
    isManuallyCorrected: false,
    timeCreated: new Date(Date.now()),
  });
  console.log("Added challenge Question: ", newQuestionID);
  return newQuestionID;
}
