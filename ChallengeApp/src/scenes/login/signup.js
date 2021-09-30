/**
 * Sign Up screen (TEMPLATE)
 */
import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import {
  SingleRowTextInput,
  TransparentHeaderView,
  BlackButton,
} from "_organisms";
import { Typography, Colors } from "_styles";
import * as firebase from "firebase";

const SignUpScreen = ({ navigation }) => {
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

  const attemptCreateAccount = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, pword)
      .then((userCredential) => {
        // Succesfully created account
        var user = userCredential.user;
        console.log("User signed up sucessfully, user:", user);
        //navigation.navigate("Nickname");
        navigation.navigate("Tutorial");
      })
      .catch((error) => {
        setAccountError(error.code);
        setAccountErrorMessage(error.message);
      });
  };

  return (
    <TransparentHeaderView
      title="Signup"
      leftIcon="long-arrow-alt-left"
      leftOnPress={() => {
        navigation.goBack();
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={styles.box}>
          <View style={styles.innerbox}>
            {AccountError && (
              <Text style={styles.error}>{AccountErrorMessage}</Text>
            )}

            <SingleRowTextInput
              onChangeText={(text) => {
                changeUname(text);
                setEmailInputError(null);
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
              }}
              value={pword}
              placeholder="Password"
              secureTextEntry={true}
            />

            {PwordInputError && (
              <Text style={styles.error}>{PwordInputErrorMessage}</Text>
            )}

            <BlackButton
              title="SIGN UP"
              onPress={() => {
                checkInput();

                if (
                  !(
                    email === "" ||
                    email === null ||
                    pword === "" ||
                    pword === null
                  )
                ) {
                  attemptCreateAccount();
                }
              }}
            />
          </View>
        </View>
      </View>
    </TransparentHeaderView>
  );
};

export default SignUpScreen;

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
