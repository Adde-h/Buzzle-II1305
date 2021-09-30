/**
 * Create challenge
 */
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  AsyncStorage,
  BackHandler,
  Alert,
  TextInput
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { updateChallenge } from "./api";
import * as firebase from "firebase";
import { Typography, Colors } from "_styles";
import { ScrollView } from "react-native-gesture-handler";
import { database } from "../../../App";
import {
  TransparentHeaderView,
  YellowButton,
  PurpleButton,
  RedButton,
  SingleRowTextInput,
  MultiRowTextInput,
  PopupModalView,
  ShadowButton,
} from "_organisms";

import { faSortNumericDown } from "@fortawesome/free-solid-svg-icons";

const CreateChallengeScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const [cname, changeCname] = useState("");
  const [cdesc, changeCdesc] = useState("");
  
  //const [nrOfQuestions, setNrOfQuestions] = useState(0);

  const challengeID = navigation.getParam("challengeId", "fail");

  const [cNameInputError, setcNameInputError] = useState(null);
  const [cNameInputErrorMessage, setcNameInputErrorMessage] = useState("");

  const [cDescInputError, setcDescInputError] = useState(null);
  const [cDescInputErrorMessage, setcDescInputErrorMessage] = useState("");

  const [cQuestInputError, setcQuestInputError] = useState(null);
  const [cQuestInputErrorMessage, setcQuestInputErrorMessage] = useState("");

  
  const [date, setDate] = useState("");

  const [showTime, setShowTime] = useState(false);
  const [showDate, setShowDate] = useState(false);

  let questions = false;

  const tags = navigation.getParam("tags", "No-Tags");

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowTime(Platform.OS === "ios");
    setShowDate(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setTimeDate();
    setShowDate(true);
  };

  const showTimepicker = () => {
    setTimeDate();
    setShowTime(true);
  };

  const checkQuestions = () => {
    database
      .collection("Challenges")
      .doc(challengeID)
      .get()
      .then((doc) => {
        let nrOfQuestions = doc.data()["nrOfQuestions"];
        if (nrOfQuestions > 0) {
          questions = true;
          setcQuestInputError(null);
        }
        checkRequired();
        addChallengeFunc();
      });
  };

  const checkRequired = () => {
    if (cname === "" || cname === null) {
      setcNameInputError("error");
      setcNameInputErrorMessage("Fill in a name for the challenge please!");
    }
    if (cdesc === "" || cdesc === null) {
      setcDescInputError("error");
      setcDescInputErrorMessage(
        "Fill in a description for the challenge please!"
      );
    }
   
    if (!questions) {
      setcQuestInputError("error");
      setcQuestInputErrorMessage("Enter questions for this challenge please!");
    }
  };

  const addChallengeFunc = () => {
    if (
      !(
        cdesc === "" ||
        cdesc === null ||
        cname === "" ||
        cname === null ||
        questions == false 
      )
    ) {
      updateChallenge(
        {
          name: cname,
          description: cdesc,
          //nrOfAnswers: nrOfAnswers,
          endTime: date,
          creatorUserId: firebase.auth().currentUser.displayName,
          location: {
            laticoords: laticoords,
            longicoords: longicoords,
          },
          tags: tags,
          // nrOfQuestions: nrOfQuestions,
          address: address,
        },
        challengeID
      );

      navigation.navigate("List");
    }
  };

  const setTimeDate = () => {
    if (date == "" || date == null) setDate(new Date(Date.now()));
  };

  const laticoords = navigation.getParam("latitude", 0);
  const longicoords = navigation.getParam("longitude", 0);
  const address = navigation.getParam("address", "This challenge can be done anywhere");

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

  return (
    <ScrollView>
      <PopupModalView
        modalVisible={modalVisible}
        onDismiss={() => setModalVisible(!modalVisible)}
      >
        <Text style={styles.masterText}>Add task</Text>
        <Text style={styles.smallFormText}>Automatically corrected </Text>
        <ShadowButton
          title="ADD QUESTION"
          onPress={() => {
            setModalVisible(!modalVisible);
            navigation.navigate("Questions", { challengeID: challengeID });
          }}
        />
        <Text style={styles.smallFormText}>Manually corrected </Text>
        <ShadowButton
          title="ADD SUBMISSION"
          onPress={() => {
            setModalVisible(!modalVisible);
            navigation.navigate("Submissions", { challengeID: challengeID });
          }}
        />
      </PopupModalView>
      <TransparentHeaderView
        backgroundColor={Colors.BACKGROUND_WHITE}
        headerBackgroundColor={Colors.DARK_PURPLE}
        barStyle={"light-content"}
        accentColor={"#fff"}
      >
        {/* <ScrollView styles={styles.scrollView}> */}
        <Text style={styles.masterText}>Create A Challenge</Text>
        <StatusBar style="auto" />

        <View style={styles.container}>
          <Text style={styles.smallFormText}>
            Challenge Name<Text style={styles.required}>*</Text>
          </Text>

          <SingleRowTextInput
            onChangeText={(text) => {
              changeCname(text);
              setcNameInputError(null);
              AsyncStorage.setItem("cname", text);
            }}
            value={cname}
            placeholder="Challenge Name"
          />

          {cNameInputError && (
            <Text style={styles.error}>{cNameInputErrorMessage}</Text>
          )}

          <Text style={styles.smallFormText}>
            Description of Challenge<Text style={styles.required}>*</Text>
          </Text>
          <MultiRowTextInput
            onChangeText={(text) => {
              changeCdesc(text);
              setcDescInputError(null);
              AsyncStorage.setItem("cdesc", text);
            }}
            value={cdesc}
            multiline={true}
            placeholder="Challenge Description"
          />

          {cDescInputError && (
            <Text style={styles.error}>{cDescInputErrorMessage}</Text>
          )}

          

          <Text style={styles.smallFormText}>Tags</Text>
          <PurpleButton
            title="ADD TAGS"
            onPress={() => navigation.navigate("Tags")}
          ></PurpleButton>
          <Text style={styles.smallFormText}>Location</Text>
          <PurpleButton
            title="CHOOSE LOCATION"
            onPress={() => navigation.navigate("Maps")}
          ></PurpleButton>
          <Text style={styles.smallFormText}>Choose End Date & End Time</Text>

          <PurpleButton
            title="CHOOSE END DATE"
            onPress={showDatepicker}
          ></PurpleButton>
          <PurpleButton
            title="CHOOSE END TIME"
            onPress={showTimepicker}
          ></PurpleButton>
          <View style={styles.timeText}>
            {showDate && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={"date"}
                is24Hour={true}
                display="default"
                onChange={onChange}
              />
            )}

            {showTime && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={"time"}
                is24Hour={true}
                display="default"
                onChange={onChange}
              />
            )}
          </View>

          <Text style={styles.smallFormText}>
            Questions<Text style={styles.required}>*</Text>
          </Text>
          <PurpleButton
            title="ADD QUESTION"
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
          ></PurpleButton>
          {cQuestInputError && (
            <Text style={styles.error}>{cQuestInputErrorMessage}</Text>
          )}
          <YellowButton
            title="CREATE THE CHALLENGE"
            onPress={() => {
              checkQuestions();
            }}
          ></YellowButton>
          <RedButton
            title="CANCEL"
            style={styles.cancel}
            onPress={() => {
              navigation.goBack();
              database.collection("Challenges").doc(challengeID).delete();
            }}
          ></RedButton>
        </View>
      </TransparentHeaderView>
    </ScrollView>
  );
};

export default CreateChallengeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: StatusBar.currentHeight || 0,
  },
  boxText: {
    color: "#000000",
    fontSize: 15,
    backgroundColor: "#FFFFFF",
    margin: 5,
    width: "90%",
    padding: 5,
  },
  boxTextMulti: {
    color: "#000000",
    fontSize: 15,
    backgroundColor: "#FFFFFF",
    margin: 5,
    width: "90%",
    height: "10%",
    padding: 10,
    textAlignVertical: "top",
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
  buttonStyles: {
    width: "80%",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 7,
    width: "90%",
    margin: 5,
  },
  cancel: {
    alignItems: "center",
    padding: 7,
    width: "90%",
    height: 50,
    margin: 5,
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: Colors.RED,
    marginBottom: 20,
  },
  countContainer: {
    alignItems: "center",
    padding: 10,
  },
  timeText: {
    color: "#FFFFFF",
    marginBottom: 10,
    width: "90%",
  },
  scrollView: {
    marginHorizontal: 0,
    backgroundColor: "red",
  },
  map: {
    width: "100%",
    height: "30%",
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
