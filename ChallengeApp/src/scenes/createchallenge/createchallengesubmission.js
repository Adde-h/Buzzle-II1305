import React, { useState, useEffect } from 'react';

import { database } from "../../../App";
import * as firebase from "firebase";

import {addSubmission, updateChallenge} from './api';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';

import { 
  TransparentHeaderView, 
  YellowButton, 
  BottomBox, 
  RedButton, 
  ErrorRow, 
  RequiredFormDescription, 
  SwitchRow, 
  SingleRowTextInput,
  PopupModalView,
  ShadowButton } from "_organisms";
import { Colors, Typography } from "_styles";
import { ScrollView } from 'react-native-gesture-handler';

let submissionID= "";

const Item = ({ title }) => (
  <View style={styles.item}>
    <Text style={styles.title}>  {title}</Text>
  </View>
);

export default function CreateChallengeSubmissionScreen({navigation}) {
    const [question,setQuestion] = useState("");
    const [submissionArr, setSubmissionArr] = useState([]);
    const [delQuest, setDelQuest] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [typeSub, setTypeSub] = useState("");

    const [nrOfAnswers, setNrOfAnswers] = useState(0);

    const challengeID = navigation.getParam('challengeID', 'fail');

    /**
     * Error message states
     */
    const [cQuestionInputError, setcQuestionInputError] = useState(null);
    const [cQuestionInputErrorMessage, setcQuestionInputErrorMessage] = useState("");

    const [cSwitchesInputError, setcSwitchesInputError] = useState(null);
    const [cSwitchesInputErrorMessage, setcSwitchesInputErrorMessage] = useState("");

    const [cAnsInputError, setcAnsInputError] = useState(null);
    const [cAnsInputErrorMessage, setcAnsInputErrorMessage] = useState("");


    /**
     * Input field states
     */
    const [textEnabled, setTextEnabled] = useState(false);
    const toggleTextSwitch = () => setTextEnabled(previousState => !previousState);

    const [imageEnabled, setImageEnabled] = useState(false);
    const toggleImageSwitch = () => setImageEnabled(previousState => !previousState);


    const [videoEnabled, setVideoEnabled] = useState(false);
    const toggleVideoSwitch = () => setVideoEnabled(previousState => !previousState);

    useEffect(() => {
      if (navigation.isFocused()) {
        fetchSubmission();
      } else return false;
    }, []);
    
    /**
     * Called when clicked on ADD SUBMISSION
     * Checks input and displays error message if the required field
     * is not filled in or no submission types are switched on.
     * Otherwise it adds the submission to the database
     */
    const checkInput = () => {
      if(question === "" || question === null) {
        setcQuestionInputError("error");
        setcQuestionInputErrorMessage(
          "Fill in question please"
        );
      }

      if(!textEnabled && !imageEnabled && !videoEnabled) {
        setcSwitchesInputError("error");
        setcSwitchesInputErrorMessage(
          "Please select at least one submission type"
        );
      }

      if (nrOfAnswers == 0) {
        setcAnsInputError("error");
        setcAnsInputErrorMessage(
          "Fill in number of answers for the challenge please!"
        );
      }

      // Add submission if everything required is filled in
      if(!(question === "" || 
           question === null || nrOfAnswers == 0 ||
           (!textEnabled && !imageEnabled && !videoEnabled))){
            console.log("[Add submission to challenge (", challengeID , ")]: Question: ", question, " Text: ", textEnabled, " Image: ", imageEnabled, " Video: ", videoEnabled);
            console.log("Number of answers: ", nrOfAnswers);

            database
            .collection("Challenges")
            .doc(challengeID)
            .update({
              nrOfAnswers: Number(nrOfAnswers),
            });
            console.log("Number of answers: ", nrOfAnswers);

            
            // Get current nrOfQuestions in order to get the orderId
            database.collection("Challenges").doc(challengeID).get().then((doc) => {
              let orderId = doc.data()["nrOfQuestions"];
              
              //Increment number of questions, then add the question
              database.collection("Challenges").doc(challengeID)
              .update({nrOfQuestions: firebase.firestore.FieldValue.increment(1)})
              .then(() => {
                console.log("Adding question with orderID: ", orderId);
                submissionID = addSubmission({
                  id: challengeID,
                  orderId: orderId,
                  question: question,
                  allowTextAnswer: textEnabled,
                  allowImageAnswer: imageEnabled,
                  allowVideoAnswer: videoEnabled,
                });
                addThenClear();
                if(submissionID){
                  fetchSubmission();
                }
                

              });
      
            });

            //navigation.goBack(null);
          }
        
    }
    const addThenClear = () => {
      setQuestion("");
    };

    

    const fetchSubmission =  () => {
      console.log("[DBGET] COMPLETECHALLENGE useEffect");
      var newSub = [];
      database
        .collection("Challenges")
        .doc(challengeID)
        .collection("Questions")
        .orderBy("timeCreated")
        .get()
        .then((questionSnapshot) => {
          questionSnapshot.forEach((doc) => {
            if (doc.data()["isManuallyCorrected"]){
              newSub.push({
                id: doc.data()["id"],
                orderId: doc.data()["orderId"],
                question: doc.data()["question"],
                allowTextAnswer: doc.data()["allowTextAnswer"],
                allowImageAnswer: doc.data()["allowImageAnswer"],
                allowVideoAnswer: doc.data()["allowVideoAnswer"],
              });
            }
            
          });
          console.log("FetchSubmission: ", newSub);
          //questionsArr = newQuestions;
          setSubmissionArr(newSub);
        });
    };

    const deleteQuestion = (item) => {
      console.log("Deleting: ", item);
      database
        .collection("Challenges")
        .doc(challengeID)
        .collection("Questions")
        .doc(item.id)
        .delete();
      fetchSubmission();
  
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

    const checkSub = (item) =>{
      if(item.allowTextAnswer != false && item.allowImageAnswer != false && item.allowVideoAnswer != false)
        {return( <Text style={styles.textRegular}> Text, Image and Video answers </Text>)}
      else  
        if(item.allowTextAnswer != false && item.allowVideoAnswer != false)
          {return( <Text style={styles.textRegular}> Text and Video answers </Text>)}
        else 
          if(item.allowImageAnswer != false && item.allowVideoAnswer != false)
            {return( <Text style={styles.textRegular}> Image and Video answers </Text>)}
          else 
            if(item.allowTextAnswer != false && item.allowImageAnswer != false)
              {return( <Text style={styles.textRegular}> Text and Image answers </Text>)}
            else 
              if(item.allowTextAnswer != false)
                {return( <Text style={styles.textRegular}> Text answer</Text>)}
              else
                if(item.allowImageAnswer != false)
                  {return( <Text style={styles.textRegular}> Image answer</Text>)}
                else
                  return( <Text style={styles.textRegular}> video answer</Text>)
    }

    const renderItem = ({ item }) => {
      console.log("RenderIDSubmissionID:", submissionID);
      if (submissionID != "") {
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
      title="ADD SUBMISSION"
      headerBackgroundColor={Colors.DARK_PURPLE}
      barStyle={"light-content"}
      accentColor={"#fff"}>

          <PopupModalView
                modalVisible={modalVisible}
                onDismiss={() => setModalVisible(!modalVisible)}
                >
                <Text style={styles.textRegular}>Question: {delQuest.question}</Text>
                <Text style={styles.textRegular}>Submission Type: {checkSub(delQuest)}</Text>
                
                  

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
            <RequiredFormDescription>Question</RequiredFormDescription>
            <SingleRowTextInput  
                onChangeText={(question) => {
                  setQuestion(question);
                  setcQuestionInputError(null);
                }}
                value={question}
                placeholder="Enter question" />
            {cQuestionInputError && (
              <ErrorRow message={cQuestionInputErrorMessage} />
            )}


          <RequiredFormDescription>Number Of Answers</RequiredFormDescription>
          <SingleRowTextInput
            onChangeText={(nrOfAnswers) => {
              setNrOfAnswers(nrOfAnswers);
              setcAnsInputError(null);
   
            }}
            numeric
            keyboardType={"numeric"}
            value={nrOfAnswers}
            placeholder="Nr. Of Answers"
          />

          {cAnsInputError && (
            <ErrorRow message={cAnsInputErrorMessage} />
          )}

          

          <SwitchRow
              title="Accept text submission"
              onValueChange={() => {
                toggleTextSwitch();
                setcSwitchesInputError(null);
              }}
              value={textEnabled}
          />

          <SwitchRow
              title="Accept image submission"
              onValueChange={() => {
                toggleImageSwitch();
                setcSwitchesInputError(null);
              }}
              value={imageEnabled}
          />

          <SwitchRow
              title="Accept video submission"
              onValueChange={() => {
                toggleVideoSwitch();
                setcSwitchesInputError(null);
              }}
              value={videoEnabled}
          />
          {cSwitchesInputError && (
            <ErrorRow message={cSwitchesInputErrorMessage}/>
          )}
          
        </View>
        
          <Text style={styles.questionList}>  Accepted Answers: {nrOfAnswers}</Text>
          <Text style={styles.questionList}>  Added Questions </Text>
          
          {/* List all questions added */}

          <FlatList
            data={submissionArr} /* Array with questions */
            renderItem={renderItem} /* Render what to be shown */
            keyExtractor={(item) => item.id}
          />
      </ScrollView>

        
        <BottomBox backgroundColor={Colors.WHITE} shadowColor={Colors.BLACK} >
            <YellowButton title ="ADD SUBMISSION" onPress={() => {checkInput()}}/>
            <RedButton title = "GO BACK" onPress={() => navigation.goBack(null)}/>
        </BottomBox>
    </TransparentHeaderView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND_WHITE,
    alignItems: 'center',
    paddingTop: 20,
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
  textRegular: {
    color: "#000000",
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
});