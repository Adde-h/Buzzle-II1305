//import firebase from 'react-native-firebase';
import { database } from "../../../App";

export function correctAnswer(answer) {
  //const admin = require('firebase-admin');

  const answeredQuestionRef = database
    .collection("Challenges")
    .doc(answer.challID)
    .collection("Questions")
    .doc(answer.quesID)
    .collection("userAnswer")
    .doc();
  const newID = answeredQuestionRef.id;

  const res = answeredQuestionRef.set({
    id: newID,
    answer: answer.answered,
    isCorrect: answer.isCorrect,
    isGraded: false,
    timeSubmitted: new Date(Date.now()), //admin.firestore.FieldValue.serverTimestamp()
    userID: answer.userId,
    answerType: 1,
  });
  console.log("Added answer ", newID);
}

export function manualAnswer(answer) {
  //const admin = require('firebase-admin');

  const answeredQuestionRef = database
    .collection("Challenges")
    .doc(answer.challID)
    .collection("Questions")
    .doc(answer.quesID)
    .collection("userAnswer")
    .doc();
  const newID = answeredQuestionRef.id;

  const res = answeredQuestionRef.set({
    id: newID,
    answer: answer.answered,
    isCorrect: false,
    isGraded: false,
    timeSubmitted: new Date(Date.now()), //admin.firestore.FieldValue.serverTimestamp()
    userID: answer.userId,
    answerType: answer.answerType, //(1 for text, 2 for image, 3 for video)
  });
  console.log("Added manual answer ", newID);
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
