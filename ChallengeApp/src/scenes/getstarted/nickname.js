/**
 * Choose nickname screen (TEMPLATE)
 *
 * Allows the user to choose a nickname or skip
 * and get a random nickname
 */
import React, { useState, useEffect } from "react";
import {
  View,
  AsyncStorage,
  Text,
  StyleSheet,
  BackHandler,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  RedButton,
  YellowButton,
  SingleRowTextInput,
  TransparentHeaderView,
} from "_organisms";
import { setUserNameAndRedirect } from "./api";
import { Typography } from "_styles";

const NickNameScreen = ({ navigation }) => {
  const [nName, changenName] = useState("");
  const [nNameInputError, setnNameInputError] = useState(null);
  const [nNameInputErrorMessage, setnNameInputErrorMessage] = useState("");

  // Handling custom backbutton for Android
  const backAction = () => {
    navigation.navigate("Profile");
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
    <TransparentHeaderView
      title="Signup"
      leftIcon="times"
      leftOnPress={() => {
        navigation.navigate("Profile");
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <SingleRowTextInput
          onChangeText={(text) => {
            changenName(text);
            setnNameInputError(null);
            AsyncStorage.setItem("nName", text);
          }}
          value={nName}
          placeholder="Nickname"
        />

        {nNameInputError && (
          <Text style={styles.error}>{nNameInputErrorMessage}</Text>
        )}

        <YellowButton
          title="Choose"
          onPress={() => {
            if (nName === "" || nName === null) {
              setnNameInputError("error");
              setnNameInputErrorMessage("Fill in a Nickname please!");
            }

            if (!(nName === "" || nName === null)) {
              setUserNameAndRedirect({ navigation, nName });
            }
          }}
        ></YellowButton>

        {/*<PurpleButton
          title="Skip for now"
          onPress={() => {
            setUserNameAndRedirect({ navigation, nName });
          }} //Random username not implemented yet!!
        />*/}

        <RedButton
          title="Randomize"
          onPress={() => {
            changenName(getRandom(nickNames));
          }} //Random username not implemented yet!!
        />
      </View>
    </TransparentHeaderView>
  );
};

const nickNames = [
  "Ghoulie",
  "Amour",
  "Pickles",
  "Matey",
  "Turkey",
  "Teeny",
  "Ms. Congeniality",
  "Bug",
  "Fly",
  "Beauty",
  "Amigo",
  "Goldilocks",
  "Dingo",
  "Miss Piggy",
  "Sugar",
  "Captain",
  "Mini Skirt",
  "Frau Frau",
  "Angel",
  "Bebe",
  "Dear",
  "Romeo",
  "Gams",
  "Sleeping Beauty",
  "Boomer",
  "Mouse",
  "Butterfinger",
  "Dragon",
  "Sassy",
  "Senorita",
  "Chili",
  "Con",
  "Weirdo",
  "Rabbit",
  "Speedy",
  "Boo Boo",
  "Chewbacca",
  "Big Bird",
  "Ami",
  "Cold Brew",
  "Chum",
  "Elf",
  "Starbuck",
  "Daffodil",
  "Honey Pie",
  "DJ",
  "Munchkin",
  "Coach",
  "Honeybun",
  "Salt",
  "Snoopy",
  "Ladybug",
  "Einstein",
  "Dearest",
  "Sweet 'n Sour",
  "Betty Boop",
  "Queenie",
  "Pebbles",
  "Sourdough",
  "Short Shorts",
  "Gizmo",
  "Ace",
  "Big Guy",
  "Beetle",
  "Beautiful",
  "Freckles",
  "Smiley",
  "Smudge",
  "Kitten",
  "Marshmallow",
  "Boo Bear",
  "Turtle",
  "Colonel",
  "Mistress",
  "Tyke",
  "Amor",
  "Butter",
  "Gordo",
  "Friendo",
  "Terminator",
  "Snuggles",
  "Hot Pepper",
  "Sunshine",
  "Pixie Stick",
  "Twinkly",
  "Grease",
  "Chef",
  "Cowboy",
  "Cuddles",
  "Herp Derp",
  "Fatty",
  "Rufio",
  "Scarlet",
  "Hulk",
  "Lefty",
  "Cinnamon",
  "Dummy",
  "Candy",
  "Cheeky",
  "Goonie",
];

function getRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export default NickNameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0ABEFF",
    alignItems: "center",
    /*justifyContent: 'center',*/
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
    color: "#FFFFFF",
    fontSize: 30,
    marginBottom: 20,
  },
  smallFormText: {
    color: "#FFFFFF",
    textAlign: "left",
    width: "90%",
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
  error: {
    color: "red",
    textAlign: "left",
    width: "90%",
    marginLeft: 25,
    fontFamily: Typography.FONT_FAMILY_BLACK,
    fontWeight: Typography.FONT_WEIGHT_BLACK,
  },
});
