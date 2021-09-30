import React, { useState, useEffect } from "react";

import { database } from "../../../App";
import * as firebase from "firebase";
import { addQuestion } from "./api";
import {
  ScrollView,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  BackHandler,
} from "react-native";

import {
  TransparentHeaderView,
  YellowButton,
  BottomBox,
  RedButton,
  PopupModalView,
  ShadowButton,
} from "_organisms";
import { Colors, Typography } from "_styles";

let questionID = "";

const Item = ({ title }) => (
  <View style={styles.item}>
    <Text style={styles.title}>  {title}</Text>
  </View>
);

export default function CreateChallengeQuestionScreen({ navigation }) {
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  //const [orderId, setOrderID] = useState(0);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [delQuest, setDelQuest] = useState("");

  const [questionsArr, setQuestionsArr] = useState([]);

  const challengeID = navigation.getParam("challengeID", "fail");

  /* Edit and Delete Questions */
  const [modalVisible, setModalVisible] = useState(false);

  // Handling custom backbutton for Android
  const backAction = () => {
    return true;
  };

  useEffect(() => {
    if (navigation.isFocused()) {
      BackHandler.addEventListener("hardwareBackPress", backAction);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", backAction);
    } else return false;
  }, []);

  useEffect(() => {
    if (navigation.isFocused()) {
      fetchQuestions();
    } else return false;
  }, []);

  const fetchQuestions = () => {
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
          if (!doc.data()["isManuallyCorrected"]){
            newQuestions.push({
              id: doc.data()["id"],
              answer: doc.data()["answer"],
              orderId: doc.data()["orderId"],
              question: doc.data()["question"],
            });
          }
         
        });
        //questionsArr = newQuestions;
        setQuestionsArr(newQuestions);
      });
      
  };

  const [cQuestionInputError, setcQuestionInputError] = useState(null);
  const [cQuestionInputErrorMessage, setcQuestionInputErrorMessage] = useState(
    ""
  );

  const [cAnswerInputError, setcAnswerInputError] = useState(null);
  const [cAnswerInputErrorMessage, setcAnswerInputErrorMessage] = useState("");

  const checkTextInput = () => {
    if (!question.trim()) {
      setcQuestionInputError("error");
      setcQuestionInputErrorMessage(
        "Fill in a Question for the challenge please!"
      );
    }

    if (!answer.trim()) {
      setcAnswerInputError("error");
      setcAnswerInputErrorMessage(
        "Fill in an Answer for the challenge please!"
      );
    }

    if (question.trim() && answer.trim()) {
      // Get current nrOfQuestions in order to get the orderId
      database
        .collection("Challenges")
        .doc(challengeID)
        .get()
        .then((doc) => {
          //setOrderID(doc.data()["nrOfQuestions"]);
          let orderId = doc.data()["nrOfQuestions"];

          //Increment number of questions, then add the question
          database
            .collection("Challenges")
            .doc(challengeID)
            .update({
              nrOfQuestions: firebase.firestore.FieldValue.increment(1),
            })
            .then(() => {
              console.log("Adding question with orderID: ", orderId);

              questionID = addQuestion({
                id: challengeID,
                answer: answer,
                orderId: orderId + 1,
                question: question,
              });

              addThenClear();
              if (questionID) {
                fetchQuestions();
              }
            });
        });
    }
  };

  const addThenClear = () => {
    setQuestion("");
    setAnswer("");
  };

  const deleteQuestion = (item) => {
    console.log("Deleting: ", item);
    database
      .collection("Challenges")
      .doc(challengeID)
      .collection("Questions")
      .doc(item.id)
      .delete();
    fetchQuestions();

    database
      .collection("Challenges")
      .doc(challengeID)
      .get()
      .then((doc) => {
        //setOrderID(doc.data()["nrOfQuestions"]); STILL OrderID not fixed when delete
        let orderId = doc.data()["nrOfQuestions"];

        //Increment number of questions, then add the question
        database
          .collection("Challenges")
          .doc(challengeID)
          .update({
            nrOfQuestions: firebase.firestore.FieldValue.increment(-1),
          });
      });

   
  };

  const renderItem = ({ item }) => {
    if (questionID != "") {
      return (
        <TouchableOpacity
          onPress={() => {
            clickAction(item);
          }}
        >
          <Item title={item.question} />
        </TouchableOpacity>
      );
    }
  };

  const clickAction = (item) => {
    console.log("REMOVE THIS QUESTION: ", item);
    setModalVisible(!modalVisible);
    setDelQuest(item);
  };

  return (
    <TransparentHeaderView
      leftOnPress={() => {
        navigation.goBack(null);
      }}
      leftIcon="long-arrow-alt-left"
      backgroundColor={Colors.BACKGROUND_WHITE}
      title="ADD QUESTION"
      headerBackgroundColor={Colors.DARK_PURPLE}
      barStyle={"light-content"}
      accentColor={"#fff"}
    >
      {/* <Text style={styles.masterText}>Add Questions</Text> */}

      <PopupModalView
        modalVisible={modalVisible}
        onDismiss={() => setModalVisible(!modalVisible)}
      >
        <Text style={styles.textRegular}>Question: {delQuest.question}</Text>

        <Text style={styles.textRegular}>Answer: {delQuest.answer}</Text>

        <ShadowButton
          title="DELETE"
          onPress={() => {
            setModalVisible(!modalVisible);
            deleteQuestion(delQuest);
          }}
        />
      </PopupModalView>

      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.smallFormText}>
            Question<Text style={styles.required}>*</Text>
          </Text>

          <TextInput
            onChangeText={(value) => {
              setQuestion(value);
              setcQuestionInputError(null);
            }}
            value={question}
            style={styles.boxText}
            placeholder="Enter question"
          />
          {cQuestionInputError && (
            <Text style={styles.error}>{cQuestionInputErrorMessage}</Text>
          )}

          <Text style={styles.smallFormText}>
            Answer<Text style={styles.required}>*</Text>
          </Text>

          <TextInput
            onChangeText={(value) => {
              setAnswer(value);
              setcAnswerInputError(null);
            }}
            value={answer}
            style={styles.boxText}
            placeholder="Enter correct answer"
          />
          {cAnswerInputError && (
            <Text style={styles.error}>{cAnswerInputErrorMessage}</Text>
          )}
        </View>

        <Text style={styles.questionList}>Added Questions</Text>
        {/* List all questions added */}

        <FlatList
          data={questionsArr} /* Array with questions */
          renderItem={renderItem} /* Render what to be shown */
          keyExtractor={(item) => item.id}
        />
      </ScrollView>

      <BottomBox backgroundColor={Colors.WHITE} shadowColor={Colors.BLACK}>
        <YellowButton
          title="ADD QUESTION"
          onPress={() => {
            checkTextInput();
            //addThenClear();
          }}
        />
        <RedButton
          title="GO BACK"
          onPress={() => {
            navigation.goBack(null);
          }}
        />
      </BottomBox>
    </TransparentHeaderView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND_WHITE,
    marginTop: 35,
  },

  boxText: {
    fontWeight: Typography.FONT_WEIGHT_REGULAR,
    fontSize: Typography.FONT_SIZE_TINY,

    color: Colors.BLACK,
    fontSize: 15,
    backgroundColor: Colors.WHITE,
    margin: 5,
    width: "90%",
    padding: 15,
    borderRadius: 16,
    height: 50,
    justifyContent: "space-between",
  },

  switchButton: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginLeft: 50,
  },

  button: {
    alignItems: "center",
    padding: 7,
    width: "90%",
    height: 50,
    margin: 5,
    justifyContent: "space-between",
    borderRadius: 16,
  },
  masterText: {
    color: "#000000",
    fontSize: 30,
    marginBottom: 20,
    fontFamily: Typography.FONT_FAMILY_BLACK,
    fontWeight: Typography.FONT_WEIGHT_BLACK,
    textAlign: "center",
  },
  smallFormText: {
    color: "#000000",
    textAlign: "left",
    width: "90%",
    marginLeft: 25,
    fontFamily: Typography.FONT_FAMILY_BLACK,
    fontWeight: Typography.FONT_WEIGHT_BLACK,
  },
  questionList: {
    color: "#000000",
    textAlign: "center",
    width: "90%",
    fontSize: 20,
    marginTop: 25,
    fontFamily: Typography.FONT_FAMILY_BLACK,
    fontWeight: Typography.FONT_WEIGHT_BLACK,
  },
  item: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  textBlack: {
    color: "#000000",
    fontFamily: Typography.FONT_FAMILY_BLACK,
    fontWeight: Typography.FONT_WEIGHT_BLACK,
  },
  textBold: {
    color: "#000000",
    fontFamily: Typography.FONT_FAMILY_BLACK,
    fontWeight: Typography.FONT_WEIGHT_BLACK,
  },

  textRegular: {
    color: "#000000",
    fontFamily: Typography.FONT_FAMILY_BLACK,
    fontWeight: Typography.FONT_WEIGHT_BLACK,
  },
  required: {
    color: "red",
  },
  error: {
    color: "red",
    textAlign: "left",
    width: "90%",
    marginLeft: 25,
    fontFamily: Typography.FONT_FAMILY_BLACK,
    fontWeight: Typography.FONT_WEIGHT_BLACK,
  },
});
