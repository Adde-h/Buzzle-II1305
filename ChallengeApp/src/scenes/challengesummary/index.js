import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Header, Icon } from "react-native-elements";
import { database } from "../../../App";
import { DrawerActions } from "react-navigation-drawer";
import {
  TransparentHeaderView,
  CardBox,
  RedButton,
  YellowButton,
  BottomBox,
  PurpleButton,
} from "_organisms";
import { Colors, Typography } from "_styles";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Stars } from "_atoms";
import * as firebase from "firebase";
import * as Linking from 'expo-linking';

const ChallengeSummaryScreen = (props) => {
  const [challengeName, setChallengeName] = useState("");
  const [challengeDescr, setChallengeDescr] = useState("");
  const [challengeTags, setChallengeTags] = useState("");
  const [challengeLoc, setChallengeLoc] = useState("");
  const [challengeRating, setChallengeRating] = useState("");
  const [challengeEndtime, setChallengeEndtime] = useState("");
  const [challengeCreator, setChallengeCreator] = useState("");
  const [rating, setRating] = useState(1);
  const [nrReviews, setNrReviews] = useState(1);
  const [sumReviews, setSumReviews] = useState(0);
  const [questionId, setQuestionId] = useState(0);
  const [userExist, setUserExist] = useState(false);
  const [nrOfSubchallenges, setNrOfSubchallenges] = useState(0);
  const [disableButton, setDisableButton] = useState(true);
  const [nrofanswers, setNrOfAnswers] = useState(0);
  const [nrOfCorrect, setNrOfCorrect] = useState(0);
  const [lat, setLatitude] = useState(0);
  const [lng, setLongitude] = useState(0);

  const challengeID = props.navigation.getParam("itemId", "No ID"); // Change these to load different challenges

  useEffect(() => {
    const challengeRef = database.collection("Challenges").doc(challengeID);
    console.log("[DBGET challengesummary useEffect]");

    // const questionsRef = challengeRef.collection("Questions").doc(questionID);

    challengeRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          if (doc.data().hasOwnProperty("nrOfQuestions")) {
            setNrOfSubchallenges(doc.data()["nrOfQuestions"]);
          } else {
            setNrOfSubchallenges(doc.data()[0]);
          }
          if (doc.data().hasOwnProperty("name")) {
            setChallengeName(doc.data()["name"]);
          } else {
            setChallengeName(doc.data()["Unnamed Challenge"]);
          }
          if (doc.data().hasOwnProperty("description")) {
            setChallengeDescr(doc.data()["description"]);
          } else {
            setChallengeDescr("This challenge doesn't have a description");
          }
          if (doc.data().hasOwnProperty("address")) {
            setChallengeLoc(doc.data()["address"]);
          } else {
            setChallengeLoc("This challenge can be done anywhere");
          }
          if (doc.data().hasOwnProperty("tags")) {
            setChallengeTags(doc.data()["tags"]);
          } else {
            setChallengeTags("This challenge doesn't have tags set yet");
          }
          if (doc.data().hasOwnProperty("rating")) {
            setChallengeRating(doc.data()["rating"]);
          } else {
            setChallengeRating("This challenge hasn't been rated yet");
          }
          if (doc.data().hasOwnProperty("nrOfReviews")) {
            setNrReviews(doc.data()["nrOfReviews"]);
          } else {
            setNrReviews("This challenge hasn't been rated yet");
          }
          if (doc.data().hasOwnProperty("ratingSum")) {
            setSumReviews(doc.data()["ratingSum"]);
          } else {
            setSumReviews("This challenge hasn't been rated yet");
          }
          if (doc.data().hasOwnProperty("endTime") && doc.data()["endTime"] != "") {
            setChallengeEndtime(
              doc.data()["endTime"].toDate().toDateString() +
                " " +
                doc.data()["endTime"].toDate().toLocaleTimeString()
            );
          } else {
            setChallengeEndtime("This challenge has no end time set");
          }
          if (doc.data().hasOwnProperty("creatorUserId")) {
            setChallengeCreator(doc.data()["creatorUserId"]);
          } else {
            setChallengeCreator("This challenge has no valid creator");
          }
          if (doc.data().hasOwnProperty("nrOfAnswers")) {
            setNrOfAnswers(doc.data()["nrOfAnswers"]);
          } else {
            setNrOfAnswers("0");
            console.log("No field of nrOfAnswers");
          }

          if(doc.data().hasOwnProperty("location"))
          {
            setLatitude(doc.data().location["laticoords"]);
          }
          else
          {
            setLatitude(0);
          }
          if(doc.data().hasOwnProperty("location"))
          {
            setLongitude(doc.data().location["longicoords"]);
          }
          else
          {
            setLongitude(0);
          }

          getRating();
          getQuestionId();
        } else {
          // doc.data() will be undefined in this case
          console.log("Couldn't find your data!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }, []);

  let tagsComponent;
  const generateTags = (tags) => {
    if (tags != undefined && tags.length != 0 && tags != "No-Tags") {
      tagsComponent = tags.map((element) => (
        <View key={element}>
          <CardBox
            paddingBottom={3}
            paddingTop={3}
            paddingRight={20}
            paddingLeft={20}
            width="auto"
            textAlign="center"
            borderRadius={15}
            marginHorizontal={3}
            marginVertical={4}
            backgroundColor={Colors.BACKGROUND_WHITE}
          >
            <Text>{element}</Text>
          </CardBox>
        </View>
      ));
    } else {
      tagsComponent = <Text style={styles.notags}>No tags set</Text>;
    }
    return tagsComponent;
  };








  var user = firebase.auth().currentUser;
  getQuestionId = async () => {
    const query = await database
      .collection("Challenges")
      .doc(challengeID)
      .collection("Questions")
      .orderBy("timeCreated")
      .limit(1)
      .get();

    const snapshot = query.docs[0];
    const data = snapshot.data();
    const questionId = data.id;
    const userName = user.displayName;
    if (nrofanswers == 0) {
      setDisableButton(false);
    } else {
      const getIfAnswered = await database
        .collection("Challenges")
        .doc(challengeID)
        .collection("Questions")
        .doc(questionId)
        .collection("userAnswer")
        .where("userID", "==", userName)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (doc.data()["userID"] == userName) {
              if (doc.data()["isCorrect"]) {
                setNrOfCorrect(nrOfCorrect + 1);
              }
              setUserExist(true);
              setDisableButton(false);
            } else {
              setUserExist(false);
            }
          });
        });
      setDisableButton(false);
    }
  };

  const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
const latLng = `${lat},${lng}`;

const label = 'Custom Label';
const url = Platform.select({
  ios: `${scheme}${label}@${latLng}`,
  android: `${scheme}${latLng}(${label})`
});


 

  getRating = async () => {
    if (nrReviews == 0) {
      let ratingRound = Math.round(sumReviews / 1);
      setRating(ratingRound);
    } else {
      let ratingRound = Math.round(sumReviews / nrReviews);
      setRating(ratingRound);
    }
  };

  return (
    <TransparentHeaderView
      leftOnPress={() => {
        props.navigation.goBack();
      }}
      leftIcon="long-arrow-alt-left"
      title=""
      backgroundColor={Colors.BACKGROUND_WHITE}
      headerBackgroundColor={Colors.DARK_PURPLE}
      barStyle={"light-content"}
      accentColor={"#fff"}
    >
      <View style={styles.container}>
        <Text style={styles.title}>{challengeName}</Text>
        <Text style={styles.description}>{challengeDescr}</Text>
        <Text></Text>
      </View>

      <BottomBox backgroundColor={Colors.WHITE} shadowColor={Colors.BLACK}>
        <View style={styles.mainview}>
          <Text style={styles.smallBlack}>Tags</Text>
          <Text style={styles.tags}>
            <FontAwesomeIcon icon="tags" size={16} />
            {generateTags(challengeTags)}
          </Text>
          <Text style={styles.smallBlack}>Place</Text>
          <Text style={styles.smallDescription} onPress={() => {
              if(challengeLoc == "This challenge can be done anywhere")
              {}
              else{Linking.openURL(url)}
              }}>
            
            <FontAwesomeIcon icon="map-marker-alt" size={16}  /> {challengeLoc}
          </Text>
          <Text style={styles.smallBlack}>Creator</Text>
          <Text style={styles.smallDescription}>
            <FontAwesomeIcon icon="user" size={16} /> {challengeCreator}
          </Text>
          <Text style={styles.smallBlack}>Deadline</Text>

          <Text style={styles.smallDescription}>
            <FontAwesomeIcon icon="clock" size={16} /> {challengeEndtime}
          </Text>
          <Text style={styles.smallBlack}>
            Users have finished this challenge
          </Text>
          <Text style={styles.smallDescription}>{nrofanswers}</Text>
          <Text style={styles.smallBlack}>Rating</Text>
          <Stars rating={rating} />
        </View>
        {userExist ? (
          <PurpleButton
            disabled={disableButton}
            title="VIEW RESULT"
            onPress={() => {
              //const challengeId = addChallenge();
              props.navigation.navigate("Result", {
                challengeID: challengeID,
                userID: user.displayName,
                challengeName: challengeName,
                nrOfQuestions: nrOfSubchallenges,
                nrOfCorrectQuestion: nrOfCorrect,
                boolean: false,
              });
            }}
          />
        ) : (
          <PurpleButton
            disabled={disableButton}
            title="COMPLETE CHALLENGE"
            onPress={() => {
              //const challengeId = addChallenge();
              onPressCompleteChallenge();
            }}
          />
        )}
      </BottomBox>
    </TransparentHeaderView>
  );

  function onPressCompleteChallenge() {
    props.navigation.navigate("Complete", {
      challengeID: challengeID,
      nrOfSubchallenges: nrOfSubchallenges,
      challengeName: challengeName,
      nrOfAnswers: nrofanswers,
    });
  }
};

export default ChallengeSummaryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: Colors.BACKGROUND_WHITE,
  },

  userImage: {
    borderRadius: 60,
    height: 90,
    marginBottom: -30,
    marginTop: -15,
    width: 90,
    top: -45,
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    marginLeft: "20%",
    marginRight: "5%",
  },
  smallBlack: {
    fontFamily: Typography.FONT_FAMILY_BOLD,
    fontSize: Typography.FONT_SIZE_SMALL,
    fontWeight: Typography.FONT_WEIGTH_BOLD,
    textAlign: "left",
  },
  description: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: Typography.FONT_SIZE_SMALL,
    marginLeft: "20%",
    textAlign: "left",
    marginRight: "5%",
    color: Colors.GRAY_DARK,
  },
  smallDescription: {
    color: Colors.GRAY_DARK,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",

    // marginHorizontal: "10%",
  },
  mainview: {
    alignItems: "flex-start",
  },
});
