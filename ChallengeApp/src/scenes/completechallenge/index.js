/**
 * TODO: Add media type field to the answers!!!
 */

/**
 * Complete challenge (TEMPLATE)
 */
import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  KeyboardAvoidingView,
  ActivityIndicator,
  Image,
  Share,
  LogBox,
} from "react-native";
import { Question } from "_atoms";
import { StarRating } from "_atoms";
import { Header, Icon } from "react-native-elements";
import { database } from "../../../App";
import { correctAnswer, manualAnswer } from "./api";
import { HeaderBackButton } from "react-navigation-stack";
import { Colors, Typography } from "_styles";
import {
  BlackButton,
  YellowButton,
  MultiRowTextInput,
  DarkSingleRowTextInput,
  CardBox,
  TransparentHeaderView,
} from "_organisms";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { scaleFont } from "_styles";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Modal from "react-native-modal";

import * as ImagePicker from "expo-image-picker";
import { Video, AVPlaybackStatus } from 'expo-av';

import * as firebase from "firebase";

import uuid from "uuid";


async function uploadMediaAsync(uri) {
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const ref = firebase.storage().ref().child(uuid.v4());
  const snapshot = await ref.put(blob);

  // We're done with the blob, close and release it
  blob.close();

  return await snapshot.ref.getDownloadURL();
}

const CompleteChallengeScreen = (props) => {
  var user = firebase.auth().currentUser;

  // Read props from challengesummary
  const challengeID = props.navigation.getParam("challengeID", "Fail");
  const nrOfQuestions = props.navigation.getParam("nrOfSubchallenges", 1);
  const challengeName = props.navigation.getParam("challengeName", "Fail");
  const nrOfAnswers = props.navigation.getParam("nrOfAnswers", "Fail");

  // Change!!!
  // States used to keep track of what question we are
  const [index, setIndex] = useState(0); // hårdkodat, koppla till create challenge och ta bort sen
  const [nrOfCorrectQuestion, setNrOfCorrectQuestion] = useState(0);
  const [answered, setAnswered] = useState("");
  const [onLastQ, setOnLastQ] =
    nrOfQuestions == 1 ? useState(true) : useState(false); // Update this once orderId and nrOfQs bugs are fixed
  
  // States to handle showing the review state
  const [showReview, setShowReview] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [readyToRead, setReadyToRead] = useState(false);
  const [readyToWrite, setReadyToWrite] = useState(false);
  const [rating, setRating] = useState(3);
  const [prevData, setPrevData] = useState({ dataSet: false });

  // Image uploading
  const [textvalue, setTextvalue] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [currentType, setCurrentType] = useState(1);

  const [containsManual, setContainsManual] = useState(false);

  // Save questions in an array
  const [questions, setQuestions] = useState([
    {
      id: "Error",
      answer: "Error",
      question: "Error",
      isManuallyCorrected: false,
    },
  ]);

  // Ref to wether this screen is mounted (?)
  const isMountedRef = useRef(null);
  
  // Calculate timeleft using UTC+2
  // Not used anywhere???
  const year = new Date().getFullYear();
  const difference = +new Date(`${year}-05-02T10:30:00+02:00`) - +new Date();
  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  /**
   * ---------------------------------------------
   *                 Image uploading
   * ---------------------------------------------
   */

  /****************************************************
   * Get permission to access the medialibrary
   ***************************************************/
  useEffect(() => {
    async function getPermission() {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("We need camera roll permissions to allow you to upload pictures as answers");
        }
      }
    }
    getPermission();
  }, []);

  /****************************************************
   * Render loading bar for image upload
   ***************************************************/
  const _maybeRenderUploadingOverlay = () => {
    if (uploading) {
      return (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: "rgba(0,0,0,0.4)",
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <ActivityIndicator color="#fff" animating size="large" />
        </View>
      );
    }
  };

  /****************************************************
   * Take photo with camera and call handleImage
   ***************************************************/
  const _takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });

    _handleMediaPicked(pickerResult);
  };

  /****************************************************
   * Pick photo from library and call handleImage
   ***************************************************/
  const _pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log({ pickerResult });

    _handleMediaPicked(pickerResult);
  };

  /****************************************************
   * Record video with camera and call handleImage
   ***************************************************/
   const _recordVideo = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
    });

    _handleMediaPicked(pickerResult);
  };

  /****************************************************
   * Pick video from library and call handleImage
   ***************************************************/
  const _pickVideo = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log({ pickerResult });

    _handleMediaPicked(pickerResult);
  };


  /****************************************************
   * Render loading bar for image upload
   ***************************************************/
  const _handleMediaPicked = async (pickerResult) => {
    try {
      setUploading(true);

      if (!pickerResult.cancelled) {
        const uploadUrl = await uploadMediaAsync(pickerResult.uri);
        console.log("pickerResult: ", pickerResult.type);

        if(pickerResult.type == "image") {
          setTextvalue("");
          setVideo(null);
          setImage(uploadUrl);
          setCurrentType(2); // Image
        } else {
          setTextvalue("");
          setImage(null);
          setVideo(uploadUrl);
          setCurrentType(3); // Video
        }
        setAnswered(uploadUrl);
      }
    } catch (e) {
      console.log(e);
      alert("Upload failed, sorry :(");
    } finally {
      setUploading(false);
    }
  };

  /****************************************************
   * Render image that was uploaded
   ***************************************************/
  const _maybeRenderImage = () => {
    if (!image) {
      return;
    }

    return (
      <View
        style={{
          marginTop: 30,
          width: "90%",
          borderRadius: 3,
          elevation: 2,
          marginBottom: 30,
        }}
      >
        <View
          style={{
            borderTopRightRadius: 3,
            borderTopLeftRadius: 3,
            shadowColor: "rgba(0,0,0,1)",
            shadowOpacity: 0.2,
            shadowOffset: { width: 4, height: 4 },
            shadowRadius: 5,
            overflow: "hidden",
          }}
        >
          <Image source={{ uri: image }} style={{ width: "100%", height: 250 }} />
        </View>
      </View>
    );
  };

  /****************************************************
   * Render video that was uploaded
   ***************************************************/
    const _maybeRenderVideo = () => {
      if (!video) {
        return;
      }
  
      return (
        <View
          style={{
            marginTop: 30,
            width: "90%",
            borderRadius: 3,
            elevation: 2,
            marginBottom: 30,
          }}
        >
          <View
            style={{
              borderTopRightRadius: 3,
              borderTopLeftRadius: 3,
              shadowColor: "rgba(0,0,0,1)",
              shadowOpacity: 0.2,
              shadowOffset: { width: 4, height: 4 },
              shadowRadius: 5,
              overflow: "hidden",
            }}
          >
            <Video source={{ uri: video }} 
                   useNativeControls 
                   isLooping 
                   resizeMode="contain" 
                   style={{ width: "100%", height: 250 }} />
          </View>
        </View>
      );
    };



  /****************************************************
   * Get questions from database on load
   ***************************************************/
  useEffect(() => {
    console.log("[DBGET] COMPLETECHALLENGE useEffect");
    var newQuestions = [];
    database
      .collection("Challenges")
      .doc(challengeID)
      .collection("Questions")
      .orderBy("timeCreated")
      .get()
      .then((questionSnapshot) => {
        questionSnapshot.forEach((doc) => {
          newQuestions.push({
            id: doc.data()["id"],
            answer: doc.data()["answer"],
            question: doc.data()["question"],
            isManuallyCorrected: doc.data()["isManuallyCorrected"],
            allowTextAnswer: doc.data()["allowTextAnswer"] || false,
            allowImageAnswer: doc.data()["allowImageAnswer"] || false,
            allowVideoAnswer: doc.data()["allowVideoAnswer"] || false,
            timeCreated: doc.data()["timeCreated"],
          });
        });
        setQuestions(newQuestions);
      });
  }, []);

  /**
   * -------------------------------------------------
   *                ANSWER HANDLING 
   * -------------------------------------------------
   */

  /****************************************************
   * Called after every question except last
   ***************************************************/
   function onButtonPress(answer) {
    if (index < nrOfQuestions - 1) {
      console.log("index: ", index);
      console.log("nrOfQuestions: ", nrOfQuestions);
      setIndex(index + 1);
    }
    setAnswered("");
    setTextvalue("");
    setImage(null);
    setVideo(null);
    setCurrentType(1);

    if(questions[index]["isManuallyCorrected"]) {
      console.log("Manual answer added");
      manualAnswer({
        answered: answer.answered,
        quesID: answer.quesID,
        challID: answer.challID,
        userId: answer.userId,
        answerType: answer.answerType,
      });
      setContainsManual(true);
    } else {
      if (
        answer.answered.toLowerCase() == questions[index]["answer"].toLowerCase()
      ) {
        correctAnswer({
          answered: answer.answered,
          quesID: answer.quesID,
          challID: answer.challID,
          userId: answer.userId,
          isCorrect: true,
      });
      setNrOfCorrectQuestion(nrOfCorrectQuestion + 1);
      } else {
        correctAnswer({
          answered: answer.answered,
          quesID: answer.quesID,
          challID: answer.challID,
          userId: answer.userId,
          isCorrect: false,
      });
    }
    }

    if (index >= nrOfQuestions - 2) {
      console.log(answer.userId);
      setOnLastQ(true);
    }
  }

  /****************************************************
   * Called when pressing the last question
   ***************************************************/
  function onButtonPressLast(answer) {
    database
      .collection("Challenges")
      .doc(challengeID)
      .update({ nrOfAnswers: nrOfAnswers + 1 });
    
      if(questions[index]["isManuallyCorrected"]) {
        manualAnswer({
          answered: answer.answered,
          quesID: answer.quesID,
          challID: answer.challID,
          userId: answer.userId,
          answerType: answer.answerType,
        });
        setContainsManual(true);
      } else {
        if (
          answer.answered.toLowerCase() == questions[index]["answer"].toLowerCase()
        ) {
          console.log("You were right!");
          correctAnswer({
            answered: answer.answered,
            quesID: answer.quesID,
            challID: answer.challID,
            userId: answer.userId,
            isCorrect: true,
          });
          setNrOfCorrectQuestion(nrOfCorrectQuestion + 1);
        } else {
          console.log("You were wrong :(");
          correctAnswer({
            answered: answer.answered,
            quesID: answer.quesID,
            challID: answer.challID,
            userId: answer.userId,
            isCorrect: false,
          });
        }
      }
    setShowReview(true);
  }


  /**
   * -------------------------------------------------
   *                REVIEW HANDLING
   * -------------------------------------------------
   */

  /****************************************************
   * (readyToRead) - REVIEW
   * Get rating sum and nrofreviews and call prevData
   ***************************************************/
  useEffect(() => {
    isMountedRef.current = true;
    if (readyToRead) {
      database
        .collection("Challenges")
        .doc(challengeID)
        .get()
        .then((doc) => {
          if (doc.exists && isMountedRef.current) {
            setPrevData({
              dataSet: true,
              ratingSum: doc.data()["ratingSum"],
              nrOfReviews: doc.data()["nrOfReviews"],
            });
          } else {
            console.log("Couldn't find your data!");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    }
    return () => (isMountedRef.current = false);
  }, [readyToRead]);

  /******************************************************
   * (prevData) - REVIEW
   * Increment nrOfReviews and add the rating to the sum
   * Then call readyToWrite
   *****************************************************/
  useEffect(() => {
    isMountedRef.current = true;
    if (prevData["dataSet"] && isMountedRef.current) {
      let newNrOfReviews = prevData["nrOfReviews"] + 1;
      let newRatingSum = prevData["ratingSum"] + rating;

      database.collection("Challenges").doc(challengeID).set(
        {
          nrOfReviews: newNrOfReviews,
          ratingSum: newRatingSum,
        },
        { merge: true }
      );

      setReadyToWrite(true);
    }
    return () => (isMountedRef.current = false);
  }, [prevData]);

  /****************************************************
   * (readyToWrite) - REVIEW
   * Add review to the Reviews collection
   ***************************************************/
  useEffect(() => {
    isMountedRef.current = true;
    if (readyToWrite && isMountedRef.current) {
      database
        .collection("Challenges")
        .doc(challengeID)
        .collection("Reviews")
        .add({
          userId: user.displayName,
          review: reviewText,
          rating: rating,
          timeCreated: new Date(Date.now()),
        });
    }
    return () => (isMountedRef.current = false);
  }, [readyToWrite]);

  /****************************************************
   * Called when clicked on submit review - REVIEW
   ***************************************************/
  function submitReview() {
    setReadyToRead(true);
    props.navigation.navigate("Result", {
      challengeID: challengeID,
      userID: user.displayName,
      challengeName: challengeName,
      nrOfQuestions: nrOfQuestions,
      nrOfCorrectQuestion: nrOfCorrectQuestion,
      containsManual: containsManual,
    });
  }

  /****************************************************
   * Called when clicking outside the review modal
   ***************************************************/
  function onBackdropPress() {
    setShowReview(false);
    props.navigation.navigate("Result", {
      challengeID: challengeID,
      userID: user.displayName,
      challengeName: challengeName,
      nrOfQuestions: nrOfQuestions,
      nrOfCorrectQuestion: nrOfCorrectQuestion,
      containsManual: containsManual,
    });
  }

  const deleteAnswers = () => {
    const questionRef = database
      .collection("Challenges")
      .doc(challengeID)
      .collection("Questions");

    questionRef.get().then((questionSnapshot) => {
      questionSnapshot.forEach((snap) => {
        questionRef
          .doc(snap.id)
          .collection("userAnswer")
          .get()
          .then((documentSnapshot) => {
            documentSnapshot.forEach((doc) => {
              if (doc.data()["userID"] == user.displayName) {
                questionRef
                  .doc(snap.id)
                  .collection("userAnswer")
                  .doc(doc.data()["id"])
                  .delete()
                  .then(() => {
                    console.log("User deleted!");
                    console.log(doc.data());
                  });
              }
            });
          });
      });
    });
  };


  return (
    <TransparentHeaderView
      backgroundColor={Colors.WHITE}
      leftOnPress={() => {
        props.navigation.goBack();
        deleteAnswers();
      }}
      leftIcon="long-arrow-alt-left"
    >
      <KeyboardAwareScrollView
        style={{ backgroundColor: Colors.WHITE }}
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={styles.container}
        scrollEnabled={true}
      >
        <Text style={styles.titleText}> {challengeName} </Text>
        
        {/**
         * Review modal view
         */}
        <Modal
          isVisible={showReview}
          onBackdropPress={() => onBackdropPress()}
          backdropColor="white"
          backdropOpacity={1}
          style={styles.review}
        >
          <View style={styles.reviewContent}>
            <Text style={styles.reviewText}>Review this challenge</Text>
            <StarRating
              rating={rating}
              rate={(rating) => {
                setRating(rating);
              }}
            />
            <MultiRowTextInput
              onChangeText={(txt) => {
                setReviewText(txt);
              }}
              value={reviewText}
              placeholder="Write your feedback here"
              backgroundColor={Colors.BACKGROUND_WHITE}
            />
            <YellowButton
              onPress={() => submitReview()}
              title="Submit Review"
            />
          </View>
          <Text style={styles.skip}>Skip</Text>
        </Modal>

        {/**
         * 
         */}
        <View alignItems="center">
          <CardBox alignItems="flex-start" width="75%">
            <Text style={styles.questionNumberText}>{index + 1}.</Text>
            <Question questionText={questions[index]["question"]} />
          </CardBox>
        </View>
        <View style={styles.bottom}>

          {questions[index]["isManuallyCorrected"] && questions[index].allowTextAnswer ? (
            <DarkSingleRowTextInput
            placeholder="Enter answer TEXT"
            value={textvalue}
            onChangeText={currentText => {
              setAnswered(currentText); 
              setTextvalue(currentText);
              setVideo(null);
              setImage(null);
              setCurrentType(1);
            }} />
          ) : (<></>)}
          
          {questions[index]["isManuallyCorrected"] && questions[index].allowImageAnswer ? (
            <YellowButton
            onPress={_pickImage}
            title="Pick image" />
          ) : (<></>)}
          {questions[index]["isManuallyCorrected"] && questions[index].allowImageAnswer ? (
            <YellowButton
            onPress={_takePhoto}
            title="Take photo" />
          ) : (<></>)}

          {_maybeRenderImage()}
          

          {questions[index]["isManuallyCorrected"] && questions[index].allowVideoAnswer ? (
            <YellowButton
            onPress={_pickVideo}
            title="Pick video" />
          ) : (<></>)}
          {questions[index]["isManuallyCorrected"] && questions[index].allowVideoAnswer ? (
            <YellowButton
            onPress={_recordVideo}
            title="Record video" />
          ) : (<></>)}

          {_maybeRenderVideo()}
          {_maybeRenderUploadingOverlay()}
          
          {questions[index]["isManuallyCorrected"] ? (
            <></>
          ) : (
            <DarkSingleRowTextInput
            placeholder="Enter answer"
            value={textvalue}
            onChangeText={currentText => {setAnswered(currentText); setTextvalue(currentText);}} />
          )}
          

          {onLastQ ? (
            <BlackButton
              onPress={() =>
                onButtonPressLast({
                  answered: answered,
                  quesID: questions[index]["id"],
                  challID: challengeID,
                  userId: user.displayName,
                  answerType: currentType,
                })
              }
              title="END CHALLENGE"
            />
          ) : (
            <BlackButton
              onPress={() =>
                onButtonPress({
                  answered: answered,
                  quesID: questions[index]["id"],
                  challID: challengeID,
                  userId: user.displayName,
                  answerType: currentType,
                })
              }
              title="NEXT"
              disabled={answered == ""}
            />
          )}
        </View>
      </KeyboardAwareScrollView>
    </TransparentHeaderView>
  );
};

// Styles
const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  titleText: {
    color: Colors.BLACK,
    fontFamily: Typography.FONT_FAMILY_BOLD,
    fontSize: Typography.FONT_SIZE_LARGE,
    fontWeight: Typography.FONT_WEIGHT_BOLD,
    marginTop: 5,
    marginBottom: 25,
    textAlign: "center",
  },
  questionNumberText: {
    color: Colors.WHITE,
    fontFamily: Typography.FONT_FAMILY_BOLD,
    fontSize: Typography.FONT_SIZE_MEDIUM_LARGE, //osäker om rätt
    fontWeight: Typography.FONT_WEIGHT_BOLD,
    marginBottom: 290,
    marginTop: 10,
  },
  bottom: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 60,
    width: "100%",
  },
  reviewContent: {
    alignItems: "center",
  },
  review: {
    justifyContent: "center",
    alignItems: "center",
  },
  reviewText: {
    fontFamily: Typography.FONT_FAMILY_BOLD,
    fontSize: Typography.FONT_SIZE_MEDIUM_LARGE,
    fontWeight: Typography.FONT_WEIGHT_BOLD,
    color: Colors.GRAY_DARK,
  },
  skip: {
    marginTop: "20%",
    color: Colors.GRAY_DARK,
  },
});

export default CompleteChallengeScreen;
