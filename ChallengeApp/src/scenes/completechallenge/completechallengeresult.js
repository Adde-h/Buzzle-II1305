/**
 * TODO: Add media type field in completechallenge
 * Check media field in answers (doc, not snap)
 */
import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView, Image, } from "react-native";
import { database } from "../../../App";
import { Colors, Typography } from "_styles";
import {
  TransparentHeaderView,
  YellowButton,
  CardBox,
  BottomBox,
} from "_organisms";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { FlatList } from "react-native-gesture-handler";

import { Video } from 'expo-av';

const ResultScreen = (props) => {
  const [resultArray, setResultArray] = useState();
  const [hasUpdated, setHasUpdated] = useState(false);
  const challengeID = props.navigation.getParam("challengeID", "Fail");
  const challengeName = props.navigation.getParam("challengeName", "Fail");
  const nrOfCorrectAnswers = props.navigation.getParam(
    "nrOfCorrectQuestion",
    "Fail"
  );
  const nrOfQuestions = props.navigation.getParam("nrOfQuestions", "Fail");
  const userId = props.navigation.getParam("userID", "0");
  const disableButton = props.navigation.getParam("boolean", true);
  const [NROFCORRECT, SETNROFCORRECT] = useState(0);

  //const containsManual = props.navigation.getParam("containsManual", false);
  const [containsManual, setContainsManual] = useState(false);

  console.log("nrOfCorrectQuestions:", nrOfCorrectAnswers);

  var correctText = [];

  if (NROFCORRECT / nrOfQuestions <= 1 / 3) {
    correctText = {
      text:
        "You Got " + NROFCORRECT + "/" + nrOfQuestions + " Right, Keep Trying!",
      icon: "heart-broken",
    };
  } else if (NROFCORRECT / nrOfQuestions == 1) {
    correctText = {
      text: "You Got ALL of Them Right, Astounding!",
      icon: "crown",
    };
  } else if (NROFCORRECT / nrOfQuestions >= 2 / 3) {
    correctText = {
      text: "You Got " + NROFCORRECT + "/" + nrOfQuestions + " Right, Amazing!",
      icon: "birthday-cake",
    };
  } else {
    correctText = {
      text:
        "You Got " +
        NROFCORRECT +
        "/" +
        nrOfQuestions +
        " Right, Almost There!",
      icon: "glass-cheers",
    };
  }

  if(containsManual) {
    correctText = {
      text: "Please wait for the grading!",
      icon: "clock",
    };
  }

  const fetchData = () => {
    var userAnswer = [];
    var userAnswers = [];
    const questionRef = database
      .collection("Challenges")
      .doc(challengeID)
      .collection("Questions");

    questionRef.orderBy("timeCreated").get().then((questionSnapshot) => {
      questionSnapshot.forEach((snap) => {
        questionRef
          .doc(snap.id)
          .collection("userAnswer")
          .get()
          .then((documentSnapshot) => {
            documentSnapshot.forEach((doc) => {
              if(doc.data()["userID"] == userId){
                userAnswer.push({
                  id: doc.id,
                  userID: doc.data()["userID"],
                  answer: doc.data()["answer"],
                  isCorrect: doc.data()["isCorrect"],
                  question: snap.data()["question"],
                  isCorrectAnswer: snap.data()["answer"],
                  isManuallyCorrected: snap.data()["isManuallyCorrected"],
                  answerType: doc.data()["answerType"],
                });
                if(snap.data()["isManuallyCorrected"]) {
                  setContainsManual(true);
                }
              }
            });
          })
          .then(() => {
            let i=1;
            for (let ans of userAnswer) {
              ans.questionNr = i;
              i++;
            }
            setResultArray(userAnswer);
          })
          .then(() => {
            userAnswers = userAnswer.filter((ans) => {
              return ans.isCorrect == true;
            });
            SETNROFCORRECT(userAnswers.length);
          });
      });
    });
  };

  useEffect(() => {
    fetchData();
    setHasUpdated(true);
  }, []);

  // Why is this here
  useEffect(() => {
    console.log("Thing is done!");
    console.log("resultArray is now: ", resultArray);
  }, [hasUpdated]);

  function correctAnswer(input, isManuallyCorrected) {
    if(isManuallyCorrected) {
      return Colors.ORANGE;
    } else {
      if (input) {
        return Colors.SUCCESS;
      } else {
        return Colors.RED;
      }
    }
  }

  function itemIcon(isCorrect, isManuallyCorrected) {
    if (isManuallyCorrected) {
      return;
    } else {
      if(isCorrect) {
        return (
          <FontAwesomeIcon
            icon="check"
            color={Colors.WHITE}
            size={24}
          />
        );
      } else {
        return (
          <FontAwesomeIcon
            icon="times"
            color={Colors.WHITE}
            size={24}
          />
        );
      }
    }
  }

  function questionHeader(isCorrect, isManuallyCorrected, isCorrectAnswer) {
    if (isManuallyCorrected) {
      return;
    } else {
      if(!isCorrect) {
        return (
          <Text style = {styles.questionText}>Correct Answer: {isCorrectAnswer}</Text>
        );
      }
    }
  }

  function renderAnswer(answer, answerType) {
    console.log("Answer type: ", answerType);
    if(answerType == 1) {
      //Text
      return (
      <Text style={styles.answerText}>{answer}</Text>
      );
    } 
    
    if (answerType == 2) {
      //Image
      return (
      <Image source={{ uri: answer }} style={{ width: "100%", height: 250 }} />
      );
    }

    if (answerType == 3) {
      //Video
      return (
      <Video source={{ uri: answer }} 
                   useNativeControls 
                   isLooping 
                   resizeMode="contain" 
                   style={{ width: "100%", height: 250 }} />
      );
    }
  }

  const Item = ({ answer, isCorrect, question, isCorrectAnswer, isManuallyCorrected, answerType, questionNr }) => (
    <ScrollView>
        <Text style = {styles.questionText}>{questionNr}) {question}</Text>
        {questionHeader(isCorrect, isManuallyCorrected, isCorrectAnswer)}
        <CardBox
          flexDirection = "row"
          justifyContent='space-between'
          backgroundColor={correctAnswer(isCorrect, isManuallyCorrected)}
          marginTop={4}
          marginBottom={15}
          width="80%"
          alignSelf = "center"
        >
          {renderAnswer(answer, answerType)}
          {itemIcon(isCorrect, isManuallyCorrected)}
        </CardBox>
    </ScrollView>
  );

  const renderItem = ({ item }) => (
    <Item
      answer={item.answer}
      isCorrect={item.isCorrect}
      question={item.question}
      isCorrectAnswer = {item.isCorrectAnswer}
      isManuallyCorrected = {item.isManuallyCorrected}
      answerType = {item.answerType}
      questionNr = {item.questionNr}
    />
  );

  return (
    <TransparentHeaderView
      backgroundColor={Colors.WHITE}
      leftOnPress={() => {
        props.navigation.navigate("Summary");
      }}
      leftIcon="long-arrow-alt-left"
    >
      <View alignItems = "flex-start">
      <Text style={styles.titleText}>{challengeName} </Text>
      </View>
      <FlatList
        data={resultArray}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <View justifyContent="flex-end">
        <BottomBox backgroundColor={Colors.DARK_PURPLE}>
          <Text style={styles.correctionText}>{correctText.text}</Text>
          <FontAwesomeIcon
            icon={correctText.icon}
            color={Colors.WHITE}
            size={50}
            marginBottom={10}
          />
          {disableButton ? (
            <YellowButton
              title="END CHALLENGE"
              onPress={() => props.navigation.navigate("Home")} // change so it goes to main
            ></YellowButton>
          ) : (
            console.log()
          )}
        </BottomBox>
      </View>
    </TransparentHeaderView>
  );
};

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
    marginTop: 10,
    marginBottom: 25,
    marginHorizontal: "13%",

  },
  questionText: {
    color: Colors.GRAY_DARK,
    fontFamily: Typography.FONT_FAMILY_BOLD,
    marginHorizontal: "13%",
  },
  answerText: {
    color: Colors.WHITE,
    fontFamily: Typography.FONT_FAMILY_BOLD,
    fontSize: Typography.FONT_SIZE_MEDIUM,
    fontWeight: Typography.FONT_WEIGHT_BOLD,
    marginTop: 10,
    marginBottom: 10,
  },
  correctionText: {
    color: Colors.WHITE,
    fontFamily: Typography.FONT_FAMILY_BOLD,
    fontSize: 24, //osäker om rätt
    fontWeight: Typography.FONT_WEIGHT_BOLD,
    marginBottom: 10,
    marginTop: 10,
    textAlign: "center",
  },
});
export default ResultScreen;
