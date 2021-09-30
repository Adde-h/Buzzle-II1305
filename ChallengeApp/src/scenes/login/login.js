/**
 * Login screen (TEMPLATE)
 */
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
} from "react-native";
//import {Home} from '_scenes';
import { PurpleButton, 
         SingleRowTextInput,
         TransparentHeaderView,
         BottomBox,
         BlackButton,
         WhiteButton } from "_organisms";
import { Typography, Colors } from "_styles";
import { checkLogIn } from "./api";
import * as firebase from "firebase";

const LoginScreen = ({ navigation }) => {
  const [email, changeUname] = useState("");
  const [EmailInputError, setEmailInputError] = useState(null);
  const [EmailInputErrorMessage, setEmailInputErrorMessage] = useState("");

  const [pword, changePword] = useState("");
  const [PwordInputError, setpWordInputError] = useState(null);
  const [PwordInputErrorMessage, setpWordInputErrorMessage] = useState("");

  const [AccountError, setAccountError] = useState(null);
  const [AccountErrorMessage, setAccountErrorMessage] = useState("");

  const checkInput = () => {
    if (pword === "" || pword === null) {
      setpWordInputError("error");
      setpWordInputErrorMessage("Fill in a password please!");
    }
    if (email === "" || email === null) {
      setEmailInputError("error");
      setEmailInputErrorMessage("Fill in a email please!");
    }
  };

  const attemptLogin = () => {
    console.log("Attempting login with: ", email, " and ", pword);
  
    firebase.auth().signInWithEmailAndPassword(email, pword)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      console.log("Signed in as ", user.uid);
      navigation.navigate("Home");
    })
    .catch((error) => {
      setAccountError(error.code);
      setAccountErrorMessage(error.message)
    });
  }

  return (
    <TransparentHeaderView
      title="Login"
      leftIcon="long-arrow-alt-left"
      leftOnPress={() => {
        navigation.goBack();
      }}>
      <View style={styles.box}>
        <View style={styles.innerbox}>

      {AccountError && (
        <Text style={styles.error}>{AccountErrorMessage}</Text>
      )}

      <SingleRowTextInput
        onChangeText={(text) => {
          changeUname(text);
          setEmailInputError(null);
          setAccountError(null);
        }}
        value={email}
        placeholder="Email"
      />
      {EmailInputError && (
        <Text style={styles.error}>{EmailInputErrorMessage}</Text>
      )}

      <SingleRowTextInput
        onChangeText={(text) => {
          changePword(text);
          setpWordInputError(null);
          setAccountError(null);
        }}
        value={pword}
        placeholder="Password"
        secureTextEntry={true}
      />
      {PwordInputError && (
        <Text style={styles.error}>{PwordInputErrorMessage}</Text>
      )}

      <BlackButton
        title="LOGIN"
        onPress={() => {
          checkInput();
          if (!(email === "" || email === null || 
                pword === "" || pword === null)) {
            attemptLogin();
          }
        }}
      />
      <WhiteButton
        title="SIGN UP"
        onPress={() => navigation.navigate("Signup")}
      />

      </View>
      </View>
    </TransparentHeaderView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  error: {
    color: "white",
    textAlign: "left",
    width: "90%",
    marginLeft: 25,
    fontFamily: Typography.FONT_FAMILY_BLACK,
    fontWeight: Typography.FONT_WEIGHT_BLACK,
  },

  box: {
    width: "100%",
    height: "90%",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.RED,
    alignItems: "center",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  innerbox: {
    flex: 1, 
    width: "100%", 
    alignItems: "center", 
    paddingTop: 20,
  },
});
